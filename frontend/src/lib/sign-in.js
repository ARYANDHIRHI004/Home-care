import { authClient } from "@/lib/auth.js"; //import the auth client

export async function loginWithGoogle(callbackURL = "http://localhost:3000/customer/dashboard") {
  await authClient.signIn.social({
    provider: "google",
    callbackURL,
  });
}