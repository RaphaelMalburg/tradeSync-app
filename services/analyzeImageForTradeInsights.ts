import vision from '@google-cloud/vision';

export async function analyzeImageForTradeInsights(imageBuffer: Buffer): Promise<string> {
  const client = new vision.ImageAnnotatorClient();
  const [result] = await client.documentTextDetection({ image: { content: imageBuffer } });
  
  // Extract text and insights from the image
  const annotations = result.textAnnotations || [];
  return annotations.map(annotation => annotation.description).join('\n');
}
