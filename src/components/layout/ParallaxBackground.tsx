// Parallax background ported from https://github.com/AffectedArc07/SS13WebMap/tree/archived
"use client";
import React, { useEffect, useRef, useState } from "react";

interface ParallaxBackgroundProps {
  direction?: "N" | "S" | "E" | "W";
  speedModifier?: number;
  autoInit?: boolean;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  direction = "E",
  speedModifier = 0,
  autoInit = true,
}) => {
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const [motionOK, setMotionOK] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (event: MediaQueryListEvent) => {
      setMotionOK(!event.matches);
    };

    setMotionOK(!mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  /**
   * Initialize the parallax (not started while the page is loading)
   * @param {String} dir - The direction, can be:`'N','S','E','W'`
   * @param {Number} speedmodif - Speed modifier value
   */
  const initFTL = (dir: "N" | "S" | "E" | "W" = "E", speedmodif: number = 0) => {
    const layer1 = layer1Ref.current;
    const layer2 = layer2Ref.current;
    const layer3 = layer3Ref.current;

    if (!layer1 || !layer2 || !layer3) {
      console.error("Layers not found");
      return;
    }

    const speeds = {
      l1: Math.max(80 + speedmodif, 1),
      l2: Math.max(40 + speedmodif, 1),
      l3: Math.max(20 + speedmodif, 1),
    };

    layer1.className = "layer1";
    layer2.className = "layer2";
    layer3.className = "layer3";
    layer1.style.animationName = `loop_${dir}`;
    layer2.style.animationName = `loop_${dir}`;
    layer3.style.animationName = `loop_${dir}`;
    layer1.style.animationDuration = `${speeds.l1}s`;
    layer2.style.animationDuration = `${speeds.l2}s`;
    layer3.style.animationDuration = `${speeds.l3}s`;

    console.debug("FTL Translation successful");
  };

  useEffect(() => {
    if (autoInit && motionOK) {
      initFTL(direction, speedModifier);
    } else if(!motionOK) {
        if (layer1Ref.current) layer1Ref.current.style.animationName = 'none';
        if (layer2Ref.current) layer2Ref.current.style.animationName = 'none';
        if (layer3Ref.current) layer3Ref.current.style.animationName = 'none';
    }
  }, [direction, speedModifier, autoInit, motionOK]);

  return (
    <>
      <ParallaxStyles />
      <div className="fixed inset-0 overflow-hidden">
        <div id="layer3" ref={layer3Ref}></div>
        <div id="layer2" ref={layer2Ref}></div>
        <div id="layer1" ref={layer1Ref}></div>
      </div>
    </>
  );
};

const ParallaxStyles = () => (
  <style jsx global>{`
    @keyframes loop_N {
      from {
        background-position: 0 0;
      }
      to {
        background-position: 0 960px;
      }
    }
    @keyframes loop_S {
      from {
        background-position: 0 0;
      }
      to {
        background-position: 0 -960px;
      }
    }
    @keyframes loop_E {
      from {
        background-position: 0 0;
      }
      to {
        background-position: -960px 0;
      }
    }
    @keyframes loop_W {
      from {
        background-position: 0 0;
      }
      to {
        background-position: 960px 0;
      }
    }
    .layer1,
    .layer2,
    .layer3,
    .TG_layer1,
    .TG_layer2,
    .TG_layer3 {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-repeat: repeat;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      z-index: -1;
      mix-blend-mode: screen;
    }
    .layer1 {
      background-image: url("/images/bg/parallax/layer1.png");
    }
    .layer2 {
      background-image: url("/images/bg/parallax/layer2.png");
    }
    .layer3 {
      background-image: url("/images/bg/parallax/layer3.png");
    }
    .TG_layer1 {
      background-image: url("/images/bg/parallax/layer1TG.png");
    }
    .TG_layer2 {
      background-image: url("/images/bg/parallax/layer2TG.png");
    }
    .TG_layer3 {
      background-image: url("/images/bg/parallax/layer3TG.png");
    }
  `}</style>
);

export default ParallaxBackground;