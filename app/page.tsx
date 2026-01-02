"use client"

import { useState } from "react"
import { RefreshCw, Search, ExternalLink, Heart, Sparkles, Inspect, BookSearchIcon } from "lucide-react"
import Image, { StaticImageData } from "next/image"
import { Button } from "@/components/ui/button"
import sparkles1 from '@/public/images/sparkles1.png'
import sparkles2 from '@/public/images/sparkles2.png'
import mockInterview from '@/public/images/mockInterview.png'
import JobCard from "@/components/ui/Job/JobCard"
import { useHeaderTabs } from "@/components/HeaderTabsProvider"
import { useEffect } from "react"
import jobs from "@/lib/data/jobs"

export default function Home() {
  const { activeTab, setActiveTab, setMatchedJobsCount, setLikedJobsCount, setAppliedJobsCount } = useHeaderTabs()
  const [likedJobs, setLikedJobs] = useState<number[]>(jobs.filter(j => j.liked).map(j => j.id))
  const [appliedJobs] = useState<number[]>([1])
  const [matchedJobs] = useState<number[]>(jobs.map(j => j.id))

  // Sync counts with header tabs
  useEffect(() => {
    setMatchedJobsCount(matchedJobs.length)
    setLikedJobsCount(likedJobs.length)
    setAppliedJobsCount(appliedJobs.length)
  }, [matchedJobs.length, likedJobs.length, appliedJobs.length, setMatchedJobsCount, setLikedJobsCount, setAppliedJobsCount])

  const toggleLike = (jobId: number) => {
    setLikedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const getMatchColor = (match: number) => {
    if (match >= 80) return "bg-green-500"
    if (match >= 60) return "bg-yellow-500"
    return "bg-orange-500"
  }

  return (
    <>
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Job Listings Section */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 mb-6">
            <Button className="flex items-center justify-center gap-3 bg-[#A68BFA] text-white flex-1 rounded-full hover:text-white hover:bg-violet-500 cursor-pointer">
              <RefreshCw className="h-4 w-4" />
              Change Job Reference
            </Button>
            <Button className="rounded-full bg-white text-black hover:text-white flex items-center justify-center gap-2">
              <BookSearchIcon className="h-4 w-4" />
              Top matched
            </Button>
          </div>

          {/* Job Cards */}
          <div className="space-y-4 flex items-start gap-3 flex-col h-[80vh] overflow-scroll w-full">
            {jobs.map((job) => {
              const isLiked = likedJobs.includes(job.id)
              return (
                <JobCard 
                  key={job.id}
                  job={job} 
                  isLiked={isLiked}
                  onToggleLike={toggleLike}
                />
              )
            })}
          </div>
        </div>

        {/* Right Sidebar - AI Mock Interview Promotion */}
        <div className="w-80 h-fit p-4">
          <div className="border radial-gradient bg-white rounded-lg border-gray-200 p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                <Image src={sparkles1} alt="" className="h-10 w-auto text-[#7c3aed]" /><br/>
                Ace Your Interviews with AI-Powered Mock Sessions!
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Struggling with interview nerves or unsure how to prepare? Let our cutting-edge AI mock interviews help you shine!
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                Why Choose Our AI Mock Interviews?
                <Image src={sparkles2} alt="" className="h-7 w-auto text-[#7c3aed]" />
              </h3>
              <ul className="space-y-4">
                <li className="text-sm text-gray-700">
                  <span className="font-semibold">Job-Specific Simulations:</span> Practice with questions tailored to your target role, ensuring relevance and preparation.
                </li>
                <li className="text-sm text-gray-700">
                  <span className="font-semibold">Actionable Feedback:</span> Get detailed analysis of your responses and practical, step-by-step improvement suggestions.
                </li>
                <li className="text-sm text-gray-700">
                  <span className="font-semibold">Boost Success Rates:</span> Perfect your interview skills and increase your chances of landing the job you want.
                </li>
              </ul>
            </div>

            <Button className="w-full py-5 rounded-full">
              <Image alt="" src={mockInterview} className="h-5 w-5" />
              Mock Interview
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
