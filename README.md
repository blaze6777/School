# Lincoln Elementary Simulator — V9.0.1 Hotfix
Build 2026-09-03 12:48 ET.

Hotfix for the V9.0 startup recovery error `Cannot read properties of undefined (reading 'map')`. The V9.0 migration now defensively repairs partially-created Connected School and Staffing data structures (social-world arrays, office queues, leadership data, budgets, visitors, requests, orders, trips, incidents and hard-to-fill staffing lists) before rendering. Existing V8.9/V9.0 progress is preserved.
