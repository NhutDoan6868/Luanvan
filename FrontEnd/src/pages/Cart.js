import { Col, Row, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import { useGetCartByUser } from "../hooks/useGetCartByUser";
import CartItemCustomize from "../components/CartItemCustomize";
import { useState } from "react";

function Cart() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetCartByUser();
  const [selectedItems, setSelectedItems] = useState([]);

  console.log("check cart", data);

  const handleNavigate = (path) => {
    navigate(`/${path}`);
  };

  // Xử lý thay đổi checkbox
  const handleCheckboxChange = (itemId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Tính tổng giá của các mục được chọn
  const calculateTotalPrice = () => {
    if (!data?.data?.items) return 0;
    return selectedItems.reduce((total, itemId) => {
      const item = data.data.items.find((i) => i._id === itemId);
      if (!item) return total;
      const price = item?.promotion?.discount
        ? item.price * (1 - item?.promotion?.discount / 100)
        : item.price;
      return total + price * item.quantity;
    }, 0);
  };

  // Xử lý chuyển hướng sang trang tạo đơn hàng
  const handleCreateOrder = () => {
    if (selectedItems.length === 0) {
      message.error("Vui lòng chọn ít nhất một sản phẩm để tạo đơn hàng");
      return;
    }
    navigate("/check-out", { state: { selectedItems } });
  };

  if (isLoading) return <div> ...Loading</div>;
  if (error) return <div>Có lỗi xảy ra: {error.message}</div>;

  return (
    <Row>
      <Col span={20} offset={2}>
        <Row style={{ padding: "48px 0" }}>
          <Col span={24}>
            {!data?.data ? (
              <Row
                justify="center"
                align="middle"
                style={{ minHeight: "50vh", padding: "48px 0" }}
              >
                <Col
                  span={18}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <h1 style={{ padding: 12 }}>Giỏ hàng đang trống</h1>
                  <Button
                    className="btn-shopnow"
                    type="primary"
                    onClick={() => handleNavigate("")}
                    style={{ marginTop: 16 }}
                  >
                    Mua Ngay
                  </Button>
                </Col>
              </Row>
            ) : (
              <>
                <Row>
                  <Col span={24}>
                    <h1 style={{ textAlign: "left", padding: 12 }}>
                      Giỏ Hàng Của Bạn
                    </h1>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    {data.data.items.length > 0 ? (
                      <>
                        {data.data.items.map((item) => (
                          <CartItemCustomize
                            key={item._id}
                            items={item}
                            cartId={data.data._id}
                            onCheckboxChange={handleCheckboxChange}
                            isChecked={selectedItems.includes(item._id)}
                          />
                        ))}
                        <Row
                          style={{
                            backgroundColor: "white",
                            padding: "16px",
                            marginTop: "16px",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Col>
                            Tổng Cộng: {calculateTotalPrice().toLocaleString()}{" "}
                            VNĐ
                          </Col>
                          <Button
                            type="primary"
                            onClick={handleCreateOrder}
                            style={{ marginTop: 16 }}
                            disabled={selectedItems.length === 0}
                          >
                            Tạo Đơn Hàng
                          </Button>
                        </Row>
                      </>
                    ) : (
                      <Row
                        justify="center"
                        align="middle"
                        style={{ minHeight: "50vh", padding: "48px 0" }}
                      >
                        <Col
                          span={18}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                          }}
                        >
                          <h1 style={{ padding: 12 }}>Đang trống</h1>
                          <Button
                            className="btn-shopnow"
                            type="primary"
                            onClick={() => handleNavigate("")}
                            style={{ marginTop: 16 }}
                          >
                            Mua Ngay
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Cart;
