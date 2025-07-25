import { Col, Dropdown, Menu, Modal, Row } from "antd";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import "../styles/NavMenu.css"; // Import file CSS tùy chỉnh
import {
  LogoutOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import SearchBar from "./SearchBar";
import { AuthContext } from "./AuthContext";
function NavMenu() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate("/" + path);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOnClickSearch = () => {
    setIsModalOpen(true);
  };

  const menuItems = [
    {
      key: "products",
      label: "Sản Phẩm",
      path: "/products",
    },
    {
      key: "sales",
      label: "Khuyến Mãi",
      path: "/sales",
    },
    {
      key: "reviews",
      label: "Đánh Giá",
      path: "/reviews",
    },
  ];

  const items = [
    {
      key: "1",
      label: <a onClick={() => handleNavigate("profile")}>Trang Cá Nhân</a>,
    },
    {
      key: "2",
      label: (
        <a
          onClick={() => {
            localStorage.clear("token");
            setAuth({
              isAuthenticated: false,
              user: {
                id: "",
                email: "",
                fullName: "",
                isAdmin: false,
                avatar: "",
              },
            });

            navigate("/");
          }}
        >
          <LogoutOutlined /> Đăng Xuất
        </a>
      ),
    },
  ];
  const handleOnclick = (e) => {
    const findItem = (items, key) => {
      for (const item of items) {
        if (item.key === key) return item;
        if (item.children) {
          const found = findItem(item.children, key);
          if (found) return found;
        }
      }
      return null;
    };

    const item = findItem(menuItems, e.key);
    if (item && item.path) {
      navigate(item.path);
    }
  };
  const iconstyle = {
    fontSize: "24px",
    color: "#000",
    padding: "0 10px",
    cursor: "pointer",
  };

  return (
    <Row justify={"space-between"}>
      <Col span={10}>
        <Row justify={"space-between"} align="middle">
          <Menu
            mode="horizontal"
            items={menuItems}
            onClick={handleOnclick}
            className="full-width-submenu"
          />
        </Row>
      </Col>
      <Col span={3}>
        <Row>
          <Col style={iconstyle}>
            <SearchOutlined onClick={handleOnClickSearch} />
            <Modal
              title="Tìm Kiếm Sản Phẩm"
              closable={{ "aria-label": "Custom Close Button" }}
              onCancel={handleCancel}
              open={isModalOpen}
              width={1000}
              footer={null}
            >
              <SearchBar />
            </Modal>
          </Col>

          <Col style={iconstyle}>
            {!auth?.isAuthenticated ? (
              <UserOutlined onClick={() => handleNavigate("login")} />
            ) : (
              <Dropdown
                menu={{ items }}
                placement="bottom"
                arrow={{ pointAtCenter: true }}
              >
                <UserOutlined onClick={() => handleNavigate("profile")} />
              </Dropdown>
            )}
          </Col>
          <Col style={iconstyle}>
            <ShoppingCartOutlined
              onClick={() => {
                handleNavigate("cart");
              }}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default NavMenu;
