'use client';

import { useState, useEffect } from 'react';
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
import type { Unit } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManageScoresPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [newScore, setNewScore] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUnits() {
      setLoading(true);
      const fetchedUnits = await getUnits();
      setUnits(fetchedUnits.sort((a,b) => b.score - a.score));
      setLoading(false);
    }
    fetchUnits();
  }, []);

  const handleEditClick = (unit: Unit) => {
    setSelectedUnit(unit);
    setNewScore(unit.score.toString());
    setIsDialogOpen(true);
  };

  const handleScoreUpdate = async () => {
    if (selectedUnit && newScore) {
      const scoreValue = parseInt(newScore, 10);
      try {
        await updateUnitScore(selectedUnit.id, scoreValue);
        const updatedUnits = units.map((u) =>
          u.id === selectedUnit.id ? { ...u, score: scoreValue } : u
        ).sort((a,b) => b.score - a.score);
        setUnits(updatedUnits);
        toast({
          title: 'Score Updated',
          description: `${selectedUnit.name}'s score has been updated to ${newScore}.`,
        });
      } catch (error) {
         toast({
          title: 'Error',
          description: `Failed to update score.`,
          variant: 'destructive'
        });
      }
      
      setIsDialogOpen(false);
      setSelectedUnit(null);
      setNewScore('');
    }
  };
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Manage Scores</h1>
        <p className="text-muted-foreground">Update scores for participating units.</p>
      </header>
      <Card>
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
                  <TableHead className="text-right w-[100px] sm:w-32">Current Score</TableHead>
                  <TableHead className="text-right w-[80px] sm:w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium truncate max-w-xs">{unit.name}</TableCell>
                    <TableCell className="text-right font-bold">{unit.score}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(unit)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Score for {selectedUnit?.name}</DialogTitle>
            <DialogDescription>
              Enter the new score below. Click save when you're done.
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
