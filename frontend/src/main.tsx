import './style.css';

type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    mrp: number;
    rating: number;
    image: string;
    tag: string;
};
const products: Product[] = [
    {
        id: 'terra',
        name: 'Terra Everyday Backpack',
        category: 'Bags',
        price: 2499,
        mrp: 3199,
        rating: 4.8,
        tag: 'Best seller',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85',
    },
    {
        id: 'orbit',
        name: 'Orbit Wireless Headphones',
        category: 'Tech',
        price: 3499,
        mrp: 4499,
        rating: 4.7,
        tag: 'New drop',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85',
    },
    {
        id: 'cloud',
        name: 'Cloud Knit Sneakers',
        category: 'Footwear',
        price: 2899,
        mrp: 3699,
        rating: 4.9,
        tag: 'Popular',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85',
    },
    {
        id: 'arc',
        name: 'Arc Insulated Bottle',
        category: 'Home',
        price: 899,
        mrp: 1199,
        rating: 4.6,
        tag: 'Limited stock',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=85',
    },
    {
        id: 'linen',
        name: 'Linen Overshirt',
        category: 'Apparel',
        price: 1999,
        mrp: 2699,
        rating: 4.5,
        tag: 'Easy wear',
        image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=700&q=85',
    },
    {
        id: 'halo',
        name: 'Halo Desk Lamp',
        category: 'Home',
        price: 1699,
        mrp: 2199,
        rating: 4.7,
        tag: 'Staff pick',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85',
    },
];
const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;
const cart = new Map<string, number>();
let category = 'All';
let query = '';

function ProductCard({ product }: { product: Product }) {
    const discount = Math.round((1 - product.price / product.mrp) * 100);
    return (
        <article className="product-card">
            <div className="product-image-wrap">
                <span className="product-badge">{product.tag}</span>
                <img className="product-image" src={product.image} alt={product.name} />
                <button className="heart-button" aria-label={`Save ${product.name}`}>
                    ♡
                </button>
            </div>
            <div className="product-copy">
                <p className="product-category">{product.category}</p>
                <h3>{product.name}</h3>
                <p className="rating">
                    ★ {product.rating} <span>Hand-picked</span>
                </p>
                <div className="price-row">
                    <strong>{money(product.price)}</strong>
                    <s>{money(product.mrp)}</s>
                    <em>{discount}% off</em>
                </div>
                <button className="add-button" onClick={() => add(product.id)}>
                    Add to cart <span>+</span>
                </button>
            </div>
        </article>
    );
}
function App() {
    return (
        <main>
            <header className="site-header">
                <a className="brand" href="#top">
                    field<span>day</span>
                </a>
                <nav>
                    <a href="#shop">Shop</a>
                    <a href="#story">Our story</a>
                    <a href="#journal">Journal</a>
                </nav>
                <div className="header-actions">
                    <button aria-label="Search" className="search-toggle">
                        ⌕
                    </button>
                    <button className="account-button">Account</button>
                    <button className="cart-button" onClick={openCart}>
                        Bag <span id="cart-count">0</span>
                    </button>
                </div>
            </header>
            <section className="hero" id="top">
                <div className="hero-copy">
                    <p className="eyebrow">Made for the everyday</p>
                    <h1>
                        Useful things,
                        <br />
                        <i>beautifully</i> done.
                    </h1>
                    <p className="hero-text">
                        Thoughtfully chosen essentials for the way you actually live.
                    </p>
                    <a className="primary-link" href="#shop">
                        Shop the collection <span>→</span>
                    </a>
                </div>
                <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90"
                        alt="Person wearing casual everyday clothing"
                    />
                    <div className="hero-note">
                        SPRING / SUMMER
                        <br />
                        <b>2026</b>
                    </div>
                </div>
            </section>
            <section className="benefits">
                <span>✦ Free shipping over ₹1,500</span>
                <span>↻ 14-day easy returns</span>
                <span>♡ Made to last</span>
            </section>
            <section className="shop-section" id="shop">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">The collection</p>
                        <h2>Find your next favourite.</h2>
                    </div>
                    <p>Less noise, more good stuff. Browse our small, considered edit.</p>
                </div>
                <div className="shop-tools">
                    <div className="filters">
                        {['All', 'Bags', 'Tech', 'Footwear', 'Home', 'Apparel'].map((item) => (
                            <button
                                className={item === 'All' ? 'filter active' : 'filter'}
                                onClick={() => selectCategory(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                    <label className="search-box">
                        ⌕<input placeholder="Search products" onInput={searchProducts} />
                    </label>
                </div>
                <div className="product-grid" id="product-grid">
                    {products.map((product) => (
                        <ProductCard product={product} />
                    ))}
                </div>
            </section>
            <section className="story" id="story">
                <div>
                    <p className="eyebrow">Why fieldday</p>
                    <h2>
                        Better basics,
                        <br />
                        without the fuss.
                    </h2>
                </div>
                <p>
                    We look for pieces with a clear purpose, honest materials, and enough charm to
                    earn a place in your routine. Nothing here is trying too hard.
                </p>
                <a href="#top">Meet the makers →</a>
            </section>
            <footer>
                <a className="brand" href="#top">
                    field<span>day</span>
                </a>
                <p>Small things. Good days.</p>
                <p>© 2026 fieldday</p>
            </footer>
            <Cart />
            <div className="overlay" id="overlay" onClick={closeCart} />
        </main>
    );
}
function Cart() {
    return (
        <aside className="cart-drawer" id="cart-drawer" aria-hidden="true">
            <div className="cart-heading">
                <div>
                    <p className="eyebrow">Your bag</p>
                    <h2>Good choices.</h2>
                </div>
                <button className="close-button" onClick={closeCart}>
                    ×
                </button>
            </div>
            <div id="cart-items" className="cart-items">
                <p className="empty-cart">Your bag is waiting for something good.</p>
            </div>
            <div className="cart-footer">
                <div>
                    <span>Subtotal</span>
                    <strong id="cart-total">₹0</strong>
                </div>
                <small>Taxes and shipping are calculated at checkout.</small>
                <button
                    className="checkout-button"
                    onClick={() => alert('Checkout is ready to connect to your Django order API.')}
                >
                    Continue to checkout →
                </button>
            </div>
        </aside>
    );
}
function renderProducts() {
    const grid = document.querySelector('#product-grid');
    const filtered = products.filter(
        (p) =>
            (category === 'All' || p.category === category) && p.name.toLowerCase().includes(query),
    );
    if (grid) grid.replaceChildren(...filtered.map((p) => <ProductCard product={p} />));
}
function selectCategory(next: string) {
    category = next;
    document
        .querySelectorAll('.filter')
        .forEach((button) => button.classList.toggle('active', button.textContent === next));
    renderProducts();
}
function searchProducts(event: Event) {
    query = (event.target as HTMLInputElement).value.toLowerCase();
    renderProducts();
}
function add(id: string) {
    cart.set(id, (cart.get(id) ?? 0) + 1);
    renderCart();
    openCart();
}
function quantity(id: string, by: number) {
    const next = (cart.get(id) ?? 0) + by;
    if (next <= 0) cart.delete(id);
    else cart.set(id, next);
    renderCart();
}
function renderCart() {
    const items = document.querySelector('#cart-items');
    const count = document.querySelector('#cart-count');
    const total = document.querySelector('#cart-total');
    const amount = [...cart.entries()].reduce(
        (sum, [id, n]) => sum + (products.find((p) => p.id === id)?.price ?? 0) * n,
        0,
    );
    if (count) count.textContent = String([...cart.values()].reduce((a, b) => a + b, 0));
    if (total) total.textContent = money(amount);
    if (!items) return;
    if (!cart.size) {
        items.replaceChildren(
            <p className="empty-cart">Your bag is waiting for something good.</p>,
        );
        return;
    }
    items.replaceChildren(
        ...[...cart.entries()].map(([id, n]) => {
            const p = products.find((x) => x.id === id)!;
            return (
                <div className="cart-line">
                    <img src={p.image} alt={p.name} />
                    <div>
                        <h3>{p.name}</h3>
                        <p>{money(p.price)}</p>
                        <div className="quantity">
                            <button onClick={() => quantity(id, -1)}>−</button>
                            <span>{n}</span>
                            <button onClick={() => quantity(id, 1)}>+</button>
                        </div>
                    </div>
                    <strong>{money(p.price * n)}</strong>
                </div>
            );
        }),
    );
}
function openCart() {
    document.body.classList.add('cart-open');
}
function closeCart() {
    document.body.classList.remove('cart-open');
}
document.body.append(<App />);
