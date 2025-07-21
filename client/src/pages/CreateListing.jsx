import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

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

  const [imageUploadError, setImageUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = () => {
    if (files.length > 0 && (files.length + formData.imageUrls.length) <= 6) {
      setUploading(true);
      setImageUploadError('');
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
          setImageUploadError('Image upload failed. Max 5MB per image.');
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
  (error) => {
    console.error("Firebase upload error:", error);
    reject(error);
  },
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
      setError('');
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
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <main className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Create New Listing
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-10"
        >
          {/* Left Panel */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="font-medium block mb-1">Property Name</label>
              <input
                type="text"
                id="name"
                required
                maxLength="62"
                minLength="10"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Cozy 2 Bedroom Apartment"
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="font-medium block mb-1">Description</label>
              <textarea
                id="description"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the property in detail"
                className="w-full p-3 h-28 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="font-medium block mb-1">Address</label>
              <input
                type="text"
                id="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4">
              {['sale', 'rent', 'parking', 'furnished', 'offer'].map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    id={option}
                    checked={
                      option === 'sale' || option === 'rent'
                        ? formData.type === option
                        : formData[option]
                    }
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  {option === 'sale' ? 'Sell' : option}
                </label>
              ))}
            </div>

            {/* Numeric Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {[
                { id: 'bedrooms', label: 'Bedrooms' },
                { id: 'bathrooms', label: 'Bathrooms' },
                { id: 'regularPrice', label: 'Price ($)' },
              ].map(({ id, label }) => (
                <div key={id}>
                  <label className="font-medium block mb-1">{label}</label>
                  <input
                    type="number"
                    id={id}
                    value={formData[id]}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring"
                  />
                </div>
              ))}

              {formData.offer && (
                <div>
                  <label className="font-medium block mb-1">Discount Price</label>
                  <input
                    type="number"
                    id="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring"
                  />
                  {formData.type === 'rent' && (
                    <p className="text-xs mt-1 text-gray-500">($ / month)</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="font-medium block mb-2">
                Upload Images{' '}
                <span className="text-sm text-gray-500">(Max 6, first is cover)</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFiles(e.target.files)}
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                />
                <button
                  type="button"
                  onClick={handleImageSubmit}
                  disabled={uploading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              {imageUploadError && (
                <p className="text-red-600 text-sm mt-2">{imageUploadError}</p>
              )}
            </div>

            {/* Image Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.imageUrls.map((url, idx) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt="uploaded"
                    className="w-full h-24 sm:h-28 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                  />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    type="button"
                    className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              disabled={loading || uploading}
              className="w-full py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
