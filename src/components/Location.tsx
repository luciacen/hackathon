'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { assetPrefix } from '../../next.config';


// Dichiarazioni TypeScript per Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: google.maps.Map;
        Marker: google.maps.Marker;
        // Aggiungi altri tipi se necessario
      };
    };
  }
}

export default function Location() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLocationInView, setIsLocationInView] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carica Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Scroll detection
    const handleScroll = () => {
      if (locationRef.current) {
        const rect = locationRef.current.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.5;
        setIsLocationInView(isInView);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mapLoaded && window.google) {
      const mapElement = document.getElementById('map');
      if (mapElement) {
        // Inizializza la mappa
        const map = new window.google.maps.Map(mapElement, {
          center: { lat: 45.4628869, lng: 9.1680774 },
          zoom: 16,
          styles: [
            {
              "featureType": "all",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "gamma": 0.01
                },
                {
                  "lightness": 20
                }
              ]
            },
            {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "saturation": -31
                },
                {
                  "lightness": -33
                },
                {
                  "weight": 2
                },
                {
                  "gamma": 0.8
                }
              ]
            },
            {
              "featureType": "all",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#4D68F1"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#fef3f3"
                },
                {
                  "weight": "3.01"
                }
              ]
            },
            {
              "featureType": "administrative.neighborhood",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#3A5CD9"
                },
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.neighborhood",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#fffbfb"
                },
                {
                  "weight": "3.01"
                },
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "landscape",
              "elementType": "geometry",
              "stylers": [
                {
                  "lightness": 30
                },
                {
                  "saturation": 30
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                {
                  "saturation": 20
                }
              ]
            },
            {
              "featureType": "poi.attraction",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                {
                  "lightness": 20
                },
                {
                  "saturation": 20
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#4D68F1"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#3A5CD9"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "visibility": "on"
                },
                {
                  "color": "#4D68F1"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#4D68F1"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "visibility": "on"
                },
                {
                  "color": "#4D68F1"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "visibility": "on"
                },
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "simplified"
                },
                {
                  "hue": "#0006ff"
                },
                {
                  "saturation": "100"
                },
                {
                  "lightness": "13"
                },
                {
                  "gamma": "0.00"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "visibility": "on"
                },
                {
                  "color": "#4D68F1"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "visibility": "off"
                },
                {
                  "color": "#8d8d8d"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "visibility": "on"
                },
                {
                  "color": "#4D68F1"
                },
                {
                  "lightness": "6"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "visibility": "on"
                },
                {
                  "color": "#ffffff"
                },
                {
                  "weight": "3.45"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#4D68F1"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "lightness": "2"
                },
                {
                  "visibility": "on"
                },
                {
                  "color": "#999898"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#4D68F1"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#faf8f8"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "all",
              "stylers": [
                {
                  "lightness": -20
                }
              ]
            }
          ],
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        });

        // Aggiungi marker per il museo
        new window.google.maps.Marker({
          position: { lat: 45.4628869, lng: 9.1680774 },
          map: map,
          title: 'Museo della Scienza e della Tecnologia Leonardo da Vinci'
        });
      } else {
        console.error("Elemento con id 'map' non trovato.");
      }
    }
  }, [mapLoaded]);

  return (
    <div ref={locationRef} style={{
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
          src={`${assetPrefix}/assets/hero-pixel-1.svg`}
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
        ...(isLocationInView && {
          position: 'absolute',
          top: '100svh',
          right: '0px',
          display: 'flex',
          width: 'auto',
          zIndex: 1000,
          padding: '2rem',
          borderRadius: '0 0 0 12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        })
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          ...(isLocationInView && {
            maxWidth: 'none',
            margin: '0'
          })
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            color: 'white',
            ...(isLocationInView && {
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            })
          }}>
            {/* LOCATION */}
            <div>
              <h3 style={{
                fontSize: isLocationInView ? '1rem' : '1.2rem',
                fontWeight: '600',
                marginBottom: isLocationInView ? '0.5rem' : '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                LOCATION
              </h3>
              <p 
                className="location-text-mobile"
                style={{
                  fontSize: isLocationInView ? '0.9rem' : '1.1rem',
                  lineHeight: isLocationInView ? '1.4' : '1.6',
                  opacity: 0.9
                }}
              >
                Via San Vittore, 21<br />
                20123 Milano, Italia
              </p>
            </div>

            {/* COME ARRIVARE */}
            <div>
              <h3 style={{
                fontSize: isLocationInView ? '1rem' : '1.2rem',
                fontWeight: '600',
                marginBottom: isLocationInView ? '0.5rem' : '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                COME ARRIVARE
              </h3>
              <p 
                className="location-text-mobile"
                style={{
                  fontSize: isLocationInView ? '0.9rem' : '1.1rem',
                  lineHeight: isLocationInView ? '1.4' : '1.6',
                  opacity: 0.9
                }}
              >
                Metro: M2<br />
                Bus: 50, 58, 94<br />
                Tram: 16, 19
              </p>
            </div>

            {/* ORARI */}
            <div>
              <h3 style={{
                fontSize: isLocationInView ? '1rem' : '1.2rem',
                fontWeight: '600',
                marginBottom: isLocationInView ? '0.5rem' : '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                ORARI
              </h3>
              <p 
                className="location-text-mobile"
                style={{
                  fontSize: isLocationInView ? '0.9rem' : '1.1rem',
                  lineHeight: isLocationInView ? '1.4' : '1.6',
                  opacity: 0.9
                }}
              >
                Giorni 1-4: 9:00 - 18:00<br />
                Networking: 18:00 - 20:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spazio placeholder quando la sezione è in position absolute */}
      {isLocationInView && (
        <div style={{
          height: '200px', // Altezza approssimativa della sezione originale
          backgroundColor: 'transparent'
        }} />
      )}

      {/* Sezione mappa */}
      <div style={{
        flex: 1,
        position: 'relative',
        width: '100%',
        minHeight: '500px'
      }}>
        {/* Container mappa */}
        <div style={{
          position: 'relative',
          height: '100%',
          minHeight: '500px',
          width: '100%'
        }}>
          {mapLoaded ? (
            <div 
              id="map" 
              style={{
                width: '100%',
                height: '100%',
                minHeight: '500px',
                filter: 'grayscale(0.8) brightness(1.1)'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              minHeight: '500px',
              backgroundColor: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: '1.2rem'
            }}>
              Caricamento mappa...
            </div>
          )}
        </div>

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