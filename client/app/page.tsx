"use client";
import Navbar from "@/components/Navbar/Navbar";
import PlaygroundList from "@/components/Playgrounds/PlaygroundList";
import UserHistoryView from "@/components/UserHistoryView/UserHistoryView";
import { useSession } from "next-auth/react";
import Image from "next/image";
export interface Playground {
  _id: string;
  name: string;
  createId: string;
  user: string;
  playgroundTypeId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="bg-dark-layer-1 min-h-screen">
      <Navbar />
      <h1 className="text-2xl text-center text-gray-700 dark:text-gray-400 font-medium uppercase mt-5 mb-10">
        {session && session.user ? (
          <>&ldquo; Select Playground &rdquo; 👇</>
        ) : (
          <div className="flex flex-col w-full h-full align-middle items-center justify-around">
            <Image
              src="/blacklogo.png"
              width={200}
              height={200}
              alt="Home_page"
            />
            <div>
              Please <span className=" text-brand-orange">Sign In</span> First!
            </div>
          </div>
        )}
      </h1>

      <div className="relative overflow-x-auto mx-auto px-6 pb-10 flex justify-evenly">
        {session && session.user && <PlaygroundList />}
      </div>
      {session && session.user && <UserHistoryView />}
    </div>
  );
}
