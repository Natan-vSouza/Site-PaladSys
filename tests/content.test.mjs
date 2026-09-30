import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const data = JSON.parse(fs.readFileSync("src/content.json", "utf8"));
test("dez publicações, com datas e categorias conferidas na fonte", () => {
  assert.equal(data.articles.length, 10);
  assert.equal(new Set(data.articles.map((a) => a.slug)).size, 10);
  assert.deepEqual(
    data.articles.map((a) => a.date),
    [
      "2026-08-14",
      "2026-08-11",
      "2026-08-11",
      "2026-07-14",
      "2026-05-10",
      "2026-04-10",
      "2026-03-24",
      "2026-03-14",
      "2026-03-05",
      "2026-01-14",
    ],
  );
  assert.deepEqual(data.articles[3].categories, [
    "Dados",
    "Resiliência de Dados",
  ]);
  assert.ok(data.articles[1].categories.includes("Segurança da Informação"));
  assert.deepEqual(data.articles[6].categories, [
    "Computação de Borda",
    "Dados",
    "Nuvem",
    "Nuvem Soberana",
  ]);
  assert.ok(data.articles[7].categories.includes("Resiliência de Dados"));
  for (const a of data.articles) {
    assert.ok(a.blocks.length >= 19);
    assert.ok(a.blocks.some((b) => /^h/.test(b.tag)));
    assert.match(a.readTime, /\d a \d minutos de leitura/);
    assert.ok(a.summary.length > 40);
  }
});
test("preserva as ressalvas essenciais sobre soberania e recuperação", () => {
  const sovereignty = data.articles[2].blocks.map((b) => b.text).join(" ");
  assert.ok(
    sovereignty.includes(
      "Não se trata de buscar independência tecnológica absoluta",
    ),
  );
  assert.ok(sovereignty.includes("Portabilidade"));
  const recovery = data.articles[3].blocks.map((b) => b.text).join(" ");
  assert.ok(
    recovery.includes(
      "qual é o ponto mais recente em que ainda existe confiança",
    ),
  );
});
test("métricas de mercado e relacionados pertencem aos serviços corretos", () => {
  assert.deepEqual(
    data.services.map((s) => s.stats.map((v) => v.value)),
    [
      ["70%+", "130+", "90%+"],
      ["US$ 4,4 mi", "241 dias", "R$ 7,19 mi"],
      ["5,5 milhões", "90 dias", "13%+"],
    ],
  );
  for (const s of data.services) {
    assert.ok(s.title);
    assert.equal(s.stats.length, 3);
    for (const stat of s.stats) assert.ok(stat.text.length > 70);
    for (const slug of s.related)
      assert.ok(data.articles.some((a) => a.slug === slug));
  }
  assert.ok(!data.services[2].related.includes(data.articles[3].slug));
  assert.ok(data.services[2].related.includes(data.articles[8].slug));
});
test("políticas preservam as seções da fonte e não criam DPO", () => {
  const privacy = data.policies[0].blocks.map((b) => b.text).join(" "),
    cookies = data.policies[1].blocks.map((b) => b.text).join(" ");
  assert.ok(privacy.includes("10. Atualizações"));
  assert.ok(privacy.includes("revogação de consentimento"));
  assert.ok(!privacy.includes("privacidade@paladsys.com"));
  assert.ok(cookies.includes("17/04/2026"));
  assert.ok(cookies.includes("9. Detalhes de contato"));
  assert.ok(cookies.includes("Nome: elementor"));
});
test("produção pré-renderiza artigos, títulos, categorias e links internos", () => {
  assert.ok(
    fs.existsSync("dist/ideas/page/2/index.html"),
    "Execute npm run build antes dos testes.",
  );
  const files = [];
  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".html")) files.push(p);
    }
  }
  walk("dist");
  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    assert.match(html, /<h1[\s>]/);
    assert.ok(!html.includes("Publicação oficial PaladSys Research"));
    assert.ok(!html.includes("Acessar Painel Soberano"));
    assert.ok(!html.includes("Solicitação Registrada"));
    for (const match of html.matchAll(
      /(?:href|src)="(\/[^"#?]*)(?:[^\"]*)"/g,
    )) {
      const target = match[1];
      if (target.startsWith("//")) continue;
      const resolved = path.join("dist", target);
      assert.ok(
        fs.existsSync(resolved) ||
          fs.existsSync(path.join(resolved, "index.html")),
        `${file}: destino ausente ${target}`,
      );
    }
  }
  for (const a of data.articles) {
    const html = fs.readFileSync(`dist/${a.slug}/index.html`, "utf8");
    assert.ok(html.includes(a.blocks[0].text.replaceAll("&", "&amp;")));
    assert.ok(html.includes(a.title));
  }
});
