import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { ventasAPI } from '../services/apiService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((product) => {
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
        // Incrementar cantidad del item existente
        const quantityToAdd = product.quantity || 1;
        const newQuantity = existingItem.quantity + quantityToAdd;
        return prevCart.map((item) => {
          if (item.id === product.id && item.variant === product.variant) {
            const updatedItem = { ...item, quantity: newQuantity };
            
            // Aplicar lógica de cambio de precio automático para panes y extras
            if ((item.tipo_categoria === 'pan' || item.tipo_categoria === 'extra') && item.precioOriginal) {
              if (newQuantity >= 12) {
                updatedItem.variant = 'wholesale';
                updatedItem.price = item.precioOriginal.wholesale || item.price;
              } else {
                updatedItem.variant = 'retail';
                updatedItem.price = item.precioOriginal.retail_sale || item.price;
              }
            }
            
            return updatedItem;
          }
          return item;
        });
      }
      
      // Guardar los precios originales si es pan o extra
      const productToAdd = { ...product, quantity: product.quantity || 1 };
      if ((product.tipo_categoria === 'pan' || product.tipo_categoria === 'extra') && product.precioOriginal) {
        // Ya viene con precioOriginal desde ProductCard
        // Aplicar el precio correcto según la cantidad inicial
        const initialQuantity = productToAdd.quantity;
        if (initialQuantity >= 12) {
          productToAdd.variant = 'wholesale';
          productToAdd.price = productToAdd.precioOriginal.wholesale;
        } else {
          productToAdd.variant = 'retail';
          productToAdd.price = productToAdd.precioOriginal.retail_sale;
        }
      } else if ((product.tipo_categoria === 'pan' || product.tipo_categoria === 'extra') && typeof product.precio === 'object') {
        // Guardar referencia a los precios originales
        productToAdd.precioOriginal = {
          retail_sale: parseFloat(product.precio.retail_sale || 0),
          wholesale: parseFloat(product.precio.wholesale || 0)
        };
      }
      
      return [...prevCart, productToAdd];
    });
  }, []);

  const removeFromCart = useCallback((productId, variant) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === productId && item.variant === variant))
    );
  }, []);

  const updateQuantity = useCallback((productId, variant, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const itemIndex = newCart.findIndex(
        (item) => item.id === productId && item.variant === variant
      );
      
      if (itemIndex === -1) return prevCart;
      
      const item = newCart[itemIndex];
      
      // Para panes y extras con precio variable
      if ((item.tipo_categoria === 'pan' || item.tipo_categoria === 'extra') && item.precioOriginal) {
        const newPrice = newQuantity >= 12 ? item.precioOriginal.wholesale : item.precioOriginal.retail_sale;
        const newVariant = newQuantity >= 12 ? 'wholesale' : 'retail';
        
        newCart[itemIndex] = { 
          ...item, 
          quantity: newQuantity,
          price: newPrice,
          variant: newVariant
        };
      } else {
        // Para productos sin precio variable
        newCart[itemIndex] = { ...item, quantity: newQuantity };
      }
      
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const completePurchase = useCallback(async () => {
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
      setCart([]);
      
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
  }, [cart]);

  const cartTotal = useMemo(() => 
    cart.reduce((total, item) => total + (item.price || item.precio || 0) * item.quantity, 0),
    [cart]
  );
  
  const cartCount = useMemo(() => 
    cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );

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
