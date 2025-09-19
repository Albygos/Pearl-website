'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Crown, Trophy, Award, Search } from 'lucide-react';
import { getUnits } from '@/lib/services/units';
import { getEvents } from '@/lib/services/events';
import type { Unit, AppEvent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';


const getTotalScore = (unit: Unit) => {
  if (!unit.events) return 0;
  return unit.events.reduce((total, event) => total + event.score, 0);
};

const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-slate-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">{rank}</span>;
    }
};

export default function Home() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [fetchedUnits, fetchedEvents] = await Promise.all([getUnits(), getEvents()]);
      setUnits(fetchedUnits);
      setEvents(fetchedEvents);
      setLoading(false);
    }
    fetchData();
    
    // Optional: set up a real-time listener if using Firebase Realtime DB
    // For now, we fetch once.
  }, []);

  const filteredUnits = useMemo(() => {
    const sorted = [...units].sort((a, b) => getTotalScore(b) - getTotalScore(a));
    if (!searchTerm) {
      return sorted;
    }
    return sorted.filter(unit =>
      unit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [units, searchTerm]);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold mb-4 tracking-tight">ArtFestLive</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Welcome to the heart of creativity! Witness the scores unfold in real-time and celebrate the spirit of art.
          </p>
        </section>

        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg border-none overflow-hidden rounded-xl">
            <CardHeader className="text-center bg-muted/30 p-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <div>
                    <CardTitle className="text-3xl font-headline">Live Scoreboard</CardTitle>
                    <CardDescription>Real-time results from all event categories</CardDescription>
                </div>
                 <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search units..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background/50"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                 {loading ? (
                    <div className="space-y-1 p-4">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                    </div>
                ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent text-xs uppercase tracking-wider">
                      <TableHead className="w-24 text-center">Rank</TableHead>
                      <TableHead>Unit Name</TableHead>
                      {events.map(event => (
                        <TableHead key={event.id} className="text-center">{event.name}</TableHead>
                      ))}
                      <TableHead className="text-right text-base">Total Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnits.map((unit, index) => (
                      <TableRow 
                        key={unit.id} 
                        className={`text-base transition-colors duration-200 ${index < 3 ? 'font-bold' : 'font-medium'}`}
                      >
                        <TableCell className="font-bold text-center">
                          <div className="flex items-center justify-center h-full">
                            {getRankIcon(index + 1)}
                          </div>
                        </TableCell>
                        <TableCell>{unit.name}</TableCell>
                        {events.map(event => (
                          <TableCell key={event.id} className="text-center text-muted-foreground">
                            {unit.events?.find(e => e.name === event.name)?.score ?? 0}
                          </TableCell>
                        ))}
                        <TableCell className="text-right text-primary text-xl font-bold">{getTotalScore(unit)}</TableCell>
                      </TableRow>
                    ))}
                    {filteredUnits.length === 0 && !loading && (
                         <TableRow>
                            <TableCell colSpan={events.length + 3} className="text-center py-16 text-muted-foreground">
                                <p>No units found matching "{searchTerm}".</p>
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
                )}
                {!loading && units.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <p>The scoreboard is currently empty.</p>
                    <p>Check back soon for live updates!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
