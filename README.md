# Het Archief — AZ Programmaboekjes

Een React + Vite applicatie om een collectie AZ programmaboekjes te bekijken en doorzoeken.

## Vereisten

- Node.js 20.x of hoger
- npm (komt mee met Node)

## Installatie

```bash
# In de projectmap (waar package.json staat):
npm install
```

Hiermee worden alle dependencies geïnstalleerd in `node_modules/` (~250MB, niet committen).

## Lokaal draaien

```bash
npm run dev
```

Dit start de Vite dev-server. Standaard opent automatisch de browser op `http://localhost:5173`.

Wijzigingen in de code worden direct in de browser zichtbaar (Hot Module Replacement).

## Bouwen voor productie

```bash
npm run build
```

Dit genereert een geoptimaliseerde versie in de `dist/` map. Deze map kun je deployen op:

- Vercel — gewoon de repo koppelen
- Azure Static Web Apps — via GitHub Actions (Microsoft genereert de workflow)
- Cloudflare Pages
- Elke statische host (Netlify, GitHub Pages, etc.)

## Bouw lokaal previewen

```bash
npm run preview
```

Toont de gebouwde productie-versie op `http://localhost:4173`.

## Projectstructuur

```
az-archief/
├── public/
│   └── boekjes/                 # ← Hier komen de scans van programmaboekjes
│       ├── 11-apr-1955 Blauw-Wit uit.webp
│       └── ...
├── src/
│   ├── App.jsx                   # Hoofdcomponent met state management
│   ├── main.jsx                  # React entry point
│   ├── index.css                 # Globale styles
│   ├── components/
│   │   ├── Header.jsx            # Site header met statistieken
│   │   ├── FilterSelect.jsx      # Dropdown component
│   │   ├── EmptyState.jsx        # Leeg-resultaat scherm
│   │   ├── BookjeCover.jsx       # Cover (foto of placeholder)
│   │   ├── BookjeModal.jsx       # Detail dialog met paginanavigatie
│   │   ├── GridView.jsx          # Grid van covers met paginering
│   │   ├── ListView.jsx          # Lijstweergave
│   │   ├── TimelineView.jsx      # Tijdlijn per seizoen
│   │   └── MapView.jsx           # Interactieve kaart met Leaflet
│   ├── data/
│   │   ├── wedstrijden.json      # Bron-dataset (1424 wedstrijden)
│   │   └── stadions.js           # Coördinaten van stadions
│   └── utils/
│       └── transform.js          # JSON → UI transformaties
├── index.html
├── package.json
└── vite.config.js
```

## De data

`src/data/wedstrijden.json` bevat de ruwe dataset. Velden:

- `DatePlayed` — datum als ISO string
- `PlayedAt` — naam van het stadion
- `competitie` — competitie (Eredivisie, KNVB Beker, UEFA Cup, etc.)
- `wedstrijd` — "AZ - Tegenstander" of "Tegenstander - AZ"
- `uitslag` — score "X-Y"
- `ProgrammaBestanden` — array met bestandsnamen van scans

Tijdens initialisatie wordt deze JSON via `transformDataset()` omgezet naar het UI-formaat
(seizoen-bepaling, thuis/uit-detectie, stadion-coördinaten via lookup).

## De boekjes-foto's

Plaats alle scans van programmaboekjes in `public/boekjes/`. De bestandsnamen moeten
**exact** overeenkomen met de waarden in `ProgrammaBestanden` in de JSON.

Voorbeeld: als de JSON `"11-apr-1955 Blauw-Wit uit.webp"` bevat, dan moet er een bestand
`public/boekjes/11-apr-1955 Blauw-Wit uit.webp` bestaan.

Vite serveert alles uit `public/` rechtstreeks vanaf de root-URL — `public/boekjes/foo.webp`
is bereikbaar als `/boekjes/foo.webp`. Vandaar het pad `/boekjes/${bestand}` in `transform.js`.

**Aanbeveling voor productie**: Als je veel boekjes hebt (honderden), dan wordt de `public/`
map traag te bundelen. Overweeg dan een externe storage zoals Cloudflare R2 of Azure Blob,
en pas `getBoekjePad()` in `src/utils/transform.js` aan zodat het de externe URL teruggeeft.

## Stadion-coördinaten toevoegen

De kaart toont alleen wedstrijden waarvan we het stadion kennen. Onbekende stadions
verschijnen als "X zonder locatie" in de kaart-view.

Open `src/data/stadions.js` en voeg een entry toe:

```js
'Naam Van Stadion': {
  lat: 52.1234, lon: 4.5678,
  stad: 'Amsterdam', land: 'Nederland',
  thuis: false  // true als het een AZ-thuisstadion is
},
```

De sleutel moet **exact** overeenkomen met de waarde in `PlayedAt` in de JSON.

## Tips voor doorontwikkeling

### TypeScript toevoegen
```bash
npm install -D typescript @types/node
# Hernoem .jsx naar .tsx en voeg types toe
```

### SEO via prerendering
Voor zoekmachine-vindbaarheid (bijv. "AZ programmaboekje 1981 Sociedad") overweeg migratie
naar **Astro** of **Next.js** zodat elke wedstrijd een eigen URL krijgt met server-rendered HTML.

### Performance
- De huidige implementatie laadt alle 1424 wedstrijden in geheugen — dat gaat goed
- Voor grid/list is paginering al ingebouwd (60 / 100 per pagina)
- Voor de tijdlijn met 1424 items kan virtualisatie helpen — kijk naar `react-window`

### Stripe / paywall
Als je dit ooit commercieel wil maken: Stripe Checkout integreert prima met Vite-apps.
Documentatie op stripe.com/docs.

## Hosting suggestie voor jouw situatie

Gegeven je Azure-ervaring:
1. Push naar GitHub
2. Azure Portal → "Create Static Web App"
3. Koppel de repo, kies "React" als framework preset
4. Microsoft genereert automatisch de GitHub Actions workflow
5. Eigen domein toevoegen via DNS-instellingen

Done. Elke `git push` deployt automatisch.

## Storage of programm images on cloudfare R2
https://pub-02a6c42dcd6c41228aa01ec8867770be.r2.dev


## Programmaboekjes uploaden naar Cloudflare R2

De scans van de programmaboekjes worden niet in Git opgeslagen (te groot), maar
gehost op Cloudflare R2. De app haalt ze daar op via de URL in `.env`
(`VITE_BOEKJES_URL`).

### Vereisten

- Een Cloudflare account met R2 geactiveerd
- Een R2 bucket aangemaakt (bijv. `az-matchday-programms`)
- Public Development URL ingeschakeld op de bucket
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) geïnstalleerd:
  ```powershell
  npm install -g wrangler
  wrangler login
  ```

### De drie scripts

In de projectroot staan drie PowerShell-scripts die samen een idempotente
upload-workflow vormen:

| Script | Doel |
|---|---|
| `check-boekjes.ps1` | Vergelijk lokale `public/boekjes/` met R2 — toont wat ontbreekt |
| `upload-ontbrekend.ps1` | Upload alleen de bestanden uit `ontbrekende-boekjes.txt` |
| `upload-boekjes.ps1` | Upload alles, met lokale state-tracking als alternatief |

### Workflow: nieuwe boekjes toevoegen

1. **Plaats scans in `public/boekjes/`** met dezelfde bestandsnaam als in
   `src/data/wedstrijden.json` (veld `ProgrammaBestanden`).

2. **Check de status:**
   ```powershell
   .\check-boekjes.ps1
   ```
   Output toont hoeveel bestanden lokaal staan, hoeveel al in R2, en welke
   nog ontbreken. Ontbrekende worden opgeslagen in `ontbrekende-boekjes.txt`.

3. **Upload de ontbrekende bestanden:**
   ```powershell
   .\upload-ontbrekend.ps1
   ```
   Bij ~1000 bestanden duurt dit 15-25 minuten (Wrangler upload één per keer).
   Je kunt het script onderbreken met `Ctrl+C` en later opnieuw draaien — de
   `check-boekjes.ps1` herkent dan vanzelf wat al gelukt is.

4. **Verifieer dat alles compleet is:**
   ```powershell
   .\check-boekjes.ps1
   ```
   Verwachte output: `Ontbreekt: 0` en de melding "Alle bestanden staan in R2."

### Hoe `check-boekjes.ps1` werkt

Het script doet voor elk lokaal bestand een **HEAD-request** naar de publieke
R2-URL. Een 200-response betekent dat het bestand bestaat, een 404 dat het
ontbreekt. Geen credentials nodig, want de bucket is publiek toegankelijk via
de Public Development URL.

Voor snelheid worden 10 requests parallel uitgevoerd via PowerShell Runspace
Pools. Bij ~1500 bestanden duurt de check 1-2 minuten.

De publieke URL staat hardcoded in het script (`$publicUrl`). Als je naar een
custom domain overstapt, pas dat daar aan.

### Mislukte uploads

Als `upload-ontbrekend.ps1` op een bestand vastloopt (netwerkfout, te grote
file, et cetera), wordt het toegevoegd aan `mislukte-uploads.txt`. Run
daarna gewoon opnieuw:

```powershell
.\check-boekjes.ps1        # bouwt de actuele lijst opnieuw op
.\upload-ontbrekend.ps1    # probeert ze nog eens
```

### `.gitignore` regels

De volgende patterns moeten in `.gitignore` staan, want ze zijn lokaal of
runtime-data:

```
public/boekjes/*.webp
public/boekjes/*.jpg
public/boekjes/*.jpeg
public/boekjes/*.png
.env
ontbrekende-boekjes.txt
mislukte-uploads.txt
upload-state.txt
```

### PowerShell-versie

De scripts zijn geschreven voor **Windows PowerShell 5.1** (de standaard op
Windows). Ze werken ook in PowerShell 7+. Voor parallelliteit op 5.1 wordt
de oudere Runspace Pool API gebruikt; in 7+ zou je `ForEach-Object -Parallel`
kunnen gebruiken voor compactere code.
activeer versie 7 via pwsh (7 is geinstalleerd)

## Licentie

Privé-project. Programmaboekje-scans blijven eigendom van AZ Alkmaar.
