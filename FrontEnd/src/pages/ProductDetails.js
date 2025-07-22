import { Button, Col, notification, Rate, Row } from "antd";
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductById } from "../hooks/useGetProductById";
import { useAddItemToCart } from "../hooks/useAddItemToCart";
import "../styles/ProductDetails.css";
import { AuthContext } from "../components/AuthContext";

function ProductDetails() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [imageLarge, setImageLarge] = useState(null);
  const [size, setSize] = useState(null);
  const { auth, setAuth } = useContext(AuthContext);
  const { data, isLoading, error } = useGetProductById(productId);
  const { addItemToCart, isLoading: isAddingToCart } = useAddItemToCart();

  // Tự động chọn kích thước nhỏ nhất khi dữ liệu sản phẩm được tải
  useEffect(() => {
    if (data?.sizes?.length > 0 && !size) {
      const smallestSize = data.sizes.reduce((min, current) =>
        min.price < current.price ? min : current
      );
      setSize(smallestSize._id);
    }
  }, [data, size]);

  const handleClick = (imageUrl) => {
    setImageLarge(imageUrl);
  };

  const handleSize = (sizeId) => {
    setSize(sizeId);
  };

  const handleAddCart = () => {
    if (!auth?.isAuthenticated) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
      });
      return;
    }

    if (!size) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng chọn kích thước trước khi thêm vào giỏ hàng",
      });
      return;
    }

    addItemToCart({
      productId,
      quantity: 1,
      sizeId: size,
    });
  };

  // Định dạng giá tiền sang VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Kiểm tra xem sản phẩm có đang sale không
  const isOnSale = data?.promotion && data?.promotion.discount > 0;

  // Tìm giá của size đã chọn
  const selectedSize = data?.sizes?.find((s) => s._id === size);

  const currentPrice = selectedSize?.price || data?.minPrice || 0;
  const discountedPrice =
    isOnSale && selectedSize
      ? currentPrice * (1 - data.promotion.discount / 100)
      : currentPrice;

  const h1Style = {
    fontSize: "60px",
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: "12px",
    textTransform: "capitalize",
    letterSpacing: "0.5px",
    lineHeight: "1.3",
    transition: "color 0.3s ease",
  };

  const h2Style = {
    fontSize: "24px",
    fontWeight: "500",
    color: "#7f8c8d",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  if (isLoading) return <div> ....Loading</div>;

  return (
    <Row style={{ marginTop: 48 }}>
      <Col span={10} offset={2}>
        <Row>
          <Col span={3}>
            {data?.images?.length > 0 ? (
              data.images.map((image, index) => (
                <Row
                  key={`${productId}-${index}`}
                  style={{ margin: "0 12px 12px 12px" }}
                >
                  <button
                    className="btn"
                    style={{
                      borderRadius: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick(image.url)}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <img
                        className="imgSmall"
                        style={{ width: 60, height: 60 }}
                        preview={false}
                        src={image.url}
                      />
                    </div>
                  </button>
                </Row>
              ))
            ) : (
              <Row>
                <div>Chưa có hình ảnh</div>
              </Row>
            )}
          </Col>
          <Col span={20}>
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                className="img"
                preview={false}
                style={{
                  width: "100%",
                  minHeight: 400,
                  height: 800,
                  borderRadius: "24px",
                }}
                src={imageLarge || data?.imageURL}
                key={`${productId}`}
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
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontSize: 16,
                    fontWeight: "500",
                    fontFamily: '"Roboto", sans-serif',
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {data.promotion.discount}% OFF
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Col>
      <Col span={10}>
        <Row>
          <h1 style={h1Style}>{data?.name || "Tên Sản Phẩm"}</h1>
        </Row>

        <Row>
          <h2 style={h2Style}>
            Đánh giá:
            <Rate disabled defaultValue={data?.statistics?.rating} />
          </h2>
        </Row>
        <Row>
          <h2 className="price">
            Giá:
            {size && selectedSize ? (
              isOnSale ? (
                <>
                  <span
                    style={{
                      color: "red",
                      fontSize: 32,
                      fontWeight: "bold",
                      marginLeft: 8,
                      marginRight: 8,
                    }}
                  >
                    {formatPrice(discountedPrice)}
                  </span>
                  <span
                    style={{
                      color: "#888",
                      fontSize: 24,
                      textDecoration: "line-through",
                    }}
                  >
                    {formatPrice(currentPrice)}
                  </span>
                </>
              ) : (
                <span
                  style={{
                    color: "red",
                    fontSize: 32,
                    marginLeft: 8,
                  }}
                >
                  {formatPrice(currentPrice)}
                </span>
              )
            ) : (
              <span
                style={{
                  color: "red",
                  fontSize: 32,
                  marginLeft: 8,
                }}
              >
                {data?.minPrice ? formatPrice(data.minPrice) : "Chưa có giá"}
              </span>
            )}
          </h2>
        </Row>
        <Row
          style={{
            display: "flex",
            padding: "12px",
            alignItems: "center",
          }}
        >
          <Col span={3}>
            <h2 style={{ ...h2Style, textAlign: "center" }}>Size:</h2>
          </Col>
          {data?.sizes?.length > 0 ? (
            <>
              {data.sizes.map((sizeItem) => (
                <Col
                  key={sizeItem._id}
                  span={2}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    className={`btn-size ${
                      size === sizeItem._id ? "active" : ""
                    }`}
                    onClick={() => handleSize(sizeItem._id)}
                  >
                    {sizeItem.name}
                  </button>
                </Col>
              ))}
            </>
          ) : (
            <Col>
              <div>Chưa có kích thước</div>
            </Col>
          )}
        </Row>

        <Row style={{ padding: "24px" }}>
          <Button
            className="btn-addCart"
            type="primary"
            htmlType="submit"
            size="large"
            onClick={handleAddCart}
            loading={isAddingToCart}
          >
            {isAddingToCart ? "Đang thêm..." : "ADD TO CART"}
          </Button>
        </Row>
      </Col>
    </Row>
  );
}

export default ProductDetails;
