export interface Field {
  name: string;
  isPK?: boolean;
  isFK?: boolean;
}

export interface Table {
  id: string;
  name: string;
  fields: Field[];
}

export interface Relationship {
  id: string;
  from: string;
  to: string;
  cardinality?: string;
}

// Generic Webshop example — easy to understand, great starting point
export const shopSchema: { tables: Table[]; relationships: Relationship[] } = {
  tables: [
    {
      id: 'kategorie',
      name: 'Kategorie',
      fields: [
        { name: 'KategorieID', isPK: true },
        { name: 'Bezeichnung' },
      ],
    },
    {
      id: 'produkt',
      name: 'Produkt',
      fields: [
        { name: 'ProduktID', isPK: true },
        { name: 'Name' },
        { name: 'Preis' },
        { name: 'KategorieID', isFK: true },
      ],
    },
    {
      id: 'kunde',
      name: 'Kunde',
      fields: [
        { name: 'KundenID', isPK: true },
        { name: 'Name' },
        { name: 'Email' },
      ],
    },
    {
      id: 'bestellung',
      name: 'Bestellung',
      fields: [
        { name: 'BestellungID', isPK: true },
        { name: 'KundenID', isFK: true },
        { name: 'Datum' },
      ],
    },
    {
      id: 'bestellposition',
      name: 'Bestellposition',
      fields: [
        { name: 'BestellungID', isPK: true, isFK: true },
        { name: 'ProduktID', isPK: true, isFK: true },
        { name: 'Anzahl' },
      ],
    },
  ],
  relationships: [
    { id: 'p-kat',  from: 'produkt',         to: 'kategorie',  cardinality: 'N:1' },
    { id: 'b-k',   from: 'bestellung',       to: 'kunde',      cardinality: 'N:1' },
    { id: 'bp-b',  from: 'bestellposition',  to: 'bestellung', cardinality: 'N:1' },
    { id: 'bp-p',  from: 'bestellposition',  to: 'produkt',    cardinality: 'N:1' },
  ],
};
