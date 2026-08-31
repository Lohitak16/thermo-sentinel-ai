# ThermoGuard Insights

THERMOGUARD AI — NASA FIRMS INDUSTRIAL FIRE INTELLIGENCE PLATFORM

Build a production-quality, visually stunning web application called ThermoGuard AI for a Smart India Hackathon (SIH) project.

1. PROJECT MISSION

ThermoGuard AI is an intelligent geospatial fire-monitoring and industrial thermal-source detection platform based on:

NASA FIRMS thermal anomaly data

Satellite observations

OpenStreetMap industrial facility data

Geospatial proximity analysis

FRP (Fire Radiative Power)

Brightness temperature

Satellite confidence

Industrial facility proximity

AI-based fire classification architecture

The problem statement is:

"AI-Based Detection and Classification of Industrial Fires and Persistent Thermal Sources Using NASA FIRMS, OSM & Satellite Data"

The application should feel like a combination of:

NASA Earth observation command center

modern AI dashboard

satellite intelligence platform

emergency-response control room

premium geospatial analytics product

Do NOT make it look like a generic admin dashboard.

The experience should immediately communicate:

"We monitor the Earth. We detect thermal anomalies. We understand industrial risk. We help responders act faster."

2. VISUAL DIRECTION

Create a futuristic, cinematic, premium interface.

Design language:

Dark space-inspired background

Near-black / deep navy surfaces

Subtle glassmorphism

Thin luminous borders

Soft atmospheric gradients

Satellite-grid visual language

Intelligent data visualization

Minimal but dramatic accent colors

High information density without looking cluttered

Use a sophisticated palette around:

Midnight / space navy

Charcoal

Electric cyan

Thermal orange

Alert red

Amber

Emerald green

White / cool gray typography

The thermal visualization should visually resemble a satellite thermal-imaging system.

Use glowing gradients carefully. Avoid excessive neon.

Typography should be modern and highly readable.

Recommended fonts:

Inter

Space Grotesk

JetBrains Mono for coordinates, IDs and technical values

Use Lucide icons.

3. FRONTEND TECHNOLOGY

Build using:

React

TypeScript

Tailwind CSS

shadcn/ui

React Router

Recharts for analytics

Leaflet or MapLibre for maps

Framer Motion for animations

TanStack Query for API data fetching

Axios or fetch for REST API communication

Keep the architecture modular and production-ready.

Create reusable components rather than putting everything into one page.

4. BACKEND INTEGRATION

The existing backend is a FastAPI application.

Create a centralized API configuration:

VITE_API_BASE_URL

The frontend must NEVER contain database credentials.

The frontend communicates only with FastAPI.

Implement an API service layer.

Existing backend endpoints include:

GET /
GET /db-test

GET /thermal-anomalies
GET /thermal-anomalies/{anomaly_id}
POST /thermal-anomalies
PUT /thermal-anomalies/{anomaly_id}
DELETE /thermal-anomalies/{anomaly_id}

GET /industrial-facilities
POST /industrial-facilities
DELETE /industrial-facilities/{facility_id}

GET /thermal-anomalies/{anomaly_id}/nearby-facilities

GET /thermal-anomalies/{anomaly_id}/risk-assessment

GET /osm-test
GET /osm-facilities
POST /osm-facilities/import

Connect the frontend to these endpoints rather than using fake data wherever real API data is available.

5. APPLICATION STRUCTURE

Create these major routes:

/

/dashboard

/live-monitor

/anomalies

/anomalies/:id

/industrial-facilities

/risk-analysis

/satellite-intelligence

/analytics

/osm

/settings

Create a persistent left navigation sidebar on desktop.

Mobile should use a compact navigation drawer.

Top bar should contain:

ThermoGuard AI logo

system status

current monitoring region

notification indicator

API connection indicator

user/profile menu

theme toggle

6. LANDING / HERO EXPERIENCE

Create a breathtaking landing/dashboard introduction.

Hero title:

THERMOGUARD AI

Subtitle:

AI-Powered Industrial Fire & Persistent Thermal Source Intelligence

Supporting copy:

"Detect. Classify. Locate. Assess. Respond."

The hero should have a subtle animated satellite-earth background.

Add an animated global thermal visualization with tiny moving particles representing detected thermal events.

Add three primary CTA buttons:

Launch Command Center
Explore Thermal Map
View Analytics

Use elegant Framer Motion animations.

Animations should include:

staggered text reveal

glowing radar sweep

floating satellite particles

animated counters

map marker pulses

subtle parallax

smooth page transitions

Do not over-animate.

The first impression should feel like a real government/space-tech intelligence platform.

7. COMMAND CENTER DASHBOARD

The main dashboard is the centerpiece.

Layout:

Top KPI row

Create beautiful glass cards:

Active Thermal Anomalies

Show live count from:

GET /thermal-anomalies

High Risk Events

Calculate/display high-risk events based on risk assessment results.

Industrial Facilities

Show count from:

GET /industrial-facilities

High FRP Events

Show count of anomalies exceeding a high FRP threshold.

Average FRP

Calculate from available anomaly data.

Monitoring Status

Show:

LIVE
or
API OFFLINE

Use animated status indicators.

Cards should have:

icon

metric

trend indicator where meaningful

tiny sparkline

subtle hover animation

8. MAIN GEOSPATIAL COMMAND MAP

Make the map the visual centerpiece.

Use Leaflet or MapLibre.

Create a full interactive map showing:

Thermal anomaly markers

Each anomaly should display:

latitude

longitude

brightness

FRP

confidence

satellite

acquisition date

acquisition time

Marker appearance should reflect risk:

LOW → green/cyan
MEDIUM → amber
HIGH → red/orange

Add pulsing animation to high-risk markers.

Industrial facility markers

Display OSM/database facilities with a different icon.

Facility popup:

name

facility type

source

coordinates

Map controls

Include:

zoom

reset view

satellite/terrain toggle

anomaly layer toggle

facility layer toggle

heatmap toggle

clustering toggle

fullscreen

locate selected event

9. THERMAL RADAR VISUALIZATION

Add a radar-style panel beside or over the map.

It should visually communicate:

"THERMAL SIGNAL DETECTED"

Use:

rotating radar sweep

concentric rings

glowing detection points

animated scan line

coordinates

FRP

confidence

When a user selects an anomaly, animate the radar toward that location.

This should feel like a real-time mission-control interface.

10. ANOMALY EXPLORER

Create a dedicated anomaly management page.

Display anomalies in a premium table.

Columns:

ID

Coordinates

FRP

Brightness

Confidence

Satellite

Acquisition Date

Acquisition Time

Risk

Actions

Filters:

Confidence

Satellite

Minimum FRP

Risk

Date

Search by ID

Search by coordinates

Add:

pagination

sorting

column visibility

export UI

refresh

loading skeletons

Every row should have:

View Intelligence

button.

11. ANOMALY INTELLIGENCE PAGE

When clicking an anomaly, open:

/anomalies/:id

Create a cinematic investigation screen.

Header:

THERMAL EVENT #123

Show:

Risk badge

confidence

satellite

acquisition timestamp

Create a large information panel containing:

Latitude
Longitude
Brightness
FRP
Satellite
Confidence
Acquisition date
Acquisition time

Then create a "Risk Intelligence" section.

Call:

GET /thermal-anomalies/{id}/risk-assessment

Display:

Risk Level
FRP
Confidence
Nearby Industrial Facility
Nearest Facility Distance

Use a dramatic risk gauge.

Risk gauge:

LOW
MEDIUM
HIGH

Animate the gauge when loaded.

12. PROXIMITY ANALYSIS

Use:

GET /thermal-anomalies/{id}/nearby-facilities

Allow users to select:

Radius:

1 km
5 km
10 km
25 km
50 km

Display nearby facilities on the map.

Draw animated radius circles around the thermal anomaly.

Show a list:

Facility
Type
Distance
Source

Sort by distance.

Create a visual explanation:

THERMAL ANOMALY
↓
GEOSPATIAL CORRELATION
↓
INDUSTRIAL FACILITY
↓
RISK ASSESSMENT

This should visually explain the core project intelligence.

13. INDUSTRIAL FACILITY INTELLIGENCE

Create:

/industrial-facilities

Show all industrial facilities.

Cards + map + table.

Each facility should display:

Name

Type

Latitude

Longitude

Source

Source badges:

OpenStreetMap
Database

Add:

Import from OpenStreetMap

button.

When clicked:

POST /osm-facilities/import

Show a beautiful import animation.

Example status sequence:

CONNECTING TO OSM
↓
QUERYING INDUSTRIAL DATA
↓
PROCESSING GEOPOINTS
↓
IMPORTING FACILITIES
↓
SYNC COMPLETE

Display the imported count returned by the API.

14. OSM DATA CENTER

Create a dedicated page:

/osm

Title:

OPENSTREETMAP INDUSTRIAL INTELLIGENCE

Show:

OSM connection status

number of discovered facilities

industrial facility map

facility categories

last synchronization

import button

Use:

GET /osm-test

GET /osm-facilities

POST /osm-facilities/import

Create a geographic visualization of OSM facilities.

Show source transparency:

"Source: OpenStreetMap"

15. SATELLITE INTELLIGENCE PAGE

Create a futuristic satellite-data dashboard.

Sections:

Satellite Coverage

Show available satellites based on anomaly data.

Create a donut/pie chart of anomalies by satellite.

Thermal Intensity

Create a histogram/bar visualization of FRP distribution.

Brightness Analysis

Create a scatter plot:

Brightness vs FRP

Confidence Distribution

Create a pie chart:

High
Medium
Low

Temporal Activity

Create a line chart showing thermal detections over time using acquisition dates available from the API.

If there is insufficient historical data, clearly display:

"Awaiting additional historical observations"

Do not fabricate scientific measurements.

16. ANALYTICS COMMAND CENTER

Create a premium analytics page.

Use Recharts.

Include:

Chart 1 — Thermal Events Over Time

Line chart.

X axis:
Date

Y axis:
Thermal anomalies

Chart 2 — FRP Distribution

Bar chart.

Buckets:

0–10
10–20
20–40
40–60
60+

Chart 3 — Risk Distribution

Donut/pie:

Low
Medium
High

Chart 4 — Satellite Contribution

Pie chart.

Chart 5 — Industrial Facility Types

Bar chart.

Chart 6 — Brightness vs FRP

Scatter plot.

Make charts interactive.

Hovering should reveal detailed tooltips.

Add date filters:

24H
7D
30D
90D
ALL

Only use data actually returned by the backend.

17. AI CLASSIFICATION EXPERIENCE

The project is intended to become an AI-based classification system.

Build the UI architecture now even if the current backend does not yet expose the ML inference endpoint.

Create an "AI Classification" panel.

Possible classifications:

🔥 Industrial Fire
♨ Persistent Thermal Source
🌾 Agricultural Burn
🌋 Natural Thermal Event
❓ Unknown

Show:

AI Classification
Confidence
Thermal Signature
Industrial Proximity
Persistence Score
FRP Signal
Brightness Signal

Create an animated AI confidence visualization.

Example:

INDUSTRIAL FIRE
94.7%

Do NOT present fabricated AI predictions as real backend results.

If the ML endpoint is not available, show:

AI MODEL READY — INFERENCE API NOT CONNECTED

with a clear development state.

Architect the frontend so an endpoint can later be plugged in easily.

18. PERSISTENT THERMAL SOURCE ANALYSIS

Create a dedicated visualization.

Title:

PERSISTENCE INTELLIGENCE

Show a timeline of repeated thermal detections at nearby coordinates.

Create a visual "persistence score".

Possible UI:

Single Event
↓
Repeated Event
↓
Persistent Thermal Source

Use coordinate clustering.

If historical data is not sufficient, display an honest empty state rather than fake persistence data.

19. FIRE RISK ENGINE

Create a highly visual risk-analysis panel.

Explain the current backend logic:

FRP ≥ 40 + nearby industrial facility
→ HIGH

FRP ≥ 20 OR nearby industrial facility
→ MEDIUM

Otherwise
→ LOW

Display this as an interactive decision-flow visualization.

Example:

┌───────────────┐
│ Thermal Event │
└───────┬───────┘
↓
┌───────────────┐
│ FRP Analysis │
└───────┬───────┘
↓
┌─────────────────────┐
│ Industrial Proximity│
└─────────┬───────────┘
↓
RISK ENGINE
↓
LOW / MEDIUM / HIGH

Show the actual values for the selected anomaly.

20. LIVE MONITOR

Create:

/live-monitor

Make this feel like a real emergency operations room.

Header:

LIVE THERMAL MONITOR

Display:

LIVE
● Monitoring active

Show:

live anomaly count

latest detection

latest FRP

highest risk event

nearest industrial facility

Create an animated event feed:

NEW THERMAL SIGNAL
19:12:04
Lat: ...
Lon: ...
FRP: ...
Risk: HIGH

Events should animate into the feed.

Use polling/refetching with TanStack Query.

Do not use fake real-time data if the API does not provide it.

21. EVENT DETAIL DRAWER

Clicking any map marker should open a right-side intelligence drawer.

Contents:

THERMAL EVENT #ID

Risk badge

Coordinates

FRP

Brightness

Confidence

Satellite

Acquisition time

Nearby facility count

Nearest facility

Distance

Buttons:

View Full Intelligence
Analyze Risk
Show Nearby Facilities
Delete Event
Edit Event

22. CRUD INTERFACE

Since the backend supports CRUD operations, implement them properly.

Thermal anomaly:

Create
Read
Update
Delete

Industrial facility:

Create
Read
Delete

Use modal forms with validation.

Show:

success toast

error toast

loading state

optimistic UI where safe

confirmation before destructive actions

Never silently fail.

23. API HEALTH MONITOR

Create a small persistent system indicator.

Call:

GET /

and:

GET /db-test

Display:

API
CONNECTED

DATABASE
CONNECTED

OSM
CONNECTED

If unavailable:

API
OFFLINE

Use green/amber/red states.

Create a dedicated system-health panel in Settings.

24. ERROR HANDLING

Create beautiful error states.

Examples:

API unavailable

"ThermoGuard cannot reach the intelligence server."

Database unavailable

"Data services are temporarily unavailable."

OSM unavailable

"OpenStreetMap synchronization could not be completed."

No anomalies:

"No thermal anomalies detected in the current dataset."

No facilities:

"No industrial facilities found."

Never show blank screens.

25. LOADING EXPERIENCE

Create premium skeleton loaders.

For map:

Show animated satellite scanning overlay.

For analytics:

Show chart skeleton.

For anomaly detail:

Show intelligence-card skeleton.

For OSM import:

Show animated progress experience.

26. MICRO-INTERACTIONS

Add sophisticated animations:

button hover glow

cards lift slightly on hover

marker pulse

risk badge pulse for HIGH

page fade transitions

chart entrance animation

counters count upward

map focus animation

modal scale/fade

drawer slide-in

radar sweep

notification slide-in

skeleton shimmer

Use Framer Motion.

Animation timing should feel professional.

Do NOT make the application feel like a gaming UI.

27. COMMAND PALETTE

Add a global command palette activated by:

CTRL + K

Commands:

Go to Dashboard
Open Live Monitor
Search Thermal Events
Open Industrial Facilities
Open Analytics
Open OSM
System Health
Settings

Make this feel like a professional intelligence platform.

28. SEARCH

Global search should search:

anomaly ID

coordinates

facility name

facility type

satellite

Results should display icons and category labels.

29. NOTIFICATION SYSTEM

Create a notification center.

Notification examples should be generated only from actual backend data.

Possible notification types:

HIGH-RISK THERMAL EVENT
NEW THERMAL ANOMALY
INDUSTRIAL FACILITY PROXIMITY
OSM SYNC COMPLETE
API CONNECTION RESTORED

Do not generate fictional alerts.

30. RESPONSIVE DESIGN

Desktop:

Large command-center layout.

Tablet:

Condensed navigation.

Mobile:

Bottom navigation or hamburger menu.

Maps must remain usable on mobile.

Charts must resize correctly.

Tables should become cards on mobile.

31. ACCESSIBILITY

Implement:

semantic HTML

keyboard navigation

visible focus states

sufficient contrast

ARIA labels

accessible dialogs

reduced-motion consideration

Respect:

prefers-reduced-motion

32. DATA VISUALIZATION STYLE

Charts should look like part of the ThermoGuard intelligence system.

Use:

smooth animations

clean grids

readable labels

compact legends

hover tooltips

responsive sizing

Do not overload charts with unnecessary decoration.

Every chart should answer a specific question.

33. MAP LEGEND

Create a floating map legend:

● HIGH RISK
● MEDIUM RISK
● LOW RISK
◆ INDUSTRIAL FACILITY
◎ SELECTED EVENT
◌ ANALYSIS RADIUS

Make the legend elegant and collapsible.

34. SCIENTIFIC TRANSPARENCY

Create an "About the Intelligence" section explaining:

NASA FIRMS provides thermal anomaly observations.

OpenStreetMap provides industrial facility context.

FRP represents Fire Radiative Power.

Brightness represents thermal brightness information.

Geospatial proximity helps associate thermal events with industrial facilities.

The risk engine combines these signals.

AI classification will extend this pipeline to distinguish industrial fires and persistent thermal sources from other thermal events.

Do not make unsupported scientific claims.

35. PROJECT STORYTELLING

The dashboard should communicate this pipeline visually:

NASA FIRMS
↓
THERMAL ANOMALY DETECTION
↓
SATELLITE SIGNAL ANALYSIS
↓
OSM INDUSTRIAL CONTEXT
↓
GEOSPATIAL CORRELATION
↓
AI CLASSIFICATION
↓
RISK ASSESSMENT
↓
EARLY WARNING
↓
RESPONSE

Create this as a beautiful interactive "Intelligence Pipeline" component.

36. SIH PRESENTATION MODE

Add a special:

Presentation Mode

button.

When activated:

hide navigation

maximize map

enlarge KPIs

increase visualization size

show intelligence pipeline

show key project metrics

create cinematic transitions

This mode should be perfect for demonstrating the project to SIH judges.

37. DEMO MODE

Create a controlled demo mode.

If the backend has insufficient records, clearly distinguish:

LIVE DATA
from
DEMO DATA

Never mix them silently.

Demo data should be explicitly labeled:

DEMO / SIMULATION

This allows the SIH presentation to remain visually impressive without misleading judges.

38. UI COMPONENTS

Create reusable components:

ThermoLogo
Sidebar
TopBar
KpiCard
RiskBadge
RiskGauge
ThermalMap
ThermalMarker
FacilityMarker
MapLegend
RadarScanner
AnomalyTable
AnomalyDetailDrawer
RiskAnalysis
FacilityTable
FacilityCard
AnalyticsCard
ChartContainer
SatelliteCard
PersistenceTimeline
IntelligencePipeline
SystemHealth
NotificationCenter
CommandPalette
EmptyState
LoadingSkeleton
ErrorState
ConfirmDialog

39. API SERVICE ARCHITECTURE

Create:

src/services/api.ts

and separate modules where useful:

thermalAnomaliesApi
industrialFacilitiesApi
osmApi
healthApi
riskApi

Create TypeScript types/interfaces for:

ThermalAnomaly
IndustrialFacility
RiskAssessment
NearbyFacility
ApiResponse

Centralize API errors.

Do not scatter fetch calls throughout components.

40. ENVIRONMENT CONFIGURATION

Use:

VITE_API_BASE_URL

Example:

VITE_API_BASE_URL=http://localhost:8000

Never expose:

DATABASE_URL
PostgreSQL credentials
server secrets
NASA API keys
private credentials

The browser should only communicate with the FastAPI backend.

41. EMPTY STATES

Design meaningful empty states.

Example:

"No thermal signals in this region"

with a small satellite illustration and:

"Expand the monitoring radius or synchronize the latest FIRMS observations."

Facility empty state:

"No industrial infrastructure mapped"

with:

"Synchronize OpenStreetMap to enrich the risk model."

42. FOOTER / ATTRIBUTION

Include:

ThermoGuard AI

"AI-Based Detection and Classification of Industrial Fires and Persistent Thermal Sources"

Data sources:

NASA FIRMS
OpenStreetMap
Satellite observations

Include appropriate OpenStreetMap attribution on the map as required by the mapping provider.

43. PERFORMANCE

Optimize for a large number of map points.

Use:

marker clustering

memoization

lazy-loaded pages

code splitting

debounced search

TanStack Query caching

virtualized tables if necessary

Avoid unnecessary API calls.

44. IMPORTANT DATA RULE

Do NOT invent backend data.

If an endpoint returns no data, show a proper empty state.

If a requested AI feature does not exist in the backend yet, build the UI and clearly show:

"AI inference endpoint not connected"

Do not pretend the AI model is running.

45. IMPORTANT BACKEND LIMITATION HANDLING

The current backend has risk assessment based on:

FRP
+
industrial-facility proximity

Therefore the UI should explain that the current risk engine is a rule-based geospatial assessment.

Prepare the architecture for future ML integration.

Future endpoint could conceptually be:

POST /ai/classify

but DO NOT call this endpoint until it actually exists.

Similarly, persistence analysis should only use real historical observations.

46. VISUAL DETAILS

Use subtle background effects:

animated grid

satellite orbit lines

faint world-map texture

moving particles

thermal gradients

radar scan

Keep effects low-opacity.

The interface must remain readable.

Use rounded corners, but not excessively rounded "startup SaaS" styling.

Use strong hierarchy.

Cards should feel like mission-control instrumentation.

47. DASHBOARD LAYOUT

The primary dashboard should approximately follow:

SIDEBAR
│
├── Dashboard
├── Live Monitor
├── Thermal Events
├── Industrial Facilities
├── Risk Analysis
├── Satellite Intelligence
├── Analytics
├── OSM Intelligence
└── Settings

MAIN AREA

TOP BAR

↓

KPI CARDS

↓

┌───────────────────────────────┬───────────────┐
│ │ │
│ GLOBAL THERMAL MAP │ THERMAL RADAR │
│ │ │
│ │ │
└───────────────────────────────┴───────────────┘

↓

┌──────────────────────┬────────────────────────┐
│ Risk Distribution │ Thermal Activity │
│ Pie / Donut │ Line Chart │
└──────────────────────┴────────────────────────┘

↓

┌──────────────────────┬────────────────────────┐
│ Satellite Analysis │ Industrial Correlation │
│ Charts │ Analytics │
└──────────────────────┴────────────────────────┘

↓

INTELLIGENCE PIPELINE

NASA FIRMS → SATELLITE → OSM → AI → RISK → RESPONSE

48. FINAL EXPERIENCE

When a judge opens the application, the experience should immediately communicate:

"THIS IS NOT JUST A CRUD DASHBOARD."

It should look like a real:

EARTH OBSERVATION + AI + GEOSPATIAL FIRE INTELLIGENCE COMMAND CENTER.

The visual hierarchy should make the map and intelligence insights the hero.

Prioritize:

Geospatial visualization

Thermal anomaly intelligence

Risk assessment

Industrial proximity

Satellite analytics

AI classification readiness

Beautiful charts

System reliability

SIH presentation quality

Make the final product feel:

NASA-inspired
AI-powered
scientifically credible
government-grade
modern
cinematic
fast
responsive
beautiful

Build the complete frontend, wire all currently available backend endpoints, create reusable components, implement proper loading/error/empty states, and make the entire application feel cohesive rather than like a collection of unrelated pages.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/36ffbc0c-541c-4bfd-ad80-502650e478c9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
