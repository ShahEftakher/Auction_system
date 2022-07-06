/* eslint-disable */
import { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';
import { Button, Form, Input, DatePicker, Space } from 'antd';
import { toMiliseonds } from '../utils/toMiliseconds';
import { ethers } from 'ethers';
import { getBlockchain } from '../magicEthereum';

const Listings = () => {
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [auctionInstance, setAuctionInstance] = useState(undefined);
  const [items, setItems] = useState([]);
  const [time, setTime] = useState(0);
  const [form1] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [provider, setProvider] = useState(undefined);

  const onChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    setTime(dateString);
  };

  const onFinish = async (values) => {
    console.log(time);
    setProcessing(true);
    const remaining = Math.ceil((toMiliseonds(time) - Date.now()) / 1000);
    const tx = await auctionInstance.startAuction(
      remaining,
      ethers.utils.parseEther(values.price)
    );
    await tx.wait();
    form1.resetFields();
    const Listings = await auctionInstance.getListings();
    setItems(Listings);
    setProcessing(false);
  };

  useEffect(() => {
    const init = async () => {
      const { provider, auction, signerAddress } = await getBlockchain();
      console.log(signerAddress);
      setProvider(provider);
      setSignerAddress(signerAddress);
      setAuctionInstance(auction);
      const Listings = await auction.getListings();
      setItems(Listings);
    };
    init();
  }, []);
  return (
    <div>
      <h1>Listings</h1>
      <h3 className="text-center">Create Listing</h3>
      <div className="container">
        <div className="row justify-content-md-center mb-4">
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
            <Button type="primary" htmlType="submit" disabled={processing}>
              {(processing)?"Processing...":"Start Auction"}
            </Button>
          </Form>
        </div>
      </div>
      <div className="container-lg mb-4">
        <div className="row row-cols-auto mb-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Listings;
