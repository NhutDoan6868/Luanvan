import React, { createContext, useState, useEffect } from "react";
import { getUserInfoApi } from "../services/user.service";
import { notification, Spin } from "antd";

export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    id: "",
    email: "",
    fullName: "",
    avatar: "",
    role: "",
    isAdmin: false,
  },
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      id: "",
      email: "",
      fullName: "",
      avatar: "",
      role: "",
      isAdmin: false,
    },
  });
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      console.log("Initializing auth with token:", token);
      if (!token || token === "null") {
        console.log("No valid token found in localStorage");
        setAppLoading(false);
        return;
      }

      try {
        const res = await getUserInfoApi();
        console.log("Full API response:", JSON.stringify(res, null, 2));
        console.log("Response message:", res?.message);
        console.log("Response data:", res?.data);
        let userData = null;
        if (res && res.EC === 0 && res.data && res.data.user) {
          userData = res.data.user;
        } else if (
          res &&
          res.message === "Lấy thông tin người dùng thành công" &&
          res.data
        ) {
          userData = res.data;
        } else if (res && res.data) {
          userData = res.data;
        } else if (res && res._id) {
          userData = res; // Xử lý trường hợp dữ liệu nằm trực tiếp trong res
        } else {
          console.error(
            "Unexpected API response structure:",
            JSON.stringify(res, null, 2)
          );
        }

        console.log("Extracted userData:", userData);
        if (userData && (userData._id || userData.id) && userData.email) {
          const newAuthState = {
            isAuthenticated: true,
            user: {
              id: userData._id || userData.id || "",
              email: userData.email || "",
              fullName: userData.fullName || "Admin",
              avatar:
                userData.avatar ||
                "http://localhost:8080/public/images/default-avatar.png",
              role: userData.role || "user",
              isAdmin: userData.isAdmin || userData.role === "admin",
            },
          };
          setAuth(newAuthState);
          console.log("Auth state updated:", newAuthState);
        } else {
          console.error(
            "Invalid user data, userData:",
            userData,
            "Full response:",
            JSON.stringify(res, null, 2)
          );
          setAuth({
            isAuthenticated: false,
            user: {
              id: "",
              email: "",
              fullName: "",
              avatar: "",
              role: "",
              isAdmin: false,
            },
          });
          notification.error({
            message: "Lỗi",
            description: `Dữ liệu không hợp lệ: ${JSON.stringify(userData)}`,
          });
        }
      } catch (error) {
        console.error(
          "Error fetching user info:",
          error.message,
          error.response?.data
        );
        setAuth({
          isAuthenticated: false,
          user: {
            id: "",
            email: "",
            fullName: "",
            avatar: "",
            role: "",
            isAdmin: false,
          },
        });
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Lỗi kết nối server. Vui lòng thử lại!";
        if (
          error.response?.status === 401 ||
          error.response?.status === 403 ||
          errorMessage.includes("Không tìm thấy token")
        ) {
          localStorage.removeItem("token");
          console.log(
            "Token removed, current token:",
            localStorage.getItem("token")
          );
          notification.error({
            message: "Lỗi",
            description: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!",
          });
          window.location.href = "/login";
        } else {
          notification.error({
            message: "Lỗi",
            description: errorMessage,
          });
        }
      }
      setAppLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        appLoading,
        setAppLoading,
      }}
    >
      {appLoading ? (
        <Spin
          size="large"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        />
      ) : (
        props.children
      )}
    </AuthContext.Provider>
  );
};
