# 🚀 CreativeHub Hackathon 2025

Un sito web moderno e interattivo per l'hackathon organizzato da **EssilorLuxottica** e **CreativeHub**. Il progetto presenta un design pixel-art innovativo con animazioni fluide e un'interfaccia user-friendly.

## 📋 Descrizione

Questo progetto è un sito web per l'hackathon 2025 che combina:
- **Design pixel-art** con animazioni ondulatorie
- **Interfaccia moderna** con componenti React
- **Animazioni fluide** utilizzando GSAP
- **Responsive design** ottimizzato per tutti i dispositivi

## 🛠️ Tecnologie Utilizzate

- **Framework**: Next.js 15.3.5
- **Linguaggio**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animazioni**: GSAP 3.13.0
- **React**: v19.0.0
- **Build Tool**: Turbopack

## 🚀 Come Avviare il Progetto

### Prerequisiti
- Node.js (versione 18 o superiore)
- npm o yarn

### Installazione

1. **Clona il repository**
```bash
git clone [URL_DEL_REPOSITORIO]
cd hackathon
```

2. **Installa le dipendenze**
```bash
npm install
# oppure
yarn install
```

3. **Avvia il server di sviluppo**
```bash
npm run dev
# oppure
yarn dev
```

4. **Apri il browser**
Il sito sarà disponibile all'indirizzo: `http://localhost:3000`

## 📁 Struttura del Progetto

```
hackathon/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout principale
│   │   ├── page.tsx            # Pagina principale
│   │   └── globals.css         # Stili globali
│   └── components/
│       ├── Top.tsx             # Componente header
│       ├── Intro.tsx           # Sezione introduzione
│       ├── Location.tsx        # Sezione location
│       ├── Speakers.tsx        # Sezione speakers
│       ├── Brief.tsx           # Sezione brief
│       ├── Hero.tsx            # Componente hero con animazioni
│       ├── Wave.tsx            # Componente onde
│       └── AgendaOverlay.tsx   # Overlay agenda
├── public/
│   ├── assets/                 # Immagini e risorse
│   └── fonts/                  # Font personalizzati
├── res/                        # Risorse del progetto
└── package.json
```

## 🎨 Caratteristiche Principali

### Design Pixel-Art
- **Canvas animato** con pattern pixel personalizzati
- **Animazioni ondulatorie** per i blocchi blu
- **Responsive** che si adatta a tutti i dispositivi

### Componenti Interattivi
- **Hero Section** con animazioni fluide
- **Sezioni informative** per location, speakers e brief
- **Overlay agenda** per la gestione degli eventi

### Performance
- **Turbopack** per build veloci
- **Ottimizzazioni** per caricamento rapido
- **Lazy loading** per le immagini

## 🎯 Sezioni del Sito

1. **Top** - Header con logo e navigazione
2. **Intro** - Introduzione all'hackathon
3. **Location** - Informazioni sulla sede
4. **Speakers** - Presentazione degli speaker
5. **Brief** - Dettagli del brief di progetto

## 🚀 Script Disponibili

```bash
# Sviluppo
npm run dev          # Avvia server di sviluppo con Turbopack

# Build
npm run build        # Crea build di produzione
npm run start        # Avvia server di produzione

# Linting
npm run lint         # Esegue ESLint
```

## 📱 Responsive Design

Il sito è completamente responsive e ottimizzato per:
- **Desktop** (1920px+)
- **Tablet** (768px - 1024px)
- **Mobile** (320px - 767px)

## 🎨 Personalizzazione

### Font
- **Avenir Next Cyr** - Font principale
- **Dogica** - Font pixel per elementi speciali

### Colori
- **Blu principale**: `#3B82F6` (Tailwind blue-400)
- **Bianco**: `#FFFFFF`
- **Grigi**: Varianti di grigio per testo e sfondi

## 📄 Licenza

Questo progetto è sviluppato per l'hackathon **EssilorLuxottica x CreativeHub 2025**.

## 👥 Team

- **EssilorLuxottica** - Partner principale
- **CreativeHub** - Organizzatore dell'hackathon

## 📞 Contatti

Per maggiori informazioni sull'hackathon:
- **CreativeHub**: [Sito web]
- **EssilorLuxottica**: [Sito web]

---

*Sviluppato con ❤️ per l'innovazione e la creatività*
