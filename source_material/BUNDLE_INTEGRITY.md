# Intégrité du bundle HTML

Les fragments GitHub ont été vérifiés après transfert contre les Git blob SHA attendus :

| Fragment | Taille | Git blob SHA |
|---|---:|---|
| `payload.part001` | 6 000 | `59e515fb33ece547ad1c5010148ba32eabff5ff1` |
| `payload.part002` | 6 000 | `5424bb539b57d2e8c7e18c9fb63466833d3399b3` |
| `payload.part003` | 6 000 | `67751ca6bf3301ede72b67fe8c490fd4dbed9b82` |
| `payload.part004` | 6 000 | `2c6f933564768b8e09c8d4dc89b6809926fcf912` |
| `payload.part005` | 6 000 | `3aff4857b9c4fef9baeba2f393c51e0e060e2a1b` |
| `payload.part006` | 6 000 | `1e342faf96571e28ea1a582f07afdfe6dd810c16` |
| `payload.part007` | 5 356 | `c54d80f20cad5e09e3c02fe5a2014895f2abe7dc` |

Le script `scripts/materialize_breaktest.py` effectue ensuite la validation de bout en bout : 7 fragments, 41 356 caractères encodés, 132 899 octets décodés et SHA-256 final `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`.