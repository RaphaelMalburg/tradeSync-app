import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { checkUser } from "@/lib/checkUser";
import ApiKeyInput from "@/components/auth/ApiKeyInput";

const ApiSettings = async () => {
  const user = await checkUser();

  if (!user) {
    return <div>User not found</div>;
  }
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
          <CardDescription>Manage your API key for cTrader integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ApiKeyInput apiKey={user.apiKey} />

          <Alert>
            <AlertDescription>
              To connect your cTrader account:
              <ol className="list-decimal ml-6 mt-2 space-y-1">
                <li>Copy your API key above</li>
                <li>Open the cTrader Journal plugin in your cTrader platform</li>
                <li>Paste the API key in the settings section</li>
                <li>Click Save to establish the connection</li>
              </ol>
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertDescription>Important: Keep your API key secure and never share it with anyone. This key provides direct access to your trading journal.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiSettings;
