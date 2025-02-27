import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-background text-foreground h-16 px-6 md:px-10 lg:px-20">
      <div className="flex items-center">
        <Link href="/">
          <Image 
            src="/opinionated.coffee.words.png"
            alt="Logo" 
            width={300}
            height={300}
            className="mr-3"
          />
        </Link>
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link href="/about">
              <button className="px-6 py-2 text-lg font-bold text-primary-foreground bg-primary border border-primary rounded-full transition duration-300 hover:bg-background hover:text-primary">
                About
              </button>
            </Link>
          </li>
          <li>
            <Link href="/merch">
              <button className="px-6 py-2 text-lg font-bold text-primary-foreground bg-primary border border-primary rounded-full transition duration-300 hover:bg-background hover:text-primary">
                Merch
              </button>
            </Link>
          </li>
          <li>
            <Link href="/coffee">
              <button className="px-6 py-2 text-lg font-bold text-primary-foreground bg-primary border border-primary rounded-full transition duration-300 hover:bg-background hover:text-primary">
                Coffee
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
} 