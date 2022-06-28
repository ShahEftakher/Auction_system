import { Button } from 'antd';

const ExpiredNotice = ({auction}) => {
  const handleEnd = async () => {
    await auction.auctionEnd();
  };
  return (
    <div className="expired-notice">
      <span>Auction ended!!!</span>
      <p>Please select a future date and time.</p>
      <Button onClick={handleEnd}>End Auction</Button>
    </div>
  );
};

export default ExpiredNotice;
