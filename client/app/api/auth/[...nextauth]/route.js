import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials"
import { getCsrfToken } from "next-auth/react"
import { SiweMessage } from "siwe"
// todo: skip login from /api/auth/signin
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        }
      },
      async authorize(credentials, req) { 
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
          
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)
       
          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req: { headers: req.headers } }),
          })
          
          if (result.success) {
            return {
              id: siwe.address,
            }
          }
          return null
        } catch (e) {
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {  
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, token, user }) {
        session.address = token.sub
        session.user.name = token.sub
        session.user.image = "/assets/icons/favicon.ico"
        return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token
    }
  }
})

export { handler as GET, handler as POST }