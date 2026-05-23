# 🎒 Aarambh Classes Hub - Interactive Primary Academy

A premium, interactive web application platform designed for **Class 1 to 5 students**, featuring live virtual classrooms, interactive student-teacher chats, homework trackers, online recorded lectures, integrated payment models, and our newly added **Aarambh Brain Playroom Challenge** (gamified study arena) with a **Daily Learning Streak** system and real-time **Teacher Scoreboards**.

---

## 🛠️ The Tech Stack

This platform is a **fully integrated hybrid (Full-stack) Application** engineered for high speed, custom responsiveness, and reliable server state synchronization:

### **Frontend Architecture**
- **Framework**: [React 19](https://react.dev/) using **Vite 6** as the fast-compiling bundler.
- **Styling Utility**: [Tailwind CSS v4](https://tailwindcss.com/) directly integrated via Vite with beautiful CSS-only layouts.
- **Interactions & Icons**: Premium animations powered by [Motion](https://motion.dev/) (from `motion/react`) and clean visual icons from [Lucide React](https://lucide.dev/).
- **Micro-State Engine**: Handcrafted modular state controllers managing local and dynamic playroom progress seamlessly.

### **Backend Service Architecture**
- **Server Engine**: [Express v4](https://expressjs.com/) built and run natively with **TypeScript Type-Stripping**.
- **Execution utilities**: Runs directly in development mode with `tsx` (TypeScript Execute).
- **Bundler Compiler**: [esbuild](https://esbuild.github.io/) for compiling server-side code into single, robust CJS file bundles (`dist/server.cjs`) for clean environment container executions.
- **API Interfaces**: Dedicated routes (`/api/*`) proxying data communication to hide core secrets and handle the classroom database efficiently.

---

## 💻 Local Environment Setup (Run in VS Code)

Follow these steps to download, setup, and run the Aarambh Classes ecosystem on your computer using **Visual Studio Code**:

### **1. Prerequisites**
Ensure you have the following installed on your local computer:
- [Node.js (LTS Version 18 or newer)](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/) (to push to GitHub)

### **2. Prepare Workspace Directory**
Select your target parent folder, open your terminal (Terminal inside VS Code or Command Prompt), and clone/create your folder:
```bash
# Clone or navigate into the directory
cd aarambh-classes-hub
```

### **3. Install Dependencies**
Install all essential packages specified in the `package.json`:
```bash
npm install
```

### **4. Configure Environment Variables**
Create `.env` file in the root directory to store sensitive integration secrets safely:
```env
# .env Example Configuration
NODE_ENV=development
PORT=3000
```

### **5. Command Scripts**
Configure your app's operation directly from VS Code terminal using standard scripts:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launch the Full-stack Express server using Vite middleware on port **3000**. |
| `npm run build` | Compiles the client-side SPA static assets and bundles `server.ts` into CJS output files. |
| `npm run start` | Boots up the production compilation output found under the `dist/` workspace folder. |
| `npm run lint` | Check syntax structure and make sure TypeScript builds with no errors. |

---

## 🐙 Step-by-Step GitHub Import & Push Guide

To push this completed program onto your personal GitHub repository, run the following sequential commands in your VS Code terminal:

### **Step A: Initialize Git Repository**
Initializes your project target folder with official tracking:
```bash
git init
```

### **Step B: Create Git Ignore File**
Create a `.gitignore` file in your root folder so hefty or generated compilation folders do not pollute GitHub:
```text
# .gitignore
node_modules/
dist/
.env
.dev.vars
*.log
.DS_Store
```

### **Step C: Stage and Commit the Code**
Stage your changes and write a descriptive commit log:
```bash
git add .
git commit -m "feat: integrate Aarambh Brain Playroom Challenge with class-level difficulty, streak tracking, and teacher leaderboard"
```

### **Step D: Link to GitHub and Push**
1. Go to your web browser and navigate to [GitHub](https://github.com/).
2. Click **New Repository**, enter your repository name (e.g., `aarambh-classes-hub`), and leave it empty (do NOT initialize with README).
3. Copy the Remote Repository URL and run:
```bash
# Set your main branch
git branch -M main

# Add your correct repository destination (replace user & repo name below)
git remote add origin https://github.com/YOUR_USERNAME/aarambh-classes-hub.git

# Securely push code to GitHub
git push -u origin main
```

---

## 🌟 Aarambh Playroom Games Included

The **Aarambh Cartoon Brain Playroom Arena** now features five gamified categories with Class 1 to 5 dynamic standard scaling:
1. ✏️ **Jumbled Letters**: Rearrange jumbled cartoon tiles using cute semantic context hints.
2. 🧮 **Math Quest**: Complete mental math arithmetic equations tailored to school curriculums.
3. 🖼️ **Object Matcher**: Identify beautiful illustrated emoji shapes and relate them to spelling labels.
4. ✍️ **Spelling Whiz**: Solve core grammatical and vocabulary-building spell checks.
5. 🧪 **Science Trivia**: Study EVS, biological details, weather structures, and ecosystems with live trivia prompts.

Your achievements update your **Daily Study Streak**, saving high score entries dynamically into the teacher statistics scoreboard dashboard instantly in real-time!

---

## 📸 Platform Screens & Feature Walkthrough

Organize your screenshots by saving them inside an `images/` folder inside your repository (e.g., `images/01_parent_dashboard.png`) to render them directly on your GitHub landing page. Below is the mapped index of your screens with descriptive titles:

### 1️⃣ **Parent Interface: Homework & Query Desk (Lower Dashboard)**
<img width="1467" height="992" alt="image" src="https://github.com/user-attachments/assets/145cb495-cc12-4d44-a0d2-d36e103e1275" />

### 2️⃣ **Parent Home Portal: Tuition Fee & Performance Overview**
<img width="1683" height="992" alt="image" src="https://github.com/user-attachments/assets/d2831a0d-ce3d-4bcc-81e6-de60069c6297" />

### 3️⃣ **Teacher-Student Real-time Chat Threads**
<img width="1557" height="960" alt="image" src="https://github.com/user-attachments/assets/b9965918-dfff-43fa-8616-56ca9fd36ecc" />

### 4️⃣ **Teacher Dashboard Controls (Lower Administration Control)**
<img width="1697" height="1009" alt="image" src="https://github.com/user-attachments/assets/aebc18d2-f9ad-423e-80f2-b39bfdaf168d" />

### 5️⃣ **Teacher Dashboard Overview (Upper Administration)**
<img width="1697" height="1009" alt="image" src="https://github.com/user-attachments/assets/7a95de00-4ab6-4665-9ca3-907f5dcb2feb" />

### 6️⃣ **Student Interactive Chat Room View**
<img width="1598" height="862" alt="image" src="https://github.com/user-attachments/assets/d62c2345-a7c8-4b37-bcde-9ac1918cca57" />

### 7️⃣ **Aarambh Brain Playroom Challenge (The Game Arena)**
<img width="1639" height="988" alt="image" src="https://github.com/user-attachments/assets/fb84feba-7aa7-4334-99ef-13e3c1a3e6e5" />

### 8️⃣ **Interactive Student Dashboard Homepage**
<img width="1447" height="993" alt="image" src="https://github.com/user-attachments/assets/0e9c01fc-5b4d-41b2-bfd1-71643268bafb" />

### 9️⃣ **Tuition Gate Login & Testimonial Feed**
<img width="1451" height="894" alt="image" src="https://github.com/user-attachments/assets/0a8e600f-8731-436a-8d92-4342572badd7" />

### 🔟 **Aarambh Classes Landing Page (Main Guest Menu)**
<img width="1822" height="994" alt="image" src="https://github.com/user-attachments/assets/312dc9ab-11b4-467f-bb9e-c745393483cb" />


