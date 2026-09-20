# Fex Scripts - Multi-Platform Script Generator

A powerful, AI-powered script generator for **Roblox**, **Minecraft**, and **Counter-Strike 2**. Generate complete, working scripts for executors, plugins, mods, and server configurations.

![Fex Scripts](https://img.shields.io/badge/Fex_Scripts-v3.0-purple?style=for-the-badge)
![Platforms](https://img.shields.io/badge/Platforms-Roblox%20%7C%20Minecraft%20%7C%20CS2-blue?style=for-the-badge)

## 🎮 Supported Platforms

### 🎮 Roblox
Generate Lua scripts for executors like Synapse X, Script-Ware, KRNL, Fluxus, Hydrogen, and Delta.

**Categories:**
- ⚡ **Fex Scripts** - All-in-one mega scripts
- 👁️ **ESP / Visual** - Wallhacks, tracers, chams
- 🎯 **Aimbot** - Silent aim, lock-on, prediction
- 💨 **Movement** - Fly, speed, noclip, teleport
- ⚔️ **Combat** - Kill aura, auto parry, hitbox expander
- 🤖 **Auto Farm** - Auto collect, auto quest
- 🖥️ **GUI Scripts** - Custom UIs, script hubs
- 🔧 **Utility** - Server hop, anti-AFK, freecam
- 🎮 **Game Specific** - Blox Fruits, Arsenal, Pet Simulator, etc.

### ⛏️ Minecraft
Generate Java plugins, commands, data packs, mods, and server scripts.

**Categories:**
- 🔌 **Plugins** - Spigot/Bukkit plugins with custom commands
- ⌨️ **Commands** - Custom commands with cooldowns and permissions
- 📦 **Data Packs** - Custom recipes, loot tables, advancements
- 🛠️ **Mods** - Forge/Fabric mods with custom items and blocks
- 📜 **Scripts** - Skript/CommandBox scripts
- 🌍 **WorldEdit** - WorldEdit commands and scripts
- 💰 **Economy** - Shop systems, auction houses, custom currency
- 🎲 **Minigames** - BedWars, SkyWars, Spleef, Parkour

### 🔫 Counter-Strike 2
Generate SourceMod plugins, server configs, and workshop tools.

**Categories:**
- 🔌 **Plugins** - SourceMod plugins with custom commands
- ⚙️ **Configs** - Server configurations for competitive play
- 🗺️ **Map Scripts** - Map entity scripts and triggers
- 📦 **Workshop** - Workshop map setup and publishing
- ⌨️ **Autoexec** - Competitive autoexec configurations
- 🎯 **Training** - Aim training and practice scripts
- 🖥️ **Custom HUD** - HUD modifications and crosshair configs
- 👑 **Admin Tools** - Admin commands and player management

## 🚀 Features

### ✨ Core Features
- **Multi-Platform Support** - Generate scripts for Roblox, Minecraft, and CS2
- **Platform-Specific Categories** - Each platform has its own set of script categories
- **Quick Prompts** - Pre-built prompts for common script types
- **One-Click Copy** - Copy generated scripts instantly
- **Session Management** - Save and manage multiple script sessions
- **Drag & Drop** - Attach images and videos for context
- **Responsive Design** - Works on desktop and mobile

### 🎨 UI Features
- **Dark Theme** - Modern dark interface with purple accents
- **Platform Selector** - Easy switching between Roblox, Minecraft, and CS2
- **Category Browser** - Browse script categories for each platform
- **Animated Transitions** - Smooth animations and transitions
- **Code Highlighting** - Syntax-highlighted code blocks
- **Custom Logo** - Branded with the Fex Scripts logo

## 📖 How to Use

### 1. Select a Platform
Click on one of the platform buttons in the sidebar:
- 🎮 **Roblox** - For executor scripts
- ⛏️ **Minecraft** - For plugins, mods, and data packs
- 🔫 **CS2** - For SourceMod plugins and configs

### 2. Choose a Category
Select a script category from the list. Each platform has its own set of categories tailored to that game.

### 3. Describe Your Script
Type a description of what you want in the input box, or click one of the quick prompts.

### 4. Generate
Click the **Generate** button or press Enter. The script will be generated with a streaming animation.

### 5. Copy and Use
Click the **Copy Script** button in the code block to copy the generated script. Paste it into your executor, plugin folder, or server config.

## 💡 Example Prompts

### Roblox
- "Full Fex script with ESP, Aimbot, Fly, Speed, and Kill Aura"
- "Player ESP with boxes, names, health bars, and distance"
- "Silent aim that works with any gun script"
- "Fly script with toggle key (E) and speed control"
- "Blox Fruits auto farm with fruit snipe"

### Minecraft
- "Spigot plugin with custom commands and permissions"
- "Custom teleport command with cooldown"
- "Custom recipe datapack"
- "Forge mod with custom items and blocks"
- "Skript for custom shop system"
- "BedWars-style minigame"

### CS2
- "SourceMod plugin with custom commands"
- "Server config for competitive play"
- "Autoexec for competitive settings"
- "Aim training map script"
- "Custom HUD with player stats"
- "Admin slap/slay commands"

## 🛠️ Technical Details

### Tech Stack
- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **Local Generation** - No API keys required

### Script Templates
The app uses pre-built script templates for each platform and category. Templates include:
- Complete, working code
- Proper error handling
- Usage instructions
- Setup guides
- Customization options

### Platform-Specific Features

#### Roblox
- Uses executor APIs: `getgenv()`, `hookfunction`, `loadstring`, `request`, etc.
- Includes anti-detection techniques
- GUI toggle systems
- Compatible with all major executors

#### Minecraft
- Java plugin templates with proper structure
- Bukkit/Spigot API usage
- Data pack JSON structures
- Forge/Fabric mod templates
- Skript syntax

#### CS2
- SourceMod plugin structure
- SourcePawn syntax
- Server config formats
- Hammer Editor entity logic
- Workshop publishing guides

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm

### Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Build Output
The built application is in the `dist/` folder and can be deployed to any static hosting service.

## 🔒 Privacy & Security

- **No API Keys Required** - All scripts are generated locally
- **No Data Collection** - Your prompts and sessions stay in your browser
- **Offline Capable** - Works without internet connection after initial load
- **Local Storage** - Sessions are stored in your browser's localStorage

## ⚠️ Disclaimer

This tool is for **educational purposes only**. The generated scripts are intended to demonstrate scripting techniques and should be used responsibly.

- Do not use scripts to cheat in competitive games
- Do not use scripts to harass other players
- Do not use scripts to violate game Terms of Service
- Use at your own risk

The developers are not responsible for any misuse of this tool or any consequences resulting from its use.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Add new script templates
- Improve the UI/UX
- Add support for more platforms

## 📄 License

MIT License - feel free to modify and distribute.

## 🎯 Roadmap

- [ ] Add more script templates for each platform
- [ ] Support for more games (Valorant, Apex Legends, etc.)
- [ ] Script preview and testing
- [ ] Export scripts as files
- [ ] Script sharing and community templates
- [ ] Advanced customization options

---

**Made with 💜 for the gaming community**

**Platforms:** Roblox | Minecraft | Counter-Strike 2
