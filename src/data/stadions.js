// Coördinaten van stadions waar AZ heeft gespeeld.
// Gebruikt om wedstrijden op de kaart te plotten.
// Sleutels zijn de exacte waarden uit het PlayedAt-veld in de JSON.
// Onbekende stadions worden niet op de kaart getoond — voeg toe waar nodig.

export const STADION_LOCATIES = {
  // === Thuis ===
  Alkmaarderhout: { lat: 52.6324, lon: 4.7534, stad: 'Alkmaar', land: 'Nederland', thuis: true },
  'Afas Stadion': { lat: 52.6128, lon: 4.7437, stad: 'Alkmaar', land: 'Nederland', thuis: true },
  'Afas stadion': { lat: 52.6128, lon: 4.7437, stad: 'Alkmaar', land: 'Nederland', thuis: true },
  'AFAS Stadion': { lat: 52.6128, lon: 4.7437, stad: 'Alkmaar', land: 'Nederland', thuis: true },
  'AZ Stadion': { lat: 52.6128, lon: 4.7437, stad: 'Alkmaar', land: 'Nederland', thuis: true },
  'DSB-Stadion': { lat: 52.6128, lon: 4.7437, stad: 'Alkmaar', land: 'Nederland', thuis: true },

  // === Eredivisie tegenstanders (uit) ===
  'De Kuip': { lat: 51.8939, lon: 4.5231, stad: 'Rotterdam', land: 'Nederland', thuis: false },
  'de kuip': { lat: 51.8939, lon: 4.5231, stad: 'Rotterdam', land: 'Nederland', thuis: false },
  'De kuip': { lat: 51.8939, lon: 4.5231, stad: 'Rotterdam', land: 'Nederland', thuis: false },
  'Philips Stadion': { lat: 51.4416, lon: 5.4673, stad: 'Eindhoven', land: 'Nederland', thuis: false },
  'Het Kasteel': { lat: 51.8773, lon: 4.4280, stad: 'Rotterdam', land: 'Nederland', thuis: false },
  'Olympisch Stadion': { lat: 52.3433, lon: 4.8519, stad: 'Amsterdam', land: 'Nederland', thuis: false },
  Haarlemstadion: { lat: 52.3839, lon: 4.6300, stad: 'Haarlem', land: 'Nederland', thuis: false },
  Arena: { lat: 52.3142, lon: 4.9418, stad: 'Amsterdam', land: 'Nederland', thuis: false },
  'Johan Cruijff ArenA': { lat: 52.3142, lon: 4.9418, stad: 'Amsterdam', land: 'Nederland', thuis: false },
  Galgenwaard: { lat: 52.0723, lon: 5.1461, stad: 'Utrecht', land: 'Nederland', thuis: false },
  'Abe Lenstra Stadion': { lat: 52.9728, lon: 6.0917, stad: 'Heerenveen', land: 'Nederland', thuis: false },
  'De Adelaarshorst': { lat: 52.2553, lon: 6.1875, stad: 'Deventer', land: 'Nederland', thuis: false },
  Zuiderpark: { lat: 52.0461, lon: 4.2833, stad: 'Den Haag', land: 'Nederland', thuis: false },
  Woudestein: { lat: 51.9131, lon: 4.5238, stad: 'Rotterdam', land: 'Nederland', thuis: false },
  'De Goffert': { lat: 51.8228, lon: 5.8425, stad: 'Nijmegen', land: 'Nederland', thuis: false },
  'De Vijverberg': { lat: 51.9642, lon: 6.2939, stad: 'Doetinchem', land: 'Nederland', thuis: false },
  'Sportpark Schoonenberg': { lat: 52.5022, lon: 4.6350, stad: 'IJmuiden', land: 'Nederland', thuis: false },
  GelreDome: { lat: 51.9886, lon: 5.8889, stad: 'Arnhem', land: 'Nederland', thuis: false },
  'De Grolsch Veste': { lat: 52.2367, lon: 6.8369, stad: 'Enschede', land: 'Nederland', thuis: false },
  'De Meer': { lat: 52.3554, lon: 4.9361, stad: 'Amsterdam', land: 'Nederland', thuis: false },
  'Cars Jeans Stadion': { lat: 52.0461, lon: 4.2833, stad: 'Den Haag', land: 'Nederland', thuis: false },
  'Kras Stadion': { lat: 52.4378, lon: 4.6597, stad: 'Volendam', land: 'Nederland', thuis: false },
  'Mandemakers Stadion': { lat: 51.6781, lon: 5.0067, stad: 'Waalwijk', land: 'Nederland', thuis: false },
  'Polman Stadion': { lat: 52.2589, lon: 6.7611, stad: 'Heracles Almelo', land: 'Nederland', thuis: false },
  'Erve Asito': { lat: 52.3567, lon: 6.6628, stad: 'Almelo', land: 'Nederland', thuis: false },
  'Stadion De Koel': { lat: 51.3556, lon: 6.1808, stad: 'Venlo', land: 'Nederland', thuis: false },
  'Sparta-stadion Het Kasteel': { lat: 51.8773, lon: 4.428, stad: 'Rotterdam', land: 'Nederland', thuis: false },
  'Stadion Galgenwaard': { lat: 52.0723, lon: 5.1461, stad: 'Utrecht', land: 'Nederland', thuis: false },
  'Stadion Feijenoord': { lat: 51.8939, lon: 4.5231, stad: 'Rotterdam', land: 'Nederland', thuis: false },
  'AFAS-stadion': { lat: 52.6128, lon: 4.7437, stad: 'Alkmaar', land: 'Nederland', thuis: true },
  'AFAS Stadion Alkmaar': { lat: 52.6128, lon: 4.7437, stad: 'Alkmaar', land: 'Nederland', thuis: true },
  'Amsterdam ArenA': { lat: 52.3142, lon: 4.9418, stad: 'Amsterdam', land: 'Nederland', thuis: false },
  'Johan Cruyff ArenA': { lat: 52.3142, lon: 4.9418, stad: 'Amsterdam', land: 'Nederland', thuis: false },
  'Feijenoord Stadion': { lat: 51.8939, lon: 4.5231, stad: 'Rotterdam', land: 'Nederland', thuis: false },
  'Stadion Feijenoord De Kuip': { lat: 51.8939, lon: 4.5231, stad: 'Rotterdam', land: 'Nederland', thuis: false },
  'PSV Stadion': { lat: 51.4416, lon: 5.4673, stad: 'Eindhoven', land: 'Nederland', thuis: false },
  'FC Twente Stadion': { lat: 52.2367, lon: 6.8369, stad: 'Enschede', land: 'Nederland', thuis: false },
  'Heracles Stadion': { lat: 52.3567, lon: 6.6628, stad: 'Almelo', land: 'Nederland', thuis: false },
  'NEC Stadion': { lat: 51.8228, lon: 5.8425, stad: 'Nijmegen', land: 'Nederland', thuis: false },
  'ADO Den Haag Stadion': { lat: 52.0461, lon: 4.2833, stad: 'Den Haag', land: 'Nederland', thuis: false },
  'FC Utrecht Stadion': { lat: 52.0723, lon: 5.1461, stad: 'Utrecht', land: 'Nederland', thuis: false },
  'SC Heerenveen Stadion': { lat: 52.9728, lon: 6.0917, stad: 'Heerenveen', land: 'Nederland', thuis: false },
  'Go Ahead Eagles Stadion': { lat: 52.2553, lon: 6.1875, stad: 'Deventer', land: 'Nederland', thuis: false },
  'Vitesse Stadion': { lat: 51.9886, lon: 5.8889, stad: 'Arnhem', land: 'Nederland', thuis: false },
  'Sparta Rotterdam Stadion': { lat: 51.8773, lon: 4.4280, stad: 'Rotterdam', land: 'Nederland', thuis: false },
  'FC Volendam Stadion': { lat: 52.4378, lon: 4.6597, stad: 'Volendam', land: 'Nederland', thuis: false },
  'RKC Waalwijk Stadion': { lat: 51.6781, lon: 5.0067, stad: 'Waalwijk', land: 'Nederland', thuis: false },
  'VVV Venlo Stadion': { lat: 51.3556, lon: 6.1808, stad: 'Venlo', land: 'Nederland', thuis: false },
  

  // === Europa ===
  'London Stadium': { lat: 51.5386, lon: -0.0166, stad: 'Londen', land: 'Engeland', thuis: false },
  'Riverside Stadium': { lat: 54.5784, lon: -1.2167, stad: 'Middlesbrough', land: 'Engeland', thuis: false },
  'Portman Road': { lat: 52.0550, lon: 1.1450, stad: 'Ipswich', land: 'Engeland', thuis: false },
  'The Hawthorns': { lat: 52.5093, lon: -1.9639, stad: 'West Bromwich', land: 'Engeland', thuis: false },
  'Anfield road': { lat: 53.43106627943104, lon: -2.960836876709955, stad: 'Liverpool', land: 'Engeland', thuis: false },  
  'Selhurst Park': { lat: 51.39807467865462, lon: -0.08604687354346198, stad: 'Londen', land: 'Engeland', thuis: false },  
  'Villa Park': { lat: 52.509216151100716, lon: -1.884460937269438, stad: 'Birmingham', land: 'Engeland', thuis: false },  

  'Stadio Olimpico': { lat: 41.9341, lon: 12.4547, stad: 'Rome', land: 'Italië', thuis: false },
  'Aspmyra Stadion': { lat: 67.2840, lon: 14.4172, stad: 'Bodø', land: 'Noorwegen', thuis: false },
  'Anoeta': { lat: 43.3014, lon: -1.9736, stad: 'San Sebastián', land: 'Spanje', thuis: false },
  'Camp Nou': { lat: 41.3809, lon: 2.1228, stad: 'Barcelona', land: 'Spanje', thuis: false },
  'Santiago Bernabéu': { lat: 40.4531, lon: -3.6883, stad: 'Madrid', land: 'Spanje', thuis: false },
  'San Siro': { lat: 45.4781, lon: 9.1239, stad: 'Milaan', land: 'Italië', thuis: false },
  'Allianz Arena': { lat: 48.2188, lon: 11.6247, stad: 'München', land: 'Duitsland', thuis: false },
  'Constant Vanden Stock': { lat: 50.8344, lon: 4.2997, stad: 'Brussel', land: 'België', thuis: false },
  'Estádio do Dragão': { lat: 41.1617, lon: -8.5839, stad: 'Porto', land: 'Portugal', thuis: false },
  'Estádio da Luz': { lat: 38.7528, lon: -9.1847, stad: 'Lissabon', land: 'Portugal', thuis: false },
  'London Stadium': { lat: 51.5386, lon: -0.0166, stad: 'Londen', land: 'Engeland', thuis: false },
  'Estadio Municipal de Anoeta': { lat: 43.3014, lon: -1.9736, stad: 'San Sebastián', land: 'Spanje', thuis: false },
  'Nou Camp': { lat: 41.3809, lon: 2.1228, stad: 'Barcelona', land: 'Spanje', thuis: false },
  'Constant Vanden Stockstadion': { lat: 50.8344, lon: 4.2997, stad: 'Brussel', land: 'België', thuis: false },
  'Lotto Park': { lat: 50.8344, lon: 4.2997, stad: 'Brussel', land: 'België', thuis: false },
  'Estádio da Luz': { lat: 38.7528, lon: -9.1847, stad: 'Lissabon', land: 'Portugal', thuis: false },
  'Estadio Benito Villamarin': { lat: 37.35663714948635, lon: -5.981411295503795, stad: 'Lissabon', land: 'Portugal', thuis: false },
  'Stadio Friuli': { lat: 46.08158593842888, lon: 13.19991749571714, stad: 'Udinese', land: 'Italië', thuis: false },
  'Rams Park': { lat: 41.10344062368133, lon: 28.99120485892022, stad: 'Istanbul', land: 'Turkije', thuis: false },
  'Sukru Saracoglu Stadion': { lat: 40.9877936512877, lon: 29.03692248372982, stad: 'Istanboel', land: 'Turkije', thuis: false },
  'Groupama Aréna' : { lat: 47.4755148981276, lon: 19.095747723891023, stad: 'Boedapest', land: 'Hongarije', thuis: false },
  

  'The Emirates': {lat: 51.55567036052208, lon: -0.10837171035102276, stad: 'Londen', land: 'Engeland', thuis: false},
  'Tottenham Hotspur Stadium': {lat: 51.60432598234831, lon: -0.06588777168690732, stad: 'Londen', land: 'Engeland', thuis: false},
  
};

/**
 * Lookup met fallback. Onbekend stadion → null (filter weg op kaart).
 */
export function getStadionLocatie(playedAt) {
  if (!playedAt) return null;
  // Probeer exacte match
  if (STADION_LOCATIES[playedAt]) return STADION_LOCATIES[playedAt];
  // Probeer case-insensitive
  const key = Object.keys(STADION_LOCATIES).find(
    (k) => k.toLowerCase() === playedAt.toLowerCase()
  );
  return key ? STADION_LOCATIES[key] : null;
}
