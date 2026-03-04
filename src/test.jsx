import React, { useState, useEffect } from 'react';
import { supabase } from './superbase.ts';
import './test.css';

function Test() {
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Set your admin email here
  const ADMIN_EMAIL = 'crowcorpo@gmail.com'; // CHANGE THIS TO YOUR EMAIL

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === ADMIN_EMAIL);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === ADMIN_EMAIL);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch the current image when component mounts
    fetchImage();
  }, []);

  const fetchImage = async () => {
    try {
      // Get the public image URL from storage
      const { data, error } = await supabase
        .storage
        .from('images')
        .list('', {
          limit: 1,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      if (data && data.length > 0) {
        const { data: urlData } = supabase
          .storage
          .from('images')
          .getPublicUrl(data[0].name);

        setImageUrl(urlData.publicUrl);
      }
    } catch (error) {
      console.error('Error fetching image:', error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      alert('Error signing in: ' + error.message);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      alert('Error signing out: ' + error.message);
    }
  };

  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      
      if (!file) {
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Delete old images first
      const { data: existingFiles } = await supabase
        .storage
        .from('images')
        .list('');

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map(f => f.name);
        await supabase
          .storage
          .from('images')
          .remove(filesToDelete);
      }

      // Upload new image
      const fileExt = file.name.split('.').pop();
      const fileName = `image-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('images')
        .getPublicUrl(fileName);

      setImageUrl(urlData.publicUrl);
      alert('Image uploaded successfully!');
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Image Upload System</h1>
        
        {!user ? (
          <div className="auth-section">
            <p>Sign in to view and manage images</p>
            <button onClick={signInWithGoogle} className="btn-google">
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        ) : (
          <div className="content-section">
            <p className="welcome-text">Welcome, {user.email}</p>
            {isAdmin && <span className="admin-badge">Admin</span>}
            <button onClick={signOut} className="btn-signout">
              Sign Out
            </button>
            
            <div className="image-container">
              {imageUrl ? (
                <img src={imageUrl} alt="Uploaded" className="uploaded-image" />
              ) : (
                <div className="image-placeholder">
                  No image uploaded yet
                </div>
              )}
            </div>

            {/* Only show upload button to admin */}
            {isAdmin && (
              <div className="upload-section">
                <label htmlFor="file-upload" className="btn-upload">
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Test;