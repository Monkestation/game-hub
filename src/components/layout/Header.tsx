"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pepperChance] = useState(
    Math.floor(Math.random() * 10) < 3
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-black/80 backdrop-blur-md py-2 shadow-md"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center justify-between">
          <Link
            href="https://monkestation.com"
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-bold tracking-wider text-white">
              Monke<span className="text-[#ED3A3A]">station</span>
            </span>
          </Link>
          {pepperChance && (
            <Image
              src={"/images/pepperdab.gif"}
              alt={"Peppermint dabbing back and forth"}
              width={64}
              height={64}
              unoptimized
              className="rounded ml-2 size-10"
            />
          )}
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-200 hover:text-primary transition font-medium"
          >
            Home
          </Link>
          <Link
            href="/servers"
            className="text-gray-200 hover:text-primary transition font-medium"
          >
            Servers
          </Link>
          <Link
            href="https://wiki.monkestation.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-200 hover:text-primary transition font-medium"
          >
            Wiki
          </Link>
          <Link
            href="https://status.monkestation.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-200 hover:text-primary transition font-medium"
          >
            Status
          </Link>
        </nav>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu, i don't know why im adding this though. just so it looks okay i guess? */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 absolute w-full">
          <div className="container mx-auto py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-gray-200 hover:text-primary transition font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/servers"
              className="text-gray-200 hover:text-primary transition font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Servers
            </Link>
            <Link
              href="https://wiki.monkestation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-primary transition font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Wiki
            </Link>
            <Link
              href="https://status.monkestation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-primary transition font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Status
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
