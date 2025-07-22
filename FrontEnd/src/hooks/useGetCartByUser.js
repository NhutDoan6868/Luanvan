import { useQuery } from "@tanstack/react-query";
import { getCartByUserApi } from "../services/cart.service";
import { notification } from "antd";

export const useGetCartByUser = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartByUserApi,
    retry: 0, // Không retry nếu yêu cầu thất bại
    onSuccess: (data) => {
      if (data.EC !== 0) {
        notification.error({
          message: "Lỗi",
          description: data.EM || "Không thể lấy giỏ hàng của người dùng",
        });
      }
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể lấy giỏ hàng của người dùng",
      });
    },
  });
  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
