'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getUnits, updateUnitScore } from '@/lib/services/units';
import type { Unit, EventScore } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

type SelectedScore = {
  unit: Unit;
  event: EventScore;
}

const getTotalScore = (unit: Unit) => {
  if (!unit.events) return 0;
  return unit.events.reduce((total, event) => total + event.score, 0);
};

export default function ManageScoresPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScore, setSelectedScore] = useState<SelectedScore | null>(null);
  const [newScore, setNewScore] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUnits() {
      setLoading(true);
      const fetchedUnits = await getUnits();
      fetchedUnits.sort((a,b) => getTotalScore(b) - getTotalScore(a));
      setUnits(fetchedUnits);
      setLoading(false);
    }
    fetchUnits();
  }, []);

  const filteredUnits = useMemo(() => {
    const sorted = [...units].sort((a,b) => getTotalScore(b) - getTotalScore(a));
    if (!searchTerm) return sorted;
    return sorted.filter(unit =>
      unit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [units, searchTerm]);

  const handleEditClick = (unit: Unit, event: EventScore) => {
    setSelectedScore({ unit, event });
    setNewScore(event.score.toString());
    setIsDialogOpen(true);
  };

  const handleScoreUpdate = async () => {
    if (selectedScore && newScore) {
      const scoreValue = parseInt(newScore, 10);
      try {
        await updateUnitScore(selectedScore.unit.id, selectedScore.event.name, scoreValue);
        const updatedUnits = units.map((u) => {
          if (u.id === selectedScore.unit.id) {
            const updatedEvents = u.events.map(e => e.name === selectedScore.event.name ? { ...e, score: scoreValue } : e);
            return { ...u, events: updatedEvents };
          }
          return u;
        });
        setUnits(updatedUnits);
        toast({
          title: 'Score Updated',
          description: `${selectedScore.unit.name}'s score for ${selectedScore.event.name} has been updated to ${newScore}.`,
        });
      } catch (error) {
         toast({
          title: 'Error',
          description: `Failed to update score.`,
          variant: 'destructive'
        });
      }
      
      setIsDialogOpen(false);
      setSelectedScore(null);
      setNewScore('');
    }
  };
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold">Manage Scores</h1>
            <p className="text-muted-foreground">Update scores for participating units across all events.</p>
        </div>
        <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                placeholder="Search units..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
        </div>
      </header>
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {loading ? (
             <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
          ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit Name</TableHead>
                  {units[0]?.events.map(event => (
                      <TableHead key={event.name} className="text-center">{event.name}</TableHead>
                  ))}
                  <TableHead className="text-right">Total Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.map((unit) => (
                  <TableRow key={unit.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell className="font-medium truncate max-w-xs">{unit.name}</TableCell>
                    {unit.events.map(event => (
                       <TableCell key={event.name} className="text-center">
                         <Button variant="link" size="sm" onClick={() => handleEditClick(unit, event)}>
                          {event.score}
                        </Button>
                       </TableCell>
                    ))}
                    <TableCell className="text-right font-bold">{getTotalScore(unit)}</TableCell>
                  </TableRow>
                ))}
                 {filteredUnits.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={(units[0]?.events?.length || 0) + 2} className="text-center text-muted-foreground py-8">
                           No units found matching "{searchTerm}".
                        </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Score for {selectedScore?.unit.name}</DialogTitle>
            <DialogDescription>
              Enter the new score for {selectedScore?.event.name}. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="score" className="text-right">
                New Score
              </Label>
              <Input
                id="score"
                type="number"
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleScoreUpdate}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
