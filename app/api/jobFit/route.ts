import { generateText, Output } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { openai } from '@ai-sdk/openai';

export const dynamic = "force-dynamic";


const StatusEnum = z.enum(["pass", "warning", "fail"]);
const VerdictEnum = z.enum([
  "Strong Fit",
  "Good Fit",
  "Partial Fit",
  "Weak Fit",
]);

/* ---------- Output.object ---------- */

const jobFitOutput = Output.object({
  schema: z.object({
    overallMatch: z.number().int().min(0).max(100),

    scores: z.object({
      education: z.number().int().min(0).max(100),
      workExperience: z.number().int().min(0).max(100),
      skills: z.number().int().min(0).max(100),
      experienceLevel: z.number().int().min(0).max(100),
    }),

    sections: z.object({
      relevantExperience: z.object({
        status: StatusEnum,
        summary: z.string(),
        evidence: z.array(z.string()),
      }),

      seniority: z.object({
        status: StatusEnum,
        summary: z.string(),
        evidence: z.array(z.string()),
      }),

      education: z.object({
        status: StatusEnum,
        summary: z.string(),
        evidence: z.array(z.string()),
      }),

      skillsAlignment: z.object({
        status: StatusEnum,
        matchedSkills: z.array(z.string()),
        missingRequiredSkills: z.array(z.string()),
        preferredSkillsMatched: z.array(z.string()),
        summary: z.string(),
      }),
    }),

    strengths: z.array(z.string()),
    gaps: z.array(z.string()),

    recommendation: z.object({
      verdict: VerdictEnum,
      rationale: z.string(),
    }),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const job = body.job;
    const resume = body.resume;

    if (!job || !resume) {
      return NextResponse.json(
        { error: "Missing required fields: job and resume are required" },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert hiring analyst and ATS-style job–candidate matching engine.
Your task is to evaluate how well a candidate fits a specific job role using ONLY the provided job details and the candidate’s resume text.

You must:

Be objective and evidence-based

Explicitly reference resume evidence when making claims

Avoid hallucinating skills, degrees, or experience

Penalize missing or misaligned requirements

Clearly distinguish between required vs preferred qualifications

Produce output in valid JSON only, matching the exact schema provided below.
Do not include markdown, explanations, or extra text.

-----------------------------

JOB DETAILS:
${JSON.stringify(job)}

CANDIDATE RESUME (RAW TEXT):
${resume}

TASK:
Evaluate how well this candidate fits the job and generate a structured rubric suitable for frontend display.

SCORING RULES:
- All scores must be integers from 0–100
- Overall match is a weighted average:
  - Skills: 35%
  - Work Experience: 30%
  - Education: 15%
  - Experience Level / Seniority: 20%
- Required qualifications missing must significantly reduce scores
- Preferred qualifications increase scores but cannot compensate for missing required ones

OUTPUT JSON SCHEMA:
{
  "overallMatch": number,

  "scores": {
    "education": number,
    "workExperience": number,
    "skills": number,
    "experienceLevel": number
  },

  "sections": {
    "relevantExperience": {
      "status": "pass" | "warning" | "fail",
      "summary": string,
      "evidence": [string]
    },

    "seniority": {
      "status": "pass" | "warning" | "fail",
      "summary": string,
      "evidence": [string]
    },

    "education": {
      "status": "pass" | "warning" | "fail",
      "summary": string,
      "evidence": [string]
    },

    "skillsAlignment": {
      "status": "pass" | "warning" | "fail",
      "matchedSkills": [string],
      "missingRequiredSkills": [string],
      "preferredSkillsMatched": [string],
      "summary": string
    }
  },

  "strengths": [string],
  "gaps": [string],

  "recommendation": {
    "verdict": "Strong Fit" | "Good Fit" | "Partial Fit" | "Weak Fit",
    "rationale": string
  }
}

IMPORTANT:
- Base ALL judgments strictly on the resume content
- If something is unclear or missing, treat it as missing
- Keep summaries concise, professional, and frontend-friendly

    `

    const { output } = await generateText({
      model: openai('gpt-5.1'),
      output: jobFitOutput,
      prompt: prompt,
    });

    return NextResponse.json({ response: output });
  } catch(error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error in API:", error);
    return NextResponse.json(
      { error: "Failed to check: " + errorMessage }, 
      { status: 500 }
    );
  }
}