//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Auction {
    mapping(uint256 => address payable) public beneficiaries;
    mapping(uint256 => uint256) public auctionEndTimes;
    mapping(uint256 => uint256) public baseValues;

    mapping(uint256 => address) public highestBidders;
    mapping(uint256 => uint256) public highestBids;

    mapping(uint256 => mapping(address => uint256)) public pendingBidderReturns;

    bool ended;
    mapping(uint256 => bool) public auctionEnded;

    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);
    event AuctionStarted(uint256 startTime);
    event BeneficiaryPaid(address beneficiary, uint256 amount);

    function startAuction(
        uint256 _biddingTime,
        uint256 _baseValue,
        uint256 _id
    ) public {
        beneficiaries[_id] = payable(msg.sender);
        auctionEndTimes[_id] = _biddingTime;
        baseValues[_id] = _baseValue;
        auctionEnded[_id] = false;
        highestBids[_id] = 0;
        highestBidders[_id] = address(0);

        emit AuctionStarted(auctionEndTimes[_id]);
    }

    function bid(uint256 _id) public payable {
        if (block.timestamp > auctionEndTimes[_id]) {
            revert("AUC101: Auction has already ended");
        }

        if (msg.value <= baseValues[_id]) {
            revert("AUC106: Bid cannot be less than base value");
        }

        if (msg.value <= highestBids[_id]) {
            revert("AUC102: These already a higher or equal bid");
        }

        //Flaw is that all the amount will be stored in here
        if (msg.value != 0) {
            pendingBidderReturns[_id][msg.sender] += msg.value;
        }

        highestBidders[_id] = msg.sender;
        highestBids[_id] = msg.value;
        emit HighestBidIncreased(highestBidders[_id], highestBids[_id]);
    }

    //can withdraw any time
    // bug
    function withdraw(uint _id) public returns (bool) {
        if (!auctionEnded[_id]) {
            revert("AUC105: Auction haven't ended yet");
        }
        uint256 amount = pendingBidderReturns[_id][msg.sender];
        console.log(amount);

        //to prevent the highest bidder from withdrawing bidded money
        if (msg.sender == highestBidders[_id]) {
            amount = amount - highestBids[_id];
        }

        if (amount == 0) {
            revert("AUC107: You have no pending returns");
        }

        if (amount > 0) {
            pendingBidderReturns[_id][msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                pendingBidderReturns[_id][msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    function auctionEnd(uint256 _id) public {
        if (block.timestamp < auctionEndTimes[_id]) {
            revert("AUC103: Auction has not ended yet");
        }

        if (auctionEnded[_id]) {
            revert("AUC104: The function has already been called");
        }

        auctionEnded[_id] = true;
        emit AuctionEnded(highestBidders[_id], highestBids[_id]);

        if (beneficiaries[_id].send(highestBids[_id])) {
            emit BeneficiaryPaid(beneficiaries[_id], highestBids[_id]);
        } else {
            pendingBidderReturns[_id][beneficiaries[_id]] += highestBids[_id];
        }
    }
}
