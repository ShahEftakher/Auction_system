const Renderer = ({ hours, minutes, seconds, completed, api }) => {
    const startTimer = () => {
      api.start();
    };
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
          {/* <Button onClick={api.start}>Start</Button> */}
        </>
      );
    }
  };