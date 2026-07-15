# ðŸ PyDuo â€” Learn Python & AI, Duolingo-Style!

> **Learn Python, Machine Learning, and Deep Learning interactively with Slythe, your friendly animated snake mentor!**

PyDuo is a gamified, interactive, and community-first full-stack learning platform designed to teach **Python, Machine Learning, and Deep Learning** in a fun, bite-sized format. Led by your charismatic animated snake mentor **Slythe**, the application makes coding engaging with visual progression, instant feedback, an animated mascot, and a powerful live coding playground.

---

# âœ¨ Core Features

## ðŸ Slythe â€” The Animated Mascot

- Animated SVG/Motion mascot that responds dynamically to your performance.
- Smiles when you write correct code.
- Looks curious during lessons.
- Cheers you on with helpful tips.
- No more boring, faceless tutorials!

---

## ðŸŽ® Gamified Learning Path

- ðŸ“š Progressive Modules
  - Learn step-by-step from Python basics to Deep Learning.

- â­ XP & Levels
  - Earn XP after every lesson and coding exercise.

- â¤ï¸ Hearts & Daily Streaks
  - Maintain your learning streak.
  - Lose hearts on wrong submissions.
  - Refill hearts through practice.

- ðŸŽ¯ Daily Quests
  - Complete special challenges to earn bonus XP and rewards.

---

## ðŸ’» Code Darbar (Interactive Playground)

Practice Python directly inside your browser.

### Features

- Powered by **Pyodide (WebAssembly)**
- No installation required
- Real Python execution
- Ready-made templates

Templates include:

- Hello World
- Loops
- Functions
- Fibonacci
- Pattern Printing

---

## ðŸ§  Slythe AI Mentor

Need help?

Chat with Slythe anytime.

He can:

- Explain Python concepts
- Fix syntax errors
- Find logical bugs
- Optimize your code
- Explain code line-by-line

Quick buttons include:

- Explain Code
- Find Bug
- Optimize
- Simplify Logic

---

## ðŸ“‚ Capstone Projects & Live Verification

Build real-world projects like:

- Calculator
- Budget Planner
- Array Utilities
- Data Processing Scripts

Every project includes:

- Automatic Tests
- Instant Feedback
- Assertion-based Verification

---

# ðŸ› ï¸ Technical Architecture

## Frontend

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Monaco Editor

---

## Backend

- Node.js
- Express.js
- ES Modules
- Pyodide Integration
- Secure API Proxy
- Production Static Server

---

# ðŸš€ Local Installation

## 1ï¸âƒ£ Prerequisites

Install:

- Node.js v18 or higher

---

## 2ï¸âƒ£ Clone or Extract

```bash
cd pyduo
```

---

## 3ï¸âƒ£ Install Dependencies

```bash
npm install
```

---

## 4ï¸âƒ£ Configure Environment

Create a `.env` file in the project root.

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 5ï¸âƒ£ Run Development Server

```bash
npm run dev
```

Open your browser:

```
http://localhost:3000
```

---

# ðŸ“¦ Production Build

Build the application:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

---

# ðŸ“± Android APK Download

**Latest Release (v1.0.0):**  
📥 **[Download app-release.apk](https://github.com/Hamza-Learner/PyDuo/releases/download/v1.0.0/app-release.apk)**  
*(Signed release APK — ready to install on any Android device. Enable "Install unknown apps" if prompted.)*

---

# ðŸ“± Build Android APK (Capacitor) — For Developers

## Step 1 â€” Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
```

---

## Step 2 â€” Initialize Capacitor

```bash
npx cap init
```

Example:

App Name:
```
PyDuo
```

App ID:
```
com.learning.pyduo
```

Set:
```
webDir = dist
```

---

## Step 3 â€” Install Android Platform

```bash
npm install @capacitor/android
npx cap add android
```

---

## Step 4 â€” Build & Sync

```bash
npm run build
npx cap sync
```

---

## Step 5 â€” Open Android Studio

```bash
npx cap open android
```

---

## Step 6 â€” Build Signed Release APK

1. In Android Studio: **Build → Generate Signed Bundle / APK → APK → Release**  
2. Select your keystore (or create one).  
3. Output: `android/app/build/outputs/apk/release/app-release.apk`

---

## Automated Release (CI)

This repo uses GitHub Actions to build & publish a signed APK on every tag push (`v*.*.*`).  
See the **Releases** page for all downloadable APKs:

🔗 https://github.com/Hamza-Learner/PyDuo/releases

---


# ðŸŒŸ Highlights

- ðŸ Animated Snake Mentor
- ðŸŽ® Duolingo-style Learning
- ðŸ§  AI Coding Mentor
- ðŸ’» Browser Python Playground
- ðŸ† XP, Levels & Streaks
- â¤ï¸ Hearts System
- ðŸŽ¯ Daily Quests
- ðŸ“‚ Capstone Projects
- ðŸ“± Android APK Support
- ðŸš€ Fast React + Vite Stack
- ðŸ”’ Secure AI Backend

---

<div align="center">

# ðŸ Happy Coding with PyDuo!

**Developed with â¤ï¸ for students worldwide.**

Practice daily.

Code beautifully.

Master Python.

â­ If you like this project, don't forget to star the repository!


