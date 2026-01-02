import jobs from '@/lib/data/jobs'
import { StaticImageData } from 'next/image'
import { notFound } from 'next/navigation'
import JobDetailed from '@/components/ui/Job/JobDetailed'

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

async function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  const jobData = jobs.find(job => job.id === parseInt(jobId))
  if (!jobData) {
    notFound()
  }
  
  return (
    <div>
      <JobDetailed params={{ jobData }} />
    </div>
  )
}

export default Page