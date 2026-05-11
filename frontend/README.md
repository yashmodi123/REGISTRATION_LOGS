# Device Login Admin — Frontend

The administrative dashboard for managing device registrations. Built with **Angular 21** and **Angular Material**.

## 📋 Prerequisites
- **Node.js**: v18.x or higher
- **Angular CLI**: `npm install -g @angular/cli`

## ⚙️ Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configuration**:
   The API URL is configured in `src/environments/environment.ts`. By default, it uses `/api` (relative path) to work seamlessly when hosted by the backend.

3. **Development Server**:
   Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## 🏗️ Production Build & Deployment
To deploy the frontend to the backend server:

1. **Build the project**:
   ```bash
   npm run build
   ```
   This generates optimized files in `dist/admin-portal/browser/`.

2. **Deploy to Backend**:
   Copy all files from `dist/admin-portal/browser/` into the `Backend/public/` folder.
   
   **One-Liner (Windows PowerShell):**
   ```powershell
   npm run build; xcopy /E /I /Y dist\admin-portal\browser\* ..\Backend\public\
   ```

## 🎨 UI & Theming
- **Material Design**: Uses Angular Material components for all UI elements.
- **Custom Theme**: Global styles and colors are defined in `src/styles.scss` using CSS variables. You can change the `--color-primary` and other variables to re-theme the entire application.
