import { useEffect, useState } from 'react';
import { Button, Form, Input, DatePicker, Space } from 'antd';
import getBlockchain from './ethereum';
import './style.css';
import CountdownTimer from './components/CountdownTimer';
import { toMiliseonds } from './utils/toMiliseconds';
import { toSeconds } from './utils/toSecods';

function App() {
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [auction, setAuction] = useState(undefined);
  const [highestBid, setHighestBid] = useState(undefined);
  const [highestBidder, setHighestBidder] = useState(undefined);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  const onChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    setTime(dateString);
  };

  const onFinish = async (values) => {
    console.log(values.price, values);
    console.log(toSeconds(time));
    await auction.startAuction(toSeconds(time), values.price);
    setTimer(toMiliseonds(time));
    form1.resetFields();
  };

  const bid = async (value) => {
    await auction.bid(value.price);
    form2.resetFields();
  };

  useEffect(() => {
    const init = async () => {
      const { signerAddress, auction } = await getBlockchain();
      setSignerAddress(signerAddress);
      setAuction(auction);

      const HighestBid = await auction.highestBid();
      const HighestBidder = await auction.highestBidder();
      setHighestBid(HighestBid);
      setHighestBidder(HighestBidder);
    };
    init();
  }, []);

  return (
    <div>
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
              <Form.Item label="Bid" name="price">
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>

            <CountdownTimer targetDate={timer} />

            <div>
              Current HighestBidder: {highestBidder}
              <br />
              Current HighestBid: {highestBid}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
