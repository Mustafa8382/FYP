import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import Footer from '../components/Footer.jsx';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
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

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.concat(urls),
          }));
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
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
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (id === 'sale' || id === 'rent') {
      setFormData({ ...formData, type: id });
    } else if (['parking', 'furnished', 'offer'].includes(id)) {
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: value });
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
      const res = await fetch('/Api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) return setError(data.message);
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <main className="p-3 max-w-4xl mx-auto mb-24">
        <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          {/* Left Section */}
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              id="name"
              placeholder="Name"
              maxLength="62"
              minLength="10"
              required
              value={formData.name}
              onChange={handleChange}
              className="border p-3 rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <textarea
              id="description"
              placeholder="Description"
              required
              value={formData.description}
              onChange={handleChange}
              className="border p-3 rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <input
              type="text"
              id="address"
              placeholder="Address"
              required
              value={formData.address}
              onChange={handleChange}
              className="border p-3 rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
            />

            {/* Checkboxes */}
            <div className="flex gap-6 flex-wrap">
              {['sale', 'rent', 'parking', 'furnished', 'offer'].map((field) => (
                <div key={field} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    id={field}
                    onChange={handleChange}
                    checked={
                      field === 'sale' || field === 'rent'
                        ? formData.type === field
                        : formData[field]
                    }
                    className="w-5 h-5"
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
                { id: 'regularPrice', label: 'Regular Price' },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center gap-2">
                  <input
                    type="number"
                    id={id}
                    min="0"
                    max="10000000"
                    required
                    value={formData[id]}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  />
                  <p>{label}</p>
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
                    value={formData.discountPrice}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  />
                  <div className="flex flex-col items-start">
                    <p>Discounted Price</p>
                    {formData.type === 'rent' && (
                      <span className="text-xs">($ / month)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-600 dark:text-gray-400 ml-2">
                First image will be the cover (max 6)
              </span>
            </p>
            <div className="flex gap-4">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="p-3 border border-gray-300 dark:border-gray-700 rounded w-full bg-white dark:bg-gray-800"
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
              <p className="text-red-700 dark:text-red-500 text-sm">{imageUploadError}</p>
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
                    className="p-3 text-red-700 dark:text-red-500 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}

            <button
              disabled={loading || uploading}
              className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
            {error && <p className="text-red-700 dark:text-red-500 text-sm">{error}</p>}
          </div>
        </form>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
