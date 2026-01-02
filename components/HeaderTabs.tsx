"use client"

interface HeaderTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  matchedJobsCount: number
  likedJobsCount: number
  appliedJobsCount: number
}

export default function HeaderTabs({
  activeTab,
  setActiveTab,
  matchedJobsCount,
  likedJobsCount,
  appliedJobsCount,
}: HeaderTabsProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1
            onClick={() => setActiveTab("Matched")}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-3 cursor-pointer rounded-lg ${
              activeTab === "Matched"
                ? "border border-[#7c3aed] text-black"
                : "text-gray-700 hover:bg-violet-600 hover:text-white"
            }`}
          >
            Matched 
            {activeTab != "Matched" && (
              <span className="px-2 py-0.5 min-w-[1.5rem] h-6 flex items-center justify-center bg-[#B7FD33] text-black rounded-full text-sm font-medium">
                {matchedJobsCount}
              </span>
            )}
          </h1>
          <h1 className="border border-neutral-300 h-8"></h1>
          <h1
            onClick={() => setActiveTab("Liked")}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-3 cursor-pointer rounded-lg ${
              activeTab === "Liked"
                ? "border border-[#7c3aed] text-black"
                : "text-gray-700 hover:bg-violet-600 hover:text-white"
            }`}
          >
            Liked 
            {activeTab != "Liked" && (
              <span className="px-2 py-0.5 min-w-[1.5rem] h-6 flex items-center justify-center bg-[#B7FD33] text-black rounded-full text-sm font-medium">
                {likedJobsCount}
              </span>
            )}
          </h1>
          <h1 className="border border-neutral-300 h-8"></h1>
          <h1
            onClick={() => setActiveTab("Applied")}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-3 cursor-pointer rounded-lg ${
              activeTab === "Applied"
                ? "border border-[#7c3aed] text-black"
                : "text-gray-700 hover:bg-violet-600 hover:text-white"
            }`}
          >
            Applied 
            {activeTab != "Applied" && (
              <span className="px-2 py-0.5 min-w-[1.5rem] h-6 flex items-center justify-center bg-[#B7FD33] text-black rounded-full text-sm font-medium">
                {appliedJobsCount}
              </span>
            )}
          </h1>
        </div>
      </div>
    </div>
  )
}

