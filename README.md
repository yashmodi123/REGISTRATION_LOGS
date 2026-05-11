# Device Login Admin Portal

A full-stack administrative system for managing device registrations and tracking usage/error logs. Built with **Node.js/Express**, **Sequelize (MSSQL/SQLite)**, and **Angular 21 (Material Design)**.

## 📁 Project Structure
- **/Backend**: Node.js API, Database Models, and Static Hosting.
- **/frontend**: Angular SPA for the Admin UI.

## 🚀 Quick Start (Production/Single Server)
If you want to run both the Frontend and Backend on the same server (Port 3000):

1. **Setup Backend**:
   - Go to `/Backend`, run `npm install`.
   - Configure your `.env` file (Database credentials, JWT secret).
   - Start backend: `npm run dev` (or `npm start`).

2. **Setup Frontend**:
   - Go to `/frontend`, run `npm install`.
   - Build for production: `npm run build`.
   - Copy files from `frontend/dist/admin-portal/browser/*` to `Backend/public/`.

3. **Access**:
   - Open `http://localhost:3000`.

---

## 🛠️ Individual Installation & Development
For detailed instructions on setting up each component, please refer to their respective READMEs:
- [Backend Setup](./Backend/README.md)
- [Frontend Setup](./frontend/README.md)
