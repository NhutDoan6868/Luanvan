const Product = require("../models/product");
const Subcategory = require("../models/subcategory");
const Size = require("../models/size");
const Price = require("../models/price");
const Image = require("../models/image");
const ProductPromotion = require("../models/product_promotion");

const createProductService = async (productData) => {
  try {
    const {
      name,
      description,
      soldQuantity,
      quantity,
      imageURL,
      subcategoryId,
      sizes = [], // Danh sách size và giá
    } = productData;

    if (!name || !subcategoryId) {
      return {
        message: "Vui lòng cung cấp đầy đủ tên sản phẩm và ID danh mục con",
        data: null,
      };
    }

    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      return {
        message: "Danh mục con không tồn tại",
        data: null,
      };
    }

    if (quantity < 0 || soldQuantity < 0) {
      return {
        message: "Số lượng và số lượng đã bán không được âm",
        data: null,
      };
    }

    const product = await Product.create({
      name,
      description,
      soldQuantity: soldQuantity || 0,
      quantity: quantity || 0,
      imageURL,
      subcategoryId,
    });

    // Tạo các size và giá
    for (const sizeData of sizes) {
      const { name, price } = sizeData;
      if (name) {
        const size = await Size.create({
          productId: product._id,
          name,
        });
        if (price !== undefined && price >= 0) {
          await Price.create({
            sizeId: size._id,
            price,
          });
        }
      }
    }

    return {
      message: "Tạo sản phẩm thành công",
      data: product,
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo sản phẩm: " + error.message);
  }
};

const getAllProductsService = async ({ subcategoryId, categoryId }) => {
  try {
    let query = {};

    // Kiểm tra nếu có subcategoryId
    if (subcategoryId) {
      const subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) {
        return {
          message: "Danh mục con không tồn tại",
          data: [],
        };
      }
      query = { subcategoryId };
    } else if (categoryId) {
      const subcategories = await Subcategory.find({ categoryId }).select(
        "_id"
      );
      if (!subcategories.length) {
        return {
          message: "Không tìm thấy danh mục con nào thuộc danh mục này",
          data: [],
        };
      }
      const subcategoryIds = subcategories.map((sub) => sub._id);
      query = { subcategoryId: { $in: subcategoryIds } };
    }

    const products = await Product.find(query)
      .populate("subcategoryId", "name")
      .lean();

    if (!products.length) {
      return {
        message: "Không tìm thấy sản phẩm nào",
        data: [],
      };
    }

    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        const sizes = await Size.find({ productId: product._id }).lean();
        const sizeIds = sizes.map((size) => size._id);
        const prices = await Price.find({ sizeId: { $in: sizeIds } })
          .lean()
          .select("price sizeId");

        const minPrice =
          prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : 0;

        const images = await Image.find({ productId: product._id })
          .lean()
          .select("url altText");

        const currentDate = new Date();
        const productPromotions = await ProductPromotion.find({
          productId: product._id,
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
                  minPrice > 0
                    ? minPrice * (1 - validPromotion.promotionId.discount / 100)
                    : 0,
                startDate: validPromotion.promotionId.startDate,
                endDate: validPromotion.promotionId.endDate,
              }
            : null;

        return {
          ...product,
          minPrice,
          sizes: sizes.map((size) => ({
            _id: size._id,
            name: size.name,
            price:
              prices.find((p) => p.sizeId.toString() === size._id.toString())
                ?.price || 0,
          })),
          images,
          promotion,
        };
      })
    );

    return {
      message: "Lấy danh sách sản phẩm thành công",
      data: productsWithDetails,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách sản phẩm: " + error.message);
  }
};

const getProductsGroupedBySubcategoryService = async ({ categoryId }) => {
  try {
    let subcategoriesQuery = {};
    if (categoryId) {
      subcategoriesQuery = { categoryId };
    }

    // Lấy tất cả danh mục con
    const subcategories = await Subcategory.find(subcategoriesQuery)
      .select("_id name description")
      .lean();

    if (!subcategories.length) {
      return {
        message: "Không tìm thấy danh mục con nào",
        data: [],
      };
    }

    // Lấy sản phẩm và nhóm theo danh mục con
    const groupedProducts = await Promise.all(
      subcategories.map(async (subcategory) => {
        const products = await Product.find({ subcategoryId: subcategory._id })
          .populate("subcategoryId", "name")
          .lean();

        const productsWithDetails = await Promise.all(
          products.map(async (product) => {
            const sizes = await Size.find({ productId: product._id }).lean();
            const sizeIds = sizes.map((size) => size._id);
            const prices = await Price.find({ sizeId: { $in: sizeIds } })
              .lean()
              .select("price sizeId");

            const minPrice =
              prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : 0;

            const images = await Image.find({ productId: product._id })
              .lean()
              .select("url altText");

            const currentDate = new Date();
            const productPromotions = await ProductPromotion.find({
              productId: product._id,
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

            const validPromotion = productPromotions.find(
              (pp) => pp.promotionId
            );
            const promotion =
              validPromotion && validPromotion.promotionId
                ? {
                    name: validPromotion.promotionId.name,
                    discount: validPromotion.promotionId.discount,
                    discountedPrice:
                      minPrice > 0
                        ? minPrice *
                          (1 - validPromotion.promotionId.discount / 100)
                        : 0,
                    startDate: validPromotion.promotionId.startDate,
                    endDate: validPromotion.promotionId.endDate,
                  }
                : null;

            return {
              ...product,
              minPrice,
              sizes: sizes.map((size) => ({
                _id: size._id,
                name: size.name,
                price:
                  prices.find(
                    (p) => p.sizeId.toString() === size._id.toString()
                  )?.price || 0,
              })),
              images,
              promotion,
            };
          })
        );

        return {
          subcategory: {
            _id: subcategory._id,
            name: subcategory.name,
            description: subcategory.description,
          },
          products: productsWithDetails,
        };
      })
    );

    // Lọc bỏ các danh mục con không có sản phẩm
    const filteredGroupedProducts = groupedProducts.filter(
      (group) => group.products.length > 0
    );

    if (!filteredGroupedProducts.length) {
      return {
        message: "Không tìm thấy sản phẩm nào cho các danh mục con",
        data: [],
      };
    }

    return {
      message: "Lấy danh sách sản phẩm theo danh mục con thành công",
      data: filteredGroupedProducts,
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi lấy danh sách sản phẩm theo danh mục con: " + error.message
    );
  }
};

const getProductByIdService = async (id) => {
  try {
    const product = await Product.findById(id)
      .populate("subcategoryId", "name")
      .lean();

    if (!product) {
      return {
        message: "Không tìm thấy sản phẩm",
        data: null,
      };
    }

    const images = await Image.find({ productId: id })
      .lean()
      .select("url altText");

    const sizes = await Size.find({ productId: id }).lean();
    const sizeIds = sizes.map((size) => size._id);
    const prices = await Price.find({ sizeId: { $in: sizeIds } })
      .lean()
      .select("price sizeId");

    const minPrice =
      prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : 0;

    const currentDate = new Date();
    const productPromotions = await ProductPromotion.find({ productId: id })
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
              minPrice > 0
                ? minPrice * (1 - validPromotion.promotionId.discount / 100)
                : 0,
            startDate: validPromotion.promotionId.startDate,
            endDate: validPromotion.promotionId.endDate,
          }
        : null;

    const productWithDetails = {
      ...product,
      images,
      minPrice,
      sizes: sizes.map((size) => ({
        _id: size._id,
        name: size.name,
        price:
          prices.find((p) => p.sizeId.toString() === size._id.toString())
            ?.price || 0,
      })),
      promotion,
    };

    return {
      message: "Lấy thông tin sản phẩm thành công",
      data: productWithDetails,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin sản phẩm: " + error.message);
  }
};

const updateProductService = async (id, updateData) => {
  try {
    if (!Object.keys(updateData).length) {
      return {
        message: "Vui lòng cung cấp dữ liệu để cập nhật",
        data: null,
      };
    }

    if (updateData.subcategoryId) {
      const subcategory = await Subcategory.findById(updateData.subcategoryId);
      if (!subcategory) {
        return {
          message: "Danh mục con không tồn tại",
          data: null,
        };
      }
    }

    if (updateData.quantity !== undefined && updateData.quantity < 0) {
      return {
        message: "Số lượng không được âm",
        data: null,
      };
    }

    if (updateData.soldQuantity !== undefined && updateData.soldQuantity < 0) {
      return {
        message: "Số lượng đã bán không được âm",
        data: null,
      };
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("subcategoryId", "name");

    if (!product) {
      return {
        message: "Không tìm thấy sản phẩm",
        data: null,
      };
    }

    return {
      message: "Cập nhật sản phẩm thành công",
      data: product,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật sản phẩm: " + error.message);
  }
};

const deleteProductService = async (id) => {
  try {
    const product = await Product.findByIdAndDelete(id).populate(
      "subcategoryId",
      "name"
    );
    if (!product) {
      return {
        message: "Không tìm thấy sản phẩm",
        data: null,
      };
    }
    // Xóa tất cả size và giá liên quan
    await Size.deleteMany({ productId: id });
    await Price.deleteMany({
      sizeId: { $in: await Size.find({ productId: id }).select("_id") },
    });
    return {
      message: "Xóa sản phẩm thành công",
      data: product,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa sản phẩm: " + error.message);
  }
};

const getProductSizesService = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return {
        message: "Không tìm thấy sản phẩm",
        data: null,
      };
    }

    const sizes = await Size.find({ productId }).lean();
    const sizeIds = sizes.map((size) => size._id);
    const prices = await Price.find({ sizeId: { $in: sizeIds } })
      .lean()
      .select("price sizeId");

    const sizesWithPrices = sizes.map((size) => ({
      _id: size._id,
      name: size.name,
      price:
        prices.find((p) => p.sizeId.toString() === size._id.toString())
          ?.price || 0,
    }));

    return {
      message: "Lấy danh sách kích thước thành công",
      data: sizesWithPrices,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách kích thước: " + error.message);
  }
};

const createSizeService = async (productId, sizeData) => {
  try {
    const { name } = sizeData;
    if (!name) {
      return {
        message: "Vui lòng cung cấp tên kích thước",
        data: null,
      };
    }

    const product = await Product.findById(productId);
    if (!product) {
      return {
        message: "Không tìm thấy sản phẩm",
        data: null,
      };
    }

    const existingSize = await Size.findOne({ productId, name });
    if (existingSize) {
      return {
        message: "Kích thước đã tồn tại",
        data: null,
      };
    }

    const size = await Size.create({
      productId,
      name,
    });

    return {
      message: "Tạo kích thước thành công",
      data: size,
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo kích thước: " + error.message);
  }
};

const deleteSizeService = async (productId, sizeId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return {
        message: "Không tìm thấy sản phẩm",
        data: null,
      };
    }

    const size = await Size.findOne({ _id: sizeId, productId });
    if (!size) {
      return {
        message: "Không tìm thấy kích thước",
        data: null,
      };
    }

    await Size.deleteOne({ _id: sizeId });
    await Price.deleteOne({ sizeId });

    return {
      message: "Xóa kích thước thành công",
      data: { sizeId },
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa kích thước: " + error.message);
  }
};

const setProductPriceService = async (productId, priceData) => {
  try {
    const { sizeId, price } = priceData;
    if (!sizeId || price === undefined || price < 0) {
      return {
        message: "Vui lòng cung cấp sizeId và giá hợp lệ",
        data: null,
      };
    }

    const product = await Product.findById(productId);
    if (!product) {
      return {
        message: "Không tìm thấy sản phẩm",
        data: null,
      };
    }

    const size = await Size.findById(sizeId);
    if (!size || size.productId.toString() !== productId.toString()) {
      return {
        message: "Kích thước không tồn tại hoặc không thuộc sản phẩm",
        data: null,
      };
    }

    const existingPrice = await Price.findOne({ sizeId });
    if (existingPrice) {
      existingPrice.price = price;
      await existingPrice.save();
    } else {
      await Price.create({
        sizeId,
        price,
      });
    }

    return {
      message: "Thiết lập giá sản phẩm thành công",
      data: { productId, sizeId, price },
    };
  } catch (error) {
    throw new Error("Lỗi khi thiết lập giá sản phẩm: " + error.message);
  }
};

const deletePriceService = async (productId, sizeId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return {
        message: "Không tìm thấy sản phẩm",
        data: null,
      };
    }

    const size = await Size.findOne({ _id: sizeId, productId });
    if (!size) {
      return {
        message: "Không tìm thấy kích thước",
        data: null,
      };
    }

    const deletedPrice = await Price.deleteOne({ sizeId });
    if (deletedPrice.deletedCount === 0) {
      return {
        message: "Không tìm thấy giá để xóa",
        data: null,
      };
    }

    return {
      message: "Xóa giá thành công",
      data: { sizeId },
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa giá: " + error.message);
  }
};
const getSaleProductsService = async () => {
  try {
    console.log("Starting getSaleProductsService");
    const currentDate = new Date();
    console.log("Current date:", currentDate);

    // Truy vấn ProductPromotion và populate
    const productPromotions = await ProductPromotion.find()
      .populate({
        path: "promotionId",
        match: {
          startDate: { $lte: currentDate },
          endDate: { $gte: currentDate },
        },
        select: "name discount startDate endDate",
      })
      .populate({
        path: "productId",
        select: "name description quantity imageURL subcategoryId",
        populate: { path: "subcategoryId", select: "name" },
      })
      .lean();

    console.log("Product promotions found:", productPromotions.length);
    if (!productPromotions.length) {
      console.log("No product promotions found");
      return {
        message: "Không tìm thấy khuyến mãi nào",
        data: [],
      };
    }

    const saleProducts = await Promise.all(
      productPromotions
        .filter((pp) => {
          const isValid = pp.promotionId && pp.productId;
          if (!isValid) {
            console.log("Filtered out invalid promotion or product:", {
              promotionId: pp.promotionId,
              productId: pp.productId,
            });
          }
          return isValid;
        })
        .map(async (pp) => {
          try {
            console.log("Processing product:", pp.productId?.name || "Unknown");
            const sizes = await Size.find({
              productId: pp.productId._id,
            }).lean();
            console.log("Sizes found:", sizes.length);

            const sizeIds = sizes.map((size) => size._id);
            const prices = await Price.find({ sizeId: { $in: sizeIds } })
              .lean()
              .select("price sizeId");
            console.log("Prices found:", prices.length);

            const minPrice =
              prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : 0;
            console.log("Min price calculated:", minPrice);

            const images = await Image.find({ productId: pp.productId._id })
              .lean()
              .select("url altText");
            console.log("Images found:", images.length);

            if (!pp.promotionId) {
              console.log(
                "No valid promotion for product:",
                pp.productId?.name
              );
              return null;
            }

            const promotion = {
              name: pp.promotionId.name,
              discount: pp.promotionId.discount,
              discountedPrice:
                minPrice > 0
                  ? minPrice * (1 - pp.promotionId.discount / 100)
                  : 0,
              startDate: pp.promotionId.startDate,
              endDate: pp.promotionId.endDate,
            };

            return {
              _id: pp.productId._id,
              name: pp.productId.name,
              description: pp.productId.description,
              quantity: pp.productId.quantity,
              imageURL: pp.productId.imageURL,
              subcategoryId: pp.productId.subcategoryId,
              minPrice,
              sizes: sizes.map((size) => ({
                _id: size._id,
                name: size.name,
                price:
                  prices.find(
                    (p) => p.sizeId.toString() === size._id.toString()
                  )?.price || 0,
              })),
              images,
              promotion,
            };
          } catch (err) {
            console.error(
              "Error processing product:",
              pp.productId?.name,
              err.message
            );
            return null;
          }
        })
    );

    // Lọc bỏ các sản phẩm null (do lỗi xử lý)
    const validSaleProducts = saleProducts.filter(
      (product) => product !== null
    );
    console.log("Valid sale products:", validSaleProducts.length);

    if (!validSaleProducts.length) {
      console.log("No valid sale products after processing");
      return {
        message: "Không tìm thấy sản phẩm đang sale",
        data: [],
      };
    }

    return {
      message: "Lấy danh sách sản phẩm đang sale thành công",
      data: validSaleProducts,
    };
  } catch (error) {
    console.error(
      "Error in getSaleProductsService:",
      error.message,
      error.stack
    );
    throw new Error(
      "Lỗi khi lấy danh sách sản phẩm đang sale: " + error.message
    );
  }
};

module.exports = {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  getProductSizesService,
  createSizeService,
  deleteSizeService,
  setProductPriceService,
  deletePriceService,
  getSaleProductsService,
  getProductsGroupedBySubcategoryService, // Xuất hàm mới
};
