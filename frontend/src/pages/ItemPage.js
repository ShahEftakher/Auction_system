/* eslint-disable */
import { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import getBlockchain from '../ethereum';
import '../style.css';
import CountdownTimer from '../components/CountdownTimer';
import { ethers } from 'ethers';

function Itempage() {
  const itemId = window.location.pathname.split('/').pop();
  const [item, setItem] = useState({});
  const [timer, setTimer] = useState(0);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [auctionInstance, setAuction] = useState(undefined);
  const [form2] = Form.useForm();

  const handleBid = async (value) => {
    console.log(value.bid);
    const tx = await auctionInstance.bid(item.id, {
      value: ethers.utils.parseEther(value.bid),
    });
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

    const init = async () => {
      const { signerAddress, auction } = await getBlockchain();
      setSignerAddress(signerAddress);
      setAuction(auction);
      const item = await auction.getItem(itemId);

      setItem(item);
      const endTime = Number(item.auctionEndTime) * 1000;
      setTimer(endTime);
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
          />
        </div>
        <Form className="col-md-auto" onFinish={handleBid} form={form2}>
          <Form.Item label="Bid" name="bid">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Bid
          </Button>
        </Form>
        <div className="row justify-content-md-center p-1">
          <div className="col-md-auto">
            <strong>Owner: {item.beneficiary}</strong>
          </div>
          <br />
        </div>
        <div className="row justify-content-md-center p-1">
          {/* <div className="col-md-auto">
            <h2 className="text-center">Signer info</h2>
            <p>Signer: </p>
            <p>Signer bid: </p>
          </div>
          <br /> */}
          <ul>
            <li>Current HighestBidder: {item.highestBidder}</li>
            <li>Current HighestBid: {Number(item.highestBid)}</li>
            <li>Base Value: {Number(item.baseValue)}</li>
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
