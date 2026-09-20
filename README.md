# LuaForge — Roblox Executor Script Generator

A modern, AI-powered Lua script generator specifically designed for Roblox executors (Synapse X, Script-Ware, KRNL, Fluxus, Hydrogen, Delta, etc.).

![LuaForge](https://img.shields.io/badge/LuaForge-v2.0-purple?style=for-the-badge)
![Executor Scripts](https://img.shields.io/badge/Executor-Ready-a855f7?style=for-the-badge)

## 🎯 Features

### Script Categories
- **ESP / Visual** 👁️ — Wallhacks, tracers, chams, item ESP
- **Aimbot** 🎯 — Silent aim, lock-on, prediction, FOV circles
- **Movement** 💨 — Fly, speed, noclip, teleport, infinite jump
- **Combat** ⚔️ — Kill aura, auto parry, hitbox expander
- **Auto Farm** 🤖 — Auto collect, auto quest, auto click
- **GUI Scripts** 🖥️ — Custom UIs, script hubs, key systems
- **Utility** 🔧 — Server hop, anti-AFK, freecam, rejoin
- **Game Specific** 🎮 — Blox Fruits, Arsenal, Pet Simulator, etc.

### Technical Features
- ✅ Complete, working executor scripts
- ✅ Uses executor APIs: `getgenv()`, `hookfunction`, `loadstring`, `request`, etc.
- ✅ Self-contained scripts ready to paste
- ✅ Error handling with `pcall`
- ✅ GUI toggle systems
- ✅ Anti-detection techniques
- ✅ Copy-to-clipboard functionality
- ✅ Drag & drop image/video support
- ✅ Streaming AI responses
- ✅ Session persistence
- ✅ Mobile responsive design

## 🚀 Getting Started

### Prerequisites
1. An OpenRouter API key (or compatible OpenAI API)
2. A Roblox executor (Synapse X, Script-Ware, KRNL, Fluxus, etc.)

### Setup
1. Open the application in your browser
2. Click the **Settings** button (gear icon)
3. Enter your API credentials:
   - **API Endpoint**: `https://openrouter.ai/api/v1` (default)
   - **API Key**: Your OpenRouter API key
   - **Model**: `openai/gpt-4o-mini` (default) or any compatible model
4. Click **Save Changes**

### Usage
1. **Select a category** from the sidebar (ESP, Aimbot, Movement, etc.)
2. **Click "New Script"** or use a quick prompt
3. **Describe what you want** in the input box
4. **Press Enter** or click **Generate**
5. **Copy the script** using the copy button in the code block
6. **Paste into your executor** and execute

## 📝 Example Prompts

### ESP
- "Player ESP with boxes, names, health bars, and distance"
- "Item ESP that highlights valuable items through walls"
- "Chams ESP with rainbow outline effect"

### Aimbot
- "Silent aim that works with any gun script"
- "Lock-on aimbot with prediction and FOV circle"
- "Aimbot with team check and visibility check"

### Movement
- "Fly script with toggle key (E) and speed control"
- "Speed hack with adjustable walkspeed"
- "Noclip that goes through all parts"

### Combat
- "Kill aura that hits all nearby players"
- "Auto parry that blocks every attack"
- "Hitbox expander for melee weapons"

### Auto Farm
- "Auto farm script with GUI toggle"
- "Auto collect all items on the map"
- "Auto quest completer"

### Game Specific
- "Blox Fruits auto farm with fruit snipe"
- "Arsenal aimbot + ESP combo"
- "Pet Simulator X auto hatch and farm"

## 🎨 UI Features

### Modern Design
- Dark theme with purple/fuchsia gradients
- Glassmorphism effects
- Smooth animations
- Responsive layout (mobile-friendly)
- Syntax-highlighted code blocks
- One-click copy functionality

### Sidebar
- Script category selector
- Recent scripts history
- Quick access to all features

### Code Blocks
- macOS-style window controls
- Language indicator
- "Executor Script" badge
- Copy button with feedback
- Scrollable for long scripts

## 🔧 Technical Details

### System Prompt
The AI is configured to generate executor-specific scripts using:
- `getgenv()` for persistent variables
- `getrenv()` for game environment access
- `hookfunction` for function hooking
- `loadstring` for dynamic code execution
- `request` for HTTP requests
- `getgc()` for garbage collection access
- `getinstances()` for instance enumeration
- `fireclickdetector()` for detector firing
- `fireserver()` for remote event firing

### Supported Executors
- ✅ Synapse X
- ✅ Script-Ware
- ✅ KRNL
- ✅ Fluxus
- ✅ Hydrogen
- ✅ Delta
- ✅ Any executor with standard Lua environment

## 🛠️ Development

### Tech Stack
- React 18
- TypeScript
- Tailwind CSS v4
- Vite
- OpenAI-compatible API

### Project Structure
```
src/
├── App.tsx          # Main application component
├── types.ts         # TypeScript type definitions
├── utils.ts         # Utility functions & constants
├── index.css        # Global styles
└── main.tsx         # Entry point
```

### Build
```bash
npm install
npm run build
```

### Development
```bash
npm run dev
```

## ⚠️ Disclaimer

This tool is for **educational purposes only**. The generated scripts are intended to demonstrate scripting techniques and should be used responsibly. 

- Do not use scripts to cheat in competitive games
- Do not use scripts to harass other players
- Do not use scripts to violate Roblox Terms of Service
- Use at your own risk

The developers are not responsible for any misuse of this tool or any consequences resulting from its use.

## 📄 License

MIT License - feel free to modify and distribute.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Improve the UI/UX
- Add new script categories

---

**Made with 💜 for the Roblox scripting community**
