interface CartItemDescription {
    id: string;
    name: string;
    image: string;
    price: number;
}

const activeCartItems: HTMLDivElement[] = [];

export default function CartItem({ item }: { item: CartItemDescription }) {
    const cartItem = (
        <div className="cart-item" data-item-id={item.id}>
            <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
            </div>
            <div className="cart-item-content">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">{item.price}</span>
            </div>
        </div>
    );

    activeCartItems.push(cartItem as HTMLDivElement);
    return cartItem;
}

interface CartItemUpdate {
    del?: boolean;
    edits?: Partial<CartItemDescription>;
}

export function updateCartItem(id: string, update: CartItemUpdate) {
    if (update.del) {
        const index = activeCartItems.findIndex((i) => i.dataset.itemId == id);

        if (index == -1) {
            return;
        }

        const item = activeCartItems[index];
        activeCartItems.splice(index, 1);

        item.remove();
    } else if (update.edits) {
        // TODO: implement
    }
    // TODO: give user a heads up
}
