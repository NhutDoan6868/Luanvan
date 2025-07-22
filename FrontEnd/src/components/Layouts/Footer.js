import { Layout, Row, Col, Typography, Space, Divider } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  InstagramOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const Footer = () => {
  const { Footer } = Layout;
  return (
    <Layout>
      <Footer
        style={{
          width: "100%",
          backgroundColor: "#fffbbb",
          padding: "40px 20px",
        }}
      >
        <Row gutter={[16, 16]} justify="space-between">
          <Col xs={24} sm={8} justify="center" align="middle">
            <Title level={4} style={{ color: "#6c757d" }}>
              AquaBloom
            </Title>
          </Col>

          <Col xs={24} sm={5}>
            <Title level={5} style={{ color: "#000" }}>
              Công ty
            </Title>
            <Space direction="vertical" style={{ display: "flex" }}>
              <Text>Giới thiệu về chúng tôi</Text>
              <Text>AquaBloom</Text>
              <Text>Các loại cây thủy sinh</Text>
              <Text>Sản phẩm thủy sinh nổi bật</Text>
              <Text>Tư vấn thiết kế hồ thủy sinh</Text>
              <Text>Bộ sưu tập hồ thủy sinh đẹp</Text>
              <Text>Kiến thức thủy sinh cơ bản</Text>
              <Text>Chính sách bảo hành & đổi trả</Text>
            </Space>
          </Col>

          <Col xs={24} sm={8}>
            <Title level={5} style={{ color: "#000" }}>
              Hỗ trợ & Dịch vụ
            </Title>
            <Space direction="vertical" style={{ display: "flex" }}>
              <Text>Câu hỏi thường gặp</Text>
              <Text>Liên hệ</Text>
              <Text>Tin tức thủy sinh</Text>
            </Space>

            <div style={{ marginTop: "95px" }}></div>

            <Title level={5} style={{ color: "#000" }}>
              Pháp lý
            </Title>
            <Space direction="vertical" style={{ display: "flex" }}>
              <Text>Điều khoản sử dụng</Text>
              <Text>Chính sách bảo mật</Text>
              <Text>Cài đặt cookie</Text>
              <Text>Tuyên bố về cookie</Text>
            </Space>
          </Col>
        </Row>

        <Divider style={{ margin: "20px 0" }} />

        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Text>© 2025 AquaBloom, Bản quyền thuộc về AquaBloom</Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <Text>Tiếng Việt</Text>
              <Text>|</Text>
              <Text>Việt Nam</Text>
            </Space>
          </Col>
        </Row>

        <Row justify="center" style={{ marginTop: "20px" }}>
          <Space>
            <FacebookOutlined style={{ fontSize: "24px", color: "#6c757d" }} />
            <TwitterOutlined style={{ fontSize: "24px", color: "#6c757d" }} />
            <LinkedinOutlined style={{ fontSize: "24px", color: "#6c757d" }} />
            <YoutubeOutlined style={{ fontSize: "24px", color: "#6c757d" }} />
            <InstagramOutlined style={{ fontSize: "24px", color: "#6c757d" }} />
          </Space>
        </Row>
      </Footer>
    </Layout>
  );
};

export default Footer;
