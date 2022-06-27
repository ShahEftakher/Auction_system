//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Auction {
    address payable public beneficiary;
    uint256 public auctionEndTime;
    uint256 public baseValue;

    address public highestBidder;
    uint256 public highestBid;

    mapping(address => uint256) public pendingReturns;

    bool ended;

    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    // constructor(uint256 _biddingTime, address _beneficiary) {
    //     beneficiary = payable(_beneficiary);
    //     auctionEndTime = block.timestamp + _biddingTime;
    // }

    function startAuction(uint256 _biddingTime, uint256 _baseValue) public {
        beneficiary = payable(msg.sender);
        auctionEndTime = block.timestamp + _biddingTime;
        baseValue = _baseValue;
        ended = false;
    }

    function bid() public payable {
        if (block.timestamp > auctionEndTime) {
            revert("AUC101: Auction has already ended");
        }

        if(msg.value <= baseValue){
            revert("AUC106: Bid cannot be less than base value");
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
        if(!ended){
            revert("AUC105: Auction haven't ended yet");
        }
        uint256 amount = pendingReturns[msg.sender];

        //to prevent the highest bidder from withdrawing bidded money
        if(msg.sender == highestBidder){
            amount = amount - highestBid;
        }

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
