import"./global-D29Y96yR.js";var e={home:`/`,auth:`/auth/`,profile:`/profile/`,shopping:`/shopping/`,cart:`/cart/`,payment:`/payment/`},t=document.body.dataset.page??`auth`;function n(e){return String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}function r(t,n){return`
        <main class="portal">
            <a class="portal-mark" href="${e.home}">
                LUXURIOUS
                <small>BATH STUDIO</small>
            </a>

            <section>
                <p>YOUR PRIVATE STUDIO</p>
                <h1>${t}</h1>
                ${n}
            </section>
        </main>
    `}function i(e){document.body.innerHTML=e}function a(e){document.querySelector(`output`).textContent=e}async function o(e,t=`GET`,n){return fetch(e,{method:t,headers:n?{"Content-Type":`application/json`}:void 0,body:n?JSON.stringify(n):void 0})}function s(e){return Object.fromEntries(new FormData(e).entries())}async function c(){i(r(`Welcome back.`,`
            <form id="auth-form">
                <input name="email" type="email" placeholder="Email" required>
                <input name="password" type="password" placeholder="Password" required>

                <button>Sign in</button>
                <button type="button" id="register">Create account</button>

                <output></output>
            </form>
        `));let t=document.querySelector(`#auth-form`);t.addEventListener(`submit`,async n=>{n.preventDefault();let r=await o(`/api/auth/login/`,`POST`,s(t));r.ok?location.href=e.profile:a((await r.json()).detail??`Unable to sign in.`)}),document.querySelector(`#register`).addEventListener(`click`,()=>{t.innerHTML=`
            <input name="name" placeholder="Full name" required>
            <input name="email" type="email" placeholder="Email" required>
            <input name="phone_number" placeholder="Phone (+91...)" required>
            <input name="password" type="password" placeholder="Password" required>

            <button>Create account</button>
            <output></output>
        `;let n=t.cloneNode(!0);t.replaceWith(n),n.addEventListener(`submit`,async t=>{t.preventDefault();let r=await o(`/api/auth/register/`,`POST`,s(n));r.ok?location.href=e.profile:n.querySelector(`output`).textContent=(await r.json()).detail??`Registration failed.`})})}async function l(){let t=await o(`/api/auth/session/`);if(!t.ok){location.href=e.auth;return}let a=await t.json();i(r(`Your projects.`,`
            <div class="portal-card">
                <b>${n(a.name)}</b>
                <br>${n(a.email)}
                <br>${n(a.phone_number)}
            </div>

            <button id="logout">Sign out</button>
        `)),document.querySelector(`#logout`).addEventListener(`click`,async()=>{await o(`/api/auth/logout/`,`POST`),location.href=e.home})}async function u(){let t=await o(`/api/cart/`);if(!t.ok){location.href=e.auth;return}let a=await t.json();i(r(`Your enquiry list.`,a.length?`
            <div class="portal-card">
                ${a.map(e=>`
                    <p>
                        ${n(e.name)} × ${e.quantity}
                        <br>
                        <b>₹${Number(e.price).toLocaleString(`en-IN`)}</b>
                    </p>
                `).join(``)}
            </div>

            <a class="portal-button" href="${e.payment}">
                Continue to payment →
            </a>
        `:`<p>Choose products from the catalogue to start your enquiry.</p>`))}async function d(){i(r(`Secure payment.`,`
            <p>Your final price is always verified by our server before checkout.</p>
            <button id="pay">Start secure checkout</button>
            <output></output>
        `)),document.querySelector(`#pay`).addEventListener(`click`,async()=>{let e=await o(`/api/payments/init/`,`POST`);a(e.ok?`Razorpay order created. Add your test keys to enable the hosted checkout.`:(await e.json()).detail??`Unable to initialize payment.`)})}function f(){let e=document.createElement(`style`);e.textContent=`
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
    `,document.head.append(e)}async function p(){switch(f(),t){case`auth`:await c();break;case`profile`:await l();break;case`cart`:await u();break;case`payment`:await d();break;default:console.warn(`Unknown page: ${t}`)}}p();