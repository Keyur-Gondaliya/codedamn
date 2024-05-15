"use client"; // Error components must be Client Components

import Image from "next/image";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="h-full w-full bg-dark-layer-2 text-white flex justify-center items-center">
      <div className="flex flex-col">
        <div className="flex items-center justify-center">
          <Image
            src="/blacklogo.png"
            width={200}
            height={200}
            alt="Home_page"
          />
        </div>
        <h2 className="text-3xl">Something went wrong, Please reload page!</h2>
        <button className="text-brand-orange" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
