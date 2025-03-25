import React, { useState, useEffect } from 'react';

// Loosely ported from monkestation's uwuify.dm file
const uwuifyMapping: Record<string,string> = {
  "ove": "uv", "Ove": "Uv", "oVe": "uV", "OVe": "UV", "ovE": "uv", "OvE": "Uv", "oVE": "uV", "OVE": "UV",
  "ne": "nye", "Ne": "Nye", "nE": "nYe", "NE": "NYe",
  "nu": "nyu", "Nu": "Nyu", "nU": "nYu", "NU": "NYu",
  "na": "nya", "Na": "Nya", "nA": "nYa", "NA": "NYa",
  "no": "nyo", "No": "Nyo", "nO": "nYo", "NO": "NYo",
  "r": "w", "R": "W", "l": "w", "L": "W"
};

const uwuifyRegex = new RegExp(
  Object.keys(uwuifyMapping)
    .sort((a, b) => b.length - a.length)
    .map(str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|'),
  'g'
);

const uwuifyText = (text: string | null) => text?.replace(uwuifyRegex, (match: string) => uwuifyMapping[match]);

const uwuifyAllText = () => {
  const elements: NodeListOf<HTMLElement> = document.querySelectorAll('*:not(script):not(style)');

  elements.forEach((el: HTMLElement) => {
    const textNodes: Text[] = getTextNodes(el);

    textNodes.forEach((node: Text) => {
      if (node.textContent !== null) {
        node.textContent = uwuifyText(node.textContent) || null;
      }
    });
  });
};

const getTextNodes = (node: Node): Text[] => {
  const textNodes: Text[] = [];

  function walk(node: Node, isScriptOrStyleDescendant: boolean = false): void {
    if (node.nodeType === Node.TEXT_NODE && !isScriptOrStyleDescendant) {
      textNodes.push(node as Text);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const isCurrentScriptOrStyle = element.tagName === 'SCRIPT' || element.tagName === 'STYLE';
      const newIsScriptOrStyleDescendant = isScriptOrStyleDescendant || isCurrentScriptOrStyle;

      for (const child of element.childNodes) {
        walk(child, newIsScriptOrStyleDescendant);
      }
    }
  }

  walk(node);
  return textNodes;
};

const Footer = () => {
  const [comicSansEnabled, setComicSansEnabled] = useState(false);

  useEffect(() => {
    document.body.style.fontFamily = comicSansEnabled ? "'Comic-Sans', cursive" : '';
    return () => { if (!comicSansEnabled) document.body.style.fontFamily = ''; };
  }, [comicSansEnabled]);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (event.shiftKey) {
      uwuifyAllText();
    } else {
      setComicSansEnabled(prev => !prev);
    }
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
            onClick={handleClick}
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
