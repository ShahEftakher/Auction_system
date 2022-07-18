import { Contract, ethers } from 'ethers';
import { getMagic } from './magic';
import Auction from './Auction.json';
import ESDToken from './ESDToken.json';

const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      const magic = getMagic();
      const isLoggedIn = magic.user.isLoggedIn();
      if (isLoggedIn) {
        const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
        const signer = provider.getSigner();
        const signerAddress = await provider.getSigner().getAddress();
        const auction = new Contract(Auction.address, Auction.abi, signer);
        const token = new Contract(ESDToken.address, ESDToken.abi, signer);
        resolve({ auction, signerAddress, token });
      }
    });
  });

export { getBlockchain };
