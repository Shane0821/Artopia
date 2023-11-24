import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials"
import { getCsrfToken } from "next-auth/react"
import { SiweMessage } from "siwe"
import { cookies } from 'next/headers';

const authOptions = (req) => ({
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
      async authorize(credentials) { 
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
          
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({
              req: {
                headers: {
                  cookie: cookies().toString(),
                },
              },
            })
          })
          
          if (result.success) {
            return {
              id: siwe.address,
            }
          }
          return null
        } catch (e) {
          console.log(e)
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
        return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token
    }
  }
})

const Auth = (req, res) => {
  const authOpts = authOptions(req);

  const isDefaultSigninPage =
    req.method === "GET" && req.url.includes("signin")

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    authOpts.providers.pop()
  }

  return NextAuth(req, res, authOpts);
};

export { Auth as GET, Auth as POST }