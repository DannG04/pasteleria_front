import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { postresAPI, panAPI, bebidasAPI, extrasAPI, productosAPI } from '../services/apiService';

export default function InventoryManager() {
  const [tabValue, setTabValue] = useState(0);
  const [productos, setProductos] = useState([]);
  const [postres, setPostres] = useState([]);
  const [panes, setPanes] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productosData, postresData, panesData, bebidasData, extrasData] = await Promise.all([
        productosAPI.getAll(),
        postresAPI.getAll(),
        panAPI.getAll(),
        bebidasAPI.getAll(),
        extrasAPI.getAll(),
      ]);
      setProductos(productosData);
      setPostres(postresData);
      setPanes(panesData);
      setBebidas(bebidasData);
      setExtras(extrasData);
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentType = () => {
    const types = ['producto', 'postre', 'pan', 'bebida', 'extra'];
    return types[tabValue];
  };

  const getEmptyForm = (type) => {
    const baseForm = {
      nombre: '',
      descripcion: '',
      imagen_url: '',
      ingredientes: [],
    };

    if (type === 'postre') {
      return {
        ...baseForm,
        tipo_postre: '',
        precio: { small: '', medium: '', big: '' },
        es_dulce: true,
      };
    } else if (type === 'pan') {
      return {
        ...baseForm,
        tipo_pan: '',
        precio: { retail_sale: '', wholesale: '' },
      };
    } else if (type === 'bebida') {
      return {
        ...baseForm,
        tipo_bebida: '',
        precio: { small: '', medium: '', big: '' },
        es_fria: true,
      };
    } else if (type === 'extra') {
      return {
        ...baseForm,
        tipo_extra: '',
        precio: { retail_sale: '', wholesale: '' },
      };
    }
  };

  const handleOpenDialog = (item = null) => {
    const type = getCurrentType();
    if (item) {
      setEditingItem({ ...item, type });
      // Convertir ingredientes array a string
      const ingredientesStr = Array.isArray(item.ingredientes) 
        ? item.ingredientes.join(', ') 
        : item.ingredientes || '';
      setFormData({ ...item, ingredientes: ingredientesStr });
    } else {
      setEditingItem(null);
      const emptyForm = getEmptyForm(type);
      setFormData({ ...emptyForm, ingredientes: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePriceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      precio: {
        ...prev.precio,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const type = editingItem ? editingItem.type : getCurrentType();
      
      // Preparar datos para enviar
      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        imagen_url: formData.imagen_url,
        precio: formData.precio,
        ingredientes: typeof formData.ingredientes === 'string'
          ? formData.ingredientes.split(',').map(i => i.trim()).filter(i => i)
          : formData.ingredientes || [],
      };

      // Agregar campos específicos por tipo
      if (type === 'postre') {
        dataToSend.tipo_postre = formData.tipo_postre;
        dataToSend.es_dulce = formData.es_dulce ?? true;
      } else if (type === 'pan') {
        dataToSend.tipo_pan = formData.tipo_pan;
      } else if (type === 'bebida') {
        dataToSend.tipo_bebida = formData.tipo_bebida;
        dataToSend.es_fria = formData.es_fria ?? true;
      } else if (type === 'extra') {
        dataToSend.tipo_extra = formData.tipo_extra;
      }

      let result;
      if (editingItem) {
        // Actualizar
        if (type === 'postre') {
          result = await postresAPI.update(editingItem.id, dataToSend);
          setPostres((prev) => prev.map((item) => (item.id === editingItem.id ? result : item)));
        } else if (type === 'pan') {
          result = await panAPI.update(editingItem.id, dataToSend);
          setPanes((prev) => prev.map((item) => (item.id === editingItem.id ? result : item)));
        } else if (type === 'bebida') {
          result = await bebidasAPI.update(editingItem.id, dataToSend);
          setBebidas((prev) => prev.map((item) => (item.id === editingItem.id ? result : item)));
        } else if (type === 'extra') {
          result = await extrasAPI.update(editingItem.id, dataToSend);
          setExtras((prev) => prev.map((item) => (item.id === editingItem.id ? result : item)));
        }
        setSuccess('Producto actualizado exitosamente');
      } else {
        // Crear
        if (type === 'postre') {
          result = await postresAPI.create(dataToSend);
          setPostres((prev) => [...prev, result]);
        } else if (type === 'pan') {
          result = await panAPI.create(dataToSend);
          setPanes((prev) => [...prev, result]);
        } else if (type === 'bebida') {
          result = await bebidasAPI.create(dataToSend);
          setBebidas((prev) => [...prev, result]);
        } else if (type === 'extra') {
          result = await extrasAPI.create(dataToSend);
          setExtras((prev) => [...prev, result]);
        }
        setSuccess('Producto creado exitosamente');
      }

      handleCloseDialog();
    } catch (err) {
      setError('Error al guardar: ' + err.message);
      console.error(err);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      if (type === 'postre') {
        await postresAPI.delete(id);
        setPostres((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'pan') {
        await panAPI.delete(id);
        setPanes((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'bebida') {
        await bebidasAPI.delete(id);
        setBebidas((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'extra') {
        await extrasAPI.delete(id);
        setExtras((prev) => prev.filter((item) => item.id !== id));
      }
      setSuccess('Producto eliminado exitosamente');
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
      console.error(err);
    }
  };

  const handleAvailabilityChange = async (type, id, size, newValue) => {
    try {
      let updateData = {};
      
      if (type === 'postre' || type === 'bebida') {
        // Para postres y bebidas: actualizar disponible como tupla (small, medium, big)
        const item = type === 'postre' 
          ? postres.find(p => p.id === id)
          : bebidas.find(b => b.id === id);
        
        const disponible = item?.disponible || { small: true, medium: true, big: true };
        updateData.disponible = {
          small: size === 'small' ? newValue : (disponible.small ?? true),
          medium: size === 'medium' ? newValue : (disponible.medium ?? true),
          big: size === 'big' ? newValue : (disponible.big ?? true),
        };
      } else {
        // Para pan y extras: actualizar disponible como boolean simple
        updateData.disponible = newValue;
      }

      // Llamar al API según el tipo
      if (type === 'postre') {
        await postresAPI.update(id, updateData);
        setPostres((prev) =>
          prev.map((item) => (item.id === id ? { ...item, disponible: updateData.disponible } : item))
        );
      } else if (type === 'pan') {
        await panAPI.update(id, updateData);
        setPanes((prev) =>
          prev.map((item) => (item.id === id ? { ...item, disponible: updateData.disponible } : item))
        );
      } else if (type === 'bebida') {
        await bebidasAPI.update(id, updateData);
        setBebidas((prev) =>
          prev.map((item) => (item.id === id ? { ...item, disponible: updateData.disponible } : item))
        );
      } else if (type === 'extra') {
        await extrasAPI.update(id, updateData);
        setExtras((prev) =>
          prev.map((item) => (item.id === id ? { ...item, disponible: updateData.disponible } : item))
        );
      }
    } catch (err) {
      setError('Error al actualizar disponibilidad: ' + err.message);
      console.error(err);
    }
  };

  const getPriceDisplay = (precio) => {
    if (!precio) return '$0.00';
    
    if (typeof precio === 'object') {
      // Para postres y bebidas (tiene small, medium, big)
      if (precio.small !== undefined) {
        return `$${parseFloat(precio.small).toFixed(2)} - $${parseFloat(precio.big).toFixed(2)}`;
      }
      // Para pan (tiene retail_sale, wholesale)
      if (precio.retail_sale !== undefined) {
        return `$${parseFloat(precio.retail_sale).toFixed(2)} / $${parseFloat(precio.wholesale).toFixed(2)}`;
      }
    }
    
    return `$${parseFloat(precio).toFixed(2)}`;
  };

  const renderAvailabilityControls = (item, type) => {
    if (type === 'postre' || type === 'bebida') {
      // Renderizar 3 switches para small, medium, big
      const disponible = item.disponible || { small: true, medium: true, big: true };
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <FormControlLabel
            control={
              <Switch
                checked={disponible.small ?? true}
                onChange={(e) => handleAvailabilityChange(type, item.id, 'small', e.target.checked)}
                size="small"
              />
            }
            label={<Typography variant="caption">Pequeño</Typography>}
          />
          <FormControlLabel
            control={
              <Switch
                checked={disponible.medium ?? true}
                onChange={(e) => handleAvailabilityChange(type, item.id, 'medium', e.target.checked)}
                size="small"
              />
            }
            label={<Typography variant="caption">Mediano</Typography>}
          />
          <FormControlLabel
            control={
              <Switch
                checked={disponible.big ?? true}
                onChange={(e) => handleAvailabilityChange(type, item.id, 'big', e.target.checked)}
                size="small"
              />
            }
            label={<Typography variant="caption">Grande</Typography>}
          />
        </Box>
      );
    } else {
      // Renderizar 1 switch para pan y extras
      const disponible = item.disponible ?? true;
      return (
        <FormControlLabel
          control={
            <Switch
              checked={disponible}
              onChange={(e) => handleAvailabilityChange(type, item.id, null, e.target.checked)}
            />
          }
          label={disponible ? 'Disponible' : 'No disponible'}
        />
      );
    }
  };

  const renderProductosGeneralTable = (data) => {
    const sortedData = [...data].sort((a, b) => a.id - b.id);
    
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell><strong>Imagen URL</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay productos registrados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">{item.nombre}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {item.descripcion || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {item.imagen_url ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          component="img"
                          src={item.imagen_url}
                          alt={item.nombre}
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          maxWidth: 200, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.imagen_url}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderTable = (data, type) => {
    const sortedData = [...data].sort((a, b) => a.id - b.id);
    
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Disponibilidad</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <Typography fontWeight="medium">{item.nombre}</Typography>
                  {item.descripcion && (
                    <Typography variant="caption" color="text.secondary">
                      {item.descripcion}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{getPriceDisplay(item.precio)}</TableCell>
                <TableCell>
                  {renderAvailabilityControls(item, type)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleOpenDialog(item)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(item.id, type)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Gestión de Inventario
        </Typography>
        {tabValue !== 0 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nuevo Producto
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`Productos General (${productos.length})`} />
          <Tab label={`Postres (${postres.length})`} />
          <Tab label={`Panes (${panes.length})`} />
          <Tab label={`Bebidas (${bebidas.length})`} />
          <Tab label={`Extras (${extras.length})`} />
        </Tabs>
      </Box>

      {tabValue === 0 && renderProductosGeneralTable(productos)}
      {tabValue === 1 && renderTable(postres, 'postre')}
      {tabValue === 2 && renderTable(panes, 'pan')}
      {tabValue === 3 && renderTable(bebidas, 'bebida')}
      {tabValue === 4 && renderTable(extras, 'extra')}

      {/* Dialog para crear/editar producto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth disableRestoreFocus>
        <DialogTitle>
          {editingItem ? 'Editar Producto' : `Nuevo ${getCurrentType() === 'postre' ? 'Postre' : getCurrentType() === 'pan' ? 'Pan' : getCurrentType() === 'bebida' ? 'Bebida' : 'Extra'}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="nombre"
              label="Nombre"
              fullWidth
              value={formData.nombre || ''}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="descripcion"
              label="Descripción"
              fullWidth
              multiline
              rows={2}
              value={formData.descripcion || ''}
              onChange={handleInputChange}
            />
            <TextField
              name="imagen_url"
              label="URL de Imagen"
              fullWidth
              value={formData.imagen_url || ''}
              onChange={handleInputChange}
            />

            {/* Campo tipo según la categoría */}
            {getCurrentType() === 'postre' && (
              <FormControl fullWidth>
                <InputLabel>Tipo de Postre</InputLabel>
                <Select
                  name="tipo_postre"
                  value={formData.tipo_postre || ''}
                  onChange={handleInputChange}
                  label="Tipo de Postre"
                >
                  <MenuItem value="Pastel">Pastel</MenuItem>
                  <MenuItem value="Galleta">Galleta</MenuItem>
                  <MenuItem value="Flan">Flan</MenuItem>
                  <MenuItem value="Gelatina">Gelatina</MenuItem>
                  <MenuItem value="Brownie">Brownie</MenuItem>
                </Select>
              </FormControl>
            )}

            {getCurrentType() === 'pan' && (
              <FormControl fullWidth>
                <InputLabel>Tipo de Pan</InputLabel>
                <Select
                  name="tipo_pan"
                  value={formData.tipo_pan || ''}
                  onChange={handleInputChange}
                  label="Tipo de Pan"
                >
                  <MenuItem value="Dulce">Dulce</MenuItem>
                  <MenuItem value="Salado">Salado</MenuItem>
                </Select>
              </FormControl>
            )}

            {getCurrentType() === 'bebida' && (
              <FormControl fullWidth>
                <InputLabel>Tipo de Bebida</InputLabel>
                <Select
                  name="tipo_bebida"
                  value={formData.tipo_bebida || ''}
                  onChange={handleInputChange}
                  label="Tipo de Bebida"
                >
                  <MenuItem value="Licuado">Licuado</MenuItem>
                  <MenuItem value="Café">Café</MenuItem>
                  <MenuItem value="Refresco">Refresco</MenuItem>
                  <MenuItem value="Jugo">Jugo</MenuItem>
                  <MenuItem value="Té">Té</MenuItem>
                </Select>
              </FormControl>
            )}

            {getCurrentType() === 'extra' && (
              <FormControl fullWidth>
                <InputLabel>Tipo de Extra</InputLabel>
                <Select
                  name="tipo_extra"
                  value={formData.tipo_extra || ''}
                  onChange={handleInputChange}
                  label="Tipo de Extra"
                >
                  <MenuItem value="Vela">Vela</MenuItem>
                  <MenuItem value="Decoración">Decoración</MenuItem>
                  <MenuItem value="Topper">Topper</MenuItem>
                  <MenuItem value="Letrero">Letrero</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* Precios según el tipo */}
            {(getCurrentType() === 'postre' || getCurrentType() === 'bebida') && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Precios por Tamaño</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Pequeño"
                    type="number"
                    value={formData.precio?.small || ''}
                    onChange={(e) => handlePriceChange('small', e.target.value)}
                    inputProps={{ step: '0.01', min: '0' }}
                  />
                  <TextField
                    label="Mediano"
                    type="number"
                    value={formData.precio?.medium || ''}
                    onChange={(e) => handlePriceChange('medium', e.target.value)}
                    inputProps={{ step: '0.01', min: '0' }}
                  />
                  <TextField
                    label="Grande"
                    type="number"
                    value={formData.precio?.big || ''}
                    onChange={(e) => handlePriceChange('big', e.target.value)}
                    inputProps={{ step: '0.01', min: '0' }}
                  />
                </Box>
              </Box>
            )}

            {(getCurrentType() === 'pan' || getCurrentType() === 'extra') && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Precios</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Menudeo"
                    type="number"
                    value={formData.precio?.retail_sale || ''}
                    onChange={(e) => handlePriceChange('retail_sale', e.target.value)}
                    inputProps={{ step: '0.01', min: '0' }}
                  />
                  <TextField
                    label="Mayoreo"
                    type="number"
                    value={formData.precio?.wholesale || ''}
                    onChange={(e) => handlePriceChange('wholesale', e.target.value)}
                    inputProps={{ step: '0.01', min: '0' }}
                  />
                </Box>
              </Box>
            )}

            {getCurrentType() !== 'extra' && (
              <TextField
                name="ingredientes"
                label="Ingredientes (separados por coma)"
                fullWidth
                multiline
                rows={2}
                value={formData.ingredientes || ''}
                onChange={handleInputChange}
              />
            )}

            {getCurrentType() === 'postre' && (
              <FormControlLabel
                control={
                  <Checkbox
                    name="es_dulce"
                    checked={formData.es_dulce ?? true}
                    onChange={handleInputChange}
                  />
                }
                label="¿Es dulce?"
              />
            )}

            {getCurrentType() === 'bebida' && (
              <FormControlLabel
                control={
                  <Checkbox
                    name="es_fria"
                    checked={formData.es_fria ?? true}
                    onChange={handleInputChange}
                  />
                }
                label="¿Es fría?"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
