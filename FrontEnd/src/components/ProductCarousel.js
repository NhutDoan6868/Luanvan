import { Carousel } from "antd";
import "antd/dist/reset.css";

const contentStyle = {
  margin: 0,
  height: "300px",
  color: "#fff",
  lineHeight: "300px",
  textAlign: "center",
  background: "#364d79",
};
function ProductCarousel() {
  const onChange = (currentSlide) => {};
  return (
    <Carousel afterChange={onChange} autoplay arrows>
      <div>
        <img
          src="carousel2.jpg"
          alt="Slide 1"
          style={{ height: 500, width: "100%", objectFit: "cover" }}
        />
      </div>
      <div>
        <img
          src="carousel1.jpg"
          alt="Slide 2 "
          style={{ height: 500, width: "100%", objectFit: "cover" }}
        />
      </div>
      <div>
        <img
          src="carousel3.jpg"
          alt="Slide 3"
          style={{ height: 500, width: "100%", objectFit: "cover" }}
        />
      </div>
    </Carousel>
  );
}
export default ProductCarousel;
