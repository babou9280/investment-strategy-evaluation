# Breaktest HTML source bundle

The seven `payload.partNNN` files are consecutive chunks of one gzip-compressed, base64-encoded copy of the audited canonical HTML.

Run:

```bash
python3 scripts/materialize_breaktest.py
```

The script refuses incomplete or altered bundles and verifies all of the following before writing `app/Breaktest_Studio.html`:

- 7 parts;
- encoded length: 41,356 characters;
- decoded size: 132,899 bytes;
- SHA-256: `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`.

Do not edit the payload chunks manually.