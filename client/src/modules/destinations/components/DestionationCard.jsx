import React from "react";

export default function DestionationCard({ title, subtitle, price, image, badge }) {
    return (
        <div className="relative bg-base-100 rounded-lg shadow-md overflow-hidden">
            <div className="relative h-44 md:h-56 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                />
                {badge && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs bg-purple-600 text-white">
                        {badge}
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-base">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm text-gray-600">Precio</div>
                    <div className="text-sm text-purple-700 font-semibold">{price}</div>
                </div>
            </div>
        </div>
    );
}
