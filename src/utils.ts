import { Attachment } from './types';

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

export const STORAGE_KEY = 'luaforge.sessions.v3';

export const SCRIPT_CATEGORIES = [
  { id: 'esp', name: 'ESP / Visual', icon: '👁️', desc: 'Wallhacks, tracers, chams' },
  { id: 'aimbot', name: 'Aimbot', icon: '🎯', desc: 'Silent aim, lock-on' },
  { id: 'movement', name: 'Movement', icon: '💨', desc: 'Fly, speed, noclip' },
  { id: 'combat', name: 'Combat', icon: '⚔️', desc: 'Kill aura, auto parry' },
  { id: 'autofarm', name: 'Auto Farm', icon: '🤖', desc: 'Auto collect, auto quest' },
  { id: 'gui', name: 'GUI Scripts', icon: '🖥️', desc: 'Custom UIs, script hubs' },
  { id: 'utility', name: 'Utility', icon: '🔧', desc: 'Server hop, anti-afk' },
  { id: 'game', name: 'Game Specific', icon: '🎮', desc: 'Blox Fruits, Arsenal, etc.' },
];

export const QUICK_PROMPTS: Record<string, string[]> = {
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
};

// ============ LOCAL SCRIPT TEMPLATES ============
export const SCRIPT_TEMPLATES: Record<string, (prompt: string) => { intro: string; code: string; usage: string }> = {
  esp: (prompt) => ({
    intro: `Here's a complete Player ESP script with boxes, names, health bars, and distance. Paste into your executor and run.`,
    code: `-- LuaForge ESP Script
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

getgenv().LuaForgeESP = Settings

-- Storage
local ESPObjects = {}
local CoreGui = game:GetService("CoreGui")
local ESPFolder = Instance.new("Folder")
ESPFolder.Name = "LuaForge_ESP"
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

print("[LuaForge] ESP loaded! Press F1 to toggle.")`,
    usage: `**Controls:**
- **F1** — Toggle ESP on/off
- Works through walls at any distance (up to 5000 studs)
- Compatible with all executors`,
  }),

  movement: (prompt) => ({
    intro: `Here's a complete movement script with fly, speed, noclip, and infinite jump. Toggle keys included.`,
    code: `-- LuaForge Movement Script
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

getgenv().LuaForgeMovement = Settings

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

print("[LuaForge] Movement script loaded!")
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
    code: `-- LuaForge Aimbot Script
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

getgenv().LuaForgeAimbot = Settings

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

print("[LuaForge] Aimbot loaded! Press Q to toggle, hold right-click to aim.")`,
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
    code: `-- LuaForge Combat Script
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

getgenv().LuaForgeCombat = Settings

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

print("[LuaForge] Combat script loaded!")
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
    code: `-- LuaForge Auto Farm Script
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

getgenv().LuaForgeAutoFarm = Settings

-- State
local farming = false
local currentTarget = nil

-- ============ GUI ============
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "LuaForge_AutoFarm"
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
Title.Text = "LuaForge Auto Farm"
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

print("[LuaForge] Auto Farm loaded! Press P or click GUI to toggle.")`,
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
    code: `-- LuaForge Script Hub GUI
-- Category: GUI Scripts
-- Compatible: Synapse X, Script-Ware, KRNL, Fluxus, Hydrogen

local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local LocalPlayer = Players.LocalPlayer

-- ============ GUI CREATION ============
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "LuaForge_Hub"
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
Title.Text = "◧ LuaForge Hub"
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

print("[LuaForge] Script Hub loaded! RightShift to toggle GUI.")`,
    usage: `**Controls:**
- **RightShift** — Toggle GUI visibility
- Click tabs to switch sections
- Toggle switches for each feature
- GUI is draggable
- Close button (red ✕) to destroy GUI`,
  }),

  utility: (prompt) => ({
    intro: `Here's a utility script with anti-AFK, server hop, and freecam.`,
    code: `-- LuaForge Utility Script
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

getgenv().LuaForgeUtility = Settings

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
            warn("[LuaForge] No available servers found")
        end
    else
        warn("[LuaForge] Failed to fetch server list")
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
            print("[LuaForge] Anti-AFK enabled")
        else
            StopAntiAFK()
            print("[LuaForge] Anti-AFK disabled")
        end
    end
    
    if input.KeyCode == Settings.FreecamKey then
        Settings.Freecam = not Settings.Freecam
        if Settings.Freecam then
            StartFreecam()
            print("[LuaForge] Freecam enabled (WASD + Space/Ctrl)")
        else
            StopFreecam()
            print("[LuaForge] Freecam disabled")
        end
    end
    
    if input.KeyCode == Settings.ServerHopKey then
        ServerHop()
    end
    
    if input.KeyCode == Settings.RejoinKey then
        Rejoin()
    end
end)

print("[LuaForge] Utility script loaded!")
print("F1 = Anti-AFK | F2 = Freecam | F3 = Server Hop | F4 = Rejoin")`,
    usage: `**Controls:**
- **F1** — Toggle anti-AFK (prevents idle kicks)
- **F2** — Toggle freecam (WASD + Space/Ctrl to move, Shift for speed)
- **F3** — Server hop to lowest-population server
- **F4** — Rejoin current server`,
  }),

  game: (prompt) => ({
    intro: `Here's a game-specific script. Adapt the remote names to match your target game.`,
    code: `-- LuaForge Game Script
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

getgenv().LuaForgeGame = Settings

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
    highlight.Name = "LuaForge_ESP"
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
            print("[LuaForge] Auto Farm ON")
        else
            print("[LuaForge] Auto Farm OFF")
        end
    end
    
    if input.KeyCode == Settings.ESPKey then
        ToggleESP()
        print("[LuaForge] ESP:", Settings.ESP and "ON" or "OFF")
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

print("[LuaForge] Game script loaded!")
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

// Generate script based on category and prompt
export function generateScript(categoryId: string, prompt: string): { intro: string; code: string; usage: string } {
  const template = SCRIPT_TEMPLATES[categoryId];
  if (template) {
    return template(prompt);
  }
  // Fallback generic script
  return SCRIPT_TEMPLATES.esp(prompt);
}
