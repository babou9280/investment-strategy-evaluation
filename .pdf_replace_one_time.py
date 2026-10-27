from pathlib import Path
import re, zlib, json, base64, hashlib

PDF = Path("Evaluation Strategie - Projet Ayman BESBAS.pdf")
PATCH = Path(".pdf_replace_one_time.b85")
OLD_GIT_SHA = "1bcb03f73b68ade81f877731928dca02d670e0c9"
NEW_SHA256 = "a9e20d4c7b0fb3345a52e7a69c2b86c80a8a90b26d0684ec0a3079d56529f51a"

old = PDF.read_bytes()
old_sha = hashlib.sha1(b"blob " + str(len(old)).encode() + b"\0" + old).hexdigest()
assert old_sha == OLD_GIT_SHA, "Existing GitHub PDF does not match approved source"
ops = json.loads(zlib.decompress(base64.b85decode(PATCH.read_text().strip())).decode())
pat = re.compile(rb"(?m)^(\d+) 0 obj\n")
xref = old.rfind(b"\nxref\n") + 1
assert xref > 0, "Missing cross-reference table"
result = bytearray()
at = 0
for match in pat.finditer(old):
    if match.start() > xref:
        break
    number = int(match.group(1))
    end = old.index(b"endobj\n", match.start()) + 7
    result += old[at:match.start()]
    obj = old[match.start():end]
    edit = ops.get(str(number))
    if edit:
        if edit["type"] == "r":
            obj = base64.b85decode(edit["b85"].encode())
        else:
            header, tail = obj.split(b"stream\n", 1)
            stream = tail.split(b"\nendstream", 1)[0]
            content = zlib.decompress(stream)
            for start, stop, inserted in reversed(edit["ops"]):
                content = content[:start] + base64.b85decode(inserted.encode()) + content[stop:]
            stream = zlib.compress(content, 1)
            header = re.sub(rb"/Length \d+", b"/Length " + str(len(stream)).encode(), header, count=1)
            obj = header + b"stream\n" + stream + b"\nendstream\nendobj\n"
    result += obj
    at = end
result += old[at:xref]
offsets = {int(m.group(1)): m.start() for m in pat.finditer(result)}
footer = old[xref:]
lines = footer.splitlines(keepends=True)
assert lines[0] == b"xref\n"
i = 1
while not lines[i].startswith(b"trailer\n"):
    section = re.fullmatch(rb"(\d+) (\d+)\n", lines[i])
    assert section, "Unexpected cross-reference layout"
    start, count = map(int, section.groups())
    i += 1
    for j in range(count):
        if lines[i+j].endswith(b" n \n") and start+j in offsets:
            lines[i+j] = f"{offsets[start+j]:010d} 00000 n \n".encode()
    i += count
footer = b"".join(lines)
new_id = b"c9e7610e1027bd89962d97d57eba71b8"
footer = re.sub(rb"(?<=/ID \[ <)[a-f0-9]{32}", new_id, footer)
footer = re.sub(rb"(?<=\n<)[a-f0-9]{32}(?=> \] >>)", new_id, footer)
footer = re.sub(rb"(startxref\n)\d+", lambda m: m.group(1) + str(len(result)).encode(), footer, count=1)
updated = bytes(result) + footer
assert len(updated) == 3923414
assert hashlib.sha256(updated).hexdigest() == NEW_SHA256, "Refusing to write non-identical PDF"
PDF.write_bytes(updated)
print("EXACT PDF replacement verified:", NEW_SHA256)
