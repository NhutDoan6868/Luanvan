import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../services/user.service";

export const useGetAllUser = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers,
  });
  return {
    data,
    isLoading,
    error,
  };
};
