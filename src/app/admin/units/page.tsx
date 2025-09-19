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
import { Loader, Wand2, Plus } from 'lucide-react';
import { suggestUnitName } from '@/ai/flows/suggest-unit-name';

export default function ManageUnitsPage() {
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitTheme, setNewUnitTheme] = useState('');
  const [newUnitScore, setNewUnitScore] = useState('0');
  const [isSuggestingName, setIsSuggestingName] = useState(false);
  const { toast } = useToast();

  const handleAddUnit = () => {
    if (newUnitName && newUnitTheme) {
      const newUnit: Unit = {
        id: (units.length + 1).toString(),
        name: newUnitName,
        theme: newUnitTheme,
        score: parseInt(newUnitScore, 10),
        photoAccessCount: 0,
      };
      setUnits([...units, newUnit]);
      toast({
        title: 'Unit Added',
        description: `"${newUnitName}" has been added to the event.`,
      });
      setIsAddDialogOpen(false);
      setNewUnitName('');
      setNewUnitTheme('');
      setNewUnitScore('0');
    } else {
        toast({
            title: 'Missing Information',
            description: `Please provide a name and theme for the new unit.`,
            variant: 'destructive'
        });
    }
  };

  const handleSuggestName = async () => {
    if (!newUnitTheme) {
      toast({
        title: 'Theme Required',
        description: 'Please enter an event theme to suggest a name.',
        variant: 'destructive',
      });
      return;
    }
    setIsSuggestingName(true);
    try {
      const result = await suggestUnitName({ eventTheme: newUnitTheme });
      setNewUnitName(result.unitName);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Suggesting Name',
        description: 'Could not generate a name. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggestingName(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-headline font-bold">Manage Units</h1>
          <p className="text-muted-foreground">Add or edit participating units.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Unit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Unit</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new participating unit.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="theme" className="text-right">Theme</Label>
                        <Input id="theme" value={newUnitTheme} onChange={(e) => setNewUnitTheme(e.target.value)} className="col-span-3" placeholder="e.g., 'Cosmic Dreams'"/>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Unit Name</Label>
                        <Input id="name" value={newUnitName} onChange={(e) => setNewUnitName(e.target.value)} className="col-span-3" placeholder="Creative name"/>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <div className="col-start-2 col-span-3">
                            <Button variant="outline" size="sm" onClick={handleSuggestName} disabled={isSuggestingName}>
                                {isSuggestingName ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                Suggest Name with AI
                            </Button>
                        </div>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="score" className="text-right">Initial Score</Label>
                        <Input id="score" type="number" value={newUnitScore} onChange={(e) => setNewUnitScore(e.target.value)} className="col-span-3"/>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleAddUnit}>Add Unit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </header>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit Name</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell>{unit.theme}</TableCell>
                  <TableCell className="text-right font-bold">{unit.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
