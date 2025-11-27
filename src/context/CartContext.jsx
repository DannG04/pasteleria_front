import React, { createContext, useState, useContext } from 'react';
import { ventasAPI } from '../services/apiService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    // Validar disponibilidad del producto
    if (product.disponible === false) {
      console.warn('No se puede agregar al carrito: producto no disponible');
      return;
    }
    
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.variant === product.variant
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.variant === product.variant
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, variant) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === productId && item.variant === variant))
    );
  };

  const updateQuantity = (productId, variant, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.variant === variant
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const completePurchase = async () => {
    try {
      // Preparar los datos para el endpoint de venta
      const ventaDetalle = cart.map((item) => ({
        id_producto: item.id,
        cantidad: item.quantity,
        precio: item.price || item.precio || 0,
        variante: item.variant || 'medium', // Usar la variante del producto
      }));

      const ventaData = {
        detalles: `Venta de ${cart.length} producto(s)`,
        venta_detalle: ventaDetalle,
      };

      // Llamar al endpoint de ventas
      const response = await ventasAPI.createSQL(ventaData);
      
      // Limpiar el carrito después de completar la compra
      clearCart();
      
      return {
        success: true,
        ventaId: response.id,
        message: response.message || 'Compra realizada exitosamente',
      };
    } catch (error) {
      console.error('Error al completar la compra:', error);
      return {
        success: false,
        error: error.message || 'Error al procesar la compra',
      };
    }
  };

  const cartTotal = cart.reduce(
    (total, item) => total + (item.price || item.precio || 0) * item.quantity,
    0
  );
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        completePurchase,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
