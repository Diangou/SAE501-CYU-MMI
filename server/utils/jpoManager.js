import fs from "fs/promises";
import path from "path";

const jpoFilePath = path.join(process.cwd(), "src/data/jpo.json");

// Fonction pour lire le fichier JSON
export const getJpoData = async () => {
    try {
        const data = await fs.readFile(jpoFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Erreur lors de la lecture du fichier JPO :", error);
        return { date: "Non définie", time: "Non défini" }; // Valeurs par défaut
    }
};

export const updateJpoData = async (newData) => {
    try {
        console.log("Données enregistrées dans jpo.json :", newData);

        const jsonData = JSON.stringify(newData, null, 2);
        await fs.writeFile(jpoFilePath, jsonData, "utf-8");

        return true;
    } catch (error) {
        console.error(" Erreur lors de la mise à jour du fichier JPO :", error);
        return false;
    }
};
