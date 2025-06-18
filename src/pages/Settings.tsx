
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Bell, Volume2, Smartphone, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Audio Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* App Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                About Voce Alarm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Voce Alarm</h3>
                <p className="text-sm text-muted-foreground">
                  Your personal voice alarm app
                </p>
                <p className="text-xs text-muted-foreground">
                  Version 1.0.0
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
