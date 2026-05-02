import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot  = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    let mx = -100, my = -100, rx = -100, ry = -100

    const onMove = e => { mx = e.clientX; my = e.clientY }
    document.addEventListener('mousemove', onMove, { passive: true })

    const onOver = e => {
      const hot = e.target.closest('a,button,input,textarea,select,[data-hot]')
      dot.current?.classList.toggle('hot', !!hot)
      ring.current?.classList.toggle('hot', !!hot)
    }
    document.addEventListener('mouseover', onOver, { passive: true })

    let raf
    const tick = () => {
      rx += (mx - rx) * .11
      ry += (my - ry) * .11
      if (dot.current)  { dot.current.style.left  = mx + 'px'; dot.current.style.top  = my + 'px' }
      if (ring.current) { ring.current.style.left = rx + 'px'; ring.current.style.top = ry + 'px' }
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dot} style={{
        position: 'fixed', width: 8, height: 8,
        background: '#fff', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9999,
        transform: 'translate(-50%,-50%)',
        mixBlendMode: 'difference',
        transition: 'transform .2s',
      }} className="cur-dot" />
      <div ref={ring} style={{
        position: 'fixed', width: 36, height: 36,
        border: '1px solid rgba(255,255,255,.35)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9998,
        transform: 'translate(-50%,-50%)',
        transition: 'width .3s, height .3s, border-color .3s',
      }} className="cur-ring" />
      <style>{`
        .cur-dot.hot  { transform: translate(-50%,-50%) scale(3); }
        .cur-ring.hot { width: 22px !important; height: 22px !important; border-color: rgba(255,255,255,.8) !important; }
      `}</style>
    </>
  )
}
