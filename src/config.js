export const PROJECT_NAME = "hazard_mitigation";

let API_HOST = "https://graph.availabs.org";
let AUTH_HOST = "https://availauth.availabs.org";
let CLIENT_HOST = "transportny.org";
let DAMA_HOST = "https://graph.availabs.org";

if (process.env.NODE_ENV === "development") {
  // API_HOST = "http://localhost:4444";
  // AUTH_HOST = "http://localhost:4444/auth"
  // CLIENT_HOST = "localhost:3000";
  DAMA_HOST = "https://graph.availabs.org";
}

export { API_HOST, AUTH_HOST, CLIENT_HOST, DAMA_HOST };
