import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    const requestedPermission = await Notification.requestPermission();
    setPermission(requestedPermission);
    return requestedPermission;
  };

  const scheduleNotification = (title: string, options: NotificationOptions, showAt: Date) => {
    if (permission !== 'granted') {
      console.warn('Notification permission not granted.');
      return;
    }

    const now = new Date().getTime();
    const timeUntilShow = showAt.getTime() - now;

    if (timeUntilShow > 0) {
      setTimeout(() => {
        new Notification(title, options);
      }, timeUntilShow);
    }
  };

  return { permission, requestPermission, scheduleNotification };
}; 