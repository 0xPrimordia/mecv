"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardFooter, CardBody, Divider, Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { fetchUser, fetchUserRepositories, fetchUserGists } from "@/app/api/evaluate/route";

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
                    <div className="flex gap-4">
                        <Card className="w-[400px]">
                            <CardHeader className="flex gap-3">
                            <Image src={user.avatar_url} alt={user.login} width={40} height={40} />
                            <div className="flex flex-col">
                                <h4 className="text-lg">{user.name}</h4>
                                <span className="text-xs"><Link className="underline text-blue-500" href="#">{user.company}</Link></span>
                                <span className="text-xs">{user?.location}</span>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <h3>About {user.name}:</h3>
                            {user.bio ? <p>{user.bio}</p> : <p className="text-gray-500 italic">No bio available from GitHub.</p>}
                        </CardBody>
                        <Divider />
                        <CardFooter>
                            <span className="inline-block mr-2">followers: <span className="font-bold">{user?.followers}</span></span>
                            <span className="inline-block"> following: <span className="font-bold">{user?.following}</span></span>
                        </CardFooter>
                    </Card>
                    <Card shadow="none" className="max-w-[500px] bg-transparent">
                        <CardBody>
                            <div className="flex flex-wrap">
                                {userLanguages?.map((language: string) => (
                                    <span key={language} className={`text-sm w-fit inline-block rounded-full px-2 py-1 mr-2 text-white mb-2 ${language === 'JavaScript' ? 'bg-blue-500' : 'bg-gray-400'}`}>{language}</span>
                                ))}
                            </div>
                        </CardBody>
                     </Card>

                     <Card shadow="none" className="w-[400px] bg-transparent border-solid border-4 border-gray-300">
                        <CardHeader>
                            <h3 className="font-bold my-1">Skill Level</h3>
                        </CardHeader>
                      
                        <CardBody>
                            <span className="text-sm">Connect GitHub to mint your skill level across many languages based on <Link className="underline text-blue-500" href="#">Patterns</Link>.</span>
                        </CardBody>
                      
                        <CardFooter>
                            <Button variant="bordered" className="w-fit">Claim Your Account</Button>
                        </CardFooter>
                     </Card>
                    </div>
                        
                    <div>
                        <h3 className="font-bold my-4">Repositories</h3>
                        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                            {userRepositories?.map((repository: any, index: number) => (
                                <Card shadow="sm" isPressable={index < 4} className={`w-[250px] mb-4 ${index >= 4 ? 'opacity-20 z-[0]' : ''}`} key={repository.id}>
                                    <CardHeader className="flex flex-col">
                                        <h3 className="text-sm"><span className="font-bold">{repository.name}</span></h3> 
                                    </CardHeader>
                                    <Divider />
                                    <CardBody>
                                        <span className="text-sm">{repository.description}</span>
                                    </CardBody>
                                    <Divider />
                                    <CardFooter>
                                        <div className="flex justify-between gap-2">
                                            <Button radius="sm" className="text-xs px-0 py-0" onClick={() => window.location.href = `/?username=${user.login}&repo=${repository.name}`}>Evaluate</Button>
                                            <span className="text-sm">{repository.language}</span>
                                            
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))} 
                        </div>
                        <div className="flex flex-col items-center mt-[-170px] z-100 relative pb-[100px]">
                            <Button className="mb-4 bg-blue-500 text-white text-xl px-8 py-8 font-bold">Claim Your Account</Button>
                            <p className="italic">If you have a GitHub account, connect to claim your free MeCV profile (more git options coming soon).</p>
                            <p className="italic">Once connected you can select which repositories to feature, filter, sort and much more...</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold my-4">Gists</h3>
                        {(!userGists || userGists.length === 0) && (
                            <Card className="w-[400px]">
                                <CardBody>
                                    <CardHeader>
                                        <h3 className="font-bold">You don't even gist, bro?</h3>
                                    </CardHeader>
                                    <CardBody>
                                        <p className="text-sm">Sign-up to indentify Gists you already have in your codebase.</p>
                                    </CardBody>
                                    <CardFooter>
                                        <Button className="bg-black text-white">Premium Profile</Button>
                                    </CardFooter>
                                </CardBody>
                            </Card>
                        )}
                        {userGists?.map((gist: any) => (
                            <div key={gist.id}>
                                <h4>{gist.description}</h4>
                            </div>
                        ))}
                    </div>
                </>
            )}
            </>
        </div>
    );
}