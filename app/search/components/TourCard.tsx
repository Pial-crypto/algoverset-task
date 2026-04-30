'use client';

import { Tour } from '../types/index';
import { Star, Languages, Users, CalendarDays, CircleCheck } from 'lucide-react';

interface TourCardProps {
  tour: Tour;
  viewMode?: 'grid' | 'list';
  pricePerDay?: boolean;
}

export const TourCard = ({ tour, viewMode = 'grid', pricePerDay = false }: TourCardProps) => {
  const displayPrice = pricePerDay ? Math.max(1, Math.round(tour.price / tour.duration)) : tour.price;
  const priceLabel = pricePerDay ? '/ day' : 'pp';
  const imageClass = viewMode === 'grid' ? 'h-[210px] w-full rounded-xl object-cover' : 'h-[210px] w-full rounded-xl object-cover md:w-[280px]';
  const wrapperClass = viewMode === 'grid' ? 'flex flex-col gap-4' : 'flex flex-col gap-4 md:flex-row';

  return (
    <div className="relative rounded-2xl border border-[#d7dceb] bg-white p-3 shadow-sm">
      {tour.discount && (
        <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
          {tour.discount}% off
        </span>
      )}
      <div className={wrapperClass}>
        <img src={tour.image} alt={tour.title} className={imageClass} />

        <div className="flex flex-1 justify-between gap-4">
          <div className="space-y-2">
            <h3 className="max-w-[520px] text-[38px] leading-tight font-semibold text-[#1f2937]">
              {tour.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-[#475569]">
              <span className="text-[28px] font-bold text-[#0f172a]">{tour.rating}</span>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{tour.location}</span>
            </div>

            <p className="max-w-[600px] text-[15px] leading-6 text-[#334155]">{tour.description}</p>

            <div className="grid grid-cols-3 gap-2 text-sm text-[#334155]">
              <span className="flex items-center gap-2"><Languages className="h-4 w-4" />{tour.language[0]}</span>
              <span className="flex items-center gap-2"><Users className="h-4 w-4" />{tour.ageGroup}</span>
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{tour.duration} Days</span>
            </div>

            <div className="space-y-1 text-sm text-[#1f2937]">
              <p className="flex items-center gap-2"><CircleCheck className="h-4 w-4" />Free Booking & Cancellation</p>
              <p className="flex items-center gap-2"><CircleCheck className="h-4 w-4" />See booking price options for Premium Inclusion</p>
            </div>
          </div>

          <div className="flex min-w-[150px] flex-col items-end justify-between">
            <div className="text-right">
              {tour.originalPrice && <p className="text-xs text-[#94a3b8]">Starts from ${tour.originalPrice}</p>}
              <p className="text-sm text-[#334155]">USD <span className="text-[42px] font-bold text-[#0f3da5]">${displayPrice}</span> {priceLabel}</p>
            </div>
            <div className="space-y-2">
              <button type="button" className="w-full rounded-full border border-[#7c92c4] px-4 py-2 text-sm font-semibold text-[#0f3da5]">View Tour</button>
              <button type="button" className="w-full rounded-full border border-[#7c92c4] px-4 py-2 text-sm font-semibold text-[#0f3da5]">Easy Quote</button>
              <button type="button" className="w-full rounded-full bg-[#0d56d8] px-4 py-2 text-sm font-semibold text-white">Book Tour</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
