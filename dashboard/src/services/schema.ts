import { z } from "zod";

export const contributionStatusSchema = z.enum([
  "approved",
  "pending",
  "declined",
  "abandoned",
]);

export const genreSchema = z.enum(["House", "Salsa", "Breaking", "Hip Hop"]);

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
  artistName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string(),
  avatar: z.string(),
  isOnboarded: z.boolean(),
  role: z.string(),
  emailVerifiedAt: z.string().nullable(),
});

export const sectionSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  order: z.number(),
});

export const wikiSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  genre: genreSchema,
  updatedAt: z.string(),
  sections: z.array(sectionSchema),
});

export const contributionSchema = z.object({
  id: z.number(),
  wikiId: z.number(),
  title: z.string(),
  excerpt: z.string(),
  genre: genreSchema,
  status: contributionStatusSchema,
  reason: z.string().nullable(),
  updatedAt: z.string(),
});

export const notificationSchema = z.object({
  id: z.number(),
  wikiId: z.number(),
  sectionId: z.number(),
  title: z.string(),
  status: z.enum(["approved", "declined"]),
  reason: z.string().nullable(),
  updatedAt: z.string(),
});

export const loginParamsSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

export const onboardingParamsSchema = z.object({
  artistName: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  bio: z.string().max(300),
  avatar: z.string().nullable(),
});

export const sectionFormParamsSchema = z.object({
  content: z.string().min(1),
});

export type TContributionStatus = z.infer<typeof contributionStatusSchema>;
export type TGenre = z.infer<typeof genreSchema>;
export type TUser = z.infer<typeof userSchema>;
export type TSection = z.infer<typeof sectionSchema>;
export type TWiki = z.infer<typeof wikiSchema>;
export type TContribution = z.infer<typeof contributionSchema>;
export type TNotification = z.infer<typeof notificationSchema>;
export type TLoginParams = z.infer<typeof loginParamsSchema>;
export type TOnboardingParams = z.infer<typeof onboardingParamsSchema>;
export type TSectionFormParams = z.infer<typeof sectionFormParamsSchema>;
