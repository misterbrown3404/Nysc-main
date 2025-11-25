import { useState } from "react";
import { Flame } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getUserIdentity } from "@/lib/user-identity";
import { useToast } from "@/hooks/use-toast";

interface HypeButtonProps {
  submissionId: string;
  hypeCount: number;
}

export default function HypeButton({ submissionId, hypeCount }: HypeButtonProps) {
  const [isHyped, setIsHyped] = useState(false);
  const [localCount, setLocalCount] = useState(hypeCount);
  const { toast } = useToast();

  const hypeMutation = useMutation({
    mutationFn: async () => {
      const userIdentity = getUserIdentity();
      
      if (!userIdentity) {
        throw new Error("Please submit a challenge first to start hyping!");
      }
      
      return apiRequest("POST", "/api/hypes", {
        submissionId,
        userId: userIdentity.userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
    },
    onError: (error: any) => {
      setIsHyped(false);
      setLocalCount(hypeCount);
      
      if (error.message?.includes("submit a challenge first")) {
        toast({
          title: "Create your profile first",
          description: "Submit a challenge to start giving hype!",
          variant: "destructive",
        });
      } else if (error.message?.includes("Already hyped")) {
        setIsHyped(true);
        setLocalCount(prev => prev);
      } else {
        toast({
          title: "Hype failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleHype = () => {
    if (!isHyped) {
      setIsHyped(true);
      setLocalCount(prev => prev + 1);
      hypeMutation.mutate();
    }
  };

  return (
    <button
      onClick={handleHype}
      className={`flex items-center gap-1.5 transition-all duration-200 ${
        isHyped
          ? "text-chart-5 scale-110"
          : "text-muted-foreground hover:text-chart-5 hover:scale-105"
      }`}
      data-testid={`button-hype-${submissionId}`}
    >
      <Flame
        className={`w-6 h-6 ${isHyped ? "fill-current" : ""}`}
        strokeWidth={2}
      />
      <span className="text-sm font-bold font-inter" data-testid={`text-hype-count-${submissionId}`}>
        {localCount}
      </span>
    </button>
  );
}
