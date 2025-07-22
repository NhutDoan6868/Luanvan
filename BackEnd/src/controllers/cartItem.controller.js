const cartItemService = require("../services/cartItem.service");

const createCartItem = async (req, res) => {
  try {
    const cartItem = await cartItemService.createCartItem(req.body);
    res.status(201).json({
      success: true,
      data: cartItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllCartItems = async (req, res) => {
  try {
    const cartItems = await cartItemService.getAllCartItems();
    res.status(200).json({
      success: true,
      data: cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCartItemById = async (req, res) => {
  try {
    const cartItem = await cartItemService.getCartItemById(req.params.id);
    res.status(200).json({
      success: true,
      data: cartItem,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const cartItem = await cartItemService.updateCartItem(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      data: cartItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const result = await cartItemService.deleteCartItem(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCartItem,
  getAllCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
};
