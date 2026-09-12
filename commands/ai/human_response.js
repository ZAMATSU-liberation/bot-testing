const cerebras = require("./cerebras_client.js");
const {orihime} = require("../prompt/prompt.js");
// commands/ai/ai_response.js

// per-user conversation memory (same as before)
const userChats = new Map();

module.exports = {
  name: "orihime",
  async execute(target, argsGeminiClient) {
    const prompt = target.content.replace(/<@!?\d+>/g, "").trim();
    if (!prompt) return target.reply("mention me WITH words cunt!!");

    if (!userChats.has(target.author.id)) {
      userChats.set(target.author.id, [
        { role: "system", content: orihime.toPrompt() },
      ]);
    }
    const history = userChats.get(target.author.id);

    // keep last ~20 messages so jay doesn't forget the lore
    history.push({ role: "user", content: `${target.author.username}: ${prompt}` });

    try {
      await target.channel.sendTyping();

      const res = await cerebras.chat.completions.create({
        model: "qwen-3-235b-a22b-instruct-2507", // or "llama3.1-8b" — check their model list
        messages: history,
        temperature: 0.9,
        max_tokens: 1024, // safety cap so jay doesn't write a novel
      });

      const reply = res.choices[0].message.content;

      history.push({ role: "assistant", content: reply });
      if (history.length > 21) history.splice(1, 2); // trim, keep system prompt

      await target.channel.reply(reply);
    } catch (err) {
      console.error(err);
      if (err.status === 429) {
        await target.reply("bestie slow down i'm literally one person 💀");
      } else {
        await target.reply("something broke on my end, one sec 😭");
      }
    }
  },
};

