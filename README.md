# PaladSys — projeto atualizado

Reconstrução visual em React + TypeScript, mantendo a direção escura com ciano da exportação do Stitch. Conteúdo institucional conferido em 29/09/2026. Esta entrega não é uma implementação PHP e não contém backend de contato ou autenticação.

## Abrir para desenvolvimento

Requisitos: Node.js 22.12 ou superior (testado com Node.js 24) e npm.

```sh
npm ci
npm run dev
```

Abra o endereço informado pelo Vite. Não abra `index.html` por duplo clique: o projeto usa um servidor HTTP e caminhos a partir da raiz.

## Compilar e conferir

```sh
npm run typecheck
npm run build
npm test
npm run preview
```

O build gera `dist/` com as páginas e seus conteúdos pré-renderizados, incluindo artigos, categorias, políticas e segunda página da listagem. Os links funcionam diretamente em hospedagem estática. JavaScript acrescenta busca, filtros e navegação sem recarga.

## Publicar

A pasta `dist/` já está incluída no ZIP. Publique **o conteúdo dela** na raiz do domínio/subdomínio, não a raiz do projeto nem `node_modules`.

Antes de publicar como site definitivo, gere novamente com a origem real. No PowerShell:

```powershell
$env:SITE_URL = 'https://seu-dominio.com'
npm run build
```

No Bash:

```sh
SITE_URL=https://seu-dominio.com npm run build
```

Isso gera URLs canônicas, imagem social absoluta e sitemap. Sem `SITE_URL`, a compilação é uma prévia com `noindex` e `robots.txt` bloqueando indexação. Não use o domínio da PaladSys para a sua demonstração sem autorização de publicação.

Apache: o `.htaccess` incluído define a página 404 e cabeçalhos básicos; depende dos módulos disponíveis. Netlify: `_redirects` usa a página 404 para caminhos inexistentes. Outros servidores devem servir os `index.html` de cada diretório e devolver HTTP 404 com `404.html` para endereços desconhecidos. Em Nginx, use `try_files $uri $uri/ =404;` com `error_page 404 /404.html;`. A entrega pressupõe publicação na raiz, não em subpasta.

## Onde editar

- `src/Site.tsx`: componentes, navegação e páginas.
- `src/site.css`: layout e estilos responsivos.
- `src/content.json`: artigos completos, categorias, datas, serviços e documentos.
- `public/images/`: logotipo oficial e imagens ilustrativas otimizadas.
- `scripts/prerender.mjs`: geração das páginas para publicação.
- `docs/fontes.json`: páginas usadas na conferência.
- `docs/ALTERACOES.md`: correções e limites desta entrega.
- `tests/content.test.mjs`: regressões de conteúdo e links da produção.

## Contato, documentos e idiomas

Os botões de contato levam a e-mail, WhatsApp ou à página de contato. Não há mensagem de envio bem-sucedido sem envio real. Não há portal ou captura de credenciais.

As políticas institucionais são identificadas como documentos da fonte; a página **Privacidade nesta versão** explica as tecnologias efetivamente usadas pela demonstração. Não foram instalados rastreadores, anúncios, cookies opcionais ou fontes remotas. Ao adicionar ferramentas, os documentos e controles devem ser atualizados de acordo com a implementação real.

O menu de idioma informa que apenas português está disponível. Traduções não foram inventadas. Termos de Utilização e Declaração de Acessibilidade não foram criados porque os documentos correspondentes não foram confirmados na fonte. O Código de Ética abre o PDF oficial.

Não há dependência de chave Gemini, conta AI Studio ou serviço de IA para executar o projeto.
