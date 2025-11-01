"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Dictionary } from "@/app/[lang]/dictionaries";

interface SignUpFormProps {
  dict: Dictionary;
}

export default function SignUpForm({ dict }: SignUpFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [termsAgreement, setTermsAgreement] = useState(false);
  const [showEmailInfo, setShowEmailInfo] = useState(false);
  const [showFullNameInfo, setShowFullNameInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transPageData = dict["sign-up"];

  const validate = () => {
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!fullName || fullName.trim().length < 2) {
      setError("Please enter your full name");
      return false;
    }
    if (!termsAgreement) {
      setError("You must agree to the terms and conditions");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, jobTitle }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Registration failed");
        setLoading(false);
        return;
      }

      // success -> redirect to home
      // notify other tabs/components about auth state change
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
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 mt-6">
      <section className="email-authentication authentication-method lg:col-span-9">
        <form
          className="signup-form"
          id="new_reader"
          noValidate
          onSubmit={handleSubmit}
        >
          <fieldset className="inputs space-y-4">
            <div className="string input required stringish">
              <label htmlFor="reader_email" className="label block mb-1">
                {transPageData.Email}
                <abbr title="required" className="text-red-500">
                  *
                </abbr>
              </label>
              <input
                placeholder="your.email@address.com"
                id="reader_email"
                type="email"
                name="reader[email]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <div className="inline-hints mt-2">
                <div className="toggle">
                  {
                    transPageData[
                      "We will show your email domain name on the site."
                    ]
                  }
                  <input
                    id="why-the-email"
                    type="checkbox"
                    autoComplete="off"
                    checked={showEmailInfo}
                    onChange={() => setShowEmailInfo(!showEmailInfo)}
                    className="ml-2"
                  />
                  <label htmlFor="why-the-email" className="cursor-pointer">
                    <span className="show text-blue-600 underline">
                      {transPageData["Why?"]}
                    </span>
                  </label>
                  {showEmailInfo && (
                    <div className="toggle-content mt-2 p-3 bg-gray-50 rounded-md text-sm">
                      {transPageData["If you sign in with your email..."]}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="password input required stringish">
              <label htmlFor="reader_password" className="label block mb-1">
                {transPageData.Password}
                <abbr title="required" className="text-red-500">
                  *
                </abbr>
              </label>
              <input
                maxLength={72}
                id="reader_password"
                type="password"
                name="reader[password]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <p className="inline-hints text-sm text-gray-600 mt-1">
                Please enter eight characters or more.
              </p>
            </div>

            <div className="string input required stringish">
              <label htmlFor="reader_full_name" className="label block mb-1">
                {transPageData["Full name"]}
                <abbr title="required" className="text-red-500">
                  *
                </abbr>
              </label>
              <input
                placeholder="First and last name, no pseudonyms."
                id="reader_full_name"
                type="text"
                name="reader[full_name]"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <div className="inline-hints mt-2">
                <div className="toggle">
                  {transPageData["Your real name, please."]}
                  <input
                    id="why-the-full-name"
                    type="checkbox"
                    autoComplete="off"
                    checked={showFullNameInfo}
                    onChange={() => setShowFullNameInfo(!showFullNameInfo)}
                    className="ml-2"
                  />
                  <label htmlFor="why-the-full-name" className="cursor-pointer">
                    <span className="show text-blue-600 underline">
                      {transPageData["Why?"]}
                    </span>
                  </label>
                  {showFullNameInfo && (
                    <div className="toggle-content mt-2 p-3 bg-gray-50 rounded-md text-sm">
                      {
                        transPageData[
                          "On The BD-Feature, user accounts must be..."
                        ]
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="string input optional stringish">
              <label htmlFor="reader_job_title" className="label block mb-1">
                {transPageData["Job title"]}
              </label>
              <input
                placeholder="e.g. Project Manager"
                maxLength={255}
                id="reader_job_title"
                type="text"
                name="reader[job_title]"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="boolean input required">
              <label
                htmlFor="reader_terms_agreement"
                className="flex items-start"
              >
                <input
                  type="checkbox"
                  name="reader[terms_agreement]"
                  id="reader_terms_agreement"
                  value="1"
                  checked={termsAgreement}
                  onChange={(e) => setTermsAgreement(e.target.checked)}
                  className="mt-1 mr-2"
                  required
                />
                <span>
                  {
                    transPageData[
                      "By checking this box, I agree to The Conversation's"
                    ]
                  }
                  <Link
                    href="/global/terms-and-conditions"
                    className="text-blue-600 underline"
                  >
                    {transPageData["Terms and Conditions"]}
                  </Link>{" "}
                  {transPageData.and}
                  <Link
                    href="/global/privacy-policy"
                    className="text-blue-600 underline"
                  >
                    {transPageData["Privacy Policy"]}
                  </Link>
                  .
                  <abbr title="required" className="text-red-500">
                    *
                  </abbr>
                </span>
              </label>
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
                className="sign-up-button w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                disabled={!termsAgreement || loading}
              >
                {loading ? "Signing up..." : transPageData["Agree & sign up"]}
              </button>
            </fieldset>
          </div>
          {error && <p className="text-red-600 mt-3">{error}</p>}
        </form>
      </section>
    </div>
  );
}
