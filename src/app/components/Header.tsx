import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-background text-foreground h-16 px-6 md:px-10 lg:px-20">
      <div className="flex items-center">
        <Link href="/">
          <Image 
            src="/opinionated.coffee.png"
            alt="Logo" 
            width={175}
            height={175}
            className="mr-3 -mt-2 header_logo"
          />
        </Link>
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link href="/about">
              <button className="px-6 py-2 text-lg font-bold text-black bg-white border border-black rounded-full transition duration-300 hover:bg-black hover:text-white">
                About
              </button>
            </Link>
          </li>
          <li>
            <Link href="/merch">
              <button className="px-6 py-2 text-lg font-bold text-black bg-white border border-black rounded-full transition duration-300 hover:bg-black hover:text-white">
                Merch
              </button>
            </Link>
          </li>
          <li>
            <Link href="/coffee">
              <button className="px-6 py-2 text-lg font-bold text-black bg-white border border-black rounded-full transition duration-300 hover:bg-black hover:text-white">
                Coffee
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
} 