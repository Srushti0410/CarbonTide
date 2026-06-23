import React, { useState, useEffect } from 'react'
import {
  Leaf,
  Users,
  Shield,
  ArrowRight,
  Upload,
  Database,
  LogOut,
  Compass,
  MapPin,
  Activity,
  FileText,
  X,
  ExternalLink,
  CheckCircle,
  Loader2,
  Menu,
  WifiOff,
  TrendingUp,
  Sparkles,
  Twitter,
  Linkedin,
  Instagram,
  Download,
  Wand2,
  BookOpen,
  Info,
  Clock,
  Check,
  Globe
} from 'lucide-react'
import heroFlowers from './assets/hero-flowers.png'

// Spotlight Card with cursor spotlight glow
function SpotlightCard({ children, className = '', onClick, ...props }) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`spotlight-card ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Magnetic Button with smooth Spring-like pull
function MagneticButton({ children, className = '', onClick, ...props }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35
    setCoords({ x, y })
  }

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 })
  }

  return (
    <button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${coords.x}px, ${coords.y}px)`,
        transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.2s ease',
        ...props.style
      }}
      className={`hover-scale ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

function App() {
  // Main Router State: 'landing' | 'login' | 'field_worker' | 'ngo' | 'admin' | 'token_detail'
  const [view, setView] = useState('landing')
  const [selectedRole, setSelectedRole] = useState('field_worker')
  const [prevView, setPrevView] = useState('ngo')
  const [activeModal, setActiveModal] = useState(null) // null | 'explore_more' | 'mrv_validation' | 'carbon_ledger'

  // Sub-Navigation States inside Portals
  const [fieldTab, setFieldTab] = useState('dashboard') // 'dashboard' | 'upload' | 'submissions' | 'sync'
  const [ngoTab, setNgoTab] = useState('dashboard')     // 'dashboard' | 'sites' | 'credits' | 'transfer' | 'retire'
  const [adminTab, setAdminTab] = useState('overview')  // 'overview' | 'queue' | 'issuance' | 'heatmap' | 'reports'
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Selected Pin for Maps
  const [selectedPin, setSelectedPin] = useState('sundarbans')

  // File Upload State (Field Worker)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isPhotoSelected, setIsPhotoSelected] = useState(false)
  const [speciesType, setSpeciesType] = useState('Rhizophora')
  const [hectaresInput, setHectaresInput] = useState('')
  const [notesInput, setNotesInput] = useState('')

  // Mock NGO Data
  const [ngoSubmissions, setNgoSubmissions] = useState([
    { id: 'BCT-01', location: 'Sundarbans Delta', area: 120.4, date: '2026-06-12', status: 'Verified', key: 'sundarbans', co2e: 15240, species: 'Rhizophora mucronata' },
    { id: 'BCT-02', location: 'Mahanadi Basin', area: 83.2, date: '2026-06-18', status: 'Verified', key: 'mahanadi', co2e: 9650, species: 'Avicennia marina' },
    { id: 'BCT-03', location: 'Pichavaram Mangroves', area: 45.1, date: '2026-06-22', status: 'Pending', key: 'pichavaram', co2e: 4800, species: 'Sonneratia apetala' },
    { id: 'BCT-04', location: 'Gulf of Kutch', area: 38.0, date: '2026-06-23', status: 'Rejected', key: 'kutch', co2e: 0, species: 'Rhizophora mucronata' }
  ])

  // Mock Admin Data
  const [adminQueue, setAdminQueue] = useState([
    { id: 1, ngo: 'Mangrove Foundation', location: 'Krishna Estuary, AP', date: '2026-06-20', hectares: 65.0, co2e: 7150, status: 'Pending' },
    { id: 2, ngo: 'Oceanic Trust', location: 'Vembanad Lake, KL', date: '2026-06-21', hectares: 32.5, co2e: 3570, status: 'Pending' },
    { id: 3, ngo: 'EcoRestore India', location: 'Bhitarkanika, OD', date: '2026-06-23', hectares: 94.8, co2e: 10420, status: 'Pending' }
  ])
  const [adminKpis, setAdminKpis] = useState({
    submissions: 142,
    pending: 3,
    bctMinted: 148650,
    co2eVerified: 1284950
  })

  // Selected Token details
  const [activeToken, setActiveToken] = useState({
    id: 'BCT-IN-MNG-0824',
    gps: '21.9497° N, 89.1833° E',
    species: 'Rhizophora mucronata',
    area: '120.4',
    co2e: '15,240',
    date: 'June 14, 2026',
    wallet: '0x71C7...976F',
    txHash: '0x9e8a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7g'
  })

  // Token Verification Logic
  const [verifying, setVerifying] = useState(false)
  const [verificationProgress, setVerificationProgress] = useState(0)

  // Form transfer/retire inputs
  const [recipientWallet, setRecipientWallet] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [retireAmount, setRetireAmount] = useState('')
  const [retirePurpose, setRetirePurpose] = useState('')

  // Toast System
  const [toast, setToast] = useState(null)
  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // Handle Token Verification Animation
  useEffect(() => {
    if (!verifying) return
    const interval = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 4) {
          clearInterval(interval)
          setVerifying(false)
          showToast('Smart contract check passed. Credit verified!')
          return 4
        }
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [verifying])

  const triggerVerification = () => {
    setVerifying(true)
    setVerificationProgress(1)
  }

  // File selector handler (Field Worker)
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setIsPhotoSelected(true)
      showToast(`Selected proof photo: ${file.name}`)
    }
  }

  // Field Worker Submit
  const handleFieldSubmit = (e) => {
    e.preventDefault()
    if (!hectaresInput) return
    
    // Add to submissions list locally (as pending)
    const newSub = {
      id: `BCT-0${ngoSubmissions.length + 1}`,
      location: `Field Report (GJ / Coast)`,
      area: parseFloat(hectaresInput),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      key: 'kutch',
      co2e: Math.round(parseFloat(hectaresInput) * 120),
      species: speciesType === 'Rhizophora' ? 'Rhizophora mucronata' : speciesType === 'Avicennia' ? 'Avicennia marina' : 'Sonneratia apetala'
    }
    setNgoSubmissions([newSub, ...ngoSubmissions])
    showToast('Report cached locally. Submission broadcast to Ledger!')
    
    // Reset Form
    setHectaresInput('')
    setNotesInput('')
    setSelectedFile(null)
    setIsPhotoSelected(false)
    setFieldTab('submissions')
  }

  // Admin Actions
  const approveSubmission = (id, co2e, hectares, ngoName) => {
    setAdminQueue(prev => prev.filter(item => item.id !== id))
    setAdminKpis(prev => ({
      ...prev,
      pending: prev.pending - 1,
      bctMinted: prev.bctMinted + hectares * 100,
      co2eVerified: prev.co2eVerified + co2e
    }))
    showToast(`Approved submission from ${ngoName}. Minted ${hectares * 100} BCT.`)
  }

  const flagSubmission = (id, ngoName) => {
    setAdminQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Flagged' } : item))
    showToast(`Flagged ${ngoName}'s report for satellite verification.`)
  }

  // NGO Credit Actions
  const submitTransfer = (e) => {
    e.preventDefault()
    if (!recipientWallet || !transferAmount) return
    showToast(`Transferred ${transferAmount} BCT credits to ${recipientWallet.slice(0,6)}...${recipientWallet.slice(-4)}`)
    setRecipientWallet('')
    setTransferAmount('')
  }

  const submitRetirement = (e) => {
    e.preventDefault()
    if (!retireAmount || !retirePurpose) return
    showToast(`Successfully retired ${retireAmount} BCT credits for: ${retirePurpose}`)
    setRetireAmount('')
    setRetirePurpose('')
  }

  // Open Token details page
  const openTokenDetails = (sub) => {
    if (!sub) return
    setActiveToken({
      id: `BCT-IN-MNG-08${sub.id ? sub.id.split('-')[1] : '24'}`,
      gps: sub.key === 'sundarbans' ? '21.9497° N, 89.1833° E' : sub.key === 'mahanadi' ? '20.2514° N, 86.4385° E' : '11.4282° N, 79.7915° E',
      species: sub.species || 'Rhizophora mucronata',
      area: sub.area,
      co2e: sub.co2e.toLocaleString(),
      date: sub.date,
      wallet: '0x71C7...976F',
      txHash: '0x9e8a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7g'
    })
    setPrevView(view)
    setView('token_detail')
  }

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden font-sans bg-black">
      
      {/* Background Cosmic Space Looping Video (Global) */}
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
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-full bg-black/80 backdrop-blur-md border border-accent-teal/40 text-accent-teal shadow-[0_0_20px_rgba(0,255,180,0.25)] flex items-center gap-3 text-xs font-semibold animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* --- 1. RICH LANDING VIEW (Refactored Layout) --- */}
      {view === 'landing' && (
        <div className="relative z-10 flex flex-col lg:flex-row min-h-screen w-full animate-fade-in">
          
          {/* Left Panel */}
          <div className="relative w-full lg:w-[52%] flex flex-col min-h-screen p-4 lg:p-6">
            <div className="absolute inset-4 lg:inset-6 rounded-3xl bg-black/45 backdrop-blur-[14px] border border-white/5 -z-10 pointer-events-none"></div>
            
            <div className="flex flex-col flex-1 p-6 lg:p-8 justify-between h-full">
              {/* Navigation */}
              <nav className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-accent-teal" />
                  <span className="text-xl font-bold tracking-tight text-white">
                    CarbonTide
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setActiveModal('explore_more')}
                    className="text-xs text-white/80 hover:text-accent-teal transition-colors font-medium hover-scale cursor-pointer"
                  >
                    Explore More
                  </button>
                  <button
                    onClick={() => setView('login')}
                    className="text-xs text-white/80 hover:text-accent-teal transition-colors font-medium hover-scale cursor-pointer"
                  >
                    Portal Login
                  </button>
                  <button
                    onClick={() => setView('login')}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-[14px] text-xs font-medium text-white hover-scale border border-white/10 cursor-pointer"
                  >
                    <span>Menu</span>
                    <Menu className="w-3.5 h-3.5 text-accent-teal" />
                  </button>
                </div>
              </nav>

              {/* Hero Center (Center-Aligned Layout) */}
              <div className="flex flex-col items-center justify-center text-center py-12 lg:py-8 flex-1 w-full mx-auto">
                <h1 className="text-5xl lg:text-7xl font-medium tracking-[-0.05em] text-white leading-[1.05] max-w-3xl hero-text-shadow text-center">
                  Restoring the coast, <br />
                  <span className="font-serif italic text-accent-teal hero-text-glow">verifying the future</span>
                </h1>
                
                <div className="mt-8 flex flex-col items-center gap-8 w-full">
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <MagneticButton
                      onClick={() => setActiveModal('explore_more')}
                      className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-[14px] border border-white/10 text-white text-sm font-medium"
                    >
                      <span>Explore More</span>
                      <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                        <Compass className="w-4 h-4 text-accent-teal" />
                      </div>
                    </MagneticButton>

                    <MagneticButton
                      onClick={() => { setView('login'); setSelectedRole('ngo'); }}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent-teal text-black text-sm font-semibold shadow-[0_0_20px_rgba(0,255,180,0.3)]"
                    >
                      <span>View Live Registry</span>
                      <ArrowRight className="w-4 h-4" />
                    </MagneticButton>
                  </div>

                  {/* Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-[14px] border border-white/10 text-xs text-white/80 hover-scale cursor-pointer">
                      Field Reports
                    </span>
                    <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-[14px] border border-white/10 text-xs text-white/80 hover-scale cursor-pointer">
                      Carbon Credits
                    </span>
                    <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-[14px] border border-white/10 text-xs text-white/80 hover-scale cursor-pointer">
                      Drone Verify
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Quote (Center-Aligned) */}
              <div className="w-full max-w-lg text-center flex flex-col items-center mt-auto mx-auto">
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-semibold">
                  VISIONARY DESIGN
                </span>
                <p className="text-lg lg:text-xl font-normal text-white/95 my-3 leading-relaxed hero-text-shadow text-center">
                  "Every <span className="font-serif italic text-accent-teal">mangrove planted</span> is a credit earned, a <span className="font-serif italic text-accent-teal">coastline saved</span>."
                </p>
                <div className="flex items-center gap-4 w-full justify-center">
                  <div className="h-[1px] flex-grow bg-white/10"></div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/50 font-medium whitespace-nowrap px-2">
                    Team Arushti, BIOTHON 2026
                  </span>
                  <div className="h-[1px] flex-grow bg-white/10"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="hidden lg:flex lg:w-[48%] flex-col min-h-screen p-4 lg:p-6 justify-between relative">
            {/* Top Bar (Unified aligned capsule row) */}
            <div className="flex items-center justify-end w-full p-4 gap-4">
              <div className="flex items-center gap-4 px-5 py-2 rounded-full bg-black/65 backdrop-blur-[14px] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-accent-teal transition-colors hover-scale">
                    <Twitter className="w-3.5 h-3.5" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-accent-teal transition-colors hover-scale">
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-accent-teal transition-colors hover-scale">
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="h-4 w-[1px] bg-white/20"></div>
                <button
                  onClick={() => setView('login')}
                  className="text-xs text-white/90 font-medium hover:text-accent-teal transition-colors hover-scale cursor-pointer"
                >
                  Account
                </button>
                <div className="h-4 w-[1px] bg-white/20"></div>
                <button
                  onClick={() => setView('login')}
                  className="text-accent-teal hover:text-white transition-colors hover-scale cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Ecosystem Card (Contrast Improved & Spotlight enabled) */}
            <SpotlightCard
              onClick={() => { setView('login'); setSelectedRole('ngo'); }}
              className="w-64 p-5 rounded-2xl bg-black/75 border border-white/12 flex flex-col gap-2 mt-4 mr-4 self-end hover-scale cursor-pointer animate-fade-in"
            >
              <h3 className="text-xs font-semibold text-white tracking-tight">
                Join the registry
              </h3>
              <p className="text-[11px] text-white font-medium leading-relaxed">
                Onboard as an NGO, panchayat, or field worker and start earning verified blue carbon credits.
              </p>
            </SpotlightCard>

            {/* Bottom Feature Section (Contrast Improved & Spotlight enabled) */}
            <div className="mt-auto w-full p-6 rounded-[2.5rem] bg-black/45 backdrop-blur-[14px] border border-white/10 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {/* MRV Validation Card */}
                <SpotlightCard
                  onClick={() => setActiveModal('mrv_validation')}
                  className="p-5 rounded-3xl bg-black/75 border border-white/12 flex flex-col gap-3 hover-scale cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-accent-teal">
                    <Wand2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-white">MRV Validation</h4>
                    <p className="text-[10px] text-white mt-1 leading-normal font-medium">
                      AI cross-validates drone imagery and field uploads before blockchain recording
                    </p>
                  </div>
                </SpotlightCard>

                {/* Carbon Ledger Card */}
                <SpotlightCard
                  onClick={() => setActiveModal('carbon_ledger')}
                  className="p-5 rounded-3xl bg-black/75 border border-white/12 flex flex-col gap-3 hover-scale cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-accent-teal">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-white">Carbon Ledger</h4>
                    <p className="text-[10px] text-white mt-1 leading-normal font-medium">
                      Immutable on-chain record of every restoration site across India's coastline
                    </p>
                  </div>
                </SpotlightCard>
              </div>

              {/* Bottom Card */}
              <SpotlightCard
                onClick={() => openTokenDetails(ngoSubmissions[0])}
                className="p-4 rounded-3xl bg-black/75 border border-white/12 flex items-center gap-4 hover-scale cursor-pointer"
              >
                <img
                  src={heroFlowers}
                  alt="BCT Credits Thumbnail"
                  className="w-24 h-16 object-cover rounded-xl border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-white truncate">
                    BCT Credits
                  </h4>
                  <p className="text-[10px] text-white mt-0.5 leading-normal font-medium">
                    Smart contracts mint Blue Carbon Tokens for every verified hectare restored
                  </p>
                </div>
                <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center hover-scale text-accent-teal font-medium cursor-pointer">
                  +
                </button>
              </SpotlightCard>  
            </div>
          </div>

          {/* Modals Overlay (Global to Landing Page) */}
          {activeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
              <SpotlightCard className="w-full max-w-lg p-6 md:p-8 rounded-3xl bg-black/85 border border-accent-teal/20 shadow-[0_0_30px_rgba(0,255,180,0.15)] flex flex-col gap-5 relative max-h-[85vh] overflow-y-auto">
                
                {/* Close Button */}
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white/80 hover-scale cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* --- Explore More Modal Content --- */}
                {activeModal === 'explore_more' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                      <Compass className="w-5 h-5 text-accent-teal" />
                      <h2 className="text-lg font-bold text-white tracking-tight">Our Mission & Goals</h2>
                    </div>
                    
                    <div className="flex flex-col gap-3 text-xs text-white/70 leading-relaxed">
                      <div>
                        <h4 className="font-semibold text-white text-xs mb-1">What is CarbonTide?</h4>
                        <p>
                          CarbonTide is India's first decentralized blue carbon credit registry. We enable local coastal communities, NGOs, and field workers to map restoration progress and mint verified ecological assets.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white text-xs mb-1">Why Blue Carbon? (The Need)</h4>
                        <p>
                          Blue carbon refers to carbon captured by ocean and coastal ecosystems. Coastal mangrove forests sequester carbon up to **4x faster** than mature terrestrial rainforests. However, they are being destroyed 10x faster than tropical forests, creating an urgent ecological crisis.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white text-xs mb-1">Our Core Goals</h4>
                        <ul className="list-disc list-inside flex flex-col gap-1.5 mt-1 pl-1">
                          <li>Restore and monitor 15,000+ hectares of vital coastal wetlands across India's coastline.</li>
                          <li>Standardize AI-driven MRV (Measurable, Reportable, Verifiable) tracking using satellite indices and drone validation.</li>
                          <li>Provide immediate, transparent Web3 financial returns (Blue Carbon Tokens) to local panchayats and workers.</li>
                        </ul>
                      </div>
                    </div>

                    <MagneticButton
                      onClick={() => setActiveModal(null)}
                      className="w-full py-2.5 rounded-full bg-accent-teal text-black text-xs font-bold mt-2"
                    >
                      Close Information Panel
                    </MagneticButton>
                  </div>
                )}

                {/* --- MRV Validation Modal Content --- */}
                {activeModal === 'mrv_validation' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                      <Wand2 className="w-5 h-5 text-accent-teal" />
                      <h2 className="text-lg font-bold text-white tracking-tight">AI MRV Validation Center</h2>
                    </div>

                    <div className="flex flex-col gap-3 text-xs">
                      <p className="text-white/70">
                        Showing mock verification records and satellite data for active restoration sites:
                      </p>

                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-white/40">SATELLITE SOURCE</span>
                          <span className="text-accent-teal font-semibold font-mono">ESA Sentinel-2B</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-white/40">NDVI SPECTRAL MATCH</span>
                          <span className="text-white font-semibold font-mono">0.78 (Optimal Rhizophora Mucronata)</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-white/40">VALIDATOR NODE CONSENSUS</span>
                          <span className="text-emerald-400 font-semibold font-mono">9 / 12 Nodes Verified</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-white/40">CO2e CAPTURE RATE</span>
                          <span className="text-white font-semibold font-mono">120 Tonnes/Ha/Year</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-1">
                        <h4 className="font-semibold text-white text-xs">Consensus Verification Steps:</h4>
                        <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-bold text-white/50">
                          <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-accent-teal">
                            1. GPS Geotag<br/>[Passed]
                          </div>
                          <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-accent-teal">
                            2. NDVI Spectrum<br/>[Passed]
                          </div>
                          <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-accent-teal">
                            3. AI Density<br/>[Passed]
                          </div>
                          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 animate-pulse">
                            4. Block Mint<br/>[Pending Sign]
                          </div>
                        </div>
                      </div>
                    </div>

                    <MagneticButton
                      onClick={() => { setActiveModal(null); setView('login'); setSelectedRole('admin'); }}
                      className="w-full py-2.5 rounded-full bg-accent-teal text-black text-xs font-bold mt-2"
                    >
                      Enter Admin Console
                    </MagneticButton>
                  </div>
                )}

                {/* --- Carbon Ledger Modal Content --- */}
                {activeModal === 'carbon_ledger' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                      <BookOpen className="w-5 h-5 text-accent-teal" />
                      <h2 className="text-lg font-bold text-white tracking-tight">On-Chain Ledger Transactions</h2>
                    </div>

                    <div className="flex flex-col gap-3 text-xs">
                      <p className="text-white/70">
                        Live audit logs of recent blocks and BCT mint coordinates recorded on the blockchain ledger:
                      </p>

                      <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1.5 text-[10px]">
                          <div className="flex justify-between items-center font-mono">
                            <span className="text-accent-teal font-semibold">BLOCK #184920</span>
                            <span className="text-white/40">0x8f2d...b3a9</span>
                          </div>
                          <p className="text-white/75 leading-relaxed">
                            Minted **1,204 BCT** for NGO *Mangrove Foundation* at Pichavaram plot. GPS Geotag: `11.4282° N, 79.7915° E`.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1.5 text-[10px]">
                          <div className="flex justify-between items-center font-mono">
                            <span className="text-accent-teal font-semibold">BLOCK #184919</span>
                            <span className="text-white/40">0x4e2c...10a9</span>
                          </div>
                          <p className="text-white/75 leading-relaxed">
                            NCCR Node Signature received: satellite canopy analysis verified for Gulf of Kutch restoration site.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1.5 text-[10px]">
                          <div className="flex justify-between items-center font-mono">
                            <span className="text-accent-teal font-semibold">BLOCK #184918</span>
                            <span className="text-white/40">0xbc7d...ff01</span>
                          </div>
                          <p className="text-white/75 leading-relaxed">
                            New assessment proof submitted by field worker node #042 (83.2 Hectares in Mahanadi Basin).
                          </p>
                        </div>
                      </div>
                    </div>

                    <MagneticButton
                      onClick={() => { setActiveModal(null); setView('login'); setSelectedRole('ngo'); }}
                      className="w-full py-2.5 rounded-full bg-accent-teal text-black text-xs font-bold mt-2"
                    >
                      Enter NGO Console
                    </MagneticButton>
                  </div>
                )}

              </SpotlightCard>
            </div>
          )}

        </div>
      )}

      {/* --- 2. CENTERED LOGIN CARD VIEW --- */}
      {view === 'login' && (
        <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-6 animate-fade-in">
          
          {/* Centered Login Card */}
          <SpotlightCard className="w-full max-w-md p-8 rounded-3xl bg-black/75 border border-accent-teal/20 shadow-[0_0_25px_rgba(0,255,180,0.15)] flex flex-col gap-6 relative">
            
            {/* Go back helper */}
            <button
              onClick={() => setView('landing')}
              className="absolute top-4 right-4 text-white/40 hover:text-white/80 hover-scale cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Branding Logo */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent-teal/15 flex items-center justify-center border border-accent-teal/20">
                <Leaf className="w-5 h-5 text-accent-teal" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white mt-1">Welcome Back</h2>
              <span className="text-[10px] text-white/40 tracking-wider">SECURE LEDGER ACCESS</span>
            </div>

            {/* Email/Password Fields (Glass-Style) */}
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email Address"
                defaultValue="registry@carbontide.in"
                className="w-full px-4 py-2.5 rounded-lg glass-input text-xs font-mono"
              />
              <input
                type="password"
                placeholder="Password"
                defaultValue="••••••••••••••"
                className="w-full px-4 py-2.5 rounded-lg glass-input text-xs font-mono"
              />
            </div>

            {/* Role Selectors */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] tracking-widest text-white/40 font-semibold uppercase">SELECT ACCESS LEVEL</span>
              <div className="grid grid-cols-3 gap-2">
                
                {/* Field Worker Card */}
                <SpotlightCard
                  onClick={() => setSelectedRole('field_worker')}
                  className={`p-3 rounded-xl flex flex-col items-center gap-2 text-center cursor-pointer hover-scale ${
                    selectedRole === 'field_worker'
                      ? 'border-accent-teal text-accent-teal shadow-[0_0_10px_rgba(0,255,180,0.15)] bg-white/5'
                      : 'border-white/10 text-white/50 bg-transparent hover:border-white/20'
                  }`}
                >
                  <Leaf className="w-4 h-4" />
                  <span className="text-[9px] font-bold whitespace-nowrap">Field Worker</span>
                </SpotlightCard>

                {/* NGO Card */}
                <SpotlightCard
                  onClick={() => setSelectedRole('ngo')}
                  className={`p-3 rounded-xl flex flex-col items-center gap-2 text-center cursor-pointer hover-scale ${
                    selectedRole === 'ngo'
                      ? 'border-accent-teal text-accent-teal shadow-[0_0_10px_rgba(0,255,180,0.15)] bg-white/5'
                      : 'border-white/10 text-white/50 bg-transparent hover:border-white/20'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="text-[9px] font-bold whitespace-nowrap">NGO / Panch</span>
                </SpotlightCard>

                {/* Admin Card */}
                <SpotlightCard
                  onClick={() => setSelectedRole('admin')}
                  className={`p-3 rounded-xl flex flex-col items-center gap-2 text-center cursor-pointer hover-scale ${
                    selectedRole === 'admin'
                      ? 'border-accent-teal text-accent-teal shadow-[0_0_10px_rgba(0,255,180,0.15)] bg-white/5'
                      : 'border-white/10 text-white/50 bg-transparent hover:border-white/20'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-[9px] font-bold whitespace-nowrap">NCCR Admin</span>
                </SpotlightCard>

              </div>
            </div>

            {/* Continue Button */}
            <MagneticButton
              onClick={() => {
                setView(selectedRole)
                setFieldTab('dashboard')
                setNgoTab('dashboard')
                setAdminTab('overview')
              }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-teal-400 to-[#00FFB4] text-black font-bold text-xs tracking-wider cursor-pointer"
            >
              Continue to Portal
            </MagneticButton>

          </SpotlightCard>
        </div>
      )}

      {/* --- 3. FIELD WORKER PORTAL VIEW --- */}
      {view === 'field_worker' && (
        <div className="relative z-10 min-h-screen w-full flex flex-col md:flex-row animate-fade-in text-[#F0F0F0]">
          
          {/* Left Sidebar Glass Panel */}
          <aside className="w-64 bg-black/40 backdrop-blur-[14px] border-r border-white/5 p-6 flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <Leaf className="w-5 h-5 text-accent-teal" />
              <span className="text-base font-bold tracking-tight text-white">Field Worker Hub</span>
            </div>

            <nav className="flex flex-col gap-2 flex-grow">
              <button
                onClick={() => setFieldTab('dashboard')}
                className={`flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs font-semibold text-left border-l-2 transition-all cursor-pointer ${
                  fieldTab === 'dashboard'
                    ? 'bg-white/5 text-accent-teal border-accent-teal'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => setFieldTab('upload')}
                className={`flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs font-semibold text-left border-l-2 transition-all cursor-pointer ${
                  fieldTab === 'upload'
                    ? 'bg-white/5 text-accent-teal border-accent-teal'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Data</span>
              </button>
              
              <button
                onClick={() => setFieldTab('submissions')}
                className={`flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs font-semibold text-left border-l-2 transition-all cursor-pointer ${
                  fieldTab === 'submissions'
                    ? 'bg-white/5 text-accent-teal border-accent-teal'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>My Submissions</span>
              </button>
              
              <button
                onClick={() => setFieldTab('sync')}
                className={`flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs font-semibold text-left border-l-2 transition-all cursor-pointer ${
                  fieldTab === 'sync'
                    ? 'bg-white/5 text-accent-teal border-accent-teal'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Offline Sync</span>
              </button>
            </nav>

            <button
              onClick={() => setView('login')}
              className="flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10 text-left hover-scale cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-6 lg:p-10 flex flex-col gap-6 overflow-y-auto max-h-screen">
            
            {/* Header Area */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <span className="text-[10px] tracking-[0.25em] text-accent-teal font-bold uppercase">BLUE CARBON RECORDING</span>
                <h1 className="text-2xl font-medium tracking-tight mt-0.5">Mangrove In-Situ Mapping</h1>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-white/40 uppercase font-semibold">Active Portal</span>
                <span className="block text-xs font-bold text-accent-teal">Gujarat Coastal Sector</span>
              </div>
            </div>

            {/* Sub-Tab 1: Dashboard */}
            {fieldTab === 'dashboard' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                {/* Intro banner */}
                <SpotlightCard className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-3">
                  <h2 className="text-lg font-semibold text-white">Welcome back, Validator Node #42</h2>
                  <p className="text-xs text-white/70 leading-relaxed max-w-2xl">
                    Use this device to capture species classification, plant coordinates, and canopy densities directly on the field. Records are timestamped, encrypted, and synced to the CarbonTide registry.
                  </p>
                  <MagneticButton
                    onClick={() => setFieldTab('upload')}
                    className="px-5 py-2 rounded-full bg-accent-teal text-black text-xs font-bold w-max mt-2"
                  >
                    Start New Field Upload
                  </MagneticButton>
                </SpotlightCard>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SpotlightCard className="p-5 rounded-2xl bg-black/65 border border-white/5 flex flex-col gap-2">
                    <span className="text-[9px] text-white/40 uppercase font-bold">TOTAL COMMITTED</span>
                    <span className="text-3xl font-extrabold text-white">14 Sites</span>
                  </SpotlightCard>
                  <SpotlightCard className="p-5 rounded-2xl bg-black/65 border border-white/5 flex flex-col gap-2">
                    <span className="text-[9px] text-white/40 uppercase font-bold">VERIFIED ON CHAIN</span>
                    <span className="text-3xl font-extrabold text-accent-teal">12 Sites</span>
                  </SpotlightCard>
                  <SpotlightCard className="p-5 rounded-2xl bg-black/65 border border-white/5 flex flex-col gap-2">
                    <span className="text-[9px] text-white/40 uppercase font-bold">OFFLINE CACHED</span>
                    <span className="text-3xl font-extrabold text-amber-300">2 Reports</span>
                  </SpotlightCard>
                </div>

                {/* GPS mapping grid */}
                <SpotlightCard className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-4">
                  <h3 className="text-sm font-semibold text-white">In-Situ Live GPS Coordinates</h3>
                  
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-white/40 font-semibold uppercase">ACTIVE GPS TARGET</span>
                      <div className="text-base font-bold text-accent-teal font-mono tracking-wide mt-0.5">
                        22.4812° N, 69.8514° E
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        Precision
                      </span>
                      <span className="text-xs font-semibold text-white/80 mt-0.5">± 1.2 meters</span>
                    </div>
                  </div>

                  <div className="h-64 rounded-2xl bg-white/5 border border-white/5 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                      <path d="M -10,120 Q 80,100 120,60 T 210,-10" fill="none" stroke="rgba(0, 255, 180, 0.25)" strokeWidth="6" />
                    </svg>

                    <div className="absolute top-[40%] left-[45%] z-10 flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-accent-teal/20 flex items-center justify-center border border-accent-teal animate-pulse">
                        <MapPin className="w-3.5 h-3.5 text-accent-teal" />
                      </div>
                      <span className="text-[9px] font-mono text-accent-teal bg-black/85 px-1.5 py-0.5 rounded mt-1 border border-accent-teal/20">
                        LAT: 22.4812 | LNG: 69.8514
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            )}

            {/* Sub-Tab 2: Upload Data */}
            {fieldTab === 'upload' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
                
                {/* Form Card */}
                <SpotlightCard
                  className="lg:col-span-7 p-6 rounded-3xl bg-black/65 border border-white/5 shadow-xl"
                >
                  <form onSubmit={handleFieldSubmit} className="flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-white mb-2">New Site Assessment Form</h3>
                    
                    {/* Species Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-white/50 font-semibold uppercase">MANGROVE SPECIES TYPE</label>
                      <select
                        value={speciesType}
                        onChange={(e) => setSpeciesType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg glass-input text-xs text-white cursor-pointer bg-black"
                      >
                        <option value="Rhizophora">Rhizophora mucronata (Red Mangrove)</option>
                        <option value="Avicennia">Avicennia marina (Grey Mangrove)</option>
                        <option value="Sonneratia">Sonneratia apetala (Mangrove Apple)</option>
                      </select>
                    </div>

                    {/* Hectares input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-white/50 font-semibold uppercase">ESTIMATED RESTORATION AREA (HECTARES)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 12.5"
                        value={hectaresInput}
                        onChange={(e) => setHectaresInput(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg glass-input text-xs"
                        required
                      />
                    </div>

                    {/* Dashed Photo Upload Zone (Functional) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-white/50 font-semibold uppercase">SITE PHOTO PROOF</label>
                      
                      {/* Hidden Native File Input */}
                      <input
                        type="file"
                        accept="image/*"
                        id="photo-file-input-tab"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      <div
                        onClick={() => document.getElementById('photo-file-input-tab').click()}
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-white/5 ${
                          isPhotoSelected ? 'border-accent-teal bg-accent-teal/5 shadow-[0_0_15px_rgba(0,255,180,0.15)]' : 'border-accent-teal/40'
                        }`}
                      >
                        <Upload className="w-6 h-6 text-accent-teal" />
                        <span className="text-xs font-semibold text-white">
                          {isPhotoSelected ? 'File Selected' : 'Capture / Upload Site Photo'}
                        </span>
                        <span className="text-[9px] text-white/40">
                          {selectedFile ? `${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)` : 'Requires camera geotag metadata'}
                        </span>
                      </div>
                    </div>

                    {/* Notes textarea */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-white/50 font-semibold uppercase">FIELD OBSERVATIONS</label>
                      <textarea
                        placeholder="Enter soil quality, tidal levels, or plant health notes..."
                        rows="3"
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg glass-input text-xs resize-none"
                      ></textarea>
                    </div>

                    {/* Submit button */}
                    <MagneticButton
                      type="submit"
                      className="w-full mt-2 py-3 rounded-full bg-accent-teal text-black font-bold text-xs shadow-[0_0_15px_rgba(0,255,180,0.2)]"
                    >
                      Submit to Blockchain Registry
                    </MagneticButton>
                  </form>
                </SpotlightCard>

                {/* Guide panel */}
                <SpotlightCard className="lg:col-span-5 p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-accent-teal" />
                    <span>Upload Instructions</span>
                  </h3>
                  <ol className="text-[11px] text-white/60 list-decimal list-inside flex flex-col gap-2">
                    <li>Stand at the center of the planted plot when selecting photo proof.</li>
                    <li>Ensure GPS satellite lock is stabilized (indicated on right).</li>
                    <li>Double check Hectares with your local tape survey before entry.</li>
                    <li>Submissions are instantly hashed and signed locally for consensus.</li>
                  </ol>
                </SpotlightCard>
              </div>
            )}

            {/* Sub-Tab 3: Submissions */}
            {fieldTab === 'submissions' && (
              <SpotlightCard className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-4 animate-fade-in shadow-xl">
                <h3 className="text-sm font-semibold text-white">Your Field Submissions History</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 font-medium">
                        <th className="pb-3">Site ID</th>
                        <th className="pb-3">Location</th>
                        <th className="pb-3">Hectares</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Species</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {ngoSubmissions.map((sub, i) => (
                        <tr key={sub.id + i} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 font-mono text-white/80 font-bold">{sub.id}</td>
                          <td className="py-3.5 text-white">{sub.location}</td>
                          <td className="py-3.5 text-white/70">{sub.area} Ha</td>
                          <td className="py-3.5 text-white/60">{sub.date}</td>
                          <td className="py-3.5 text-white/60">{sub.species}</td>
                          <td className="py-3.5 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                sub.status === 'Verified'
                                  ? 'bg-emerald-500/20 text-accent-teal border border-accent-teal/30'
                                  : sub.status === 'Pending'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
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
              </SpotlightCard>
            )}

            {/* Sub-Tab 4: Offline Sync */}
            {fieldTab === 'sync' && (
              <SpotlightCard className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-4 animate-fade-in shadow-xl">
                <h3 className="text-sm font-semibold text-white">Local Cache Registry Ledger</h3>
                <p className="text-xs text-white/60">
                  CarbonTide uses local browser IndexedDB state to preserve logs when sync networks are offline. When a connection is restored, these reports sync to blockchain ledger automatically.
                </p>

                <div className="flex flex-col gap-3 mt-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">Local Cache #1: Pichavaram Plot B</h4>
                      <span className="text-[10px] text-white/40">Timestamp: 2026-06-23 23:14</span>
                    </div>
                    <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                      Sync Pending
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">Local Cache #2: Vembanad Lake West</h4>
                      <span className="text-[10px] text-white/40">Timestamp: 2026-06-23 23:25</span>
                    </div>
                    <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                      Sync Pending
                    </span>
                  </div>
                </div>

                <MagneticButton
                  onClick={() => showToast('Cache Synced to Blockchain node... Status code 200 OK')}
                  className="w-full py-3 rounded-full bg-accent-teal text-black text-xs font-bold mt-4"
                >
                  Force Sync Now
                </MagneticButton>
              </SpotlightCard>
            )}

            {/* Bottom Offline status bar */}
            <SpotlightCard className="mt-auto p-4 rounded-2xl bg-black/65 border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <WifiOff className="w-4 h-4 text-accent-teal" />
                <span className="text-white/70">
                  Local Cache Ledger: <strong className="text-white">2 Submissions</strong> cached offline.
                </span>
              </div>
              <MagneticButton
                onClick={() => showToast('Syncing cached records with CarbonTide network...')}
                className="px-4 py-1.5 rounded-full bg-accent-teal/15 border border-accent-teal/30 text-accent-teal text-[10px] font-bold"
              >
                Sync Now
              </MagneticButton>
            </SpotlightCard>

          </main>
        </div>
      )}

      {/* --- 4. NGO / PANCHAYAT PORTAL VIEW --- */}
      {view === 'ngo' && (
        <div className="relative z-10 min-h-screen w-full flex flex-col md:flex-row animate-fade-in text-[#F0F0F0]">
          
          {/* Left Glassmorphism Sidebar */}
          <aside className="w-64 bg-black/40 backdrop-blur-[14px] border-r border-white/5 p-6 flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-accent-teal" />
              <span className="text-base font-bold tracking-tight text-white">NGO Registry portal</span>
            </div>

            <nav className="flex flex-col gap-2 flex-grow">
              <button
                onClick={() => setNgoTab('dashboard')}
                className={`flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs font-semibold text-left border-l-2 transition-all cursor-pointer ${
                  ngoTab === 'dashboard'
                    ? 'bg-white/5 text-accent-teal border-accent-teal'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => setNgoTab('sites')}
                className={`flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs font-semibold text-left border-l-2 transition-all cursor-pointer ${
                  ngoTab === 'sites'
                    ? 'bg-white/5 text-accent-teal border-accent-teal'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>My Sites</span>
              </button>
              
              <button
                onClick={() => setNgoTab('credits')}
                className={`flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs font-semibold text-left border-l-2 transition-all cursor-pointer ${
                  ngoTab === 'credits'
                    ? 'bg-white/5 text-accent-teal border-accent-teal'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>BCT Credits</span>
              </button>
              
              <button
                onClick={() => setNgoTab('transfer')}
                className={`flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs font-semibold text-left border-l-2 transition-all cursor-pointer ${
                  ngoTab === 'transfer'
                    ? 'bg-white/5 text-accent-teal border-accent-teal'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
                <span>Transfer Credits</span>
              </button>
              
              <button
                onClick={() => setNgoTab('retire')}
                className={`flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs font-semibold text-left border-l-2 transition-all cursor-pointer ${
                  ngoTab === 'retire'
                    ? 'bg-white/5 text-accent-teal border-accent-teal'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Retire Credits</span>
              </button>
            </nav>

            <button
              onClick={() => setView('login')}
              className="flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10 text-left hover-scale cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-6 lg:p-10 flex flex-col gap-6 overflow-y-auto max-h-screen">
            
            {/* Top row stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SpotlightCard className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col justify-between min-h-[120px] shadow-lg">
                <span className="text-[10px] text-white/50 font-semibold uppercase">TOTAL BCT EARNED</span>
                <div className="text-3xl font-extrabold text-accent-teal mt-2">
                  24,850 <span className="text-xs font-normal text-white/40">Tokens</span>
                </div>
                <span className="text-[9px] text-emerald-400 font-bold uppercase mt-1">Verified Credits</span>
              </SpotlightCard>

              <SpotlightCard className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col justify-between min-h-[120px] shadow-lg">
                <span className="text-[10px] text-white/50 font-semibold uppercase">HECTARES RESTORED</span>
                <div className="text-3xl font-extrabold text-white mt-2">
                  248.7 <span className="text-xs font-normal text-white/40">Ha</span>
                </div>
                <span className="text-[9px] text-white/40 font-semibold mt-1">4 Active Restoration Sites</span>
              </SpotlightCard>

              <SpotlightCard className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col justify-between min-h-[120px] shadow-lg">
                <span className="text-[10px] text-white/50 font-semibold uppercase">CO2e SEQUESTERED</span>
                <div className="text-3xl font-extrabold text-white mt-2">
                  29,690 <span className="text-xs font-normal text-white/40">Tonnes</span>
                </div>
                <span className="text-[9px] text-white/40 font-semibold mt-1">Procedural Biomass Calculations</span>
              </SpotlightCard>
            </div>

            {/* Sub-Tab 1: Dashboard */}
            {ngoTab === 'dashboard' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                {/* Active Mangrove Sites Map */}
                <SpotlightCard className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-4 shadow-lg">
                  <h3 className="text-sm font-semibold text-white">Active Mangrove Sites Map</h3>
                  
                  <div className="relative h-72 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center p-4 overflow-hidden">
                    <svg viewBox="0 0 400 300" className="w-full h-full max-w-[320px]">
                      <path
                        d="M 100,20 C 115,100 110,150 130,200 C 140,220 160,250 190,270 C 205,280 210,285 210,280 C 210,280 215,240 225,220 C 240,190 265,160 305,150 L 330,130"
                        fill="none"
                        stroke="rgba(0, 255, 180, 0.25)"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 100,20 C 115,100 110,150 130,200 C 140,220 160,250 190,270 C 205,280 210,285 210,280 C 210,280 215,240 225,220 C 240,190 265,160 305,150 L 330,130"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeDasharray="4 2"
                      />

                      <g className="cursor-pointer" onClick={() => setSelectedPin('kutch')}>
                        <circle cx="110" cy="110" r="12" className={`fill-red-500/20 stroke-red-500 stroke-2 ${selectedPin === 'kutch' ? 'animate-pulse' : ''}`} />
                        <circle cx="110" cy="110" r="4.5" className="fill-red-500" />
                      </g>

                      <g className="cursor-pointer" onClick={() => setSelectedPin('pichavaram')}>
                        <circle cx="195" cy="255" r="12" className={`fill-amber-500/20 stroke-amber-500 stroke-2 ${selectedPin === 'pichavaram' ? 'animate-pulse' : ''}`} />
                        <circle cx="195" cy="255" r="4.5" className="fill-amber-500" />
                      </g>

                      <g className="cursor-pointer" onClick={() => setSelectedPin('sundarbans')}>
                        <circle cx="310" cy="148" r="12" className={`fill-accent-teal/20 stroke-accent-teal stroke-2 ${selectedPin === 'sundarbans' ? 'animate-pulse' : ''}`} />
                        <circle cx="310" cy="148" r="4.5" className="fill-accent-teal" />
                      </g>
                    </svg>

                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/75 border border-white/10 text-xs flex justify-between items-center">
                      {selectedPin === 'sundarbans' && (
                        <>
                          <div>
                            <h4 className="font-semibold text-accent-teal">Sundarbans Delta (WB)</h4>
                            <p className="text-[10px] text-white/50 mt-0.5">120.4 Hectares • Verified • 15,240 BCT Earned</p>
                          </div>
                          <MagneticButton
                            onClick={() => openTokenDetails(ngoSubmissions[0])}
                            className="px-3 py-1 rounded-lg bg-accent-teal/10 border border-accent-teal/30 text-accent-teal text-[10px] font-semibold"
                          >
                            View Token
                          </MagneticButton>
                        </>
                      )}
                      {selectedPin === 'kutch' && (
                        <>
                          <div>
                            <h4 className="font-semibold text-red-400">Gulf of Kutch (GJ)</h4>
                            <p className="text-[10px] text-white/50 mt-0.5">38.0 Hectares • Rejected (Invalid Canopy Density)</p>
                          </div>
                          <span className="text-[9px] text-red-400 font-bold uppercase">FLAGGED</span>
                        </>
                      )}
                      {selectedPin === 'pichavaram' && (
                        <>
                          <div>
                            <h4 className="font-semibold text-amber-300">Pichavaram Mangroves (TN)</h4>
                            <p className="text-[10px] text-white/50 mt-0.5">45.1 Hectares • Verification Pending (Awaiting Satellite Run)</p>
                          </div>
                          <MagneticButton
                            onClick={() => openTokenDetails(ngoSubmissions[2])}
                            className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-semibold"
                          >
                            View Draft
                          </MagneticButton>
                        </>
                      )}
                    </div>
                  </div>
                </SpotlightCard>

                {/* Submissions Table Card */}
                <SpotlightCard className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-4 shadow-lg">
                  <h3 className="text-sm font-semibold text-white">Recent Ledger Submissions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-white/40 font-medium">
                          <th className="pb-3">Site ID</th>
                          <th className="pb-3">Location</th>
                          <th className="pb-3">Area (Ha)</th>
                          <th className="pb-3">Sub. Date</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Credits Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {ngoSubmissions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3.5 font-bold font-mono text-white/80">{sub.id}</td>
                            <td className="py-3.5 font-medium text-white">{sub.location}</td>
                            <td className="py-3.5 text-white/70">{sub.area} Ha</td>
                            <td className="py-3.5 text-white/60">{sub.date}</td>
                            <td className="py-3.5">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                                  sub.status === 'Verified'
                                    ? 'bg-emerald-500/20 text-accent-teal border border-accent-teal/30'
                                    : sub.status === 'Pending'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}
                              >
                                {sub.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-right">
                              {sub.status === 'Verified' ? (
                                <button
                                  onClick={() => openTokenDetails(sub)}
                                  className="text-accent-teal hover:underline text-[10px] font-semibold cursor-pointer"
                                >
                                  Verify BCT Token Card
                                </button>
                              ) : sub.status === 'Pending' ? (
                                <span className="text-amber-300/80 italic text-[10px]">Pending validation</span>
                              ) : (
                                <span className="text-red-400/80 italic text-[10px]">Validation Failed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SpotlightCard>
              </div>
            )}

            {/* Sub-Tab 2: My Sites */}
            {ngoTab === 'sites' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                {ngoSubmissions.map((site) => (
                  <SpotlightCard key={site.id} className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <h4 className="text-sm font-bold text-white">{site.location}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        site.status === 'Verified' ? 'bg-emerald-500/20 text-accent-teal border border-accent-teal/30' : 'bg-amber-500/10 text-amber-300'
                      }`}>{site.status}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs text-white/60">
                      <div>
                        <span>Plot Size:</span>
                        <strong className="block text-white mt-0.5">{site.area} Ha</strong>
                      </div>
                      <div>
                        <span>Mangrove Species:</span>
                        <strong className="block text-white mt-0.5">{site.species}</strong>
                      </div>
                      <div>
                        <span>CO2e Sequestered:</span>
                        <strong className="block text-accent-teal mt-0.5">{site.co2e} Tonnes</strong>
                      </div>
                      <div>
                        <span>Sub. Date:</span>
                        <strong className="block text-white mt-0.5">{site.date}</strong>
                      </div>
                    </div>
                    
                    {site.status === 'Verified' && (
                      <MagneticButton
                        onClick={() => openTokenDetails(site)}
                        className="w-full mt-2 py-2 rounded-lg bg-white/5 text-[10px] text-accent-teal border border-accent-teal/30 font-semibold"
                      >
                        Inspect Token
                      </MagneticButton>
                    )}
                  </SpotlightCard>
                ))}
              </div>
            )}

            {/* Sub-Tab 3: BCT Credits */}
            {ngoTab === 'credits' && (
              <SpotlightCard className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-4 animate-fade-in shadow-xl">
                <h3 className="text-sm font-semibold text-white">Your Blue Carbon Token Inventory</h3>
                <p className="text-xs text-white/60">Each BCT credit is minted via validated sat-imagery matching smart contract parameters.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {ngoSubmissions.filter(s => s.status === 'Verified').map(sub => (
                    <SpotlightCard key={sub.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-mono font-bold text-accent-teal">BCT-IN-MNG-08{sub.id.split('-')[1]}</h4>
                        <span className="text-[10px] text-white/50">{sub.location} • {sub.area} Hectares</span>
                      </div>
                      <MagneticButton
                        onClick={() => openTokenDetails(sub)}
                        className="px-3 py-1 rounded bg-accent-teal text-black text-[10px] font-bold"
                      >
                        Inspect
                      </MagneticButton>
                    </SpotlightCard>
                  ))}
                </div>
              </SpotlightCard>
            )}

            {/* Sub-Tab 4: Transfer Credits */}
            {ngoTab === 'transfer' && (
              <SpotlightCard className="w-full max-w-lg mx-auto p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-4 animate-fade-in shadow-xl">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-accent-teal" />
                  <span>Transfer BCT Tokens</span>
                </h3>
                <p className="text-xs text-white/60">Transfer verified carbon offsets directly onto external registries or purchaser wallets.</p>

                <form onSubmit={submitTransfer} className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-white/50 font-semibold uppercase">RECIPIENT WALLET / REGISTRY ADDRESS</label>
                    <input
                      type="text"
                      placeholder="e.g. 0x71C7656EC7ab88b098defB751B74..."
                      value={recipientWallet}
                      onChange={(e) => setRecipientWallet(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg glass-input text-xs font-mono"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-white/50 font-semibold uppercase">AMOUNT OF BCT TO TRANSFER</label>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg glass-input text-xs"
                      required
                    />
                  </div>

                  <MagneticButton
                    type="submit"
                    className="w-full py-3 rounded-full bg-accent-teal text-black text-xs font-bold mt-2 shadow-[0_0_15px_rgba(0,255,180,0.2)]"
                  >
                    Authorize and Transfer Credits
                  </MagneticButton>
                </form>
              </SpotlightCard>
            )}

            {/* Sub-Tab 5: Retire Credits */}
            {ngoTab === 'retire' && (
              <SpotlightCard className="w-full max-w-lg mx-auto p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-4 animate-fade-in shadow-xl">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-accent-teal" />
                  <span>Retire Carbon Credits</span>
                </h3>
                <p className="text-xs text-white/60">Retiring tokens locks them permanently to offset your corporate or state CO2 emissions.</p>

                <form onSubmit={submitRetirement} className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-white/50 font-semibold uppercase">AMOUNT OF BCT TO RETIRE</label>
                    <input
                      type="number"
                      placeholder="e.g. 1000"
                      value={retireAmount}
                      onChange={(e) => setRetireAmount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg glass-input text-xs"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-white/50 font-semibold uppercase">OFFSET BENEFICIARY / PURPOSE</label>
                    <input
                      type="text"
                      placeholder="e.g. CSR Carbon Neutrality Program 2026"
                      value={retirePurpose}
                      onChange={(e) => setRetirePurpose(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg glass-input text-xs"
                      required
                    />
                  </div>

                  <MagneticButton
                    type="submit"
                    className="w-full py-3 rounded-full bg-accent-teal text-black text-xs font-bold mt-2 shadow-[0_0_15px_rgba(0,255,180,0.2)]"
                  >
                    Retire Tokens and Issue Certificate
                  </MagneticButton>
                </form>
              </SpotlightCard>
            )}

          </main>
        </div>
      )}

      {/* --- 5. NCCR ADMIN PANEL VIEW --- */}
      {view === 'admin' && (
        <div className="relative z-10 min-h-screen w-full flex flex-col md:flex-row animate-fade-in text-[#F0F0F0]">
          
          {/* Left Sidebar Glassmorphism Sidebar */}
          <aside className="w-64 bg-black/40 backdrop-blur-[14px] border-r border-white/5 p-6 flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-accent-teal" />
              <span className="text-base font-bold tracking-tight text-white">NCCR Control Console</span>
            </div>

            <nav className="flex flex-col gap-2 flex-grow">
              <button
                onClick={() => setAdminTab('overview')}
                className={`flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs font-semibold text-left border-l-2 transition-all cursor-pointer ${
                  adminTab === 'overview'
                    ? 'bg-white/5 text-accent-teal border-accent-teal'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
              
              <button
                onClick={() => setAdminTab('queue')}
                className={`flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs font-semibold text-left border-l-2 transition-all cursor-pointer ${
                  adminTab === 'queue'
                    ? 'bg-white/5 text-accent-teal border-accent-teal'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Approval Queue</span>
              </button>
              
              <button
                onClick={() => setAdminTab('issuance')}
                className={`flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs font-semibold text-left border-l-2 transition-all cursor-pointer ${
                  adminTab === 'issuance'
                    ? 'bg-white/5 text-accent-teal border-accent-teal'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Credit Issuance</span>
              </button>
              
              <button
                onClick={() => setAdminTab('heatmap')}
                className={`flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs font-semibold text-left border-l-2 transition-all cursor-pointer ${
                  adminTab === 'heatmap'
                    ? 'bg-white/5 text-accent-teal border-accent-teal'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Restoration Heatmap</span>
              </button>
              
              <button
                onClick={() => setAdminTab('reports')}
                className={`flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs font-semibold text-left border-l-2 transition-all cursor-pointer ${
                  adminTab === 'reports'
                    ? 'bg-white/5 text-accent-teal border-accent-teal'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Reports</span>
              </button>
            </nav>

            <button
              onClick={() => setView('login')}
              className="flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10 text-left hover-scale cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </aside>

          {/* Main Area */}
          <main className="flex-1 p-6 lg:p-10 flex flex-col gap-6 overflow-y-auto max-h-screen">
            
            {/* Top Bar Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div className="pr-4">
                <span className="text-[10px] tracking-[0.2em] text-emerald-400 uppercase font-semibold">Government Dashboard</span>
                <h1 className="text-2xl font-semibold mt-0.5 flex flex-wrap items-baseline gap-x-2">
                  <span>National Coastal Carbon Registry</span>
                  <span className="text-base font-light text-white/50 font-sans">(NCCR)</span>
                </h1>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col text-right shrink-0">
                <span className="text-[10px] text-white/40 font-medium">CO2e SEQUESTERED VERIFIED</span>
                <span className="text-xl font-bold text-accent-teal">
                  {adminKpis.co2eVerified.toLocaleString()} Tons
                </span>
              </div>
            </div>

            {/* Sub-Tab 1: Overview Dashboard */}
            {adminTab === 'overview' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                {/* KPIs Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <SpotlightCard className="p-5 rounded-2xl bg-black/65 border border-white/5 flex flex-col justify-between shadow-md">
                    <span className="text-[10px] text-white/50 font-semibold uppercase">Total Submissions</span>
                    <span className="text-2xl font-extrabold mt-1 text-white">{adminKpis.submissions}</span>
                  </SpotlightCard>
                  <SpotlightCard className="p-5 rounded-2xl bg-black/65 border border-white/5 flex flex-col justify-between shadow-md">
                    <span className="text-[10px] text-white/50 font-semibold uppercase">Pending Approvals</span>
                    <span className="text-2xl font-extrabold mt-1 text-accent-teal">{adminKpis.pending}</span>
                  </SpotlightCard>
                  <SpotlightCard className="p-5 rounded-2xl bg-black/65 border border-white/5 flex flex-col justify-between shadow-md">
                    <span className="text-[10px] text-white/50 font-semibold uppercase">Total BCT Minted</span>
                    <span className="text-2xl font-extrabold mt-1 text-white">{adminKpis.bctMinted.toLocaleString()}</span>
                  </SpotlightCard>
                </div>

                {/* Main Content Grid: Heatmap + Queue */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  <SpotlightCard className="lg:col-span-7 p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-4 shadow-lg">
                    <h3 className="text-sm font-semibold text-white">Coastal Restoration Heatmap</h3>
                    
                    <div className="relative h-72 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center p-4 overflow-hidden">
                      <svg viewBox="0 0 400 300" className="w-full h-full max-w-[320px]">
                        <path d="M 100,20 C 115,100 110,150 130,200 C 140,220 160,250 190,270" fill="none" stroke="rgba(0, 255, 180, 0.05)" strokeWidth="10" />
                        <path d="M 100,20 C 115,100 110,150 130,200 C 140,220 160,250 190,270" fill="none" stroke="url(#admin-grad)" strokeWidth="4" className="blur-[1px]" />
                        <circle cx="195" cy="255" r="18" className="fill-emerald-500/20 blur-[4px]" />
                        <circle cx="195" cy="255" r="6" className="fill-emerald-400" />
                        <defs>
                          <linearGradient id="admin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#00FFB4" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </SpotlightCard>

                  <SpotlightCard className="lg:col-span-5 p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-4 shadow-lg">
                    <h3 className="text-sm font-semibold text-white">Verification Queue</h3>
                    <div className="flex flex-col gap-3 justify-start">
                      {adminQueue.slice(0, 2).map((item) => (
                        <SpotlightCard key={item.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold text-white">{item.ngo}</h4>
                            <span className="text-[10px] text-accent-teal font-bold">{item.hectares} Ha</span>
                          </div>
                          <div className="flex gap-2">
                            <MagneticButton
                              onClick={() => approveSubmission(item.id, item.co2e, item.hectares, item.ngo)}
                              className="flex-grow py-1.5 rounded bg-accent-teal/20 text-accent-teal text-[10px] font-bold"
                            >
                              Approve
                            </MagneticButton>
                            <MagneticButton
                              onClick={() => flagSubmission(item.id, item.ngo)}
                              className="px-3 py-1.5 rounded bg-white/5 text-white/50 text-[10px]"
                            >
                              Flag
                            </MagneticButton>
                          </div>
                        </SpotlightCard>
                      ))}
                    </div>
                  </SpotlightCard>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Approval Queue */}
            {adminTab === 'queue' && (
              <SpotlightCard className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-4 animate-fade-in shadow-xl">
                <h3 className="text-sm font-semibold text-white">Complete Pending Approval Queue</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 font-medium">
                        <th className="pb-3">Submitter (NGO)</th>
                        <th className="pb-3">Location</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Hectares</th>
                        <th className="pb-3">CO2e Value</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {adminQueue.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 font-bold text-white">{item.ngo}</td>
                          <td className="py-3.5 text-white/70">{item.location}</td>
                          <td className="py-3.5 text-white/60">{item.date}</td>
                          <td className="py-3.5 text-white/70">{item.hectares} Ha</td>
                          <td className="py-3.5 text-accent-teal font-semibold">{item.co2e} t</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.status === 'Pending' ? 'bg-amber-500/10 text-amber-300' : 'bg-red-500/10 text-red-300'
                            }`}>{item.status}</span>
                          </td>
                          <td className="py-3.5 text-right">
                            {item.status === 'Pending' ? (
                              <div className="flex justify-end gap-2">
                                <MagneticButton
                                  onClick={() => approveSubmission(item.id, item.co2e, item.hectares, item.ngo)}
                                  className="px-2.5 py-1 rounded bg-accent-teal/20 text-accent-teal hover:bg-accent-teal/30 font-semibold"
                                >
                                  Approve
                                </MagneticButton>
                                <MagneticButton
                                  onClick={() => flagSubmission(item.id, item.ngo)}
                                  className="px-2.5 py-1 rounded bg-white/5 text-white/50"
                                >
                                  Flag
                                </MagneticButton>
                              </div>
                            ) : (
                              <span className="text-[10px] text-white/40 italic">Flagged</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SpotlightCard>
            )}

            {/* Sub-Tab 3: Credit Issuance */}
            {adminTab === 'issuance' && (() => {
              const issuanceData = [
                { month: 'JAN', amount: 12400, x: 60, y: 140, change: 'Base Month', hash: '0x3f5c...a18e' },
                { month: 'FEB', amount: 15200, x: 136, y: 125, change: '+22.5%', hash: '0x7e1a...c439' },
                { month: 'MAR', amount: 18100, x: 212, y: 110, change: '+19.1%', hash: '0x9d4b...d08f' },
                { month: 'APR', amount: 24500, x: 288, y: 85, change: '+35.3%', hash: '0x12fa...e921' },
                { month: 'MAY', amount: 28900, x: 364, y: 70, change: '+17.9%', hash: '0x5b3c...f87a' },
                { month: 'JUN', amount: 36200, x: 440, y: 30, change: '+25.2%', hash: '0x8d6e...b15c' }
              ];
              return (
                <SpotlightCard className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-6 animate-fade-in shadow-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Monthly Credit Issuance Trend</h3>
                      <p className="text-[10px] text-white/40 mt-0.5">Automated smart-contract registry mint logs (2026)</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 font-semibold uppercase tracking-wider">
                      2026 Registry
                    </span>
                  </div>

                  {/* Visual KPI Mini Cards inside Issuance */}
                  <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-white/40 tracking-wider font-semibold uppercase">TOTAL ISSUED</span>
                      <span className="text-lg font-bold text-accent-teal mt-0.5">148,650 BCT</span>
                      <span className="text-[9px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                        <TrendingUp className="w-2.5 h-2.5" /> +24.5% vs last Q
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-white/40 tracking-wider font-semibold uppercase">MONTHLY AVERAGE</span>
                      <span className="text-lg font-bold text-white mt-0.5">24,775 BCT</span>
                      <span className="text-[9px] text-white/40 font-medium mt-0.5">Linear growth trajectory</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-white/40 tracking-wider font-semibold uppercase">MINT REGIME</span>
                      <span className="text-lg font-bold text-white mt-0.5">Automated</span>
                      <span className="text-[9px] text-accent-teal font-medium flex items-center gap-1 mt-0.5">
                        <Check className="w-2.5 h-2.5" /> Smart Contract Mint
                      </span>
                    </div>
                  </div>

                  {/* Chart Container */}
                  <div className="h-64 rounded-xl bg-white/[0.02] border border-white/5 p-4 flex flex-col relative overflow-visible">
                    <div className="flex-grow relative overflow-visible">
                      <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                        <defs>
                          {/* Neon glow filter */}
                          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                          {/* Area fill gradient */}
                          <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00FFB4" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#00FFB4" stopOpacity="0.00" />
                          </linearGradient>
                          {/* Stroke line gradient */}
                          <linearGradient id="chart-line-grad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#00b4d8" />
                            <stop offset="50%" stopColor="#00FFB4" />
                            <stop offset="100%" stopColor="#a3e635" />
                          </linearGradient>
                        </defs>

                        {/* Y-Axis Horizontal Grid Lines */}
                        <line x1="50" y1="30" x2="450" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                        <line x1="50" y1="70" x2="450" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                        <line x1="50" y1="120" x2="450" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                        <line x1="50" y1="150" x2="450" y2="150" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                        <line x1="50" y1="165" x2="450" y2="165" stroke="rgba(255,255,255,0.12)" />

                        {/* Y-Axis Value Labels */}
                        <text x="12" y="33" className="fill-white/30 text-[8px] font-mono">35K BCT</text>
                        <text x="12" y="73" className="fill-white/30 text-[8px] font-mono">25K BCT</text>
                        <text x="12" y="123" className="fill-white/30 text-[8px] font-mono">15K BCT</text>
                        <text x="12" y="153" className="fill-white/30 text-[8px] font-mono">5K BCT</text>

                        {/* Filled Gradient Area Under Curve */}
                        <path
                          d="M 60,140 C 98,135 98,130 136,125 C 174,120 174,115 212,110 C 250,105 250,90 288,85 C 326,80 326,73 364,70 C 402,65 402,35 440,30 L 440,165 L 60,165 Z"
                          fill="url(#chart-area-grad)"
                          className="pointer-events-none"
                        />

                        {/* Glowing Main Trend Line with Pulse Glow Animation */}
                        <path
                          d="M 60,140 C 98,135 98,130 136,125 C 174,120 174,115 212,110 C 250,105 250,90 288,85 C 326,80 326,73 364,70 C 402,65 402,35 440,30"
                          fill="none"
                          stroke="url(#chart-line-grad)"
                          strokeWidth="3"
                          filter="url(#neon-glow)"
                          className="pointer-events-none animate-trend-glow"
                        />

                        {/* Vertical Indicator Guide Line on Hover */}
                        {hoveredIndex !== null && (
                          <line
                            x1={issuanceData[hoveredIndex].x}
                            y1="20"
                            x2={issuanceData[hoveredIndex].x}
                            y2="165"
                            stroke="rgba(0, 255, 180, 0.35)"
                            strokeWidth="1.5"
                            strokeDasharray="2 2"
                            className="pointer-events-none"
                          />
                        )}

                        {/* X-Axis labels rendered directly inside the SVG for perfect alignment, with extra breathing room at y=188 */}
                        {issuanceData.map((d, index) => (
                          <text
                            key={d.month}
                            x={d.x}
                            y="188"
                            textAnchor="middle"
                            className={`text-[8.5px] font-semibold transition-colors duration-200 ${
                              hoveredIndex === index ? 'fill-accent-teal font-extrabold' : 'fill-white/40'
                            }`}
                          >
                            {d.month}
                          </text>
                        ))}

                        {/* Interactive Circles / Data Nodes */}
                        {issuanceData.map((d, index) => {
                          const isHovered = hoveredIndex === index;
                          return (
                            <g key={d.month} className="cursor-pointer">
                              {/* Larger invisible hover shield */}
                              <circle
                                cx={d.x}
                                cy={d.y}
                                r="16"
                                className="fill-transparent"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                              />
                              {/* Outer glow ring */}
                              <circle
                                cx={d.x}
                                cy={d.y}
                                r={isHovered ? 8 : 4.5}
                                className={`transition-all duration-300 pointer-events-none ${
                                  isHovered ? 'fill-accent-teal/25 stroke-accent-teal stroke-1' : 'fill-black stroke-accent-teal stroke-2'
                                }`}
                              />
                              {/* Inner center dot */}
                              <circle
                                cx={d.x}
                                cy={d.y}
                                r="2"
                                className={`pointer-events-none transition-all duration-300 ${
                                  isHovered ? 'fill-white' : 'fill-accent-teal'
                                }`}
                              />
                            </g>
                          );
                        })}

                        {/* SVG Tooltip Group: 100% aligned with the coordinates of the graph */}
                        {hoveredIndex !== null && (
                          <g transform={`translate(${issuanceData[hoveredIndex].x}, ${issuanceData[hoveredIndex].y - 12})`} className="pointer-events-none z-20">
                            {/* Background rect with shadow */}
                            <rect
                              x="-55"
                              y="-42"
                              width="110"
                              height="38"
                              rx="8"
                              className="fill-black/95 stroke-accent-teal/30 stroke-[1px]"
                            />
                            <text
                              x="0"
                              y="-30"
                              textAnchor="middle"
                              className="fill-white/50 text-[7px] font-bold tracking-wider"
                            >
                              {issuanceData[hoveredIndex].month} MINT REPORT
                            </text>
                            <text
                              x="0"
                              y="-18"
                              textAnchor="middle"
                              className="fill-accent-teal text-[10px] font-black"
                            >
                              {issuanceData[hoveredIndex].amount.toLocaleString()} BCT
                            </text>
                            <text
                              x="0"
                              y="-8"
                              textAnchor="middle"
                              className="fill-emerald-400 text-[6.5px] font-bold"
                            >
                              {issuanceData[hoveredIndex].change} MoM
                            </text>
                          </g>
                        )}
                      </svg>
                    </div>
                  </div>

                  {/* Mint Records List */}
                  <div className="flex flex-col gap-2 mt-2">
                    <h4 className="text-[9px] font-bold tracking-widest text-white/40 uppercase">Ledger Mint Records</h4>
                    <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
                      <table className="w-full text-left border-collapse text-[10px]">
                        <thead>
                          <tr className="border-b border-white/10 text-white/40 bg-white/5 font-medium">
                            <th className="p-3 text-left">Period</th>
                            <th className="p-3 text-left">Credits Minted</th>
                            <th className="p-3 text-left">Verified CO2e</th>
                            <th className="p-3 text-left">Ledger Hash</th>
                            <th className="p-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {issuanceData.slice().reverse().map((d) => (
                            <tr key={d.month} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors duration-200">
                              <td className="p-3 text-left font-semibold text-white">{d.month} 2026</td>
                              <td className="p-3 text-left font-bold text-accent-teal">{d.amount.toLocaleString()} BCT</td>
                              <td className="p-3 text-left text-white/70">{d.amount.toLocaleString()} Tons</td>
                              <td className="p-3 text-left font-mono text-white/40">{d.hash}</td>
                              <td className="p-3 text-right">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold">
                                  CONFIRMED
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </SpotlightCard>
              );
            })()}

            {/* Sub-Tab 4: Restoration Heatmap */}
            {adminTab === 'heatmap' && (
              <SpotlightCard className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-4 animate-fade-in shadow-xl">
                <h3 className="text-sm font-semibold text-white">Coastline Canopy Restoration Density</h3>
                <p className="text-xs text-white/60">India coastal satellite analysis identifying active carbon sinks.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  <SpotlightCard className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                    <h4 className="text-xs font-bold text-white">Sector A: Sunderbans Delta</h4>
                    <span className="text-[10px] text-accent-teal font-semibold">Glow Intensity: High (84% Density)</span>
                  </SpotlightCard>
                  <SpotlightCard className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                    <h4 className="text-xs font-bold text-white">Sector B: Gulf of Kutch</h4>
                    <span className="text-[10px] text-amber-300 font-semibold">Glow Intensity: Medium (38% Density)</span>
                  </SpotlightCard>
                </div>
              </SpotlightCard>
            )}

            {/* Sub-Tab 5: Reports */}
            {adminTab === 'reports' && (
              <SpotlightCard className="p-6 rounded-3xl bg-black/65 border border-white/5 flex flex-col gap-4 animate-fade-in shadow-xl">
                <h3 className="text-sm font-semibold text-white">National Ecological Verification Reports</h3>
                
                <div className="flex flex-col gap-3">
                  <SpotlightCard className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-accent-teal" />
                      <div>
                        <h4 className="text-xs font-bold text-white">Quarterly Canopy Biomass Review (Q1 2026)</h4>
                        <span className="text-[9px] text-white/40">Verified by satellite Sentinel-2B</span>
                      </div>
                    </div>
                    <button className="text-[10px] text-accent-teal hover:underline flex items-center gap-1 cursor-pointer">
                      <span>View PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </SpotlightCard>
                </div>
              </SpotlightCard>
            )}

          </main>
        </div>
      )}

      {/* --- 6. Web3 TOKEN DETAILS CARD VIEW --- */}
      {view === 'token_detail' && (
        <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-6 animate-fade-in bg-black/60">
          
          {/* Close button that returns to previous dashboard view */}
          <div className="absolute top-6 right-6 z-50">
            <MagneticButton
              onClick={() => setView(prevView)}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg"
            >
              <X className="w-5 h-5" />
            </MagneticButton>
          </div>

          {/* Large Shimmering BCT Token card */}
          <SpotlightCard className="w-full max-w-xl p-8 rounded-3xl bg-black/75 animate-shimmer-border flex flex-col gap-6 relative overflow-hidden">
            
            {/* Header section with badge */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent-teal/15 flex items-center justify-center border border-accent-teal/20">
                  <Leaf className="w-4 h-4 text-accent-teal" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white">Blue Carbon Token</h2>
                  <span className="text-[9px] tracking-widest text-accent-teal font-bold uppercase">MINT METADATA REGISTRY</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-teal/10 text-accent-teal text-[10px] font-bold border border-accent-teal/20">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>BCT Badge</span>
              </div>
            </div>

            {/* Token specs (Two columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs border-b border-white/5 pb-6">
              
              <div className="flex flex-col gap-1 border-b border-white/5 pb-2 md:border-none md:pb-0">
                <span className="text-white/40">Token ID</span>
                <span className="text-white font-mono font-bold">{activeToken.id}</span>
              </div>

              <div className="flex flex-col gap-1 border-b border-white/5 pb-2 md:border-none md:pb-0">
                <span className="text-white/40">GPS Coordinates</span>
                <span className="text-white font-semibold">{activeToken.gps}</span>
              </div>

              <div className="flex flex-col gap-1 border-b border-white/5 pb-2 md:border-none md:pb-0">
                <span className="text-white/40">Species Type</span>
                <span className="text-white font-semibold">{activeToken.species}</span>
              </div>

              <div className="flex flex-col gap-1 border-b border-white/5 pb-2 md:border-none md:pb-0">
                <span className="text-white/40">Restoration Area (ha)</span>
                <span className="text-white font-semibold">{activeToken.area} Hectares</span>
              </div>

              <div className="flex flex-col gap-1 border-b border-white/5 pb-2 md:border-none md:pb-0">
                <span className="text-white/40">CO2e Value (tonnes)</span>
                <span className="text-accent-teal font-bold">{activeToken.co2e} Metric Tons</span>
              </div>

              <div className="flex flex-col gap-1 border-b border-white/5 pb-2 md:border-none md:pb-0">
                <span className="text-white/40">Mint Date</span>
                <span className="text-white font-semibold">{activeToken.date}</span>
              </div>

              <div className="flex flex-col gap-1 md:col-span-2 border-b border-white/5 pb-2">
                <span className="text-white/40">NGO Wallet Address</span>
                <span className="text-white/80 font-mono text-[10px] break-all">
                  {activeToken.wallet}
                </span>
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-white/40">Blockchain Transaction Hash</span>
                <span className="text-white/80 font-mono text-[10px] break-all">
                  {activeToken.txHash}
                </span>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-3">
              {verifying ? (
                <div className="w-full py-3.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-xs font-semibold text-white">
                  <Loader2 className="w-4 h-4 text-accent-teal animate-spin" />
                  <span>
                    {verificationProgress === 1 && 'Locating GPS node details...'}
                    {verificationProgress === 2 && 'Querying carbon biomass indices...'}
                    {verificationProgress === 3 && 'Evaluating consensus signatures...'}
                    {verificationProgress === 4 && 'Ledger verified!'}
                  </span>
                </div>
              ) : (
                <MagneticButton
                  onClick={triggerVerification}
                  className="w-full py-3.5 rounded-full bg-transparent border border-accent-teal text-accent-teal hover:bg-accent-teal/5 flex items-center justify-center gap-2 text-xs font-bold"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify on Chain</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </MagneticButton>
              )}
            </div>

          </SpotlightCard>

        </div>
      )}

    </div>
  )
}

export default App
