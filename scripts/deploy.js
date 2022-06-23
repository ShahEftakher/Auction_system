const hre = require('hardhat');

async function main() {
  const accounts = await hre.ethers.getSigners();
  const Auction = await hre.ethers.getContractFactory('Auction');
  const auction = await Auction.deploy(120, accounts[0].address);

  await auction.deployed();

  console.log('Auction contract address:', auction.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
