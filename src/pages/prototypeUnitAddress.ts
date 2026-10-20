export type AddressRecord = { id: string; name: string; line: string; postcode: string; coordinates: [number, number] };
export type AddressParts = { building?: string; number?: string; street?: string; city?: string; postcode?: string; unresolved?: boolean };
export type Discovery = { parts: AddressParts; records: AddressRecord[]; outcome: "multiple" | "single" | "missing-postcode" | "unmatched" };

// Deliberately illustrative records: no Royal Mail or geocoding request is made.
export const MOCK_ADDRESSES: AddressRecord[] = [
  { id: "stanley-finchley", name: "Stanley House", line: "1115 Finchley Road, London, NW11 0QD", postcode: "NW11 0QD", coordinates: [51.5814, -0.2004] },
  { id: "finchley-number", name: "1115 Finchley Road", line: "London, NW11 0QD", postcode: "NW11 0QD", coordinates: [51.5814, -0.2004] },
  { id: "stanley-bedford", name: "Stanley House", line: "14 Bedford Square, London, WC1B 3JA", postcode: "WC1B 3JA", coordinates: [51.51855, -0.13005] },
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
  };
  const remainingDetails = (postcodeMatch ? text.replace(new RegExp(postcodeMatch[0], "i"), "") : text)
    .replace(/stanley\s+house|finchley\s+road|bedford\s+square|\blondon\b|\b\d+\b/gi, "")
    .replace(/\b(?:at|it's|it is|the address is|please)\b/gi, "").replace(/[\s,.'-]/g, "");
  if (remainingDetails) parsed.unresolved = true;
  const parts = postcodeOnly ? { ...previous, postcode } : parsed;
  if (!parts.postcode && parts.building && parts.street === "Finchley Road") {
    return { parts, records: [], outcome: "missing-postcode" };
  }
  let records = MOCK_ADDRESSES.filter((record) => record.postcode === parts.postcode);
  // Unknown supplied details must not silently become the known example.
  const knownInput = postcodeOnly || Boolean(parts.street || parts.building);
  const numberFits = !parts.number || (parts.postcode === "NW11 0QD" ? parts.number === "1115" : parts.number === "14");
  const streetFits = !parts.street || (parts.postcode === "NW11 0QD" ? parts.street === "Finchley Road" : parts.street === "Bedford Square");
  if (!knownInput || !numberFits || !streetFits || parts.unresolved) records = [];
  if (parts.building && parts.street && parts.number && parts.city && records.length) records = records.filter((record) => record.name === parts.building);
  return { parts, records, outcome: records.length === 1 ? "single" : records.length > 1 ? "multiple" : "unmatched" };
}