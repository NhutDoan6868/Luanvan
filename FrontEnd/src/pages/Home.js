import { Col, Layout, Row } from "antd";
import CardProduct from "../components/CardProduct";
import ProductCarousel from "../components/ProductCarousel";
import { useEffect, useState } from "react";
import GroupedProductsBySubcategory from "../components/GroupedProductsBySubcategory";

function Home() {
  return (
    <Layout>
      <Col>
        <Row style={{ marginBottom: "24px" }}>
          <Col span={24}>
            <ProductCarousel />
          </Col>
        </Row>

        <Row>
          <Col>
            <GroupedProductsBySubcategory />
          </Col>
        </Row>
      </Col>
    </Layout>
  );
}

export default Home;
