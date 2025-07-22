import { useState, useEffect } from "react";
import { message } from "antd";
import {
  getAllUsers,
  getUserInfoApi,
  createUser,
  updateUser,
  deleteUser,
} from "../services/user.service";

const useUser = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      console.log("API response:", data); // Log để kiểm tra
      setUsers(Array.isArray(data) ? data : data.data || []); // Xử lý cả hai trường hợp
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Lỗi khi lấy danh sách người dùng");
      setUsers([]); // Đặt users về rỗng nếu lỗi
    } finally {
      setLoading(false);
    }
  };

  // Tạo người dùng mới
  const handleCreateUser = async (userData) => {
    setLoading(true);
    try {
      const data = await createUser(userData);
      console.log("Create user response:", data);
      message.success(data.message || "Tạo người dùng thành công");
      await fetchUsers();
      return true;
    } catch (error) {
      console.error("Error creating user:", error);
      message.error(error.message || "Lỗi khi tạo người dùng");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật người dùng
  const handleUpdateUser = async (id, userData) => {
    setLoading(true);
    try {
      const data = await updateUser(id, userData);
      console.log("Update user response:", data);
      message.success(data.message || "Cập nhật người dùng thành công");
      await fetchUsers();
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      message.error(error.message || "Lỗi khi cập nhật người dùng");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Xóa người dùng
  const handleDeleteUser = async (id) => {
    setLoading(true);
    try {
      const data = await deleteUser(id);
      console.log("Delete user response:", data);
      message.success(data.message || "Xóa người dùng thành công");
      await fetchUsers();
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error(error.message || "Lỗi khi xóa người dùng");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    currentUser,
    loading,
    fetchUsers,

    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
  };
};

export default useUser;
