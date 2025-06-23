const cardItemService = require("../services/cardItem.service");

const createCardItem = async (req, res) => {
  try {
    const cardItem = await cardItemService.createCardItem(req.body);
    res.status(201).json({
      success: true,
      data: cardItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllCardItems = async (req, res) => {
  try {
    const cardItems = await cardItemService.getAllCardItems();
    res.status(200).json({
      success: true,
      data: cardItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCardItemById = async (req, res) => {
  try {
    const cardItem = await cardItemService.getCardItemById(req.params.id);
    res.status(200).json({
      success: true,
      data: cardItem,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCardItem = async (req, res) => {
  try {
    const cardItem = await cardItemService.updateCardItem(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      data: cardItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCardItem = async (req, res) => {
  try {
    const result = await cardItemService.deleteCardItem(req.params.id);
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
  createCardItem,
  getAllCardItems,
  getCardItemById,
  updateCardItem,
  deleteCardItem,
};
