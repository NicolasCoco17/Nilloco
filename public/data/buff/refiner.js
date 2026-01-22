const fs = require('fs');

// 1. CONFIGURACIÓN DE ARCHIVOS DE XTALS
const xtalFiles = [
    'xtal_add.json',
    'xtal_anillo.json',
    'xtal_arma.json',
    'xtal_armor.json',
    'xtal_normal.json'
];

let xtalsBlacklist = new Set();

// 2. CARGAR TODOS LOS NOMBRES DE XTALS
console.log("--- Cargando bases de datos de Xtals ---");
xtalFiles.forEach(fileName => {
    try {
        if (fs.existsSync(fileName)) {
            const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
            // Los archivos de xtals son arrays directos [...]
            data.forEach(x => {
                if (x.name) {
                    xtalsBlacklist.add(x.name.toLowerCase().trim());
                }
            });
            console.log(`[OK] ${fileName} cargado.`);
        }
    } catch (e) {
        console.log(`[!] No se pudo leer ${fileName}:`, e.message);
    }
});

// 3. PROCESAR CONSUMIBLES
try {
    console.log("\n--- Procesando consumibles.json ---");
    const cRaw = JSON.parse(fs.readFileSync('consumibles.json', 'utf8'));
    
    // Accedemos al array dentro de la propiedad "consumables"
    const cData = cRaw.consumables;

    if (!Array.isArray(cData)) {
        throw new Error("La propiedad 'consumables' no es un array o no existe.");
    }

    const resultadoFiltrado = cData.filter(item => {
        if (!item.name || !item.stats) return false;

        const nombreLimpio = item.name.toLowerCase().trim();

        // REGLA 1: Si el nombre está en la lista de Xtals, se elimina
        if (xtalsBlacklist.has(nombreLimpio)) {
            return false;
        }

        // REGLA 2: Eliminar basura (cajas, libros de skills, teletransporte)
        const blacklistKeywords = ['box', 'pack', 'holder', 'book', 'chest', 'gems', 'tomb', 'manor'];
        if (blacklistKeywords.some(word => nombreLimpio.includes(word))) return false;

        // REGLA 3: Si no tiene estadísticas de combate reales
        const keys = Object.keys(item.stats);
        if (keys.length === 0) return false;

        return true;
    }).map(item => {
        // Normalizar estadísticas para la App
        const cleanStats = {};
        Object.keys(item.stats).forEach(key => {
            const cleanKey = key.replace(/\s+/g, ''); // "DEF %" -> "DEF%"
            const numValue = parseFloat(item.stats[key]);
            if (!isNaN(numValue)) {
                cleanStats[cleanKey] = numValue;
            }
        });

        return {
            id: item.id || item.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            name: item.name,
            stats: cleanStats
        };
    });

    // 4. ELIMINAR DUPLICADOS POR ID
    const finalPotions = Array.from(new Map(resultadoFiltrado.map(p => [p.id, p])).values());

    // 5. GUARDAR RESULTADO
    const output = {
        buffData: {
            potion: finalPotions
        }
    };

    fs.writeFileSync('consumibles_limpios.json', JSON.stringify(output, null, 2));

    console.log(`\n--- RESULTADOS ---`);
    console.log(`Total Xtals para excluir: ${xtalsBlacklist.size}`);
    console.log(`Consumibles originales: ${cData.length}`);
    console.log(`Consumibles finales: ${finalPotions.length}`);
    console.log(`Archivo creado: consumibles_limpios.json`);

} catch (error) {
    console.error("\n[ERROR CRÍTICO]:", error.message);
}