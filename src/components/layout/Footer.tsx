import React from 'react';
import Link from 'next/link';
import { ServerIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black/80 border-t border-gray-800 pb-8 mt-auto">
      <div className="container mx-auto">
        <div className="border-gray-800 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Monkestation.</p>
          <p className="mt-2 text-sm">
            Space Station 13 is a community-developed, multiplayer round-based role playing game, where players assume the role of a crewmember on a space station.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
