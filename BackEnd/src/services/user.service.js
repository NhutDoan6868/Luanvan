const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUserService = async (userData) => {
  try {
    const { email, password, fullName, phone, avatar = "" } = userData; // Gán giá trị mặc định cho avatar

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        message: "Email không hợp lệ",
        data: null,
      };
    }

    // Kiểm tra người dùng tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        EC: 1,
        EM: `Email ${email} đã được sử dụng`,
      };
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      return {
        message: "Mật khẩu phải có ít nhất 6 ký tự",
        data: null,
      };
    }

    const defaultAvatar =
      "http://localhost:8080/public/images/default-avatar.png";
    const userAvatar = avatar || defaultAvatar;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...userData,
      password: hashedPassword,
      avatar: userAvatar,
    });

    // Loại bỏ mật khẩu khỏi dữ liệu trả về
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return {
      EC: 0,
      EM: "Đăng ký người dùng thành công",
      data: userWithoutPassword,
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo người dùng: " + error.message);
  }
};

const createAdminService = async (
  email,
  password,
  fullName,
  phone,
  role,
  avatar = ""
) => {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return {
        EC: 0,
        EM: `Email ${email} đã được sử dụng`,
      };
    }
    const defaultAvatar =
      "http://localhost:8080/public/images/default-avatar.png";
    const userAvatar = avatar || defaultAvatar;

    const hashPassword = await bcrypt.hash(password, 10);

    let result = await User.create({
      email: email,
      password: hashPassword,
      fullName: fullName,
      avatar: userAvatar,
      role: role,
      phone: phone,
      isAdmin: true,
    });

    return {
      EC: 0,
      EM: "Đăng ký thành công",
      data: result,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 2,
      EM: "Đã xảy ra lỗi trong quá trình đăng ký",
    };
  }
};

const loginUserService = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        EC: 1,
        message: "Email hoặc mật khẩu không đúng",
        data: null,
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        EC: 1,
        message: "Email hoặc mật khẩu không đúng",
        data: null,
      };
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return {
      EC: 0,
      EM: "Đăng nhập thành công",
      data: { user: userWithoutPassword, token },
    };
  } catch (error) {
    throw new Error("Lỗi khi đăng nhập: " + error.message);
  }
};

const getAllUsersService = async () => {
  try {
    const users = await User.find().select("-password"); // Loại bỏ mật khẩu
    return {
      message: "Lấy danh sách người dùng thành công",
      data: users,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách người dùng: " + error.message);
  }
};

const getUserByIdService = async (id) => {
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return {
        message: "Không tìm thấy người dùng",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin người dùng thành công",
      data: user,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin người dùng: " + error.message);
  }
};

const updateUserService = async (id, updateData) => {
  try {
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        return {
          message: "Email không hợp lệ",
          data: null,
        };
      }
      const existingUser = await User.findOne({ email: updateData.email });
      if (existingUser && existingUser._id.toString() !== id) {
        return {
          message: "Email đã được sử dụng",
          data: null,
        };
      }
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return {
        message: "Không tìm thấy người dùng",
        data: null,
      };
    }
    return {
      message: "Cập nhật thông tin người dùng thành công",
      data: user,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật người dùng: " + error.message);
  }
};

const deleteUserService = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id).select("-password");
    if (!user) {
      return {
        message: "Không tìm thấy người dùng",
        data: null,
      };
    }
    return {
      message: "Xóa người dùng thành công",
      data: user,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa người dùng: " + error.message);
  }
};

module.exports = {
  createUserService,
  loginUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  createAdminService,
};
