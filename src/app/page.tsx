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
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-yellow-700" />;
      default:
        return <span className="text-lg font-bold">{rank}</span>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <section className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4 tracking-tighter">ArtFestLive</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Welcome to the heart of creativity! Witness the scores unfold in real-time and celebrate the spirit of art.
        </p>
      </section>

      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-center">Live Scoreboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 text-center">Rank</TableHead>
                  <TableHead>Unit Name</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUnits.map((unit, index) => (
                  <TableRow key={unit.id} className="text-lg">
                    <TableCell className="font-bold text-center">
                      <div className="flex items-center justify-center">
                        {getRankIcon(index + 1)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell className="text-right font-bold text-primary">{unit.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
