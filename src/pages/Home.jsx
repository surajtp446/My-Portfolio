import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Reveal } from '../components/Reveal.jsx'

/* ─── data ─────────────────────────────────────────────────────── */
const SKILLS = [
  'Drone Technology','SolidWorks','Fusion 360','FPV Systems',
  '3D Printing','Autonomous Systems','PCB Design','Aero-structure Design',
  'Carbon Fibre','Embedded Systems','Rapid Prototyping','C Programming',
  'Computer Vision','ArduPilot / PX4','BLDC Motor Tuning',
]

const TIMELINE = [
  { period:'2024 – Present', active:true,
    role:'B.E. Electronics & Communication — BMSCE, Bengaluru',
    desc:'Third-year student specialising in embedded systems, communication hardware, and drone technology. Applying coursework directly to national-level competitions and real-world engineering deliverables.',
    tags:['Embedded Systems','PCB Design','Electronics'] },
  { period:'2025', active:true,
    role:'SAE AeroTHON 2025 — Team Vice Captain · AIR 2 · ₹1,25,000',
    desc:'Led "Flying Phantoms" (10 members) to 2nd place All-India. Designed, built, tuned and flew a multirotor drone for disaster relief — autonomous object detection, obstacle navigation, and precision payload delivery.',
    tags:['Team Leadership','Autonomous Systems','Payload Delivery','Computer Vision'] },
  { period:'2024 – Present', active:true,
    role:"India's Fastest Drone — Aero-structure Designer · 329 km/h",
    desc:'Designed and optimised the full aerostructure for a drone that achieved a verified record speed of 329 km/h. High-speed aerodynamic analysis, structural integrity, and extreme weight reduction.',
    tags:['Aero-structure','High-Speed Aerodynamics','Performance Engineering'] },
  { period:'2025', active:true,
    role:'Defence Fixed-Wing Platform — 3D Printed UAV',
    desc:'Developed and supplied 3D-printed fixed-wing UAV platforms with integrated payload-release mechanisms to an authorised defence partner. ASA/PA6-CF airframe, 1400mm span, modular payload bay.',
    tags:['Fixed-Wing UAV','Rapid Prototyping','Defence Application'] },
  { period:'2023', active:true,
    role:'ADDC SAE India — 1st Place, Unique Technological Development',
    desc:'Designed a complete autonomous drone system with advanced flight control and navigation logic. Won First Place nationally in the Unique Technological Development Award category.',
    tags:['Autonomous Navigation','Flight Control','SAE India'] },
  { period:'2021 – Present', active:false,
    role:'Dr.PrinT — Nationwide 3D Printing Service',
    desc:'Operating a nationwide 3D printing service delivering prototypes and engineering components across India. 9 engineering-grade materials, expert material selection, quality control, and client consulting.',
    tags:['3D Printing','Rapid Prototyping','drprint.in'] },
  { period:'2020 – Present', active:false,
    role:'FPV Drone Piloting & Custom Building',
    desc:'5+ years designing, building, tuning, and flying high-performance FPV drones for racing and cinematic applications. Custom frame design, electronics integration, and advanced flight optimisation.',
    tags:['FPV Technology','Custom Builds','Cinematography'] },
]

const PROJECTS = [
  { n:'01', cat:'Drone Engineering · 2025',
    title:'SAE AeroTHON Disaster Response Drone',
    desc:'Multi-rotor platform for simulated disaster missions — manual obstacle navigation, autonomous object detection via computer vision, and precision payload delivery. Led team to AIR 2 nationally.' },
  { n:'02', cat:'Performance Engineering · 2024',
    title:"India's Fastest Drone — 329 km/h",
    desc:'Designed the full aerostructure for a record-breaking 329 km/h drone. High-speed aerodynamic analysis, structural load optimisation, and weight reduction at extreme velocity.' },
  { n:'03', cat:'Autonomous Systems · 2025',
    title:'QR Detection & Payload Delivery Drone',
    desc:'Autonomous system using computer vision for QR code detection, precise landing, and payload release. Accurate automated waypoint navigation with fail-safe protocols.' },
  { n:'04', cat:'Defence & Prototyping · 2025',
    title:'3D Printed Fixed-Wing UAV Platform',
    desc:'Fixed-wing UAV platforms with integrated payload-release mechanisms for an authorised defence partner. ASA/PA6-CF airframe, 1400mm span, modular payload bay.' },
  { n:'05', cat:'Autonomous Systems · 2023',
    title:'ADDC Autonomous Drone — 1st Place',
    desc:'Full autonomous drone system for SAE India ADDC. Advanced flight control integration and autonomous navigation logic. Won 1st Place in Unique Technological Development.' },
  { n:'06', cat:'CAD & Manufacturing',
    title:'Advanced F1 Working Model',
    desc:'3D-printed Formula 1 car prototype with complex geometries and composite material integration. Functional suspension geometry and aerodynamic surfaces for testing and exhibition.' },
  { n:'07', cat:'FPV Technology · 2021–Present',
    title:'Custom FPV Cinematic Drones',
    desc:'High-performance FPV platforms optimised for cinematic stability. Custom carbon frame design, camera integration, and flight parameter tuning for smooth professional footage.' },
  { n:'08', cat:'Prototyping · 2021–Present',
    title:'Dr.PrinT — Nationwide 3D Printing',
    desc:'Nationwide 3D printing operation delivering prototypes and engineering components across India. 9 engineering-grade materials, precision quality control at drprint.in.' },
  { n:'09', cat:'Embedded Systems · 2025',
    title:'Disaster Detection Sensor Platform',
    desc:'Autonomous drone for disaster detection and relief — rugged operation, integrated sensor arrays, stable payload deployment, resilient flight control in degraded environments.' },
]

const ACHIEVEMENTS = [
  { icon:'🥈', title:'AIR 2 — SAE AeroTHON 2025',
    desc:'2nd Place All-India multirotor drone national competition. Led team Flying Phantoms. Prize: ₹1,25,000.' },
  { icon:'🏆', title:'1st Place — ADDC SAE India 2023',
    desc:'Won the Unique Technological Development Award for a complete autonomous drone system at national level.' },
  { icon:'🥇', title:'5× First Place — Drone Competitions',
    desc:"St. Joseph's (2022, 2023), Global Academy (2023, 2024), NITTE Meenakshi (2023)." },
  { icon:'⚡', title:'FPV Champion — New Horizon 2024',
    desc:'Champion of the FPV Drone Race at New Horizon College of Engineering, Bengaluru.' },
  { icon:'🥈', title:'4× Second Place — NITK Surathkal',
    desc:'Podium finishes at NITK Surathkal drone competitions in 2022, 2023, and 2024.' },
  { icon:'🚀', title:'329 km/h — India Speed Record',
    desc:"Designed the aerostructure for India's fastest drone — verified top speed of 329 km/h." },
]

/* ─── animated counter ─────────────────────────────────────────── */
function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      let start = 0
      const isNum = !isNaN(Number(target))
      if (!isNum) { setVal(target); return }
      const end = Number(target)
      const dur = 1800
      const step = () => {
        start += dur / 60
        const p = Math.min(start / dur, 1)
        setVal(Math.round(p * end))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: .5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{typeof val === 'number' ? val : val}{suffix}</span>
}

/* ─── magnetic button ──────────────────────────────────────────── */
function MagBtn({ children, href, className, style, onClick }) {
  const ref = useRef(null)
  const onMove = e => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width  / 2) * .22
    const y = (e.clientY - r.top  - r.height / 2) * .22
    ref.current.style.transform = `translate(${x}px,${y}px)`
  }
  const onLeave = () => { ref.current.style.transform = 'translate(0,0)' }
  const props = { ref, onMouseMove: onMove, onMouseLeave: onLeave, style: { transition:'transform .4s ease', ...style } }
  if (href) return <a href={href} className={className} {...props}>{children}</a>
  return <button className={className} onClick={onClick} {...props}>{children}</button>
}

/* ─── particle canvas ──────────────────────────────────────────── */
function Particles() {
  const cvs = useRef(null)
  useEffect(() => {
    const c = cvs.current, ctx = c.getContext('2d')
    let W = c.width = window.innerWidth
    let H = c.height = window.innerHeight
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight }
    window.addEventListener('resize', resize)

    const N = 55
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.2 + .3,
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,.25)'
        ctx.fill()
      })
      pts.forEach((a, i) => {
        for (let j = i + 1; j < N; j++) {
          const b = pts[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 110) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(255,255,255,${.08 * (1 - d / 110)})`
            ctx.lineWidth = .5
            ctx.stroke()
          }
        }
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={cvs} style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:1 }} />
}

/* ─── main component ───────────────────────────────────────────── */
export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start','end start'] })
  const heroY   = useTransform(scrollYProgress, [0,1], ['0%','30%'])
  const heroOp  = useTransform(scrollYProgress, [0,.8], [1, 0])

  const [formSent, setFormSent] = useState(false)

  return (
    <div>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section id="hero" ref={heroRef} style={{
        minHeight:'100vh', display:'flex', alignItems:'center',
        paddingTop:88, position:'relative', overflow:'hidden', background:'var(--bg)',
      }}>
        <Particles />
        {/* big ambient glow */}
        <div style={{
          position:'absolute', top:'20%', left:'30%',
          width:600, height:600, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(255,255,255,.04) 0%, transparent 70%)',
          pointerEvents:'none', zIndex:1,
        }} />

        <motion.div className="wrap hero-motion-wrap" style={{ y: heroY, opacity: heroOp, position:'relative', zIndex:2, width:'100%', padding:'0 48px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 460px', gap:80, alignItems:'center' }}
            className="hero-grid">

            {/* left */}
            <div>
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:.7, ease:[.22,1,.36,1] }}>
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  background:'var(--glass)', border:'1px solid var(--glass-b)',
                  padding:'6px 16px', fontSize:11, fontWeight:500,
                  letterSpacing:'.12em', textTransform:'uppercase',
                  color:'var(--w60)', marginBottom:28,
                }}>
                  <span style={{ width:6, height:6, background:'#fff', borderRadius:'50%',
                    display:'block', animation:'blink 2s infinite' }} />
                  Open to Collaborations & Projects
                </div>
              </motion.div>

              <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:.8, delay:.1, ease:[.22,1,.36,1] }}
                style={{ fontFamily:'var(--display)', fontSize:'clamp(72px,10vw,130px)',
                  lineHeight:.88, letterSpacing:'.01em', color:'#fff', marginBottom:12 }}>
                SURAJ<br/>TP
              </motion.h1>

              <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:.7, delay:.2, ease:[.22,1,.36,1] }}
                style={{ fontFamily:'var(--display)', fontSize:'clamp(20px,2.8vw,38px)',
                  lineHeight:1, letterSpacing:'.06em', color:'var(--w25)', marginBottom:32 }}>
                Drone Engineer · 3D Print Expert
              </motion.p>

              <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:.7, delay:.3, ease:[.22,1,.36,1] }}
                style={{ fontSize:15, lineHeight:1.85, color:'var(--w60)', maxWidth:430, marginBottom:48 }}>
                Electronics & Communication Engineering student at BMSCE, Bengaluru.
                5+ years in drone technology, 3D printing, aero-structure design,
                and autonomous systems. AIR 2 SAE AeroTHON 2025.
              </motion.p>

              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:.7, delay:.4, ease:[.22,1,.36,1] }}
                style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                <MagBtn className="btn-p"
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior:'smooth' })}>
                  View Projects
                </MagBtn>
                <MagBtn className="btn-o"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior:'smooth' })}>
                  Get in Touch
                </MagBtn>
              </motion.div>
            </div>

            {/* right — intro photo */}
            <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
              transition={{ duration:.9, delay:.2, ease:[.22,1,.36,1] }}
              className="hero-photo-col"
              style={{ position:'relative' }}>
              <div style={{
                position:'absolute', inset:-1,
                background:'linear-gradient(135deg, rgba(255,255,255,.05), transparent 60%)',
                zIndex:1, pointerEvents:'none',
              }} />
              <img src="/intro.jpg" alt="Suraj TP"
                style={{ width:'100%', aspectRatio:'3/4', objectFit:'cover',
                  objectPosition:'top center', display:'block', filter:'grayscale(8%)' }} />

              {/* floating badge — college */}
              <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                transition={{ duration:.7, delay:.6 }}
                className="hero-badge-tl"
                style={{
                  position:'absolute', top:24, left:-20,
                  background:'var(--glass)', backdropFilter:'blur(14px)',
                  border:'1px solid var(--glass-b)', padding:'12px 16px',
                }}>
                <div style={{ fontSize:9, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--w25)', marginBottom:5 }}>Currently at</div>
                <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>BMSCE · ECE 3rd Year</div>
              </motion.div>

              {/* floating badge — experience */}
              <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                transition={{ duration:.7, delay:.7 }}
                className="hero-badge-br"
                style={{
                  position:'absolute', bottom:28, right:-20,
                  background:'var(--glass)', backdropFilter:'blur(14px)',
                  border:'1px solid var(--glass-b)', padding:'20px 24px',
                }}>
                <div style={{ fontFamily:'var(--display)', fontSize:44, lineHeight:1, color:'#fff' }}>5+</div>
                <div style={{ fontSize:10, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--w60)', marginTop:4 }}>Years Experience</div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* scroll hint */}
        <div style={{
          position:'absolute', bottom:36, left:'50%', transform:'translateX(-50%)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:8,
          fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.2em',
          textTransform:'uppercase', color:'var(--w25)', zIndex:2,
        }}>
          <div style={{
            width:1, height:56,
            background:'linear-gradient(to bottom,rgba(255,255,255,.3),transparent)',
            animation:'sline 2s ease-in-out infinite',
          }} />
          Scroll
        </div>

        <style>{`
          @keyframes blink{0%,100%{opacity:1}50%{opacity:.15}}
          @keyframes sline{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
        `}</style>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <div className='stats-strip-wrap' style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', padding:'52px 48px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', maxWidth:1160, margin:'0 auto' }}
          className="stats-grid">
          {[
            { n:'329', suf:'', label:'km/h Record Speed' },
            { n:'2',   suf:'nd', label:'AIR — SAE AeroTHON 2025' },
            { n:'5',   suf:'+', label:'National Wins' },
            { n:'125', suf:'K', label:'₹ Prize Money Won' },
          ].map((s,i) => (
            <Reveal key={i} delay={i} style={{ textAlign:'center', padding:'0 20px',
              borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontFamily:'var(--display)', fontSize:'clamp(36px,4.5vw,60px)',
                color:'#fff', letterSpacing:'.02em', lineHeight:1 }}>
                <Counter target={s.n} />{s.suf}
              </div>
              <div style={{ fontSize:11, color:'var(--w60)', letterSpacing:'.1em',
                textTransform:'uppercase', marginTop:8 }}>{s.label}</div>
            </Reveal>
          ))}
        </div>

      </div>

      {/* ═══════════════════ ABOUT ═══════════════════ */}
      <section id="about" className='sec' style={{ padding:'120px 48px', background:'var(--bg)' }}>
        <div className="wrap">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start' }}
            className="two-col">
            <div>
              <Reveal><p className="eyebrow">// who I am</p></Reveal>
              <Reveal delay={1}><h2 className="sec-title">Engineering<br/>meets obsession.</h2></Reveal>
              <Reveal delay={2}>
                <p style={{ fontSize:15, lineHeight:1.85, color:'var(--w60)', marginBottom:20 }}>
                  Third-year Electronics and Communication Engineering student at BMS College of Engineering, Bengaluru.
                  I've been building, flying, and printing for over 5 years — from running a nationwide 3D printing service
                  to designing the aerostructure for India's fastest drone at 329 km/h.
                </p>
                <p style={{ fontSize:15, lineHeight:1.85, color:'var(--w60)', marginBottom:32 }}>
                  My work spans autonomous systems, FPV technology, carbon fibre integration, and additive manufacturing.
                  I don't just study engineering — I ship it.
                </p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {SKILLS.map(s => (
                    <motion.span key={s}
                      whileHover={{ borderColor:'#fff', color:'#fff', scale:1.04 }}
                      style={{
                        padding:'5px 13px', border:'1px solid var(--border)',
                        fontSize:10, letterSpacing:'.08em', textTransform:'uppercase',
                        color:'var(--w60)', display:'inline-block', cursor:'default',
                        transition:'color .2s',
                      }}>
                      {s}
                    </motion.span>
                  ))}
                </div>
              </Reveal>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {[
                { n:'329', suf:' km/h', label:"Aerostructure I designed — India's fastest drone" },
                { n:'2',   suf:'nd AIR', label:'All India Rank — SAE AeroTHON 2025 National Competition' },
                { n:'1',   suf:'st Place', label:'ADDC SAE India — Unique Technological Development Award' },
                { n:'5',   suf:'+ Years', label:'Running a nationwide 3D printing service across India' },
              ].map((s,i) => (
                <Reveal key={i} delay={i}>
                  <motion.div className="gc" style={{ padding:'28px 30px' }}
                    whileHover={{ background:'rgba(255,255,255,.07)', scale:1.01 }}
                    transition={{ duration:.25 }}>
                    <div style={{ fontFamily:'var(--display)', fontSize:52, color:'#fff', lineHeight:1 }}>
                      <Counter target={s.n} />{s.suf}
                    </div>
                    <div style={{ fontSize:13, color:'var(--w60)', marginTop:4, lineHeight:1.4 }}>{s.label}</div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ═══════════════════ EXPERIENCE ═══════════════════ */}
      <section id="experience" className='sec' style={{ padding:'120px 48px', background:'var(--bg2)' }}>
        <div className="wrap">
          <Reveal><p className="eyebrow">// timeline</p></Reveal>
          <Reveal delay={1}><h2 className="sec-title">Experience &amp;<br/>Education</h2></Reveal>
          <div style={{ height:52 }} />
          <div style={{ position:'relative', paddingLeft:32 }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:1, background:'var(--border)' }} />
            {TIMELINE.map((t,i) => (
              <Reveal key={i} delay={i % 3}>
                <motion.div style={{ position:'relative', marginBottom:44, paddingBottom:44,
                  borderBottom:'1px solid var(--border)' }}
                  whileHover={{ x:4 }} transition={{ duration:.2 }}>
                  <motion.div style={{
                    position:'absolute', left:-36, top:7,
                    width:10, height:10, borderRadius:'50%',
                    border:`2px solid ${t.active ? '#fff' : 'rgba(255,255,255,.25)'}`,
                    background: t.active ? '#fff' : 'var(--bg2)',
                  }} whileHover={{ scale:1.5 }} />
                  <div style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--w25)', letterSpacing:'.1em', marginBottom:8 }}>{t.period}</div>
                  <div style={{ fontSize:18, fontWeight:600, color:'#fff', marginBottom:8, lineHeight:1.3 }}>{t.role}</div>
                  <div style={{ fontSize:14, lineHeight:1.75, color:'var(--w60)', marginBottom:12 }}>{t.desc}</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {t.tags.map(tg => (
                      <span key={tg} style={{ fontSize:10, letterSpacing:'.1em', textTransform:'uppercase',
                        padding:'4px 10px', border:'1px solid var(--border)', color:'var(--w25)' }}>{tg}</span>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PROJECTS ═══════════════════ */}
      <section id="projects" className='sec' style={{ padding:'120px 48px', background:'var(--bg)' }}>
        <div className="wrap">
          <Reveal><p className="eyebrow">// engineering projects</p></Reveal>
          <Reveal delay={1}><h2 className="sec-title">What I've Built</h2></Reveal>
          <div style={{ height:48 }} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'var(--border)' }}
            className="proj-grid">
            {PROJECTS.map((p,i) => (
              <motion.div key={i}
                style={{ background:'var(--bg)', padding:'40px 32px', position:'relative', overflow:'hidden' }}
                whileHover={{ background:'var(--bg3)' }}
                initial={{ opacity:0, y:20 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:false, amount:.15 }}
                transition={{ duration:.5, delay:(i%3)*.08 }}>
                {/* large bg number */}
                <div style={{ position:'absolute', top:24, right:24, fontFamily:'var(--display)',
                  fontSize:56, color:'rgba(255,255,255,.04)', pointerEvents:'none',
                  lineHeight:1 }}>{p.n}</div>
                <div style={{ fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.15em',
                  textTransform:'uppercase', color:'var(--w25)', marginBottom:14 }}>{p.cat}</div>
                <div style={{ fontSize:19, fontWeight:600, color:'#fff', marginBottom:10, lineHeight:1.3 }}>{p.title}</div>
                <div style={{ fontSize:13, lineHeight:1.7, color:'var(--w60)' }}>{p.desc}</div>
                {/* hover underline */}
                <motion.div style={{ position:'absolute', bottom:0, left:0, height:1, background:'rgba(255,255,255,.15)', width:0 }}
                  whileHover={{ width:'100%' }} transition={{ duration:.3 }} />
              </motion.div>
            ))}
          </div>
        </div>

      </section>

      {/* ═══════════════════ ACHIEVEMENTS ═══════════════════ */}
      <section id="achievements" className='sec' style={{ padding:'120px 48px', background:'var(--bg2)' }}>
        <div className="wrap">
          <Reveal><p className="eyebrow">// competition wins</p></Reveal>
          <Reveal delay={1}><h2 className="sec-title">Honours &amp;<br/>Achievements</h2></Reveal>
          <div style={{ height:48 }} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20 }}
            className="ach-grid">
            {ACHIEVEMENTS.map((a,i) => (
              <motion.div key={i} className="gc"
                style={{ padding:28, display:'flex', gap:20, alignItems:'flex-start' }}
                initial={{ opacity:0, y:20 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:false, amount:.2 }}
                transition={{ duration:.5, delay:(i%2)*.1 }}
                whileHover={{ background:'rgba(255,255,255,.07)', scale:1.01 }}>
                <div style={{ width:44, height:44, flexShrink:0, background:'var(--w10)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{a.icon}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:600, color:'#fff', marginBottom:6 }}>{a.title}</div>
                  <div style={{ fontSize:13, color:'var(--w60)', lineHeight:1.6 }}>{a.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </section>

      {/* ═══════════════════ SAE FEATURE ═══════════════════ */}
      <section style={{ padding:0, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', alignItems:'stretch' }}
          className="sae-grid">
          {/* SAE award photo */}
          <Reveal style={{ position:'relative' }}>
            <img src="/sae_award.jpg" alt="Suraj TP — SAE AeroTHON 2025 AIR 2"
              style={{ width:'100%', height:'100%', minHeight:600, objectFit:'cover',
                objectPosition:'top center', display:'block' }} />
            <div style={{ position:'absolute', inset:0,
              background:'linear-gradient(to right, rgba(0,0,0,.55), transparent)' }} />
            <div style={{ position:'absolute', bottom:40, left:40 }}>
              <div style={{ display:'inline-block', background:'var(--glass)',
                backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,.2)',
                padding:'5px 14px', fontSize:10, letterSpacing:'.14em',
                textTransform:'uppercase', color:'#fff', marginBottom:10 }}>
                National Level · SAE India
              </div>
              <div style={{ fontFamily:'var(--display)', fontSize:56, lineHeight:1, color:'#fff' }}>₹1,25,000</div>
              <div style={{ fontSize:12, color:'var(--w60)', letterSpacing:'.06em', marginTop:4 }}>
                SAE AeroTHON 2025 · 2nd Prize · Team Flying Phantoms
              </div>
            </div>
          </Reveal>

          {/* content */}
          <Reveal className="sae-content-col" style={{ padding:'80px 60px', background:'var(--bg)', display:'flex',
            flexDirection:'column', justifyContent:'center' }} delay={2}>
            <p className="eyebrow">// featured achievement</p>
            <h2 className="sec-title">SAE AeroTHON<br/>2025 — AIR 2</h2>
            <p style={{ fontSize:15, lineHeight:1.85, color:'var(--w60)', marginBottom:36 }}>
              As Team Vice Captain of "Flying Phantoms", I led a 10-member team through India's most competitive
              drone design, build & fly contest. Shortlisted top 25 nationally in Phase 1, then placed 2nd overall
              in the final flight rounds — a disaster-mission multirotor with autonomous object detection and
              precision payload delivery.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[
                { label:'Placement',     val:'AIR 2 — All India' },
                { label:'Prize Money',   val:'₹1,25,000' },
                { label:'Team',          val:'Flying Phantoms (10 members)' },
                { label:'Mission',       val:'Disaster Detection & Payload' },
              ].map(d => (
                <div key={d.label} className="gc" style={{ padding:'16px 18px' }}>
                  <div style={{ fontSize:10, letterSpacing:'.12em', textTransform:'uppercase',
                    color:'var(--w25)', marginBottom:4 }}>{d.label}</div>
                  <div style={{ fontSize:14, fontWeight:600, color:'#fff' }}>{d.val}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

      </section>

      {/* ═══════════════════ CONTACT ═══════════════════ */}
      <section id="contact" className='sec' style={{ padding:'120px 48px', background:'var(--bg2)' }}>
        <div className="wrap">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start' }}
            className="two-col">
            <div>
              <Reveal><p className="eyebrow">// let's work</p></Reveal>
              <Reveal delay={1}><h2 className="sec-title">Get in<br/>Touch</h2></Reveal>
              <Reveal delay={2}>
                <p style={{ fontSize:15, lineHeight:1.85, color:'var(--w60)', marginBottom:36 }}>
                  Open to engineering collaborations, drone projects, 3D printing consultations,
                  internships, and research partnerships. Based in Bengaluru, available nationwide.
                </p>
              </Reveal>
              <div style={{ display:'flex', flexDirection:'column', gap:1, background:'var(--border)' }}>
                {[
                  { label:'Email',             val:'Suryaprabhu125@gmail.com', href:'mailto:Suryaprabhu125@gmail.com' },
                  { label:'Phone',             val:'+91 94492 14905',           href:'tel:+919449214905' },
                  { label:'3D Printing Studio',val:'drprint.in',                href:'https://drprint.in' },
                  { label:'Instagram',         val:'@dr.print_3d',              href:'https://instagram.com/dr.print_3d' },
                ].map((l,i) => (
                  <motion.a key={i} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined}
                    style={{ background:'var(--bg2)', padding:'20px 24px', display:'flex',
                      alignItems:'center', justifyContent:'space-between',
                      textDecoration:'none', color:'#fff' }}
                    whileHover={{ background:'var(--bg3)', x:4 }}
                    transition={{ duration:.18 }}>
                    <div>
                      <div style={{ fontSize:10, color:'var(--w25)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>{l.label}</div>
                      <div style={{ fontSize:14, fontWeight:500 }}>{l.val}</div>
                    </div>
                    <span style={{ fontSize:18, color:'var(--w25)' }}>↗</span>
                  </motion.a>
                ))}
              </div>
            </div>

            <Reveal delay={2}>
              <div style={{ fontSize:17, fontWeight:600, marginBottom:22 }}>Send a Message</div>
              {formSent ? (
                <motion.div initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }}
                  style={{ background:'var(--glass)', border:'1px solid var(--glass-b)',
                    padding:48, textAlign:'center' }}>
                  <div style={{ fontSize:48 }}>✓</div>
                  <div style={{ fontFamily:'var(--display)', fontSize:28, marginTop:16 }}>Message Sent!</div>
                  <div style={{ color:'var(--w60)', marginTop:8, fontSize:14 }}>I'll get back to you soon.</div>
                </motion.div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setFormSent(true) }}>
                  {[
                    { label:'Name',    type:'text',  ph:'Your name' },
                    { label:'Email',   type:'email', ph:'your@email.com' },
                  ].map(f => (
                    <div key={f.label} style={{ marginBottom:14 }}>
                      <label style={{ display:'block', fontSize:10, letterSpacing:'.1em',
                        textTransform:'uppercase', color:'var(--w25)', marginBottom:7 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.ph} required style={{
                        width:'100%', background:'var(--glass)', border:'1px solid var(--border)',
                        color:'#fff', padding:'13px 15px', fontFamily:'var(--body)',
                        fontSize:14, outline:'none',
                      }} />
                    </div>
                  ))}
                  <div style={{ marginBottom:20 }}>
                    <label style={{ display:'block', fontSize:10, letterSpacing:'.1em',
                      textTransform:'uppercase', color:'var(--w25)', marginBottom:7 }}>Message</label>
                    <textarea placeholder="Tell me about your project..." style={{
                      width:'100%', background:'var(--glass)', border:'1px solid var(--border)',
                      color:'#fff', padding:'13px 15px', fontFamily:'var(--body)',
                      fontSize:14, outline:'none', resize:'vertical', minHeight:120,
                    }} />
                  </div>
                  <motion.button type="submit" className="btn-p"
                    style={{ width:'100%', textAlign:'center' }}
                    whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}>
                    Send Message
                  </motion.button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer style={{
        background:'var(--bg)', borderTop:'1px solid var(--border)',
        padding:'36px 48px', display:'flex', alignItems:'center',
        justifyContent:'space-between', flexWrap:'wrap', gap:16,
      }}>
        <div style={{ fontFamily:'var(--display)', fontSize:18, letterSpacing:'.08em' }}>SURAJ TP</div>
        <div style={{ fontSize:11, color:'var(--w25)', letterSpacing:'.04em' }}>
          © 2025 Suraj TP · Electronics & Communication Engineer · Bengaluru
        </div>
        <div style={{ display:'flex', gap:24 }}>
          {[
            { label:'Dr.PrinT', href:'https://drprint.in' },
            { label:'Email',    href:'mailto:Suryaprabhu125@gmail.com' },
            { label:'Call',     href:'tel:+919449214905' },
          ].map(l => (
            <a key={l.label} href={l.href} target={l.href.startsWith('http')?'_blank':undefined}
              style={{ fontSize:11, color:'var(--w25)', textDecoration:'none',
                letterSpacing:'.04em', transition:'color .2s' }}
              onMouseEnter={e=>e.target.style.color='#fff'}
              onMouseLeave={e=>e.target.style.color='var(--w25)'}>
              {l.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}
