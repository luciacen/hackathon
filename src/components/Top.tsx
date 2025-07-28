import React from 'react';
import Image from 'next/image';
import Wave from './Wave';

const Top: React.FC = () => {
  return (
    <div style={{ 
      backgroundColor: 'transparent',
      width: '100%',
      height: '100vh',
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
            src="/assets/logo-essilorluxottica.svg"
            alt="EssilorLuxottica Logo"
            width={200}
            height={60}
            priority
            className="logo-mobile"
          />
        </div>
        
        <div>
          <Image
            src="/assets/logo-creativehub.svg"
            alt="CreativeHub Logo"
            width={200}
            height={60}
            priority
            className="logo-mobile"
          />
        </div>
      </header>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '2rem',
        paddingLeft: '2rem',
        zIndex: 2
      }} className="content-mobile">
        <div style={{
          width: '45vw',
          minWidth: '45vw'
        }} className="logo-container-mobile">
          <Image
            src="/assets/logo-hackathon.svg"
            alt="Hackathon Logo"
            width={0}
            height={0}
            sizes="45vw"
            style={{
              width: '100%',
              height: 'auto'
            }}
            className="hackathon-logo-mobile"
            priority
          />
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: 'left',
            margin: 0
          }} className="title-mobile">
            The CreativeHub{' '}
            <span style={{ color: '#4d68f1' }}>Hackathon</span>
          </h1>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: '500',
            color: '#4d68f1',
            margin: 0
          }} className="subtitle-mobile">
            September 30th – October 3rd
          </p>
        </div>
      </div>
    </div>
  );
};

export default Top; 