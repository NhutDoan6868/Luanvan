import React, { useContext, useState } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Modal,
  Select,
  message,
  Row,
  Col,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useSubCategory from "../hooks/useSubCategory";
import useCategory from "../hooks/useCategory";
import { AuthContext } from "../components/AuthContext";

const { Option } = Select;

const AdminSubCategoryManagePage = () => {
  const {
    subcategories,
    loading,
    handleCreateSubCategory,
    handleUpdateSubCategory,
    handleDeleteSubCategory,
  } = useSubCategory();
  const { categories, loading: categoryLoading } = useCategory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubCategoryId, setEditingSubCategoryId] = useState(null);
  const [form] = Form.useForm();

  const { auth } = useContext(AuthContext);

  // Hiển thị modal để thêm hoặc chỉnh sửa danh mục con
  const showModal = (subcategory = null) => {
    if (!categories.length && !subcategory) {
      message.error(
        "Không có danh mục cha nào để chọn. Vui lòng tạo danh mục trước."
      );
      return;
    }
    if (subcategory) {
      form.setFieldsValue({
        name: subcategory.name,
        description: subcategory.description,
        categoryId: subcategory.categoryId,
        icon: subcategory.icon,
      });
      setEditingSubCategoryId(subcategory._id);
    } else {
      form.resetFields();
      setEditingSubCategoryId(null);
    }
    setIsModalVisible(true);
  };

  // Xử lý submit form
  const handleSubmit = async (values) => {
    const success = editingSubCategoryId
      ? await handleUpdateSubCategory(editingSubCategoryId, values)
      : await handleCreateSubCategory(values);
    if (success) {
      setIsModalVisible(false);
      form.resetFields();
    }
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Tên danh mục con",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Danh mục cha",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId) => {
        console.log(
          "Rendering categoryId:",
          categoryId,
          "Categories:",
          categories
        ); // Log để debug
        if (!categoryId) {
          return "Không xác định (categoryId rỗng)";
        }
        // Nếu categoryId là object, lấy _id và name từ object
        if (typeof categoryId === "object" && categoryId._id) {
          return categoryId.name || "Không xác định (name rỗng)";
        }
        // Nếu categoryId là string, tìm trong categories
        const category = categories.find(
          (cat) => String(cat._id) === String(categoryId)
        );
        return category ? category.name : `Không xác định (ID: ${categoryId})`;
      },
    },
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: (icon) => <img src={icon} alt="icon" style={{ width: "30px" }} />,
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
                title: "Bạn có chắc muốn xóa danh mục con này?",
                onOk: () => handleDeleteSubCategory(record._id),
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
        <h1 className="text-2xl font-bold mb-4">Quản lý danh mục con</h1>
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
          disabled={auth?.user?.role !== "admin" || categoryLoading}
          loading={categoryLoading}
        >
          Thêm danh mục con
        </Button>

        {/* Bảng danh sách danh mục con */}
        <Table
          columns={columns}
          dataSource={subcategories}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />

        {/* Modal thêm/cập nhật danh mục con */}
        <Modal
          title={
            editingSubCategoryId ? "Cập nhật danh mục con" : "Thêm danh mục con"
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              icon: "http://localhost:8080/public/images/default-icon.png",
            }}
          >
            <Form.Item
              name="name"
              label="Tên danh mục con"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục con" },
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
            <Form.Item
              name="categoryId"
              label="Danh mục cha"
              rules={[
                { required: true, message: "Vui lòng chọn danh mục cha" },
              ]}
            >
              <Select placeholder="Chọn danh mục cha" loading={categoryLoading}>
                {categories.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="icon"
              label="Icon URL"
              rules={[
                { required: true, message: "Vui lòng nhập URL biểu tượng" },
              ]}
            >
              <Input placeholder="http://localhost:8080/public/images/default-icon.png" />
            </Form.Item>
            <Form.Item>
              <div className="flex gap-2">
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingSubCategoryId ? "Cập nhật" : "Thêm"}
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

export default AdminSubCategoryManagePage;
