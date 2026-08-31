
# Marketplace and Licensing

Marketplace integration follows a provider adapter pattern so purchasing, licensing, and entitlement decisions remain abstracted from any single commerce vendor.

## Adapter pattern

- `PaymentProvider` handles checkout creation and webhook parsing.
- `LicenseProvider` issues signed license keys and validates them into entitlements.
- The core runtime converts payment events into `Entitlement` records.

## Entitlement model

An entitlement links installation, module, purchase type, status, limits, and validity window. Modules never inspect raw payment data; they receive a normalized entitlement decision.

## License key design

- Human-friendly prefix identifying environment and module.
- Signed payload containing installation, module, purchase type, seats, issue time, and expiry.
- Revocation handled centrally by entitlement status rather than relying only on offline key validation.
