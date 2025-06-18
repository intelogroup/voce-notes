
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Palette, Code, Zap, Globe, Shield } from 'lucide-react';

const features = [
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Built from the ground up for mobile devices with touch-friendly interactions and responsive layouts.',
  },
  {
    icon: Palette,
    title: 'Beautiful UI',
    description: 'Modern, clean design with smooth animations and intuitive user experience across all screen sizes.',
  },
  {
    icon: Code,
    title: 'Developer Friendly',
    description: 'Built with React, TypeScript, and Tailwind CSS for maintainable and scalable applications.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance with code splitting, lazy loading, and efficient rendering.',
  },
  {
    icon: Globe,
    title: 'Cross-Platform',
    description: 'Deploy as a web app or compile to native mobile apps for iOS and Android.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Built with security best practices and reliable infrastructure for production apps.',
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Everything You Need for Mobile Apps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From responsive design to native capabilities, we've got you covered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50 hover:border-border bg-background/60 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
