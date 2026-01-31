//lib/constants.ts

// 1. Lista Maestra de Stats 
export const FULL_STAT_LIST = [
  "Select" ,"STR", "STR %", "INT", "INT %", "VIT", "VIT %", "AGI", "AGI %", "DEX", "DEX %",
  "Natural HP Regen", "Natural HP Regen %", "Natural MP Regen", "Natural MP Regen %",
  "MaxHP", "MaxHP %", "MaxMP",
  "ATK", "ATK %", "MATK", "MATK %",
  "Stability %", "Physical Pierce %", "Magic Pierce %",
  "DEF", "DEF %", "MDEF", "MDEF %",
  "Physical Resistance %", "Magic Resistance %",
  "Accuracy", "Accuracy %", "Dodge", "Dodge %",
  "ASPD", "ASPD %", "CSPD", "CSPD %",
  "Critical Rate", "Critical Rate %", "Critical Damage", "Critical Damage %",
  "% stronger against Fire", "% stronger against Water", "% stronger against Wind", "% stronger against Earth", "% stronger against Light", "% stronger against Dark", "% stronger against Neutral",
  "Fire resistance %", "Water resistance %", "Wind resistance %", "Earth resistance %", "Light resistance %", "Dark resistance %", "Neutral Resistance %",
  "Ailment Resistance %",
  "Guard Power %", "Guard Recharge %", "Evasion Recharge %",
  "Aggro %", "Attack MP Recovery",
  "Short Range Damage %", "Long Range Damage %",
  "Weapon ATK", "Weapon ATK %",
  "Physical Barrier", "Magic Barrier", "Fractional Barrier %", "Barrier Cooldown %",
  "Reflect %", "Additional Melee %", "Additional Magic %",
  "Anticipate %", "Guard Break %",
  "EXP Gain %", "Drop Rate %",
  // Elementos
  "Fire Element", "Water Element", "Wind Element", "Earth Element", "Light Element", "Dark Element",
  // Reducciones
  "Reduce Dmg (Player Epicenter) %", "Reduce Dmg (Foe Epicenter) %", "Reduce Dmg (Floor) %", 
  "Reduce Dmg (Charge) %", "Reduce Dmg (Bullet) %", "Reduce Dmg (Bowling) %", 
  "Reduce Dmg (Meteor) %", "Reduce Dmg (Straight Line) %", "Reduce Vortex %", "Reduce Explosion %"
];

// 2. Data de Skills Pasivas (Imágenes y IDs)
export const PASSIVE_SKILLS_DATA = [
  // Blade Skills
  { name: "Sword Mastery", id: "Sword Mastery", img: "/icons/swordmastery.png" },
  { name: "Quick Slash", id: "Quick Slash", img: "/icons/quickslash.png" },
  
  // Shot Skills
  { name: "Shot Mastery", id: "Shot Mastery", img: "/icons/shotmastery.png" },
  { name: "Samurai Archery", id: "Samurai Archery", img: "/icons/samuraiarchery.png" },
  
  // Magic Skills
  { name: "Magic Mastery", id: "Magic Mastery", img: "/icons/magicmastery.png" },
  
  // Martial Skills
  { name: "Martial Mastery", id: "Martial Mastery", img: "/icons/martialmastery.png" },
  { name: "Martial Discipline", id: "Martial Discipline", img: "/icons/martialdiscipline.png" },
  { name: "Aggravate", id: "Aggravate", img: "/icons/aggravate.png" },
  { name: "Strong Chase Attack", id: "Strong Chase Attack", img: "/icons/strongchaseattack.png" },
  
  // Halberd
  { name: "Halberd Mastery", id: "Halberd Mastery", img: "/icons/halberdmastery.png" },
  { name: "Critical Spear", id: "Critical Spear", img: "/icons/criticalspear.png" },
  { name: "Quick Aura", id: "Quick Aura", img: "/icons/quickaura.png" },
  
  // Katana
  { name: "Bushido", id: "Bushido", img: "/icons/bushido.png" },
  { name: "Two-Handed", id: "Two Handed", img: "/icons/twohanded.png" },
  
  // Dual Sword
  { name: "Dual Sword Mastery", id: "Dual Sword Mastery", img: "/icons/dualswordmastery.png" },
  { name: "Dual Sword Control", id: "Dual Sword Control", img: "/icons/dualswordcontrol.png" },
  { name: "Godspeed", id: "God Speed", img: "/icons/godspeed.png" },
  
  // Unarmed (Si tienes las imagenes)
  { name: "Unarmed Mastery", id: "Unarmed Mastery", img: "/icons/unarmedmastery.png" },
  { name: "Ultima Qi Charge", id: "Ultima Qi Charge", img: "/icons/qicharge.png" },
  { name: "Hidden Talent", id: "Hidden Talent", img: "/icons/hiddentalent.png" },

  // Shield / Guard
  { name: "Shield Mastery", id: "Shield Mastery", img: "/icons/shieldmastery.png" },
  { name: "Force Shield", id: "Force Shield", img: "/icons/forceshield.png" },
  { name: "Magical Shield", id: "Magical Shield", img: "/icons/magicalshield.png" },
  { name: "Heavy Armor Mastery", id: "Heavy Armor", img: "/icons/heavyarmor.png" },
  { name: "Light Armor Mastery", id: "Light Armor", img: "/icons/lightarmor.png" },
  { name: "Advanced Guard", id: "Advanced Guard", img: "/icons/advancedguard.png" },
  { name: "Advanced Evasion", id: "Advanced Evasion", img: "/icons/advancedevasion.png" },
  { name: "Aftershield", id: "Aftershield", img: "/icons/pdefense.png" },

  // Survival
  { name: "HP Boost", id: "HP Boost", img: "/icons/hpboost.png" },
  { name: "MP Boost", id: "MP Boost", img: "/icons/mpboost.png" },
  
  // Battle
  { name: "Attack UP", id: "Attack Up", img: "/icons/attackup.png" },
  { name: "Magic UP", id: "Magic Up", img: "/icons/magicup.png" },
  { name: "Defense UP", id: "Defense Up", img: "/icons/defenseup.png" },
  { name: "Accuracy UP", id: "Accuracy Up", img: "/icons/accuracyup.png" },
  { name: "Dodge UP", id: "Dodge Up", img: "/icons/dodgeup.png" },
  { name: "Critical UP", id: "Critical Up", img: "/icons/criticalup.png" },
  { name: "Intimidating Power", id: "Intimidating Power", img: "/icons/intimidatingpower.png" },
  { name: "Increased Energy", id: "Increased Energy", img: "/icons/increasedenergy.png" },
  { name: "Spell Burst", id: "Spell Burst", img: "/icons/spellburst.png" },
  { name: "Defense Mastery", id: "Defense Mastery", img: "/icons/defensemastery.png" },
  
  // Others
  { name: "Cast Mastery", id: "Cast Mastery", img: "/icons/castmastery.png" },
  { name: "Camouflage", id: "Camouflage", img: "/icons/camouflage.png" },
  { name: "Hunter Bowgun", id: "Hunter Bowgun", img: "/icons/hunterbowgun.png" },
  { name: "Magic Warrior Mastery", id: "Magic Warrior Mastery", img: "/icons/magicwarriormastery.png" },
  { name: "Conversion", id: "Sword Conversion", img: "/icons/swordconversion.png" },
  { name: "Magic Skin", id: "Magic Skin", img: "/icons/magicskin.png" },
  { name: "Frontliner II", id: "Frontliner II", img: "/icons/frontliner2.png" }
];

// avatar list
export const AVATAR_STAT_LIST = [
  "STR", "STR %",
  "INT", "INT %",
  "VIT", "VIT %",
  "AGI", "AGI %",
  "DEX", "DEX %",

  "Natural HP Regen", "Natural HP Regen %",
  "Natural MP Regen", "Natural MP Regen %",

  "MaxHP", "MaxHP %",
  "MaxMP",

  "ATK", "ATK %",
  "MATK", "MATK %",
  "Stability %",
  "Physical Pierce %",
  "Magic Pierce %",

  "DEF", "DEF %",
  "MDEF", "MDEF %",

  "Physical Resistance %",
  "Magic Resistance %",

  "Accuracy", "Accuracy %",
  "Dodge", "Dodge %",

  "ASPD", "ASPD %",
  "CSPD", "CSPD %",

  "Critical Rate", "Critical Rate %",
  "Critical Damage", "Critical Damage %",

  "% stronger against Fire",
  "% stronger against Water",
  "% stronger against Wind",
  "% stronger against Earth",
  "% stronger against Light",
  "% stronger against Dark",
  "% stronger against Neutral",

  "Fire resistance %",
  "Water resistance %",
  "Wind resistance %",
  "Earth resistance %",
  "Light resistance %",
  "Dark resistance %",
  "Neutral Resistance %",

  "Ailment Resistance %",
  "Guard Power %",
  "Guard Recharge %",
  "Evasion Recharge %",

  "Aggro %",
  "Attack MP Recovery",

  "Short Range Damage %",
  "Long Range Damage %",

  "Weapon ATK",
  "Weapon ATK %",

  "Physical Barrier",
  "Magic Barrier",
  "Fractional Barrier %",
  "Barrier Cooldown %",

  "Reflect %",
  "Additional Melee %",
  "Additional Magic %",

  "Anticipate %",
  "Guard Break %",
];

// buffland list

export const BUFFLAND_STAT_LIST = [
  "STR",
  "INT",
  "VIT",
  "AGI",
  "DEX",
  "Accuracy",
  "Dodge",
  "DEF",
  "MDEF",
  "MATK",
  "ATK",
  "Weapon ATK",
  "Physical Resistance %",
  "Magic Resistance %",
  "Stronger against Fire %",
  "Stronger against Earth %",
  "Stronger against Water %",
  "Stronger against Light %",
  "Stronger against Wind %",
  "Stronger against Dark %",
  "Stronger against Neutral %",
  "EXP Gain %",
  "Drop Rate %",
  "Water Resistance %",
  "Wind Resistance %",
  "Earth Resistance %",
  "Fire Resistance %",
  "Light Resistance %",
  "Dark Resistance %",
  "Neutral Resistance %",
  "Physical Barrier",
  "Magic Barrier",
  "Fractional Barrier %",
  "Critical Rate",
  "Attack MP Recovery",
  "Aggro %",
  "MaxMP",
  "MaxHP",
];


export const WEAPON_TYPES = [
  { id: "barehand", label: "Barehand", file: "" }, 
  { id: "1h", label: "1H Sword", file: "espadas_1h_clean.json" },
  { id: "2h", label: "2H Sword", file: "espadas_2h_clean.json" },
  { id: "bow", label: "Bow", file: "bows_clean.json" },
  { id: "bwg", label: "Bowgun", file: "bwg_clean.json" },
  { id: "staff", label: "Staff", file: "staff_clean.json" },
  { id: "md", label: "Magic Device", file: "md_clean.json" },
  { id: "knux", label: "Knuckles", file: "knuckles_clean.json" },
  { id: "kat", label: "Katana", file: "katana_clean.json" },
  { id: "hb", label: "Halberd", file: "hb_clean.json" },
];

export const SUB_TYPES = [
  { id: "none", label: "None" },
  { id: "1h", label: "1H Sword"},
  { id: "shield", label: "Shield" },
  { id: "dagger", label: "Dagger" },
  { id: "arrow", label: "Arrow" },
  { id: "md", label: "Magic Device" },
  { id: "knux", label: "Knuckles" },
  { id: "kat", label: "Katana" },
  { id:"scroll", label: "Scroll", file: "Ninjutsu_Scroll.json"},
];