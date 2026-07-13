# 🐍 PyDuo — Learn Python & AI, Duolingo-Style!

> **Learn Python, Machine Learning, and Deep Learning interactively with Slythe, your friendly animated snake mentor!**

PyDuo is a gamified, interactive, and community-first full-stack learning platform designed to teach **Python, Machine Learning, and Deep Learning** in a fun, bite-sized format. Led by your charismatic animated snake mentor **Slythe**, the application makes coding engaging with visual progression, instant feedback, an animated mascot, and a powerful live coding playground.

---

# ✨ Core Features

## 🐍 Slythe — The Animated Mascot

- Animated SVG/Motion mascot that responds dynamically to your performance.
- Smiles when you write correct code.
- Looks curious during lessons.
- Cheers you on with helpful tips.
- No more boring, faceless tutorials!

---

## 🎮 Gamified Learning Path

- 📚 Progressive Modules
  - Learn step-by-step from Python basics to Deep Learning.

- ⭐ XP & Levels
  - Earn XP after every lesson and coding exercise.

- ❤️ Hearts & Daily Streaks
  - Maintain your learning streak.
  - Lose hearts on wrong submissions.
  - Refill hearts through practice.

- 🎯 Daily Quests
  - Complete special challenges to earn bonus XP and rewards.

---

## 💻 Code Darbar (Interactive Playground)

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

## 🧠 Slythe AI Mentor

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

## 📂 Capstone Projects & Live Verification

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

# 🛠️ Technical Architecture

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

# 🚀 Local Installation

## 1️⃣ Prerequisites

Install:

- Node.js v18 or higher

---

## 2️⃣ Clone or Extract

```bash
cd pyduo
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Configure Environment

Create a `.env` file in the project root.

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 5️⃣ Run Development Server

```bash
npm run dev
```

Open your browser:

```
http://localhost:3000
```

---

# 📦 Production Build

Build the application:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

---

# 📱 Build Android APK (Capacitor)

## Step 1 — Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
```

---

## Step 2 — Initialize Capacitor

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

## Step 3 — Install Android Platform

```bash
npm install @capacitor/android

npx cap add android
```

---

## Step 4 — Build & Sync

```bash
npm run build

npx cap sync
```

---

## Step 5 — Open Android Studio

```bash
npx cap open android
```

---

## Step 6 — Build APK

Inside Android Studio:

```
Build
    ↓
Build Bundle(s) / APK(s)
    ↓
Build APK(s)
```

When completed:

```
APK(s) generated successfully
```

Click:

```
Locate
```

Your APK will be available as:

```
app-debug.apk
```

Transfer it to your Android phone and install.

---


# 🌟 Highlights

- 🐍 Animated Snake Mentor
- 🎮 Duolingo-style Learning
- 🧠 AI Coding Mentor
- 💻 Browser Python Playground
- 🏆 XP, Levels & Streaks
- ❤️ Hearts System
- 🎯 Daily Quests
- 📂 Capstone Projects
- 📱 Android APK Support
- 🚀 Fast React + Vite Stack
- 🔒 Secure AI Backend

---

<div align="center">

# 🐍 Happy Coding with PyDuo!

**Developed with ❤️ for students worldwide.**

Practice daily.

Code beautifully.

Master Python.

⭐ If you like this project, don't forget to star the repository!

</div>