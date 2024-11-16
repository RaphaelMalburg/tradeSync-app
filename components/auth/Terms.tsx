import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Terms = () => {
  return (
    <Card className="max-w-4xl mx-auto my-8 bg-inherit">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Terms of Use</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Service Description</h2>
          <p className="text-muted-foreground">
            cTrader Journal provides a trading journal and analysis platform for traders, offering automated trade logging, analytics, and AI-powered insights.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
          <p className="text-muted-foreground">
            Users are responsible for maintaining the confidentiality of their account credentials and ensuring the accuracy of their trading data.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Data Privacy</h2>
          <p className="text-muted-foreground">We collect and process trading data in accordance with our privacy policy. Your data is encrypted and securely stored.</p>
        </section>

        <Separator />

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Limitations</h2>
          <p className="text-muted-foreground">
            The platform&apos;s analysis and AI insights are for informational purposes only and should not be considered as financial advice.
          </p>
        </section>
      </CardContent>
    </Card>
  );
};

export default Terms;
