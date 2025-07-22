import React, { useContext, useState } from "react";
import { Table, Button, Form, Input, Modal, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useCategory from "../hooks/useCategory";
import { AuthContext } from "../components/AuthContext";

const AdminCategoryManagePage = () => {
  const {
    categories,
    loading,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  } = useCategory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [form] = Form.useForm();

  const { auth } = useContext(AuthContext);

  // Hiển thị modal để thêm hoặc chỉnh sửa danh mục
  const showModal = (category = null) => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
      });
      setEditingCategoryId(category._id);
    } else {
      form.resetFields();
      setEditingCategoryId(null);
    }
    setIsModalVisible(true);
  };

  // Xử lý submit form
  const handleSubmit = async (values) => {
    const success = editingCategoryId
      ? await handleUpdateCategory(editingCategoryId, values)
      : await handleCreateCategory(values);
    if (success) {
      setIsModalVisible(false);
      form.resetFields();
    }
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
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
                title: "Bạn có chắc muốn xóa danh mục này?",
                onOk: () => handleDeleteCategory(record._id),
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
        <h1 className="text-2xl font-bold mb-4">Quản lý danh mục</h1>
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
          Thêm danh mục
        </Button>

        {/* Bảng danh sách danh mục */}
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />

        {/* Modal thêm/cập nhật danh mục */}
        <Modal
          title={editingCategoryId ? "Cập nhật danh mục" : "Thêm danh mục"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Tên danh mục"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <div className="flex gap-2">
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingCategoryId ? "Cập nhật" : "Thêm"}
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

export default AdminCategoryManagePage;
