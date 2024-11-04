import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            authorization: {
                params: {
                    scope: 'read:user user:email'
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log('Sign in attempt:', { user, account, profile, email });
            return true;
        },
        async jwt({ token, account, profile }) {
            if (account && profile) {
                token.githubProfile = profile;
            }
            console.log('JWT callback:', { token, account, profile });
            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                ...(token.githubProfile as object),
            };
            console.log('Session callback:', { session, token });
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true, // Enable debug logs
});

export { handler as GET, handler as POST };