import type { Product } from '../../scripts/catalogue-types';

const money = (value: string) => `₹${Number(value).toLocaleString('en-IN')}`;

export function ProductCard({
    product,
    onAdd,
}: {
    product: Product;
    onAdd: (catalogueId: string) => void;
}) {
    return (
        <article className="lbs-card">
            <div className="lbs-product-image">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} />
                ) : (
                    <span>IMAGE PENDING</span>
                )}
            </div>
            <p>{product.category}</p>
            <h3>{product.name}</h3>
            <small>{product.catalogue_id}</small>
            <div>
                <strong>{money(product.selling_price)}</strong>
                <button onClick={() => onAdd(product.catalogue_id)}>Add to enquiry +</button>
            </div>
        </article>
    );
}
