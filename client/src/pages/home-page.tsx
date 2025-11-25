import { useQuery } from "@tanstack/react-query";
import { Challenge, Submission } from "@shared/schema";
import HeroSection from "@/components/hero-section";
import ChallengeCard from "@/components/challenge-card";
import SubmissionCard from "@/components/submission-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, TrendingUp } from "lucide-react";

export default function HomePage() {
  const { data: challenges, isLoading: challengesLoading } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
  });

  const { data: submissions, isLoading: submissionsLoading } = useQuery<Submission[]>({
    queryKey: ["/api/submissions"],
  });

  const trendingChallenges = challenges?.slice(0, 6) || [];
  const recentSubmissions = submissions?.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <HeroSection />

      {/* Trending Challenges Section */}
      <section id="trending-challenges" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h2 className="text-3xl lg:text-4xl font-bold font-poppins">
            Trending Challenges
          </h2>
        </div>

        {challengesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : trendingChallenges.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground font-inter">
              No challenges yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Submissions Feed */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Flame className="w-8 h-8 text-chart-5" />
          <h2 className="text-3xl lg:text-4xl font-bold font-poppins">
            Camp Cruise Feed
          </h2>
        </div>

        {submissionsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        ) : recentSubmissions.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-card-border">
            <p className="text-lg text-muted-foreground font-inter mb-4">
              Be the first to share your camp moments!
            </p>
            <p className="text-sm text-muted-foreground font-inter">
              Take on a challenge and show the nation your vibe.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentSubmissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
