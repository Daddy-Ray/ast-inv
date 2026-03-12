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

    const getCurrentLang = () => {
        const langRaw = (document.documentElement.lang || 'en').toLowerCase();
        if (langRaw.startsWith('zh')) return 'zh';
        if (langRaw.startsWith('ru')) return 'ru';
        return 'en';
    };

    const getServiceFaqEntries = (lang, pageKey) => {
        const map = {
            en: {
                'service-full-chain.html': {
                    title: 'Frequently Asked Questions',
                    intro: 'Key questions clients often ask before starting an end-to-end operations engagement.',
                    items: [
                        {
                            q: 'What stage can we engage AST for end-to-end operations?',
                            a: 'Engagement can start from pre-investment screening, transaction execution, or post-investment optimization. We tailor scope to your current stage.'
                        },
                        {
                            q: 'Which industries are most suitable for this service?',
                            a: 'Typical sectors include resources, infrastructure, logistics, industrial assets, and mixed-use real estate projects with multi-party coordination needs.'
                        },
                        {
                            q: 'What outcomes are usually targeted in the first phase?',
                            a: 'Initial milestones focus on governance alignment, execution rhythm, risk controls, and measurable operating improvements.'
                        },
                        {
                            q: 'Can this service be combined with tax and compliance support?',
                            a: 'Yes. End-to-end operations can be integrated with risk, compliance, forensics, and tax advisory for a unified execution model.'
                        }
                    ]
                },
                'service-strategy-deals.html': {
                    title: 'Frequently Asked Questions',
                    intro: 'Typical decision questions around strategy design and transaction execution.',
                    items: [
                        {
                            q: 'Do you support both buy-side and sell-side transactions?',
                            a: 'Yes. We support strategic options review, transaction structuring, diligence coordination, and negotiation support for both sides.'
                        },
                        {
                            q: 'How do you assess transaction feasibility?',
                            a: 'We evaluate strategic fit, capital structure, operational readiness, risk exposure, and value-creation pathways before execution.'
                        },
                        {
                            q: 'What is included in post-deal support?',
                            a: 'Post-deal support covers integration priorities, control framework setup, synergy tracking, and transition risk management.'
                        },
                        {
                            q: 'Can AST work with internal legal and finance teams?',
                            a: 'Yes. We work as a coordinated layer with internal teams and external advisors to keep decision and execution aligned.'
                        }
                    ]
                },
                'service-risk-compliance-forensics.html': {
                    title: 'Frequently Asked Questions',
                    intro: 'Core questions clients ask about risk control and compliance assurance.',
                    items: [
                        {
                            q: 'When should a risk and compliance review start?',
                            a: 'It should begin before major commitments and continue through execution, especially in cross-border or multi-jurisdiction projects.'
                        },
                        {
                            q: 'What does forensics support include?',
                            a: 'Forensics support includes fact-pattern review, anomaly tracing, control-gap analysis, and evidence-oriented reporting for management decisions.'
                        },
                        {
                            q: 'How are high-priority risks identified?',
                            a: 'Risks are prioritized by impact, probability, control maturity, and timeline sensitivity, then translated into action-ready mitigation steps.'
                        },
                        {
                            q: 'Can compliance frameworks be adapted by country?',
                            a: 'Yes. We localize control requirements and reporting practices to match jurisdictional rules and operating realities.'
                        }
                    ]
                },
                'service-tax-business-consulting.html': {
                    title: 'Frequently Asked Questions',
                    intro: 'Key tax and business advisory topics for cross-border investments.',
                    items: [
                        {
                            q: 'Which clients typically need this service?',
                            a: 'It is commonly used by companies with cross-border structures, regional holding entities, and transactions requiring multi-market tax alignment.'
                        },
                        {
                            q: 'Can tax planning and business restructuring be done together?',
                            a: 'Yes. We design tax and business solutions in one framework to reduce friction between legal, financial, and operating decisions.'
                        },
                        {
                            q: 'What are common priorities in the first advisory cycle?',
                            a: 'Typical priorities include structure diagnosis, tax exposure mapping, compliance roadmap, and implementation sequencing.'
                        },
                        {
                            q: 'Do you provide implementation follow-through?',
                            a: 'Yes. We support execution tracking, policy updates, and ongoing coordination with finance, legal, and external tax teams.'
                        }
                    ]
                }
            },
            zh: {
                'service-full-chain.html': {
                    title: '常见问题',
                    intro: '以下是客户在启动全链运营服务前最常咨询的核心问题。',
                    items: [
                        {
                            q: '全链运营服务可以从项目哪个阶段开始？',
                            a: '可从投前研判、交易执行或投后优化任一阶段切入，并按当前进度定制服务范围。'
                        },
                        {
                            q: '哪些行业更适合这项服务？',
                            a: '资源、基础设施、物流、工业资产及复合型地产等多主体协同项目通常更能发挥该服务价值。'
                        },
                        {
                            q: '首阶段一般先实现哪些结果？',
                            a: '通常先聚焦治理机制对齐、执行节奏梳理、关键风险管控及可量化运营改进。'
                        },
                        {
                            q: '是否能与税务和合规服务联动？',
                            a: '可以。可与风险、合规、法证及税务咨询统一集成，形成一体化执行框架。'
                        }
                    ]
                },
                'service-strategy-deals.html': {
                    title: '常见问题',
                    intro: '以下问题覆盖战略与企业交易服务中的高频决策场景。',
                    items: [
                        {
                            q: '是否同时支持买方和卖方交易？',
                            a: '支持。可提供战略选项评估、交易结构设计、尽调协同及谈判支持。'
                        },
                        {
                            q: '交易可行性通常如何判断？',
                            a: '从战略匹配、资本结构、运营承接、风险暴露及增值路径等维度进行综合评估。'
                        },
                        {
                            q: '交易完成后还会提供哪些支持？',
                            a: '包含整合优先级设计、管控体系搭建、协同价值跟踪及过渡期风险管理。'
                        },
                        {
                            q: '能否与企业内部法务和财务团队协同？',
                            a: '可以。通过统一项目节奏与决策口径，确保内外部团队执行一致。'
                        }
                    ]
                },
                'service-risk-compliance-forensics.html': {
                    title: '常见问题',
                    intro: '以下是风险、合规与法证服务中最常见的咨询问题。',
                    items: [
                        {
                            q: '风险与合规评估应在什么时候启动？',
                            a: '建议在重大决策前启动，并贯穿执行全周期，尤其适用于跨区域和多法域场景。'
                        },
                        {
                            q: '法证支持通常包含哪些内容？',
                            a: '通常包括异常线索核查、事实链梳理、控制缺口识别及可用于管理决策的报告输出。'
                        },
                        {
                            q: '高优先级风险如何识别？',
                            a: '按影响程度、发生概率、控制成熟度和时间敏感性分级，形成可执行整改路径。'
                        },
                        {
                            q: '合规框架是否能按不同国家调整？',
                            a: '可以。会结合各地监管要求和实际经营环境进行本地化配置。'
                        }
                    ]
                },
                'service-tax-business-consulting.html': {
                    title: '常见问题',
                    intro: '以下为税务与商务咨询服务中的常见问题与对应思路。',
                    items: [
                        {
                            q: '哪些企业更适合这项服务？',
                            a: '涉及跨境架构、区域控股安排或多市场交易协同的企业更需要该服务支持。'
                        },
                        {
                            q: '税务筹划和业务重构可以同步推进吗？',
                            a: '可以。通过一体化设计减少法务、财务与经营决策之间的摩擦。'
                        },
                        {
                            q: '首轮咨询通常优先处理什么？',
                            a: '通常先做架构诊断、税务暴露梳理、合规路线设计和实施节奏规划。'
                        },
                        {
                            q: '是否提供落地执行阶段支持？',
                            a: '提供。可持续跟踪执行进度，并协同财务、法务及外部税务团队。'
                        }
                    ]
                }
            },
            ru: {
                'service-full-chain.html': {
                    title: 'Часто задаваемые вопросы',
                    intro: 'Ключевые вопросы, которые чаще всего возникают перед запуском комплексного операционного сопровождения.',
                    items: [
                        {
                            q: 'С какого этапа можно подключить услугу комплексного сопровождения?',
                            a: 'Подключение возможно на этапе прединвестиционной оценки, в процессе сделки или на стадии постинвестиционной оптимизации.'
                        },
                        {
                            q: 'Для каких отраслей услуга наиболее актуальна?',
                            a: 'Наиболее частые кейсы связаны с ресурсами, инфраструктурой, логистикой, промышленными активами и многофункциональной недвижимостью.'
                        },
                        {
                            q: 'Какие результаты обычно ожидаются на первом этапе?',
                            a: 'Обычно фокус делается на выравнивании управленческой модели, ритма исполнения, контроле рисков и измеримых операционных улучшениях.'
                        },
                        {
                            q: 'Можно ли объединить сопровождение с налоговым и комплаенс-блоком?',
                            a: 'Да, услуга интегрируется с риск-менеджментом, комплаенсом, форензикой и налоговым контуром в единую модель реализации.'
                        }
                    ]
                },
                'service-strategy-deals.html': {
                    title: 'Часто задаваемые вопросы',
                    intro: 'Типовые вопросы по стратегии и корпоративным сделкам.',
                    items: [
                        {
                            q: 'Поддерживаете ли вы сделки как со стороны покупателя, так и продавца?',
                            a: 'Да. Поддержка включает стратегическую оценку, структурирование сделки, координацию due diligence и сопровождение переговоров.'
                        },
                        {
                            q: 'Как оценивается реализуемость сделки?',
                            a: 'Оценка строится на стратегической совместимости, капитальной структуре, готовности операционной модели и потенциале роста стоимости.'
                        },
                        {
                            q: 'Что входит в сопровождение после закрытия сделки?',
                            a: 'Включает приоритизацию интеграции, настройку контрольной модели, мониторинг синергий и управление переходными рисками.'
                        },
                        {
                            q: 'Можно ли работать совместно с внутренними командами компании?',
                            a: 'Да. Работа организуется как координационный контур между внутренними и внешними участниками для согласованного исполнения.'
                        }
                    ]
                },
                'service-risk-compliance-forensics.html': {
                    title: 'Часто задаваемые вопросы',
                    intro: 'Ключевые вопросы по рискам, комплаенсу и форензик-поддержке.',
                    items: [
                        {
                            q: 'Когда лучше запускать оценку рисков и комплаенса?',
                            a: 'Оптимально начинать до принятия крупных обязательств и сопровождать процесс на всем цикле исполнения, особенно в трансграничных проектах.'
                        },
                        {
                            q: 'Что обычно включает форензик-поддержка?',
                            a: 'Как правило, включает проверку аномалий, анализ фактических цепочек, выявление контрольных разрывов и отчетность для управленческих решений.'
                        },
                        {
                            q: 'Как определяются приоритетные риски?',
                            a: 'Приоритизация строится по влиянию, вероятности, зрелости контроля и временной чувствительности, после чего формируется план действий.'
                        },
                        {
                            q: 'Можно ли адаптировать комплаенс-контур под разные страны?',
                            a: 'Да, модель адаптируется под требования конкретной юрисдикции и практические условия работы.'
                        }
                    ]
                },
                'service-tax-business-consulting.html': {
                    title: 'Часто задаваемые вопросы',
                    intro: 'Частые вопросы по налоговому и бизнес-консалтингу в трансграничных проектах.',
                    items: [
                        {
                            q: 'Каким компаниям чаще всего нужна эта услуга?',
                            a: 'Обычно это компании с трансграничной структурой, региональными холдингами и сделками, требующими согласования налоговой логики между рынками.'
                        },
                        {
                            q: 'Можно ли совмещать налоговое планирование и бизнес-реорганизацию?',
                            a: 'Да. Интегрированный подход снижает несогласованность между юридическими, финансовыми и операционными решениями.'
                        },
                        {
                            q: 'Какие задачи ставятся в первом цикле консультаций?',
                            a: 'Обычно это диагностика структуры, карта налоговых рисков, дорожная карта комплаенса и этапность внедрения.'
                        },
                        {
                            q: 'Предусмотрено ли сопровождение на этапе внедрения?',
                            a: 'Да, предусмотрено сопровождение исполнения, обновления регламентов и координация с профильными внутренними и внешними командами.'
                        }
                    ]
                }
            }
        };
        return (map[lang] && map[lang][pageKey]) || null;
    };

    const installStructuredData = () => {
        const siteUrl = 'https://www.ast-inv.hk';
        const pathName = window.location.pathname || '/index.html';
        const normalizedPath = pathName.endsWith('/') ? `${pathName}index.html` : pathName;
        const pathLower = normalizedPath.toLowerCase();
        const isSrcPage = pathLower.includes('/en-src/') || pathLower.includes('/zh-src/') || pathLower.includes('/ru-src/');
        if (isSrcPage) return;

        const currentFile = normalizedPath.split('/').pop() || 'index.html';
        const urlPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
        const pageUrl = `${siteUrl}${urlPath}`;

        document.querySelectorAll('script[type="application/ld+json"][data-ast-seo="jsonld"]').forEach((el) => el.remove());

        const orgSchema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'AST Investing of Hong Kong',
            url: siteUrl,
            logo: `${siteUrl}/assets/logo.png`,
            email: 'ast@ast-inv.hk'
        };

        const schemaList = [orgSchema];
        const pageKey = currentFile.toLowerCase();
        if (pageKey === 'index.html') {
            schemaList.push({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'AST Investing of Hong Kong',
                url: pageUrl,
                inLanguage: (document.documentElement.lang || 'en')
            });
        }
        if (pageKey === 'services.html' || pageKey.startsWith('service-')) {
            schemaList.push({
                '@context': 'https://schema.org',
                '@type': 'Service',
                serviceType: 'International investment and capital advisory',
                provider: {
                    '@type': 'Organization',
                    name: 'AST Investing of Hong Kong'
                },
                areaServed: ['Europe', 'Asia-Pacific', 'Middle East']
            });
        }

        const lang = getCurrentLang();
        const faqData = getServiceFaqEntries(lang, pageKey);
        if (faqData && Array.isArray(faqData.items) && faqData.items.length) {
            schemaList.push({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqData.items.map((item) => ({
                    '@type': 'Question',
                    name: item.q,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: item.a
                    }
                }))
            });
        }

        schemaList.forEach((schemaObj) => {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.dataset.astSeo = 'jsonld';
            script.textContent = JSON.stringify(schemaObj);
            document.head.appendChild(script);
        });
    };

    const serviceDetailPages = new Set([
        'service-full-chain.html',
        'service-strategy-deals.html',
        'service-risk-compliance-forensics.html',
        'service-tax-business-consulting.html'
    ]);
    const legalPages = new Set([
        'privacy-policy.html',
        'terms-of-use.html',
        'disclaimer.html'
    ]);

    const getLegalPageContent = (lang, page) => {
        const map = {
            zh: {
                'privacy-policy.html': {
                    title: '隐私政策',
                    effective: '生效日期：2026年3月2日',
                    intro: '本政策用于说明阿斯特香港投資有限公司在网站运营中如何收集、使用、保存与保护信息。我们坚持最小必要、用途明确与风险可控原则，并在适用法律范围内保障用户合法权益。',
                    clauses: [
                        ['信息收集范围', '我们可能收集您主动提交的姓名、联系方式、企业信息、项目资料，以及网站访问产生的基础技术数据（如设备信息、访问日志、浏览行为）。'],
                        ['信息使用目的', '信息将用于业务沟通、合作评估、服务优化、风险控制及履行法律法规要求，不用于与上述目的无关的处理。'],
                        ['Cookie 与统计工具', '网站可能使用 Cookie 和统计工具以改善功能与体验。您可通过浏览器设置管理 Cookie，部分功能可能因此受限。'],
                        ['信息共享与披露', '我们不会出售个人信息。仅在业务必要、受托服务或法律要求情况下，按最小必要原则进行披露。'],
                        ['数据保存与安全', '我们在合理期限内保存信息，并采取技术与管理措施降低未经授权访问、泄露或篡改风险。'],
                        ['用户权利', '在适用法律范围内，您可申请访问、更正、删除或限制处理相关信息。联系邮箱：ast@ast-inv.hk。'],
                        ['未成年人保护', '本网站不面向未成年人。若发现误收集相关信息，我们将在核实后及时处理。'],
                        ['政策更新', '本政策可根据法律、监管或业务变化进行更新。更新后继续使用网站视为已知悉更新内容。']
                    ],
                    note: '本政策用于信息透明与合规说明，不影响本公司在适用法律项下的任何权利、抗辩与责任限制主张。'
                },
                'terms-of-use.html': {
                    title: '使用条款',
                    effective: '生效日期：2026年3月2日',
                    intro: '访问或使用本网站即表示您同意受本条款约束。若您不同意，请停止使用本网站。',
                    clauses: [
                        ['一般信息性质', '本网站内容仅供一般信息参考，不构成投资、法律、税务、会计或其他专业建议。'],
                        ['不构成要约或招揽', '网站信息不构成任何投资产品、交易安排或服务的要约、推荐、承诺或招揽。'],
                        ['用户自行判断责任', '您应基于独立判断作出决策，并在必要时咨询合资格专业顾问。由此产生的后果由您自行承担。'],
                        ['知识产权', '除另有声明外，网站文字、图像、标识及结构均受知识产权法律保护，未经书面许可不得复制、传播或商业使用。'],
                        ['禁止行为', '禁止以非法、误导、破坏性方式使用网站，包括未经授权访问系统、干扰网站运行或滥用网站内容。'],
                        ['无担保声明', '在法律允许范围内，网站及其内容按“现状”提供，不对完整性、准确性、时效性或特定目的适用性作担保。'],
                        ['责任限制', '在适用法律允许范围内，本公司对因访问、使用或无法使用本网站导致的直接、间接或后果性损失不承担责任。'],
                        ['适用法律与争议', '本条款受香港特别行政区法律管辖。争议由香港有管辖权法院处理，法律另有强制规定除外。']
                    ],
                    note: '如本条款部分内容被认定无效，不影响其余条款效力。'
                },
                'disclaimer.html': {
                    title: '免责声明',
                    effective: '生效日期：2026年3月2日',
                    intro: '本免责声明适用于您对本网站全部内容的访问、阅读、引用与使用。',
                    clauses: [
                        ['信息仅供一般参考', '本网站信息仅用于一般信息展示，不应被视为任何具体事项的专业建议或行动依据。'],
                        ['非专业意见', '本网站内容不构成投资、法律、税务、会计或其他专业意见，用户应自行取得独立专业建议。'],
                        ['前瞻性陈述风险', '涉及未来判断、预测或预期的陈述存在不确定性，实际结果可能与相关表述存在差异。'],
                        ['第三方信息说明', '第三方资料仅供参考，不代表本公司对其准确性、完整性或时效性作出保证或背书。'],
                        ['使用风险自担', '用户基于本网站信息作出的任何判断、交易或行动，其风险与责任均由用户自行承担。'],
                        ['责任限制', '在法律允许范围内，本公司不对因使用或无法使用本网站信息而导致的任何损失承担责任。']
                    ],
                    note: '本免责声明应与使用条款及隐私政策一并理解。'
                }
            },
            en: {
                'privacy-policy.html': {
                    title: 'Privacy Policy',
                    effective: 'Effective date: March 2, 2026',
                    intro: 'This policy explains how AST Investing of Hong Kong collects, uses, stores, and protects information in connection with this website.',
                    clauses: [
                        ['Information We Collect', 'We may collect contact details, company information, project materials, and technical usage data generated from website access.'],
                        ['How We Use Information', 'Data is used for communication, cooperation assessment, service improvement, risk management, and legal compliance purposes.'],
                        ['Cookies and Analytics', 'We may use cookies and analytics tools to improve website functionality and user experience. Browser settings may be used to manage cookies.'],
                        ['Data Sharing', 'We do not sell personal data. Information may be disclosed on a need-to-know basis to service providers, advisors, or where legally required.'],
                        ['Retention and Security', 'Information is retained only for reasonable business or legal periods and protected through appropriate technical and organizational controls.'],
                        ['Your Rights', 'Subject to applicable law, you may request access, correction, deletion, or restriction of processing by contacting ast@ast-inv.hk.'],
                        ['Minors', 'This website is not intended for minors. If such data is identified, we will take reasonable steps to address it.'],
                        ['Policy Updates', 'This policy may be updated in response to legal, regulatory, or operational changes. Continued use indicates acceptance of updates.']
                    ],
                    note: 'This policy is for transparency and does not limit rights, defenses, or liability protections available under applicable law.'
                },
                'terms-of-use.html': {
                    title: 'Terms of Use',
                    effective: 'Effective date: March 2, 2026',
                    intro: 'By accessing or using this website, you agree to these Terms of Use. If you do not agree, please discontinue use.',
                    clauses: [
                        ['General Information Only', 'Website content is provided for general informational purposes and does not constitute investment, legal, tax, accounting, or other professional advice.'],
                        ['No Offer or Solicitation', 'Nothing on this website constitutes an offer, recommendation, commitment, or solicitation relating to any transaction, service, or investment product.'],
                        ['User Responsibility', 'Users are solely responsible for independent judgment and should obtain qualified professional advice before making decisions.'],
                        ['Intellectual Property', 'Unless otherwise stated, all website content is protected by intellectual property laws and may not be copied or used without prior written consent.'],
                        ['Prohibited Conduct', 'Users must not misuse the website, attempt unauthorized access, interfere with operations, or use content for unlawful or misleading purposes.'],
                        ['No Warranty', 'To the fullest extent permitted by law, the website and its content are provided “as is” without express or implied warranties.'],
                        ['Limitation of Liability', 'To the extent permitted by applicable law, AST Investing of Hong Kong is not liable for direct, indirect, incidental, or consequential losses arising from website use.'],
                        ['Governing Law and Jurisdiction', 'These terms are governed by the laws of Hong Kong. Disputes are subject to Hong Kong courts unless mandatory law requires otherwise.']
                    ],
                    note: 'If any provision is held invalid, remaining provisions remain enforceable.'
                },
                'disclaimer.html': {
                    title: 'Disclaimer',
                    effective: 'Effective date: March 2, 2026',
                    intro: 'This disclaimer governs your access to and use of all content on this website.',
                    clauses: [
                        ['Information Nature', 'Website materials are provided for general information only and are not intended as professional or decision-ready advice.'],
                        ['No Professional Advice', 'Content does not constitute investment, legal, tax, accounting, or other professional recommendations.'],
                        ['Forward-Looking Statements', 'Any statements concerning future expectations are subject to uncertainty and actual outcomes may differ materially.'],
                        ['Third-Party Information', 'Third-party references are provided for convenience and do not imply endorsement or guarantee by AST Investing of Hong Kong.'],
                        ['Use at Own Risk', 'Users rely on website content at their own risk and remain solely responsible for evaluating its relevance and suitability.'],
                        ['Liability Limitation', 'To the maximum extent permitted by law, AST Investing of Hong Kong disclaims liability for losses arising from use of this website.']
                    ],
                    note: 'This disclaimer should be read together with the Terms of Use and Privacy Policy.'
                }
            },
            ru: {
                'privacy-policy.html': {
                    title: 'Политика конфиденциальности',
                    effective: 'Дата вступления в силу: 2 марта 2026 г.',
                    intro: 'Настоящая политика описывает подход AST Investing of Hong Kong к сбору, использованию, хранению и защите информации при использовании сайта.',
                    clauses: [
                        ['Какие данные могут собираться', 'Могут собираться контактные данные, сведения о компании, материалы по проекту и технические данные использования сайта.'],
                        ['Цели обработки', 'Данные используются для коммуникации, оценки сотрудничества, улучшения сервиса, управления рисками и соблюдения законодательства.'],
                        ['Cookie и аналитика', 'Сайт может использовать cookie и инструменты аналитики для улучшения функциональности. Управление cookie возможно в настройках браузера.'],
                        ['Передача данных', 'Мы не продаем персональные данные. Передача возможна только в необходимом объеме сервис-провайдерам, консультантам или по требованию закона.'],
                        ['Хранение и безопасность', 'Данные хранятся разумный срок для законных целей и защищаются организационными и техническими мерами.'],
                        ['Права пользователя', 'С учетом применимого права вы можете запросить доступ, исправление, удаление или ограничение обработки: ast@ast-inv.hk.'],
                        ['Несовершеннолетние', 'Сайт не предназначен для несовершеннолетних. При выявлении таких данных принимаются разумные меры по их удалению.'],
                        ['Обновление политики', 'Политика может изменяться в связи с правовыми, регуляторными или операционными изменениями. Продолжение использования означает согласие с обновлениями.']
                    ],
                    note: 'Политика носит информационный характер и не ограничивает прав, средств защиты и ограничений ответственности, предусмотренных применимым правом.'
                },
                'terms-of-use.html': {
                    title: 'Условия использования',
                    effective: 'Дата вступления в силу: 2 марта 2026 г.',
                    intro: 'Используя данный сайт, вы подтверждаете согласие с настоящими условиями. При несогласии следует прекратить использование сайта.',
                    clauses: [
                        ['Общий информационный характер', 'Содержание сайта носит общий информационный характер и не является инвестиционной, юридической, налоговой, бухгалтерской или иной профессиональной рекомендацией.'],
                        ['Отсутствие оферты', 'Информация на сайте не является офертой, приглашением к сделке, рекомендацией или обязательством.'],
                        ['Ответственность пользователя', 'Пользователь самостоятельно принимает решения и при необходимости обращается к квалифицированным консультантам.'],
                        ['Интеллектуальная собственность', 'Если не указано иное, материалы сайта защищены правами интеллектуальной собственности и не могут использоваться без письменного согласия.'],
                        ['Запрещенные действия', 'Запрещены несанкционированный доступ, вмешательство в работу сайта, а также незаконное или вводящее в заблуждение использование контента.'],
                        ['Отсутствие гарантий', 'В максимально допустимой законом степени сайт предоставляется «как есть», без прямых или подразумеваемых гарантий.'],
                        ['Ограничение ответственности', 'В рамках применимого права AST Investing of Hong Kong не несет ответственности за прямые, косвенные и иные убытки, связанные с использованием сайта.'],
                        ['Применимое право и юрисдикция', 'Условия регулируются правом Гонконга. Споры рассматриваются судами Гонконга, если иное не требуется императивными нормами.']
                    ],
                    note: 'Недействительность отдельного положения не влияет на действительность остальных.'
                },
                'disclaimer.html': {
                    title: 'Отказ от ответственности',
                    effective: 'Дата вступления в силу: 2 марта 2026 г.',
                    intro: 'Настоящий отказ от ответственности распространяется на весь контент сайта и его использование.',
                    clauses: [
                        ['Информационный характер материалов', 'Материалы сайта предназначены только для общего ознакомления и не являются профессиональным заключением.'],
                        ['Не является профессиональной рекомендацией', 'Контент не является инвестиционной, юридической, налоговой, бухгалтерской или иной специализированной рекомендацией.'],
                        ['Прогнозные заявления', 'Оценочные и прогнозные формулировки подвержены неопределенности, а фактические результаты могут отличаться.'],
                        ['Материалы третьих лиц', 'Ссылки и сведения из сторонних источников приводятся для удобства и не означают их одобрение или гарантию со стороны компании.'],
                        ['Использование на риск пользователя', 'Пользователь самостоятельно оценивает применимость информации и несет риски, связанные с ее использованием.'],
                        ['Ограничение ответственности', 'В максимально допустимой законом степени компания не несет ответственности за убытки, вызванные использованием или невозможностью использования сайта.']
                    ],
                    note: 'Отказ от ответственности применяется совместно с Условиями использования и Политикой конфиденциальности.'
                }
            }
        };
        return map[lang] && map[lang][page] ? map[lang][page] : null;
    };

    const ensureServiceDetailLangSwitch = () => {
        const page = getCurrentPageKey();
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

    const ensureLegalLangSwitch = () => {
        const page = getCurrentPageKey();
        if (!legalPages.has(page)) return;
        const navList = document.querySelector('header nav > ul');
        if (!navList || navList.querySelector('.lang-switch')) return;

        const path = window.location.pathname.toLowerCase();
        const isSrcGroup = path.includes('/en-src/') || path.includes('/zh-src/') || path.includes('/ru-src/');
        const targetDirs = isSrcGroup
            ? { en: 'en-src', zh: 'zh-src', ru: 'ru-src' }
            : { en: 'en', zh: 'zh', ru: 'ru' };

        const lang = getCurrentLang();
        const currentLabels = { en: 'EN', zh: '中文', ru: 'Русский' };
        const linkLabels = { en: 'English', zh: '中文', ru: 'Русский' };

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

    const applyServiceDetailSecondaryButtons = () => {
        const page = getCurrentPageKey();
        if (!serviceDetailPages.has(page)) return;

        const ctaLinks = document.querySelectorAll('section.services > p a.btn');
        ctaLinks.forEach((link) => {
            link.classList.add('btn-secondary');
        });
    };

    const installLegalFooterLinks = () => {
        const footerContent = document.querySelector('footer .footer-content');
        if (!footerContent || footerContent.querySelector('.footer-legal')) return;

        const lang = getCurrentLang();
        const pathLower = (window.location.pathname || '').toLowerCase();
        const inLanguageDir = /\/(en|zh|ru)(-src)?\//.test(pathLower);
        const linkPrefix = inLanguageDir ? '' : 'en/';

        const copyMap = {
            en: {
                title: 'Legal & Compliance',
                privacy: 'Privacy Policy',
                terms: 'Terms of Use',
                disclaimer: 'Disclaimer'
            },
            zh: {
                title: '法务与合规',
                privacy: '隐私政策',
                terms: '使用条款',
                disclaimer: '免责声明'
            },
            ru: {
                title: 'Правовая информация',
                privacy: 'Политика конфиденциальности',
                terms: 'Условия использования',
                disclaimer: 'Отказ от ответственности'
            }
        };
        const copy = copyMap[lang] || copyMap.en;

        const legalCol = document.createElement('div');
        legalCol.className = 'footer-col footer-legal';
        legalCol.innerHTML = `
            <h4>${copy.title}</h4>
            <ul>
                <li><a href="${linkPrefix}privacy-policy.html">${copy.privacy}</a></li>
                <li><a href="${linkPrefix}terms-of-use.html">${copy.terms}</a></li>
                <li><a href="${linkPrefix}disclaimer.html">${copy.disclaimer}</a></li>
            </ul>
        `;
        footerContent.appendChild(legalCol);
    };

    const installServiceFaqs = () => {
        const page = getCurrentPageKey();
        if (!serviceDetailPages.has(page)) return;
        const lang = getCurrentLang();
        const faqData = getServiceFaqEntries(lang, page);
        if (!faqData || !faqData.items || !faqData.items.length) return;

        const servicesSection = document.querySelector('section.services');
        if (!servicesSection || servicesSection.querySelector('.service-faq-section')) return;

        const faqBlock = document.createElement('div');
        faqBlock.className = 'service-faq-section';
        faqBlock.innerHTML = `
            <div class="section-header">
                <h2>${faqData.title}</h2>
                <p>${faqData.intro}</p>
            </div>
            <div class="service-grid service-grid-four">
                ${faqData.items.map((item) => `
                    <div class="service-card">
                        <h3>${item.q}</h3>
                        <p>${item.a}</p>
                    </div>
                `).join('')}
            </div>
        `;

        const children = Array.from(servicesSection.children);
        const cta = children.find((el) => el.tagName === 'P' && el.querySelector('a.btn'));
        if (cta) {
            servicesSection.insertBefore(faqBlock, cta);
        } else {
            servicesSection.appendChild(faqBlock);
        }
    };

    const installLegalPageLayout = () => {
        const page = getCurrentPageKey();
        if (!legalPages.has(page)) return;

        const lang = getCurrentLang();
        const content = getLegalPageContent(lang, page);
        const servicesSection = document.querySelector('section.services');
        if (!servicesSection || !content) return;

        const legalNavLabels = {
            zh: {
                privacy: '隐私政策',
                terms: '使用条款',
                disclaimer: '免责声明'
            },
            en: {
                privacy: 'Privacy Policy',
                terms: 'Terms of Use',
                disclaimer: 'Disclaimer'
            },
            ru: {
                privacy: 'Политика конфиденциальности',
                terms: 'Условия использования',
                disclaimer: 'Отказ от ответственности'
            }
        };
        const navCopy = legalNavLabels[lang] || legalNavLabels.en;

        const homeLabels = {
            zh: '返回主页',
            en: 'Back to Home',
            ru: 'Назад на главную'
        };

        servicesSection.classList.add('legal-page-section');
        servicesSection.innerHTML = `
            <div class="section-header">
                <h2>${content.title}</h2>
                <p>${content.effective}</p>
            </div>
            <nav class="legal-subnav" aria-label="${content.title}">
                <a href="privacy-policy.html" class="${page === 'privacy-policy.html' ? 'is-active' : ''}">${navCopy.privacy}</a>
                <a href="terms-of-use.html" class="${page === 'terms-of-use.html' ? 'is-active' : ''}">${navCopy.terms}</a>
                <a href="disclaimer.html" class="${page === 'disclaimer.html' ? 'is-active' : ''}">${navCopy.disclaimer}</a>
            </nav>
            <article class="legal-content">
                <p class="legal-intro">${content.intro}</p>
                ${content.clauses.map(([title, body]) => `
                    <section class="legal-clause">
                        <h3>${title}</h3>
                        <p>${body}</p>
                    </section>
                `).join('')}
                <p class="legal-note">${content.note}</p>
            </article>
            <p class="legal-actions"><a href="index.html" class="btn btn-secondary">${homeLabels[lang] || homeLabels.en}</a></p>
        `;
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

            const directEntries = flyoutEntries.length ? flyoutEntries : mainEntries;
            directEntries.forEach((entry) => renderEntry(entry, submenu));
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
    ensureLegalLangSwitch();
    installLegalPageLayout();
    installServiceFaqs();
    installStructuredData();
    installLegalFooterLinks();
    ensureServiceDetailLangSwitch();
    applyServiceDetailSecondaryButtons();
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
