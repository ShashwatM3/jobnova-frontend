'use client'

import { notFound, useParams } from 'next/navigation'
import VapiWidget from '@/components/ui/Job/VapiWidget'

type TranscriptMessage = {
  role: string;
  text: string;
};

function Page() {
  const params = useParams()
  const assistantId = params?.assistantId as string

  // NEXT_PUBLIC_ env vars are available directly in Client Components
  const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_API_KEY;

  if (!assistantId) {
    notFound()
  }

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: NEXT_PUBLIC_VAPI_PUBLIC_API_KEY is not set</p>
      </div>
    )
  }

  function analyzeInterview(transcript: TranscriptMessage[]) {
    // Convert transcript array to a readable format
    const transcriptText = transcript
      .map(msg => `${msg.role}: ${msg.text}`)
      .join('\n');
    console.log('Interview transcript:', transcriptText);
    // TODO: Add analysis logic here (e.g., send to API for evaluation)
  }
  
  return (
    <div>
      <VapiWidget 
        apiKey={apiKey} 
        assistantId={assistantId} 
        onCallEnd={analyzeInterview}
      />
    </div>
  )
}

export default Page

