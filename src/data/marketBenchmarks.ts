import { Property, LocalMarketBenchmark, LeaseHistoryEntry } from '../types';

export const LOCAL_BENCHMARKS: Record<string, LocalMarketBenchmark> = {
  // Cotonou - Haie Vive (Quartier résidentiel diplomatique haut de gamme)
  'prop-bj-1': {
    city: 'Cotonou',
    district: 'Haie Vive / Les Cocotiers',
    propertyType: 'Villa',
    avgRentPerSqm: 2850, // FCFA / m²
    minRentPerSqm: 2500,
    maxRentPerSqm: 3300,
    annualTrendPct: 6.5,
    demandLevel: 'Très forte',
    legalCeilingPerSqm: 3500,
    insights: 'Quartier très prisé par les expatriés et cadres dirigeants. Pénurie de villas sécurisées avec jardin dans cette zone.',
  },

  // Cotonou - Akpakpa Dodomè (Proximité centre-ville et vue lagune)
  'prop-bj-2': {
    city: 'Cotonou',
    district: 'Akpakpa Dodomè',
    propertyType: 'Appartement',
    avgRentPerSqm: 2350,
    minRentPerSqm: 2000,
    maxRentPerSqm: 2600,
    annualTrendPct: 4.8,
    demandLevel: 'Forte',
    legalCeilingPerSqm: 2800,
    insights: 'Rénovations récentes de la voie pavée et attractivité commerciale en hausse constante.',
  },

  // Abomey-Calavi - Arconville (Zone IITA / Cité universitaire en expansion)
  'prop-bj-3': {
    city: 'Abomey-Calavi',
    district: 'Arconville / Carrefour IITA',
    propertyType: 'Maison',
    avgRentPerSqm: 2200,
    minRentPerSqm: 1850,
    maxRentPerSqm: 2450,
    annualTrendPct: 5.4,
    demandLevel: 'Forte',
    legalCeilingPerSqm: 2600,
    insights: 'Forte pression locative des familles et professionnels travaillant entre Cotonou et Calavi.',
  },

  // Paris 8e - Saint-Honoré (Prestige haussmannien)
  'prop-1': {
    city: 'Paris',
    district: '8ème - Faubourg Saint-Honoré',
    propertyType: 'Appartement',
    avgRentPerSqm: 31.8, // € / m²
    minRentPerSqm: 28.5,
    maxRentPerSqm: 34.5,
    annualTrendPct: 3.2,
    demandLevel: 'Très forte',
    legalCeilingPerSqm: 33.5, // Encadrement des loyers
    insights: 'Secteur sous encadrement des loyers de la Ville de Paris. Loyer médian de référence : 28.2 €/m², plafond majoré : 33.8 €/m².',
  },

  // Lyon 6e - Roosevelt (Parc de la Tête d\'Or)
  'prop-2': {
    city: 'Lyon',
    district: '6ème arrondissement - Roosevelt',
    propertyType: 'Loft',
    avgRentPerSqm: 16.8,
    minRentPerSqm: 14.5,
    maxRentPerSqm: 18.2,
    annualTrendPct: 2.9,
    demandLevel: 'Forte',
    legalCeilingPerSqm: 17.6,
    insights: 'Quartier bourgeois très recherché. L\'encadrement préfectoral lyonnais autorise une réévaluation modérée indexée sur l\'IRL.',
  },
};

export const LEASE_HISTORY_DATA: Record<string, LeaseHistoryEntry[]> = {
  'prop-bj-1': [
    {
      year: 2021,
      date: '01/01/2021',
      rentAmount: 290000,
      chargesAmount: 25000,
      tenantName: 'M. Jean-Paul Dossou',
      adjustmentType: 'Bail initial',
    },
    {
      year: 2023,
      date: '01/01/2023',
      rentAmount: 320000,
      chargesAmount: 25000,
      tenantName: 'M. Jean-Paul Dossou',
      adjustmentType: 'Révision triennale',
      increasePct: 10.3,
    },
    {
      year: 2024,
      date: '01/01/2024',
      rentAmount: 350000,
      chargesAmount: 30000,
      tenantName: 'M. Sylvestre Bocco',
      adjustmentType: 'Réévaluation marché',
      increasePct: 9.3,
    },
  ],

  'prop-bj-2': [
    {
      year: 2022,
      date: '01/06/2022',
      rentAmount: 160000,
      chargesAmount: 15000,
      tenantName: 'Mme Awa Sanogo',
      adjustmentType: 'Bail initial',
    },
    {
      year: 2023,
      date: '01/06/2023',
      rentAmount: 180000,
      chargesAmount: 20000,
      tenantName: 'M. Koffi Mensah',
      adjustmentType: 'Réévaluation marché',
      increasePct: 12.5,
    },
  ],

  'prop-bj-3': [
    {
      year: 2023,
      date: '15/03/2023',
      rentAmount: 200000,
      chargesAmount: 20000,
      tenantName: 'Famille Hounnou',
      adjustmentType: 'Bail initial',
    },
    {
      year: 2025,
      date: '15/03/2025',
      rentAmount: 220000,
      chargesAmount: 25000,
      tenantName: 'Famille Hounnou',
      adjustmentType: 'Révision triennale',
      increasePct: 10.0,
    },
  ],

  'prop-1': [
    {
      year: 2021,
      date: '01/09/2021',
      rentAmount: 2250,
      chargesAmount: 220,
      tenantName: 'Cabinet Avocats Valmy',
      adjustmentType: 'Bail initial',
    },
    {
      year: 2023,
      date: '01/09/2023',
      rentAmount: 2360,
      chargesAmount: 235,
      tenantName: 'Camille de Saint-Sauveur',
      adjustmentType: 'Indexation IRL',
      increasePct: 4.8,
    },
    {
      year: 2024,
      date: '01/03/2024',
      rentAmount: 2450,
      chargesAmount: 250,
      tenantName: 'Camille de Saint-Sauveur',
      adjustmentType: 'Indexation IRL',
      increasePct: 3.8,
    },
  ],

  'prop-2': [
    {
      year: 2022,
      date: '15/09/2022',
      rentAmount: 1550,
      chargesAmount: 150,
      tenantName: 'M. Marc Lefebvre',
      adjustmentType: 'Bail initial',
    },
    {
      year: 2023,
      date: '15/09/2023',
      rentAmount: 1680,
      chargesAmount: 170,
      tenantName: 'Thomas Durand',
      adjustmentType: 'Réévaluation marché',
      increasePct: 8.3,
    },
  ],
};

export function getLocalMarketBenchmark(property: Property): LocalMarketBenchmark {
  if (LOCAL_BENCHMARKS[property.id]) {
    return LOCAL_BENCHMARKS[property.id];
  }

  // Default fallback calculation based on country
  const isBenin = property.country === 'BJ';
  const defaultSqmRate = isBenin ? 2400 : 25;

  return {
    city: property.city,
    district: property.address,
    propertyType: property.type,
    avgRentPerSqm: defaultSqmRate,
    minRentPerSqm: Math.round(defaultSqmRate * 0.85),
    maxRentPerSqm: Math.round(defaultSqmRate * 1.15),
    annualTrendPct: isBenin ? 5.0 : 3.0,
    demandLevel: 'Forte',
    legalCeilingPerSqm: isBenin ? defaultSqmRate * 1.25 : defaultSqmRate * 1.12,
    insights: `Données de marché calculées à partir de biens similaires de type ${property.type} à ${property.city}.`,
  };
}

export function getLeaseHistory(propertyId: string): LeaseHistoryEntry[] {
  return LEASE_HISTORY_DATA[propertyId] || [
    {
      year: 2024,
      date: '01/01/2024',
      rentAmount: 300000,
      chargesAmount: 25000,
      tenantName: 'Locataire en titre',
      adjustmentType: 'Bail initial',
    },
  ];
}
