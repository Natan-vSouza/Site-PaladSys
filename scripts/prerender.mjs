import fs from "node:fs";
import path from "node:path";
import { render } from "../.ssr/entry-server.js";
const data = JSON.parse(fs.readFileSync("src/content.json", "utf8"));
const template = fs.readFileSync("dist/index.html", "utf8");
const origin = process.env.SITE_URL?.replace(/\/$/, "");
if (origin && !/^https?:\/\/[^/]+$/.test(origin))
  throw new Error("SITE_URL deve ser a origem completa, sem caminho.");
const categories = {
  "computacao-de-borda": "Computação de Borda",
  data: "Dados",
  cloud: "Nuvem",
  soveregncloud: "Nuvem Soberana",
  dataresilience: "Resiliência de Dados",
  "seguranca-da-informacao": "Segurança da Informação",
  managedservices: "Serviços Gerenciados",
};
const standard = {
  "/": "Tecnologia como deve ser",
  "/company/": "Quem somos",
  "/contact/": "Contato",
  "/ideas/": "O que pensamos",
  "/ideas/page/2/": "O que pensamos — página 2",
  "/privacy-preferences/": "Privacidade nesta versão",
  "/404/": "Página não encontrada",
};
const pages = Object.entries(standard).map(([route, title]) => ({
  route,
  title,
}));
for (const s of data.services)
  pages.push({ route: `/${s.slug}/`, title: s.name, description: s.intro });
for (const a of data.articles)
  pages.push({
    route: `/${a.slug}/`,
    title: a.title,
    description: a.summary,
    article: true,
  });
for (const p of data.policies)
  pages.push({ route: `/${p.slug}/`, title: p.title });
for (const [slug, title] of Object.entries(categories))
  pages.push({
    route: `/category/${slug}/`,
    title: `${title} — O que pensamos`,
  });
const esc = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
for (const p of pages) {
  const title = esc(p.title + " | PaladSys"),
    description = esc(
      p.description ||
        "Tecnologia como deve ser. Nuvem soberana, resiliência de dados e serviços gerenciados.",
    );
  let html = template
    .replace(
      '<div id="root"></div>',
      `<div id="root">${render((origin || "https://preview.local") + p.route)}</div>`,
    )
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${description}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
    .replace(
      /(<meta property="og:description" content=")[^"]*/,
      `$1${description}`,
    )
    .replace(
      /(<meta property="og:type" content=")[^"]*/,
      `$1${p.article ? "article" : "website"}`,
    )
    .replace(
      /(<meta property="og:url" content=")[^"]*/,
      `$1${esc((origin || "") + p.route)}`,
    )
    .replace(
      /(<meta property="og:image" content=")[^"]*/,
      `$1${esc((origin || "") + "/images/social.jpg")}`,
    );
  if (origin && p.route !== "/404/")
    html = html.replace(
      "</head>",
      `<link rel="canonical" href="${esc(origin + p.route)}"/></head>`,
    );
  else
    html = html.replace(
      "</head>",
      '<meta name="robots" content="noindex,follow"/></head>',
    );
  const dir = path.join("dist", p.route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  if (p.route === "/404/") fs.writeFileSync("dist/404.html", html);
}
if (origin) {
  fs.writeFileSync(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages
      .filter((p) => p.route !== "/404/")
      .map((p) => `<url><loc>${esc(origin + p.route)}</loc></url>`)
      .join("")}</urlset>`,
  );
  fs.writeFileSync(
    "dist/robots.txt",
    `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
  );
} else fs.writeFileSync("dist/robots.txt", "User-agent: *\nDisallow: /\n");
console.log(
  `Pré-renderizadas ${pages.length} páginas. ${origin ? "Domínio: " + origin : "Prévia sem domínio: noindex. Configure SITE_URL para produção."}`,
);
