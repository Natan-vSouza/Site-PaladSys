# Validação desta entrega

Ambiente: Windows, Node.js 24.21.0, npm 11.19.0. Conferência em 29/09/2026.

## Verificações concluídas

- Instalação limpa com `npm ci`, sem `--legacy-peer-deps`.
- `npm run typecheck`: aprovado.
- `npm run build`: aprovado; 29 páginas pré-renderizadas, incluindo 404.
- `npm test`: cinco testes aprovados — datas/categorias, ressalvas editoriais essenciais, indicadores/relacionados, políticas e links/arquivos da produção.
- Navegador: 28 páginas de conteúdo percorridas em largura de 320 px; todas com um H1, sem transbordamento horizontal e sem imagens carregadas com erro.
- Menu de celular aberto, navegação para artigos, foco transferido ao conteúdo e viewport de 390 px sem transbordamento.
- Segunda página da listagem preservada depois de recarregar.
- Busca por `  soberania  ` normalizada, retorno de quatro artigos, estado na URL.
- Ordenação por leitura, filtro Segurança da Informação (um artigo), voltar do navegador e busca sem resultados conferidos.
- Menu de serviços fechado com Escape, com foco no acionador.
- Cópia de link do artigo confirmada na área de transferência.
- Página 404 conferida no navegador.
- Sem erros de console nas verificações realizadas.

Imagens ilustrativas principais: aproximadamente 98–189 KB por WebP, em vez dos JPEGs de 0,8–1,14 MB da exportação. CSS compilado: aproximadamente 17,5 KB; JavaScript: aproximadamente 360 KB antes de gzip.

## Limites

Não foi feita certificação completa WCAG, teste de carga ou auditoria de segurança. O HTTP 404 e os cabeçalhos devem ser conferidos na hospedagem final: o servidor de prévia do Vite não representa todos os servidores de produção. Links externos foram comparados com os destinos institucionais; nenhum contato foi enviado e nenhum login externo foi tentado. Consulte README e ALTERACOES para idioma, PHP e documentos ainda não fornecidos.
