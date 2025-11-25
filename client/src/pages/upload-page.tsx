import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Challenge } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, Camera, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { setUserIdentity, getUserIdentity } from "@/lib/user-identity";

const uploadFormSchema = z.object({
  challengeId: z.string().min(1, "Please select a challenge"),
  username: z.string().min(2, "Username must be at least 2 characters"),
  state: z.string().min(2, "State is required"),
  platoon: z.string().min(1, "Platoon is required"),
  caption: z.string().min(10, "Caption must be at least 10 characters"),
  mediaType: z.literal("image"),
  mediaUrl: z.string(),
});

type UploadFormData = z.infer<typeof uploadFormSchema>;

export default function UploadPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const { data: challenges, isLoading } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
  });

  const existingUser = getUserIdentity();

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      challengeId: "",
      username: existingUser?.username || "",
      state: existingUser?.state || "",
      platoon: existingUser?.platoon || "",
      caption: "",
      mediaType: "image",
      mediaUrl: "",
    },
  });

  const createSubmission = useMutation({
    mutationFn: async (data: UploadFormData) => {
      // Bootstrap identity first if needed
      const identityRes = await apiRequest("POST", "/api/identity", {
        username: data.username,
        state: data.state,
        platoon: data.platoon,
      });
      const identityResponse = await identityRes.json();

      // Store the canonical user identity
      setUserIdentity({
        userId: identityResponse.user.id,
        username: identityResponse.user.username,
        state: identityResponse.user.state,
        platoon: identityResponse.user.platoon,
      });

      // Now submit with just the required fields (userId will be injected server-side)
      const submissionRes = await apiRequest("POST", "/api/submissions", {
        challengeId: data.challengeId,
        username: identityResponse.user.username,
        caption: data.caption,
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl,
      });
      return submissionRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      toast({
        title: "Challenge completed!",
        description: "Your submission is live. Get ready for the hype!",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UploadFormData) => {
    // In a real app, we'd upload the image to a storage service and get the URL
    // For now, we'll use a placeholder image URL
    const submissionData = {
      ...data,
      mediaUrl: previewUrl || "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=800&fit=crop",
    };
    createSubmission.mutate(submissionData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold font-poppins">
              Share Your Moment
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-inter">
            Take on a challenge and show corps members nationwide your energy!
          </p>
        </div>
      </section>

      {/* Upload Form */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold font-poppins">
              Upload Your Challenge Entry
            </h2>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image-upload" className="font-inter font-medium">
                    Upload Photo or Video
                  </Label>
                  <div className="relative">
                    {previewUrl ? (
                      <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-border">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setPreviewUrl("")}
                          data-testid="button-remove-image"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-border hover-elevate cursor-pointer transition-all"
                        data-testid="label-upload"
                      >
                        <Camera className="w-16 h-16 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium font-inter text-muted-foreground mb-1">
                          Click to upload
                        </p>
                        <p className="text-sm text-muted-foreground font-inter">
                          PNG, JPG or MP4 (max. 10MB)
                        </p>
                      </label>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleImageChange}
                      className="hidden"
                      data-testid="input-file"
                    />
                  </div>
                </div>

                {/* Challenge Selection */}
                <FormField
                  control={form.control}
                  name="challengeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-inter font-medium">Challenge</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-challenge">
                            <SelectValue placeholder="Select a challenge" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {challenges?.map((challenge) => (
                            <SelectItem key={challenge.id} value={challenge.id}>
                              {challenge.emoji} {challenge.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-inter font-medium">Your Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          {...field}
                          data-testid="input-username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* State and Platoon */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-inter font-medium">State</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Lagos"
                            {...field}
                            data-testid="input-state"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="platoon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-inter font-medium">Platoon</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 7"
                            {...field}
                            data-testid="input-platoon"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Caption */}
                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-inter font-medium">Caption</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your submission..."
                          rows={4}
                          {...field}
                          data-testid="input-caption"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-semibold font-inter text-lg"
                  disabled={createSubmission.isPending}
                  data-testid="button-submit"
                >
                  {createSubmission.isPending ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Submit Entry
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
