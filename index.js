import { openai } from "./config/open-ai.js";
import readlineSync from "readline-sync";
import colors from "colors";

async function main() {
    console.log(colors.bold.green('Welcome to the Chatbot Program!'));
    console.log(colors.bold.green('You can start chatting with the bot. Type "exit" to quit.'));

    const chatHistory = [];

    while (true) {
        const userInput = readlineSync.question(colors.yellow('You: '));

        if (userInput.toLowerCase() === 'exit') {
            console.log(colors.bold.green('Bot: Goodbye!'));
            break;
        }

        try {
            const messages = chatHistory.map(([role, content]) => ({ role, content }));
            messages.push({ role: 'user', content: userInput });

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messages
            });

            const completionText = completion.data.choices[0].message.content;

            console.log(colors.bold.green(`Bot: ${completionText}`));

            chatHistory.push(['user', userInput]);
            chatHistory.push(['assistant', completionText]);

        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.log(colors.red("Rate limit exceeded. Please try again later."));
            } else {
                console.error(colors.red("Error: " + error.message));
            }
        }
    }
}

main();
