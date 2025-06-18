const Address = require("../models/address");
const User = require("../models/user");

const createAddressService = async (addressData, userId) => {
  try {
    const { street, city, state, zipCode, country } = addressData;

    // Kiểm tra các trường bắt buộc
    if (!street || !city || !state || !zipCode || !country) {
      return {
        message:
          "Vui lòng cung cấp đầy đủ thông tin: đường, thành phố, tỉnh, mã bưu điện, quốc gia",
        data: null,
      };
    }

    // Kiểm tra định dạng zipCode
    const zipCodeRegex = /^\d{5,10}$/;
    if (!zipCodeRegex.test(zipCode)) {
      return {
        message: "Mã bưu điện không hợp lệ, phải chứa từ 5 đến 10 chữ số",
        data: null,
      };
    }

    // Kiểm tra userId tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return {
        message: "Người dùng không tồn tại",
        data: null,
      };
    }

    const address = await Address.create({
      street,
      city,
      state,
      zipCode,
      country,
      userId,
    });

    return {
      message: "Tạo địa chỉ thành công",
      data: await Address.findById(address._id).populate("userId", "fullName"),
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo địa chỉ: " + error.message);
  }
};

const getAllAddressesService = async () => {
  try {
    const addresses = await Address.find().populate("userId", "fullName");
    return {
      message: "Lấy danh sách địa chỉ thành công",
      data: addresses,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách địa chỉ: " + error.message);
  }
};

const getAddressByIdService = async (id, userId, userRole) => {
  try {
    const address = await Address.findById(id).populate("userId", "fullName");
    if (!address) {
      return {
        message: "Không tìm thấy địa chỉ",
        data: null,
      };
    }
    if (userRole !== "admin" && address.userId._id.toString() !== userId) {
      return {
        message: "Bạn không có quyền xem địa chỉ này",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin địa chỉ thành công",
      data: address,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin địa chỉ: " + error.message);
  }
};

const getAddressesByUserService = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        message: "Người dùng không tồn tại",
        data: null,
      };
    }

    const addresses = await Address.find({ userId }).populate(
      "userId",
      "fullName"
    );
    return {
      message: "Lấy danh sách địa chỉ của người dùng thành công",
      data: addresses,
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi lấy danh sách địa chỉ của người dùng: " + error.message
    );
  }
};

const updateAddressService = async (id, updateData, userId) => {
  try {
    if (!Object.keys(updateData).length) {
      return {
        message: "Vui lòng cung cấp dữ liệu để cập nhật",
        data: null,
      };
    }

    // Kiểm tra địa chỉ tồn tại
    const address = await Address.findById(id);
    if (!address) {
      return {
        message: "Không tìm thấy địa chỉ",
        data: null,
      };
    }

    // Kiểm tra quyền chỉnh sửa
    if (address.userId.toString() !== userId) {
      return {
        message: "Bạn không có quyền chỉnh sửa địa chỉ này",
        data: null,
      };
    }

    // Kiểm tra định dạng zipCode nếu được cập nhật
    if (updateData.zipCode) {
      const zipCodeRegex = /^\d{5,10}$/;
      if (!zipCodeRegex.test(updateData.zipCode)) {
        return {
          message: "Mã bưu điện không hợp lệ, phải chứa từ 5 đến 10 chữ số",
          data: null,
        };
      }
    }

    const updatedAddress = await Address.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("userId", "fullName");

    return {
      message: "Cập nhật địa chỉ thành công",
      data: updatedAddress,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật địa chỉ: " + error.message);
  }
};

const deleteAddressService = async (id, userId) => {
  try {
    const address = await Address.findById(id);
    if (!address) {
      return {
        message: "Không tìm thấy địa chỉ",
        data: null,
      };
    }

    // Kiểm tra quyền xóa
    if (address.userId.toString() !== userId) {
      return {
        message: "Bạn không có quyền xóa địa chỉ này",
        data: null,
      };
    }

    // Kiểm tra liên kết với đơn hàng
    const Order = require("../models/order");
    const relatedOrder = await Order.findOne({ shippingAddress: id });
    if (relatedOrder) {
      return {
        message: "Không thể xóa địa chỉ vì đang được sử dụng trong đơn hàng",
        data: null,
      };
    }

    await Address.findByIdAndDelete(id);
    return {
      message: "Xóa địa chỉ thành công",
      data: address,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa địa chỉ: " + error.message);
  }
};

module.exports = {
  createAddressService,
  getAllAddressesService,
  getAddressByIdService,
  getAddressesByUserService,
  updateAddressService,
  deleteAddressService,
};
