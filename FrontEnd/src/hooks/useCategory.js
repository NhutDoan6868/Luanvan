import { useState, useEffect } from "react";
import { message } from "antd";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service";

const useCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách danh mục
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      console.log("Fetch categories response:", data); // Log để kiểm tra dữ liệu trả về
      const categoryList = Array.isArray(data) ? data : data.data || [];
      setCategories(categoryList);
      if (categoryList.length === 0) {
        message.warning("Không tìm thấy danh mục nào");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error(error.message || "Lỗi khi lấy danh sách danh mục");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Tạo danh mục mới
  const handleCreateCategory = async (categoryData) => {
    setLoading(true);
    try {
      const data = await createCategory(categoryData);
      console.log("Create category response:", data);
      message.success(data.message || "Tạo danh mục thành công");
      await fetchCategories();
      return true;
    } catch (error) {
      console.error("Error creating category:", error);
      message.error(error.message || "Lỗi khi tạo danh mục");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật danh mục
  const handleUpdateCategory = async (id, categoryData) => {
    setLoading(true);
    try {
      const data = await updateCategory(id, categoryData);
      console.log("Update category response:", data);
      message.success(data.message || "Cập nhật danh mục thành công");
      await fetchCategories();
      return true;
    } catch (error) {
      console.error("Error updating category:", error);
      message.error(error.message || "Lỗi khi cập nhật danh mục");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Xóa danh mục
  const handleDeleteCategory = async (id) => {
    setLoading(true);
    try {
      const data = await deleteCategory(id);
      console.log("Delete category response:", data);
      message.success(data.message || "Xóa danh mục thành công");
      await fetchCategories();
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error(error.message || "Lỗi khi xóa danh mục");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    fetchCategories,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  };
};

export default useCategory;
