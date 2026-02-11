import { db } from "./index.js";
import { locations, realms } from "./schema.js";

const locationData = [
  { id: "zurich-ch", name: "Zurich", country: "CH", costOfLivingIndex: 1.35 },
  { id: "new-york-us", name: "New York", country: "US", costOfLivingIndex: 1.25 },
  { id: "london-gb", name: "London", country: "GB", costOfLivingIndex: 1.20 },
  { id: "sydney-au", name: "Sydney", country: "AU", costOfLivingIndex: 1.15 },
  { id: "tokyo-jp", name: "Tokyo", country: "JP", costOfLivingIndex: 1.10 },
  { id: "munich-de", name: "Munich", country: "DE", costOfLivingIndex: 1.08 },
  { id: "berlin-de", name: "Berlin", country: "DE", costOfLivingIndex: 1.05 },
  { id: "sao-paulo-br", name: "São Paulo", country: "BR", costOfLivingIndex: 0.75 },
  { id: "bangkok-th", name: "Bangkok", country: "TH", costOfLivingIndex: 0.60 },
  { id: "lagos-ng", name: "Lagos", country: "NG", costOfLivingIndex: 0.45 },
  { id: "vienna-at", name: "Vienna", country: "AT", costOfLivingIndex: 1.10 },
  { id: "lisbon-pt", name: "Lisbon", country: "PT", costOfLivingIndex: 0.85 },
];

db.insert(locations).values(locationData).onConflictDoNothing().run();
console.log(`Seeded ${locationData.length} locations.`);

const demoRealm = {
  id: "demo-cafe",
  name: "Demo Cafe",
  apiKey: "demo-api-key-for-testing-only-do-not-use-in-production",
};

db.insert(realms).values(demoRealm).onConflictDoNothing().run();
console.log("Seeded demo realm (API key: demo-api-key-for-testing-only-do-not-use-in-production).");
