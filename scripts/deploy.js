const hre = require('hardhat');
const fs = require('fs');

async function main() {
  const Auction = await hre.ethers.getContractFactory('Auction');
  const auction = await Auction.deploy();

  await auction.deployed();

  console.log('Auction contract address:', auction.address);

  const data = {
    address: auction.address,
    abi: JSON.parse(auction.interface.format('json')),
  };

  fs.writeFileSync('./frontend/src/Auction.json', JSON.stringify(data));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
