import { CountryCode, CountryConfig } from '../types';

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  BJ: {
    code: 'BJ',
    name: 'Bénin',
    flag: '🇧🇯',
    currencySymbol: 'FCFA',
    currencyCode: 'XOF',
    taxIdName: 'Code IFU (Identifiant Fiscal Unique)',
    taxIdPlaceholder: 'Ex: 0202112345678 (13 chiffres)',
    invoiceStandardName: 'Facture Normalisée e-MECeF (DGI Bénin)',
    leaseLawName: 'Loi n° 2018-12 portant régime du bail à usage d\'habitation domestique en République du Bénin',
    recourseAuthority: 'Commission Départementale de Conciliation des Loyers / Tribunal de Première Instance (Cotonou, Porto-Novo, Parakou)',
    depositMaxMonths: 3, // Plafonnement strict de caution à 3 mois de loyer selon la loi 2018-12 au Bénin
    depositLimitMonths: 3,
    evictionNoticeDelay: '15 jours',
  },
  FR: {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    currencySymbol: '€',
    currencyCode: 'EUR',
    taxIdName: 'N° SIRET / RCS',
    taxIdPlaceholder: 'Ex: 849 203 112 00019',
    invoiceStandardName: 'Quittance de loyer certifiée (Loi ALUR)',
    leaseLawName: 'Loi n° 89-462 du 6 juillet 1989 & Loi ALUR',
    recourseAuthority: 'Commission Départementale de Conciliation (CDC) / Tribunal de Proximité',
    depositMaxMonths: 1, // 1 mois pour non meublé, 2 mois meublé
    depositLimitMonths: 1,
    evictionNoticeDelay: '6 semaines',
  },
  CI: {
    code: 'CI',
    name: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    currencySymbol: 'FCFA',
    currencyCode: 'XOF',
    taxIdName: 'N° Compte Contribuable (DGI)',
    taxIdPlaceholder: 'Ex: 1804928 B',
    invoiceStandardName: 'Quittance & Facture DGI Côte d\'Ivoire',
    leaseLawName: 'Loi n° 2019-576 portant code de la construction et du bail d\'habitation',
    recourseAuthority: 'Commission Nationale de Conciliation / Tribunal d\'Abidjan',
    depositMaxMonths: 2,
    depositLimitMonths: 2,
    evictionNoticeDelay: '1 mois',
  },
  SN: {
    code: 'SN',
    name: 'Sénégal',
    flag: '🇸🇳',
    currencySymbol: 'FCFA',
    currencyCode: 'XOF',
    taxIdName: 'N° NINEA (DGID Sénégal)',
    taxIdPlaceholder: 'Ex: 004918239 2V2',
    invoiceStandardName: 'Facture Normalisée DGID Sénégal',
    leaseLawName: 'Décret n° 2023-442 fixant les prix des loyers et régime locatif',
    recourseAuthority: 'Commission Nationale de Régulation des Loyers (CONAREL)',
    depositMaxMonths: 2,
    depositLimitMonths: 2,
    evictionNoticeDelay: '1 mois',
  },
};

export const DEFAULT_COUNTRY: CountryCode = 'BJ'; // Set Benin as primary as requested

export function formatCurrency(amount: number, countryOrCode: CountryCode | CountryConfig = 'BJ'): string {
  const code: CountryCode = typeof countryOrCode === 'string' ? countryOrCode : countryOrCode.code;
  const config = COUNTRIES[code] || COUNTRIES.BJ;
  return `${amount.toLocaleString('fr-FR')} ${config.currencySymbol}`;
}

