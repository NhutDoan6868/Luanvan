const Card = require("../models/card");
const CardItem = require("../models/carditem");
const User = require("../models/user");
const Product = require("../models/product");

const createCardService = async (userId) => {
  try {
    // Kiểm tra userId tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return {
        message: "Người dùng không tồn tại",
        data: null,
      };
    }

    // Kiểm tra xem người dùng đã có giỏ hàng chưa
    const existingCard = await Card.findOne({ userId });
    if (existingCard) {
      return {
        message: "Người dùng đã có giỏ hàng",
        data: existingCard,
      };
    }

    const card = await Card.create({ userId, items: [] });

    return {
      message: "Tạo giỏ hàng thành công",
      data: await Card.findById(card._id).populate("userId", "fullName"),
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo giỏ hàng: " + error.message);
  }
};

const addItemToCardService = async (userId, itemData) => {
  try {
    const { productId, quantity } = itemData;

    // Kiểm tra các trường bắt buộc
    if (!productId || !quantity) {
      return {
        message: "Vui lòng cung cấp ID sản phẩm và số lượng",
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

    // Lấy giá sản phẩm từ Price
    const Price = require("../models/price");
    const priceData = await Price.findOne({ productId });
    if (!priceData) {
      return {
        message: "Sản phẩm chưa có giá",
        data: null,
      };
    }

    // Tìm giỏ hàng của người dùng
    let card = await Card.findOne({ userId }).populate({
      path: "items",
      populate: { path: "productId", select: "name" },
    });
    if (!card) {
      card = await Card.create({ userId, items: [] });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItem = card.items.find(
      (item) => item.productId._id.toString() === productId
    );
    if (existingItem) {
      // Cập nhật số lượng
      await CardItem.findByIdAndUpdate(existingItem._id, {
        quantity: existingItem.quantity + quantity,
      });
    } else {
      // Tạo mục mới
      const cardItem = await CardItem.create({
        productId,
        quantity,
        price: priceData.price,
      });
      card.items.push(cardItem._id);
      await card.save();
    }

    return {
      message: "Thêm sản phẩm vào giỏ hàng thành công",
      data: await Card.findById(card._id)
        .populate("userId", "fullName")
        .populate({
          path: "items",
          populate: { path: "productId", select: "name" },
        }),
    };
  } catch (error) {
    throw new Error("Lỗi khi thêm sản phẩm vào giỏ hàng: " + error.message);
  }
};

const getAllCardsService = async () => {
  try {
    const cards = await Card.find()
      .populate("userId", "fullName")
      .populate({
        path: "items",
        populate: { path: "productId", select: "name" },
      });
    return {
      message: "Lấy danh sách giỏ hàng thành công",
      data: cards,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách giỏ hàng: " + error.message);
  }
};

const getCardByIdService = async (id, userId, userRole) => {
  try {
    const card = await Card.findById(id)
      .populate("userId", "fullName")
      .populate({
        path: "items",
        populate: { path: "productId", select: "name" },
      });
    if (!card) {
      return {
        message: "Không tìm thấy giỏ hàng",
        data: null,
      };
    }
    if (userRole !== "admin" && card.userId._id.toString() !== userId) {
      return {
        message: "Bạn không có quyền xem giỏ hàng này",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin giỏ hàng thành công",
      data: card,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin giỏ hàng: " + error.message);
  }
};

const getCardByUserService = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        message: "Người dùng không tồn tại",
        data: null,
      };
    }

    const card = await Card.findOne({ userId })
      .populate("userId", "fullName")
      .populate({
        path: "items",
        populate: { path: "productId", select: "name" },
      });
    if (!card) {
      return {
        message: "Người dùng chưa có giỏ hàng",
        data: null,
      };
    }

    return {
      message: "Lấy giỏ hàng của người dùng thành công",
      data: card,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy giỏ hàng của người dùng: " + error.message);
  }
};

const updateCardItemService = async (cardId, itemId, updateData, userId) => {
  try {
    const { quantity } = updateData;

    // Kiểm tra trường bắt buộc
    if (!quantity) {
      return {
        message: "Vui lòng cung cấp số lượng để cập nhật",
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

    // Kiểm tra giỏ hàng tồn tại
    const card = await Card.findById(cardId);
    if (!card) {
      return {
        message: "Không tìm thấy giỏ hàng",
        data: null,
      };
    }

    // Kiểm tra quyền chỉnh sửa
    if (card.userId.toString() !== userId) {
      return {
        message: "Bạn không có quyền chỉnh sửa giỏ hàng này",
        data: null,
      };
    }

    // Kiểm tra mục tồn tại
    const cardItem = await CardItem.findById(itemId);
    if (!cardItem || !card.items.includes(itemId)) {
      return {
        message: "Không tìm thấy mục trong giỏ hàng",
        data: null,
      };
    }

    await CardItem.findByIdAndUpdate(itemId, { quantity });

    return {
      message: "Cập nhật mục trong giỏ hàng thành công",
      data: await Card.findById(cardId)
        .populate("userId", "fullName")
        .populate({
          path: "items",
          populate: { path: "productId", select: "name" },
        }),
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật mục trong giỏ hàng: " + error.message);
  }
};

const removeItemFromCardService = async (cardId, itemId, userId) => {
  try {
    // Kiểm tra giỏ hàng tồn tại
    const card = await Card.findById(cardId);
    if (!card) {
      return {
        message: "Không tìm thấy giỏ hàng",
        data: null,
      };
    }

    // Kiểm tra quyền xóa
    if (card.userId.toString() !== userId) {
      return {
        message: "Bạn không có quyền xóa mục trong giỏ hàng này",
        data: null,
      };
    }

    // Kiểm tra mục tồn tại
    if (!card.items.includes(itemId)) {
      return {
        message: "Không tìm thấy mục trong giỏ hàng",
        data: null,
      };
    }

    // Xóa mục khỏi CardItem
    await CardItem.findByIdAndDelete(itemId);
    // Xóa mục khỏi mảng items
    card.items = card.items.filter((item) => item.toString() !== itemId);
    await card.save();

    return {
      message: "Xóa mục khỏi giỏ hàng thành công",
      data: await Card.findById(cardId)
        .populate("userId", "fullName")
        .populate({
          path: "items",
          populate: { path: "productId", select: "name" },
        }),
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa mục khỏi giỏ hàng: " + error.message);
  }
};

const deleteCardService = async (id, userId) => {
  try {
    const card = await Card.findById(id);
    if (!card) {
      return {
        message: "Không tìm thấy giỏ hàng",
        data: null,
      };
    }

    // Kiểm tra quyền xóa
    if (card.userId.toString() !== userId) {
      return {
        message: "Bạn không có quyền xóa giỏ hàng này",
        data: null,
      };
    }

    // Xóa tất cả CardItem liên quan
    await CardItem.deleteMany({ _id: { $in: card.items } });
    await Card.findByIdAndDelete(id);

    return {
      message: "Xóa giỏ hàng thành công",
      data: card,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa giỏ hàng: " + error.message);
  }
};

module.exports = {
  createCardService,
  addItemToCardService,
  getAllCardsService,
  getCardByIdService,
  getCardByUserService,
  updateCardItemService,
  removeItemFromCardService,
  deleteCardService,
};
