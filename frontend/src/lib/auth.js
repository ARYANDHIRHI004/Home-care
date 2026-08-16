import { createAuthClient } from "better-auth/react"
import { phoneNumberClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:8000",
    plugins: [phoneNumberClient()],
})

// Better Auth's phone-number plugin needs a unique *email* under the hood —
// customers never see or choose this, it's just the internal identifier
// signUp.email() requires. Deterministic from the phone number so a customer
// always maps back to the same account.
export function syntheticEmailForPhone(phone) {
    return `${phone}@phone.homecare247.internal`;
}