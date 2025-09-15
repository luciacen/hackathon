'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AgendaOverlay from './AgendaOverlay';
import Image from 'next/image';
import { assetPrefix } from '../../next.config';

// Registra il plugin ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Intro: React.FC = () => {
  const introRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const text1Ref = useRef<HTMLParagraphElement>(null);
  const text2Ref = useRef<HTMLParagraphElement>(null);
  const dayCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  // const text3Ref = useRef<HTMLParagraphElement>(null);
  // const dateRef = useRef<HTMLParagraphElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [cardsAnimated, setCardsAnimated] = useState(false);
  const isIOS = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    console.log('=== STEP 1: Component mounted ===');
    console.log('introRef:', introRef.current);
    console.log('rightPanelRef:', rightPanelRef.current);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Osserva tutti gli elementi
    const elements = [titleRef.current, text1Ref.current, text2Ref.current];
    elements.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    // STEP 2: Aspetta che i refs siano pronti
    const setupPanel = () => {
      if (rightPanelRef.current && introRef.current) {        
        // Imposta la posizione iniziale (fuori dallo schermo a destra)
        gsap.set(rightPanelRef.current, {
          xPercent: 100,
          force3D: true
        });
        if (isIOS) {
          gsap.set(rightPanelRef.current, {
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'flex'
          });
        }
        // Crea ScrollTrigger che si attiva quando il componente diventa sticky
        ScrollTrigger.create({
          trigger: introRef.current,
          start: 'top top', // Quando il componente tocca il top
          end: 'bottom top', // Fino a quando il componente esce dal top
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const normalizedProgress = Math.min(progress * 2, 1);
            const newXPercent = 100 - (normalizedProgress * 100);
            gsap.set(rightPanelRef.current, {
              xPercent: newXPercent,
              force3D: true
            });

            // Quando completamente in vista, cambia posizione
            if (!isIOS) {
              if (normalizedProgress >= 1) {
                gsap.set(rightPanelRef.current, {
                  position: 'absolute',
                  top: '100vh',
                  right: '0px',
                  display: 'flex'
                });
              } else {
                // Mantieni sempre fixed durante l'animazione (solo non-iOS)
                gsap.set(rightPanelRef.current, {
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  display: 'flex'
                });
              }
            } else {
              // Su iOS evitiamo position: fixed per affidabilità
              gsap.set(rightPanelRef.current, {
                position: 'absolute',
                top: 0,
                right: 0,
                display: 'flex'
              });
            }
          },
          onLeave: () => {
            // Quando il componente esce dal viewport, fai uscire il pannello
            gsap.to(rightPanelRef.current, {
              xPercent: 100,
              duration: 0.5,
              ease: 'power2.inOut'
            });
          }
        });
        // Forza un refresh dopo il setup per iOS Safari
        ScrollTrigger.refresh();

        // Fallback nativo per iOS: calcolo manuale della progressione scroll -> xPercent
        let startY = 0;
        let endY = 0;
        const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
        const updateBounds = () => {
          if (!introRef.current) return;
          const rect = introRef.current.getBoundingClientRect();
          // offsetTop è relativo al documento; rect.top è relativo al viewport
          const docTop = window.scrollY + rect.top;
          startY = docTop; // quando la sezione tocca il top
          // fine quando il bottom della sezione tocca il top del viewport
          endY = docTop + introRef.current.offsetHeight - window.innerHeight;
        };
        const nativeScrollHandler = () => {
          if (!isIOS || !rightPanelRef.current) return;
          const y = window.scrollY;
          const rawProgress = (y - startY) / Math.max(1, (endY - startY));
          const progress = clamp(rawProgress, 0, 1);
          const normalizedProgress = Math.min(progress * 2, 1);
          const newXPercent = 100 - (normalizedProgress * 100);
          gsap.set(rightPanelRef.current, { xPercent: newXPercent, force3D: true });
        };
        if (isIOS) {
          updateBounds();
          nativeScrollHandler();
          window.addEventListener('scroll', nativeScrollHandler, { passive: true });
        }
      } else {
        setTimeout(setupPanel, 100);
      }
    };

            // Aspetta un po' per assicurarsi che il DOM sia pronto
        setTimeout(setupPanel, 100);

        // Trigger aggiuntivo per nascondere il pannello quando esce completamente
        ScrollTrigger.create({
          trigger: introRef.current,
          start: 'bottom bottom', // Quando il componente esce completamente dal viewport
          onEnter: () => {
            // Nascondi completamente il pannello
            gsap.set(rightPanelRef.current, {
              display: 'flex'
            });
          },
          onLeaveBack: () => {
            // Mostra di nuovo il pannello quando si torna indietro
            gsap.set(rightPanelRef.current, {
              display: 'flex'
            });
          }
        });

        const handleResize = () => {
          // Aggiorna i calcoli quando cambia la UI di Safari (barra indirizzi)
          ScrollTrigger.refresh();
        };
        const onResize = () => {
          handleResize();
          if (isIOS) {
            updateBounds();
            nativeScrollHandler();
          }
        };
        const onOrientation = () => {
          handleResize();
          if (isIOS) {
            updateBounds();
            nativeScrollHandler();
          }
        };
        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onOrientation);

        return () => {
          observer.disconnect();
          window.removeEventListener('resize', onResize);
          window.removeEventListener('orientationchange', onOrientation);
          if (isIOS) {
            window.removeEventListener('scroll', nativeScrollHandler as any);
          }
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
  }, [isClient]);

  // Animazione staggered per le colonne dei giorni
  useEffect(() => {
    if (!isClient || cardsAnimated) return; // Evita di ripetere l'animazione

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const index = parseInt(target.dataset.index || '0');
          
          gsap.fromTo(target, 
            {
              y: 50,
              opacity: 0,
              scale: 0.9
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'power2.out',
              delay: index * 0.2
            }
          );
        }
      });

      // Imposta lo stato per evitare che l'animazione si ripeta
      setCardsAnimated(true);
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });

    return () => {
      observer.disconnect();
    };
  }, [isClient, cardsAnimated]);

  const animationStyle = {
    opacity: 0,
    transform: 'translateY(30px)',
    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
  };

  const staggeredAnimationStyle = (delay: number) => ({
    opacity: 0,
    transform: 'translateY(30px)',
    transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`
  });

  const handleDayClick = (day: number) => {
    console.log(`DAY ${day} clicked!`);
    setSelectedDay(day);
    setIsAgendaOpen(true);
  };

  const handleCloseAgenda = () => {
    setIsAgendaOpen(false);
  };

  return (
    <>
      <div ref={introRef} style={{ position: 'relative', height: '200vh' }}>
        {/* Layout principale Intro */}
        <div style={{
          backgroundColor: '#4d68f1',
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          color: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 1 // z-index basso per il componente sticky
        }}>
        <div style={{
          width: '1000px',
          maxWidth: '80%',
          textAlign: 'center'
        }}>
          <h2 
            ref={titleRef}
            className="intro-title-mobile"
            style={{
              fontSize: '5rem',
              fontWeight: 'bold',
              marginBottom: '3rem',
              margin: '0 0 1.7rem 0',
              // textTransform: 'uppercase',
              letterSpacing: 'normal',
              lineHeight: '1.2',
              ...animationStyle
            }}
          >
            Prepare for a reality shift. 
          </h2>
          
          <p 
            ref={text1Ref}
            className="intro-text-mobile"
            style={{
              fontSize: '2.3rem',
              fontWeight: '400',
              marginBottom: '3rem',
              margin: '0 0 1rem 0',
              lineHeight: '1.2',
              ...staggeredAnimationStyle(0.2)
            }}
          >
            You&apos;re invited to a gathering of bold minds to rethink and reshape the future of eyecare. Expect disruption. <br/>Embrace the unexpected. Get ready to build something the world hasn&apos;t seen before.
          </p>
          
        </div>

        {/* Sticker bottom left */}
        <div
          style={{
            position: 'absolute',
            left: '2vw',
            bottom: '6vw',
            width: '18vw',
            transform: 'rotate(16deg)',
            filter: 'invert(1)',
            zIndex: 10,
            pointerEvents: 'none'
          }}
          className="bottom-left-icon"
        >
          <Image
            src={`${assetPrefix}assets/stickers-frame.svg`}
            alt="Sticker Frame"
            width={500}
            height={500}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>      
      </div>

      {/* Layout destro che appare con scroll - renderizzato solo lato client */}
      {isClient && (
        <div
          className="right-panel"
          ref={rightPanelRef}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100vh',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'row',
            pointerEvents: 'none',
            willChange: 'transform',
            transform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden' as any,
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Immagini pixel SX e DX */}
          <Image
            src={`${assetPrefix}assets/intro-sx.svg`}
            alt="Intro SX"
            width={1920}
            height={1080}
            style={{
              height: '100vh',
              width: 'auto',
              transform: 'scaleX(-1)',
              objectFit: 'contain',
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          />
          {/* DIV BIANCO */}
          <div
            style={{
              height: '100vh',
              width: '100vw',
              background: 'white',
              flex: 1,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '-5px',
              pointerEvents: 'none'
            }}
          >
            {/* Contenuto del pannello */}
            <div className='panel-content' style={{
              maxWidth: '90vw',
              textAlign: 'center',
              zIndex: 2
            }}>
              <h2 
                className="panel-title-mobile"
                style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  marginBottom: '2rem',
                  color: '#4d68f1'
                }}
              >
                30.09 - 03.10<br />
                Museo della Scienza e della Tecnologia
              </h2>
              
              {/* Programma dell'evento - 4 colonne */}
              <div 
                className="panel-grid-mobile"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '2rem',
                  marginTop: '3rem',
                  maxWidth: '100%'
                }}
              >
                {/* DAY 1 */}
                <div 
                  ref={(el) => { dayCardsRef.current[0] = el; }}
                  style={{
                    background: '#111',
                    padding: '2.2rem 1.2rem',
                    position: 'relative',
                    cursor: 'pointer',
                    width: '220px',
                    height: '220px',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'auto',
                    opacity: 1,
                    color: '#fff',
                    fontFamily: "'Dogica Pixel', monospace",
                    border: '3px solid #4d68f1',
                    borderRadius: '22px',
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onClick={() => handleDayClick(1)} className="day-card-mobile">
                  {/* Testo card */}
                  <div style={{
                    fontSize: '2.2rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    fontFamily: "'Dogica Pixel', monospace",
                    marginBottom: '0.5rem',
                    letterSpacing: '2px',
                    textAlign: 'center'
                  }} className="day-title-mobile">
                    DAY 1
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#fff',
                    lineHeight: '1.4',
                    fontFamily: "'Dogica Pixel', monospace",
                    textAlign: 'center'
                  }} className="day-subtitle-mobile">
                    Inspiration & Briefing
                  </div>
                </div>
                {/* DAY 2 */}
                <div 
                  ref={(el) => { dayCardsRef.current[1] = el; }}
                  style={{
                    background: '#111',
                    padding: '2.2rem 1.2rem',
                    position: 'relative',
                    cursor: 'pointer',
                    width: '220px',
                    height: '220px',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'auto',
                    opacity: 1,
                    color: '#fff',
                    fontFamily: "'Dogica Pixel', monospace",
                    border: '3px solid #4d68f1',
                    borderRadius: '22px',
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onClick={() => handleDayClick(2)} className="day-card-mobile">
                  {/* Testo card */}
                  <div style={{
                    fontSize: '2.2rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    fontFamily: "'Dogica Pixel', monospace",
                    marginBottom: '0.5rem',
                    letterSpacing: '2px',
                    textAlign: 'center'
                  }} className="day-title-mobile">
                    DAY 2
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#fff',
                    lineHeight: '1.4',
                    fontFamily: "'Dogica Pixel', monospace",
                    textAlign: 'center'
                  }} className="day-subtitle-mobile">
                    Creation & Collaboration
                  </div>
                </div>
                {/* DAY 3 */}
                <div 
                  ref={(el) => { dayCardsRef.current[2] = el; }}
                  style={{
                    background: '#111',
                    padding: '2.2rem 1.2rem',
                    position: 'relative',
                    cursor: 'pointer',
                    width: '220px',
                    height: '220px',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'auto',
                    opacity: 1,
                    color: '#fff',
                    fontFamily: "'Dogica Pixel', monospace",
                    border: '3px solid #4d68f1',
                    borderRadius: '22px',
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onClick={() => handleDayClick(3)} className="day-card-mobile">
                  {/* Testo card */}
                  <div style={{
                    fontSize: '2.2rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    fontFamily: "'Dogica Pixel', monospace",
                    marginBottom: '0.5rem',
                    letterSpacing: '2px',
                    textAlign: 'center'
                  }} className="day-title-mobile">
                    DAY 3
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#fff',
                    lineHeight: '1.4',
                    fontFamily: "'Dogica Pixel', monospace",
                    textAlign: 'center'
                  }} className="day-subtitle-mobile">
                    Presentation
                  </div>
                </div>
                {/* DAY 4 */}
                <div 
                  ref={(el) => { dayCardsRef.current[3] = el; }}
                  style={{
                    background: '#111',
                    padding: '2.2rem 1.2rem',
                    position: 'relative',
                    cursor: 'pointer',
                    width: '220px',
                    height: '220px',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'auto',
                    opacity: 1,
                    color: '#fff',
                    fontFamily: "'Dogica Pixel', monospace",
                    border: '3px solid #4d68f1',
                    borderRadius: '22px',
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onClick={() => handleDayClick(4)} className="day-card-mobile">
                  {/* Testo card */}
                  <div style={{
                    fontSize: '2.2rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    fontFamily: "'Dogica Pixel', monospace",
                    marginBottom: '0.5rem',
                    letterSpacing: '2px',
                    textAlign: 'center'
                  }} className="day-title-mobile">
                    DAY 4
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#fff',
                    lineHeight: '1.4',
                    fontFamily: "'Dogica Pixel', monospace",
                    textAlign: 'center'
                  }} className="day-subtitle-mobile">
                    Awards
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Image
            src={`${assetPrefix}assets/intro-sx.svg`}
            alt="Intro DX"
            width={1920}
            height={1080}
            style={{
              height: '100%',
              width: 'auto',
              objectFit: 'contain',
              pointerEvents: 'none',
              userSelect: 'none',
              marginLeft: '-1px'
            }}
          />
        </div>
      )}
    </div>

    <style jsx>{`
      @media (max-width: 768px) {
        .day-card-mobile {
          width: calc((100% - 1rem) / 2) !important;
          height: auto !important;
          min-height: 160px !important;
        }
        .panel-grid-mobile {
          gap: 1rem !important;
          display: flex !important;
          flex-wrap: wrap;
        }
        .bottom-left-icon{
          width: 40vw !important;
          left: 8vw !important;
          bottom: 8vw !important;
        }
      }
    `}</style>

    {/* Overlay dell'agenda */}
    <AgendaOverlay
      isOpen={isAgendaOpen}
      onClose={handleCloseAgenda}
      day={selectedDay}
    />
    </>
  );
};

export default Intro;
