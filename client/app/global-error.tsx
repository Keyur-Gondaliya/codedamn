"use client";

import Image from "next/image";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
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
            <h2 className="text-3xl">Something went wrong!</h2>
            <button className="text-brand-orange" onClick={() => reset()}>
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
