# Daily Motivational Quotes
Helps you to get that daily dose of motivation

A multi-platform mood-based quote generator using OpenAI.  
Includes:
- **Mobile app**: React Native + Expo
- **Web app**: React + Vite + Tailwind (PWA)
- **Backend**: Node.js/Express API proxy to OpenAI


## 🚀 Local Setup

### Backend
```bash
cd quote-server
cp .env.example .env
# Add your OpenAI key in .env
npm install
npm start

### Web
cd mood-quotes-web
cp .env.example .env
# Set VITE_API_BASE to your backend URL
npm install
npm run dev

### Mobile
cd mood-quotes-app
cp .env.example .env
# Set API_BASE to your backend URL
npm install
npx expo start

