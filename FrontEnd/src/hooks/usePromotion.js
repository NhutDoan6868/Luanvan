import { useState, useEffect } from "react";
import { message } from "antd";
import {
  getAllPromotionsApi,
  getPromotionByIdApi,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../services/promotion.service";

const usePromotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách khuyến mãi
  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await getAllPromotionsApi();
      console.log("Fetch promotions response:", response);
      const promotionData = Array.isArray(response) ? response : [];
      setPromotions(promotionData);
      console.log("Set promotions:", promotionData);
      return promotionData;
    } catch (error) {
      console.error("Error fetching promotions:", error);
      message.error(error.message || "Lỗi khi lấy danh sách khuyến mãi");
      setPromotions([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Lấy thông tin khuyến mãi theo ID
  const fetchPromotionById = async (promotionId) => {
    setLoading(true);
    try {
      const response = await getPromotionByIdApi(promotionId);
      console.log("Fetch promotion by ID response:", response);
      setCurrentPromotion(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching promotion by ID:", error);
      message.error(error.message || "Lỗi khi lấy thông tin khuyến mãi");
      setCurrentPromotion(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Tạo khuyến mãi mới
  const handleCreatePromotion = async (promotionData) => {
    setLoading(true);
    try {
      const response = await createPromotion(promotionData);
      console.log("Create promotion response:", response);
      message.success(response.message || "Tạo khuyến mãi thành công");
      await fetchPromotions();
      return true;
    } catch (error) {
      console.error("Error creating promotion:", error);
      message.error(error.message || "Lỗi khi tạo khuyến mãi");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật khuyến mãi
  const handleUpdatePromotion = async (id, promotionData) => {
    setLoading(true);
    try {
      const response = await updatePromotion(id, promotionData);
      console.log("Update promotion response:", response);
      message.success(response.message || "Cập nhật khuyến mãi thành công");
      await fetchPromotions();
      return true;
    } catch (error) {
      console.error("Error updating promotion:", error);
      message.error(error.message || "Lỗi khi cập nhật khuyến mãi");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Xóa khuyến mãi
  const handleDeletePromotion = async (id) => {
    setLoading(true);
    try {
      const response = await deletePromotion(id);
      console.log("Delete promotion response:", response);
      message.success(response.message || "Xóa khuyến mãi thành công");
      await fetchPromotions();
      return true;
    } catch (error) {
      console.error("Error deleting promotion:", error);
      message.error(error.message || "Lỗi khi xóa khuyến mãi");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return {
    promotions,
    currentPromotion,
    loading,
    fetchPromotions,
    fetchPromotionById,
    handleCreatePromotion,
    handleUpdatePromotion,
    handleDeletePromotion,
  };
};

export default usePromotion;
