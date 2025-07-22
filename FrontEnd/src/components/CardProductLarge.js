import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { useNavigate } from "react-router-dom";
import "../styles/CardProduct.css";

function CardProductLarge({ _id, name, imageURL, price }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate("/" + path);
  };
  const onCardClick = () => {
    handleNavigate(`details/${_id}`);
  };

  return (
    <Card
      hoverable
      cover={
        <div style={{ padding: "0", overflow: "hidden" }}>
          <img
            className="img"
            alt={name}
            src={imageURL || "logo.png"}
            style={{
              width: "100%",
              height: 450,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              objectFit: "cover",
              overflow: "hidden",
            }}
          />
        </div>
      }
      onClick={onCardClick}
      style={{ margin: 5, height: 550 }}
    >
      <Meta
        title={name}
        description={`Giá: ${price} VNĐ`}
        style={{ minHeight: 50, color: "black", fontSize: 16 }}
      />
    </Card>
  );
}

export default CardProductLarge;
