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
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ContactEmailProps {
  name: string;
  message: string;
}

export const ContactEmail = ({
  name,
  message,
}: ContactEmailProps) => (
  <Html>
    <Head />
    <Preview>Thank you for contacting Hobson AI - We'll be in touch soon!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://hobsonschoice.ai/hobson-logo.png"
          alt="Hobson AI Logo"
          style={logo}
        />
        
        <Heading style={h1}>Thank you for reaching out, {name}!</Heading>
        
        <Text style={text}>
          We've received your message and our team will review it carefully. We typically respond within 24 hours during business days.
        </Text>
        
        <Container style={messageContainer}>
          <Text style={messageLabel}>Your message:</Text>
          <Text style={messageText}>"{message}"</Text>
        </Container>
        
        <Text style={text}>
          In the meantime, feel free to explore our AI-powered property intelligence platform and see how we're revolutionizing document analysis for the property industry.
        </Text>
        
        <Link
          href="https://hobsonschoice.ai/features"
          target="_blank"
          style={button}
        >
          Explore Our Features
        </Link>
        
        <Text style={text}>
          Have questions? Simply reply to this email or visit our website.
        </Text>
        
        <Text style={footer}>
          Best regards,<br />
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

export default ContactEmail

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
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const messageContainer = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const messageLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px 0',
}

const messageText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  fontStyle: 'italic',
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