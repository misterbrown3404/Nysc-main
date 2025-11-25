import { Challenge } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <Card className="group hover-elevate active-elevate-2 transition-all duration-300 overflow-hidden" data-testid={`card-challenge-${challenge.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-4xl" data-testid="text-emoji">{challenge.emoji}</span>
              {challenge.participantCount > 10 && (
                <Badge variant="secondary" className="text-xs font-inter font-medium">
                  Trending
                </Badge>
              )}
            </div>
            <h3 className="text-2xl font-semibold font-poppins text-card-foreground line-clamp-2" data-testid="text-title">
              {challenge.title}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-base text-muted-foreground font-inter line-clamp-3" data-testid="text-description">
          {challenge.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4 pt-4 border-t border-card-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium font-inter" data-testid="text-participants">
            {challenge.participantCount} {challenge.participantCount === 1 ? 'participant' : 'participants'}
          </span>
        </div>

        <Link href="/upload">
          <Button
            size="sm"
            variant="default"
            className="font-semibold font-inter"
            data-testid={`button-join-${challenge.id}`}
          >
            Join
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
