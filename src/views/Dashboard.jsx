
import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

function Dashboard() {
    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
            <Navbar />
            <Container sx={{ py: 4 }}>
                <Grid container spacing={4}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id} sx={{ display: 'flex' }}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default Dashboard;