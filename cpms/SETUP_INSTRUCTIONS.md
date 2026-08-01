# Project Setup Instructions

This document outlines the steps required to set up and run the CPMS project on a new machine.

## 1. Prerequisites to Download & Install

Before transferring the project, ensure you have the following installed on your new laptop:

1. **Node.js**: The project uses Node v20+. Download and install it from [nodejs.org](https://nodejs.org/).
2. **pnpm**: The package manager used for this monorepo is `pnpm` (version 9.0.0+). 
   - After installing Node.js, you can install pnpm globally by opening your terminal (Command Prompt/PowerShell) and running:
     ```bash
     npm install -g pnpm
     ```
3. **Expo Go (for Mobile App)**: If you plan to test the mobile application on your physical phone, download the **Expo Go** app from the App Store (iOS) or Google Play Store (Android).
4. **Code Editor**: We recommend [Visual Studio Code (VS Code)](https://code.visualstudio.com/).

## 2. Setting Up the Project

Once you have transferred the project files to your new laptop, follow these steps:

1. **Open the project in VS Code**: Open the `cpms` folder in VS Code.
2. **Open the terminal**: Open a new terminal within VS Code (Terminal > New Terminal).
3. **Install Dependencies**: Run the following command to install all required packages:
   ```bash
   pnpm install
   ```
4. **Set Up the Database**: This project uses Prisma. Run the following commands to generate the Prisma client and push the schema to your local SQLite database (or whichever database is configured in your `.env` file):
   ```bash
   pnpm db:push
   pnpm db:generate
   ```

## 3. Running the Project

To start the development servers (which will start both the web and mobile apps simultaneously):

```bash
pnpm dev
```

- **Web App**: Open [http://localhost:3000](http://localhost:3000) in your browser.
- **Mobile App**: The terminal will display a QR code. Open the **Expo Go** app on your phone and scan the QR code to run the mobile app.

---

### Note on Transferring Files
When copying this project to a USB drive or sending it to yourself, you do NOT need to copy the `node_modules`, `.next`, `.expo`, or `.turbo` folders, as they are very large and will be regenerated when you run `pnpm install` and `pnpm dev` on the new laptop. 
We have provided a script `prepare-transfer.ps1` to help you create a clean, zipped version of the project for easy transfer.
