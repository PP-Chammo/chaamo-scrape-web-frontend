import type { SoldCard } from "@/App";
import React from "react";

interface SoldCardListProps {
  soldCards: SoldCard[];
}

const SoldCardList: React.FC<SoldCardListProps> = ({ soldCards }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {soldCards.map((card) => (
      <div
        key={card.link_url}
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300"
      >
        <div className="p-4">
          <p className="text-lg font-semibold">
            {card.currency}
            {card.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400">{card.sold_date}</p>
          <a
            href={card.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 text-sm mt-2 inline-block"
          >
            View on eBay &rarr;
          </a>
        </div>
      </div>
    ))}
  </div>
);

export default SoldCardList;
