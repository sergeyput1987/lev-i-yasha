// ============================================
// MAIN — общая логика и рендер главной
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  loadHits();
  initAgeTabs();
  initFavorites();
});

// ---------- Хиты проката ----------
async function loadHits() {
  const grid = document.getElementById('hits-grid');
  if (!grid) return;

  try {
    const res = await fetch('data/products.json');
    const data = await res.json();
    renderProducts(grid, data.products);
  } catch (err) {
    console.error('Ошибка загрузки товаров:', err);
  }
}

function renderProducts(container, products) {
  container.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-card__image">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        <button class="product-card__favorite" aria-label="В избранное" data-id="${product.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/>
          </svg>
        </button>
        <div class="product-card__badges">
          ${product.badges.includes('hit') ? '<span class="badge badge--hit">ХИТ</span>' : ''}
          ${product.badges.includes('new') ? '<span class="badge badge--new">НОВИНКИ</span>' : ''}
        </div>
      </div>
      <div class="product-card__body">
        <div class="product-card__price">от ${formatPrice(product.price)} ₽</div>
        <h3 class="product-card__title">${product.title}</h3>
      </div>
    </article>
  `).join('');
}

function formatPrice(price) {
  return price.toLocaleString('ru-RU');
}

// ---------- Табы возраста ----------
function initAgeTabs() {
  const tabs = document.querySelectorAll('.age-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      // Пока фильтрация не подключена — просто визуальное переключение.
      // Подключим, когда будет больше товаров.
    });
  });
}

// ---------- Избранное ----------
function initFavorites() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.product-card__favorite');
    if (!btn) return;
    e.preventDefault();
    btn.classList.toggle('is-active');

    const id = btn.dataset.id;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.includes(id)) {
      favorites.splice(favorites.indexOf(id), 1);
    } else {
      favorites.push(id);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesBadge();
  });

  updateFavoritesBadge();
}

function updateFavoritesBadge() {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  // Обновим бейдж в шапке, если есть отдельная иконка избранного
  // (сейчас на шапке бейдж корзины, добавим позже).
}