# SpeerCheck – Live Interview Scheduler

A beautiful, real-world React + TypeScript app for recruiters to schedule interviews with candidates and engineers, with live availability logic and a polished, user-friendly UI.

## ✨ Features

- **Candidate selection** with preferred availability display
- **Weekly calendar** (Mon–Fri, 9AM–6PM, 30-min slots)
- **Engineer filter** (see only one engineer’s slots)
- **Duration selection** (15, 30, 60 min)
- **Live slot availability**: Only overlapping slots between candidate and at least one engineer are clickable
- **Slot locking**: Once scheduled, slots are locked for the session
- **Confirmation message**: See candidate, engineer, time, and duration
- **Unit tests** for slot availability logic (see `/src/components/__tests__/availability.test.ts`)
- **Modern, responsive UI** with Tailwind CSS

## 🛠️ Design Decisions

- **Component-driven**: Calendar, dropdowns, and logic are modular and reusable
- **State management**: All state is managed in the main `App.tsx` for clarity
- **No backend**: Data is loaded from `/public/candidates.json` and `/public/engineers.json`
- **UI/UX**: Focused on clarity, feedback, and accessibility (tooltips, color, transitions)

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run locally:**
   ```bash
   npm run dev
   ```
3. **Run tests:**
   ```bash
   npx vitest
   ```

## 🌐 Deployment

- Deploy easily to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
- Make sure your `/public/candidates.json` and `/public/engineers.json` are present in the deployed app.

## 🧪 Testing

- Unit tests for slot availability logic are in `/src/components/__tests__/availability.test.ts`.
- Run with `npm run test`.

## 📸 Screenshots

_Add screenshots of the deployed app here after deployment._

## 📋 Submission

- [x] All core and senior features implemented
- [x] Clean, modern UI/UX
- [x] Unit tests passing
- [x] Deployed and screen-recorded as per instructions

## 👤 Author

- Shivansh Mahendru
- maheshiv.dev@gmail.com

---

_This project was built for my Speer coding front-end challenge.
