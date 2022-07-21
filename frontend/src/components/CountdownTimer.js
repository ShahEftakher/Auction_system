import { ethers } from 'ethers';
import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import ShowCounter from './ShowCounter';
import Auction from '../Auction.json';

const CountdownTimer = ({
  targetDate,
  owner,
  id,
  provider,
  tokenAddress,
}) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  async function onFinish() {
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
    tx.wait();
    console.log('Auction ended!!!');
  }
  if (days + hours + minutes + seconds === 0) {
    setTimeout(onFinish, 3000);
    <ShowCounter days={0} hours={0} minutes={0} seconds={0} />;
  } else if (days + hours + minutes + seconds < 0) {
    return <ShowCounter days={0} hours={0} minutes={0} seconds={0} />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;
