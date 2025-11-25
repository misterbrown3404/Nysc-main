import { useQuery } from "@tanstack/react-query";
import { Challenge } from "@shared/schema";
import ChallengeCard from "@/components/challenge-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Sparkles } from "lucide-react";

export default function ChallengesPage() {
  const { data: challenges, isLoading } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold font-poppins">
              All Challenges
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-inter max-w-2xl">
            Take on epic camp challenges, show your skills, and earn hype points from corps members nationwide!
          </p>
        </div>
      </section>

      {/* Challenges Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : !challenges || challenges.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-card-border">
            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold font-poppins mb-2">
              No Challenges Yet
            </h3>
            <p className="text-muted-foreground font-inter">
              New challenges are coming soon. Stay tuned!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
