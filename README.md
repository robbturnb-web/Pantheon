# Pantheon

Knowledge platform seed focused on world events and notable disclosures from antiquity to the present.

## What is included
- `data/events.json`: Structured timeline records with eras, years, regions, summaries, and tags (including `disclosure` where relevant).
- `docs/timeline.md`: Narrative overview of eras and transparency milestones plus guidance on extending the dataset.

## Using the data
Load `data/events.json` into your tool of choice to power timelines, teaching aids, or lightweight visualizations. Years are integers (BCE as negatives) and every entry carries reusable tags for filtering.

## Contributing
- Keep language neutral and concise; prefer one- to two-sentence summaries.
- Add new events by appending records with consistent keys: `id`, `period`, `start_year`, `end_year`, `region`, `title`, `summary`, and `tags`.
- Mark transparency milestones with the `disclosure` tag to keep accountability moments easy to surface.
