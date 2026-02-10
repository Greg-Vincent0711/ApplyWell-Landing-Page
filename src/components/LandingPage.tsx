import React, { useState } from 'react';
import BenefitItem from './BenefitItem';
import { Briefcase, ShieldCheck, CheckCircle2, ArrowRight, CircleQuestionMark } from 'lucide-react';
export function LandingPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  // protection against bots
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // simple rate limiting
    const now = Date.now();
    if (now - lastSubmitTime < 5000) {
      setStatus('error');
      setErrorMessage('Please wait before submitting again.');
      return;
    }
    setLastSubmitTime(now);

    if (honeypot) {
      return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setErrorMessage('');
  
    try {
      /**
       * waitlist-key is a small deterrent against bots
       * this landing page is meant to be simplistic and doesn't have anything
       * very sensitive on it
       */
      const url = import.meta.env.VITE_WEBHOOK_URL
      console.log("URL before the fetch call", url)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'waitlist-key': import.meta.env.VITE_HEADER
        },
        body: JSON.stringify({ 
          email: email,
          website: honeypot
        })
      });      
      // console.log(response)
      if (response.status === 200) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Unable to connect. Please try again later.');
      console.error('Error:', error);
    } finally{
      setTimeout(() => {
        setErrorMessage("")
        if(status != "success"){
          setStatus("idle")
        }
      }, 6000)
    }
  };
  
  // SVG Pattern for background - subtle briefcase/document icons
  const backgroundPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 7h-4V4c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v3H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zM10 4h4v3h-4V4z' fill='%23111827' opacity='0.03'/%3E%3C/svg%3E")`;
  return <div className="min-h-screen w-full bg-white text-gray-900 font-sans selection:bg-orange-100 selection:text-orange-900" style={{
    backgroundImage: backgroundPattern
  }}>
      <main className="max-w-3xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-600 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 mr-2"></span>
            Join the Waitlist
          </div> */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Apply effectively with AI that knows when to{' '}
            <span className="text-gray-400">step back.</span>
          </h1>
          
          {/** Supporting headline */}
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-lg mx-auto leading-relaxed text-center">
            From software developers who hate mass-applying.
            LLMs can speed up job applications — but they shouldn't turn your resume into a generic template.
            We're covering that gap.
          </p>
        </div>

        {/** If someone sends an email for submission */}
        <div className="w-full max-w-md mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          {status === 'success' ? <div className="bg-green-50 border border-green-200 rounded-xl p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Thanks for joining our waitlist! Reply "unsubscribe" to any email you recieve from us to opt-out.
              </h3>
              <p className="text-gray-600 mt-2">
                Keep an eye on your inbox(and the spam folder) for emails about our product. 
              </p>
              <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-gray-500 hover:text-gray-900 underline underline-offset-4">
                Add another email
              </button>
              {/** default input field and waitlist button */}
            </div> : (
            <form onSubmit={handleSubmit} className="relative group">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  {/** 254 matches most email providers and standards */}
                  <input type="email" maxLength={254} value={email} onChange={e => { 
                      setEmail(e.target.value);
                      if (status === 'error'){
                        setStatus('idle');
                      }
                    }} 
                    placeholder="janedoe@gmail.com" 
                    className={`w-full px-6 py-4 bg-white border-2 rounded-xl text-lg outline-none transition-all duration-200 placeholder:text-gray-400
                      ${status === 'error' ? 'border-red-300 focus:border-red-500 text-red-900' : 'border-gray-200 focus:border-orange-500 hover:border-gray-300'}
                      shadow-sm focus:shadow-lg focus:shadow-orange-500/10
                      `} 
                    disabled={status === 'loading'} />
                  {status === 'error' && <div className=" -bottom-6 left-0 flex items-center text-xs text-red-500 font-medium animate-in slide-in-from-top-1">
                      {errorMessage}
                    </div>}
                </div>
                <button type="submit" disabled={status === 'loading'} className="px-8 py-4 bg-[#FF6B35] hover:bg-[#E85A2D] active:bg-[#D64D23] text-white text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center min-w-[160px]"> {/** holy class name o_O */}
                  {status === 'loading' ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                    <>
                      Join the Waitlist
                      <ArrowRight size={18} className="ml-2 opacity-80" />
                    </>
                    )
                  }
                </button>
              </div>
              {/** tabIndex of -1 means this element is unfocusable */}
              <input
                type="text"
                name="website-helper"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'None', position: 'absolute'}}
                tabIndex={-1}
                autoComplete="off"
              />
            </form>) 
            }
        </div>

        {/* Benefits Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <BenefitItem icon={<Briefcase className="text-gray-700" size={24} />} title="Automate your Applications Effectively" description="Remove the time-wasting, soul-crushing busy work portion that is mass-appyling for jobs. We're looking at you, Greenhouse and Workday." />
          <BenefitItem icon={<ShieldCheck className="text-gray-700" size={24} />} title="Maintain Control and Quality" description="Use AI as it was meant to be used - as a tool, not a replacement for your experience. You are always in the loop fact checking LLM output with ApplyWell." />
          <BenefitItem icon={<CircleQuestionMark className="text-gray-700" size={24} />} title="Unsure about a role you might be qualified for?" description="We got you covered. You'll recieve instant analysis before you apply - now you know for sure if that one role you keep eyeing is worth it or not." />
        </div>
      </main>
    </div>;
}
