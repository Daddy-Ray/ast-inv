document.addEventListener('DOMContentLoaded', () => {
    // Feature toggle: hide project pages until reopened.
    const PROJECTS_VISIBLE = false;

    const applyProjectsVisibility = () => {
        if (PROJECTS_VISIBLE) return;

        const currentPage = getCurrentPageKey();
        const isProjectPage = currentPage === 'projects.html' || currentPage === 'project-almaty-stadium.html';
        if (isProjectPage) {
            window.location.replace('index.html');
            return;
        }

        const projectLinks = document.querySelectorAll('a[href$="projects.html"], a[href$="project-almaty-stadium.html"]');
        projectLinks.forEach((link) => {
            var container = link.closest('li') || link;
            container.style.display = 'none';
        });
    };

    const applySiteFavicon = () => {
        const mainScript = document.querySelector('script[src*="js/main.js"]');
        const faviconUrl = mainScript
            ? new URL('../assets/favicon-logo.png', mainScript.src).toString()
            : `${window.location.origin}/assets/favicon-logo.png`;

        let favicon = document.querySelector('link[rel="icon"]');
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.setAttribute('rel', 'icon');
            document.head.appendChild(favicon);
        }
        favicon.setAttribute('type', 'image/png');
        favicon.setAttribute('href', faviconUrl);
    };

    const getCurrentPageKey = () => {
        const path = window.location.pathname;
        const file = path.split('/').pop();
        return file || 'index.html';
    };

    const ensurePageSectionIds = () => {
        const page = getCurrentPageKey();
        const setIdIfMissing = (selector, id) => {
            const el = document.querySelector(selector);
            if (el && !el.id) {
                el.id = id;
            }
        };

        if (page === 'services.html') {
            setIdIfMissing('section.business-network-section', 'business-network');
        } else if (page === 'projects.html') {
            setIdIfMissing('section.services', 'projects-overview');
            setIdIfMissing('section.about', 'projects-updates');
        } else if (page === 'contact.html') {
            setIdIfMissing('section.contact-page', 'contact-overview');
        } else if (page === 'project-almaty-stadium.html') {
            setIdIfMissing('section.services', 'project-overview');
            setIdIfMissing('section.about', 'project-updates');
        } else if (page === 'index.html') {
            // Home already has #home; ensure the highlights section is addressable.
            const servicesSections = document.querySelectorAll('section.services');
            if (servicesSections.length) {
                const homeHighlights = Array.from(servicesSections).find((s) => !s.classList.contains('business-network-section'));
                if (homeHighlights && !homeHighlights.id) {
                    homeHighlights.id = 'home-highlights';
                }
            }
        }
    };

    const getNavSectionsByLanguage = (lang) => {
        const maps = {
            zh: {
                'index.html': [
                    { id: 'home-highlights', label: '核心优势' }
                ],
                'about.html': [
                    { id: 'about', label: '公司介绍' }
                ],
                'services.html': [
                    { id: 'services', label: '业务范围' },
                    { id: 'business-network', label: '资本网络地图' }
                ],
                'projects.html': [
                    { id: 'projects-overview', label: '项目总览' },
                    { id: 'projects-updates', label: '更新机制' }
                ],
                'project-almaty-stadium.html': [
                    { id: 'project-overview', label: '项目详情' },
                    { id: 'project-updates', label: '更新记录' }
                ],
                'contact.html': [
                    { id: 'contact-overview', label: '联系信息' }
                ]
            },
            en: {
                'index.html': [
                    { id: 'home-highlights', label: 'Core Strengths' }
                ],
                'about.html': [
                    { id: 'about', label: 'Company Overview' }
                ],
                'services.html': [
                    { id: 'services', label: 'Business Scope' },
                    { id: 'business-network', label: 'Capital Network Map' }
                ],
                'projects.html': [
                    { id: 'projects-overview', label: 'Portfolio Overview' },
                    { id: 'projects-updates', label: 'Update Mechanism' }
                ],
                'project-almaty-stadium.html': [
                    { id: 'project-overview', label: 'Project Details' },
                    { id: 'project-updates', label: 'Update Log' }
                ],
                'contact.html': [
                    { id: 'contact-overview', label: 'Contact Information' }
                ]
            },
            ru: {
                'index.html': [
                    { id: 'home-highlights', label: 'Ключевые преимущества' }
                ],
                'about.html': [
                    { id: 'about', label: 'О компании' }
                ],
                'services.html': [
                    { id: 'services', label: 'Сферы деятельности' },
                    { id: 'business-network', label: 'Карта капитальной сети' }
                ],
                'projects.html': [
                    { id: 'projects-overview', label: 'Обзор проектов' },
                    { id: 'projects-updates', label: 'Механизм обновлений' }
                ],
                'project-almaty-stadium.html': [
                    { id: 'project-overview', label: 'Детали проекта' },
                    { id: 'project-updates', label: 'Журнал обновлений' }
                ],
                'contact.html': [
                    { id: 'contact-overview', label: 'Контактная информация' }
                ]
            }
        };
        return maps[lang] || maps.en;
    };

    const scrollToSection = (id) => {
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        const header = document.querySelector('header');
        const headerOffset = header ? header.offsetHeight + 12 : 0;
        const y = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    };

    const installNavSectionDropdowns = () => {
        const lang = (document.documentElement.lang || 'en').toLowerCase().startsWith('zh')
            ? 'zh'
            : (document.documentElement.lang || 'en').toLowerCase().startsWith('ru')
                ? 'ru'
                : 'en';
        const sectionMap = getNavSectionsByLanguage(lang);
        const navLinks = document.querySelectorAll('header nav > ul > li > a[href$=".html"]');
        navLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            if (!href || href.startsWith('#')) return;
            const pageKey = href.split('/').pop().split('#')[0];
            const entries = sectionMap[pageKey];
            if (!entries || !entries.length) return;

            const li = link.parentElement;
            if (!li || li.querySelector('.nav-submenu')) return;
            li.classList.add('nav-with-submenu');

            const submenu = document.createElement('div');
            submenu.className = 'nav-submenu';
            entries.forEach((entry) => {
                const item = document.createElement('a');
                item.href = `${href.split('#')[0]}#${entry.id}`;
                item.textContent = entry.label;
                item.dataset.page = pageKey;
                item.dataset.target = entry.id;
                submenu.appendChild(item);
            });
            li.appendChild(submenu);
        });

        document.addEventListener('click', (e) => {
            const subLink = e.target.closest('.nav-submenu a');
            if (!subLink) return;
            const targetPage = subLink.dataset.page || '';
            const targetId = subLink.dataset.target || '';
            const currentPage = getCurrentPageKey();

            if (targetPage === currentPage) {
                e.preventDefault();
                history.replaceState(null, '', `#${targetId}`);
                scrollToSection(targetId);
            } else {
                sessionStorage.setItem('ast-nav-target', JSON.stringify({
                    page: targetPage,
                    id: targetId,
                    ts: Date.now()
                }));
            }
        });
    };

    const restorePendingSectionJump = () => {
        const raw = sessionStorage.getItem('ast-nav-target');
        if (!raw) return;
        try {
            const data = JSON.parse(raw);
            const fresh = Date.now() - Number(data.ts || 0) < 5 * 60 * 1000;
            if (fresh && data.page === getCurrentPageKey() && data.id) {
                setTimeout(() => scrollToSection(data.id), 40);
            }
        } catch (_err) {
            // Ignore malformed storage payload.
        }
        sessionStorage.removeItem('ast-nav-target');
    };

    const restoreHashJump = () => {
        const id = (window.location.hash || '').replace('#', '');
        if (!id) return;
        setTimeout(() => scrollToSection(id), 50);
    };

    ensurePageSectionIds();
    applyProjectsVisibility();
    applySiteFavicon();
    installNavSectionDropdowns();
    restorePendingSectionJump();
    restoreHashJump();

    // Ensure services section appears above network map.
    const servicesSection = document.querySelector('section#services.services');
    const networkSection = document.querySelector('section.business-network-section');
    if (servicesSection && networkSection && networkSection.previousElementSibling !== servicesSection) {
        networkSection.parentNode.insertBefore(servicesSection, networkSection);
    }

    // Keep footer year current across all pages.
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.footer-bottom p').forEach((el) => {
        el.textContent = el.textContent.replace(/\b20\d{2}\b/, String(currentYear));
    });

    // Navbar scroll effect
    const header = document.querySelector('header');
    const updateHeader = () => {
        if (window.scrollY > 20) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
            header.style.padding = '1rem 5%';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            header.style.boxShadow = 'none';
            header.style.padding = '2rem 5%';
        }
    };

    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Initial check

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate. Note: Some pages may not have all elements.
    const animateElements = document.querySelectorAll('.service-card, .stat-item, .about-text, .hero-content, .contact-item');
    
    // Add base styles for animation via JS or use CSS class
    // We check if style already exists to avoid duplication if script runs multiple times (unlikely here but good practice)
    if (!document.getElementById('animation-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'animation-styles';
        styleSheet.innerText = `
            .service-card, .stat-item, .about-text, .hero-content, .contact-item {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(styleSheet);
    }

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Services group toggles: click to expand/collapse.
    const serviceGrids = document.querySelectorAll('.service-grid');
    serviceGrids.forEach((grid) => {
        const groupTitles = Array.from(grid.querySelectorAll('.service-group-title'));
        if (!groupTitles.length) {
            return;
        }

        const groupImages = [
            '../assets/backgrounds/group-agriculture.jpg',
            '../assets/backgrounds/group-construction.jpg',
            '../assets/backgrounds/group-mining.jpg'
        ];

        const groups = groupTitles.map((title, idx) => {
            const cards = [];
            let node = title.nextElementSibling;
            while (node && !node.classList.contains('service-group-title')) {
                if (node.classList.contains('service-card')) {
                    cards.push(node);
                }
                node = node.nextElementSibling;
            }

            title.setAttribute('role', 'button');
            title.setAttribute('tabindex', '0');
            title.setAttribute('aria-expanded', 'false');
            title.dataset.groupIndex = String(idx);

            const labelText = title.textContent.trim();
            title.textContent = '';
            const cover = document.createElement('span');
            cover.className = 'service-group-cover';
            const img = document.createElement('img');
            img.src = groupImages[idx] || groupImages[groupImages.length - 1];
            img.alt = labelText;
            const overlay = document.createElement('span');
            overlay.className = 'service-group-overlay';
            cover.appendChild(img);
            cover.appendChild(overlay);

            const label = document.createElement('span');
            label.className = 'service-group-label';
            label.textContent = labelText;

            const caret = document.createElement('span');
            caret.className = 'service-group-caret';
            caret.textContent = '⌄';

            title.appendChild(cover);
            title.appendChild(label);
            title.appendChild(caret);

            return { title, cards, open: false, panel: null, content: null };
        });

        const titlesFragment = document.createDocumentFragment();
        const contentsFragment = document.createDocumentFragment();
        groups.forEach((group) => {
            const content = document.createElement('div');
            content.className = 'service-group-content';
            group.cards.forEach((card) => {
                content.appendChild(card);
            });
            content.dataset.groupIndex = group.title.dataset.groupIndex || '';

            titlesFragment.appendChild(group.title);
            contentsFragment.appendChild(content);
            group.content = content;
        });

        grid.textContent = '';
        grid.appendChild(titlesFragment);
        grid.appendChild(contentsFragment);

        const setExpanded = (group, expanded) => {
            group.title.classList.toggle('is-expanded', expanded);
            group.title.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            group.content.classList.toggle('is-expanded', expanded);
            group.cards.forEach((card) => {
                if (expanded && !card.classList.contains('visible')) {
                    card.classList.add('visible');
                }
            });
        };

        const refreshGroups = () => {
            groups.forEach((group) => {
                setExpanded(group, group.open);
            });
        };

        groups.forEach((group) => {
            group.title.addEventListener('click', () => {
                const nextOpen = !group.open;
                groups.forEach((g) => {
                    g.open = false;
                });
                group.open = nextOpen;
                refreshGroups();
            });

            group.title.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    group.title.click();
                }
            });
        });

        refreshGroups();
    });

    // Mobile menu toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            if (!document.getElementById('mobile-nav-style')) {
                const mobileNavStyle = document.createElement('style');
                mobileNavStyle.id = 'mobile-nav-style';
                mobileNavStyle.innerText = `
                    @media (max-width: 768px) {
                        nav.active {
                            display: block !important;
                            position: absolute;
                            top: 100%;
                            left: 0;
                            width: 100%;
                            background: white;
                            padding: 2rem;
                            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                        }
                        nav.active ul {
                            flex-direction: column;
                            gap: 1.5rem;
                        }
                    }
                `;
                document.head.appendChild(mobileNavStyle);
            }
        });
    }
});
