import React, { useContext, useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Tag,
  Space,
  Row,
  Col,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useProduct from "../hooks/useProduct";
import { AuthContext } from "../components/AuthContext";
import axios from "../utils/axios.customize";

const { Option } = Select;

const AdminProductManagePage = () => {
  const {
    products,
    loading,
    fetchProducts,
    fetchProductSizes,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleCreateSize,
    handleDeleteSize,
    handleSetProductPrice,
    handleDeletePrice,
    sizes,
    setSizes,
  } = useProduct();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [form] = Form.useForm();
  const [newSizes, setNewSizes] = useState([]);
  const [newSizeName, setNewSizeName] = useState("");
  const [newSizePrice, setNewSizePrice] = useState(null);
  const [updateSizeId, setUpdateSizeId] = useState(null);
  const [updatePrice, setUpdatePrice] = useState(null);
  const { auth } = useContext(AuthContext);

  // Lấy danh sách danh mục con
  const fetchSubcategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/subcategory");
      console.log("Fetch subcategories response:", response);
      setSubcategories(
        Array.isArray(response.data) ? response.data : response.data || []
      );
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  useEffect(() => {
    fetchSubcategories();
    console.log("Products in AdminProductManagePage:", products);
  }, [products]);

  // Hiển thị modal để thêm hoặc chỉnh sửa sản phẩm
  const showModal = async (product = null) => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        soldQuantity: product.soldQuantity,
        imageURL: product.imageURL,
        subcategoryId: product.subcategoryId?._id || product.subcategoryId,
      });
      setEditingProductId(product._id);
      await fetchProductSizes(product._id);
      setNewSizes([]);
      setNewSizeName("");
      setNewSizePrice(null);
      setUpdateSizeId(null);
      setUpdatePrice(null);
    } else {
      form.resetFields();
      setEditingProductId(null);
      setSizes([]);
      setNewSizes([]);
      setNewSizeName("");
      setNewSizePrice(null);
      setUpdateSizeId(null);
      setUpdatePrice(null);
    }
    setIsModalVisible(true);
  };

  // Thêm size mới vào danh sách tạm hoặc tạo trực tiếp
  const addNewSize = async () => {
    if (!newSizeName) {
      return Modal.error({
        title: "Lỗi",
        content: "Vui lòng nhập tên kích thước",
      });
    }
    if (newSizePrice === null || newSizePrice < 0) {
      return Modal.error({ title: "Lỗi", content: "Vui lòng nhập giá hợp lệ" });
    }
    try {
      if (editingProductId) {
        // Nếu đang chỉnh sửa, tạo size ngay lập tức
        const sizeResponse = await handleCreateSize(editingProductId, {
          name: newSizeName,
        });
        if (sizeResponse) {
          await handleSetProductPrice(editingProductId, {
            sizeId: sizeResponse._id,
            price: newSizePrice,
          });
          await fetchProductSizes(editingProductId);
        }
      } else {
        // Nếu tạo mới sản phẩm, thêm vào danh sách tạm
        setNewSizes([...newSizes, { name: newSizeName, price: newSizePrice }]);
      }
      setNewSizeName("");
      setNewSizePrice(null);
    } catch (error) {
      console.error("Error adding new size:", error);
      Modal.error({
        title: "Lỗi",
        content: error.message || "Không thể thêm kích thước",
      });
    }
  };

  // Xóa size khỏi danh sách tạm
  const removeNewSize = (index) => {
    setNewSizes(newSizes.filter((_, i) => i !== index));
  };

  // Xử lý submit form sản phẩm
  const handleSubmit = async (values) => {
    const productData = { ...values, sizes: newSizes };
    let success = false;
    if (editingProductId) {
      success = await handleUpdateProduct(editingProductId, values);
    } else {
      const createResponse = await handleCreateProduct(productData);
      if (createResponse) {
        setEditingProductId(createResponse._id);
        success = true;
      }
    }
    if (success) {
      setIsModalVisible(false);
      form.resetFields();
      setNewSizes([]);
      setNewSizeName("");
      setNewSizePrice(null);
      setUpdateSizeId(null);
      setUpdatePrice(null);
    }
  };

  // Xử lý xóa size
  const handleDeleteSizeClick = (sizeId) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa kích thước này?",
      onOk: async () => {
        const success = await handleDeleteSize(editingProductId, sizeId);
        if (success) {
          await fetchProductSizes(editingProductId);
        }
      },
    });
  };

  // Xử lý xóa giá
  const handleDeletePriceClick = (sizeId) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa giá của kích thước này?",
      onOk: async () => {
        const success = await handleDeletePrice(editingProductId, sizeId);
        if (success) {
          await fetchProductSizes(editingProductId);
        }
      },
    });
  };

  // Xử lý cập nhật giá cho size hiện có
  const handleUpdatePrice = async () => {
    if (!updateSizeId) {
      return Modal.error({ title: "Lỗi", content: "Vui lòng chọn kích thước" });
    }
    if (updatePrice === null || updatePrice < 0) {
      return Modal.error({ title: "Lỗi", content: "Vui lòng nhập giá hợp lệ" });
    }
    try {
      const success = await handleSetProductPrice(editingProductId, {
        sizeId: updateSizeId,
        price: updatePrice,
      });
      if (success) {
        await fetchProductSizes(editingProductId);
        setUpdateSizeId(null);
        setUpdatePrice(null);
      }
    } catch (error) {
      console.error("Error updating price:", error);
      Modal.error({
        title: "Lỗi",
        content: error.message || "Không thể cập nhật giá",
      });
    }
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => (text ? text.substring(0, 50) + "..." : ""),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đã bán",
      dataIndex: "soldQuantity",
      key: "soldQuantity",
    },
    {
      title: "Giá thấp nhất",
      dataIndex: "minPrice",
      key: "minPrice",
      render: (minPrice) =>
        minPrice !== undefined ? `${minPrice.toLocaleString()} VND` : "N/A",
    },
    {
      title: "Kích thước",
      dataIndex: "sizes",
      key: "sizes",
      render: (sizes) =>
        sizes && sizes.length > 0 ? (
          <Space direction="vertical">
            {sizes.map((size) => (
              <div key={size._id}>
                {size.name}:{" "}
                {size.price
                  ? `${size.price.toLocaleString()} VND`
                  : "Chưa có giá"}
              </div>
            ))}
          </Space>
        ) : (
          "Chưa có kích thước"
        ),
    },
    {
      title: "Khuyến mãi",
      dataIndex: "promotion",
      key: "promotion",
      render: (promotion) =>
        promotion && promotion.name ? (
          <Tag color="green">
            {promotion.name} (-{promotion.discount}%)
          </Tag>
        ) : (
          "Không có"
        ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) =>
        images && Array.isArray(images) && images.length > 0 ? (
          <img
            src={images[0].url}
            alt={images[0].altText || "product"}
            style={{ width: "50px" }}
          />
        ) : (
          <img
            src="http://localhost:8080/public/images/default-product.png"
            alt="default"
            style={{ width: "50px" }}
          />
        ),
    },
    {
      title: "Danh mục con",
      dataIndex: "subcategoryId",
      key: "subcategoryId",
      render: (subcategory) =>
        subcategory && subcategory.name ? subcategory.name : "Không xác định",
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
                title: "Bạn có chắc muốn xóa sản phẩm này?",
                onOk: () => handleDeleteProduct(record._id),
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
        <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>
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
          Thêm sản phẩm
        </Button>

        {/* Bảng danh sách sản phẩm */}
        <Table
          columns={columns}
          dataSource={products}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />

        {/* Modal thêm/cập nhật sản phẩm */}
        <Modal
          title={editingProductId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setNewSizes([]);
            form.resetFields();
            setNewSizeName("");
            setNewSizePrice(null);
            setUpdateSizeId(null);
            setUpdatePrice(null);
          }}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              quantity: 0,
              soldQuantity: 0,
              imageURL:
                "http://localhost:8080/public/images/default-product.png",
            }}
          >
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng" },
                { type: "number", min: 0, message: "Số lượng không được âm" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="soldQuantity"
              label="Số lượng đã bán"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng đã bán" },
                {
                  type: "number",
                  min: 0,
                  message: "Số lượng đã bán không được âm",
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="imageURL"
              label="URL hình ảnh"
              rules={[
                { required: true, message: "Vui lòng nhập URL hình ảnh" },
              ]}
            >
              <Input placeholder="http://localhost:8080/public/images/default-product.png" />
            </Form.Item>
            <Form.Item
              name="subcategoryId"
              label="Danh mục con"
              rules={[
                { required: true, message: "Vui lòng chọn danh mục con" },
              ]}
            >
              <Select placeholder="Chọn danh mục con">
                {subcategories.map((subcategory) => (
                  <Option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>

          {/* Phần thêm kích thước và giá */}
          <div style={{ marginTop: 16 }}>
            <h4>Thêm kích thước và giá</h4>
            <Space>
              <Input
                placeholder="Tên kích thước (VD: Small)"
                value={newSizeName}
                onChange={(e) => setNewSizeName(e.target.value)}
                style={{ width: 200 }}
              />
              <InputNumber
                placeholder="Giá (VND)"
                value={newSizePrice}
                onChange={(value) => setNewSizePrice(value)}
                style={{ width: 200 }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                min={0}
              />
              <Button type="primary" onClick={addNewSize}>
                Thêm
              </Button>
            </Space>
          </div>

          {/* Danh sách kích thước mới (chưa lưu) */}
          {newSizes.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4>Danh sách kích thước mới:</h4>
              <ul>
                {newSizes.map((size, index) => (
                  <li key={index}>
                    {size.name}: {size.price.toLocaleString()} VND
                    <Button
                      type="link"
                      danger
                      onClick={() => removeNewSize(index)}
                      style={{ marginLeft: 10 }}
                    >
                      Xóa
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Danh sách kích thước hiện tại (khi chỉnh sửa) */}
          {editingProductId && sizes.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4>Danh sách kích thước hiện tại:</h4>
              <ul>
                {sizes.map((size) => (
                  <li key={size._id}>
                    {size.name}:{" "}
                    {size.price
                      ? `${size.price.toLocaleString()} VND`
                      : "Chưa có giá"}
                    <Button
                      type="link"
                      danger
                      onClick={() => handleDeleteSizeClick(size._id)}
                      style={{ marginLeft: 10 }}
                    >
                      Xóa kích thước
                    </Button>
                    {size.price !== 0 && (
                      <Button
                        type="link"
                        danger
                        onClick={() => handleDeletePriceClick(size._id)}
                        style={{ marginLeft: 10 }}
                      >
                        Xóa giá
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Phần cập nhật giá cho kích thước hiện có */}
          {editingProductId && sizes.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4>Cập nhật giá cho kích thước hiện có</h4>
              <Space>
                <Select
                  placeholder="Chọn kích thước"
                  value={updateSizeId}
                  onChange={(value) => setUpdateSizeId(value)}
                  style={{ width: 200 }}
                >
                  {sizes.map((size) => (
                    <Option key={size._id} value={size._id}>
                      {size.name} (
                      {size.price
                        ? `${size.price.toLocaleString()} VND`
                        : "Chưa có giá"}
                      )
                    </Option>
                  ))}
                </Select>
                <InputNumber
                  placeholder="Giá (VND)"
                  value={updatePrice}
                  onChange={(value) => setUpdatePrice(value)}
                  style={{ width: 200 }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  min={0}
                />
                <Button type="primary" onClick={handleUpdatePrice}>
                  Lưu giá
                </Button>
              </Space>
            </div>
          )}

          {/* Nút submit và hủy */}
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={loading}
            >
              {editingProductId ? "Cập nhật" : "Thêm"}
            </Button>
            <Button
              onClick={() => {
                setIsModalVisible(false);
                setNewSizes([]);
                form.resetFields();
                setNewSizeName("");
                setNewSizePrice(null);
                setUpdateSizeId(null);
                setUpdatePrice(null);
              }}
            >
              Hủy
            </Button>
          </div>
        </Modal>
      </Col>
    </Row>
  );
};

export default AdminProductManagePage;
