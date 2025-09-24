'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader, Save } from 'lucide-react';
import type { VenueDetails } from '@/lib/types';
import { getVenueDetails, updateVenueDetails } from '@/lib/services/venue';

export default function ManageVenuePage() {
  const [details, setDetails] = useState<VenueDetails>({ roomNumber: '', item: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const currentDetails = await getVenueDetails();
        if (currentDetails) {
          setDetails(currentDetails);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch venue details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [toast]);

  const handleSave = async () => {
    if (!details.roomNumber || !details.item) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out both fields.',
        variant: 'destructive',
      });
      return;
    }
    setSaving(true);
    try {
      await updateVenueDetails(details);
      toast({
        title: 'Success!',
        description: 'Venue details have been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update venue details.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Manage Venue</h1>
        <p className="text-muted-foreground">Update the event venue information displayed to all users.</p>
      </header>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Venue Details</CardTitle>
          <CardDescription>Enter the room number and the item being showcased or judged.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
              <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
              <div className="h-10 w-32 rounded-md bg-muted animate-pulse" />
            </div>
          ) : (
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  placeholder="e.g., 'Hall A'"
                  value={details.roomNumber}
                  onChange={(e) => setDetails({ ...details, roomNumber: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="item">Item / Event</Label>
                <Input
                  id="item"
                  placeholder="e.g., 'Live Painting Competition'"
                  value={details.item}
                  onChange={(e) => setDetails({ ...details, item: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <Loader className="animate-spin" /> : <Save />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}