# WebSocket Demo Project

Dette prosjektet er et enkelt eksempel som demonstrerer hvordan man kan bruke WebSockets med `ws`-modulen. Prosjektet består av en Node.js HTTP-server og en React-klient. Serveren sender data til klienten når det sendes data til `/websocket?password=your-secure-password`.

## Hvordan kjøre prosjektet

### Server
1. Naviger til `server`-mappen.
2. Kjør følgende kommandoer for å starte serveren:
    - For å kompilere TypeScript: `tsx` eller `tsc`.
    - For å starte serveren: `node dist/index.js`.

### Klient
1. Naviger til `client`-mappen.
2. Kjør følgende kommando for å starte klienten:
    ```bash
    npm run dev
    ```

### Nextjs
Hvis du ønsker å bruke Next.js i stedet for React, kan du navigere til `nextjs`-mappen og kjøre følgende kommandoer:
1. Kjør `npm install` for å installere avhengigheter.
2. Kjør `npm run dev` for å starte Next.js-applikasjonen.

Dette vil starte React-klienten i utviklingsmodus.
