import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        hasGithubId: !!process.env.GITHUB_ID,
        hasGithubSecret: !!process.env.GITHUB_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nodeEnv: process.env.NODE_ENV,
    });
}