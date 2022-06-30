import { Button, Form, Input, DatePicker, Space } from 'antd';

const temp = () => {
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

    const endTime = await auctionInstance.auctionEndTime();
    console.log('Auction End time(ms): ' + endTime * 1000);
    setTimer(endTime * 1000);
    form1.resetFields();
  };

  return (
    <div>
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
    </div>
  );
};

export default temp;
