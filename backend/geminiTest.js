import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config(); // load .env

// use the key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("speech on india in marathi");
    console.log("✅ Gemini Response:", result.response.text());
  } catch (error) {
    console.error("❌ Gemini Error:", error);
  }
}

testGemini();
