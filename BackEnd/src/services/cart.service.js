const Cart = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/product");
const CartItem = require("../models/cartItem");
const Size = require("../models/size");
const Price = require("../models/price");
const ProductPromotion = require("../models/product_promotion");
const mongoose = require("mongoose");

const createCartService = async (userId) => {
  try {
    // Kiểm tra userId tồn tại
    const user = await User.findById(userId);
    console.log("CHeck user", user);
    if (!user) {
      return {
        message: "Người dùng không tồn tại",
        data: null,
      };
    }

    // Kiểm tra xem người dùng đã có giỏ hàng chưa
    const existingCart = await Cart.findOne({ userId }).populate(
      "userId",
      "fullName"
    );
    console.log("check cart", existingCart);
    if (existingCart) {
      return {
        message: "Người dùng đã có giỏ hàng",
        data: existingCart,
      };
    }

    const cart = await Cart.create({ userId, items: [] });

    return {
      message: "Tạo giỏ hàng thành công",
      data: await Cart.findById(cart._id).populate("userId", "fullName"),
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo giỏ hàng: " + error.message);
  }
};

const addItemToCartService = async (userId, itemData) => {
  try {
    const { productId, quantity, sizeId } = itemData;
    console.log("item", itemData);
    // Kiểm tra các trường bắt buộc
    if (!sizeId) {
      return {
        message:
          "Vui lòng cung cấp đầy đủ ID sản phẩm, số lượng và ID kích thước",
        data: null,
      };
    }

    // Kiểm tra quantity hợp lệ
    if (quantity < 1) {
      return {
        message: "Số lượng phải lớn hơn 0",
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

    // Kiểm tra số lượng tồn kho
    if (product.quantity < quantity) {
      return {
        message: `Số lượng sản phẩm trong kho không đủ. Chỉ còn ${product.quantity} sản phẩm.`,
        data: null,
      };
    }

    // Kiểm tra sizeId tồn tại và liên kết với sản phẩm
    const size = await Size.findOne({ _id: sizeId, productId });
    if (!size) {
      return {
        message: "Kích thước không tồn tại hoặc không thuộc sản phẩm này",
        data: null,
      };
    }

    // Lấy giá sản phẩm từ Price dựa trên sizeId
    const priceData = await Price.findOne({ sizeId });
    if (!priceData) {
      return {
        message: "Sản phẩm với kích thước này chưa có giá",
        data: null,
      };
    }

    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // Tạo giỏ hàng mới với amount ban đầu là 0
      cart = await Cart.create({ userId, amount: 0 });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItem = await CartItem.findOne({
      cartId: cart._id,
      productId,
      sizeId,
    });

    let updatedCart;
    if (existingItem) {
      // Kiểm tra tổng số lượng (hiện tại + thêm mới) so với tồn kho
      const newQuantity = existingItem.quantity + quantity;
      if (product.quantity < newQuantity) {
        return {
          message: `Số lượng yêu cầu vượt quá tồn kho. Chỉ còn ${product.quantity} sản phẩm.`,
          data: null,
        };
      }
      // Cập nhật số lượng nếu sản phẩm đã tồn tại
      await CartItem.findByIdAndUpdate(existingItem._id, {
        quantity: newQuantity,
      });
      // Cập nhật amount của giỏ hàng
      cart.amount += priceData.price * quantity;
      await cart.save();
      updatedCart = cart;
    } else {
      // Tạo mục mới trong giỏ hàng
      const cartItem = await CartItem.create({
        productId,
        cartId: cart._id,
        quantity,
        sizeId,
      });
      // Cập nhật amount của giỏ hàng
      cart.amount += priceData.price * quantity;
      await cart.save();
      updatedCart = cart;
    }

    // Trả về giỏ hàng với thông tin chi tiết
    return {
      message: "Thêm sản phẩm vào giỏ hàng thành công",
      data: await Cart.findById(cart._id).populate("userId", "fullName"),
    };
  } catch (error) {
    throw new Error("Lỗi khi thêm sản phẩm vào giỏ hàng: " + error.message);
  }
};

const getAllCartsService = async () => {
  try {
    const carts = await Cart.find().populate("userId", "fullName");
    return {
      message: "Lấy danh sách giỏ hàng thành công",
      data: carts,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách giỏ hàng: " + error.message);
  }
};

const getCartByIdService = async (id, userId, userRole) => {
  try {
    const cart = await Cart.findById(id)
      .populate("userId", "fullName")
      .populate({
        path: "items",
        populate: { path: "productId", select: "name" },
      });
    if (!cart) {
      return {
        message: "Không tìm thấy giỏ hàng",
        data: null,
      };
    }
    if (userRole !== "admin" && cart.userId._id.toString() !== userId) {
      return {
        message: "Bạn không có quyền xem giỏ hàng này",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin giỏ hàng thành công",
      data: cart,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin giỏ hàng: " + error.message);
  }
};

const getCartByUserService = async (userId) => {
  try {
    // Kiểm tra userId tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return {
        message: "Người dùng không tồn tại",
        data: null,
      };
    }

    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId }).populate("userId", "fullName");
    if (!cart) {
      return {
        message: "Người dùng chưa có giỏ hàng",
        data: null,
      };
    }

    // Lấy các mục trong giỏ hàng từ CartItem
    const cartItems = await CartItem.find({ cartId: cart._id })
      .populate("productId", "name imageURL")
      .populate("sizeId", "name");
    console.log(
      "Cart Items:",
      cartItems.map((item) => item.productId)
    );

    // Lấy tất cả ProductPromotion liên quan đến các productId trong giỏ hàng
    const productIds = cartItems.map((item) => item.productId._id);
    const currentDate = new Date();
    console.log("Current Date:", currentDate);
    const productPromotions = await ProductPromotion.find({
      productId: { $in: productIds },
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
    console.log("Product Promotions:", productPromotions);

    // Tạo map để tra cứu nhanh ProductPromotion theo productId
    const promotionMap = new Map();
    productPromotions.forEach((pp) => {
      if (pp.promotionId) {
        const productIdStr = pp.productId.toString();
        const existing = promotionMap.get(productIdStr);
        if (
          !existing ||
          new Date(pp.promotionId.startDate) >
            new Date(existing.promotionId.startDate)
        ) {
          promotionMap.set(productIdStr, pp);
        }
      }
    });
    console.log("Promotion Map:", Array.from(promotionMap.entries()));

    // Lấy price và tính giá giảm cho mỗi CartItem
    const cartItemsWithPrice = await Promise.all(
      cartItems.map(async (item) => {
        // Kiểm tra sizeId hợp lệ
        if (!item.sizeId) {
          console.error(`CartItem ${item._id} không có sizeId hợp lệ`);
          return {
            ...item.toObject(),
            price: 0,
            discountedPrice: 0,
            priceError: "Không tìm thấy kích thước",
            promotion: null,
          };
        }

        // Tìm giá dựa trên sizeId
        const price = await Price.findOne({ sizeId: item.sizeId });
        if (!price) {
          console.error(
            `Không tìm thấy giá cho sizeId ${item.sizeId} trong CartItem ${item._id}`
          );
          return {
            ...item.toObject(),
            price: 0,
            discountedPrice: 0,
            priceError: "Không tìm thấy giá cho kích thước này",
            promotion: null,
          };
        }

        // Kiểm tra khuyến mãi cho sản phẩm
        const productPromotion = promotionMap.get(
          item.productId._id.toString()
        );
        console.log(
          `Product Promotion for ${item.productId._id}:`,
          productPromotion
        );
        let discountedPrice = price.price;
        let promotion = null;

        if (productPromotion && productPromotion.promotionId) {
          const discount = productPromotion.promotionId.discount;
          discountedPrice = price.price * (1 - discount / 100);
          promotion = {
            name: productPromotion.promotionId.name,
            discount: productPromotion.promotionId.discount,
            startDate: productPromotion.promotionId.startDate,
            endDate: productPromotion.promotionId.endDate,
          };
        }

        return {
          ...item.toObject(),
          price: price.price,
          discountedPrice: discountedPrice,
          promotion: promotion,
        };
      })
    );

    return {
      message: "Lấy giỏ hàng của người dùng thành công",
      data: { ...cart.toObject(), items: cartItemsWithPrice },
    };
  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    throw new Error("Lỗi khi lấy giỏ hàng của người dùng: " + error.message);
  }
};

const updateCartItemService = async (cartId, itemId, updateData, userId) => {
  try {
    const { quantity } = updateData;
    console.log("Starting updateCartItemService", {
      cartId,
      itemId,
      quantity,
      userId,
    });

    // Kiểm tra trường bắt buộc
    if (!quantity) {
      console.log("Missing quantity");
      return {
        message: "Vui lòng cung cấp số lượng để cập nhật",
        data: null,
      };
    }

    // Kiểm tra quantity hợp lệ
    if (quantity < 1) {
      console.log("Invalid quantity", { quantity });
      return {
        message: "Số lượng phải lớn hơn 0",
        data: null,
      };
    }

    // Kiểm tra định dạng ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(cartId) ||
      !mongoose.Types.ObjectId.isValid(itemId)
    ) {
      console.log("Invalid ObjectId", { cartId, itemId });
      return {
        message: "ID giỏ hàng hoặc mục không hợp lệ",
        data: null,
      };
    }

    // Kiểm tra giỏ hàng tồn tại
    console.log("Finding cart", { cartId });
    const cart = await Cart.findById(cartId);
    if (!cart) {
      console.log("Cart not found", { cartId });
      return {
        message: "Không tìm thấy giỏ hàng",
        data: null,
      };
    }

    // Kiểm tra quyền chỉnh sửa
    if (cart.userId.toString() !== userId) {
      console.log("Unauthorized", { userId, cartUserId: cart.userId });
      return {
        message: "Bạn không có quyền chỉnh sửa giỏ hàng này",
        data: null,
      };
    }

    // Kiểm tra mục tồn tại
    console.log("Finding cartItem", { itemId });
    const cartItem = await CartItem.findById(itemId)
      .populate("productId")
      .populate("sizeId");
    if (!cartItem) {
      console.log("CartItem not found", { itemId });
      return {
        message: "Không tìm thấy mục trong giỏ hàng",
        data: null,
      };
    }

    // Kiểm tra số lượng tồn kho
    console.log("Checking product stock", {
      productId: cartItem.productId?._id,
    });
    const product = await Product.findById(cartItem.productId);
    if (!product) {
      console.log("Product not found", { productId: cartItem.productId });
      return {
        message: "Sản phẩm không tồn tại",
        data: null,
      };
    }
    if (product.quantity < quantity) {
      console.log("Insufficient stock", {
        productQuantity: product.quantity,
        requestedQuantity: quantity,
      });
      return {
        message: `Số lượng yêu cầu vượt quá tồn kho. Chỉ còn ${product.quantity} sản phẩm.`,
        data: null,
      };
    }

    // Lấy giá sản phẩm
    console.log("Finding price", { sizeId: cartItem.sizeId });
    const priceData = await Price.findOne({ sizeId: cartItem.sizeId });
    if (!priceData) {
      console.log("Price not found", { sizeId: cartItem.sizeId });
      return {
        message: "Không tìm thấy giá cho kích thước này",
        data: null,
      };
    }

    // Tính toán thay đổi amount
    const oldQuantity = cartItem.quantity;
    const quantityDifference = quantity - oldQuantity;
    const amountChange = priceData.price * quantityDifference;
    console.log("Updating amount", {
      oldQuantity,
      newQuantity: quantity,
      amountChange,
    });

    // Cập nhật số lượng của CartItem
    console.log("Updating cartItem", { itemId, quantity });
    await CartItem.findByIdAndUpdate(itemId, { quantity });

    // Cập nhật amount của giỏ hàng
    cart.amount = Math.max(0, cart.amount + amountChange);
    console.log("Saving cart", { cartId, newAmount: cart.amount });
    await cart.save();

    // Lấy dữ liệu giỏ hàng sau khi cập nhật
    console.log("Fetching updated cart", { cartId });
    const updatedCart = await Cart.findById(cartId).populate(
      "userId",
      "fullName"
    );

    return {
      message: "Cập nhật mục trong giỏ hàng thành công",
      data: updatedCart,
    };
  } catch (error) {
    console.error("Error in updateCartItemService:", {
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Lỗi khi cập nhật mục trong giỏ hàng: " + error.message);
  }
};

const removeItemFromCartService = async (cartId, itemId, userId) => {
  try {
    console.log("Starting removeItemFromCartService", {
      cartId,
      itemId,
      userId,
    });

    // Kiểm tra định dạng ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(cartId) ||
      !mongoose.Types.ObjectId.isValid(itemId)
    ) {
      console.log("Invalid ObjectId", { cartId, itemId });
      return {
        message: "ID giỏ hàng hoặc mục không hợp lệ",
        data: null,
      };
    }

    // Kiểm tra giỏ hàng tồn tại
    const cart = await Cart.findById(cartId);
    if (!cart) {
      console.log("Cart not found", { cartId });
      return {
        message: "Không tìm thấy giỏ hàng",
        data: null,
      };
    }

    console.log("Cart found", {
      cartId,
      userId: cart.userId,
    });

    // Kiểm tra quyền xóa
    if (cart.userId.toString() !== userId) {
      console.log("Unauthorized access", { userId, cartUserId: cart.userId });
      return {
        message: "Bạn không có quyền xóa mục trong giỏ hàng này",
        data: null,
      };
    }

    // Kiểm tra mục tồn tại
    const cartItem = await CartItem.findById(itemId);
    if (!cartItem) {
      console.log("CartItem not found", { itemId });
      return {
        message: "Không tìm thấy mục trong giỏ hàng",
        data: null,
      };
    }
    console.log("CartItem found", {
      itemId,
      sizeId: cartItem.sizeId,
      quantity: cartItem.quantity,
    });

    // Lấy giá sản phẩm từ Price dựa trên sizeId
    const priceData = await Price.findOne({ sizeId: cartItem.sizeId });
    if (!priceData) {
      console.log("Price not found for sizeId", { sizeId: cartItem.sizeId });
      return {
        message: "Không tìm thấy giá cho kích thước của sản phẩm này",
        data: null,
      };
    }
    console.log("Price found", {
      sizeId: cartItem.sizeId,
      price: priceData.price,
    });

    // Tính toán giá trị cần trừ
    const amountToSubtract = priceData.price * cartItem.quantity;
    console.log("Amount to subtract", {
      amountToSubtract,
      price: priceData.price,
      quantity: cartItem.quantity,
    });

    // Xóa mục khỏi CartItem
    await CartItem.findByIdAndDelete(itemId);
    console.log("CartItem deleted", { itemId });

    // Cập nhật amount của giỏ hàng
    cart.amount = Math.max(0, cart.amount - amountToSubtract);
    await cart.save();
    console.log("Cart updated", {
      cartId,
      items: cart.items,
      amount: cart.amount,
    });

    return {
      message: "Xóa mục khỏi giỏ hàng thành công",
      data: await Cart.findById(cartId).populate("userId", "fullName"),
    };
  } catch (error) {
    console.error("Error in removeItemFromCartService:", {
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Lỗi khi xóa mục khỏi giỏ hàng: " + error.message);
  }
};

const deleteCartService = async (id, userId) => {
  try {
    const cart = await Cart.findById(id);
    if (!cart) {
      return {
        message: "Không tìm thấy giỏ hàng",
        data: null,
      };
    }

    // Kiểm tra quyền xóa
    if (cart.userId.toString() !== userId) {
      return {
        message: "Bạn không có quyền xóa giỏ hàng này",
        data: null,
      };
    }

    // Xóa tất cả CartItem liên quan
    await CartItem.deleteMany({ _id: { $in: cart.items } });
    await Cart.findByIdAndDelete(id);

    return {
      message: "Xóa giỏ hàng thành công",
      data: cart,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa giỏ hàng: " + error.message);
  }
};

module.exports = {
  createCartService,
  addItemToCartService,
  getAllCartsService,
  getCartByIdService,
  getCartByUserService,
  updateCartItemService,
  removeItemFromCartService,
  deleteCartService,
};
