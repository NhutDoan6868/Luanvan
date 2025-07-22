import { useQuery } from "@tanstack/react-query";
import { getProductByIdApi } from "../services/product.service";

export const useGetProductById = (productId) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductByIdApi(productId),
  });
  return {
    data,
    isLoading,
    error,
  };
};
