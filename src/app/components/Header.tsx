"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";
import { usePathname } from "next/navigation";

const Header = () => {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    useEffect(() => {
        if (session) {
            console.log("User data:", session.user);
        }
    }, [session]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <header className={`flex gap-4 py-4 px-4 mr-2 ${pathname !== "/" ? "justify-between" : "justify-end"} items-center`}>
            {pathname !== "/" && (
                <Link href="/">
                    <Image src="/mecv_logo.svg" alt="Logo" width={100} height={100} />
                </Link>
            )}
                <div className="flex gap-4">
                    {session ? (
                        <Button onClick={() => signOut()}>Disconnect GitHub</Button>
                    ) : (
                        <Button className="bg-black text-white" radius="sm" onClick={() => signIn()}>Connect Your GitHub</Button>
                    )}
                    <Button radius="sm">Connect Your Wallet</Button>
                </div>
           
        </header>
    );
};

export default Header;