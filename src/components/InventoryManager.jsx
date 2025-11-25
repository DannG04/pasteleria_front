import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { products } from '../data/products';

export default function InventoryManager() {
  const [inventory, setInventory] = useState(
    products.map((p) => ({ ...p, stock: p.stock || 50 }))
  );

  const handleStockChange = (id, newStock) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock: parseInt(newStock) || 0 } : item
      )
    );
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Sin Stock', color: 'error' };
    if (stock < 10) return { label: 'Stock Bajo', color: 'warning' };
    return { label: 'Disponible', color: 'success' };
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestión de Inventario
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock Actual</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Ajustar Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => {
              const status = getStockStatus(item.stock);
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                      />
                      <Typography>{item.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Typography variant="h6">{item.stock}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={status.label} color={status.color} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        type="number"
                        size="small"
                        value={item.stock}
                        onChange={(e) => handleStockChange(item.id, e.target.value)}
                        sx={{ width: 100 }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleStockChange(item.id, item.stock + 10)}
                      >
                        +10
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleStockChange(item.id, Math.max(0, item.stock - 10))}
                      >
                        -10
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
