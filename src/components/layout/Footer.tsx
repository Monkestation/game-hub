import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [comicSansEnabled, setComicSansEnabled] = useState(false);

  useEffect(() => {
    if (comicSansEnabled) 
      document.body.style.fontFamily = "'Comic-Sans', cursive";
    else 
      document.body.style.fontFamily = '';

    return () => 
      void (!comicSansEnabled &&
        (document.body.style.fontFamily = ''))
  }, [comicSansEnabled]);

  const toggleComicSans = () => {
    setComicSansEnabled(!comicSansEnabled);
  };

  return (
    <footer className="bg-black/80 border-t border-gray-800 pb-8 mt-auto">
      <div className="container mx-auto">
        <div className="border-gray-800 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Monkestation.</p>
          <p className="mt-2 text-sm">
            Space Station 13 is a community-developed, multiplayer round-based role playing game, where players assume the role of a crewmember on a space station.
          </p>
          <button
            onClick={toggleComicSans}
            className={`mt-2 ${comicSansEnabled ? 'bg-red-500' : 'bg-gray-500'} ${comicSansEnabled ? 'hover:bg-red-600' : 'hover:bg-gray-600'} text-white font-bold py-1 px-2 text-xs rounded`}
          >
            {comicSansEnabled ? 'OH GOD TURN IT OFF' : 'meow?'}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;