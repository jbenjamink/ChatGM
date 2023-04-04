import { prisma } from '@utils/prismaSingleton';
import { trpc } from '../instance'
import { router, procedure } from '../../server/trpc';
import { z } from 'zod';
const { Prisma } = require('@prisma/client');
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

interface Conversation {
    name?: string,
    messages: any[],
    id?: number,
    isActive?: boolean,
}

export const query = trpc.procedure.input((req: any) => {
    console.log("requesting response from assistant");
    return req;
}).query(async ({ input }) => {
    console.log("trying)");
    console.log('\x1b[31m%s\x1b[0m', "fucking trying", input);
    try {
        const conversation = input as Conversation;
        var messages: ChatCompletionRequestMessage[] = conversation.messages.map(({ role, content }) => ({ role, content }));
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
        });

        var response = completion?.data?.choices[0]?.message?.content || undefined;
        const responseMessage = {
            role: "assistant",
            content: response || "",
            avatarSource: "avatar-chat.png",
            sender: "ChatGPT-3.5",
            // conversationId: conversation.id,
        };
        // const inserted = await prisma.message.create({ data: responseMessage });
        const updatedConversation = await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
                messages: {
                    create: responseMessage,
                },
            },
            include: { messages: { orderBy: { id: 'asc' } } },
        });
        console.log("updatedConversation", updatedConversation);
        return updatedConversation;;
    } catch (e) {
        console.log("openai error:", e);
    }
});

export const generateName = trpc.procedure.input((req: any) => {
    console.log("attempting to name");
    return req;
}).query(async ({ input }) => {
    try {
        const conversation = input as Conversation;
        var messages: ChatCompletionRequestMessage[] = conversation.messages.map(({ role, content }) => ({ role, content }));
        var nameRequestMessage: ChatCompletionRequestMessage = {
            role: "user",
            content: "generate a name for this conversation without quotation marks "
        }
        console.log("previous messages:", messages);
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [...messages, nameRequestMessage],
        });
        var name = completion?.data?.choices[0]?.message?.content || undefined;
        name = name?.trim().replace(/^"(.*)"$/, '$1');
        console.log("New name:", name);
        const updatedConversation = await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
                name: name,
            },
            include: { messages: { orderBy: { id: 'asc' } } },
        });
        return updatedConversation;
    } catch (e) {
        console.log("error in naming", e);
    }
})

export const openaiRouter = router({
    query: query,
    generateName: generateName,
});