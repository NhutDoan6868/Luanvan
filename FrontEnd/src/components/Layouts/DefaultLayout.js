import { Layout } from "antd";
import Header from "./Header";
import Footer from "./Footer";

function DefaultLayout({ children }) {
  const { Content } = Layout;
  return (
    <Layout>
      <Header />

      <Layout hasSider>
        <Content>{children}</Content>
      </Layout>
      <Footer />
    </Layout>
  );
}
export default DefaultLayout;
