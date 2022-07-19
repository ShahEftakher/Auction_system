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

    //simple start
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

    //bid with ERC20 token
    function bid(
        uint256 _id,
        uint256 _amount,
        address _tokenAddr
    ) public {
        if (block.timestamp > listings[_id].auctionEndTime) {
            revert("AUC101: Auction has already ended");
        }

        if (_amount <= listings[_id].baseValue) {
            revert("AUC102: Bid cannot be less than b_amount");
        }

        if (_amount <= listings[_id].highestBid) {
            revert("AUC103: These already a higher or equal bid");
        }

        if (_amount != 0) {
            pendingReturns[_id][msg.sender] += _amount;
        }

        uint256 currentAllowance = IToken(_tokenAddr).allowance(
            msg.sender,
            address(this)
        );

        console.log("currentAllowance", currentAllowance);
        console.log("msg.sender in bid fn: %s", msg.sender);

        if (currentAllowance <= 0) {
            IToken(_tokenAddr).approve(address(this), _amount);
            if (listings[_id].highestBid != 0) {
                IToken(_tokenAddr).decreaseAllowance(
                    address(this),
                    listings[_id].highestBid,
                    listings[_id].highestBidder
                );
            }
        } else {
            if (msg.sender == listings[_id].highestBidder) {
                IToken(_tokenAddr).decreaseAllowance(
                    address(this),
                    listings[_id].highestBid,
                    listings[_id].highestBidder
                );

                IToken(_tokenAddr).increaseAllowance(
                    address(this),
                    _amount,
                    msg.sender
                );
            } else {
                IToken(_tokenAddr).increaseAllowance(
                    address(this),
                    _amount,
                    msg.sender
                );
                if (listings[_id].highestBid != 0) {
                    IToken(_tokenAddr).decreaseAllowance(
                        address(this),
                        listings[_id].highestBid,
                        listings[_id].highestBidder
                    );
                }
            }
        }

        listings[_id].highestBidder = msg.sender;
        listings[_id].highestBid = _amount;
        emit HighestBidIncreased(
            listings[_id].highestBidder,
            listings[_id].highestBid
        );
    }

    // payable function to pay the beneficiary
    function auctionEnd(uint256 _id, address _tokenAddr) public {
        if (block.timestamp < listings[_id].auctionEndTime) {
            revert("AUC105: Auction has not ended yet");
        }

        if (listings[_id].ended) {
            revert("AUC106: The function has already been called");
        }

        uint256 transferAmount = listings[_id].highestBid;
        address beneficiary = listings[_id].beneficiary;
        address highestBidder = listings[_id].highestBidder;

        console.log(
            "currentAllowance",
            IToken(_tokenAddr).allowance(highestBidder, address(this))
        );
        console.log("msg.sender in bid fn: %s", msg.sender);

        listings[_id].ended = true;
        emit AuctionEnded(highestBidder, transferAmount);

        IToken(_tokenAddr).transferFrom(
            highestBidder,
            beneficiary,
            transferAmount
        );
    }

    function getListings() public view returns (Listing[] memory) {
        return listings;
    }

    function getItem(uint256 _id) public view returns (Listing memory) {
        return listings[_id];
    }
}

abstract contract IToken {
    function transfer(address _to, uint256 _value)
        public
        virtual
        returns (bool);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public virtual returns (bool);

    function approve(address _spender, uint256 _value)
        public
        virtual
        returns (bool);

    function decreaseAllowance(
        address spender,
        uint256 subtractedValue,
        address highestBidder
    ) public virtual returns (bool);

    function allowance(address owner, address spender)
        public
        view
        virtual
        returns (uint256);

    function increaseAllowance(
        address spender,
        uint256 addedValue,
        address highestBidder
    ) public virtual returns (bool);
}
