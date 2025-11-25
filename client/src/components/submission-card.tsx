import { Submission } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import HypeButton from "./hype-button";
import { MessageCircle, Share2, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SubmissionCardProps {
  submission: Submission;
}

export default function SubmissionCard({ submission }: SubmissionCardProps) {
  const initials = submission.username
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-submission-${submission.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border-2 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold font-poppins">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold font-inter text-card-foreground truncate" data-testid="text-username">
              {submission.username}
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs font-inter">
                <MapPin className="w-3 h-3 mr-1" />
                {submission.state}
              </Badge>
              <span className="text-xs text-muted-foreground font-inter">
                Platoon {submission.platoon}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Media Display */}
        <div className="relative aspect-square bg-muted">
          {submission.mediaType === 'image' ? (
            <img
              src={submission.mediaUrl}
              alt={submission.caption}
              className="w-full h-full object-cover"
              data-testid="img-submission"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-4xl">🎥</span>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="p-4">
          <p className="text-sm font-inter text-card-foreground line-clamp-3" data-testid="text-caption">
            {submission.caption}
          </p>
          <p className="text-xs text-muted-foreground font-inter mt-2">
            {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4 pt-0 pb-4 px-4">
        <div className="flex items-center gap-4">
          <HypeButton submissionId={submission.id} hypeCount={submission.hypeCount} />
          
          <button
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            data-testid={`button-comment-${submission.id}`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium font-inter">12</span>
          </button>
        </div>

        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          data-testid={`button-share-${submission.id}`}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </CardFooter>
    </Card>
  );
}
