
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Smartphone, Zap, Globe } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-background/50 backdrop-blur-sm mb-6">
            <Zap className="mr-2 h-4 w-4 text-primary" />
            Mobile-First Design
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Build Amazing
            <span className="text-primary block md:inline md:ml-3">
              Mobile Apps
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Create stunning, responsive web applications that work seamlessly across all devices. 
            From mobile-first design to native app capabilities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto">
            <Button size="lg" className="text-lg px-8 py-6 h-auto">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
              Learn More
            </Button>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
            <div className="flex flex-col items-center p-4 rounded-lg bg-background/30 backdrop-blur-sm border">
              <Smartphone className="h-8 w-8 text-primary mb-2" />
              <span className="font-medium">Mobile First</span>
              <span className="text-sm text-muted-foreground text-center">
                Optimized for touch
              </span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-background/30 backdrop-blur-sm border">
              <Globe className="h-8 w-8 text-primary mb-2" />
              <span className="font-medium">Responsive</span>
              <span className="text-sm text-muted-foreground text-center">
                Works everywhere
              </span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-background/30 backdrop-blur-sm border">
              <Zap className="h-8 w-8 text-primary mb-2" />
              <span className="font-medium">Fast</span>
              <span className="text-sm text-muted-foreground text-center">
                Lightning speed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl opacity-30" />
      </div>
    </section>
  );
};
