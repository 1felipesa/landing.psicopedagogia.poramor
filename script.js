/**
 * script.js - Psicopedagogia Por Amor
 * Vanilla JS: Nav, scroll animations, FAQ accordion, YouTube carousel
 */

// =========================================================================
// CONFIG — Troque pelos seus valores reais
// =========================================================================
const CONFIG = {
    // Cole aqui a sua YouTube Data API v3 key
    // Obtenha em: https://console.cloud.google.com -> APIs & Services -> Credentials
    YOUTUBE_API_KEY: 'AIzaSyBAzx6LzHNvsXDPKddbFtM_RL2i-H1AkDI',

    // Handle do canal (sem o @)
    YOUTUBE_CHANNEL_HANDLE: 'psicopedagogia.poramor',

    // Quantos vídeos mostrar no carrossel (máx. 10 para não exceder a cota)
    YOUTUBE_MAX_RESULTS: 6,
};

// =========================================================================
// INIT
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initScrollAnimations();
    initFAQ();
    initYouTubeCarousel();
    lucide.createIcons();
});

// =========================================================================
// NAV SCROLL EFFECT
// =========================================================================
function initNavScroll() {
    const header = document.querySelector('#main-header .glass-nav');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('nav-pill-active');
        } else {
            header.classList.remove('nav-pill-active');
        }
    });
}

// =========================================================================
// SCROLL ANIMATIONS (IntersectionObserver)
// =========================================================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                if (entry.target.dataset.delay) {
                    entry.target.style.animationDelay = entry.target.dataset.delay;
                }
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const scrollElements = document.querySelectorAll(
        '#sobre > div, #servicos .glass-card, #servicos .p-10, #metodologia > div, #faq .faq-item'
    );

    scrollElements.forEach((el, index) => {
        el.style.opacity = '0';
        if (el.closest('#faq')) {
            el.dataset.delay = `${index * 0.08}s`;
        }
        observer.observe(el);
    });
}

// =========================================================================
// FAQ ACCORDION
// =========================================================================
function initFAQ() {
    const triggers = document.querySelectorAll('.faq-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.faq-item');
            const isOpen = item.classList.contains('is-open');

            // Fecha todos
            document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
                openItem.classList.remove('is-open');
                openItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
            });

            // Abre o clicado (se não estava aberto)
            if (!isOpen) {
                item.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// =========================================================================
// YOUTUBE CAROUSEL
// =========================================================================
async function initYouTubeCarousel() {
    const loading = document.getElementById('yt-loading');
    const errorEl = document.getElementById('yt-error');
    const track = document.getElementById('yt-track');
    const slidesEl = document.getElementById('yt-slides');
    const dotsEl = document.getElementById('yt-dots');
    const prevBtn = document.getElementById('yt-prev');
    const nextBtn = document.getElementById('yt-next');

    if (!slidesEl) return;

    // Se não configurou a API key, mostra estado de erro
    if (!CONFIG.YOUTUBE_API_KEY || CONFIG.YOUTUBE_API_KEY === 'SUA_API_KEY_AQUI') {
        showYTError(loading, errorEl);
        return;
    }

    try {
        // 1. Busca o channelId pelo handle
        const channelRes = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${CONFIG.YOUTUBE_CHANNEL_HANDLE}&key=${CONFIG.YOUTUBE_API_KEY}`
        );
        const channelData = await channelRes.json();

        if (!channelData.items?.length) throw new Error('Canal não encontrado');

        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        // 2. Busca os vídeos mais recentes da playlist de uploads
        const videosRes = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${CONFIG.YOUTUBE_MAX_RESULTS}&key=${CONFIG.YOUTUBE_API_KEY}`
        );
        const videosData = await videosRes.json();

        if (!videosData.items?.length) throw new Error('Nenhum vídeo encontrado');

        const videos = videosData.items.map((item, i) => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
            publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
            isNewest: i === 0,
        }));

        // 3. Renderiza o carrossel
        renderCarousel(videos, slidesEl, dotsEl);
        loading.classList.add('hidden');
        track.classList.remove('hidden');

        // 4. Inicia a lógica de navegação
        initCarouselNav(videos, prevBtn, nextBtn, dotsEl, slidesEl);

        // Re-render icons
        lucide.createIcons();

    } catch (err) {
        console.error('[YouTube Carousel]', err);
        showYTError(loading, errorEl);
    }
}

function showYTError(loading, errorEl) {
    loading.classList.add('hidden');
    errorEl.classList.remove('hidden');
    lucide.createIcons();
}

function renderCarousel(videos, slidesEl, dotsEl) {
    slidesEl.innerHTML = videos.map((video, i) => `
        <div class="yt-card ${i === 0 ? 'is-active' : ''}" data-video-id="${video.id}" data-index="${i}">
            <div class="yt-thumbnail">
                <img src="${video.thumbnail}" alt="${escapeHtml(video.title)}" loading="lazy">
                <div class="yt-play-overlay">
                    <div class="yt-play-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                </div>
                ${video.isNewest ? '<span class="yt-newest-badge">MAIS RECENTE</span>' : ''}
            </div>
            <div class="yt-card-body">
                <h3>${escapeHtml(video.title)}</h3>
                <span class="yt-card-meta">${video.publishedAt}</span>
            </div>
        </div>
    `).join('');

    // Dots
    dotsEl.innerHTML = videos.map((_, i) => `
        <button class="yt-dot w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-brand-primary w-6' : 'bg-brand-primary/30'}" data-dot="${i}" aria-label="Vídeo ${i + 1}"></button>
    `).join('');

    // Click no card => abre player embed
    slidesEl.querySelectorAll('.yt-card').forEach(card => {
        card.addEventListener('click', () => {
            const videoId = card.dataset.videoId;
            openYTPlayer(videoId);

            // Destacar card ativo
            slidesEl.querySelectorAll('.yt-card').forEach(c => c.classList.remove('is-active'));
            card.classList.add('is-active');
        });
    });
}

function openYTPlayer(videoId) {
    const container = document.getElementById('yt-player-container');
    const iframe = document.getElementById('yt-player');

    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    container.classList.remove('hidden');

    // Scroll suave até o player
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function initCarouselNav(videos, prevBtn, nextBtn, dotsEl, slidesEl) {
    let currentIndex = 0;
    const visibleCount = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

    function goTo(index) {
        const cards = slidesEl.querySelectorAll('.yt-card');
        const cardWidth = cards[0]?.offsetWidth + 24; // gap-6 = 24px
        const maxIndex = Math.max(0, videos.length - visibleCount);
        currentIndex = Math.max(0, Math.min(index, maxIndex));

        slidesEl.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        slidesEl.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';

        // Atualiza dots
        dotsEl.querySelectorAll('.yt-dot').forEach((dot, i) => {
            dot.className = `yt-dot rounded-full transition-all duration-300 ${i === currentIndex
                ? 'bg-brand-primary w-6 h-2'
                : 'bg-brand-primary/30 w-2 h-2'
            }`;
        });

        prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    dotsEl.querySelectorAll('.yt-dot').forEach(dot => {
        dot.addEventListener('click', () => goTo(parseInt(dot.dataset.dot)));
    });

    goTo(0);
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
