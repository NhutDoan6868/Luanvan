import { useQuery } from "@tanstack/react-query";
import { getSaleProductApi } from "../services/productSale.service";

export const useGetSaleProduct = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["saleProducts"],
    queryFn: () => getSaleProductApi(),
  });
  return {
    data,
    isLoading,
    error,
  };
};
