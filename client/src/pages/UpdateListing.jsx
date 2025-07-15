import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import Footer from '../components/Footer.jsx';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/Api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve);
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({ ...formData, type: e.target.id });
    } else if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1)
      return setError('You must upload at least one image');
    if (+formData.regularPrice < +formData.discountPrice)
      return setError('Discount price must be lower than regular price');

    try {
      setLoading(true);
      setError(false);
      const res = await fetch(`/Api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) return setError(data.message);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <main className="p-3 max-w-4xl mx-auto mb-24">
        <h1 className="text-3xl font-semibold text-center my-7 dark:text-white">
          Update a Listing
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          {/* Left Form */}
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              id="name"
              placeholder="Name"
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.name}
              className="border p-3 rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <textarea
              id="description"
              placeholder="Description"
              required
              onChange={handleChange}
              value={formData.description}
              className="border p-3 rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <input
              type="text"
              id="address"
              placeholder="Address"
              required
              onChange={handleChange}
              value={formData.address}
              className="border p-3 rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            {/* Checkboxes */}
            <div className="flex gap-6 flex-wrap">
              {['sale', 'rent', 'parking', 'furnished', 'offer'].map((field) => (
                <div key={field} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    id={field}
                    className="w-5 h-5"
                    onChange={handleChange}
                    checked={
                      field === 'sale' || field === 'rent'
                        ? formData.type === field
                        : formData[field]
                    }
                  />
                  <span className="capitalize">{field === 'sale' ? 'Sell' : field}</span>
                </div>
              ))}
            </div>

            {/* Bed/Bath/Price */}
            <div className="flex flex-wrap gap-6">
              {[
                { id: 'bedrooms', label: 'Beds' },
                { id: 'bathrooms', label: 'Baths' },
                { id: 'regularPrice', label: 'Regular Price', sub: '(Rs)' },
              ].map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="number"
                    id={item.id}
                    min="0"
                    max="10000000"
                    required
                    onChange={handleChange}
                    value={formData[item.id]}
                    className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                  />
                  <div className="flex flex-col">
                    <p>{item.label}</p>
                    {item.sub && <span className="text-xs">{item.sub}</span>}
                  </div>
                </div>
              ))}

              {formData.offer && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="10000000"
                    required
                    onChange={handleChange}
                    value={formData.discountPrice}
                    className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                  />
                  <div className="flex flex-col">
                    <p>Discount Price</p>
                    {formData.type === 'rent' && (
                      <span className="text-xs">(Rs/month)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Form */}
          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-600 dark:text-gray-400 ml-2">
                First image is cover (max 6)
              </span>
            </p>
            <div className="flex gap-4">
              <input
                onChange={(e) => setFiles(e.target.files)}
                type="file"
                id="images"
                accept="image/*"
                multiple
                className="p-3 border border-gray-300 dark:border-gray-700 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={handleImageSubmit}
                disabled={uploading}
                className="p-3 text-green-700 dark:text-green-400 border border-green-700 dark:border-green-400 rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>

            {imageUploadError && (
              <p className="text-red-700 dark:text-red-500 text-sm">
                {imageUploadError}
              </p>
            )}

            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3 border border-gray-300 dark:border-gray-700 items-center"
                >
                  <img
                    src={url}
                    alt="listing"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-2 text-red-700 dark:text-red-400 uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}

            <button
              disabled={loading || uploading}
              className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? 'Updating...' : 'Update Listing'}
            </button>
            {error && (
              <p className="text-red-700 dark:text-red-500 text-sm">{error}</p>
            )}
          </div>
        </form>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
