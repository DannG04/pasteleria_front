import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useCart } from '../context/CartContext';
import { Button } from '@mui/material';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          title={product.name}
          subheader={`$${product.price.toFixed(2)}`}
          sx={{ minHeight: 80 }}
        />
        <CardMedia
          component="img"
          height="194"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1, minHeight: 80 }}>
          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing sx={{ justifyContent: 'space-between', padding: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            onClick={() => addToCart(product)}
            size="small"
          >
            Agregar
          </Button>
          <Button
            variant="outlined"
            startIcon={<InfoIcon />}
            onClick={handleOpenDialog}
            size="small"
          >
            Ingredientes
          </Button>
        </CardActions>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{product.name}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Ingredientes:
          </Typography>
          <List>
            {product.ingredients?.map((ingredient, index) => (
              <ListItem key={index}>
                <ListItemText primary={`• ${ingredient}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}