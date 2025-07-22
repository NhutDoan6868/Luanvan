import axios from "./axios.customize";

// User
const createUserApi = (fullName, email, password) => {
  const URL_API = "/api/user/register";
  const data = {
    fullName,
    email,
    password,
  };
  return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
  const URL_API = "/api/user/login";
  const data = {
    email,
    password,
  };
  return axios.post(URL_API, data);
};

// Product
const getProductApi = (_id) => {
  const URL_API = `/api/product/${_id}`;
  return axios.get(URL_API);
};

const getProductsBySubcategoryApi = (subcategoryId) => {
  const URL_API = `/api/product?subcategoryId=${subcategoryId}`;
  return axios.get(URL_API);
};

const getProductsByCategoryApi = (categoryId) => {
  const URL_API = `/api/product?categoryId=${categoryId}`;
  return axios.get(URL_API);
};

const getAllProductApi = () => {
  const URL_API = `/api/product`;
  return axios.get(URL_API);
};

// Subcategory
const getSubcategoriesApi = () => {
  const URL_API = "/api/subcategory";
  return axios.get(URL_API);
};

// Category
const getCategoriesApi = () => {
  const URL_API = "/api/category";
  return axios.get(URL_API);
};

// Price
const getPricesByProductApi = (productId) => {
  const URL_API = `/api/price/product/${productId}`;
  return axios.get(URL_API);
};

//Image
const getImageByProductApi = (productId) => {
  const URL_API = `/api/image/product/${productId}`;
  return axios.get(URL_API);
};

//Promotions
const getPromoitonApi = () => {
  const URL_API = `/api/promotion`;
  return axios.get(URL_API);
};

//cart
const getCartByUserApi = () => {
  const URL_API = `/api/cart/user/me`;
  return axios.get(URL_API);
};

const addItemToCartApi=()=>{
  const URL_API = `/api/cart/items`;
  return axios.post(URL_API);
}

export {
  createUserApi,
  loginApi,
  getProductApi,
  getProductsBySubcategoryApi,
  getProductsByCategoryApi,
  getSubcategoriesApi,
  getCategoriesApi,
  getPricesByProductApi,
  getImageByProductApi,
  getPromoitonApi,
  getAllProductApi,
  getCartByUserApi,
  addItemToCartApi
};
