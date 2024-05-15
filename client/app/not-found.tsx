import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
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
        <h2 className="text-3xl">404, Page Not Found!</h2>
        <Link href="/" className="text-brand-orange underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}
