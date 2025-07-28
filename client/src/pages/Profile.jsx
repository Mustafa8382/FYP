import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import { supabase } from '../supabaseClient.js';
import defaultAvatar from '../assets/no-avatar.png';

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  // States
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListingsVisible, setShowListingsVisible] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);

  // ------------------ Upload File when selected ------------------
  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  // ------------------ File Upload Handler ------------------
  const handleFileUpload = async (file) => {
    setFileUploadError(false);
    setFilePerc(0);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `avatar/${currentUser._id}/${fileName}`;

    try {
      const upload = await supabase.storage
        .from('am-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (upload.error) {
        setFileUploadError(true);
        return;
      }

      // Fake animated progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFilePerc(progress);
        if (progress >= 100) clearInterval(interval);
      }, 80);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('am-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, avatar: urlData.publicUrl });
    } catch (err) {
      console.error('Upload error:', err.message);
      setFileUploadError(true);
    }
  };

  // ------------------ Handle Input Change ------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ------------------ Submit Profile Update ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/Api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // ------------------ DELETE USER ------------------
  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/Api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // ------------------ SIGN OUT ------------------
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/Api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // ------------------ REMOVE PROFILE IMAGE ------------------
  const handleRemoveProfileImage = async () => {
    const confirmRemove = window.confirm("Are you sure you want to remove your profile image?");
    if (!confirmRemove) return;

    try {
      const imageUrl = currentUser.avatar;
      const url = new URL(imageUrl);
      const path = decodeURIComponent(url.pathname.split('/storage/v1/object/public/am-images/')[1]);

      // Delete from Supabase
      const { error: supabaseError } = await supabase.storage
        .from('am-images')
        .remove([path]);

      if (supabaseError) {
        console.error('Error deleting from Supabase:', supabaseError.message);
        return;
      }

      // Remove from DB
      const res = await fetch(`/Api/user/remove-avatar/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (data.success === false) {
        console.error('DB error:', data.message);
        return;
      }

      // Update Redux and UI
      dispatch(updateUserSuccess(data));
      setFormData({ ...formData, avatar: '' });
    } catch (err) {
      console.error('Remove Image Error:', err.message);
    }
  };

  // ------------------ TOGGLE LISTINGS ------------------
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      if (!showListingsVisible) {
        const res = await fetch(`/Api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingsError(true);
          return;
        }
        setUserListings(data);
      }
      setShowListingsVisible((prev) => !prev);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  // ------------------ DELETE LISTING + SUPABASE FILES ------------------
  const handleListingDelete = async (listingId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    try {
      const listingToDelete = userListings.find(l => l._id === listingId);

      // Delete images from Supabase
      if (listingToDelete?.imageUrls?.length > 0) {
        const filesToRemove = listingToDelete.imageUrls.map((img) => {
          const url = new URL(img.publicUrl);
          const path = decodeURIComponent(url.pathname.split('/storage/v1/object/public/am-images/')[1]);
          return path;
        });

        await supabase.storage.from('am-images').remove(filesToRemove);
      }

      // Delete listing from DB
      const res = await fetch(`/Api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  // ------------------ JSX Starts ------------------
  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300">
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center my-5">Profile</h1>

        {/* ------------------ Profile Form ------------------ */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* File input (hidden) */}
          <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />

          {/* Profile Image */}
          <img
            onClick={() => fileRef.current.click()}
            src={
              formData.avatar || currentUser.avatar || defaultAvatar
            }
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
          />


          {/* Remove Image Button */}
          {(formData.avatar || currentUser.avatar) && (
            <button
              onClick={handleRemoveProfileImage}
              type="button"
              className="flex items-center gap-1 bg-red-100 text-red-600 text-sm px-4 py-1 rounded-md hover:bg-red-200 active:bg-red-300 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 dark:active:bg-red-700 transition duration-200 self-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Remove Image
            </button>
          )}

          {/* Uploading status */}
          <div className="self-center text-sm w-full text-center">
            {fileUploadError ? (
              <p className="text-red-500">Error uploading image</p>
            ) : filePerc > 0 && filePerc < 100 ? (
              <p className="text-blue-500">Uploading... {filePerc}%</p>
            ) : filePerc === 100 ? (
              <p className="text-green-500">Image successfully uploaded!</p>
            ) : null}
          </div>

          {/* Profile Fields */}
          <input
            type="text"
            placeholder="username"
            defaultValue={currentUser.username}
            id="username"
            className="border p-3 rounded-lg dark:border-gray-600 dark:bg-gray-800"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="email"
            defaultValue={currentUser.email}
            id="email"
            className="border p-3 rounded-lg dark:border-gray-600 dark:bg-gray-800"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            className="border p-3 rounded-lg dark:border-gray-600 dark:bg-gray-800"
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 dark:bg-slate-600"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>

          <Link
            className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 dark:bg-green-600"
            to="/create-listing"
          >
            Create Listing
          </Link>
        </form>

        {/* Account Actions */}
        <div className="flex justify-between mt-5">
          <span onClick={handleDeleteUser} className="text-red-700 dark:text-red-400 cursor-pointer">Delete account</span>
          <span onClick={handleSignOut} className="text-red-700 dark:text-red-400 cursor-pointer">Sign out</span>
        </div>

        {/* Feedback Messages */}
        <p className="text-red-700 dark:text-red-400 mt-5">{error || ''}</p>
        <p className="text-green-700 dark:text-green-400 mt-5">{updateSuccess ? 'User updated successfully!' : ''}</p>

        {/* Show Listings Button */}
        <button
          onClick={handleShowListings}
          className="text-green-700 dark:text-green-400 w-full flex items-center justify-center gap-2 mt-4"
        >
          {showListingsVisible ? (
            <>
              <span>Hide Listings</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M17.94 17.94A10.05 10.05 0 0112 19c-4.48 0-8.29-2.94-9.54-7 0-.69.1-1.36.27-2M6.38 6.38A9.985 9.985 0 0112 5c4.48 0 8.29 2.94 9.54 7-.26.82-.63 1.59-1.08 2.3M1 1l22 22" />
                <path d="M9.88 9.88a3 3 0 014.24 4.24" />
              </svg>
            </>
          ) : (
            <>
              <span>Show Listings</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </>
          )}
        </button>

        {showListingsError && <p className="text-red-700 dark:text-red-400 mt-5">Error showing listings</p>}

        {/* User Listings */}
        {showListingsVisible && userListings.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-center mt-6">Your Listings</h2>
            {userListings.map((listing) => (
              <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center dark:border-gray-700">
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]?.publicUrl || 'https://via.placeholder.com/150'}
                    alt="listing"
                    className="h-16 w-16 object-contain transition-transform duration-300 hover:scale-105"
                  />
                </Link>

                <Link className="flex-1 text-slate-700 dark:text-white font-semibold truncate ml-2" to={`/listing/${listing._id}`}>
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col items-center gap-1">
                  <button onClick={() => handleListingDelete(listing._id)} className="text-red-600 dark:text-red-400 uppercase">Delete</button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-600 dark:text-green-400 uppercase">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
