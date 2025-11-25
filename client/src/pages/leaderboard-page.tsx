import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Flame, Award, Medal } from "lucide-react";

export default function LeaderboardPage() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/leaderboard"],
  });

  const sortedUsers = users?.sort((a, b) => b.totalHypePoints - a.totalHypePoints) || [];
  const topThree = sortedUsers.slice(0, 3);
  const restOfUsers = sortedUsers.slice(3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-chart-2" />;
      case 2:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3:
        return <Award className="w-6 h-6 text-chart-5" />;
      default:
        return null;
    }
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <section className="bg-gradient-to-r from-chart-2/10 via-primary/10 to-chart-2/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <Flame className="w-10 h-10 text-chart-5" />
            <h1 className="text-4xl md:text-5xl font-bold font-poppins">
              Hype Leaderboard
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-inter max-w-2xl">
            See who's bringing the most energy to camp. Climb the ranks and rep your state!
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all" data-testid="tab-all">All Time</TabsTrigger>
            <TabsTrigger value="weekly" data-testid="tab-weekly">This Week</TabsTrigger>
            <TabsTrigger value="daily" data-testid="tab-daily">Today</TabsTrigger>
            <TabsTrigger value="platoon" data-testid="tab-platoon">My Platoon</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>
            ) : sortedUsers.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl border border-card-border">
                <p className="text-lg text-muted-foreground font-inter">
                  No rankings yet. Be the first to earn hype points!
                </p>
              </div>
            ) : (
              <>
                {/* Top 3 Podium */}
                <div className="mb-12">
                  <div className="flex items-end justify-center gap-4 mb-8">
                    {/* 2nd Place */}
                    {topThree[1] && (
                      <div className="flex flex-col items-center" data-testid="podium-2">
                        <Avatar className="w-16 h-16 md:w-20 md:h-20 border-4 border-muted mb-3">
                          <AvatarFallback className="bg-muted text-muted-foreground font-bold font-poppins text-xl">
                            {getInitials(topThree[1].username)}
                          </AvatarFallback>
                        </Avatar>
                        <Medal className="w-8 h-8 text-muted-foreground mb-2" />
                        <h3 className="font-semibold font-inter text-sm md:text-base text-center truncate max-w-[100px]">
                          {topThree[1].username}
                        </h3>
                        <Badge variant="secondary" className="mt-2">
                          <Flame className="w-3 h-3 mr-1" />
                          {topThree[1].totalHypePoints}
                        </Badge>
                        <div className="mt-3 w-24 h-20 bg-muted rounded-t-lg flex items-center justify-center">
                          <span className="text-3xl font-bold font-poppins text-muted-foreground">2</span>
                        </div>
                      </div>
                    )}

                    {/* 1st Place */}
                    {topThree[0] && (
                      <div className="flex flex-col items-center" data-testid="podium-1">
                        <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-chart-2 mb-3">
                          <AvatarFallback className="bg-chart-2 text-white font-bold font-poppins text-2xl">
                            {getInitials(topThree[0].username)}
                          </AvatarFallback>
                        </Avatar>
                        <Crown className="w-10 h-10 text-chart-2 mb-2" />
                        <h3 className="font-semibold font-inter text-base md:text-lg text-center truncate max-w-[120px]">
                          {topThree[0].username}
                        </h3>
                        <Badge className="mt-2 bg-chart-2 hover:bg-chart-2">
                          <Flame className="w-3 h-3 mr-1" />
                          {topThree[0].totalHypePoints}
                        </Badge>
                        <div className="mt-3 w-28 h-32 bg-chart-2/20 border-2 border-chart-2 rounded-t-lg flex items-center justify-center">
                          <span className="text-4xl font-bold font-poppins text-chart-2">1</span>
                        </div>
                      </div>
                    )}

                    {/* 3rd Place */}
                    {topThree[2] && (
                      <div className="flex flex-col items-center" data-testid="podium-3">
                        <Avatar className="w-16 h-16 md:w-20 md:h-20 border-4 border-chart-5 mb-3">
                          <AvatarFallback className="bg-chart-5 text-white font-bold font-poppins text-xl">
                            {getInitials(topThree[2].username)}
                          </AvatarFallback>
                        </Avatar>
                        <Award className="w-8 h-8 text-chart-5 mb-2" />
                        <h3 className="font-semibold font-inter text-sm md:text-base text-center truncate max-w-[100px]">
                          {topThree[2].username}
                        </h3>
                        <Badge variant="secondary" className="mt-2">
                          <Flame className="w-3 h-3 mr-1" />
                          {topThree[2].totalHypePoints}
                        </Badge>
                        <div className="mt-3 w-24 h-16 bg-chart-5/20 border-2 border-chart-5 rounded-t-lg flex items-center justify-center">
                          <span className="text-3xl font-bold font-poppins text-chart-5">3</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rest of Rankings */}
                <div className="space-y-3">
                  {restOfUsers.map((user, index) => {
                    const rank = index + 4;
                    return (
                      <Card key={user.id} className="hover-elevate transition-all" data-testid={`rank-${rank}`}>
                        <div className="flex items-center gap-4 p-4">
                          <div className="w-12 text-center">
                            <span className="text-2xl font-bold font-poppins text-muted-foreground">
                              {rank}
                            </span>
                          </div>

                          <Avatar className="w-12 h-12 border-2 border-primary">
                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold font-poppins">
                              {getInitials(user.username)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold font-inter truncate" data-testid={`text-username-${rank}`}>
                              {user.username}
                            </h4>
                            <p className="text-sm text-muted-foreground font-inter">
                              {user.state} • Platoon {user.platoon}
                            </p>
                          </div>

                          <Badge variant="secondary" className="ml-auto">
                            <Flame className="w-4 h-4 mr-1 text-chart-5" />
                            <span className="font-bold" data-testid={`text-points-${rank}`}>
                              {user.totalHypePoints}
                            </span>
                          </Badge>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="weekly">
            <div className="text-center py-16 bg-card rounded-xl border border-card-border">
              <p className="text-lg text-muted-foreground font-inter">
                Weekly rankings coming soon!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="daily">
            <div className="text-center py-16 bg-card rounded-xl border border-card-border">
              <p className="text-lg text-muted-foreground font-inter">
                Daily rankings coming soon!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="platoon">
            <div className="text-center py-16 bg-card rounded-xl border border-card-border">
              <p className="text-lg text-muted-foreground font-inter">
                Platoon rankings coming soon!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
