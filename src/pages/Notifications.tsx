
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Bell, BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notifications = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="text-center py-12">
            <CardContent>
              <BellRing className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
              <p className="text-muted-foreground mb-6">
                Your alarm notifications will appear here
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
