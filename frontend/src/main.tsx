import ProductCard from './templates/item';

document.body.append(
    <ProductCard
        product={{
            id: 'stolen-car',
            name: 'Car',
            short_description: 'What a car',
            price: 1000,
            price_currency: '$',
            image: 'https://picsum.photos/512/512',
        }}
    ></ProductCard>,
);
