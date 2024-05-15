"use client";
import Logout from "../Buttons/Logout";
import { BuiltInProviderType } from "next-auth/providers/index";
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
  signIn,
  useSession,
} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import NormalMdSpinner from "../Spinner/NormalMdSpinner";
type Props = {};

function Navbar({}: Props) {
  const { data: session } = useSession();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);
  useEffect(() => {
    const setProvidersFn = async () => {
      const providers: Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
      > | null = await getProviders();
      setProviders(providers);
      setIsLoaded(true);
    };
    setProvidersFn();
    if (session && session.user) {
      sessionStorage.setItem("LETSCODETOKEN", session.user.token);
    }
  }, [session]);

  return (
    <>
      <nav className="relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7">
        <div
          className={`flex w-full items-center justify-between max-w-[1200px] mx-auto`}
        >
          <Link href="/" className="h-[22px] flex-1">
            <img src="/logo-full.png" alt="Logo" className="h-full" />
          </Link>

          <div className="flex items-center space-x-4 flex-1 justify-end">
            {/* <!--  User Email Wrapper--> */}

            <div className="sm:flex hidden">
              {session && session.user ? (
                <>
                  <div className="cursor-pointer group relative">
                    <Image
                      src={(session && session.user.image) || "/avatar.png"}
                      alt="Profile"
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                    <div
                      className="absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0 
        transition-all duration-300 ease-in-out"
                    >
                      <p className="text-sm">{session && session.user.email}</p>
                    </div>
                  </div>
                  <Logout />
                </>
              ) : (
                <>
                  {isLoaded ? (
                    providers &&
                    Object.values(providers).map((provider) => (
                      <button
                        type="button"
                        key={provider.name}
                        onClick={(e) => {
                          e.preventDefault();
                          signIn(provider.id);
                          setIsDisabled(true);
                        }}
                        className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange hover:bg-dark-fill-2"
                        disabled={isDisabled}
                      >
                        {isDisabled ? <NormalMdSpinner /> : "Sign in"}
                      </button>
                    ))
                  ) : (
                    <NormalMdSpinner />
                  )}
                </>
              )}
            </div>

            {/* Mobile Navigation */}

            <div className="sm:hidden flex relative">
              {session && session.user ? (
                <div className="flex">
                  <Image
                    src={session.user.image || "/avatar.png"}
                    alt="Profile"
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <Logout />
                </div>
              ) : (
                <>
                  {providers &&
                    Object.values(providers).map((provider) => (
                      <button
                        type="button"
                        key={provider.name}
                        onClick={() => signIn(provider.id)}
                        className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange hover:bg-dark-fill-2"
                      >
                        Sign in
                      </button>
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
