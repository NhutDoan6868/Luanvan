import React, { useEffect, useState } from "react";
import { Table, Tag, Card, Spin, Alert, Typography, Button, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { getOrdersByUserApi, deleteOrderApi } from "../services/order.service";

const { Title } = Typography;

// Hàm ánh xạ trạng thái đơn hàng sang màu và tên tiếng Việt
const getStatusTag = (status) => {
  const statusMap = {
    pending: { color: "blue", text: "Đang chờ xử lý" },
    confirmed: { color: "cyan", text: "Đã xác nhận" },
    shipped: { color: "orange", text: "Đang giao hàng" },
    delivered: { color: "green", text: "Đã giao" },
    cancelled: { color: "red", text: "Đã hủy" },
  };
  const { color, text } = statusMap[status] || {
    color: "default",
    text: "Không xác định",
  };
  return <Tag color={color}>{text}</Tag>;
};

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy danh sách đơn hàng của người dùng
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrdersByUserApi();
        console.log("Check OBU", response);
        if (response) {
          setOrders(response);
        } else {
          setError(response.message || "Không thể tải danh sách đơn hàng");
        }
      } catch (err) {
        setError(err.message || "Lỗi khi tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Xử lý hủy đơn hàng
  const handleCancelOrder = (orderId) => {
    Modal.confirm({
      title: "Xác nhận hủy đơn hàng",
      content: "Bạn có chắc chắn muốn hủy đơn hàng này?",
      okText: "Hủy đơn hàng",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          console.log("Attempting to cancel order:", orderId);
          const response = await deleteOrderApi(orderId);
          console.log("Delete order response:", response);
          if (response) {
            setOrders((prevOrders) =>
              prevOrders.filter((order) => order._id !== orderId)
            );
            Modal.success({
              title: "Thành công",
              content: "Hủy đơn hàng thành công",
            });
          } else {
            setError(response.message || "Không thể hủy đơn hàng");
          }
        } catch (err) {
          console.error("Error cancelling order:", err);
          setError(err.message || "Lỗi khi hủy đơn hàng");
        }
      },
    });
  };

  // Định nghĩa cột cho bảng đơn hàng
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      render: (id) => id.slice(-6), // Hiển thị 6 ký tự cuối của ID
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Sản phẩm",
      dataIndex: "items",
      key: "items",
      render: (items) => items.map((item) => item.productId.name).join(", "),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_Price",
      key: "total_Price",
      render: (price) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      render: (address) => `${address.street}, ${address.city}`,
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentId",
      key: "paymentId",
      render: (method) => {
        const methodMap = {
          cash_on_delivery: "Thanh toán khi nhận hàng",
          credit_card: "Thẻ tín dụng",
          bank_transfer: "Chuyển khoản ngân hàng",
        };
        return method && method.paymentMethod
          ? methodMap[method.paymentMethod] || method.paymentMethod
          : "Không xác định";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "orderstatus",
      key: "orderstatus",
      render: getStatusTag,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        record.orderstatus === "pending" ? (
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleCancelOrder(record._id)}
          >
            Hủy đơn hàng
          </Button>
        ) : null,
    },
  ];

  // Tách đơn hàng hiện tại (pending, confirmed, shipped) và đơn hàng đã hoàn thành (delivered, cancelled)
  const currentOrders = orders.filter((order) =>
    ["pending", "confirmed", "shipped"].includes(order.orderstatus)
  );
  const pastOrders = orders.filter((order) =>
    ["delivered", "cancelled"].includes(order.orderstatus)
  );

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
        Quản lý đơn hàng
      </Title>

      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: "16px" }}
        />
      )}

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <>
          {/* Đơn hàng hiện tại */}
          <Card title="Đơn hàng hiện tại" style={{ marginBottom: "24px" }}>
            {currentOrders.length > 0 ? (
              <Table
                columns={columns}
                dataSource={currentOrders}
                rowKey="_id"
                pagination={false}
              />
            ) : (
              <p>Không có đơn hàng hiện tại.</p>
            )}
          </Card>

          {/* Đơn hàng đã mua */}
          <Card title="Lịch sử đơn hàng">
            {pastOrders.length > 0 ? (
              <Table
                columns={columns}
                dataSource={pastOrders}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
              />
            ) : (
              <p>Không có đơn hàng trong lịch sử.</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default UserOrdersPage;
