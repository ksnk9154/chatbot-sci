# Sci-Fi Chatbot

A futuristic AI chatbot with stunning sci-fi styling, 4K clarity, and smooth animations built with React, TypeScript, and Motion.

## Features

- 🎨 Stunning sci-fi UI with glowing effects and particle animations
- ⚡ Smooth Motion animations
- 💬 Interactive chat interface with typing indicators
- 🎯 Clear and reset functionality
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the source code

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`

## Available Scripts

- `npm start` - Starts the development server
- `npm run dev` - Alternative command to start the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build locally

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Motion** - Smooth animations
- **Tailwind CSS 4.0** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/
│   ├── Message.tsx          # Individual message component
│   ├── TypingIndicator.tsx  # Animated typing indicator
│   └── ParticleBackground.tsx # Particle animation background
├── styles/
│   └── globals.css          # Global styles and Tailwind setup
├── App.tsx                  # Main application component
└── main.tsx                 # Application entry point
```

## Customization

You can customize the chatbot by:

- Modifying bot responses in `src/App.tsx` (`botResponses` array)
- Adjusting colors and animations in component files
- Changing particle count in `ParticleBackground.tsx`
- Updating styling in Tailwind classes

## License

MIT
