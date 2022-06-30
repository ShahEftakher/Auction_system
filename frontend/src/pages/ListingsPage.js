/* eslint-disable */
import { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';
import getBlockchain from '../ethereum';
import { Button, Form, Input, DatePicker, Space } from 'antd';
import { toMiliseonds } from '../utils/toMiliseconds';
import { ethers } from 'ethers';

const Listings = () => {
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [auctionInstance, setAuctionInstance] = useState(undefined);
  const [items, setItems] = useState([]);
  const [time, setTime] = useState(0);
  const [form1] = Form.useForm();

  const onChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    setTime(dateString);
  };

  const onFinish = async (values) => {
    const remaining = Math.ceil((toMiliseonds(time) - Date.now()) / 1000);
    console.log(remaining);
    const tx = await auctionInstance.startAuction(
      remaining,
      ethers.utils.parseEther(values.price)
    );
    await tx.wait();
    form1.resetFields();
    const Listings = await auctionInstance.getListings();
    console.log(Number(Listings[0].baseValue));
    setItems(Listings);
  };

  useEffect(() => {
    window.ethereum.on('accountsChanged', () => {
      setSignerAddress(signerAddress);
      window.location.reload();
    });
    const init = async () => {
      const { signerAddress, auction } = await getBlockchain();
      setSignerAddress(signerAddress);
      setAuctionInstance(auction);
      const Listings = await auction.getListings();
      console.log(Number(Listings[0].baseValue));
      setItems(Listings);
    };
    init();
  }, []);
  return (
    <div>
      <h1>Listings</h1>
      <h3>Create Listing</h3>
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
      <div className="container">
        <div className="row row-cols-auto">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} classname={'col'} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Listings;
