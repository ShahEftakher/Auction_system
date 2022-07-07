import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import ShowCounter from './ShowCounter';

const CountdownTimer = ({ targetDate, auction, owner, id }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  async function onFinish() {
    console.log(owner);
    const tx = await auction.auctionEnd(id);
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
