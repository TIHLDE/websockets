import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Velg riktig WebSocket-protokoll basert på om siden er lastet inn over HTTPS eller HTTP
    // Hvis siden er lastet inn over HTTPS, bruk WSS (WebSocket Secure)
    // Ellers bruk WS (WebSocket)
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    // Her må du bruke riktig port og passord for WebSocket-serveren
    // Pass på at porten er den samme som serveren din kjører på
    // og at passordet er det samme som du bruker i serverkoden
    const socketUrl = `${protocol}://${window.location.hostname}:8001?password=your-secure-password`;
    const ws = new WebSocket(socketUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event: MessageEvent) => {
      console.log('Message received:', event.data);
      setMessages(prevMessages => [...prevMessages, event.data]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Lukk WebSocket-tilkoblingen når komponenten avmonteres
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Messages</h1>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;

