'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface AgendaOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
}

interface AgendaData {
  title: string;
  subtitle: string;
  morning: AgendaItem[];
  afternoon: AgendaItem[];
  info?: string;
}

interface AgendaItem {
  time?: string;
  title: string;
  description: string;
  speaker?: string;
}

// Funzioni helper per il layout
const getDayOfWeek = (day: number): string => {
  const days = ['Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return days[day - 1] || 'Day';
};

const getDate = (day: number): string => {
  const dates = [
    '30 September 2025',
    '1 October 2025', 
    '2 October 2025',
    '3 October 2025'
  ];
  return dates[day - 1] || 'Date';
};

const getAllEvents = (agenda: AgendaData): Array<AgendaItem & { time: string }> => {
  const morningEvents = agenda.morning.map((item) => ({
    ...item,
    time: item.time || '' // Usa il valore di `time` direttamente dall'oggetto agendaData
  }));

  const afternoonEvents = agenda.afternoon.map((item) => ({
    ...item,
    time: item.time || '' // Usa il valore di `time` direttamente dall'oggetto agendaData
  }));

  return [...morningEvents, ...afternoonEvents];
};

const agendaData: Record<number, AgendaData> = {
  1: {
    title: "DAY 1",
    subtitle: "Inspiration & Briefing",
    info: "Museo della Scienza e della Tecnologia",
    morning: [
      { time: "09.00 - 09.30", title: "Check in & Welcome coffee", description: "" },
      { time: "09.30 - 10.15", title: "Welcome & Opening", description: "Chief R&d, Product & Marketing Officer, Italy", speaker: "Federico Buffa" },
      { time: "10.15 - 11.00", title: "Inspirational talk", description: "Senior VP Emerging & Medical Technologies, EssilorLuxottica", speaker: "Denis COHEN-TANNOUDJI" },
      { time: "11.00 - 11.15", title: "BRIEF 1", description: "" },
      { time: "11.15 - 11.30", title: "Coffee break", description: "" },
      { time: "11.30 - 12.15", title: "Inspirational talk", description: "Director Global Myopia Category", speaker: "Balthazar Masurel" },
      { time: "12.15 - 12.30", title: "BRIEF 2", description: "" },
      { time: "12.30 - 13.15", title: "Inspirational talk", description: "Global Head of Scientific and Clinical Collaboration per Transitions", speaker: "Coralie Barrau" },
      { time: "13.15 - 13.30", title: "BRIEF 3", description: "" },
      { time: "13.30 - 14.30", title: "LUNCH", description: "" }
    ],
    afternoon: [
      { time: "14.30 - 15.15", title: "Inspirational talk", description: "Head of Sport Performance Hub Marketing", speaker: "Caio Amato" },
      { time: "15.15 - 15.45", title: "Team Assigment", description: "" },
      { time: "15.45 - 16.00", title: "Coffee break", description: "" },
      { time: "16.00 - 18.15", title: "Activity circuit", description: "" },
      { time: "18.15", title: "Wrap up & Aperitivo", description: "" }
    ]
  },
  2: {
    title: "DAY 2",
    subtitle: "Creation & Collaboration",
    info: "Museo della Scienza e della Tecnologia",
    morning: [
      { time: "09:00 – 09:30", title: "Welcome coffee", description: "" },
      { time: "09:30 – 09:45", title: "Introduction to the day", description: "" },
      { time: "09:45 – 10:45", title: "Understanding the challenge", description: "" },
      { time: "10:45 – 11:15", title: "Defining the opportunity", description: "" },
      { time: "11:15 – 11:30", title: "Coffee break", description: "" },
      { time: "11:30 – 12:15", title: "Brainstorming & clustering", description: "" },
      { time: "12:15 – 13:00", title: "Idea definition", description: "" }
    ],
    afternoon: [
      { time: "13:00 – 13:45", title: "Buffet lunch", description: "" },
      { time: "13:45 – 14:45", title: "Fine-tuning the idea & storyboard", description: "" },
      { time: "14:45 – 16:00", title: "Creating delivery materials (presentation + creative assets)", description: "" },
      { time: "16:00 – 16:15", title: "Coffee break", description: "" },
      { time: "16:15 – 18:30", title: "Finalizing deliverables (presentation + prototype/visuals)", description: "" },
      { time: "18:30", title: "End of day wrap-up", description: "" }
    ]
  },
  3: {
    title: "DAY 3",
    subtitle: "Presentation",
    info: "CADORNA + ONLINE",
    // info non specificata
    morning: [
      { time: "08.30", title: "Final delievery", description: "" },
      { time: "09.00 - 15.30", title: "Presentation to the Jury", description: "" }
    ],
    afternoon: [
      { time: "15.30 - 16.15", title: "Announcement to extended jury & selection of overall winners", description: "" },
      { time: "END OF DAY", title: "Notification to winning teams for next-day pitch presentation", description: "" }
    ]
  },
  4: {
    title: "DAY 4",
    subtitle: "Awards",
    info: "TORTONA EXPERIENCE CENTER",
    morning: [
      { time: "09:30 – 10:30", title: "Welcome & Hackathon Wrap-up speech", description: "" },
      { time: "10:30 – 11:00", title: "Brief 1 recap & Winning Team's Pitch", description: "" },
      { time: "11:00 – 11:30", title: "Brief 2 recap & Winning Team's Pitch", description: "" },
      { time: "11:30 – 11:45", title: "Coffee break", description: "" },
      { time: "11:45 – 12:15", title: "Brief 3 recap & Winning Team's Pitch", description: "" },
      { time: "12:15 – 13:00", title: "Final Awards Ceremony", description: "" }
    ],
    afternoon: []
  }
 };

const AgendaOverlay: React.FC<AgendaOverlayProps> = ({ isOpen, onClose, day }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  // Durate animazioni (in secondi) usate anche per il delay del body lock
  const BACKDROP_DURATION = 0.3;
  const CONTENT_DELAY = 0.1;
  const CONTENT_DURATION = 0.4;
  const OPEN_ANIM_TOTAL_MS = Math.round((CONTENT_DELAY + CONTENT_DURATION) * 1000);
  const lockTimeoutRef = useRef<number | null>(null);


  // Render helper: replace '-' or '–' with line breaks
  const renderTime = (time?: string) => {
    if (!time) return null;
    const parts = time.split(/\s[-–]\s/);
    return (
      <>
        {parts.map((p, i) => (
          <React.Fragment key={i}>
            {p}
            {i < parts.length - 1 && <br />}
          </React.Fragment>
        ))}
      </>
    );
  };

  // Rileva viewport mobile per applicare padding/margini ridotti
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    // Blocca lo scroll della pagina sottostante quando l'overlay è aperto,
    // MA con un delay pari alla durata dell'animazione di apertura per evitare lag.
    if (isOpen) {
      // Pulisce eventuale timeout precedente
      if (lockTimeoutRef.current) {
        window.clearTimeout(lockTimeoutRef.current);
      }
      lockTimeoutRef.current = window.setTimeout(() => {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        lockTimeoutRef.current = null;
      }, OPEN_ANIM_TOTAL_MS);
    } else {
      // Se si chiude prima che scatti il lock, annulla il timeout
      if (lockTimeoutRef.current) {
        window.clearTimeout(lockTimeoutRef.current);
        lockTimeoutRef.current = null;
      }

      // Ripristina lo scroll del body
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (top) {
        const y = parseInt(top || '0', 10) * -1;
        window.scrollTo(0, y);
      }
    }

    // Cleanup in caso di smontaggio
    return () => {
      if (lockTimeoutRef.current) {
        window.clearTimeout(lockTimeoutRef.current);
        lockTimeoutRef.current = null;
      }
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (top) {
        const y = parseInt(top || '0', 10) * -1;
        window.scrollTo(0, y);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Animazione di apertura
      gsap.set(overlayRef.current, { display: 'flex' });
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { 
        opacity: 0, 
        scale: 0.8, 
        y: 50 
      });

      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: BACKDROP_DURATION,
        ease: 'power2.out'
      });

      gsap.to(contentRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: CONTENT_DURATION,
        ease: 'power2.out',
        delay: CONTENT_DELAY
      });
    } else {
      // Animazione di chiusura
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      });

      gsap.to(contentRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(overlayRef.current, { display: 'none' });
        }
      });
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const agenda = agendaData[day];

  if (!agenda) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleBackdropClick}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)'
        }}
      />

      {/* Contenuto (pixel sticker inspired) */}
      <div
        ref={contentRef}
        className="agenda-modal-content-mobile"
        style={{
          position: 'relative',
          backgroundColor: '#0a0a0a',
          borderRadius: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'auto',
          padding: '3rem',
          boxShadow: '0 0 0 6px rgba(77,104,241,0.2), 0 20px 60px rgba(0, 0, 0, 0.5)',
          zIndex: 10000
        }}
      >
        {/* Pulsante di chiusura */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            background: '#000',
            border: '3px solid #4d68f1',
            fontSize: '1.6rem',
            cursor: 'pointer',
            color: '#fff',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            boxShadow: '0 6px 0 #1d2bb5'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 0 #1d2bb5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 0 #1d2bb5';
          }}
        >
          ×
        </button>

                {/* Layout principale */}
        <div 
          className="agenda-modal-layout-mobile"
          style={{
            display: 'grid',
            gridTemplateColumns: '400px 1fr',
            gap: '4rem',
            height: '100%',
            padding: '4rem'
          }}
        >
          
          {/* Sezione sinistra - Informazioni generali (fissa) */}
          <div 
            className="agenda-modal-left-section-mobile"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              position: 'sticky',
              top: '4rem',
              height: 'fit-content'
            }}
          >
            {/* Hero compatto: DAY + sottotitolo, semplice e meno ingombrante */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  fontSize: '1.6rem',
                  background: '#fff',
                  color: '#4d68f1',
                  display: 'inline-block',
                  padding: '0.5rem 0.75rem',
                  fontFamily: "'Dogica Pixel', monospace",
                  fontWeight: 800,
                  letterSpacing: '2px'
                }}
              >
                {agenda.title}
              </div>
              <div
                style={{
                  color: '#fff',
                  opacity: 0.9,
                  marginTop: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: "'Avenir Next', sans-serif"
                }}
              >
                {agenda.subtitle}
              </div>
            </div>

            {/* Giorno della settimana */}
            <h2 
              className="agenda-modal-day-of-week-mobile"
              style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.25rem',
                marginTop: '0.5rem',
                fontFamily: "'Dogica Pixel', monospace",
                letterSpacing: '1px'
              }}
            >
              {getDayOfWeek(day)}
            </h2>

            {/* Data */}
            <p 
              className="agenda-modal-date-mobile"
              style={{
                fontSize: '1.1rem',
                color: 'rgba(255,255,255,0.85)',
                marginBottom: '2rem',
                fontFamily: "'Avenir Next', sans-serif",
                letterSpacing: '1px'
              }}
            >
              {getDate(day)}
            </p>

            {/* Sottotitolo */}
            <h3 
              className="agenda-modal-subtitle-mobile"
              style={{
                fontSize: '1.8rem',
                fontWeight: '500',
                color: 'white',
                marginBottom: '1rem'
              }}
            >
              {agenda.subtitle}
            </h3>

            {/* Informazioni aggiuntive dinamiche */}
            <p 
              className="agenda-modal-info-mobile"
              style={{
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.8)',
                opacity: 0.8,
                lineHeight: '1.6'
              }}
            >
              {(agenda.info || 'Museo della Scienza e della Tecnologia')
                .split('\n')
                .map((line, i, arr) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
            </p>
          </div>

          {/* Sezione destra - Programma dettagliato (scrollabile) */}
          <div 
            className="agenda-modal-right-section-mobile"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 8rem)',
              paddingRight: '1rem',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
            }}
          >
            <h2 
              className="agenda-modal-program-title-mobile"
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#fff',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: "'Dogica Pixel', monospace"
              }}
            >
              Schedule
            </h2>

            {/* Lista programma */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {getAllEvents(agenda).map((event, index) => (
                <div
                  key={index}
                  className="agenda-modal-event-mobile"
                  style={{
                    display: 'flex',
                    padding: '0.9rem 0',
                    backgroundColor: 'transparent',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.15)'
                  }}
                >
                  {/* Orario */}
                  <div 
                    className="agenda-modal-event-time-mobile"
                    style={{
                      flex: 1,
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: "'Dogica Pixel', monospace"
                    }}
                  >
                    {renderTime(event.time)}
                  </div>

                  {/* Contenuto evento */}
                  <div style={{
                    flex: 2
                  }}>
                    <h4 
                      className="agenda-modal-event-title-mobile"
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: '#fff',
                        marginBottom: '0.15rem',
                        fontFamily: "'Avenir Next', sans-serif",
                      }}
                    >
                      {event.title}
                    </h4>
                    {event.speaker && (
                      <p 
                        className="agenda-modal-event-speaker-mobile"
                        style={{
                          fontSize: '0.85rem',
                          color: '#4d68f1',
                          fontWeight: 600,
                          fontStyle: 'normal'
                        }}
                      >
                        {event.speaker}
                      </p>
                    )}
                    {event.description && (
                      <p 
                        className="agenda-modal-event-description-mobile"
                        style={{
                          fontSize: '0.95rem',
                          color: 'rgba(255,255,255,0.75)',
                          lineHeight: '1.4',
                          marginBottom: '0.15rem'
                        }}
                      >
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaOverlay;
