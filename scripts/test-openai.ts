import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

async function test() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are an elite federal market analyst. Return a JSON object containing updated real-time information for the requested territory. Format: {\"newsHtml\": \"<ul><li>...</li></ul>\", \"techPriorities\": [\"...\"], \"primeContractors\": [\"...\"], \"leadership\": {\"CIO\": {\"name\": \"...\", \"url\": \"https://www.linkedin.com/search/results/people/?keywords=...\"}, \"Deputy CIO\": {\"name\": \"...\"}, \"CDO\": {\"name\": \"...\"}}}. For the news items in newsHtml, include anchor links ONLY if you are absolutely certain of the exact, working URL. DO NOT hallucinate or guess URLs; if you do not know the real URL, do not include a link. Ensure the leadership object includes the CIO and Deputy CIO at a minimum, along with any other key stakeholders related to cloud, AI, tech modernization, data, or automation. For LinkedIn URLs, ALWAYS generate a search URL for the person (e.g., https://www.linkedin.com/search/results/people/?keywords=First+Last+Agency) instead of attempting to guess their direct profile link. Official gov site links can be direct."
        },
        {
          role: "user",
          content: `Generate updated news (HTML bullets), tech priorities, prime contractors, and leadership for U.S. Department of Homeland Security Headquarters.`
        }
      ]
    });
    console.log("Response:", response.choices[0].message.content);
    JSON.parse(response.choices[0].message.content!);
    console.log("JSON Parse: SUCCESS");
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
