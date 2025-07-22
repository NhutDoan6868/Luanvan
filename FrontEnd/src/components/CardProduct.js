import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { useNavigate } from "react-router-dom";

import "../styles/CardProduct.css";

function CardProduct({ Product }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate("/" + path);
  };
  const onCardClick = () => {
    handleNavigate(`details/${Product._id}`);
  };

  // Định dạng giá tiền sang VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Kiểm tra xem sản phẩm có đang sale không
  const isOnSale = Product?.promotion && Product?.promotion.discount > 0;

  return (
    <Card
      hoverable
      cover={
        <div style={{ position: "relative", padding: "0", overflow: "hidden" }}>
          <img
            className="img"
            alt={Product?.name}
            src={Product?.imageURL || "logo.png"}
            style={{
              width: "100%",
              height: 450,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              objectFit: "cover",
              overflow: "hidden",
            }}
          />
          {isOnSale && (
            <div
              className="sale-badge"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#ff4d4f",
                color: "white",
                padding: "4px 8px",
                borderRadius: 4,
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              {Product.promotion.discount}% OFF
            </div>
          )}
        </div>
      }
      onClick={onCardClick}
      style={{ margin: 5, height: 550 }}
    >
      <Meta
        title={Product?.name}
        description={
          <div>
            {isOnSale ? (
              <>
                <span
                  style={{
                    color: "black",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginRight: 8,
                  }}
                >
                  {formatPrice(Product.promotion.discountedPrice)}
                </span>
                <span
                  style={{
                    color: "#888",
                    fontSize: 14,
                    textDecoration: "line-through",
                  }}
                >
                  {formatPrice(Product.minPrice)}
                </span>
              </>
            ) : (
              <span
                style={{
                  color: "black",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginRight: 8,
                }}
              >
                {formatPrice(Product?.minPrice)}
              </span>
            )}
          </div>
        }
        style={{ minHeight: 50 }}
      />
    </Card>
  );
}

export default CardProduct;
