"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageChance] = useState(Math.floor(Math.random() * 10) < 5);
  const images: {src: string, alt: string}[] = [
    {
      src: "pepperdab.gif",
      alt: "Peppermint (A catgirl with bright mint green long messy hair and cat ears) dabbing back and forth",
    },
    {
      src: "YuyukoBounce.gif",
      alt: "Yuyuko fumo dancing and bouncing back and fouth",
    },
    {
      src: "blobfoxtransheart.png",
      alt: "An orange blob fox hugging/showing a trans heart",
    },
    {
      src: "wormgay.png",
      alt: "A small drawn worm colored as the pride flag"
    },
    {
      src: "wormlesb.png",
      alt: "A small drawn worm colored as the lesbian flag"
    },
    {
      src: "wormnb.png",
      alt: "A small drawn worm colored as the non-binary flag"
    },
    {
      src: "wormtrans.png",
      alt: "A small drawn worm colored as the trans flag"
    },
    {
      src: "wormtrans.png",
      alt: "A small drawn worm colored as the trans flag"
    },
    {
      src: "shiggy.gif",
      alt: "A chibbi fox with light orange hair with a large tail, wearing a green sweater and crimson skirt, and white fluffy ears, shaking back and forth very fast"
    },
    {
      src: "shiggytrans.gif",
      alt: "A chibbi fox with light orange hair with a large tail, wearing a green sweater and crimson skirt, and white fluffy ears, shaking back and forth very fast. But with the trans flag overlayed for colors."
    },
    {
      src: "crystalheartace.gif",
      alt: "A shining crystal heart with the colors of the ace flag, that occasionally spins"
    },
    {
      src: "crystalheartbi.gif",
      alt: "A shining crystal heart with the colors of the bi flag, that occasionally spins"
    },
    {
      src: "crystalhearttransfem.gif",
      alt: "A shining crystal heart with the colors of the trans-fem flag, that occasionally spins"
    },
    {
      src: "weh.png",
      alt: "A small green lizard plushie with its tounge sticking out, looking at the corner with its eyes at the viewer"
    },
    {
      src: "weh_gun.png",
      alt: "A small green lizard plushie with its tounge sticking out, looking at the corner with its eyes at the viewer, holding a gun to the viewer."
    },
    {
      src: "weh_space.png",
      alt: "A small green lizard plushie enclosed in a space suit with a helmet, with its tounge sticking out, looking at the corner with its eyes at the viewer."
    },
    {
      src: "weh_front.png",
      alt: "A small green lizard plushie with its tounge sticking out, facing head on at the viewer."
    },
    {
      src: "coldkobold.gif",
      alt: "A kobold that is on fire. It is orange, engulfed in flames and looking to the left. and.. on fire. it looks cold."
    },
    {
      src: "kilgoru.png",
      alt: "Padoru, but kilgor. He is wearing shades, his hair is slightly bright yellow, and holding a bag of money that says 'station budget', facing to the right"
    },
    {
      src: "walter.png",
      alt: "A front facing image of Nelson the bull terrier, also known as Walter. Waltuh.. where's the goods waltuh..."
    }, 
    {
      src: "noerp.png",
      alt: "A deep blue poster, with the words NO ERP. 'NO' being bright red with a thick red underline, and below that 'ERP' in smaller white text,"
    },
    {
      src: "bee.gif",
      alt: "A yellow bee sprite flapping its wings and moving up and down in a linear motion. I don't know a better way to describe this bee. It has a smile on it's face.",
    },
    {
      src: "mcrib.png",
      alt: "A sprite of a slightly wide burger that resembles  a mcdonalds mcrib."
    }
  ];
  const [randomImage] = useState<{ src: string; alt: string }>(
    images[Math.floor(Math.random() * images.length)]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/servers", label: "Servers" },
    { href: "https://wiki.monkestation.com", label: "Wiki", external: true },
    { href: "https://github.com/monkestation", label: "Github", external: true },
    {
      href: "https://status.monkestation.com",
      label: "Status",
      external: true,
    },
  ];

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
          {imageChance && (
            <Image
              src={"/images/other/" + randomImage.src}
              alt={randomImage.alt}
              width={64}
              height={64}
              unoptimized
              className="ml-2 w-full h-10"
            />
          )}
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-200 hover:text-primary transition font-medium px-3 py-2"
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </Link>
          ))}
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-200 hover:text-primary transition font-medium py-3 px-4 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
