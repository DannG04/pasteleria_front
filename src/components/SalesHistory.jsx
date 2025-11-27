import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { ventasAPI } from '../services/apiService';

function Row({ row }) {
  const [open, setOpen] = useState(false);
  
  // Parsear productos si es string
  const productos = typeof row.productos === 'string' 
    ? JSON.parse(row.productos) 
    : row.productos;

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Chip 
            icon={<ReceiptIcon />} 
            label={`#${row.id_venta}`} 
            color="primary" 
            size="small" 
          />
        </TableCell>
        <TableCell>{new Date(row.fecha).toLocaleDateString('es-ES')}</TableCell>
        <TableCell align="center">{productos?.length || 0}</TableCell>
        <TableCell align="right">
          <Typography variant="body1" fontWeight="bold" color="success.main">
            ${parseFloat(row.total).toFixed(2)}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalles de la Venta
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>ID Producto</strong></TableCell>
                    <TableCell><strong>Cantidad</strong></TableCell>
                    <TableCell><strong>Precio Unitario</strong></TableCell>
                    <TableCell><strong>Variante</strong></TableCell>
                    <TableCell align="right"><strong>Subtotal</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos?.map((producto, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{producto.id_producto}</TableCell>
                      <TableCell>{producto.cantidad}</TableCell>
                      <TableCell>${parseFloat(producto.precio_unitario).toFixed(2)}</TableCell>
                      <TableCell>
                        {producto.variante ? (
                          <Chip label={producto.variante} size="small" variant="outlined" />
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        ${(producto.cantidad * parseFloat(producto.precio_unitario)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function SalesHistory() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVentas();
  }, []);

  const loadVentas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ventasAPI.getHistorial();
      setVentas(data);
    } catch (err) {
      setError('Error al cargar el historial de ventas: ' + err.message);
      console.error('Error cargando ventas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Historial de Ventas
        </Typography>
        <Chip 
          label={`${ventas.length} ventas totales`} 
          color="primary" 
          variant="outlined" 
        />
      </Box>

      {ventas.length === 0 ? (
        <Alert severity="info">No hay ventas registradas</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell><strong>ID Venta</strong></TableCell>
                <TableCell><strong>Fecha</strong></TableCell>
                <TableCell align="center"><strong>Productos</strong></TableCell>
                <TableCell align="right"><strong>Total</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventas.map((venta) => (
                <Row key={venta.id_venta} row={venta} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
