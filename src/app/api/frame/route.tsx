import React from "react";
import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from 'next/og';
import { fetchUser } from "@/app/utils/githubApi";

const ROBOTO_MONO_URL = "/fonts/RobotoMono-Regular.ttf";
const ROBOTO_MONO_BOLD_URL = "/fonts/RobotoMono-Bold.ttf";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
        console.log('User ID is missing');
        return new Response('User ID is required', { status: 400 });
    }

    try {
        console.log(`Fetching user data for userId: ${userId}`);
        const user = await fetchUserData(userId);

        if (!user) {
            console.log(`User not found for userId: ${userId}`);
            return new Response('User not found', { status: 404 });
        }

        console.log(`User data fetched successfully for userId: ${userId}`);

        const origin = request.nextUrl.origin;
        const [RobotoMono, RobotoMonoBold] = await Promise.all([
            fetch(new URL('/fonts/RobotoMono-Regular.ttf', origin)).then(res => res.arrayBuffer()),
            fetch(new URL('/fonts/RobotoMono-Bold.ttf', origin)).then(res => res.arrayBuffer())
        ]);

        return new ImageResponse(
        (
            <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
                <div tw="bg-gray-50 flex w-full">
                    <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
                        <h2 tw="flex flex-col text-4xl sm:text-7xl font-bold tracking-tight text-gray-900 text-left">
                            <span>
                                {user.name}
                            </span>
                            <span tw="text-pink-600">
                                {user.company}
                            </span>
                        </h2>
                        <div tw="mt-8 flex md:mt-0">
                        </div>
                    </div>
                </div>
                <div tw="bg-gray-50 flex w-full">
                    <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
                        <h3 tw="flex ml-4 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 text-left"></h3>
                        <p tw="flex text-2xl text-gray-600">
                            {user.bio}
                        </p>
                    </div>
                 
                </div>
                <div tw="bg-gray-50 items-center justify-center flex w-full">

<div tw="ml-5 flex  rounded-md shadow">
    <a tw=" flex items-center justify-center rounded-md border border-transparent bg-black px-5 py-5 text font-bold text-white">Followers: 50</a>
</div>
<div tw="ml-5 flex rounded-md shadow">
    <a tw="flex items-center justify-center rounded-md border border-transparent bg-black px-5 text py-5  font-bold text-white">Following: 135</a>
</div>
<div tw="ml-5 flex rounded-md shadow">
    <a tw="flex items-center justify-center rounded-md border border-transparent bg-black px-5 text py-5  font-bold text-white">Claim your Profile 👇</a>
</div>
</div>
                <p tw="flex ml-5 text-2xl text-gray-600">
                    MeCV.ai ©️ 2024 | Backdrop build v.6
                </p>
            </div>
        ),
        {
            fonts: [
                {
                    data: RobotoMono,
                    name: "Roboto Mono",
                    style: "normal",
                    weight: 400,
                },
                {
                    data: RobotoMonoBold,
                    name: "Roboto Mono",
                    style: "normal",
                    weight: 700,
                },
            ],
        })
    } catch (error) {
        console.error('Error fetching user data:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

async function fetchUserData(userId: string) {
    try {
        const user = await fetchUser(userId);
        if (!user) {
            console.log(`No user found for userId: ${userId}`);
            return null;
        }
        return user;
    } catch (error) {
        console.error(`Error in fetchUserData for userId ${userId}:`, error);
        throw error; // Re-throw the error to be caught in the GET function
    }
}