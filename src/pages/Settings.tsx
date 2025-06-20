import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Bell, Volume2, Info, Moon, Sun, Smartphone } from 'lucide-react';
import { CleanCard, CleanCardContent, CleanCardHeader, CleanCardTitle } from '@/components/ui/clean-card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from 'next-themes';

const Settings = () => {
  const { theme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Theme */}
      <CleanCard>
        <CleanCardHeader>
          <CleanCardTitle className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Appearance
          </CleanCardTitle>
        </CleanCardHeader>
        <CleanCardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark mode
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CleanCardContent>
      </CleanCard>

      {/* Notifications */}
      <CleanCard>
        <CleanCardHeader>
          <CleanCardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CleanCardTitle>
        </CleanCardHeader>
        <CleanCardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Allow Notifications</p>
              <p className="text-sm text-muted-foreground">
                Enable notifications for alarms
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sound Notifications</p>
              <p className="text-sm text-muted-foreground">
                Play sound with notifications
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CleanCardContent>
      </CleanCard>

      {/* Audio Settings */}
      <CleanCard>
        <CleanCardHeader>
          <CleanCardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio Settings
          </CleanCardTitle>
        </CleanCardHeader>
        <CleanCardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">High Quality Recording</p>
              <p className="text-sm text-muted-foreground">
                Use higher audio quality for recordings
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Noise Cancellation</p>
              <p className="text-sm text-muted-foreground">
                Reduce background noise in recordings
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CleanCardContent>
      </CleanCard>

      {/* App Info */}
      <CleanCard>
        <CleanCardHeader>
          <CleanCardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About Voce Alarm
          </CleanCardTitle>
        </CleanCardHeader>
        <CleanCardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <Smartphone className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Voce Alarm</h3>
            <p className="text-sm text-muted-foreground">
              Your personal voice alarm app
            </p>
            <p className="text-xs text-muted-foreground">
              Version 1.0.0
            </p>
          </div>
        </CleanCardContent>
      </CleanCard>
    </div>
  );
};

export default Settings;
