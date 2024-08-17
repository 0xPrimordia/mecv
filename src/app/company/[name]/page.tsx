"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardFooter, CardBody, Divider, Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { fetchCompany, fetchOrganizationRpositories } from "@/app/utils/githubApi";
import { ChartBarSquareIcon } from "@heroicons/react/24/outline";

type Props = {
    params: {
        name: string;
    }
}

export default function CompanyPage({ params }: Props) {
    const [company, setCompany] = useState<any | null>(null);
    const [repositories, setRepositories] = useState<any | null>(null);

    useEffect(() => {
        fetchCompany(params.name).then((data) => {
            setCompany(data);
        });
    }, [params.name]);

    useEffect(() => {
        fetchOrganizationRpositories(params.name).then((data) => {
            setRepositories(data);
        });
    }, [params.name]);

    return (
        <div>
            {!company ? <div>Loading...</div> : (
                <div>
                    <h1 className="font-bold text-2xl my-4">@{company?.name}</h1>
                    <div className="flex flex-row gap-4">
                        <Card shadow="sm" className="w-[380px]">
                            <CardHeader>
                                <Image className="rounded-full" src={company?.avatar_url} alt={company?.name} width={45} height={45} />
                                <div className="flex flex-row ml-4 gap-2">
                                    <span><Link className="underline text-pink-500 text-md" target="_blank" href={`mailto:${company?.billing_email}`}>Email</Link></span>
                                    <span><Link className="underline text-pink-500 text-md" target="_blank" href={company?.url}>Website</Link></span>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <p>{company?.description}</p>
                            </CardBody>
                            <Divider />
                            <CardFooter>
                                <p className="mr-2">Public Repos: <span className="font-bold">{company?.public_repos}</span></p>
                                <p>Private Repos: <span className="font-bold">{company?.owned_private_repos}</span></p>
                            </CardFooter>
                        </Card>
                        <Card shadow="none" className="w-[380px] bg-transparent border-solid border-4 border-gray-300">
                            <CardHeader>
                                <h2 className="font-bold text-lg mr-2">Code Difficulty</h2>
                                <ChartBarSquareIcon className="w-6 h-6" />
                            </CardHeader>
                            <CardBody>
                                <p className="text-sm">Sign up for fine-grained code difficulty analysis. Every single commit is analyzed to determine the difficulty level of the code.</p>
                                
                            </CardBody>
                            <CardFooter>
                                <Button>Sign-Up for Premium</Button>
                            </CardFooter>
                        </Card>
                        <Card shadow="none" className="w-[400px] bg-transparent">
                                <CardBody>
                                    <CardHeader className="flex flex-col">
                                    <h3 className="font-bold text-3xl mb-2">Need help with your projects?</h3>
                                    </CardHeader>
           
                                    <CardBody>

                                        
                                            <p className="text-sm italic">Sign-up to connect your GitHub issues with developers using AI matching.</p>
                                        
                                    </CardBody>
                         
                                    <CardFooter className="flex justify-end">
                                        <Button className="bg-black text-white">Sign-up for Premium</Button>
                                    </CardFooter>
                                </CardBody>
                            </Card>
                    </div>
                    <div>
                        <h3 className="font-bold my-4">Repositories</h3>
                        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                            {repositories?.map((repository: any, index: number) => (
                                <Card shadow="none" isPressable={index < 4} className={`w-[250px] mb-4 ${index >= 4 ? 'opacity-20 z-[0]' : ''}`} key={repository.id}>
                                    <CardHeader className="flex flex-col">
                                        <h3 className="text-sm"><span className="font-bold">{repository.name}</span></h3> 
                                    </CardHeader>
                                    <Divider />
                                    <CardBody>
                                        <span className="text-sm">{repository.description}</span>
                                    </CardBody>
                                    <Divider />
                                    <CardFooter>
                                        <div className={`flex justify-between gap-2 ${index >= 4 ? 'opacity-0 z-[0]' : ''}`}>
                                            <Button radius="sm" className="text-xs px-0 py-0" onClick={() => console.log(repository)}>Evaluate</Button>
                                            <span className="text-sm">{repository.language}</span>
                                            
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))} 
                        </div>
                        <div className="flex flex-col items-center mt-[-170px] z-100 relative pb-[100px]">
                            <Button className="mb-4 bg-pink-500 text-white text-xl px-8 py-8 font-bold mb-8">Claim Your Dashboard</Button>
                            <p className="italic max-w-xl text-center">Claim your dashboard to scan code difficulty, connect your GitHub issues with qualified developers and keep your projects moving.</p>
                           
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}