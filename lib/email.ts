import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: "Notes App <noreply@yourdomain.com>",
      to: email,
      subject: "Welcome to Notes App!",
      html: `
        <h1>Welcome to Notes App, ${name}!</h1>
        <p>Thanks for signing up. You can now start creating and organizing your notes.</p>
        <p>Get started by creating your first note!</p>
      `,
    })
  } catch (error) {
    console.error("Failed to send welcome email:", error)
  }
}

export async function sendProUpgradeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: "Notes App <noreply@yourdomain.com>",
      to: email,
      subject: "Welcome to Notes App Pro!",
      html: `
        <h1>You're now on Pro, ${name}!</h1>
        <p>Thanks for upgrading to Notes App Pro. You now have access to:</p>
        <ul>
          <li>Unlimited notes</li>
          <li>Advanced search</li>
          <li>Export functionality</li>
          <li>Priority support</li>
        </ul>
        <p>Enjoy your enhanced note-taking experience!</p>
      `,
    })
  } catch (error) {
    console.error("Failed to send pro upgrade email:", error)
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    await resend.emails.send({
      from: "Notes App <noreply@yourdomain.com>",
      to: email,
      subject: "Reset your password",
      html: `
        <h1>Reset your password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    })
  } catch (error) {
    console.error("Failed to send password reset email:", error)
  }
}
