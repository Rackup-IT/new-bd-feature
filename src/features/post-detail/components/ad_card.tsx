// components/RepublishPanel.tsx
import Image from "next/image";
import React from "react";

interface AdCardProps {
  onRepublishClick?: () => void;
}

const AdCard: React.FC<AdCardProps> = ({ onRepublishClick }) => {
  return (
    <section data-id="16">
      <div className="hidden md:block print:hidden">
        <div className="mb-4 rounded bg-gray-50 px-4 pb-5 pt-4 text-gray-800">
          <div className="mb-3">
            <Image
              alt="CC BY ND"
              className="mb-4 w-24"
              height={200}
              width={200}
              src="https://cdn.theconversation.com/static/tc/javascripts/components/promos/RepublishPanel/cc.logo-bd8e0798760af41b1850018ef2db81fb.svg"
            />
            <div className="mb-2 font-sans-heading text-lg font-semibold leading-tight">
              We believe in the free flow of information
            </div>
          </div>
          <div className="mb-4 font-sans text-base font-normal leading-tight">
            Republish our articles for free, online or in print, under Creative
            Commons licence.
          </div>
          <button
            className="w-full cursor-pointer rounded border-none bg-gray-600 px-4 py-1.5 text-base font-bold text-white transition-colors duration-300 hover:bg-gray-800"
            onClick={onRepublishClick}
          >
            Republish this article
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdCard;
