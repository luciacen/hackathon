'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

interface Speaker {
  id: number;
  name: string;
  title: string;
  company: string;
  image: string;
  bio: string;
  topic: string;
  day: number;
}

const speakersData: Speaker[] = [
  {
    id: 1,
    name: "Nome Cognome",
    title: "CEO of Innovation",
    company: "EssilorLuxottica",
    image: "/assets/placeholdr-speaker.png",
    bio: "Leading innovation in eyewear technology and vision care solutions.",
    topic: "The Future Experience - From a product centric approach to a life enhancing Experience",
    day: 1
  },
  {
    id: 2,
    name: "Nome Cognome",
    title: "CEO of Innovation",
    company: "EssilorLuxottica",
    image: "/assets/placeholdr-speaker.png",
    bio: "Expert in myopia management and preventive eye care strategies.",
    topic: "The Myopia Ecosystem - From Awareness to Prevention & Care",
    day: 1
  },
  {
    id: 3,
    name: "Nome Cognome",
    title: "CEO of Innovation",
    company: "EssilorLuxottica",
    image: "/assets/placeholdr-speaker.png",
    bio: "Specialist in photochromic technology and light-responsive materials.",
    topic: "Beyond Style - Rethinking Light & Vision",
    day: 1
  },
  {
    id: 4,
    name: "Nome Cognome",
    title: "CEO of Innovation",
    company: "EssilorLuxottica",
    image: "/assets/placeholdr-speaker.png",
    bio: "Leading innovation in eyewear technology and vision care solutions.",
    topic: "The Future Experience - From a product centric approach to a life enhancing Experience",
    day: 1
  },
  {
    id: 5,
    name: "Nome Cognome",
    title: "CEO of Innovation",
    company: "EssilorLuxottica",
    image: "/assets/placeholdr-speaker.png",
    bio: "Expert in myopia management and preventive eye care strategies.",
    topic: "The Myopia Ecosystem - From Awareness to Prevention & Care",
    day: 1
  },
  {
    id: 6,
    name: "Nome Cognome",
    title: "CEO of Innovation",
    company: "EssilorLuxottica",
    image: "/assets/placeholdr-speaker.png",
    bio: "Specialist in photochromic technology and light-responsive materials.",
    topic: "Beyond Style - Rethinking Light & Vision",
    day: 1
  }
];

const Speakers: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const speakersRef = useRef<HTMLDivElement>(null);
  const speakerCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animazione staggered per gli speaker
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
              delay: index * 0.15
            }
          );
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });

    // Osserva tutti gli speaker cards
    speakerCardsRef.current.forEach((card, index) => {
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

  const handleSpeakerClick = (speaker: Speaker) => {
    setSelectedSpeaker(speaker);
  };

  const handleCloseModal = () => {
    setSelectedSpeaker(null);
  };

  return (
    <>
      <div 
        ref={speakersRef} 
        className="speakers-container"
        style={{
          width: '100%',
          position: 'relative'
        }}
      >
        {/* Pattern blu in alto */}
        <div style={{
          width: '100%',
          position: 'relative'
        }}>
          <Image 
            src="/assets/pixels-blue-bottom.svg" 
            alt="Pixel pattern top"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>

        {/* Contenuto principale */}
        <div style={{
          padding: '4rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Header della sezione */}
          <div style={{
            marginBottom: '4rem'
          }}>
            <h2 
              className="speakers-title-mobile"
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#4d68f1',
                textAlign: 'left'
              }}
            >
              OSPITI
            </h2>
          </div>

          {/* Grid dei speakers - 3x2 */}
          <div 
            className="speakers-grid-mobile"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              marginBottom: '3rem'
            }}
          >
            {speakersData.map((speaker, index) => (
              <div
                key={speaker.id}
                ref={(el) => {
                  speakerCardsRef.current[index] = el;
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: 0,
                  transform: 'translateY(50px) scale(0.9)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onClick={() => handleSpeakerClick(speaker)}
              >
                {/* Immagine con overlay */}
                <div style={{
                  width: '150px',
                  height: '150px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Image 
                    src={speaker.image}
                    alt={speaker.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <Image 
                    src="/assets/maschera-speaker.png"
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    priority
                  />
                </div>

                {/* Informazioni speaker */}
                <div style={{
                  flex: 1
                }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '0.3rem',
                    color: '#4d68f1'
                  }}>
                    {speaker.name}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    marginBottom: '0.3rem',
                    color: '#333'
                  }}>
                    {speaker.title}
                  </p>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#666'
                  }}>
                    Linkedin
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern blu in basso */}
        <div style={{
          width: '100%',
          position: 'relative'
        }}>
          <Image 
            src="/assets/pixels-blue-top.svg" 
            alt="Pixel pattern bottom"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      </div>

      {/* Modal per i dettagli del speaker */}
      {selectedSpeaker && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100svh',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
        onClick={handleCloseModal}
        >
          <div 
            className="speaker-modal-content-mobile"
            style={{
              backgroundColor: 'white',
              width: '100%',
              height: '100%',
              padding: '2rem',
              overflow: 'auto',
              color: '#333',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pulsante di chiusura */}
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                background: '#4d68f1',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: 'white',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {/* Immagine con maschera */}
            <div 
              className="speaker-modal-image-mobile"
              style={{
                width: '300px',
                height: '300px',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '2rem'
              }}
            >
              <Image 
                src={selectedSpeaker.image}
                alt={selectedSpeaker.name}
                layout="fill"
                objectFit="cover"
              />
              <Image 
                src="/assets/maschera-speaker.png"
                alt=""
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>

            {/* Contenuto del modal */}
            <div style={{
              textAlign: 'center',
              maxWidth: '600px'
            }}>
              <h2 
                className="speaker-modal-name-mobile"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  color: '#4d68f1'
                }}
              >
                {selectedSpeaker.name}
              </h2>
              <p 
                className="speaker-modal-title-mobile"
                style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#333'
                }}
              >
                {selectedSpeaker.title}
              </p>
              <p 
                className="speaker-modal-company-mobile"
                style={{
                  fontSize: '1.2rem',
                  marginBottom: '2rem',
                  color: '#666'
                }}
              >
                {selectedSpeaker.company}
              </p>

              <div style={{
                marginBottom: '2rem'
              }}>
                <h3 
                  className="speaker-modal-section-title-mobile"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: '#4d68f1'
                  }}
                >
                  Topic
                </h3>
                <p 
                  className="speaker-modal-topic-mobile"
                  style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.6',
                    marginBottom: '1rem',
                    color: '#333'
                  }}
                >
                  {selectedSpeaker.topic}
                </p>
              </div>

              <div>
                <h3 
                  className="speaker-modal-section-title-mobile"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: '#4d68f1'
                  }}
                >
                  Bio
                </h3>
                <p 
                  className="speaker-modal-bio-mobile"
                  style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    color: '#333'
                  }}
                >
                  {selectedSpeaker.bio}
                </p>
              </div>

              <div 
                className="speaker-modal-day-mobile"
                style={{
                  marginTop: '2rem',
                  padding: '1rem',
                  backgroundColor: '#4d68f1',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <span 
                  className="speaker-modal-day-text-mobile"
                  style={{
                    fontSize: '1.2rem',
                    color: 'white',
                    fontWeight: '600'
                  }}
                >
                  Speaking on Day {selectedSpeaker.day}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Speakers;