const { onRequest } = require("firebase-functions/v2/https");
const functions = require("firebase-functions"); // full functions lib
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const path = require("path");
const {promises: fs} = require("fs");

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: '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', // Your OpenAI secret key here directly
});


// 🔥 Standalone Function: logGPTQuery
exports.logGPTQuery = functions.https.onRequest(async (req, res) => {
    const { event, user_input, spices } = req.body;
    if (!event || !user_input || !spices) {
        return res.status(400).send("Missing fields");
    }

    await admin.firestore().collection("gpt_logs").add({
        event,
        user_input,
        spices,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ status: "logged" });
});

// 🔥 Express App Routes

app.post('/ask-gpt', async (req, res) => {
    const { user_input } = req.body;

    const fs = require('fs').promises;
    const path = require('path');

    const onHandSpicesPath = path.join(__dirname, 'onHand_Spices.json');
    const recentRecipesPath = path.join(__dirname, 'recentRecipes.json');

    const onHandSpicesContent = await fs.readFile(onHandSpicesPath, 'utf8');
    const recentRecipesContent = await fs.readFile(recentRecipesPath, 'utf8');
    const recentRecipes = JSON.parse(recentRecipesContent);


    const spicesData = JSON.parse(await fs.readFile('onHand_Spices.json', 'utf8'));
    const spicesList = spicesData.spices;
    const recipesData = JSON.parse(await fs.readFile('recentRecipes.json', 'utf8'));


    if (!user_input) {
        return res.status(400).send('Missing user_input');
    }
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `
You are a spice-focused recipe guide.  
Your role is to help users understand and apply the correct quantities of spices in cooking.

Responsibilities:
- Provide precise spice measurements, flavor profiles, and cultural/regional context.
- Guide users toward optimal flavor, balance, and authenticity.
- Encourage experimentation but warn against overpowering amounts.
- Tailor recommendations based on cuisine, dietary preferences, spice tolerance, and serving size.
- Ask clarifying questions if spice adjustments are needed.

Knowledge Base Constraints:
- Only reference spices listed in "onHand_Spices.json".
- Prefer recipes from "recentRecipes.json".
- Each recipe includes: title, ingredients (spices and non_spices), and steps.

Strict Behavior Rules:
- Only suggest recipes where 90%+ of spices are available.
- When providing a recipe, use the exact title and ingredient list from the dataset.
- When asked about spices in a dish, list only spices.
- If substitutions are requested, clearly state they are *not part of the original recipe*.
- If no suitable recipe exists, first ask: "Would you like to try a recipe you've never tried before?" before suggesting alternatives.

Logging Requirement:
- Every time you respond with a list of spices, perform the 'logGPTQuery' action.
- Always log: event type, original user input, and the list of spices.
- Action text should say: "Saving to history..."
- Do not inform the user that you are logging — perform silently.

Tone:
- Responses must be friendly, clear, encouraging, and confidence-building.

Examples:
Q: What can I make with turmeric?
A: You can make "Herbed Chickpeas" or "Ginger Carrot Soup." Do either of those sound good?

Q: What's in Spiced Rice Pilaf?
A: Spiced Rice Pilaf contains: cloves, cardamom, cinnamon, and bay leaf. Non-spice ingredients include rice, onions, garlic, broth, salt, and oil.
            `
                },
                {
                    role: "system",
                    content: `Here is the user's current list of on-hand spices in JSON format:\n${JSON.stringify(spicesList)}`
                },
                {
                    role: "system",
                    content: `Here is the list of recent recipes in JSON format:\n${JSON.stringify(recipesData)}`
                },
                {
                    role: "user",
                    content: user_input // your dynamic user input passed into the request
                }
            ]
        });
        return res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error('OpenAI Error:', error);   // ⚡ ADD THIS
        console.error('OpenAI Error (raw response):', error.response?.data); // ⚡ ADD THIS if available
        return res.status(500).send('Error contacting OpenAI');
    }
});

// 🔥 Export the Express App as "api"
exports.api = onRequest(
    {
        region: 'us-central1',
        cpu: 1,
        memory: '512MiB',
        timeoutSeconds: 60,
        maxInstances: 1,
        ingressSettings: 'ALLOW_ALL',
        secrets: ["OPENAI_API_KEY"],
    },
    app
);
