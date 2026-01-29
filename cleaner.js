// Pega aquí tu JSON completo o impórtalo desde un archivo
const data = {
  "consumables": [
        {
        "id": "accuracy_potion",
        "name": "Accuracy Potion",
        "stats": {
          "Accuracy": 10
        }
      },
      {
        "id": "aggro_tonic",
        "name": "Aggro Tonic",
        "stats": {
          "MaxMP": 100,
          "Aggro%": 20
        }
      },
      {
        "id": "airbag_vest",
        "name": "Airbag Vest",
        "stats": {
          "DEF%": 10,
          "ThrustResistance%": 15
        }
      },
      {
        "id": "anti_darkness_gloves",
        "name": "Anti Darkness Gloves",
        "stats": {
          "DEF%": 5,
          "MDEF%": 5,
          "Darkresistance%": 10
        }
      },
      {
        "id": "apple",
        "name": "Apple",
        "stats": {
          "HP": 250
        }
      },
      {
        "id": "baked_sweet_potato",
        "name": "Baked Sweet Potato",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "barmbrack",
        "name": "Barmbrack",
        "stats": {
          "ASPD": 100,
          "CSPD": 100,
          "%strongeragainstEarth": 5
        }
      },
      {
        "id": "barrier_analyzer_lithograph",
        "name": "Barrier Analyzer Lithograph",
        "stats": {
          "MATK%": 3,
          "MagicPierce%": 10
        }
      },
      {
        "id": "bat_candy",
        "name": "Bat Candy",
        "stats": {
          "MATK%": 6
        }
      },
      {
        "id": "bear_meat_jelly_soup",
        "name": "Bear Meat Jelly Soup",
        "stats": {
          "MP": 20
        }
      },
      {
        "id": "berry_scaly_horn",
        "name": "Berry Scaly Horn",
        "stats": {
          "HP": 5000
        }
      },
      {
        "id": "big_red_claw",
        "name": "Big Red Claw",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "big_takoyaki__dashi_",
        "name": "Big Takoyaki (Dashi)",
        "stats": {
          "CriticalRate": 15,
          "Waterresistance%": 30
        }
      },
      {
        "id": "big_takoyaki__ponzu_",
        "name": "Big Takoyaki (Ponzu)",
        "stats": {
          "CriticalRate": 15,
          "Darkresistance%": 30
        }
      },
      {
        "id": "big_takoyaki__salt_",
        "name": "Big Takoyaki (Salt)",
        "stats": {
          "CriticalRate": 15,
          "Lightresistance%": 30
        }
      },
      {
        "id": "big_takoyaki__sauce_",
        "name": "Big Takoyaki (Sauce)",
        "stats": {
          "CriticalRate": 15,
          "Fireresistance%": 30
        }
      },
      {
        "id": "big_takoyaki__scallion_",
        "name": "Big Takoyaki (Scallion)",
        "stats": {
          "CriticalRate": 15,
          "Windresistance%": 30
        }
      },
      {
        "id": "big_takoyaki__soy_sauce_",
        "name": "Big Takoyaki (Soy Sauce)",
        "stats": {
          "CriticalRate": 15,
          "Earthresistance%": 30
        }
      },
      {
        "id": "bitter_gelatin",
        "name": "Bitter Gelatin",
        "stats": {
          "MATK%": -4,
          "CSPD": 800
        }
      },
      {
        "id": "bitter_nut",
        "name": "Bitter Nut",
        "stats": {
          "HP": 40
        }
      },
      {
        "id": "black_gelatin",
        "name": "Black Gelatin",
        "stats": {
          "CriticalRate": 10,
          "CriticalDamage%": -10
        }
      },
      {
        "id": "black_mist_candy",
        "name": "Black Mist Candy",
        "stats": {
          "GuardRecharge%": -5,
          "EvasionRecharge%": 5
        }
      },
      {
        "id": "blade_oil",
        "name": "Blade Oil",
        "stats": {
          "UnsheatheAttack": 100,
          "UnsheatheAttack%": 5
        }
      },
      {
        "id": "blue_gelatin",
        "name": "Blue Gelatin",
        "stats": {
          "MP": 10
        }
      },
      {
        "id": "blueberry",
        "name": "Blueberry",
        "stats": {
          "Preventsailmentonce.Invalidagainstimmobilization.": 1
        }
      },
      {
        "id": "boiled_lobster",
        "name": "Boiled Lobster",
        "stats": {
          "MaxHP": 5000
        }
      },
      {
        "id": "bone_in_short_rib",
        "name": "Bone-In Short Rib",
        "stats": {
          "MaxHP%": 10,
          "ATK": 25
        }
      },
      {
        "id": "broiled_puffer_fish_meat",
        "name": "Broiled Puffer Fish Meat",
        "stats": {
          "ATK%": 3
        }
      },
      {
        "id": "buttered_potato",
        "name": "Buttered Potato",
        "stats": {
          "HP": 5000
        }
      },
      {
        "id": "butterfly_float",
        "name": "Butterfly Float",
        "stats": {
          "Dodge": 5
        }
      },
      {
        "id": "cactus_steak",
        "name": "Cactus Steak",
        "stats": {
          "HP": 7000
        }
      },
      {
        "id": "carrot",
        "name": "Carrot",
        "stats": {
          "HP": 150
        }
      },
      {
        "id": "carrot_soda_soup",
        "name": "Carrot Soda Soup",
        "stats": {
          "HP": 1500
        }
      },
      {
        "id": "champagne",
        "name": "Champagne",
        "stats": {
          "MP": 100
        }
      },
      {
        "id": "cheese_cake",
        "name": "Cheese Cake",
        "stats": {
          "MaxMP": 100,
          "Windresistance%": 50
        }
      },
      {
        "id": "chicken_meat",
        "name": "Chicken Meat",
        "stats": {
          "MaxHP": 80
        }
      },
      {
        "id": "chicken_salad",
        "name": "Chicken Salad",
        "stats": {
          "MaxHP": 240
        }
      },
      {
        "id": "chicken_tender",
        "name": "Chicken Tender",
        "stats": {
          "MP": 15
        }
      },
      {
        "id": "chicken_thigh",
        "name": "Chicken Thigh",
        "stats": {
          "MP": 10
        }
      },
      {
        "id": "chicken_wing",
        "name": "Chicken Wing",
        "stats": {
          "HP": 750
        }
      },
      {
        "id": "chirashi_sushi",
        "name": "Chirashi Sushi",
        "stats": {
          "DEF": 75,
          "ASPD": 500,
          "ASPD%": 25
        }
      },
      {
        "id": "chocolate_cake",
        "name": "Chocolate Cake",
        "stats": {
          "MaxMP": 100,
          "Fireresistance%": 50
        }
      },
      {
        "id": "clear_sky_ocarina",
        "name": "Clear Sky Ocarina",
        "stats": {
          "MDEF%": 10,
          "ReduceDmg(Meteor)%": 15
        }
      },
      {
        "id": "concert_drink",
        "name": "Concert Drink",
        "stats": {
          "HP": 10000
        }
      },
      {
        "id": "concert_vita",
        "name": "Concert Vita",
        "stats": {
          "MaxHP": 3000
        }
      },
      {
        "id": "corn_snack",
        "name": "Corn Snack",
        "stats": {
          "HP": 3000
        }
      },
      {
        "id": "coryn_s_present",
        "name": "Coryn's Present",
        "stats": {
          "ASPD": 10000,
          "Recoil%": 100
        }
      },
      {
        "id": "cream_stew",
        "name": "Cream Stew",
        "stats": {
          "HP%": 10
        }
      },
      {
        "id": "crispy_potato",
        "name": "Crispy Potato",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "cup_ice_cream",
        "name": "Cup Ice Cream",
        "stats": {
          "HP": 2500,
          "MP": 25
        }
      },
      {
        "id": "damaged_fruit",
        "name": "Damaged Fruit",
        "stats": {
          "HP": 40
        }
      },
      {
        "id": "dark_truffle",
        "name": "Dark Truffle",
        "stats": {
          "Fireresistance%": 4,
          "Waterresistance%": 4,
          "Windresistance%": 4,
          "Earthresistance%": 4,
          "Lightresistance%": 4,
          "Darkresistance%": 4
        }
      },
      {
        "id": "death_truffle",
        "name": "Death Truffle",
        "stats": {
          "HP%": -100
        }
      },
      {
        "id": "deep_ocean_water",
        "name": "Deep Ocean Water",
        "stats": {
          "MP": 30
        }
      },
      {
        "id": "deep_fried_bean_curd",
        "name": "Deep-Fried Bean Curd",
        "stats": {
          "MaxHP": 1,
          "Accuracy": 15
        }
      },
      {
        "id": "deformed_mushroom",
        "name": "Deformed Mushroom",
        "stats": {
          "MP": 25
        }
      },
      {
        "id": "delicious_fillet",
        "name": "Delicious Fillet",
        "stats": {
          "HP": 3000
        }
      },
      {
        "id": "delicious_fruit",
        "name": "Delicious Fruit",
        "stats": {
          "HP": 5000
        }
      },
      {
        "id": "dikkit_sector",
        "name": "Dikkit Sector",
        "stats": {
          "TeleporttoDikkitSector": 1
        }
      },
      {
        "id": "disguise_scarf",
        "name": "Disguise Scarf",
        "stats": {
          "Dodge": 50
        }
      },
      {
        "id": "dragon_steak",
        "name": "Dragon Steak",
        "stats": {
          "MaxHP": 1500,
          "ASPD": 250
        }
      },
      {
        "id": "dried_persimon",
        "name": "Dried Persimon",
        "stats": {
          "HP": 500,
          "HP%": 1
        }
      },
      {
        "id": "dried_walnut",
        "name": "Dried Walnut",
        "stats": {
          "DEX%": 1,
          "MATK%": 1
        }
      },
      {
        "id": "dx_bomber_pose",
        "name": "DX Bomber Pose",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "eagle_talon_pose",
        "name": "Eagle Talon Pose",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "earth_protection_charm",
        "name": "Earth Protection Charm",
        "stats": {
          "DEF%": 5,
          "MDEF%": 5,
          "Earthresistance%": 10
        }
      },
      {
        "id": "egg",
        "name": "Egg",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "egg_sable",
        "name": "Egg Sable",
        "stats": {
          "HP": 6000
        }
      },
      {
        "id": "eggplant_agebitashi",
        "name": "Eggplant Agebitashi",
        "stats": {
          "AttackMPRecovery": 10,
          "WeaponATK%": 10
        }
      },
      {
        "id": "eggplant_skewer",
        "name": "Eggplant Skewer",
        "stats": {
          "MaxMP": 100,
          "DropRate%": 1
        }
      },
      {
        "id": "eggplant_tempura",
        "name": "Eggplant Tempura",
        "stats": {
          "MaxHP": 1000,
          "EXPGain%": 10
        }
      },
      {
        "id": "einklang",
        "name": "Einklang",
        "stats": {
          "TeleporttoEinklang": 1
        }
      },
      {
        "id": "el_scaro",
        "name": "El Scaro",
        "stats": {
          "TeleporttoElScaro": 1
        }
      },
      {
        "id": "elf_berry",
        "name": "Elf Berry",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "elf_berry_pot",
        "name": "Elf Berry Pot",
        "stats": {
          "MagicResistance%": 12
        }
      },
      {
        "id": "emergency_food",
        "name": "Emergency Food",
        "stats": {
          "HP": 500,
          "HP%": 5
        }
      },
      {
        "id": "emotion_ticket_a",
        "name": "Emotion Ticket A",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_b",
        "name": "Emotion Ticket B",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_c",
        "name": "Emotion Ticket C",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_d",
        "name": "Emotion Ticket D",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_e",
        "name": "Emotion Ticket E",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_f",
        "name": "Emotion Ticket F",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_l",
        "name": "Emotion Ticket L",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_m",
        "name": "Emotion Ticket M",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_o",
        "name": "Emotion Ticket O",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_p",
        "name": "Emotion Ticket P",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_q",
        "name": "Emotion Ticket Q",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_r",
        "name": "Emotion Ticket R",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_s",
        "name": "Emotion Ticket S",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_t",
        "name": "Emotion Ticket T",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_u",
        "name": "Emotion Ticket U",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "emotion_ticket_v",
        "name": "Emotion Ticket V",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "energy_bottle",
        "name": "Energy Bottle",
        "stats": {
          "HP": 4000
        }
      },
      {
        "id": "energy_bottle_ex",
        "name": "Energy Bottle EX",
        "stats": {
          "HP": 6000
        }
      },
      {
        "id": "energy_pill",
        "name": "Energy Pill",
        "stats": {
          "ATK": 50,
          "ATK%": 5
        }
      },
      {
        "id": "ethos_fortress",
        "name": "Ethos Fortress",
        "stats": {
          "TeleporttoEthosFortress": 1
        }
      },
      {
        "id": "extraction_crysta",
        "name": "Extraction Crysta",
        "stats": {
          "Safelydetachesacrystalonequipment": 0
        }
      },
      {
        "id": "fairy_eye_drop",
        "name": "Fairy Eye Drop",
        "stats": {
          "Accuracy": 20
        }
      },
      {
        "id": "fairy_sewing_tool",
        "name": "Fairy Sewing Tool",
        "stats": {
          "Grants1to3typesofabilitiestoanavataritem.Thesameabilitieswillnotbegranted.": 1
        }
      },
      {
        "id": "fermented_revita",
        "name": "Fermented Revita",
        "stats": {
          "HP": 3000
        }
      },
      {
        "id": "fighter_s_red_loincloth",
        "name": "Fighter's Red Loincloth",
        "stats": {
          "MaxHP": 500,
          "Aggro%": -15
        }
      },
      {
        "id": "filecia_s_chocolate",
        "name": "Filecia's Chocolate",
        "stats": {
          "HP": 2000
        }
      },
      {
        "id": "filecia_s_smore",
        "name": "Filecia's Smore",
        "stats": {
          "MP": 150
        }
      },
      {
        "id": "fire_protection_charm",
        "name": "Fire Protection Charm",
        "stats": {
          "DEF%": 5,
          "MDEF%": 5,
          "Fireresistance%": 10
        }
      },
      {
        "id": "fish_bone_chips",
        "name": "Fish Bone Chips",
        "stats": {
          "HP": 250
        }
      },
      {
        "id": "fish_bone_cracker",
        "name": "Fish Bone Cracker",
        "stats": {
          "HP": 4000
        }
      },
      {
        "id": "flame_grass",
        "name": "Flame Grass",
        "stats": {
          "ATK": 5,
          "%strongeragainstEarth": 1
        }
      },
      {
        "id": "flower_nectar",
        "name": "Flower Nectar",
        "stats": {
          "MP": 10
        }
      },
      {
        "id": "flower_nectar_syrup",
        "name": "Flower Nectar Syrup",
        "stats": {
          "MP": 20
        }
      },
      {
        "id": "forbidden_nut",
        "name": "Forbidden Nut",
        "stats": {
          "MP": 300,
          "HP%": -99
        }
      },
      {
        "id": "frog_meat",
        "name": "Frog Meat",
        "stats": {
          "MaxHP": 800
        }
      },
      {
        "id": "frosch_mushroom",
        "name": "Frosch Mushroom",
        "stats": {
          "Dodge": 50
        }
      },
      {
        "id": "frozen_wine",
        "name": "Frozen Wine",
        "stats": {
          "MP": 100
        }
      },
      {
        "id": "fruit_cake",
        "name": "Fruit Cake",
        "stats": {
          "MaxMP": 100,
          "Earthresistance%": 50
        }
      },
      {
        "id": "garden_of_beginning",
        "name": "Garden of Beginning",
        "stats": {
          "TeleporttoGardenofBeginning": 1
        }
      },
      {
        "id": "garden_of_ice___snow",
        "name": "Garden of Ice & Snow",
        "stats": {
          "TeleporttoGardenofIce&Snow": 1
        }
      },
      {
        "id": "giga_speed_potion",
        "name": "Giga Speed Potion",
        "stats": {
          "ASPD": 750
        }
      },
      {
        "id": "ginger_cake",
        "name": "Ginger Cake",
        "stats": {
          "ASPD": 100,
          "CSPD": 100,
          "%strongeragainstWater": 5
        }
      },
      {
        "id": "ginkgo_nut_rice",
        "name": "Ginkgo Nut Rice",
        "stats": {
          "PhysicalResistance%": 25,
          "MagicResistance%": 25
        }
      },
      {
        "id": "gloves_of_aiming",
        "name": "Gloves of Aiming",
        "stats": {
          "Accuracy": 40
        }
      },
      {
        "id": "glow_ray_soup",
        "name": "Glow Ray Soup",
        "stats": {
          "%strongeragainstFire": 2,
          "%strongeragainstWater": 2,
          "%strongeragainstWind": 2,
          "%strongeragainstEarth": 2,
          "%strongeragainstLight": 2,
          "%strongeragainstDark": 2
        }
      },
      {
        "id": "golden_pom_liquor",
        "name": "Golden Pom Liquor",
        "stats": {
          "Accuracy": 50,
          "Dodge": 50
        }
      },
      {
        "id": "goodbye_hat",
        "name": "Goodbye Hat",
        "stats": {
          "VIT": 10,
          "GuardPower%": 10,
          "GuardRecharge%": 10
        }
      },
      {
        "id": "grape_chewing_gum",
        "name": "Grape Chewing Gum",
        "stats": {
          "MATK": 10,
          "MATK%": 1
        }
      },
      {
        "id": "grape_jelly",
        "name": "Grape Jelly",
        "stats": {
          "MaxMP": 300,
          "CSPD": 300
        }
      },
      {
        "id": "grape_juice",
        "name": "Grape Juice",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "green_fizzwater",
        "name": "Green Fizzwater",
        "stats": {
          "MP": 20
        }
      },
      {
        "id": "green_gelatin",
        "name": "Green Gelatin",
        "stats": {
          "CSPD": 150,
          "CSPD%": 5
        }
      },
      {
        "id": "green_mushroom",
        "name": "Green Mushroom",
        "stats": {
          "HP": 250
        }
      },
      {
        "id": "grilled_lamb",
        "name": "Grilled Lamb",
        "stats": {
          "MaxHP": 1250
        }
      },
      {
        "id": "guard_potion",
        "name": "Guard Potion",
        "stats": {
          "GuardRecharge%": 5
        }
      },
      {
        "id": "half_eaten_fruit",
        "name": "Half-Eaten Fruit",
        "stats": {
          "HP": 33
        }
      },
      {
        "id": "happy_mushroom",
        "name": "Happy Mushroom",
        "stats": {
          "MATK%": 4
        }
      },
      {
        "id": "hard_apple",
        "name": "Hard Apple",
        "stats": {
          "HP": 60
        }
      },
      {
        "id": "hard_nut",
        "name": "Hard Nut",
        "stats": {
          "HP": 1000
        }
      },
      {
        "id": "hard_water",
        "name": "Hard Water",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "healing_mint",
        "name": "Healing Mint",
        "stats": {
          "HP": 2500
        }
      },
      {
        "id": "heart_chocolate",
        "name": "Heart Chocolate",
        "stats": {
          "HP": 30
        }
      },
      {
        "id": "heart_chocolate__traded_",
        "name": "Heart Chocolate (traded)",
        "stats": {
          "HP": 300
        }
      },
      {
        "id": "heart_cookie",
        "name": "Heart Cookie",
        "stats": {
          "MP": 15
        }
      },
      {
        "id": "heart_cookie__traded_",
        "name": "Heart Cookie (traded)",
        "stats": {
          "MP": 150
        }
      },
      {
        "id": "heroic_butter_cake",
        "name": "Heroic Butter Cake",
        "stats": {
          "MaxHP": 3000
        }
      },
      {
        "id": "heroic_revita",
        "name": "Heroic Revita",
        "stats": {
          "HP": 7500
        }
      },
      {
        "id": "honey_cookie",
        "name": "Honey Cookie",
        "stats": {
          "MP": 10
        }
      },
      {
        "id": "hora_diomedea",
        "name": "Hora Diomedea",
        "stats": {
          "TeleporttoHoraDiomedea": 1
        }
      },
      {
        "id": "hot_milk",
        "name": "Hot Milk",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "hot_tomato_juice",
        "name": "Hot Tomato Juice",
        "stats": {
          "Dodge": 30
        }
      },
      {
        "id": "ice_cream_cake",
        "name": "Ice Cream Cake",
        "stats": {
          "MaxMP": 100,
          "Waterresistance%": 50
        }
      },
      {
        "id": "iced_chicken_vita",
        "name": "Iced Chicken Vita",
        "stats": {
          "MaxHP": 1000,
          "Aggro%": -30
        }
      },
      {
        "id": "iced_chocolate",
        "name": "Iced Chocolate",
        "stats": {
          "MaxMP": 100,
          "Lightresistance%": 25
        }
      },
      {
        "id": "iced_coffee",
        "name": "Iced Coffee",
        "stats": {
          "MaxMP": 100,
          "Darkresistance%": 25
        }
      },
      {
        "id": "iced_revita",
        "name": "Iced Revita",
        "stats": {
          "HP": 1000
        }
      },
      {
        "id": "iced_vita_plus",
        "name": "Iced Vita Plus",
        "stats": {
          "MaxHP": 1000
        }
      },
      {
        "id": "icule_water",
        "name": "Icule Water",
        "stats": {
          "HP": 10
        }
      },
      {
        "id": "inari_sushi",
        "name": "Inari Sushi",
        "stats": {
          "MDEF": 75,
          "CSPD": 500,
          "CSPD%": 25
        }
      },
      {
        "id": "inje_village",
        "name": "Inje Village",
        "stats": {
          "TeleporttoInjeVillage": 1
        }
      },
      {
        "id": "inspiration_scarf",
        "name": "Inspiration Scarf",
        "stats": {
          "Dodge": -36,
          "EvasionRecharge%": 7
        }
      },
      {
        "id": "jack_pudding",
        "name": "Jack Pudding",
        "stats": {
          "ASPD": 100,
          "CSPD": 100,
          "%strongeragainstWind": 5
        }
      },
      {
        "id": "japanese_caramel_candy",
        "name": "Japanese Caramel Candy",
        "stats": {
          "HP": 4000
        }
      },
      {
        "id": "jeila_ssouffle",
        "name": "Jeila'sSouffle",
        "stats": {
          "MaxHP": 3000
        }
      },
      {
        "id": "jelly_beans",
        "name": "Jelly Beans",
        "stats": {
          "HP": 800
        }
      },
      {
        "id": "kiton_s_meat",
        "name": "Kiton's Meat",
        "stats": {
          "MaxHP": 5000
        }
      },
      {
        "id": "lamb_meat",
        "name": "Lamb Meat",
        "stats": {
          "MaxHP": 75
        }
      },
      {
        "id": "lantern_cake",
        "name": "Lantern Cake",
        "stats": {
          "ATK%": 10,
          "MotionSpeed%": -10
        }
      },
      {
        "id": "leaf_cracker",
        "name": "Leaf Cracker",
        "stats": {
          "Preventsailmentonce.Invalidagainstimmobilization.": 1
        }
      },
      {
        "id": "lefina_s_chocolate",
        "name": "Lefina's Chocolate",
        "stats": {
          "HP": 1000
        }
      },
      {
        "id": "life_essence",
        "name": "Life Essence",
        "stats": {
          "HP": 250
        }
      },
      {
        "id": "life_potion",
        "name": "Life Potion",
        "stats": {
          "HP%": 100
        }
      },
      {
        "id": "lime",
        "name": "Lime",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "lizard_dango",
        "name": "Lizard Dango",
        "stats": {
          "DEF": 100,
          "MDEF": -100
        }
      },
      {
        "id": "lizard_liquor",
        "name": "Lizard Liquor",
        "stats": {
          "HP": 3000
        }
      },
      {
        "id": "lyark_ointment",
        "name": "Lyark Ointment",
        "stats": {
          "HP": 3000,
          "MP": 30
        }
      },
      {
        "id": "lyark_tranquilizer",
        "name": "Lyark Tranquilizer",
        "stats": {
          "MaxHP": 1000
        }
      },
      {
        "id": "lychee",
        "name": "Lychee",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "magiadd_i",
        "name": "Magiadd I",
        "stats": {
          "MaxMP": 100
        }
      },
      {
        "id": "magiadd_ii",
        "name": "Magiadd II",
        "stats": {
          "MaxMP": 200
        }
      },
      {
        "id": "magiadd_iii",
        "name": "Magiadd III",
        "stats": {
          "MaxMP": 300
        }
      },
      {
        "id": "magiadd_iv",
        "name": "Magiadd IV",
        "stats": {
          "MaxMP": 400
        }
      },
      {
        "id": "magiadd_v",
        "name": "Magiadd V",
        "stats": {
          "MaxMP": 500
        }
      },
      {
        "id": "magiadd_vi",
        "name": "Magiadd VI",
        "stats": {
          "MaxMP": 600
        }
      },
      {
        "id": "magic_absorption_stone",
        "name": "Magic Absorption Stone",
        "stats": {
          "AttackMPRecovery": 6
        }
      },
      {
        "id": "magic_amplifier",
        "name": "Magic Amplifier",
        "stats": {
          "MATK": 30,
          "MATK%": 3
        }
      },
      {
        "id": "magic_barrier_wand",
        "name": "Magic Barrier Wand",
        "stats": {
          "MagicResistance%": 5
        }
      },
      {
        "id": "magic_fragrant_wood",
        "name": "Magic Fragrant Wood",
        "stats": {
          "MATK": 20,
          "MATK%": 2
        }
      },
      {
        "id": "magic_proof_coat",
        "name": "Magic Proof Coat",
        "stats": {
          "MagicResistance%": 10
        }
      },
      {
        "id": "magical_meat_pie",
        "name": "Magical Meat Pie",
        "stats": {
          "HP": 3000
        }
      },
      {
        "id": "mana_catalyst",
        "name": "Mana Catalyst",
        "stats": {
          "AttackMPRecovery": 8
        }
      },
      {
        "id": "mana_potion",
        "name": "Mana Potion",
        "stats": {
          "MP": 2000
        }
      },
      {
        "id": "mana_supply_stone",
        "name": "Mana Supply Stone",
        "stats": {
          "AttackMPRecovery": 3
        }
      },
      {
        "id": "mane_cookie",
        "name": "Mane Cookie",
        "stats": {
          "HP": 10000
        }
      },
      {
        "id": "mapo_eggplant",
        "name": "Mapo Eggplant",
        "stats": {
          "PhysicalResistance%": 25,
          "MagicResistance%": 25
        }
      },
      {
        "id": "marriage_gift__traded_",
        "name": "Marriage Gift (Traded)",
        "stats": {
          "NaturalHPRegen%": 100,
          "DropRate%": 1
        }
      },
      {
        "id": "mashed_sweet_potato",
        "name": "Mashed Sweet Potato",
        "stats": {
          "NaturalMPRegen%": 100,
          "MaxMP": 200
        }
      },
      {
        "id": "matsutake_soup",
        "name": "Matsutake Soup",
        "stats": {
          "AttackMPRecovery": 10,
          "WeaponATK": 10
        }
      },
      {
        "id": "mayo_potato",
        "name": "Mayo Potato",
        "stats": {
          "HP": 3500
        }
      },
      {
        "id": "medicinal_mushroom",
        "name": "Medicinal Mushroom",
        "stats": {
          "Preventsailmentonce.Invalidagainstimmobilization.": 1
        }
      },
      {
        "id": "mega_speed_potion",
        "name": "Mega Speed Potion",
        "stats": {
          "ASPD": 500
        }
      },
      {
        "id": "mellow_mushroom",
        "name": "Mellow Mushroom",
        "stats": {
          "MP": 75
        }
      },
      {
        "id": "melting_candy",
        "name": "Melting Candy",
        "stats": {
          "PhysicalPierce%": 10
        }
      },
      {
        "id": "mentai_cookie",
        "name": "Mentai Cookie",
        "stats": {
          "MP": 100
        }
      },
      {
        "id": "mentai_ice_cream",
        "name": "Mentai Ice Cream",
        "stats": {
          "MP": 150
        }
      },
      {
        "id": "mentai_senbei",
        "name": "Mentai Senbei",
        "stats": {
          "Fireresistance%": 10,
          "Waterresistance%": 10,
          "Windresistance%": 10,
          "Earthresistance%": 10,
          "Lightresistance%": 10,
          "Darkresistance%": 10
        }
      },
      {
        "id": "mint_gummy",
        "name": "Mint Gummy",
        "stats": {
          "MATK": 10,
          "CSPD": 100
        }
      },
      {
        "id": "mirror_of_reflection",
        "name": "Mirror of Reflection",
        "stats": {
          "Canre-selectpersonalstat.Thestatpointsdistributedtothepersonalstatwillbereset.": 0
        }
      },
      {
        "id": "miso_marinated_eggplant",
        "name": "Miso-Marinated Eggplant",
        "stats": {
          "HP": 10000
        }
      },
      {
        "id": "mock_strawberry",
        "name": "Mock Strawberry",
        "stats": {
          "MP": 25
        }
      },
      {
        "id": "monkey_energy",
        "name": "Monkey Energy",
        "stats": {
          "HP": 3000
        }
      },
      {
        "id": "monster_pot",
        "name": "Monster Pot",
        "stats": {
          "MATK": 40,
          "MATK%": 4
        }
      },
      {
        "id": "moving_carrot_cake",
        "name": "Moving Carrot Cake",
        "stats": {
          "HP": 1500
        }
      },
      {
        "id": "Mummy_Roll_Cake ",
        "name": "Mummy Roll Cake ",
        "stats": {
          "Magic Pierce %": 5,
          "Critical Rate %": 40
        }
      },
      {
        "id": "muscle_mushroom",
        "name": "Muscle Mushroom",
        "stats": {
          "ATK": 10,
          "ATK%": 1
        }
      },
      {
        "id": "muscle_oil",
        "name": "Muscle Oil",
        "stats": {
          "ATK": 30,
          "ATK%": 3
        }
      },
      {
        "id": "mushroom",
        "name": "Mushroom",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "mysterious_mushroom",
        "name": "Mysterious Mushroom",
        "stats": {
          "MP": 40
        }
      },
      {
        "id": "naiata",
        "name": "Naiata",
        "stats": {
          "TeleportToNaiata": 1
        }
      },
      {
        "id": "nov_saterica",
        "name": "Nov Saterica",
        "stats": {
          "TeleporttoNovSaterica": 1
        }
      },
      {
        "id": "nut",
        "name": "Nut",
        "stats": {
          "HP": 30
        }
      },
      {
        "id": "omitan_essence",
        "name": "Omitan Essence",
        "stats": {
          "Preventsailmentonce.Invalidagainstimmobilization.": 1
        }
      },
      {
        "id": "onigiri",
        "name": "Onigiri",
        "stats": {
          "HP": 120
        }
      },
      {
        "id": "orange_gelatin",
        "name": "Orange Gelatin",
        "stats": {
          "WeaponATK": 5,
          "WeaponATK%": 5
        }
      },
      {
        "id": "orb_shard_x_100",
        "name": "Orb Shard x 100",
        "stats": {
          "Gives100OrbShards": 100
        }
      },
      {
        "id": "osechi",
        "name": "Osechi",
        "stats": {
          "HP": 10000
        }
      },
      {
        "id": "otsukimi_dango",
        "name": "Otsukimi Dango",
        "stats": {
          "HP": 3000
        }
      },
      {
        "id": "overheat_potion",
        "name": "Overheat Potion",
        "stats": {
          "Dodge": 10
        }
      },
      {
        "id": "ox_tongue_bento",
        "name": "Ox Tongue Bento",
        "stats": {
          "HP": 4000
        }
      },
      {
        "id": "pale_gelatin",
        "name": "Pale Gelatin",
        "stats": {
          "MaxMP": 100
        }
      },
      {
        "id": "pear_tart",
        "name": "Pear Tart",
        "stats": {
          "ASPD": 500,
          "AttackMPRecovery": 3
        }
      },
      {
        "id": "penetrating_oil",
        "name": "Penetrating Oil",
        "stats": {
          "ATK%": 3,
          "PhysicalPierce%": 10
        }
      },
      {
        "id": "persimmon_coryn_forest",
        "name": "Persimmon Coryn Forest",
        "stats": {
          "TeleporttoPersimmonCorynForest": 1
        }
      },
      {
        "id": "phillip_s_pose",
        "name": "Phillip's Pose",
        "stats": {
          "Permanentlyunlockauniqueemotion": 1
        }
      },
      {
        "id": "poisonous_fruit",
        "name": "Poisonous Fruit",
        "stats": {
          "HP%": -5
        }
      },
      {
        "id": "poisonous_mushroom",
        "name": "Poisonous Mushroom",
        "stats": {
          "HP": -25
        }
      },
      {
        "id": "poisonous_root_veggie",
        "name": "Poisonous Root Veggie",
        "stats": {
          "MP": 100
        }
      },
      {
        "id": "poisonous_looking_nut",
        "name": "Poisonous-looking Nut",
        "stats": {
          "HP": 80
        }
      },
      {
        "id": "pom_biscuit",
        "name": "Pom Biscuit",
        "stats": {
          "MP": 150
        }
      },
      {
        "id": "pompoko_meat",
        "name": "Pompoko Meat",
        "stats": {
          "HP": 3000,
          "HP%": 2
        }
      },
      {
        "id": "potato",
        "name": "Potato",
        "stats": {
          "HP": 50
        }
      },
      {
        "id": "potolo_s_pot_au_feu",
        "name": "Potolo's Pot-Au-Feu",
        "stats": {
          "HP": 50
        }
      },
      {
        "id": "potum_beans",
        "name": "Potum Beans",
        "stats": {
          "MaxMP": 500,
          "AttackMPRecovery": 5
        }
      },
      {
        "id": "power_candy",
        "name": "Power Candy",
        "stats": {
          "ATK": 40,
          "ATK%": 4
        }
      },
      {
        "id": "power_essence",
        "name": "Power Essence",
        "stats": {
          "ATK": 20,
          "ATK%": 2
        }
      },
      {
        "id": "practice_revita",
        "name": "Practice Revita",
        "stats": {
          "HP": 10
        }
      },
      {
        "id": "proof_of_unity",
        "name": "Proof of Unity",
        "stats": {
          "Canformaguildonce": 1
        }
      },
      {
        "id": "protector_plate",
        "name": "Protector Plate",
        "stats": {
          "PhysicalResistance%": 10
        }
      },
      {
        "id": "protector_plate_ii",
        "name": "Protector Plate II",
        "stats": {
          "PhysicalResistance%": 12
        }
      },
      {
        "id": "pumpkie_parfait",
        "name": "Pumpkie Parfait",
        "stats": {
          "ATK%": 6
        }
      },
      {
        "id": "pumpkin_candy",
        "name": "Pumpkin Candy",
        "stats": {
          "ASPD": 100,
          "CSPD": 100,
          "%strongeragainstLight": 5
        }
      },
      {
        "id": "pumpkin_chips",
        "name": "Pumpkin Chips",
        "stats": {
          "MP": 15
        }
      },
      {
        "id": "pumpkin_cookie",
        "name": "Pumpkin Cookie",
        "stats": {
          "ASPD": 100,
          "CSPD": 100,
          "%strongeragainstFire": 5
        }
      },
      {
        "id": "pumpkin_pie",
        "name": "Pumpkin Pie",
        "stats": {
          "HP": 500,
          "HP%": 1
        }
      },
      {
        "id": "pumpkin_soup",
        "name": "Pumpkin Soup",
        "stats": {
          "ASPD": 100,
          "CSPD": 100,
          "%strongeragainstNeutral": 5
        }
      },
      {
        "id": "purple_gelatin",
        "name": "Purple Gelatin",
        "stats": {
          "MP": 20
        }
      },
      {
        "id": "red_gelatin",
        "name": "Red Gelatin",
        "stats": {
          "ASPD": 300,
          "ASPD%": 10
        }
      },
      {
        "id": "red_purple_gelatin",
        "name": "Red Purple Gelatin",
        "stats": {
          "MP": 30
        }
      },
      {
        "id": "regera__gift_",
        "name": "Regera (Gift)",
        "stats": {
          "HP": 10
        }
      },
      {
        "id": "regera__purple_",
        "name": "Regera (Purple)",
        "stats": {
          "HP": 2000
        }
      },
      {
        "id": "regera_i",
        "name": "Regera I",
        "stats": {
          "HP": 10
        }
      },
      {
        "id": "regera_ii",
        "name": "Regera II",
        "stats": {
          "HP": 25
        }
      },
      {
        "id": "regera_iii",
        "name": "Regera III",
        "stats": {
          "HP": 50
        }
      },
      {
        "id": "regera_iv",
        "name": "Regera IV",
        "stats": {
          "HP": 100
        }
      },
      {
        "id": "regera_v",
        "name": "Regera V",
        "stats": {
          "HP": 200
        }
      },
      {
        "id": "regera_vi",
        "name": "Regera VI",
        "stats": {
          "HP": 300
        }
      },
      {
        "id": "renowned_archer_s_beard",
        "name": "Renowned Archer's Beard",
        "stats": {
          "Accuracy": 30
        }
      },
      {
        "id": "resilient_jelly",
        "name": "Resilient Jelly",
        "stats": {
          "ATK%": -25,
          "MATK%": -25
        }
      },
      {
        "id": "revita__alchemy_",
        "name": "Revita (Alchemy)",
        "stats": {
          "HP": 400
        }
      },
      {
        "id": "revita__gift_",
        "name": "Revita (Gift)",
        "stats": {
          "HP": 250
        }
      },
      {
        "id": "revita__purple_",
        "name": "Revita (Purple)",
        "stats": {
          "HP": 3000
        }
      },
      {
        "id": "revita_i",
        "name": "Revita I",
        "stats": {
          "HP": 250
        }
      },
      {
        "id": "revita_ii",
        "name": "Revita II",
        "stats": {
          "HP": 500
        }
      },
      {
        "id": "revita_iii",
        "name": "Revita III",
        "stats": {
          "HP": 1000
        }
      },
      {
        "id": "revita_iv",
        "name": "Revita IV",
        "stats": {
          "HP": 2000
        }
      },
      {
        "id": "revita_v",
        "name": "Revita V",
        "stats": {
          "HP": 4000
        }
      },
      {
        "id": "revita_vi",
        "name": "Revita VI",
        "stats": {
          "HP": 7000
        }
      },
      {
        "id": "revita_vii",
        "name": "Revita VII",
        "stats": {
          "HP": 11000
        }
      },
      {
        "id": "revita_viii",
        "name": "Revita VIII",
        "stats": {
          "HP": 16000
        }
      },
      {
        "id": "revive_droplet",
        "name": "Revive Droplet",
        "stats": {
          "Ignorestheresurrectiontime": 0
        }
      },
      {
        "id": "ripe_nut",
        "name": "Ripe Nut",
        "stats": {
          "HP": 5000
        }
      },
      {
        "id": "roast_chicken",
        "name": "Roast Chicken",
        "stats": {
          "HP%": 10
        }
      },
      {
        "id": "roasted_eggplant",
        "name": "Roasted Eggplant",
        "stats": {
          "CriticalRate": 10,
          "NeutralResistance%": 20
        }
      },
      {
        "id": "roasted_fruit",
        "name": "Roasted Fruit",
        "stats": {
          "HP": 50
        }
      },
      {
        "id": "rokoko_grape",
        "name": "Rokoko Grape",
        "stats": {
          "HP": 655
        }
      },
      {
        "id": "rokoko_plains",
        "name": "Rokoko Plains",
        "stats": {
          "TeleporttoRokokoPlains": 1
        }
      },
      {
        "id": "romanian_eggplant_dip",
        "name": "Romanian Eggplant Dip",
        "stats": {
          "AilmentResistance%": 5
        }
      },
      {
        "id": "rugio_ruins",
        "name": "Rugio Ruins",
        "stats": {
          "TeleporttoRugioRuins": 0
        }
      },
      {
        "id": "sake_steamed_scallops",
        "name": "Sake Steamed Scallops",
        "stats": {
          "MP": 25
        }
      },
      {
        "id": "sakura_regera",
        "name": "Sakura Regera",
        "stats": {
          "HP": 60
        }
      },
      {
        "id": "sakuramochi",
        "name": "Sakuramochi",
        "stats": {
          "MaxHP": 300,
          "MaxMP": 30
        }
      },
      {
        "id": "salt_potato",
        "name": "Salt Potato",
        "stats": {
          "HP": 3000
        }
      },
      {
        "id": "salt_grilled_saury",
        "name": "Salt-Grilled Saury",
        "stats": {
          "NaturalHPRegen%": 100,
          "MaxHP": 1000
        }
      },
      {
        "id": "sand_mole_meat",
        "name": "Sand Mole Meat",
        "stats": {
          "HP": -250
        }
      },
      {
        "id": "sashimi",
        "name": "Sashimi",
        "stats": {
          "HP": 300
        }
      },
      {
        "id": "sashimi_plate",
        "name": "Sashimi Plate",
        "stats": {
          "HP": 3000
        }
      },
      {
        "id": "sauted_mushroom",
        "name": "Sauted Mushroom",
        "stats": {
          "MP": 40
        }
      },
      {
        "id": "sauteed_butter_snails",
        "name": "Sauteed Butter Snails",
        "stats": {
          "Accuracy": 30,
          "CriticalRate": 5
        }
      },
      {
        "id": "sauteed_lonogo_shrimp",
        "name": "Sauteed Lonogo Shrimp",
        "stats": {
          "MaxMP": 300,
          "CSPD": 250
        }
      },
      {
        "id": "save_point",
        "name": "Save Point",
        "stats": {
          "Teleporttothelasttownyouvisited": 0
        }
      },
      {
        "id": "scorching_grass",
        "name": "Scorching Grass",
        "stats": {
          "ATK%": 0.1,
          "MATK%": 0.1,
          "WeaponATK": 8
        }
      },
      {
        "id": "scorching_orange",
        "name": "Scorching Orange",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "sea_cucumber",
        "name": "Sea Cucumber",
        "stats": {
          "MaxMP": 100
        }
      },
      {
        "id": "seared_mentaiko",
        "name": "Seared Mentaiko",
        "stats": {
          "Accuracy": 30,
          "CriticalRate": 5
        }
      },
      {
        "id": "shading_handkerchief",
        "name": "Shading Handkerchief",
        "stats": {
          "DEF%": 5,
          "MDEF%": 5,
          "Lightresistance%": 10
        }
      },
      {
        "id": "shark_steak",
        "name": "Shark Steak",
        "stats": {
          "HP": 4000
        }
      },
      {
        "id": "shiny_powder",
        "name": "Shiny Powder",
        "stats": {
          "MDEF": 100,
          "Aggro%": 10
        }
      },
      {
        "id": "shock_absorbing_cream",
        "name": "Shock Absorbing Cream",
        "stats": {
          "VIT": 7,
          "GuardPower%": 7,
          "GuardRecharge%": 7
        }
      },
      {
        "id": "shocking_house_choco",
        "name": "Shocking House Choco",
        "stats": {
          "HP": 2000
        }
      },
      {
        "id": "shooting_star_potion",
        "name": "Shooting Star Potion",
        "stats": {
          "CSPD": 300
        }
      },
      {
        "id": "silver_view_shrine",
        "name": "Silver View Shrine",
        "stats": {
          "Teleporttoamysteriousplacewhereyoucangetcoloredweapons": 1
        }
      },
      {
        "id": "smoked_cheese",
        "name": "Smoked Cheese",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "smoked_mutton",
        "name": "Smoked Mutton",
        "stats": {
          "HP": 1000
        }
      },
      {
        "id": "snow_wine",
        "name": "Snow Wine",
        "stats": {
          "MP%": 10
        }
      },
      {
        "id": "snowball_daifuku",
        "name": "Snowball Daifuku",
        "stats": {
          "HP": 5000
        }
      },
      {
        "id": "soda_water",
        "name": "Soda Water",
        "stats": {
          "MP": 6
        }
      },
      {
        "id": "soft__n_flaky_potato",
        "name": "Soft 'n Flaky Potato",
        "stats": {
          "HP": 500
        }
      },
      {
        "id": "soft_crabmeat",
        "name": "Soft Crabmeat",
        "stats": {
          "HP": 5000
        }
      },
      {
        "id": "soft_boiled_egg",
        "name": "Soft-Boiled Egg",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "sofya_city",
        "name": "Sofya City",
        "stats": {
          "TeleporttoSofyaCity": 0
        }
      },
      {
        "id": "solid_fuel",
        "name": "Solid Fuel",
        "stats": {
          "MotionSpeed%": 10
        }
      },
      {
        "id": "sorcerer_s_nostrum",
        "name": "Sorcerer's Nostrum",
        "stats": {
          "MATK": 50,
          "MATK%": 5
        }
      },
      {
        "id": "sorcery_revita",
        "name": "Sorcery Revita",
        "stats": {
          "HP": 5000,
          "MP": 50
        }
      },
      {
        "id": "soul_pudding",
        "name": "Soul Pudding",
        "stats": {
          "MaxHP": 1000,
          "MaxMP": 300
        }
      },
      {
        "id": "sour_nut",
        "name": "Sour Nut",
        "stats": {
          "HP": 60
        }
      },
      {
        "id": "sparkly_candy",
        "name": "Sparkly Candy",
        "stats": {
          "MATK%": 10,
          "MotionSpeed%": -10
        }
      },
      {
        "id": "special_magiadd",
        "name": "Special Magiadd",
        "stats": {
          "MaxMP": 1000
        }
      },
      {
        "id": "special_regera",
        "name": "Special Regera",
        "stats": {
          "HP%": 1
        }
      },
      {
        "id": "special_revita",
        "name": "Special Revita",
        "stats": {
          "HP%": 25
        }
      },
      {
        "id": "special_vita_plus",
        "name": "Special Vita Plus",
        "stats": {
          "MaxHP%": 100
        }
      },
      {
        "id": "specter_chocolate",
        "name": "Specter Chocolate",
        "stats": {
          "MagicPierce%": 10
        }
      },
      {
        "id": "speed_potion",
        "name": "Speed Potion",
        "stats": {
          "ASPD": 250
        }
      },
      {
        "id": "speed_potion__cool_",
        "name": "Speed Potion (Cool)",
        "stats": {
          "ASPD": 250
        }
      },
      {
        "id": "spell_headphones",
        "name": "Spell Headphones",
        "stats": {
          "CSPD": 700
        }
      },
      {
        "id": "stab_proof_sheet",
        "name": "Stab-Proof Sheet",
        "stats": {
          "PhysicalResistance%": 5
        }
      },
      {
        "id": "star_fruit",
        "name": "Star Fruit",
        "stats": {
          "HP": 5000
        }
      },
      {
        "id": "stardust_magic_potion",
        "name": "Stardust Magic Potion",
        "stats": {
          "CSPD": 100
        }
      },
      {
        "id": "stardust_magic_potion__cool_",
        "name": "Stardust Magic Potion (Cool)",
        "stats": {
          "CSPD": 100
        }
      },
      {
        "id": "starlight_potion",
        "name": "Starlight Potion",
        "stats": {
          "CSPD": 500
        }
      },
      {
        "id": "sticky_dumpling",
        "name": "Sticky Dumpling",
        "stats": {
          "Accuracy": 50
        }
      },
      {
        "id": "stimulant",
        "name": "Stimulant",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "strange_nut",
        "name": "Strange Nut",
        "stats": {
          "Accuracy": 30
        }
      },
      {
        "id": "straw_grilled_chicken",
        "name": "Straw Grilled Chicken",
        "stats": {
          "MP": 30
        }
      },
      {
        "id": "sugar_cookie",
        "name": "Sugar Cookie",
        "stats": {
          "HP": 1500,
          "MP": 200
        }
      },
      {
        "id": "super_bandage",
        "name": "Super Bandage",
        "stats": {
          "DEF%": 5,
          "MDEF%": 5,
          "NeutralResistance%": 10
        }
      },
      {
        "id": "super_delicious_yakitori",
        "name": "Super Delicious Yakitori",
        "stats": {
          "HP": 3000
        }
      },
      {
        "id": "supplement__muscle_",
        "name": "Supplement (Muscle)",
        "stats": {
          "ATK%": 4,
          "Accuracy%": 2
        }
      },
      {
        "id": "sweet_apple",
        "name": "Sweet Apple",
        "stats": {
          "HP": 500
        }
      },
      {
        "id": "sweet_miso_eggplant",
        "name": "Sweet Miso Eggplant",
        "stats": {
          "MP": 100
        }
      },
      {
        "id": "sweet_nut",
        "name": "Sweet Nut",
        "stats": {
          "HP": 500
        }
      },
      {
        "id": "sweet_potato",
        "name": "Sweet Potato",
        "stats": {
          "HP": 350
        }
      },
      {
        "id": "sweet_shrimp",
        "name": "Sweet Shrimp",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "swordsbear_treasured_sake",
        "name": "Swordsbear Treasured Sake",
        "stats": {
          "HP": 12000
        }
      },
      {
        "id": "tasty_honey",
        "name": "Tasty Honey",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "tasty_water",
        "name": "Tasty Water",
        "stats": {
          "MP": 50
        }
      },
      {
        "id": "teleport_ticket",
        "name": "Teleport Ticket",
        "stats": {
          "TeleporttothemapthatyouselectonWorldMap": 1
        }
      },
      {
        "id": "tender_fillet",
        "name": "Tender Fillet",
        "stats": {
          "HP": 1000
        }
      },
      {
        "id": "tera_speed_potion",
        "name": "Tera Speed Potion",
        "stats": {
          "ASPD": 1000
        }
      },
      {
        "id": "third_eye",
        "name": "Third Eye",
        "stats": {
          "Dodge": 40
        }
      },
      {
        "id": "tomato_chips",
        "name": "Tomato Chips",
        "stats": {
          "MP": 15
        }
      },
      {
        "id": "toram_liquor",
        "name": "Toram Liquor",
        "stats": {
          "MP": 10
        }
      },
      {
        "id": "toss_bouquet__traded_",
        "name": "Toss Bouquet (Traded)",
        "stats": {
          "NaturalMPRegen%": 100,
          "DropRate%": 1
        }
      },
      {
        "id": "tough_lamb_meat",
        "name": "Tough Lamb Meat",
        "stats": {
          "STR": 5,
          "MaxHP": 750
        }
      },
      {
        "id": "tough_meat",
        "name": "Tough Meat",
        "stats": {
          "HP": 0
        }
      },
      {
        "id": "training_scroll",
        "name": "Training Scroll",
        "stats": {
          "EXPGain%": 100
        }
      },
      {
        "id": "tricolor_dango",
        "name": "Tricolor Dango",
        "stats": {
          "HP": 30
        }
      },
      {
        "id": "tricolor_dango_ii",
        "name": "Tricolor Dango II",
        "stats": {
          "HP": 300
        }
      },
      {
        "id": "ultra_cheesy_pizza",
        "name": "Ultra Cheesy Pizza",
        "stats": {
          "MP": 75
        }
      },
      {
        "id": "ultra_high_grade_candy",
        "name": "Ultra High Grade Candy",
        "stats": {
          "MP": 100
        }
      },
      {
        "id": "unripe_nut",
        "name": "Unripe Nut",
        "stats": {
          "HP": 15
        }
      },
      {
        "id": "vaccine_i",
        "name": "Vaccine I",
        "stats": {
          "Preventsailmentonce.Invalidagainstimmobilization.": 1
        }
      },
      {
        "id": "vaccine_ii",
        "name": "Vaccine II",
        "stats": {
          "Preventsailmentonce.Invalidagainstimmobilization.": 1
        }
      },
      {
        "id": "vaccine_iii",
        "name": "Vaccine III",
        "stats": {
          "Preventsailmentonce.Invalidagainstimmobilization.": 1
        }
      },
      {
        "id": "vigilant_skull",
        "name": "Vigilant Skull",
        "stats": {
          "DEF%": 10,
          "ReduceDmg(StraightLine)%": 15
        }
      },
      {
        "id": "vita_plus__alchemy_",
        "name": "Vita Plus (Alchemy)",
        "stats": {
          "MaxHP": 750
        }
      },
      {
        "id": "vita_plus__gift_",
        "name": "Vita Plus (Gift)",
        "stats": {
          "MaxHP": 500
        }
      },
      {
        "id": "vita_plus_i",
        "name": "Vita Plus I",
        "stats": {
          "MaxHP": 500
        }
      },
      {
        "id": "vita_plus_ii",
        "name": "Vita Plus II",
        "stats": {
          "MaxHP": 1000
        }
      },
      {
        "id": "vita_plus_iii",
        "name": "Vita Plus III",
        "stats": {
          "MaxHP": 1500
        }
      },
      {
        "id": "vita_plus_iv",
        "name": "Vita Plus IV",
        "stats": {
          "MaxHP": 2000
        }
      },
      {
        "id": "vita_plus_v",
        "name": "Vita Plus V",
        "stats": {
          "MaxHP": 2500
        }
      },
      {
        "id": "vita_plus_vi",
        "name": "Vita Plus VI",
        "stats": {
          "MaxHP": 3000
        }
      },
      {
        "id": "walnut_milk",
        "name": "Walnut Milk",
        "stats": {
          "MP": 30
        }
      },
      {
        "id": "war_dead_bracelet",
        "name": "War Dead Bracelet",
        "stats": {
          "Accuracy": 60
        }
      },
      {
        "id": "warm_fur_sheet",
        "name": "Warm Fur Sheet",
        "stats": {
          "MDEF%": 15,
          "ReduceDmg(Floor)%": 15
        }
      },
      {
        "id": "water_protection_charm",
        "name": "Water Protection Charm",
        "stats": {
          "DEF%": 5,
          "MDEF%": 5,
          "Waterresistance%": 10
        }
      },
      {
        "id": "wedding_wine",
        "name": "Wedding Wine",
        "stats": {
          "HP": 3000,
          "MP": 100
        }
      },
      {
        "id": "whipped_cream",
        "name": "Whipped Cream",
        "stats": {
          "MP": 100
        }
      },
      {
        "id": "white_gelatin",
        "name": "White Gelatin",
        "stats": {
          "Dodge%": 10,
          "EvasionRecharge%": 1
        }
      },
      {
        "id": "wind_protection_charm",
        "name": "Wind Protection Charm",
        "stats": {
          "DEF%": 5,
          "MDEF%": 5,
          "Windresistance%": 10
        }
      },
      {
        "id": "yellow_apple",
        "name": "Yellow Apple",
        "stats": {
          "HP": 3000
        }
      },
      {
        "id": "yellow_gelatin",
        "name": "Yellow Gelatin",
        "stats": {
          "MP": 15
        }
      },
      {
        "id": "yomogi_dango",
        "name": "Yomogi Dango",
        "stats": {
          "HP": 2000
        }
      },
      {
        "id": "yummy_pickles",
        "name": "Yummy Pickles",
        "stats": {
          "HP": 8000
        }
      },
      {
        "id": "zoe_s_tart",
        "name": "Zoe's Tart",
        "stats": {
          "MaxHP": 3000
        }
      },
      {
        "id": "zombie_cake",
        "name": "Zombie Cake",
        "stats": {
          "ASPD": 100,
          "CSPD": 100,
          "%strongeragainstDark": 5
        }
      }
  ]
};

// Palabras clave que identifican un ítem "basura" o de sistema
const SYSTEM_KEYWORDS = [
  "Teleport",    // Teleport tickets, Save points
  "emotion",     // Emotion tickets
  "Orb",         // Orb Shards
  "guild",       // Proof of Unity
  "avatar",      // Fairy Sewing Tool
  "select",      // Mirror of Reflection (re-select)
  "detach",      // Extraction Crysta
  "resurrection" // Revive Droplets
];

// Palabras clave de Libros (Farming)
const FARMING_KEYWORDS = [
  "EXPGain",
  "DropRate"
];

// Configuración: ¿Quieres eliminar pociones de curación (ej. Apple: HP 250)?
// true = Eliminar Revitas y Manzanas (Recomendado para Calculadoras de Builds)
// false = Mantenerlas
const REMOVE_RECOVERY = true; 

function cleanConsumables(jsonData) {
  const cleaned = jsonData.consumables.filter(item => {
    // Obtenemos las claves de los stats del ítem
    const statKeys = Object.keys(item.stats);

    // 1. Chequeo de Sistema (Teleports, Tickets, etc.)
    const isSystemItem = statKeys.some(key => 
      SYSTEM_KEYWORDS.some(badWord => key.toLowerCase().includes(badWord.toLowerCase()))
    );
    if (isSystemItem) return false;

    // 2. Chequeo de Libros (EXP/Drop)
    const isBook = statKeys.some(key => 
        FARMING_KEYWORDS.some(badWord => key.includes(badWord))
    );
    if (isBook) return false;

    // 3. Chequeo de Recuperación (HP/MP planos sin "Max")
    // En Toram, "HP" es curación, "MaxHP" es buff.
    if (REMOVE_RECOVERY) {
        // Si el ítem SOLO tiene stats de curación (HP, MP) y nada más, eliminarlo.
        // Si tiene HP y algo más (ej. MP recovery), hay que tener cuidado, 
        // pero generalmente HP plano es basura para builds.
        const isRecovery = statKeys.every(key => key === "HP" || key === "MP");
        if (isRecovery) return false;
        
        // Filtro estricto: Si tiene la key "HP" (no MaxHP) lo quitamos
        if (statKeys.includes("HP")) return false; 
        if (statKeys.includes("MP") && !statKeys.includes("MaxMP")) return false;
    }

    return true;
  });

  return { consumables: cleaned };
}

// Ejecutar limpieza
const result = cleanConsumables(data);

// Mostrar resultado (copia esto de la consola)
console.log(JSON.stringify(result, null, 2));

// Si usas Node.js y quieres guardarlo en un archivo:
 const fs = require('fs');
 fs.writeFileSync('consumables_clean1.json', JSON.stringify(result, null, 2));