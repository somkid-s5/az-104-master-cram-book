# AZ-104 2026 Master Cram Book

Interactive, pass-first study system for **Microsoft AZ-104: Microsoft Azure Administrator**.

## Live site

https://somkid-s5.github.io/az-104-master-cram-book/

## Source of truth

The main Learn/Cram/Flashcard/Question Bank experience is generated from the user's Google Drive document:

**AZ-104 2026 Complete Exam Cheat Sheet (Pass-First)**

Current merged source snapshot:
- ~49,000 characters of exam-focused notes
- 15 official objectives across 5 domains
- 81 objective-completeness checklist items
- 103 high-yield flashcards
- 155 original scenario questions generated from the study notes and decision patterns

The paid Udemy practice-test files in Drive are **not copied into the site**; the question bank is original practice content.

## Study modes

- Full Google-Drive-backed Learn pages
- 10 Visual Labs
- Cram Sheet with cross-topic comparisons and last-minute triggers
- 103 Flashcards
- 155-question scenario bank with domain filters and 20/50/100/all modes
- Blueprint checklist
- Local browser progress and dark/light theme

## Quality gate

Every push to `main` must pass Playwright regression tests on desktop and mobile before GitHub Pages deploys. The gate checks rendering, JavaScript/console errors, broken local links, horizontal overflow, core interactions, and presence of Drive-only content such as SSPR, Azure Files identity access, Encryption at Host, Bastion and Network Watcher.

> Study aid only. Always compare changing exam scope and service behavior with current Microsoft Learn documentation.
