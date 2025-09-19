'use client';

import { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { units as mockUnits } from '@/lib/mock-data';
import type { Unit } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function ManageScoresPage() {
  const [units, setUnits] = useState<Unit[]>(mockUnits.sort((a,b) => b.score - a.score));
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [newScore, setNewScore] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditClick = (unit: Unit) => {
    setSelectedUnit(unit);
    setNewScore(unit.score.toString());
    setIsDialogOpen(true);
  };

  const handleScoreUpdate = () => {
    if (selectedUnit && newScore) {
      const updatedUnits = units.map((u) =>
        u.id === selectedUnit.id ? { ...u, score: parseInt(newScore, 10) } : u
      ).sort((a,b) => b.score - a.score);
      setUnits(updatedUnits);
      toast({
        title: 'Score Updated',
        description: `${selectedUnit.name}'s score has been updated to ${newScore}.`,
      });
      setIsDialogOpen(false);
      setSelectedUnit(null);
      setNewScore('');
    }
  };
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Manage Scores</h1>
        <p className="text-muted-foreground">Update scores for participating units.</p>
      </header>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit Name</TableHead>
                <TableHead className="text-right w-32">Current Score</TableHead>
                <TableHead className="text-right w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell className="text-right font-bold">{unit.score}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(unit)}>
                      Edit Score
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
