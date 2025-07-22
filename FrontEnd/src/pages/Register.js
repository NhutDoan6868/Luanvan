import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Alert,
  Typography,
  Col,
  Row,
  Image,
  message,
} from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { createUserApi } from "../utils/api";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function Register() {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate("/" + path);
  };

  const onFinish = async (values) => {
    setError(null);
    form.resetFields();
    const { fullName, email, password } = values;
    const res = await createUserApi(fullName, email, password);
    if (res && res.EC === 0) {
      message.success("Đăng ký thành công!");
      navigate("/login");
    } else if (res && res.EC === 1) {
      message.error(res.EM);
    }
  };

  return (
    <Row gutter={0} justify="center" align="middle" style={{ height: "100vh" }}>
      <Col
        span={14}
        style={{
          backgroundColor: "#f0f2f5",
          padding: "24px",
          borderRadius: "32px",
        }}
      >
        <Row
          justify="start"
          align="middle"
          style={{ fontSize: "24px", marginBottom: "16px" }}
        >
          <Col>
            <a onClick={() => handleNavigate("")}>
              <Image preview={false} width={40} height={45} src="logo_3.png" />
            </a>
          </Col>
          <Col style={{ padding: 5, fontSize: 15 }}>
            Đăng Ký Tài Khoản AquaBloom
          </Col>
        </Row>
        <hr />
        <Row justify={"center"} align="middle">
          <Col span={9}>
            <a onClick={() => handleNavigate("")}>
              <Image preview={false} width={"100%"} src="logo_3.png" />
            </a>
          </Col>
          <Col
            span={12}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Title level={2} style={{ marginBottom: "12px" }}>
              Đăng Ký
            </Title>
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{
                  marginBottom: "16px",
                  width: "100%",
                  maxWidth: "400px",
                }}
              />
            )}
            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              style={{
                width: "100%",
                maxWidth: "400px",
              }}
              initialValues={{ username: "", email: "", password: "" }}
            >
              <Form.Item
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên người dùng!",
                  },
                  { min: 3, message: "Tên ít nhất 3 ký tự!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Tên người dùng"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không đúng!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="btn-submit"
                >
                  Đăng Ký
                </Button>
              </Form.Item>
              <Form.Item>
                Đã có tài khoản?
                <a
                  onClick={() => handleNavigate("login")}
                  style={{ width: "100%" }}
                >
                  {" "}
                  Đăng nhập
                </a>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Register;
