# TaskSync

**The easiest way for freelancers to manage their tasks and client communication in one place.**

---

## Overview

Freelancers often juggle multiple apps—one for chatting with clients, another for tracking tasks, and yet another for project updates. This fragmented workflow leads to lost context, missed deadlines, and unnecessary stress.

**TaskSync** solves this by combining a real-time chat application with a powerful Kanban-based task management tool. Now, you can discuss project details with your client and instantly turn any chat message into a task—no more switching tabs or losing track of action items.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Usage](#usage)
  
---

## Features

- **Unified Chat & Task Management:** Chat with clients and manage tasks in one seamless interface.
- **Kanban Board:** Visualize tasks across customizable columns (To Do, In Progress, Done) with real-time updates.
- **Message-to-Task:** Instantly create a task from any client message—no copy-paste needed.
- **Real-Time Collaboration:** All updates sync live using Socket.io, so everyone stays on the same page.
- **Drag & Drop:** Effortlessly move tasks between columns using DnD Kit.
- **Modern UI:** Built with DaisyUI and Tailwind CSS for a clean, responsive design.
- **Secure & Scalable:** Authentication via JWT; file uploads powered by Multer.
- 
---

## Tech Stack

| Technology    | Purpose                        |
|---------------|-------------------------------|
| MongoDB       | Database                      |
| Express.js    | Backend API                   |
| React         | Frontend UI                   |
| Node.js       | Backend runtime               |
| JWT           | Authentication                |
| Socket.io     | Real-time updates             |
| Multer        | File uploads                  |
| DaisyUI       | UI components (Tailwind-based)|
| DnD Kit       | Kanban board drag & drop      |
| Tailwind CSS  | Styling                       |

---

## Usage

- **Chat:** Start a conversation with your client directly in the app.
- **Create Tasks:**
  - Use the task panel to manually add tasks, or
  - Select any message in the chat and convert it into a task with one click.
- **Track Progress:**
  - Move tasks across the Kanban board using drag and drop.
  - All changes are updated in real time for all participants.
- **File Sharing:**
  - Upload and share files relevant to tasks or conversations.

---
