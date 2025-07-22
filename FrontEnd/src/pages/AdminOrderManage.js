import React, { useContext, useState, useEffect } from "react";
import { Table, Button, Modal, Select, Tag, Space, Row, Col } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { AuthContext } from "../components/AuthContext";
import {
  getAllOrdersApi,
  updateOrderApi,
  deleteOrderApi,
  getOrderByIdApi,
} from "../services/order.service";

const { Option } = Select;

const AdminOrderManagePage = () => {
  const { auth } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");

  // Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrdersApi();
      console.log(response);
      setOrders(Array.isArray(response) ? response : response || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Hiển thị modal chi tiết đơn hàng
  const showOrderDetails = async (orderId) => {
    try {
      const response = await getOrderByIdApi(orderId);
      console.log("check stattt", response);
      setSelectedOrder(response);
      setOrderStatus(response.orderstatus);
      console.log("checkksadsada", orderStatus);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      Modal.error({
        title: "Lỗi",
        content: error.message || "Không thể lấy thông tin đơn hàng",
      });
    }
  };

  // Xử lý xác nhận/cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !orderStatus) return;
    try {
      const success = await updateOrderApi(selectedOrder._id, {
        orderstatus: orderStatus,
      });
      console.log("sssss", success);
      if (success) {
        setIsModalVisible(false);
        fetchOrders();
        Modal.success({
          title: "Thành công",
          content: "Cập nhật trạng thái đơn hàng thành công",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      Modal.error({
        title: "Lỗi",
        content: error.message || "Không thể cập nhật trạng thái đơn hàng",
      });
    }
  };

  // Xử lý xóa đơn hàng
  const handleDeleteOrder = (orderId) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa đơn hàng này?",
      onOk: async () => {
        try {
          const success = await deleteOrderApi(orderId);
          if (success) {
            fetchOrders();
            Modal.success({
              title: "Thành công",
              content: "Xóa đơn hàng thành công",
            });
          }
        } catch (error) {
          console.error("Error deleting order:", error);
          Modal.error({
            title: "Lỗi",
            content: error.message || "Không thể xóa đơn hàng",
          });
        }
      },
    });
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      render: (id) => id.slice(-6), // Hiển thị 6 ký tự cuối của ID
    },
    {
      title: "Khách hàng",
      dataIndex: "userId",
      key: "userId",
      render: (user) => (user ? user.fullName : "Khách vãng lai"),
    },
    {
      title: "Tổng giá",
      dataIndex: "total_Price",
      key: "total_Price",
      render: (price) => (price ? `${price.toLocaleString()} VNĐ` : "N/A"),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderstatus",
      key: "orderstatus",
      render: (status) => {
        let color = "default";
        if (status === "pending") color = "orange";
        if (status === "confirmed") color = "green";
        if (status === "cancelled") color = "red";
        if (status === "delivered") color = "blue";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentId",
      key: "paymentId",
      render: (method) => {
        const methodMap = {
          cash_on_delivery: "Thanh toán khi nhận hàng",
          credit_cart: "Thẻ tín dụng",
          bank_transfer: "Chuyển khoản ngân hàng",
        };
        return methodMap[method.paymentMethod] || method.paymentMethod;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => {
        if (!date) return "Không xác định";
        try {
          const dateObj = date instanceof Date ? date : new Date(date);
          if (isNaN(dateObj.getTime())) return "Ngày không hợp lệ";
          return dateObj.toLocaleDateString("vi-VN");
        } catch (error) {
          console.error("Error parsing date:", error);
          return "Ngày không hợp lệ";
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showOrderDetails(record._id)}
          >
            Chi tiết
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteOrder(record._id)}
            danger
            disabled={auth?.user?.role !== "admin"}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Row>
      <Col span={20} offset={2}>
        <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
        {auth.user && (
          <div className="mb-4">
            <p>
              Đăng nhập với tư cách: <strong>{auth.user.fullName}</strong> (
              {auth.user.role === "admin" ? "Quản trị viên" : "Nhân viên"})
            </p>
          </div>
        )}

        {/* Bảng danh sách đơn hàng */}
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />

        {/* Modal chi tiết đơn hàng */}
        {selectedOrder && (
          <Modal
            title={`Chi tiết đơn hàng #${selectedOrder._id.slice(-6)}`}
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              setSelectedOrder(null);
              setOrderStatus("");
            }}
            footer={null}
            width={800}
          >
            <div>
              <p>
                <strong>Khách hàng:</strong>{" "}
                {selectedOrder.userId
                  ? selectedOrder.userId.fullName
                  : "Khách vãng lai"}
              </p>
              <p>
                <strong>Địa chỉ giao hàng:</strong>{" "}
                {`${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.addressdetails}, ${selectedOrder.shippingAddress.country}`}
              </p>
              <p>
                <strong>Phương thức thanh toán:</strong>{" "}
                {selectedOrder.paymentMethod === "cash_on_delivery"
                  ? "Thanh toán khi nhận hàng"
                  : selectedOrder.paymentMethod === "credit_card"
                  ? "Thẻ tín dụng"
                  : "Chuyển khoản ngân hàng"}
              </p>
              <p>
                <strong>Tổng giá:</strong>{" "}
                {selectedOrder.total_Price.toLocaleString()} VNĐ
              </p>
              <p>
                <strong>Ngày tạo:</strong> {Date(selectedOrder.createdAt)}
              </p>
              <h4>Sản phẩm:</h4>
              <ul>
                {selectedOrder.items.map((item) => (
                  <li key={item._id}>
                    {item.productId.name} - Số lượng: {item.quantity} - Giá:{" "}
                    {(
                      item.price *
                      (1 - (item?.promotion?.discount || 0) / 100)
                    ).toLocaleString()}{" "}
                    VNĐ
                    {item?.promotion?.discount && (
                      <span style={{ color: "#faad14" }}>
                        {" "}
                        ({item?.promotion?.discount}% giảm)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 16 }}>
                <h4>Cập nhật trạng thái:</h4>
                <Space>
                  <Select
                    value={orderStatus}
                    onChange={(value) => setOrderStatus(value)}
                    style={{ width: 200 }}
                  >
                    <Option value="pending">Đang chờ</Option>
                    <Option value="confirmed">Đã xác nhận</Option>
                    <Option value="delivered">Đã giao</Option>
                    <Option value="cancelled">Đã hủy</Option>
                  </Select>
                  <Button
                    type="primary"
                    onClick={handleUpdateStatus}
                    disabled={auth?.user?.role !== "admin"}
                  >
                    Cập nhật
                  </Button>
                </Space>
              </div>
            </div>
          </Modal>
        )}
      </Col>
    </Row>
  );
};

export default AdminOrderManagePage;
