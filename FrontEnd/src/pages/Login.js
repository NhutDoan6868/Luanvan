import React, { useContext, useEffect, useState } from "react";
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
  notification,
} from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { loginApi } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import { AuthContext } from "../components/AuthContext";

const { Title } = Typography;

function Login() {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate("/" + path);
  };

  const onFinish = async (values) => {
    try {
      setError(null);
      form.resetFields();
      const { email, password } = values;
      const res = await loginApi(email, password);
      console.log("Login API response:", res);
      if (res && res.EC === 0) {
        const token = res.data.token;
        console.log("Saving token to localStorage:", token);
        localStorage.setItem("token", token);
        console.log("Token saved, verifying:", localStorage.getItem("token"));
        setAuth({
          isAuthenticated: true,
          user: {
            id: res.data.user.id,
            email: res.data.user.email,
            fullName: res.data.user.fullName,
            avatar: res.data.user.avatar,
            isAdmin: res.data.user.isAdmin,
          },
        });
        notification.success({
          message: res.EM || "Đăng nhập thành công!",
        });
        navigate("/");
      } else if (res && res.EC === 1) {
        notification.error({
          message: "Đăng nhập thất bại!",
          description: res.EM,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      notification.error({
        message: "Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!",
      });
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: "100vh" }}>
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
            </a>{" "}
          </Col>
          <Col style={{ padding: 5, fontSize: 15 }}>
            Đăng Nhập Vào AquaBloom
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
              Đăng Nhập
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
              name="login"
              onFinish={onFinish}
              style={{
                width: "100%",
                maxWidth: "400px",
              }}
              initialValues={{ email: "", password: "" }}
            >
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
                  className="btn-submit"
                  type="primary"
                  htmlType="submit"
                  size="large"
                >
                  Đăng Nhập
                </Button>
              </Form.Item>
              <Form.Item>
                Chưa có tài khoản?
                <a
                  onClick={() => handleNavigate("register")}
                  style={{ width: "100%" }}
                >
                  {" "}
                  Đăng Ký
                </a>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Login;
