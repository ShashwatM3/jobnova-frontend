"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import HeaderTabs from "./HeaderTabs"

interface HeaderTabsContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
  matchedJobsCount: number
  setMatchedJobsCount: (count: number) => void
  likedJobsCount: number
  setLikedJobsCount: (count: number) => void
  appliedJobsCount: number
  setAppliedJobsCount: (count: number) => void
}

const HeaderTabsContext = createContext<HeaderTabsContextType | undefined>(undefined)

export function useHeaderTabs() {
  const context = useContext(HeaderTabsContext)
  if (!context) {
    throw new Error("useHeaderTabs must be used within HeaderTabsProvider")
  }
  return context
}

interface HeaderTabsProviderProps {
  children: ReactNode
}

export function HeaderTabsProvider({ children }: HeaderTabsProviderProps) {
  const [activeTab, setActiveTab] = useState("Matched")
  const [matchedJobsCount, setMatchedJobsCount] = useState(0)
  const [likedJobsCount, setLikedJobsCount] = useState(0)
  const [appliedJobsCount, setAppliedJobsCount] = useState(0)

  return (
    <HeaderTabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        matchedJobsCount,
        setMatchedJobsCount,
        likedJobsCount,
        setLikedJobsCount,
        appliedJobsCount,
        setAppliedJobsCount,
      }}
    >
      <div className="flex-1 flex flex-col bg-gray-100 min-h-screen">
        <HeaderTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          matchedJobsCount={matchedJobsCount}
          likedJobsCount={likedJobsCount}
          appliedJobsCount={appliedJobsCount}
        />
        {children}
      </div>
    </HeaderTabsContext.Provider>
  )
}

