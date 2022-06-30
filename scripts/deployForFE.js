const hre = require('hardhat');
const fs = require('fs');

async function main() {
  const accounts = await hre.ethers.getSigners();
  const Auction = await hre.ethers.getContractFactory('Auction');
  const auction = await Auction.deploy();

  await auction.deployed();

  console.log('Auction contract address:', auction.address);

  const data = {
    address: auction.address,
    abi: JSON.parse(auction.interface.format('json')),
  };

  fs.writeFileSync('./frontend/src/Auction.json', JSON.stringify(data));

  await auction.startAuction(100, ethers.utils.parseEther('0.2'));
  await auction
    .connect(accounts[1])
    .startAuction(100, ethers.utils.parseEther('0.5'));
  await auction
    .connect(accounts[2])
    .startAuction(100, ethers.utils.parseEther('0.3'));
  await auction
    .connect(accounts[3])
    .startAuction(100, ethers.utils.parseEther('0.22'));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
