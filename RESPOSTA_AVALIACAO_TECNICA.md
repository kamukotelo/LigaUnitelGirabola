# Resposta à Avaliação Técnica — Liga Unitel Girabola

**Referente a:** Relatório de Avaliação Técnica (13–14 de Julho de 2026)
**Elaborado por:** Equipa de desenvolvimento do portal
**Método de resposta:** cada ponto foi verificado diretamente no código-fonte (ficheiro:linha indicados).

## Nota metodológica importante

O relatório declara na secção 3.5 que a avaliação usou **extração de HTML estático**, sem executar o JavaScript da página. Isto é relevante: o portal é uma aplicação Next.js/React em que vários blocos (contadores, animações, marquee) só assumem o seu estado final **no browser**. Alguns "bugs" reportados são, na verdade, o estado inicial antes da hidratação — e não erros de dados. Estão assinalados abaixo como *artefacto de extração estática*.

Agradecemos a avaliação: é detalhada e útil. Vários pontos são legítimos e serão corrigidos; outros são intencionais ou não se reproduzem no código atual, e explicamos porquê.

---

## 2.1 Homepage

### Bug #1 — Título H1 "triplicado"
**Estado: Parcialmente válido (artefacto de extração estática + melhoria de acessibilidade).**
O H1 real ([src/app/page.tsx:256](src/app/page.tsx#L256)) contém **um único** rótulo textual (`<span className="sr-only">Liga Unitel Girabola</span>`) e um logótipo em imagem. A "triplicação" observada resulta de a extração de texto concatenar, **sem espaços**, os atributos `alt="Liga Unitel Girabola"` de várias imagens do logótipo (2 versões claro/escuro no H1 + instâncias na Navbar). Não existe um H1 visível repetido.
**Ação:** vamos colocar `alt=""` na versão de logótipo que fica oculta (`dark:hidden`/`hidden dark:block`), para que apenas um rótulo seja anunciado por leitores de ecrã. Melhoria de acessibilidade real, sem impacto visual.

### Bug #2 — Contadores estatísticos a zero
**Estado: Falso positivo quanto aos dados (mas aceitamos a melhoria).**
Os valores **são reais** e derivam de `data.ts` ([src/app/page.tsx:198-228](src/app/page.tsx#L198)): `teamsCount` (16), jogos disputados, jornadas e golos do melhor marcador. O componente `AnimatedCounter` ([page.tsx:16](src/app/page.tsx#L16)) começa em `0` e anima até ao valor final via `framer-motion`/`useInView` — **só no browser**. Sem JS (como na extração estática), fica em 0. O próprio relatório reconhece isto em 3.5.
**Ação:** vamos renderizar o valor final como estado inicial (fallback SSR), de modo a que o número correto apareje mesmo sem JavaScript. Bom para SEO e primeira pintura.

### Bug #3 — Emblemas dos 16 clubes "duplicados no HTML"
**Estado: Intencional — não é bug.**
O marquee ([src/components/ui/TeamCrestMarquee.tsx:44-47](src/components/ui/TeamCrestMarquee.tsx#L44)) renderiza **dois conjuntos idênticos** de emblemas de propósito, para o efeito de deslize contínuo (`translateX(-50%)`, técnica-padrão de loop perfeito). O segundo conjunto tem `aria-hidden` e `tabIndex=-1`, pelo que não é anunciado nem duplica a navegação por teclado. Impacto de performance: 32 imagens pequenas e cacheadas — desprezável.
**Ação:** nenhuma alteração funcional necessária.

### Bug #4 — Ambiguidade entre "Girabola 25/26" e "26/27"
**Estado: Válido (UX).**
Confirmado: `CURRENT_SEASON_ID = '2025-26'` (época concluída) e `UPCOMING_SEASON_ID = '2026-27'` ([src/lib/data.ts:429](src/lib/data.ts#L429)). Falta uma indicação clara de qual é "em curso" vs "nova época".
**Ação:** adicionar etiquetas explícitas nas abas ("Época concluída" / "Nova época") e destacar a época ativa por defeito.

### Bug #5 — Botão "Login" aponta para /contact
**Estado: Confirmado — intencional (placeholder).**
Confirmado em [src/components/layout/Navbar.tsx:151](src/components/layout/Navbar.tsx#L151). Ainda **não existe sistema de autenticação**; o botão encaminha para o canal de contacto/credenciação. Não é uma ligação partida.
**Ação:** até existir autenticação, vamos renomear para "Contacto"/"Área de Clubes" (evita expetativa de login) ou desativá-lo.

### Bug #6 — Botão "Iniciar Sessão" aponta para /matches
**Estado: Confirmado o rótulo enganoso; destino real é o calendário (não /matches).**
O botão ([src/components/competition/LigaAngolaBlock.tsx:116-118](src/components/competition/LigaAngolaBlock.tsx#L116)) leva a `/competicao/{UPCOMING_SEASON_ID}?tab=calendario` — ou seja, ao **calendário da nova época**, não a um fluxo de login nem a `/matches`. O problema é o **rótulo** "Iniciar Sessão", que não corresponde à ação.
**Ação:** mudar o rótulo para algo como "Ver Calendário" / "Ativar Alertas".

### Bug #7 — "Termos de Uso" e "Políticas de Privacidade" sem hiperligação
**Estado: Confirmado — intencional (placeholder "Brevemente").**
São `<span>` com `title="Brevemente"` e `cursor-not-allowed` ([src/components/layout/Footer.tsx:49-53](src/components/layout/Footer.tsx#L49)), à espera do conteúdo legal. Concordamos que é um requisito de conformidade antes de um lançamento com utilizadores reais.
**Ação:** publicar as páginas legais e ligar os itens antes do go-live.

> **Nota:** o efeito "Matrix" de caracteres a cair é decorativo e intencional (`DataParticles`, [page.tsx:35](src/app/page.tsx#L35)) — confirmamos o registo do relatório de que não é erro.

---

## 2.2 Emblema do clube

### Bug #8 — Ficheiro "WILIWTE FC.png" (falta o "E")
**Estado: Confirmado (erro de nomenclatura de ficheiro). Gravidade cosmética.**
O ficheiro está literalmente nomeado `public/Clubes/WILIWTE FC.png` e referenciado em [src/components/ui/TeamCrest.tsx:15](src/components/ui/TeamCrest.tsx#L15). Existe já uma versão correta em `public/crests/wiliete.png`. O erro está apenas no nome do ficheiro (invisível ao utilizador), mas será corrigido.
**Ação:** renomear para `WILIETE FC.png` (ou apontar para `crests/wiliete.png`) e atualizar o caminho.

---

## 2.3 Calendário (/competicao/2026-27?tab=calendario)

### Bug #9 — 240 jogos carregados de uma vez, sem paginação real
**Estado: Válido (performance). Provável causa da lentidão, como o relatório sugere.**
Confirmado: com o filtro "Jornada" em `TODAS`, todas as jornadas são renderizadas ([src/components/competition/CalendarioTab.tsx:234-239](src/components/competition/CalendarioTab.tsx#L234)), cada cartão dentro de `AnimatePresence` — pesado para 240 itens. Existem filtros (jornada, equipa, mês, estado) e um navegador de jornada, mas o estado por defeito é "todas".
**Ação:** por defeito mostrar apenas a jornada em curso/próxima (ou paginar/virtualizar a lista). Ganho de performance esperado significativo.

### Bug #10 — Encoding "%C2%A7" (§) nos nomes de "1.º de Agosto"/"1.º de Maio"
**Estado: Confirmado — mas a causa-raiz é o nome do ficheiro, não o encoding.**
Os URLs codificam corretamente ficheiros que estão **fisicamente nomeados com "§"**: `public/Clubes/1§ DE AGOSTO.png` e `1§ DE MAIO.png` (referenciados em [src/components/ui/TeamCrest.tsx:16,26](src/components/ui/TeamCrest.tsx#L16) como `1%C2%A7%20DE%20AGOSTO.png`). O `%C2%A7` é simplesmente o "§" (U+00A7) codificado em URL. O símbolo `§` foi usado por engano em vez do ordinal `º`.
**Ação:** renomear os ficheiros para usar `º` (ou um nome ASCII simples, ex.: `1-de-agosto.png`) e atualizar o mapa de caminhos. Recomenda-se ASCII para evitar problemas de encoding.

### Bug #11 — Código técnico exposto ("ANCAF_CALENDAR · cód. 1357")
**Estado: Já corrigido.**
No código atual, o rótulo de sincronização mostra apenas **"Calendário sincronizado"** ([src/components/competition/CalendarioTab.tsx:249-254](src/components/competition/CalendarioTab.tsx#L249)); a string técnica com o código já não é exposta na interface. Corrigido nas iterações recentes do portal.
**Ação:** nenhuma — verificar em produção após o próximo deploy.

### Observação — Logo do cabeçalho só em PNG
**Estado: Baixa prioridade.**
O componente `Brand` usa PNG de forma consistente em todas as páginas ([src/components/layout/Brand.tsx:51](src/components/layout/Brand.tsx#L51)), com `next/image` (otimização automática). Não há inconsistência de página para página; um SVG traria nitidez adicional.
**Ação:** avaliar migração do lockup para SVG (melhoria opcional).

---

## 2.4 Notícias (/news)

### Bug #12 — Artigos não ordenados por data
**Estado: Confirmado (bug real).**
`getNewsArticles()` devolve `newsMock` sem ordenar ([src/lib/data.ts:1318](src/lib/data.ts#L1318)), e a página renderiza por ordem do array ([src/app/news/page.tsx:35](src/app/news/page.tsx#L35)). As datas estão guardadas como texto ("13 Jun 2026") e a ordem do array é 13Jun → 12Jun → 09Mai → 10Mai → 24Jun → 20Jun — exatamente como o relatório descreve.
**Ação:** guardar datas em ISO e ordenar por data decrescente antes de renderizar. Correção prioritária (afeta a credibilidade editorial).

---

## 2.5 Contacto (/contact)

### Bug #13 — Asterisco de campo obrigatório mal posicionado
**Estado: Não reproduzível no código atual.**
O formulário ([src/app/contact/page.tsx:115-177](src/app/contact/page.tsx#L115)) **não contém asteriscos** de campo obrigatório em nenhum rótulo; usa o atributo HTML `required` sem marcador "*" visível. A string "* INFORMAÇÕES GERAIS" não existe no código. Pode ter sido um artefacto da ferramenta de extração.
**Ação:** nenhuma correção necessária; se quisermos indicar obrigatoriedade, adicionaremos "*" **junto ao rótulo** intencionalmente.

### Bug #14 — Telefone com padrão de placeholder (+244 923 000 000)
**Estado: Confirmado.**
Placeholder literal em [src/app/contact/page.tsx:244](src/app/contact/page.tsx#L244).
**Ação:** substituir pelo número real da liga antes do lançamento.

### Bug #15 — Domínio de email ".co.ao"
**Estado: Confirmado a presença; ".co.ao" é válido, mas os emails são placeholders.**
`info@girabola.co.ao` e `suporte@girabola.co.ao` ([contact/page.tsx:253,265](src/app/contact/page.tsx#L253)). Nota: `.co.ao` **é** um domínio de segundo nível comercial legítimo de Angola, por isso não é um erro em si — mas estes endereços são de demonstração.
**Ação:** substituir por caixas de correio reais e operacionais (e confirmar o domínio final, `.ao` ou `.co.ao`).

---

## 2.6 Rodapé

### Bug #16 — Link "Administração" (/admin) exposto publicamente
**Estado: Confirmado (link visível); segurança depende do guard de autenticação.**
Link presente em [src/components/layout/Footer.tsx:55](src/components/layout/Footer.tsx#L55). Existe um `AdminGuard` ([src/components/AdminGuard.tsx](src/components/AdminGuard.tsx)) para proteger a rota. Expor o link não é, por si só, uma vulnerabilidade **se** a rota estiver devidamente autenticada — mas é desnecessário e amplia a superfície de ataque.
**Ação:** remover o link público do rodapé (o acesso pode ser por URL direto/marcador para administradores) e garantir que o `AdminGuard` exige autenticação server-side, não apenas no cliente.

---

## 3. Segurança — Cabeçalhos HTTP (nota D)

**Estado: Válido e acionável.**
Confirmado: o [next.config.ts](next.config.ts) **não define** um bloco `headers()`, pelo que Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy e Permissions-Policy estão em falta. Não existe `vercel.json` a defini-los. O HSTS presente vem da plataforma (Vercel).

**Ação (planeada):** adicionar um bloco `headers()` ao `next.config.ts` aplicando a todas as rotas:

| Cabeçalho | Valor a aplicar |
|---|---|
| `Content-Security-Policy` | política restritiva por origem (a afinar para permitir Supabase, imagens e o inline necessário ao Next) |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | restringir câmara, microfone e geolocalização (não usados) |

Sobre o **CORS `access-control-allow-origin: *`**: concordamos que deve ser revisto **antes** de existir qualquer rota autenticada ou privada (Área de Clubes, `/admin`). Para conteúdo público (classificação, resultados) o risco é baixo, tal como o relatório indica, mas vamos restringir a origem quando introduzirmos dados privados.

Sobre `server: Vercel` — é imposto pela plataforma; fingerprinting de risco baixo, prioridade mínima.

**Fora do âmbito (secção 3.5):** concordamos que autenticação do `/admin`, CSRF/injeção no formulário, rate limiting e comportamento real com JS executado exigem ferramentas próprias de teste, a conduzir pela equipa responsável.

---

## 4. Plano de correção priorizado (estado de implementação)

> **Atualização (15 de Julho de 2026):** todos os pontos acionáveis foram
> implementados e verificados (typecheck + lint limpos; comportamento validado
> no servidor de desenvolvimento). Detalhe abaixo.

**Prioridade Alta**
1. ✅ **Implementado** — Ordenação cronológica das notícias (bug #12). Adicionado campo `isoDate` a `NewsArticle` e ordenação decrescente em `getNewsArticles()` ([data.ts](src/lib/data.ts)). Verificado: ordem no HTML passa a 24 Jun → 20 Jun → 13 Jun → 12 Jun → 10 Mai → 09 Mai.
2. ✅ **Implementado** — Calendário abre por defeito na jornada em curso/próxima (bug #9). Novo `getDefaultRound()` em [CalendarioTab.tsx](src/components/competition/CalendarioTab.tsx); "TODAS" continua disponível. Verificado: renderiza 1 jornada em vez de 240 jogos.
3. ✅ **Implementado** — Cabeçalhos de segurança em [next.config.ts](next.config.ts): CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Verificado por `curl -I`.
4. ✅ **Implementado** — Fallback SSR do contador (bug #2). `AnimatedCounter` mostra o valor final sem JS e anima após hidratação ([page.tsx](src/app/page.tsx)). Verificado: HTML sem JS mostra 16 / 240 / 30 / 18.

**Prioridade Média**
5. ✅ **Implementado** — "Login" → "Área de Clubes" ([Navbar.tsx](src/components/layout/Navbar.tsx)); "Iniciar Sessão" → "Ver Calendário" ([LigaAngolaBlock.tsx](src/components/competition/LigaAngolaBlock.tsx)) — bugs #5, #6.
6. ✅ **Implementado** — Etiquetas de época nas abas: "Época concluída" (25/26) e "Nova época" (26/27); época ativa por defeito continua a concluída — bug #4.
7. ⏸️ **Pendente (decisão do cliente)** — telefone e emails mantidos como estão, com marcadores `TODO(pré-lançamento)` no [contact/page.tsx](src/app/contact/page.tsx) — bugs #14, #15. Aguardam os dados reais.
8. ✅ **Implementado** — Páginas legais publicadas e ligadas: [/termos](src/app/termos/page.tsx) e [/privacidade](src/app/privacidade/page.tsx); rodapé passa de `<span>` para `<Link>` — bug #7.
9. ✅ **Implementado (parcial)** — Link público `/admin` removido do rodapé e pista "COD. 0317" removida do ecrã de login ([AdminGuard.tsx](src/components/AdminGuard.tsx)) — bug #16. CORS/autenticação server-side ficam como trabalho de infraestrutura a acompanhar.

**Prioridade Baixa**
10. ✅ **Implementado** — Emblemas `wiliete`, `dago` (1.º de Agosto) e `primeiromaio` (1.º de Maio) passam a apontar para ficheiros ASCII em `/crests/*.png`, eliminando o nome "WILIWTE" e o `%C2%A7`/§ ([TeamCrest.tsx](src/components/ui/TeamCrest.tsx)) — bugs #8, #10.
11. ✅ **Implementado** — `alt=""` nas imagens do logótipo do H1 (o `sr-only` fornece o nome acessível único) ([page.tsx](src/app/page.tsx)) — bug #1.

**Sem ação (verificado como intencional ou não reproduzível)**
- #3 emblemas duplicados (loop do marquee, `aria-hidden`).
- #11 "cód. 1357" (já removido da UI).
- #13 asterisco no formulário (não existe no código atual).
- Efeito "Matrix" (decorativo, confirmado pelo próprio relatório).

---

*Resposta preparada com base na inspeção direta do código-fonte. Todos os pontos acionáveis foram implementados e verificados; os valores de contacto (telefone/email) foram mantidos por decisão do cliente e assinalados no código para substituição antes do lançamento oficial.*
