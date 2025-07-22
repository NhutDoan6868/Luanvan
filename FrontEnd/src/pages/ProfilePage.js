import {
  Alert,
  Avatar,
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  notification,
  Row,
  Upload,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { LockOutlined, MailOutlined, UploadOutlined } from "@ant-design/icons";
import { AuthContext } from "../components/AuthContext";
import {
  getAddressesByUser,
  updateAddress,
  createAddress,
  deleteAddress,
} from "../services/address.service";

function ProfilePage() {
  const { auth, setAuth } = useContext(AuthContext);
  const [avatar, setAvatar] = useState(auth?.user?.avatar);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [form] = Form.useForm();

  // Lấy danh sách địa chỉ khi component được mount
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await getAddressesByUser(token);
        if (response.success) {
          setAddresses(response.data);
        } else {
          message.error(response.message);
        }
      }
    };
    fetchAddresses();
  }, []);

  const showAvatarModal = () => {
    setIsAvatarModalVisible(true);
  };

  const handleAvatarOk = () => {
    setIsAvatarModalVisible(false);
  };

  const handleAvatarCancel = () => {
    setIsAvatarModalVisible(false);
  };

  const handleAvatarChange = (file) => {
    setAvatar(URL.createObjectURL(file));
    message.success("Ảnh Đại Diện Đã Được Thay Đổi!");
    handleAvatarOk();
  };

  const showAddressModal = (address = null) => {
    setSelectedAddress(address);
    if (address) {
      form.setFieldsValue(address);
    } else {
      form.resetFields();
    }
    setIsAddressModalVisible(true);
  };

  const handleAddressOk = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");
      let response;
      if (selectedAddress) {
        // Cập nhật địa chỉ
        response = await updateAddress(selectedAddress._id, values, token);
        if (response.success) {
          message.success("Cập nhật địa chỉ thành công!");
          setAddresses((prev) =>
            prev.map((addr) =>
              addr._id === selectedAddress._id ? { ...addr, ...values } : addr
            )
          );
        }
      } else {
        // Thêm địa chỉ mới
        response = await createAddress(values, token);
        if (response.success) {
          message.success("Thêm địa chỉ thành công!");
          setAddresses((prev) => [...prev, response.data]);
        }
      }
      if (!response.success) {
        message.error(response.message);
      }
      setIsAddressModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Lỗi khi xử lý địa chỉ!");
    }
  };

  const handleAddressCancel = () => {
    setIsAddressModalVisible(false);
    form.resetFields();
  };

  const handleDeleteAddress = (addressId) => {
    if (!addressId) {
      message.error("Không tìm thấy ID địa chỉ!");
      return;
    }
    Modal.confirm({
      title: "Xác nhận xóa địa chỉ",
      content: "Bạn có chắc chắn muốn xóa địa chỉ này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await deleteAddress(addressId, token);
          if (response.success) {
            message.success("Xóa địa chỉ thành công!");
            setAddresses((prev) =>
              prev.filter((addr) => addr._id !== addressId)
            );
          } else {
            message.error(response.message);
          }
        } catch (error) {
          message.error("Lỗi khi xóa địa chỉ!");
        }
      },
    });
  };

  return (
    <Row
      justify="center"
      align="top"
      style={{ width: "100%", height: "100vh", margin: 48 }}
    >
      <Col
        span={14}
        style={{
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "32px",
        }}
      >
        <Row
          justify="center"
          align="middle"
          style={{ fontSize: "24px", marginBottom: "16px" }}
        >
          <Col style={{ padding: 5, fontSize: 24 }}>Trang Cá Nhân</Col>
        </Row>
        <hr />
        <Row justify={"center"} align="middle">
          <Avatar
            style={{
              objectFit: "cover",
              cursor: "pointer",
              backgroundColor: "Highlight",
            }}
            size={128}
            src={avatar}
            onClick={showAvatarModal}
          ></Avatar>
        </Row>
        <Row justify={"center"} align="middle">
          <Col span={22} offset={1}>
            <Row justify="center" align="middle">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Tên người dùng">
                  {auth.user.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {auth?.user?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {addresses.length > 0 ? (
                    <>
                      {addresses.map((address) => (
                        <div key={address._id}>
                          {address.street}, {address.city}, {address.address}{" "}
                          <Button
                            type="link"
                            onClick={() => showAddressModal(address)}
                          >
                            Sửa
                          </Button>
                          <Button
                            type="link"
                            danger
                            onClick={() => handleDeleteAddress(address._id)}
                          >
                            Xóa
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="primary"
                        onClick={() => showAddressModal()}
                        style={{ marginTop: 8 }}
                      >
                        Thêm địa chỉ
                      </Button>
                    </>
                  ) : (
                    <>
                      Chưa có địa chỉ
                      <Button
                        type="primary"
                        onClick={() => showAddressModal()}
                        style={{ marginLeft: 8 }}
                      >
                        Thêm địa chỉ
                      </Button>
                    </>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Row>
          </Col>
        </Row>
        <Modal
          title="Chọn Ảnh"
          open={isAvatarModalVisible}
          onOk={handleAvatarOk}
          onCancel={handleAvatarCancel}
        >
          <Upload
            name="avatar"
            listType="picture"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={handleAvatarChange}
          >
            <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
          </Upload>
        </Modal>
        <Modal
          title={selectedAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
          open={isAddressModalVisible}
          onOk={handleAddressOk}
          onCancel={handleAddressCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="street"
              label="Đường"
              rules={[{ required: true, message: "Vui lòng nhập tên đường!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="city"
              label="Thành phố"
              rules={[{ required: true, message: "Vui lòng nhập thành phố!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="country"
              label="Quốc gia"
              rules={[{ required: true, message: "Vui lòng nhập Quốc gia!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="addressdetails"
              label="Địa chỉ bổ sung"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ bổ sung!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Col>
    </Row>
  );
}

export default ProfilePage;
