"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, Divider, CardHeader, CardFooter, CardBody, Button, Input } from "@nextui-org/react";

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

export default function Home() {
  const [username, setUsername] = useState("");
  const [repository, setRepository] = useState("");
  const [language, setLanguage] = useState<Language|undefined>(undefined);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlUsername = searchParams.get('username');
    const urlRepo = searchParams.get('repo');
    if (urlUsername) setUsername(urlUsername);
    if (urlRepo) setRepository(urlRepo);
  }, [searchParams]);

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
      <Card className="w-[450px]">
        <CardHeader className="flex gap-3">
          <h1 className="pl-2 font-bold">Github Evaluator</h1>
        </CardHeader>
        <Divider />
        <CardBody className="gap-3">
          <Input placeholder="Enter your GitHub username" label="GitHub Username" type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="Enter your GitHub repository" label="GitHub Repository" type="text" id="repository" name="repository" value={repository} onChange={(e) => setRepository(e.target.value)} />
        </CardBody>
        <Divider />
        <CardFooter>
          <Button color="primary" className="w-full" onClick={evaluate}>Evaluate</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
