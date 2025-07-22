import { Col, Layout, Row } from "antd";
import { useNavigate } from "react-router-dom";
import NavMenu from "../NavMenu";

function Header() {
  const navigate = useNavigate();
  const { Header } = Layout;

  const handleNavigate = (path) => {
    navigate("/" + path);
  };
  return (
    <Layout>
      <Header
        style={{
          backgroundColor: "",
          height: "100%",
          width: "100%",
          padding: 0,
        }}
      >
        <Col gutter={0} style={{ height: "100%" }}>
          <Row
            gutter={0}
            style={{
              backgroundColor: "#18608FCC",
              lineHeight: "32px",
            }}
          >
            <Col
              span={10}
              offset={5}
              style={{
                height: "100%",
              }}
            >
              <p style={{ color: "white", margin: 7, fontSize: 15 }}>
                Địa chỉ: Cần Thơ, Việt Nam
              </p>
            </Col>
            <Col>
              <p style={{ color: "white", margin: 7, fontSize: 15 }}>
                Email: AquaBloom@gmail.com
              </p>
            </Col>
          </Row>
          <Row style={{ backgroundColor: "#fff" }} align="middle">
            <Col
              span={5}
              offset={2}
              style={{
                justify: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <a onClick={() => handleNavigate("")}>
                <img style={{ width: 300 }} src="/logo.png" alt="Logo" />
              </a>
            </Col>
            <Col span={15} offset={2}>
              <NavMenu />
            </Col>
          </Row>
        </Col>
      </Header>
    </Layout>
  );
}
export default Header;
