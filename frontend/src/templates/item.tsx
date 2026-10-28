interface Item {
    id: string;
    image: string;
    name: string;
    price_currency: string;
    price: number;
    discounted?: number;
    discounted_price?: number;
    short_description: string;
}

export default function ProductCard({ product }: { product: Item }) {
    return (
        <div className="product-card" dataset={{ product_id: product.id }}>
            <img src={product.image} alt={product.name} />
            <div className="product-info">
                <span className="product-name">{product.name}</span>
                <span className="product-price">
                    {product.discounted && (
                        <span className="product-original-price">
                            {product.price_currency}
                            {product.price}
                        </span>
                    )}
                    <span className="product-price">
                        {product.price_currency}
                        {product.discounted
                            ? product.discounted_price
                            : product.price}
                    </span>
                </span>
                <span className="product-description">
                    {product.short_description}
                </span>
            </div>
        </div>
    );
}
