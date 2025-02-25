import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-background text-foreground">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
        <h1 className="text-xl font-bold">
            <Link href="/">
                opinionated.coffee
            </Link>    
        </h1>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/about" className="hover:underline">About</Link>
          </li>
          <li>
            <Link href="/merch" className="hover:underline">Merch</Link>
          </li>
          <li>
            <Link href="/coffee" className="hover:underline">Coffee</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
} 