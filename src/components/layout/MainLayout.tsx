"use client";

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ParallaxBackground from './ParallaxBackground';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-black relative">
      <ParallaxBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;