'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getUnit, getUnits } from '@/lib/services/units';
import type { Unit, EventScore } from '@/lib/types';
import { Award, Trophy, Download } from 'lucide-react';

const getTotalScore = (unit: Unit) => {
  if (!unit.events) return 0;
  return unit.events.reduce((total, event) => total + event.score, 0);
};

export default function DashboardPage() {
  const [unit, setUnit] = useState<Unit | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadDashboard() {
      const loggedInUnitId = localStorage.getItem('artfestlive_unit_id');
      if (!loggedInUnitId) {
        router.push('/login');
        return;
      }

      setLoading(true);
      try {
        const [fetchedUnit, allUnits] = await Promise.all([
          getUnit(loggedInUnitId),
          getUnits(),
        ]);

        if (fetchedUnit) {
          setUnit(fetchedUnit);
          const sortedUnits = allUnits.sort((a, b) => getTotalScore(b) - getTotalScore(a));
          const unitRank = sortedUnits.findIndex(u => u.id === fetchedUnit.id) + 1;
          setRank(unitRank);
        } else {
          // If unit not found (e.g., deleted), sign out
          localStorage.removeItem('artfestlive_unit_id');
          router.push('/login');
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        localStorage.removeItem('artfestlive_unit_id');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  const handleDownloadCsv = () => {
    if (!unit) return;

    const headers = ['Event', 'Score'];
    const rows = unit.events.map(event => `"${event.name}",${event.score}`);
    const totalScoreRow = `"Total Score",${getTotalScore(unit)}`;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    csvContent += rows.join("\n");
    csvContent += "\n" + totalScoreRow;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${unit.name}_scorecard.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleSignOut = () => {
    localStorage.removeItem('artfestlive_unit_id');
    router.push('/login');
  };

  if (loading || !unit) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="bg-accent/50 min-h-full">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center text-center sm:text-left mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-headline font-bold mb-2">
              Welcome, {unit.name}!
            </h1>
            <p className="text-lg text-muted-foreground">Here's your current performance summary.</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rank ? `#${rank}` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on total score across all units
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalScore(unit)}</div>
              <p className="text-xs text-muted-foreground">
                Sum of scores from all events
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border-none overflow-hidden rounded-xl">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <CardTitle className="text-2xl font-headline">Your Scorecard</CardTitle>
                    <CardDescription>A detailed breakdown of your points for each event.</CardDescription>
                </div>
                <Button onClick={handleDownloadCsv}>
                    <Download className="mr-2"/>
                    Download Scorecard (CSV)
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {unit.events.map((event) => (
                            <TableRow key={event.name}>
                                <TableCell className="font-medium">{event.name}</TableCell>
                                <TableCell className="text-right font-bold text-primary">{event.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        </div>
    </div>
  );
}
