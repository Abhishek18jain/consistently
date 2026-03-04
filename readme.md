📖 Consistency Journal

A Journal-First Consistency & Behavior Analytics Platform

🧠 Project Overview

Consistency Journal is a journal-first productivity system that helps users understand and improve their personal consistency patterns.

Instead of traditional task managers, the system uses long-running journals ("Books") composed of daily structured pages ("Templates") to capture planning behavior. A rule-based Consistency Coach analyzes these entries to identify patterns, streak breaks, overload risks, and improvement suggestions.

The goal of the system is not only to track productivity but to explain why consistency breaks and guide better planning decisions.

🎯 Core Idea

Each user maintains Journal Books.

Each book contains daily pages created from templates such as:

To-Do Day

Grocery Day

Study Day

Work Day

Planning Day

Reflection Day (private)

These pages generate behavioral data used by the system to compute:

Completion percentage

Consistency streaks

Near-miss days

Monthly heatmaps

Behavioral trends

The Consistency Coach then provides explanations and suggestions based on this data.

✨ Key Features
📚 Journal System

Long-running Books (journals)

One Page per day

Pages generated from Templates

Swipe or navigate between pages

Add today's page using templates

🧩 Template System

Templates define the structure of a page.

Examples:

To-Do template

Grocery template

Study template

Work template

Planning template

Reflection template (private)

Templates include predefined fields and completion rules.

📊 Consistency Analytics

The system automatically calculates:

Daily completion percentage

70% success threshold

Near-miss detection

Monthly heatmap visualization

Long-term consistency score

Weekly trends

🔥 Streak Engine

Tracks behavioral streaks based on completion rules.

Features:

Current streak

Best streak

Break detection

Recovery tracking

🏅 Badge System

Milestones reward consistent behavior:

7-day streak

30-day streak

Perfect week

Recovery badge

Badges are private and shown in the user profile.

🤖 Consistency Coach

The Coach Console is a rule-based assistant that answers predefined questions such as:

Why did my streak break?

Am I at risk today?

What should I adjust tomorrow?

What are my weakest days?

The coach analyzes recent behavioral data and provides data-driven explanations and suggestions.

🔒 Private Reflection

Reflection pages are protected:

PIN-locked

Not included in analytics

Not visible to the Coach

Completely private

📈 Dashboard

The dashboard gives a quick overview of the user's current state:

Monthly heatmap

Current streak

Risk indicator

Today’s completion progress

Coach shortcut

Recent journals

📊 Profile Analytics

Profile provides deeper insights:

Multi-month heatmaps

Streak history

Consistency score

Badge gallery

Behavioral trends

🖥️ Application Screens

Landing Page

Login / Register

Dashboard

Journal Home

Book Viewer

Template Selection

Page Editor

Consistency Coach Console

Profile / Analytics

Reflection Lock Screen

Settings

⚙️ Tech Stack
Frontend

React (Vite)

Redux Toolkit

React Router

Axios

TailwindCSS

Recharts / Chart.js

Framer Motion

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

bcrypt

Development Tools

MongoDB Compass

Postman

GitHub

Render / Railway (deployment)

📁 Project Structure
journal-consistency-app
│
├── frontend
│   ├── src
│   │   ├── app
│   │   │   └── store.js
│   │   ├── features
│   │   │   ├── auth
│   │   │   ├── journal
│   │   │   ├── page
│   │   │   ├── coach
│   │   │   ├── analytics
│   │   │   └── settings
│   │   ├── pages
│   │   ├── components
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│
├── backend
│   ├── src
│   │   ├── models
│   │   │   ├── User.model.js
│   │   │   ├── Book.model.js
│   │   │   ├── Page.model.js
│   │   │   ├── Template.model.js
│   │   │   ├── DailyStats.model.js
│   │   │   ├── StreakEvent.model.js
│   │   │   └── Badge.model.js
│   │   ├── controllers
│   │   ├── routes
│   │   ├── services
│   │   ├── middlewares
│   │   └── utils
│
└── README.md
🗄️ Database Models

The system uses 7 main schemas:

Schema	Purpose
User	Authentication, settings, PIN
Book	Journal container
Page	Daily structured entry
Template	Template definitions
DailyStats	Aggregated daily metrics
StreakEvent	History of streak breaks
Badge	Achievement milestones
🧠 Core Logic Engines
Page Completion Engine

Calculates completion % based on template structure.

Daily Stats Builder

Updates daily analytics when a page changes.

Streak Engine

Tracks success days and streak breaks.

Rule:

completion ≥ 70% = success
completion < 70% = streak break
Badge Engine

Awards milestones automatically.

Heatmap Engine

Aggregates daily stats into monthly visual heatmaps.

Coach Engine

Generates insights from:

last 14 days of activity

near-miss frequency

workload trends

streak stability

🔐 Privacy Design

Reflection pages are completely isolated:

Not included in analytics

Not used by Coach

Stored privately

PIN protected

🚀 Future Improvements

Smart template suggestions

Behavioral prediction models

Weekly planning assistant

Mobile application

👨‍💻 Author
Abhishek Jain

Developed as a full-stack MERN project focused on behavioral analytics and consistency tracking.
