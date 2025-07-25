import { Col, Row, Select } from "antd";
import CardProduct from "../components/CardProduct";
import useProduct from "../hooks/useProduct";

const { Option } = Select;

function ProductsPage() {
  const { products, fetchProductsWithFilter, loading } = useProduct();
  console.log(products);
  const handleFilterChange = (value) => {
    const [sortBy, order] = value.split("-");
    fetchProductsWithFilter(sortBy, order);
  };

  return (
    <Row>
      <Col span={20} offset={2}>
        <Row style={{ padding: "48px 0" }}>
          <Col span={24}>
            <Row>
              <Col span={12}>
                <h1 style={{ textAlign: "left", padding: 12 }}>
                  Tất Cả Sản Phẩm
                </h1>
              </Col>
              <Col
                span={5}
                offset={6}
                style={{ textAlign: "right", padding: 12 }}
              >
                <Row align={"middle"} justify={"center"}>
                  <Col span={12}>
                    <h4 style={{ padding: 5 }}>Lọc Sản Phẩm:</h4>
                  </Col>
                  <Col span={12}>
                    <Select
                      defaultValue="none"
                      style={{ width: 155, textAlign: "center" }}
                      onChange={handleFilterChange}
                      loading={loading}
                    >
                      <Option value="none">Không sắp xếp</Option>
                      <Option value="name-asc">Tên: A-Z</Option>
                      <Option value="name-desc">Tên: Z-A</Option>
                      <Option value="price-asc">Giá: Thấp đến Cao</Option>
                      <Option value="price-desc">Giá: Cao đến Thấp</Option>
                      <Option value="soldQuantity-desc">Bán chạy nhất</Option>
                    </Select>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              {products.map((product) => (
                <Col span={6} key={product._id}>
                  <CardProduct Product={product} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default ProductsPage;
