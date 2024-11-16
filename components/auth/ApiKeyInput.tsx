"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Input } from "../ui/input";
import { generateApiKey } from "@/lib/actions/apiKey";
import { useToast } from "@/lib/hooks/use-toast";

const ApiKeyInput = ({ apiKey }: { apiKey: string | null }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState(apiKey);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateKey = async () => {
    setIsLoading(true);
    try {
      const result = await generateApiKey();
      if (result.apiKey) {
        setCurrentApiKey(result.apiKey);
        toast({
          title: "New API key generated successfully",
          description: "Your new API key has been generated and copied to your clipboard.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",

        title: "Failed to generate new API key",
        description: "Please try again later.",
      });
      console.error("Failed to generate API key:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentApiKey || "");
      toast({
        title: "API key copied to clipboard",
        description: "You can now use your API key in your trading platform.",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        variant: "destructive",

        title: "Failed to copy API key",
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input readOnly value={currentApiKey || ""} className="font-mono" type={showApiKey ? "text" : "password"} />
      <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)} title={showApiKey ? "Hide API Key" : "Show API Key"}>
        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
      <Button variant="outline" size="icon" onClick={handleCopy} title="Copy API Key">
        <Copy className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={handleGenerateKey} disabled={isLoading} title="Generate New API Key">
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
};

export default ApiKeyInput;
