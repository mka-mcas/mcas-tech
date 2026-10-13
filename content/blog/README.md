# MCAS.tech blog content

Published blog articles will be migrated here from the Supabase `blog_posts` table during the public-site decoupling phase.

## Important

Do not replace the current database-backed blog with an empty local content source. First export and verify the authoritative table, preserve all published slugs and article bodies, then convert the export into version-controlled Markdown/MDX or JSON-plus-Markdown files.

Do not place subscriber email addresses, private telemetry, credentials, or other personal data in this directory.

## Suggested article metadata

Each migrated article should preserve:

- `title`
- `slug` (URL-safe and unchanged from the published URL)
- `excerpt`
- `cover_image`
- `published_at` (ISO 8601)
- `author_name`
- `content` (Markdown, including math/table/image references where present)

Keep image URLs stable initially; moving images into the repository can be a separate verified task.
