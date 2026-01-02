'use client'
import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { MicOff } from 'lucide-react';
import { toast } from 'sonner';

type TranscriptMessage = {
  role: string;
  text: string;
};

interface VapiWidgetProps {
  apiKey: string;
  assistantId: string;
  config?: Record<string, unknown>;
  onCallEnd: (transcript: TranscriptMessage[]) => void;
}

const VapiWidget: React.FC<VapiWidgetProps> = ({ 
  apiKey,
  assistantId, 
  onCallEnd,
  config = {} 
}) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [whoIsSpeaking, setWhoIsSpeaking] = useState<'user' | 'assistant' | null>(null);
  const [transcript, setTranscript] = useState<Array<{role: string, text: string}>>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const transcriptRef = useRef(transcript);

  useEffect(() => {
    // Replace MockVapi with: const vapiInstance = new Vapi(apiKey);
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);

    console.log(vapiInstance)

    vapiInstance.on('call-start', () => {
      setIsConnected(true);
    });

    vapiInstance.on('call-end', () => {
      setIsConnected(false);
      setIsSpeaking(false);
      setWhoIsSpeaking(null);
      console.log("Call ended. Sending transcript:", transcriptRef.current);
      onCallEnd(transcriptRef.current);
    });

    vapiInstance.on('speech-start', () => {
      // console.log("Bro is speaking");
      setIsSpeaking(true);
      setWhoIsSpeaking('user'); // User is speaking
    });

    vapiInstance.on('speech-end', () => {
      // console.log("Bro stopped speaking");
      setIsSpeaking(false);
      setWhoIsSpeaking(null);
    });

    vapiInstance.on('message', (message: any) => {
      if (message.type === 'transcript') {
        setTranscript(prev => [...prev, {
          role: message.role,
          text: message.transcript
        }]);
        
        // Set who is speaking based on the message role
        if (message.role === 'assistant') {
          setWhoIsSpeaking('assistant');
        }
      }
    });

    vapiInstance.on('error', (error: any) => {
      console.error('Vapi error:', error);
    });

    return () => {
      vapiInstance?.stop();
    };
  }, [apiKey]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const startCall = () => {
    toast("Starting call...");
    vapi?.start(assistantId);
  };

  const endCall = () => {
    vapi?.stop();
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="h-[90vh] bg-white text-gray-900 font-sans flex flex-col relative">
      {/* Main video area */}
      <div className="flex-1 flex gap-2 p-4 relative">
        {/* Assistant video panel */}
        <div className={`flex-1 bg-gray-50 rounded-xl relative flex flex-col justify-center items-center border-2 ${
          whoIsSpeaking === 'assistant' ? 'border-blue-500' : 'border-gray-300'
        }`}>
          {/* Status indicator */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-3 py-1 rounded-2xl text-xs text-gray-700 shadow-sm">
            {whoIsSpeaking === 'assistant' ? 'Currently Speaking' : 'Not speaking'}
          </div>

          {/* Avatar */}
          <div className="w-30 h-30 rounded-full bg-yellow-400 flex items-center justify-center mb-4 bg-cover">
            <span className="text-5xl font-bold text-gray-800">
              🤖
            </span>
          </div>

          {/* Name */}
          <div className="absolute bottom-4 left-4 text-base font-medium text-gray-700">
            Bob - Your Interviewer
          </div>
        </div>

        {/* User video panel */}
        <div className={`flex-1 bg-gray-50 rounded-xl relative flex flex-col justify-center items-center border-2 ${
          whoIsSpeaking === 'user' ? 'border-blue-500' : 'border-gray-300'
        }`}>
          {/* User avatar */}
          <div className="w-30 h-30 rounded-full bg-blue-500 flex items-center justify-center mb-4">
            <span className="text-5xl font-bold text-white">
              S
            </span>
          </div>

          {/* Name */}
          <div className="absolute bottom-4 left-4 text-base font-medium text-gray-700">
            You: Shashwat Mahalanobis
          </div>
        </div>

        {/* Transcript panel */}
        {showTranscript && (
          <div className="absolute top-4 right-4 w-80 h-full bg-white rounded-xl p-4 shadow-lg border border-gray-200 z-10">
            <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
              <h3 className="m-0 text-base text-gray-900">Transcript</h3>
              <button
                onClick={() => setShowTranscript(false)}
                className="bg-transparent border-none text-gray-600 cursor-pointer text-xl hover:opacity-70"
              >
                ×
              </button>
            </div>
            
            <div className="h-full overflow-y-auto scrollbar-thin">
              {transcript.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Conversation will appear here...
                </p>
              ) : (
                transcript.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`mb-3 p-2 rounded-lg text-sm ${
                      msg.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="font-bold mb-1 text-xs opacity-80">
                      {msg.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <div>{msg.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200">
        {/* Time and call info */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{getCurrentTime()}</span>
          <span>|</span>
          <span>Call</span>
        </div>

        {/* Center controls */}
        <div className="flex gap-2 items-center">
          <Button
            onClick={isConnected ? endCall : startCall}
            className={`${
              isConnected ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-500 text-white hover:bg-blue-600'
            } border-none rounded-lg px-6 py-3 text-sm font-medium cursor-pointer flex items-center gap-2 transition-transform duration-200 hover:scale-105`}
          >
            {isConnected ? 'End Call' : 'Start Call'}
          </Button>
          {vapi && vapi.isMuted() ? (
            <Button 
              className="bg-gray-200 text-gray-700 hover:bg-gray-300" 
              variant="outline"
              onClick={() => vapi.setMuted(false)}
            >
              <MicOff />
            </Button>
          ) : (
            <Button 
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              variant="outline"
              onClick={() => vapi?.setMuted(true)}
            >
              <Mic />
            </Button>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className={`${
              showTranscript ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            } border-none rounded-lg px-4 py-2 text-xs cursor-pointer flex items-center gap-2 hover:opacity-80 transition-colors`}
          >
            <span className="text-base">📝</span>
            Open Transcript
          </button>
        </div>
      </div>
    </div>
  );
};

export default VapiWidget;