import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export default function Ticket({ open, onClose, cart, total, purchaseResult }) {
  
  const currentDate = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2, fontFamily: 'monospace' }}>
          {/* Purchase Status Alert */}
          {purchaseResult && (
            <Alert
              severity={purchaseResult.success ? 'success' : 'error'}
              icon={purchaseResult.success ? <CheckCircleIcon /> : <ErrorIcon />}
              sx={{ mb: 2, textAlign: 'left' }}
            >
              {purchaseResult.success
                ? `${purchaseResult.message} (ID: ${purchaseResult.ventaId})`
                : `Error: ${purchaseResult.error}`}
            </Alert>
          )}

          {/* Header */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            Pastelería SweetObject
          </Typography>
          <Typography variant="body2" gutterBottom>
            Universidad de la Sierra Sur
          </Typography>
          <Typography variant="body2" gutterBottom>
            Tel: 951-510-8874
          </Typography>
          
          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

          {/* Ticket Info */}
          <Box sx={{ textAlign: 'left', mb: 2 }}>
            <Typography variant="body2">Fecha: </Typography>
            <Typography variant="body2">{currentDate}</Typography>
          </Box>

          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

          {/* Items */}
          <Box sx={{ textAlign: 'left', mb: 2 }}>
            {cart.map((item) => (
              <Box key={item.id} sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {item.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 2 }}>
                  <Typography variant="body2">
                    {item.quantity} x ${item.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    ${(item.quantity * item.price).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

          {/* Total */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              TOTAL:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              ${total.toFixed(2)}
            </Typography>
          </Box>

          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

          {/* Footer */}
          <Typography variant="body2" sx={{ mt: 2 }}>
            ¡Gracias por su compra!
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Pase al mostrador a recoger su pedido.
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button variant="outlined" onClick={handlePrint} startIcon={<PrintIcon />}>
              Imprimir
            </Button>
            <Button variant="contained" onClick={onClose}>
              Cerrar
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
