import { Col, Layout, Row } from "antd";
import CardProduct from "../components/CardProduct";

import { useEffect, useState } from "react";
import { useGetSaleProduct } from "../hooks/useGetSaleProduct";

function Sales() {
  const [isSale, setIsSale] = useState(true);

  const { data, isLoading, error } = useGetSaleProduct(isSale);

  if (isLoading) return <div> ...Loading</div>;
  if (!data) return <div>Không có sp đang Sale</div>;
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
              {data.map((product) => (
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
