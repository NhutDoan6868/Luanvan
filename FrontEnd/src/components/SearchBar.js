import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate("/" + path);
  };
  return (
    <Input
      style={{
        width: "100%",
        borderRadius: 100,
        padding: "15px 20px",
        paddingLeft: 55,
      }}
      placeholder="Tìm kiếm sản phẩm..."
      suffix={
        <SearchOutlined
          onClick={() => handleNavigate("hehe")}
          style={{ fontSize: 20, color: "#40C4FF" }}
        />
      }
    ></Input>
  );
}
export default SearchBar;
