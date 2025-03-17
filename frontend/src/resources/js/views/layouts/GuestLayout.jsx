import React from "react";
import { Head, Link } from "@inertiajs/react";
import ApplicationLogo from "../components/ApplicationLogo";

export default function GuestLayout({ children }) {
  return (
    <div className="font-sans text-gray-900 antialiased">
      <Head>
        <title>{"Chamberos"}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
        <div>
          <Link href="/">
            <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
          </Link>
        </div>

        <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
