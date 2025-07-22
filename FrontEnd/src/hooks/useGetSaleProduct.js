import { useQuery } from "@tanstack/react-query";
import { getSaleProductApi } from "../services/productSale.service";

export const useGetSaleProduct = (isSale) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", isSale],
    queryFn: () => getSaleProductApi(isSale),
  });
  return {
    data,
    isLoading,
    error,
  };
};
