import React, { useContext, useState } from "react";
import { Table, Button, Form, Input, Select, Modal, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useUser from "../hooks/useUser";
import { AuthContext } from "../components/AuthContext";
import { useGetAllUser } from "../hooks/useGetAllUser";

const { Option } = Select;

const AdminUserManagePage = () => {
  const {
    users,
    loading,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
  } = useUser();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [form] = Form.useForm();

  const { auth } = useContext(AuthContext);

  // Hiển thị modal để thêm hoặc chỉnh sửa người dùng
  const showModal = (user = null) => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        password: "",
        role: user.role,
        avatar: user.avatar,
      });
      setEditingUserId(user._id);
    } else {
      form.resetFields();
      setEditingUserId(null);
    }
    setIsModalVisible(true);
  };

  // Xử lý submit form
  const handleSubmit = async (values) => {
    const success = editingUserId
      ? await handleUpdateUser(editingUserId, values)
      : await handleCreateUser(values);
    if (success) {
      setIsModalVisible(false);
      form.resetFields();
    }
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) =>
        ({
          admin: "Quản trị viên",
          user: "Người dùng",
          employee: "Nhân viên",
        }[role] || "Không xác định"),
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <img src={avatar} alt="avatar" style={{ width: "30px" }} />
      ),
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
                title: "Bạn có chắc muốn xóa người dùng này?",
                onOk: () => handleDeleteUser(record._id),
              });
            }}
            danger
            disabled={
              auth?.user?.role !== "admin" || record._id === auth?.user?._id
            }
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
        <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>
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
          Thêm người dùng
        </Button>

        {/* Bảng danh sách người dùng */}
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />

        {/* Modal thêm/cập nhật người dùng */}
        <Modal
          title={editingUserId ? "Cập nhật người dùng" : "Thêm người dùng"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              role: "user",
              avatar: "http://localhost:8080/public/images/default-avatar.png",
            }}
          >
            <Form.Item
              name="fullName"
              label="Họ tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                {
                  required: !editingUserId,
                  message: "Vui lòng nhập mật khẩu",
                },
                {
                  min: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              ]}
            >
              <Input.Password
                placeholder={editingUserId ? "Để trống nếu không thay đổi" : ""}
              />
            </Form.Item>
            <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
            >
              <Select>
                <Option value="user">Người dùng</Option>
                <Option value="admin">Quản trị viên</Option>
                <Option value="employee">Nhân Viên</Option>
              </Select>
            </Form.Item>
            <Form.Item name="avatar" label="Avatar URL">
              <Input placeholder="http://localhost:8080/public/images/default-avatar.png" />
            </Form.Item>
            <Form.Item>
              <div className="flex gap-2">
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingUserId ? "Cập nhật" : "Thêm"}
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

export default AdminUserManagePage;
