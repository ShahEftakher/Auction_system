# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
## Auction worklfow

- Get the auction duration from user
- Pass the time in seconds to the contract
- Use an array to keep track of the auctioning item
- To keep track of individual auction item use a <code>struct</code>
``` solidity
    struct Listing {
        uint256 id;
        address payable beneficiary;
        uint256 auctionEndTime;
        uint256 baseValue;
        address highestBidder;
        uint256 highestBid;
        bool ended;
    }
```
- Set auction endtime by adding auction duration with the current block time <code>block.timestamp + _biddingTime</code>
- Use <code>approve</code> function of ERC_20 to bid for an item
- The bid will approve the auction market contract to spend the bid amount on behalf of the bidder
- Bid logic:
  - Initial bid will just approve the transaction
  - Initial bid of new user will approve transaction and decrease allowance for previous highest bidder
  - A counter bid will increase currrent allowance and decrease the current allowance previous highest bidder
  - In step it will update the highest bid and highest bidder
- Auction end function is triggered from front end
- Frontend will send a signed transaction that will end the auction as well as transfer the approved amount to the seller

### Sending signed transaction without metamask
- To sign a transaction without metamask we will need private key of an account
- Using the private key the transaction will be signed and transaction is initiated
``` solidity
    const signer = new ethers.Wallet(
      process.env.REACT_APP_PRIVATE_KEY,
      provider
    );
    const newAuction = new ethers.Contract(
      Auction.address,
      Auction.abi,
      signer
    );
    console.log(owner);
    const tx = await newAuction.auctionEnd(id, tokenAddress);
```