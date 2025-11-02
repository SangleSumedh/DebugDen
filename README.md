%%{init: {'flowchart': {'htmlLabels': false}}}%%
graph TD
    %% START NODE
    start(start) --> A1;

    %% SWIMLANES DEFINITION
    subgraph User
        A1[User opens the App] --> A2{Login / Sign Up};
        A2 --> D1;
        A3[Set Interests & Language] --> A4;
        A7[Participate in Timed Video Call] --> A8;
        A8 --> D2;
        A10[Provide Feedback & Rating] --> D3;
        A11[Choose Continue Matching / Exit] --> D4;
    end

    subgraph System
        D1{Auth Validated?};
        D1 -- No --> A2;
        D1 -- Yes --> A3;
        A4[Store Preferences & Activate Account] --> M1;
        M4[Display "Searching" State] --> M2;
        M5[Initiate Timed Video Call] --> V2;
        V3[Session Timer Ends] --> A8;
        A9[Collect & Store Feedback] --> A11;
        D4 -- Exit --> S1[Log User Out];
    end

    subgraph Matching Algorithm
        M1[Receive Preferences] --> M2;
        M2[Execute Matching Logic] --> D5{Match Found?};
        D5 -- No --> M4;
        D5 -- Yes --> V1;
    end

    subgraph Video Service
        V1[Establish Connection] --> M5;
        V2[Stream Video & Audio] --> V3;
    end

    %% DECISIONS AND FLOW

    %% User Action After Session
    D2{Continue Chat?};
    D2 -- Yes / Continue Chat --> A10;
    D2 -- No / Skip User --> A10;

    %% Session End Flow
    A10 --> A9;
    
    %% Repeat or Exit
    D4{Continue Matching?};
    D4 -- Continue --> M1;

    %% END NODE
    S1 --> end((stop));

    style start fill:#5cb85c,stroke:#3c763d
    style end fill:#d9534f,stroke:#a94442
    
    %% Connect the User/System activities after Session End
    A9 --> A11;







# 🐞 DebugDen — A Safe Haven for Stuck Devs and Code Sleuths

Welcome to **DebugDen**: Not your grandma’s Stack Overflow.  
It’s for devs, by devs, with an AI sidekick who works for snacks (and sometimes gives questionable advice).

- **Stuck?** Drop your bug — someone (or AI) might just save your day.  
- **Just watching?** Lurk all you want.  
- **In the mood to flex?** Write answers, climb the karma ladder 🪜.  

---

## 🌎 Live Site

👉 [**Visit DebugDen**](https://debug-den.vercel.app)

---

## 🚀 What Makes DebugDen Different?

- **Ask & Answer Freely**  
  Stack Overflow vibes without the “please read the docs first” police.  

- **Supercharged Search**  
  Find threads, solutions, or just weird code tangents in seconds.  

- **Dev-First UI**  
  Built with React, Tailwind, and dark mode for sensitive eyes.  

- **⚡ AI Sidekick (Now Live!)**  
  Stuck at 3AM? Tap the *AI Answer* button and let our bot give you a “Created by AI” response.  
  (Sometimes gold, sometimes chaos, always honest.)  

- **Live Feedback (Coming Soon...)**  
  Karma now, validation later.  

---

## 🧠 The Tech Under the Hood

| Layer    | Tech                                      |
| -------- | ----------------------------------------- |
| Frontend | React, Tailwind, React Router             |
| Backend  | Appwrite (swap in your own, YOLO)         |
| AI       | OpenRouter (GPT / Gemini) ⚡ (AI Answers!) |
| Hosting  | Vercel                                    |

---

## 🤔 Why OpenRouter Instead of Just Gemini?

- **Flexibility** → Route requests to GPT-3.5, GPT-4, or Gemini with one API.  
- **Budget-friendly** → Works with your student-level budget.  
- **No more lock-in** → If Gemini is down, GPT steps in.  

---

## 📦 Quickstart

```bash
# Clone this beast
git clone https://github.com/sanglesumedh/debugden.git
cd debugden

# Grab the goods
npm install

# Env setup
touch .env
# Add your Appwrite creds (endpoint, projectId, apiKey)
# Add your OpenRouter API key (for AI answers)

```
## 🗺️ Roadmap

DebugDen is just getting started. Here’s what’s cooking:

- [x] **Core Q&A System** — Ask, answer, and vote like a boss.  
- [x] **AI Sidekick (MVP)** — Auto-generate answers when humans are too slow.  
- [ ] **UI Overhaul** — Sleek, responsive, and dev-first design (coming soon 🔥).   
- [ ] **Instant Feedback** — Karma and notifications in real-time.  
- [ ] **Tag System & Search Upgrade** — Smarter categorization and discovery.  
- [ ] **Community Features** — Profiles, badges, and leaderboards.  
- [ ] **Mobile-First Experience** — Smooth debugging even on the toilet.  
- [ ] **Open Source Contributions** — Issues, PRs, and chaos welcome.

---
