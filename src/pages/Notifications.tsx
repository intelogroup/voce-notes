import React from 'react';
import { Bell } from 'lucide-react';

const Notifications = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <Bell className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">No notifications yet</h2>
      <p className="text-muted-foreground">
        Your alarm notifications will appear here
      </p>
    </div>
  );
};

export default Notifications;
