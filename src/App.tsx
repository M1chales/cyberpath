import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Nav from './components/Nav'
import IncidentToast from './components/IncidentToast'
import SearchPalette from './components/SearchPalette'
import Home from './pages/Home'
import Curriculum from './pages/Curriculum'
import ModulePage from './pages/ModulePage'
import MasteryTrack from './pages/MasteryTrack'
import MasteryModulePage from './pages/MasteryModulePage'
import Progress from './pages/Progress'
import Careers from './pages/Careers'
import NotFound from './pages/NotFound'

// Games and the Console pull in real weight (data catalogs, the console-sim engine's UI, etc.)
// that most visitors reading lessons never need — split them into their own chunks so the
// homepage and curriculum stay fast for the audience this course is actually built for.
const GamesHub = lazy(() => import('./pages/GamesHub'))
const Console = lazy(() => import('./pages/Console'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const PhishingSpotter = lazy(() => import('./games/PhishingSpotter'))
const PacketDetective = lazy(() => import('./games/PacketDetective'))
const PortMatch = lazy(() => import('./games/PortMatch'))
const PasswordDojo = lazy(() => import('./games/PasswordDojo'))
const IRDrill = lazy(() => import('./games/IRDrill'))
const BreachDefend = lazy(() => import('./games/BreachDefend'))
const BreachAttack = lazy(() => import('./games/BreachAttack'))
const TerminalRange = lazy(() => import('./games/TerminalRange'))
const SimIncident = lazy(() => import('./games/SimIncident'))
const SimRecon = lazy(() => import('./games/SimRecon'))
const SimHardening = lazy(() => import('./games/SimHardening'))

function RouteFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center text-sm text-slate-500">
      Loading…
    </div>
  )
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      } else if (e.key === '/' && !isEditableTarget(e.target)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-[#05070a]">
      <Nav onSearchClick={() => setSearchOpen(true)} />
      {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} />}
      <main>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/module/:id" element={<ModulePage />} />
            <Route path="/mastery" element={<MasteryTrack />} />
            <Route path="/mastery/:id" element={<MasteryModulePage />} />
            <Route path="/games" element={<GamesHub />} />
            <Route path="/games/phishing-spotter" element={<PhishingSpotter />} />
            <Route path="/games/packet-detective" element={<PacketDetective />} />
            <Route path="/games/port-match" element={<PortMatch />} />
            <Route path="/games/password-dojo" element={<PasswordDojo />} />
            <Route path="/games/ir-drill" element={<IRDrill />} />
            <Route path="/games/breach-defend" element={<BreachDefend />} />
            <Route path="/games/breach-attack" element={<BreachAttack />} />
            <Route path="/games/terminal-range" element={<TerminalRange />} />
            <Route path="/games/sim-incident" element={<SimIncident />} />
            <Route path="/games/sim-recon" element={<SimRecon />} />
            <Route path="/games/sim-hardening" element={<SimHardening />} />
            <Route path="/console" element={<Console />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="border-t border-white/10 px-4 py-8 text-center text-xs text-slate-600">
        <p>
          cyberpath — a free, self-paced cybersecurity education. Practice offensive techniques only in isolated
          labs or systems you own or are explicitly authorized to test.
        </p>
        <p className="mt-2">
          All progress is stored only in your browser's local storage — nothing is sent to a server, and clearing
          your browser data or switching devices will reset it.
        </p>
      </footer>
      <IncidentToast />
    </div>
  )
}
