import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    server: {
        proxy: {
            '/api': 'http://127.0.0.1:8000',
            '/media': 'http://127.0.0.1:8000',
        },
    },
    build: {
        rolldownOptions: {
            input: {
                main: path.resolve(import.meta.dirname, 'index.html'), // aka also the main page
                profile: path.resolve(import.meta.dirname, 'pages/profile.html'),
                auth: path.resolve(import.meta.dirname, 'pages/auth.html'),
                shopping: path.resolve(import.meta.dirname, 'pages/shopping.html'),
                cart: path.resolve(import.meta.dirname, 'pages/cart.html'),
                payment: path.resolve(import.meta.dirname, 'pages/payment.html'),
            },
        },
    },
    resolve: {
        alias: {
            'minimal-jsx': path.resolve(import.meta.dirname, 'minimal-jsx'),
        },
    },
});
