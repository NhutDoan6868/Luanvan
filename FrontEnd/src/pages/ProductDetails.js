import { Button, Col, notification, Rate, Row } from "antd";
import { useContext, useState } from "react";
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
  console.log("check auth", auth);
  const { data, isLoading, error } = useGetProductById(productId);
  const { addItemToCart, isLoading: isAddingToCart } = useAddItemToCart();

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
            <div style={{ overflow: "hidden" }}>
              <img
                className="img"
                preview={false}
                style={{
                  width: "100%",
                  minHeight: 400,
                  height: 800,
                  borderRadius: "24px",
                }}
                src={data?.imageURL || imageLarge}
                key={`${productId}`}
              />
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
            {data?.minPrice
              ? ` ${data.minPrice.toLocaleString()} VNĐ`
              : "Chưa có giá"}
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
              <Col
                span={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button
                  className={`btn-size ${
                    size === data.sizes[0]?._id ? "active" : ""
                  }`}
                  onClick={() => handleSize(data.sizes[0]?._id)}
                >
                  Nhỏ
                </button>
              </Col>
              <Col
                span={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button
                  className={`btn-size ${
                    size === data.sizes[1]?._id ? "active" : ""
                  }`}
                  onClick={() => handleSize(data.sizes[1]?._id)}
                >
                  Vừa
                </button>
              </Col>
              <Col
                span={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button
                  className={`btn-size ${
                    size === data.sizes[2]?._id ? "active" : ""
                  }`}
                  onClick={() => handleSize(data.sizes[2]?._id)}
                >
                  Lớn
                </button>
              </Col>
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
