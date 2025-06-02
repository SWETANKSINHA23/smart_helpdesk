smart helpdesk with Agentic Triage
This is an end-to-end web application for a smart helpdesk, built to demonstrate an agentic workflow that automates the triage of support tickets. Users can create tickets, and an AI coworker intelligently classifies them, suggests replies, and either resolves them automatically or assigns them to a human agent.

Core Features
Authentication & Roles: Secure user registration and login with JWTs, implementing role-based access for Admin, Agent, and User.

Ticket Lifecycle: Users can create tickets and view their status. The system manages the full ticket lifecycle from open to resolved.

Agentic Triage: An autonomous workflow that processes new tickets in the background.

KB Management (Admin): Admins have full CRUD control over knowledge-base articles.

Agent Review: Support agents can review AI-generated suggestions, edit the draft reply, and manually resolve tickets.

Audit Logging: Every step of the agent's triage process is logged with a unique traceId and timestamp, providing a transparent audit trail.

Responsive UI: The frontend is designed to be simple, fast, and accessible on both desktop and mobile devices.

Tech Stack
This project was built using the MERN-only approach (Track A).

Frontend: React, React Router, Vite, Bootstrap

Backend: Node.js, Express.js, Mongoose

Database: MongoDB

Containerization: Docker, Docker Compose

Project Architecture
I chose the MERN-only track to maintain a cohesive technology stack and simplify the deployment process. The application architecture is cleanly separated into three main services orchestrated by Docker Compose:

Client: The React frontend, served by an Nginx container.

API: The Node.js/Express backend, which serves as the central orchestrator and persistence layer.

Mongo: A MongoDB database for all data storage.

A key design decision was to implement the agentic triage as a non-blocking, asynchronous process using a simple in-memory queue. This allows the API to respond instantly to a user creating a ticket, while the triage work is handled in the background.

How the Agentic Workflow Works
My agentic workflow is a deterministic, rule-based system that operates on each new ticket. It follows a hardcoded, sequential plan to ensure reliability and predictability.

Plan: On a new ticket, the system triggers a series of steps: Classify → Retrieve KB → Draft Reply → Decide.

Classify: The LLMProvider (my deterministic stub) classifies the ticket into categories (billing, tech, shipping, other) based on keywords in the description. It generates a pseudo-confidence score.

Retrieve KB: The system performs a keyword search against the knowledge-base and retrieves the top 3 relevant articles.

Draft Reply: A templated reply is generated using the ticket's description and the titles of the retrieved KB articles.

Decision: The system checks if autoCloseEnabled is true and if the confidence score is above the confidenceThreshold.

If conditions are met, the ticket status is updated to resolved, an AI reply is appended, and an AUTO_CLOSED event is logged.

Otherwise, the ticket is assigned to a human agent, and the status is changed to waiting_human.

Logging: Every action, from TICKET_CREATED to AUTO_CLOSED, is logged to an immutable AuditLog with a consistent traceId.

Getting Started
Follow these steps to get the application up and running locally.

Prerequisites
Docker Desktop installed and running.

A terminal (PowerShell, Command Prompt, or WSL on Windows).

1. Clone the Repository
git clone https://github.com/SWETANKSINHA23/smart_helpdesk.git
cd smart_helpdesk

2. Run the Application
From the root directory of the project (where docker-compose.yml is located), run a single command.

docker compose up --build

3. Seed the Database
Open a new terminal window and navigate to the backend directory (smart-helpdesk-server).

cd Smart-HelpDesk-server
node seed.js

This script will populate the database with an admin, an agent, and a user, as well as some initial KB articles and tickets.

4. Access the App
Open your web browser and navigate to:
http://localhost:3000
