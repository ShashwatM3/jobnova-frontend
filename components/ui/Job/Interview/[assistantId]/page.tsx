import { notFound } from 'next/navigation'
import VapiWidget from '../../VapiWidget'

type TranscriptMessage = {
  role: string;
  text: string;
};

async function Page({ params }: { params: Promise<{ assistantId: string }> }) {
  const { assistantId } = await params
  if (!assistantId) {
    notFound()
  }

  const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_API_KEY;
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_VAPI_PUBLIC_API_KEY is not set');
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