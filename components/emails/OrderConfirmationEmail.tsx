import { Body, Container, Column, Head, Heading, Hr, Html, Preview, Row, Section, Text } from "@react-email/components";
import * as React from "react";

interface OrderConfirmationEmailProps {
  orderDetails: {
    id: string;
    items: { name: string; description: string; price: number; quantity: number }[];
    total: number;
  };
}

export function OrderConfirmationEmail({ orderDetails }: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your order has been confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={message}>
            <Heading style={global.heading}>Order Confirmation</Heading>
            <Text style={global.text}>Thank you for your purchase! Your order ID is {orderDetails.id}.</Text>
            <Hr style={global.hr} />
            <Section>
              {orderDetails.items.map((item, index) => (
                <Row key={index}>
                  <Column>
                    <Text style={global.text}>{item.name}</Text>
                    <Text style={global.text}>Quantity: {item.quantity}</Text>
                    <Text style={global.text}>Price: ${(item.price * item.quantity).toFixed(2)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
            <Hr style={global.hr} />
            <Text style={global.text}>Total: ${orderDetails.total.toFixed(2)}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "10px auto",
  width: "600px",
  maxWidth: "100%",
  border: "1px solid #E5E5E5",
};

const message = {
  padding: "40px 74px",
  textAlign: "center",
} as React.CSSProperties;

const global = {
  heading: {
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: "-1px",
  } as React.CSSProperties,
  text: {
    margin: "0",
    lineHeight: "1.5",
    color: "#747474",
    fontWeight: "500",
  },
  hr: {
    borderColor: "#E5E5E5",
    margin: "20px 0",
  },
};
