import { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare, FaArrowLeft, FaShareAlt } from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);3
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/Api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="transition-colors duration-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 pt-10">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}

      {listing && !loading && !error && (
        <div>
          {/* Top Control Bar */}
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 mb-4">
            <div className="flex flex-row justify-between items-center gap-4">
              <Link
                to="/properties"
                className="group inline-flex items-center gap-2 px-3 sm:px-5 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white 
                rounded-full shadow transition-all duration-200 hover:shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                <FaArrowLeft className="text-slate-600 dark:text-slate-300 text-lg group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline group-hover:text-slate-900 dark:group-hover:text-white font-medium sm:font-semibold text-sm sm:text-base">
                  Back to Properties
                </span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="group inline-flex items-center gap-2 px-3 sm:px-5 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white
                  rounded-full shadow transition-all duration-200 hover:shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                  <FaShare className="text-slate-600 dark:text-slate-300 text-lg group-hover:-translate-y-0.5 transition-transform" />
                  <span className="hidden sm:inline font-medium sm:font-semibold text-sm sm:text-base">
                    Share
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Image Slider */}
          <Swiper navigation={{ nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' }} className="relative">
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div className="w-full max-w-6xl mx-auto px-3">
                  <div className="relative w-full h-[500px] rounded-2xl shadow-lg overflow-hidden group">
                    <div className="w-full h-full bg-center bg-cover transition-all duration-500" style={{ backgroundImage: `url(${url})` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    <div className="swiper-button-prev-custom absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-white p-2 rounded-full shadow transition">
                      <svg className="w-5 h-5" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </div>
                    <div className="swiper-button-next-custom absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-white p-2 rounded-full shadow transition">
                      <svg className="w-5 h-5" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Listing Details */}
          <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-3 my-7 gap-6">
            {/* Left */}
            <div className="flex-1 space-y-5">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold">{listing.name}</h1>
                <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <FaMapMarkerAlt className="text-green-700" /> {listing.address}
                </p>

                <div className="bg-blue-50 dark:bg-slate-800 rounded-2xl p-4 shadow-sm w-full space-y-2 transition-colors duration-300">
                  {listing.offer ? (
                    <>
                      <p className="text-3xl font-extrabold">
                        Rs {listing.discountPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && <span className="text-base font-medium text-slate-500"> /month</span>}
                      </p>
                      <p className="line-through text-gray-400 text-sm">Rs {listing.regularPrice.toLocaleString('en-US')}</p>
                      <p><span className="text-green-800 text-sm font-medium">Rs {(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-US')} OFF</span></p>
                    </>
                  ) : (
                    <p className="text-3xl font-extrabold">
                      Rs {listing.regularPrice.toLocaleString('en-US')}
                      {listing.type === 'rent' && <span className="text-base font-medium text-slate-500"> /month</span>}
                    </p>
                  )}
                  <p><span className="text-base font-semibold">{listing.type === 'rent' ? 'Available For Rent' : 'Available For Sale'}</span></p>
                </div>
              </div>

              {/* Amenities */}
              <ul className="flex flex-wrap gap-4 text-sm text-gray-800 dark:text-slate-200">
                {[{
                  icon: <FaBed className="text-indigo-500 text-xl mb-1" />,
                  label: listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`,
                }, {
                  icon: <FaBath className="text-pink-500 text-xl mb-1" />,
                  label: listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`,
                }, {
                  icon: <FaParking className="text-green-500 text-xl mb-1" />,
                  label: listing.parking ? 'Parking' : 'No parking',
                }, {
                  icon: <FaChair className="text-yellow-500 text-xl mb-1" />,
                  label: listing.furnished ? 'Furnished' : 'Unfurnished',
                }].map((item, i) => (
                  <li key={i} className="flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800 px-5 py-4 rounded-2xl border border-blue-100 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-slate-700 transition-all duration-200 w-28">
                    {item.icon}
                    <span className="text-center">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right */}
            <div className="flex-1 space-y-4 relative">
              <div className="absolute top-0 right-0">
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                  title="Share Listing">
                  <FaShareAlt className="text-slate-600 dark:text-slate-300 text-lg" />
                </button>
              </div>

              <div className="pt-14">
                <h2 className="text-xl font-semibold mb-1">Description</h2>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">{listing.description}</p>
              </div>

              {currentUser && listing.userRef !== currentUser._id && !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:bg-slate-900 px-4 py-3 w-full mt-4 transition-all duration-300">
                  Contact Landlord
                </button>
              )}

              {contact && <Contact listing={listing} />}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </main>
  );
}
