/* eslint-disable */
import { useEffect, useState } from 'react';
import { Button, Form, Input, DatePicker, Space } from 'antd';
import getBlockchain from './ethereum';
import './style.css';
import CountdownTimer from './components/CountdownTimer';
import { toMiliseonds } from './utils/toMiliseconds';
import { ethers } from 'ethers';

function App() {
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [auction, setAuction] = useState(undefined);
  const [highestBid, setHighestBid] = useState(undefined);
  const [highestBidder, setHighestBidder] = useState(undefined);
  const [baseValue, setBaseValue] = useState(undefined);
  const [owner, setOwner] = useState(undefined);
  const [signerBid, setSignerBid] = useState(undefined);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  const onChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    setTime(dateString);
  };

  const onFinish = async (values) => {
    const remaining = Math.ceil((toMiliseonds(time) - Date.now()) / 1000);
    console.log(remaining);
    const tx = await auction.startAuction(
      remaining,
      ethers.utils.parseEther(values.price)
    );
    await tx.wait();

    const endTime = await auction.auctionEndTime();
    console.log('Auction End time(ms): ' + endTime * 1000);
    setTimer(endTime * 1000);
    form1.resetFields();
  };

  const bid = async (value) => {
    console.log(value.bid);
    const tx = await auction.bid({ value: ethers.utils.parseEther(value.bid) });
    await tx.wait();
    form2.resetFields();
  };

  const withdrawHandler = async () => {
    const tx = await auction.withdraw();
    await tx.wait();
  };

  useEffect(() => {
    window.ethereum.on('accountsChanged', () => {
      setSignerAddress(signerAddress);
      window.location.reload();
    });
    const init = async () => {
      const { signerAddress, auction } = await getBlockchain();
      setSignerAddress(signerAddress);
      setAuction(auction);

      const HighestBid = await auction.highestBid();
      const HighestBidder = await auction.highestBidder();
      const BaseValue = await auction.baseValue();
      const endTime = await auction.auctionEndTime();
      const Owner = await auction.beneficiary();
      const SignerBid = await auction.pendingReturns(signerAddress);

      setHighestBid(Number(HighestBid));
      setHighestBidder(HighestBidder);
      setBaseValue(Number(BaseValue));
      setSignerBid(Number(SignerBid));
      setOwner(Owner);
      setTimer(endTime * 1000);
    };
    init();
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-md-center p-4">
          <Form className="col-md-auto" onFinish={onFinish} form={form1}>
            <Form.Item label="Time" name="time">
              <Space direction="vertical" size={12}>
                <DatePicker
                  showTime={true}
                  format={'MM-DD-YYYY HH:mm:ss'}
                  onChange={onChange}
                />
              </Space>
            </Form.Item>
            <Form.Item label="Price" name="price">
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>

          <Form className="col-md-auto" onFinish={bid} form={form2}>
            <Form.Item label="Bid" name="bid">
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>

          <CountdownTimer
            targetDate={timer}
            callBack={auction}
            signerAddress={owner}
          />
        </div>
        <div className="row justify-content-md-center p-1">
          <div className="col-md-auto">
            <strong>Owner: {owner}</strong>
          </div>
          <br />
        </div>
        <div className="row justify-content-md-center p-1">
          <div className="col-md-auto">
            <h2 className="text-center">Signer info</h2>
            <p>Signer: {signerAddress}</p>
            <p>Signer bid: {signerBid}</p>
          </div>
          <br />
          <ul>
            <li>Current HighestBidder: {highestBidder}</li>
            <li>Current HighestBid: {highestBid}</li>
            <li>Base Value: {baseValue}</li>
          </ul>

          <div>
            <Button onClick={withdrawHandler}>Withdraw Bid</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
