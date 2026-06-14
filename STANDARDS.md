# 🏆 Football Project Blueprint & Standards (Futibool Engine)

Este documento define a padronização oficial para todos os projetos de futebol (FAF, Girabola, Clubes) baseados na arquitetura **Futibool**. Siga estas diretrizes para garantir consistência, performance e estética premium.

---

## 🏗️ 1. Tech Stack (O Coração)

Todos os projetos devem utilizar:
- **Frontend:** Next.js 16.2.4 (App Router) + TypeScript.
- **Styling:** Tailwind CSS v4 (Utilitários + Design Tokens).
- **Backend/DB:** Supabase (PostgreSQL + Auth + Storage).
- **Animations:** Framer Motion v12 (Transições fluidas e micro-interações).

---

## 📁 2. Estrutura de Pastas (FileSystem)

```bash
/
├── public/              # Assets estáticos (logos, favicons)
├── src/
│   ├── components/      # UI Components (shadcn/ui + custom)
│   │   ├── layout/      # Navbar, Footer
│   │   └── ui/          # AnimatedCard, FuturisticButton, etc.
│   ├── lib/             # Clientes de API e wrappers do Supabase
│   ├── app/             # Rotas e páginas (Next.js App Router)
│   │   ├── layout.tsx   # Layout raiz com Navbar e Footer
│   │   ├── template.tsx # Animação de transição de rota (motion.div)
│   │   ├── page.tsx     # Homepage / Dashboard principal
│   │   └── globals.css  # Estilos e animações premium
│   └── pages.config.js  # CONFIGURAÇÃO CENTRAL DE ROTAS
├── supabase/
│   ├── migrations/      # Estrutura do banco de dados (SQL)
│   └── seed_mocks.sql   # Dados de teste e mocks locais
└── tsconfig.json        # Configurações TypeScript
```

---

## 🎨 3. Identidade Visual (Premium FAF Style)

Para manter o aspeto "State of the Art":
- **Header:** Glassmorphism (`glass-header`).
- **Paleta de Cores:**
    - `primary` para a cor da liga/marca.
    - `accent` para botões e indicadores em destaque (e.g. pulse).
    - `success` para status online/sucesso.
    - `border` e `card` para contentores estruturais.
- **Tipografia:** Sans-serif moderna (Inter/Roboto) com pesos `black` ou `extrabold` para títulos.
- **Animações:** Use sempre componentes `<AnimatedCard />` e `<FuturisticButton />` para garantir spring-physics consistente.

---

## ⚽ 4. Padrões de Dados (Supabase)

Tabelas essenciais que devem existir em todos os projetos:
- `profiles`: ID, nome, papel (admin/user) e avatar.
- `competitions`: ID, nome, tipo (Nacional/Internacional), logo e época.
- `players`: ID, nome, posição, clube, foto e estatísticas (JSONB).
- `matches`: equipa local, equipa visitante, resultado, data e status (live, scheduled, finished).
