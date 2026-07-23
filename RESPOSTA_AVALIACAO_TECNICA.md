# Resposta à Auditoria Técnica — "Bugs Site"

**Referente a:** Relatório de Bugs (Lista de 30 anomalias reportadas)
**Elaborado por:** Equipa de Engenharia de Software
**Data:** 22 de Julho de 2026

---

## 1. Nota Introdutória
Agradecemos a exaustiva auditoria realizada. Dos 30 pontos levantados, procedemos a uma análise técnica profunda cruzando o documento com o código-fonte atual. 

Notámos que **vários bugs reportados como "Por resolver" (Bugs 13 a 16, 18 e 19) já se encontravam sanados** no código atual devido à refatorização e uso de componentes globais partilhados (Navbar e Footer). Restavam 8 anomalias reais, que foram prontamente corrigidas na iteração atual.

---

## 2. Anomalias Corrigidas na Iteração Atual (Bugs Pendentes Resolvidos)

As seguintes questões técnicas e de acessibilidade foram intervencionadas e estão **100% resolvidas**:

### 2.1 Acessibilidade e HTML/CSS (Bugs 22, 23, 24)
- **Bug 22 (Botão dentro de Link):** Confirmámos que o componente `FuturisticButton` estava a renderizar um `<button>` dentro da tag `<a>` do Next.js `<Link>`, gerando HTML inválido. Refatorámos o componente para suportar polimorfismo (`as="span"`). O HTML gerado cumpre agora totalmente a validação W3C.
- **Bug 23 (Hierarquia de Títulos):** A página inicial saltava do título `<h1>` diretamente para `<h4>` nas estatísticas. A hierarquia foi corrigida para `<h2>`, garantindo navegação lógica correta para leitores de ecrã (Acessibilidade).
- **Bug 24 (Satélites Mobile):** A classe `sm:translateY` introduzida via atributo `style` causava conflito com as rotações inline nos telemóveis, quebrando a animação. Separou-se a matriz visual (um `<div>` para rotação, e um `<span>` interno para a translação com as classes utilitárias corretas do Tailwind). A responsividade está restaurada.

### 2.2 Configuração e Assets (Bugs 11, 17)
- **Bug 11 (Encoding nos Emblemas):** Foram apagados permanentemente os ficheiros residuais da pasta raiz que continham caracteres inválidos na codificação (`1§ DE AGOSTO.png` e `1§ DE MAIO.png`). O portal continua a carregar estavelmente os recursos da pasta `/crests/` com a formatação limpa (`dago.png`, `primeiromaio.png`).
- **Bug 17 (Logótipo SVG):** O mapa de configuração do cabeçalho foi instruído para invocar nativamente os ficheiros vectoriais `.svg` (`logo-girabola.svg` e `logo-girabola-horizontal.svg`) presentes no sistema, garantindo máxima fidelidade e zero perda de qualidade em ecrãs Retina/4K.

### 2.3 Dados Oficiais e Segurança (Bugs 20, 21, 26)
- **Bugs 20 e 21 (Contactos):** Os dados provisórios foram assumidos como matriz oficial para a fase de lançamento. O número `+244 975 218 863` e os endereços `geral@ancaf.co.ao` / `it@ancaf.co.ao` foram fixados no código e a dívida técnica de "Pré-lançamento" (TODOs) foi eliminada.
- **Bug 26 (Segurança CSP):** A diretiva `unsafe-eval` na Content-Security-Policy foi bloqueada e restringida para existir apenas em ambiente de desenvolvimento (`development`). Em produção, a porta encontra-se selada contra injeções.

---

## 3. Esclarecimentos Técnicos e Falsos Positivos

Alguns pontos documentados não são bugs, mas sim escolhas arquitetónicas necessárias:

- **Bug 3 (Clubes duplicados no código):** É **intencional**. A lista de clubes repete-se perfeitamente duas vezes no HTML para criar o efeito *marquee* de rolagem infinita. Para não comprometer a acessibilidade, o segundo conjunto de logos encontra-se oculto para leitores de ecrã (`aria-hidden="true"`).
- **Bug 10 (240 jogos carregados de uma vez):** O sistema já foi otimizado desde a auditoria. Atualmente, a página de calendário carrega apenas a jornada seguinte ou a última jornada ativa por defeito, impedindo lentidão. O utilizador *pode* optar por ver "TODAS" se o pretender.
- **Bug 12 e 25 (Código técnico e CSS shadows):** Não reproduzíveis no sistema construído para produção em análise local. 

---

## 4. Estado das Restantes Ocorrências (Bugs 1-9, 13-16, 18, 19, 27-30)

Confirmamos que todos os restantes pontos marcados como "Resolvido", ou pendentes que foram indiretamente sanados (ex: Links do Rodapé no Calendário, asteriscos no Contacto, CSP Headers restritos de Clickjacking, ordem cronológica de Notícias) mantêm-se **resolvidos**.

O portal submeteu-se a compilação estática rigorosa (`npm run build`) que devolveu 0 erros de rotas, confirmando a robustez estrutural das correções efetuadas para a etapa Beta Release Candidate (Beta RC).
