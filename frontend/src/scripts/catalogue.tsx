import '../styles/catalogue.css';
import '../styles/filters.css';
import '../styles/global.css';
import '../styles/hero-search.css';
import { Storefront } from '../templates/catalogue/Storefront';
import type { Product } from './catalogue-types';

let products: Product[] = [];
const shopping = document.body.dataset.page === 'shopping';
let search = new URLSearchParams(location.search).get('q')?.toLowerCase() ?? '';
let category = 'All';

async function addToCart(catalogueId: string) {
    const response = await fetch('/api/cart/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalogue_id: catalogueId }),
    });
    if (response.status === 401 || response.status === 403) location.href = '/pages/auth.html';
    else alert(response.ok ? 'Added to your enquiry list.' : 'Could not add this product.');
}

function visibleProducts() {
    return products.filter(
        (product) =>
            (category === 'All' || product.category === category) &&
            `${product.name} ${product.catalogue_id}`.toLowerCase().includes(search),
    );
}

function render() {
    const displayed = shopping
        ? visibleProducts()
        : [...products].sort(() => Math.random() - 0.5).slice(0, 3);
    document.body.replaceChildren(
        <Storefront
            products={displayed}
            categories={[...new Set(products.map((product) => product.category))].sort()}
            selectedCategory={category}
            shopping={shopping}
            onAdd={addToCart}
            onSearch={(value) => {
                location.href = `/pages/shopping.html?q=${encodeURIComponent(value)}`;
            }}
            onNameFilter={(value) => {
                search = value.toLowerCase();
                render();
            }}
            onCategory={(value) => {
                category = value;
                render();
            }}
        />,
    );
}

async function boot() {
    const response = await fetch('/api/products/');
    products = response.ok ? ((await response.json()) as Product[]) : [];
    render();
}

boot();
