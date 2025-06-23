const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUserService = async (userData) => {
  try {
    const { email, password, fullName, phone } = userData;

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
        message: "Email đã được sử dụng",
        data: null,
      };
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      return {
        message: "Mật khẩu phải có ít nhất 6 ký tự",
        data: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    // Loại bỏ mật khẩu khỏi dữ liệu trả về
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return {
      message: "Đăng ký người dùng thành công",
      data: userWithoutPassword,
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo người dùng: " + error.message);
  }
};

const loginUserService = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        message: "Email hoặc mật khẩu không đúng",
        data: null,
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
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
      message: "Đăng nhập thành công",
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
};
