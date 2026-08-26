import { useState, useRef } from 'react'

// ── Types ──────────────────────────────────────────────────────────
interface ContentItem {
  id: number
  title: string
  type: 'movie' | 'show'
  year: string
  rating: string
  match: number
  duration: string
  genres: string[]
  description: string
  img: string
  poster: string
  badge?: string
  top10?: boolean
}

// ── Image helpers ──────────────────────────────────────────────────
const L = (id: string, w = 400, h = 225) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`
const P = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=300&h=450&fit=crop&auto=format`

// Landscape image IDs
const LI = [
  '1524712245354-2c4e5e7121c0',
  '1489846986031-7cea03ab8fd0',
  '1633885274919-04b5af171f8c',
  '1629278357549-b413116d211c',
  '1719413048888-b66179deb254',
  '1612523758115-a9a80ee943a7',
  '1602502047619-a5d9bc76b3c4',
  '1671624791386-0581b0f5c836',
]

// Portrait image IDs
const PI = [
  '1634733049839-0292be607569',
  '1592700819903-308f4820372d',
  '1516117525866-d85459db7457',
  '1637059880830-59a90102de77',
  '1525547843489-d0aab95e5ce1',
  '1506863530036-1efeddceb993',
  '1555816687-434033d6739a',
  '1764017884272-243668beec78',
  '1760260623945-07314e790eeb',
  '1770748034082-9d361a172412',
]

// ── Data ───────────────────────────────────────────────────────────
const newOnStreamflix: ContentItem[] = [
  { id: 1, title: 'Our Sticky Love', type: 'show', year: '2025', rating: 'TV-14', match: 94, duration: '1 Season', genres: ['Romance', 'Drama'], description: 'Two strangers find themselves inexplicably drawn to each other across different worlds in this emotional Korean drama.', img: L(LI[0]), poster: P(PI[0]), badge: 'Recently Added', top10: true },
  { id: 2, title: 'The Last House', type: 'movie', year: '2025', rating: 'R', match: 87, duration: '1h 58m', genres: ['Thriller', 'Horror'], description: 'A family discovers their remote vacation home holds terrifying secrets buried beneath its walls.', img: L(LI[1]), poster: P(PI[1]) },
  { id: 3, title: 'Outer Banks', type: 'show', year: '2025', rating: 'TV-MA', match: 96, duration: '4 Seasons', genres: ['Adventure', 'Mystery'], description: 'A tight-knit group of teens embark on a treasure hunt that unearths far more than gold — and puts their lives at risk.', img: L(LI[2]), poster: P(PI[2]), badge: 'New Season' },
  { id: 4, title: 'Classroom of the Elite', type: 'show', year: '2025', rating: 'TV-14', match: 91, duration: '3 Seasons', genres: ['Drama', 'Thriller'], description: 'At Japan\'s most elite school, students wage psychological warfare for class supremacy.', img: L(LI[3]), poster: P(PI[3]), badge: 'New Season', top10: true },
  { id: 5, title: 'Mickey 17', type: 'movie', year: '2025', rating: 'PG-13', match: 89, duration: '2h 17m', genres: ['Sci-Fi', 'Action'], description: 'An expendable employee on an interstellar colonization mission is sent to die — again and again.', img: L(LI[4]), poster: P(PI[4]) },
  { id: 6, title: 'My Life with Walter Boys', type: 'show', year: '2025', rating: 'TV-14', match: 88, duration: '2 Seasons', genres: ['Romance', 'Coming of Age'], description: 'After a family tragedy, a city girl moves to Colorado and navigates life among a sprawling chaotic family.', img: L(LI[5]), poster: P(PI[5]), badge: 'New Season', top10: true },
  { id: 7, title: 'Night Shift', type: 'show', year: '2025', rating: 'TV-MA', match: 85, duration: '1 Season', genres: ['Crime', 'Drama'], description: 'A detective working the night shift uncovers a conspiracy that reaches the highest levels of power.', img: L(LI[6]), poster: P(PI[6]), badge: 'Recently Added' },
  { id: 8, title: 'Shadow Protocol', type: 'movie', year: '2025', rating: 'R', match: 82, duration: '1h 45m', genres: ['Action', 'Thriller'], description: 'A covert operative races against time to stop a rogue AI before it triggers global collapse.', img: L(LI[7]), poster: P(PI[7]) },
]

const top10Movies: ContentItem[] = [
  { id: 11, title: 'Facing El Chapo', type: 'movie', year: '2025', rating: 'TV-MA', match: 95, duration: '1h 52m', genres: ['Crime', 'Documentary'], description: 'An unprecedented look at the rise and fall of the most powerful drug lord in history.', img: L(LI[0]), poster: P(PI[0]), badge: 'Recently Added' },
  { id: 12, title: 'Cradle to the Grave', type: 'movie', year: '2025', rating: 'R', match: 88, duration: '1h 41m', genres: ['Action', 'Crime'], description: 'A thief and a martial arts expert join forces in a desperate hunt for stolen black diamonds.', img: L(LI[1]), poster: P(PI[1]) },
  { id: 13, title: 'Ganito, Ganyan, Ganoon', type: 'movie', year: '2025', rating: 'PG', match: 92, duration: '1h 55m', genres: ['Drama', 'Romance'], description: 'A heartfelt story of love and resilience spanning generations of Filipino families.', img: L(LI[2]), poster: P(PI[2]), badge: 'Recently Added' },
  { id: 14, title: 'Mickey 17', type: 'movie', year: '2025', rating: 'PG-13', match: 89, duration: '2h 17m', genres: ['Sci-Fi', 'Action'], description: 'An expendable worker on an interstellar mission keeps dying and being reprinted.', img: L(LI[3]), poster: P(PI[3]), badge: 'Recently Added' },
  { id: 15, title: 'The Last House', type: 'movie', year: '2025', rating: 'R', match: 87, duration: '1h 58m', genres: ['Thriller', 'Horror'], description: 'A family discovers their remote vacation home holds unimaginable horrors.', img: L(LI[4]), poster: P(PI[4]), badge: 'Recently Added' },
  { id: 16, title: 'Insidious: The Red Door', type: 'movie', year: '2025', rating: 'PG-13', match: 84, duration: '1h 47m', genres: ['Horror', 'Supernatural'], description: 'The Lambert family must go deeper into the Further to face the demons from their past.', img: L(LI[5]), poster: P(PI[5]) },
  { id: 17, title: 'Blood Oath', type: 'movie', year: '2025', rating: 'R', match: 80, duration: '1h 38m', genres: ['Crime', 'Thriller'], description: 'A mob enforcer makes a dangerous deal with the FBI — and puts everything he loves at risk.', img: L(LI[6]), poster: P(PI[6]) },
  { id: 18, title: 'Nightfall', type: 'movie', year: '2025', rating: 'PG-13', match: 78, duration: '1h 53m', genres: ['Action', 'Sci-Fi'], description: 'When the sun disappears without warning, humanity has 24 hours to survive in absolute darkness.', img: L(LI[7]), poster: P(PI[7]) },
  { id: 19, title: 'Steel Curtain', type: 'movie', year: '2025', rating: 'R', match: 76, duration: '2h 05m', genres: ['War', 'Drama'], description: 'Four soldiers trapped behind enemy lines must decide what loyalty — and survival — truly means.', img: L(LI[0]), poster: P(PI[8]) },
  { id: 20, title: 'The River Between', type: 'movie', year: '2025', rating: 'TV-14', match: 74, duration: '1h 44m', genres: ['Drama', 'Romance'], description: 'A forbidden love story unfolds across opposing sides of a long-standing conflict.', img: L(LI[1]), poster: P(PI[9]) },
]

const top10TVShows: ContentItem[] = [
  { id: 21, title: 'Someone Someday', type: 'show', year: '2025', rating: 'TV-14', match: 96, duration: '1 Season', genres: ['Romance', 'Drama'], description: 'Fate brings two strangers together and forces them to decide if their connection is worth the cost.', img: L(LI[2]), poster: P(PI[0]), badge: 'New Episode' },
  { id: 22, title: 'Our Sticky Love', type: 'show', year: '2025', rating: 'TV-14', match: 94, duration: '1 Season', genres: ['Romance', 'Drama'], description: 'Two strangers find themselves inexplicably drawn to each other across different worlds.', img: L(LI[3]), poster: P(PI[1]), badge: 'Recently Added' },
  { id: 23, title: 'Spooky in Love', type: 'show', year: '2025', rating: 'TV-14', match: 91, duration: '1 Season', genres: ['Fantasy', 'Romance'], description: 'A ghost haunts the apartment of a girl who can inexplicably see him — and slowly falls in love.', img: L(LI[4]), poster: P(PI[2]), badge: 'New Episode' },
  { id: 24, title: 'Blood Sacrifice', type: 'show', year: '2025', rating: 'TV-MA', match: 88, duration: '1 Season', genres: ['Horror', 'Crime'], description: 'A detective tracks a serial killer whose murders follow chillingly precise ancient ritual patterns.', img: L(LI[5]), poster: P(PI[3]), badge: 'Recently Added' },
  { id: 25, title: 'WWE Raw', type: 'show', year: '2025', rating: 'TV-PG', match: 85, duration: 'Ongoing', genres: ['Sports', 'Entertainment'], description: 'Live professional wrestling action every week with the biggest names in sports entertainment.', img: L(LI[6]), poster: P(PI[4]), badge: 'New Episode' },
  { id: 26, title: 'S & X', type: 'show', year: '2025', rating: 'TV-MA', match: 82, duration: '1 Season', genres: ['Drama', 'Thriller'], description: 'In Silicon Valley\'s shadow, two tech rivals uncover secrets that could reshape the world.', img: L(LI[7]), poster: P(PI[5]), badge: 'Recently Added' },
  { id: 27, title: 'Classroom of the Elite', type: 'show', year: '2025', rating: 'TV-14', match: 80, duration: '3 Seasons', genres: ['Drama', 'Psychological'], description: 'At Japan\'s most competitive school, only strategic supremacy ensures survival.', img: L(LI[0]), poster: P(PI[6]) },
  { id: 28, title: 'Outer Banks', type: 'show', year: '2025', rating: 'TV-MA', match: 78, duration: '4 Seasons', genres: ['Adventure', 'Mystery'], description: 'A tight-knit group of teens risk everything chasing a legendary treasure.', img: L(LI[1]), poster: P(PI[7]), badge: 'New Episode' },
  { id: 29, title: 'The Last Stand', type: 'show', year: '2025', rating: 'TV-14', match: 76, duration: '2 Seasons', genres: ['Drama', 'Action'], description: 'A small-town sheriff takes on a cartel intent on using his community as a smuggling corridor.', img: L(LI[2]), poster: P(PI[8]) },
  { id: 30, title: 'Neon Noir', type: 'show', year: '2025', rating: 'TV-MA', match: 74, duration: '1 Season', genres: ['Crime', 'Neo-Noir'], description: 'A private detective navigates the neon-soaked underworld of a city that never sleeps.', img: L(LI[3]), poster: P(PI[9]) },
]

const worthTheWait: ContentItem[] = [
  { id: 31, title: 'Take Charge of My Heart', type: 'show', year: '2025', rating: 'TV-14', match: 90, duration: '1 Season', genres: ['Romance', 'Drama'], description: 'A woman rebuilds her life after heartbreak with the help of an unexpected and tender connection.', img: L(LI[4]), poster: P(PI[4]) },
  { id: 32, title: 'Animals', type: 'movie', year: '2025', rating: 'R', match: 86, duration: '1h 52m', genres: ['Drama', 'Crime'], description: 'Two childhood friends spiral deep into the Dublin drug scene, unable to find their way back out.', img: L(LI[5]), poster: P(PI[5]) },
  { id: 33, title: 'Cyberpunk: Edgerunners II', type: 'show', year: '2025', rating: 'TV-MA', match: 97, duration: '1 Season', genres: ['Anime', 'Sci-Fi'], description: 'Return to Night City in a brutal new story of mercenaries living — and dying — on the edge.', img: L(LI[6]), poster: P(PI[6]) },
  { id: 34, title: 'Wonka: Golden Ticket', type: 'show', year: '2025', rating: 'PG', match: 88, duration: '1 Season', genres: ['Fantasy', 'Family'], description: 'A competition series where contestants race across the globe to find Wonka\'s legendary golden tickets.', img: L(LI[7]), poster: P(PI[7]) },
  { id: 35, title: 'LEGO One Piece', type: 'show', year: '2025', rating: 'TV-Y7', match: 85, duration: '1 Season', genres: ['Animation', 'Adventure'], description: 'The Straw Hat crew\'s grandest adventure reimagined in an all-new LEGO animated series.', img: L(LI[0]), poster: P(PI[0]) },
  { id: 36, title: 'Shaque: Trust No One', type: 'show', year: '2025', rating: 'TV-MA', match: 83, duration: '1 Season', genres: ['Thriller', 'Mystery'], description: 'A journalist in Karachi uncovers corruption stretching from the streets to the highest halls of power.', img: L(LI[1]), poster: P(PI[1]) },
  { id: 37, title: 'The Underground', type: 'movie', year: '2025', rating: 'R', match: 79, duration: '2h 10m', genres: ['Historical', 'Drama'], description: 'An extraordinary escape story told through the perspective of the people who made it possible.', img: L(LI[2]), poster: P(PI[2]) },
]

const comingThisWeek: ContentItem[] = [
  { id: 41, title: 'Grand Theft Auto: Extended Look', type: 'show', year: '2025', rating: 'TV-MA', match: 93, duration: 'Special', genres: ['Gaming', 'Documentary'], description: 'An exclusive extended look behind the scenes of the most anticipated game release in history.', img: L(LI[3]), poster: P(PI[3]) },
  { id: 42, title: 'Four Hands, Two Sonatas', type: 'movie', year: '2025', rating: 'PG', match: 89, duration: '1h 47m', genres: ['Romance', 'Drama'], description: 'Two rival concert pianists discover their fiercest competition may be the love growing between them.', img: L(LI[4]), poster: P(PI[4]) },
  { id: 43, title: 'Mousetrap', type: 'movie', year: '2025', rating: 'PG', match: 87, duration: '1h 52m', genres: ['Mystery', 'Thriller'], description: 'The world\'s longest-running stage murder mystery is reimagined in a gripping film adaptation.', img: L(LI[5]), poster: P(PI[5]) },
  { id: 44, title: 'The Whisper Man', type: 'movie', year: '2025', rating: 'R', match: 85, duration: '1h 59m', genres: ['Horror', 'Thriller'], description: 'A father and son move to a new town still haunted by the legend of a killer who whispers at windows.', img: L(LI[6]), poster: P(PI[6]) },
  { id: 45, title: 'Call Me Mother', type: 'show', year: '2025', rating: 'TV-PG', match: 82, duration: '1 Season', genres: ['Family', 'Fantasy'], description: 'A young girl discovers her mother is a legendary warrior guardian of a hidden magical world.', img: L(LI[7]), poster: P(PI[7]) },
  { id: 46, title: 'Gohan', type: 'show', year: '2025', rating: 'TV-14', match: 80, duration: '1 Season', genres: ['Anime', 'Action'], description: 'After Earth\'s greatest battle, Son Gohan steps out from his father\'s shadow to forge his own legacy.', img: L(LI[0]), poster: P(PI[8]) },
  { id: 47, title: 'Havisham', type: 'show', year: '2025', rating: 'TV-14', match: 78, duration: '1 Season', genres: ['Period Drama', 'Romance'], description: 'The iconic Miss Havisham is reimagined in a sweeping period drama told entirely from her perspective.', img: L(LI[1]), poster: P(PI[9]) },
]

const comingNextWeek: ContentItem[] = [
  { id: 51, title: 'Lake Placid 2', type: 'movie', year: '2025', rating: 'R', match: 77, duration: '1h 32m', genres: ['Horror', 'Action'], description: 'A new generation of monstrous crocodiles emerges to terrorize a remote lakeside community.', img: L(LI[2]), poster: P(PI[2]) },
  { id: 52, title: 'The Breadwinner', type: 'movie', year: '2025', rating: 'PG', match: 88, duration: '1h 34m', genres: ['Animation', 'Drama'], description: 'A young Afghan girl disguises herself as a boy to support her family and find her missing father.', img: L(LI[3]), poster: P(PI[3]) },
  { id: 53, title: 'Lake Placid: The Final Chapter', type: 'movie', year: '2025', rating: 'R', match: 75, duration: '1h 40m', genres: ['Horror', 'Action'], description: 'One final confrontation with the prehistoric predators of Lake Placid.', img: L(LI[4]), poster: P(PI[4]) },
  { id: 54, title: 'The Little Things', type: 'movie', year: '2025', rating: 'R', match: 83, duration: '2h 07m', genres: ['Crime', 'Thriller'], description: 'A deputy sheriff and a detective partner across California in pursuit of an elusive serial killer.', img: L(LI[5]), poster: P(PI[5]) },
  { id: 55, title: 'Sneaky Pete', type: 'show', year: '2025', rating: 'TV-MA', match: 86, duration: '3 Seasons', genres: ['Crime', 'Drama'], description: 'A con man on the run hides from his criminal past by assuming his cellmate\'s identity and family.', img: L(LI[6]), poster: P(PI[6]) },
  { id: 56, title: 'Why Did I Get Married Again?', type: 'movie', year: '2025', rating: 'PG-13', match: 79, duration: '1h 41m', genres: ['Comedy', 'Drama'], description: 'Four couples reunite for their annual vacation and find their marriages tested in unexpected ways.', img: L(LI[7]), poster: P(PI[7]) },
  { id: 57, title: 'The Night Riders', type: 'show', year: '2025', rating: 'TV-14', match: 74, duration: '1 Season', genres: ['Western', 'Mystery'], description: 'Three outlaws ride the frontier searching for justice — and redemption — in a land without law.', img: L(LI[0]), poster: P(PI[8]) },
]

const ALL_ITEMS = [
  ...newOnStreamflix,
  ...top10Movies,
  ...top10TVShows,
  ...worthTheWait,
  ...comingThisWeek,
  ...comingNextWeek,
]

// ── Small components ───────────────────────────────────────────────

function Badge({ label }: { label: string }) {
  return (
    <span
      className="inline-block text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm leading-none"
      style={{ backgroundColor: '#49111C', color: '#F2F4F3' }}
    >
      {label}
    </span>
  )
}

function PlayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function ThumbUpIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
      <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
    </svg>
  )
}

function ChevronDownIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function ChevronLeftIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

// ── Navbar ─────────────────────────────────────────────────────────

interface NavbarProps {
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
  searchQuery: string
  setSearchQuery: (v: string) => void
  notifOpen: boolean
  setNotifOpen: (v: boolean) => void
  profileOpen: boolean
  setProfileOpen: (v: boolean) => void
}

function Navbar({
  searchOpen, setSearchOpen, searchQuery, setSearchQuery,
  notifOpen, setNotifOpen, profileOpen, setProfileOpen,
}: NavbarProps) {
  const navItems = ['Home', 'TV Shows', 'Movies']
  const activeItem = 'New & Popular'

  const closeAll = () => {
    setNotifOpen(false)
    setProfileOpen(false)
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 flex items-center px-6 md:px-12 py-3 gap-4"
      style={{ backgroundColor: '#0A0908', borderBottom: '1px solid rgba(94,80,63,0.25)' }}
    >
      {/* Logo */}
      <span
        className="font-display font-black text-2xl tracking-wider flex-shrink-0 mr-2"
        style={{ color: '#F2F4F3' }}
      >
        STREAM<span style={{ color: '#49111C' }}>FLIX</span>
      </span>

      {/* Nav links — hidden on mobile */}
      <div className="hidden md:flex items-center gap-5 text-sm">
        {navItems.map(item => (
          <a
            key={item}
            href="#"
            className="transition-colors"
            style={{ color: '#A9927D' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F2F4F3')}
            onMouseLeave={e => (e.currentTarget.style.color = '#A9927D')}
          >
            {item}
          </a>
        ))}
        <span
          className="font-semibold relative text-sm"
          style={{ color: '#F2F4F3' }}
        >
          {activeItem}
          <span
            className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
            style={{ backgroundColor: '#49111C' }}
          />
        </span>
        <a
          href="#"
          className="transition-colors text-sm"
          style={{ color: '#A9927D' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#F2F4F3')}
          onMouseLeave={e => (e.currentTarget.style.color = '#A9927D')}
        >
          My List
        </a>
      </div>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-3">
        {/* Search */}
        {searchOpen ? (
          <div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm"
            style={{ border: '1px solid #49111C', backgroundColor: 'rgba(10,9,8,0.95)' }}
          >
            <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#A9927D' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Titles, people, genres"
              className="bg-transparent outline-none text-sm w-44"
              style={{ color: '#F2F4F3', caretColor: '#F2F4F3' }}
              onBlur={() => { if (!searchQuery) setSearchOpen(false) }}
            />
          </div>
        ) : (
          <button
            onClick={() => { setSearchOpen(true); closeAll() }}
            className="transition-opacity hover:opacity-70"
            style={{ color: '#F2F4F3' }}
            title="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
            className="relative transition-opacity hover:opacity-70"
            style={{ color: '#F2F4F3' }}
            title="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span
              className="absolute -top-1 -right-1 w-4 h-4 text-[9px] flex items-center justify-center rounded-full font-bold"
              style={{ backgroundColor: '#49111C', color: '#F2F4F3' }}
            >
              3
            </span>
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-9 w-80 rounded-md shadow-2xl overflow-hidden"
              style={{ backgroundColor: '#141210', border: '1px solid #5E503F' }}
            >
              <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(94,80,63,0.4)' }}>
                <p className="font-semibold text-sm" style={{ color: '#F2F4F3', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.05em' }}>
                  NOTIFICATIONS
                </p>
              </div>
              {[
                { title: 'Mickey 17', msg: 'Now streaming on StreamFlix', time: '2h ago', unread: true },
                { title: 'Outer Banks Season 4', msg: 'New season is now available', time: '1d ago', unread: true },
                { title: 'The Whisper Man', msg: 'Your saved title is coming soon', time: '2d ago', unread: false },
              ].map((n, i) => (
                <div
                  key={i}
                  className="px-4 py-3 flex gap-3 cursor-pointer transition-colors"
                  style={{ borderBottom: i < 2 ? '1px solid rgba(94,80,63,0.2)' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div
                    className="w-2 h-2 mt-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: n.unread ? '#49111C' : '#5E503F' }}
                  />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#F2F4F3' }}>{n.title}</p>
                    <p className="text-xs" style={{ color: '#A9927D' }}>{n.msg}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#5E503F' }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
            className="flex items-center gap-1.5"
          >
            <div
              className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm font-display"
              style={{ backgroundColor: '#49111C', color: '#F2F4F3' }}
            >
              A
            </div>
            <ChevronDownIcon
              size={12}
              className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-10 w-52 rounded-md shadow-2xl overflow-hidden"
              style={{ backgroundColor: '#141210', border: '1px solid #5E503F' }}
            >
              {['Manage Profiles', 'Transfer Profile', 'Account', 'Help Center', 'Sign out of StreamFlix'].map((item, i, arr) => (
                <a
                  key={item}
                  href="#"
                  className="block px-4 py-2.5 text-sm transition-colors"
                  style={{
                    color: '#A9927D',
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(94,80,63,0.2)' : 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F2F4F3')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#A9927D')}
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

// ── Content Card ────────────────────────────────────────────────────

function ContentCard({
  item,
  onOpenModal,
}: {
  item: ContentItem
  onOpenModal: (item: ContentItem) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [inMyList, setInMyList] = useState(false)

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer group"
      style={{ width: 'clamp(160px, 16vw, 220px)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden rounded-md transition-transform duration-300"
        style={{
          aspectRatio: '16/9',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          zIndex: hovered ? 10 : 1,
          boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.7)' : 'none',
        }}
      >
        <img src={item.img} alt={item.title} className="w-full h-full object-cover" />

        {/* Top-left top10 badge */}
        {item.top10 && !hovered && (
          <div className="absolute top-1.5 left-1.5">
            <Badge label="Top 10" />
          </div>
        )}

        {/* Bottom badge */}
        {item.badge && !hovered && (
          <div className="absolute bottom-1.5 left-1.5">
            <Badge label={item.badge} />
          </div>
        )}

        {/* Hover overlay */}
        {hovered && (
          <div
            className="absolute inset-0 flex flex-col justify-end p-2.5"
            style={{ background: 'linear-gradient(to top, rgba(10,9,8,0.95) 0%, rgba(10,9,8,0.6) 50%, transparent 100%)' }}
          >
            <p
              className="font-display font-bold text-sm leading-tight mb-1 uppercase tracking-wide"
              style={{ color: '#F2F4F3' }}
            >
              {item.title}
            </p>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[11px] font-semibold" style={{ color: '#4ade80' }}>{item.match}%</span>
              <span className="text-[10px]" style={{ color: '#A9927D' }}>{item.year}</span>
              <span
                className="text-[9px] px-1 border"
                style={{ color: '#A9927D', borderColor: '#5E503F' }}
              >
                {item.rating}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#F2F4F3', color: '#0A0908' }}
                title="Play"
              >
                <PlayIcon size={12} />
              </button>
              <button
                onClick={() => setInMyList(!inMyList)}
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  border: `1.5px solid ${inMyList ? '#F2F4F3' : '#5E503F'}`,
                  color: inMyList ? '#4ade80' : '#F2F4F3',
                }}
                title={inMyList ? 'Remove from My List' : 'Add to My List'}
              >
                {inMyList ? (
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <PlusIcon size={12} />
                )}
              </button>
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:border-[#F2F4F3]"
                style={{ border: '1.5px solid #5E503F', color: '#F2F4F3' }}
                title="Like"
              >
                <ThumbUpIcon size={11} />
              </button>
              <button
                onClick={() => onOpenModal(item)}
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:border-[#F2F4F3] ml-auto"
                style={{ border: '1.5px solid #5E503F', color: '#F2F4F3' }}
                title="More Info"
              >
                <ChevronDownIcon size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Top 10 Item ─────────────────────────────────────────────────────

function Top10Item({
  item,
  rank,
  onOpenModal,
}: {
  item: ContentItem
  rank: number
  onOpenModal: (item: ContentItem) => void
}) {
  const [hovered, setHovered] = useState(false)
  const rankStr = rank.toString()
  // Wider for double-digit numbers
  const width = rank >= 10 ? 200 : 170

  return (
    <div
      className="relative flex-shrink-0 flex items-end cursor-pointer select-none"
      style={{ width: `${width}px`, height: '200px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Big outlined rank number */}
      <span
        className="absolute bottom-0 left-0 font-display font-black leading-none pointer-events-none"
        style={{
          fontSize: rank >= 10 ? '9.5rem' : '11rem',
          WebkitTextStroke: '2.5px #5E503F',
          color: 'transparent',
          lineHeight: 0.82,
          zIndex: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {rankStr}
      </span>

      {/* Portrait poster */}
      <div
        className="absolute right-0 bottom-0 rounded-md overflow-hidden transition-transform duration-300"
        style={{
          width: '95px',
          height: '143px',
          zIndex: 2,
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          boxShadow: hovered ? '0 6px 24px rgba(0,0,0,0.8)' : '2px 2px 12px rgba(0,0,0,0.5)',
        }}
      >
        <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />

        {/* Badge */}
        {item.badge && !hovered && (
          <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1" style={{ backgroundColor: 'rgba(10,9,8,0.85)' }}>
            <Badge label={item.badge} />
          </div>
        )}

        {/* Hover overlay */}
        {hovered && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: 'rgba(10,9,8,0.78)' }}
          >
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#F2F4F3', color: '#0A0908' }}
              title="Play"
            >
              <PlayIcon size={14} />
            </button>
            <button
              onClick={() => onOpenModal(item)}
              className="text-[10px] underline transition-opacity hover:opacity-70"
              style={{ color: '#F2F4F3' }}
            >
              More Info
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Row progress dots ───────────────────────────────────────────────

function RowDots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="inline-block rounded-full transition-all duration-200"
          style={{
            width: i === active ? '16px' : '8px',
            height: '2px',
            backgroundColor: i === active ? '#F2F4F3' : '#5E503F',
          }}
        />
      ))}
    </div>
  )
}

// ── Content Row (landscape cards) ──────────────────────────────────

function ContentRow({
  title,
  items,
  onOpenModal,
}: {
  title: string
  items: ContentItem[]
  onOpenModal: (item: ContentItem) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  const [rowHovered, setRowHovered] = useState(false)
  const [activePage, setActivePage] = useState(0)

  const PAGE_WIDTH = 700

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -PAGE_WIDTH : PAGE_WIDTH, behavior: 'smooth' })
  }

  const updateState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    const page = Math.round(el.scrollLeft / PAGE_WIDTH)
    setActivePage(page)
  }

  const totalPages = Math.ceil(items.length / 4)

  return (
    <section className="mb-8" onMouseEnter={() => setRowHovered(true)} onMouseLeave={() => setRowHovered(false)}>
      {/* Section header */}
      <div className="flex items-center justify-between px-6 md:px-12 mb-3">
        <h2
          className="font-display font-bold text-xl md:text-2xl uppercase tracking-wide"
          style={{ color: '#F2F4F3' }}
        >
          {title}
        </h2>
        <div
          className="transition-opacity duration-200"
          style={{ opacity: rowHovered ? 1 : 0 }}
        >
          <RowDots total={totalPages} active={activePage} />
        </div>
      </div>

      {/* Scrollable row */}
      <div className="relative">
        {/* Left gradient + arrow */}
        {canLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center w-10 md:w-14 transition-opacity duration-200"
            style={{
              background: 'linear-gradient(to right, #0A0908, transparent)',
              opacity: rowHovered ? 1 : 0,
              color: '#F2F4F3',
            }}
          >
            <ChevronLeftIcon />
          </button>
        )}

        {/* Right gradient + arrow */}
        {canRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center w-10 md:w-14 transition-opacity duration-200"
            style={{
              background: 'linear-gradient(to left, #0A0908, transparent)',
              opacity: rowHovered ? 1 : 0,
              color: '#F2F4F3',
            }}
          >
            <ChevronRightIcon />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto px-6 md:px-12 pb-4 no-scrollbar"
          onScroll={updateState}
          style={{ scrollSnapType: 'x proximity' }}
        >
          {items.map(item => (
            <ContentCard key={item.id} item={item} onOpenModal={onOpenModal} />
          ))}
          {/* Partial reveal spacer */}
          <div className="flex-shrink-0 w-4" />
        </div>
      </div>
    </section>
  )
}

// ── Top 10 Row ──────────────────────────────────────────────────────

function Top10Row({
  title,
  items,
  onOpenModal,
}: {
  title: string
  items: ContentItem[]
  onOpenModal: (item: ContentItem) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  const [rowHovered, setRowHovered] = useState(false)
  const [activePage, setActivePage] = useState(0)

  const PAGE_WIDTH = 700

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -PAGE_WIDTH : PAGE_WIDTH, behavior: 'smooth' })
  }

  const updateState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    setActivePage(Math.round(el.scrollLeft / PAGE_WIDTH))
  }

  const totalPages = Math.ceil(items.length / 5)

  return (
    <section className="mb-10" onMouseEnter={() => setRowHovered(true)} onMouseLeave={() => setRowHovered(false)}>
      <div className="flex items-center justify-between px-6 md:px-12 mb-3">
        <h2
          className="font-display font-bold text-xl md:text-2xl uppercase tracking-wide"
          style={{ color: '#F2F4F3' }}
        >
          {title}
        </h2>
        <div
          className="transition-opacity duration-200"
          style={{ opacity: rowHovered ? 1 : 0 }}
        >
          <RowDots total={totalPages} active={activePage} />
        </div>
      </div>

      <div className="relative">
        {canLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center w-10 md:w-14 transition-opacity duration-200"
            style={{
              background: 'linear-gradient(to right, #0A0908, transparent)',
              opacity: rowHovered ? 1 : 0,
              color: '#F2F4F3',
            }}
          >
            <ChevronLeftIcon />
          </button>
        )}

        {canRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center w-10 md:w-14 transition-opacity duration-200"
            style={{
              background: 'linear-gradient(to left, #0A0908, transparent)',
              opacity: rowHovered ? 1 : 0,
              color: '#F2F4F3',
            }}
          >
            <ChevronRightIcon />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto px-6 md:px-12 pb-4 no-scrollbar"
          onScroll={updateState}
          style={{ scrollSnapType: 'x proximity' }}
        >
          {items.map((item, i) => (
            <Top10Item key={item.id} item={item} rank={i + 1} onOpenModal={onOpenModal} />
          ))}
          <div className="flex-shrink-0 w-4" />
        </div>
      </div>
    </section>
  )
}

// ── Movie Modal ─────────────────────────────────────────────────────

function MovieModal({
  item,
  onClose,
}: {
  item: ContentItem
  onClose: () => void
}) {
  const [inMyList, setInMyList] = useState(false)
  const similar = ALL_ITEMS.filter(i => i.id !== item.id && i.genres.some(g => item.genres.includes(g))).slice(0, 6)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.82)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-2xl rounded-lg overflow-hidden"
        style={{ backgroundColor: '#141210' }}
      >
        {/* Backdrop image */}
        <div className="relative h-64 md:h-72">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, #141210 0%, rgba(20,18,16,0.4) 60%, transparent 100%)' }}
          />
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'rgba(10,9,8,0.85)', color: '#F2F4F3' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0A0908')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(10,9,8,0.85)')}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          {/* Title overlay */}
          <div className="absolute bottom-4 left-6">
            <h2
              className="font-display font-black text-3xl uppercase tracking-wide"
              style={{ color: '#F2F4F3' }}
            >
              {item.title}
            </h2>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-sm font-semibold text-sm transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#F2F4F3', color: '#0A0908' }}
            >
              <PlayIcon size={14} />
              Play
            </button>
            <button
              onClick={() => setInMyList(!inMyList)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{
                border: `2px solid ${inMyList ? '#4ade80' : '#5E503F'}`,
                color: inMyList ? '#4ade80' : '#F2F4F3',
              }}
              title={inMyList ? 'Remove from My List' : 'Add to My List'}
            >
              {inMyList ? (
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <PlusIcon size={14} />
              )}
            </button>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{ border: '2px solid #5E503F', color: '#F2F4F3' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#F2F4F3')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#5E503F')}
              title="Like"
            >
              <ThumbUpIcon size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-sm font-semibold" style={{ color: '#4ade80' }}>{item.match}% Match</span>
            <span className="text-sm" style={{ color: '#F2F4F3' }}>{item.year}</span>
            <span
              className="text-xs px-1.5 py-0.5 border"
              style={{ color: '#A9927D', borderColor: '#5E503F' }}
            >
              {item.rating}
            </span>
            <span className="text-sm" style={{ color: '#A9927D' }}>{item.duration}</span>
          </div>

          <p className="text-sm leading-relaxed mb-3" style={{ color: '#F2F4F3' }}>
            {item.description}
          </p>

          <p className="text-xs mb-1">
            <span style={{ color: '#5E503F' }}>Genres: </span>
            <span style={{ color: '#A9927D' }}>{item.genres.join(', ')}</span>
          </p>
          <p className="text-xs">
            <span style={{ color: '#5E503F' }}>Type: </span>
            <span style={{ color: '#A9927D' }}>{item.type === 'movie' ? 'Movie' : 'TV Show'}</span>
          </p>
        </div>

        {/* Similar titles */}
        {similar.length > 0 && (
          <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(94,80,63,0.3)' }}>
            <h3
              className="font-display font-bold text-sm uppercase tracking-widest mb-3"
              style={{ color: '#F2F4F3' }}
            >
              More Like This
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {similar.map(s => (
                <div
                  key={s.id}
                  className="rounded-md overflow-hidden cursor-pointer transition-opacity hover:opacity-75"
                  style={{ backgroundColor: '#1a1714' }}
                >
                  <img src={s.img} alt={s.title} className="w-full object-cover" style={{ aspectRatio: '16/9' }} />
                  <div className="p-1.5">
                    <p className="text-xs font-semibold truncate" style={{ color: '#F2F4F3' }}>{s.title}</p>
                    <p className="text-[10px]" style={{ color: '#A9927D' }}>{s.year} · {s.genres[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── App ─────────────────────────────────────────────────────────────

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [modalItem, setModalItem] = useState<ContentItem | null>(null)

  const openModal = (item: ContentItem) => {
    setModalItem(item)
    setNotifOpen(false)
    setProfileOpen(false)
  }

  const closeAll = () => {
    setNotifOpen(false)
    setProfileOpen(false)
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#0A0908' }}
      onClick={e => {
        const t = e.target as HTMLElement
        if (!t.closest('[data-dropdown]')) closeAll()
      }}
    >
      <Navbar
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notifOpen={notifOpen}
        setNotifOpen={setNotifOpen}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />

      <main className="pt-20 pb-16">
        <ContentRow title="New on StreamFlix" items={newOnStreamflix} onOpenModal={openModal} />
        <Top10Row title="Top 10 Movies in the Philippines Today" items={top10Movies} onOpenModal={openModal} />
        <Top10Row title="Top 10 TV Shows in the Philippines Today" items={top10TVShows} onOpenModal={openModal} />
        <ContentRow title="Worth the Wait" items={worthTheWait} onOpenModal={openModal} />
        <ContentRow title="Coming This Week" items={comingThisWeek} onOpenModal={openModal} />
        <ContentRow title="Coming Next Week" items={comingNextWeek} onOpenModal={openModal} />
      </main>

      {modalItem && (
        <MovieModal item={modalItem} onClose={() => setModalItem(null)} />
      )}
    </div>
  )
}
