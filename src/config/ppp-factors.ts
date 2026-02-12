// PPP (Purchasing Power Parity) conversion factors by ISO 3166-1 alpha-2 country code.
// Reference country: US (factor = 1.0).
// Factor = 1 / price_level_index. Multiplying income by this factor yields
// US-equivalent purchasing-power income.
// Source: World Bank International Comparison Program (ICP), approximate 2023 values.

const pppFactors: Record<string, number> = {
  // North America
  US: 1.0,
  CA: 0.93,
  MX: 2.15,

  // Central America & Caribbean
  BZ: 1.55,
  CR: 1.65,
  CU: 2.8,
  DO: 2.1,
  GT: 2.45,
  HN: 2.65,
  HT: 3.2,
  JM: 1.85,
  NI: 2.9,
  PA: 1.55,
  SV: 2.35,
  TT: 1.45,

  // South America
  AR: 2.55,
  BO: 2.85,
  BR: 2.25,
  CL: 1.7,
  CO: 2.45,
  EC: 1.85,
  GY: 2.35,
  PE: 2.2,
  PY: 2.75,
  SR: 1.95,
  UY: 1.45,
  VE: 3.1,

  // Western Europe
  AT: 0.92,
  BE: 0.9,
  CH: 0.65,
  DE: 0.95,
  FR: 0.9,
  IE: 0.82,
  LI: 0.62,
  LU: 0.82,
  MC: 0.6,
  NL: 0.88,

  // Northern Europe
  DK: 0.78,
  FI: 0.88,
  GB: 0.85,
  IS: 0.72,
  NO: 0.72,
  SE: 0.84,

  // Southern Europe
  AD: 0.88,
  CY: 0.98,
  ES: 1.02,
  GR: 1.1,
  HR: 1.25,
  IT: 0.95,
  MT: 0.95,
  PT: 1.08,
  SI: 1.05,
  SM: 0.9,

  // Eastern Europe
  AL: 1.75,
  BA: 1.6,
  BG: 1.55,
  BY: 2.2,
  CZ: 1.15,
  EE: 1.05,
  GE: 2.05,
  HU: 1.35,
  LT: 1.15,
  LV: 1.12,
  MD: 2.65,
  ME: 1.4,
  MK: 1.7,
  PL: 1.3,
  RO: 1.45,
  RS: 1.55,
  RU: 2.45,
  SK: 1.12,
  UA: 3.15,
  XK: 1.65,

  // Middle East
  AE: 0.95,
  BH: 1.15,
  IL: 0.78,
  IQ: 2.45,
  IR: 3.5,
  JO: 1.55,
  KW: 0.95,
  LB: 1.85,
  OM: 1.1,
  PS: 1.65,
  QA: 0.88,
  SA: 1.15,
  SY: 3.8,
  TR: 2.35,
  YE: 3.5,

  // Central Asia
  AM: 2.1,
  AZ: 1.85,
  KG: 2.95,
  KZ: 1.95,
  TJ: 3.25,
  TM: 2.5,
  UZ: 2.85,

  // South Asia
  AF: 3.6,
  BD: 3.35,
  BT: 2.85,
  IN: 3.75,
  LK: 2.95,
  MV: 1.45,
  NP: 3.25,
  PK: 3.45,

  // East Asia
  CN: 2.35,
  HK: 0.72,
  JP: 1.08,
  KP: 3.5,
  KR: 1.02,
  MN: 2.55,
  MO: 0.75,
  TW: 1.25,

  // Southeast Asia
  BN: 1.15,
  ID: 2.75,
  KH: 2.85,
  LA: 2.95,
  MM: 3.15,
  MY: 1.85,
  PH: 2.55,
  SG: 0.72,
  TH: 2.35,
  TL: 2.45,
  VN: 2.95,

  // Oceania
  AU: 0.82,
  FJ: 1.85,
  NZ: 0.85,
  PG: 2.55,
  WS: 1.95,

  // North Africa
  DZ: 2.65,
  EG: 3.15,
  LY: 2.45,
  MA: 2.25,
  TN: 2.35,

  // West Africa
  BF: 2.75,
  BJ: 2.65,
  CI: 2.55,
  CM: 2.65,
  CV: 1.85,
  GH: 2.85,
  GM: 3.05,
  GN: 3.25,
  GW: 3.15,
  LR: 3.05,
  ML: 2.75,
  MR: 2.85,
  NE: 2.95,
  NG: 2.95,
  SL: 3.15,
  SN: 2.55,
  TG: 2.75,

  // East Africa
  BI: 3.45,
  DJ: 2.35,
  ER: 3.25,
  ET: 3.35,
  KE: 2.65,
  MG: 3.15,
  MU: 1.65,
  MW: 3.35,
  MZ: 3.05,
  RW: 2.95,
  SC: 1.35,
  SO: 3.45,
  SS: 3.55,
  SD: 3.45,
  TZ: 2.85,
  UG: 2.95,
  ZM: 2.75,
  ZW: 3.15,

  // Southern Africa
  AO: 2.35,
  BW: 1.85,
  LS: 2.55,
  NA: 1.95,
  SZ: 2.15,
  ZA: 2.05,

  // Central Africa
  CD: 3.35,
  CF: 3.25,
  CG: 2.45,
  GA: 1.75,
  GQ: 1.65,
  TD: 2.95,
};

export function getPppFactor(countryCode: string): number | undefined {
  return pppFactors[countryCode.toUpperCase()];
}
