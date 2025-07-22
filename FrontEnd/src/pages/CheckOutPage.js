import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Button, Form, Select, message, Spin } from "antd";
import { useGetCartByUser } from "../hooks/useGetCartByUser";
import { createOrderApi } from "../services/order.service";
import { AuthContext } from "../components/AuthContext";
import useAddress from "../hooks/useAddress";

const { Option } = Select;

function CheckOutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const { selectedItems } = location.state || { selectedItems: [] };
  const {
    data,
    isLoading: isCartLoading,
    error: cartError,
    refetch,
  } = useGetCartByUser();
  const {
    addresses,
    loading: isAddressLoading,
    fetchAddresses,
  } = useAddress(auth);
  const [form] = Form.useForm();

  useEffect(() => {
    if (auth?.user?.id) {
      fetchAddresses();
    }
  }, [auth?.user?.id, fetchAddresses]);
  useEffect(() => {
    if (!selectedItems || selectedItems.length === 0) {
      message.error("Vui lòng chọn sản phẩm từ giỏ hàng trước khi thanh toán");
      navigate("/cart");
    }
  }, [selectedItems, navigate]);

  const calculateTotalPrice = () => {
    if (!data?.data?.items) return 0;
    return selectedItems.reduce((total, itemId) => {
      const item = data.data.items.find((i) => i._id === itemId);
      if (!item) return total;
      const price = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + price * item.quantity;
    }, 0);
  };
  const handleSubmit = async (values) => {
    try {
      const orderData = {
        shippingAddress: values.shippingAddress,
        paymentMethod: values.paymentMethod,
        items: selectedItems,
      };
      const response = await createOrderApi(orderData, auth?.user?.id);
      console.log("check res", response);
      if (response) {
        message.success("Tạo đơn hàng thành công");
        await refetch(); // Đợi làm mới dữ liệu giỏ hàng
        navigate("/cart"); // Chuyển hướng về trang giỏ hàng
      } else {
        message.error(response?.data?.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error("Lỗi khi tạo đơn hàng:", errorMessage);
      message.error(`Lỗi khi tạo đơn hàng: ${errorMessage}`);
    }
  };

  if (isCartLoading || isAddressLoading)
    return (
      <Spin
        tip="Đang tải..."
        style={{ display: "block", margin: "48px auto" }}
      />
    );
  if (cartError) return <div>Có lỗi xảy ra: {cartError.message}</div>;
  if (!selectedItems.length) {
    return (
      <Row justify="center" style={{ padding: "48px 0" }}>
        <Col>
          <h2>
            Vui lòng chọn sản phẩm từ giỏ unconditionalExpression giỏ hàng
          </h2>
          <Button type="primary" onClick={() => navigate("/cart")}>
            Quay lại giỏ hàng
          </Button>
        </Col>
      </Row>
    );
  }

  return (
    <Row>
      <Col span={20} offset={2}>
        <Row
          gutter={[16, 16]}
          style={{ padding: "48px 0", backgroundColor: "white" }}
        >
          <Col span={24}>
            <h1 style={{ textAlign: "left", padding: 12 }}>Tạo Đơn Hàng</h1>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <h2>Sản phẩm được chọn</h2>
                {data?.data?.items
                  .filter((item) => selectedItems.includes(item._id))
                  .map((item) => (
                    <Row key={item._id} style={{ marginBottom: 16 }}>
                      <Col span={4}>
                        <img
                          alt={item.productId.name}
                          src={item.productId.imageURL}
                          style={{ width: "60px", height: "60px" }}
                        />
                      </Col>
                      <Col span={20}>
                        <p>{item.productId.name}</p>
                        <p>
                          Giá:{" "}
                          {item.discount
                            ? (
                                item.price *
                                (1 - item.discount / 100)
                              ).toLocaleString()
                            : item.price.toLocaleString()}{" "}
                          VNĐ
                          {item.discount && (
                            <span style={{ color: "#faad14" }}>
                              {" "}
                              ({item.discount}% giảm)
                            </span>
                          )}
                        </p>
                        <p>Số lượng: {item.quantity}</p>
                      </Col>
                    </Row>
                  ))}
                <h3>Tổng cộng: {calculateTotalPrice().toLocaleString()} VNĐ</h3>
              </Col>
              <Col span={12}>
                <h2>Thông tin đơn hàng</h2>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                  <Form.Item
                    name="shippingAddress"
                    label="Địa chỉ giao hàng"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn địa chỉ giao hàng",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Chọn địa chỉ"
                      notFoundContent={
                        <div>
                          <p>
                            Không có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                          </p>
                          <Button
                            type="primary"
                            onClick={() => navigate("/profile")}
                          >
                            Thêm địa chỉ
                          </Button>
                        </div>
                      }
                    >
                      {addresses.map((address) => (
                        <Option key={address._id} value={address._id}>
                          {`${address.street}, ${address.city}, ${address.addressdetails}, ${address.country}`}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="paymentMethod"
                    label="Phương thức thanh toán"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn phương thức thanh toán",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn phương thức">
                      <Option value="cash_on_delivery">
                        Thanh toán khi nhận hàng
                      </Option>
                      <Option value="credit_card">Thẻ tín dụng</Option>
                      <Option value="bank_transfer">
                        Chuyển khoản ngân hàng
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Xác nhận tạo đơn hàng
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={() => navigate("/cart")}
                    >
                      Hủy
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default CheckOutPage;
