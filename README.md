# Japan Visa Renewal Window Check

Free checker for when to renew a period of stay (在留期間更新) or residence card in Japan: the day the window opens (3 months before expiry for periods of 6 months+), the last day, the 2-month special period (特例期間) while ISA decides, the 2026-10-01 fee for the period you hope to get, and permanent-resident / HSP (ii) card renewal under the 2026-06-14 card rules (incl. 特定在留カード).

Live: https://japan-visa-renewal.vercel.app

- API: `GET /api/check?expiryDate=2027-03-20&currentPeriodMonths=12` (keyless, CORS), `/api/rules`, `/openapi.json`, `/llms.txt`
- MCP: `japan_visa_renewal_check` on https://free-agent-tools.vercel.app/mcp

Sources: ISA 在留期間更新許可申請 (16-3), 特例期間, 在留カードの有効期間の更新申請, 特定在留カード Q&A, 在留カードとは, fee page; Immigration Control Act (e-Gov). Rules as of 2026-11-08.

**Disclaimer:** educational, not legal advice, not affiliated with the Immigration Services Agency of Japan. ISA decides; confirm with your regional immigration bureau.

Dev: `npm ci && npm test && npm run build`
