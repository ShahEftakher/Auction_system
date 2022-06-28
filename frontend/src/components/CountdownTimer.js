import React from "react";
import { useCountdown } from "../hooks/useCountdown";
import ShowCounter from "./ShowCounter";
import ExpiredNotice from "./ExpiredNotice";

const CountdownTimer = ({ targetDate, callBack}) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  if (days + hours + minutes + seconds === 0) {
    callBack();
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
