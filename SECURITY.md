# Security / privacy notes

This project is intentionally backend-free.

Do not put:
- API keys
- passwords
- service-role keys
- database admin credentials

inside this repository.

GitHub Pages sites are public. Browser localStorage is useful for a student/demo project, but it is not a secure cloud database.

For production:
- use HTTPS
- authenticate users
- validate inputs server-side
- store only necessary personal data
- use row-level security in a managed database
- keep AI/API secrets on a server or serverless function
