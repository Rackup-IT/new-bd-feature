import Link from "next/link";

import SocialLogin from "@/components/SocialLogin";
import OrBorder from "@/features/auth/sign-up/component/or_border";
import SignUpForm from "@/features/auth/sign-up/component/sign_up_form";
import { getDictionary } from "../dictionaries";

import { Locales } from "@/middleware";

const SignUpPage = async ({
  params,
}: {
  params: Promise<{ lang: Locales }>;
}) => {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const transPageData = dict["sign-up"];

  return (
    <>
      <div id="outer" className="mt-12 wrapper mx-auto">
        <div className="wrapper max-w-6xl mx-auto px-4">
          <header className="flex flex-wrap">
            <div className="w-full mb-4 sm:w-9/12">
              <h1 className="text-xl font-bold font-sans-heading text-center sm:text-2xl sm:text-left">
                {transPageData["Join The BD-Feature"]}
              </h1>
            </div>
            <div className="w-full sm:w-3/12">
              <p className="text-center underline sm:float-right">
                <Link href={`/${lang}/sign-in`}>
                  {transPageData["Already have an account?"]}
                </Link>
              </p>
            </div>
          </header>

          <section className="tc-authentication tc-sign-up">
            <div className="sm:flex sm:flex-row-reverse">
              {/* Social Sign-up Options  */}
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 sm:mt-10">
                <aside className="social-authentication authentication-method lg:col-span-7 lg:order-2 sm:flex sm:flex-row-reverse">
                  <div>
                    <SocialLogin />
                  </div>

                  <OrBorder />
                </aside>
              </div>
              {/* Menual Signup Option  */}
              <SignUpForm dict={dict} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-16 gap-6 mt-8">
              <aside className="note-of-intent lg:col-span-16 p-4 bg-gray-50 rounded-md">
                <p className="text-sm">
                  {transPageData["We welcome debate..."]}
                  <Link
                    href="/community-standards"
                    className="text-blue-600 underline"
                  >
                    {transPageData["Read our community standards"]}
                  </Link>
                </p>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
