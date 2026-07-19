import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "react-email";

interface ResetPasswordEmailProps {
  /** How long until the link expires */
  expiresIn?: string;
  /** URL to reset the password */
  resetUrl: string;
}

export function ResetPasswordEmail({
  resetUrl,
  expiresIn = "10 min",
}: ResetPasswordEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Reset your password</Preview>

      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-xl px-4 py-12">
            <Text className="font-bold text-2xl text-black">Acme</Text>

            <Heading className="mt-8 font-bold text-2xl text-gray-900">
              Reset your password
            </Heading>

            <Text className="text-base text-gray-700 leading-6">
              We received a request to reset your password. Click the button
              below to choose a new password.
            </Text>

            <Button
              className="mt-4 box-border inline-block rounded-md bg-blue-500 px-6 py-3 font-medium text-white"
              href={resetUrl}
            >
              Reset Password
            </Button>

            <Text className="mt-4 text-gray-500 text-sm">
              This link will expire in {expiresIn}.
            </Text>

            <Hr className="my-8 border-gray-200" />

            <Text className="text-gray-500 text-sm">
              If you didn&apos;t request a password reset, you can safely ignore
              this email. Your password will remain unchanged.
            </Text>

            {/* Security notice */}
            <div className="mt-6 rounded-md border border-red-200 border-solid bg-red-50 p-4">
              <Text className="m-0 text-red-800 text-sm">
                <strong>Security tip:</strong> Never share this link with
                anyone. Acme will never ask for your password via email.
              </Text>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

// ResetPasswordEmail.PreviewProps = {
//   resetUrl: "http://localhost:3000/reset-password?token=abc123xyz",
//   expiresIn: "10 min",
// } satisfies ResetPasswordEmailProps;

export default ResetPasswordEmail;
