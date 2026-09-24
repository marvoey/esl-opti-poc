This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:5002](http://localhost:5002) with your browser to see the result.

## Routing

Pages come from Optimizely CMS. Each page is found by its URL, so any number of pages of any type can coexist.

- `src/proxy.ts` picks the CMS site from the request host and rewrites the request to `src/app/sites/[site]/[[...slug]]/page.tsx`. The browser URL doesn't change.
- The Home experience under the start page is the site root: CMS `/home/product-family/` is served at `/product-family`, and `/home/...` URLs redirect there. Pages outside Home keep their CMS path.
- The header, footer and site title come from the start page of the request's site (`src/app/sites/[site]/layout.tsx`).
- All URL mapping lives in `src/infrastructure/cms/siteRouting.ts`. The page route, the revalidate webhook and the proxy all use it.

Environment:

| Variable | Purpose |
|---|---|
| `OPTIMIZELY_APP_HOST` | Default site: the CMS application base URL (Graph `url.base`). Hosts that aren't listed below (Vercel preview URLs, 127.0.0.1) are served as this site. |
| `OPTIMIZELY_SITE_HOSTS` | Optional. Comma-separated base URLs of additional CMS sites served by the same deployment, e.g. `https://brand-a.org,https://brand-b.org`. |

Pages use the query the SDK builds from the registry. If code registers a component the CMS schema doesn't have yet, Graph rejects that query, so `src/infrastructure/cms/unknownTypeRecovery.ts` retries without the unknown types: the page renders without that component and the server logs `[cms] Graph does not know these registered types`. Push schema changes to an environment when you deploy code that registers new content types there.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
