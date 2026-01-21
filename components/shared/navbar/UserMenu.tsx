"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const UserMenu = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  if (status !== "authenticated") return null;
  const user = session.user;

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} className="focus:outline-none">
        <Image
          src={user?.image ?? "/avatar.png"}
          alt={user?.name ?? "User"}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full"
        />
      </button>

      {/* Pop-up */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 rounded-lg border bg-white shadow-lg">
          <Link
            href={`/profile/${user?.id}`}
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Profile
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
