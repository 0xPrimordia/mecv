"use client";
import { useState } from "react";
import Image from "next/image";
import { Card, Divider, CardHeader, CardFooter, CardBody, Button, Input, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { fetchRepo, File } from "../utils/fetchRepo";
import { classifyRepo } from "../utils/classifyRepo";

interface Language {
  id: string;
  name: string;
}

const languages: Language[] = [
  { id: "ts", name: "TypeScript" },
  { id: "js", name: "JavaScript" },
  { id: "py", name: "Python" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "php", name: "PHP" },
  { id: "rb", name: "Ruby" },
  { id: "go", name: "Go" },
  { id: "swift", name: "Swift" },
  { id: "kt", name: "Kotlin" },
  { id: "sol", name: "Solidity" },
];

const languageExtensions: Record<string, string[]> = {
  ts: ['.ts', '.tsx'],
  js: ['.js', '.jsx'],
  py: ['.py'],
  java: ['.java'],
  cpp: ['.cpp', '.c', '.h'],
  php: ['.php'],
  rb: ['.rb'],
  go: ['.go'],
  swift: ['.swift'],
  kt: ['.kt'],
  sol: ['.sol'],
};

interface Classification {
  language: Language;
  classification: { level: string; elements: string[] };
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [repository, setRepository] = useState("");
  const [classification, setClassification] = useState<Classification[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const evaluate = async () => {
    try {
      setError(null);
      setClassification(null);

      console.log(`Fetching file list for ${username}/${repository}`);
      const allFiles: File[] = await fetchRepo(username, repository, true);
      console.log("All files:", allFiles);

      if (!Array.isArray(allFiles) || allFiles.length === 0) {
        setError("No files found in the repository.");
        return;
      }

      const usedLanguages = detectLanguages(allFiles);
      console.log("Detected languages:", usedLanguages);

      if (usedLanguages.length === 0) {
        setError("No recognized programming languages found in the repository.");
        return;
      }

      const relevantFiles = await Promise.all(
        usedLanguages.map(async lang => {
          const files = await fetchRepo(username, repository, false, languageExtensions[lang.id]);
          console.log(`Files for ${lang.name}:`, files);
          return files;
        })
      ).then(files => files.flat());
      console.log("Relevant files:", relevantFiles);

      if (relevantFiles.length === 0) {
        setError("No relevant files found for the detected languages.");
        return;
      }

      const classifications = usedLanguages.map(lang => {
        const langFiles = relevantFiles.filter(file => languageExtensions[lang.id].some(ext => file.name.endsWith(ext)));
        const validFiles = langFiles.filter((file): file is Required<File> => file.content !== undefined);
        console.log(`Valid files for ${lang.name}:`, validFiles);
        if (validFiles.length === 0) {
          console.warn(`No valid files found for ${lang.name}`);
          return null;
        }
        return {
          language: lang,
          classification: classifyRepo(lang.id, validFiles)
        };
      }).filter((cls): cls is NonNullable<typeof cls> => cls !== null);
      console.log("Classifications:", classifications);
      if (classifications.length === 0) {
        setError("Unable to classify any languages in the repository.");
        return;
      }
      setClassification(classifications);
    } catch (error) {
      console.error("Error during evaluation:", error);
      setError(`An error occurred while evaluating the repository: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  function detectLanguages(files: File[]): Language[] {
    if (!Array.isArray(files)) {
      console.error("detectLanguages received non-array input:", files);
      return [];
    }

    const extensionMap: Record<string, string> = {
      'ts': 'ts', 'tsx': 'ts',
      'js': 'js', 'jsx': 'js',
      'py': 'py',
      'java': 'java',
      'cpp': 'cpp', 'c': 'cpp', 'h': 'cpp',
      'php': 'php',
      'rb': 'rb',
      'go': 'go',
      'swift': 'swift',
      'kt': 'kt',
      'sol': 'sol'
    };

    const extensionCounts = files.reduce((counts, file) => {
      if (typeof file.name !== 'string') {
        console.warn("File without a name encountered:", file);
        return counts;
      }
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext && ext in extensionMap) {
        const langId = extensionMap[ext];
        counts[langId] = (counts[langId] || 0) + 1;
      }
      return counts;
    }, {} as Record<string, number>);

    console.log("Extension counts:", extensionCounts);

    return languages.filter(lang => extensionCounts[lang.id]);
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
          <Input
            placeholder="Enter your GitHub username"
            label="GitHub Username"
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Enter your GitHub repository"
            label="GitHub Repository"
            type="text"
            id="repository"
            name="repository"
            value={repository}
            onChange={(e) => setRepository(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          {classification && (
            <div className="mt-4">
              <h2 className="font-bold">Classifications:</h2>
              {classification.map((cls, index) => (
                <div key={index} className="mt-2">
                  <h3>{cls.language.name}:</h3>
                  <p>Level: {cls.classification.level}</p>
                  <p>Elements Found:</p>
                  <ul className="list-disc pl-5">
                    {cls.classification.elements.map((element, idx) => (
                      <li key={idx}>{element}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </CardBody>
        <Divider />
        <CardFooter>
          <Button color="primary" className="w-full" onClick={evaluate}>
            Evaluate
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}