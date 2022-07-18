/* eslint-disable */
import { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { getBlockchain } from '../magicEthereum';
import '../style.css';
import CountdownTimer from '../components/CountdownTimer';
import { ethers } from 'ethers';
import Navbar from '../components/Navbar';

function Itempage() {
  const itemId = window.location.pathname.split('/').pop();
  const [item, setItem] = useState({});
  const [timer, setTimer] = useState(0);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [auctionInstance, setAuction] = useState(undefined);
  const [form2] = Form.useForm();
  const [baseValue, setBaseValue] = useState(undefined);
  const [highestBid, setHighestBid] = useState(undefined);
  const [tokenInstance, setTokenInstance] = useState(undefined);

  const handleBid = async (value) => {
    const bidInWei = ethers.utils.parseEther(value.bid);
    console.log(Number(bidInWei));
    console.log(value.bid);
    const tx1 = await tokenInstance.approve(auctionInstance.address, value.bid);
    await tx1.wait();
    const tx = await auctionInstance.bid(item.id, bidInWei);
    await tx.wait();
    form2.resetFields();
  };

  const withdrawHandler = async () => {
    const tx = await auctionInstance.withdraw(item.id);
    await tx.wait();
  };

  useEffect(() => {
    const init = async () => {
      const { signerAddress, auction, token } = await getBlockchain();
      console.log(signerAddress);
      setSignerAddress(signerAddress);
      setAuction(auction);
      const item = await auction.getItem(itemId);
      setTokenInstance(token);

      setItem(item);
      const endTime = Number(item.auctionEndTime) * 1000;
      setTimer(endTime);
      setBaseValue(ethers.utils.formatEther(item.baseValue));
      setHighestBid(ethers.utils.formatEther(item.highestBid));
    };
    init();
  }, []);

  return (
    <>
      <Navbar />
      <div className="d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-md-center p-4">
            <CountdownTimer
              targetDate={timer}
              auction={auctionInstance}
              signerAddress={item.beneficiary}
              id={item.id}
            />
          </div>
          <div className="row justify-content-md-center mb-4">
            <Form className="col-md-auto" onFinish={handleBid} form={form2}>
              <Form.Item label="Bid" name="bid">
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Bid
              </Button>
            </Form>
          </div>
          <div className="row justify-content-md-center p-1">
            <div className="col-md-auto">
              <strong>Owner: {item.beneficiary}</strong>
            </div>
            <br />
          </div>
          <div className="row justify-content-md-center p-1">
            <ul>
              <li>Current HighestBidder: {item.highestBidder}</li>
              <li>Current HighestBid: {highestBid}</li>
              <li>Base Value: {baseValue}</li>
            </ul>

            <div>
              <Button onClick={withdrawHandler}>Withdraw</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Itempage;
