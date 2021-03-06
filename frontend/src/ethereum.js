import Auction from './Auction.json';
import { Contract, ethers } from 'ethers';

const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();
        console.log(signerAddress);
        const auction = new Contract(Auction.address, Auction.abi, signer);
        resolve({ signerAddress, auction });
      }
    });
  });

export default getBlockchain;
