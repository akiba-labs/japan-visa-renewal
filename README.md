# Japan Visa Renewal Window Check

Free checker for when to renew a period of stay (在留期間更新) or residence card in Japan: the day the window opens (3 months before expiry for periods of 6 months+), the last day, the 2-month special period (特例期間) while ISA decides, the 2026-10-01 fee for the period you hope to get, and permanent-resident / HSP (ii) card renewal under the 2026-06-14 card rules (incl. 特定在留カード).

- Full app and API (Vercel): https://japan-visa-renewal.vercel.app
- Checker (GitHub Pages): https://akiba-labs.github.io/japan-visa-renewal/

- API: `GET /api/check?expiryDate=2027-03-20&currentPeriodMonths=12` (keyless, CORS), `/api/rules`, `/openapi.json`, `/llms.txt`
- MCP: `japan_visa_renewal_check` on https://free-agent-tools.vercel.app/mcp

Sources: ISA 在留期間更新許可申請 (16-3), 特例期間, 在留カードの有効期間の更新申請, 特定在留カード Q&A, 在留カードとは, fee page; Immigration Control Act (e-Gov). Rules as of 2026-11-08.

**Disclaimer:** educational, not legal advice, not affiliated with the Immigration Services Agency of Japan. ISA decides; confirm with your regional immigration bureau.

Dev:

```
npm ci
npm test
npm run build
npm run build:pages
```

`npm run build` is the Vercel app (checker, JSON API, share pages). `npm run build:pages` writes a static `out/` for GitHub Pages and checks that internal links and assets resolve under `/japan-visa-renewal`. Server routes stay in the repo; the Pages script only moves them aside for that build.

GitHub settings: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Pushes to `main` deploy with `.github/workflows/pages.yml`. The copy-paste steps for the other tool repos are at the top of `scripts/build-pages.mjs`.
