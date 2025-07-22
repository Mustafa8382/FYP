import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Car, Sofa, Tag, ArrowDownUp } from 'lucide-react';
import ListingItem from '../components/ListingItem';
import Footer from '../components/Footer.jsx';
import { DarkModeContext } from '../context/DarkModeContext'; // ✅ import context

export default function Properties() {
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext); // ✅ consume context

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/Api/listing/get?${searchQuery}`);
      const data = await res.json();
      setShowMore(data.length > 8);
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (['all', 'rent', 'sale'].includes(id)) {
      setSidebardata({ ...sidebardata, type: id });
    } else if (id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: value });
    } else if (['parking', 'furnished', 'offer'].includes(id)) {
      setSidebardata({ ...sidebardata, [id]: checked });
    } else if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.entries(sidebardata).forEach(([key, val]) =>
      urlParams.set(key, val)
    );
    navigate(`/properties?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', listings.length);
    const res = await fetch(`/Api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    setShowMore(data.length >= 9);
    setListings([...listings, ...data]);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex flex-col md:flex-col bg-white dark:bg-[#111827] min-h-screen">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mt-20 px-4 leading-tight 
          tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent
          dark:from-white dark:via-blue-300 dark:to-indigo-400 transition-all duration-300">
          Find Your Perfect{' '}
          <span className="block sm:inline bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-indigo-300">
            Property
          </span>
        </h2>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl text-center mt-5 mx-auto">
          Discover a curated collection of premium properties
        </p>

        {/* Search Items Box Start */}
        <div className="flex justify-center px-4 mt-12">
          <div className="w-full max-w-5xl bg-white/80 dark:bg-[#1f2937]/70 border border-gray-200 dark:border-gray-700 backdrop-blur-lg p-6 sm:p-8 rounded-3xl 
            shadow-2xl dark:shadow-[0_4px_60px_rgba(0,0,0,0.6)] transition-all duration-500">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Search Bar */}
              <div className="w-full">
                <div className="relative w-full">
                  <input
                    type="text"
                    id="searchTerm"
                    placeholder="Search location or keyword"
                    aria-label="Search"
                    className="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white px-5 py-3 pr-12 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    value={sidebardata.searchTerm}
                    onChange={handleChange}
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-blue-600 transition"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Types / Amenities / Sort */}
              <div className="w-full flex flex-col gap-4 items-center md:flex-row md:flex-wrap md:justify-between xl:justify-around">
                {/* Types */}
                <div className="flex-1 flex flex-wrap gap-2 justify-center md:justify-center md:order-1 mb-2 md:mb-0">
                  {['all', 'rent', 'sale'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      id={type}
                      onClick={handleChange}
                      className={`px-4 py-2 rounded-full text-xs font-semibold border shadow-sm transition-all duration-300 flex items-center gap-1 ${
                        sidebardata.type === type
                          ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white border-blue-600 shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 hover:shadow-sm'
                      }`}
                    >
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Amenities */}
                <div className="flex-1 flex flex-wrap gap-2 justify-center md:justify-start md:order-2 mt-0">
                  {[
                    { id: 'parking', icon: <Car className="w-4 h-4" />, label: 'Parking' },
                    { id: 'furnished', icon: <Sofa className="w-4 h-4" />, label: 'Furnished' },
                    { id: 'offer', icon: <Tag className="w-4 h-4" />, label: 'Offer' },
                  ].map(({ id, icon, label }) => (
                    <label key={id}>
                      <input type="checkbox" id={id} onChange={handleChange} checked={sidebardata[id]} className="hidden" />
                      <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold border shadow-sm cursor-pointer transition-all duration-300 ${
                        sidebardata[id]
                          ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white border-purple-600 shadow-md'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-gray-700 hover:shadow-sm'
                      }`}>
                        {icon}
                        {label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex-1 w-full md:w-[260px] flex items-center justify-center md:justify-center xl:justify-end relative md:order-3 pt-2 md:pt-0">
                  <div className="relative w-full">
                    <ArrowDownUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-300 pointer-events-none" />
                    <select
                      id="sort_order"
                      onChange={handleChange}
                      defaultValue="created_at_desc"
                      className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-400 shadow-inner bg-white dark:bg-gray-800 text-black dark:text-white appearance-none transition-all"
                    >
                      <option value="regularPrice_desc">Price: High → Low</option>
                      <option value="regularPrice_asc">Price: Low → High</option>
                      <option value="createdAt_desc">Newest First</option>
                      <option value="createdAt_asc">Oldest First</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center px-3 w-full">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2.5 px-6 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  <Search className="w-4 h-4" />
                  Search Properties
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Listings */}
        <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-12">
          <div className="w-full max-w-7xl">
            {!loading && listings.length === 0 && (
              <p className="text-xl text-slate-700 dark:text-gray-300 text-center py-10">
                No listing found!
              </p>
            )}

            {loading && (
              <p className="text-xl text-slate-700 dark:text-gray-300 text-center py-10">
                Loading...
              </p>
            )}

            {/* Responsive Grid for Listings */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                {listings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>
            )}

            {showMore && (
              <div className="w-full flex justify-center mt-8">
                <button
                  onClick={onShowMoreClick}
                  className="text-green-700 dark:text-green-400 hover:underline text-lg font-medium"
                >
                  Show more
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
