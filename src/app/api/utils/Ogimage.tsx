import { fetchUser, fetchUserRepositories, fetchUserGists } from "@/app/utils/githubApi";

import RobotoMonoBold from "@/assets/roboto-mono-700.ttf";
import RobotoMono from "@/assets/roboto-mono-regular.ttf";
import { user } from "@nextui-org/react";
import { Resvg } from "@resvg/resvg-js";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";

const ogOptions: SatoriOptions = {
	// debug: true,
	fonts: [
		{
			data: Buffer.from(RobotoMono),
			name: "Roboto Mono",
			style: "normal",
			weight: 400,
		},
		{
			data: Buffer.from(RobotoMonoBold),
			name: "Roboto Mono",
			style: "normal",
			weight: 700,
		},
	],
	height: 630,
	width: 1200,
};

const markup = (title: string, pubDate: string) =>
	html`<div tw="flex flex-col w-full h-full items-center justify-center bg-white">
  <div tw="bg-gray-50 flex w-full">
    <div
      tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8"
    >
      <h2
        tw="flex flex-col text-4xl sm:text-7xl font-bold tracking-tight text-gray-900 text-left"
      >
        <span>{user.name}</span>
        <span tw="text-indigo-600"></span>
      </h2>
      <div tw="mt-8 flex md:mt-0"></div>
    </div>
  </div>
  <div tw="bg-gray-50 flex w-full">
    <div
      tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8"
    >
      <h3
        tw="flex ml-4 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 text-left"
      ></h3>
      <p tw="flex text-2xl text-gray-600">
            {user.bio}  <p>{user.bio}</p>
      </p>
      <div tw="flex rounded-md shadow">
        <a
          tw="ml-5 flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-5 text-1xl font-bold text-white"
          >Followers: 50</a
        >
      </div>
      <div tw="ml-5 flex rounded-md shadow">
        <a
          tw="flex items-center justify-center rounded-md border border-transparent bg-white px-5 text-1xl py-5  font-bold text-indigo-600"
          >Following: 135</a
        >
      </div>
    </div>
  </div>
</div>`;


