// Router
let currentPage = 'home';

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1) || 'home';
    navigateTo(hash);
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            navigateTo(page);
        });
    });
    document.querySelector('.nav-toggle').addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('open');
    });
    window.addEventListener('popstate', () => {
        const page = window.location.hash.substring(1) || 'home';
        navigateTo(page, false);
    });
});

function navigateTo(page, pushState = true) {
    currentPage = page;
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add('active');
    document.querySelector('.nav-links').classList.remove('open');
    if (pushState) history.pushState(null, '', `#${page}`);
    renderPage(page);
}

function renderPage(page) {
    const content = document.getElementById('page-content');
    switch (page) {
        case 'home':
            renderHome();
            break;
        case 'shop':
            renderShop();
            break;
        case 'about':
            renderAbout();
            break;
        case 'contact':
            renderContact();
            break;
        case 'faq':
            renderFAQ();
            break;
        default:
            renderHome();
    }
}

// Data Layer
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/SHEET_ID/gviz/tq?tqx=out:json'; // Placeholder
let items = [];

const MOCK_ITEMS = [
    { id: 1, name: '1960s Floral Swing Dress', price: 38, category: 'Clothing & Accessories', description: 'A beautifully preserved 1960s A-line dress with a bold floral print. Perfect for vintage enthusiasts looking to add a touch of retro charm to their wardrobe.', images: ['https://via.placeholder.com/400x300'], featured: true },
    { id: 2, name: 'Solid Oak Dining Table', price: 145, category: 'Furniture', description: 'Handcrafted solid oak dining table with elegant tapered legs and a rich finish. Seats up to six comfortably and adds timeless style to any dining room.', images: ['https://via.placeholder.com/400x300'], featured: true },
    { id: 3, name: 'Complete Encyclopedia Britannica Set', price: 22, category: 'Books & Media', description: 'A comprehensive 20-volume encyclopedia set from the 1970s, complete with original dust jackets. An excellent resource for history buffs and collectors.', images: ['https://via.placeholder.com/400x300'], featured: false },
    { id: 4, name: 'Cast Iron Skillet Collection', price: 45, category: 'Kitchen & Home Goods', description: 'Set of three vintage cast iron skillets in various sizes, seasoned and ready to use. Ideal for cooking enthusiasts who appreciate traditional kitchen tools.', images: ['https://via.placeholder.com/400x300'], featured: true },
    { id: 5, name: 'Vintage Leather Hiking Boots', price: 55, category: 'Sports & Outdoors', description: 'Well-worn but sturdy leather hiking boots from the 1980s, perfect for outdoor adventures. Comfortable and durable with excellent traction.', images: ['https://via.placeholder.com/400x300'], featured: true },
    { id: 6, name: 'Mid-Century Walnut Sideboard', price: 210, category: 'Furniture', description: 'Elegant mid-century modern sideboard crafted from walnut with brass handles. Features ample storage and a sleek design that complements contemporary decor.', images: ['https://via.placeholder.com/400x300'], featured: false },
    { id: 7, name: 'Silk Paisley Scarf', price: 18, category: 'Clothing & Accessories', description: 'Luxurious silk scarf with intricate paisley patterns in rich autumn colors. A versatile accessory that can elevate any outfit.', images: ['https://via.placeholder.com/400x300'], featured: false },
    { id: 8, name: 'Vintage Croquet Set', price: 35, category: 'Sports & Outdoors', description: 'Complete wooden croquet set with mallets, balls, and wickets, stored in its original canvas bag. Great for garden parties and family fun.', images: ['https://via.placeholder.com/400x300'], featured: false }
];

async function fetchItems() {
    if (items.length > 0) return items;
    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        const jsonText = text.replace(/\/\*O_o\*\/google\.visualization\.Query\.setResponse\((.*)\);/, '$1');
        const data = JSON.parse(jsonText);
        const rows = data.table.rows;
        items = rows.map(row => ({
            id: row.c[0]?.v,
            name: row.c[1]?.v,
            price: row.c[2]?.v,
            category: row.c[3]?.v,
            description: row.c[4]?.v,
            images: (row.c[5]?.v || '').split(',').map(u => u.trim()),
            featured: row.c[6]?.v === true
        }));
    } catch (error) {
        items = MOCK_ITEMS;
    }
    return items;
}

function getFeaturedItems() {
    return items.filter(item => item.featured);
}

const REVIEWS = [
    { name: 'Sarah Johnson', role: 'Local Guide', time: '2 weeks ago', text: 'Absolutely love this place! Found some amazing vintage pieces for my home. The staff was incredibly helpful and knowledgeable. Highly recommend!', stars: 5 },
    { name: 'Mike Chen', role: '', time: 'a month ago', text: 'Great selection of antiques and unique items. Prices are fair and the quality is excellent. Will definitely be back for more treasures.', stars: 5 },
    { name: 'Emily Davis', role: 'Local Guide', time: '3 weeks ago', text: 'Such a charming antique store! I found the perfect vintage dresser for my bedroom. The owner was so passionate about each piece\'s history.', stars: 5 },
    { name: 'David Wilson', role: '', time: '1 month ago', text: 'Incredible collection of vintage furniture and decor. Everything is well-priced and in great condition. Love supporting local businesses like this.', stars: 5 },
    { name: 'Lisa Thompson', role: 'Local Guide', time: '2 weeks ago', text: 'Hidden gem in Louisville! Found some beautiful mid-century pieces and the staff helped me coordinate delivery. Fantastic experience.', stars: 5 },
    { name: 'Robert Martinez', role: '', time: '3 weeks ago', text: 'Amazing antique store with genuine pieces. The prices are reasonable and the quality is outstanding. Highly recommend for vintage lovers.', stars: 5 },
    { name: 'Jennifer Brown', role: 'Local Guide', time: '1 month ago', text: 'Love this place! Such a great selection of unique items. Found some perfect gifts and home decor pieces. The atmosphere is wonderful too.', stars: 5 },
    { name: 'Kevin Lee', role: '', time: '2 weeks ago', text: 'Excellent antique shop with knowledgeable staff. Found exactly what I was looking for - a beautiful vintage sideboard. Very satisfied!', stars: 5 },
    { name: 'Amanda White', role: 'Local Guide', time: '3 weeks ago', text: 'Such a treasure trove of vintage finds! The store is well-organized and the pieces are in excellent condition. Great prices too.', stars: 5 },
    { name: 'Thomas Garcia', role: '', time: '1 month ago', text: 'Wonderful antique store with a great variety of items. The staff is friendly and helpful. Found some amazing pieces for my collection.', stars: 5 },
    { name: 'Rachel Miller', role: 'Local Guide', time: '2 weeks ago', text: 'Love discovering unique pieces here! The selection is always changing and the quality is consistently high. Highly recommend.', stars: 5 },
    { name: 'James Rodriguez', role: '', time: '3 weeks ago', text: 'Great local antique shop. Found some beautiful vintage lamps and decor. Prices are fair and the staff is very accommodating.', stars: 5 },
    { name: 'Michelle Taylor', role: 'Local Guide', time: '1 month ago', text: 'Such a charming store with wonderful vintage finds! I always discover something special here. The owner\'s passion for antiques shines through.', stars: 5 },
    { name: 'Christopher Anderson', role: '', time: '2 weeks ago', text: 'Excellent selection of quality antiques. The store is clean, well-organized, and the staff is knowledgeable. Great experience overall.', stars: 5 },
    { name: 'Stephanie Moore', role: 'Local Guide', time: '3 weeks ago', text: 'Love this antique store! Always find unique pieces that tell a story. The prices are reasonable and the quality is excellent.', stars: 5 },
    { name: 'Daniel Jackson', role: '', time: '1 month ago', text: 'Fantastic antique shop with a great variety. Found some beautiful vintage furniture pieces. Highly recommend for anyone seeking quality antiques.', stars: 5 },
    { name: 'Nicole Harris', role: 'Local Guide', time: '2 weeks ago', text: 'Such a hidden gem! The selection is amazing and the staff is incredibly helpful. Found the perfect vintage chair for my living room.', stars: 5 },
    { name: 'Matthew Clark', role: '', time: '3 weeks ago', text: 'Great antique store with genuine pieces at fair prices. The atmosphere is welcoming and the staff is knowledgeable. Will return often.', stars: 5 },
    { name: 'Ashley Lewis', role: 'Local Guide', time: '1 month ago', text: 'Love the unique collection here! Always find something special. The store has a great vibe and the prices are very reasonable.', stars: 5 },
    { name: 'Joshua Walker', role: '', time: '2 weeks ago', text: 'Excellent antique shop with high-quality items. Found some amazing vintage decor pieces. The staff was very helpful with my selections.', stars: 5 }
];

// Page Renderers
function renderReviewCard(review) {
    const stars = '★'.repeat(review.stars);
    const truncatedText = review.text.length > 160 ? review.text.substring(0, 160) + '…' : review.text;
    return `
        <div class="review-card">
            <div class="review-stars">${stars}</div>
            <div class="review-name">${review.name}</div>
            <div class="review-meta">${review.role}${review.role && review.time ? ' • ' : ''}${review.time}</div>
            <div class="review-text">${truncatedText}</div>
        </div>
    `;
}

async function renderHome() {
    document.getElementById('page-content').innerHTML = '<div class="page-container"><p>Loading...</p></div>';
    const items = await fetchItems();
    const featured = getFeaturedItems();
    const content = `
        <div class="page-container">
            <!-- Hero Section -->
            <section class="hero">
                <h1>Timeless Finds, Modern Living</h1>
                <p>Discover unique antiques and vintage treasures at Dreamlight Antiques.</p>
                <button onclick="navigateTo('shop')">Browse Our Collection</button>
            </section>
            
            <!-- Featured Items Section -->
            <section class="featured">
                <h2>Featured Items</h2>
                <p class="section-subtitle">Handpicked pieces from our collection</p>
                <div class="home-featured">
                    ${featured.map(item => renderItemCard(item)).join('')}
                </div>
            </section>
            
            <!-- Customer Reviews Section -->
            <section class="reviews-section">
                <h2>What Our Customers Say</h2>
                <p class="section-subtitle">Real reviews from Google Maps</p>
                <div class="reviews-track-wrapper">
                    <div class="reviews-track" id="reviews-track">
                        <!-- cards rendered twice for seamless loop -->
                        ${REVIEWS.map(renderReviewCard).join('')}
                        ${REVIEWS.map(renderReviewCard).join('')}
                    </div>
                </div>
            </section>
        </div>
    `;
    document.getElementById('page-content').innerHTML = content;
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const itemId = parseInt(card.getAttribute('data-item-id'));
            const item = items.find(i => i.id === itemId);
            openModal(item);
        });
    });
}

async function renderShop() {
    const items = await fetchItems();
    const categories = ['All', 'Clothing & Accessories', 'Furniture', 'Books & Media', 'Kitchen & Home Goods', 'Sports & Outdoors'];
    const content = `
        <div class="shop-layout">
            <aside class="shop-sidebar">
                <h3>Categories</h3>
                ${categories.map(cat => `
                    <label class="filter-item">
                        <input type="checkbox" data-category="${cat}" ${cat === 'All' ? 'checked' : ''}>
                        ${cat}
                        </label>
                    `).join('')}
            </aside>
            <div class="shop-content">
                <h2 id="shop-heading">All Items <span id="shop-count">(${items.length} items)</span></h2>
                <div class="shop-grid" id="shop-grid">
                    ${items.map(item => renderItemCard(item)).join('')}
                </div>
            </div>
        </div>
    `;
    document.getElementById('page-content').innerHTML = content;
    document.querySelectorAll('.shop-sidebar input').forEach(input => {
        input.addEventListener('change', (e) => {
            const category = e.target.getAttribute('data-category');
            if (category === 'All' && e.target.checked) {
                // Uncheck all specific categories
                document.querySelectorAll('.shop-sidebar input[data-category]:not([data-category="All"])').forEach(inp => inp.checked = false);
            } else if (category !== 'All' && e.target.checked) {
                // Uncheck "All"
                document.querySelector('.shop-sidebar input[data-category="All"]').checked = false;
            }
            filterItems();
        });
    });
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const itemId = parseInt(card.getAttribute('data-item-id'));
            const item = items.find(i => i.id === itemId);
            openModal(item);
        });
    });
}

function filterItems() {
    const checked = Array.from(document.querySelectorAll('.shop-sidebar input:checked')).map(input => input.getAttribute('data-category'));
    const allChecked = checked.includes('All');
    const specificChecked = checked.filter(c => c !== 'All');
    let filtered;
    if (allChecked || specificChecked.length === 0) {
        filtered = items;
    } else {
        filtered = items.filter(item => specificChecked.includes(item.category));
    }
    const label = (allChecked || specificChecked.length === 0)
        ? 'All Items'
        : specificChecked.length === 1
            ? specificChecked[0]
            : 'Multiple Categories';
    const heading = document.getElementById('shop-heading');
    if (heading) {
        heading.innerHTML = `${label} <span id="shop-count">(${filtered.length} items)</span>`;
    }
    document.getElementById('shop-grid').innerHTML = filtered.map(item => renderItemCard(item)).join('');
    document.querySelectorAll('#shop-grid .card').forEach(card => {
        card.addEventListener('click', () => {
            const itemId = parseInt(card.getAttribute('data-item-id'));
            const item = items.find(i => i.id === itemId);
            openModal(item);
        });
    });
}

function renderAbout() {
    const content = `
        <div class="page-container about-page">
            <div class="about-hero">
                <h1>About Dreamlight Antiques</h1>
                <p class="about-tagline">Preserving stories, one piece at a time.</p>
            </div>
            <div class="about-body">
                <div class="about-text">
                    <h2>Our Story</h2>
                    <p>Dreamlight Antiques was founded in 2015 with a passion for preserving the stories behind vintage and unique items. Located at 1201 S 3rd St in Louisville, KY, our store offers a curated selection of antiques, vintage clothing, furniture, and collectibles sourced from local estates and donations.</p>
                    <h2>Our Mission</h2>
                    <p>We connect people with timeless pieces that tell a story, while supporting our community through sustainable reuse and charitable donations.</p>
                </div>
                <div class="about-photo-placeholder">
                    <span>Store Photo</span>
                </div>
            </div>
        </div>
    `;
    document.getElementById('page-content').innerHTML = content;
}

function renderContact() {
    const content = `
        <div class="contact-page">
            <div class="contact-hero">
                <h1>Visit Us</h1>
                <p>Come find your next treasure in Louisville, KY</p>
            </div>
            <div class="contact-body">
                <div class="contact-info-card">
                    <div class="contact-info-icon">📍</div>
                    <h3>Our Location</h3>
                    <p>1201 S 3rd St<br>Louisville, KY 40203<br>United States</p>
                    <div class="contact-hours">
                        <strong>Store Hours</strong><br>
                        Monday – Saturday: 10am – 6pm<br>
                        Sunday: Closed
                    </div>
                    <a href="https://wa.me/15023141117" class="wa-btn contact-wa-btn">📱 Chat on WhatsApp</a>
                </div>
                <div class="contact-map">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3132.123!2d-85.759!3d38.254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88690a1234567890%3A0x1234567890abcdef!2s1201%20S%203rd%20St%2C%20Louisville%2C%20KY!5e0!3m2!1sen!2sus!4v1234567890" width="100%" height="420" style="border:0;border-radius:14px;" allowfullscreen="" loading="lazy"></iframe>
                </div>
            </div>
        </div>
    `;
    document.getElementById('page-content').innerHTML = content;
}

function renderFAQ() {
    const faqs = [
        { q: 'How do I check item availability?', a: 'Contact us via WhatsApp or visit the store. We update our inventory regularly.' },
        { q: 'What is the pickup process?', a: 'Items can be picked up in-store during business hours. For delivery, we offer local shipping options.' },
        { q: 'Do you accept donations?', a: 'Yes! We accept quality donations. Please contact us to arrange drop-off.' },
        { q: 'What are your store hours?', a: 'We are open Monday through Saturday, 10am to 6pm.' }
    ];
    const content = `
        <div class="page-container faq-page">
            <h1>FAQ</h1>
            ${faqs.map(faq => `
                <div class="faq-item">
                    <button class="faq-question">${faq.q} <span>▼</span></button>
                    <div class="faq-answer hidden">${faq.a}</div>
                </div>
            `).join('')}
        </div>
    `;
    document.getElementById('page-content').innerHTML = content;
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const isOpen = !answer.classList.contains('hidden');
            answer.classList.toggle('hidden');
            button.classList.toggle('open');
            button.querySelector('span').textContent = isOpen ? '▼' : '▲';
        });
    });
}

// Item Card Helper
function renderItemCard(item) {
    return `
        <div class="card" data-item-id="${item.id}">
            <div class="card-img">
                ${item.images[0] ? `<img src="${item.images[0]}" alt="${item.name}">` : '<div>Image</div>'}
            </div>
            <div class="card-body">
                <div class="card-category">${item.category}</div>
                <div class="card-name">${item.name}</div>
                <div class="card-price">$${item.price}</div>
            </div>
        </div>
    `;
}

function renderRelatedCard(item) {
    return `
        <div class="card rel-card" data-item-id="${item.id}">
            <div class="card-img">
                ${item.images[0] ? `<img src="${item.images[0]}" alt="${item.name}">` : '<div>Image</div>'}
            </div>
            <div class="card-body">
                <div class="card-category">${item.category}</div>
                <div class="card-name">${item.name}</div>
                <div class="card-price">$${item.price}</div>
            </div>
        </div>
    `;
}

// Modal
let scrollPosition = 0;

function openModal(item) {
    scrollPosition = window.pageYOffset;
    document.body.style.overflow = 'hidden';
    const related = items.filter(i => i.category === item.category && i.id !== item.id).slice(0, 3);
    const modalHtml = `
        <div class="modal-panel">
            <header>
                <div>Shop / ${item.category}</div>
                <button onclick="closeModal()">✕</button>
            </header>
            <div class="gallery">
                <img id="modal-main-img" src="${item.images[0] || ''}" alt="${item.name}">
            </div>
            ${item.images.length > 1 ? `<div class="thumbs">
                    ${item.images.map((img, idx) => `<div class="thumb ${idx === 0 ? 'active' : ''}" data-src="${img}"><img src="${img}" alt=""></div>`).join('')}
                </div>` : ''}
            <div class="item-info">
                <div class="card-category">${item.category}</div>
                <h2>${item.name}</h2>
                <div class="card-price">$${item.price}</div>
                <p>${item.description}</p>
            </div>
            <div id="inquiry-section">
                <h3>Inquire About This Item</h3>
                <div class="form-group">
                    <label for="inq-name">Your Name</label>
                    <input type="text" id="inq-name" class="form-input" placeholder="Your Name">
                </div>
                <div class="form-group">
                    <label for="inq-contact">Preferred Contact Method</label>
                    <select id="inq-contact" class="form-input">
                        <option value="">Preferred Contact Method</option>
                        <option value="Email">Email</option>
                        <option value="Phone">Phone</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="inq-pickup">Pickup Preference</label>
                    <select id="inq-pickup" class="form-input">
                        <option value="">Pickup Preference</option>
                        <option value="In-store pickup">In-store pickup</option>
                        <option value="Delivery needed">Delivery needed</option>
                    </select>
                </div>
                <button id="inq-submit" class="wa-btn">Send Inquiry via WhatsApp</button>
            </div>
            <div class="related">
                <h3>Related Items</h3>
                <div class="related-grid">
                    ${related.map(rel => renderRelatedCard(rel)).join('')}
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-overlay').innerHTML = modalHtml;
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') {
            closeModal();
        }
    });
    document.querySelectorAll('.thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            document.getElementById('modal-main-img').src = thumb.getAttribute('data-src');
        });
    });
    document.getElementById('inq-submit').addEventListener('click', () => handleInquirySubmit(item));
    document.querySelectorAll('.rel-card').forEach(card => {
        card.addEventListener('click', () => {
            const itemId = parseInt(card.getAttribute('data-item-id'));
            const relItem = items.find(i => i.id === itemId);
            openModal(relItem);
        });
    });
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.body.style.overflow = '';
    window.scrollTo(0, scrollPosition);
    document.getElementById('modal-overlay').innerHTML = '';
}

function handleInquirySubmit(item) {
    const name = document.getElementById('inq-name').value.trim();
    const contact = document.getElementById('inq-contact').value;
    const pickup = document.getElementById('inq-pickup').value;
    let valid = true;
    [document.getElementById('inq-name'), document.getElementById('inq-contact'), document.getElementById('inq-pickup')].forEach(el => {
        el.classList.remove('error');
        const errorMsg = el.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-msg')) errorMsg.remove();
    });
    if (!name) {
        document.getElementById('inq-name').classList.add('error');
        document.getElementById('inq-name').insertAdjacentHTML('afterend', '<span class="error-msg">Name is required.</span>');
        valid = false;
    }
    if (!contact) {
        document.getElementById('inq-contact').classList.add('error');
        document.getElementById('inq-contact').insertAdjacentHTML('afterend', '<span class="error-msg">Contact method is required.</span>');
        valid = false;
    }
    if (!pickup) {
        document.getElementById('inq-pickup').classList.add('error');
        document.getElementById('inq-pickup').insertAdjacentHTML('afterend', '<span class="error-msg">Pickup preference is required.</span>');
        valid = false;
    }
    if (valid) {
        showConfirmation(item, { name, contact, pickup });
    }
}

function showConfirmation(item, formData) {
    const section = document.getElementById('inquiry-section');
    section.innerHTML = `
        <div style="text-align: center;">
            <div>✅</div>
            <h3>Your inquiry is ready!</h3>
            <p>Review your details and send via WhatsApp.</p>
            <div class="confirmation-box">
                <div class="summary-row"><span>Item</span><span>${escapeHtml(item.name)} ($${item.price})</span></div>
                <div class="summary-row"><span>Your Name</span><span>${escapeHtml(formData.name)}</span></div>
                <div class="summary-row"><span>Contact Preference</span><span>${escapeHtml(formData.contact)}</span></div>
                <div class="summary-row"><span>Pickup Preference</span><span>${escapeHtml(formData.pickup)}</span></div>
            </div>
            <button class="wa-btn">📱 Open WhatsApp</button>
            <p class="note">Clicking will open WhatsApp with your message pre-filled.</p>
            <a href="#" id="edit-link" class="back-link">← Go back and edit my details</a>
        </div>
    `;
    const waBtn = section.querySelector('.wa-btn');
    waBtn.addEventListener('click', () => {
        sendWhatsApp(item, formData);
    });
    const editLink = section.querySelector('#edit-link');
    editLink.addEventListener('click', (e) => {
        e.preventDefault();
        editInquiry(item, formData);
    });
}

function buildWhatsAppMessage(item, formData) {
    return `Hi! I'm interested in ${item.name} ($${item.price}). My name is ${formData.name}. Preferred contact: ${formData.contact}. Pickup preference: ${formData.pickup}.`;
}

function sendWhatsApp(item, formData) {
    const message = buildWhatsAppMessage(item, formData);
    const url = `https://wa.me/15023141117?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function editInquiry(item, formData) {
    const section = document.getElementById('inquiry-section');
    section.innerHTML = `
        <h3>Inquire About This Item</h3>
        <div class="form-group">
            <label for="inq-name">Your Name</label>
            <input type="text" id="inq-name" class="form-input" placeholder="Your Name" value="${escapeHtml(formData.name)}">
        </div>
        <div class="form-group">
            <label for="inq-contact">Preferred Contact Method</label>
            <select id="inq-contact" class="form-input">
                <option value="">Preferred Contact Method</option>
                <option value="Email" ${formData.contact === 'Email' ? 'selected' : ''}>Email</option>
                <option value="Phone" ${formData.contact === 'Phone' ? 'selected' : ''}>Phone</option>
            </select>
        </div>
        <div class="form-group">
            <label for="inq-pickup">Pickup Preference</label>
            <select id="inq-pickup" class="form-input">
                <option value="">Pickup Preference</option>
                <option value="In-store pickup" ${formData.pickup === 'In-store pickup' ? 'selected' : ''}>In-store pickup</option>
                <option value="Delivery needed" ${formData.pickup === 'Delivery needed' ? 'selected' : ''}>Delivery needed</option>
            </select>
        </div>
        <button id="inq-submit" class="wa-btn">Send Inquiry via WhatsApp</button>
    `;
    document.getElementById('inq-submit').addEventListener('click', () => {
        handleInquirySubmit(item);
    });
}