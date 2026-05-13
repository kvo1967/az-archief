import { getStadionLocatie } from '../data/stadions.js';

/**
 * Bepaal seizoen op basis van datum. Voetbalseizoen loopt aug → mei.
 * Wedstrijden vanaf juli horen bij het nieuwe seizoen.
 */
export function getSeizoen(dateStr) {
  const year = parseInt(dateStr.slice(0, 4), 10);
  const month = parseInt(dateStr.slice(5, 7), 10);
  return month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
}

/**
 * Parse een wedstrijd-string ("AZ - Ajax" of "Ajax - AZ").
 * Returnt { thuis: bool, tegenstander: string } of null als niet parsebaar.
 *
 * AZ-aliassen: AZ, Alkmaar'54, Alkmaar
 * Edge cases: tegenstanders met streepje in de naam (bijv. "Bodø/Glimt").
 */
const AZ_PATTERNS = [
  /^AZ\b/i,
  /^Alkmaar['']?54/i,
  /^Alkmaar\b/i,
];

function isAZ(naam) {
  return AZ_PATTERNS.some((re) => re.test(naam.trim()));
}

export function parseWedstrijd(wedstrijdStr) {
  if (!wedstrijdStr) return { thuis: null, tegenstander: 'Onbekend' };

  // Probeer eerst splitsen op " - " (met spaties), dat is de meest betrouwbare separator
  let parts = wedstrijdStr.split(/\s+-\s+/);
  if (parts.length === 2) {
    const [home, away] = parts.map((s) => s.trim());
    if (isAZ(home)) return { thuis: true, tegenstander: away };
    if (isAZ(away)) return { thuis: false, tegenstander: home };
  }

  // Fallback: zonder spaties (bijv. "Blauw-Wit-Alkmaar'54")
  // Probeer AZ-patterns te matchen aan voorkant of achterkant
  for (const re of AZ_PATTERNS) {
    const m = wedstrijdStr.match(new RegExp(`^(.+?)\\s*-\\s*(${re.source}.*)$`, 'i'));
    if (m && isAZ(m[2])) return { thuis: false, tegenstander: m[1].trim() };
    const m2 = wedstrijdStr.match(new RegExp(`^(${re.source}.*?)\\s*-\\s*(.+)$`, 'i'));
    if (m2 && isAZ(m2[1])) return { thuis: true, tegenstander: m2[2].trim() };
  }

  return { thuis: null, tegenstander: wedstrijdStr };
}

/**
 * Genereer een stabiele kleur per wedstrijd op basis van de uitslag/datum.
 * Gebruikt voor de "cover" weergave.
 */
const COVER_KLEUREN = ['#8B0000', '#A52A2A', '#991B1B', '#B91C1C', '#DC2626', '#EF4444', '#7F1D1D'];
function getCoverKleur(id) {
  const hash = String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return COVER_KLEUREN[hash % COVER_KLEUREN.length];
}

/**
 * Pad voor afbeeldingsbestand. Boekjes staan in /public/boekjes/.
 * In dev en production werkt dit identiek. cloudfare storage
 */
const BOEKJES_BASE_URL = import.meta.env.VITE_BOEKJES_URL || '/az-matchday-programms';

function getBoekjePad(bestandsnaam) {
  return `${BOEKJES_BASE_URL}/${encodeURIComponent(bestandsnaam)}`;
}

/**
 * Hoofdtransformer: ruwe JSON-record → UI-record.
 */
export function transformWedstrijd(raw, index) {
  const { thuis: thuisParsed, tegenstander } = parseWedstrijd(raw.wedstrijd);
  const datum = raw.DatePlayed.slice(0, 10); // "YYYY-MM-DD"
  const locatie = getStadionLocatie(raw.PlayedAt);

  // thuis-uit is explicit in the new dataset; fall back to parsing the match string
  const thuisUit = raw['thuis-uit'];
  const thuis = thuisUit ? thuisUit === 'thuis' : thuisParsed;

  // season is pre-computed in the new dataset; fall back to deriving from date
  const seizoen = raw.season || getSeizoen(datum);

  // single webp_file in new dataset; array ProgrammaBestanden in old dataset
  const bestanden = raw.webp_file
    ? [getBoekjePad(raw.webp_file)]
    : (raw.ProgrammaBestanden || []).map(getBoekjePad);

  return {
    id: index,
    datum,
    seizoen,
    wedstrijd: raw.wedstrijd,
    tegenstander,
    competitie: raw.competitie || 'Onbekend',
    competitiontype: raw.competitiontype || null,
    uitslag: raw.uitslag || '?-?',
    thuis,
    stadion: raw.PlayedAt || 'Onbekend',
    stad: locatie?.stad ?? null,
    land: locatie?.land ?? null,
    lat: locatie?.lat ?? null,
    lon: locatie?.lon ?? null,
    bestanden,
    cover: getCoverKleur(`${datum}-${tegenstander}`),
  };
}

/**
 * Transformeer hele dataset.
 */
export function transformDataset(rawData) {
  return rawData.map((r, i) => transformWedstrijd(r, i));
}

/**
 * Format datum naar Nederlands (15 mei 2024).
 */
export function formatDatum(iso) {
  const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  const d = new Date(iso);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Normaliseer competitie-namen — verschillende sponsoren over de jaren.
 * "Holland Casino Eredivisie", "KPN Eredivisie" → "Eredivisie"
 */
export function normaliseerCompetitie(naam) {
  if (!naam) return 'Onbekend';
  if (/eredivisie/i.test(naam)) return 'Eredivisie';
  if (/eerste divisie/i.test(naam) || /toto divisie/i.test(naam) || /telecompetitie/i.test(naam))
    return 'Eerste divisie';
  if (/knvb beker/i.test(naam) || /amstel cup/i.test(naam)) return 'KNVB Beker';
  if (/uefa cup/i.test(naam)) return 'UEFA Cup';
  if (/europa league/i.test(naam)) return 'Europa League';
  if (/conference league/i.test(naam)) return 'Conference League';
  if (/champions league/i.test(naam)) return 'Champions League';
  if (/play.?off/i.test(naam)) return 'Play-offs';
  if (/vriendschappelijk/i.test(naam)) return 'Vriendschappelijk';
  return naam;
}
