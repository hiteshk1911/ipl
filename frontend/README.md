# IPL Matchup Intelligence – Frontend

This is the **mobile and web app** for the IPL Analytics project. It lets you search batters and bowlers, view batter profiles, compare matchups, and see head-to-head stats. The app is built with **Expo** (React Native) and works on iOS, Android, and in the browser.

This guide walks you through setting up and running the frontend from scratch.

---

## What You Need First

- **Node.js** (version 18 or 20 recommended). This also gives you **npm**.
- **A code editor** (e.g. VS Code or Cursor).
- **The backend API running** (see the main project README). The app needs the API to load data.

---

## Step 1: Install Node.js

If you don’t have Node.js:

1. Go to [https://nodejs.org](https://nodejs.org).
2. Download the **LTS** version.
3. Run the installer and follow the steps.
4. Open a **new** terminal and check:

   ```bash
   node --version
   npm --version
   ```

   You should see version numbers (e.g. `v20.x.x` and `10.x.x`).

---

## Step 2: Open the Frontend Folder

In your terminal, go to the project folder and then into `frontend`:

```bash
cd path/to/ipl
cd frontend
```

Replace `path/to/ipl` with the real path to your IPL project (e.g. `~/Developer/projects/ipl`).

---

## Step 3: Install Dependencies

The app uses npm packages (React, Expo, etc.). Install them once:

```bash
npm install
```

This can take a minute. When it finishes, you should see a `node_modules` folder (you can ignore its contents).

---

## Step 4: Configure the API URL (Optional)

The app talks to the **IPL Analytics API**. By default it uses:

- **Web / iOS simulator:** `http://localhost:8000`
- **Android emulator:** it automatically uses `http://10.0.2.2:8000` (emulator’s way to reach your machine)

If your API runs somewhere else (different port or URL):

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and set the API URL:
   ```
   EXPO_PUBLIC_API_URL=http://your-api-url:8000
   ```
   (No trailing slash.)

If the API is on `localhost:8000`, you can skip this step.

---

## Step 5: Start the App

Run:

```bash
npm start
```

(or `npx expo start`)

A development server starts and a **Expo Dev Tools** page may open in your browser. You’ll see a QR code and some shortcuts in the terminal.

---

## How to Run the App

### In the browser (easiest)

1. With `npm start` running, press **`w`** in the terminal, or  
2. Open [http://localhost:8081](http://localhost:8081) (or the URL shown in the terminal).

The app runs as a web app. Make sure the **backend API** is running on `http://localhost:8000` (or the URL you set in `.env`).

### On your phone (Expo Go)

1. Install **Expo Go** from the App Store (iOS) or Play Store (Android).
2. With `npm start` running, scan the **QR code** from the terminal with your phone camera (iOS) or with the Expo Go app (Android).
3. Your phone and computer must be on the **same Wi‑Fi**.
4. If the API is on your computer, use your computer’s **local IP** in `.env` (e.g. `EXPO_PUBLIC_API_URL=http://192.168.1.5:8000`) so the phone can reach it.

### iOS simulator (Mac only)

1. Install Xcode from the Mac App Store (if needed).
2. With `npm start` running, press **`i`** in the terminal to open the iOS simulator and load the app.

### Android emulator

1. Install [Android Studio](https://developer.android.com/studio) and set up an Android Virtual Device (AVD).
2. Start the emulator, then run `npm start` and press **`a`** in the terminal to open the app in the emulator.
3. The app is already configured to use `10.0.2.2:8000` for the API when running on Android emulator, so the backend on your machine will work.

---

## Project Structure (Quick Overview)

- **`app/`** – Screens and routing (Expo Router).
- **`src/`** – Main app code:
  - **`features/`** – Screens and flows (matchup, batter profile, compare matchups, match context).
  - **`data/`** – API client and services.
  - **`domain/hooks/`** – React hooks for data (matchup, batters, seasons, etc.).
  - **`core/`** – Config, theme, and shared utilities.
- **`components/`** – Reusable UI (buttons, cards, inputs, layout).

---

## Troubleshooting

- **“Network request failed” or no data**
  - Ensure the **backend API** is running (see the main project README).
  - On **Android emulator**, the app uses `10.0.2.2:8000` by default; no change needed if the API is on your machine.
  - On **physical device**, set `EXPO_PUBLIC_API_URL` in `.env` to your computer’s IP (e.g. `http://192.168.1.5:8000`).

- **`npm start` fails or “command not found”**
  - Run `npm install` again from the `frontend` folder.
  - Confirm Node.js is installed: `node --version` and `npm --version`.

- **QR code / Expo Go doesn’t connect**
  - Check that phone and computer are on the same Wi‑Fi.
  - Try starting with: `npx expo start --tunnel` (slower but often works across networks).

- **Port already in use**
  - Another app may be using the same port. Stop it or run: `npx expo start --port 8082` (or another free port).

---

## Scripts Reference

| Command           | What it does                          |
|------------------|----------------------------------------|
| `npm start`      | Start the dev server (Expo)            |
| `npm run android` | Run on Android (device/emulator)     |
| `npm run ios`    | Run on iOS simulator (Mac only)       |
| `npm run web`    | Start and open in browser              |

---

For backend setup, API, and data ingestion, see the main **README.md** in the project root.
