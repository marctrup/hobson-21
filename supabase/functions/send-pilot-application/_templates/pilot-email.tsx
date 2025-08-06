import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Img,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface PilotEmailProps {
  firstName: string;
  lastName: string;
  company: string;
}

export const PilotEmail = ({
  firstName,
  lastName,
  company,
}: PilotEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to the Hobson AI Pilot Program - Let's revolutionize your property workflow!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://hobsonschoice.ai/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png"
          alt="Hobson AI Logo"
          style={logo}
        />
        
        <Heading style={h1}>Welcome to the Hobson AI Pilot Program!</Heading>
        
        <Text style={welcomeText}>
          Hi {firstName}, Thank you for your interest in our exclusive pilot program at {company}! We're excited that you want to be part of the future of AI-powered property intelligence.
        </Text>
        
        <Text style={text}>
          A member of our team will be in touch soon to chat. As places are limited, we may not be able to offer you a spot right away. If we can't accommodate you this time, don't worry — we'll make sure you're first in line for the next round.
        </Text>
        
        <Container style={highlightBox}>
          <Text style={highlightText}>
            <strong>What's Next?</strong>
          </Text>
          <Text style={text}>
            Our team will be in touch within 2 business days to:
          </Text>
          <Text style={listItem}>✓ Learn more about your business</Text>
          <Text style={listItem}>✓ Schedule a detailed discovery call.</Text>
          <Text style={listItem}>✓ Set up document processing tailored to you</Text>
          <Text style={listItem}>✓ Share exclusive resources from the pilot program</Text>
        </Container>
        
        <Text style={text}>
          During the pilot, you'll have access to:
        </Text>
        
        <Container style={featureBox}>
          <Text style={featureTitle}>🧠 Intelligent Document Analysis</Text>
          <Text style={featureDesc}>AI that understands your property documents</Text>
          
          <Text style={featureTitle}>⚡ Lightning-Fast Insights</Text>
          <Text style={featureDesc}>Get answers to complex questions in seconds</Text>
          
          <Text style={featureTitle}>👥 Dedicated Support</Text>
          <Text style={featureDesc}>Direct access to our team</Text>
        </Container>
        
        <Hr style={hr} />
        
        <Text style={text}>
          Feel free to email <Link href="mailto:info@hobsonschoice.ai" style={link}>info@hobsonschoice.ai</Link> or explore our platform:
        </Text>
        
        <Link
          href="https://hobsonschoice.ai/features"
          target="_blank"
          style={button}
        >
          Explore Features
        </Link>
        
        <Text style={footer}>
          Welcome aboard!<br />
          <strong>The Hobson AI Team</strong><br />
          <Link
            href="https://hobsonschoice.ai"
            target="_blank"
            style={{ ...link, color: '#666666' }}
          >
            hobsonschoice.ai
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PilotEmail

const main = {
  backgroundColor: '#f6f6f6',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  padding: '40px 20px',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '8px',
}

const logo = {
  height: '48px',
  width: 'auto',
  margin: '0 auto 32px auto',
  display: 'block',
}

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
}

const welcomeText = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px 0',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const highlightBox = {
  backgroundColor: '#f0f9ff',
  border: '2px solid #0ea5e9',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 0',
}

const highlightText = {
  color: '#0c4a6e',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
}

const listItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
  paddingLeft: '8px',
}

const featureBox = {
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const featureTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '16px 0 4px 0',
}

const featureDesc = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 12px 0',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const button = {
  backgroundColor: '#8b5cf6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '24px 0',
}

const link = {
  color: '#8b5cf6',
  textDecoration: 'underline',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  marginTop: '32px',
  textAlign: 'center' as const,
}