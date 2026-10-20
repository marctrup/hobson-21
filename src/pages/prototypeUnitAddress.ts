export type AddressRecord = { id: string; name: string; line: string; postcode: string; coordinates: [number, number]; building?: string; number: string; unit?: string };
export type AddressParts = { building?: string; number?: string; street?: string; city?: string; postcode?: string; unit?: string; unresolved?: boolean };
export type Discovery = { parts: AddressParts; records: AddressRecord[]; outcome: "multiple" | "single" | "missing-postcode" | "unmatched" };

// Deliberately illustrative records: no Royal Mail or geocoding request is made.
export const MOCK_ADDRESSES: AddressRecord[] = [
  { id: "stanley-finchley", name: "Stanley House", building: "Stanley House", number: "1115", line: "1115 Finchley Road, London, NW11 0QD", postcode: "NW11 0QD", coordinates: [51.5814, -0.2004] },
  ...[1, 2, 3].map(n => ({ id: `stanley-flat-${n}`, name: `Flat ${n}, Stanley House`, building: "Stanley House", number: "1115", unit: `Flat ${n}`, line: "1115 Finchley Road, London, NW11 0QD", postcode: "NW11 0QD", coordinates: [51.5814, -0.2004] as [number, number] })),
  { id: "finchley-1113", name: "1113 Finchley Road", number: "1113", line: "London, NW11 0QD", postcode: "NW11 0QD", coordinates: [51.5814, -0.2004] },
  { id: "finchley-1117", name: "1117 Finchley Road", number: "1117", line: "London, NW11 0QD", postcode: "NW11 0QD", coordinates: [51.5814, -0.2004] },
  { id: "stanley-bedford", name: "Stanley House", building: "Stanley House", number: "14", line: "14 Bedford Square, London, WC1B 3JA", postcode: "WC1B 3JA", coordinates: [51.51855, -0.13005] },
];

export function discoverAddress(text: string, previous: AddressParts = {}): Discovery {
  const postcodeMatch = text.toUpperCase().match(/\b([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})\b/);
  const postcode = postcodeMatch ? `${postcodeMatch[1]} ${postcodeMatch[2]}` : undefined;
  const remainder = postcodeMatch ? text.replace(new RegExp(postcodeMatch[0], "i"), "").replace(/[\s,.]/g, "") : text;
  const postcodeOnly = Boolean(postcode && !remainder);
  const parsed: AddressParts = {
    building: /stanley\s+house/i.test(text) ? "Stanley House" : undefined,
    number: text.match(/\b(\d+)\s+(?:Finchley\s+Road|Bedford\s+Square)/i)?.[1],
    street: /finchley\s+road/i.test(text) ? "Finchley Road" : /bedford\s+square/i.test(text) ? "Bedford Square" : undefined,
    city: /\blondon\b/i.test(text) ? "London" : undefined,
    postcode,
    unit: text.match(/\bflat\s+([123])\b/i)?.[0].replace(/flat/i, "Flat"),
  };
  const remainingDetails = (postcodeMatch ? text.replace(new RegExp(postcodeMatch[0], "i"), "") : text)
    .replace(/flat\s+[123]|stanley\s+house|finchley\s+road|bedford\s+square|\blondon\b|\b\d+\b/gi, "")
    .replace(/\b(?:at|it's|it is|the address is|please)\b/gi, "").replace(/[\s,.'-]/g, "");
  if (remainingDetails) parsed.unresolved = true;
  const parts = postcodeOnly ? { ...previous, postcode } : parsed;
  if (!parts.postcode && parts.building && parts.street === "Finchley Road") {
    return { parts, records: [], outcome: "missing-postcode" };
  }
  let records = MOCK_ADDRESSES.filter((record) => record.postcode === parts.postcode);
  // Unknown supplied details must not silently become the known example.
  const knownInput = postcodeOnly || Boolean(parts.street || parts.building);
  const streetFits = !parts.street || (parts.postcode === "NW11 0QD" ? parts.street === "Finchley Road" : parts.street === "Bedford Square");
  if (!knownInput || !streetFits || parts.unresolved) records = [];
  if (parts.building) records = records.filter(record => record.building === parts.building);
  if (parts.number) records = records.filter(record => record.number === parts.number);
  if (parts.unit) records = records.filter(record => record.unit === parts.unit);
  else if (parts.number && parts.street) records = records.filter(record => !record.unit);
  return { parts, records, outcome: records.length === 1 ? "single" : records.length > 1 ? "multiple" : "unmatched" };
}