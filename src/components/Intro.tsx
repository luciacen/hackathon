'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AgendaOverlay from './AgendaOverlay';

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
          x: '100%',
          // backgroundColor: 'white'
        });
        // Crea ScrollTrigger che si attiva quando il componente diventa sticky
        ScrollTrigger.create({
          trigger: introRef.current,
          start: 'top top', // Quando il componente tocca il top
          end: 'bottom top', // Fino a quando il componente esce dal top
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;            
            const normalizedProgress = Math.min(progress * 2, 1);
            const newX = `${100 - (normalizedProgress * 100)}%`;
            gsap.set(rightPanelRef.current, {
              x: newX
            });
            
            // Quando completamente in vista, cambia posizione
            if (normalizedProgress >= 1) {
              gsap.set(rightPanelRef.current, {
                position: 'absolute',
                top: '100vh',
                right: '0px',
                display: 'flex'
              });
            } else {
              // Mantieni sempre fixed durante l'animazione
              gsap.set(rightPanelRef.current, {
                position: 'fixed',
                top: 0,
                right: 0,
                display: 'flex'
              });
            }
          },
          onLeave: () => {
            // Quando il componente esce dal viewport, fai uscire il pannello
            gsap.to(rightPanelRef.current, {
              x: '100%',
              duration: 0.5,
              ease: 'power2.inOut'
            });
          }
        });
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

        return () => {
          observer.disconnect();
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
  }, [isClient]);

  // Animazione staggered per le colonne dei giorni
  useEffect(() => {
    if (!isClient) return;

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
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });

    // Osserva tutte le colonne dei giorni
    dayCardsRef.current.forEach((card, index) => {
      if (card) {
        card.dataset.index = index.toString();
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
        observer.observe(card);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [isClient]);

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
          maxWidth: '1200px',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          <h2 
            ref={titleRef}
            className="intro-title-mobile"
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '3rem',
              margin: '0 0 1.7rem 0',
              // textTransform: 'uppercase',
              letterSpacing: '0.05em',
              ...animationStyle
            }}
          >
            We've entered a new era
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
            where eyecare extends beyond correction and style, becoming a gateway to broader health,
            performance, and connectivity.<br/>As EssilorLuxottica evolves into a med-tech powerhouse, creativity becomes more essential
            than ever.
          </p>
          
          <p 
            ref={text2Ref}
            className="intro-text-mobile"
            style={{
              fontSize: '1.3rem',
              fontWeight: '300',
              marginBottom: '3rem',
              margin: '0 0 1rem 0',
              lineHeight: '1.7',
              ...staggeredAnimationStyle(0.4)
            }}
          >
            This internal Hackathon is our response: a dedicated moment to harness the full potential of the Creative Hub to push boundaries, spark innovation, and redefine how we communicate and design
            experiences.
          </p>
          
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
            pointerEvents: 'none'
          }}
        >
          {/* SVG INLINE */}
          <div style={{ height: '100vh', display: 'flex', alignItems: 'stretch' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149.38 704.78"
          style={{
           fill: 'white'
          }}
          >
            <g>
              <path className="cls-1" d="M137.31,49.8v.14s.09,0,.14,0l-.14-.14Z"/>
              <path className="cls-1" d="M114.53,72.7h22.78v-22.75c-3.91.14-7.82.27-11.74.41.24,3.33.49,6.66.77,10.56h-22.69c-.27,3.99-.5,7.49-.76,11.37-3.56.18-6.93.35-10.7.54v10.99c7.16.42,14.45.18,22.33.12v-11.23Z"/>
              <path className="cls-1" d="M125.48,50.34s-.02.02-.02.02c.04,0,.07,0,.11,0,0-.03,0-.07,0-.1l-.08.09Z"/>
              <path className="cls-1" d="M69.25,27.32v10.6c1.82.09,3.65.25,5.47.26,11.25.02,22.49-.02,33.74.04,1.84,0,3.68.4,5.52.61.32-3.71.63-7.42.94-11.02-4.51-1.27-38.4-1.57-45.68-.48Z"/>
              <path className="cls-1" d="M113.98,38.83s0,.06,0,.08c0,0,.02-.02.03-.03.02-.02.04-.04.04-.04-.02,0-.04,0-.06,0Z"/>
              <path className="cls-1" d="M137.97,84.48v21.93c3.5.37,6.96.73,10.42,1.1.33-7.52.65-15.04,1-23.03h-11.41Z"/>
              <rect className="cls-1" x="92.17" width="10.7" height="14.97"/>
              <path className="cls-1" d="M125.9,0c.09,2.36.19,4.72.25,7.08.07,2.44.01,4.89.01,7.76h11.23c.07-3.54.18-7.25.22-10.96.01-1.28.01-2.58.01-3.88h-11.72Z"/>
              <path className="cls-1" d="M23.42,95.73v10.72h10.71v-10.72h-10.71Z"/>
              <path className="cls-1" d="M56.82,61.7s-.06,0-.1-.01c0,.04,0,.07,0,.11l.02-.02s.02-.02.04-.04c.02-.02.05-.04.05-.04Z"/>
              <path className="cls-1" d="M46.32,50.11v10.48c3.48.37,6.94.74,10.41,1.11.3-3.7.61-7.4.95-11.58h-11.36Z"/>
              <path className="cls-1" d="M56.78,61.74l-.04.04s-.02.02-.01.01c.04,0,.07,0,.11,0,0-.03,0-.06,0-.09,0,0-.02.02-.05.04Z"/>
              <path className="cls-1" d="M56.74,61.78l.04-.04s-.03.03-.04.04Z"/>
              <path className="cls-1" d="M57.61,84.47v10.53h10.91v-10.53h-10.91Z"/>
              <path className="cls-1" d="M114.01,38.87s-.03.03-.03.03c.02,0,.05,0,.07,0,0-.02,0-.04,0-.06,0,0-.02.02-.04.04Z"/>
              <path className="cls-1" d="M114.05,38.9c.35,3.31.72,6.61,1.12,10.26,3.41.35,6.86.7,10.3,1.07.29-3.8.58-7.61.93-12.3-4.7.37-8.53.66-12.35.96Z"/>
              <path className="cls-1" d="M125.58,50.24s-.07,0-.1-.01c0,.04,0,.08,0,.12,0,0,0,0,.02-.02.03-.03.09-.09.09-.1Z"/>
              <path className="cls-1" d="M148.55,38.6h-11.1c0,3.84,0,7.53,0,11.21h11.1v-11.21Z"/>
              <path className="cls-1" d="M137.45,49.8h-.14s.14.14.14.14v-.14Z"/>
              <path className="cls-1" d="M136.97,226.09c3.63,0,7.26,0,10.88,0v-11.59c-3.61.04-7.23.11-10.88.28v11.32Z"/>
              <path className="cls-1" d="M147.86,203.04v-22.96c-.02.07-.03.13-.05.2h-22.33v.14s-.14-.14-.14-.14l.14.14s-.09,0-.14,0c-.11,7.71-.23,15.42-.33,23.12.05,0,.1,0,.14,0,0,0,0,0-.01.01,0,.05,0,.09,0,.14,4.67-.21,9.35-.48,14.03-.63,2.84-.09,5.7-.03,8.69-.02Z"/>
              <path className="cls-1" d="M143.81,237.41h-6.38c-.22-4.17-.4-7.68-.59-11.18-3.77,0-7.54.01-11.31.02,0,3.61,0,7.22,0,10.79h-11.06c-.19-3.83-.37-7.32-.55-10.81-3.77,0-7.54.01-11.3.02.04,3.74.12,7.48.1,11.22-.02,3.7-.14,7.4-.21,11.14-4.29.21-7.82.37-11.35.54,0,3.77,0,7.53-.01,11.3h22.91v22.92c3.76.05,7.52.11,11.28.16,0-.05,0-.09,0-.14h.14c0-3.68,0-7.36,0-11.21h11.1v11.21h-11.1v.14s-.14-.14-.14-.14l.14.14s-.09,0-.14,0c.06,3.77.12,7.53.17,11.3h22.34v-57.42c-1.35,0-2.7,0-4.05,0Z"/>
              <path className="cls-1" d="M137.44,306.22c-.24,4.17-.45,7.84-.66,11.51.07,0,.14,0,.21,0v.21c3.59-.09,7.19-.18,10.87-.27v-11.44h-10.42Z"/>
              <path className="cls-1" d="M136.99,328.7v-10.76c-.07,0-.15,0-.22,0,0-.07,0-.14.01-.21-3.76,0-7.52,0-11.28.01,0,.05,0,.1,0,.16h-.12c.18,3.48.35,6.97.55,10.8h11.06Z"/>
              <path className="cls-1" d="M114.07,180.46c-.07,0-.15,0-.22,0v-.21c-3.75,0-7.5,0-11.25.01,0,.05,0,.11,0,.16h-.14c0,3.77-.01,7.54-.02,11.32.06,0,.11,0,.17,0v.13c3.52-.17,7.04-.33,10.86-.51,1.32-3.59.57-7.28.61-10.91Z"/>
              <path className="cls-1" d="M125.37,317.74c0,.05,0,.1,0,.16h.12l-.13-.16Z"/>
              <path className="cls-1" d="M136.99,317.94v10.76h-11.06c-.19-3.83-.37-7.32-.55-10.8h-10.87v22.33h10.79c.22,3.99.41,7.49.63,11.36h10.88c.17-3.42.35-6.92.54-10.72h10.51v-23.2c-3.68.09-7.28.18-10.87.27Z"/>
              <path className="cls-1" d="M136.77,317.94c.07,0,.15,0,.22,0v-.21l-.22.21Z"/>
              <path className="cls-1" d="M102.22,88.74c-3.27-.16-6.63-.32-10.71-.51v-10.86h-11.33c-.22,3.47-.45,6.97-.7,10.84-3.58.17-6.95.34-10.71.52v22.37h10.8c0,4.4,0,8.09,0,11.78h11.43c.19,3.89.35,7.24.53,10.95,1.62.17,3.08.45,4.53.46,7.8.04,15.6-.02,23.4.05,1.83.02,3.66.36,5.49.56.3-3.7.61-7.4.96-11.67-4.05-.24-7.54-.46-11.54-.7v-11.03h-22.75v-11.3h10.6v-11.45Z"/>
              <path className="cls-1" d="M79.43,122.87h0s.15.15.14.15v-.15h-.15s0,0,0,0Z"/>
              <polygon className="cls-1" points="79.57 123.02 79.57 123.02 79.57 123.02 79.57 123.02"/>
              <path className="cls-1" d="M124.95,134.99l.1-.09s-.06,0-.1-.01c0,.04,0,.07,0,.11h0Z"/>
              <path className="cls-1" d="M125.07,203.62s-.07.08-.07.08c.05,0,.09,0,.14,0,0-.05,0-.09,0-.14-.01.01-.03.04-.06.07Z"/>
              <path className="cls-1" d="M125.53,226.25c3.77,0,7.54-.01,11.31-.02,0-.05,0-.1,0-.14h.14v-11.32c3.65-.17,7.27-.25,10.88-.28v-11.45c-2.99,0-5.85-.07-8.69.02-4.68.15-9.36.42-14.03.63.07,7.46.14,14.92.21,22.38.06,0,.12,0,.18,0v.18Z"/>
              <path className="cls-1" d="M137.37,374.65c-.16-3.55-.31-7.05-.49-11.22-7.94.34-15.61-.73-23.27.7.32,3.31.64,6.63,1.02,10.51,3.48.16,6.97.32,10.88.5v22.8h21.89c.17-.54.32-1.17.46-1.87v-20.92c-3.2-.15-6.5-.31-10.49-.5Z"/>
              <path className="cls-1" d="M113.5,364.15s.07,0,.11-.02c0-.03,0-.06,0-.09l-.1.1Z"/>
              <path className="cls-1" d="M22.93,145.5v-10.9c3.42-.18,6.92-.36,10.72-.56v-10.79H11.39v33.72h10.79c.24,4,.44,7.51.67,11.34h10.72v-22.3c-3.54-.17-6.9-.33-10.63-.51Z"/>
              <path className="cls-1" d="M137.34,99.63v-10.71h-22.78v10.81h10.78c.2,4.05.36,7.4.57,11.48h10.91c.19,4.05.35,7.41.53,11.1,3.6.38,7.06.74,10.51,1.11v-23.18c-3.62-.21-6.86-.4-10.51-.61Z"/>
              <path className="cls-1" d="M136.97,226.23s-.09,0-.14,0c.18,3.5.37,7.01.59,11.18h6.38c1.35,0,2.7,0,4.05,0v-11.32c-3.63,0-7.26,0-10.88,0v.14Z"/>
              <path className="cls-1" d="M136.97,226.09h-.14s0,.1,0,.14c.05,0,.09,0,.14,0v-.14Z"/>
              <path className="cls-1" d="M57.08,133.93c-4.07.25-7.57.46-11.34.69v10.74h22.33c.16-3.39.33-6.87.52-10.88h10.49c1.13-4.13.87-7.79.36-11.46-7.71.17-15.42.35-23.13.52.24,3.32.49,6.63.76,10.39Z"/>
              <path className="cls-1" d="M56.21,123.55s.07,0,.11,0c0-.03,0-.07,0-.1l-.1.1Z"/>
              <path className="cls-1" d="M79.45,123.02s.08,0,.12,0c0,0-.14-.14-.14-.15,0,.05.01.1.02.15Z"/>
              <path className="cls-1" d="M79.43,122.87s.15.15.14.15h0s-.15-.15-.14-.15h0Z"/>
              <path className="cls-1" d="M56.76,180.41v-.15h-.15s.04.04.07.08l.08.08Z"/>
              <path className="cls-1" d="M68.58,168.91h10.34c1.45-4.08.92-7.75.6-11.4h-33.71v10.97h10.95v11.78h11.31c.17-3.88.33-7.35.51-11.35Z"/>
              <path className="cls-1" d="M79.51,157.37s0,.09.01.14h.13l-.14-.14Z"/>
              <polygon className="cls-1" points="56.61 180.26 56.61 180.26 56.61 180.26 56.61 180.26"/>
              <path className="cls-1" d="M0,340.78v10.97h10.77c.2,4.04.36,7.39.55,11.2h10.86v-22.17H0Z"/>
              <path className="cls-1" d="M136.78,317.73c0,.07,0,.14-.01.21l.22-.21c-.07,0-.14,0-.21,0Z"/>
              <path className="cls-1" d="M137.44,306.22h10.42v-11.4h-22.34s0,.1,0,.14c-.05,0-.1,0-.14,0,.04,7.59.08,15.18.12,22.78,3.76,0,7.52,0,11.28-.01.21-3.66.42-7.33.66-11.51Z"/>
              <path className="cls-1" d="M125.5,317.74s-.08,0-.12,0l.13.16c0-.05,0-.1,0-.16Z"/>
              <path className="cls-1" d="M68.64,214.93c-.17,3.49-.34,6.84-.53,10.68-3.59.23-7.09.45-10.89.69v10.79h22.27v-22.16h-10.85Z"/>
              <path className="cls-1" d="M79.86,306.44h-11.16c-.22,3.63-.44,7.12-.67,10.91-3.68.18-7.03.35-10.83.54-.19,3.85-.37,7.53-.55,11.21,7.49.19,14.98.38,22.47.56,1.53-7.64.23-15.3.73-23.22Z"/>
              <path className="cls-1" d="M56.57,329.15s.09.09.09.09c0-.05,0-.1,0-.15-.05,0-.1,0-.15,0h0s0,0,0,0c0,0,.03.03.06.06Z"/>
              <path className="cls-1" d="M79.12,329.76l.04-.04s.06-.05.06-.05c-.03,0-.06,0-.09,0,0,.03,0,.07-.02.1h0Z"/>
              <path className="cls-1" d="M125.13,203.55h0s0,0,.01-.01c-.05,0-.09,0-.14,0,0,.05,0,.11,0,.16,0,0,.04-.04.07-.08.03-.04.06-.07.06-.07Z"/>
              <path className="cls-1" d="M114.07,180.46c0-.07,0-.14,0-.21l-.22.21c.07,0,.15,0,.22,0Z"/>
              <path className="cls-1" d="M102.44,191.88c.06,0,.12,0,.17,0v-.13l-.17.14Z"/>
              <path className="cls-1" d="M114.07,180.46c-.03,3.63.72,7.32-.61,10.91-3.81.18-7.34.34-10.86.51v10.81c7.94.3,15.17.57,22.39.86.11-7.7.22-15.41.33-23.12-3.75.01-7.51.02-11.26.04Z"/>
              <path className="cls-1" d="M125.34,180.28s0,.09,0,.14c.05,0,.09,0,.14,0l-.14-.14Z"/>
              <path className="cls-1" d="M125.07,203.62s.05-.06.06-.07h0s-.03.03-.06.07Z"/>
              <path className="cls-1" d="M102.56,283.49l.03.03v-.15c-.05,0-.1,0-.15,0,0,0,.07.07.12.12Z"/>
              <polygon className="cls-1" points="102.44 283.37 102.44 283.37 102.44 283.37 102.44 283.37"/>
              <path className="cls-1" d="M114.06,283.37v-22.92h-22.91v.14s-.09,0-.14,0c.18,3.48.35,6.97.55,10.92,3.7.18,7.16.34,11.04.53v11.34c3.78.05,7.55.09,11.33.14,0-.05,0-.1,0-.14.05,0,.1,0,.14,0Z"/>
              <path className="cls-1" d="M45.8,100.39v21.93c3.5.37,6.96.73,10.42,1.1.33-7.52.65-15.04,1-23.03h-11.41Z"/>
              <path className="cls-1" d="M56.22,123.42s0,.08,0,.13c0,0,.1-.1.11-.12-.03,0-.07,0-.1-.01Z"/>
              <path className="cls-1" d="M67.99,271.29v-22.16h-10.72v22.16h10.72Z"/>
              <path className="cls-1" d="M91.16,249.16c3.52-.17,7.06-.34,11.35-.54.08-3.74.19-7.44.21-11.14.02-3.74-.06-7.48-.1-11.22-.06,0-.12,0-.18,0,0-.06,0-.12,0-.18h-10.94c-.18,7.95-.35,15.43-.52,22.91h.17v.17Z"/>
              <path className="cls-1" d="M102.44,283.37s0,.1,0,.15h.15s-.01-.01-.03-.03l-.12-.12Z"/>
              <path className="cls-1" d="M91.6,305.72h10.9c.07-3.54.22-7.25.21-10.95,0-3.75-.17-7.5-.26-11.24h-10.85v22.19Z"/>
              <path className="cls-1" d="M102.44,283.37h0s.12.12.12.12c-.04-.04-.12-.12-.12-.12Z"/>
              <path className="cls-1" d="M102.59,283.52l-.03-.03s.03.03.03.03Z"/>
              <path className="cls-1" d="M147.86,180.08v-11.24c-7.18,0-14.37,0-22.38,0,0,4.07,0,7.76,0,11.44h22.33c.02-.07.03-.13.05-.2Z"/>
              <path className="cls-1" d="M125.48,180.28h-.14s.14.14.14.14v-.14Z"/>
              <path className="cls-1" d="M21.84,261.03s.07,0,.11-.02c0-.03,0-.06,0-.09l-.1.1Z"/>
              <path className="cls-1" d="M21.95,261.02c.32,3.33.65,6.66,1,10.36h22v-11.05c-7.67.32-15.33-.75-23,.69Z"/>
              <path className="cls-1" d="M45.1,306.58h-22.2v10.57h22.2v-10.57Z"/>
              <path className="cls-1" d="M56.69,180.33l-.07-.07v.15h.15s-.04-.04-.08-.08Z"/>
              <path className="cls-1" d="M34.33,191.15h22.28c0-3.72,0-7.23,0-10.74h-22.28v10.74Z"/>
              <path className="cls-1" d="M56.61,180.26h0s.07.08.07.08c-.04-.04-.08-.08-.07-.08Z"/>
              <path className="cls-1" d="M56.76,180.41l-.08-.08s.08.08.08.08Z"/>
              <path className="cls-1" d="M56.57,329.15s-.05-.06-.06-.06c0,.05,0,.1,0,.15h.15s-.04-.05-.09-.09Z"/>
              <path className="cls-1" d="M56.66,329.25s-.04-.05-.09-.09c.04.05.09.09.09.09Z"/>
              <path className="cls-1" d="M56.26,341.17s.05-.05.05-.05c-.03,0-.07,0-.1,0,0,.04,0,.07,0,.1l.05-.05Z"/>
              <path className="cls-1" d="M34.31,340.52c3.09,0,6.06-.07,9.02.02,4.29.13,8.58.38,12.87.57.1-3.95.21-7.91.31-11.87-7.3,0-14.6,0-22.2,0v11.28Z"/>
              <path className="cls-1" d="M56.51,329.1h0s.03.03.06.06c-.03-.03-.06-.06-.06-.06Z"/>
              <path className="cls-1" d="M11.43,249.32v10.49c3.49.37,6.96.73,10.42,1.1.3-3.7.6-7.41.94-11.59h-11.36Z"/>
              <path className="cls-1" d="M21.85,260.91s0,.08-.01.12c0,0,.1-.1.11-.11-.03,0-.07,0-.1-.01Z"/>
              <path className="cls-1" d="M11.28,283.71v10.48h10.87v-10.48h-10.87Z"/>
              <path className="cls-1" d="M34.36,203.49v10.72h10.73v-10.72h-10.73Z"/>
              <path className="cls-1" d="M34.41,352.29v10.82h10.61v-10.82h-10.61Z"/>
              <path className="cls-1" d="M67.86,351.57v-11.16c-3.86.27-7.7.53-11.55.8.32,3.32.65,6.64,1.01,10.36h10.53Z"/>
              <path className="cls-1" d="M56.21,341.21s.07,0,.11,0c0-.03,0-.06,0-.09,0,0-.03.02-.05.05-.03.02-.05.05-.05.05Z"/>
              <path className="cls-1" d="M68.76,283.73v10.66h10.66v-10.66h-10.66Z"/>
              <path className="cls-1" d="M79.65,157.37h-.14s.14.14.14.14v-.14Z"/>
              <path className="cls-1" d="M90.75,146.16h-11.1c0,3.84,0,7.53,0,11.21h11.1v-11.21Z"/>
              <path className="cls-1" d="M91.15,260.46c0-3.77,0-7.53.01-11.3-.06,0-.12,0-.18,0v-.18h-10.81v10.96c3.57.21,7.2.43,10.83.64,0-.05,0-.09,0-.14h.14Z"/>
              <path className="cls-1" d="M91.15,260.46h-.14s0,.09,0,.14c.05,0,.09,0,.14,0v-.14Z"/>
              <path className="cls-1" d="M91.16,249.16v-.17h-.17v.18c.05,0,.11,0,.17,0Z"/>
              <path className="cls-1" d="M79.12,329.76s.07,0,.11,0c0-.03,0-.06,0-.09,0,0-.03.03-.06.05l-.04.04Z"/>
              <path className="cls-1" d="M90.78,340.11v-11.16c-3.86.26-7.7.53-11.55.8.32,3.32.65,6.64,1.01,10.36h10.53Z"/>
              <path className="cls-1" d="M136.6,145.34v-11.16c-3.86.27-7.7.53-11.55.8.32,3.32.65,6.64,1.01,10.36h10.53Z"/>
              <path className="cls-1" d="M125.06,134.98s0-.06,0-.09c0,0-.11.1-.1.09.04,0,.07,0,.11,0Z"/>
              <path className="cls-1" d="M125.05,134.89l-.1.09s.1-.09.1-.09Z"/>
              <path className="cls-1" d="M125.51,294.83c-.06-3.77-.12-7.53-.17-11.3-3.76-.05-7.52-.11-11.28-.16v.14s-.09,0-.14,0c.19,3.52.37,7.04.58,10.87,3.84.2,7.36.39,10.88.58,0-.05,0-.09,0-.14h.14Z"/>
              <path className="cls-1" d="M125.34,283.4s0,.09,0,.14c.05,0,.09,0,.14,0l-.14-.14Z"/>
              <path className="cls-1" d="M125.51,294.83h-.14s0,.09,0,.14c.05,0,.1,0,.14,0,0-.05,0-.1,0-.14Z"/>
              <path className="cls-1" d="M114.06,283.37s-.1,0-.14,0c0,.05,0,.1,0,.14.05,0,.09,0,.14,0v-.14Z"/>
              <path className="cls-1" d="M113.92,226.23c.18,3.49.36,6.98.55,10.81h11.06c0-3.57,0-7.18,0-10.79-.06,0-.12,0-.18,0,0-.06,0-.12,0-.18-3.76,0-7.53,0-11.29.01v.14s-.09,0-.14,0Z"/>
              <path className="cls-1" d="M125.53,226.25v-.18c-.06,0-.12,0-.18,0,0,.06,0,.12,0,.18.06,0,.12,0,.18,0Z"/>
              <path className="cls-1" d="M103.09,352.44v10.49c3.49.37,6.96.73,10.42,1.1.3-3.7.6-7.41.94-11.59h-11.36Z"/>
              <path className="cls-1" d="M113.51,364.02s0,.08,0,.13c0,0,.1-.1.11-.11-.03,0-.07,0-.1-.01Z"/>
              <path className="cls-1" d="M102.62,226.25c3.77,0,7.54-.01,11.3-.02,0-.05,0-.1,0-.14.05,0,.1,0,.14,0v-11.13h-11.03c-.19,3.74-.39,7.43-.58,11.12h.17c0,.06,0,.12,0,.18Z"/>
              <path className="cls-1" d="M102.62,226.25c0-.06,0-.12,0-.18h-.17c0,.06,0,.12,0,.18.06,0,.12,0,.18,0Z"/>
              <path className="cls-1" d="M113.92,226.23s.09,0,.14,0v-.14s-.1,0-.14,0c0,.05,0,.1,0,.14Z"/>
              <path className="cls-1" d="M114.07,180.25c-.07,0-.15,0-.22,0v.21l.22-.21Z"/>
              <path className="cls-1" d="M102.61,180.26s-.1,0-.15,0l.14.16c0-.05,0-.11,0-.16Z"/>
              <path className="cls-1" d="M113.85,169.15h-10.89c-.12,3.7-.24,7.4-.36,11.1,3.75,0,7.5,0,11.25-.01v-11.09Z"/>
              <path className="cls-1" d="M102.44,191.73s0,.1,0,.15l.17-.14c-.06,0-.11,0-.17,0Z"/>
              <path className="cls-1" d="M102.46,180.26c0,.05,0,.11,0,.16h.14l-.14-.16Z"/>
              <path className="cls-1" d="M91.63,180.42v10.85c3.56.15,7.18.31,10.8.47,0-3.77.01-7.54.02-11.32h-10.82Z"/>
              <path className="cls-1" d="M90.74,363v-10.71h-10.59v10.71h10.59Z"/>
              <path className="cls-1" d="M136.58,272.19h-11.1c0,3.84,0,7.53,0,11.21h11.1v-11.21Z"/>
              <path className="cls-1" d="M125.48,283.4h-.14s.14.14.14.14v-.14Z"/>
              <path className="cls-1" d="M147.97,123.45l-.1.1s.07,0,.11-.01c0-.03,0-.06,0-.09Z"/>
              <path className="cls-1" d="M148.88,100.3c-.35-.02-.68-.04-1.02-.06v23.18s.01,0,.02,0c.33-7.51.65-15.02,1-23.12Z"/>
              <path className="cls-1" d="M147.98,123.44s-.07,0-.1-.01c0,.04,0,.08,0,.13,0,0,.1-.1.11-.12Z"/>
              <path className="cls-1" d="M148.31,168.85c0-.05,0-.1,0-.15h-.15s0,0,0,0c0,0,0,0,0,0,0,0,.15.15.14.15Z"/>
              <path className="cls-1" d="M148.14,294.83h-.28v11.4h.28v-11.4Z"/>
              <path className="cls-1" d="M148.17,168.7c0,.05.01.1.02.15h.12s-.14-.14-.14-.15Z"/>
              <path className="cls-1" d="M148.19,168.85c-.11,0-.22,0-.33,0v11.24c1.12-4.01.83-7.62.33-11.24Z"/>
              <path className="cls-1" d="M148.17,168.7s0,0,0,0c0,0,.15.15.14.15,0,0-.15-.15-.14-.15Z"/>
              <path className="cls-1" d="M148.34,427.12h-10.88v.14c-.05,0-.11,0-.16,0-.12,3.9-.24,7.8-.35,11.69.05,0,.09,0,.14,0,0,0,0,0-.01.01,0,.05,0,.09,0,.14,3.52-.24,7.05-.48,11.26-.77v-11.21Z"/>
              <path className="cls-1" d="M137.29,427.26s0-.09,0-.13h0s0,0,0,0h.16v-11.46h-11.45c0,.05,0,.11,0,.16-.05,0-.09,0-.13,0,.18,3.51.37,7.03.57,10.86,3.83.2,7.35.39,10.86.57Z"/>
              <path className="cls-1" d="M91.06,450.61s.07,0,.11-.01c0-.03,0-.06,0-.09l-.1.1Z"/>
              <path className="cls-1" d="M137.08,439.1c.21,3.31.42,6.62.66,10.43-2.13.15-3.75.36-5.38.36-11.73.03-23.45-.02-35.18.05-2.01.01-4.01.42-6.02.66.32,3.33.65,6.66,1.02,10.51h22v11.52h-21.97v22.93h22.08c.25,3.99.46,7.49.69,11.29h11.05v-22.55h11.15v-11.15c-3.37-.2-6.88-.4-10.71-.62v-11.13c7.31.22,14.56-.68,21.84.55v-23.61c-4.21.29-7.74.53-11.26.77Z"/>
              <path className="cls-1" d="M137.01,439.03s-.07.08-.07.08c.05,0,.1,0,.14,0,0-.05,0-.09,0-.14-.01.01-.03.04-.06.07Z"/>
              <path className="cls-1" d="M137.45,427.12h10.88v-34.19h-10.4c-.23,3.59-.45,7.1-.69,10.88-3.69.19-7.05.35-10.88.55-.13,3.9-.25,7.61-.37,11.31h11.45v11.46Z"/>
              <path className="cls-1" d="M137.37,427.19l.08.07v-.14h-.16s.04.04.08.07Z"/>
              <path className="cls-1" d="M126,415.66h-.15l.14.16c0-.05,0-.11,0-.16Z"/>
              <polygon className="cls-1" points="137.29 427.12 137.29 427.12 137.29 427.12 137.29 427.12"/>
              <path className="cls-1" d="M114.07,416.12s-.06,0-.09-.01c0,.04,0,.08-.02.11h0s.02-.02.04-.04l.06-.06Z"/>
              <path className="cls-1" d="M114.56,392.92h-11.02c-.22,3.54-.43,7.03-.68,11.16-5.31,0-10.37-.08-15.43.03-2.58.06-5.15.43-7.73.66.32,3.32.64,6.64,1,10.32,1.49.15,2.94.41,4.4.42,7.79.04,15.58-.02,23.38.05,1.83.02,3.66.36,5.49.55,1.4-7.63.44-15.26.58-23.19Z"/>
              <path className="cls-1" d="M79.6,404.78s.07,0,.11-.01c0-.03,0-.06,0-.09l-.1.1Z"/>
              <path className="cls-1" d="M137.29,427.12s0,.09,0,.13c.05,0,.11,0,.16,0l-.08-.07-.08-.07Z"/>
              <path className="cls-1" d="M126.43,426.68c-.2-3.83-.39-7.35-.57-10.86-3.92.13-7.85.26-11.78.39.2,4.3.44,8.61.57,12.92.09,2.82.02,5.64.02,8.95,7.73.29,15.01.57,22.27.86.11-3.89.23-7.79.35-11.69-3.51-.18-7.03-.37-10.86-.57Z"/>
              <path className="cls-1" d="M114.01,416.18s-.04.04-.04.04c.04,0,.07,0,.11,0,0-.03,0-.06,0-.09l-.06.06Z"/>
              <path className="cls-1" d="M125.85,415.66c0,.05,0,.11,0,.16.05,0,.09,0,.13,0l-.14-.16Z"/>
              <path className="cls-1" d="M137.07,438.96h0s0,0,.01-.01c-.05,0-.09,0-.14,0,0,.05,0,.11,0,.16,0,0,.04-.04.07-.08.03-.03.06-.07.06-.07Z"/>
              <path className="cls-1" d="M137.01,439.03s.05-.06.06-.07h0s-.03.03-.06.07Z"/>
              <path className="cls-1" d="M137.29,427.12h0s.08.07.08.07c-.04-.04-.08-.07-.08-.07Z"/>
              <path className="cls-1" d="M103.55,380.73h33.74c0-3.72,0-7.23,0-10.74h-33.74v10.74Z"/>
              <path className="cls-1" d="M68.33,438.45c-7.66.32-15.33-.75-23,.68.14,3.64.28,7.28.42,10.92h22.58v-11.6Z"/>
              <path className="cls-1" d="M68.34,506.85v-10.92h-10.53v10.92h10.53Z"/>
              <path className="cls-1" d="M79.61,404.66s0,.08-.01.13c0,0,.1-.1.11-.11-.03,0-.07,0-.1-.01Z"/>
              <path className="cls-1" d="M69.19,393.07v10.49c3.49.37,6.96.73,10.42,1.1.3-3.7.6-7.41.94-11.59h-11.36Z"/>
              <path className="cls-1" d="M137.44,518.93v-.15h-.15s.15.15.15.15Z"/>
              <path className="cls-1" d="M137.44,507.36v11.41h10.85c.02-.06.03-.12.04-.18v-11.24c-3.38,0-6.78,0-10.89,0Z"/>
              <polygon className="cls-1" points="137.29 518.78 137.29 518.78 137.29 518.78 137.29 518.78"/>
              <path className="cls-1" d="M137.3,518.93h.14l-.15-.15s0,.1.01.15Z"/>
              <polygon className="cls-1" points="137.29 518.78 137.29 518.78 137.29 518.78 137.29 518.78"/>
              <path className="cls-1" d="M126.45,529.67h10.45c1.27-3.4.68-7.08.4-10.74h-10.85v10.74Z"/>
              <polygon className="cls-1" points="137.29 518.78 137.29 518.78 137.44 518.93 137.29 518.78 137.29 518.78"/>
              <path className="cls-1" d="M91.07,450.49s0,.08-.01.12c0,0,.1-.1.11-.11-.03,0-.07,0-.1-.01Z"/>
              <path className="cls-1" d="M80.65,438.9v10.49c3.49.37,6.96.73,10.42,1.1.3-3.7.6-7.41.94-11.59h-11.36Z"/>
              <path className="cls-1" d="M148.34,461.94v.11s0-.08,0-.11h0Z"/>
              <path className="cls-1" d="M148.42,461.98s.02-.02.02-.02c-.03,0-.07,0-.1-.01,0,.04,0,.08,0,.11h0s.04-.05.07-.08Z"/>
              <path className="cls-1" d="M149.33,438.26c-.34.02-.67.05-1,.07v23.61h0c.32-7.6.64-15.2.99-23.68Z"/>
              <path className="cls-1" d="M148.71,507.28s.09.09.08.09c0-.05,0-.1,0-.15h-.15s0,0,0,0c0,0,0,0,0,0,0,0,.03.03.06.06Z"/>
              <path className="cls-1" d="M148.34,462.05s.07,0,.11,0c0-.03,0-.06,0-.09,0,0-.01.01-.02.02l-.07.07Z"/>
              <path className="cls-1" d="M148.34,462.05l.07-.07s-.08.07-.07.07Z"/>
              <path className="cls-1" d="M148.71,507.28s-.06-.06-.06-.06c0,.05.01.1.02.15.04,0,.08,0,.12,0,0,0-.04-.05-.08-.09Z"/>
              <path className="cls-1" d="M148.79,507.37s-.04-.05-.08-.09c.04.04.09.09.08.09Z"/>
              <path className="cls-1" d="M148.67,507.37c-.11,0-.22,0-.33,0v11.24c1.12-4,.83-7.61.33-11.23Z"/>
              <path className="cls-1" d="M148.65,507.22s0,0,0,0c0,0,.03.03.06.06-.03-.03-.06-.06-.06-.06Z"/>
              <path className="cls-1" d="M137.68,680.98v-10.71h-22.78v10.81h10.78c.2,4.05.36,7.4.57,11.48h10.91c.19,4.05.35,7.41.53,11.1,3.6.38,7.06.74,10.51,1.11v-23.18c-3.62-.21-6.86-.4-10.51-.61Z"/>
              <path className="cls-1" d="M137.07,612.8h-10.71v10.71h10.71v-10.71Z"/>
              <path className="cls-1" d="M126.62,577.03v22.25h10.83c.19,3.99.35,7.48.53,11.32h10.33c1.09-3.76,1.41-25.36.41-33.57h-22.1Z"/>
            </g>
          </svg>
          </div>
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
                From September 30 to October 3, 2025<br />
                Milan at the Museo della Scienza e della Tecnologia.
              </h2>
              <p 
                className="panel-text-mobile"
                style={{
                  fontSize: '1.5rem',
                  lineHeight: '1.6',
                  marginBottom: '2rem'
                }}
              >
                Across three days, we'll dive into real business challenges, be inspired by leading voices, and work in cross-functional teams
                to shape bold ideas for the future of our industry.
              </p>
              
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
                  ref={(el) => {
                    dayCardsRef.current[0] = el;
                  }}
                  style={{
                    background: '#4d68f1',
                    padding: '1.5rem',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'auto',
                    opacity: 0,
                    transform: 'translateY(50px) scale(0.9)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(77, 104, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => handleDayClick(1)} className="day-card-mobile">
                  {/* SVG Top */}
                  <div style={{
                    position: 'absolute',
                    top: -25,
                    left: 0,
                    width: '100%',
                    height: 'auto'
                  }}>
                    <img src="/assets/pixels-blue-top.svg" alt="" style={{ width: '100%', height: 'auto' }} className="svg-decorative-mobile" />
                  </div>
                  
                  <div style={{
                    fontSize: '2.2rem',
                    fontWeight: 'bold',
                    color: 'white',
                    fontFamily: 'Dogica, monospace',
                    marginBottom: '0.5rem'
                  }} className="day-title-mobile">
                    DAY 1
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'white',
                    lineHeight: '1.4'
                  }} className="day-subtitle-mobile">
                    Inspiration & Briefing
                  </div>
                  
                  {/* SVG Bottom */}
                  <div style={{
                    position: 'absolute',
                    bottom: -25,
                    left: 0,
                    width: '100%',
                    height: 'auto'
                  }}>
                    <img src="/assets/pixels-blue-bottom.svg" alt="" style={{ width: '100%', height: 'auto' }} className="svg-decorative-mobile" />
                  </div>
                </div>

                {/* DAY 2 */}
                <div 
                  ref={(el) => {
                    dayCardsRef.current[1] = el;
                  }}
                  style={{
                    background: '#4d68f1',
                    padding: '1.5rem',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'auto',
                    opacity: 0,
                    transform: 'translateY(50px) scale(0.9)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(77, 104, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => handleDayClick(2)} className="day-card-mobile">
                  {/* SVG Top */}
                  <div style={{
                    position: 'absolute',
                    top: -25,
                    left: 0,
                    width: '100%',
                    height: 'auto'
                  }}>
                    <img src="/assets/pixels-blue-top.svg" alt="" style={{ width: '100%', height: 'auto' }} className="svg-decorative-mobile" />
                  </div>
                  
                  <div style={{
                    fontSize: '2.2rem',
                    fontWeight: 'bold',
                    color: 'white',
                    fontFamily: 'Dogica, monospace',
                    marginBottom: '0.5rem'
                  }} className="day-title-mobile">
                    DAY 2
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'white',
                    lineHeight: '1.4'
                  }} className="day-subtitle-mobile">
                    Creation & Collaboration
                  </div>
                  
                  {/* SVG Bottom */}
                  <div style={{
                    position: 'absolute',
                    bottom: -25,
                    left: 0,
                    width: '100%',
                    height: 'auto'
                  }}>
                    <img src="/assets/pixels-blue-bottom.svg" alt="" style={{ width: '100%', height: 'auto' }} className="svg-decorative-mobile" />
                  </div>
                </div>

                {/* DAY 3 */}
                <div 
                  ref={(el) => {
                    dayCardsRef.current[2] = el;
                  }}
                  style={{
                    background: '#4d68f1',
                    padding: '1.5rem',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'auto',
                    opacity: 0,
                    transform: 'translateY(50px) scale(0.9)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(77, 104, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => handleDayClick(3)} className="day-card-mobile">
                  {/* SVG Top */}
                  <div style={{
                    position: 'absolute',
                    top: -25,
                    left: 0,
                    width: '100%',
                    height: 'auto'
                  }}>
                    <img src="/assets/pixels-blue-top.svg" alt="" style={{ width: '100%', height: 'auto' }} className="svg-decorative-mobile" />
                  </div>
                  
                  <div style={{
                    fontSize: '2.2rem',
                    fontWeight: 'bold',
                    color: 'white',
                    fontFamily: 'Dogica, monospace',
                    marginBottom: '0.5rem'
                  }} className="day-title-mobile">
                    DAY 3
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'white',
                    lineHeight: '1.4'
                  }} className="day-subtitle-mobile">
                    Presentation
                  </div>
                  
                  {/* SVG Bottom */}
                  <div style={{
                    position: 'absolute',
                    bottom: -25,
                    left: 0,
                    width: '100%',
                    height: 'auto'
                  }}>
                    <img src="/assets/pixels-blue-bottom.svg" alt="" style={{ width: '100%', height: 'auto' }} className="svg-decorative-mobile" />
                  </div>
                </div>

                {/* DAY 4 */}
                <div 
                  ref={(el) => {
                    dayCardsRef.current[3] = el;
                  }}
                  style={{
                    background: '#4d68f1',
                    padding: '1.5rem',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'auto',
                    opacity: 0,
                    transform: 'translateY(50px) scale(0.9)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(77, 104, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => handleDayClick(4)} className="day-card-mobile">
                  {/* SVG Top */}
                  <div style={{
                    position: 'absolute',
                    top: -25,
                    left: 0,
                    width: '100%',
                    height: 'auto'
                  }}>
                    <img src="/assets/pixels-blue-top.svg" alt="" style={{ width: '100%', height: 'auto' }} className="svg-decorative-mobile" />
                  </div>
                  
                  <div style={{
                    fontSize: '2.2rem',
                    fontWeight: 'bold',
                    color: 'white',
                    fontFamily: 'Dogica, monospace',
                    marginBottom: '0.5rem'
                  }} className="day-title-mobile">
                    DAY 4
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'white',
                    lineHeight: '1.4'
                  }} className="day-subtitle-mobile">
                    Awards
                  </div>
                  
                  {/* SVG Bottom */}
                  <div style={{
                    position: 'absolute',
                    bottom: -25,
                    left: 0,
                    width: '100%',
                    height: 'auto'
                  }}>
                    <img src="/assets/pixels-blue-bottom.svg" alt="" style={{ width: '100%', height: 'auto' }} className="svg-decorative-mobile" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

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