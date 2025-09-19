import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Crown, Trophy, Award } from 'lucide-react';
import { getUnits } from '@/lib/services/units';
import { unstable_noStore as noStore } from 'next/cache';

export default async function Home() {
  noStore();
  const units = await getUnits();
  const sortedUnits = [...units].sort((a, b) => b.score - a.score);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-slate-500" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">{rank}</span>;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold mb-4 tracking-tight">ArtFestLive</h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          Welcome to the heart of creativity! Witness the scores unfold in real-time and celebrate the spirit of art.
        </p>
      </section>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Live Scoreboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-24 text-center">Rank</TableHead>
                    <TableHead>Unit Name</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUnits.map((unit, index) => (
                    <TableRow key={unit.id} className="text-lg hover:bg-accent transition-colors duration-200">
                      <TableCell className="font-bold text-center">
                        <div className="flex items-center justify-center h-full">
                          {getRankIcon(index + 1)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{unit.name}</TableCell>
                      <TableCell className="text-right font-bold text-primary text-xl">{unit.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
               {!sortedUnits.length && (
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
  );
}
