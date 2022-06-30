import { Card } from 'antd';
import { ethers } from 'ethers';

const ItemCard = ({ item }) => {
  const { Meta } = Card;
  const image =
    'https://cdn2.downdetector.com/static/uploads/c/300/f8762/val.png';
  return (
    <Card
      className="col mb-2"
      hoverable
      style={{ width: 240 }}
      cover={<img alt="example" src={image} />}
      onClick={() => {
        window.location.href = `/${item.id}`;
      }}
    >
      <Meta
        title={item.beneficiary}
        // eslint-disable-next-line
        description={ethers.utils.formatEther(item.baseValue) + ' ' + 'ETH'}
      />
    </Card>
  );
};

export default ItemCard;
