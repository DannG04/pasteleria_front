import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useCart } from '../context/CartContext';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <ListItem
      sx={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        mb: 2,
        p: 2
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {item.name}
          </Typography>
          {item.variant && (
            <Typography variant="caption" color="text.secondary">
              {item.variant === 'small' && 'Pequeño'}
              {item.variant === 'medium' && 'Mediano'}
              {item.variant === 'big' && 'Grande'}
              {item.variant === 'retail' && 'Al por menor'}
              {item.variant === 'wholesale' && 'Al por mayor'}
            </Typography>
          )}
          {(item.tipo_categoria === 'pan' || item.tipo_categoria === 'extra') && item.precioOriginal && (
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block',
                color: item.quantity >= 12 ? 'success.main' : 'info.main',
                fontWeight: 'medium'
              }}
            >
              {item.quantity >= 12 ? '✓ Precio mayoreo' : 'Precio menudeo'}
            </Typography>
          )}
        </Box>
        <Box
          component="img"
          src={item.image}
          alt={item.name}
          sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        ${item.price.toFixed(2)} c/u
      </Typography>
      <IconButton
        size="small"
        onClick={() => onRemove(item.id, item.variant)}
        sx={{ color: 'error.main' }}
        disableRipple
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => onUpdateQuantity(item.id, item.variant, item.quantity - 1)}
            disabled={item.quantity <= 1}
            disableRipple
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
            {item.quantity}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onUpdateQuantity(item.id, item.variant, item.quantity + 1)}
            disableRipple
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          ${(item.price * item.quantity).toFixed(2)}
        </Typography>
      </Box>
    </ListItem>
  );
};

CartItem.displayName = 'CartItem';

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Carrito de Compras</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* Cart Items */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {cart.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              Tu carrito está vacío
            </Typography>
          ) : (
            <List>
              {cart.map((item, index) => (
                <CartItem
                  key={`cart-item-${item.id}-${index}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        <Divider />
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              ${cartTotal.toFixed(2)}
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCartCheckoutIcon />}
            onClick={onCheckout}
            disabled={cart.length === 0}
            size="large"
          >
            Proceder al Pago
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
