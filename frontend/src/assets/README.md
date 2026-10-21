# Assets

Local static assets (logo variants, illustrations, etc.) go here and are
imported directly in components, e.g. `import logo from "../assets/logo.svg"`.

Lesson media (sign images/videos referenced by `lesson.image_url` /
`lesson.video_url`) is served separately — either from `backend/uploads/`
in development or a CDN/object store in production — not bundled here,
since it's content data rather than app UI assets.
