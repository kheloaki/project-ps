"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check } from 'lucide-react';
import { toast } from 'sonner';

export function SyncUserButton() {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    setSynced(false);

    try {
      const response = await fetch('/api/admin/sync-user', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync user');
      }

      toast.success('User synced successfully!');
      setSynced(true);
      setTimeout(() => setSynced(false), 3000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to sync user');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="mb-4">
      <Button
        onClick={handleSync}
        disabled={syncing}
        variant="outline"
        className="flex items-center gap-2"
      >
        {syncing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Syncing...
          </>
        ) : synced ? (
          <>
            <Check className="w-4 h-4" />
            Synced!
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            Sync My User to Database
          </>
        )}
      </Button>
      <p className="text-xs text-gray-500 mt-2">
        Manually sync your user profile from Clerk to the database
      </p>
    </div>
  );
}

