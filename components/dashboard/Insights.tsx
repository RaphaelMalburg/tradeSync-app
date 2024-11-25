"use client";

import { useChat } from "ai/react";
import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Insights({ userId }: { userId: string }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { userId },
    onError: (e) => {
      console.error("Chat error:", e);
      // You could add a toast notification here
    },
  });

  const chatParent = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>AI Trading Assistant</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-[600px]">
            <section className="flex-grow overflow-hidden">
              <ul ref={chatParent} className="h-full p-4 bg-muted/50 rounded-lg overflow-y-auto flex flex-col gap-4">
                {messages.length === 0 && <li className="text-center text-muted-foreground py-6">Start a conversation with your AI trading assistant</li>}
                {messages.map((m, index) => (
                  <div key={index}>
                    {m.role === "user" ? (
                      <li className="flex flex-row">
                        <div className="rounded-xl p-4 bg-primary text-primary-foreground shadow-md flex max-w-[80%]">
                          <p>{m.content}</p>
                        </div>
                      </li>
                    ) : (
                      <li className="flex flex-row-reverse">
                        <div className="rounded-xl p-4 bg-background shadow-md flex max-w-[80%]">
                          <p>{m.content}</p>
                        </div>
                      </li>
                    )}
                  </div>
                ))}
              </ul>
            </section>

            <section className="p-4 border-t mt-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input className="flex-1" placeholder="Ask about your trading patterns, performance analysis..." value={input} onChange={handleInputChange} disabled={isLoading} />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              </form>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
