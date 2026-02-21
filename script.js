// Custom cursor (Ctrl+B to toggle)
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
});
function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  requestAnimationFrame(animateRing);
}
animateRing();

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'b') {
    e.preventDefault();
    document.body.classList.toggle('custom-cursor-enabled');
  }
});

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width = '60px'; ring.style.height = '60px'; ring.style.borderColor = 'rgba(201,169,110,0.8)'; });
  el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; ring.style.borderColor = 'rgba(201,169,110,0.5)'; });
});

// Intersection observer for reveals
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Menu tabs
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(tabId);
    if (panel) panel.classList.add('active');
  });
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.faq-question').forEach(b => b.setAttribute('aria-expanded', 'false'));
    if (!wasActive) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// Dish modal
const dishModal = document.getElementById('dishModal');
const modalBackdrop = dishModal?.querySelector('.modal-backdrop');
const modalClose = dishModal?.querySelector('.modal-close');

function openDishModal(card) {
  if (!dishModal) return;
  const isWine = card.classList.contains('menu-item-wine');
  const modal = dishModal.querySelector('.modal-dish');
  modal.classList.toggle('wine-modal', isWine);

  const tag = card.querySelector('.menu-item-tag')?.textContent || '';
  const title = card.querySelector('h3')?.textContent || '';
  const desc = card.querySelector('.menu-item-body p')?.textContent || '';
  const price = card.querySelector('.menu-price')?.textContent || '';
  const image = card.dataset.image || '';

  dishModal.querySelector('.modal-dish-image').style.backgroundImage = image ? `url('${image}')` : '';
  dishModal.querySelector('.modal-dish-tag').textContent = tag;
  dishModal.querySelector('.modal-dish-title').textContent = title;
  dishModal.querySelector('.modal-dish-desc').textContent = desc;
  dishModal.querySelector('.modal-dish-price').textContent = price ? `— ${price}` : '';

  const ingredientsBlock = dishModal.querySelector('[data-meta="ingredients"]');
  const ingredientsList = ingredientsBlock?.querySelector('.modal-ingredients');
  const ingredients = card.dataset.ingredients;
  if (ingredientsList && ingredients && !isWine) {
    ingredientsList.innerHTML = ingredients.split(',').map(i => `<li>${i.trim()}</li>`).join('');
    ingredientsBlock.style.display = '';
  } else if (ingredientsBlock) ingredientsBlock.style.display = 'none';

  const wineBlock = dishModal.querySelector('[data-meta="wine"]');
  const wineEl = dishModal.querySelector('.modal-wine');
  const wineH4 = wineBlock?.querySelector('h4');
  const wine = card.dataset.wine || card.dataset.pairing;
  if (wineEl && wine) {
    if (wineH4) wineH4.textContent = isWine ? 'Tasting Notes' : "Sommelier's Pairing";
    if (isWine && card.dataset.pairing) {
      wineEl.innerHTML = `<strong>Paired with:</strong> ${card.dataset.pairing}<br><br>${card.dataset.wine || ''}`;
    } else {
      wineEl.textContent = wine;
    }
    wineBlock.style.display = '';
  } else if (wineBlock) wineBlock.style.display = 'none';

  const chefBlock = dishModal.querySelector('[data-meta="chef"]');
  const chefEl = dishModal.querySelector('.modal-chef');
  const chef = card.dataset.chef;
  if (chefEl && chef && !isWine) {
    chefEl.textContent = chef;
    chefBlock.style.display = '';
  } else if (chefBlock) chefBlock.style.display = 'none';

  const allergensBlock = dishModal.querySelector('[data-meta="allergens"]');
  const allergensEl = dishModal.querySelector('.modal-allergens');
  const allergens = card.dataset.allergens;
  if (allergensEl && allergens && !isWine) {
    allergensEl.textContent = allergens;
    allergensBlock.style.display = '';
  } else if (allergensBlock) allergensBlock.style.display = 'none';

  dishModal.classList.add('active');
  dishModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDishModal() {
  if (!dishModal) return;
  dishModal.classList.remove('active');
  dishModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.menu-item-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (!e.target.closest('a')) openDishModal(card);
  });
});
modalBackdrop?.addEventListener('click', closeDishModal);
modalClose?.addEventListener('click', closeDishModal);

// Gallery lightbox with cycling
const galleryLightbox = document.getElementById('galleryLightbox');
const lightboxClose = galleryLightbox?.querySelector('.lightbox-close');
const lightboxPrev = galleryLightbox?.querySelector('.lightbox-prev');
const lightboxNext = galleryLightbox?.querySelector('.lightbox-next');
const lightboxImage = galleryLightbox?.querySelector('.lightbox-image');
const lightboxCounter = galleryLightbox?.querySelector('.lightbox-counter');

const galleryImages = Array.from(document.querySelectorAll('.gallery-popup')).map(el =>
  el.dataset.src || el.style.backgroundImage?.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1]
).filter(Boolean);

let galleryIndex = 0;

function showGalleryImage(index) {
  if (!lightboxImage || galleryImages.length === 0) return;
  galleryIndex = ((index % galleryImages.length) + galleryImages.length) % galleryImages.length;
  lightboxImage.src = galleryImages[galleryIndex];
  lightboxImage.alt = `Gallery image ${galleryIndex + 1}`;
  if (lightboxCounter) lightboxCounter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
}

function openLightbox(index = 0) {
  if (!galleryLightbox || galleryImages.length === 0) return;
  galleryLightbox.classList.toggle('single-image', galleryImages.length === 1);
  showGalleryImage(index);
  galleryLightbox.classList.add('active');
  galleryLightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!galleryLightbox) return;
  galleryLightbox.classList.remove('active');
  galleryLightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.gallery-popup').forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});

lightboxPrev?.addEventListener('click', (e) => {
  e.stopPropagation();
  showGalleryImage(galleryIndex - 1);
});
lightboxNext?.addEventListener('click', (e) => {
  e.stopPropagation();
  showGalleryImage(galleryIndex + 1);
});

galleryLightbox?.addEventListener('click', (e) => {
  if (e.target === galleryLightbox || e.target.closest('.lightbox-close')) closeLightbox();
});
lightboxClose?.addEventListener('click', closeLightbox);
lightboxImage?.addEventListener('click', (e) => e.stopPropagation());

document.addEventListener('keydown', (e) => {
  if (galleryLightbox?.classList.contains('active')) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); showGalleryImage(galleryIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); showGalleryImage(galleryIndex + 1); }
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (galleryLightbox?.classList.contains('active')) closeLightbox();
  else if (dishModal?.classList.contains('active')) closeDishModal();
});
