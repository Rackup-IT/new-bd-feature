"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SocialItemProps {
  provider: {
    name: string;
    icon: string;
    action: string;
  };
}

const SocialItem: React.FC<SocialItemProps> = ({ provider }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    // For now simulate social auth by asking for email and name (to be replaced with real OAuth)
    const email = window.prompt(`Enter email for ${provider.name}`);
    const name = window.prompt(`Enter display name for ${provider.name}`);
    if (!email || !name) return;
    setLoading(true);
    try {
      const res = await fetch(provider.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: provider.name, email, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Social login failed");
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
    <div className="mb-3">
      <button
        onClick={handleClick}
        className="provider w-full flex items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        disabled={loading}
      >
        <Image
          alt={provider.name}
          src={provider.icon}
          height={50}
          width={50}
          priority
          className="w-6 h-6 mr-2"
        />
        <span className="button-text">
          {loading
            ? `Processing ${provider.name}...`
            : `Sign up with ${provider.name}`}
        </span>
      </button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default SocialItem;
