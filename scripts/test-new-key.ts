import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

async function test() {
  try {
    const response = await openai.models.list();
    console.log("SUCCESS! Key is valid. Models count:", response.data.length);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
