"use client";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
type Props = {};

const Logout = (props: Props) => {
  const router = useRouter();
  const handleLogout = () => {
    signOut();
    router.push("/");
  };
  return (
    <button
      className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange mx-2"
      onClick={handleLogout}
    >
      <FiLogOut />
    </button>
  );
};

export default Logout;
