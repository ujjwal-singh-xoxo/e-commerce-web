import '../styles/global.css';
const page = document.body.dataset.page ?? 'auth';
const shell = (title: string, body: string) =>
    `<main class="portal"><a class="portal-mark" href="/">LUXURIOUS <small>BATH STUDIO</small></a><section><p>YOUR PRIVATE STUDIO</p><h1>${title}</h1>${body}</section></main>`;
async function request(url: string, method = 'GET', data?: object) {
    return fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
    });
}
async function auth() {
    document.body.innerHTML = shell(
        'Welcome back.',
        `<form id="auth-form"><input name="email" type="email" placeholder="Email" required><input name="password" type="password" placeholder="Password" required><button>Sign in</button><button type="button" id="register">Create account</button><output></output></form>`,
    );
    document.querySelector('#auth-form')!.addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = new FormData(e.target as HTMLFormElement);
        const r = await request('/api/auth/login/', 'POST', Object.fromEntries(f));
        if (r.ok) location.href = '/pages/profile.html';
        else document.querySelector('output')!.textContent = (await r.json()).detail;
    });
    document.querySelector('#register')!.addEventListener('click', () => {
        document.querySelector('#auth-form')!.innerHTML =
            `<input name="name" placeholder="Full name" required><input name="email" type="email" placeholder="Email" required><input name="phone_number" placeholder="Phone (+91...)" required><input name="password" type="password" placeholder="Password" required><button>Create account</button><output></output>`;
        document.querySelector('#auth-form')!.addEventListener('submit', async (e) => {
            e.preventDefault();
            const r = await request(
                '/api/auth/register/',
                'POST',
                Object.fromEntries(new FormData(e.target as HTMLFormElement)),
            );
            if (r.ok) location.href = '/pages/profile.html';
            else document.querySelector('output')!.textContent = (await r.json()).detail;
        });
    });
}
async function profile() {
    const r = await request('/api/auth/session/');
    if (!r.ok) {
        location.href = '/pages/auth.html';
        return;
    }
    const u = await r.json();
    document.body.innerHTML = shell(
        'Your projects.',
        `<div class="portal-card"><b>${u.name}</b><br>${u.email}<br>${u.phone_number}</div><button id="logout">Sign out</button>`,
    );
    document.querySelector('#logout')!.addEventListener('click', async () => {
        await request('/api/auth/logout/', 'POST');
        location.href = '/';
    });
}
async function cart() {
    const r = await request('/api/cart/');
    if (!r.ok) {
        location.href = '/pages/auth.html';
        return;
    }
    const items = await r.json();
    document.body.innerHTML = shell(
        'Your enquiry list.',
        items.length
            ? `<div class="portal-card">${items.map((i: { name: string; price: string; quantity: number }) => `<p>${i.name} × ${i.quantity}<br><b>₹${Number(i.price).toLocaleString('en-IN')}</b></p>`).join('')}</div><a class="portal-button" href="/pages/payment.html">Continue to payment →</a>`
            : '<p>Choose products from the catalogue to start your enquiry.</p>',
    );
}
async function payment() {
    document.body.innerHTML = shell(
        'Secure payment.',
        `<p>Your final price is always verified by our server before checkout.</p><button id="pay">Start secure checkout</button><output></output>`,
    );
    document.querySelector('#pay')!.addEventListener('click', async () => {
        const r = await request('/api/payments/init/', 'POST');
        document.querySelector('output')!.textContent = r.ok
            ? 'Razorpay order created. Add your test keys to enable the hosted checkout.'
            : (await r.json()).detail;
    });
}
const style = document.createElement('style');
style.textContent = `.portal{min-height:100vh;background:#24221f;color:#f1eee7;padding:7vw;font-family:Georgia}.portal-mark{color:#f1eee7;font:700 17px Arial;letter-spacing:2px}.portal-mark small{display:block;letter-spacing:4px;font-size:8px;margin-top:5px}.portal section{max-width:560px;margin:13vh auto}.portal section>p{font:10px Arial;letter-spacing:2px}.portal h1{font-size:clamp(48px,7vw,86px);font-weight:400;letter-spacing:-3px}.portal form,.portal-card{display:grid;gap:12px;background:#35312c;padding:24px;font-family:Arial}.portal input,.portal button,.portal-button{padding:13px;border:1px solid #aaa08b;background:transparent;color:#f1eee7;font:13px Arial}.portal button,.portal-button{background:#e4d19a;color:#201e1a;cursor:pointer;text-decoration:none}.portal output{color:#f0b9a7}`;
document.head.append(style);
if (page === 'auth') auth();
else if (page === 'profile') profile();
else if (page === 'cart') cart();
else payment();
