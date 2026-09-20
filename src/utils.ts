import { Attachment, Platform } from './types';

export function readImage(file: File): Promise<Attachment> {
  return new Promise((res, rej) => {
    if (file.size > 20 * 1024 * 1024)
      return rej(new Error(file.name + ' is over 20 MB'));
    const r = new FileReader();
    r.onload = () =>
      res({
        kind: 'image',
        name: file.name,
        mediaType: file.type || 'image/png',
        dataUrl: r.result as string,
      });
    r.onerror = () => rej(new Error('Could not read ' + file.name));
    r.readAsDataURL(file);
  });
}

export function readVideo(file: File): Promise<Attachment> {
  return new Promise((res, rej) => {
    if (file.size > 20 * 1024 * 1024)
      return rej(new Error(file.name + ' is over 20 MB'));
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.muted = true;
    v.playsInline = true;
    const url = URL.createObjectURL(file);
    v.src = url;
    v.onloadedmetadata = () => {
      v.currentTime = Math.min(0.1, v.duration / 2);
    };
    v.onseeked = () => {
      const c = document.createElement('canvas');
      const scale = Math.min(1, 640 / (v.videoWidth || 640));
      c.width = (v.videoWidth || 640) * scale;
      c.height = (v.videoHeight || 360) * scale;
      c.getContext('2d')!.drawImage(v, 0, 0, c.width, c.height);
      const dataUrl = c.toDataURL('image/jpeg', 0.8);
      URL.revokeObjectURL(url);
      res({
        kind: 'video',
        name: file.name,
        mediaType: 'image/jpeg',
        dataUrl,
        durationSec: Math.round(v.duration || 0),
      });
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      rej(new Error('Could not read ' + file.name));
    };
  });
}

export const STORAGE_KEY = 'fexscripts.sessions.v2';

export const PLATFORMS = {
  roblox: { id: 'roblox' as Platform, name: 'Roblox', icon: '🎮', color: 'from-red-500 to-red-700' },
  minecraft: { id: 'minecraft' as Platform, name: 'Minecraft', icon: '⛏️', color: 'from-green-500 to-green-700' },
  cs2: { id: 'cs2' as Platform, name: 'CS2', icon: '🔫', color: 'from-orange-500 to-orange-700' },
};

export const SCRIPT_CATEGORIES = {
  roblox: [
    { id: 'fex', name: 'Fex Scripts', icon: '⚡', desc: 'All-in-one mega script' },
    { id: 'esp', name: 'ESP / Visual', icon: '👁️', desc: 'Wallhacks, tracers, chams' },
    { id: 'aimbot', name: 'Aimbot', icon: '🎯', desc: 'Silent aim, lock-on' },
    { id: 'movement', name: 'Movement', icon: '💨', desc: 'Fly, speed, noclip' },
    { id: 'combat', name: 'Combat', icon: '⚔️', desc: 'Kill aura, auto parry' },
    { id: 'autofarm', name: 'Auto Farm', icon: '🤖', desc: 'Auto collect, auto quest' },
    { id: 'gui', name: 'GUI Scripts', icon: '🖥️', desc: 'Custom UIs, script hubs' },
    { id: 'utility', name: 'Utility', icon: '🔧', desc: 'Server hop, anti-afk' },
    { id: 'game', name: 'Game Specific', icon: '🎮', desc: 'Blox Fruits, Arsenal, etc.' },
  ],
  minecraft: [
    { id: 'plugins', name: 'Plugins', icon: '🔌', desc: 'Spigot/Bukkit plugins' },
    { id: 'commands', name: 'Commands', icon: '⌨️', desc: 'Custom commands' },
    { id: 'datapacks', name: 'Data Packs', icon: '📦', desc: 'Custom datapacks' },
    { id: 'mods', name: 'Mods', icon: '🛠️', desc: 'Forge/Fabric mods' },
    { id: 'scripts', name: 'Scripts', icon: '📜', desc: 'Skript/CommandBox' },
    { id: 'worldedit', name: 'WorldEdit', icon: '🌍', desc: 'WorldEdit scripts' },
    { id: 'economy', name: 'Economy', icon: '💰', desc: 'Shop & economy systems' },
    { id: 'minigames', name: 'Minigames', icon: '🎲', desc: 'Custom minigames' },
  ],
  cs2: [
    { id: 'plugins', name: 'Plugins', icon: '🔌', desc: 'SourceMod plugins' },
    { id: 'configs', name: 'Configs', icon: '⚙️', desc: 'Server configs' },
    { id: 'maps', name: 'Map Scripts', icon: '🗺️', desc: 'Map entity scripts' },
    { id: 'workshop', name: 'Workshop', icon: '📦', desc: 'Workshop tools' },
    { id: 'autoexec', name: 'Autoexec', icon: '⌨️', desc: 'Autoexec scripts' },
    { id: 'training', name: 'Training', icon: '🎯', desc: 'Training scripts' },
    { id: 'hud', name: 'Custom HUD', icon: '🖥️', desc: 'HUD modifications' },
    { id: 'admin', name: 'Admin Tools', icon: '👑', desc: 'Admin commands' },
  ],
};

export const QUICK_PROMPTS: Record<string, Record<string, string[]>> = {
  roblox: {
    fex: [
      'Full Fex script with ESP, Aimbot, Fly, Speed, and Kill Aura',
      'Complete Fex hub with GUI, Auto Farm, Aimbot, and ESP combined',
      'Fex mega script: ESP + Aimbot + Movement + Combat + Auto Farm',
      'All-in-one Fex script with every feature and toggle GUI',
    ],
  esp: [
    'Player ESP with boxes, names, health bars, and distance',
    'Item ESP that highlights valuable items through walls',
    'Chams ESP with rainbow outline effect',
    'Tracers ESP with lines from screen to players',
  ],
  aimbot: [
    'Silent aim that works with any gun script',
    'Lock-on aimbot with prediction and FOV circle',
    'Aimbot with team check and visibility check',
    'Smooth aimbot with customizable FOV and smoothing',
  ],
  movement: [
    'Fly script with toggle key (E) and speed control',
    'Speed hack with adjustable walkspeed',
    'Noclip that goes through all parts',
    'Infinite jump with double jump',
    'TP to player with command system',
  ],
  combat: [
    'Kill aura that hits all nearby players',
    'Auto parry that blocks every attack',
    'Hitbox expander for melee weapons',
    'Reach extender for swords and guns',
  ],
  autofarm: [
    'Auto farm script with GUI toggle',
    'Auto collect all items on the map',
    'Auto quest completer',
    'Auto clicker with CPS control',
  ],
  gui: [
    'Modern script hub GUI with tabs and settings',
    'Key system GUI with clipboard copy',
    'Notification system GUI',
    'Custom draggable window GUI',
  ],
  utility: [
    'Server hop to lowest ping server',
    'Anti-AFK script that prevents kicks',
    'Rejoin same server script',
    'Freecam with smooth controls',
  ],
    game: [
      'Blox Fruits auto farm with fruit snipe',
      'Arsenal aimbot + ESP combo',
      'Pet Simulator X auto hatch and farm',
      'Murder Mystery 2 ESP for all roles',
    ],
  },
  minecraft: {
    plugins: [
      'Spigot plugin with custom commands and permissions',
      'Bukkit plugin with player event listeners',
      'Plugin with custom inventory GUI',
      'Economy plugin with Vault integration',
    ],
    commands: [
      'Custom teleport command with cooldown',
      'Kit command with item sets',
      'Warp system with multiple locations',
      'Ban/kick command with reason and duration',
    ],
    datapacks: [
      'Custom recipe datapack',
      'Dimension datapack with custom world',
      'Loot table datapack for custom drops',
      'Advancement datapack with custom achievements',
    ],
    mods: [
      'Forge mod with custom items and blocks',
      'Fabric mod with custom mob AI',
      'Mod with custom world generation',
      'Mod with custom crafting recipes',
    ],
    scripts: [
      'Skript for custom shop system',
      'CommandBox script for admin tools',
      'Skript for custom enchantments',
      'Auto-broadcast message script',
    ],
    worldedit: [
      'Custom selection and copy-paste script',
      'Schematic loader with rotation',
      'Terrain generator script',
      'Bulk replace blocks script',
    ],
    economy: [
      'Shop GUI with buy/sell system',
      'Auction house plugin',
      'Custom currency with shops',
      'Player market system',
    ],
    minigames: [
      'BedWars-style minigame',
      'SkyWars with custom kits',
      'Spleef minigame with powerups',
      'Parkour course with checkpoints',
    ],
  },
  cs2: {
    plugins: [
      'SourceMod plugin with custom commands',
      'Admin menu plugin with player management',
      'Custom game mode plugin',
      'Stats tracking plugin',
    ],
    configs: [
      'Server config for competitive play',
      'Custom map cycle configuration',
      'Weapon balance config',
      'Anti-cheat configuration',
    ],
    maps: [
      'Map entity script with triggers',
      'Custom spawn points script',
      'Map voting system',
      'Dynamic objective script',
    ],
    workshop: [
      'Workshop map with custom logic',
      'Custom weapon skin pack',
      'Workshop agent customization',
      'Training map with scenarios',
    ],
    autoexec: [
      'Autoexec for competitive settings',
      'Custom crosshair and viewmodel config',
      'Network optimization autoexec',
      'Movement and sensitivity config',
    ],
    training: [
      'Aim training map script',
      'Spray control practice script',
      'Utility practice with replays',
      'Pre-aim training scenarios',
    ],
    hud: [
      'Custom HUD with player stats',
      'Kill feed modification',
      'Radar enhancement script',
      'Scoreboard customization',
    ],
    admin: [
      'Admin slap/slay commands',
      'Map voting admin panel',
      'Player mute/ban system',
      'Server rules enforcement',
    ],
  },
};

// ============ LOCAL SCRIPT TEMPLATES ============
export const SCRIPT_TEMPLATES: Record<string, (prompt: string) => { intro: string; code: string; usage: string }> = {
  fex: (prompt) => ({
    intro: `Here's the ultimate Fex Script — an all-in-one mega script combining ESP, Aimbot, Movement, Combat, Auto Farm, GUI, and Utility. Everything in one script with a full toggle GUI.`,
    code: `-- ╔═══════════════════════════════════════════════════════════╗
-- ║                    FEX SCRIPT v3.0                        ║
-- ║         All-in-One Executor Mega Script                   ║
-- ║  ESP + Aimbot + Movement + Combat + AutoFarm + Utility    ║
-- ╚═══════════════════════════════════════════════════════════╝
-- Compatible: Synapse X, Script-Ware, KRNL, Fluxus, Hydrogen, Delta

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local TweenService = game:GetService("TweenService")
local TeleportService = game:GetService("TeleportService")
local PathfindingService = game:GetService("PathfindingService")
local VirtualUser = game:GetService("VirtualUser")
local LocalPlayer = Players.LocalPlayer
local Camera = workspace.CurrentCamera
local Mouse = LocalPlayer:GetMouse()

-- ═══════════════════════════════════════════════════════════
--                    MASTER SETTINGS
-- ═══════════════════════════════════════════════════════════
local Fex = {
    -- ESP
    ESP = { Enabled = false, ShowBoxes = true, ShowNames = true, ShowHealth = true, ShowDistance = true, ShowTracers = false, BoxColor = Color3.fromRGB(168, 85, 247), MaxDistance = 5000, TeamCheck = false },
    
    -- Aimbot
    Aimbot = { Enabled = false, FOV = 200, ShowFOV = true, FOVColor = Color3.fromRGB(168, 85, 247), Smoothness = 0.15, Prediction = true, PredictionAmount = 0.165, TeamCheck = true, WallCheck = true, TargetPart = "Head", AimKey = Enum.UserInputType.MouseButton2 },
    
    -- Movement
    Movement = { FlyEnabled = false, FlySpeed = 50, SpeedEnabled = false, WalkSpeed = 100, NoclipEnabled = false, InfiniteJump = false, DefaultWalkSpeed = 16 },
    
    -- Combat
    Combat = { KillAuraEnabled = false, KillAuraRange = 25, KillAuraSpeed = 0.1, AutoParryEnabled = false, HitboxEnabled = false, HitboxSize = Vector3.new(10, 10, 10), TeamCheck = true },
    
    -- Auto Farm
    AutoFarm = { Enabled = false, FarmRange = 500, CollectDelay = 0.5, UsePathfinding = true, TPInstantly = false, TPSpeed = 5, TargetItem = "Fruit" },
    
    -- Utility
    Utility = { AntiAFK = false, FreecamEnabled = false, FreecamSpeed = 2 },
    
    -- GUI
    GUI = { Enabled = true, ToggleKey = Enum.KeyCode.RightShift },
}

getgenv().FexScript = Fex

-- ═══════════════════════════════════════════════════════════
--                    GUI CREATION
-- ═══════════════════════════════════════════════════════════
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "FexScript_Hub"
ScreenGui.ResetOnSpawn = false
ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
ScreenGui.Parent = game:GetService("CoreGui")

local Main = Instance.new("Frame")
Main.Name = "Main"
Main.Size = UDim2.new(0, 560, 0, 400)
Main.Position = UDim2.new(0.5, -280, 0.5, -200)
Main.BackgroundColor3 = Color3.fromRGB(12, 12, 16)
Main.BorderSizePixel = 0
Main.Active = true
Main.Draggable = true
Main.Parent = ScreenGui

local MainCorner = Instance.new("UICorner")
MainCorner.CornerRadius = UDim.new(0, 12)
MainCorner.Parent = Main

local MainStroke = Instance.new("UIStroke")
MainStroke.Color = Color3.fromRGB(168, 85, 247)
MainStroke.Thickness = 1.5
MainStroke.Transparency = 0.4
MainStroke.Parent = Main

-- Header
local Header = Instance.new("Frame")
Header.Size = UDim2.new(1, 0, 0, 45)
Header.BackgroundColor3 = Color3.fromRGB(18, 18, 24)
Header.BorderSizePixel = 0
Header.Parent = Main

local HeaderCorner = Instance.new("UICorner")
HeaderCorner.CornerRadius = UDim.new(0, 12)
HeaderCorner.Parent = Header

local HeaderFix = Instance.new("Frame")
HeaderFix.Size = UDim2.new(1, 0, 0, 15)
HeaderFix.Position = UDim2.new(0, 0, 1, -15)
HeaderFix.BackgroundColor3 = Color3.fromRGB(18, 18, 24)
HeaderFix.BorderSizePixel = 0
HeaderFix.Parent = Header

local Title = Instance.new("TextLabel")
Title.Size = UDim2.new(0, 250, 1, 0)
Title.Position = UDim2.new(0, 15, 0, 0)
Title.BackgroundTransparency = 1
Title.Text = "⚡ FEX SCRIPT v3.0"
Title.TextColor3 = Color3.fromRGB(168, 85, 247)
Title.Font = Enum.Font.GothamBold
Title.TextSize = 16
Title.TextXAlignment = Enum.TextXAlignment.Left
Title.Parent = Header

local CloseBtn = Instance.new("TextButton")
CloseBtn.Size = UDim2.new(0, 30, 0, 30)
CloseBtn.Position = UDim2.new(1, -40, 0.5, -15)
CloseBtn.BackgroundColor3 = Color3.fromRGB(239, 68, 68)
CloseBtn.Text = "✕"
CloseBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
CloseBtn.Font = Enum.Font.GothamBold
CloseBtn.TextSize = 14
CloseBtn.Parent = Header

local CloseCorner = Instance.new("UICorner")
CloseCorner.CornerRadius = UDim.new(0, 6)
CloseCorner.Parent = CloseBtn

-- Sidebar
local Sidebar = Instance.new("Frame")
Sidebar.Size = UDim2.new(0, 150, 1, -55)
Sidebar.Position = UDim2.new(0, 0, 0, 50)
Sidebar.BackgroundColor3 = Color3.fromRGB(15, 15, 20)
Sidebar.BorderSizePixel = 0
Sidebar.Parent = Main

local TabLayout = Instance.new("UIListLayout")
TabLayout.Padding = UDim.new(0, 2)
TabLayout.SortOrder = Enum.SortOrder.LayoutOrder
TabLayout.Parent = Sidebar

-- Content
local Content = Instance.new("Frame")
Content.Size = UDim2.new(1, -160, 1, -55)
Content.Position = UDim2.new(0, 155, 0, 50)
Content.BackgroundTransparency = 1
Content.Parent = Main

-- Tabs
local Tabs = {
    {Name = "ESP", Icon = "👁️", Order = 1},
    {Name = "Aimbot", Icon = "🎯", Order = 2},
    {Name = "Movement", Icon = "💨", Order = 3},
    {Name = "Combat", Icon = "⚔️", Order = 4},
    {Name = "AutoFarm", Icon = "🤖", Order = 5},
    {Name = "Utility", Icon = "🔧", Order = 6},
}

local TabButtons = {}
local TabPages = {}
local CurrentTab = nil

for _, tab in pairs(Tabs) do
    local TabBtn = Instance.new("TextButton")
    TabBtn.Name = tab.Name .. "Tab"
    TabBtn.Size = UDim2.new(1, -10, 0, 35)
    TabBtn.BackgroundColor3 = Color3.fromRGB(22, 22, 28)
    TabBtn.BorderSizePixel = 0
    TabBtn.Text = "  " .. tab.Icon .. "  " .. tab.Name
    TabBtn.TextColor3 = Color3.fromRGB(150, 150, 160)
    TabBtn.Font = Enum.Font.GothamMedium
    TabBtn.TextSize = 13
    TabBtn.TextXAlignment = Enum.TextXAlignment.Left
    TabBtn.LayoutOrder = tab.Order
    TabBtn.AutoButtonColor = false
    TabBtn.Parent = Sidebar
    
    local TabCorner = Instance.new("UICorner")
    TabCorner.CornerRadius = UDim.new(0, 8)
    TabCorner.Parent = TabBtn
    
    local TabPage = Instance.new("ScrollingFrame")
    TabPage.Name = tab.Name .. "Page"
    TabPage.Size = UDim2.new(1, 0, 1, 0)
    TabPage.BackgroundTransparency = 1
    TabPage.BorderSizePixel = 0
    TabPage.ScrollBarThickness = 3
    TabPage.ScrollBarImageColor3 = Color3.fromRGB(168, 85, 247)
    TabPage.Visible = false
    TabPage.Parent = Content
    
    local PageLayout = Instance.new("UIListLayout")
    PageLayout.Padding = UDim.new(0, 8)
    PageLayout.SortOrder = Enum.SortOrder.LayoutOrder
    PageLayout.Parent = TabPage
    
    TabButtons[tab.Name] = TabBtn
    TabPages[tab.Name] = TabPage
end

-- Toggle helper
local function CreateToggle(parent, name, default, order, callback)
    local Container = Instance.new("Frame")
    Container.Size = UDim2.new(1, -10, 0, 40)
    Container.BackgroundColor3 = Color3.fromRGB(20, 20, 26)
    Container.BorderSizePixel = 0
    Container.LayoutOrder = order
    Container.Parent = parent
    
    local CCorner = Instance.new("UICorner")
    CCorner.CornerRadius = UDim.new(0, 8)
    CCorner.Parent = Container
    
    local Label = Instance.new("TextLabel")
    Label.Size = UDim2.new(1, -60, 1, 0)
    Label.Position = UDim2.new(0, 12, 0, 0)
    Label.BackgroundTransparency = 1
    Label.Text = name
    Label.TextColor3 = Color3.fromRGB(200, 200, 210)
    Label.Font = Enum.Font.Gotham
    Label.TextSize = 13
    Label.TextXAlignment = Enum.TextXAlignment.Left
    Label.Parent = Container
    
    local Toggle = Instance.new("TextButton")
    Toggle.Size = UDim2.new(0, 40, 0, 22)
    Toggle.Position = UDim2.new(1, -50, 0.5, -11)
    Toggle.BackgroundColor3 = default and Color3.fromRGB(168, 85, 247) or Color3.fromRGB(50, 50, 60)
    Toggle.Text = ""
    Toggle.AutoButtonColor = false
    Toggle.Parent = Container
    
    local TCorner = Instance.new("UICorner")
    TCorner.CornerRadius = UDim.new(1, 0)
    TCorner.Parent = Toggle
    
    local Circle = Instance.new("Frame")
    Circle.Size = UDim2.new(0, 16, 0, 16)
    Circle.Position = default and UDim2.new(1, -19, 0.5, -8) or UDim2.new(0, 3, 0.5, -8)
    Circle.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
    Circle.BorderSizePixel = 0
    Circle.Parent = Toggle
    
    local CircleCorner = Instance.new("UICorner")
    CircleCorner.CornerRadius = UDim.new(1, 0)
    CircleCorner.Parent = Circle
    
    local enabled = default
    Toggle.MouseButton1Click:Connect(function()
        enabled = not enabled
        TweenService:Create(Toggle, TweenInfo.new(0.2), {BackgroundColor3 = enabled and Color3.fromRGB(168, 85, 247) or Color3.fromRGB(50, 50, 60)}):Play()
        TweenService:Create(Circle, TweenInfo.new(0.2), {Position = enabled and UDim2.new(1, -19, 0.5, -8) or UDim2.new(0, 3, 0.5, -8)}):Play()
        if callback then callback(enabled) end
    end)
end

-- Populate tabs
CreateToggle(TabPages["ESP"], "Player ESP", false, 1, function(v) Fex.ESP.Enabled = v end)
CreateToggle(TabPages["ESP"], "Show Boxes", true, 2, function(v) Fex.ESP.ShowBoxes = v end)
CreateToggle(TabPages["ESP"], "Show Names", true, 3, function(v) Fex.ESP.ShowNames = v end)
CreateToggle(TabPages["ESP"], "Show Health", true, 4, function(v) Fex.ESP.ShowHealth = v end)
CreateToggle(TabPages["ESP"], "Show Distance", true, 5, function(v) Fex.ESP.ShowDistance = v end)
CreateToggle(TabPages["ESP"], "Team Check", false, 6, function(v) Fex.ESP.TeamCheck = v end)

CreateToggle(TabPages["Aimbot"], "Aimbot", false, 1, function(v) Fex.Aimbot.Enabled = v end)
CreateToggle(TabPages["Aimbot"], "Show FOV Circle", true, 2, function(v) Fex.Aimbot.ShowFOV = v end)
CreateToggle(TabPages["Aimbot"], "Prediction", true, 3, function(v) Fex.Aimbot.Prediction = v end)
CreateToggle(TabPages["Aimbot"], "Team Check", true, 4, function(v) Fex.Aimbot.TeamCheck = v end)
CreateToggle(TabPages["Aimbot"], "Wall Check", true, 5, function(v) Fex.Aimbot.WallCheck = v end)

CreateToggle(TabPages["Movement"], "Fly (F)", false, 1, function(v) Fex.Movement.FlyEnabled = v end)
CreateToggle(TabPages["Movement"], "Speed (G)", false, 2, function(v) Fex.Movement.SpeedEnabled = v end)
CreateToggle(TabPages["Movement"], "Noclip (C)", false, 3, function(v) Fex.Movement.NoclipEnabled = v end)
CreateToggle(TabPages["Movement"], "Infinite Jump (V)", false, 4, function(v) Fex.Movement.InfiniteJump = v end)

CreateToggle(TabPages["Combat"], "Kill Aura (X)", false, 1, function(v) Fex.Combat.KillAuraEnabled = v end)
CreateToggle(TabPages["Combat"], "Auto Parry (Z)", false, 2, function(v) Fex.Combat.AutoParryEnabled = v end)
CreateToggle(TabPages["Combat"], "Hitbox Expander (B)", false, 3, function(v) Fex.Combat.HitboxEnabled = v end)
CreateToggle(TabPages["Combat"], "Team Check", true, 4, function(v) Fex.Combat.TeamCheck = v end)

CreateToggle(TabPages["AutoFarm"], "Auto Farm (P)", false, 1, function(v) Fex.AutoFarm.Enabled = v end)
CreateToggle(TabPages["AutoFarm"], "Use Pathfinding", true, 2, function(v) Fex.AutoFarm.UsePathfinding = v end)
CreateToggle(TabPages["AutoFarm"], "Teleport Mode", false, 3, function(v) Fex.AutoFarm.TPInstantly = v end)

CreateToggle(TabPages["Utility"], "Anti-AFK (F1)", false, 1, function(v) Fex.Utility.AntiAFK = v end)
CreateToggle(TabPages["Utility"], "Freecam (F2)", false, 2, function(v) Fex.Utility.FreecamEnabled = v end)

-- Tab switching
local function SelectTab(tabName)
    if CurrentTab == tabName then return end
    if CurrentTab and TabButtons[CurrentTab] then
        TabButtons[CurrentTab].BackgroundColor3 = Color3.fromRGB(22, 22, 28)
        TabButtons[CurrentTab].TextColor3 = Color3.fromRGB(150, 150, 160)
    end
    CurrentTab = tabName
    TabButtons[tabName].BackgroundColor3 = Color3.fromRGB(168, 85, 247)
    TabButtons[tabName].TextColor3 = Color3.fromRGB(255, 255, 255)
    for name, page in pairs(TabPages) do page.Visible = (name == tabName) end
end

for name, btn in pairs(TabButtons) do
    btn.MouseButton1Click:Connect(function() SelectTab(name) end)
end

CloseBtn.MouseButton1Click:Connect(function() ScreenGui:Destroy() end)
SelectTab("ESP")

-- ═══════════════════════════════════════════════════════════
--                    ESP SYSTEM
-- ═══════════════════════════════════════════════════════════
local ESPObjects = {}
local ESPFolder = Instance.new("Folder")
ESPFolder.Name = "FexESP"
ESPFolder.Parent = game:GetService("CoreGui")

local function CreateESP(player)
    if player == LocalPlayer then return end
    local folder = Instance.new("Folder")
    folder.Name = player.Name
    folder.Parent = ESPFolder
    
    local nameTag = Instance.new("BillboardGui")
    nameTag.Size = UDim2.new(0, 200, 0, 50)
    nameTag.StudsOffset = Vector3.new(0, 3, 0)
    nameTag.AlwaysOnTop = true
    nameTag.Parent = folder
    
    local nameLabel = Instance.new("TextLabel")
    nameLabel.Size = UDim2.new(1, 0, 0.5, 0)
    nameLabel.BackgroundTransparency = 1
    nameLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
    nameLabel.TextStrokeTransparency = 0
    nameLabel.Font = Enum.Font.GothamBold
    nameLabel.TextSize = 14
    nameLabel.Parent = nameTag
    
    local healthLabel = Instance.new("TextLabel")
    healthLabel.Position = UDim2.new(0, 0, 0.5, 0)
    healthLabel.Size = UDim2.new(1, 0, 0.5, 0)
    healthLabel.BackgroundTransparency = 1
    healthLabel.TextColor3 = Color3.fromRGB(0, 255, 0)
    healthLabel.TextStrokeTransparency = 0
    healthLabel.Font = Enum.Font.Gotham
    healthLabel.TextSize = 12
    healthLabel.Parent = nameTag
    
    local distLabel = Instance.new("TextLabel")
    distLabel.Size = UDim2.new(0, 100, 0, 20)
    distLabel.BackgroundTransparency = 1
    distLabel.TextColor3 = Color3.fromRGB(200, 200, 200)
    distLabel.TextStrokeTransparency = 0
    distLabel.Font = Enum.Font.Gotham
    distLabel.TextSize = 12
    distLabel.Parent = folder
    
    ESPObjects[player] = { Folder = folder, NameTag = nameTag, NameLabel = nameLabel, HealthLabel = healthLabel, DistLabel = distLabel }
end

local function RemoveESP(player)
    if ESPObjects[player] then ESPObjects[player].Folder:Destroy() ESPObjects[player] = nil end
end

-- ═══════════════════════════════════════════════════════════
--                    AIMBOT SYSTEM
-- ═══════════════════════════════════════════════════════════
local FOVCircle = Drawing.new("Circle")
FOVCircle.Thickness = 1.5
FOVCircle.NumSides = 64
FOVCircle.Radius = Fex.Aimbot.FOV
FOVCircle.Filled = false
FOVCircle.Color = Fex.Aimbot.FOVColor
FOVCircle.Visible = false
FOVCircle.Transparency = 0.8

local CurrentTarget = nil
local IsAiming = false

local function GetClosestPlayer()
    local closest, closestDist = nil, Fex.Aimbot.FOV
    for _, player in pairs(Players:GetPlayers()) do
        if player == LocalPlayer then continue end
        if not player.Character then continue end
        local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
        if not humanoid or humanoid.Health <= 0 then continue end
        if Fex.Aimbot.TeamCheck and player.Team == LocalPlayer.Team then continue end
        local targetPart = player.Character:FindFirstChild(Fex.Aimbot.TargetPart)
        if not targetPart then continue end
        local screenPos, onScreen = Camera:WorldToViewportPoint(targetPart.Position)
        if not onScreen then continue end
        local mousePos = UserInputService:GetMouseLocation()
        local dist = (Vector2.new(screenPos.X, screenPos.Y) - mousePos).Magnitude
        if dist < closestDist then closestDist = dist closest = player end
    end
    return closest
end

-- ═══════════════════════════════════════════════════════════
--                    FLY SYSTEM
-- ═══════════════════════════════════════════════════════════
local flyBV, flyBG
local flying = false

local function StartFly()
    if flying then return end
    flying = true
    local char = LocalPlayer.Character
    if not char then return end
    local root = char:FindFirstChild("HumanoidRootPart")
    local hum = char:FindFirstChildOfClass("Humanoid")
    if not root or not hum then return end
    flyBV = Instance.new("BodyVelocity")
    flyBV.MaxForce = Vector3.new(math.huge, math.huge, math.huge)
    flyBV.Velocity = Vector3.new(0, 0, 0)
    flyBV.Parent = root
    flyBG = Instance.new("BodyGyro")
    flyBG.MaxTorque = Vector3.new(math.huge, math.huge, math.huge)
    flyBG.P = 9e4
    flyBG.Parent = root
    hum.PlatformStand = true
end

local function StopFly()
    if not flying then return end
    flying = false
    if flyBV then flyBV:Destroy() end
    if flyBG then flyBG:Destroy() end
    local char = LocalPlayer.Character
    if char then
        local hum = char:FindFirstChildOfClass("Humanoid")
        if hum then hum.PlatformStand = false end
    end
end

-- ═══════════════════════════════════════════════════════════
--                    NOCLIP SYSTEM
-- ═══════════════════════════════════════════════════════════
local noclipConn
local function StartNoclip()
    if noclipConn then return end
    noclipConn = RunService.Stepped:Connect(function()
        if not Fex.Movement.NoclipEnabled then return end
        local char = LocalPlayer.Character
        if not char then return end
        for _, part in pairs(char:GetDescendants()) do
            if part:IsA("BasePart") then part.CanCollide = false end
        end
    end)
end

-- ═══════════════════════════════════════════════════════════
--                    KILL AURA SYSTEM
-- ═══════════════════════════════════════════════════════════
local lastKillAura = 0
local function KillAura()
    if not Fex.Combat.KillAuraEnabled then return end
    local now = tick()
    if now - lastKillAura < Fex.Combat.KillAuraSpeed then return end
    lastKillAura = now
    local char = LocalPlayer.Character
    if not char then return end
    local myRoot = char:FindFirstChild("HumanoidRootPart")
    if not myRoot then return end
    for _, player in pairs(Players:GetPlayers()) do
        if player == LocalPlayer then continue end
        if Fex.Combat.TeamCheck and player.Team == LocalPlayer.Team then continue end
        if not player.Character then continue end
        local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
        local targetPart = player.Character:FindFirstChild("HumanoidRootPart")
        if not humanoid or not targetPart then continue end
        if humanoid.Health <= 0 then continue end
        local dist = (targetPart.Position - myRoot.Position).Magnitude
        if dist > Fex.Combat.KillAuraRange then continue end
        pcall(function()
            for _, remote in pairs(game:GetDescendants()) do
                if remote:IsA("RemoteEvent") and string.find(string.lower(remote.Name), "hit") then
                    remote:FireServer(targetPart, targetPart.Position, player)
                    break
                end
            end
        end)
    end
end

-- ═══════════════════════════════════════════════════════════
--                    HITBOX EXPANDER
-- ═══════════════════════════════════════════════════════════
local expandedParts = {}
local function ExpandHitbox()
    if not Fex.Combat.HitboxEnabled then
        for part, original in pairs(expandedParts) do
            if part and part.Parent then part.Size = original.Size part.Transparency = original.Transparency end
        end
        expandedParts = {}
        return
    end
    for _, player in pairs(Players:GetPlayers()) do
        if player == LocalPlayer then continue end
        if Fex.Combat.TeamCheck and player.Team == LocalPlayer.Team then continue end
        if not player.Character then continue end
        for _, part in pairs(player.Character:GetChildren()) do
            if part:IsA("BasePart") and part.Name ~= "HumanoidRootPart" then
                if not expandedParts[part] then expandedParts[part] = {Size = part.Size, Transparency = part.Transparency} end
                part.Size = Fex.Combat.HitboxSize
                part.Transparency = 0.7
            end
        end
    end
end

-- ═══════════════════════════════════════════════════════════
--                    AUTO FARM SYSTEM
-- ═══════════════════════════════════════════════════════════
local farming = false
local function FindNearestItem()
    local char = LocalPlayer.Character
    if not char then return nil end
    local myRoot = char:FindFirstChild("HumanoidRootPart")
    if not myRoot then return nil end
    local nearest, nearestDist = nil, Fex.AutoFarm.FarmRange
    local searchNames = {"Orb", "Coin", "Gem", "Item", "Drop", "Collect", "Fruit", "Chest"}
    for _, obj in pairs(workspace:GetDescendants()) do
        if obj:IsA("BasePart") or obj:IsA("Model") then
            for _, name in pairs(searchNames) do
                if string.find(obj.Name, name) then
                    local pos = obj:IsA("Model") and obj:GetPivot().Position or obj.Position
                    local dist = (pos - myRoot.Position).Magnitude
                    if dist < nearestDist then nearestDist = dist nearest = obj end
                end
            end
        end
    end
    return nearest
end

local function AutoFarmLoop()
    while farming and Fex.AutoFarm.Enabled do
        local item = FindNearestItem()
        if item then
            local pos = item:IsA("Model") and item:GetPivot().Position or item.Position
            local char = LocalPlayer.Character
            local myRoot = char and char:FindFirstChild("HumanoidRootPart")
            if myRoot then
                if Fex.AutoFarm.TPInstantly then
                    myRoot.CFrame = CFrame.new(pos)
                else
                    local hum = char:FindFirstChildOfClass("Humanoid")
                    if hum then hum:MoveTo(pos) end
                end
                task.wait(Fex.AutoFarm.CollectDelay)
                pcall(function()
                    for _, remote in pairs(game:GetDescendants()) do
                        if remote:IsA("RemoteEvent") then
                            local n = string.lower(remote.Name)
                            if string.find(n, "collect") or string.find(n, "pickup") then remote:FireServer(item) end
                        end
                    end
                end)
                task.wait(0.2)
            end
        else
            task.wait(0.5)
        end
    end
end

-- ═══════════════════════════════════════════════════════════
--                    ANTI-AFK SYSTEM
-- ═══════════════════════════════════════════════════════════
local function StartAntiAFK()
    LocalPlayer.Idled:Connect(function()
        VirtualUser:CaptureController()
        VirtualUser:ClickButton2(Vector2.new())
    end)
end

-- ═══════════════════════════════════════════════════════════
--                    FREECAM SYSTEM
-- ═══════════════════════════════════════════════════════════
local freecamCF = CFrame.new()
local freecamConn
local freecamActive = false

local function StartFreecam()
    if freecamActive then return end
    freecamActive = true
    freecamCF = Camera.CFrame
    freecamConn = RunService.RenderStepped:Connect(function()
        if not freecamActive then return end
        local speed = Fex.Utility.FreecamSpeed
        if UserInputService:IsKeyDown(Enum.KeyCode.LeftShift) then speed = speed * 3 end
        local moveDir = Vector3.new(0, 0, 0)
        if UserInputService:IsKeyDown(Enum.KeyCode.W) then moveDir = moveDir + Camera.CFrame.LookVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.S) then moveDir = moveDir - Camera.CFrame.LookVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.A) then moveDir = moveDir - Camera.CFrame.RightVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.D) then moveDir = moveDir + Camera.CFrame.RightVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.Space) then moveDir = moveDir + Vector3.new(0, 1, 0) end
        if UserInputService:IsKeyDown(Enum.KeyCode.LeftControl) then moveDir = moveDir - Vector3.new(0, 1, 0) end
        freecamCF = freecamCF + (moveDir * speed)
        Camera.CFrame = freecamCF
    end)
end

local function StopFreecam()
    if not freecamActive then return end
    freecamActive = false
    if freecamConn then freecamConn:Disconnect() freecamConn = nil end
end

-- ═══════════════════════════════════════════════════════════
--                    INPUT HANDLER
-- ═══════════════════════════════════════════════════════════
UserInputService.InputBegan:Connect(function(input, gp)
    if gp then return end
    
    -- GUI Toggle
    if input.KeyCode == Fex.GUI.ToggleKey then ScreenGui.Enabled = not ScreenGui.Enabled end
    
    -- Movement
    if input.KeyCode == Enum.KeyCode.F then
        Fex.Movement.FlyEnabled = not Fex.Movement.FlyEnabled
        if Fex.Movement.FlyEnabled then StartFly() else StopFly() end
    end
    if input.KeyCode == Enum.KeyCode.G then
        Fex.Movement.SpeedEnabled = not Fex.Movement.SpeedEnabled
        local char = LocalPlayer.Character
        local hum = char and char:FindFirstChildOfClass("Humanoid")
        if hum then hum.WalkSpeed = Fex.Movement.SpeedEnabled and Fex.Movement.WalkSpeed or Fex.Movement.DefaultWalkSpeed end
    end
    if input.KeyCode == Enum.KeyCode.C then
        Fex.Movement.NoclipEnabled = not Fex.Movement.NoclipEnabled
        if Fex.Movement.NoclipEnabled then StartNoclip() end
    end
    if input.KeyCode == Enum.KeyCode.V then Fex.Movement.InfiniteJump = not Fex.Movement.InfiniteJump end
    
    -- Combat
    if input.KeyCode == Enum.KeyCode.X then Fex.Combat.KillAuraEnabled = not Fex.Combat.KillAuraEnabled end
    if input.KeyCode == Enum.KeyCode.Z then Fex.Combat.AutoParryEnabled = not Fex.Combat.AutoParryEnabled end
    if input.KeyCode == Enum.KeyCode.B then Fex.Combat.HitboxEnabled = not Fex.Combat.HitboxEnabled end
    
    -- Auto Farm
    if input.KeyCode == Enum.KeyCode.P then
        Fex.AutoFarm.Enabled = not Fex.AutoFarm.Enabled
        farming = Fex.AutoFarm.Enabled
        if farming then task.spawn(AutoFarmLoop) end
    end
    
    -- Utility
    if input.KeyCode == Enum.KeyCode.F1 then Fex.Utility.AntiAFK = not Fex.Utility.AntiAFK if Fex.Utility.AntiAFK then StartAntiAFK() end end
    if input.KeyCode == Enum.KeyCode.F2 then
        Fex.Utility.FreecamEnabled = not Fex.Utility.FreecamEnabled
        if Fex.Utility.FreecamEnabled then StartFreecam() else StopFreecam() end
    end
    
    -- Aimbot aim key
    if input.UserInputType == Fex.Aimbot.AimKey then IsAiming = true end
end)

UserInputService.InputEnded:Connect(function(input)
    if input.UserInputType == Fex.Aimbot.AimKey then IsAiming = false end
end)

UserInputService.JumpRequest:Connect(function()
    if Fex.Movement.InfiniteJump then
        local char = LocalPlayer.Character
        local hum = char and char:FindFirstChildOfClass("Humanoid")
        if hum then hum:ChangeState(Enum.HumanoidStateType.Jumping) end
    end
end)

-- ═══════════════════════════════════════════════════════════
--                    MAIN RENDER LOOP
-- ═══════════════════════════════════════════════════════════
RunService.RenderStepped:Connect(function()
    -- ESP Update
    for player, objects in pairs(ESPObjects) do
        local char = player.Character
        if not char or not Fex.ESP.Enabled then objects.Folder.Enabled = false continue end
        local head = char:FindFirstChild("Head")
        local hum = char:FindFirstChildOfClass("Humanoid")
        local root = char:FindFirstChild("HumanoidRootPart")
        if not head or not hum or not root or hum.Health <= 0 then objects.Folder.Enabled = false continue end
        if Fex.ESP.TeamCheck and player.Team == LocalPlayer.Team then objects.Folder.Enabled = false continue end
        local dist = (root.Position - Camera.CFrame.Position).Magnitude
        if dist > Fex.ESP.MaxDistance then objects.Folder.Enabled = false continue end
        objects.Folder.Enabled = true
        local _, onScreen = Camera:WorldToViewportPoint(head.Position)
        if onScreen then
            objects.NameTag.Adornee = head
            objects.NameTag.Enabled = true
            if Fex.ESP.ShowNames then objects.NameLabel.Text = player.Name objects.NameLabel.Visible = true else objects.NameLabel.Visible = false end
            if Fex.ESP.ShowHealth then objects.HealthLabel.Text = math.floor(hum.Health) .. " HP" objects.HealthLabel.Visible = true else objects.HealthLabel.Visible = false end
            if Fex.ESP.ShowDistance then objects.DistLabel.Text = "[" .. math.floor(dist) .. "m]" objects.DistLabel.Visible = true else objects.DistLabel.Visible = false end
        else
            objects.NameTag.Enabled = false
            objects.DistLabel.Visible = false
        end
    end
    
    -- Aimbot
    FOVCircle.Position = UserInputService:GetMouseLocation()
    FOVCircle.Radius = Fex.Aimbot.FOV
    FOVCircle.Visible = Fex.Aimbot.ShowFOV and Fex.Aimbot.Enabled
    if Fex.Aimbot.Enabled then
        if not CurrentTarget or not CurrentTarget.Character then CurrentTarget = GetClosestPlayer() end
        if IsAiming and CurrentTarget and CurrentTarget.Character then
            local targetPart = CurrentTarget.Character:FindFirstChild(Fex.Aimbot.TargetPart)
            if targetPart then
                local targetPos = targetPart.Position
                if Fex.Aimbot.Prediction then
                    local root = CurrentTarget.Character:FindFirstChild("HumanoidRootPart")
                    if root then targetPos = targetPos + (root.Velocity * Fex.Aimbot.PredictionAmount) end
                end
                local currentCF = Camera.CFrame
                local targetCF = CFrame.new(currentCF.Position, targetPos)
                if Fex.Aimbot.Smoothness > 0 then
                    Camera.CFrame = currentCF:Lerp(targetCF, Fex.Aimbot.Smoothness)
                else
                    Camera.CFrame = targetCF
                end
            end
        end
    end
    
    -- Fly movement
    if flying and flyBV and flyBG then
        local moveDir = Vector3.new(0, 0, 0)
        if UserInputService:IsKeyDown(Enum.KeyCode.W) then moveDir = moveDir + Camera.CFrame.LookVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.S) then moveDir = moveDir - Camera.CFrame.LookVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.A) then moveDir = moveDir - Camera.CFrame.RightVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.D) then moveDir = moveDir + Camera.CFrame.RightVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.Space) then moveDir = moveDir + Vector3.new(0, 1, 0) end
        if UserInputService:IsKeyDown(Enum.KeyCode.LeftShift) then moveDir = moveDir - Vector3.new(0, 1, 0) end
        flyBV.Velocity = moveDir * Fex.Movement.FlySpeed
        flyBG.CFrame = Camera.CFrame
    end
end)

RunService.Heartbeat:Connect(function()
    KillAura()
    if Fex.Combat.HitboxEnabled then ExpandHitbox() end
end)

-- ═══════════════════════════════════════════════════════════
--                    INITIALIZATION
-- ═══════════════════════════════════════════════════════════
for _, player in pairs(Players:GetPlayers()) do pcall(CreateESP, player) end
Players.PlayerAdded:Connect(function(player)
    pcall(CreateESP, player)
    player.CharacterAdded:Connect(function() task.wait(1) pcall(CreateESP, player) end)
end)
Players.PlayerRemoving:Connect(RemoveESP)

LocalPlayer.CharacterAdded:Connect(function(char)
    task.wait(1)
    if Fex.Movement.SpeedEnabled then
        local hum = char:FindFirstChildOfClass("Humanoid")
        if hum then hum.WalkSpeed = Fex.Movement.WalkSpeed end
    end
    if Fex.Movement.NoclipEnabled then StartNoclip() end
end)

print("╔═══════════════════════════════════════════════╗")
print("║         ⚡ FEX SCRIPT v3.0 LOADED ⚡          ║")
print("╠═══════════════════════════════════════════════╣")
print("║  GUI: RightShift  |  ESP: via GUI            ║")
print("║  Aimbot: via GUI  |  Fly: F  | Speed: G      ║")
print("║  Noclip: C  |  InfJump: V  |  Aura: X       ║")
print("║  Parry: Z  |  Hitbox: B  |  Farm: P         ║")
print("║  AntiAFK: F1  |  Freecam: F2                ║")
print("╚═══════════════════════════════════════════════╝")`,
    usage: `**⚡ FEX SCRIPT — All-in-One Controls:**

**GUI:**
- **RightShift** — Toggle GUI
- Use tabs to switch between ESP, Aimbot, Movement, Combat, AutoFarm, Utility

**Movement:**
- **F** — Fly (WASD + Space/Shift)
- **G** — Speed boost
- **C** — Noclip
- **V** — Infinite jump

**Combat:**
- **X** — Kill aura
- **Z** — Auto parry
- **B** — Hitbox expander

**Other:**
- **P** — Auto farm
- **F1** — Anti-AFK
- **F2** — Freecam (WASD + Space/Ctrl)

**ESP & Aimbot:** Toggle via GUI tabs`,
  }),

  esp: (prompt) => ({
    intro: `Here's a complete Player ESP script with boxes, names, health bars, and distance. Paste into your executor and run.`,
    code: `-- Fex Scripts ESP
-- Category: ESP / Visual
-- Compatible: Synapse X, Script-Ware, KRNL, Fluxus, Hydrogen

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local Camera = workspace.CurrentCamera
local LocalPlayer = Players.LocalPlayer

-- Settings
local Settings = {
    Enabled = true,
    ToggleKey = Enum.KeyCode.F1,
    ShowBoxes = true,
    ShowNames = true,
    ShowHealth = true,
    ShowDistance = true,
    ShowTracers = false,
    BoxColor = Color3.fromRGB(168, 85, 247),
    NameColor = Color3.fromRGB(255, 255, 255),
    HealthColor = Color3.fromRGB(0, 255, 0),
    TracerColor = Color3.fromRGB(168, 85, 247),
    MaxDistance = 5000,
    TeamCheck = false,
}

getgenv().FexESP = Settings

-- Storage
local ESPObjects = {}
local CoreGui = game:GetService("CoreGui")
local ESPFolder = Instance.new("Folder")
ESPFolder.Name = "Fex_ESP"
ESPFolder.Parent = CoreGui

-- Helper functions
local function GetCharacter(player)
    return player.Character
end

local function GetHead(character)
    return character:FindFirstChild("Head")
end

local function GetHumanoid(character)
    return character:FindFirstChildOfClass("Humanoid")
end

local function GetRootPart(character)
    return character:FindFirstChild("HumanoidRootPart")
end

local function WorldToScreen(position)
    local screenPos, onScreen = Camera:WorldToViewportPoint(position)
    return Vector2.new(screenPos.X, screenPos.Y), onScreen, screenPos.Z
end

local function CreateESP(player)
    if player == LocalPlayer then return end
    
    local folder = Instance.new("Folder")
    folder.Name = player.Name
    folder.Parent = ESPFolder
    
    -- Box
    local box = Instance.new("BoxHandleAdornment")
    box.Name = "Box"
    box.Adornee = nil
    box.AlwaysOnTop = true
    box.ZIndex = 1
    box.Color3 = Settings.BoxColor
    box.Transparency = 0.3
    box.Parent = folder
    
    -- Name tag
    local nameTag = Instance.new("BillboardGui")
    nameTag.Name = "NameTag"
    nameTag.Size = UDim2.new(0, 200, 0, 50)
    nameTag.StudsOffset = Vector3.new(0, 3, 0)
    nameTag.AlwaysOnTop = true
    nameTag.Parent = folder
    
    local nameLabel = Instance.new("TextLabel")
    nameLabel.Name = "Name"
    nameLabel.Size = UDim2.new(1, 0, 0.5, 0)
    nameLabel.BackgroundTransparency = 1
    nameLabel.TextColor3 = Settings.NameColor
    nameLabel.TextStrokeTransparency = 0
    nameLabel.Font = Enum.Font.GothamBold
    nameLabel.TextSize = 14
    nameLabel.Parent = nameTag
    
    local healthLabel = Instance.new("TextLabel")
    healthLabel.Name = "Health"
    healthLabel.Position = UDim2.new(0, 0, 0.5, 0)
    healthLabel.Size = UDim2.new(1, 0, 0.5, 0)
    healthLabel.BackgroundTransparency = 1
    healthLabel.TextColor3 = Settings.HealthColor
    healthLabel.TextStrokeTransparency = 0
    healthLabel.Font = Enum.Font.Gotham
    healthLabel.TextSize = 12
    healthLabel.Parent = nameTag
    
    -- Distance label
    local distLabel = Instance.new("TextLabel")
    distLabel.Name = "Distance"
    distLabel.Size = UDim2.new(0, 100, 0, 20)
    distLabel.BackgroundTransparency = 1
    distLabel.TextColor3 = Color3.fromRGB(200, 200, 200)
    distLabel.TextStrokeTransparency = 0
    distLabel.Font = Enum.Font.Gotham
    distLabel.TextSize = 12
    distLabel.Parent = folder
    
    -- Tracer line
    local tracer = Instance.new("Beam")
    tracer.Name = "Tracer"
    
    ESPObjects[player] = {
        Folder = folder,
        Box = box,
        NameTag = nameTag,
        NameLabel = nameLabel,
        HealthLabel = healthLabel,
        DistLabel = distLabel,
    }
end

local function RemoveESP(player)
    if ESPObjects[player] then
        ESPObjects[player].Folder:Destroy()
        ESPObjects[player] = nil
    end
end

local function UpdateESP()
    if not Settings.Enabled then
        for _, obj in pairs(ESPObjects) do
            obj.Folder.Enabled = false
        end
        return
    end
    
    for player, objects in pairs(ESPObjects) do
        local character = GetCharacter(player)
        if not character then
            objects.Folder.Enabled = false
            continue
        end
        
        local head = GetHead(character)
        local humanoid = GetHumanoid(character)
        local rootPart = GetRootPart(character)
        
        if not head or not humanoid or not rootPart or humanoid.Health <= 0 then
            objects.Folder.Enabled = false
            continue
        end
        
        -- Team check
        if Settings.TeamCheck and player.Team == LocalPlayer.Team then
            objects.Folder.Enabled = false
            continue
        end
        
        local distance = (rootPart.Position - Camera.CFrame.Position).Magnitude
        if distance > Settings.MaxDistance then
            objects.Folder.Enabled = false
            continue
        end
        
        objects.Folder.Enabled = true
        
        -- Update name tag
        local screenPos, onScreen = WorldToScreen(head.Position)
        if onScreen then
            objects.NameTag.Adornee = head
            objects.NameTag.Enabled = true
            
            if Settings.ShowNames then
                objects.NameLabel.Text = player.Name
                objects.NameLabel.Visible = true
            else
                objects.NameLabel.Visible = false
            end
            
            if Settings.ShowHealth then
                objects.HealthLabel.Text = math.floor(humanoid.Health) .. " HP"
                objects.HealthLabel.Visible = true
            else
                objects.HealthLabel.Visible = false
            end
            
            if Settings.ShowDistance then
                objects.DistLabel.Text = "[" .. math.floor(distance) .. "m]"
                objects.DistLabel.Visible = true
                objects.DistLabel.Position = UDim2.new(0, screenPos.X - 50, 0, screenPos.Y + 30)
            else
                objects.DistLabel.Visible = false
            end
        else
            objects.NameTag.Enabled = false
            objects.DistLabel.Visible = false
        end
    end
end

-- Toggle key
UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.KeyCode == Settings.ToggleKey then
        Settings.Enabled = not Settings.Enabled
    end
end)

-- Initialize ESP for existing players
for _, player in pairs(Players:GetPlayers()) do
    pcall(CreateESP, player)
end

-- Handle new players
Players.PlayerAdded:Connect(function(player)
    pcall(CreateESP, player)
    player.CharacterAdded:Connect(function()
        task.wait(1)
        pcall(CreateESP, player)
    end)
end)

Players.PlayerRemoving:Connect(RemoveESP)

-- Render loop
RunService.RenderStepped:Connect(UpdateESP)

print("[Fex] ESP loaded! Press F1 to toggle.")`,
    usage: `**Controls:**
- **F1** — Toggle ESP on/off
- Works through walls at any distance (up to 5000 studs)
- Compatible with all executors`,
  }),

  movement: (prompt) => ({
    intro: `Here's a complete movement script with fly, speed, noclip, and infinite jump. Toggle keys included.`,
    code: `-- Fex Scripts Movement
-- Category: Movement
-- Compatible: Synapse X, Script-Ware, KRNL, Fluxus, Hydrogen

local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local LocalPlayer = Players.LocalPlayer
local Character = LocalPlayer.Character or LocalPlayer.CharacterAdded:Wait()
local Humanoid = Character:WaitForChild("Humanoid")
local RootPart = Character:WaitForChild("HumanoidRootPart")
local Camera = workspace.CurrentCamera

-- Settings
local Settings = {
    FlyEnabled = false,
    FlySpeed = 50,
    FlyKey = Enum.KeyCode.F,
    
    SpeedEnabled = false,
    WalkSpeed = 100,
    SpeedKey = Enum.KeyCode.G,
    
    NoclipEnabled = false,
    NoclipKey = Enum.KeyCode.C,
    
    InfiniteJump = false,
    JumpKey = Enum.KeyCode.V,
    
    DefaultWalkSpeed = 16,
    DefaultJumpPower = 50,
}

getgenv().FexMovement = Settings

-- ============ FLY SCRIPT ============
local flyBodyVelocity, flyBodyGyro
local flying = false

local function StartFly()
    if flying then return end
    flying = true
    
    flyBodyVelocity = Instance.new("BodyVelocity")
    flyBodyVelocity.MaxForce = Vector3.new(math.huge, math.huge, math.huge)
    flyBodyVelocity.Velocity = Vector3.new(0, 0, 0)
    flyBodyVelocity.Parent = RootPart
    
    flyBodyGyro = Instance.new("BodyGyro")
    flyBodyGyro.MaxTorque = Vector3.new(math.huge, math.huge, math.huge)
    flyBodyGyro.P = 9e4
    flyBodyGyro.Parent = RootPart
    
    Humanoid.PlatformStand = true
end

local function StopFly()
    if not flying then return end
    flying = false
    
    if flyBodyVelocity then flyBodyVelocity:Destroy() end
    if flyBodyGyro then flyBodyGyro:Destroy() end
    
    Humanoid.PlatformStand = false
end

-- ============ NOCLIP ============
local noclipConnection
local function StartNoclip()
    if noclipConnection then return end
    noclipConnection = RunService.Stepped:Connect(function()
        if not Settings.NoclipEnabled then return end
        for _, part in pairs(Character:GetDescendants()) do
            if part:IsA("BasePart") then
                part.CanCollide = false
            end
        end
    end)
end

local function StopNoclip()
    if noclipConnection then
        noclipConnection:Disconnect()
        noclipConnection = nil
    end
end

-- ============ INPUT HANDLER ============
UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    
    -- Fly toggle
    if input.KeyCode == Settings.FlyKey then
        Settings.FlyEnabled = not Settings.FlyEnabled
        if Settings.FlyEnabled then
            StartFly()
        else
            StopFly()
        end
    end
    
    -- Speed toggle
    if input.KeyCode == Settings.SpeedKey then
        Settings.SpeedEnabled = not Settings.SpeedEnabled
        if Settings.SpeedEnabled then
            Humanoid.WalkSpeed = Settings.WalkSpeed
        else
            Humanoid.WalkSpeed = Settings.DefaultWalkSpeed
        end
    end
    
    -- Noclip toggle
    if input.KeyCode == Settings.NoclipKey then
        Settings.NoclipEnabled = not Settings.NoclipEnabled
        if Settings.NoclipEnabled then
            StartNoclip()
        else
            StopNoclip()
        end
    end
    
    -- Infinite jump toggle
    if input.KeyCode == Settings.JumpKey then
        Settings.InfiniteJump = not Settings.InfiniteJump
    end
end)

-- Infinite jump handler
UserInputService.JumpRequest:Connect(function()
    if Settings.InfiniteJump then
        Humanoid:ChangeState(Enum.HumanoidStateType.Jumping)
    end
end)

-- Fly movement update
RunService.RenderStepped:Connect(function()
    if not flying then return end
    
    local moveDirection = Vector3.new(0, 0, 0)
    
    if UserInputService:IsKeyDown(Enum.KeyCode.W) then
        moveDirection = moveDirection + Camera.CFrame.LookVector
    end
    if UserInputService:IsKeyDown(Enum.KeyCode.S) then
        moveDirection = moveDirection - Camera.CFrame.LookVector
    end
    if UserInputService:IsKeyDown(Enum.KeyCode.A) then
        moveDirection = moveDirection - Camera.CFrame.RightVector
    end
    if UserInputService:IsKeyDown(Enum.KeyCode.D) then
        moveDirection = moveDirection + Camera.CFrame.RightVector
    end
    if UserInputService:IsKeyDown(Enum.KeyCode.Space) then
        moveDirection = moveDirection + Vector3.new(0, 1, 0)
    end
    if UserInputService:IsKeyDown(Enum.KeyCode.LeftShift) then
        moveDirection = moveDirection - Vector3.new(0, 1, 0)
    end
    
    flyBodyVelocity.Velocity = moveDirection * Settings.FlySpeed
    flyBodyGyro.CFrame = Camera.CFrame
end)

-- Character respawn handler
LocalPlayer.CharacterAdded:Connect(function(char)
    Character = char
    Humanoid = char:WaitForChild("Humanoid")
    RootPart = char:WaitForChild("HumanoidRootPart")
    
    if Settings.SpeedEnabled then
        Humanoid.WalkSpeed = Settings.WalkSpeed
    end
    if Settings.NoclipEnabled then
        StartNoclip()
    end
end)

print("[Fex] Movement script loaded!")
print("F = Fly | G = Speed | C = Noclip | V = Infinite Jump")`,
    usage: `**Controls:**
- **F** — Toggle fly (WASD + Space/Shift to move)
- **G** — Toggle speed boost (100 walkspeed)
- **C** — Toggle noclip
- **V** — Toggle infinite jump
- All settings adjustable in the Settings table at the top`,
  }),

  aimbot: (prompt) => ({
    intro: `Here's a complete aimbot script with FOV circle, prediction, team check, and smooth aiming.`,
    code: `-- Fex Scripts Aimbot
-- Category: Aimbot
-- Compatible: Synapse X, Script-Ware, KRNL, Fluxus, Hydrogen

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local Camera = workspace.CurrentCamera
local LocalPlayer = Players.LocalPlayer
local Mouse = LocalPlayer:GetMouse()

-- Settings
local Settings = {
    Enabled = false,
    ToggleKey = Enum.KeyCode.Q,
    AimKey = Enum.KeyCode.UserInputType.MouseButton2, -- Right click
    FOV = 200,
    ShowFOV = true,
    FOVColor = Color3.fromRGB(168, 85, 247),
    Smoothness = 0.15,
    Prediction = true,
    PredictionAmount = 0.165,
    TeamCheck = true,
    WallCheck = true,
    TargetPart = "Head", -- Head or HumanoidRootPart
    LockTarget = true,
    MaxDistance = 1000,
}

getgenv().FexAimbot = Settings

-- FOV Circle
local FOVCircle = Drawing.new("Circle")
FOVCircle.Thickness = 1.5
FOVCircle.NumSides = 64
FOVCircle.Radius = Settings.FOV
FOVCircle.Filled = false
FOVCircle.Color = Settings.FOVColor
FOVCircle.Visible = Settings.ShowFOV
FOVCircle.Transparency = 0.8

-- Target tracking
local CurrentTarget = nil
local IsAiming = false

local function GetClosestPlayer()
    local closest = nil
    local closestDist = Settings.FOV
    
    for _, player in pairs(Players:GetPlayers()) do
        if player == LocalPlayer then continue end
        if not player.Character then continue end
        
        local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
        if not humanoid or humanoid.Health <= 0 then continue end
        
        -- Team check
        if Settings.TeamCheck and player.Team == LocalPlayer.Team then
            continue
        end
        
        local targetPart = player.Character:FindFirstChild(Settings.TargetPart)
        if not targetPart then continue end
        
        local screenPos, onScreen = Camera:WorldToViewportPoint(targetPart.Position)
        if not onScreen then continue end
        
        -- Wall check
        if Settings.WallCheck then
            local rayParams = RaycastParams.new()
            rayParams.FilterType = Enum.RaycastFilterType.Exclude
            rayParams.FilterDescendantsInstances = {LocalPlayer.Character, player.Character}
            
            local origin = Camera.CFrame.Position
            local direction = (targetPart.Position - origin).Unit * Settings.MaxDistance
            local result = workspace:Raycast(origin, direction, rayParams)
            
            if result and result.Instance and not result.Instance:IsDescendantOf(player.Character) then
                continue
            end
        end
        
        local mousePos = UserInputService:GetMouseLocation()
        local screenPos2D = Vector2.new(screenPos.X, screenPos.Y)
        local dist = (screenPos2D - mousePos).Magnitude
        
        if dist < closestDist then
            closestDist = dist
            closest = player
        end
    end
    
    return closest
end

local function AimAt(target)
    if not target or not target.Character then return end
    
    local targetPart = target.Character:FindFirstChild(Settings.TargetPart)
    if not targetPart then return end
    
    local targetPos = targetPart.Position
    
    -- Prediction
    if Settings.Prediction then
        local rootPart = target.Character:FindFirstChild("HumanoidRootPart")
        if rootPart then
            targetPos = targetPos + (rootPart.Velocity * Settings.PredictionAmount)
        end
    end
    
    -- Smooth aim
    local currentCF = Camera.CFrame
    local targetCF = CFrame.new(currentCF.Position, targetPos)
    
    if Settings.Smoothness > 0 then
        Camera.CFrame = currentCF:Lerp(targetCF, Settings.Smoothness)
    else
        Camera.CFrame = targetCF
    end
end

-- Input handling
UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    
    if input.KeyCode == Settings.ToggleKey then
        Settings.Enabled = not Settings.Enabled
        if not Settings.Enabled then
            CurrentTarget = nil
        end
    end
end)

-- Mouse aim
UserInputService.InputBegan:Connect(function(input)
    if input.UserInputType == Settings.AimKey then
        IsAiming = true
    end
end)

UserInputService.InputEnded:Connect(function(input)
    if input.UserInputType == Settings.AimKey then
        IsAiming = false
        if not Settings.LockTarget then
            CurrentTarget = nil
        end
    end
end)

-- Render loop
RunService.RenderStepped:Connect(function()
    -- Update FOV circle position
    FOVCircle.Position = UserInputService:GetMouseLocation()
    FOVCircle.Radius = Settings.FOV
    FOVCircle.Visible = Settings.ShowFOV and Settings.Enabled
    FOVCircle.Color = Settings.FOVColor
    
    if not Settings.Enabled then return end
    
    -- Get target
    if not CurrentTarget or not CurrentTarget.Character then
        CurrentTarget = GetClosestPlayer()
    end
    
    -- Aim
    if IsAiming and CurrentTarget then
        AimAt(CurrentTarget)
    end
end)

print("[Fex] Aimbot loaded! Press Q to toggle, hold right-click to aim.")`,
    usage: `**Controls:**
- **Q** — Toggle aimbot on/off
- **Right Click (hold)** — Aim at closest target
- FOV circle shows your aim range
- Settings table at top for customization:
  - \`FOV\` — Aim range in pixels
  - \`Smoothness\` — 0 = snap, higher = smoother
  - \`Prediction\` — Lead moving targets
  - \`TeamCheck\` — Don't aim at teammates
  - \`WallCheck\` — Don't aim through walls`,
  }),

  combat: (prompt) => ({
    intro: `Here's a complete combat script with kill aura, auto parry, and hitbox expander.`,
    code: `-- Fex Scripts Combat
-- Category: Combat
-- Compatible: Synapse X, Script-Ware, KRNL, Fluxus, Hydrogen

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local LocalPlayer = Players.LocalPlayer

-- Settings
local Settings = {
    -- Kill Aura
    KillAuraEnabled = false,
    KillAuraKey = Enum.KeyCode.X,
    KillAuraRange = 25,
    KillAuraSpeed = 0.1, -- seconds between hits
    KillAuraTarget = "HumanoidRootPart",
    
    -- Auto Parry
    AutoParryEnabled = false,
    AutoParryKey = Enum.KeyCode.Z,
    ParryWindow = 0.3, -- seconds before attack to parry
    
    -- Hitbox Expander
    HitboxEnabled = false,
    HitboxKey = Enum.KeyCode.B,
    HitboxSize = Vector3.new(10, 10, 10),
    HitboxTransparency = 0.7,
    
    -- General
    TeamCheck = true,
    MaxDistance = 100,
}

getgenv().FexCombat = Settings

local lastKillAura = 0
local expandedParts = {}

-- ============ KILL AURA ============
local function KillAura()
    if not Settings.KillAuraEnabled then return end
    
    local now = tick()
    if now - lastKillAura < Settings.KillAuraSpeed then return end
    lastKillAura = now
    
    local character = LocalPlayer.Character
    if not character then return end
    local myRoot = character:FindFirstChild("HumanoidRootPart")
    if not myRoot then return end
    
    for _, player in pairs(Players:GetPlayers()) do
        if player == LocalPlayer then continue end
        if Settings.TeamCheck and player.Team == LocalPlayer.Team then continue end
        if not player.Character then continue end
        
        local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
        local targetPart = player.Character:FindFirstChild(Settings.KillAuraTarget)
        
        if not humanoid or not targetPart then continue end
        if humanoid.Health <= 0 then continue end
        
        local dist = (targetPart.Position - myRoot.Position).Magnitude
        if dist > Settings.KillAuraRange then continue end
        
        -- Fire remote for damage (generic - adapt per game)
        pcall(function()
            -- Try common remote patterns
            for _, remote in pairs(game:GetDescendants()) do
                if remote:IsA("RemoteEvent") and string.find(string.lower(remote.Name), "hit") then
                    remote:FireServer(targetPart, targetPart.Position, player)
                    break
                end
            end
        end)
    end
end

-- ============ AUTO PARRY ============
local parryConnection
local function StartAutoParry()
    if parryConnection then return end
    
    parryConnection = RunService.Heartbeat:Connect(function()
        if not Settings.AutoParryEnabled then return end
        
        pcall(function()
            -- Detect incoming attacks and fire parry remote
            for _, remote in pairs(game:GetService("ReplicatedStorage"):GetDescendants()) do
                if remote:IsA("RemoteEvent") and string.find(string.lower(remote.Name), "parry") then
                    remote:FireServer()
                end
            end
            
            -- Also try namecall hook for parry
            for _, player in pairs(Players:GetPlayers()) do
                if player == LocalPlayer then continue end
                if not player.Character then continue end
                
                local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
                if not humanoid then continue end
                
                -- Check if player is attacking (animation check)
                local animator = humanoid:FindFirstChildOfClass("Animator")
                if animator then
                    for _, track in pairs(animator:GetPlayingAnimationTracks()) do
                        local animId = tostring(track.Animation and track.Animation.AnimationId or "")
                        if string.find(animId, "attack") or string.find(animId, "slash") or string.find(animId, "swing") then
                            -- Fire parry
                            pcall(function()
                                local parryRemote = game:GetService("ReplicatedStorage"):FindFirstChild("ParryEvent", true)
                                if parryRemote then
                                    parryRemote:FireServer()
                                end
                            end)
                        end
                    end
                end
            end
        end)
    end)
end

local function StopAutoParry()
    if parryConnection then
        parryConnection:Disconnect()
        parryConnection = nil
    end
end

-- ============ HITBOX EXPANDER ============
local function ExpandHitbox()
    if not Settings.HitboxEnabled then
        -- Reset all expanded parts
        for part, original in pairs(expandedParts) do
            if part and part.Parent then
                part.Size = original.Size
                part.Transparency = original.Transparency
            end
        end
        expandedParts = {}
        return
    end
    
    for _, player in pairs(Players:GetPlayers()) do
        if player == LocalPlayer then continue end
        if Settings.TeamCheck and player.Team == LocalPlayer.Team then continue end
        if not player.Character then continue end
        
        for _, part in pairs(player.Character:GetChildren()) do
            if part:IsA("BasePart") and part.Name ~= "HumanoidRootPart" then
                if not expandedParts[part] then
                    expandedParts[part] = {
                        Size = part.Size,
                        Transparency = part.Transparency,
                    }
                end
                part.Size = Settings.HitboxSize
                part.Transparency = Settings.HitboxTransparency
            end
        end
    end
end

-- ============ INPUT HANDLER ============
UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    
    if input.KeyCode == Settings.KillAuraKey then
        Settings.KillAuraEnabled = not Settings.KillAuraEnabled
    end
    
    if input.KeyCode == Settings.AutoParryKey then
        Settings.AutoParryEnabled = not Settings.AutoParryEnabled
        if Settings.AutoParryEnabled then
            StartAutoParry()
        else
            StopAutoParry()
        end
    end
    
    if input.KeyCode == Settings.HitboxKey then
        Settings.HitboxEnabled = not Settings.HitboxEnabled
        ExpandHitbox()
    end
end)

-- ============ MAIN LOOP ============
RunService.Heartbeat:Connect(function()
    KillAura()
    if Settings.HitboxEnabled then
        ExpandHitbox()
    end
end)

print("[Fex] Combat script loaded!")
print("X = Kill Aura | Z = Auto Parry | B = Hitbox Expander")`,
    usage: `**Controls:**
- **X** — Toggle kill aura (auto-hits nearby enemies)
- **Z** — Toggle auto parry (blocks incoming attacks)
- **B** — Toggle hitbox expander (makes enemy hitboxes larger)

**Notes:**
- Kill aura range and speed adjustable in Settings
- Hitbox size and transparency adjustable
- Team check enabled by default
- Some games may need remote name adjustments`,
  }),

  autofarm: (prompt) => ({
    intro: `Here's a complete auto farm script with GUI toggle and pathfinding.`,
    code: `-- Fex Scripts Auto Farm
-- Category: Auto Farm
-- Compatible: Synapse X, Script-Ware, KRNL, Fluxus, Hydrogen

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local PathfindingService = game:GetService("PathfindingService")
local TweenService = game:GetService("TweenService")
local LocalPlayer = Players.LocalPlayer

-- Settings
local Settings = {
    Enabled = false,
    ToggleKey = Enum.KeyCode.P,
    FarmRange = 500,
    CollectDelay = 0.5,
    UsePathfinding = true,
    TPInstantly = false, -- Teleport instead of walking
    TPSpeed = 5, -- studs per frame when TPing
    AutoCollect = true,
    AutoKill = false,
    KillRange = 30,
}

getgenv().FexAutoFarm = Settings

-- State
local farming = false
local currentTarget = nil

-- ============ GUI ============
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "Fex_AutoFarm"
ScreenGui.ResetOnSpawn = false
ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling

local Main = Instance.new("Frame")
Main.Name = "Main"
Main.Size = UDim2.new(0, 220, 0, 160)
Main.Position = UDim2.new(0.5, -110, 0, 20)
Main.BackgroundColor3 = Color3.fromRGB(20, 20, 25)
Main.BorderSizePixel = 0
Main.Active = true
Main.Draggable = true
Main.Parent = ScreenGui

local UICorner = Instance.new("UICorner")
UICorner.CornerRadius = UDim.new(0, 10)
UICorner.Parent = Main

local UIStroke = Instance.new("UIStroke")
UIStroke.Color = Color3.fromRGB(168, 85, 247)
UIStroke.Thickness = 1.5
UIStroke.Transparency = 0.3
UIStroke.Parent = Main

local Title = Instance.new("TextLabel")
Title.Size = UDim2.new(1, 0, 0, 35)
Title.BackgroundColor3 = Color3.fromRGB(30, 30, 35)
Title.BorderSizePixel = 0
Title.Text = "Fex Auto Farm"
Title.TextColor3 = Color3.fromRGB(255, 255, 255)
Title.Font = Enum.Font.GothamBold
Title.TextSize = 14
Title.Parent = Main

local TitleCorner = Instance.new("UICorner")
TitleCorner.CornerRadius = UDim.new(0, 10)
TitleCorner.Parent = Title

local StatusLabel = Instance.new("TextLabel")
StatusLabel.Name = "Status"
StatusLabel.Size = UDim2.new(1, -20, 0, 25)
StatusLabel.Position = UDim2.new(0, 10, 0, 45)
StatusLabel.BackgroundTransparency = 1
StatusLabel.Text = "Status: OFF"
StatusLabel.TextColor3 = Color3.fromRGB(255, 80, 80)
StatusLabel.Font = Enum.Font.Gotham
StatusLabel.TextSize = 13
StatusLabel.TextXAlignment = Enum.TextXAlignment.Left
StatusLabel.Parent = Main

local TargetLabel = Instance.new("TextLabel")
TargetLabel.Name = "Target"
TargetLabel.Size = UDim2.new(1, -20, 0, 25)
TargetLabel.Position = UDim2.new(0, 10, 0, 70)
TargetLabel.BackgroundTransparency = 1
TargetLabel.Text = "Target: None"
TargetLabel.TextColor3 = Color3.fromRGB(180, 180, 180)
TargetLabel.Font = Enum.Font.Gotham
TargetLabel.TextSize = 12
TargetLabel.TextXAlignment = Enum.TextXAlignment.Left
TargetLabel.Parent = Main

local ToggleButton = Instance.new("TextButton")
ToggleButton.Name = "Toggle"
ToggleButton.Size = UDim2.new(1, -20, 0, 35)
ToggleButton.Position = UDim2.new(0, 10, 0, 110)
ToggleButton.BackgroundColor3 = Color3.fromRGB(168, 85, 247)
ToggleButton.BorderSizePixel = 0
ToggleButton.Text = "Start Farming"
ToggleButton.TextColor3 = Color3.fromRGB(255, 255, 255)
ToggleButton.Font = Enum.Font.GothamBold
ToggleButton.TextSize = 14
ToggleButton.Parent = Main

local BtnCorner = Instance.new("UICorner")
BtnCorner.CornerRadius = UDim.new(0, 8)
BtnCorner.Parent = ToggleButton

ScreenGui.Parent = game:GetService("CoreGui")

-- ============ FUNCTIONS ============
local function GetNearestItem()
    local character = LocalPlayer.Character
    if not character then return nil end
    local myRoot = character:FindFirstChild("HumanoidRootPart")
    if not myRoot then return nil end
    
    local nearest = nil
    local nearestDist = Settings.FarmRange
    
    -- Search for common farmable items
    local searchNames = {"Orb", "Coin", "Gem", "Item", "Drop", "Collect", "Pickup", "Fruit", "Chest"}
    
    for _, obj in pairs(workspace:GetDescendants()) do
        if obj:IsA("BasePart") or obj:IsA("Model") then
            for _, name in pairs(searchNames) do
                if string.find(obj.Name, name) then
                    local pos = obj:IsA("Model") and obj:GetPivot().Position or obj.Position
                    local dist = (pos - myRoot.Position).Magnitude
                    if dist < nearestDist then
                        nearestDist = dist
                        nearest = obj
                    end
                end
            end
        end
    end
    
    return nearest
end

local function MoveTo(target)
    local character = LocalPlayer.Character
    if not character then return end
    local myRoot = character:FindFirstChild("HumanoidRootPart")
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    if not myRoot or not humanoid then return end
    
    local targetPos = target:IsA("Model") and target:GetPivot().Position or target.Position
    
    if Settings.TPInstantly then
        -- Teleport in steps
        local direction = (targetPos - myRoot.Position).Unit
        local distance = (targetPos - myRoot.Position).Magnitude
        local steps = math.ceil(distance / Settings.TPSpeed)
        
        for i = 1, steps do
            local newPos = myRoot.Position + (direction * Settings.TPSpeed)
            myRoot.CFrame = CFrame.new(newPos)
            RunService.Heartbeat:Wait()
        end
    else
        -- Walk using pathfinding
        if Settings.UsePathfinding then
            local path = PathfindingService:CreatePath({
                AgentRadius = 2,
                AgentHeight = 5,
                AgentCanJump = true,
            })
            
            local success = pcall(function()
                path:ComputeAsync(myRoot.Position, targetPos)
            end)
            
            if success and path.Status == Enum.PathStatus.Success then
                local waypoints = path:GetWaypoints()
                for _, waypoint in pairs(waypoints) do
                    if waypoint.Action == Enum.PathWaypointAction.Jump then
                        humanoid.Jump = true
                    end
                    humanoid:MoveTo(waypoint.Position)
                    humanoid.MoveToFinished:Wait()
                end
            else
                humanoid:MoveTo(targetPos)
            end
        else
            humanoid:MoveTo(targetPos)
        end
    end
end

local function CollectItem(item)
    if not item or not item.Parent then return end
    
    -- Try clicking/firing remotes
    pcall(function()
        if item:IsA("ClickDetector") then
            fireclickdetector(item)
        end
        
        -- Try touching
        local character = LocalPlayer.Character
        if character then
            local myRoot = character:FindFirstChild("HumanoidRootPart")
            if myRoot and item:IsA("BasePart") then
                myRoot.CFrame = item.CFrame
            elseif myRoot and item:IsA("Model") then
                myRoot.CFrame = item:GetPivot()
            end
        end
        
        -- Fire collect remotes
        for _, remote in pairs(game:GetDescendants()) do
            if remote:IsA("RemoteEvent") then
                local name = string.lower(remote.Name)
                if string.find(name, "collect") or string.find(name, "pickup") or string.find(name, "grab") then
                    remote:FireServer(item)
                end
            end
        end
    end)
end

-- ============ MAIN LOOP ============
local function FarmLoop()
    while farming and Settings.Enabled do
        local item = GetNearestItem()
        
        if item then
            currentTarget = item
            StatusLabel.Text = "Status: Moving..."
            StatusLabel.TextColor3 = Color3.fromRGB(255, 200, 0)
            TargetLabel.Text = "Target: " .. item.Name
            
            MoveTo(item)
            task.wait(Settings.CollectDelay)
            CollectItem(item)
            task.wait(0.2)
        else
            currentTarget = nil
            StatusLabel.Text = "Status: Searching..."
            StatusLabel.TextColor3 = Color3.fromRGB(100, 200, 255)
            TargetLabel.Text = "Target: None"
            task.wait(1)
        end
    end
end

-- ============ TOGGLE ============
local function ToggleFarm()
    Settings.Enabled = not Settings.Enabled
    
    if Settings.Enabled then
        farming = true
        ToggleButton.Text = "Stop Farming"
        ToggleButton.BackgroundColor3 = Color3.fromRGB(239, 68, 68)
        StatusLabel.Text = "Status: Active"
        StatusLabel.TextColor3 = Color3.fromRGB(80, 255, 80)
        task.spawn(FarmLoop)
    else
        farming = false
        ToggleButton.Text = "Start Farming"
        ToggleButton.BackgroundColor3 = Color3.fromRGB(168, 85, 247)
        StatusLabel.Text = "Status: OFF"
        StatusLabel.TextColor3 = Color3.fromRGB(255, 80, 80)
        TargetLabel.Text = "Target: None"
    end
end

ToggleButton.MouseButton1Click:Connect(ToggleFarm)

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.KeyCode == Settings.ToggleKey then
        ToggleFarm()
    end
end)

print("[Fex] Auto Farm loaded! Press P or click GUI to toggle.")`,
    usage: `**Controls:**
- **P** — Toggle auto farm on/off
- GUI button also toggles
- GUI is draggable

**Features:**
- Auto finds items (orbs, coins, gems, fruits, chests)
- Pathfinding navigation
- Optional teleport mode
- Real-time status display
- Adjustable range and speed`,
  }),

  gui: (prompt) => ({
    intro: `Here's a modern script hub GUI with tabs, settings, and a clean design.`,
    code: `-- Fex Scripts Hub GUI
-- Category: GUI Scripts
-- Compatible: Synapse X, Script-Ware, KRNL, Fluxus, Hydrogen

local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local LocalPlayer = Players.LocalPlayer

-- ============ GUI CREATION ============
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "Fex_Hub"
ScreenGui.ResetOnSpawn = false
ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
ScreenGui.Parent = game:GetService("CoreGui")

-- Main Frame
local Main = Instance.new("Frame")
Main.Name = "Main"
Main.Size = UDim2.new(0, 520, 0, 380)
Main.Position = UDim2.new(0.5, -260, 0.5, -190)
Main.BackgroundColor3 = Color3.fromRGB(15, 15, 20)
Main.BorderSizePixel = 0
Main.Active = true
Main.Draggable = true
Main.Parent = ScreenGui

local MainCorner = Instance.new("UICorner")
MainCorner.CornerRadius = UDim.new(0, 12)
MainCorner.Parent = Main

local MainStroke = Instance.new("UIStroke")
MainStroke.Color = Color3.fromRGB(168, 85, 247)
MainStroke.Thickness = 1.5
MainStroke.Transparency = 0.4
MainStroke.Parent = Main

-- Header
local Header = Instance.new("Frame")
Header.Name = "Header"
Header.Size = UDim2.new(1, 0, 0, 45)
Header.BackgroundColor3 = Color3.fromRGB(20, 20, 28)
Header.BorderSizePixel = 0
Header.Parent = Main

local HeaderCorner = Instance.new("UICorner")
HeaderCorner.CornerRadius = UDim.new(0, 12)
HeaderCorner.Parent = Header

local HeaderFix = Instance.new("Frame")
HeaderFix.Size = UDim2.new(1, 0, 0, 15)
HeaderFix.Position = UDim2.new(0, 0, 1, -15)
HeaderFix.BackgroundColor3 = Color3.fromRGB(20, 20, 28)
HeaderFix.BorderSizePixel = 0
HeaderFix.Parent = Header

local Title = Instance.new("TextLabel")
Title.Size = UDim2.new(0, 200, 1, 0)
Title.Position = UDim2.new(0, 15, 0, 0)
Title.BackgroundTransparency = 1
Title.Text = "⚡ Fex Hub"
Title.TextColor3 = Color3.fromRGB(168, 85, 247)
Title.Font = Enum.Font.GothamBold
Title.TextSize = 16
Title.TextXAlignment = Enum.TextXAlignment.Left
Title.Parent = Header

local CloseBtn = Instance.new("TextButton")
CloseBtn.Name = "Close"
CloseBtn.Size = UDim2.new(0, 30, 0, 30)
CloseBtn.Position = UDim2.new(1, -40, 0.5, -15)
CloseBtn.BackgroundColor3 = Color3.fromRGB(239, 68, 68)
CloseBtn.Text = "✕"
CloseBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
CloseBtn.Font = Enum.Font.GothamBold
CloseBtn.TextSize = 14
CloseBtn.Parent = Header

local CloseCorner = Instance.new("UICorner")
CloseCorner.CornerRadius = UDim.new(0, 6)
CloseCorner.Parent = CloseBtn

-- Sidebar (Tabs)
local Sidebar = Instance.new("Frame")
Sidebar.Name = "Sidebar"
Sidebar.Size = UDim2.new(0, 140, 1, -55)
Sidebar.Position = UDim2.new(0, 0, 0, 50)
Sidebar.BackgroundColor3 = Color3.fromRGB(18, 18, 24)
Sidebar.BorderSizePixel = 0
Sidebar.Parent = Main

local TabLayout = Instance.new("UIListLayout")
TabLayout.Padding = UDim.new(0, 4)
TabLayout.SortOrder = Enum.SortOrder.LayoutOrder
TabLayout.Padding = UDim.new(0, 2)
TabLayout.Parent = Sidebar

-- Content Area
local Content = Instance.new("Frame")
Content.Name = "Content"
Content.Size = UDim2.new(1, -150, 1, -55)
Content.Position = UDim2.new(0, 145, 0, 50)
Content.BackgroundTransparency = 1
Content.Parent = Main

-- Tab definitions
local Tabs = {
    {Name = "ESP", Icon = "👁️", Order = 1},
    {Name = "Combat", Icon = "⚔️", Order = 2},
    {Name = "Movement", Icon = "💨", Order = 3},
    {Name = "Misc", Icon = "🔧", Order = 4},
    {Name = "Settings", Icon = "⚙️", Order = 5},
}

local TabButtons = {}
local TabPages = {}
local CurrentTab = nil

-- Create tabs
for _, tab in pairs(Tabs) do
    -- Tab button
    local TabBtn = Instance.new("TextButton")
    TabBtn.Name = tab.Name .. "Tab"
    TabBtn.Size = UDim2.new(1, -10, 0, 35)
    TabBtn.BackgroundColor3 = Color3.fromRGB(25, 25, 32)
    TabBtn.BorderSizePixel = 0
    TabBtn.Text = "  " .. tab.Icon .. "  " .. tab.Name
    TabBtn.TextColor3 = Color3.fromRGB(150, 150, 160)
    TabBtn.Font = Enum.Font.GothamMedium
    TabBtn.TextSize = 13
    TabBtn.TextXAlignment = Enum.TextXAlignment.Left
    TabBtn.LayoutOrder = tab.Order
    TabBtn.AutoButtonColor = false
    TabBtn.Parent = Sidebar
    
    local TabCorner = Instance.new("UICorner")
    TabCorner.CornerRadius = UDim.new(0, 8)
    TabCorner.Parent = TabBtn
    
    -- Tab page
    local TabPage = Instance.new("ScrollingFrame")
    TabPage.Name = tab.Name .. "Page"
    TabPage.Size = UDim2.new(1, 0, 1, 0)
    TabPage.BackgroundTransparency = 1
    TabPage.BorderSizePixel = 0
    TabPage.ScrollBarThickness = 3
    TabPage.ScrollBarImageColor3 = Color3.fromRGB(168, 85, 247)
    TabPage.Visible = false
    TabPage.Parent = Content
    
    local PageLayout = Instance.new("UIListLayout")
    PageLayout.Padding = UDim.new(0, 8)
    PageLayout.SortOrder = Enum.SortOrder.LayoutOrder
    PageLayout.Parent = TabPage
    
    TabButtons[tab.Name] = TabBtn
    TabPages[tab.Name] = TabPage
end

-- Toggle function
local function CreateToggle(parent, name, default, order, callback)
    local Container = Instance.new("Frame")
    Container.Size = UDim2.new(1, -10, 0, 40)
    Container.BackgroundColor3 = Color3.fromRGB(22, 22, 30)
    Container.BorderSizePixel = 0
    Container.LayoutOrder = order
    Container.Parent = parent
    
    local CCorner = Instance.new("UICorner")
    CCorner.CornerRadius = UDim.new(0, 8)
    CCorner.Parent = Container
    
    local Label = Instance.new("TextLabel")
    Label.Size = UDim2.new(1, -60, 1, 0)
    Label.Position = UDim2.new(0, 12, 0, 0)
    Label.BackgroundTransparency = 1
    Label.Text = name
    Label.TextColor3 = Color3.fromRGB(200, 200, 210)
    Label.Font = Enum.Font.Gotham
    Label.TextSize = 13
    Label.TextXAlignment = Enum.TextXAlignment.Left
    Label.Parent = Container
    
    local Toggle = Instance.new("TextButton")
    Toggle.Size = UDim2.new(0, 40, 0, 22)
    Toggle.Position = UDim2.new(1, -50, 0.5, -11)
    Toggle.BackgroundColor3 = default and Color3.fromRGB(168, 85, 247) or Color3.fromRGB(50, 50, 60)
    Toggle.Text = ""
    Toggle.AutoButtonColor = false
    Toggle.Parent = Container
    
    local TCorner = Instance.new("UICorner")
    TCorner.CornerRadius = UDim.new(1, 0)
    TCorner.Parent = Toggle
    
    local Circle = Instance.new("Frame")
    Circle.Size = UDim2.new(0, 16, 0, 16)
    Circle.Position = default and UDim2.new(1, -19, 0.5, -8) or UDim2.new(0, 3, 0.5, -8)
    Circle.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
    Circle.BorderSizePixel = 0
    Circle.Parent = Toggle
    
    local CircleCorner = Instance.new("UICorner")
    CircleCorner.CornerRadius = UDim.new(1, 0)
    CircleCorner.Parent = Circle
    
    local enabled = default
    Toggle.MouseButton1Click:Connect(function()
        enabled = not enabled
        TweenService:Create(Toggle, TweenInfo.new(0.2), {
            BackgroundColor3 = enabled and Color3.fromRGB(168, 85, 247) or Color3.fromRGB(50, 50, 60)
        }):Play()
        TweenService:Create(Circle, TweenInfo.new(0.2), {
            Position = enabled and UDim2.new(1, -19, 0.5, -8) or UDim2.new(0, 3, 0.5, -8)
        }):Play()
        if callback then callback(enabled) end
    end)
    
    return Toggle
end

-- Populate tabs with toggles
CreateToggle(TabPages["ESP"], "Player ESP", false, 1, function(v)
    print("Player ESP:", v)
end)
CreateToggle(TabPages["ESP"], "Item ESP", false, 2, function(v)
    print("Item ESP:", v)
end)
CreateToggle(TabPages["ESP"], "Tracers", false, 3, function(v)
    print("Tracers:", v)
end)
CreateToggle(TabPages["ESP"], "Chams", false, 4, function(v)
    print("Chams:", v)
end)

CreateToggle(TabPages["Combat"], "Kill Aura", false, 1, function(v)
    print("Kill Aura:", v)
end)
CreateToggle(TabPages["Combat"], "Auto Parry", false, 2, function(v)
    print("Auto Parry:", v)
end)
CreateToggle(TabPages["Combat"], "Hitbox Expander", false, 3, function(v)
    print("Hitbox:", v)
end)

CreateToggle(TabPages["Movement"], "Fly", false, 1, function(v)
    print("Fly:", v)
end)
CreateToggle(TabPages["Movement"], "Speed", false, 2, function(v)
    print("Speed:", v)
end)
CreateToggle(TabPages["Movement"], "Noclip", false, 3, function(v)
    print("Noclip:", v)
end)
CreateToggle(TabPages["Movement"], "Infinite Jump", false, 4, function(v)
    print("Infinite Jump:", v)
end)

CreateToggle(TabPages["Misc"], "Anti AFK", false, 1, function(v)
    print("Anti AFK:", v)
end)
CreateToggle(TabPages["Misc"], "Fullbright", false, 2, function(v)
    print("Fullbright:", v)
end)

CreateToggle(TabPages["Settings"], "Team Check", true, 1, function(v)
    print("Team Check:", v)
end)
CreateToggle(TabPages["Settings"], "Wall Check", true, 2, function(v)
    print("Wall Check:", v)
end)

-- Tab switching
local function SelectTab(tabName)
    if CurrentTab == tabName then return end
    
    -- Deselect old
    if CurrentTab and TabButtons[CurrentTab] then
        TabButtons[CurrentTab].BackgroundColor3 = Color3.fromRGB(25, 25, 32)
        TabButtons[CurrentTab].TextColor3 = Color3.fromRGB(150, 150, 160)
    end
    
    -- Select new
    CurrentTab = tabName
    TabButtons[tabName].BackgroundColor3 = Color3.fromRGB(168, 85, 247)
    TabButtons[tabName].TextColor3 = Color3.fromRGB(255, 255, 255)
    
    -- Show/hide pages
    for name, page in pairs(TabPages) do
        page.Visible = (name == tabName)
    end
end

-- Connect tab buttons
for name, btn in pairs(TabButtons) do
    btn.MouseButton1Click:Connect(function()
        SelectTab(name)
    end)
end

-- Close button
CloseBtn.MouseButton1Click:Connect(function()
    ScreenGui:Destroy()
end)

-- Toggle GUI with key
UserInputService.InputBegan:Connect(function(input, gp)
    if gp then return end
    if input.KeyCode == Enum.KeyCode.RightShift then
        ScreenGui.Enabled = not ScreenGui.Enabled
    end
end)

-- Select first tab
SelectTab("ESP")

print("[Fex] Script Hub loaded! RightShift to toggle GUI.")`,
    usage: `**Controls:**
- **RightShift** — Toggle GUI visibility
- Click tabs to switch sections
- Toggle switches for each feature
- GUI is draggable
- Close button (red ✕) to destroy GUI`,
  }),

  utility: (prompt) => ({
    intro: `Here's a utility script with anti-AFK, server hop, and freecam.`,
    code: `-- Fex Scripts Utility
-- Category: Utility
-- Compatible: Synapse X, Script-Ware, KRNL, Fluxus, Hydrogen

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local TeleportService = game:GetService("TeleportService")
local VirtualUser = game:GetService("VirtualUser")
local LocalPlayer = Players.LocalPlayer
local Camera = workspace.CurrentCamera

-- Settings
local Settings = {
    AntiAFK = false,
    AntiAFKKey = Enum.KeyCode.F1,
    
    Freecam = false,
    FreecamKey = Enum.KeyCode.F2,
    FreecamSpeed = 2,
    FreecamShiftMultiplier = 3,
    
    ServerHop = false,
    ServerHopKey = Enum.KeyCode.F3,
    
    Rejoin = false,
    RejoinKey = Enum.KeyCode.F4,
}

getgenv().FexUtility = Settings

-- ============ ANTI-AFK ============
local antiAFKConnection
local function StartAntiAFK()
    if antiAFKConnection then return end
    antiAFKConnection = VirtualUser:GetPlayers():Connect(function()
        VirtualUser:CaptureController()
        VirtualUser:ClickButton2(Vector2.new(0, 0))
    end)
    
    -- Also spoof movement
    local moveConnection = RunService.Heartbeat:Connect(function()
        if not Settings.AntiAFK then
            moveConnection:Disconnect()
            return
        end
        LocalPlayer.Idled:Connect(function()
            VirtualUser:CaptureController()
            VirtualUser:ClickButton2(Vector2.new())
        end)
    end)
end

local function StopAntiAFK()
    if antiAFKConnection then
        antiAFKConnection:Disconnect()
        antiAFKConnection = nil
    end
end

-- ============ FREECAM ============
local freecamCF = CFrame.new()
local freecamConnection
local freecamActive = false

local function StartFreecam()
    if freecamActive then return end
    freecamActive = true
    freecamCF = Camera.CFrame
    
    local character = LocalPlayer.Character
    if character then
        local humanoid = character:FindFirstChildOfClass("Humanoid")
        if humanoid then
            humanoid.PlatformStand = true
        end
    end
    
    freecamConnection = RunService.RenderStepped:Connect(function()
        if not freecamActive then return end
        
        local speed = Settings.FreecamSpeed
        if UserInputService:IsKeyDown(Enum.KeyCode.LeftShift) then
            speed = speed * Settings.FreecamShiftMultiplier
        end
        
        local moveDir = Vector3.new(0, 0, 0)
        
        if UserInputService:IsKeyDown(Enum.KeyCode.W) then
            moveDir = moveDir + Camera.CFrame.LookVector
        end
        if UserInputService:IsKeyDown(Enum.KeyCode.S) then
            moveDir = moveDir - Camera.CFrame.LookVector
        end
        if UserInputService:IsKeyDown(Enum.KeyCode.A) then
            moveDir = moveDir - Camera.CFrame.RightVector
        end
        if UserInputService:IsKeyDown(Enum.KeyCode.D) then
            moveDir = moveDir + Camera.CFrame.RightVector
        end
        if UserInputService:IsKeyDown(Enum.KeyCode.Space) then
            moveDir = moveDir + Vector3.new(0, 1, 0)
        end
        if UserInputService:IsKeyDown(Enum.KeyCode.LeftControl) then
            moveDir = moveDir - Vector3.new(0, 1, 0)
        end
        
        freecamCF = freecamCF + (moveDir * speed)
        Camera.CFrame = freecamCF
    end)
end

local function StopFreecam()
    if not freecamActive then return end
    freecamActive = false
    
    if freecamConnection then
        freecamConnection:Disconnect()
        freecamConnection = nil
    end
    
    local character = LocalPlayer.Character
    if character then
        local humanoid = character:FindFirstChildOfClass("Humanoid")
        if humanoid then
            humanoid.PlatformStand = false
        end
    end
end

-- ============ SERVER HOP ============
local function ServerHop()
    local placeId = game.PlaceId
    local servers = {}
    
    -- Get server list
    local success, result = pcall(function()
        local url = "https://games.roblox.com/v1/games/" .. placeId .. "/servers/Public?sortOrder=Asc&limit=100"
        local http = request or syn.request or http_request
        local response = http({Url = url, Method = "GET"})
        return game:GetService("HttpService"):JSONDecode(response.Body)
    end)
    
    if success and result and result.data then
        for _, server in pairs(result.data) do
            if server.id ~= game.JobId and server.playing < server.maxPlayers then
                table.insert(servers, {id = server.id, players = server.playing})
            end
        end
        
        -- Sort by player count (lowest first)
        table.sort(servers, function(a, b) return a.players < b.players end)
        
        if #servers > 0 then
            TeleportService:TeleportToPlaceInstance(placeId, servers[1].id, LocalPlayer)
        else
            warn("[Fex] No available servers found")
        end
    else
        warn("[Fex] Failed to fetch server list")
    end
end

-- ============ REJOIN ============
local function Rejoin()
    TeleportService:Teleport(game.PlaceId, LocalPlayer)
end

-- ============ INPUT HANDLER ============
UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    
    if input.KeyCode == Settings.AntiAFKKey then
        Settings.AntiAFK = not Settings.AntiAFK
        if Settings.AntiAFK then
            StartAntiAFK()
            print("[Fex] Anti-AFK enabled")
        else
            StopAntiAFK()
            print("[Fex] Anti-AFK disabled")
        end
    end
    
    if input.KeyCode == Settings.FreecamKey then
        Settings.Freecam = not Settings.Freecam
        if Settings.Freecam then
            StartFreecam()
            print("[Fex] Freecam enabled (WASD + Space/Ctrl)")
        else
            StopFreecam()
            print("[Fex] Freecam disabled")
        end
    end
    
    if input.KeyCode == Settings.ServerHopKey then
        ServerHop()
    end
    
    if input.KeyCode == Settings.RejoinKey then
        Rejoin()
    end
end)

print("[Fex] Utility script loaded!")
print("F1 = Anti-AFK | F2 = Freecam | F3 = Server Hop | F4 = Rejoin")`,
    usage: `**Controls:**
- **F1** — Toggle anti-AFK (prevents idle kicks)
- **F2** — Toggle freecam (WASD + Space/Ctrl to move, Shift for speed)
- **F3** — Server hop to lowest-population server
- **F4** — Rejoin current server`,
  }),

  game: (prompt) => ({
    intro: `Here's a game-specific script. Adapt the remote names to match your target game.`,
    code: `-- Fex Scripts Game
-- Category: Game Specific
-- Compatible: Synapse X, Script-Ware, KRNL, Fluxus, Hydrogen
-- NOTE: Adapt remote names to your target game

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local LocalPlayer = Players.LocalPlayer

-- Settings
local Settings = {
    AutoFarm = false,
    AutoFarmKey = Enum.KeyCode.F5,
    FarmRange = 500,
    
    ESP = false,
    ESPKey = Enum.KeyCode.F6,
    
    AutoCollect = true,
    AutoEquip = true,
    
    -- Game-specific settings
    TargetItem = "Fruit", -- Change based on game
    TargetNPC = nil,
}

getgenv().FexGame = Settings

-- ============ UTILITY FUNCTIONS ============
local function GetRemote(name)
    for _, remote in pairs(ReplicatedStorage:GetDescendants()) do
        if remote:IsA("RemoteEvent") and string.find(string.lower(remote.Name), string.lower(name)) then
            return remote
        end
    end
    for _, remote in pairs(game:GetService("ReplicatedFirst"):GetDescendants()) do
        if remote:IsA("RemoteEvent") and string.find(string.lower(remote.Name), string.lower(name)) then
            return remote
        end
    end
    return nil
end

local function GetFunction(name)
    for _, remote in pairs(ReplicatedStorage:GetDescendants()) do
        if remote:IsA("RemoteFunction") and string.find(string.lower(remote.Name), string.lower(name)) then
            return remote
        end
    end
    return nil
end

local function FindItems(name)
    local items = {}
    for _, obj in pairs(workspace:GetDescendants()) do
        if (obj:IsA("BasePart") or obj:IsA("Model")) and string.find(string.lower(obj.Name), string.lower(name)) then
            table.insert(items, obj)
        end
    end
    return items
end

local function GetCharacter()
    return LocalPlayer.Character
end

local function GetRootPart()
    local char = GetCharacter()
    return char and char:FindFirstChild("HumanoidRootPart")
end

local function DistanceFrom(pos)
    local root = GetRootPart()
    if not root then return math.huge end
    return (pos - root.Position).Magnitude
end

-- ============ AUTO FARM ============
local farming = false

local function FindNearestTarget()
    local items = FindItems(Settings.TargetItem)
    local nearest = nil
    local nearestDist = Settings.FarmRange
    
    for _, item in pairs(items) do
        local pos = item:IsA("Model") and item:GetPivot().Position or item.Position
        local dist = DistanceFrom(pos)
        if dist < nearestDist then
            nearestDist = dist
            nearest = item
        end
    end
    
    return nearest
end

local function FarmLoop()
    while farming and Settings.AutoFarm do
        local target = FindNearestTarget()
        
        if target then
            local pos = target:IsA("Model") and target:GetPivot().Position or target.Position
            local root = GetRootPart()
            
            if root then
                -- Teleport to target
                root.CFrame = CFrame.new(pos)
                task.wait(0.1)
                
                -- Fire collect/pickup remotes
                local collectRemote = GetRemote("collect") or GetRemote("pickup") or GetRemote("grab")
                if collectRemote then
                    pcall(function()
                        collectRemote:FireServer(target)
                    end)
                end
                
                -- Try clicking
                for _, detector in pairs(target:GetDescendants()) do
                    if detector:IsA("ClickDetector") then
                        fireclickdetector(detector)
                    end
                end
                
                task.wait(Settings.AutoCollect and 0.3 or 0.1)
            end
        else
            task.wait(0.5)
        end
    end
end

-- ============ ESP (Simple) ============
local espObjects = {}

local function CreateESP(player)
    if player == LocalPlayer then return end
    
    local highlight = Instance.new("Highlight")
    highlight.Name = "Fex_ESP"
    highlight.FillColor = Color3.fromRGB(168, 85, 247)
    highlight.FillTransparency = 0.7
    highlight.OutlineColor = Color3.fromRGB(168, 85, 247)
    highlight.OutlineTransparency = 0
    highlight.DepthMode = Enum.HighlightDepthMode.AlwaysOnTop
    highlight.Adornee = player.Character
    highlight.Parent = player.Character
    
    espObjects[player] = highlight
end

local function RemoveESP(player)
    if espObjects[player] then
        espObjects[player]:Destroy()
        espObjects[player] = nil
    end
end

local function ToggleESP()
    Settings.ESP = not Settings.ESP
    
    if Settings.ESP then
        for _, player in pairs(Players:GetPlayers()) do
            if player.Character then
                pcall(CreateESP, player)
            end
        end
    else
        for player, _ in pairs(espObjects) do
            RemoveESP(player)
        end
    end
end

-- ============ INPUT ============
UserInputService.InputBegan:Connect(function(input, gp)
    if gp then return end
    
    if input.KeyCode == Settings.AutoFarmKey then
        Settings.AutoFarm = not Settings.AutoFarm
        farming = Settings.AutoFarm
        if farming then
            task.spawn(FarmLoop)
            print("[Fex] Auto Farm ON")
        else
            print("[Fex] Auto Farm OFF")
        end
    end
    
    if input.KeyCode == Settings.ESPKey then
        ToggleESP()
        print("[Fex] ESP:", Settings.ESP and "ON" or "OFF")
    end
end)

-- Handle new players for ESP
Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function()
        task.wait(1)
        if Settings.ESP then
            pcall(CreateESP, player)
        end
    end)
end)

Players.PlayerRemoving:Connect(RemoveESP)

print("[Fex] Game script loaded!")
print("F5 = Auto Farm | F6 = ESP")
print("Edit TargetItem in settings to match your game")`,
    usage: `**Controls:**
- **F5** — Toggle auto farm
- **F6** — Toggle ESP (highlights all players)

**Setup:**
1. Change \`TargetItem\` in Settings to match what you want to farm
2. The script searches for items by name in workspace
3. Adjust \`FarmRange\` for detection distance
4. Remote names may need adjusting per game`,
  }),
};

// ============ MINECRAFT TEMPLATES ============
const MC_TEMPLATES: Record<string, (prompt: string) => { intro: string; code: string; usage: string }> = {
  plugins: (prompt) => ({
    intro: `Here's a complete Spigot/Bukkit plugin with custom commands and event listeners.`,
    code: `package com.fexscripts.plugin;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;

public class FexPlugin extends JavaPlugin implements Listener {
    
    @Override
    public void onEnable() {
        getLogger().info("Fex Plugin enabled!");
        getServer().getPluginManager().registerEvents(this, this);
    }
    
    @Override
    public void onDisable() {
        getLogger().info("Fex Plugin disabled!");
    }
    
    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        player.sendMessage(ChatColor.GREEN + "Welcome to the server, " + player.getName() + "!");
        Bukkit.broadcastMessage(ChatColor.YELLOW + player.getName() + " has joined the game!");
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command cmd, String label, String[] args) {
        if (cmd.getName().equalsIgnoreCase("fex")) {
            if (sender instanceof Player) {
                Player player = (Player) sender;
                player.sendMessage(ChatColor.AQUA + "Fex Scripts Plugin is running!");
                player.sendMessage(ChatColor.GRAY + "Version: 1.0.0");
            } else {
                sender.sendMessage("This command can only be used by players!");
            }
            return true;
        }
        return false;
    }
}`,
    usage: `**Setup:**
1. Create plugin folder: \`plugins/FexPlugin/\`
2. Place compiled .jar in the folder
3. Create \`plugin.yml\` with main class reference
4. Restart server

**Commands:**
- \`/fex\` — Shows plugin info

**Events:**
- Custom join message for players`,
  }),
  commands: (prompt) => ({
    intro: `Here's a custom command script with cooldown and permissions.`,
    code: `# Fex Scripts - Custom Command
# Add to commands.yml or use a plugin like CommandBook

command:
  heal:
    description: Heal yourself or another player
    usage: /heal [player]
    permission: fex.heal
    permission-message: You don't have permission!
  tpa:
    description: Request teleport to a player
    usage: /tpa <player>
    permission: fex.tpa
  spawn:
    description: Teleport to spawn
    usage: /spawn
    permission: fex.spawn

# Cooldowns (in seconds)
cooldowns:
  heal: 30
  tpa: 60
  spawn: 10`,
    usage: `**Commands:**
- \`/heal [player]\` — Heal yourself or another player (30s cooldown)
- \`/tpa <player>\` — Request teleport to a player (60s cooldown)
- \`/spawn\` — Teleport to spawn (10s cooldown)

**Permissions:**
- \`fex.heal\` — Use heal command
- \`fex.tpa\` — Use TPA command
- \`fex.spawn\` — Use spawn command`,
  }),
  datapacks: (prompt) => ({
    intro: `Here's a custom data pack with recipes and loot tables.`,
    code: `{
  "pack": {
    "pack_format": 15,
    "description": "Fex Scripts Custom Data Pack"
  }
}

// data/fex/recipes/diamond_sword.json
{
  "type": "minecraft:crafting_shaped",
  "pattern": [
    " D ",
    " D ",
    " S "
  ],
  "key": {
    "D": {
      "item": "minecraft:diamond"
    },
    "S": {
      "item": "minecraft:stick"
    }
  },
  "result": {
    "item": "minecraft:diamond_sword",
    "count": 1
  }
}`,
    usage: `**Setup:**
1. Create folder: \`datapacks/fex/\`
2. Place \`pack.mcmeta\` in root
3. Create \`data/\` folder with recipes/loot_tables
4. Run \`/reload\` in-game

**Features:**
- Custom crafting recipe for diamond sword
- Fully customizable`,
  }),
  mods: (prompt) => ({
    intro: `Here's a basic Forge/Fabric mod template with custom items.`,
    code: `package com.fexscripts.mod;

import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.Rarity;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

@Mod("fexmod")
public class FexMod {
    public static final String MODID = "fexmod";
    
    public static final DeferredRegister<Item> ITEMS = 
        DeferredRegister.create(ForgeRegistries.ITEMS, MODID);
    
    public static final RegistryObject<Item> FEX_SWORD = ITEMS.register("fex_sword",
        () -> new Item(new Item.Properties()
            .tab(CreativeModeTab.TAB_COMBAT)
            .stacksTo(1)
            .rarity(Rarity.EPIC)));
    
    public FexMod() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();
        ITEMS.register(modEventBus);
    }
}`,
    usage: `**Setup:**
1. Install Forge/Fabric MDK
2. Place code in \`src/main/java/\`
3. Add item models in \`resources/models/\`
4. Build with \`./gradlew build\`

**Items Added:**
- Fex Sword — Epic rarity combat item`,
  }),
  scripts: (prompt) => ({
    intro: `Here's a Skript for a custom shop system.`,
    code: `# Fex Scripts - Custom Shop
# Requires: Skript plugin

command /shop:
    trigger:
        open virtual chest inventory with size 3 named "&6Fex Shop" to player
        format slot 0 of player with diamond sword named "&bFex Sword" with lore "&7Cost: &a$1000" to run:
            if player's balance is greater than or equal to 1000:
                remove 1000 from player's balance
                give diamond sword to player
                send "&aPurchase complete!" to player
            else:
                send "&cNot enough money!" to player

on join:
    wait 1 second
    send "&6Welcome to &bFex Server&6!" to player
    send "&7Type &a/shop &7to open the shop" to player`,
    usage: `**Setup:**
1. Install Skript plugin
2. Place file in \`plugins/Skript/scripts/\`
3. Run \`/sk reload fex-shop\`

**Commands:**
- \`/shop\` — Opens the shop GUI`,
  }),
  worldedit: (prompt) => ({
    intro: `Here's a WorldEdit script for bulk operations.`,
    code: `# Fex Scripts - WorldEdit Commands
# Requires: WorldEdit plugin

# Replace all stone with diamonds in selection
//replace stone diamond_block

# Set entire selection to obsidian
//set obsidian

# Copy and paste with rotation
//copy
//rotate 90
//paste

# Generate a sphere of glass
//sphere glass 10

# Create a hollow cube
//hcube stone 20

# Stack selection in a direction
//stack 5 north

# Smooth terrain in selection
//smooth 4

# Generate a forest
//forest

# Drain water/lava in radius
//drain 50`,
    usage: `**Commands:**
- \`//replace <from> <to>\` — Replace blocks
- \`//set <block>\` — Fill selection
- \`//copy\` / \`//paste\` — Copy and paste
- \`//sphere <block> <radius>\` — Create sphere
- \`//forest\` — Generate forest`,
  }),
  economy: (prompt) => ({
    intro: `Here's an economy shop system with buy/sell functionality.`,
    code: `# Fex Scripts - Economy Shop
# Requires: EssentialsX Economy + ChestShop

# Shop sign format:
# Line 1: [Shop] or player name
# Line 2: Quantity
# Line 3: Item name/ID
# Line 4: Price (B for buy, S for sell)

# Example shop signs:
# [Shop]
# 64
# diamond
# B 100

# Economy commands:
/bal - Check balance
/pay <player> <amount> - Pay player
/baltop - View richest players`,
    usage: `**Shop Setup:**
1. Place a chest
2. Place a sign on the chest
3. Format sign as shown above
4. Stock the chest with items

**Commands:**
- \`/bal\` — Check balance
- \`/pay <player> <amount>\` — Send money`,
  }),
  minigames: (prompt) => ({
    intro: `Here's a BedWars-style minigame setup.`,
    code: `# Fex Scripts - BedWars Minigame
# Requires: BedWars1058 or similar plugin

arena:
  name: fex-bedwars
  min-players: 8
  max-players: 16
  teams: 4
  team-size: 4
  
  spawns:
    red: {x: 0, y: 64, z: -50}
    blue: {x: 0, y: 64, z: 50}
    green: {x: -50, y: 64, z: 0}
    yellow: {x: 50, y: 64, z: 0}
  
  beds:
    red: {x: 0, y: 65, z: -45}
    blue: {x: 0, y: 65, z: 45}
    green: {x: -45, y: 65, z: 0}
    yellow: {x: 45, y: 65, z: 0}`,
    usage: `**Setup:**
1. Install BedWars1058 plugin
2. Create arena with \`/bw edit\`
3. Set team spawns and beds
4. Save arena with \`/bw save\`

**Commands:**
- \`/bw join\` — Join lobby
- \`/bw join <arena>\` — Join game`,
  }),
};

// ============ CS2 TEMPLATES ============
const CS2_TEMPLATES: Record<string, (prompt: string) => { intro: string; code: string; usage: string }> = {
  plugins: (prompt) => ({
    intro: `Here's a SourceMod plugin for CS2 with custom commands.`,
    code: `#include <sourcemod>
#include <sdktools>
#include <cstrike>

#pragma semicolon 1
#pragma newdecls required

#define PLUGIN_VERSION "1.0.0"

public Plugin myinfo = {
    name = "Fex Scripts CS2 Plugin",
    author = "Fex",
    description = "Custom CS2 commands and features",
    version = PLUGIN_VERSION,
    url = ""
};

public void OnPluginStart() {
    RegConsoleCmd("sm_hp", Command_Heal, "Heal yourself");
    RegConsoleCmd("sm_armor", Command_Armor, "Give full armor");
    RegConsoleCmd("sm_nades", Command_Nades, "Give all nades");
    
    CreateConVar("sm_fex_version", PLUGIN_VERSION, "Fex Plugin Version", FCVAR_NOTIFY);
    AutoExecConfig(true, "fex_cs2");
}

public Action Command_Heal(int client, int args) {
    if (!IsValidClient(client)) {
        ReplyToCommand(client, "Invalid client!");
        return Plugin_Handled;
    }
    
    SetEntityHealth(client, 100);
    PrintToChat(client, "\\x04[Fex] \\x01You have been healed!");
    return Plugin_Handled;
}

public Action Command_Armor(int client, int args) {
    if (!IsValidClient(client)) return Plugin_Handled;
    
    SetEntProp(client, Prop_Data, "m_ArmorValue", 100);
    GivePlayerItem(client, "item_kevlar");
    GivePlayerItem(client, "item_assaultsuit");
    PrintToChat(client, "\\x04[Fex] \\x01Full armor given!");
    return Plugin_Handled;
}

bool IsValidClient(int client) {
    return (client > 0 && client <= MaxClients && IsClientInGame(client));
}`,
    usage: `**Setup:**
1. Compile .sp to .smx
2. Place in \`addons/sourcemod/plugins/\`
3. Restart server or use \`sm plugins load\`

**Commands:**
- \`sm_hp\` — Heal to 100 HP
- \`sm_armor\` — Full armor + helmet
- \`sm_nades\` — All grenades`,
  }),
  configs: (prompt) => ({
    intro: `Here's a competitive CS2 server configuration.`,
    code: `// Fex Scripts - Competitive Server Config
// Place in cfg/sourcemod/fex_competitive.cfg

// Server Settings
hostname "Fex Competitive Server"
sv_cheats 0
sv_pure 1
sv_lan 0

// Game Mode
game_type 0
game_mode 1
mp_maxrounds 30
mp_overtime_enable 1

// Round Settings
mp_roundtime 1.92
mp_freezetime 15
mp_buytime 20
mp_c4timer 40
mp_startmoney 800

// Team Settings
mp_friendly_fire 1
mp_tkpunish 1

// Movement
sv_airaccelerate 12
sv_accelerate 5.5

// Anti-Cheat
sv_pure_kick_clients 1`,
    usage: `**Setup:**
1. Place config in \`cfg/sourcemod/\`
2. Load with: \`exec sourcemod/fex_competitive\`

**Features:**
- MR15 competitive format
- 1.92 min round time
- Friendly fire enabled
- Overtime enabled`,
  }),
  autoexec: (prompt) => ({
    intro: `Here's a competitive autoexec config for optimal settings.`,
    code: `// Fex Scripts - Competitive Autoexec
// Place in cs2/cfg/autoexec.cfg

// Network
cl_interp 0
cl_interp_ratio 1
rate 786432

// Crosshair
cl_crosshairstyle 4
cl_crosshairsize 2
cl_crosshairthickness 1
cl_crosshairgap -2
cl_crosshaircolor 1

// Viewmodel
viewmodel_fov 68
viewmodel_offset_x 2.5
viewmodel_offset_y 0
viewmodel_offset_z -1.5

// Mouse
sensitivity 1.5
m_rawinput 1

// Binds
bind "MWHEELDOWN" "+jump"
bind "mouse5" "+lookatweapon"`,
    usage: `**Setup:**
1. Place in \`cs2/cfg/autoexec.cfg\`
2. Add to launch options: \`+exec autoexec\`
3. Restart game`,
  }),
  training: (prompt) => ({
    intro: `Here's a training mode plugin for aim practice.`,
    code: `#include <sourcemod>
#include <sdktools>

public Plugin myinfo = {
    name = "Fex Training Mode",
    author = "Fex",
    version = "1.0.0"
};

ConVar g_cvTraining;

public void OnPluginStart() {
    g_cvTraining = CreateConVar("sm_training", "0", "Enable training mode");
    RegConsoleCmd("sm_train", Command_Training, "Toggle training mode");
    RegConsoleCmd("sm_bot", Command_SpawnBot, "Spawn training bot");
    RegConsoleCmd("sm_god", Command_God, "Toggle god mode");
}

public Action Command_Training(int client, int args) {
    int enabled = GetConVarInt(g_cvTraining);
    SetConVarInt(g_cvTraining, enabled ? 0 : 1);
    PrintToChat(client, "Training mode: %s", enabled ? "OFF" : "ON");
    return Plugin_Handled;
}

public Action Command_SpawnBot(int client, int args) {
    ServerCommand("bot_add_ct");
    PrintToChat(client, "Bot spawned!");
    return Plugin_Handled;
}

public Action Command_God(int client, int args) {
    SetEntityHealth(client, 9999);
    PrintToChat(client, "God mode activated!");
    return Plugin_Handled;
}`,
    usage: `**Commands:**
- \`sm_train\` — Toggle training mode
- \`sm_bot\` — Spawn training bot
- \`sm_god\` — God mode (9999 HP)`,
  }),
  hud: (prompt) => ({
    intro: `Here's a custom HUD configuration.`,
    code: `// Fex Scripts - Custom HUD Config
// Place in cfg/fex_hud.cfg

// Radar
cl_radar_scale 0.7
cl_radar_icon_scale_min 100

// Colors
cl_hud_color 1
cl_hud_backgroundalpha 0.8

// Net Graph
net_graph 1
net_graphpos 1

// Viewmodel
viewmodel_fov 68
viewmodel_offset_x 2.5
viewmodel_offset_y 0
viewmodel_offset_z -1.5

// Crosshair
cl_crosshairstyle 4
cl_crosshairsize 2
cl_crosshairthickness 1
cl_crosshairgap -2
cl_crosshaircolor 1`,
    usage: `**Setup:**
1. Place in \`cfg/fex_hud.cfg\`
2. Add to autoexec: \`exec fex_hud\`
3. Or run in console: \`exec fex_hud\``,
  }),
  admin: (prompt) => ({
    intro: `Here's an admin tools plugin with player management.`,
    code: `#include <sourcemod>
#include <sdktools>

public Plugin myinfo = {
    name = "Fex Admin Tools",
    author = "Fex",
    version = "1.0.0"
};

public void OnPluginStart() {
    RegAdminCmd("sm_slap", Command_Slap, ADMFLAG_KICK, "Slap a player");
    RegAdminCmd("sm_slay", Command_Slay, ADMFLAG_KICK, "Slay a player");
    RegAdminCmd("sm_kick", Command_Kick, ADMFLAG_KICK, "Kick a player");
    RegAdminCmd("sm_ban", Command_Ban, ADMFLAG_BAN, "Ban a player");
}

public Action Command_Slap(int client, int args) {
    if (args < 1) {
        ReplyToCommand(client, "Usage: sm_slap <player> [damage]");
        return Plugin_Handled;
    }
    
    char arg[64];
    GetCmdArg(1, arg, sizeof(arg));
    int target = FindTarget(client, arg);
    
    if (target == -1) return Plugin_Handled;
    
    int damage = 0;
    if (args >= 2) {
        char dmg[16];
        GetCmdArg(2, dmg, sizeof(dmg));
        damage = StringToInt(dmg);
    }
    
    SlapPlayer(target, damage, true);
    ShowActivity2(client, "\\x04[Fex Admin]\\x01", "Slapped %N", target);
    return Plugin_Handled;
}

public Action Command_Kick(int client, int args) {
    if (args < 1) {
        ReplyToCommand(client, "Usage: sm_kick <player> [reason]");
        return Plugin_Handled;
    }
    
    char arg[64], reason[128];
    GetCmdArg(1, arg, sizeof(arg));
    
    if (args >= 2) {
        GetCmdArg(2, reason, sizeof(reason));
    } else {
        reason = "Kicked by admin";
    }
    
    int target = FindTarget(client, arg);
    if (target == -1) return Plugin_Handled;
    
    KickClient(target, "%s", reason);
    return Plugin_Handled;
}`,
    usage: `**Commands:**
- \`sm_slap <player> [damage]\` — Slap player
- \`sm_slay <player>\` — Kill player
- \`sm_kick <player> [reason]\` — Kick player
- \`sm_ban <player> <time> [reason]\` — Ban player`,
  }),
  maps: (prompt) => ({
    intro: `Here's a map entity script for custom triggers.`,
    code: `// Fex Scripts - Map Entity Script
// Hammer Editor entity logic

// TRIGGER HURT
// Create trigger_hurt entity
// Properties:
//   Damage: 100
//   Damage Type: 1 (Generic)

// TRIGGER TELEPORT
// Create trigger_teleport
// Properties:
//   Remote Destination: info_teleport_destination

// LOGIC RELAY
// Create logic_relay
// Name: fex_relay
// Outputs:
//   OnTrigger -> !activator -> AddOutput "health 100"

// GAME TEXT
// Create game_text
// Properties:
//   Message: "Welcome to Fex Map!"
//   Color: "255 255 255"`,
    usage: `**Entity Setup:**
1. Open map in Hammer Editor
2. Add entities as shown above
3. Set properties and outputs
4. Compile map`,
  }),
  workshop: (prompt) => ({
    intro: `Here's a workshop map setup guide.`,
    code: `// Fex Scripts - Workshop Map Setup

// MAP STRUCTURE
// fex_map/
// ├── fex_map.vpk
// ├── fex_map.bsp
// ├── materials/
// ├── models/
// └── sound/

// WORKSHOP CFG
mapname fex_map
title "Fex Custom Map"
description "A custom CS2 map by Fex Scripts"
tags "competitive, aim, training"

// NAV MESH
// Commands:
//   nav_generate
//   nav_save

// PUBLISH COMMANDS
//   workshop_build fex_map
//   workshop_submit fex_map`,
    usage: `**Setup:**
1. Create map folder structure
2. Design map in Hammer Editor
3. Generate nav mesh
4. Package as .vpk
5. Upload to Steam Workshop`,
  }),
};

// Generate script based on platform, category, and prompt
export function generateScript(platform: Platform, categoryId: string, prompt: string): { intro: string; code: string; usage: string } {
  if (platform === 'minecraft') {
    const template = MC_TEMPLATES[categoryId];
    if (template) return template(prompt);
  } else if (platform === 'cs2') {
    const template = CS2_TEMPLATES[categoryId];
    if (template) return template(prompt);
  }
  
  // Default to Roblox templates
  const template = SCRIPT_TEMPLATES[categoryId];
  if (template) {
    return template(prompt);
  }
  // Fallback generic script
  return SCRIPT_TEMPLATES.fex(prompt);
}
