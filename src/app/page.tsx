"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, Divider, CardHeader, CardFooter, CardBody, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { fetchUserRepositories } from "@/app/utils/githubApi";

interface Language {
  id: string;
  name: string;
}

const languages: Language[] = [
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
  //{ id: "java", name: "Java" },
  //{ id: "cpp", name: "C++" },
  //{ id: "php", name: "PHP" },
  //{ id: "ruby", name: "Ruby" },
  //{ id: "go", name: "Go" },
  //{ id: "swift", name: "Swift" },
  //{ id: "kotlin", name: "Kotlin" },
  //{ id: "solidity", name: "Solidity" },
];

function HomeContent() {
  const [username, setUsername] = useState("");
  const [urlUsername, setUrlUsername] = useState<any>("");
  const [urlRepository, setUrlRepository] = useState<any>("");
  const [repository, setRepository] = useState("");
  const [language, setLanguage] = useState<Language|undefined>(undefined);
  const [userRepositories, setUserRepositories] = useState<any[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlUsername = searchParams.get('username');
    const urlRepo = searchParams.get('repo');
    setUrlRepository(urlRepo);
    if (urlUsername) setUsername(urlUsername);
    if (urlRepo) setRepository(urlRepo);
  }, [searchParams]);

  useEffect(() => {
    const getUserRepositories = async () => {
        const userRepositories = await fetchUserRepositories(username);
        setUserRepositories(userRepositories);
    };
    getUserRepositories();
}, [username]);

  const selectLanguage = (e: any) => {
    if(!e) return;
    const language = languages.find((language) => language.id === e);
    if(!language) return;
    setLanguage(language);
  }

  const evaluate = async () => {
    try {
      const response = await fetch(`/api/evaluate/?owner=${username}&repo=${repository}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ owner: username, repo: repository })
      });
    
      if (!response.ok) {
        throw new Error('Failed to evaluate repository');
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Image
        src="/mecv_logo.svg"
        alt="logo"
        height={120}
        width={255}
        className="mb-10"
      />
      <Card radius="sm" shadow="sm" className="w-[450px] border-1 border-gray-300">
        {(urlRepository) && (
          <CardHeader className="flex flex-col gap-3">
            <p className="text-sm text-gray-500">Evaluating {urlRepository}</p>
          </CardHeader>
        )}
        <CardBody className="gap-3">
          <Input placeholder="@" label="GitHub Username" type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          {(!urlRepository && userRepositories && userRepositories.length > 0) && (
            <Select placeholder="Select a repository" label="Evaluate Repository" id="repository" name="repository" value={repository} onChange={(e) => setRepository(e.target.value)}>
              {userRepositories.map((repository) => (
                <SelectItem key={repository.name} value={repository.name}>{repository.name}</SelectItem>
              ))}
            </Select>
          )}
        </CardBody>
        
        <CardFooter className="flex flex-col text-center gap-2">
          {(!username && !repository && (
            <p className="text-gray-400 italic">Enter any valid GitHub username to get started.</p>
          ))}
          {(username && repository) && (
            <Button color="primary" className="w-full" onClick={evaluate}>Evaluate</Button>
          )}
          {(username) && (
            <Link className="w-full underline mb-2" href={`/user/${username}`}>View Profile</Link>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}