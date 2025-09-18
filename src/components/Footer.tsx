'use client';

import React from 'react';
import Image from 'next/image';

const assetPrefix = '/hackathon'; // Sostituisco l'importazione con una stringa statica

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#4d68f1', // Sfondo blu
        padding: '2rem 2rem 4rem', // Aggiungi spazio per i pixel
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative', // Per posizionare i pixel sopra
        overflow: 'hidden',
      }}
      className="footer-mobile"
    >


      {/* Logo Luxottica */}
      <div>
        <Image
          src={`${assetPrefix}/assets/logo-essilorluxottica.svg`}
          alt="EssilorLuxottica Logo"
          width={200}
          height={60}
          priority
          style={{
            filter: 'invert(1)', // Inverti i colori del logo per il tema scuro
          }}
          className="logo-mobile"
        />
      </div>

      {/* Logo CreativeHub */}
      <div>
        <Image
          src={`${assetPrefix}/assets/logo-creativehub.svg`}
          alt="CreativeHub Logo"
          width={200}
          height={60}
          priority
          style={{
            filter: 'invert(1)', // Inverti i colori del logo per il tema scuro
          }}
          className="logo-mobile"
        />
      </div>
    </footer>
  );
};

export default Footer;