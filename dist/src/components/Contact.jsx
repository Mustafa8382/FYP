import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/Api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log('Failed to fetch landlord:', error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  // Encode URI components to avoid issues in mailto link
  const encodedSubject = encodeURIComponent(`Regarding ${listing.name}`);
  const encodedBody = encodeURIComponent(message);

  return (
    <>
      {landlord ? (
        <div className="flex flex-col gap-4 border mt-6 p-4 rounded-xl bg-white dark:bg-slate-800 transition-all">
          <p className="text-sm text-slate-700 dark:text-slate-200">
            Contact <span className="font-semibold">{landlord.username}</span>{' '}
            about{' '}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>

          <textarea
            name="message"
            id="message"
            rows="3"
            value={message}
            onChange={onChange}
            placeholder="Write your message here..."
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <Link
            to={`mailto:${landlord.email}?subject=${encodedSubject}&body=${encodedBody}`}
            className="bg-blue-600 hover:bg-blue-700 text-white text-center px-6 py-3 rounded-lg font-semibold uppercase text-sm transition-all"
          >
            Send Message
          </Link>
        </div>
      ) : (
        <p className="text-sm text-red-500 mt-4">Unable to load landlord info.</p>
      )}
    </>
  );
}
