# ✈️ Travel AI: Explore the World, Enriched with AI

**Travel AI** is an interactive, AI-powered world map that lets you click on any country and instantly discover its key facts — capital, population, flag — along with fun, engaging trivia generated in real-time by a Large Language Model (LLM) via **[GROQ](https://groq.com/)**.

Built with **Next.js**, **MapLibre GL**, and **Tailwind CSS**, this responsive app delivers an elegant and educational experience for travelers, students, and the globally curious.


https://github.com/user-attachments/assets/96bbb076-17b6-4a43-ab14-bf6f0c0e69fe


🔗 **Live Demo**: [https://travel-ai.vercel.app](https://travel-ai-61vm9or3s-sanjanaashivanands-projects.vercel.app/)

---

## ✨ Features

- 🌐 **Interactive World Map** — Clickable countries rendered with [MapLibre GL](https://maplibre.org/)
- 📍 **Live Country Data** — Name, capital, population, and national flag
- 🤖 **AI-Generated Fun Facts** — GROQ-powered LLM returns short, delightful trivia for each country
- 💬 **Smart Tooltip Positioning** — Prevents screen overflow and adapts to viewport size
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop
- 🎨 **Beautiful UI** — Styled with Tailwind CSS and DaisyUI

---

## 🛠 Tech Stack

| Tech             | Description                                 |
|------------------|---------------------------------------------|
| **Next.js**       | React framework with file-based routing     |
| **TypeScript**    | Type safety and better DX                  |
| **MapLibre GL JS**| Open-source web map renderer               |
| **GROQ**          | LLM-powered trivia generation               |
| **Tailwind CSS**  | Utility-first styling                      |
| **DaisyUI**       | Prebuilt components on top of Tailwind     |

---

## 📦 Installation

Clone the project and install dependencies:

```bash
git clone https://github.com/your-username/travel-ai.git
cd travel-ai
npm install
```

Start the development server:

```bash
npm run dev
```

Then visit http://localhost:3000 🚀

---

## 🔐 Environment Variables

Create a .env.local file in the root directory and add:

```bash
NEXT_PUBLIC_COUNTRY_INFO_API_TOKEN=your_restfulcountries_api_token
GROQ_API_KEY=your_groq_api_key
```

You’ll need an API key from GROQ and RESTfulCountries.

## 🧠 Prompt Engineering with GROQ

We send dynamic prompts to GROQ’s LLM to generate facts like:

"Tell me 5 short, interesting facts about Japan. Return a Markdown list starting with a tagline."

The result is parsed and displayed in a styled tooltip, perfect for quick learning or casual exploring.

## 🔮 Planned Enhancements
- 🌍 Fit-to-country bounding box zoom on selection
- 🔍 Country search with autocomplete
- 💾 Save favorite facts to local storage
- 🌙 Dark mode toggle
- 🔄 Regenerate trivia button 


---

## 📝 License

MIT © [Sanjana Ashivanand](https://github.com/sanjanaashivanand)

---

## 🙏 Acknowledgements

- [MapLibre GL JS](https://maplibre.org/)
- [GROQ](https://groq.com/)
- [RESTfulCountries API](https://restfulcountries.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Vercel](https://vercel.com/) — for hassle-free deployment ❤️

---

## 🚀 Deploy Your Own

Want to fork, customize, and deploy this map for your own use case? Click below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project)

---

## 💬 Feedback

If you enjoyed this project or have suggestions, feel free to open an [issue](https://github.com/your-username/travel-ai/issues) or reach out via [LinkedIn](https://linkedin.com/in/sanjanaashivanand).

---
