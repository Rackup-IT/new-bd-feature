"use client";
import { doSocialLogin } from "@/app/actions";
import React from "react";

const SocialLogin: React.FC = () => {
  return (
    <div className="space-y-4">
      <form action={doSocialLogin} className="">
        <button
          type="submit"
          name="action"
          value="google"
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          Continue with Google
        </button>
      </form>

      <form action={doSocialLogin} className="">
        <button
          type="submit"
          name="action"
          value="facebook"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Continue with Facebook
        </button>
      </form>

      <form action={doSocialLogin} className="">
        <button
          type="submit"
          name="action"
          value="twitter"
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
        >
          Continue with X (Twitter)
        </button>
      </form>

      <form action={doSocialLogin} className="">
        <button
          type="submit"
          name="action"
          value="linkedin"
          className="w-full bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800 transition"
        >
          Continue with LinkedIn
        </button>
      </form>
    </div>
  );
};

export default SocialLogin;
