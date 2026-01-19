import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Navbar from "@/components/shared/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import Providers from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  return (
    <Providers session={session}>
      <main className="background-light850_dark100 relative">
        <Navbar session={session} />
        <div className="flex">
          {/* <LeftSidebar /> */}

          <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-5 md:px-14">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </section>

          {/* <RightSidebar /> */}
        </div>

        {/* <Toaster /> */}
      </main>
    </Providers>
  );
};

export default Layout;
