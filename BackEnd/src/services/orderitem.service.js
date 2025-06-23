const OrderItem = require("../models/orderItem");
const Order = require("../models/order");
const Product = require("../models/product");

const createOrderItemService = async (orderItemData) => {
  try {
    const { orderId, productId, quantity, price } = orderItemData;

    // Kiểm tra các trường bắt buộc
    if (!orderId || !productId || !quantity || !price) {
      return {
        message:
          "Vui lòng cung cấp đầy đủ orderId, productId, quantity và price",
        data: null,
      };
    }

    // Kiểm tra quantity và price hợp lệ
    if (quantity < 1) {
      return {
        message: "Số lượng phải lớn hơn 0",
        data: null,
      };
    }
    if (price < 0) {
      return {
        message: "Giá không được âm",
        data: null,
      };
    }

    // Kiểm tra orderId tồn tại
    const order = await Order.findById(orderId);
    if (!order) {
      return {
        message: "Đơn hàng không tồn tại",
        data: null,
      };
    }

    // Kiểm tra productId tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return {
        message: "Sản phẩm không tồn tại",
        data: null,
      };
    }

    // Kiểm tra tồn kho
    if (product.quantity < quantity) {
      return {
        message: `Sản phẩm ${product.name} không đủ số lượng trong kho`,
        data: null,
      };
    }

    const orderItem = await OrderItem.create({
      orderId,
      productId,
      quantity,
      price,
    });

    // Cập nhật danh sách items trong Order
    await Order.findByIdAndUpdate(orderId, { $push: { items: orderItem._id } });

    // Cập nhật tồn kho
    await Product.findByIdAndUpdate(productId, {
      quantity: product.quantity - quantity,
    });

    return {
      message: "Tạo mục đơn hàng thành công",
      data: await OrderItem.findById(orderItem._id)
        .populate("orderId", "orderstatus")
        .populate("productId", "name"),
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo mục đơn hàng: " + error.message);
  }
};

const getAllOrderItemsService = async () => {
  try {
    const orderItems = await OrderItem.find()
      .populate("orderId", "orderstatus")
      .populate("productId", "name");
    return {
      message: "Lấy danh sách mục đơn hàng thành công",
      data: orderItems,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách mục đơn hàng: " + error.message);
  }
};

const getOrderItemByIdService = async (id) => {
  try {
    const orderItem = await OrderItem.findById(id)
      .populate("orderId", "orderstatus")
      .populate("productId", "name");
    if (!orderItem) {
      return {
        message: "Không tìm thấy mục đơn hàng",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin mục đơn hàng thành công",
      data: orderItem,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin mục đơn hàng: " + error.message);
  }
};

const getOrderItemsByOrderService = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return {
        message: "Đơn hàng không tồn tại",
        data: null,
      };
    }

    const orderItems = await OrderItem.find({ orderId })
      .populate("orderId", "orderstatus")
      .populate("productId", "name");
    return {
      message: "Lấy danh sách mục đơn hàng theo đơn hàng thành công",
      data: orderItems,
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi lấy danh sách mục đơn hàng theo đơn hàng: " + error.message
    );
  }
};

const updateOrderItemService = async (id, updateData) => {
  try {
    if (!Object.keys(updateData).length) {
      return {
        message: "Vui lòng cung cấp dữ liệu để cập nhật",
        data: null,
      };
    }

    // Kiểm tra mục đơn hàng tồn tại
    const orderItem = await OrderItem.findById(id);
    if (!orderItem) {
      return {
        message: "Không tìm thấy mục đơn hàng",
        data: null,
      };
    }

    // Kiểm tra quantity hợp lệ nếu được cập nhật
    if (updateData.quantity) {
      if (updateData.quantity < 1) {
        return {
          message: "Số lượng phải lớn hơn 0",
          data: null,
        };
      }
      const product = await Product.findById(orderItem.productId);
      const quantityDiff = updateData.quantity - orderItem.quantity;
      if (product.quantity < quantityDiff) {
        return {
          message: `Sản phẩm ${product.name} không đủ số lượng trong kho`,
          data: null,
        };
      }
      // Cập nhật tồn kho
      await Product.findByIdAndUpdate(orderItem.productId, {
        quantity: product.quantity - quantityDiff,
      });
    }

    // Kiểm tra price hợp lệ nếu được cập nhật
    if (updateData.price && updateData.price < 0) {
      return {
        message: "Giá không được âm",
        data: null,
      };
    }

    const updatedOrderItem = await OrderItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("orderId", "orderstatus")
      .populate("productId", "name");

    return {
      message: "Cập nhật mục đơn hàng thành công",
      data: updatedOrderItem,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật mục đơn hàng: " + error.message);
  }
};

const deleteOrderItemService = async (id) => {
  try {
    const orderItem = await OrderItem.findById(id);
    if (!orderItem) {
      return {
        message: "Không tìm thấy mục đơn hàng",
        data: null,
      };
    }

    // Kiểm tra trạng thái đơn hàng
    const order = await Order.findById(orderItem.orderId);
    if (
      order.orderstatus === "delivered" ||
      order.orderstatus === "cancelled"
    ) {
      return {
        message: "Không thể xóa mục đơn hàng từ đơn hàng đã giao hoặc đã hủy",
        data: null,
      };
    }

    // Khôi phục tồn kho
    const product = await Product.findById(orderItem.productId);
    await Product.findByIdAndUpdate(orderItem.productId, {
      quantity: product.quantity + orderItem.quantity,
    });

    // Xóa mục khỏi danh sách items trong Order
    await Order.findByIdAndUpdate(orderItem.orderId, { $pull: { items: id } });

    await OrderItem.findByIdAndDelete(id);
    return {
      message: "Xóa mục đơn hàng thành công",
      data: orderItem,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa mục đơn hàng: " + error.message);
  }
};

module.exports = {
  createOrderItemService,
  getAllOrderItemsService,
  getOrderItemByIdService,
  getOrderItemsByOrderService,
  updateOrderItemService,
  deleteOrderItemService,
};
