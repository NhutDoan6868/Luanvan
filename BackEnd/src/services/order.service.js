const Order = require("../models/order");
const User = require("../models/user");
const Address = require("../models/address");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");
const Payment = require("../models/payment");
const OrderItem = require("../models/orderItem");
const Price = require("../models/price");
const ProductPromotion = require("../models/product_promotion");
const Product = require("../models/product");

const createOrderService = async (orderData, userId) => {
  try {
    const { shippingAddress, paymentMethod, items } = orderData;
    console.log("Received orderData:", orderData);
    console.log("User ID:", userId);

    // Kiểm tra các trường bắt buộc
    if (
      !shippingAddress ||
      !paymentMethod ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      console.log("Validation failed: Missing or invalid fields", {
        shippingAddress,
        paymentMethod,
        items,
      });
      return {
        message:
          "Vui lòng cung cấp địa chỉ giao hàng, phương thức thanh toán và danh sách sản phẩm",
        data: null,
      };
    }

    // Kiểm tra userId tồn tại
    const user = await User.findById(userId);
    if (!user) {
      console.log("Validation failed: User not found", { userId });
      return {
        message: "Người dùng không tồn tại",
        data: null,
      };
    }

    // Kiểm tra địa chỉ giao hàng
    const address = await Address.findById(shippingAddress);
    if (!address || address.userId.toString() !== userId) {
      console.log("Validation failed: Invalid or unauthorized address", {
        shippingAddress,
        userId,
      });
      return {
        message:
          "Địa chỉ giao hàng không hợp lệ hoặc không thuộc về người dùng",
        data: null,
      };
    }

    // Lấy danh sách CartItem được chọn
    const cartItems = await CartItem.find({ _id: { $in: items } }).populate({
      path: "productId",
      select: "name quantity",
    });

    if (cartItems.length !== items.length) {
      console.log("Validation failed: Invalid cart items", {
        items,
        cartItems,
      });
      return {
        message: "Một số mục trong giỏ hàng không hợp lệ",
        data: null,
      };
    }

    // Tính tổng giá
    let total_Price = 0;
    const orderItems = [];

    // Tạo đơn hàng trước để lấy orderId
    const order = await Order.create({
      userId,
      items: [], // Sẽ cập nhật sau
      total_Price: 0, // Sẽ cập nhật sau
      orderstatus: "pending",
      shippingAddress,
      paymentId: null, // Sẽ cập nhật sau
    });

    // Tạo OrderItem với orderId hợp lệ
    for (const item of cartItems) {
      const priceData = await Price.findOne({ sizeId: item.sizeId });
      if (!priceData) {
        console.log("Validation failed: Price not found for product", {
          productId: item.productId.name,
        });
        return {
          message: `Không tìm thấy giá cho sản phẩm ${item.productId.name}`,
          data: null,
        };
      }
      if (item.productId.quantity < item.quantity) {
        console.log("Validation failed: Insufficient stock for product", {
          productId: item.productId.name,
        });
        return {
          message: `Sản phẩm ${item.productId.name} không đủ số lượng trong kho`,
          data: null,
        };
      }

      // Lấy thông tin khuyến mãi
      const currentDate = new Date();
      const productPromotions = await ProductPromotion.find({
        productId: item.productId._id,
      })
        .populate({
          path: "promotionId",
          match: {
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate },
          },
          select: "name discount startDate endDate",
        })
        .lean();

      const validPromotion = productPromotions.find((pp) => pp.promotionId);
      const promotion =
        validPromotion && validPromotion.promotionId
          ? {
              name: validPromotion.promotionId.name,
              discount: validPromotion.promotionId.discount,
              discountedPrice:
                priceData.price > 0
                  ? priceData.price *
                    (1 - validPromotion.promotionId.discount / 100)
                  : 0,
              startDate: validPromotion.promotionId.startDate,
              endDate: validPromotion.promotionId.endDate,
            }
          : null;

      // Tính giá cho sản phẩm (sử dụng giá khuyến mãi nếu có)
      const itemPrice = promotion ? promotion.discountedPrice : priceData.price;
      total_Price += itemPrice * item.quantity;

      // Tạo OrderItem với orderId
      const orderItem = await OrderItem.create({
        orderId: order._id, // Sử dụng orderId ngay từ đầu
        productId: item.productId._id,
        quantity: item.quantity,
        price: itemPrice, // Lưu giá đã áp dụng khuyến mãi
      });
      orderItems.push(orderItem._id);

      // Cập nhật soldQuantity và quantity trong Product
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: {
          soldQuantity: item.quantity, // Tăng số lượng đã bán
        },
      });
    }

    // Tạo thanh toán
    const payment = await Payment.create({
      amount: total_Price,
      paymentStatus: "pending",
      paymentMethod,
      orderId: order._id,
    });

    // Cập nhật Order với items và total_Price
    await Order.findByIdAndUpdate(order._id, {
      items: orderItems,
      total_Price,
      paymentId: payment._id,
    });

    // Xóa các CartItem đã chọn
    await CartItem.deleteMany({ _id: { $in: items } });

    // Cập nhật Cart
    const cart = await Cart.findOne({ userId });
    if (cart) {
      let totalDeduction = 0;
      for (const item of cartItems) {
        const priceData = await Price.findOne({ sizeId: item.sizeId });
        const productPromotions = await ProductPromotion.find({
          productId: item.productId._id,
        })
          .populate({
            path: "promotionId",
            match: {
              startDate: { $lte: new Date() },
              endDate: { $gte: new Date() },
            },
            select: "discount",
          })
          .lean();

        const validPromotion = productPromotions.find((pp) => pp.promotionId);
        const itemPrice =
          validPromotion && validPromotion.promotionId
            ? priceData.price * (1 - validPromotion.promotionId.discount / 100)
            : priceData.price;
        totalDeduction += itemPrice * item.quantity;
      }
      cart.amount = (cart.amount || 0) - totalDeduction;
      cart.amount = Math.max(0, cart.amount); // Đảm bảo amount không âm
      console.log("Updating cart amount:", cart.amount);
      await cart.save();
    }

    // Trả về kết quả
    return {
      message: "Tạo đơn hàng thành công",
      data: await Order.findById(order._id)
        .populate("userId", "fullName")
        .populate("shippingAddress", "street city")
        .populate({
          path: "items",
          populate: { path: "productId", select: "name" },
        })
        .populate("paymentId", "paymentStatus paymentMethod"),
    };
  } catch (error) {
    console.error("Error in createOrderService:", error);
    throw new Error("Lỗi khi tạo đơn hàng: " + error.message);
  }
};
// Các hàm khác giữ nguyên
const getAllOrdersService = async () => {
  try {
    const orders = await Order.find()
      .populate("userId", "fullName")
      .populate("shippingAddress", "street city")
      .populate({
        path: "items",
        populate: { path: "productId", select: "name" },
      })
      .populate("paymentId", "paymentStatus paymentMethod");
    return {
      message: "Lấy danh sách đơn hàng thành công",
      data: orders,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách đơn hàng: " + error.message);
  }
};

const getOrderByIdService = async (id, userId, userRole) => {
  try {
    const order = await Order.findById(id)
      .populate("userId", "fullName")
      .populate("shippingAddress", "street city")
      .populate({
        path: "items",
        populate: { path: "productId", select: "name" },
      })
      .populate("paymentId", "paymentStatus paymentMethod");
    if (!order) {
      return {
        message: "Không tìm thấy đơn hàng",
        data: null,
      };
    }
    if (userRole !== "admin" && order.userId._id.toString() !== userId) {
      return {
        message: "Bạn không có quyền xem đơn hàng này",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin đơn hàng thành công",
      data: order,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin đơn hàng: " + error.message);
  }
};

const getOrdersByUserService = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        message: "Người dùng không tồn tại",
        data: null,
      };
    }

    const orders = await Order.find({ userId })
      .populate("userId", "fullName")
      .populate("shippingAddress", "street city")
      .populate({
        path: "items",
        populate: { path: "productId", select: "name" },
      })
      .populate("paymentId", "paymentStatus paymentMethod");
    return {
      message: "Lấy danh sách đơn hàng của người dùng thành công",
      data: orders,
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi lấy danh sách đơn hàng của người dùng: " + error.message
    );
  }
};

const updateOrderService = async (id, updateData, userId, userRole) => {
  try {
    if (!Object.keys(updateData).length) {
      return {
        message: "Vui lòng cung cấp dữ liệu để cập nhật",
        data: null,
      };
    }

    const order = await Order.findById(id);
    if (!order) {
      return {
        message: "Không tìm thấy đơn hàng",
        data: null,
      };
    }

    if (userRole !== "admin" && order.userId.toString() !== userId) {
      return {
        message: "Bạn không có quyền chỉnh sửa đơn hàng này",
        data: null,
      };
    }

    if (updateData.orderstatus) {
      const validStatuses = [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(updateData.orderstatus)) {
        return {
          message: "Trạng thái đơn hàng không hợp lệ",
          data: null,
        };
      }
      if (["delivered", "cancelled"].includes(order.orderstatus)) {
        return {
          message: "Không thể cập nhật đơn hàng đã giao hoặc đã hủy",
          data: null,
        };
      }
    }

    if (updateData.shippingAddress) {
      const address = await Address.findById(updateData.shippingAddress);
      if (!address || address.userId.toString() !== order.userId.toString()) {
        return {
          message:
            "Địa chỉ giao hàng không hợp lệ hoặc không thuộc về người dùng",
          data: null,
        };
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("userId", "fullName")
      .populate("shippingAddress", "street city")
      .populate({
        path: "items",
        populate: { path: "productId", select: "name" },
      })
      .populate("paymentId", "paymentStatus paymentMethod");

    return {
      message: "Cập nhật đơn hàng thành công",
      data: updatedOrder,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật đơn hàng: " + error.message);
  }
};

const deleteOrderService = async (id, userId, userRole) => {
  try {
    const order = await Order.findById(id);
    if (!order) {
      return {
        message: "Không tìm thấy đơn hàng",
        data: null,
      };
    }

    if (userRole !== "admin" && order.userId.toString() !== userId) {
      return {
        message: "Bạn không có quyền xóa đơn hàng này",
        data: null,
      };
    }

    if (order.orderstatus === "delivered") {
      return {
        message: "Không thể xóa đơn hàng đã giao",
        data: null,
      };
    }

    if (order.paymentId) {
      await Payment.findByIdAndDelete(order.paymentId);
    }

    await OrderItem.deleteMany({ _id: { $in: order.items } });
    await Order.findByIdAndDelete(id);
    return {
      message: "Xóa đơn hàng thành công",
      data: order,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa đơn hàng: " + error.message);
  }
};

module.exports = {
  createOrderService,
  getAllOrdersService,
  getOrderByIdService,
  getOrdersByUserService,
  updateOrderService,
  deleteOrderService,
};
