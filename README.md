# InterviewAI — Frontend

> AI-powered interview preparation platform with real-time LLM feedback, built with TypeScript and React for end-to-end interview simulation.
>
> ## Overview
>
> InterviewAI is a full-stack interview preparation platform that uses OpenAI's LLM APIs and LangChain to simulate realistic technical and behavioural interviews. The frontend delivers a smooth, real-time conversation experience with instant AI feedback on answers, code quality, and communication skills.
>
> This repository contains the **React/TypeScript frontend**. The Electron.js desktop app wrapper lives in [InterviewAI-desktop](https://github.com/vikramsaharan72056/InterviewAI-desktop).
>
> ## Tech Stack
>
> | Layer | Technologies |
> |-------|-------------|
> | **Frontend** | React, TypeScript |
> | **AI Integration** | OpenAI API, LangChain |
> | **Desktop** | Electron.js |
> | **State Management** | Context API / Zustand |
> | **Styling** | CSS Modules / Tailwind |
>
> ## Key Features
>
> - **Real-Time LLM Feedback** — AI evaluates answers in real time with structured, actionable feedback
> - - **Interview Simulation** — Covers technical coding rounds, system design, and HR behavioural rounds
>   - - **Electron.js Desktop App** — Packaged as a cross-platform desktop application for offline use
>     - - **Session History** — Review past interview sessions with scores and improvement suggestions
>       - - **Multi-Domain Support** — Frontend, backend, system design, and soft-skills interview modes
>        
>         - ## Project Structure
>        
>         - ```
>           InterviewAI_frontend/
>           ├── app/              # Main application screens & routing
>           ├── components/       # Reusable UI components
>           ├── hooks/            # Custom React hooks
>           ├── utils/            # Utility functions
>           ├── constants/        # App-wide constants
>           ├── assets/           # Images, fonts, icons
>           └── config/           # Environment & app configuration
>           ```
>
> ## Getting Started
>
> ```bash
> # Install dependencies
> npm install
>
> # Start development server
> npm start
>
> # Build for production
> npm run build
> ```
>
> ## Related Repositories
>
> - [InterviewAI-desktop](https://github.com/vikramsaharan72056/InterviewAI-desktop) — Electron.js desktop wrapper
>
> - ## Author
>
> - **Vikram Singh** — [Portfolio](https://vikramsaharan72056.github.io/portfolio-new/) · [LinkedIn](https://www.linkedin.com/in/vikram-singh-saharan/)
