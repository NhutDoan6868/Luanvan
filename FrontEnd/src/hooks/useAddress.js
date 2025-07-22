// hooks/useAddress.js
import { useState, useCallback } from "react";
import { getAddressesByUser } from "../services/address.service";
import { message } from "antd";

const useAddress = (auth) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!auth?.user?.id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await getAddressesByUser(token);
      if (response.success) {
        setAddresses(response.data || []);
      } else {
        setAddresses([]);
        message.error(response.message || "Không thể tải danh sách địa chỉ");
      }
    } catch (error) {
      setAddresses([]);
      message.error("Lỗi khi tải danh sách địa chỉ: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [auth?.user?.id]);

  return { addresses, loading, fetchAddresses };
};

export default useAddress;
