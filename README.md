# BeyondChats Full Stack Developer Assignment

A complete implementation of the assignment with Laravel backend, NodeJS automation script, and React frontend.

## Live Link
```
## 📁 Project Structure

beyondchats-assignment/
├── backend/ # Laravel PHP Backend (Phase 1)
├── node-script/ # NodeJS Automation Script (Phase 2)
├── frontend/ # React + Vite Frontend (Phase 3)
└── README.md # This file
```

```
## 📊 Architecture Diagram

User Browser
↓
React Frontend (Port: 3000)
↓
Laravel API Backend (Port: 8000)
├── CRUD Operations
├── Article Storage
└── Data Management
↓
NodeJS Script
├── Google Search
├── Web Scraping
├── AI Enhancement (OpenAI)
└── Content Update
↓
Database (MySQL/SQLite)
```
## 🔧 Setup Instructions

### Prerequisites

- PHP 8.0+
- Composer
- Node.js 16+
- MySQL/SQLite
- OpenAI API Key (for Phase 2)

### Backend Setup (Phase 1)

1. Navigate to backend directory:

cd backend

## Install dependencies

composer install
```
## Configure environment

cp .env.example .env
php artisan key:generate
```
```
## Update .env with database credentials

env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=beyondchats
DB_USERNAME=root
DB_PASSWORD=
```
## Run migrations

php artisan migrate

## Start server

php artisan serve --port=8000

## Initialize articles

Node Script Setup (Phase 2)
Navigate to node-script directory:

cd node-script

## Install dependencies

npm install
```
## Configure environment

cp .env.example .env
Add your OpenAI API key to .env
```
## Run the script

node index.js

Frontend Setup (Phase 3)

## Navigate to frontend directory

cd frontend

Install dependencies:

npm install
Start development server:

npm run dev
Open browser:
Visit <http://localhost:3000>
