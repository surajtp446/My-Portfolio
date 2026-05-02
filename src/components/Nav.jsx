import { useState, useEffect } from 'react'

const links = ['About','Experience','Projects','Achievements','Contact']

export default function Nav() {
  const [scrolled, setScrolled]   = useState(false)
  const [active,   setActive]     = useState('')
  const [mobileOpen, setMobile]   = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      let cur = ''
      links.forEach(l => {
        const el = document.getElementById(l.toLowerCase())
        if (el && window.scrollY >= el.offsetTop - 140) cur = l.toLowerCase()
      })
      setActive(cur)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    setMobile(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 68,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,.08)' : '1px solid transparent',
        background: scrolled ? 'rgba(0,0,0,.85)' : 'rgba(0,0,0,.3)',
        transition: 'all .4s ease',
      }}>
        <span style={{ fontFamily: 'var(--display)', fontSize: 20, letterSpacing: '.08em', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          SURAJ TP
        </span>

        <ul style={{ display: 'flex', gap: 36, listStyle: 'none', margin: 0, padding: 0 }}
          className="nav-ul">
          {links.map(l => (
            <li key={l}>
              <button onClick={() => scrollTo(l.toLowerCase())} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: active === l.toLowerCase() ? '#fff' : 'rgba(255,255,255,.5)',
                fontSize: 12, fontWeight: 500, letterSpacing: '.08em',
                textTransform: 'uppercase', fontFamily: 'var(--body)',
                transition: 'color .2s', padding: '4px 0',
              }}>
                {l}
              </button>
            </li>
          ))}
        </ul>

        <a href="mailto:Suryaprabhu125@gmail.com" style={{
          background: '#fff', color: '#000',
          padding: '8px 20px', fontSize: 11, fontWeight: 600,
          letterSpacing: '.1em', textTransform: 'uppercase',
          textDecoration: 'none', transition: 'opacity .2s',
        }} className="nav-ul">
          Hire Me
        </a>

        {/* Hamburger */}
        <button onClick={() => setMobile(o => !o)} style={{
          display: 'none', flexDirection: 'column', gap: 5,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 4,
        }} className="ham">
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 1.5, background: '#fff',
              transition: 'all .3s',
              transform: mobileOpen
                ? i === 0 ? 'rotate(45deg) translate(5px,5px)'
                : i === 2 ? 'rotate(-45deg) translate(5px,-5px)'
                : 'scaleX(0)' : 'none',
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: '#000', zIndex: 99,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 36,
        }}>
          {links.map(l => (
            <button key={l} onClick={() => scrollTo(l.toLowerCase())} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--display)', fontSize: 44, letterSpacing: '.04em',
              color: '#fff',
            }}>
              {l}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:860px) {
          .nav-ul { display: none !important; }
          .ham    { display: flex !important; }
        }
      `}</style>
    </>
  )
}
