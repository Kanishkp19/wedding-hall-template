import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required to run the Royal AI Planner");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Royal Wedding Planner
  app.post("/api/ai/planner", async (req, res) => {
    try {
      const { theme, guests, traditions, additionalNotes } = req.body;
      
      const ai = getAI();
      const prompt = `Build a custom, high-end heritage Rajasthani royal wedding itinerary and experience plan for a celebration at Heritage Estates in Udaipur. 
Here are the user inputs:
- Custom Theme: ${theme || "Imperial Rajput Royalty"}
- Guest Count: ${guests || 200}
- Royal Traditions to Include: ${traditions || "Shehnai & Trumpets welcome, oil lanterns illumination"}
- Special Requests: ${additionalNotes || "None"}

Please design a comprehensive structural plan. It should contain authentic 19th-century Rajasthani terminology, majestic Udaipur/Mewar references, and premium experience suggestions.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the head Royal AI Planner and Court Scribe at Heritage Estates (Udaipur, India), specializing in royal Rajput weddings and celebrations. Create a personalized, high-fidelity experience matching imperial standards. Return a single JSON object matching the requested schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              themeTitle: { type: Type.STRING, description: "Bespoke Royal title for this wedding theme" },
              alignedPackage: { type: Type.STRING, description: "Which Heritage Estates Package fits best: 'The Rajkumari Set', 'The Mewar Durbar Sovereign', or 'The Maharana Imperial Grandeur'?" },
              palaceVibeOverview: { type: Type.STRING, description: "Elegant 2-sentence description of the visual atmosphere, sensory mood, and scent pairings." },
              culinaryCuration: {
                type: Type.ARRAY,
                description: "3 highly specific Rajasthani imperial dishes curated for this celebration",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Name of the royal dish (e.g., Lapis Lazuli Kesari Bhat)" },
                    course: { type: Type.STRING, description: "Course level (e.g., Shahi Appetizer, Royal Relish, Main Feast, Sweet Court)" },
                    description: { type: Type.STRING, description: "1-sentence sensory description referencing royal wood-fire cooking, saffron, or local organic herbs." }
                  },
                  required: ["name", "course", "description"]
                }
              },
              ceremonialItinerary: {
                type: Type.ARRAY,
                description: "3 major milestones of the celebration day with grand names",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING, description: "Time of day (e.g., 4:00 PM - Sunset)" },
                    title: { type: Type.STRING, description: "Stunning ceremony title (e.g. Swarna Arch Arrival Ritual)" },
                    venueSpot: { type: Type.STRING, description: "Exact estate location to use: 'Sabha Niwas Durbar', 'The Zenana Kund', or 'The Badi Mahal Bagh'" },
                    highlights: { type: Type.STRING, description: "What happens. Highlight royal sensory details like live shehnai, flaming archways, rose petal showers, or sitar." }
                  },
                  required: ["time", "title", "venueSpot", "highlights"]
                }
              },
              royalConsultAdvice: { type: Type.STRING, description: "Bespoke, direct advice from the Head Royal Court Scribe about coordinating the timeline, handling guest counts, or choosing custom elements." }
            },
            required: ["themeTitle", "alignedPackage", "palaceVibeOverview", "culinaryCuration", "ceremonialItinerary", "royalConsultAdvice"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response received from Gemini model");
      }
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("AI Planner REST endpoint error:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI wedding itinerary" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode with static directory serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started and listening on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Fatal error starting Express server:", error);
});
