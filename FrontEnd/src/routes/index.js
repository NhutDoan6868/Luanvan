// Pages
import AdminCategoryManagePage from "../pages/AdminCaterogyManage";
import AdminHomePage from "../pages/AdminHomePage";
import AdminOrderManagePage from "../pages/AdminOrderManage";
import AdminProductManagePage from "../pages/AdminProductManagePage";
import AdminPromotionManagePage from "../pages/AdminPromotionManagePage";
import AdminSubCategoryManagePage from "../pages/AdminSubCaterogyManagePage";
import AdminUserManagePage from "../pages/AdminUserManagePage";
import Cart from "../pages/Cart";
import CheckOutPage from "../pages/CheckOutPage";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProductDetails from "../pages/ProductDetails";
import ProfilePage from "../pages/ProfilePage";
import Register from "../pages/Register";
import Sales from "../pages/Sales";

const publicRoutes = [
  { path: "/register", component: Register, layout: null },
  { path: "/login", component: Login, layout: null },
  { path: "/", component: Home }, // Default route
  { path: "/details/:productId", component: ProductDetails },
  { path: "/sales", component: Sales },
  { path: "/cart", component: Cart },
  { path: "/profile", component: ProfilePage },
  { path: "/check-out", component: CheckOutPage },
  { path: "/admin-user-manage", component: AdminUserManagePage },
  { path: "/admin-category-manage", component: AdminCategoryManagePage },
  { path: "/admin-subcategory-manage", component: AdminSubCategoryManagePage },
  { path: "/admin-product-manage", component: AdminProductManagePage },
  { path: "/admin-promotion-manage", component: AdminPromotionManagePage },
  { path: "/admin-order-manage", component: AdminOrderManagePage },

  { path: "/admin-homepage", component: AdminHomePage },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
