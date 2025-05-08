import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqFunFact(country: string) {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Tell me some interesting facts about the ${country}. Keep it short and delightful.`,
      },
    ],
    model: "llama3-70b-8192",
  });

  return response.choices[0]?.message?.content || "No fact found 😬";
}
