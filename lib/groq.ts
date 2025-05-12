import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqFunFact(country: string) {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Tell me 5 short, interesting facts about ${country}.
                  Each fact should be concise (1–2 sentences), fun, and easy to read.
                  Return the output as a bulleted Markdown list so it can be directly displayed on a webpage.
                  Do not give me into or conclusion just facts, start with a tagline,
                  Don't use ** for bold. Prefix each bullet with *`,
      },
    ],
    model: "llama3-70b-8192",
  });

  return response.choices[0]?.message?.content || "No fact found 😬";
}
