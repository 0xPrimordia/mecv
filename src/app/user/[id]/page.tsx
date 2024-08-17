"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardFooter, CardBody, Divider, Button, Tooltip, Chip } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { fetchUser, fetchUserRepositories, fetchUserGists } from "@/app/utils/githubApi";
import { ChartBarSquareIcon } from "@heroicons/react/24/outline";

type Props = {
    params: { id: string }
}

export default function UserPage({ params }: Props) {
    const [user, setUser] = useState<any>(null);
    const [userRepositories, setUserRepositories] = useState<any>(null);
    const [userGists, setUserGists] = useState<any>(null);
    const [userLanguages, setUserLanguages] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const userData = await fetchUser(params.id);
            setUser(userData);
        };
        const getUserGists = async () => {
            const getUserGists = await fetchUserGists(params.id);
            setUserGists(getUserGists);
            console.log(getUserGists);
        };
        getUser();
        getUserGists();
        
    }, [params.id]);

    useEffect(() => {
        const getUserRepositories = async () => {
            const userRepositories = await fetchUserRepositories(params.id);
            setUserRepositories(userRepositories);
        };
        getUserRepositories();
    }, [params.id]);

    useEffect(() => {
        let languages: string[] = [];
        userRepositories?.forEach((repository: any) => {
            if (repository.language) {
                if (!languages.includes(repository.language)) {
                    languages.push(repository.language);
                }
            }
        });
        setUserLanguages(languages);
    },[userRepositories]);

    return (
        <div>
            <>
            {!user ? (
                <div>Loading...</div>
            ) : (
                <>
                    <h1 className="font-bold text-2xl my-4">@{user.login}</h1>
                    <div className="flex flex-wrap mb-6">
                        {userLanguages?.map((language: string) => (
                            <span key={language} className={`text-sm w-fit inline-block rounded-full px-2 py-1 mr-2 text-white mb-2 ${language === 'JavaScript' ? 'bg-blue-500' : 'bg-gray-400'}`}>{language}</span>
                        ))}
                    </div>
                    <div className="flex gap-4">
                        <Card shadow="sm" className="w-[380px]">
                            <CardHeader className="flex gap-3">
                            <Image src={user.avatar_url} alt={user.login} width={55} height={55} />
                            <div className="flex flex-col">
                                <h4 className="text-lg">{user.name}</h4>
                                
                                {user.company && user.company.startsWith('@') && (
                                  <span className="text-xs">
                                    <Link className="underline text-blue-500" href={`/company/${user.company.replace(/^@/, '')}`}>
                                      {user.company}
                                    </Link>
                                  </span>
                                )}
                                <span className="text-xs">{user?.location}</span>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <h3>About {user.name}:</h3>
                            {user.bio ? <p>{user.bio}</p> : <p className="text-gray-500 italic">No bio available from GitHub. Sign-up to generate one from your commit history.<br/><br/><a className="underline" href="#">Premium Account</a></p>}
                        </CardBody>
                        <Divider />
                        <CardFooter>
                            <span className="inline-block mr-2">followers: <span className="font-bold">{user?.followers}</span></span>
                            <span className="inline-block"> following: <span className="font-bold">{user?.following}</span></span>
                        </CardFooter>
                    </Card>

                     <Card shadow="none" className="w-[400px] bg-transparent border-solid border-4 border-gray-300">
                        <CardHeader>
                            <h3 className="font-bold my-1 mr-2">Skill Level</h3>
                            <ChartBarSquareIcon className="w-6 h-6" />
                        </CardHeader>
                      
                        <CardBody>
                            <p className="text-sm">Connect GitHub to mint your skill level across many languages and every single commit in your history (including past private repos) based on <Tooltip showArrow={true} placement="bottom" content="Patterns are a model for indentifying skills in your commit history."><span className="underline text-blue-500">Patterns</span></Tooltip>.</p>
                        </CardBody>
                      
                        <CardFooter>
                            <Button variant="bordered" className="w-fit">Claim Your Profile</Button>
                        </CardFooter>
                     </Card>

                     <div>
                        
                            <Card shadow="none" className="w-[400px] bg-transparent">
                                <CardBody>
                                    <CardHeader className="flex flex-col">
                                    {(!userGists || userGists?.length === 0) && (
                                        <h3 className="font-bold text-3xl">You don&apos;t even GIST, bro?</h3>
                                    )}
                                    {userGists && userGists.length > 0 && (
                                        
                                        <h3 className="font-bold text-3xl mb-2">You have gists. Want more?</h3>
                            
                                       
                                    )}
                                    </CardHeader>
           
                                    <CardBody>

                                        
                                            <p className="text-sm italic">Sign-up to indentify and feature Gists you already have in your codebase.</p>
                                        
                                    </CardBody>
                         
                                    <CardFooter className="flex justify-end">
                                        <Button className="bg-black text-white">Sign-up for Premium</Button>
                                    </CardFooter>
                                </CardBody>
                            </Card>
                        
                        
                    </div>

                    
                    </div>
                        
                    <div>
                        <h3 className="font-bold my-4">Repositories</h3>
                        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                            {userRepositories?.map((repository: any, index: number) => (
                                <Card shadow="none" isPressable={index < 4} className={`w-[250px] mb-4 ${index >= 4 ? 'opacity-20 z-[0]' : ''}`} key={repository.id}>
                                    <CardHeader className="flex flex-col">
                                        <h3 className="text-sm"><span className="font-bold">{repository.name}</span></h3> 
                                    </CardHeader>
                                    <Divider />
                                    <CardBody>
                                        <span className="text-sm">{repository.description}</span>
                                        {repository.language && (
                                            <Chip className="mt-2" size="sm" color="primary">{repository.language}</Chip>
                                        )}
                                    </CardBody>
                                    <Divider />
                                    <CardFooter>
                                        <div className={`${index >= 4 ? 'opacity-0 z-[0]' : ''}`}>
                                            <Button radius="sm" variant="bordered" className="text-xs px-0 py-0 text-gray-400" onClick={() => window.location.href = `/?username=${user.login}&repo=${repository.name}`}>Evaluate</Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))} 
                        </div>
                        <div className="flex flex-col items-center mt-[-170px] z-100 relative pb-[100px]">
                            <Button className="mb-4 bg-blue-500 text-white text-xl px-8 py-8 font-bold mb-8">Claim Your Profile</Button>
                            <p className="italic">If you have a GitHub account, connect to claim your free MeCV profile (more git options coming soon).</p>
                            <p className="italic">Once connected you can select which repositories to feature, filter, sort and much more...</p>
                        </div>
                    </div>

                    
                </>
            )}
            </>
        </div>
    );
}