import OpenAI from "openai";

export const configureOpenAI = () => {
    return new OpenAI({
        apiKey: process.env.OPEN_AI_KEY,
        organization: process.env.OPENAI_ORGANIZATION_ID,
    });
};
