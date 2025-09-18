'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface Brief {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  speaker: string;
  day: number;
  time: string;
  category: string;
}

const briefsData: Brief[] = [
  {
    id: 1,
    title: "The Future Experience",
    subtitle: "From a product centric approach to a life enhancing Experience",
    description: "Explore how eyewear is evolving beyond simple correction and style to become a gateway to broader health, performance, and connectivity. This brief challenges teams to rethink the entire user experience and create solutions that enhance life quality through innovative eyewear technology.",
    speaker: "Norbert Gorny - Chief Scientific Officer",
    day: 1,
    time: "10:30 AM",
    category: "Experience Design"
  },
  {
    id: 2,
    title: "The Myopia Ecosystem",
    subtitle: "From Awareness to Prevention & Care",
    description: "Address the global challenge of myopia through a comprehensive ecosystem approach. This brief focuses on creating solutions that span from early detection and awareness to advanced prevention strategies and ongoing care management.",
    speaker: "Arnaud Ribadeau Dumas – Head of Global Myopia",
    day: 1,
    time: "11:30 AM",
    category: "Health & Prevention"
  },
  {
    id: 3,
    title: "Beyond Style",
    subtitle: "Rethinking Light & Vision",
    description: "Challenge the traditional boundaries of eyewear design by exploring how light-responsive technology can create adaptive solutions. This brief encourages innovation in photochromic technology and smart materials that respond to environmental conditions.",
    speaker: "Coralie Barrau - R&D Transitions Sciences & Innovation Manager",
    day: 1,
    time: "14:30 PM",
    category: "Smart Technology"
  }
];

const Brief: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const briefRef = useRef<HTMLDivElement>(null);
  const briefItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Animazione staggered per i brief items
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          gsap.fromTo(target, 
            {
              x: 100,
              opacity: 0,
              scale: 0.9
            },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'power2.out',
              delay: parseFloat(target.dataset.index || '0') * 0.2
            }
          );
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Osserva tutti i brief items
    briefItemsRef.current.forEach((item, index) => {
      if (item) {
        item.dataset.index = index.toString();
        item.style.opacity = '0';
        item.style.transform = 'translateX(100px) scale(0.9)';
        observer.observe(item);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [isClient]);

  const handleBriefClick = (brief: Brief) => {
    setSelectedBrief(brief);
  };

  const handleCloseModal = () => {
    setSelectedBrief(null);
  };

  return (
    <>
      <div ref={briefRef} style={{
        backgroundColor: '#4d68f1',
        width: '100%',
        padding: '4rem 2rem',
        color: '#333'
      }}>
        <div 
          className="brief-grid-mobile"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'start'
          }}
        >
          {/* Sezione sinistra - Testo */}
          <div style={{
            paddingRight: '2rem'
          }}>
            <h2 
              className="brief-title-mobile"
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '2rem',
                color: 'white'
              }}
            >
              BRIEF
            </h2>
            <p 
              className="brief-text-mobile"
              style={{
                fontSize: '1.2rem',
                lineHeight: '1.6',
                marginBottom: '2rem',
                color: 'white'
              }}
            >
              SIMPLICITY AND CLARITY ARE OUR GUIDING PRINCIPLES, FROM START TO FINISH - FROM DESIGN TO PRODUCT DEVELOPMENT.
            </p>
            <a 
              href="#" 
              style={{
                color: 'white',
                textDecoration: 'underline',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              VIEW ALL WORKS
            </a>
          </div>

          {/* Sezione destra - Lista brief */}
          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            {briefsData.map((brief, index) => (
              <div
                key={brief.id}
                ref={(el) => {
                  briefItemsRef.current[index] = el;
                }}
                style={{
                  padding: '1.5rem 0',
                  borderBottom: index < briefsData.length - 1 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: 0,
                  transform: 'translateX(100px) scale(0.9)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => handleBriefClick(brief)}
              >
                <div style={{
                  flex: 1
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '0.5rem'
                  }}>
                    .{String(brief.id).padStart(2, '0')}
                  </div>
                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    marginBottom: '0.3rem',
                    color: 'white'
                  }}>
                    {brief.title.toUpperCase()}
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: '1.4'
                  }}>
                    {brief.category.toUpperCase()}
                  </p>
                </div>
                {index < 2 && (
                  <div style={{
                    fontSize: '1.2rem',
                    color: 'white',
                    marginLeft: '1rem'
                  }}>
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal per i dettagli del brief */}
      {selectedBrief && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100svh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(8px)'
        }}
        onClick={handleCloseModal}
        >
          <div style={{
            backgroundColor: '#4d68f1',
            width: '100vw',
            height: '100svh',
            overflow: 'auto',
            color: 'white',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: '0'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Header con pulsante di chiusura */}
            <div 
              className="brief-modal-header-mobile"
              style={{
                position: 'relative',
                padding: '4rem 4rem 3rem 4rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Pulsante di chiusura */}
              <button
                onClick={handleCloseModal}
                style={{
                  position: 'absolute',
                  top: '3rem',
                  right: '3rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '1.8rem',
                  cursor: 'pointer',
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10000,
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>

              {/* Header del brief */}
              <div style={{
                textAlign: 'left',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                <div 
                  className="brief-modal-title-mobile"
                  style={{
                    fontSize: '6rem',
                    fontWeight: 'bold',
                    opacity: 0.3,
                    marginBottom: '1rem'
                  }}
                >
                  {selectedBrief.id}
                </div>
                <h2 
                  className="brief-modal-subtitle-mobile"
                  style={{
                    fontSize: '3.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                  }}
                >
                  {selectedBrief.title}
                </h2>
                <p 
                  className="brief-modal-description-mobile"
                  style={{
                    fontSize: '1.8rem',
                    opacity: 0.8,
                    fontStyle: 'italic',
                    marginBottom: '1rem'
                  }}
                >
                  {selectedBrief.subtitle}
                </p>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '0.8rem 2rem',
                  borderRadius: '25px',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}>
                  {selectedBrief.category}
                </div>
              </div>
            </div>

                        {/* Contenuto principale */}
            <div 
              className="brief-modal-content-mobile"
              style={{
                flex: 1,
                padding: '4rem 4rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                maxWidth: '1400px',
                margin: '0 auto',
                width: '100%'
              }}
            >
              {/* Layout a colonna singola */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '3rem',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                {/* Descrizione */}
                <div>
                  <h3 
                    className="brief-modal-description-title-mobile"
                    style={{
                      fontSize: '2.2rem',
                      fontWeight: '600',
                      marginBottom: '2rem',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    Challenge Description
                  </h3>
                  <p 
                    className="brief-modal-description-text-mobile"
                    style={{
                      fontSize: '1.5rem',
                      lineHeight: '1.8',
                      opacity: 0.9,
                      marginBottom: '2rem'
                    }}
                  >
                    {selectedBrief.description}
                  </p>
                </div>

                {/* Informazioni */}
                <div 
                  className="brief-modal-cards-mobile"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                  }}
                >
                  {/* Card Speaker */}
                  <div 
                    className="brief-modal-card-mobile"
                    style={{
                      padding: '2.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <h4 
                      className="brief-modal-card-title-mobile"
                      style={{
                        fontSize: '1.4rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        opacity: 0.9,
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      Speaker
                    </h4>
                    <p 
                      className="brief-modal-card-text-mobile"
                      style={{
                        fontSize: '1.3rem',
                        fontWeight: '500'
                      }}
                    >
                      {selectedBrief.speaker}
                    </p>
                  </div>

                  {/* Card Schedule */}
                  <div 
                    className="brief-modal-card-mobile"
                    style={{
                      padding: '2.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <h4 
                      className="brief-modal-card-title-mobile"
                      style={{
                        fontSize: '1.4rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        opacity: 0.9,
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      Schedule
                    </h4>
                    <p 
                      className="brief-modal-card-text-mobile"
                      style={{
                        fontSize: '1.3rem',
                        fontWeight: '500'
                      }}
                    >
                      Day {selectedBrief.day} • {selectedBrief.time}
                    </p>
                  </div>

                  {/* Call to action */}
                  <div 
                    className="brief-modal-card-mobile"
                    style={{
                      padding: '2.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      borderRadius: '20px',
                      border: '2px solid rgba(255, 255, 255, 0.25)',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    }}
                  >
                    <h4 
                      className="brief-modal-card-title-mobile"
                      style={{
                        fontSize: '1.6rem',
                        fontWeight: '600',
                        marginBottom: '1rem'
                      }}
                    >
                      Ready to tackle this challenge?
                    </h4>
                    <p 
                      className="brief-modal-card-text-mobile"
                      style={{
                        fontSize: '1.2rem',
                        opacity: 0.9
                      }}
                    >
                      Form your team and start innovating!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Brief; 