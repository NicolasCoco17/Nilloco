// =============================================================================
// DATA DE SKILLS ACTIVAS (BUFFS & AURAS)
// =============================================================================
// Úsalo para poblar tu UI de selección de habilidades.

export const ACTIVE_SKILLS_DATA = [
  // ---------------------------------------------------------------------------
  // BLADE SKILLS
  // ---------------------------------------------------------------------------
  {
    name: "War Cry",
    id: "War Cry",
    tree: "Blade",
    weapon: "All",
    mp: "300",
    type: "Buff",
    description: "Increases ATK for a duration. Removes [Fear].",
    img: "/icons/war_cry.png"
  },
  {
    name: "Berserk",
    id: "Berserk",
    tree: "Blade",
    weapon: "All",
    mp: "500",
    type: "Buff",
    description: "Greatly increases ASPD & Crit Rate, but lowers DEF/MDEF & Stability.",
    img: "/icons/berserk.png"
  },
  {
    name: "Rampage",
    id: "Rampage",
    tree: "Blade",
    weapon: "OHS / THS / DS",
    mp: "500",
    type: "Buff",
    description: "Enhances normal attacks and AMPR. DEF/MDEF becomes 0.",
    img: "/icons/rampage.png"
  },
  {
    name: "Buster Blade",
    id: "Buster Blade",
    tree: "Blade",
    weapon: "OHS / THS",
    mp: "300",
    type: "Buff",
    description: "Increases Weapon ATK based on skill level (and Shield Refine for OHS).",
    img: "/icons/buster_blade.png"
  },

  // ---------------------------------------------------------------------------
  // MAGIC SKILLS
  // ---------------------------------------------------------------------------
  {
    name: "Magic: Impact",
    id: "Magic: Impact",
    tree: "Magic",
    weapon: "All",
    mp: "200",
    type: "Instant / Buff",
    description: "Halves the MP Cost of the next skill.",
    img: "/icons/magic_impact.png"
  },
  {
    name: "Magic: Laser",
    id: "Magic: Laser",
    tree: "Magic",
    weapon: "Staff / MD / OHS",
    mp: "200",
    type: "Buff",
    description: "Increases Magic Pierce for a short time.",
    img: "/icons/magic_laser.png"
  },
  {
    name: "Maximizer",
    id: "Maximizer",
    tree: "Magic",
    weapon: "Staff / MD",
    mp: "300",
    type: "Instant",
    description: "Recover a massive amount of MP instantly.",
    img: "/icons/maximizer.png"
  },
  {
    name: "Qadal",
    id: "Qadal",
    tree: "Magic",
    weapon: "Staff",
    mp: "Varies",
    type: "Buff",
    description: "Consumes HP to force critical magic and halve MP cost. Increases Magic Damage over time.",
    img: "/icons/qadal.png"
  },

  // ---------------------------------------------------------------------------
  // MARTIAL & CRUSHER SKILLS
  // ---------------------------------------------------------------------------
  {
    name: "Chakra",
    id: "Chakra",
    tree: "Martial",
    weapon: "All",
    mp: "200",
    type: "Buff",
    description: "Restores MP and increases AMPR. Reduces damage taken.",
    img: "/icons/chakra.png"
  },
  {
    name: "Asura Aura",
    id: "Asura Aura",
    tree: "Martial / Crusher",
    weapon: "Knuckle",
    mp: "0",
    type: "Mode / Toggle",
    description: "Increases DMG, Crit & Skill Constant. Consumes MP to mitigate damage.",
    img: "/icons/asura_aura.png"
  },
  {
    name: "Annihilator",
    id: "Annihilator",
    tree: "Crusher",
    weapon: "Knuckle",
    mp: "100",
    type: "Buff",
    description: "Increases Base Weapon ATK% and Shell Break probability. Reduces Stability.",
    img: "/icons/annihilator.png"
  },
  {
    name: "Flash Blink",
    id: "Flash Blink",
    tree: "Crusher",
    weapon: "Knuckle",
    mp: "100",
    type: "Buff",
    description: "Increases Short Range Damage.",
    img: "/icons/flash_blink.png"
  },

  // ---------------------------------------------------------------------------
  // SHOT & HUNTER SKILLS
  // ---------------------------------------------------------------------------
  {
    name: "Decoy Shot",
    id: "Decoy Shot",
    tree: "Shot",
    weapon: "Bow / BG",
    mp: "400",
    type: "Summon",
    description: "Summons a decoy that generates AMPR.",
    img: "/icons/decoy_shot.png"
  },
  {
    name: "Quick Loader",
    id: "Quick Loader",
    tree: "Shot",
    weapon: "Bow / BG",
    mp: "400",
    type: "Buff",
    description: "Increases charge level for Cross Fire.",
    img: "/icons/quick_loader.png"
  },
  {
    name: "Detection",
    id: "Detection",
    tree: "Hunter",
    weapon: "Bow / BG",
    mp: "300",
    type: "Buff",
    description: "Increases Critical Rate and reduces Aggro.",
    img: "/icons/detection.png"
  },

  // ---------------------------------------------------------------------------
  // HALBERD SKILLS
  // ---------------------------------------------------------------------------
  {
    name: "War Cry of Struggle",
    id: "War Cry of Struggle",
    tree: "Halberd",
    weapon: "All",
    mp: "100",
    type: "Instant",
    description: "Recovers MP based on missing HP. Generates high Aggro.",
    img: "/icons/war_cry_struggle.png"
  },
  {
    name: "Godspeed Wield",
    id: "Godspeed Wield",
    tree: "Halberd",
    weapon: "All",
    mp: "100",
    type: "Buff (Stackable)",
    description: "Massive ASPD/Motion/Evasion boost. Lowers MaxMP and Resistances heavily.",
    img: "/icons/godspeed_wield.png"
  },
  {
    name: "Quick Aura",
    id: "Quick Aura",
    tree: "Halberd",
    weapon: "All",
    mp: "0 (HP Cost)",
    type: "Buff",
    description: "Consumes HP to increase ASPD.",
    img: "/icons/quick_aura.png"
  },

  // ---------------------------------------------------------------------------
  // MONONOFU (KATANA) SKILLS
  // ---------------------------------------------------------------------------
  {
    name: "Kairiki Ranshin",
    id: "Kairiki Ranshin",
    tree: "Mononofu",
    weapon: "All",
    mp: "200",
    type: "Buff",
    description: "Increases ATK and AMPR. Inflicts [Ignite] on self.",
    img: "/icons/kairiki.png"
  },
  {
    name: "Meikyo Shisui",
    id: "Meikyo Shisui",
    tree: "Mononofu",
    weapon: "All",
    mp: "200",
    type: "Buff",
    description: "Greatly increases Critical Rate. Lowers DEF/MDEF/Crit Dmg (unless Katana).",
    img: "/icons/meikyo.png"
  },

  // ---------------------------------------------------------------------------
  // DUAL SWORD SKILLS
  // ---------------------------------------------------------------------------
  {
    name: "Flash Blast",
    id: "Flash Blast",
    tree: "Dual Sword",
    weapon: "DS / OHS",
    mp: "200",
    type: "Buff",
    description: "Increases Unsheathe Attack. Dual Swords gain Weapon ATK.",
    img: "/icons/flash_blast.png"
  },
  {
    name: "Saber Aura",
    id: "Saber Aura",
    tree: "Dual Sword",
    weapon: "DS",
    mp: "900",
    type: "Buff (Stackable)",
    description: "Increases ASPD, Accuracy and AMPR over time. Drains HP.",
    img: "/icons/saber_aura.png"
  },

  // ---------------------------------------------------------------------------
  // SUPPORT & SHIELD SKILLS
  // ---------------------------------------------------------------------------
  {
    name: "Brave Aura",
    id: "Brave Aura",
    tree: "Support",
    weapon: "All",
    mp: "400",
    type: "Aura",
    description: "Increases Party Damage and Weapon ATK. User suffers Accuracy penalty.",
    img: "/icons/brave_aura.png"
  },
  {
    name: "High Cycle",
    id: "High Cycle",
    tree: "Support",
    weapon: "All",
    mp: "500",
    type: "Aura",
    description: "Increases Party CSPD. User suffers MP Regen penalty.",
    img: "/icons/high_cycle.png"
  },
  {
    name: "Quick Motion",
    id: "Quick Motion",
    tree: "Support",
    weapon: "All",
    mp: "600",
    type: "Aura",
    description: "Increases Party ASPD (Can reach +1000). User suffers AMPR penalty.",
    img: "/icons/quick_motion.png"
  },
  {
    name: "Gloria",
    id: "Gloria",
    tree: "Support",
    weapon: "All",
    mp: "100",
    type: "Buff",
    description: "Triples DEF and MDEF for a short time.",
    img: "/icons/gloria.png"
  },
  {
    name: "Protection",
    id: "Protection",
    tree: "Shield",
    weapon: "All",
    mp: "300",
    type: "Buff",
    description: "Increases Physical Resistance, decreases Magic Resistance.",
    img: "/icons/protection.png"
  },
  {
    "name": "Aegis",
    "id": "Aegis",
    "tree": "Shield",
    "weapon": "All",
    "mp": "300",
    "type": "Buff",
    "description": "Increases Magic Resistance, decreases Physical Resistance.",
    "img": "/icons/aegis.png"
  },
  {
    name: "Guardian",
    id: "Guardian",
    tree: "Shield",
    weapon: "Shield",
    mp: "600",
    type: "Aura",
    description: "Protects allies (Dmg Reduction) & generates massive Aggro. Lowers user ATK.",
    img: "/icons/guardian.png"
  },

  // ---------------------------------------------------------------------------
  // WIZARD SKILLS
  // ---------------------------------------------------------------------------
  {
    name: "Familia",
    id: "Familia",
    tree: "Wizard",
    weapon: "Staff / MD",
    mp: "300",
    type: "Summon / Buff",
    description: "Summons a familiar. Increases MATK, MaxMP and Additional Magic.",
    img: "/icons/familia.png"
  },
  {
    name: "Overlimit",
    id: "Overlimit",
    tree: "Wizard",
    weapon: "Staff / MD",
    mp: "100",
    type: "Buff",
    description: "Increases Elemental Damage (Magic), but reduces CSPD.",
    img: "/icons/overlimit.png"
  },

  // ---------------------------------------------------------------------------
  // ASSASSIN SKILLS (SPECIAL)
  // ---------------------------------------------------------------------------
  {
    name: "Sicarius (Buff)",
    id: "Sicarius",
    tree: "Assassin",
    weapon: "Any",
    mp: "0",
    type: "Conditional Buff",
    description: "Active after a successful Backstab. Increases ATK and Physical Pierce.",
    img: "/icons/sicarius.png"
  },
  {
    name: "Backstep",
    id: "Backstep",
    tree: "Assassin",
    weapon: "Any",
    mp: "100",
    type: "Instant / Buff",
    description: "Dodge backward. Increases damage of next Assassin Stab.",
    img: "/icons/backstep.png"
  }
];