import type { Product } from '../../scripts/catalogue-types';
import { ProductCard } from './ProductCard';

export function Storefront({
    products,
    categories,
    selectedCategory,
    shopping,
    onAdd,
    onSearch,
    onNameFilter,
    onCategory,
}: {
    products: Product[];
    categories: string[];
    selectedCategory: string;
    shopping: boolean;
    onAdd: (catalogueId: string) => void;
    onSearch: (value: string) => void;
    onNameFilter: (value: string) => void;
    onCategory: (value: string) => void;
}) {
    return (
        <main className="lbs">
            <header>
                <a className="lbs-mark" href="/">
                    LUXURIOUS <span>BATH STUDIO</span>
                </a>
                <nav>
                    <a href="/shopping/">Shop</a>
                    <a href="#studio">Studio</a>
                    <a href="/cart/">My enquiry</a>
                    <a href="/profile/">Account</a>
                </nav>
                <a className="lbs-call" href="tel:9829005062">
                    Book a visit ↗
                </a>
            </header>
            {!shopping && (
                <section className="lbs-hero">
                    <div>
                        <p>JAIPUR · BATHROOM DESIGN DESTINATION</p>
                        <h1>
                            Every day
                            <br />
                            <i>deserves</i> a ritual.
                        </h1>
                        <div className="hero-search">
                            <input
                                placeholder="Search product or code"
                                onKeyDown={(event) => {
                                    if ((event as KeyboardEvent).key === 'Enter') {
                                        onSearch((event.target as HTMLInputElement).value);
                                    }
                                }}
                            />
                            <a href="/shopping">Browse catalogue →</a>
                        </div>
                    </div>
                    <aside>
                        CURATED
                        <br />
                        BATHROOM
                        <br />
                        EXPERIENCES
                    </aside>
                </section>
            )}
            <section id="collection" className="lbs-collection">
                <header>
                    <div>
                        <p>LIVE CATALOGUE</p>
                        <h2>
                            {shopping ? 'Shop bathroom essentials.' : 'Featured showroom picks.'}
                        </h2>
                    </div>
                </header>
                {shopping && (
                    <div className="catalogue-tools">
                        <label>
                            Product name
                            <input
                                placeholder="Search by name or code"
                                onInput={(event) =>
                                    onNameFilter((event.target as HTMLInputElement).value)
                                }
                            />
                        </label>
                        <label>
                            Category
                            <select
                                value={selectedCategory}
                                onChange={(event) =>
                                    onCategory((event.target as HTMLSelectElement).value)
                                }
                            >
                                <option>All</option>
                                {categories.map((category) => (
                                    <option>{category}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Finish / color
                            <select>
                                <option>All finishes</option>
                                <option>Chrome</option>
                                <option>White</option>
                                <option>Black</option>
                                <option>Gold</option>
                            </select>
                        </label>
                        <label>
                            Price range
                            <select>
                                <option>All prices</option>
                                <option>Under ₹50,000</option>
                                <option>₹50,000 – ₹2,00,000</option>
                                <option>Above ₹2,00,000</option>
                            </select>
                        </label>
                    </div>
                )}
                <div className="lbs-grid" id="product-grid">
                    {products.map((product) => (
                        <ProductCard product={product} onAdd={onAdd} />
                    ))}
                </div>
            </section>
            <section id="studio" className="lbs-studio">
                <div>
                    <p>VISIT THE STUDIO</p>
                    <h2>
                        Make it
                        <br />
                        <i>personal.</i>
                    </h2>
                </div>
                <address>
                    Showroom no. 2, Plot no. JMC 959
                    <br />
                    After Jhotwara-Ambabari Flyover
                    <br />
                    Near Panipech Signal, Jaipur 302012
                    <br />
                    <br />
                    <a href="tel:9829005062">98290 05062</a> /{' '}
                    <a href="tel:9887300140">98873 00140</a>
                </address>
            </section>
        </main>
    );
}
