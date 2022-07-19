/* eslint-disable */
import { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import getBlockchain from '../ethereum';
import '../style.css';
import CountdownTimer from '../components/CountdownTimer';
import { ethers } from 'ethers';
import Token from '../Token.json';

function Itempage() {
  const itemId = window.location.pathname.split('/').pop();
  const [item, setItem] = useState({});
  const [timer, setTimer] = useState(0);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [auctionInstance, setAuction] = useState(undefined);
  const [form2] = Form.useForm();
  const [tokenAddress, setTokenAddress] = useState(undefined);
  const [highestBid, setHighestBid] = useState(0);
  const [baseValue, setBaseValue] = useState(0);
  const [provider, setProvider] = useState(undefined);

  const handleBid = async (value) => {
    console.log(value.bid);
    const tx = await auctionInstance.bid(
      item.id,
      ethers.utils.parseEther(value.bid),
      tokenAddress
    );
    await tx.wait();
    form2.resetFields();
  };

  const withdrawHandler = async () => {
    const tx = await auctionInstance.withdraw(item.id);
    await tx.wait();
  };

  useEffect(() => {
    window.ethereum.on('accountsChanged', () => {
      setSignerAddress(signerAddress);
      window.location.reload();
    });
    window.ethereum.on('chainChanged', () => {
      setSignerAddress(signerAddress);
      window.location.reload();
    });

    setTokenAddress(Token.address);

    const init = async () => {
      const { signerAddress, auction, provider } = await getBlockchain();
      setSignerAddress(signerAddress);
      setAuction(auction);
      const item = await auction.getItem(itemId);
      setItem(item);
      setBaseValue(ethers.utils.formatEther(item.baseValue.toString()));
      setHighestBid(ethers.utils.formatEther(item.highestBid.toString()));
      const endTime = Number(item.auctionEndTime) * 1000;
      setTimer(endTime);
      setProvider(provider);
    };
    init();
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-md-center p-4">
          <CountdownTimer
            targetDate={timer}
            auction={auctionInstance}
            signerAddress={item.beneficiary}
            id={item.id}
            provider={provider}
            tokenAddress={tokenAddress}
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
            <li>Current HighestBid: {highestBid} ETH</li>
            <li>Base Value: {baseValue} ETH</li>
          </ul>

          <div>
            <Button onClick={withdrawHandler}>Withdraw</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Itempage;
