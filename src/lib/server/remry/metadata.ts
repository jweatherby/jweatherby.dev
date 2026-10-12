// The metadata Remry licensing writes in Stripe, its only record (README: Remry Pro licensing).

/** On each invoice a key was issued for, and on its subscription (the latest one issued). */
export const LICENSE_ID = "remry_license_id";
/** The key's last valid day, `YYYY-MM-DD`: on the invoice, and the latest on the subscription. */
export const EXPIRES = "remry_expires";
/** On the subscription once its license is revoked: `<YYYY-MM-DD> <reason>`. */
export const REVOKED = "remry_revoked";
