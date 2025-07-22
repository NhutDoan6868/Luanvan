import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addItemToCartApi, getCartByUserApi } from "../services/cart.service";
import { notification } from "antd";

export const useAddItemToCart = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ productId, quantity, sizeId }) =>
      addItemToCartApi({ productId, quantity, sizeId }),
    onSuccess: (data) => {
      notification.success({
        message: "Thành công",
        description: data.message || "Thêm sản phẩm vào giỏ hàng thành công",
      });
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể thêm sản phẩm vào giỏ hàng",
      });
    },
  });

  return {
    addItemToCart: mutation.mutate,
    isLoading: mutation.isPending, // Sử dụng isPending thay vì isLoading (React Query v5)
    error: mutation.error,
  };
};
