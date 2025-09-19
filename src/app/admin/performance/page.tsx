'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Unit } from '@/lib/types';
import { summarizeUnitPerformance } from '@/ai/flows/summarize-unit-performance';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader, BarChart, Eye, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getUnits } from '@/lib/services/units';

type Summaries = {
  [unitId: string]: string;
};

type LoadingStates = {
  [unitId: string]: boolean;
};

const getTotalScore = (unit: Unit) => {
  if (!unit.events) return 0;
  return unit.events.reduce((total, event) => total + event.score, 0);
};

export default function PerformancePage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState<Summaries>({});
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});
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

  const handleGenerateSummary = async (unit: Unit) => {
    setLoadingStates(prev => ({ ...prev, [unit.id]: true }));
    try {
      const result = await summarizeUnitPerformance({
        unitName: unit.name,
        score: getTotalScore(unit),
        photoAccessCount: unit.photoAccessCount,
      });
      setSummaries(prev => ({ ...prev, [unit.id]: result.summary }));
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Summary',
        description: 'Could not generate a summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [unit.id]: false }));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Unit Performance</h1>
        <p className="text-muted-foreground">
          Generate AI-powered performance summaries for each unit.
        </p>
      </header>
       {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                   <div className="space-y-2 pt-2">
                     <Skeleton className="h-5 w-1/3" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-4/5" />
                   </div>
                </CardContent>
                <CardFooter>
                   <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {units.map(unit => (
          <Card key={unit.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                {unit.name}
              </CardTitle>
              <CardDescription>{unit.theme}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="flex items-center justify-between text-sm border p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span>Total Score</span>
                </div>
                <span className="font-bold text-lg">{getTotalScore(unit)}</span>
              </div>
              <div className="flex items-center justify-between text-sm border p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>Photo Accesses</span>
                </div>
                <span className="font-bold text-lg">{unit.photoAccessCount}</span>
              </div>
              <div className="space-y-2 pt-2">
                <h4 className="font-semibold">AI Performance Summary</h4>
                {loadingStates[unit.id] ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                ) : summaries[unit.id] ? (
                  <p className="text-sm text-muted-foreground italic">
                    "{summaries[unit.id]}"
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click the button below to generate a summary.
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleGenerateSummary(unit)}
                disabled={loadingStates[unit.id]}
              >
                {loadingStates[unit.id] ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Summary
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}
