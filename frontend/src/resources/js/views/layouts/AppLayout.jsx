import { Head, Link } from "@inertiajs/react";
import Navigation from "../components/ResponsiveNavLink";

export default function AppLayout({ header, children }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Head>
        <title>Chamberos App</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="preconnect" href="https://fonts.bunny.net" />
        <Link
          href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap"
          rel="stylesheet"
        />
        <Link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          rel="stylesheet"
        />
      </Head>

      <Navigation />

      {header && (
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}

      <main>{children}</main>
    </div>
  );
}
