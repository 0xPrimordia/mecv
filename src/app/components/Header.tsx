"use client";
import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@nextui-org/react"

const Header = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session) {
            console.log("User data:", session.user);
        }
    }, [session]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <header className="flex gap-4 py-4 px-4 justify-end mr-2">
            {session ? (
                <Button onClick={() => signOut()}>Disconnect GitHub</Button>
            ) : (
                <Button className="bg-black text-white" radius="sm" onClick={() => signIn()}>Connect Your GitHub</Button>
            )}
            <Button radius="sm">Connect Your Wallet</Button>
        </header>
    );
};

export default Header;