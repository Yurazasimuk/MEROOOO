const productsDatabase = {
    'wool-coat': {
        title: 'ESSENTIAL WHITE TEE',
        price: '18 500 UAH',
        image: 'https://i.pinimg.com/1200x/06/7d/03/067d0313c3e9482aef3804296aadd53c.jpg',
        material: '100% бавовна',
        desc: 'Базова біла футболка для повсякденного гардероба.'
    },
    'silk-dress': {
        title: 'CLASSIC BLACK PANTS',
        price: '11 200 UAH',
        image: 'https://i.pinimg.com/736x/ee/84/e9/ee84e974114215cadb50384fdd363448.jpg',
        material: 'вовна та віскоза',
        desc: 'Класичні чорні штани прямого крою. Ідеальні для офісу.'
    },
    'textured-sweater': { //
        title: 'WATERPROOF TEXTILE JACKET',
        price: '3 200 UAH',
        image: 'https://i.pinimg.com/736x/9b/e7/a6/9be7a6eee1f21d78568068faa566bae7.jpg',
        material: 'водонепроникний нейлон (синтетика)',
        desc: 'Технологічна куртка від дощу та вітру. Легка, але тепла.'
    },
    'oversized-blazer': {
        title: 'OVERSIZED BLACK HOODIE',
        price: '12 400 UAH',
        image: 'https://i.pinimg.com/1200x/d1/2c/03/d12c0361acdcde47bcd21d8e114ea3d7.jpg',
        material: 'щільна бавовна (фліс)',
        desc: 'Комфортне худі оверсайз крою.'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId && productsDatabase[productId]) {
        const product = productsDatabase[productId];
        const titleEl = document.getElementById('dynamic-title');
        const priceEl = document.getElementById('dynamic-price');
        const imgEl = document.getElementById('dynamic-img');
        const descEl = document.getElementById('dynamic-desc');

        if (titleEl) titleEl.textContent = product.title;
        if (priceEl) priceEl.textContent = product.price;
        if (imgEl) imgEl.src = product.image;
        if (descEl) descEl.textContent = product.desc;
    }
});

document.addEventListener('DOMContentLoaded', () => {

    const injectCart = () => {
        if (document.getElementById('side-cart')) return;
        const cartHTML = `
            <div class="cart-overlay" id="cart-overlay"></div>
            <div class="side-cart" id="side-cart">
                <div class="cart-header">
                    <h2 class="cart-title">YOUR BAG (<span id="cart-count-title">0</span>)</h2>
                    <button class="close-cart" id="close-cart">✕ CLOSE</button>
                </div>
                <div class="cart-items" id="cart-items-container">
                    <p class="empty-msg">Your bag is currently empty.</p>
                </div>
                <div class="cart-footer">
                    <div class="cart-total"><span>SUBTOTAL</span><span id="cart-subtotal">0 UAH</span></div>
                    <button class="btn-black checkout-btn">CHECKOUT</button>
                    <a href="catalog.html" class="continue-shopping">Continue Shopping</a>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', cartHTML);
    };
    injectCart();

    setTimeout(() => { document.body.classList.add('content-loaded'); }, 200);


    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    if (authTabs.length > 0) {
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(f => f.classList.remove('active'));
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-target');
                const targetForm = document.getElementById(targetId);
                if(targetForm) targetForm.classList.add('active');
            });
        });
    }

    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = registerForm.querySelectorAll('input');
            const name = inputs[0].value.trim();
            const email = inputs[1].value.trim();
            const password = inputs[2].value;
            if (password.length < 6) { alert('Password must be at least 6 characters.'); return; }
            const usersDB = JSON.parse(localStorage.getItem('meroUsers')) || {};
            if (usersDB[email]) { alert('Account already exists. Please SIGN IN.'); return; }
            usersDB[email] = { name: name, password: password };
            localStorage.setItem('meroUsers', JSON.stringify(usersDB));
            localStorage.setItem('currentUser', email);
            alert(`Welcome, ${name}! Redirecting...`);
            window.location.href = 'index.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = loginForm.querySelectorAll('input');
            const email = inputs[0].value.trim();
            const password = inputs[1].value;
            const usersDB = JSON.parse(localStorage.getItem('meroUsers')) || {};
            if (!usersDB[email]) { alert('No account found with this email.'); return; }
            if (usersDB[email].password !== password) { alert('Incorrect password.'); return; }
            localStorage.setItem('currentUser', email);
            window.location.href = 'index.html';
        });
    }

    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.getAttribute('title');
            const fakeEmail = `${platform.toLowerCase()}_user@mero.com`;
            const usersDB = JSON.parse(localStorage.getItem('meroUsers')) || {};
            if (!usersDB[fakeEmail]) {
                usersDB[fakeEmail] = { name: `${platform} User`, password: 'social_password' };
                localStorage.setItem('meroUsers', JSON.stringify(usersDB));
            }
            localStorage.setItem('currentUser', fakeEmail);
            alert(`Authorized securely via ${platform}. Redirecting...`);
            window.location.href = 'index.html';
        });
    });

    const currentUser = localStorage.getItem('currentUser');
    const userIconLink = document.getElementById('user-icon-link');
    if (userIconLink) {
        if (currentUser) {
            userIconLink.href = 'profile.html';
            userIconLink.title = 'My Profile';
            userIconLink.classList.add('logged-in');
        } else {
            userIconLink.href = 'auth.html';
        }
    }

    const profilePage = document.querySelector('.profile-page');
    if (profilePage) {
        if (!currentUser) {
            window.location.href = 'auth.html';
        } else {
            const usersDB = JSON.parse(localStorage.getItem('meroUsers')) || {};
            const userData = usersDB[currentUser];
            document.getElementById('profile-email').textContent = currentUser;
            if (userData && userData.name) {
                document.getElementById('profile-name').textContent = userData.name;
            }
        }
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }
    }


    const cartBtn = document.querySelector('.icon-btn.cart');
    const sideCart = document.getElementById('side-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartCountTitle = document.getElementById('cart-count-title');
    const badge = document.querySelector('.badge');

    const toggleCart = (isOpen) => {
        if (!sideCart || !cartOverlay) return;
        sideCart.classList.toggle('active', isOpen);
        sideCart.classList.toggle('open', isOpen);
        cartOverlay.classList.toggle('active', isOpen);
        cartOverlay.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (cartBtn) cartBtn.addEventListener('click', (e) => { e.preventDefault(); toggleCart(true); });
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
    if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

    let cart = JSON.parse(localStorage.getItem('meroCart')) || [];

    const updateCartUI = () => {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg" style="text-align:center; padding:40px 0; color:#888;">Your bag is currently empty.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.qty;
                count += item.qty;
                cartItemsContainer.innerHTML += `
                    <div class="cart-item" style="display:flex; gap:15px; margin-bottom:25px; align-items:center;">
                        <img src="${item.img}" class="cart-item-img" style="width:80px; height:100px; object-fit:cover; border-radius:4px;">
                        <div class="cart-item-info" style="flex:1;">
                            <div class="cart-item-title" style="font-size:14px; margin:0 0 8px; font-weight:600;">${item.title}</div>
                            <div class="cart-item-size" style="font-size:11px; color:#888; margin-bottom:5px;">Size: <span style="color:#000; font-weight:600;">${item.size}</span></div>
                            <div class="cart-item-price" style="font-size:14px; margin:0;">${item.price.toLocaleString()} UAH</div>
                            <div class="cart-item-qty" style="display:flex; align-items:center; gap:10px; margin-top:10px;">
                                <button class="qty-btn" onclick="changeQty(${index}, -1)" style="background:none; border:1px solid #ddd; width:24px; height:24px; cursor:pointer;">-</button>
                                <span style="font-size:13px;">${item.qty}</span>
                                <button class="qty-btn" onclick="changeQty(${index}, 1)" style="background:none; border:1px solid #ddd; width:24px; height:24px; cursor:pointer;">+</button>
                            </div>
                        </div>
                        <button class="remove-item" onclick="removeItem(${index})" style="background:none; border:none; cursor:pointer; font-size:20px; color:#999;">✕</button>
                    </div>`;
            });
        }
        if (cartSubtotalEl) cartSubtotalEl.textContent = `${total.toLocaleString()} UAH`;
        if (cartCountTitle) cartCountTitle.textContent = count;
        if (badge) badge.textContent = count;
        localStorage.setItem('meroCart', JSON.stringify(cart));
    };

    window.changeQty = (index, delta) => {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) cart.splice(index, 1);
        updateCartUI();
    };

    window.removeItem = (index) => {
        cart.splice(index, 1);
        updateCartUI();
    };

    window.selectProductSize = (element, size) => {
        const card = element.closest('.st-card');
        if(!card) return;
        card.querySelectorAll('.st-sizes span').forEach(s => s.classList.remove('active'));
        element.classList.add('active');
        card.setAttribute('data-selected-size', size);
    };


    window.addToCart = (title, price, img, element) => {
        let size = null;


        if (element) {
            const card = element.closest('.st-card');
            if (card) {
                size = card.getAttribute('data-selected-size');
            }
        }


        if (!size && typeof title === 'string') {
            const sizeMatch = title.match(/\(([^)]+)\)$/);
            if (sizeMatch) {
                size = sizeMatch[1].replace('Size:', '').trim();
                title = title.replace(/\s*\([^)]+\)$/, '').trim();
            }
        }

        if (!size) {
            alert('Please select a size!');
            return;
        }

        const existing = cart.find(item => item.title === title && item.size === size);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ title, price, img, size: size, qty: 1 });
        }

        updateCartUI();
        toggleCart(true);
    };

    updateCartUI();


    const sizeBtns = document.querySelectorAll('.size-btn');
    let selectedProductSize = 'M';

    if (sizeBtns.length > 0) {
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sizeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedProductSize = btn.innerText;
                const sizeText = document.getElementById('selected-size-text');
                if (sizeText) sizeText.innerText = selectedProductSize;
            });
        });
    }

    const mainAddToCartBtn = document.getElementById('add-to-cart-main-btn');
    if (mainAddToCartBtn) {
        mainAddToCartBtn.addEventListener('click', () => {
            const titleEl = document.getElementById('dynamic-title');
            const priceEl = document.getElementById('dynamic-price');
            const imgEl = document.getElementById('dynamic-img');

            if (!titleEl || !priceEl || !imgEl) return;

            const title = titleEl.innerText;
            const priceText = priceEl.innerText;
            const img = imgEl.src;

            const price = parseInt(priceText.replace(/\D/g, ''), 10);

            const existing = cart.find(item => item.title === title && item.size === selectedProductSize);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ title, price, img, size: selectedProductSize, qty: 1 });
            }

            updateCartUI();

            const originalText = mainAddToCartBtn.innerHTML;
            mainAddToCartBtn.innerHTML = 'ADDED TO BAG ✓';
            mainAddToCartBtn.style.background = '#4CAF50';

            setTimeout(() => {
                mainAddToCartBtn.innerHTML = originalText;
                mainAddToCartBtn.style.background = '#111';
                toggleCart(true);
            }, 800);
        });
    }


    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('checkout-btn')) {
            const currentCart = JSON.parse(localStorage.getItem('meroCart')) || [];
            if (currentCart.length === 0) {
                alert('Your cart is empty! Add items to proceed.');
            } else {
                window.location.href = 'checkout.html';
            }
        }
    });

    const checkoutItemsContainerBlock = document.getElementById('checkout-items');
    if (checkoutItemsContainerBlock) {
        const checkoutCart = JSON.parse(localStorage.getItem('meroCart')) || [];
        const checkSubtotalEl = document.getElementById('check-subtotal');
        const checkTotalEl = document.getElementById('check-total');
        const btnPay = document.querySelector('.btn-pay');
        const scene = document.querySelector('.checkout-scene');
        let totalCheckout = 0;

        if (checkoutCart.length === 0) {
            checkoutItemsContainerBlock.innerHTML = '<p style="color:#888;">Your cart is empty.</p>';
        } else {
            checkoutItemsContainerBlock.innerHTML = '';
            checkoutCart.forEach(item => {
                totalCheckout += item.price * item.qty;
                checkoutItemsContainerBlock.innerHTML += `
                    <div class="checkout-item immersion-fly">
                        <img src="${item.img}" alt="${item.title}">
                        <div class="checkout-item-info">
                            <h4>${item.title}</h4>
                            <p>Size: ${item.size} | Qty: ${item.qty}</p>
                        </div>
                        <div class="checkout-item-price">${(item.price * item.qty).toLocaleString()} UAH</div>
                    </div>`;
            });
            if (checkSubtotalEl) checkSubtotalEl.textContent = `${totalCheckout.toLocaleString()} UAH`;
            if (checkTotalEl) checkTotalEl.textContent = `${totalCheckout.toLocaleString()} UAH`;
        }

        if (btnPay) {
            const forms = document.querySelectorAll('form');
            btnPay.addEventListener('click', (e) => {
                let allValid = true;
                forms.forEach(form => { if(!form.checkValidity()){ allValid = false; form.reportValidity(); } });

                if(allValid) {
                    e.preventDefault();
                    btnPay.dataset.status = 'processing';
                    if(btnPay.querySelector('span')) {
                        btnPay.querySelector('span').innerHTML = 'PROCESSING...⏳';
                    } else {
                        btnPay.innerHTML = 'PROCESSING...⏳';
                    }

                    setTimeout(() => {
                        btnPay.dataset.status = 'success';
                        btnPay.style.background = '#4CAF50';
                        if(btnPay.querySelector('span')) {
                            btnPay.querySelector('span').innerHTML = 'SUCCESS! ✔️';
                        } else {
                            btnPay.innerHTML = 'SUCCESS! ✔️';
                        }


                        const BOT_TOKEN = '8693062137:AAGbqRLZhMU3gwGvQQehQncMbxGQcVRDwOA';
                        const CHAT_ID = '1981335319';

                        let message = `🛒 <b>НОВЕ ЗАМОВЛЕННЯ | MERO</b>\n\n`;

                        let customerInfo = '';
                        forms.forEach(form => {
                            form.querySelectorAll('input, select, textarea').forEach(input => {
                                let labelName = input.getAttribute('placeholder') || input.name || input.id;

                                if (!labelName && input.previousElementSibling && input.previousElementSibling.tagName === 'LABEL') {
                                    labelName = input.previousElementSibling.innerText.replace(':', '').trim();
                                }
                                if (!labelName && input.nextElementSibling && input.nextElementSibling.tagName === 'LABEL') {
                                    labelName = input.nextElementSibling.innerText.replace(':', '').trim();
                                }
                                if (!labelName) {
                                    labelName = 'Дані';
                                }

                                if (input.value && input.value.trim() !== '') {
                                    customerInfo += `🔹 <b>${labelName}:</b> ${input.value}\n`;
                                }
                            });
                        });

                        message += customerInfo ? `👤 <b>Дані клієнта:</b>\n${customerInfo}\n` : `👤 <b>Дані клієнта:</b> Не вказано\n\n`;

                        message += `📦 <b>Товари:</b>\n`;
                        checkoutCart.forEach((item, index) => {
                            message += `${index + 1}. ${item.title} (Розмір: ${item.size})\n   ${item.qty} шт. x ${item.price} UAH\n`;
                        });
                        message += `\n💰 <b>ЗАГАЛОМ: ${totalCheckout.toLocaleString()} UAH</b>`;

                        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: CHAT_ID,
                                text: message,
                                parse_mode: 'HTML'
                            })
                        }).then(() => {
                            setTimeout(() => {
                                alert('Payment successful! Your order has been placed.');
                                localStorage.removeItem('meroCart');
                                window.location.href = 'index.html';
                            }, 1200);
                        }).catch(err => {
                            console.error('Помилка відправки в Telegram:', err);
                            setTimeout(() => {
                                alert('Payment successful! Your order has been placed.');
                                localStorage.removeItem('meroCart');
                                window.location.href = 'index.html';
                            }, 1200);
                        });
                    }, 2500);
                }
            });
        }
    }


    const accordions = document.querySelectorAll('.accordion-btn');
    accordions.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('.icon');
            if (icon) {
                icon.textContent = this.classList.contains('active') ? '−' : '+';
            }
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.opacity = 0;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.opacity = 1;
            }
        });
    });


    const labItems = document.querySelectorAll('.lab-item');
    const generateBtn = document.getElementById('generate-look-btn');
    const scanner = document.getElementById('scanner');
    const aiLoader = document.getElementById('ai-loader');
    const selectedCount = document.getElementById('selected-count');
    const mainMannequinImg = document.getElementById('main-mannequin');

    const lookDatabase = {
        "White Tee, Black Pants": "https://i.pinimg.com/736x/13/a0/42/13a042606c759b07de1cf475c7d75bc6.jpg",
        "Blazer, Black Pants": "https://i.pinimg.com/736x/16/85/a1/1685a1692790bb03bbdd365f3439a164.jpg",
        "Heavy Knitwear, Black Pants": "https://images.unsplash.com/photo-1601053075271-92e9f1a23868?q=80&w=1000",
        "default": "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000"
    };

    if (generateBtn) {
        labItems.forEach(item => {
            item.addEventListener('click', () => {
                const siblings = item.closest('.item-grid').querySelectorAll('.lab-item');
                siblings.forEach(sib => {
                    if (sib !== item) sib.classList.remove('active');
                });

                item.classList.toggle('active');
                const activeCount = document.querySelectorAll('.lab-item.active').length;
                if (selectedCount) selectedCount.textContent = activeCount;
            });
        });

        generateBtn.addEventListener('click', () => {
            const activeItems = document.querySelectorAll('.lab-item.active img');

            if (activeItems.length < 2) {
                alert('Будь ласка, обери ВЕРХ і НИЗ, щоб згенерувати повний образ!');
                return;
            }

            let selectedClothes = [];
            activeItems.forEach(img => selectedClothes.push(img.alt));
            let comboKey = selectedClothes.join(', ');

            if (scanner) scanner.style.display = 'block';
            if (aiLoader) aiLoader.style.display = 'flex';
            generateBtn.disabled = true;
            generateBtn.innerHTML = 'GENERATING... ⏳';

            let finalImageUrl = lookDatabase[comboKey] || lookDatabase["default"];

            setTimeout(() => {
                mainMannequinImg.src = finalImageUrl;

                if (scanner) scanner.style.display = 'none';
                if (aiLoader) aiLoader.style.display = 'none';
                generateBtn.disabled = false;
                generateBtn.innerHTML = `GENERATE LOOK <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
            }, 2500);
        });
    }


    const filterToggleBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('FILTER'));
    const filtersContainer = document.querySelector('.catalog-filters');

    if (filterToggleBtn && filtersContainer) {
        filterToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (filtersContainer.style.display !== 'flex') {
                filtersContainer.style.display = 'flex';
                setTimeout(() => filtersContainer.classList.add('show'), 10);
                filterToggleBtn.innerHTML = 'FILTER &minus;';
            } else {
                filtersContainer.classList.remove('show');
                filterToggleBtn.innerHTML = 'FILTER +';
                setTimeout(() => filtersContainer.style.display = 'none', 300);
            }
        });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.st-card');

    if (filterBtns.length > 0 && productCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
});



const GEMINI_API_KEY = "AIzaSyDP33lgCGEsFJOkntA81xJNQ6Xs5r0EffQ";

function appendMessage(sender, text) {
    const chatMessages = document.getElementById('ai-messages');
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessageToAI() {
    const input = document.getElementById('ai-input');
    if (!input) return;
    const userText = input.value.trim();
    if (!userText) return;


    appendMessage('user', userText);
    input.value = '';


    const chatMessages = document.getElementById('ai-messages');
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot-message');
    typingDiv.id = 'typing-indicator';
    typingDiv.innerText = 'Стиліст думає...';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;


    let contextStr = "Каталог порожній.";
    if (typeof productsDatabase !== 'undefined') {
        const productArray = Object.keys(productsDatabase).map(key => {
            const p = productsDatabase[key];
            // ТЕПЕР ШІ БАЧИТЬ МАТЕРІАЛ І ОПИС:
            return `ID: ${key}, Назва: ${p.title}, Матеріал: ${p.material}, Ціна: ${p.price}`;
        });
        contextStr = productArray.join(" | ");
    }
    const systemPrompt = `
        Ти - стиліст магазину одягу MERO. Використовуй тільки ці товари: ${contextStr}.
        Твоя задача - порадити одяг.
        Відповідай СУВОРО у форматі JSON (без маркдаун тегів, просто сирий JSON): 
        {"answer": "Текст поради людською мовою", "ids": ["id_товару1", "id_товару2"]}
        Якщо товарів не знайдено або питання не про одяг, ids залиш порожнім [].
    `;

    try {
       const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + "\nКористувач: " + userText }] }]
            })
        });


        if (document.getElementById('typing-indicator')) {
            document.getElementById('typing-indicator').remove();
        }

        const data = await response.json();


        if (data.error) {
            console.error("API Error:", data.error);
            appendMessage('bot', "Вибачте, технічна помилка з'єднання з AI.");
            return;
        }

        const aiResponseText = data.candidates[0].content.parts[0].text;


        const cleanText = aiResponseText.replace(/```json|```/g, "").trim();
        const cleanJson = JSON.parse(cleanText);


        appendMessage('bot', cleanJson.answer);


        if (cleanJson.ids && cleanJson.ids.length > 0) {
            console.log("ШІ рекомендує ID:", cleanJson.ids);

            cleanJson.ids.forEach(id => {
                showProductInChat(id);
            });
        }

    } catch (error) {
        if (document.getElementById('typing-indicator')) {
            document.getElementById('typing-indicator').remove();
        }
        console.error("Критична помилка ШІ:", error);
        appendMessage('bot', "Вибач, я не зміг обробити запит. Спробуй ще раз.");
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const aiToggleBtn = document.getElementById('ai-toggle-btn');
    const aiChatWindow = document.getElementById('ai-chat-window');
    const aiCloseBtn = document.getElementById('ai-close-btn');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiInput = document.getElementById('ai-input');

    if (aiToggleBtn && aiChatWindow && aiCloseBtn) {
        aiToggleBtn.addEventListener('click', () => aiChatWindow.classList.toggle('ai-hidden'));
        aiCloseBtn.addEventListener('click', () => aiChatWindow.classList.add('ai-hidden'));
    }

    if (aiSendBtn && aiInput) {
        aiSendBtn.addEventListener('click', sendMessageToAI);
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessageToAI();
        });
    }
});

function showProductInChat(productId) {
    const product = productsDatabase[productId];
    if (!product) return;

    const chatMessages = document.getElementById('ai-messages');
    const cardDiv = document.createElement('div');


    cardDiv.style.cssText = "background: #fff; border: 1px solid #ddd; border-radius: 12px; padding: 10px; margin-top: 5px; max-width: 80%; align-self: flex-start;";

    cardDiv.innerHTML = `
        <img src="${product.image}" alt="${product.title}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;">
        <div style="font-weight: bold; font-size: 14px; color: #000;">${product.title}</div>
        <div style="color: #666; font-size: 13px; margin-bottom: 10px;">${product.price}</div>
        <a href="product.html?id=${productId}" style="display: block; text-align: center; background: #000; color: #fff; padding: 8px; border-radius: 20px; text-decoration: none; font-size: 12px; font-weight: bold;">ПЕРЕГЛЯНУТИ</a>
    `;

    chatMessages.appendChild(cardDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
