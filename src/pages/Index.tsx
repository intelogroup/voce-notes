
import React from 'react';
import { MobileNavigation } from '@/components/MobileNavigation';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MobileNavigation />
      <main className="overflow-x-hidden">
        <HeroSection />
        <FeaturesSection />
        
        {/* Footer */}
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">L</span>
                </div>
                <span className="font-semibold">Lovable App</span>
              </div>
              <p className="text-sm text-muted-foreground text-center md:text-right">
                Built with ❤️ using React, TypeScript & Tailwind CSS
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
