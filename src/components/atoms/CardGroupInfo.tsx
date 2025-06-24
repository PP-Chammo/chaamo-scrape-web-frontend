import type { SoldCard } from "@/App";
import React from "react";

interface CardGroupInfoProps {
  cardGroup: {
    image_url: string;
    title: string;
    sold_cards: SoldCard[];
  };
}

const CardGroupInfo: React.FC<CardGroupInfoProps> = ({ cardGroup }) => (
  <div className="bg-gray-800/50 rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
    <img
      src={cardGroup.image_url}
      alt={cardGroup.title}
      className="w-48 h-auto object-contain rounded-lg shadow-md"
    />
    <div>
      <h2 className="text-2xl font-bold">{cardGroup.title}</h2>
      <p className="text-gray-400 mt-1">
        {cardGroup.sold_cards.length} sales found for this card group.
      </p>
    </div>
  </div>
);

export default CardGroupInfo;
