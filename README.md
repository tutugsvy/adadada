# Neo Party AI — Website

AI-powered commerce and creative workflows. Static multi-page site, ready to deploy to Vercel with **zero build configuration**.

## Structure

```
├── index.html            Landing page
├── about/index.html      About page
├── contact/index.html    Contact page (demo form)
├── app/index.html        AI Studio dashboard (interactive demo)
├── app/products/         Product catalog + AI analysis modal
├── app/campaigns/        Campaign list
├── app/content/          Content Studio generator
├── app/assistant/        AI chat interface
├── app/workflows/       Reusable AI workflows
├── styles.css            Landing + shared design system
├── app.css               Dashboard styles
├── app.js                Landing interactions
├── dashboard.js          Dashboard interactions (demo AI, chat, toasts)
├── vercel.json           Routing + security headers
└── package.json
```

## Deploy to Vercel

**Option A — drag & drop (fastest):**
1. Go to [vercel.com](https://vercel.com) → Add New → Project
2. Drag the project folder into the upload area
3. Deploy — no build settings needed

**Option B — via GitHub:**
1. Push this folder to a GitHub repo
2. Vercel → Add New → Project → Import the repo
3. Framework preset: **Other**. Build command: *(empty)*. Output dir: *(empty)*
4. Deploy

**Option C — Vercel CLI:**
```bash
npm i -g vercel
vercel --prod
```

## Custom domain

Vercel dashboard → Project → Settings → Domains → add `tokoneoparty.com` (and `www`). Point DNS per Vercel's instructions.

## Notes

- All AI demos (campaign generation, content studio, assistant chat, workflows) run **locally in the browser** with mock data — no backend required.
- The contact form is a demo interface; connect a form service (Formspree, Resend, etc.) to receive messages.
- Clean URLs are enabled: `/app`, `/about`, `/contact` resolve to their `index.html` files.
