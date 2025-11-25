import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertChallengeSchema,
  insertSubmissionSchema,
  insertHypeSchema,
  insertUserSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Challenges
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getAllChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch challenges" });
    }
  });

  app.post("/api/challenges", async (req, res) => {
    try {
      const validatedData = insertChallengeSchema.parse(req.body);
      const challenge = await storage.createChallenge(validatedData);
      res.json(challenge);
    } catch (error) {
      res.status(400).json({ error: "Invalid challenge data" });
    }
  });

  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const challenge = await storage.getChallenge(req.params.id);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch challenge" });
    }
  });

  // Submissions
  app.get("/api/submissions", async (req, res) => {
    try {
      const { challengeId } = req.query;
      let submissions;

      if (challengeId && typeof challengeId === "string") {
        submissions = await storage.getSubmissionsByChallenge(challengeId);
      } else {
        submissions = await storage.getAllSubmissions();
      }

      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.post("/api/submissions", async (req, res) => {
    try {
      const { challengeId, caption, mediaType, mediaUrl, username } = req.body;

      if (!challengeId || !caption || !mediaType || !mediaUrl || !username) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get user by username (should already exist from identity bootstrap)
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(400).json({ error: "User not found. Please bootstrap identity first." });
      }

      // Create submission with server-injected userId
      const submission = await storage.createSubmission({
        challengeId,
        userId: user.id,
        username: user.username,
        state: user.state,
        platoon: user.platoon,
        caption,
        mediaType,
        mediaUrl,
      });

      // Increment challenge participant count
      await storage.incrementChallengeParticipants(challengeId);

      res.json(submission);
    } catch (error) {
      console.error("Submission error:", error);
      res.status(400).json({ error: "Invalid submission data" });
    }
  });

  // Hypes
  app.post("/api/hypes", async (req, res) => {
    try {
      const { submissionId, userId } = req.body;

      if (!submissionId || !userId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Validate that the user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(400).json({ error: "User not found. Please bootstrap identity first." });
      }

      // Create hype (will throw if already hyped due to hypeIndex check)
      const hype = await storage.createHype({ submissionId, userId });

      // Increment submission hype count
      await storage.incrementSubmissionHype(submissionId);

      // Get submission to find the author and award points
      const submission = await storage.getSubmission(submissionId);
      if (submission) {
        const author = await storage.getUser(submission.userId);
        if (author) {
          // Award hype points to the submission author
          await storage.updateUserHypePoints(author.id, 10);
        }
      }

      res.json(hype);
    } catch (error: any) {
      console.error("Hype error:", error);
      if (error.message?.includes("already hyped")) {
        return res.status(400).json({ error: "Already hyped this submission" });
      }
      res.status(400).json({ error: "Invalid hype data" });
    }
  });

  // Leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const sortedUsers = users.sort(
        (a, b) => b.totalHypePoints - a.totalHypePoints
      );
      res.json(sortedUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Identity bootstrap endpoint
  app.post("/api/identity", async (req, res) => {
    try {
      const { username, state, platoon } = req.body;

      if (!username || !state || !platoon) {
        return res.status(400).json({ error: "Username, state, and platoon are required" });
      }

      // Look up existing user by username
      let user = await storage.getUserByUsername(username);
      let wasCreated = false;

      if (!user) {
        // Create new user
        user = await storage.createUser({ username, state, platoon });
        wasCreated = true;
      }

      res.json({ user, wasCreated });
    } catch (error) {
      console.error("Identity bootstrap error:", error);
      res.status(500).json({ error: "Failed to bootstrap identity" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
