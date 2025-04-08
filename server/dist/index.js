"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const ws_1 = __importStar(require("ws"));
// Velg hvilken port du vil bruke
const PORT = 8001;
// Lag en enkel HTTP server med node sitt innebygde http-modul
const server = (0, http_1.createServer)((req, res) => {
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
                    if (client.readyState === ws_1.default.OPEN) {
                        client.send(JSON.stringify(payload));
                    }
                });
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Webhook processed");
            }
            catch (err) {
                console.error("Error parsing JSON:", err);
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("Invalid JSON");
            }
        });
    }
    else {
        // Hvis forespørselen ikke er til "/webhook", send en 404-feilmelding
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});
// Lag en WebSocket-server som bruker den samme HTTP-serveren
const wss = new ws_1.Server({ server });
wss.on("connection", (ws, req) => {
    var _a;
    const urlParams = new URLSearchParams((_a = req.url) === null || _a === void 0 ? void 0 : _a.split('?')[1]);
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
