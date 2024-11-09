//import { Message as VercelChatMessage } from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

//import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RunnableSequence } from "@langchain/core/runnables";
//import { formatDocumentsAsString } from "langchain/util/document";
import { fetchUserTrades } from "@/lib/chatSeed";
//import { CharacterTextSplitter } from "langchain/text_splitter";
import { Message as VercelChatMessage, StreamingTextResponse, createStreamDataTransformer } from "ai";

export const dynamic = "force-dynamic";

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are an AI assistant for a multi-tenant automated trading journal platform integrated with cTrader . Your role is to assist users by providing insights based on their trading activities.

==============================
Context: {context}
==============================
Current conversation: {chat_history}

User's trading activities:
{trades}

user: {question}
assistant:`;

export async function POST(req: Request) {
  try {
    // Extract the `messages` from the body of the request
    const { messages, userId } = await req.json(); // Ensure userId is included in the request

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    // Fetch user insights based on userId
    const trades = await fetchUserTrades(userId); // Fetch trades for the user
    console.log(trades);

    // Handle empty trades
    const tradesString = trades.length > 0 ? trades : "No trading activities found.";

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    // Update the context to include user trades
    const context = `\nUser's trading activities:\n${tradesString}`;

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      streaming: true,
      verbose: true,
    });

    const parser = new HttpResponseOutputParser();

    const chain = RunnableSequence.from([
      {
        question: (input) => input.question,
        chat_history: (input) => input.chat_history,
        context: () => context, // Use the updated context
        trades: () => trades, // Ensure trades are included
      },
      prompt,
      model,
      parser,
    ]);

    // Convert the response into a friendly text-stream
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      question: currentMessageContent,
    });

    // Respond with the stream
    return new StreamingTextResponse(stream.pipeThrough(createStreamDataTransformer()));
    //   const insights = await stream; // Assuming the stream resolves to insights
    // return Response.json({ insights }, { status: 200 });
    //return new StreamingTextResponse(stream.pipeThrough(createStreamDataTransformer()));
    // Add insights to the response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // Return insights in the response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error("Error in POST request:", e); // Improved error logging
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
