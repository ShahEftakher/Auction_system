//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Auction {
    struct Listing {
        uint256 id;
        address payable beneficiary;
        uint256 auctionEndTime;
        uint256 baseValue;
        address highestBidder;
        uint256 highestBid;
        bool ended;
    }

    Listing[] public listings;
    mapping(uint256 => mapping(address => uint256)) public pendingReturns;

    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);
    event AuctionStarted(uint256 startTime);
    event BeneficiaryPaid(address beneficiary, uint256 amount);

    function startAuction(uint256 _biddingTime, uint256 _baseValue) public {
        uint256 _id = listings.length;
        listings.push(
            Listing(
                _id,
                payable(msg.sender),
                block.timestamp + _biddingTime,
                _baseValue,
                address(0),
                0,
                false
            )
        );
        emit AuctionStarted(listings[_id].auctionEndTime);
    }

    function bid(uint256 _id) public payable {
        console.log("CAlled");
        if (block.timestamp > listings[_id].auctionEndTime) {
            revert("AUC101: Auction has already ended");
        }
        console.log(listings[_id].baseValue);

        if (msg.value <= listings[_id].baseValue) {
            revert("AUC106: Bid cannot be less than base value");
        }

        if (msg.value <= listings[_id].highestBid) {
            revert("AUC102: These already a higher or equal bid");
        }

        //Flaw is that all the amount will be stored in here
        if (msg.value != 0) {
            pendingReturns[_id][msg.sender] += msg.value;
        }

        listings[_id].highestBidder = msg.sender;
        listings[_id].highestBid = msg.value;
        emit HighestBidIncreased(
            listings[_id].highestBidder,
            listings[_id].highestBid
        );
    }

    function auctionEnd(uint256 _id) public {
        if (block.timestamp < listings[_id].auctionEndTime) {
            revert("AUC103: Auction has not ended yet");
        }

        if (listings[_id].ended) {
            revert("AUC104: The function has already been called");
        }

        listings[_id].ended = true;
        emit AuctionEnded(
            listings[_id].highestBidder,
            listings[_id].highestBid
        );
        uint256 transferAmount = listings[_id].highestBid;
        address payable beneficiary = listings[_id].beneficiary;

        if (beneficiary.send(transferAmount)) {
            emit BeneficiaryPaid(beneficiary, transferAmount);
        } else {
            pendingReturns[_id][beneficiary] += transferAmount;
        }
    }

    function withdraw(uint256 _id) public returns (bool) {
        if (!listings[_id].ended) {
            revert("AUC105: Auction haven't ended yet");
        }
        uint256 amount = pendingReturns[_id][msg.sender];
        console.log(amount);
        uint256 highestBid = listings[_id].highestBid;
        address highestBidder = listings[_id].highestBidder;

        //to prevent the highest bidder from withdrawing bidded money
        if (msg.sender == highestBidder) {
            amount = amount - highestBid;
        }

        if (amount == 0) {
            revert("AUC107: You have no pending returns");
        }

        if (amount > 0) {
            pendingReturns[_id][msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                pendingReturns[_id][msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    function getListings() public view returns (Listing[] memory) {
        return listings;
    }

    function getItem(uint256 _id) public view returns (Listing memory) {
        return listings[_id];
    }
}
