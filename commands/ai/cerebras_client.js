const {OpenAI} = require('openai');
const cerebras = new OpenAI({apiKey : process.env.cerebrus_api,
    baseURL : "https://api.cerebras.ai/v1"
});
