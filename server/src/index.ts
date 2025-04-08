import { createServer, IncomingMessage, ServerResponse } from "http";
import WebSocket, { Server as WebSocketServer } from "ws";

// Velg hvilken port du vil bruke
const PORT = 8001;

// Lag en enkel HTTP server med node sitt innebygde http-modul
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  // Sjekk om forespørselen er til "/webhook" og metoden er POST
  // Dette er der webhooken vil bli sendt til
  if (req.url === "/webhook" && req.method === "POST") {
    let body = "";

    // Lytt etter data som kommer inn i forespørselen
    req.on("data", chunk => {
      body += chunk;
    });

    // Når all data er mottatt, prøv å parse JSON og send den til WebSocket-klientene
    req.on("end", () => {
      try {
        const payload = JSON.parse(body);
        console.log("Webhook received:", payload);

        // Broadcast the payload to all connected WebSocket clients
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(payload));
          }
        });

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Webhook processed");
      } catch (err) {
        console.error("Error parsing JSON:", err);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid JSON");
      }
    });
  } else {
    // Hvis forespørselen ikke er til "/webhook", send en 404-feilmelding
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

// Lag en WebSocket-server som bruker den samme HTTP-serveren
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket, req) => {
  const urlParams = new URLSearchParams(req.url?.split('?')[1]);
  const password = urlParams.get('password');

  // Dette burde vi gjøre for kioskprosjektet: sjekk passordet i URL-en
  // Hvis passordet ikke er riktig, lukk tilkoblingen med en policy violation-kode
  if (password !== "your-secure-password") {
    console.log("Client connection rejected: Invalid password");
    ws.close(1008, "Invalid password"); // Close with policy violation code
    return;
  }

  console.log("Client connected");

  // Send en velkomstmelding til klienten ved tilkobling
  ws.send(JSON.stringify({ message: "Welcome!" }));

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start serveren og lytt på den angitte porten
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
