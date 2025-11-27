
import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { postresAPI, panAPI, bebidasAPI, extrasAPI } from '../services/apiService';

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const [postres, panes, bebidas, extras] = await Promise.all([
                postresAPI.getAll(),
                panAPI.getAll(),
                bebidasAPI.getAll(),
                extrasAPI.getAll(),
            ]);

            // Combinar todos los productos y agregar una propiedad de tipo para diferenciarlos
            const allProducts = [
                ...postres.map(p => ({ ...p, tipo_categoria: 'postre' })),
                ...panes.map(p => ({ ...p, tipo_categoria: 'pan' })),
                ...bebidas.map(b => ({ ...b, tipo_categoria: 'bebida' })),
                ...extras.map(e => ({ ...e, tipo_categoria: 'extra' })),
            ];

            // Debug: verificar campo disponible
            console.log('Productos cargados:', allProducts);
            console.log('Ejemplo de producto:', allProducts[0]);

            setProducts(allProducts);
        } catch (err) {
            setError('Error al cargar los productos: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
                <Navbar />
                <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
            <Navbar />
            <Container sx={{ py: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}
                
                {products.length === 0 && !error ? (
                    <Typography variant="h6" textAlign="center" color="text.secondary">
                        No hay productos disponibles
                    </Typography>
                ) : (
                    <Grid container spacing={4}>
                        {products.map((product) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`${product.tipo_categoria}-${product.id}`} sx={{ display: 'flex' }}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}

export default Dashboard;