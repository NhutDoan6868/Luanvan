import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import {
  getAllProductApi,
  getProductByIdApi,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductSizesApi,
  createSizeApi,
  deleteSizeApi,
  setProductPrice,
  deletePriceApi,
} from "../services/product.service";

const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách sản phẩm
  const fetchProducts = useCallback(async () => {
    console.log("fetchProducts called");
    setLoading(true);
    try {
      const response = await getAllProductApi();
      console.log("Fetch products response:", response);
      setProducts(Array.isArray(response) ? response : response || []);
      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error(error.message || "Lỗi khi lấy danh sách sản phẩm");
      setProducts([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy thông tin sản phẩm theo ID
  const fetchProductById = useCallback(async (productId) => {
    console.log("fetchProductById called with:", productId);
    setLoading(true);
    try {
      const response = await getProductByIdApi(productId);
      console.log("Fetch product by ID response:", response);
      setCurrentProduct(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      message.error(error.message || "Lỗi khi lấy thông tin sản phẩm");
      setCurrentProduct(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy danh sách kích thước của sản phẩm
  const fetchProductSizes = useCallback(async (productId) => {
    console.log("fetchProductSizes called with:", productId);
    setLoading(true);
    try {
      const response = await getProductSizesApi(productId);
      console.log("Fetch product sizes response:", response);
      setSizes(Array.isArray(response) ? response : response || []);
      return response;
    } catch (error) {
      console.error("Error fetching product sizes:", error);
      message.error(error.message || "Lỗi khi lấy danh sách kích thước");
      setSizes([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Tạo sản phẩm mới
  const handleCreateProduct = useCallback(
    async (productData) => {
      console.log("handleCreateProduct called with:", productData);
      setLoading(true);
      try {
        const response = await createProduct(productData);
        console.log("Create product response:", response);
        message.success(response.message || "Tạo sản phẩm thành công");
        await fetchProducts();
        return response.data; // Trả về dữ liệu sản phẩm để lấy _id
      } catch (error) {
        console.error("Error creating product:", error);
        message.error(error.message || "Lỗi khi tạo sản phẩm");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  // Cập nhật sản phẩm
  const handleUpdateProduct = useCallback(
    async (id, productData) => {
      console.log("handleUpdateProduct called with:", id, productData);
      setLoading(true);
      try {
        const response = await updateProduct(id, productData);
        console.log("Update product response:", response);
        message.success(response.message || "Cập nhật sản phẩm thành công");
        await fetchProducts();
        return true;
      } catch (error) {
        console.error("Error updating product:", error);
        message.error(error.message || "Lỗi khi cập nhật sản phẩm");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  // Xóa sản phẩm
  const handleDeleteProduct = useCallback(
    async (id) => {
      console.log("handleDeleteProduct called with:", id);
      setLoading(true);
      try {
        const response = await deleteProduct(id);
        console.log("Delete product response:", response);
        message.success(response.message || "Xóa sản phẩm thành công");
        await fetchProducts();
        return true;
      } catch (error) {
        console.error("Error deleting product:", error);
        message.error(error.message || "Lỗi khi xóa sản phẩm");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  // Tạo kích thước mới
  const handleCreateSize = useCallback(
    async (productId, sizeData) => {
      console.log("handleCreateSize called with:", productId, sizeData);
      setLoading(true);
      try {
        const response = await createSizeApi(productId, sizeData);
        console.log("Create size response:", response);
        message.success(response.message || "Tạo kích thước thành công");
        await fetchProductSizes(productId);
        return response.data;
      } catch (error) {
        console.error("Error creating size:", error);
        message.error(error.message || "Lỗi khi tạo kích thước");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchProductSizes]
  );

  // Xóa kích thước
  const handleDeleteSize = useCallback(
    async (productId, sizeId) => {
      console.log("handleDeleteSize called with:", productId, sizeId);
      setLoading(true);
      try {
        const response = await deleteSizeApi(productId, sizeId);
        console.log("Delete size response:", response);
        message.success(response.message || "Xóa kích thước thành công");
        await fetchProductSizes(productId);
        return true;
      } catch (error) {
        console.error("Error deleting size:", error);
        message.error(error.message || "Lỗi khi xóa kích thước");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchProductSizes]
  );

  // Thiết lập giá cho sản phẩm theo size
  const handleSetProductPrice = useCallback(
    async (productId, priceData) => {
      console.log("handleSetProductPrice called with:", productId, priceData);
      setLoading(true);
      try {
        const response = await setProductPrice(productId, priceData);
        console.log("Set product price response:", response);
        message.success(
          response.message || "Thiết lập giá sản phẩm thành công"
        );
        await fetchProducts();
        await fetchProductSizes(productId);
        return true;
      } catch (error) {
        console.error("Error setting product price:", error);
        message.error(error.message || "Lỗi khi thiết lập giá sản phẩm");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts, fetchProductSizes]
  );

  // Xóa giá
  const handleDeletePrice = useCallback(
    async (productId, sizeId) => {
      console.log("handleDeletePrice called with:", productId, sizeId);
      setLoading(true);
      try {
        const response = await deletePriceApi(productId, sizeId);
        console.log("Delete price response:", response);
        message.success(response.message || "Xóa giá thành công");
        await fetchProducts();
        await fetchProductSizes(productId);
        return true;
      } catch (error) {
        console.error("Error deleting price:", error);
        message.error(error.message || "Lỗi khi xóa giá");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts, fetchProductSizes]
  );

  useEffect(() => {
    console.log("useEffect triggered for fetchProducts");
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    currentProduct,
    sizes,
    setSizes,
    loading,
    fetchProducts,
    fetchProductById,
    fetchProductSizes,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleCreateSize,
    handleDeleteSize,
    handleSetProductPrice,
    handleDeletePrice,
  };
};

export default useProduct;
