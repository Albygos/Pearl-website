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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getUnits, addUnit, deleteUnit } from '@/lib/services/units';
import type { Unit } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader, Wand2, Plus, Trash2 } from 'lucide-react';
import { suggestUnitName } from '@/ai/flows/suggest-unit-name';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const getTotalScore = (unit: Unit) => {
  if (!unit.events) return 0;
  return unit.events.reduce((total, event) => total + event.score, 0);
};


export default function ManageUnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitTheme, setNewUnitTheme] = useState('');
  const [newUnitScore, setNewUnitScore] = useState('0');
  const [newUnitCredentialId, setNewUnitCredentialId] = useState('');
  const [isSuggestingName, setIsSuggestingName] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUnits() {
      setLoading(true);
      const fetchedUnits = await getUnits();
      setUnits(fetchedUnits);
      setLoading(false);
    }
    fetchUnits();
  }, []);
  
  const generateCredentialId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  const handleAddUnit = async () => {
    if (newUnitName && newUnitTheme && newUnitCredentialId) {
      const newUnit: Omit<Unit, 'id' | 'events'> & { score: number } = {
        name: newUnitName,
        theme: newUnitTheme,
        score: parseInt(newUnitScore, 10),
        photoAccessCount: 0,
        credentialId: newUnitCredentialId,
      };
      try {
        const newUnitId = await addUnit(newUnit);
        const addedUnit = await getUnits().then(units => units.find(u => u.id === newUnitId));
        if (addedUnit) {
          setUnits([...units, addedUnit]);
        }
        toast({
          title: 'Unit Added',
          description: `"${newUnitName}" has been added to the event.`,
        });
        setIsAddDialogOpen(false);
        setNewUnitName('');
        setNewUnitTheme('');
        setNewUnitScore('0');
        setNewUnitCredentialId('');
      } catch (error) {
        toast({
            title: 'Error Adding Unit',
            description: `There was a problem saving the new unit.`,
            variant: 'destructive'
        });
      }
    } else {
        toast({
            title: 'Missing Information',
            description: `Please provide a name, theme, and credential ID.`,
            variant: 'destructive'
        });
    }
  };

  const handleSuggestName = async () => {
    if (!newUnitTheme) {
      toast({
        title: 'Theme Required',
        description: 'Please enter a theme to suggest a name.',
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

  const handleDeleteUnit = async (unitId: string) => {
    try {
      await deleteUnit(unitId);
      setUnits(units.filter(u => u.id !== unitId));
      toast({
        title: 'Unit Deleted',
        description: 'The unit has been successfully removed.',
      });
    } catch (error) {
      toast({
        title: 'Error Deleting Unit',
        description: 'There was a problem deleting the unit.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between sm:items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold">Manage Units</h1>
          <p className="text-muted-foreground">Add, edit, or delete participating units.</p>
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
                        Fill in the details for the new unit. A credential ID will be generated.
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
                                Suggest Name
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="credentialId" className="text-right">Credential ID</Label>
                        <div className="col-span-3 flex items-center gap-2">
                           <Input id="credentialId" value={newUnitCredentialId} onChange={(e) => setNewUnitCredentialId(e.target.value)} placeholder="Unique ID for login"/>
                           <Button variant="outline" size="sm" onClick={() => setNewUnitCredentialId(generateCredentialId())}>Generate</Button>
                        </div>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="score" className="text-right">Initial Score (Event 1)</Label>
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
                    <TableHead className="hidden md:table-cell">Theme</TableHead>
                    <TableHead className="hidden sm:table-cell">Credential ID</TableHead>
                    <TableHead className="text-right">Total Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {units.map((unit) => (
                    <TableRow key={unit.id} className="hover:bg-accent/50 transition-colors">
                      <TableCell className="font-medium truncate max-w-[150px] sm:max-w-xs">{unit.name}</TableCell>
                      <TableCell className="hidden md:table-cell truncate max-w-[150px] sm:max-w-xs">{unit.theme}</TableCell>
                      <TableCell className="hidden sm:table-cell font-mono text-xs">{unit.credentialId}</TableCell>
                      <TableCell className="text-right font-bold">{getTotalScore(unit)}</TableCell>
                      <TableCell className="text-right">
                         <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the unit "{unit.name}".
                              </AndroidDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteUnit(unit.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
