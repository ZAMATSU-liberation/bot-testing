const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "zama",
    description: "gives you custom response",

    async execute(target, args, GeminiClient) {
        await target.channel.sendTyping();
        await new Promise(resolve => setTimeout(resolve,3000));

        const isInteraction =
            target.isChatInputCommand ? target.isChatInputCommand() : false;

        let userPrompt = "";

        if (isInteraction) {
            await target.deferReply();

            userPrompt = target.options.getString("prompt");

            if (!userPrompt) {
                return target.editReply("Please provide a prompt!");
            }

        } else {
            userPrompt = args.join(" ");

            if (!userPrompt) {
                return target.reply("Please provide a prompt!");
            }
        }
        

        try {

            const response = await GeminiClient.models.generateContent({
                     model: "gemini-3.8-flash",

                    contents : userPrompt,
                    config : {
                        systemInstruction : {text: "be kind and respectful"},
                        temprature : 0.7 ,
                        maxOutputToken : 10000,
                    }
                });

            const aiResponse =
                response.text ||
                "Try again later.";

            if (isInteraction) {

                const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("Custom Response")
                    .setDescription(aiResponse)
                    .setFooter({
                        text: `Requested by ${target.author.username}`
                    })
                    .setTimestamp();

                await target.channel.editReply({
                    embeds: [embed]
                });

            }else if(target.mentions.has(target.client.user)){
                response();
            } else {
                async function response() {
                    const ai  = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("Zama")
                    .setDescription(aiResponse)
                    .setFooter({
                        text: `Requested by ${target.author.globalName}`
                    })
                    .setTimestamp();

                    await target.channel.send({
                    embeds: [ai]
                    });
                }
                response();
            }

        } catch (error) {

            console.error("Gemini API error:", error);

            const errorMsg =
                "An unexpected error occurred while contacting Gemini.";

            if (isInteraction) {
                await target.editReply({
                    content: errorMsg
                });
            } else {
                await target.reply(errorMsg);
            }
        }
    }
};