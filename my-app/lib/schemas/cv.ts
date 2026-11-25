import { z } from 'zod';

export const cvSchema = z.object({
  fullName: z.string().describe('Candidate full name'),
  email: z.string().nullable().describe('Email address if found'),
  phone: z.string().nullable().describe('Phone number if found'),
  location: z.string().nullable().describe('City and country'),
  summary: z.string().nullable().describe('Professional summary'),
  skills: z.array(z.string()).describe('Technical and soft skills'),
  experience: z.array(
    z.object({
      jobTitle: z.string(),
      company: z.string(),
      startDate: z.string().describe('YYYY-MM format if available'),
      endDate: z.string().nullable().describe('YYYY-MM format, or null if Current'),
      isCurrent: z.boolean(),
      highlights: z.array(z.string()).describe('Key achievements and duties'),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      graduationYear: z.string().nullable(),
    })
  ),
});

export type ParsedCV = z.infer<typeof cvSchema>;
