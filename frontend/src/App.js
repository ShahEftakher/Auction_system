import { useEffect, useState } from 'react';
import { Button, Form, Input, DatePicker } from 'antd';
import getBlockchain from './ethereum';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import RenderTime from './Rendertime';
import './style.css';

function App() {
  const [time, setTime] = useState(0);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [auction, setAuction] = useState(undefined);
  const [highestBid, setHighestBid] = useState(undefined);
  const [highestBidder, setHighestBidder] = useState(undefined);
  const [form] = Form.useForm();

  // const onChange = (value, dateString) => {
  //   console.log('Selected Time: ', value);
  //   console.log('Formatted Selected Time: ', dateString);
  // };

  // const onOk = (value) => {
  //   console.log('onOk: ', value);
  // };

  const onFinish = async (values) => {
    // const toMs = values.time * 1000;
    console.log(values.time, values.price);
    // await auction.startAuction(values.time, values.price);
    setTime(values.time);
    form.resetFields();
  };

  const bid = async (value) => {
    await auction.bid(value.price);
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
            <Form className="col-md-auto" onFinish={onFinish} form={form}>
              <Form.Item label="Time" name="time">
                <Input />
              </Form.Item>
              <Form.Item label="Price" name="price">
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>

            <Form className="col-md-auto" onFinish={bid}>
              <Form.Item label="Bid" name="price">
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
