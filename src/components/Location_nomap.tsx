'use client';

import Image from 'next/image';
import { assetPrefix } from '../../next.config';

export default function LocationNoMap() {
  return (
    <div style={{
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Sezione bianca con SVG pixels-blue-top */}
      <div style={{
        backgroundColor: 'white',
        width: '100%',
        position: 'relative'
      }}>
        <Image 
          src={`${assetPrefix}/assets/location-pixel.svg`}
          alt="Pixel pattern top"
          layout="responsive"
          width={1920}
          height={1080}
          objectFit="cover"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
      </div>

      {/* Sezione blu con informazioni */}
      <div style={{
        backgroundColor: '#4D68F1',
        padding: '4rem 2rem',
        width: '100%',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            color: 'white',
          }}>
            {/* LOCATION */}
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                LOCATION
              </h3>
              <p 
                className="location-text-mobile"
                style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  opacity: 0.9
                }}
              >
                Museo della Scienza e della Tecnologia<br />
                Via San Vittore, 21<br />
                20123 Milano, Italia
              </p>
            </div>

            {/* COME ARRIVARE */}
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                HOW TO GET THERE
              </h3>
              <p 
                className="location-text-mobile"
                style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  opacity: 0.9
                }}
              >
                Metro: M2 - M4 Sant&apos;Ambrogio<br />
                Bus: 50, 58, 94<br />
                Tram: 16, 19
              </p>
            </div>

            {/* ORARI */}
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                HOURS
              </h3>
              <p 
                className="location-text-mobile"
                style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  opacity: 0.9
                }}
              >
                Check Agenda
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sezione immagine full width */}
      <div style={{
        flex: 1,
        position: 'relative',
        width: '100%',
        minHeight: '500px'
      }}>
        {/* Overlay SVG pixels-blue-bottom in posizione absolute */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          pointerEvents: 'none',
          height: 'auto',
          overflow: 'hidden'
        }}>
          <Image 
            src={`${assetPrefix}/assets/map-pixel.svg`} 
            alt="Pixel pattern bottom"
            layout="responsive"
            width={1920}
            height={1080}
            objectFit="cover"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              transform: 'scaleY(-1)' // Capovolgi verticalmente
            }}
          />
        </div>
        <img 
          src={`${assetPrefix}/assets/sala-colonne.jpg`} 
          alt="Sala Colonne"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            minHeight: '500px',
            maxHeight: '80vh', // Aggiunta altezza massima
            objectFit: 'cover'
          }}
        />

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          pointerEvents: 'none',
          height: 'auto',
          overflow: 'hidden'
        }}>
          <Image 
            src={`${assetPrefix}/assets/map-pixel.svg`} 
            alt="Pixel pattern bottom"
            layout="responsive"
            width={1920}
            height={1080}
            objectFit="cover"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
      </div>
    </div>
  );
}
