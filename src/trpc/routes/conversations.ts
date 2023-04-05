// trpc/conversations.ts
import { prisma } from '@utils/prismaSingleton';
import { trpc } from '../instance'
import { router } from '../../server/trpc';
// import { trpc } from '../../utils/trpc'
import { z } from 'zod';

export const query = trpc.procedure.query(async () => {
  const conversations =
    await prisma.conversation.findMany();
  console.log('\x1b[31m%s\x1b[0m', "conversations", conversations);
  return conversations
})

export const createConversation = trpc.procedure.input((req: any) => {
  console.log('\x1b[31m%s\x1b[0m', "inserting....", req);
  if (req.id) {
    throw new Error(`New conversations can't be made when an id property is passed"}`);
  }
  return req;
}).query(async ({ input }) => {
  console.log("INPUT:", input);
  const { messages, name } = input;
  const conversation = await prisma.conversation.create({
    data: {
      messages: {
        createMany: {
          data: messages,
        },
      },
      name: name,
    },
    include: {
      messages: { orderBy: { id: 'asc' } },
    },
  });
  console.log('\x1b[31m%s\x1b[0m', "inserted", conversation);
  return conversation;
})

export const get = trpc.procedure.input(
  z.object({
    id: z.union([z.number(), z.undefined()]),
  }),
).query(async ({ input }) => {
  const conversation = await prisma.conversation.findUnique({ where: { id: Number(input.id) }, include: { messages: { orderBy: { id: 'asc' } } } });
  return conversation;
})

export const update = trpc.procedure.input((req: any) => {
  console.log('\x1b[31m%s\x1b[0m', "inserting....", req);
  if (!req.id) {
    throw new Error(`Conversations without an id property can't be updated"`);
  }
  return req;
}).query(async ({ input }) => {
  const conversation = input;
  return await prisma.conversation.update({
    where: { id: conversation.id },
    data: conversation,
    include: { messages: { orderBy: { id: 'asc' } } },
  });
})

export const deleteConversation = trpc.procedure.input((req) => {
  return req;
}).mutation(async ({ input }) => {
  const id = input as number;
  console.log("conversation to delete:", id);

  return await prisma.conversation.delete({ where: { id } });
});

export const conversationsRouter = router({
  query: query,
  create: createConversation,
  get: get,
  update: update,
  delete: deleteConversation,
});