import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Badge from '@mui/material/Badge';
import { useCart } from '../context/CartContext';
import { useThemeMode } from '../context/ThemeContext';
import CartDrawer from './CartDrawer';
import Ticket from './Ticket';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { cartCount, cart, cartTotal, clearCart } = useCart();
  const { mode, toggleTheme } = useThemeMode();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleCheckout = () => {
    setDrawerOpen(false);
    setTicketOpen(true);
  };

  const handleCloseTicket = () => {
    setTicketOpen(false);
    clearCart();
  };

  return (
    <>
      <Box sx={{ flexGrow: 4 }}>
        <AppBar position="static">
          <Toolbar>
            {/* Logo de la aplicacion */}
            <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 50, mr: 2 }}
            />
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pastelería SweetObject
            </Typography>
            <IconButton
              size="large"
              aria-label="toggle theme"
              color="inherit"
              onClick={toggleTheme}
              sx={{ mr: 1 }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton
              size="large"
              aria-label="show cart items"
              color="inherit"
              onClick={handleOpenDrawer}
            >
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>

      <CartDrawer 
        open={drawerOpen} 
        onClose={handleCloseDrawer}
        onCheckout={handleCheckout}
      />

      <Ticket
        open={ticketOpen}
        onClose={handleCloseTicket}
        cart={cart}
        total={cartTotal}
      />
    </>
  );
}
