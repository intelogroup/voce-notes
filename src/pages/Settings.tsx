import React, { useEffect } from 'react';
import { ToggleCheck } from '@/components/ui/toggle-check';
import { Bell, Volume2, Info, Moon, Sun, Smartphone, ArrowLeft, Download, Upload, AlertTriangle } from 'lucide-react';
import { CleanCard, CleanCardContent, CleanCardHeader, CleanCardTitle } from '@/components/ui/clean-card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/hooks/use-notifications';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useSettingsStore } from '@/store/settingsStore';

const Settings = () => {
  const { theme } = useTheme();
  const { permission, requestPermission } = useNotifications();
  const { toast } = useToast();

  const {
    soundNotifications,
    highQualityAudio,
    noiseCancellation,
    notificationsEnabled,
    toggleSoundNotifications,
    toggleHighQualityAudio,
    toggleNoiseCancellation,
    setNotificationsEnabled,
  } = useSettingsStore();

  useEffect(() => {
    if (permission === 'granted') {
      setNotificationsEnabled(true);
    } else if (permission === 'denied') {
      setNotificationsEnabled(false);
    }
  }, [permission, setNotificationsEnabled]);

  const handleExportData = () => {
    try {
        const alarmStorage = localStorage.getItem('alarm-storage');
        const noteStorage = localStorage.getItem('note-storage');
        const chatStorage = localStorage.getItem('chat-storage');

        const dataToExport = {
            'alarm-storage': alarmStorage ? JSON.parse(alarmStorage) : {},
            'note-storage': noteStorage ? JSON.parse(noteStorage) : {},
            'chat-storage': chatStorage ? JSON.parse(chatStorage) : {},
        };

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(dataToExport, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `voce-notes-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        toast({ title: "Success", description: "Data exported successfully." });
    } catch (error) {
        console.error("Failed to export data", error);
        toast({ title: "Error", description: "Failed to export data.", variant: "destructive" });
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') {
              throw new Error("File is not a valid text file.");
            }
            const data = JSON.parse(text);
            
            if (data['alarm-storage']) localStorage.setItem('alarm-storage', JSON.stringify(data['alarm-storage']));
            if (data['note-storage']) localStorage.setItem('note-storage', JSON.stringify(data['note-storage']));
            if (data['chat-storage']) localStorage.setItem('chat-storage', JSON.stringify(data['chat-storage']));

            toast({ title: "Success", description: "Data imported successfully. The app will now reload." });
            
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error("Failed to import data", error);
            toast({ title: "Error", description: "Failed to import data. Make sure the file is a valid backup.", variant: "destructive" });
        }
    };
    reader.readAsText(file);
  };

  const handleResetApp = () => {
    try {
        localStorage.clear();
        toast({ title: "Success", description: "Application has been reset. The app will now reload." });
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    } catch (error) {
        console.error("Failed to reset app", error);
        toast({ title: "Error", description: "Failed to reset application.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
          </div>
        </div>
      </nav>

      <div className="container max-w-2xl mx-auto py-6 space-y-6">
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
                  Switch between light, dark, and system modes
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
                  {permission === 'granted' && 'You have enabled notifications.'}
                  {permission === 'denied' && 'You have disabled notifications.'}
                  {permission === 'default' && 'Allow notifications for alarms.'}
                </p>
              </div>
              {permission === 'default' && (
                <Button onClick={requestPermission}>
                  Allow
                </Button>
              )}
              {permission === 'denied' && (
                 <Button onClick={requestPermission} variant="outline" size="sm">Request Again</Button>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sound Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Play sound with notifications
                </p>
              </div>
              <ToggleCheck checked={soundNotifications} onChange={toggleSoundNotifications} />
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
              <ToggleCheck checked={highQualityAudio} onChange={toggleHighQualityAudio} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Noise Cancellation</p>
                <p className="text-sm text-muted-foreground">
                  Reduce background noise in recordings
                </p>
              </div>
              <ToggleCheck checked={noiseCancellation} onChange={toggleNoiseCancellation} />
            </div>
          </CleanCardContent>
        </CleanCard>

        {/* Data Management */}
        <CleanCard>
          <CleanCardHeader>
            <CleanCardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Management
            </CleanCardTitle>
          </CleanCardHeader>
          <CleanCardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" asChild>
              <label htmlFor="import-file">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
                <input type="file" id="import-file" className="hidden" accept=".json" onChange={handleImportData} />
              </label>
            </Button>
          </CleanCardContent>
        </CleanCard>

        {/* Danger Zone */}
        <CleanCard borderClassName="border-destructive">
          <CleanCardHeader>
            <CleanCardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CleanCardTitle>
          </CleanCardHeader>
          <CleanCardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Reset Application
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your alarms, notes, and chat history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetApp}>
                    Yes, reset everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
    </div>
  );
};

export default Settings;
