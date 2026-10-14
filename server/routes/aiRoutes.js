import express from "express";
import OpenAI from "openai";
import "dotenv/config";

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

router.post("/recommend", async (req, res) => {
    try {
        const { interest, sessions } = req.body;

        if (!interest) {
            return res.status(400).json({
                success: false,
                message: "Please provide your interest."
            });
        }

        if (!Array.isArray(sessions) || sessions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide conference sessions."
            });
        }

        const sessionText = sessions
            .map((session, index) => {
                return `
Session ${index + 1}
Title: ${session.title || ""}
Description: ${session.description || ""}
Speaker: ${session.speaker || ""}
Track: ${session.track || ""}
Room: ${session.room || ""}
Date: ${session.date || ""}
`;
            })
            .join("\n");

        const response = await openai.responses.create({
            model: "gpt-6-luna",
            input: [
                {
                    role: "system",
                    content:
                        "You are an AI assistant for a Smart Event and Conference Management Portal. Recommend conference sessions based only on the sessions provided by the system."
                },
                {
                    role: "user",
                    content: `
Attendee interest:
${interest}

Available conference sessions:
${sessionText}

Choose the 3 most relevant sessions.

Return ONLY a JSON array:

[
    {
        "sessionTitle": "exact session title",
        "reason": "short explanation"
    }
]
`
                }
            ]
        });

        const resultText = response.output_text;

        let recommendations;

        try {
            recommendations = JSON.parse(resultText);
        } catch {
            recommendations = [
                {
                    sessionTitle: "AI Recommendation",
                    reason: resultText
                }
            ];
        }

        res.json({
            success: true,
            recommendations
        });

    } catch (error) {
        console.error("OpenAI error:", error);

        res.status(500).json({
            success: false,
            message: "AI recommendation failed.",
            error: error.message
        });
    }
});

export default router;

