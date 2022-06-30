import { Card } from 'antd';

const ItemCard = ({ item, classname }) => {
  const { Meta } = Card;
  const image =
    'https://cdn2.downdetector.com/static/uploads/c/300/f8762/val.png';
  return (
    <Card
      className={classname}
      hoverable
      style={{ width: 240 }}
      cover={<img alt="example" src={image} />}
      onClick={() => {
        window.location.href = `/${item.id}`;
      }}
    >
      <Meta title={item.beneficiary} description={Number(item.baseValue)} />
    </Card>
  );
};

export default ItemCard;
