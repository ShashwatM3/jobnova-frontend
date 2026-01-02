import { ExternalLink, Heart } from 'lucide-react'
import Image, { StaticImageData } from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

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

interface JobCardProps {
  job: Job
  isLiked: boolean
  onToggleLike: (jobId: number) => void
}

function JobCard({ job, isLiked, onToggleLike }: JobCardProps) {
  const getMatchColor = (match: number) => {
    if (match >= 80) return "bg-green-500"
    if (match >= 60) return "bg-yellow-500"
    return "bg-orange-500"
  }
  const router = useRouter()
  return (
    <div
      key={job.id}
      className="bg-white w-full rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      onClick={() => router.push(`/jobs/${job.id}`)}
    >
      <div className="flex gap-6 mb-4">
        {/* Match Percentage Circle */}
        <div className="flex-shrink-0">
          <div
            className={`w-20 h-20 rounded-full ${getMatchColor(job.match)} flex items-center justify-center text-white font-bold text-lg`}
          >
            {job.match}%
          </div>
          <div className="text-center mt-2 text-xs text-gray-500">Match</div>
        </div>

        {/* Job Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {job.title}
                </h2>
              <div className="flex items-center gap-2 mb-2">
                {job.companyLogo && <Image className="h-5 w-auto" src={job.companyLogo} alt=""/>}
                <p className="text-gray-400">{job.company}</p>
              </div>
              <div className="flex items-start gap-5 mb-4">
                <p className="text-sm text-gray-500">{job.location}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                      />
                    </svg>
                    {job.workType}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ExternalLink className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => onToggleLike(job.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isLiked ? "fill-[#7c3aed] text-[#7c3aed]" : "text-gray-600"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
        <span className="p-1 px-3 border rounded-full">{job.details.employmentType}</span>
        <span className="p-1 px-3 border rounded-full">{job.details.skillsMatch}</span>
        <span className="p-1 px-3 border rounded-full">{job.details.level}</span>
        <span className="p-1 px-3 border rounded-full">{job.details.salary}</span>
      </div>
      <hr className="mb-4"/>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
          <h1 className="p-1 bg-[#734AE21F] text-black rounded-full px-3">{job.posted}</h1>
          <h1 className="p-1 text-black rounded-full">{job.applicants} applicants</h1>
        </div>
        <div className="flex gap-3">
          <Button variant={'ghost'} className="border rounded-full">
            Apply
          </Button>
          <Button variant={'secondary'} className="bg-[#B9FD33] rounded-full">
            Mock Interview
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JobCard