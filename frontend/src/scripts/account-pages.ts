import '../styles/global.css';

type CartItem = {
    name: string;
    price: string;
    quantity: number;
};

type User = {
    name: string;
    email: string;
    phone_number: string;
};

const ROUTES = {
    home: '/',
    auth: '/auth/',
    profile: '/profile/',
    shopping: '/shopping/',
    cart: '/cart/',
    payment: '/payment/',
} as const;

const page = document.body.dataset.page ?? 'auth';

function escapeHtml(value: unknown): string {
    return String(value).replace(
        /[&<>"']/g,
        (char) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
            })[char]!,
    );
}

function shell(title: string, content: string): string {
    return `
        <main class="portal">
            <a class="portal-mark" href="${ROUTES.home}">
                LUXURIOUS
                <small>BATH STUDIO</small>
            </a>

            <section>
                <p>YOUR PRIVATE STUDIO</p>
                <h1>${title}</h1>
                ${content}
            </section>
        </main>
    `;
}

function render(html: string): void {
    document.body.innerHTML = html;
}

function output(message: string): void {
    document.querySelector('output')!.textContent = message;
}

async function request(url: string, method = 'GET', data?: object): Promise<Response> {
    return fetch(url, {
        method,
        headers: data ? { 'Content-Type': 'application/json' } : undefined,
        body: data ? JSON.stringify(data) : undefined,
    });
}

function formData(form: HTMLFormElement): Record<string, FormDataEntryValue> {
    return Object.fromEntries(new FormData(form).entries());
}

async function auth(): Promise<void> {
    render(
        shell(
            'Welcome back.',
            `
            <form id="auth-form">
                <input name="email" type="email" placeholder="Email" required>
                <input name="password" type="password" placeholder="Password" required>

                <button>Sign in</button>
                <button type="button" id="register">Create account</button>

                <output></output>
            </form>
        `,
        ),
    );

    const form = document.querySelector<HTMLFormElement>('#auth-form')!;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const response = await request('/api/auth/login/', 'POST', formData(form));

        if (response.ok) {
            location.href = ROUTES.profile;
            return;
        }

        output((await response.json()).detail ?? 'Unable to sign in.');
    });

    document.querySelector('#register')!.addEventListener('click', () => {
        form.innerHTML = `
            <input name="name" placeholder="Full name" required>
            <input name="email" type="email" placeholder="Email" required>
            <input name="phone_number" placeholder="Phone (+91...)" required>
            <input name="password" type="password" placeholder="Password" required>

            <button>Create account</button>
            <output></output>
        `;

        // Replace the form to discard the previous submit handler.
        const replacement = form.cloneNode(true) as HTMLFormElement;
        form.replaceWith(replacement);

        replacement.addEventListener('submit', async (event) => {
            event.preventDefault();

            const response = await request('/api/auth/register/', 'POST', formData(replacement));

            if (response.ok) {
                location.href = ROUTES.profile;
                return;
            }

            replacement.querySelector('output')!.textContent =
                (await response.json()).detail ?? 'Registration failed.';
        });
    });
}

async function profile(): Promise<void> {
    const response = await request('/api/auth/session/');

    if (!response.ok) {
        location.href = ROUTES.auth;
        return;
    }

    const user: User = await response.json();

    render(
        shell(
            'Your projects.',
            `
            <div class="portal-card">
                <b>${escapeHtml(user.name)}</b>
                <br>${escapeHtml(user.email)}
                <br>${escapeHtml(user.phone_number)}
            </div>

            <button id="logout">Sign out</button>
        `,
        ),
    );

    document.querySelector('#logout')!.addEventListener('click', async () => {
        await request('/api/auth/logout/', 'POST');
        location.href = ROUTES.home;
    });
}

async function cart(): Promise<void> {
    const response = await request('/api/cart/');

    if (!response.ok) {
        location.href = ROUTES.auth;
        return;
    }

    const items: CartItem[] = await response.json();

    const content = items.length
        ? `
            <div class="portal-card">
                ${items
                    .map(
                        (item) => `
                    <p>
                        ${escapeHtml(item.name)} × ${item.quantity}
                        <br>
                        <b>₹${Number(item.price).toLocaleString('en-IN')}</b>
                    </p>
                `,
                    )
                    .join('')}
            </div>

            <a class="portal-button" href="${ROUTES.payment}">
                Continue to payment →
            </a>
        `
        : '<p>Choose products from the catalogue to start your enquiry.</p>';

    render(shell('Your enquiry list.', content));
}

async function payment(): Promise<void> {
    render(
        shell(
            'Secure payment.',
            `
            <p>Your final price is always verified by our server before checkout.</p>
            <button id="pay">Start secure checkout</button>
            <output></output>
        `,
        ),
    );

    document.querySelector('#pay')!.addEventListener('click', async () => {
        const response = await request('/api/payments/init/', 'POST');

        output(
            response.ok
                ? 'Razorpay order created. Add your test keys to enable the hosted checkout.'
                : ((await response.json()).detail ?? 'Unable to initialize payment.'),
        );
    });
}

function injectStyles(): void {
    const style = document.createElement('style');

    style.textContent = `
        .portal {
            min-height: 100vh;
            background: #24221f;
            color: #f1eee7;
            padding: 7vw;
            font-family: Georgia;
        }

        .portal-mark {
            color: #f1eee7;
            font: 700 17px Arial;
            letter-spacing: 2px;
        }

        .portal-mark small {
            display: block;
            letter-spacing: 4px;
            font-size: 8px;
            margin-top: 5px;
        }

        .portal section {
            max-width: 560px;
            margin: 13vh auto;
        }

        .portal section > p {
            font: 10px Arial;
            letter-spacing: 2px;
        }

        .portal h1 {
            font-size: clamp(48px, 7vw, 86px);
            font-weight: 400;
            letter-spacing: -3px;
        }

        .portal form,
        .portal-card {
            display: grid;
            gap: 12px;
            background: #35312c;
            padding: 24px;
            font-family: Arial;
        }

        .portal input,
        .portal button,
        .portal-button {
            padding: 13px;
            border: 1px solid #aaa08b;
            background: transparent;
            color: #f1eee7;
            font: 13px Arial;
        }

        .portal button,
        .portal-button {
            background: #e4d19a;
            color: #201e1a;
            cursor: pointer;
            text-decoration: none;
        }

        .portal output {
            color: #f0b9a7;
        }
    `;

    document.head.append(style);
}

async function main(): Promise<void> {
    injectStyles();

    switch (page) {
        case 'auth':
            await auth();
            break;

        case 'profile':
            await profile();
            break;

        case 'cart':
            await cart();
            break;

        case 'payment':
            await payment();
            break;

        default:
            console.warn(`Unknown page: ${page}`);
    }
}

void main();
