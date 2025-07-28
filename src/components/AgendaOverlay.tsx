'use client';

import React, { useEffect, useRef } from 'react';
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
}

interface AgendaItem {
  time?: string;
  title: string;
  description: string;
  speaker?: string;
}

// Funzioni helper per il layout
const getDayOfWeek = (day: number): string => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
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
  const morningEvents = agenda.morning.map((item, index) => ({
    ...item,
    time: getTimeForMorning(index)
  }));
  
  const afternoonEvents = agenda.afternoon.map((item, index) => ({
    ...item,
    time: getTimeForAfternoon(index)
  }));
  
  return [...morningEvents, ...afternoonEvents];
};

const getTimeForMorning = (index: number): string => {
  const times = ['09:00 AM', '10:30 AM', '12:00 PM', '13:30 PM', '15:00 PM'];
  return times[index] || 'Time';
};

const getTimeForAfternoon = (index: number): string => {
  const times = ['16:00 PM', '17:30 PM', '19:00 PM'];
  return times[index] || 'Time';
};

const agendaData: Record<number, AgendaData> = {
  1: {
    title: "DAY 1",
    subtitle: "Inspiration & Briefing",
    morning: [
      {
        title: "Welcome & Opening Remarks",
        description: "Introduction by leadership and context-setting keynote."
      },
      {
        title: "Brief #1 – The Future Experience",
        description: "From a product centric approach to a life enhancing Experience.",
        speaker: "Inspirational Talk - Norbert Gorny - Chief Scientific Officer"
      },
      {
        title: "Brief #2 – The Myopia Ecosystem",
        description: "From Awareness to Prevention & Care.",
        speaker: "Inspirational Talk - Arnaud Ribadeau Dumas – Head of Global Myopia"
      },
      {
        title: "Lunch Break",
        description: ""
      },
      {
        title: "Brief #3 – Beyond Style",
        description: "Rethinking Light & Vision",
        speaker: "Inspirational Talk – Coralie Barrau - R&d Transitions Sciences & Innov Manager"
      },
      {
        title: "The CreativeHub Hackathon",
        description: ""
      }
    ],
    afternoon: [
      {
        title: "Team Assignment & Identity Creation",
        description: "Team formation and challenge association"
      },
      {
        title: "Shared Insights & Challenge Deep Dive",
        description: "Collaborative analysis of key points and mentoring support."
      },
      {
        title: "Wrap-Up & Info for Day 2",
        description: "Closing thoughts followed by informal networking aperitivo"
      }
    ]
  },
  2: {
    title: "DAY 2",
    subtitle: "Creation & Collaboration",
    morning: [
      {
        title: "Morning Briefing",
        description: "Review of Day 1 insights and Day 2 objectives"
      },
      {
        title: "Team Collaboration",
        description: "Intensive ideation and prototyping sessions"
      },
      {
        title: "Mentor Sessions",
        description: "One-on-one guidance and feedback"
      }
    ],
    afternoon: [
      {
        title: "Continued Development",
        description: "Refinement of concepts and prototypes"
      },
      {
        title: "Peer Review",
        description: "Cross-team feedback and iteration"
      },
      {
        title: "Preparation for Day 3",
        description: "Final preparations for presentations"
      }
    ]
  },
  3: {
    title: "DAY 3",
    subtitle: "Presentation",
    morning: [
      {
        title: "Final Preparations",
        description: "Last-minute refinements and rehearsals"
      },
      {
        title: "Presentation Setup",
        description: "Technical setup and final checks"
      }
    ],
    afternoon: [
      {
        title: "Team Presentations",
        description: "Each team presents their innovative solutions"
      },
      {
        title: "Judging & Evaluation",
        description: "Expert panel evaluation and feedback"
      },
      {
        title: "Closing Ceremony",
        description: "Recognition and celebration of achievements"
             }
     ]
   },
   4: {
     title: "DAY 4",
     subtitle: "Awards",
     morning: [
       {
         title: "Award Ceremony",
         description: "Presentation of awards and recognition of outstanding achievements"
       },
       {
         title: "Closing Remarks",
         description: "Final thoughts and future outlook"
       }
     ],
     afternoon: [
       {
         title: "Networking & Celebration",
         description: "Informal networking and celebration of the hackathon success"
       }
     ]
   }
 };

const AgendaOverlay: React.FC<AgendaOverlayProps> = ({ isOpen, onClose, day }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

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
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(contentRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        delay: 0.1
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

      {/* Contenuto */}
      <div
        ref={contentRef}
        className="agenda-modal-content-mobile"
        style={{
          position: 'relative',
          backgroundColor: 'rgb(77, 104, 241)',
          borderRadius: '0px',
          width: '100vw',
          height: '100vh',
          overflow: 'auto',
          padding: '3rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
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
            background: 'white',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            color: '#4d68f1',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
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
            {/* Banner DAY */}
            <div 
              className="agenda-modal-day-banner-mobile"
              style={{
                backgroundColor: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                width: '100%',
                textAlign: 'center'
              }}
            >
              <h1 
                className="agenda-modal-day-title-mobile"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#4d68f1',
                  margin: 0,
                  fontFamily: 'Dogica, monospace'
                }}
              >
                {agenda.title}
              </h1>
            </div>

            {/* Giorno della settimana */}
            <h2 
              className="agenda-modal-day-of-week-mobile"
              style={{
                fontSize: '3rem',
                fontWeight: '600',
                color: 'white',
                marginBottom: '0.5rem',
                marginTop: '2rem'
              }}
            >
              {getDayOfWeek(day)}
            </h2>

            {/* Data */}
            <p 
              className="agenda-modal-date-mobile"
              style={{
                fontSize: '1.5rem',
                color: 'white',
                marginBottom: '2rem',
                opacity: 0.9
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

            {/* Informazioni aggiuntive */}
            <p 
              className="agenda-modal-info-mobile"
              style={{
                fontSize: '1rem',
                color: 'white',
                opacity: 0.8,
                lineHeight: '1.6'
              }}
            >
              *Museo della Scienza e della Tecnologia<br/>
              Milan, Italy
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
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '2rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              Programma
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
                    padding: '1.5rem',
                    backgroundColor: index % 2 === 0 ? 'white' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    alignItems: 'flex-start',
                    gap: '2rem'
                  }}
                >
                  {/* Orario */}
                  <div 
                    className="agenda-modal-event-time-mobile"
                    style={{
                      minWidth: '120px',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      color: index % 2 === 0 ? '#4d68f1' : 'white'
                    }}
                  >
                    {event.time}
                  </div>

                  {/* Contenuto evento */}
                  <div style={{
                    flex: 1
                  }}>
                    <h4 
                      className="agenda-modal-event-title-mobile"
                      style={{
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        color: index % 2 === 0 ? '#333' : 'white',
                        marginBottom: '0.5rem'
                      }}
                    >
                      {event.title}
                    </h4>
                    {event.description && (
                      <p 
                        className="agenda-modal-event-description-mobile"
                        style={{
                          fontSize: '1rem',
                          color: index % 2 === 0 ? '#666' : 'rgba(255, 255, 255, 0.8)',
                          lineHeight: '1.5',
                          marginBottom: '0.5rem'
                        }}
                      >
                        {event.description}
                      </p>
                    )}
                    {event.speaker && (
                      <p 
                        className="agenda-modal-event-speaker-mobile"
                        style={{
                          fontSize: '0.9rem',
                          color: index % 2 === 0 ? '#4d68f1' : 'rgba(255, 255, 255, 0.7)',
                          fontWeight: '500',
                          fontStyle: 'italic'
                        }}
                      >
                        {event.speaker}
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