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

// ============ DYNAMIC SCRIPT GENERATOR ============
class ScriptGenerator {
  private platform: Platform;
  private category: string;
  private prompt: string;
  private features: string[];
  
  constructor(platform: Platform, category: string, prompt: string) {
    this.platform = platform;
    this.category = category;
    this.prompt = prompt.toLowerCase();
    this.features = this.extractFeatures();
  }
  
  private extractFeatures(): string[] {
    const features: string[] = [];
    
    // Detect features from prompt
    if (this.prompt.includes('esp') || this.prompt.includes('wallhack') || this.prompt.includes('visual')) {
      features.push('esp');
    }
    if (this.prompt.includes('aim') || this.prompt.includes('aimbot') || this.prompt.includes('silent')) {
      features.push('aimbot');
    }
    if (this.prompt.includes('fly') || this.prompt.includes('speed') || this.prompt.includes('noclip') || this.prompt.includes('movement')) {
      features.push('movement');
    }
    if (this.prompt.includes('kill') || this.prompt.includes('combat') || this.prompt.includes('aura') || this.prompt.includes('parry')) {
      features.push('combat');
    }
    if (this.prompt.includes('farm') || this.prompt.includes('auto') || this.prompt.includes('collect')) {
      features.push('autofarm');
    }
    if (this.prompt.includes('gui') || this.prompt.includes('interface') || this.prompt.includes('menu')) {
      features.push('gui');
    }
    if (this.prompt.includes('anti') || this.prompt.includes('afk') || this.prompt.includes('server')) {
      features.push('utility');
    }
    
    // Default to category-based features
    if (features.length === 0) {
      switch (this.category) {
        case 'esp': features.push('esp'); break;
        case 'aimbot': features.push('aimbot'); break;
        case 'movement': features.push('movement'); break;
        case 'combat': features.push('combat'); break;
        case 'autofarm': features.push('autofarm'); break;
        case 'gui': features.push('gui'); break;
        case 'utility': features.push('utility'); break;
        case 'fex': features.push('esp', 'aimbot', 'movement', 'combat', 'autofarm'); break;
      }
    }
    
    return features;
  }
  
  generate(): { intro: string; code: string; usage: string } {
    if (this.platform === 'roblox') {
      return this.generateRobloxScript();
    } else if (this.platform === 'minecraft') {
      return this.generateMinecraftScript();
    } else if (this.platform === 'cs2') {
      return this.generateCS2Script();
    }
    
    return this.generateRobloxScript();
  }
  
  private generateRobloxScript(): { intro: string; code: string; usage: string } {
    const scriptName = this.prompt.slice(0, 30) || 'Custom Script';
    const timestamp = new Date().toISOString().split('T')[0];
    
    let code = `-- ╔═══════════════════════════════════════════════════════════╗
-- ║  ${scriptName.toUpperCase().padEnd(56)}║
-- ║  Generated by Fex Scripts | ${timestamp}${' '.repeat(Math.max(0, 30 - timestamp.length))}║
-- ║  Platform: Roblox | Category: ${this.category}${' '.repeat(Math.max(0, 40 - this.category.length))}║
-- ╚═══════════════════════════════════════════════════════════╝

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local TweenService = game:GetService("TweenService")
local LocalPlayer = Players.LocalPlayer
local Camera = workspace.CurrentCamera

-- ═══════════════════════════════════════════════════════════
--                    CONFIGURATION
-- ═══════════════════════════════════════════════════════════
local Config = {
    Enabled = true,
    ToggleKey = Enum.KeyCode.F1,
`;

    // Add feature-specific configuration
    if (this.features.includes('esp')) {
      code += `    
    -- ESP Settings
    ESP = {
        Enabled = false,
        ShowBoxes = true,
        ShowNames = true,
        ShowHealth = true,
        ShowDistance = true,
        BoxColor = Color3.fromRGB(168, 85, 247),
        MaxDistance = 5000,
        TeamCheck = false,
    },
`;
    }
    
    if (this.features.includes('aimbot')) {
      code += `    
    -- Aimbot Settings
    Aimbot = {
        Enabled = false,
        FOV = 200,
        ShowFOV = true,
        Smoothness = 0.15,
        Prediction = true,
        TeamCheck = true,
        TargetPart = "Head",
    },
`;
    }
    
    if (this.features.includes('movement')) {
      code += `    
    -- Movement Settings
    Movement = {
        FlyEnabled = false,
        FlySpeed = 50,
        SpeedEnabled = false,
        WalkSpeed = 100,
        NoclipEnabled = false,
        InfiniteJump = false,
    },
`;
    }
    
    if (this.features.includes('combat')) {
      code += `    
    -- Combat Settings
    Combat = {
        KillAuraEnabled = false,
        KillAuraRange = 25,
        KillAuraSpeed = 0.1,
        AutoParryEnabled = false,
        TeamCheck = true,
    },
`;
    }
    
    if (this.features.includes('autofarm')) {
      code += `    
    -- Auto Farm Settings
    AutoFarm = {
        Enabled = false,
        FarmRange = 500,
        CollectDelay = 0.5,
        TargetItem = "Fruit",
    },
`;
    }
    
    code += `}

getgenv().FexScript = Config

-- ═══════════════════════════════════════════════════════════
--                    UTILITY FUNCTIONS
-- ═══════════════════════════════════════════════════════════
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

`;

    // Add ESP system
    if (this.features.includes('esp')) {
      code += `-- ═══════════════════════════════════════════════════════════
--                    ESP SYSTEM
-- ═══════════════════════════════════════════════════════════
local ESPObjects = {}
local ESPFolder = Instance.new("Folder")
ESPFolder.Name = "Fex_ESP"
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
    
    ESPObjects[player] = { Folder = folder, NameTag = nameTag, NameLabel = nameLabel, HealthLabel = healthLabel }
end

local function UpdateESP()
    if not Config.ESP.Enabled then
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
        
        if Config.ESP.TeamCheck and player.Team == LocalPlayer.Team then
            objects.Folder.Enabled = false
            continue
        end
        
        local distance = (rootPart.Position - Camera.CFrame.Position).Magnitude
        if distance > Config.ESP.MaxDistance then
            objects.Folder.Enabled = false
            continue
        end
        
        objects.Folder.Enabled = true
        objects.NameTag.Adornee = head
        
        if Config.ESP.ShowNames then
            objects.NameLabel.Text = player.Name
            objects.NameLabel.Visible = true
        end
        
        if Config.ESP.ShowHealth then
            objects.HealthLabel.Text = math.floor(humanoid.Health) .. " HP"
            objects.HealthLabel.Visible = true
        end
    end
end

`;
    }

    // Add Aimbot system
    if (this.features.includes('aimbot')) {
      code += `-- ═══════════════════════════════════════════════════════════
--                    AIMBOT SYSTEM
-- ═══════════════════════════════════════════════════════════
local CurrentTarget = nil
local IsAiming = false

local function GetClosestPlayer()
    local closest, closestDist = nil, Config.Aimbot.FOV
    
    for _, player in pairs(Players:GetPlayers()) do
        if player == LocalPlayer then continue end
        if not player.Character then continue end
        
        local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
        if not humanoid or humanoid.Health <= 0 then continue end
        
        if Config.Aimbot.TeamCheck and player.Team == LocalPlayer.Team then continue end
        
        local targetPart = player.Character:FindFirstChild(Config.Aimbot.TargetPart)
        if not targetPart then continue end
        
        local screenPos, onScreen = Camera:WorldToViewportPoint(targetPart.Position)
        if not onScreen then continue end
        
        local mousePos = UserInputService:GetMouseLocation()
        local dist = (Vector2.new(screenPos.X, screenPos.Y) - mousePos).Magnitude
        
        if dist < closestDist then
            closestDist = dist
            closest = player
        end
    end
    
    return closest
end

local function AimAt(target)
    if not target or not target.Character then return end
    
    local targetPart = target.Character:FindFirstChild(Config.Aimbot.TargetPart)
    if not targetPart then return end
    
    local targetPos = targetPart.Position
    
    if Config.Aimbot.Prediction then
        local rootPart = target.Character:FindFirstChild("HumanoidRootPart")
        if rootPart then
            targetPos = targetPos + (rootPart.Velocity * 0.165)
        end
    end
    
    local currentCF = Camera.CFrame
    local targetCF = CFrame.new(currentCF.Position, targetPos)
    
    if Config.Aimbot.Smoothness > 0 then
        Camera.CFrame = currentCF:Lerp(targetCF, Config.Aimbot.Smoothness)
    else
        Camera.CFrame = targetCF
    end
end

`;
    }

    // Add Movement system
    if (this.features.includes('movement')) {
      code += `-- ═══════════════════════════════════════════════════════════
--                    MOVEMENT SYSTEM
-- ═══════════════════════════════════════════════════════════
local flyBodyVelocity, flyBodyGyro
local flying = false

local function StartFly()
    if flying then return end
    flying = true
    
    local character = LocalPlayer.Character
    if not character then return end
    local rootPart = character:FindFirstChild("HumanoidRootPart")
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    if not rootPart or not humanoid then return end
    
    flyBodyVelocity = Instance.new("BodyVelocity")
    flyBodyVelocity.MaxForce = Vector3.new(math.huge, math.huge, math.huge)
    flyBodyVelocity.Velocity = Vector3.new(0, 0, 0)
    flyBodyVelocity.Parent = rootPart
    
    flyBodyGyro = Instance.new("BodyGyro")
    flyBodyGyro.MaxTorque = Vector3.new(math.huge, math.huge, math.huge)
    flyBodyGyro.P = 9e4
    flyBodyGyro.Parent = rootPart
    
    humanoid.PlatformStand = true
end

local function StopFly()
    if not flying then return end
    flying = false
    
    if flyBodyVelocity then flyBodyVelocity:Destroy() end
    if flyBodyGyro then flyBodyGyro:Destroy() end
    
    local character = LocalPlayer.Character
    if character then
        local humanoid = character:FindFirstChildOfClass("Humanoid")
        if humanoid then humanoid.PlatformStand = false end
    end
end

`;
    }

    // Add Combat system
    if (this.features.includes('combat')) {
      code += `-- ═══════════════════════════════════════════════════════════
--                    COMBAT SYSTEM
-- ═══════════════════════════════════════════════════════════
local lastKillAura = 0

local function KillAura()
    if not Config.Combat.KillAuraEnabled then return end
    
    local now = tick()
    if now - lastKillAura < Config.Combat.KillAuraSpeed then return end
    lastKillAura = now
    
    local character = LocalPlayer.Character
    if not character then return end
    local myRoot = character:FindFirstChild("HumanoidRootPart")
    if not myRoot then return end
    
    for _, player in pairs(Players:GetPlayers()) do
        if player == LocalPlayer then continue end
        if Config.Combat.TeamCheck and player.Team == LocalPlayer.Team then continue end
        if not player.Character then continue end
        
        local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
        local targetPart = player.Character:FindFirstChild("HumanoidRootPart")
        
        if not humanoid or not targetPart then continue end
        if humanoid.Health <= 0 then continue end
        
        local dist = (targetPart.Position - myRoot.Position).Magnitude
        if dist > Config.Combat.KillAuraRange then continue end
        
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

`;
    }

    // Add Auto Farm system
    if (this.features.includes('autofarm')) {
      code += `-- ═══════════════════════════════════════════════════════════
--                    AUTO FARM SYSTEM
-- ═══════════════════════════════════════════════════════════
local farming = false

local function FindNearestItem()
    local character = LocalPlayer.Character
    if not character then return nil end
    local myRoot = character:FindFirstChild("HumanoidRootPart")
    if not myRoot then return nil end
    
    local nearest, nearestDist = nil, Config.AutoFarm.FarmRange
    local searchNames = {"Orb", "Coin", "Gem", "Item", "Drop", "Collect", "Fruit", "Chest"}
    
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

local function AutoFarmLoop()
    while farming and Config.AutoFarm.Enabled do
        local item = FindNearestItem()
        
        if item then
            local pos = item:IsA("Model") and item:GetPivot().Position or item.Position
            local character = LocalPlayer.Character
            local myRoot = character and character:FindFirstChild("HumanoidRootPart")
            
            if myRoot then
                myRoot.CFrame = CFrame.new(pos)
                task.wait(Config.AutoFarm.CollectDelay)
                
                pcall(function()
                    for _, remote in pairs(game:GetDescendants()) do
                        if remote:IsA("RemoteEvent") then
                            local n = string.lower(remote.Name)
                            if string.find(n, "collect") or string.find(n, "pickup") then
                                remote:FireServer(item)
                            end
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

`;
    }

    // Add Input Handler
    code += `-- ═══════════════════════════════════════════════════════════
--                    INPUT HANDLER
-- ═══════════════════════════════════════════════════════════
UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    
`;

    if (this.features.includes('esp')) {
      code += `    if input.KeyCode == Enum.KeyCode.F2 then
        Config.ESP.Enabled = not Config.ESP.Enabled
        print("[Fex] ESP:", Config.ESP.Enabled and "ON" or "OFF")
    end
    
`;
    }

    if (this.features.includes('aimbot')) {
      code += `    if input.KeyCode == Enum.KeyCode.F3 then
        Config.Aimbot.Enabled = not Config.Aimbot.Enabled
        print("[Fex] Aimbot:", Config.Aimbot.Enabled and "ON" or "OFF")
    end
    
    if input.UserInputType == Enum.UserInputType.MouseButton2 then
        IsAiming = true
    end
`;
    }

    if (this.features.includes('movement')) {
      code += `    if input.KeyCode == Enum.KeyCode.F then
        Config.Movement.FlyEnabled = not Config.Movement.FlyEnabled
        if Config.Movement.FlyEnabled then StartFly() else StopFly() end
        print("[Fex] Fly:", Config.Movement.FlyEnabled and "ON" or "OFF")
    end
    
    if input.KeyCode == Enum.KeyCode.G then
        Config.Movement.SpeedEnabled = not Config.Movement.SpeedEnabled
        local character = LocalPlayer.Character
        local humanoid = character and character:FindFirstChildOfClass("Humanoid")
        if humanoid then
            humanoid.WalkSpeed = Config.Movement.SpeedEnabled and Config.Movement.WalkSpeed or 16
        end
        print("[Fex] Speed:", Config.Movement.SpeedEnabled and "ON" or "OFF")
    end
    
`;
    }

    if (this.features.includes('combat')) {
      code += `    if input.KeyCode == Enum.KeyCode.X then
        Config.Combat.KillAuraEnabled = not Config.Combat.KillAuraEnabled
        print("[Fex] Kill Aura:", Config.Combat.KillAuraEnabled and "ON" or "OFF")
    end
    
`;
    }

    if (this.features.includes('autofarm')) {
      code += `    if input.KeyCode == Enum.KeyCode.P then
        Config.AutoFarm.Enabled = not Config.AutoFarm.Enabled
        farming = Config.AutoFarm.Enabled
        if farming then task.spawn(AutoFarmLoop) end
        print("[Fex] Auto Farm:", Config.AutoFarm.Enabled and "ON" or "OFF")
    end
    
`;
    }

    code += `end)

`;

    if (this.features.includes('aimbot')) {
      code += `UserInputService.InputEnded:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton2 then
        IsAiming = false
    end
end)

`;
    }

    // Add Render Loop
    code += `-- ═══════════════════════════════════════════════════════════
--                    MAIN LOOP
-- ═══════════════════════════════════════════════════════════
RunService.RenderStepped:Connect(function()
`;

    if (this.features.includes('esp')) {
      code += `    UpdateESP()
`;
    }

    if (this.features.includes('aimbot')) {
      code += `    if Config.Aimbot.Enabled then
        if not CurrentTarget or not CurrentTarget.Character then
            CurrentTarget = GetClosestPlayer()
        end
        
        if IsAiming and CurrentTarget then
            AimAt(CurrentTarget)
        end
    end
`;
    }

    if (this.features.includes('movement')) {
      code += `    if flying and flyBodyVelocity and flyBodyGyro then
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
        if UserInputService:IsKeyDown(Enum.KeyCode.LeftShift) then
            moveDir = moveDir - Vector3.new(0, 1, 0)
        end
        
        flyBodyVelocity.Velocity = moveDir * Config.Movement.FlySpeed
        flyBodyGyro.CFrame = Camera.CFrame
    end
`;
    }

    code += `end)

`;

    if (this.features.includes('combat')) {
      code += `RunService.Heartbeat:Connect(function()
    KillAura()
end)

`;
    }

    // Add Initialization
    code += `-- ═══════════════════════════════════════════════════════════
--                    INITIALIZATION
-- ═══════════════════════════════════════════════════════════
`;

    if (this.features.includes('esp')) {
      code += `for _, player in pairs(Players:GetPlayers()) do
    pcall(CreateESP, player)
end

Players.PlayerAdded:Connect(function(player)
    pcall(CreateESP, player)
    player.CharacterAdded:Connect(function()
        task.wait(1)
        pcall(CreateESP, player)
    end)
end)

Players.PlayerRemoving:Connect(function(player)
    if ESPObjects[player] then
        ESPObjects[player].Folder:Destroy()
        ESPObjects[player] = nil
    end
end)

`;
    }

    code += `print("╔═══════════════════════════════════════════════╗")
print("║         ⚡ FEX SCRIPT LOADED ⚡                   ║")
print("╠═══════════════════════════════════════════════════╣")
`;

    if (this.features.includes('esp')) {
      code += `print("║  F2 = ESP Toggle                                 ║")
`;
    }

    if (this.features.includes('aimbot')) {
      code += `print("║  F3 = Aimbot Toggle | RMB = Aim                  ║")
`;
    }

    if (this.features.includes('movement')) {
      code += `print("║  F = Fly | G = Speed                           ║")
`;
    }

    if (this.features.includes('combat')) {
      code += `print("║  X = Kill Aura                                   ║")
`;
    }

    if (this.features.includes('autofarm')) {
      code += `print("║  P = Auto Farm                                   ║")
`;
    }

    code += `print("╚═══════════════════════════════════════════════════╝")`;

    const intro = `Here's your dynamically generated ${this.category} script based on your prompt: "${this.prompt}"\n\nThis script includes: ${this.features.join(', ')}`;
    
    const usage = `**Controls:**\n${this.features.includes('esp') ? '- **F2** — Toggle ESP\n' : ''}${this.features.includes('aimbot') ? '- **F3** — Toggle Aimbot\n- **Right Mouse Button** — Aim at target\n' : ''}${this.features.includes('movement') ? '- **F** — Toggle Fly\n- **G** — Toggle Speed\n' : ''}${this.features.includes('combat') ? '- **X** — Toggle Kill Aura\n' : ''}${this.features.includes('autofarm') ? '- **P** — Toggle Auto Farm\n' : ''}\n**Features:**\n${this.features.map(f => `- ${f.charAt(0).toUpperCase() + f.slice(1)}`).join('\n')}`;

    return { intro, code, usage };
  }
  
  private generateMinecraftScript(): { intro: string; code: string; usage: string } {
    const scriptName = this.prompt.slice(0, 30) || 'Custom Script';
    const timestamp = new Date().toISOString().split('T')[0];
    
    let code = `# ╔═══════════════════════════════════════════════════════════╗
# ║  ${scriptName.toUpperCase().padEnd(56)}║
# ║  Generated by Fex Scripts | ${timestamp}${' '.repeat(Math.max(0, 30 - timestamp.length))}║
# ║  Platform: Minecraft | Category: ${this.category}${' '.repeat(Math.max(0, 38 - this.category.length))}║
# ╚═══════════════════════════════════════════════════════════╝

`;

    if (this.category === 'plugins') {
      code += `package com.fexscripts.plugin;

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
            }
            return true;
        }
        return false;
    }
}`;
    } else if (this.category === 'commands') {
      code += `# Fex Scripts - Custom Commands
# Add to commands.yml

command:
  heal:
    description: Heal yourself or another player
    usage: /heal [player]
    permission: fex.heal
  tpa:
    description: Request teleport to a player
    usage: /tpa <player>
    permission: fex.tpa
  spawn:
    description: Teleport to spawn
    usage: /spawn
    permission: fex.spawn`;
    } else if (this.category === 'scripts') {
      code += `# Fex Scripts - Custom Skript
# Requires: Skript plugin

command /shop:
    trigger:
        open virtual chest inventory with size 3 named "&6Fex Shop" to player
        format slot 0 of player with diamond sword named "&bFex Sword" with lore "&7Cost: &a$1000" to run:
            if player's balance is greater than or equal to 1000:
                remove 1000 from player's balance
                give diamond sword to player
                send "&aPurchase complete!" to player

on join:
    wait 1 second
    send "&6Welcome to &bFex Server&6!" to player`;
    } else {
      code += `# Fex Scripts - ${this.category}
# Generated dynamically based on: ${this.prompt}

# Add your ${this.category} code here
# Customize based on your needs`;
    }

    return {
      intro: `Generated Minecraft ${this.category} script for: "${this.prompt}"`,
      code,
      usage: `**Setup:**\n1. Place in appropriate folder\n2. Reload/restart server\n3. Test the functionality`
    };
  }
  
  private generateCS2Script(): { intro: string; code: string; usage: string } {
    const scriptName = this.prompt.slice(0, 30) || 'Custom Script';
    const timestamp = new Date().toISOString().split('T')[0];
    
    let code = `// ╔═══════════════════════════════════════════════════════════╗
// ║  ${scriptName.toUpperCase().padEnd(56)}║
// ║  Generated by Fex Scripts | ${timestamp}${' '.repeat(Math.max(0, 30 - timestamp.length))}║
// ║  Platform: CS2 | Category: ${this.category}${' '.repeat(Math.max(0, 43 - this.category.length))}║
// ╚═══════════════════════════════════════════════════════════╝

`;

    if (this.category === 'plugins') {
      code += `#include <sourcemod>
#include <sdktools>

#pragma semicolon 1
#pragma newdecls required

public Plugin myinfo = {
    name = "Fex Scripts CS2 Plugin",
    author = "Fex",
    version = "1.0.0"
};

public void OnPluginStart() {
    RegConsoleCmd("sm_hp", Command_Heal, "Heal yourself");
    RegConsoleCmd("sm_armor", Command_Armor, "Give full armor");
}

public Action Command_Heal(int client, int args) {
    SetEntityHealth(client, 100);
    PrintToChat(client, "\\x04[Fex] \\x01You have been healed!");
    return Plugin_Handled;
}

public Action Command_Armor(int client, int args) {
    SetEntProp(client, Prop_Data, "m_ArmorValue", 100);
    PrintToChat(client, "\\x04[Fex] \\x01Full armor given!");
    return Plugin_Handled;
}`;
    } else if (this.category === 'autoexec') {
      code += `// Fex Scripts - Competitive Autoexec
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
m_rawinput 1`;
    } else if (this.category === 'configs') {
      code += `// Fex Scripts - Competitive Server Config

hostname "Fex Competitive Server"
sv_cheats 0
sv_pure 1

game_type 0
game_mode 1
mp_maxrounds 30
mp_overtime_enable 1

mp_roundtime 1.92
mp_freezetime 15
mp_friendly_fire 1`;
    } else {
      code += `// Fex Scripts - ${this.category}
// Generated dynamically based on: ${this.prompt}

// Add your ${this.category} code here
// Customize based on your needs`;
    }

    return {
      intro: `Generated CS2 ${this.category} script for: "${this.prompt}"`,
      code,
      usage: `**Setup:**\n1. Place in appropriate folder\n2. Load/restart server\n3. Test the functionality`
    };
  }
}

// Generate script based on platform, category, and prompt
export function generateScript(platform: Platform, categoryId: string, prompt: string): { intro: string; code: string; usage: string } {
  const generator = new ScriptGenerator(platform, categoryId, prompt);
  return generator.generate();
}
