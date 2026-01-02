import { StaticImageData } from "next/image"
import backd from "@/public/images/backd.png"
import cursor from "@/public/images/cursor.png"
import simons from "@/public/images/simons.png"

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

const jobs: Job[] = [
  {
    id: 1,
    title: "Web Application Developer",
    company: "Backd Business Funding",
    location: "Austin, Texas Metropolitan Area",
    workType: "On-site",
    match: 64,
    details: {
      employmentType: "Full time",
      skillsMatch: "0 of 3 skills match",
      level: "Mid Level",
      salary: "$65K/yr - $70K/yr"
    },
    posted: "1 hours ago",
    applicants: 25,
    liked: false,
    companyLogo: backd,
    description: "Job description for Web Application Developer role. Responsibilities include developing and maintaining web applications, collaborating with cross-functional teams, and implementing responsive design solutions.",
    qualifications: {
      required: [
        "3+ years of web development experience",
        "Proficiency in HTML, CSS, and JavaScript",
        "Experience with modern web frameworks",
        "Strong problem-solving skills"
      ],
      preferred: [
        "Experience with React or Angular",
        "Knowledge of backend technologies",
        "Familiarity with agile methodologies"
      ]
    },
    responsibilities: [
      "Design and develop web applications",
      "Collaborate with designers and backend developers",
      "Ensure application performance and responsiveness",
      "Write clean, maintainable code"
    ],
    benefits: [
      "Health insurance",
      "401(k) matching",
      "Professional development opportunities",
      "Flexible work arrangements"
    ],
    companyInfo: {
      name: "Backd Business Funding",
      founded: "2015",
      location: "Austin, Texas, US",
      employees: "51-200 employees",
      website: "https://backd.com"
    }
  },
  {
    id: 2,
    title: "Software Engineer, Network Infrastructure",
    company: "Cursor AI",
    location: "Sunnyvale, CA",
    workType: "On-site",
    match: 93,
    details: {
      employmentType: "Full time",
      skillsMatch: "5+ years exp",
      level: "Mid Level",
      salary: "$161K/yr - $239K/yr"
    },
    posted: "2 hours ago",
    applicants: 25,
    liked: true,
    companyLogo: cursor,
    description: "Join our team to build and scale network infrastructure for next-generation AI-powered development tools. Work on cutting-edge technology that impacts millions of developers worldwide.",
    qualifications: {
      required: [
        "5+ years of network engineering experience",
        "Strong understanding of TCP/IP, DNS, and load balancing",
        "Experience with cloud infrastructure (AWS, GCP, or Azure)",
        "Proficiency in Python or Go"
      ],
      preferred: [
        "Experience with Kubernetes and containerization",
        "Knowledge of CDN technologies",
        "Background in distributed systems"
      ]
    },
    responsibilities: [
      "Design and implement scalable network infrastructure",
      "Monitor and optimize network performance",
      "Collaborate with engineering teams on infrastructure needs",
      "Troubleshoot and resolve network issues",
      "Implement security best practices"
    ],
    benefits: [
      "Competitive salary and equity",
      "Comprehensive health coverage",
      "Unlimited PTO",
      "Remote work options",
      "Learning and development budget"
    ],
    companyInfo: {
      name: "Cursor AI",
      founded: "2022",
      location: "Sunnyvale, California, US",
      employees: "11-50 employees",
      website: "https://cursor.ai"
    }
  },
  {
    id: 3,
    title: "Full-Stack Software Engineer (Web Developer)",
    company: "Simons Foundation",
    location: "New York, NY",
    workType: "On-site",
    match: 82,
    details: {
      employmentType: "Full time",
      skillsMatch: "5+ years exp",
      level: "Mid Level",
      salary: "$125K/yr - $140K/yr"
    },
    posted: "2 hours ago",
    applicants: 25,
    liked: false,
    companyLogo: simons,
    description: "The Simons Foundation seeks a talented Full-Stack Software Engineer to develop web applications supporting scientific research initiatives. Work on meaningful projects that advance science and mathematics.",
    qualifications: {
      required: [
        "5+ years of full-stack development experience",
        "Expertise in React and Node.js",
        "Experience with relational databases (PostgreSQL, MySQL)",
        "Strong understanding of RESTful APIs",
        "Bachelor's degree in Computer Science or related field"
      ],
      preferred: [
        "Experience in scientific or research environments",
        "Knowledge of data visualization libraries",
        "Familiarity with Python/Django",
        "Experience with AWS services"
      ]
    },
    responsibilities: [
      "Develop and maintain full-stack web applications",
      "Collaborate with scientists and researchers to understand requirements",
      "Design and implement database schemas",
      "Write clean, well-documented code",
      "Participate in code reviews and technical discussions",
      "Optimize application performance and user experience"
    ],
    benefits: [
      "Comprehensive health, dental, and vision insurance",
      "Generous PTO and holiday schedule",
      "401(k) with employer match",
      "Professional development opportunities",
      "Transit benefits",
      "Collaborative and mission-driven work environment"
    ],
    companyInfo: {
      name: "Simons Foundation",
      founded: "1994",
      location: "New York, New York, US",
      employees: "201-500 employees",
      website: "https://www.simonsfoundation.org"
    }
  }
];

export default jobs