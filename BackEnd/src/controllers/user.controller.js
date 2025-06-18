const {
  createUserService,
  loginUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} = require("../services/user.service");

const createUser = async (req, res) => {
  const { fullName, email, password, phone, role } = req.body;
  if (!fullName || !email || !password || !phone) {
    return res.status(400).json({
      message:
        "Vui lòng cung cấp đầy đủ thông tin: họ tên, email, mật khẩu, số điện thoại",
    });
  }

  try {
    const data = await createUserService({
      fullName,
      email,
      password,
      phone,
      role,
    });
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Vui lòng cung cấp email và mật khẩu",
    });
  }

  try {
    const data = await loginUserService({ email, password });
    if (!data.data) {
      return res.status(401).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const data = await getAllUsersService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getUserByIdService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp dữ liệu để cập nhật" });
  }

  try {
    const data = await updateUserService(id, updateData);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deleteUserService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
