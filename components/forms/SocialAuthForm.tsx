"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

const SocialAuthForm = () => {
  const { data: session } = useSession();

  const buttonClass =
    "background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5 hover:bg-light-900Hover dark:hover:bg-dark-400Hover transition-colors duration-200";

  const handleSignIn = (provider: "github" | "google") => {
    signIn(provider);
  };

  if (session) {
    redirect("/");
  }

  // If not signed in, show social login buttons
  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button className={buttonClass} onClick={() => handleSignIn("github")}>
        <Image
          src="/assets/icons/github.svg"
          alt="Github Logo"
          width={20}
          height={20}
          className="dark:invert mr-2.5 object-contain"
        />
        <span>Log in with Github</span>
      </Button>
      <Button className={buttonClass} onClick={() => handleSignIn("google")}>
        <Image
          src="/assets/icons/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="dark:invert-colors mr-2.5 object-contain"
        />
        <span>Login with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
