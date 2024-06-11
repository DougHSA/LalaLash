import { db } from "@/app/_lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { AuthOptions } from "next-auth"
import type { Session } from "next-auth"
import { Adapter } from "next-auth/adapters"
import GoogleProvider from  'next-auth/providers/google'
import { cookies } from "next/headers"

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(db) as Adapter,
        providers:[
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID as string,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                authorization: {
                    params: {
                        scope: 'openid email profile'
                    }
                }
            }),
        ],
        callbacks: {
            async jwt({ token, account, user }) {
                if (account) {
                    token.accessToken = account.access_token;
                }
                if (user) {
                    token.id = user.id;
                    token.email = user.email;
                    token.name = user.name;
                }
                return token;
            },
            async session({ session, token, user }) {
                session.user = { 
                    ...session.user, 
                    id: token.id, 
                    email: token.email, 
                    name: token.name,
                    accessToken: token.accessToken 
                } as {
                    id: string;
                    name: string;
                    email: string;
                    accessToken: string;
                };
                return session as Session;
            }
        },
        session: {
            strategy: 'jwt'
        },
        secret: process.env.NEXT_AUTH_SECRET,
    }