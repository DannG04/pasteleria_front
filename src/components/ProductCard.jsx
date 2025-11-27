import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { useCart } from '../context/CartContext';
import { Button } from '@mui/material';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [openIngredientsDialog, setOpenIngredientsDialog] = React.useState(false);
  const [openSizeDialog, setOpenSizeDialog] = React.useState(false);
  const [selectedVariant, setSelectedVariant] = React.useState('medium');
  const [quantity, setQuantity] = React.useState(1);

  const hasVariants = product.precio && typeof product.precio === 'object';
  const variantType = hasVariants 
    ? (product.precio.small !== undefined ? 'size' : 'amount')
    : null;
  
  const getProductAvailability = (variant) => {
    if (!product.disponible) return true; // Si no hay info de disponible, asumir disponible
    
    // Si disponible es un objeto (productos con variantes de tamaño)
    if (typeof product.disponible === 'object') {
      // Para productos con tamaños (postres y bebidas)
      if (variant === 'small' || variant === 'medium' || variant === 'big') {
        return product.disponible[variant] !== false;
      }
      // Si tiene alguna variante disponible, mostrar como disponible
      return product.disponible.small || product.disponible.medium || product.disponible.big;
    }
    
    // Si es un booleano simple
    return product.disponible !== false;
  };
  
  // Disponibilidad general del producto (para mostrar en la tarjeta)
  const isProductAvailable = getProductAvailability(null);
  
  // Disponibilidad de la variante seleccionada (para el diálogo)
  const isSelectedVariantAvailable = getProductAvailability(selectedVariant);
  

  // Obtener el precio según la variante seleccionada
  const getPriceByVariant = (variant, qty = 1) => {
    if (!product.precio) return parseFloat(product.price || 0);
    
    if (typeof product.precio === 'object') {
      if (variantType === 'size') {
        // Postres y bebidas
        const prices = {
          small: parseFloat(product.precio.small || 0),
          medium: parseFloat(product.precio.medium || 0),
          big: parseFloat(product.precio.big || 0),
        };
        return prices[variant] || prices.medium;
      } else {
        // Pan - determinar precio según cantidad
        const retailPrice = parseFloat(product.precio.retail_sale || 0);
        const wholesalePrice = parseFloat(product.precio.wholesale || 0);
        return qty >= 12 ? wholesalePrice : retailPrice;
      }
    }
    return parseFloat(product.precio || product.price || 0);
  };

  const currentPrice = getPriceByVariant(selectedVariant, quantity);

  const handleOpenIngredientsDialog = () => {
    setOpenIngredientsDialog(true);
  };

  const handleCloseIngredientsDialog = () => {
    setOpenIngredientsDialog(false);
  };

  const handleOpenSizeDialog = () => {
    // Reiniciar cantidad
    setQuantity(1);
    
    // Establecer variante por defecto según el tipo y disponibilidad
    if (variantType === 'size') {
      // Seleccionar la primera variante disponible
      if (product.disponible && typeof product.disponible === 'object') {
        if (product.disponible.medium) {
          setSelectedVariant('medium');
        } else if (product.disponible.small) {
          setSelectedVariant('small');
        } else if (product.disponible.big) {
          setSelectedVariant('big');
        } else {
          setSelectedVariant('medium'); // fallback
        }
      } else {
        setSelectedVariant('medium');
      }
    } else if (variantType === 'amount') {
      setSelectedVariant('retail'); // Se mantiene para compatibilidad
    }
    setOpenSizeDialog(true);
  };

  const handleCloseSizeDialog = () => {
    setOpenSizeDialog(false);
  };

  const handleAddToCart = () => {
    // Para productos con variantes, abrir el diálogo donde se verificará cada variante
    if (hasVariants) {
      // Verificar si al menos una variante está disponible
      if (typeof product.disponible === 'object') {
        const hasAnyAvailable = product.disponible.small || product.disponible.medium || product.disponible.big;
        if (!hasAnyAvailable) {
          return; // No abrir diálogo si ninguna variante está disponible
        }
      }
      handleOpenSizeDialog();
    } else {
      // Para productos sin variantes, verificar disponibilidad directa
      if (!getProductAvailability('medium')) {
        return;
      }
      const normalizedProduct = {
        id: product.id,
        name: product.nombre || product.name,
        price: currentPrice,
        description: product.descripcion || product.description,
        image: product.imagen_url || product.imagen || product.image || 'https://via.placeholder.com/300',
        ingredients: product.ingredientes || product.ingredients || [],
        variant: 'medium',
        tipo_categoria: product.tipo_categoria,
        disponible: product.disponible,
      };
      addToCart(normalizedProduct);
    }
  };

  const handleConfirmAddToCart = () => {
    // Verificar disponibilidad de la variante seleccionada
    if (!getProductAvailability(selectedVariant)) {
      handleCloseSizeDialog();
      return;
    }
    
    const finalPrice = getPriceByVariant(selectedVariant, quantity);
    const finalVariant = variantType === 'amount' 
      ? (quantity >= 12 ? 'wholesale' : 'retail')
      : selectedVariant;
    
    const normalizedProduct = {
      id: product.id,
      name: product.nombre || product.name,
      price: finalPrice,
      description: product.descripcion || product.description,
      image: product.imagen_url || product.imagen || product.image || 'https://via.placeholder.com/300',
      ingredients: product.ingredientes || product.ingredients || [],
      variant: finalVariant,
      tipo_categoria: product.tipo_categoria,
      disponible: product.disponible,
    };
    
    // Si es pan o extra, guardar los precios originales
    if ((product.tipo_categoria === 'pan' || product.tipo_categoria === 'extra') && 
        product.precio && typeof product.precio === 'object') {
      normalizedProduct.precioOriginal = {
        retail_sale: parseFloat(product.precio.retail_sale || 0),
        wholesale: parseFloat(product.precio.wholesale || 0)
      };
    }
    
    // Agregar al carrito con la cantidad especificada
    normalizedProduct.quantity = quantity;
    addToCart(normalizedProduct);
    
    handleCloseSizeDialog();
  };

  // Obtener el precio a mostrar en la tarjeta
  const getPriceDisplay = () => {
    if (hasVariants && product.precio) {
      if (variantType === 'size') {
        const minPrice = Math.min(
          parseFloat(product.precio.small || 0),
          parseFloat(product.precio.medium || 0),
          parseFloat(product.precio.big || 0)
        );
        const maxPrice = Math.max(
          parseFloat(product.precio.small || 0),
          parseFloat(product.precio.medium || 0),
          parseFloat(product.precio.big || 0)
        );
        return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
      } else {
        const minPrice = Math.min(
          parseFloat(product.precio.retail_sale || 0),
          parseFloat(product.precio.wholesale || 0)
        );
        const maxPrice = Math.max(
          parseFloat(product.precio.retail_sale || 0),
          parseFloat(product.precio.wholesale || 0)
        );
        return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
      }
    }
    return `$${currentPrice.toFixed(2)}`;
  };

  return (
    <>
      <Card sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        opacity: isProductAvailable ? 1 : 0.6,
        position: 'relative'
      }}>
        <CardHeader
          title={product.nombre || product.name}
          subheader={getPriceDisplay()}
          sx={{ minHeight: 80 }}
        />
        <CardMedia
          component="img"
          height="240"
          image={product.imagen_url || product.imagen || product.image || 'https://via.placeholder.com/300'}
          alt={product.nombre || product.name}
          sx={{ 
            objectFit: 'contain',
            backgroundColor: '#f5f5f5',
            padding: 1
          }}
        />
        <CardContent sx={{ flexGrow: 1, minHeight: 80 }}>
          <Typography variant="body2" color="text.secondary">
            {product.descripcion || product.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing sx={{ justifyContent: 'space-between', padding: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCart}
            size="small"
            disabled={!isProductAvailable}
          >
            {isProductAvailable ? 'Agregar' : 'No Disponible'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<InfoIcon />}
            onClick={handleOpenIngredientsDialog}
            size="small"
          >
            Ingredientes
          </Button>
        </CardActions>
      </Card>

      {/* Diálogo de Ingredientes */}
      <Dialog 
        open={openIngredientsDialog} 
        onClose={handleCloseIngredientsDialog}
        disableRestoreFocus
      >
        <DialogTitle>{product.nombre || product.name}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Ingredientes:
          </Typography>
          <List>
            {(product.ingredientes || product.ingredients || []).map((ingredient, index) => (
              <ListItem key={index}>
                <ListItemText primary={`• ${ingredient}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIngredientsDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Selección de Tamaño/Variante */}
      {hasVariants && (
        <Dialog 
          open={openSizeDialog} 
          onClose={handleCloseSizeDialog} 
          maxWidth="xs" 
          fullWidth
          disableRestoreFocus
        >
          <DialogTitle>Seleccionar {variantType === 'size' ? 'Tamaño' : 'Cantidad'}</DialogTitle>
          <DialogContent>
            <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
              {variantType === 'size' ? (
                <>
                  <FormLabel component="legend">Elige el tamaño</FormLabel>
                  <RadioGroup
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                  >
                    <FormControlLabel
                      value="small"
                      control={<Radio />}
                      disabled={product.disponible && typeof product.disponible === 'object' && !product.disponible.small}
                      label={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                          <Typography color={product.disponible && typeof product.disponible === 'object' && !product.disponible.small ? 'text.disabled' : 'inherit'}>
                            Pequeño {product.disponible && typeof product.disponible === 'object' && !product.disponible.small && '(No disponible)'}
                          </Typography>
                          <Typography fontWeight="bold" color={product.disponible && typeof product.disponible === 'object' && !product.disponible.small ? 'text.disabled' : 'inherit'}>
                            ${parseFloat(product.precio?.small || 0).toFixed(2)}
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%' }}
                    />
                    <FormControlLabel
                      value="medium"
                      control={<Radio />}
                      disabled={product.disponible && typeof product.disponible === 'object' && !product.disponible.medium}
                      label={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                          <Typography color={product.disponible && typeof product.disponible === 'object' && !product.disponible.medium ? 'text.disabled' : 'inherit'}>
                            Mediano {product.disponible && typeof product.disponible === 'object' && !product.disponible.medium && '(No disponible)'}
                          </Typography>
                          <Typography fontWeight="bold" color={product.disponible && typeof product.disponible === 'object' && !product.disponible.medium ? 'text.disabled' : 'inherit'}>
                            ${parseFloat(product.precio?.medium || 0).toFixed(2)}
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%' }}
                    />
                    <FormControlLabel
                      value="big"
                      control={<Radio />}
                      disabled={product.disponible && typeof product.disponible === 'object' && !product.disponible.big}
                      label={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                          <Typography color={product.disponible && typeof product.disponible === 'object' && !product.disponible.big ? 'text.disabled' : 'inherit'}>
                            Grande {product.disponible && typeof product.disponible === 'object' && !product.disponible.big && '(No disponible)'}
                          </Typography>
                          <Typography fontWeight="bold" color={product.disponible && typeof product.disponible === 'object' && !product.disponible.big ? 'text.disabled' : 'inherit'}>
                            ${parseFloat(product.precio?.big || 0).toFixed(2)}
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%' }}
                    />
                  </RadioGroup>
                </>
              ) : (
                <>
                  <FormLabel component="legend">Cantidad de productos</FormLabel>
                  <TextField
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    inputProps={{ min: 1, step: 1 }}
                    fullWidth
                    sx={{ mt: 2, mb: 2 }}
                    helperText={quantity >= 12 
                      ? `Precio al por mayor: $${parseFloat(product.precio?.wholesale || 0).toFixed(2)} c/u`
                      : `Precio al por menor: $${parseFloat(product.precio?.retail_sale || 0).toFixed(2)} c/u`
                    }
                  />
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: 'background.default', 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Cantidad:</Typography>
                      <Typography variant="body2" fontWeight="bold">{quantity}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Precio unitario:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ${getPriceByVariant('retail', quantity).toFixed(2)}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                      <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        ${(getPriceByVariant('retail', quantity) * quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSizeDialog}>Cancelar</Button>
            <Button 
              onClick={handleConfirmAddToCart} 
              variant="contained"
              disabled={!isSelectedVariantAvailable}
            >
              {isSelectedVariantAvailable ? 'Agregar al Carrito' : 'No Disponible'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}