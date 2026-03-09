document.addEventListener('DOMContentLoaded', () => {
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

    const ensureServiceDetailLangSwitch = () => {
        const page = getCurrentPageKey();
        const serviceDetailPages = new Set([
            'service-full-chain.html',
            'service-strategy-deals.html',
            'service-risk-compliance-forensics.html',
            'service-tax-business-consulting.html'
        ]);
        if (!serviceDetailPages.has(page)) return;

        const navList = document.querySelector('header nav > ul');
        if (!navList || navList.querySelector('.lang-switch')) return;

        const path = window.location.pathname.toLowerCase();
        const isSrcGroup = path.includes('/en-src/') || path.includes('/zh-src/') || path.includes('/ru-src/');

        const targetDirs = isSrcGroup
            ? { en: 'en-src', zh: 'zh-src', ru: 'ru-src' }
            : { en: 'en', zh: 'zh', ru: 'ru' };

        const lang = (document.documentElement.lang || 'en').toLowerCase().startsWith('zh')
            ? 'zh'
            : (document.documentElement.lang || 'en').toLowerCase().startsWith('ru')
                ? 'ru'
                : 'en';

        const currentLabels = {
            en: 'EN',
            zh: '中文',
            ru: 'Русский'
        };
        const linkLabels = {
            en: 'English',
            zh: '中文',
            ru: 'Русский'
        };

        const switchItem = document.createElement('li');
        switchItem.className = 'lang-switch';

        const current = document.createElement('div');
        current.className = 'lang-current';
        current.innerHTML = `<i class="fas fa-globe"></i> ${currentLabels[lang]} <i class="fas fa-chevron-down"></i>`;

        const dropdown = document.createElement('div');
        dropdown.className = 'lang-dropdown';

        ['en', 'zh', 'ru'].forEach((code) => {
            const a = document.createElement('a');
            a.href = `../${targetDirs[code]}/${page}`;
            a.textContent = linkLabels[code];
            dropdown.appendChild(a);
        });

        switchItem.appendChild(current);
        switchItem.appendChild(dropdown);
        navList.appendChild(switchItem);
    };

    const ensurePageSectionIds = () => {
        const page = getCurrentPageKey();
        const setIdIfMissing = (selector, id) => {
            const el = document.querySelector(selector);
            if (el && !el.id) {
                el.id = id;
            }
        };

        if (page === 'contact.html') {
            setIdIfMissing('section.contact-page', 'contact-overview');
        } else if (page === 'index.html') {
            // Home already has #home; ensure the highlights section is addressable.
            const servicesSections = document.querySelectorAll('section.services');
            if (servicesSections.length) {
                const homeHighlights = servicesSections[0];
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
                    { page: 'service-full-chain.html', path: 'service-full-chain.html', label: '全链运营服务', flyout: true },
                    { page: 'service-strategy-deals.html', path: 'service-strategy-deals.html', label: '战略与企业交易', flyout: true },
                    { page: 'service-risk-compliance-forensics.html', path: 'service-risk-compliance-forensics.html', label: '风险、合规与法证', flyout: true },
                    { page: 'service-tax-business-consulting.html', path: 'service-tax-business-consulting.html', label: '税务与商务咨询', flyout: true }
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
                    { page: 'service-full-chain.html', path: 'service-full-chain.html', label: 'End-to-End Operations', flyout: true },
                    { page: 'service-strategy-deals.html', path: 'service-strategy-deals.html', label: 'Strategy and Corporate Deals', flyout: true },
                    { page: 'service-risk-compliance-forensics.html', path: 'service-risk-compliance-forensics.html', label: 'Risk, Compliance and Forensics', flyout: true },
                    { page: 'service-tax-business-consulting.html', path: 'service-tax-business-consulting.html', label: 'Tax and Business Advisory', flyout: true }
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
                    { page: 'service-full-chain.html', path: 'service-full-chain.html', label: 'Комплексное сопровождение', flyout: true },
                    { page: 'service-strategy-deals.html', path: 'service-strategy-deals.html', label: 'Стратегия и сделки', flyout: true },
                    { page: 'service-risk-compliance-forensics.html', path: 'service-risk-compliance-forensics.html', label: 'Риски, комплаенс и форензика', flyout: true },
                    { page: 'service-tax-business-consulting.html', path: 'service-tax-business-consulting.html', label: 'Налоговый и бизнес-консалтинг', flyout: true }
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
            const flyoutEntries = entries.filter((entry) => entry.flyout);
            const mainEntries = entries.filter((entry) => !entry.flyout);

            const renderEntry = (entry, targetContainer) => {
                const item = document.createElement('a');
                const targetPage = entry.page || pageKey;
                const hrefPath = href.split('#')[0];
                const slashIdx = hrefPath.lastIndexOf('/');
                const baseDir = slashIdx >= 0 ? hrefPath.slice(0, slashIdx + 1) : '';
                const targetPath = entry.path
                    ? (entry.path.includes('/') ? entry.path : `${baseDir}${entry.path}`)
                    : hrefPath;
                item.href = entry.id ? `${targetPath}#${entry.id}` : targetPath;
                item.textContent = entry.label;
                item.dataset.page = targetPage;
                item.dataset.target = entry.id || '';
                targetContainer.appendChild(item);
                return item;
            };

            const mainItems = mainEntries.map((entry) => ({
                entry,
                element: renderEntry(entry, submenu)
            }));

            if (flyoutEntries.length) {
                li.classList.add('nav-with-flyout');
                const flyoutTriggerItem = mainItems.find((item) => item.entry.id === 'services') || mainItems[0];
                const flyout = document.createElement('div');
                flyout.className = 'nav-submenu-flyout';
                flyoutEntries.forEach((entry) => renderEntry(entry, flyout));
                if (flyoutTriggerItem && flyoutTriggerItem.element) {
                    flyoutTriggerItem.element.classList.add('nav-flyout-trigger');
                    flyoutTriggerItem.element.insertAdjacentElement('afterend', flyout);
                } else {
                    submenu.appendChild(flyout);
                }
            }
            li.appendChild(submenu);
        });

        document.addEventListener('click', (e) => {
            const subLink = e.target.closest('.nav-submenu a');
            if (!subLink) return;
            const targetPage = subLink.dataset.page || '';
            const targetId = subLink.dataset.target || '';
            const currentPage = getCurrentPageKey();

            if (targetId && targetPage === currentPage) {
                e.preventDefault();
                history.replaceState(null, '', `#${targetId}`);
                scrollToSection(targetId);
            } else if (targetId && targetPage !== currentPage) {
                sessionStorage.setItem('ast-nav-target', JSON.stringify({
                    page: targetPage,
                    id: targetId,
                    ts: Date.now()
                }));
            }
        });

        // Add small close delay to avoid accidental submenu dismissal.
        const navParents = document.querySelectorAll('header nav > ul > li.nav-with-submenu');
        navParents.forEach((li) => {
            let closeTimer = null;
            let flyoutCloseTimer = null;
            const trigger = li.querySelector('.nav-flyout-trigger');
            const flyout = li.querySelector('.nav-submenu-flyout');

            const clearCloseTimer = () => {
                if (!closeTimer) return;
                clearTimeout(closeTimer);
                closeTimer = null;
            };

            const clearFlyoutCloseTimer = () => {
                if (!flyoutCloseTimer) return;
                clearTimeout(flyoutCloseTimer);
                flyoutCloseTimer = null;
            };

            const openSubmenu = () => {
                clearCloseTimer();
                li.classList.add('nav-submenu-open');
            };

            const queueCloseSubmenu = () => {
                clearCloseTimer();
                closeTimer = setTimeout(() => {
                    li.classList.remove('nav-submenu-open');
                    li.classList.remove('nav-flyout-open');
                }, 180);
            };

            li.addEventListener('mouseenter', openSubmenu);
            li.addEventListener('mouseleave', queueCloseSubmenu);
            li.addEventListener('focusin', openSubmenu);
            li.addEventListener('focusout', (evt) => {
                const related = evt.relatedTarget;
                if (related && li.contains(related)) return;
                queueCloseSubmenu();
            });

            if (trigger && flyout) {
                const openFlyout = () => {
                    clearFlyoutCloseTimer();
                    openSubmenu();
                    li.classList.add('nav-flyout-open');
                };
                const queueCloseFlyout = () => {
                    clearFlyoutCloseTimer();
                    flyoutCloseTimer = setTimeout(() => {
                        li.classList.remove('nav-flyout-open');
                    }, 220);
                };

                trigger.addEventListener('mouseenter', openFlyout);
                trigger.addEventListener('focus', openFlyout);
                trigger.addEventListener('mouseleave', queueCloseFlyout);
                trigger.addEventListener('blur', queueCloseFlyout);

                flyout.addEventListener('mouseenter', openFlyout);
                flyout.addEventListener('mouseleave', queueCloseFlyout);
                flyout.addEventListener('focusin', openFlyout);
                flyout.addEventListener('focusout', (evt) => {
                    const related = evt.relatedTarget;
                    if (related && flyout.contains(related)) return;
                    queueCloseFlyout();
                });
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

    const installClickableCards = () => {
        const cards = document.querySelectorAll('.clickable-card[data-href]');
        cards.forEach((card) => {
            card.setAttribute('role', 'link');
            card.setAttribute('tabindex', '0');
            const href = card.getAttribute('data-href');
            if (!href) return;

            card.addEventListener('click', () => {
                window.location.href = href;
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = href;
                }
            });
        });
    };

    const installCaseGalleries = () => {
        const uiLang = (document.documentElement.lang || 'en').toLowerCase().startsWith('zh')
            ? 'zh'
            : (document.documentElement.lang || 'en').toLowerCase().startsWith('ru')
                ? 'ru'
                : 'en';
        const dotLabelPrefix = uiLang === 'zh'
            ? '切换到第'
            : uiLang === 'ru'
                ? 'Перейти к изображению'
                : 'Go to image';

        const galleries = document.querySelectorAll('[data-case-gallery]');
        galleries.forEach((gallery) => {
            const track = gallery.querySelector('.case-gallery-track');
            let slides = track ? Array.from(track.querySelectorAll('img')) : [];
            const prevBtn = gallery.querySelector('.case-gallery-nav.prev');
            const nextBtn = gallery.querySelector('.case-gallery-nav.next');
            const dotsWrap = gallery.querySelector('[data-dots]');

            // Keep gallery concise: display only first 3 images.
            if (slides.length > 3) {
                slides.slice(3).forEach((img) => img.remove());
                slides = slides.slice(0, 3);
            }

            if (!track || slides.length <= 1) {
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                if (dotsWrap) dotsWrap.style.display = 'none';
                return;
            }

            let active = 0;
            let autoplayTimer = null;
            let paused = false;
            const dots = slides.map((_slide, index) => {
                if (!dotsWrap) return null;
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'case-gallery-dot';
                dot.setAttribute('aria-label', `${dotLabelPrefix} ${index + 1}`);
                dot.addEventListener('click', () => {
                    active = index;
                    render();
                });
                dotsWrap.appendChild(dot);
                return dot;
            });

            const render = () => {
                track.style.transform = `translateX(-${active * 100}%)`;
                dots.forEach((dot, index) => {
                    if (!dot) return;
                    dot.classList.toggle('is-active', index === active);
                });
            };

            const step = (direction) => {
                active = (active + direction + slides.length) % slides.length;
                render();
            };

            const stopAutoplay = () => {
                if (autoplayTimer) {
                    clearInterval(autoplayTimer);
                    autoplayTimer = null;
                }
            };

            const startAutoplay = () => {
                stopAutoplay();
                if (paused || slides.length <= 1) return;
                autoplayTimer = setInterval(() => {
                    step(1);
                }, 4200);
            };

            if (prevBtn) {
                prevBtn.addEventListener('click', () => step(-1));
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', () => step(1));
            }

            const pause = () => {
                paused = true;
                stopAutoplay();
            };
            const resume = () => {
                paused = false;
                startAutoplay();
            };

            gallery.addEventListener('mouseenter', pause);
            gallery.addEventListener('mouseleave', resume);
            gallery.addEventListener('focusin', pause);
            gallery.addEventListener('focusout', () => {
                const focusedInside = gallery.contains(document.activeElement);
                if (!focusedInside) {
                    resume();
                }
            });

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    stopAutoplay();
                } else if (!paused) {
                    startAutoplay();
                }
            });

            render();
            startAutoplay();
        });
    };

    const installCaseAccordions = () => {
        const uiLang = (document.documentElement.lang || 'en').toLowerCase().startsWith('zh')
            ? 'zh'
            : (document.documentElement.lang || 'en').toLowerCase().startsWith('ru')
                ? 'ru'
                : 'en';

        const labels = {
            zh: { open: '展开案例详情', close: '收起案例详情' },
            en: { open: 'Show Case Details', close: 'Hide Case Details' },
            ru: { open: 'Показать детали кейса', close: 'Скрыть детали кейса' }
        };
        const copy = labels[uiLang] || labels.en;

        const blocks = document.querySelectorAll('.service-case-block');
        blocks.forEach((block) => {
            if (block.querySelector('.service-case-toggle')) return;
            const content = document.createElement('div');
            content.className = 'service-case-content';

            const keepVisibleSelector = '.service-case-name, .section-header, .case-gallery, .case-gallery-note, .service-case-summary';
            const children = Array.from(block.children);
            const collapsibleNodes = children.filter((child) => !child.matches(keepVisibleSelector));
            if (!collapsibleNodes.length) return;

            collapsibleNodes.forEach((node) => {
                content.appendChild(node);
            });

            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'service-case-toggle';
            toggle.innerHTML = `<span class="label"></span><span class="caret">⌄</span>`;

            const labelEl = toggle.querySelector('.label');
            const setExpanded = (expanded) => {
                block.classList.toggle('is-expanded', expanded);
                block.classList.toggle('is-collapsed', !expanded);
                toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                if (labelEl) labelEl.textContent = expanded ? copy.close : copy.open;
            };

            toggle.addEventListener('click', () => {
                const next = !block.classList.contains('is-expanded');
                setExpanded(next);
            });

            const summaryNode = block.querySelector('.service-case-summary');
            const gallery = block.querySelector('.case-gallery');
            const titleNode = block.querySelector('.service-case-name') || block.querySelector('.section-header');
            const anchor = summaryNode || gallery || titleNode;
            if (anchor) {
                anchor.insertAdjacentElement('afterend', toggle);
                toggle.insertAdjacentElement('afterend', content);
            } else {
                block.appendChild(toggle);
                block.appendChild(content);
            }
            setExpanded(false);
        });
    };

    ensurePageSectionIds();
    ensureServiceDetailLangSwitch();
    applySiteFavicon();
    installNavSectionDropdowns();
    restorePendingSectionJump();
    restoreHashJump();
    installClickableCards();
    installCaseAccordions();
    installCaseGalleries();

    // Keep footer year current across all pages.
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.footer-bottom p').forEach((el) => {
        el.textContent = el.textContent.replace(/\b20\d{2}\b/, String(currentYear));
    });

    // Navbar scroll effect (class toggle + rAF throttle).
    const header = document.querySelector('header');
    const updateHeader = () => {
        if (!header) return;
        header.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    let headerScrollTicking = false;
    const onHeaderScroll = () => {
        if (headerScrollTicking) return;
        headerScrollTicking = true;
        requestAnimationFrame(() => {
            updateHeader();
            headerScrollTicking = false;
        });
    };
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
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
