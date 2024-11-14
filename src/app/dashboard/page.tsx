"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import RepositoryAnalysis from "@/components/RepositoryAnalysis";
import { fetchUserRepositories } from "@/app/utils/githubApi";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repositories, setRepositories] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.name) {
      fetchUserRepositories(session.user.name).then((repos) => {
        setRepositories(repos.map((repo: any) => `${session?.user?.name}/${repo.name}`));
      });
    }
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Repository Analysis</h1>
      <RepositoryAnalysis repositories={repositories} />
      
      <h2 className="text-xl mt-8 mb-4">Session Information</h2>
      <Card>
        <CardBody>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </CardBody>
      </Card>
    </div>
  );
}
