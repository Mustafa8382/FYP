import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn, MdKingBed, MdBathtub } from 'react-icons/md';
import { FaShareAlt } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    await navigator.clipboard.writeText(`${window.location.origin}/listing/${listing._id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2s
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] relative border dark:border-gray-700">
      {/* Share Button */}
      <div className="absolute top-2 right-2 z-20">
        <button
          onClick={handleCopy}
          className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          title="Copy Listing Link"
        >
          <FaShareAlt className="text-gray-600 dark:text-gray-300 w-4 h-4" />
        </button>
        {copied && (
          <span className="absolute top-full right-0 mt-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded shadow z-30">
            Copied!
          </span>
        )}
      </div>

      <Link to={`/listing/${listing._id}`}>
        {/* Image Section */}
        <div className="relative">
          <div className="absolute top-2 left-2 bg-white text-black dark:bg-gray-200 px-2 py-1 text-xs font-semibold rounded-md shadow-sm z-10">
            {listing.type}
          </div>

          <img
            src={
              listing.imageUrls[0] ||
              'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
            }
            alt="listing cover"
            className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col gap-5 w-full text-gray-700 dark:text-gray-100">
          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white relative w-fit">
            {listing.name}
          </h2>

          {/* Address */}
          <div className="flex items-center gap-2 text-xs font-medium bg-white/70 dark:bg-gray-700/60 backdrop-blur-md px-3 py-1 rounded-full w-fit shadow-inner border border-gray-200 dark:border-gray-600">
            <MdLocationOn className="text-green-600 w-4 h-4" />
            <span className="truncate">{listing.address}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed italic">
            {listing.description}
          </p>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-300 dark:border-gray-600"></div>

          {/* Price */}
          <div className="flex justify-between items-center">
            <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
              $
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && (
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {' '}
                  / month
                </span>
              )}
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex gap-4 text-sm mt-2">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-gray-700 px-3 py-1 rounded-full text-slate-700 dark:text-gray-200 shadow-sm hover:bg-slate-200 dark:hover:bg-gray-600 transition">
              <MdKingBed className="w-4 h-4" />
              <span className="text-xs font-medium">
                {listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 dark:bg-gray-700 px-3 py-1 rounded-full text-slate-700 dark:text-gray-200 shadow-sm hover:bg-slate-200 dark:hover:bg-gray-600 transition">
              <MdBathtub className="w-4 h-4" />
              <span className="text-xs font-medium">
                {listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
