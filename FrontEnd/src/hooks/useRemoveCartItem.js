import { useState, useCallback } from "react";
import { removeItemFromCartApi } from "../services/cart.service";

const useRemoveCartItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const removeItemFromCart = useCallback(async (cartId, itemId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await removeItemFromCartApi(cartId, itemId);
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { removeItemFromCart, loading, error, data };
};

export default useRemoveCartItem;
