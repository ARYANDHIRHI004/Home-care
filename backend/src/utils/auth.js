import { betterAuth } from "better-auth";
import { phoneNumber } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { env } from "./env.js";
import { sendEmail } from "./mailer.js";
import { buildWelcomeEmailHtml } from "../emails/welcomeEmail.js";
import Customer from "../models/customer.model.js";

// Must match frontend/src/lib/auth.js's syntheticEmailForPhone() — phone
// signups get a non-deliverable placeholder email under the hood (Better
// Auth's email/password flow needs *an* email even though the customer never
// sees or chooses it), so this is what "no real email on file" looks like
// for a phone-only signup.
const SYNTHETIC_EMAIL_SUFFIX = "@phone.homecare247.internal";

const client = new MongoClient(env.MONGO_URI);
export const db = client.db();

export const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: ["http://localhost:3000"],
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
    },
    plugins: [
        // Adds `phoneNumber` (unique) + `phoneNumberVerified` to the user schema
        // and a POST /sign-in/phone-number endpoint that checks phoneNumber +
        // password — no OTP involved. `requireVerification: false` (the
        // default) means signInPhoneNumber works the moment an account has a
        // phoneNumber + password set, i.e. right after signUpEmail with a
        // phoneNumber field in the body.
        //
        // sendOTP is a required option for this plugin to construct at all,
        // but nothing in this app's frontend calls send-otp/verify — it's
        // intentionally left unreachable rather than silently no-op'd, so an
        // accidental future call fails loudly instead of pretending to work.
        phoneNumber({
            sendOTP: async () => {
                throw new Error("OTP sign-in is not supported — use phone number + password.");
            },
            requireVerification: false,
        }),
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "customer",
                required: false,
            },
            // Customer-only profile fields, collected post-login by the
            // onboarding modal (CompleteProfileModal). There is only one
            // Better Auth instance in this app — shared by both the office
            // admin login and the customer login, distinguished by `role` —
            // so these live here rather than on a second instance. Nothing
            // on the admin side reads or writes them.
            address: {
                type: "json",
                required: false,
                defaultValue: null,
                input: false, // set only via PATCH /api/auth/customer/profile, never on signup
            },
            heardFrom: {
                type: "string",
                required: false,
                defaultValue: null,
                input: false,
            },
            // Presence (not the individual fields above) is what the frontend
            // checks to decide whether to show the onboarding prompt — null
            // until both address and heardFrom have been saved together.
            profileCompletedAt: {
                type: "date",
                required: false,
                defaultValue: null,
                input: false,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                // Fires for both signup paths this app has — phone/password
                // (signUpEmail with a phoneNumber field) and Google OAuth —
                // since both ultimately create a `user` row. Never blocks
                // registration: this only fires *after* the user already
                // exists, and any failure here is caught and logged, not thrown.
                after: async (user) => {
                    // Website signups (phone/password or Google) only ever create a
                    // Better Auth `user` row — but every other part of this app
                    // (enquiries, bookings, estimates, invoices, payments, and the
                    // office ERP's Customers page) reads/writes the separate
                    // mongoose `Customer` collection, keyed by phone (or, now,
                    // email). Without this, a website signup is invisible to
                    // office staff until that customer happens to submit an
                    // enquiry (which lazily creates a Customer as a side effect).
                    // This hook is what makes the two paths converge on one
                    // record instead of staying split.
                    const realEmail = user.email && !user.email.endsWith(SYNTHETIC_EMAIL_SUFFIX)
                        ? user.email
                        : undefined;

                    try {
                        // Google OAuth accounts don't collect a phone number at
                        // signup (see login/page.js) — previously this whole
                        // block was skipped for them (`if (user.phoneNumber)`),
                        // which is exactly why Google customers never reached
                        // the admin panel. Key on whichever identifier the
                        // account actually has; a phone-and-password signup
                        // always has a phone, a Google signup always has a real
                        // email, so one of these two branches applies to every
                        // account this app can create.
                        const keyFilter = user.phoneNumber
                            ? { phone: user.phoneNumber }
                            : realEmail
                                ? { email: realEmail }
                                : null;

                        if (keyFilter) {
                            // $setOnInsert only — if an admin already created this
                            // phone/email via a call-in, that record wins; the
                            // website signup just attaches to it rather than
                            // overwriting it.
                            await Customer.findOneAndUpdate(
                                keyFilter,
                                {
                                    $setOnInsert: {
                                        name: user.name || "Customer",
                                        ...(user.phoneNumber ? { phone: user.phoneNumber } : {}),
                                        email: realEmail,
                                        avatarUrl: user.image || null,
                                        otpVerified: !!user.phoneNumberVerified,
                                        registrationChannel: "website",
                                    },
                                },
                                { upsert: true }
                            );
                        }
                    } catch (error) {
                        console.error(`Customer upsert failed for user ${user.id}:`, error.message);
                    }

                    if (!user.email || user.email.endsWith(SYNTHETIC_EMAIL_SUFFIX)) {
                        // Phone-only signup with no real email on file — valid
                        // and expected, not an error. Nothing to send.
                        return;
                    }
                    try {
                        const html = buildWelcomeEmailHtml({
                            name: user.name,
                            dashboardUrl: `${env.CUSTOMER_APP_URL}/customer/dashboard`,
                        });
                        await sendEmail({
                            to: user.email,
                            subject: "Welcome to HomeCare247",
                            html,
                        });
                    } catch (error) {
                        console.error(`Welcome email failed for user ${user.id}:`, error.message);
                    }
                },
            },
        },
    },
});
