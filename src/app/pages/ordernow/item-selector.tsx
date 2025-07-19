'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cookieItems, cakecicleItems } from '@/components/features/menu/data/menu-items'; // Adjust path as needed

export default function ItemSelector({ onSelectionChange = () => {} }: any) {
  const allItems = [...cookieItems, ...cakecicleItems];
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});

  const toggleItem = (name: string) => {
    setSelectedItems(prev => {
      const updated = { ...prev };
      if (name in prev) {
        delete updated[name];
      } else {
        updated[name] = 1; // Default quantity
      }
      onSelectionChange(updated);
      return updated;
    });
  };

  const updateQuantity = (name: string, qty: number) => {
    const updated = { ...selectedItems, [name]: qty };
    setSelectedItems(updated);
    onSelectionChange(updated);
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {allItems.map((item) => (
        <div
            key={item.name}
            className="flex flex-col border border-amber-200 rounded-xl shadow-md bg-white p-4 h-full"
        >
            <div className="w-full aspect-square relative mb-4">
            <Image
                src={item.image}
                alt={item.name}
                fill
                className="rounded object-cover"
            />
            </div>
    
            <h4 className="text-lg font-bold text-amber-900 mb-1 truncate">{item.name}</h4>
    
            <p className="text-sm text-gray-700 mb-2 line-clamp-2">{item.description}</p>
    
            <p className="font-semibold text-amber-800 mb-3">Price: ${item.price.toFixed(2)}</p>
    
            <div className="mt-auto">
            <button
                className={`w-full text-sm px-3 py-2 rounded font-semibold transition ${
                selectedItems[item.name]
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-200 text-amber-900 hover:bg-amber-300'
                }`}
                onClick={() => toggleItem(item.name)}
            >
                {selectedItems[item.name] ? 'Remove' : 'Add to Order'}
            </button>
    
            {selectedItems[item.name] && (
                <input
                type="number"
                min={1}
                value={selectedItems[item.name]}
                onChange={(e) =>
                    updateQuantity(item.name, parseInt(e.target.value) || 1)
                }
                className="mt-3 w-full border border-amber-900 px-2 py-1 rounded text-center"
                />
            )}
            </div>
        </div>
        ))}
    </div>  
  );
}
