import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { listingId } = useParams();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 1000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`/Api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, [listingId]);

  const handleImageUpload = async () => {
    if (files.length > 0 && formData.imageUrls.length + files.length <= 6) {
      setUploading(true);
      setImageUploadError('');
      try {
        const promises = [...files].map((file) => uploadImage(file));
        const urls = await Promise.all(promises);
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...urls],
        }));
      } catch (err) {
        setImageUploadError('Image upload failed. Max 2MB per file.');
      }
      setUploading(false);
    } else {
      setImageUploadError('You can upload a maximum of 6 images.');
    }
  };

  const uploadImage = (file) => {
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
    const newUrls = [...formData.imageUrls];
    newUrls.splice(index, 1);
    setFormData((prev) => ({ ...prev, imageUrls: newUrls }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (id === 'sale' || id === 'rent') {
      setFormData((prev) => ({ ...prev, type: id }));
    } else if (['parking', 'furnished', 'offer'].includes(id)) {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.imageUrls.length === 0) {
      setError('Please upload at least one image.');
      return;
    }

    if (+formData.discountPrice >= +formData.regularPrice) {
      setError('Discount price must be less than regular price.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/Api/listing/update/${listingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition duration-300">
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-8">Update Listing</h1>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
          {/* Left Form */}
          <div className="flex-1 flex flex-col gap-4">
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Listing Name"
              className="p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              required
            />
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              required
            />
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              required
            />

            {/* Options */}
            <div className="flex gap-4 flex-wrap">
              {['sale', 'rent', 'parking', 'furnished', 'offer'].map((option) => (
                <label key={option} className="flex items-center gap-2 capitalize">
                  <input
                    type="checkbox"
                    id={option}
                    onChange={handleChange}
                    checked={
                      option === 'sale' || option === 'rent'
                        ? formData.type === option
                        : formData[option]
                    }
                  />
                  {option === 'sale' ? 'Sell' : option}
                </label>
              ))}
            </div>

            {/* Price Fields */}
            <div className="flex gap-4 flex-wrap">
              <input
                type="number"
                id="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="Bedrooms"
                className="p-3 border rounded-lg w-full sm:w-1/3 dark:bg-gray-800 dark:border-gray-700"
                required
              />
              <input
                type="number"
                id="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="Bathrooms"
                className="p-3 border rounded-lg w-full sm:w-1/3 dark:bg-gray-800 dark:border-gray-700"
                required
              />
              <input
                type="number"
                id="regularPrice"
                value={formData.regularPrice}
                onChange={handleChange}
                placeholder="Regular Price (Rs)"
                className="p-3 border rounded-lg w-full sm:w-1/3 dark:bg-gray-800 dark:border-gray-700"
                required
              />
              {formData.offer && (
                <input
                  type="number"
                  id="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  placeholder="Discount Price (Rs)"
                  className="p-3 border rounded-lg w-full sm:w-1/2 dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              )}
            </div>
          </div>

          {/* Right Form */}
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
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"/>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50">
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
                    className="w-full h-24 sm:h-28 object-cover rounded-lg border border-gray-300 dark:border-gray-700"/>
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    type="button"
                    className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition">
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-50">
              {loading ? 'Updating...' : 'Update Listing'}
            </button>

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
