import { Card, Col, Row, Button, InputNumber, message, Checkbox } from "antd";
import Meta from "antd/es/card/Meta";
import { useNavigate } from "react-router-dom";
import "../styles/CardProduct.css";
import {
  removeItemFromCartApi,
  updateCartItemService,
} from "../services/cart.service";
import useRemoveCartItem from "../hooks/useRemoveCartItem";
import { useGetCartByUser } from "../hooks/useGetCartByUser";

function CartItemCustomize({ items, cartId, onCheckboxChange, isChecked }) {
  const navigate = useNavigate();
  const { removeItemFromCart, loading, error } = useRemoveCartItem();
  const { refetch } = useGetCartByUser();

  const handleNavigate = (path) => {
    navigate(`/${path}`);
  };

  const handleQuantityChange = async (value) => {
    if (value === items.quantity) return;
    try {
      await updateCartItemService(cartId, items._id, value);
      message.success("Cập nhật số lượng thành công");
      refetch();
    } catch (err) {
      console.error("Update quantity error:", err.message);
      message.error(err.message || "Lỗi khi cập nhật số lượng");
    }
  };

  const handleRemove = async (e) => {
    e.stopPropagation();
    console.log("Attempting to remove item", { cartId, itemId: items._id });
    try {
      await removeItemFromCartApi(cartId, items._id);
      message.success("Xóa sản phẩm khỏi giỏ hàng thành công");
      refetch();
    } catch (err) {
      console.error("Remove error:", err.message);
      message.error(error || "Lỗi khi xóa sản phẩm khỏi giỏ hàng");
    }
  };

  const handleCheckboxChange = (e) => {
    onCheckboxChange(items._id, e.target.checked);
  };

  return (
    <Card hoverable style={{ marginBottom: 16 }}>
      <Meta title={items.productId.name} />
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={1}>
          <Row justify={"center"} align={"middle"}>
            <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
          </Row>
        </Col>
        <Col span={3}>
          <img
            alt={items.productId.name}
            src={items.productId.imageURL}
            style={{ width: "90px", height: "90px" }}
          />
        </Col>
        <Col span={5}>
          <span style={{ textDecoration: "line-through", color: "#888" }}>
            {items.price} VNĐ
          </span>
          <span style={{ color: "#f5222d", marginLeft: 8 }}>
            {items.discountedPrice
              ? items.discountedPrice.toFixed(0)
              : items.price}{" "}
            VNĐ
          </span>
        </Col>
        <Col span={5}>
          <InputNumber
            min={1}
            value={items.quantity}
            onChange={handleQuantityChange}
            style={{ width: 100 }}
            disabled={loading}
          />
        </Col>
        <Col span={5}>
          <span style={{ color: "#f5222d" }}>
            {(items.discountedPrice ? items.discountedPrice : items.price) *
              items.quantity}{" "}
            VNĐ
          </span>
        </Col>
        <Col span={5}>
          <Button type="link" danger onClick={handleRemove} disabled={loading}>
            {loading ? "Đang xóa..." : "Xóa"}
          </Button>
          <Button
            type="link"
            style={{ marginLeft: 8 }}
            onClick={() => handleNavigate(`details/${items.productId._id}`)} // Sửa lỗi ở đây
          >
            Tìm sản phẩm trong cửa hàng
          </Button>
        </Col>
      </Row>
      {items.discount && (
        <Row style={{ marginTop: 8 }}>
          <Col span={24}>
            <span style={{ color: "#faad14" }}>{items.discount}% giảm</span>
          </Col>
        </Row>
      )}
      <Row style={{ marginTop: 8 }}>
        <Col span={24}>
          <Button type="primary" ghost onClick={(e) => e.stopPropagation()}>
            Voucher giảm thêm 5% - Xem thêm voucher
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: 8 }}>
        <Col span={24}>
          <Button
            type="link"
            style={{ color: "#1890ff" }}
            onClick={(e) => e.stopPropagation()}
          >
            Giảm đ500,000 phí vận đơn tối thiểu đ0 - Tìm hiểu thêm
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

export default CartItemCustomize;
