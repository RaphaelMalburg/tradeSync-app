import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { StreamingTextResponse, createStreamDataTransformer } from "ai";
import { analyzeImageForTradeInsights } from "@/services/analyzeImageForTradeInsights"; // Assuming this is a function you’ll write for image analysis

export const dynamic = "force-dynamic";

const TEMPLATE = `You are an AI assistant for a trading platform. Your role is to provide insights on trade setups based on image analysis and user-provided data.

==============================
Image Analysis Insights: {image_analysis}
==============================
Trade Setup Details: {trade_details}

Based on this information, should the trade be taken? If so, provide advice on entry points, stop loss, and take profit levels.`;

export async function POST(req: Request) {
  try {
    const { tradeDetails, image } = await req.json(); // Expect trade details and an image
    const imageBuffer = Buffer.from(image, 'base64'); // Decode base64 image data

    // Step 1: Analyze the Image (Placeholder function)
    const imageAnalysis = await analyzeImageForTradeInsights(imageBuffer);

    // Step 2: Prepare the prompt and context
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    const context = `Image Analysis Insights:\n${imageAnalysis}\nTrade Setup Details:\n${tradeDetails}`;

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
        image_analysis: () => imageAnalysis,
        trade_details: () => tradeDetails,
      },
      prompt,
      model,
      parser,
    ]);

    // Step 3: Generate trade recommendation
    const stream = await chain.stream({
      image_analysis: imageAnalysis,
      trade_details: tradeDetails,
    });

    // Respond with the streaming text response
    return new StreamingTextResponse(stream.pipeThrough(createStreamDataTransformer()));

  } catch (e: any) {
    console.error("Error in trade analysis endpoint:", e);
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
