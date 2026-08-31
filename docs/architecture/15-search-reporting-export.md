
# Search, Reporting, and Export

## Permission-aware search

Search queries are filtered by installation, module activation, locale, and the caller's effective permissions before results are ranked.

## Pagination

- APIs use cursor-based pagination for large result sets.
- Stable ordering keys prevent duplicates during concurrent updates.
- Reports use chunked export jobs rather than synchronous edge responses.

## CSV injection prevention

- Prefix dangerous leading characters (`=`, `+`, `-`, `@`) with a single quote.
- Emit UTF-8 with BOM only when required by the consuming spreadsheet tool.
- Escape quotes and delimiters consistently.
- Audit who exported what, when, and under which permission.
