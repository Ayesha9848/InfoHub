# InfoHub 
ByteXL InfoHub
A Single-Page Utility Hub
This repository contains the solution for the ByteXL Coding Challenge, "InfoHub." It is a single-page
application (SPA) consolidating three common utility modules into one clean, responsive interface.
🚀 Project Overview
The InfoHub application demonstrates front-end development (React) and the simulation of a robust
back-end architecture, focusing on modularity, asynchronous data handling, loading states, and
graceful error presentation.
Modules Included
1. Weather Information: Fetches (mocked) weather data for a specified city.
2. Currency Converter: Converts an amount in INR to USD or EUR (using mock exchange rates).
3. Motivational Quote Generator: Retrieves a random inspiring quote.
💡Architectural Note (Full-Stack Simulation)
Frontend: Built entirely in React using modern functional components and Hooks. The interface is
fully responsive and uses state to manage navigation (tabs).
Backend Simulation: The actual Node.js/Express backend required by the challenge is simulated
using asynchronous JavaScript functions ( fetchWeatherAPI , convertCurrencyAPI , etc.) within
InfoHub.jsx . These functions introduce artificial network latency ( setTimeout ) and implement
custom logic for structured responses and specific error handling, validating the front-end's
ability to communicate with real-world APIs.
🛠️Technology Stack
Frontend: React 18+
Styling: Tailwind CSS (loaded via CDN for a single-file environment)
Simulated Backend: JavaScript Promises / Async Functions
📦 File Structure
The entire application is contained within one file, adhering to the challenge's constraint for a selfcontained deliverable.
File Description
InfoHub.js
x
The complete, self-contained React application. Contains all components, state logic, and the
mock API functions.
README.md This file.
⚙️ How to Run Locally
Since this is a single, self-contained file, you can run it easily in any modern React development
environment (like one initialized with Vite or CRA).
1. Create a React Project:
npm create vite@latest infohub-challenge -- --template react
cd infohub-challenge
npm install
2. Replace App Content: Replace the entire content of the default src/App.jsx (or similarly named
primary file) with the code from the provided InfoHub.jsx .
3. Start the Server:
npm run dev
4. View the App: Open the URL displayed in your console (usually http://localhost:5173 ).
🖼️ Key Features Demonstrated
No Page Reloads: All module interactions are handled asynchronously.
Loading Indicators: Custom Loader SVG displays during API calls to manage perceived latency.
Graceful Error Display: API errors (e.g., entering 'ErrorCity' in the Weather module or invalid input
in the Converter) are caught and displayed in a clear, user-friendly error box.
Responsive Design: The layout is optimized for both mobile and desktop screen sizes using
