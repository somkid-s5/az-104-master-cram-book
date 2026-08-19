# AZ-104 2026 Master Cram Book

Interactive, pass-first study guide for **Microsoft AZ-104: Microsoft Azure Administrator**.

## Live site

https://somkid-s5.github.io/az-104-master-cram-book/

## Study modes

- Multi-page Learn mode across the five AZ-104 domains
- Cram Sheet for last-minute review
- 50 Flashcards
- Scenario Quiz
- Official Blueprint coverage tracker
- Local browser progress and dark/light theme
- Automated Playwright UI regression gate before GitHub Pages deploys

## Visual Labs Hub

Open `labs.html` from the live site to access the full interactive lab set.

1. `rbac-lab.html` — RBAC / Policy / Locks
2. `storage-lab.html` — Storage redundancy and failover
3. `storage-access-lab.html` — Entra/RBAC, SAS types, stored access policy
4. `compute-lab.html` — VM availability, zones, VMSS and autoscale
5. `appservice-lab.html` — App Service slots, scaling and networking
6. `containers-lab.html` — ACR, ACI and Container Apps
7. `networking-lab.html` — DNS, routes, NSG, peering and Private Endpoint
8. `loadbalancing-lab.html` — Load Balancer, Application Gateway, Traffic Manager and Front Door
9. `monitor-lab.html` — Azure Monitor metrics/logs, alerts and Action Groups
10. `recovery-lab.html` — Azure Backup vs Site Recovery

## Quality gate

Every push to `main` must pass desktop and mobile browser regression tests before the GitHub Pages deploy job can run. Tests check rendering, JavaScript errors, console errors, broken local links and horizontal overflow, and exercise core interactive controls.

> Study aid only. Always use the current Microsoft Learn AZ-104 study guide as the authoritative exam-scope reference.
