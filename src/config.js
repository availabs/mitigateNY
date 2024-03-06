export const PROJECT_NAME = "hazard_mitigation";

let API_HOST = "https://graph2.availabs.org";
let AUTH_HOST = "https://graph2.availabs.org/auth";
let CLIENT_HOST = "mitigateny.org";
let DAMA_HOST = "https://graph2.availabs.org";

if (process.env.NODE_ENV === "development") {
  API_HOST = "https://graph2.availabs.org";
  DAMA_HOST = "https://graph2.availabs.org";
  AUTH_HOST = "https://graph2.availabs.org/auth"
  // CLIENT_HOST = "localhost:3000";
  // DAMA_HOST = "https://graph.availabs.org";
}

export { API_HOST, AUTH_HOST, CLIENT_HOST, DAMA_HOST };
