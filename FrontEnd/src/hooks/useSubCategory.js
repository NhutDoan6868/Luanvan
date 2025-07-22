import { useState, useEffect } from "react";
import { message } from "antd";
import {
  getAllSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../services/subCategory.service";

const useSubCategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách danh mục con
  const fetchSubcategories = async () => {
    setLoading(true);
    try {
      const data = await getAllSubcategories();
      console.log("API response:", data); // Log để kiểm tra
      setSubcategories(Array.isArray(data) ? data : data.data || []); // Xử lý cả hai trường hợp
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      message.error("Lỗi khi lấy danh sách danh mục con");
      setSubcategories([]); // Đặt subcategories về rỗng nếu lỗi
    } finally {
      setLoading(false);
    }
  };

  // Tạo danh mục con mới
  const handleCreateSubCategory = async (subcategoryData) => {
    setLoading(true);
    try {
      const data = await createSubcategory(subcategoryData);
      console.log("Create subcategory response:", data);
      message.success(data.message || "Tạo danh mục con thành công");
      await fetchSubcategories();
      return true;
    } catch (error) {
      console.error("Error creating subcategory:", error);
      message.error(error.message || "Lỗi khi tạo danh mục con");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật danh mục con
  const handleUpdateSubCategory = async (id, subcategoryData) => {
    setLoading(true);
    try {
      const data = await updateSubcategory(id, subcategoryData);
      console.log("Update subcategory response:", data);
      message.success(data.message || "Cập nhật danh mục con thành công");
      await fetchSubcategories();
      return true;
    } catch (error) {
      console.error("Error updating subcategory:", error);
      message.error(error.message || "Lỗi khi cập nhật danh mục con");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Xóa danh mục con
  const handleDeleteSubCategory = async (id) => {
    setLoading(true);
    try {
      const data = await deleteSubcategory(id);
      console.log("Delete subcategory response:", data);
      message.success(data.message || "Xóa danh mục con thành công");
      await fetchSubcategories();
      return true;
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      message.error(error.message || "Lỗi khi xóa danh mục con");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  return {
    subcategories,
    loading,
    fetchSubcategories,
    handleCreateSubCategory,
    handleUpdateSubCategory,
    handleDeleteSubCategory,
  };
};

export default useSubCategory;
