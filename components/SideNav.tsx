import Image from 'next/image'
import React from 'react'
import jobs from "@/public/navIcons/jobs.png"
import aimockinterview from "@/public/navIcons/aimockinterview.png"
import extraCredits from "@/public/navIcons/extraCredits.png"
import profile from "@/public/navIcons/profile.png"
import resume from "@/public/navIcons/resume.png"
import setting from "@/public/navIcons/setting.png"
import subscription from "@/public/navIcons/subscription.png"
import jobnova from "@/public/images/jobnova.png"
import { Button } from './ui/button'

const options = [
  [
    {
      name: "Jobs",
      icon: jobs
    },
    {
      name: "AI Mock Interview",
      icon: aimockinterview
    },
    {
      name: "Resume",
      icon: resume
    },
  ],
  [
    {
      name: "Profile",
      icon: profile
    },
    {
      name: "Setting",
      icon: setting
    }
  ],
  [
    {
      name: "Subscription",
      icon: subscription
    },
    {
      name: "Extra Credits",
      icon: extraCredits
    }
  ]
]

function SideNav() {
  return (
    <nav className='w-64 h-screen bg-white shadow-md p-6 flex flex-col'>
      <Image alt='' src={jobnova}/>
      <br/>
      <div className='flex-1'>
        {options.map((option, index) => (
          <div key={index} className='flex items-start justify-center gap-3 flex-col border-b border-gray-200 pb-4 mb-4 last:border-0'>
            {options[index].map((navElement, navIndex) => {
              const isActive = navElement.name === "Jobs"
              return (
                <div 
                  key={`${index}-${navIndex}-navelement`} 
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    isActive ? 'bg-[#ede9fe] text-[#7c3aed]' : 'hover:bg-gray-50'
                  }`}
                >
                  <Image 
                    className={`h-5 w-5 ${isActive ? 'invert-[0.5] sepia-[1] saturate-[3] hue-rotate-[250deg]' : 'opacity-70'}`} 
                    src={navElement.icon} 
                    alt={navElement.name}
                  />
                  <span className={`text-sm font-medium ${isActive ? 'text-[#7c3aed]' : 'text-gray-700'}`}>
                    {navElement.name}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Upgrade Your Plan Box */}
      <div className='purple-gradient text-white rounded-xl p-5 mt-4'>
        <h3 className='font-semibold mb-3 text-xl'>Upgrade Your Plan</h3>
        <p className='text-sm mb-4'>Boost your success rate now!</p>
        <Button variant={'secondary'} className='w-full rounded-full'>Subscription</Button>
      </div>
    </nav>
  )
}

export default SideNav