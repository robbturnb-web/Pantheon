# World Events and Disclosures

This overview pairs a high-level narrative with the structured data in `data/events.json`. The dataset spans ancient governance experiments to contemporary transparency milestones and can seed timelines, teaching materials, or lightweight prototypes.

## Eras at a Glance

- **Ancient and Classical:** Codified laws (Hammurabi), early democracy in Athens, Qin unification standardizing governance tools, religious tolerance through the Edict of Milan, and the fall of Western Rome.
- **Medieval:** Magna Carta's constraints on monarchy, demographic shock from the Black Death, and the printing revolution enabling mass literacy.
- **Early Modern:** Columbian exchange, Protestant Reformation and ensuing conflicts, the scientific method gaining traction, and age-of-revolution moments in America and France.
- **Modern:** Industrialization reshaping labor, two world wars remapping borders, postwar institution building (UN and UDHR), and widespread decolonization.
- **Contemporary:** Civil Rights legislation in the U.S., the Space Race culminating in Apollo 11, Cold War thaw with the fall of the Berlin Wall, the Web opening to the public, and globally networked movements and crises from the Arab Spring to COVID-19.

## Transparency and Disclosure Milestones

Key entries tagged `disclosure` highlight accountability and record-setting revelations:
- Pentagon Papers (1971) and Watergate investigations (1972-1974) shifting U.S. executive oversight.
- South Africa's Truth and Reconciliation Commission (1996-1998) documenting apartheid-era abuses.
- WikiLeaks Cablegate (2010) and Snowden's surveillance leaks (2013) fueling debates on transparency, privacy, and digital-era governance.

## Using and Extending the Dataset

Each record includes `id`, `period`, `start_year`, `end_year`, `region`, `title`, `summary`, and `tags`. Suggested conventions:
- Keep `start_year` and `end_year` as integers; use negative years for BCE.
- Use concise summaries (one to two sentences) and reusable tags such as `disclosure`, `rights`, `technology`, `conflict`, or `governance`.
- Preserve neutral, source-friendly language to make the data suitable for teaching tools, demos, or simple visualizations.
