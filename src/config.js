export const PROJECT_NAME = "hazard_mitigation";

let API_HOST = "https://graph.availabs.org";
let AUTH_HOST = "https://graph.availabs.org";
let CLIENT_HOST = "mitigateny.org";
let DAMA_HOST = "https://graph.availabs.org";

if (process.env.NODE_ENV === "development") {
  API_HOST = "http://localhost:4444";
  DAMA_HOST = "http://localhost:4444";
  // AUTH_HOST = "http://localhost:4444"
  CLIENT_HOST = "localhost:5173";
  // DAMA_HOST = "https://graph.availabs.org";
}

export { API_HOST, AUTH_HOST, CLIENT_HOST, DAMA_HOST };
