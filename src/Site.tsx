import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Globe,
  Check,
  Search,
} from "lucide-react";
import content from "./content.json";
import "./site.css";

type Article = (typeof content.articles)[number];
type Service = (typeof content.services)[number];
type Block = { tag: string; text: string };
const categories: Record<string, string> = {
  "computacao-de-borda": "Computação de Borda",
  data: "Dados",
  cloud: "Nuvem",
  soveregncloud: "Nuvem Soberana",
  dataresilience: "Resiliência de Dados",
  "seguranca-da-informacao": "Segurança da Informação",
  managedservices: "Serviços Gerenciados",
};
const services = content.services;
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const dateLabel = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
const pathOf = (slug: string) => `/${slug}/`;
let go: (url: string, replace?: boolean) => void;

function Link({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      {...props}
      href={href}
      onClick={(e) => {
        props.onClick?.(e);
        if (
          !e.defaultPrevented &&
          e.button === 0 &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.altKey &&
          !props.target &&
          !props.download &&
          href.startsWith("/") &&
          !href.startsWith("//")
        ) {
          e.preventDefault();
          go(href);
        }
      }}
    >
      {children}
    </a>
  );
}
function CTA({
  title = "Pronto para assumir o controle da sua infraestrutura digital?",
  text = "Combinamos nuvem soberana, resiliência de dados e serviços gerenciados para ajudar organizações a manter o controle da infraestrutura, proteger informações críticas e garantir continuidade operacional.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="wrap cta">
      <div>
        <p className="eyebrow">Fale com um especialista</p>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <Link className="button" href="/contact/">
        Entre em contato <ArrowUpRight size={18} />
      </Link>
    </section>
  );
}
function Breadcrumb({ name }: { name: string }) {
  return (
    <nav className="wrap breadcrumb" aria-label="Você está em">
      <Link href="/">Início</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{name}</span>
    </nav>
  );
}
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link className="card article-card" href={pathOf(article.slug)}>
      <div className="meta">
        <span>{article.categories[0]}</span>
        <span>{article.readTime.replace(" minutos de leitura", " min")}</span>
      </div>
      <h3>{article.title}</h3>
      <p>{article.summary}</p>
      <div className="card-bottom">
        <time dateTime={article.date}>{dateLabel(article.date)}</time>
        <ArrowUpRight size={19} aria-hidden="true" />
      </div>
    </Link>
  );
}
function Questions({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="questions">
      {items.map((q, i) => (
        <details key={q.question}>
          <summary>
            <span className="question-index">0{i + 1}</span>
            {q.question}
            <ChevronDown size={18} aria-hidden="true" />
          </summary>
          <p>{q.answer}</p>
        </details>
      ))}
    </div>
  );
}
function Blocks({ blocks }: { blocks: Block[] }) {
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.tag === "li") {
      const items: Block[] = [];
      const key = i;
      while (i < blocks.length && blocks[i].tag === "li")
        items.push(blocks[i++]);
      i--;
      elements.push(
        <ul key={key}>
          {items.map((item, n) => (
            <li key={n}>{item.text}</li>
          ))}
        </ul>,
      );
    } else if (/^h[1-6]$/.test(b.tag)) elements.push(<h2 key={i}>{b.text}</h2>);
    else elements.push(<p key={i}>{b.text}</p>);
  }
  return <div className="prose">{elements}</div>;
}
function Header({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false),
    [lang, setLang] = useState(false);
  const menu = useRef<HTMLButtonElement>(null),
    language = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
    setLang(false);
  }, [pathname]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (open) {
          setOpen(false);
          menu.current?.focus();
        }
        if (lang) {
          setLang(false);
          language.current?.focus();
        }
        const details = document.querySelector<HTMLDetailsElement>(
          ".service-menu[open]",
        );
        if (details) {
          details.open = false;
          details.querySelector("summary")?.focus();
        }
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open, lang]);
  return (
    <header className="site-header">
      <div className="wrap nav-row">
        <Link className="brand" href="/" aria-label="PaladSys — Início">
          <img
            src="/images/paladsys-logo.svg"
            alt="PaladSys"
            width="150"
            height="50"
          />
        </Link>
        <nav aria-label="Navegação principal" className="desktop-nav">
          <details className="service-menu" key={pathname}>
            <summary>
              O que fazemos <ChevronDown size={14} />
            </summary>
            <div>
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={pathOf(s.slug)}
                  aria-current={
                    pathname === pathOf(s.slug) ? "page" : undefined
                  }
                >
                  {s.name}
                  <ArrowUpRight size={16} />
                </Link>
              ))}
            </div>
          </details>
          <Link
            href="/ideas/"
            aria-current={pathname.startsWith("/ideas") ? "page" : undefined}
          >
            O que pensamos
          </Link>
          <Link
            href="/company/"
            aria-current={pathname === "/company/" ? "page" : undefined}
          >
            Quem somos
          </Link>
        </nav>
        <div className="nav-actions">
          <Link className="button contact-nav" href="/contact/">
            Entre em contato <ArrowUpRight size={16} />
          </Link>
          <div className="language">
            <button
              ref={language}
              className="icon-button"
              aria-label="Idioma: Português do Brasil"
              aria-expanded={lang}
              aria-controls="language-options"
              onClick={() => {
                setLang(!lang);
                setOpen(false);
              }}
            >
              <Globe size={19} />
            </button>
            {lang && (
              <div className="language-panel" id="language-options">
                <strong>Idioma do site</strong>
                <p>
                  Português (Brasil) <Check size={14} />
                </p>
                <span>
                  Esta versão está disponível em português. Outros idiomas ainda
                  não têm tradução publicada.
                </span>
              </div>
            )}
          </div>
          <button
            ref={menu}
            className="icon-button mobile-toggle"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => {
              setOpen(!open);
              setLang(false);
            }}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav wrap"
          aria-label="Navegação no celular"
        >
          {[
            { name: "Início", slug: "" },
            ...services,
            { name: "O que pensamos", slug: "ideas" },
            { name: "Quem somos", slug: "company" },
            { name: "Contato", slug: "contact" },
          ].map((s) => (
            <Link
              key={s.slug}
              href={s.slug ? pathOf(s.slug) : "/"}
              onClick={() => setOpen(false)}
            >
              {s.name}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
function Footer() {
  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <Link className="brand" href="/">
            <img
              src="/images/paladsys-logo.svg"
              width="150"
              height="50"
              alt="PaladSys"
              loading="lazy"
            />
          </Link>
          <p>
            Acreditamos que organizações devem manter o controle sobre a
            infraestrutura, os dados e as operações que sustentam seus negócios.
          </p>
          <p>
            Combinamos nuvem soberana, resiliência de dados e serviços
            gerenciados para ampliar a autonomia tecnológica de nossos clientes.
          </p>
        </div>
        <div>
          <h2>O que fazemos</h2>
          {services.map((s) => (
            <Link href={pathOf(s.slug)} key={s.slug}>
              {s.name}
            </Link>
          ))}
          <Link href="/company/">Quem somos</Link>
          <Link href="/ideas/">O que pensamos</Link>
        </div>
        <div>
          <h2>Institucional</h2>
          <Link href="/privacy-policy/">Política de Privacidade</Link>
          <Link href="/cookies-policy/">Política de Cookies</Link>
          <a
            href="https://paladsys.com/wp-content/uploads/PaladSys-CoBE-pt-BR.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Código de Ética e Conduta ↗
          </a>
          <Link href="/privacy-preferences/">Privacidade nesta versão</Link>
        </div>
        <div>
          <h2>Vamos conversar</h2>
          <Link href="/contact/">Escritórios e contato</Link>
          <a href="mailto:contato@paladsys.com">contato@paladsys.com</a>
          <a
            href="https://wa.me/5567999101136"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp ↗
          </a>
          <a
            href="https://www.linkedin.com/company/paladsys/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>
          <a
            href="https://www.instagram.com/paladsys/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram ↗
          </a>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>
          © {new Date().getFullYear()} PaladSys Soluções e Tecnologia Ltda ·
          CNPJ 46.464.918/0001-92
        </span>
        <a
          href="https://nevantgroup.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Uma empresa Nevant Group ↗
        </a>
      </div>
    </footer>
  );
}
function TituloDigitado() {
  const primeiraParte = "Tecnologia";
  const segundaParte = "como deve ser.";
  const total = primeiraParte.length + segundaParte.length;

  const [letrasVisiveis, setLetrasVisiveis] = useState(0);

  useEffect(() => {
    let quantidade = 0;

    const intervalo = window.setInterval(() => {
      quantidade += 1;
      setLetrasVisiveis(quantidade);

      if (quantidade >= total) {
        window.clearInterval(intervalo);
      }
    }, 50);

    return () => window.clearInterval(intervalo);
  }, [total]);

  function desenharLetras(texto: string, inicio: number) {
    return Array.from(texto).map((letra, indice) => (
      <b
        key={indice}
        style={{
          font: "inherit",
          visibility:
            inicio + indice < letrasVisiveis ? "visible" : "hidden",
        }}
      >
        {letra}
      </b>
    ));
  }

  return (
    <h1 aria-label="Tecnologia como deve ser.">
      <span className="titulo-digitado-branco" aria-hidden="true">
        {desenharLetras(primeiraParte, 0)}
      </span>
      <span aria-hidden="true">
        {desenharLetras(segundaParte, primeiraParte.length)}
      </span>
    </h1>
  );
}
function IndicadoresAnimados() {
  const area = useRef<HTMLDivElement>(null);
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const elemento = area.current;
    if (!elemento) return;

    let quadro = 0;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;

        observador.disconnect();

        const inicio = performance.now();
        const duracao = 2000;

        function animar(agora: number) {
          const tempo = Math.min((agora - inicio) / duracao, 1);

          // Começa rápido e desacelera ao chegar ao valor final.
          const suavizado = 1 - Math.pow(1 - tempo, 3);

          setProgresso(suavizado);

          if (tempo < 1) {
            quadro = requestAnimationFrame(animar);
          }
        }

        quadro = requestAnimationFrame(animar);
      },
      { threshold: 0.25 }
    );

    observador.observe(elemento);

    return () => {
      observador.disconnect();
      cancelAnimationFrame(quadro);
    };
  }, []);

  const indicadores = [
    {
      valor: `${Math.round(100 * progresso)}%`,
      final: "100%",
      titulo: "Controle",
    },
    {
      valor: `${Math.round(24 * progresso)} × 7`,
      final: "24 × 7",
      titulo: "Monitoramento",
    },
    {
      valor: "3–2–1",
      final: "3–2–1",
      titulo: "Proteção",
    },
    {
      valor: `${(99.99 * progresso).toFixed(2).replace(".", ",")}%`,
      final: "99,99%",
      titulo: "Disponibilidade",
    },
  ];

  return (
    <div className="grid four metrics" ref={area}>
      {indicadores.map((indicador) => (
        <div key={indicador.titulo}>
          <strong aria-label={indicador.final}>
            <span className="contador-numero" aria-hidden="true">
              {indicador.valor}
            </span>
          </strong>
          <span>{indicador.titulo}</span>
        </div>
      ))}
    </div>
  );
}
function Home() {
  return (
    <>
      <div className="home-hero-background">
        <iframe
          className="home-particles"
          src="/particles/index.html"
          title="Fundo decorativo de partículas"
          aria-hidden="true"
          tabIndex={-1}
          loading="eager"
        />

        <section className="wrap hero">
          <div>
            <p className="eyebrow">Soberania · Resiliência · Continuidade</p>
            <TituloDigitado />
            <p className="lead">
              Organizações dependem de tecnologia para operar. Garantimos que ela
              permaneça disponível, protegida e sob controle.
            </p>
            <div className="actions">
              <a className="button" href="#solucoes">
                Conhecer soluções <ArrowRight size={18} />
              </a>
              <Link className="button secondary" href="/company/">
                Entenda nosso propósito <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>

          <figure className="hero-image">
            <img
              src="/images/datacenter-corridor.webp"
              width="1200"
              height="800"
              alt="Ilustração de corredores de infraestrutura digital"
              fetchPriority="high"
            />
            <figcaption>
              Infraestrutura digital · Imagem ilustrativa
            </figcaption>
          </figure>
        </section>
      </div>

      <section className="section wrap" id="solucoes">
        <p className="eyebrow">O que fazemos</p>
        <h2>Infraestrutura, dados e operações sob controle.</h2>
        <p className="section-intro">
          Desenvolvemos soluções para que organizações mantenham o controle
          sobre a infraestrutura, os dados e as operações que sustentam seus
          negócios.
        </p>
        <div className="grid three">
          {services.map((s) => (
            <Link
              className="card service-card"
              href={pathOf(s.slug)}
              key={s.slug}
            >
              <img
                src={s.image}
                width="700"
                height="460"
                alt={`Ilustração de ${s.name.toLowerCase()}`}
                loading="lazy"
              />
              <div>
                <p className="eyebrow">{s.name}</p>
                <h3>{s.title}</h3>
                <p>{s.intro}</p>
                <span className="text-link">
                  Saiba mais <ArrowUpRight size={17} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-tint indicadores-section">
  <div className="wrap">
    <div className="indicadores-heading">
      <p className="eyebrow">Como deve ser</p>

      <h2>Controle, proteção e continuidade.</h2>

      <p className="section-intro">
        Autonomia tecnológica exige controle, proteção dos dados e
        capacidade de manter operações críticas disponíveis em qualquer
        cenário.
      </p>
    </div>

    <div className="indicadores-layout">
      <IndicadoresAnimados />

      <figure className="indicadores-imagem">
        <img
          src="/images/datacenter-corridor.webp"
          alt="Ilustração de infraestrutura digital"
          width="1200"
          height="800"
          loading="lazy"
        />

        <figcaption>
          <span>Infraestrutura digital</span>
          <strong>Tecnologia como deve ser.</strong>
          <small>Imagem ilustrativa</small>
        </figcaption>
      </figure>
    </div>

    <div className="indicadores-contato">
      <Link className="text-link" href="/contact/">
        Converse com a PaladSys
        <ArrowUpRight size={18} />
      </Link>
    </div>
  </div>
</section>

      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">O que pensamos</p>
            <h2>Perspectivas para as próximas decisões.</h2>
          </div>
          <Link className="text-link" href="/ideas/">
            Explorar conteúdos <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="grid three">
          {content.articles.slice(0, 6).map((a) => (
            <ArticleCard article={a} key={a.slug} />
          ))}
        </div>
      </section>

      <section className="wrap section faq-layout">
        <div>
          <p className="eyebrow">Questões estratégicas</p>
          <h2>Mais clareza para decidir.</h2>
          <Link className="text-link" href="/contact/">
            Converse com a PaladSys <ArrowUpRight size={18} />
          </Link>
        </div>
        <Questions items={content.homeQuestions} />
      </section>

      <CTA />
    </>
  );
}
function ServicePage({ service: s }: { service: Service }) {
  return (
    <>
      <Breadcrumb name={s.name} />
      <section className="wrap hero">
        <div>
          <p className="eyebrow">{s.name}</p>
          <h1 className="inner-title">{s.title}</h1>
          <p className="lead">{s.intro}</p>
          <Link className="button" href="/contact/">
            Fale com um especialista <ArrowUpRight size={18} />
          </Link>
        </div>
        <figure className="hero-image">
          <img
            src={s.image}
            width="1200"
            height="800"
            alt={`Ilustração de ${s.name.toLowerCase()}`}
          />
          <figcaption>Imagem ilustrativa</figcaption>
        </figure>
      </section>
      <section className="section section-tint">
        <div className="wrap">
          <p className="eyebrow">Contexto do mercado</p>
          <h2>{s.section}</h2>
          <div className="grid three stats">
            {s.stats.map((stat) => (
              <div className="card" key={stat.value}>
                <strong>{stat.value}</strong>
                <p>{stat.text}</p>
              </div>
            ))}
          </div>
          <p className="source-note">
            Indicadores publicados na{" "}
            <a href={s.source} target="_blank" rel="noopener noreferrer">
              página institucional da PaladSys ↗
            </a>
            .
          </p>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <h2>Análises e tendências</h2>
          <Link href="/ideas/" className="text-link">
            Explorar conteúdos <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="grid three">
          {s.related.map((slug) => (
            <ArticleCard
              article={content.articles.find((a) => a.slug === slug)!}
              key={slug}
            />
          ))}
        </div>
      </section>
      <CTA title={s.ctaTitle} text={s.ctaText} />
      <section className="wrap section">
        <h2>Conheça outros serviços</h2>
        <div className="grid two">
          {services
            .filter((x) => x.slug !== s.slug)
            .map((x) => (
              <Link
                className="card other-service"
                href={pathOf(x.slug)}
                key={x.slug}
              >
                <h3>{x.name}</h3>
                <ArrowUpRight />
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}
function Company() {
  return (
    <>
      <Breadcrumb name="Quem somos" />
      <section className="wrap hero">
        <div>
          <p className="eyebrow">Quem somos</p>
          <h1 className="inner-title">
            O futuro da infraestrutura exige uma nova abordagem.
          </h1>
          <p className="lead">{content.company.intro}</p>
        </div>
        <figure className="hero-image">
          <img
            src="/images/sovereign-building.webp"
            width="1200"
            height="800"
            alt="Ilustração arquitetônica de infraestrutura tecnológica"
          />
          <figcaption>
            Imagem ilustrativa · Não representa uma sede da empresa
          </figcaption>
        </figure>
      </section>
      <section className="wrap section faq-layout">
        <div>
          <p className="eyebrow">Nossa visão</p>
          <h2>Perguntas frequentes</h2>
        </div>
        <Questions items={content.companyQuestions} />
      </section>
      <CTA
        title="Vamos construir a próxima geração da sua infraestrutura digital"
        text={content.company.ctaText}
      />
    </>
  );
}
function Ideas({ url }: { url: URL }) {
  const routeCategory = url.pathname.match(/^\/category\/([^/]+)/)?.[1];
  const category = routeCategory
    ? categories[routeCategory]
    : url.searchParams.get("category") || "Todos";
  const query = url.searchParams.get("q") || "",
    sort = url.searchParams.get("sort") || "recent";
  const requested = Number(
    url.pathname.match(/\/page\/(\d+)/)?.[1] ||
      url.searchParams.get("page") ||
      1,
  );
  const filtered = content.articles
    .filter(
      (a) =>
        (category === "Todos" || a.categories.includes(category)) &&
        normalize(
          [a.title, a.summary, ...a.blocks.map((b) => b.text)].join(" "),
        ).includes(normalize(query)),
    )
    .sort((a, b) =>
      sort === "reading"
        ? parseInt(a.readTime) - parseInt(b.readTime)
        : b.date.localeCompare(a.date),
    );
  const pages = Math.max(1, Math.ceil(filtered.length / 9));
  const page = Number.isFinite(requested)
    ? Math.max(1, Math.min(requested, pages))
    : 1;
  const [draft, setDraft] = useState(query);
  useEffect(() => setDraft(query), [query]);
  function href(cat = category, q = query, order = sort, n = 1) {
    const slug = Object.keys(categories).find((k) => categories[k] === cat);
    let base = slug ? `/category/${slug}/` : "/ideas/";
    if (n > 1) base += `page/${n}/`;
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (order !== "recent") params.set("sort", order);
    return base + (params.size ? "?" + params : "");
  }
  return (
    <>
      <Breadcrumb name="O que pensamos" />
      <section className="wrap section ideas-intro">
        <p className="eyebrow">O que pensamos</p>
       <h1 className="titulo-editorial">
  Antecipe-se{" "}
  <span className="titulo-destaque">às mudanças.</span>
</h1>
        <p className="lead">
          A infraestrutura digital está em constante transformação. Mudanças
          geopolíticas, avanços em inteligência artificial, novas exigências
          regulatórias e a evolução das ameaças cibernéticas estão redefinindo a
          forma como organizações constroem, operam e protegem seus ambientes
          tecnológicos.
        </p>
        <p>
          Nesta página, compartilhamos análises, perspectivas e reflexões sobre
          soberania digital, computação em nuvem, resiliência de dados,
          infraestrutura crítica e os temas que influenciam as decisões
          tecnológicas de hoje e do futuro.
        </p>
      </section>
      <section className="wrap section results">
        <nav className="filters" aria-label="Filtrar por assunto">
          {["Todos", ...Object.values(categories)].map((c) => (
            <Link
              className={c === category ? "selected" : ""}
              aria-current={c === category ? "page" : undefined}
              href={href(c, query, sort)}
              key={c}
            >
              {c}
              <span>
                {
                  content.articles.filter(
                    (a) => c === "Todos" || a.categories.includes(c),
                  ).length
                }
              </span>
            </Link>
          ))}
        </nav>
        <div className="search-row">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(href(category, draft, sort));
            }}
            role="search"
          >
            <label className="sr-only" htmlFor="search">
              Buscar artigos
            </label>
            <input
              id="search"
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Buscar artigos..."
            />
            <button className="icon-button" aria-label="Buscar">
              <Search size={19} />
            </button>
          </form>
          <div>
            <label htmlFor="sort">Ordenar por</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => go(href(category, query, e.target.value))}
            >
              <option value="recent">Mais recentes</option>
              <option value="reading">Menor tempo de leitura</option>
            </select>
          </div>
        </div>
        <p className="result-count" role="status">
          {filtered.length
            ? `Exibindo ${(page - 1) * 9 + 1}–${Math.min(page * 9, filtered.length)} de ${filtered.length} artigos`
            : "Nenhum artigo encontrado."}
        </p>
        {(query || category !== "Todos") && (
          <Link className="text-link clear" href="/ideas/">
            Limpar filtros e busca
          </Link>
        )}
        <div className="grid three">
          {filtered.slice((page - 1) * 9, page * 9).map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
        {pages > 1 && (
          <nav className="pagination" aria-label="Páginas dos artigos">
            {page > 1 && (
              <Link href={href(category, query, sort, page - 1)}>Anterior</Link>
            )}
            {Array.from({ length: pages }, (_, i) => (
              <Link
                key={i}
                href={href(category, query, sort, i + 1)}
                aria-current={page === i + 1 ? "page" : undefined}
              >
                {i + 1}
              </Link>
            ))}
            {page < pages && (
              <Link href={href(category, query, sort, page + 1)}>Próxima</Link>
            )}
          </nav>
        )}
      </section>
    </>
  );
}
function ArticlePage({ article: a }: { article: Article }) {
  const [message, setMessage] = useState("");
  useEffect(() => setMessage(""), [a.slug]);
  async function share() {
    try {
      await navigator.clipboard.writeText(location.href);
      setMessage("Link copiado.");
    } catch {
      setMessage(
        "Não foi possível copiar. Copie o endereço na barra do navegador.",
      );
    }
  }
  return (
    <>
      <Breadcrumb name="O que pensamos" />
      <article className="wrap article">
        <header>
          <div className="filters">
            {a.categories.map((c) => (
              <Link
                href={`/category/${Object.keys(categories).find((k) => categories[k] === c)}/`}
                key={c}
              >
                {c}
              </Link>
            ))}
          </div>
          <h1>{a.title}</h1>
          <p className="lead">{a.summary}</p>
          <div className="article-meta">
            <time dateTime={a.date}>{dateLabel(a.date)}</time>
            <span>{a.readTime}</span>
            <button className="button secondary" onClick={share}>
              Copiar link
            </button>
          </div>
          <p role="status" className="copy-status">
            {message}
          </p>
        </header>
        <Blocks blocks={a.blocks} />
        <p className="source-note">
          Fonte:{" "}
          <a href={a.source} target="_blank" rel="noopener noreferrer">
            publicação da PaladSys ↗
          </a>
          .
        </p>
        <nav
          className="grid two article-pagination"
          aria-label="Outros artigos"
        >
          {[
            ["Anterior", a.previous],
            ["Próximo", a.next],
          ].map(
            ([label, href]) =>
              href && (
                <Link className="card" href={href} key={label}>
                  <span className="eyebrow">{label}</span>
                  <h2>
                    {
                      content.articles.find((x) => pathOf(x.slug) === href)
                        ?.title
                    }
                  </h2>
                  <ArrowUpRight size={19} />
                </Link>
              ),
          )}
        </nav>
        <Link className="text-link" href="/ideas/">
          Ver todos os artigos <ArrowRight size={18} />
        </Link>
      </article>
      <CTA />
    </>
  );
}
const offices = [
  {
    name: "Corporate Office",
    city: "Campo Grande · MS",
    building: "Ed. Evolution Business Center",
    floor: "15º Andar · Sala 1504",
    address: "Av. Afonso Pena, 5723",
    zip: "79031-010",
    phone: "+55 67 3354-5571",
    tel: "+556733545571",
  },
  {
    name: "Business Office",
    city: "São Paulo · SP",
    building: "Ed. International Plaza II",
    floor: "13º Andar · Conj. 41",
    address: "Av. Pres. Juscelino Kubitschek, 1327",
    zip: "04543-011",
    phone: "+55 11 5225-8226",
    tel: "+551152258226",
  },
];
function Contact() {
  return (
    <>
      <Breadcrumb name="Contato" />
      <section className="wrap section">
        <p className="eyebrow">Entre em contato</p>
        <h1>Conte-nos o seu desafio.</h1>
        <p className="lead narrow">
          Vamos entender os desafios da sua organização e construir soluções
          preparadas para apoiar a evolução da sua infraestrutura digital.
        </p>
        <div className="grid two contact-cards">
          <a href="mailto:contato@paladsys.com" className="card">
            <Mail />
            <p className="eyebrow">E-mail</p>
            <h2>Fale com nossa equipe</h2>
            <p>contato@paladsys.com</p>
            <span className="text-link">
              Enviar e-mail <ArrowUpRight size={18} />
            </span>
          </a>
          <a
            href="https://wa.me/5567999101136"
            target="_blank"
            rel="noopener noreferrer"
            className="card"
          >
            <Phone />
            <p className="eyebrow">WhatsApp</p>
            <h2>+55 (67) 9 9910-1136</h2>
            <p>Segunda a sexta-feira, das 09h às 18h</p>
            <span className="text-link">
              Abrir conversa <ArrowUpRight size={18} />
            </span>
          </a>
        </div>
      </section>
      <section className="wrap section">
        <p className="eyebrow">Escritórios · Brasil</p>
        <h2>Presença e proximidade.</h2>
        <div className="grid two">
          {offices.map((o) => (
            <div className="card office" key={o.name}>
              <MapPin />
              <p className="eyebrow">{o.city}</p>
              <h3>{o.name}</h3>
              <address>
                {o.building}
                <br />
                {o.floor}
                <br />
                {o.address}
                <br />
                {o.zip} · {o.city}
              </address>
              <a href={`tel:${o.tel}`}>{o.phone}</a>
              <a
                className="text-link"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address + ", " + o.city + ", " + o.zip)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver no Google Maps <ArrowUpRight size={17} />
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
function Policy({ slug }: { slug: string }) {
  const policy = content.policies.find((p) => p.slug === slug)!;
  return (
    <>
      <Breadcrumb name={policy.title} />
      <article className="wrap article policy">
        <p className="eyebrow">Documentos institucionais</p>
        <h1>{policy.title}</h1>
        <aside className="notice">
          <p>
            Documento publicado no site institucional da PaladSys, consultado em
            29/09/2026. As referências às ferramentas do site original não
            descrevem automaticamente esta versão.
          </p>
          <Link href="/privacy-preferences/">
            Veja como esta versão funciona
          </Link>
          <a href={policy.source} target="_blank" rel="noopener noreferrer">
            Consultar documento na fonte ↗
          </a>
        </aside>
        <Blocks blocks={policy.blocks} />
      </article>
    </>
  );
}
function Privacy() {
  return (
    <>
      <Breadcrumb name="Privacidade nesta versão" />
      <article className="wrap article">
        <p className="eyebrow">Transparência</p>
        <h1>Privacidade nesta versão</h1>
        <div className="prose">
          <h2>Navegação sem rastreadores opcionais</h2>
          <p>
            Esta versão não instala cookies de publicidade ou de análise de
            audiência. Não há Google Analytics, pixels publicitários, gravação
            de sessões ou conteúdo incorporado de redes sociais. Por isso, não
            existem categorias opcionais para ativar ou desativar aqui.
          </p>
          <h2>Contato e links externos</h2>
          <p>
            Os links de e-mail, WhatsApp, mapas e redes sociais abrem os
            respectivos serviços. Ao acessá-los, aplicam-se as práticas de
            privacidade de cada serviço. Esta versão não recebe mensagens nem
            credenciais de acesso.
          </p>
          <h2>Preferências de navegação</h2>
          <p>
            Filtros, busca e página dos artigos ficam no endereço da página.
            Nenhum login ou formulário de envio é simulado.
          </p>
          <h2>Hospedagem</h2>
          <p>
            O servidor de hospedagem pode manter registros técnicos de acesso. A
            configuração e os prazos desses registros devem ser definidos pelo
            responsável pela publicação.
          </p>
          <p>
            Para assuntos relacionados à PaladSys:{" "}
            <a href="mailto:contato@paladsys.com">contato@paladsys.com</a>.
          </p>
        </div>
      </article>
    </>
  );
}
function NotFound() {
  return (
    <section className="wrap section empty">
      <p className="eyebrow">404</p>
      <h1>Página não encontrada</h1>
      <p>
        O endereço pode ter sido alterado. Explore nossos serviços ou volte ao
        início.
      </p>
      <Link className="button" href="/">
        Voltar ao início <ArrowRight size={18} />
      </Link>
    </section>
  );
}
export default function Site() {
  const [url, setUrl] = useState(() => new URL(location.href));
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);
  go = (href, replace = false) => {
    const next = new URL(href, location.href);
    if (next.href === location.href) return;
    history[replace ? "replaceState" : "pushState"]({}, "", next);
    setUrl(next);
  };
  useEffect(() => {
    const pop = () => setUrl(new URL(location.href));
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  const pathname = url.pathname.endsWith("/")
    ? url.pathname
    : url.pathname + "/";
  const article = content.articles.find((a) => pathOf(a.slug) === pathname),
    service = services.find((s) => pathOf(s.slug) === pathname);
  const isIdeas =
    /^\/ideas\/(?:page\/\d+\/)?$/.test(pathname) ||
    (/^\/category\/[^/]+\/(?:page\/\d+\/)?$/.test(pathname) &&
      !!categories[pathname.split("/")[2]]);
  const title =
    article?.title ||
    service?.name ||
    {
      "/": "Tecnologia como deve ser",
      "/ideas/": "O que pensamos",
      "/company/": "Quem somos",
      "/contact/": "Contato",
      "/privacy-policy/": "Política de Privacidade",
      "/cookies-policy/": "Política de Cookies",
      "/privacy-preferences/": "Privacidade nesta versão",
    }[pathname] ||
    (isIdeas ? "O que pensamos" : "Página não encontrada");
  useEffect(() => {
    document.title = `${title} | PaladSys`;
    const description =
      article?.summary ||
      service?.intro ||
      "Tecnologia como deve ser. Nuvem soberana, resiliência de dados e serviços gerenciados.";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", url.href);
    document
      .querySelector('meta[property="og:type"]')
      ?.setAttribute("content", article ? "article" : "website");
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    main.current?.focus({ preventScroll: true });
  }, [url.href, title]);
  let page: React.ReactNode = <NotFound />;
  if (pathname === "/") page = <Home />;
  else if (service) page = <ServicePage service={service} />;
  else if (article) page = <ArticlePage article={article} />;
  else if (isIdeas) page = <Ideas url={url} />;
  else if (pathname === "/company/") page = <Company />;
  else if (pathname === "/contact/") page = <Contact />;
  else if (pathname === "/privacy-preferences/") page = <Privacy />;
  else if (content.policies.some((p) => pathOf(p.slug) === pathname))
    page = <Policy slug={pathname.split("/")[1]} />;
  return (
    <>
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <Header pathname={pathname} />
      <main id="main-content" ref={main} tabIndex={-1}>
        {page}
      </main>
      <Footer />
    </>
  );
}
