import { Col, Row, Alert } from "antd";
import CardProduct from "../components/CardProduct";
import { useGetSaleProduct } from "../hooks/useGetSaleProduct";

function Sales() {
  const { data, isLoading, error } = useGetSaleProduct();
  console.log("chech data", data);
  if (isLoading) return <div>Đang tải...</div>;
  if (error)
    return (
      <Alert
        message="Lỗi khi tải sản phẩm sale"
        description={error.message}
        type="error"
      />
    );
  if (!data?.data || data?.data.length === 0)
    return <div>Không có sản phẩm đang sale</div>;
  return (
    <Row>
      <Col span={20} offset={2}>
        <Row style={{ padding: "48px 0" }}>
          <Col span={24}>
            <Row>
              <Col span={24}>
                <h1 style={{ textAlign: "left", padding: 12 }}>
                  Sản Phẩm Đang Sale
                </h1>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              {data?.data?.map((product) => (
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

export default Sales;
