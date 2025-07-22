import { useEffect, useState } from "react";
import { Typography, Spin, Alert, Row, Col } from "antd";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import CardProduct from "./CardProduct";
import "../styles/GroupedProductsBySubcategory.css";

const { Title } = Typography;

function GroupedProductsBySubcategory({ categoryId }) {
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8080/api/product/grouped-by-subcategory",
          {
            params: categoryId ? { categoryId } : {},
          }
        );
        setGroupedProducts(response.data.data || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi lấy dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupedProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  if (!groupedProducts.length) {
    return (
      <Alert
        message="Thông báo"
        description="Không tìm thấy sản phẩm nào."
        type="info"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  return (
    <div className="grouped-products-container">
      <Row gutter={[0, 24]}>
        <Col span={20} offset={2}>
          {groupedProducts.map((group) => (
            <div key={group.subcategory._id} className="subcategory-section">
              <Title level={1} style={{ margin: "20px 0 10px" }}>
                {group.subcategory.name}
              </Title>
              <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={4}
                slidesPerGroup={1} // Thêm dòng này để mỗi lần nhấn navigation chỉ chuyển 1 card
                navigation
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    slidesPerGroup: 1, // Chuyển 1 card trên màn hình nhỏ
                    spaceBetween: 16,
                  },
                  768: {
                    slidesPerView: 3,
                    slidesPerGroup: 1, // Chuyển 1 card trên màn hình trung
                    spaceBetween: 16,
                  },
                  1024: {
                    slidesPerView: 4,
                    slidesPerGroup: 1, // Chuyển 1 card trên màn hình lớn
                    spaceBetween: 16,
                  },
                  2048: {
                    slidesPerView: 4,
                    slidesPerGroup: 1, // Chuyển 1 card trên màn hình rất lớn
                    spaceBetween: 16,
                  },
                }}
                className="product-swiper"
              >
                {group.products.map((product) => (
                  <SwiperSlide key={product._id} className="swiper-slide-full">
                    <CardProduct Product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
}

export default GroupedProductsBySubcategory;
