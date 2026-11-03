newspulse/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/page.tsx
│   │   │   └── sign-up/page.tsx
│   │   ├── (main)/
│   │   │   ├── article/[slug]/page.tsx
│   │   │   ├── category/[slug]/page.tsx
│   │   │   ├── bookmarks/page.tsx
│   │   │   ├── discussions/page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api/auth/[...nextauth]/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── actions/              server actions (bookmarks, comments)
│   ├── components/
│   │   ├── ui/               shadcn (auto-generated)
│   │   ├── layout/           header, footer, mobile nav
│   │   ├── articles/         cards, grids, featured block
│   │   ├── providers/        theme + session providers
│   │   └── shared/           theme toggle, user menu
│   ├── config/site.ts
│   ├── data/                 static seed content
│   ├── hooks/
│   ├── lib/                  prisma client, validations, utils
│   ├── types/
│   ├── auth.ts
│   ├── auth.config.ts
│   └── proxy.ts              route protection (named middleware.ts on Next 15 or older)
├── .env.example
└── next.config.ts