import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import ShowCounter from './ShowCounter';
import ExpiredNotice from './ExpiredNotice';

const CountdownTimer = ({ targetDate, callBack, owner }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  async function onFinish() {
    console.log(owner);
    const tx = await callBack.auctionEnd({ from: owner });
    tx.wait();
    console.log('Auction ended!!!');
  }
  if (days + hours + minutes + seconds === 0) {
    setTimeout(onFinish, 3000);
    return <ExpiredNotice />;
  } else if (days + hours + minutes + seconds < 0) {
    return <ExpiredNotice />;
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
