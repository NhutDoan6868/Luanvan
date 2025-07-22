import React, { useContext, useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  DatePicker,
  Modal,
  InputNumber,
  message,
  Row,
  Col,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import usePromotion from "../hooks/usePromotion";
import { AuthContext } from "../components/AuthContext";
import moment from "moment";

const AdminPromotionManagePage = () => {
  const {
    promotions,
    loading,
    fetchPromotions,
    handleCreatePromotion,
    handleUpdatePromotion,
    handleDeletePromotion,
  } = usePromotion();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPromotionId, setEditingPromotionId] = useState(null);
  const [form] = Form.useForm();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    console.log("Promotions in AdminPromotionManagePage:", promotions);
    console.log("Loading state:", loading);
  }, [promotions, loading]);

  // Hiển thị modal để thêm hoặc chỉnh sửa khuyến mãi
  const showModal = (promotion = null) => {
    if (promotion) {
      form.setFieldsValue({
        name: promotion.name,
        discount: promotion.discount,
        startDate: moment(promotion.startDate),
        endDate: moment(promotion.endDate),
      });
      setEditingPromotionId(promotion._id);
    } else {
      form.resetFields();
      setEditingPromotionId(null);
    }
    setIsModalVisible(true);
  };

  // Xử lý submit form
  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
    };
    const success = editingPromotionId
      ? await handleUpdatePromotion(editingPromotionId, payload)
      : await handleCreatePromotion(payload);
    if (success) {
      setIsModalVisible(false);
      form.resetFields();
    }
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Tên khuyến mãi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giảm giá (%)",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            type="primary"
            disabled={auth?.user?.role !== "admin"}
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "Bạn có chắc muốn xóa khuyến mãi này?",
                onOk: () => handleDeletePromotion(record._id),
              });
            }}
            danger
            disabled={auth?.user?.role !== "admin"}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Row>
      <Col span={20} offset={2}>
        <h1 className="text-2xl font-bold mb-4">Quản lý khuyến mãi</h1>
        {auth.user && (
          <div className="mb-4">
            <p>
              Đăng nhập với tư cách: <strong>{auth.user.fullName}</strong> (
              {auth.user.role === "admin" ? "Quản trị viên" : "Nhân Viên"})
            </p>
          </div>
        )}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          className="mb-4"
          disabled={auth?.user?.role !== "admin"}
        >
          Thêm khuyến mãi
        </Button>

        <h3>Số khuyến mãi: {promotions.length}</h3>
        <Table
          columns={columns}
          dataSource={promotions}
          rowKey={(record) => record._id || Math.random().toString()}
          pagination={{ pageSize: 10 }}
          loading={loading}
        />

        <Modal
          title={editingPromotionId ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              discount: 0,
            }}
          >
            <Form.Item
              name="name"
              label="Tên khuyến mãi"
              rules={[
                { required: true, message: "Vui lòng nhập tên khuyến mãi" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="discount"
              label="Giảm giá (%)"
              rules={[
                { required: true, message: "Vui lòng nhập mức giảm giá" },
                {
                  type: "number",
                  min: 0,
                  max: 100,
                  message: "Giảm giá phải từ 0 đến 100%",
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item>
              <div className="flex gap-2">
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingPromotionId ? "Cập nhật" : "Thêm"}
                </Button>
                <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </Col>
    </Row>
  );
};

export default AdminPromotionManagePage;
