# UniSphere - AI Mental Health Support Platform

This is the UniSphere application, an AI-powered mental health support platform featuring emotional chatbot, anonymous forum, and campus administration tools.

## Features

- 🤖 AI Emotional Chatbot
- 🌐 Anonymous Forum
- 📊 Dashboard Analytics
- 👑 Admin Panel
- 📢 Complaint System

## ScrollToTop Functionality

This application includes an automatic scroll-to-top feature that activates whenever users navigate between pages. The `ScrollToTop` component ensures a smooth user experience by automatically scrolling the page to the top when changing routes.

The `ScrollToTop` component is implemented as follows:
- Located at `src/components/common/ScrollToTop.jsx`
- Integrated at the root level in `src/App.jsx`
- Uses React Router's `useLocation` hook to detect route changes
- Automatically scrolls to the top of the page with smooth behavior

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
