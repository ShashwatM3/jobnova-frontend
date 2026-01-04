"use client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import maxInterviewSuccess from "@/public/images/maxInterviewSuccess.png"
import { ExternalLink, Heart, ArrowLeft, SquareArrowOutUpRight, ArrowUpRight, MapPin, Users, Briefcase, Building, Clock, DollarSign, Inspect, SparklesIcon, Loader2, ArrowUpLeft, ArrowRight } from 'lucide-react'
import Image, { StaticImageData } from 'next/image'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import blurredFit from "@/public/images/blurredFit.png"
import { FileUploader } from "react-drag-drop-files";
import pdfToText from 'react-pdftotext'
import { useRouter } from "next/navigation"

interface Job {
  id: number
  title: string
  company: string
  location: string
  workType: string
  match: number
  details: {
    employmentType: string
    skillsMatch: string
    level: string
    salary: string
  }
  posted: string
  applicants: number
  liked: boolean
  companyLogo?: StaticImageData
  description: string
  qualifications: {
    required: string[]
    preferred: string[]
  }
  responsibilities: string[]
  benefits: string[]
  companyInfo: {
    name: string
    founded: string
    location: string
    employees: string
    website: string
  }
}

interface JobDetailedProps {
  params: {jobData: Job}
}

interface CircleScoreProps {
  label: string;
  value: number;
}

interface StatusIconProps {
  status: "pass" | "warning" | "fail";
}

interface SectionProps {
  title: string;
  data: {
    status: "pass" | "warning" | "fail";
    summary: string;
    evidence?: string[];
  };
}

interface JobFitAnalysis {
  overallMatch: number;
  scores: {
    education: number;
    workExperience: number;
    skills: number;
    experienceLevel: number;
  };
  sections: {
    relevantExperience: {
      status: "pass" | "warning" | "fail";
      summary: string;
      evidence: string[];
    };
    seniority: {
      status: "pass" | "warning" | "fail";
      summary: string;
      evidence: string[];
    };
    education: {
      status: "pass" | "warning" | "fail";
      summary: string;
      evidence: string[];
    };
    skillsAlignment: {
      status: "pass" | "warning" | "fail";
      matchedSkills: string[];
      missingRequiredSkills: string[];
      preferredSkillsMatched: string[];
      summary: string;
    };
  };
  strengths: string[];
  gaps: string[];
  recommendation: {
    verdict: "Strong Fit" | "Good Fit" | "Partial Fit" | "Weak Fit";
    rationale: string;
  };
}

const CircleScore = ({ label, value }: CircleScoreProps) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="bg-white rounded-xl p-4 flex flex-col items-center shadow-sm w-40">
      <svg width="90" height="90">
        <circle
          cx="45"
          cy="45"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="45"
          cy="45"
          r={radius}
          stroke="#8b5cf6"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="text-lg font-semibold fill-gray-900"
        >
          {value}%
        </text>
      </svg>
      <p className="mt-2 text-sm font-medium text-gray-700">{label}</p>
    </div>
  );
};


const StatusIcon = ({ status }: StatusIconProps) => {
  if (status === "pass") return <span>✅</span>;
  if (status === "warning") return <span>⚠️</span>;
  return <span>❌</span>;
};

const Section = ({ title, data }: SectionProps) => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold flex items-center gap-2">
      {title} <StatusIcon status={data.status} />
    </h3>
    <p className="mt-2 text-gray-700">{data.summary}</p>

    {data.evidence && data.evidence.length > 0 && (
      <ul className="list-disc ml-6 mt-2 text-gray-600">
        {data.evidence.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )}
  </div>
);

interface SkillsAlignmentSectionProps {
  data: {
    status: "pass" | "warning" | "fail";
    matchedSkills: string[];
    missingRequiredSkills: string[];
    preferredSkillsMatched: string[];
    summary: string;
  };
}

const SkillsAlignmentSection = ({ data }: SkillsAlignmentSectionProps) => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold flex items-center gap-2">
      Skills Alignment <StatusIcon status={data.status} />
    </h3>
    <p className="mt-2 text-gray-700">{data.summary}</p>

    {data.matchedSkills.length > 0 && (
      <div className="mt-3">
        <h4 className="text-sm font-semibold text-gray-900">Matched Skills:</h4>
        <ul className="list-disc ml-6 mt-1 text-gray-600">
          {data.matchedSkills.map((skill: string, i: number) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>
    )}

    {data.missingRequiredSkills.length > 0 && (
      <div className="mt-3">
        <h4 className="text-sm font-semibold text-red-600">Missing Required Skills:</h4>
        <ul className="list-disc ml-6 mt-1 text-gray-600">
          {data.missingRequiredSkills.map((skill: string, i: number) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>
    )}

    {data.preferredSkillsMatched.length > 0 && (
      <div className="mt-3">
        <h4 className="text-sm font-semibold text-green-600">Preferred Skills Matched:</h4>
        <ul className="list-disc ml-6 mt-1 text-gray-600">
          {data.preferredSkillsMatched.map((skill: string, i: number) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

function JobDetailed({
  params,
}: JobDetailedProps) {
  const router = useRouter()
  const fileTypes = ["JPG", "PNG", "PDF"];
  const { jobData } = params
  const [upgraded, setUpgraded] = useState(false)
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [finalExtracted, setFinalExtracted] = useState<{ extractedText: string } | null>(null);
  const [finalAnalysis, setFinalAnalysis] = useState<JobFitAnalysis | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // ---------------- INTERVIEW ---------------------------
  const [interview, setInterview] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(4);
  const [brutalityLevel, setBrutalityLevel] = useState("");
  const [resume, setResume] = useState("");
  const [interviewer, setInterviewer] = useState(null);
  // ------------------------------------------------------

  const handleChange = (file: File | File[]) => {
    const fileToProcess = Array.isArray(file) ? file[0] : file;
    if (!fileToProcess) return;
    
    setFile(fileToProcess);
    extractText(fileToProcess)
  };

  async function extractText(file: File) {
    setIsExtracting(true);
    setFinalExtracted(null);
    pdfToText(file)
        .then((text: string) => {
          setText(text);
          setFinalExtracted({
            extractedText: text
          });
        })
        .catch((error: unknown) => {
          console.error("Failed to extract text from pdf", error);
        })
        .finally(() => {
          setIsExtracting(false);
        });
  }

  async function analyzeProfile() {
    if (!text) {
      console.error("No resume text available");
      return;
    }
    
    setIsAnalyzing(true);
    setFinalAnalysis(null);
    
    try {
      const res = await fetch("/api/jobFit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job: jobData,
          resume: text,
        }),
      });
    
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
      
      const data = await res.json();
      setFinalAnalysis(data.response)
    } catch (err) {
      console.error("Error sending POST request:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function createInterview() {
    const res = await fetch("/api/create-interview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
        body: JSON.stringify({ 
          job: jobData,
          resume: finalExtracted?.extractedText,
          num_questions: numberOfQuestions,
          brutality_level: brutalityLevel.length === 0 ? "2" : brutalityLevel
        })
    });
  
    if (!res.ok) {
      const errText = await res.text();
      console.error("GPT API error:", res.status, errText);
      throw new Error(`API error ${res.status}`);
    }
  
    const data = await res.json();
    if (data.error) {
      console.error("Error in generating system prompt: ", data.error)
    } else {
      const systemPrompt = data.response;
      // ==================================================================
      // -------------- NOW CREATING THE VOICE ASSISTANT ------------------
      // ==================================================================
      const res = await fetch("/api/create-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          name: "Avery",
          firstMessage: "Hey there. Welcome to the interview. Let's get started?",
          voiceID: "MnUw1cSnpiLoLhpd3Hqp",
          systemPrompt: systemPrompt
        })
      });
    
      if (!res.ok) {
        const errText = await res.text();
        console.error("GPT API error:", res.status, errText);
        throw new Error(`API error ${res.status}`);
      }
    
      const data2 = await res.json();
      if (data2.error) {
        console.error("Error in generating assistant: ", data2.error)
      } else {
        // The create-assistant route returns { assistant }, not { response: assistant }
        const interviewerCreated = data2.assistant;
        if (!interviewerCreated || !interviewerCreated.id) {
          console.error("Invalid assistant response:", data2);
          throw new Error("Failed to create assistant: invalid response");
        }
        router.push(`/interview/${interviewerCreated.id}`)
      }
    }
  }

  return (
    interview ? (
      <div className="flex items-center justify-center h-[80vh]">
        <div>
          <h1 className="text-2xl font-semibold">Choose your Interview Options</h1>
          <br/>
          <div className="bg-white p-6 rounded-lg flex items-center justify-center flex-col gap-3 w-[50vw] shadow-sm mb-2">
            <div className="flex items-center justify-between w-full mb-2">
              <h1>Number of Questions</h1>
              <input 
                value={numberOfQuestions} 
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))} 
                className="border rounded-sm p-1 px-3" 
                type="number"
                min="1"
                max="20"
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <h1>Brutality Level</h1>
              <select 
                className="w-[10vw]"
                value={brutalityLevel}
                onChange={(e) => setBrutalityLevel(e.target.value)}
              >
                <option value="">Select level</option>
                <option value="1">Light (1)</option>
                <option value="2">Medium (2)</option>
                <option value="3">Challenging (3)</option>
                <option value="4">Intense (4)</option>
                <option value="5">Brutal (5)</option>
              </select>
            </div>
          </div>
          <br/>
          <h3 className="mb-2">Select / Drop your Resume below</h3>
          <FileUploader 
            handleChange={handleChange} 
            name="file" 
            types={fileTypes}
            disabled={isExtracting}
          />
          <br/>
          <Button disabled={numberOfQuestions==0 || !finalExtracted} onClick={createInterview}>Create Interview <ArrowRight/></Button>
        </div>
      </div>
    ):(
      <div className='flex items-start justify-center'>
        <div className="mx-auto p-2 rounded-lg overflow-hidden flex-3/4">
          <div className='flex items-center justify-between p-4'>
            <div className='flex items-center gap-3'>
              <Button className='bg-white rounded-full border text-black hover:text-white' onClick={() => router.push("/")}><ArrowLeft/></Button>
              <h1 className='px-3 py-1 bg-[#A68BFA] text-white rounded-full'>{jobData.applicants} applicants</h1>
            </div>
            <div className='flex items-center gap-3'>
              <SquareArrowOutUpRight/>
              <Heart/>
              <Button>Apply Now <ArrowUpRight/></Button>
            </div>
          </div>
          {/* Header Section */}
          <div className="p-6 bg-white pb-4 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                {jobData.companyLogo && (
                  <Image 
                    src={jobData.companyLogo} 
                    alt={jobData.company}
                    className="w-12 h-12 rounded"
                  />
                )}
                <div>
                  <div className="text-xs text-gray-500 mb-1">{jobData.posted}</div>
                  <h1 className="text-xl font-semibold text-gray-900 mb-1">{jobData.title}</h1>
                  <div className="text-sm text-gray-600 mb-2">{jobData.company}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {jobData.location}
                    </span>
                    <span>•</span>
                    {/* Fix: Changed to use Clock icon and show applicants instead of duplicate posted date */}
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {jobData.applicants} applicants
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {jobData.workType}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full border-4 border-lime-400 bg-white">
                <div className="text-lg font-bold text-gray-900">{jobData.match}%</div>
                <div className="text-xs text-gray-600">Match</div>
              </div>
            </div>

            {/* Quick Info Tags */}
            <div className="flex items-center gap-6 text-xs text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                {jobData.details.skillsMatch}
              </span>
              <span className="flex items-center gap-1">
                {/* Fix: Changed to Clock icon to differentiate from workType */}
                <Clock className="w-3 h-3" />
                {jobData.details.employmentType}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {jobData.workType}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {jobData.details.level}
              </span>
            </div>

            {/* Job Description */}
            <div className="text-sm text-gray-700 leading-relaxed mb-6">
              {jobData.description}
            </div>

            {/* Interview Success Card */}
            <div className="bg-lime-300 rounded-lg p-5 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Image className="h-8 w-auto" src={maxInterviewSuccess} alt=""/>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Maximize your interview success</h3>
                  <p className="text-xs text-gray-700">
                    Our platform simulates real interview scenarios, helping you refine your responses and boost your confidence.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-xs text-gray-900 mb-1">Job-Specific Simulations:</h4>
                  <p className="text-xs text-gray-700">
                    Practice with questions tailored to your target role, ensuring relevance and preparation.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-gray-900 mb-1">Actionable Feedback:</h4>
                  <p className="text-xs text-gray-700">
                    Get detailed analysis of your responses and practical, step-by-step improvement suggestions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-gray-900 mb-1">Boost Success Rates:</h4>
                  <p className="text-xs text-gray-700">
                    Perfect your interview skills and increase your chances of landing the job you want.
                  </p>
                </div>
              </div>
              
              <Button onClick={() => setInterview(true)} className="rounded-full">
                Start Interview
              </Button>
            </div>

            {/* Qualification Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Qualification</h2>
              <p className="text-sm text-gray-700 mb-4">
                Discover how your skills align with the requirements of this position. Below is a detailed list of the essential skills needed for the role.
              </p>
              
              <h3 className="font-semibold text-gray-900 mb-3">Required</h3>
              <ul className="space-y-2 mb-4">
                {jobData.qualifications.required.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold text-gray-900 mb-3">Preferred</h3>
              <ul className="space-y-2">
                {jobData.qualifications.preferred.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Responsibilities Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h2>
              <ul className="space-y-3">
                {jobData.responsibilities.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h2>
              <p className="text-sm text-gray-700 mb-4">
                We believe happy team members create amazing work. Here's what we offer to make that happen:
              </p>
              <ul className="space-y-3">
                {jobData.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Company</h2>
              <div className="flex items-start gap-4">
                {jobData.companyLogo && <Image alt="" src={jobData.companyLogo} />}
                <div className="flex-1">
                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      Founded in {jobData.companyInfo.founded}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {jobData.companyInfo.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {jobData.companyInfo.employees}
                    </span>
                    <span>•</span>
                    <span className="text-blue-600 cursor-pointer hover:underline">
                      {jobData.companyInfo.website}
                    </span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <a href="#" className="w-6 h-6 bg-black rounded flex items-center justify-center text-white text-xs hover:bg-gray-800">
                      𝕏
                    </a>
                    <a href="#" className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs hover:bg-blue-700">
                      in
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {upgraded ? (
          <div className='w-1/4 pt-3'>
            <div className='bg-white rounded-lg min-h-screen p-7 flex items-center gap-10 flex-col flex items-center'>
              {isExtracting ? (
                <div className='text-center flex flex-col items-center gap-4'>
                  <Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6]" />
                  <h1 className='text-md font-semibold'>Extracting text from your resume...</h1>
                  <p className='text-sm text-gray-600'>Please wait while we process your PDF</p>
                </div>
              ) : isAnalyzing ? (
                <div className='text-center flex flex-col items-center gap-4'>
                  <Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6]" />
                  <h1 className='text-md font-semibold'>Analyzing job fit...</h1>
                  <p className='text-sm text-gray-600'>This may take a few moments</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-[#8b5cf6] h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              ) : finalExtracted && !finalAnalysis ? (
                <div className='text-center'>
                  <h1>Your resume has been read through.</h1><br/>
                  <Button 
                    onClick={analyzeProfile} 
                    disabled={isAnalyzing}
                    className='bg-[#B7FD33] text-black hover:bg-white hover:border hover:border-[#B7FD33] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Fit <SparklesIcon/>
                      </>
                    )}
                  </Button>
                </div>
              ): !finalExtracted && !finalAnalysis ?(
                <div className="max-w-[10vh]]">
                  <h1 className='text-md font-semibold'>Is this job a good fit for me?</h1>
                  <FileUploader 
                    handleChange={handleChange} 
                    name="file" 
                    types={fileTypes}
                    disabled={isExtracting}
                  />
                  <h3>Upload your resume and find out if you are a fit candidate</h3>
                </div>
              ) : finalAnalysis ? (
                <div className="max-w-full overflow-hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant={'secondary'}><ArrowUpLeft/>Expand</Button>
                    </SheetTrigger>
                    <SheetContent className="min-w-[50vw] overflow-scroll p-8">
                      <SheetHeader>
                        <SheetTitle>Job Fit Analysis</SheetTitle>
                        <SheetDescription>
                        </SheetDescription>

                        {/* Score Grid */}
                        <div className="flex items-center justify-center flex-wrap gap-3">
                          <CircleScore label="Education" value={finalAnalysis.scores.education} />
                          <CircleScore label="Work Exp" value={finalAnalysis.scores.workExperience} />
                          <CircleScore label="Skills" value={finalAnalysis.scores.skills} />
                          <CircleScore label="Exp. Level" value={finalAnalysis.scores.experienceLevel} />
                        </div>

                        <hr className="my-8" />

                        {/* Sections */}
                        <Section
                          title="Relevant Experience"
                          data={finalAnalysis.sections.relevantExperience}
                        />

                        <Section
                          title="Seniority"
                          data={finalAnalysis.sections.seniority}
                        />

                        <Section
                          title="Education"
                          data={finalAnalysis.sections.education}
                        />

                        <SkillsAlignmentSection
                          data={finalAnalysis.sections.skillsAlignment}
                        />

                        {finalAnalysis.strengths.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
                            <ul className="list-disc ml-6 mt-2 text-gray-600">
                              {finalAnalysis.strengths.map((strength: string, i: number) => (
                                <li key={i}>{strength}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {finalAnalysis.gaps.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-900">Gaps</h3>
                            <ul className="list-disc ml-6 mt-2 text-gray-600">
                              {finalAnalysis.gaps.map((gap: string, i: number) => (
                                <li key={i}>{gap}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Recommendation: {finalAnalysis.recommendation.verdict}
                          </h3>
                          <p className="text-gray-700">{finalAnalysis.recommendation.rationale}</p>
                        </div>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                  <br/><br/>
                  <h2 className="text-md font-semibold text-center">
                    Job Fit Analysis
                  </h2>

                  {/* Score Grid */}
                  <div className="flex items-center justify-center flex-wrap">
                    <CircleScore label="Education" value={finalAnalysis.scores.education} />
                    <CircleScore label="Work Exp" value={finalAnalysis.scores.workExperience} />
                    <CircleScore label="Skills" value={finalAnalysis.scores.skills} />
                    <CircleScore label="Exp. Level" value={finalAnalysis.scores.experienceLevel} />
                  </div>

                  <hr className="my-8" />

                  {/* Sections */}
                  <Section
                    title="Relevant Experience"
                    data={finalAnalysis.sections.relevantExperience}
                  />

                  <Section
                    title="Seniority"
                    data={finalAnalysis.sections.seniority}
                  />

                  <Section
                    title="Education"
                    data={finalAnalysis.sections.education}
                  />

                  <SkillsAlignmentSection
                    data={finalAnalysis.sections.skillsAlignment}
                  />

                  {finalAnalysis.strengths.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
                      <ul className="list-disc ml-6 mt-2 text-gray-600">
                        {finalAnalysis.strengths.map((strength: string, i: number) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {finalAnalysis.gaps.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900">Gaps</h3>
                      <ul className="list-disc ml-6 mt-2 text-gray-600">
                        {finalAnalysis.gaps.map((gap: string, i: number) => (
                          <li key={i}>{gap}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Recommendation: {finalAnalysis.recommendation.verdict}
                    </h3>
                    <p className="text-gray-700">{finalAnalysis.recommendation.rationale}</p>
                  </div>
                </div>
              ) : null}
            </div>
            <br/>
            <hr/>
          </div>
        ):(
          <div className='w-1/4 pt-3'>
            <div className='bg-white rounded-lg min-h-screen p-7 flex items-center gap-10 flex-col'>
              <h1 className='text-md font-semibold'>Is this job a good fit for me?</h1>
              <Image src={blurredFit} alt=''/>
              <Button onClick={() => setUpgraded(true)} className='bg-[#1F2937] rounded-full'>Upgrade to check</Button>
            </div>
          </div>
        )}
      </div>
    )
  )
}

export default JobDetailed