import { Magic } from 'magic-sdk';

export const getMagic = () => {
  const customNodeOptions = {
    rpcUrl: 'http://127.0.0.1:8545/',
    chainId: 31337,
  };
  const magic = new Magic('pk_live_0FAA96C130020C18', {
    network: customNodeOptions,
  });


  return magic;
};
