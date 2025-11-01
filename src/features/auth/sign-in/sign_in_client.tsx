"use client";

import { Dictionary } from "@/app/[lang]/dictionaries";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInClient({ dict }: { dict: Dictionary }) {
  // lightweight client component for handling sign-in
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validate = () => {
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setError("Please enter your password");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Login failed");
        setLoading(false);
        return;
      }

      try {
        const bc = new BroadcastChannel("auth");
        bc.postMessage({ type: "user:login" });
        bc.close();
      } catch {
        /* ignore */
      }
      router.push("/");
    } catch (err) {
      setError((err as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[20] gap-6 mt-6">
      <section className="email-authentication authentication-method sm:col-span-20">
        <form className="signup-form" id="new_reader" onSubmit={handleSubmit}>
          <fieldset className="inputs space-y-4">
            <div className="string input required stringish">
              <label htmlFor="reader_email" className="label block mb-1">
                {dict["sign-up"].Email}
                <abbr title="required" className="text-red-500">
                  *
                </abbr>
              </label>
              <input
                placeholder="your.email@address.com"
                id="reader_email"
                type="email"
                name="reader[email]"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="password input required stringish">
              <label htmlFor="reader_password" className="label block mb-1">
                {dict["sign-up"].Password}
                <abbr title="required" className="text-red-500">
                  *
                </abbr>
              </label>
              <input
                maxLength={72}
                id="reader_password"
                type="password"
                name="reader[password]"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </fieldset>

          <input
            type="hidden"
            name="return_to"
            id="return_to"
            value="/sign_in"
            autoComplete="off"
          />

          <div className="tc-signup-terms-and-submit mt-6">
            <fieldset className="actions">
              <button
                type="submit"
                className="sign-up-button w-full bg-black text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                disabled={loading}
              >
                {loading ? "Signing in..." : dict["sign-up"]["Sign-In"]}
              </button>
            </fieldset>
          </div>
          {error && <p className="text-red-600 mt-3">{error}</p>}
        </form>
      </section>
    </div>
  );
}
