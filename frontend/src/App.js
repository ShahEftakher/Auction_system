import { useState } from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import { Button, Form, Input } from 'antd';

const Renderer = ({ hours, minutes, seconds, completed, api }) => {
  if (completed) {
    // Render a completed state
    return <div>Time up!</div>;
  } else {
    // Render a countdown
    return (
      <>
        <span>
          {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
        <Button onClick={api.start}>Start</Button>
      </>
    );
  }
};

function App() {
  const [time, setTime] = useState(0);
  const onFinish = (values) => {
    const toMs = values.time * 1000;
    setTime(toMs);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-center">
        <Countdown
          date={Date.now() + time}
          autoStart={false}
          renderer={Renderer}
          onComplete={() => console.log('Time up!')}
        />
        <Form className="h-25" onFinish={onFinish}>
          <Form.Item label="Time" name="time">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
