# Configurazione Google Maps API

Per utilizzare il componente Location con Google Maps, è necessario configurare l'API key.

## Passi per ottenere l'API key:

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona uno esistente
3. Abilita l'API "Maps JavaScript API"
4. Vai su "Credenziali" e crea una nuova API key
5. Copia l'API key

## Configurazione nel progetto:

1. Crea un file `.env.local` nella root del progetto
2. Aggiungi la seguente riga:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=la_tua_api_key_qui
   ```
3. Riavvia il server di sviluppo

## Note di sicurezza:

- L'API key è esposta nel frontend (NEXT_PUBLIC_)
- Configura le restrizioni appropriate nella Google Cloud Console:
  - Restrizioni HTTP referrer per limitare l'uso al tuo dominio
  - Restrizioni API per limitare solo a Maps JavaScript API

## Test:

Una volta configurata l'API key, il componente Location dovrebbe mostrare:
- Una mappa in scala di grigi centrata su Milano
- Un marker blu per il Museo della Scienza
- L'effetto pixelato blu che si estende dalla sezione superiore 