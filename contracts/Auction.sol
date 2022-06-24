//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Auction {
    address payable public beneficiary;
    uint256 public auctionEndTime;

    address public highestBidder;
    uint256 public highestBid;

    mapping(address => uint256) public pendingReturns;

    bool ended = false;

    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    constructor(uint256 _biddingTime, address _beneficiary) {
        beneficiary = payable(_beneficiary);
        auctionEndTime = block.timestamp + _biddingTime;
    }

    function bid() public payable {
        if (block.timestamp > auctionEndTime) {
            revert("AUC101: Auction has already ended");
        }

        if (msg.value <= highestBid) {
            revert("AUC102: These already a higher or equal bid");
        }

        //Flaw is that all the amount will be stored in here
        if (msg.value != 0) {
            pendingReturns[msg.sender] += msg.value;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
        emit HighestBidIncreased(highestBidder, highestBid);
    }

    //can withdraw any time
    // bug
    function withdraw() public returns (bool) {
        uint256 amount = pendingReturns[msg.sender];
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    function auctionEnd() public {
        if(block.timestamp < auctionEndTime){
            revert("AUC103: Auction has not ended yet");
        }

        if(ended){
            revert("AUC104: The function has already been called");
        }

        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        beneficiary.transfer(highestBid);
    }
}
