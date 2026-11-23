# Jobmatcher 

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
# Jobmatcher — AI Career & Application Pipeline Tracker (React)

A visual Kanban application tracker built with **React** and **Vite** for the **Jobmatcher** team project. It helps job seekers—especially newcomers in Sweden—organize their job applications across every stage of the hiring pipeline.

## Key Features

- **5-Stage Visual Kanban Board:** Organize job applications across **Saved**, **Applied**, **Interview**, **Offer**, and **Rejected**.
- **Drag & Drop Workflow:** Smoothly move job cards between pipeline stages.
- **Smart 7-Day Follow-Up Alerts:** Automatically highlights applications that have stayed in the *Applied* column for 7 or more days.
- **Instant Search & Filtering:** Filter cards in real time by company name or job role.
- **Add New Applications:** Clean modal form to add custom job cards with AI match scores and notes.
- **Persistent Storage & Mobile Responsive:** Saves board state automatically in `localStorage` and adapts cleanly to mobile screens.

## Tech Stack

- **React** (Hooks: `useState`, `useEffect`)
- **Vite**
- **CSS3** (Custom dark theme & responsive grid layout)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com
   cd jobmatcher-react
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Author

Developed by **Marina Silakova** (Team Green — Jobmatcher Project).
