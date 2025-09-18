'use client';

import React from 'react';
import Image from 'next/image';
import Wave from './Wave';
import { assetPrefix } from '../../next.config';

const Top: React.FC = () => {
  return (
    <div style={{ 
      backgroundColor: 'transparent',
      width: '100%',
      height: '100svh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1
    }}>
      <Wave />
      
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        width: '100%',
        zIndex: 2
      }} className="header-mobile">
        <div>
          <Image
            src={`${assetPrefix}/assets/logo-essilorluxottica.svg`}
            alt="EssilorLuxottica Logo"
            width={200}
            height={60}
            priority
            className="logo-mobile"
          />
        </div>
        <div>
          <Image
            src={`${assetPrefix}/assets/logo-creativehub.svg`}
            alt="CreativeHub Logo"
            width={200}
            height={60}
            priority
            className="logo-mobile"
          />
        </div>
      </header>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row', // Default: layout a due colonne per desktop
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '2rem',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          zIndex: 2
        }}
        className="content-mobile"
      >
        {/* Colonna sinistra: logo e titolo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            width: '70%',
            minWidth: '40vw'
          }}
          className="logo-container-mobile"
        >
          <Image
            src={`${assetPrefix}/assets/logo-hackathon.svg`}
            alt="Hackathon Logo"
            width={0}
            height={0}
            style={{
              width: '60%',
              height: 'auto'
            }}
            className="hackathon-logo-mobile"
            priority
          />
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 500,
              lineHeight: 1.2,
              textAlign: 'left', // Mantieni l'allineamento a sinistra
              margin: 0,
              color: '#231f20'
            }}
            className="title-mobile"
          >
            The CreativeHub{' '}
            <span style={{ color: '#4d68f1' }}>Hackathon</span>
          </h1>
        </div>
        {/* Colonna destra: data e città */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end', // Mantieni l'allineamento a destra
            justifyContent: 'center',
            width: '30%',
            gap: '0.5rem'
          }}
          className="date-location-mobile"
        >
          <span
            style={{
              fontSize: '3rem',
              fontWeight: 500,
              color: '#4d68f1',
              textAlign: 'right', // Mantieni l'allineamento a destra
              margin: 0
            }}
            className="subtitle-mobile"
          >
            30.09 – 03.10
          </span>
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: '#231f20',
              textAlign: 'right', // Mantieni l'allineamento a destra
              marginTop: '0.5rem'
            }}
          >
            Milano
          </span>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .content-mobile {
            flex-direction: column !important; /* Cambia layout in colonna per mobile */
            align-items: flex-start !important; /* Allinea a sinistra su mobile */
            justify-content: flex-start !important;
          }
          .logo-container-mobile {
            width: 100% !important; /* Adatta la larghezza per mobile */
          }
          .hackathon-logo-mobile {
            width: 80% !important; /* Rende il logo più grande su mobile */
          }
          .date-location-mobile {
            width: 100% !important; /* Adatta la larghezza per mobile */
            align-items: flex-start !important; /* Allinea a sinistra su mobile */
          }
          .subtitle-mobile {
            text-align: left !important; /* Allinea il testo a sinistra su mobile */
          }
        }
      `}</style>
    </div>
  );
};

export default Top;
