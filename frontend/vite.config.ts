import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        rolldownOptions: {
            input: {
                main: path.resolve(import.meta.dirname, 'index.html'), // aka also the main page
                profile: path.resolve(
                    import.meta.dirname,
                    'pages/profile.html',
                ),
                auth: path.resolve(import.meta.dirname, 'pages/auth.html'),
                shopping: path.resolve(
                    import.meta.dirname,
                    'pages/shopping.html',
                ),
            },
        },
    },
    resolve: {
        alias: {
            'minimal-jsx': path.resolve(__dirname, 'minimal-jsx'),
        },
    },
});
