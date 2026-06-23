import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Download,
  Wand2,
  BookOpen,
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
  Loader2
} from 'lucide-react'
import heroFlowers from './assets/hero-flowers.png'

function App() {
  // Navigation State: 'hero', 'ngo', 'admin', 'token'
  const [activeTab, setActiveTab] = useState('hero')
  
  // Interactive NGO State
  const [selectedSite, setSelectedSite] = useState('sundarbans')
  const [ngoSubmissions, setNgoSubmissions] = useState([
    { id: 1, site: 'Sundarbans Delta', date: '2026-06-12', area: 120.4, co2e: 15240, status: 'Verified', key: 'sundarbans' },
    { id: 2, site: 'Mahanadi Basin', date: '2026-06-18', area: 83.2, co2e: 9650, status: 'Verified', key: 'mahanadi' },
    { id: 3, site: 'Pichavaram Mangroves', date: '2026-06-22', area: 45.1, co2e: 4800, status: 'Pending', key: 'pichavaram' }
  ])

  // Interactive Admin State
  const [adminQueue, setAdminQueue] = useState([
    { id: 1, ngo: 'Mangrove Foundation', location: 'Krishna Estuary, AP', date: '2026-06-20', hectares: 65.0, co2e: 7150, status: 'Pending' },
    { id: 2, ngo: 'Oceanic Trust', location: 'Vembanad Lake, KL', date: '2026-06-21', hectares: 32.5, co2e: 3570, status: 'Pending' },
    { id: 3, ngo: 'EcoRestore India', location: 'Bhitarkanika, OD', date: '2026-06-23', hectares: 94.8, co2e: 10420, status: 'Pending' }
  ])
  const [totalSequestered, setTotalSequestered] = useState(1284950)

  // Interactive Token Verification State
  const [verifying, setVerifying] = useState(false)
  const [verificationStep, setVerificationStep] = useState(0)

  // Toast System
  const [toast, setToast] = useState(null)
  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  // Handle Token verification animation
  const startVerification = () => {
    setVerifying(true)
    setVerificationStep(1)
  }

  useEffect(() => {
    if (!verifying) return
    const timer = setInterval(() => {
      setVerificationStep((prev) => {
        if (prev >= 4) {
          clearInterval(timer)
          setVerifying(false)
          showToast('BCT Token successfully verified on-chain!')
          return 4
        }
        return prev + 1
      })
    }, 1200)
    return () => clearInterval(timer)
  }, [verifying])

  // Admin Accept/Flag Handlers
  const handleAdminAccept = (id, co2e, ngoName) => {
    setAdminQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Accepted' } : item))
    setTotalSequestered(prev => prev + co2e)
    showToast(`Approved restoration from ${ngoName}. Minted BCT credits!`)
  }

  const handleAdminFlag = (id, ngoName) => {
    setAdminQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Flagged' } : item))
    showToast(`Flagged submission from ${ngoName} for ground verification.`)
  }

  // NGO Action handlers
  const handleTransfer = () => {
    showToast('Initiating BCT transfer... Enter wallet recipient.')
  }
  const handleRetire = () => {
    showToast('Tokens retired. Generating Carbon Offset Certificate.')
  }

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden font-sans">
      
      {/* Background Video */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"
          type="video/mp4"
        />
      </video>

      {/* Global Interactive Notification Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-full liquid-glass-strong text-white border-none shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-3 text-xs font-semibold animate-bounce">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* --- HERO LANDING PAGE --- */}
      {activeTab === 'hero' && (
        <div className="relative z-10 flex flex-col lg:flex-row min-h-screen w-full animate-fade-in">
          
          {/* Left Panel */}
          <div className="relative w-full lg:w-[52%] flex flex-col min-h-screen p-4 lg:p-6">
            <div className="absolute inset-4 lg:inset-6 rounded-3xl liquid-glass-strong -z-10 pointer-events-none"></div>
            
            <div className="flex flex-col flex-1 p-6 lg:p-8 justify-between h-full">
              {/* Navigation */}
              <nav className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="CarbonTide Logo"
                    className="w-8 h-8 object-contain hover-scale"
                  />
                  <span className="text-2xl font-semibold tracking-tighter text-white">
                    CarbonTide
                  </span>
                </div>
                <button className="flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass text-xs font-medium text-white hover-scale">
                  <span>Menu</span>
                  <Menu className="w-3.5 h-3.5" />
                </button>
              </nav>

              {/* Hero Center */}
              <div className="flex flex-col items-center justify-center text-center py-12 lg:py-8 flex-1">
                <img
                  src="/logo.png"
                  alt="CarbonTide Logo Large"
                  className="w-20 h-20 object-contain mb-8 hover-scale"
                />
                <h1 className="text-5xl lg:text-7xl font-medium tracking-[-0.05em] text-white leading-[1.05] max-w-3xl">
                  Restoring the coast, <br />
                  <span className="font-serif italic text-white/80">verifying the future</span>
                </h1>
                
                <div className="mt-8 flex flex-col items-center gap-8">
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => setActiveTab('admin')}
                      className="flex items-center gap-3 px-6 py-2.5 rounded-full liquid-glass-strong text-white hover-scale text-sm font-medium"
                    >
                      <span>Explore Now</span>
                      <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                        <Download className="w-4 h-4 text-white" />
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('ngo')}
                      className="flex items-center gap-2 px-6 py-3 rounded-full liquid-glass text-white hover-scale text-sm font-medium"
                    >
                      <span>View Live Registry</span>
                      <ArrowRight className="w-4 h-4 text-white/80" />
                    </button>
                  </div>

                  {/* Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="px-4 py-2 rounded-full liquid-glass text-xs text-white/80 hover-scale cursor-pointer">
                      Field Reports
                    </span>
                    <span className="px-4 py-2 rounded-full liquid-glass text-xs text-white/80 hover-scale cursor-pointer">
                      Carbon Credits
                    </span>
                    <span className="px-4 py-2 rounded-full liquid-glass text-xs text-white/80 hover-scale cursor-pointer">
                      Drone Verify
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Quote */}
              <div className="w-full max-w-md mx-auto text-center flex flex-col items-center mt-auto">
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-semibold">
                  VISIONARY DESIGN
                </span>
                <p className="text-lg lg:text-xl font-normal text-white/90 my-3 leading-relaxed">
                  "Every <span className="font-serif italic text-white/80">mangrove planted</span> is a credit earned, a <span className="font-serif italic text-white/80">coastline saved</span>."
                </p>
                <div className="flex items-center justify-center gap-4 w-full">
                  <div className="h-[1px] flex-grow bg-white/10"></div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/50 font-medium whitespace-nowrap">
                    Team Arushti, BIOTHON 2026
                  </span>
                  <div className="h-[1px] flex-grow bg-white/10"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="hidden lg:flex lg:w-[48%] flex-col min-h-screen p-4 lg:p-6 justify-between relative">
            {/* Top Bar */}
            <div className="flex items-center justify-between w-full p-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full liquid-glass">
                <div className="flex items-center gap-3">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors hover-scale">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors hover-scale">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors hover-scale">
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
                <div className="h-4 w-[1px] bg-white/20"></div>
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover-scale cursor-pointer text-white">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-5 py-2 rounded-full liquid-glass text-xs text-white font-medium hover-scale">
                  Account
                </button>
                <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover-scale text-white">
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ecosystem Card */}
            <div
              onClick={() => setActiveTab('ngo')}
              className="w-64 p-5 rounded-2xl liquid-glass flex flex-col gap-2 mt-4 mr-4 self-end hover-scale cursor-pointer"
            >
              <h3 className="text-xs font-semibold text-white tracking-tight">
                Join the registry
              </h3>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Onboard as an NGO, panchayat, or field worker and start earning verified blue carbon credits.
              </p>
            </div>

            {/* Bottom Feature Section */}
            <div className="mt-auto w-full p-6 rounded-[2.5rem] liquid-glass flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {/* MRV Validation Card */}
                <div
                  onClick={() => setActiveTab('admin')}
                  className="p-5 rounded-3xl liquid-glass flex flex-col gap-3 hover-scale cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <Wand2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-white">MRV Validation</h4>
                    <p className="text-[10px] text-white/50 mt-1 leading-normal">
                      AI cross-validates drone imagery and field uploads before blockchain recording
                    </p>
                  </div>
                </div>

                {/* Carbon Ledger Card */}
                <div
                  onClick={() => setActiveTab('ngo')}
                  className="p-5 rounded-3xl liquid-glass flex flex-col gap-3 hover-scale cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-white">Carbon Ledger</h4>
                    <p className="text-[10px] text-white/50 mt-1 leading-normal">
                      Immutable on-chain record of every restoration site across India's coastline
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Card (BCT Credits -> goes to BCT Token Details) */}
              <div
                onClick={() => setActiveTab('token')}
                className="p-4 rounded-3xl liquid-glass flex items-center gap-4 hover-scale cursor-pointer"
              >
                <img
                  src={heroFlowers}
                  alt="BCT Credits Thumbnail"
                  className="w-24 h-16 object-cover rounded-xl"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-white truncate">
                    BCT Credits
                  </h4>
                  <p className="text-[10px] text-white/50 mt-0.5 leading-normal">
                    Smart contracts mint Blue Carbon Tokens for every verified hectare restored
                  </p>
                </div>
                <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center hover-scale text-white font-medium">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- NGO DASHBOARD VIEW --- */}
      {activeTab === 'ngo' && (
        <div className="relative z-10 min-h-screen w-full bg-[#050b18]/95 flex flex-col p-6 lg:p-10 animate-fade-in text-white">
          
          {/* Close button in top-right */}
          <div className="absolute top-6 right-6 z-50">
            <button
              onClick={() => setActiveTab('hero')}
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-white hover-scale shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* NGO Header */}
          <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-8">
            <img src="/logo.png" alt="CarbonTide Logo" className="w-10 h-10" />
            <div>
              <span className="text-[10px] tracking-[0.25em] text-teal-400 font-bold uppercase">NGO PORTAL</span>
              <h1 className="text-2xl font-medium tracking-tight mt-0.5">CarbonTide Blue Carbon Registry</h1>
            </div>
          </div>

          {/* NGO Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
            
            {/* Left Column: Metrics & Submissions Table (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* BCT Token Callout Card */}
              <div className="p-6 rounded-3xl liquid-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] tracking-[0.2em] text-white/50 uppercase font-semibold">Total Credits Earned</span>
                  <div className="text-4xl lg:text-5xl font-semibold tracking-tight text-white mt-1">
                    24,850 <span className="text-teal-400 font-serif italic text-3xl">BCT</span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">1 BCT = 1 Metric Ton of CO2e Sequestered</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleTransfer}
                    className="px-5 py-2.5 rounded-full liquid-glass text-xs font-semibold text-teal-300 border border-teal-500/20 hover-scale"
                  >
                    Transfer Credits
                  </button>
                  <button
                    onClick={handleRetire}
                    className="px-5 py-2.5 rounded-full bg-teal-500/20 hover:bg-teal-500/30 text-xs font-semibold text-teal-300 border border-teal-400/30 hover-scale"
                  >
                    Retire Credits
                  </button>
                </div>
              </div>

              {/* Submissions Table */}
              <div className="p-6 rounded-3xl liquid-glass flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-white/90">Recent Restoration Submissions</h3>
                  <span className="text-[10px] text-white/40">Last updated: Just now</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 font-medium">
                        <th className="pb-3">Site Location</th>
                        <th className="pb-3">Sub. Date</th>
                        <th className="pb-3">Area (Ha)</th>
                        <th className="pb-3">CO2e Value</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {ngoSubmissions.map((sub) => (
                        <tr
                          key={sub.id}
                          onClick={() => setSelectedSite(sub.key)}
                          className={`hover:bg-white/5 cursor-pointer transition-colors ${
                            selectedSite === sub.key ? 'bg-white/5' : ''
                          }`}
                        >
                          <td className="py-3.5 font-medium text-white">{sub.site}</td>
                          <td className="py-3.5 text-white/60">{sub.date}</td>
                          <td className="py-3.5 text-white/60">{sub.area} Ha</td>
                          <td className="py-3.5 text-teal-400 font-semibold">{sub.co2e} t</td>
                          <td className="py-3.5 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                sub.status === 'Verified'
                                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Column: Coastal Map View (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Interactive Coastline Map */}
              <div className="p-6 rounded-3xl liquid-glass flex-1 flex flex-col min-h-[380px]">
                <h3 className="text-sm font-semibold text-white/90 mb-4">India Coastline Project Pins</h3>
                
                {/* SVG Coast Map */}
                <div className="relative flex-1 bg-white/5 rounded-2xl flex items-center justify-center p-4 border border-white/5 overflow-hidden">
                  <svg viewBox="0 0 400 400" className="w-full h-full max-w-[320px]">
                    {/* Outline of Southern/Eastern India Peninsula Coastline */}
                    <path
                      d="M 120,40 C 130,120 120,180 140,240 C 150,270 170,300 200,320 C 215,335 220,340 220,335 C 220,335 225,290 235,270 C 250,230 270,200 310,190 C 330,185 340,175 350,170"
                      fill="none"
                      stroke="rgba(20, 184, 166, 0.3)"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 120,40 C 130,120 120,180 140,240 C 150,270 170,300 200,320 C 215,335 220,340 220,335 C 220,335 225,290 235,270 C 250,230 270,200 310,190 C 330,185 340,175 350,170"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.4)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="4 2"
                    />

                    {/* Sundarbans Pin */}
                    <g
                      className="cursor-pointer"
                      onClick={() => setSelectedSite('sundarbans')}
                    >
                      <circle
                        cx="325"
                        cy="185"
                        r="14"
                        className={`fill-teal-500/20 stroke-teal-400 stroke-2 ${
                          selectedSite === 'sundarbans' ? 'animate-ping' : ''
                        }`}
                      />
                      <circle cx="325" cy="185" r="5" className="fill-teal-400" />
                    </g>

                    {/* Mahanadi Basin Pin */}
                    <g
                      className="cursor-pointer"
                      onClick={() => setSelectedSite('mahanadi')}
                    >
                      <circle
                        cx="265"
                        cy="215"
                        r="14"
                        className={`fill-teal-500/20 stroke-teal-400 stroke-2 ${
                          selectedSite === 'mahanadi' ? 'animate-ping' : ''
                        }`}
                      />
                      <circle cx="265" cy="215" r="5" className="fill-teal-400" />
                    </g>

                    {/* Pichavaram Pin */}
                    <g
                      className="cursor-pointer"
                      onClick={() => setSelectedSite('pichavaram')}
                    >
                      <circle
                        cx="205"
                        cy="305"
                        r="14"
                        className={`fill-amber-500/20 stroke-amber-400 stroke-2 ${
                          selectedSite === 'pichavaram' ? 'animate-ping' : ''
                        }`}
                      />
                      <circle cx="205" cy="305" r="5" className="fill-amber-400" />
                    </g>
                  </svg>

                  {/* Floating Map Labels */}
                  <span className="absolute top-4 left-4 text-[10px] text-white/50">COASTLINE GRID SCALE (1:200,000)</span>
                  
                  {/* Miniature Detail Popup */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs">
                    {selectedSite === 'sundarbans' && (
                      <div>
                        <h4 className="font-semibold text-teal-300">Sundarbans Delta, WB</h4>
                        <p className="text-[10px] text-white/60 mt-0.5">120.4 Hectares Restored • 15,240 tons CO2e</p>
                      </div>
                    )}
                    {selectedSite === 'mahanadi' && (
                      <div>
                        <h4 className="font-semibold text-teal-300">Mahanadi Basin, OD</h4>
                        <p className="text-[10px] text-white/60 mt-0.5">83.2 Hectares Restored • 9,650 tons CO2e</p>
                      </div>
                    )}
                    {selectedSite === 'pichavaram' && (
                      <div>
                        <h4 className="font-semibold text-amber-300">Pichavaram Mangroves, TN</h4>
                        <p className="text-[10px] text-white/60 mt-0.5">45.1 Hectares Pending Verification • 4,800 tons CO2e</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* --- NCCR ADMIN PANEL VIEW --- */}
      {activeTab === 'admin' && (
        <div className="relative z-10 min-h-screen w-full bg-[#080b11] flex flex-row animate-fade-in text-white">
          
          {/* Close button in top-right */}
          <div className="absolute top-6 right-6 z-50">
            <button
              onClick={() => setActiveTab('hero')}
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-white hover-scale shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Left Sidebar Navigation */}
          <aside className="w-64 bg-[#0a0d16] border-r border-white/5 p-6 flex flex-col gap-8 hidden md:flex">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="CarbonTide Logo" className="w-7 h-7" />
              <span className="text-lg font-bold tracking-tight text-white">NCCR Admin</span>
            </div>
            
            <nav className="flex flex-col gap-2">
              <span className="text-[9px] tracking-widest text-white/30 font-semibold uppercase mb-2">REGISTRY SERVICES</span>
              <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 text-xs text-white text-left font-medium">
                <Wand2 className="w-4 h-4 text-emerald-400" />
                <span>Overview</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/5 text-left font-medium">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>Approval Queue</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/5 text-left font-medium">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Coastline Heatmap</span>
              </button>
            </nav>
            
            <div className="mt-auto p-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] text-white/40">
              Logged in as Govt of India NCCR Validator • Node-18
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <main className="flex-1 p-6 lg:p-10 flex flex-col gap-6 overflow-y-auto">
            
            {/* Top Bar Metrics */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-white/5">
              <div>
                <span className="text-[10px] tracking-[0.2em] text-emerald-400 uppercase font-semibold">Government Dashboard</span>
                <h1 className="text-2xl font-semibold mt-0.5">National Coastal Carbon Registry (NCCR)</h1>
              </div>

              {/* CO2e sequestration counter */}
              <div className="p-4 rounded-2xl liquid-glass flex flex-col text-right">
                <span className="text-[10px] text-white/40 font-medium">CO2e SEQUESTERED TO DATE</span>
                <span className="text-2xl lg:text-3xl font-extrabold text-emerald-400 tracking-tight mt-0.5">
                  {totalSequestered.toLocaleString()} Tons
                </span>
              </div>
            </div>

            {/* Middle Section: Heatmap (SVG) & Credit Issuance Line Graph (SVG) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Heatmap Section (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-3xl liquid-glass flex flex-col min-h-[300px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-semibold text-white/90">Coastal Restoration Heatmap</h3>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Restoration density</span>
                </div>
                
                {/* SVG Coast Map for Heatmap */}
                <div className="relative flex-1 bg-white/5 rounded-2xl flex items-center justify-center p-4 border border-white/5 overflow-hidden">
                  <svg viewBox="0 0 420 300" className="w-full h-full max-w-[420px]">
                    <path
                      d="M 50,50 C 90,140 80,180 120,220 C 140,240 180,260 210,270 C 235,275 250,280 250,275 C 250,275 260,230 280,200 C 300,170 320,150 380,140"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    
                    {/* Heatmap overlay glow lines */}
                    <path
                      d="M 50,50 C 90,140 80,180 120,220 C 140,240 180,260 210,270 C 235,275 250,280 250,275 C 250,275 260,230 280,200 C 300,170 320,150 380,140"
                      fill="none"
                      stroke="url(#heatmap-gradient)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      className="blur-[2px]"
                    />

                    {/* Glowing Heat Spots */}
                    {/* Gujarat (west) */}
                    <circle cx="90" cy="140" r="15" className="fill-emerald-500/20 blur-[3px]" />
                    <circle cx="90" cy="140" r="4" className="fill-emerald-400" />
                    
                    {/* Kerala (south-west) */}
                    <circle cx="210" cy="270" r="25" className="fill-teal-500/20 blur-[5px]" />
                    <circle cx="210" cy="270" r="6" className="fill-teal-400" />
                    
                    {/* Tamil Nadu (south-east) */}
                    <circle cx="250" cy="275" r="20" className="fill-emerald-500/25 blur-[4px]" />
                    <circle cx="250" cy="275" r="5" className="fill-emerald-400" />

                    {/* Sunderbans (east) */}
                    <circle cx="380" cy="140" r="30" className="fill-emerald-500/30 blur-[6px] animate-pulse" />
                    <circle cx="380" cy="140" r="8" className="fill-emerald-300" />

                    {/* Gradient Definitions */}
                    <defs>
                      <linearGradient id="heatmap-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#14b8a6" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Line Graph of Monthly Credit Issuance (5 cols) */}
              <div className="lg:col-span-5 p-6 rounded-3xl liquid-glass flex flex-col min-h-[300px]">
                <h3 className="text-xs font-semibold text-white/90 mb-4">Monthly Credit Issuance (BCT)</h3>
                
                {/* SVG Line Graph */}
                <div className="flex-1 bg-white/5 rounded-2xl flex flex-col p-4 border border-white/5">
                  <div className="flex-1 w-full relative">
                    <svg viewBox="0 0 300 150" className="w-full h-full">
                      {/* Grid Lines */}
                      <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                      <line x1="0" y1="75" x2="300" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                      <line x1="0" y1="120" x2="300" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                      
                      {/* Teal Line (Actual BCT Issuance) */}
                      <path
                        d="M 20,135 L 70,120 L 120,95 L 170,75 L 220,50 L 270,25"
                        fill="none"
                        stroke="#14b8a6"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      
                      {/* Green Line (Target/Projection) */}
                      <path
                        d="M 20,135 L 70,115 L 120,105 L 170,90 L 220,70 L 270,45"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="4 2"
                      />

                      {/* Interactive Data Dots (Teal) */}
                      <circle cx="20" cy="135" r="4.5" className="fill-teal-400 stroke-[#080b11] stroke-2" />
                      <circle cx="70" cy="120" r="4.5" className="fill-teal-400 stroke-[#080b11] stroke-2" />
                      <circle cx="120" cy="95" r="4.5" className="fill-teal-400 stroke-[#080b11] stroke-2" />
                      <circle cx="170" cy="75" r="4.5" className="fill-teal-400 stroke-[#080b11] stroke-2" />
                      <circle cx="220" cy="50" r="4.5" className="fill-teal-400 stroke-[#080b11] stroke-2" />
                      <circle cx="270" cy="25" r="5" className="fill-teal-400 stroke-[#080b11] stroke-2 animate-ping" />
                    </svg>
                  </div>
                  
                  {/* Graph Labels */}
                  <div className="flex justify-between text-[8px] text-white/40 pt-2 border-t border-white/5 mt-2">
                    <span>JAN</span>
                    <span>FEB</span>
                    <span>MAR</span>
                    <span>APR</span>
                    <span>MAY</span>
                    <span className="text-teal-400 font-bold">JUN (CURR)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Section: Approval Queue */}
            <div className="p-6 rounded-3xl liquid-glass">
              <h3 className="text-sm font-semibold text-white/90 mb-4">Pending Approval Queue</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 font-medium">
                      <th className="pb-3">Submitter (NGO)</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3">Sub. Date</th>
                      <th className="pb-3">Hectares</th>
                      <th className="pb-3">CO2e Value</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {adminQueue.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 font-medium text-white">{item.ngo}</td>
                        <td className="py-3.5 text-white/60">{item.location}</td>
                        <td className="py-3.5 text-white/60">{item.date}</td>
                        <td className="py-3.5 text-white/60">{item.hectares} Ha</td>
                        <td className="py-3.5 text-emerald-400 font-semibold">{item.co2e} t</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.status === 'Accepted'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : item.status === 'Flagged'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          {item.status === 'Pending' ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleAdminAccept(item.id, item.co2e, item.ngo)}
                                className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover-scale text-[10px] font-semibold border border-emerald-500/30"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleAdminFlag(item.id, item.ngo)}
                                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover-scale text-[10px] font-semibold border border-white/10"
                              >
                                Flag
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-white/40 italic">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </main>

        </div>
      )}

      {/* --- BCT TOKEN CARD VIEW --- */}
      {activeTab === 'token' && (
        <div className="relative z-10 min-h-screen w-full bg-black/80 flex items-center justify-center p-6 animate-fade-in">
          
          {/* Close button in top-right of screen */}
          <div className="absolute top-6 right-6 z-50">
            <button
              onClick={() => setActiveTab('hero')}
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-white hover-scale shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Web3 Token Detail Card */}
          <div className="w-full max-w-md p-6 rounded-3xl liquid-glass-strong border-none shadow-[0_0_30px_rgba(20,184,166,0.35)] flex flex-col gap-6 relative overflow-hidden">
            {/* Glossy overlay sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-teal-500/5 to-transparent pointer-events-none -z-10"></div>
            
            {/* Header: Crypto Token Branding */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="CarbonTide Logo" className="w-8 h-8" />
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-white">Blue Carbon Token</h2>
                  <span className="text-[9px] tracking-widest text-teal-400 font-bold uppercase">MINT DETAIL CARD</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-[10px] font-bold border border-teal-500/20">
                BCT-ERC1155
              </span>
            </div>

            {/* Token Card Specs List */}
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Token ID</span>
                <span className="text-white font-mono font-bold">BCT-IN-MNG-0824</span>
              </div>
              
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">GPS Coordinates</span>
                <span className="text-white font-semibold">21.9497° N, 89.1833° E</span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Restoration Area</span>
                <span className="text-white font-semibold">120.4 Hectares</span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">CO2e Value</span>
                <span className="text-teal-400 font-bold">15,240 Metric Tons</span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Mint Date</span>
                <span className="text-white font-semibold">June 14, 2026</span>
              </div>

              <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                <span className="text-white/40">NGO Wallet Address</span>
                <span className="text-white/80 font-mono text-[10px] break-all truncate">
                  0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-white/40">Blockchain Tx Hash</span>
                <span className="text-white/80 font-mono text-[10px] break-all truncate">
                  0x9e8a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7g
                </span>
              </div>
            </div>

            {/* Web3 Action Box */}
            <div className="pt-2">
              {verifying ? (
                <div className="w-full py-3 rounded-full bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-xs font-semibold text-white">
                  <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                  <span>
                    {verificationStep === 1 && 'Resolving GPS metadata...'}
                    {verificationStep === 2 && 'Retrieving oracle checks...'}
                    {verificationStep === 3 && 'Verifying consensus nodes...'}
                    {verificationStep === 4 && 'Complete!'}
                  </span>
                </div>
              ) : (
                <button
                  onClick={startVerification}
                  className="w-full py-3 rounded-full bg-teal-500/25 hover:bg-teal-500/35 text-teal-300 border border-teal-500/30 flex items-center justify-center gap-2 text-xs font-semibold hover-scale"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify on chain</span>
                </button>
              )}
              
              <div className="flex justify-center items-center gap-1.5 mt-4 text-[10px] text-white/30">
                <span>View ledger metadata</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default App
