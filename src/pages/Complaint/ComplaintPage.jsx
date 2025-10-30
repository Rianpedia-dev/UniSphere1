// src/pages/Complaint/ComplaintPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../utils/supabase';
import UserComplaintsList from '../../components/Complaint/UserComplaintsList';
import { Plus, Upload, Loader, MessageCircle, User, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import './ComplaintPage.css';

function ComplaintPage() {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Ref to track component mounting state
  const mountedRef = React.useRef(true);
  
  // Ref untuk mengakses file input
  const fileInputRef = React.useRef(null);
  
  // State to force UserComplaintsList re-render
  const [userComplaintsListKey, setUserComplaintsListKey] = useState(0);

  // Update mountedRef when component mounts/unmounts
  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (!user) {
    return (
      <div className="cp-access-denied">
        <div className="cp-denied-content">
          <h2>Akses Ditolak</h2>
          <p>Silakan login untuk mengakses sistem pengaduan.</p>
        </div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLocalError('Harap unggah file gambar (JPEG, PNG, dll)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setLocalError('Ukuran file harus kurang dari 5MB');
      return;
    }
    
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComplaint.title.trim() || !newComplaint.description.trim()) {
      setLocalError('Judul dan deskripsi wajib diisi');
      return;
    }
    
    // Check if component is still mounted before setting state
    if (!mountedRef.current) return;
    
    setSubmitting(true);
    setLocalError('');
    
    try {
      const complaintData = {
        user_id: user.id,
        title: newComplaint.title,
        description: newComplaint.description,
        category: newComplaint.category,
        priority: newComplaint.priority
      };
      
      if (imageFile) {
        // Check if component is still mounted before setting state
        if (!mountedRef.current) return;
        
        setUploading(true);
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `${user.id}/complaint-evidence/${fileName}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('complaints-evidence')
          .upload(filePath, imageFile);
        
        if (uploadError) throw uploadError;
        
        // Use signed URL for private bucket access
        const { data: { signedUrl }, error: signedUrlError } = await supabase
          .storage
          .from('complaints-evidence')
          .createSignedUrl(filePath, 3600); // Valid for 1 hour
        
        if (signedUrlError) {
          // Fallback to public URL if signed URL creation fails
          const { data: { publicUrl } } = supabase
            .storage
            .from('complaints-evidence')
            .getPublicUrl(filePath);
          complaintData.image_url = publicUrl;
        } else {
          complaintData.image_url = signedUrl;
        }
      }
      
      const { error } = await supabase
        .from('complaints')
        .insert([complaintData]);
      
      if (error) throw error;
      
      // Check if component is still mounted before setting state
      if (!mountedRef.current) return;
      
      setShowSuccess(true);
      setSubmitting(false);
      setUploading(false);
      
      // Update the key for UserComplaintsList to force a re-render after successful submission
      // This will cause it to reload with fresh data
      setUserComplaintsListKey(prev => prev + 1);
      
    } catch (error) {
      // Check if component is still mounted before setting state
      if (mountedRef.current) {
        setLocalError(error.message || 'Gagal mengirim pengaduan');
        setSubmitting(false);
        setUploading(false);
      }
    }
  };

  const removeImage = () => {
    // Cek apakah komponen masih terpasang sebelum setState
    if (mountedRef.current) {
      setImageFile(null);
      setImagePreview(null);
    }
    // Gunakan ref atau state daripada manipulasi DOM langsung jika memungkinkan
    // atau setelah unmount pastikan tidak ada akses DOM
    // Di sini kita gunakan useRef yang sudah didefinisikan
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="cp-container">


      {/* Header */}
      <div className="cp-header">
        <div className="cp-header-content">
          <div className="cp-title-group">
            <MessageCircle size={32} />
            <div>
              <h1>Sistem Pengaduan</h1>
              <p>Ajukan pengaduan baru</p>
            </div>
          </div>
          
          <button 
            className={`cp-create-btn ${showCreateForm ? 'cp-btn-active' : ''}`}
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <div className="cp-btn-icon">
              <Plus size={18} className={!showCreateForm ? '' : 'cp-hidden'} />
              <span className={showCreateForm ? '' : 'cp-hidden'} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                &times;
              </span>
            </div>
            <span className="cp-btn-text">{!showCreateForm ? 'Pengaduan Baru' : 'Batal'}</span>
          </button>
        </div>
      </div>

      {/* Complaint Form */}
      {showCreateForm && !showSuccess && (
        <div className="cp-form-container">
          <div className="cp-form-header">
            <h3>Ajukan Keluhan Baru</h3>
            <p>Jelaskan masalah yang Anda alami</p>
          </div>
          
          {localError && (
            <div className="cp-error-alert">
              <AlertCircle size={18} />
              <span>{localError}</span>
              <button onClick={() => setLocalError('')} className="cp-error-close">
                &times;
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="cp-form">
            <div className="cp-form-grid">
              <div className="cp-form-group">
                <label>Judul *</label>
                <input
                  type="text"
                  placeholder="Deskripsikan masalah secara singkat..."
                  value={newComplaint.title}
                  onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                  className="cp-input"
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="cp-form-group">
                <label>Kategori</label>
                <select
                  value={newComplaint.category}
                  onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                  className="cp-select"
                  disabled={submitting}
                >
                  <option value="general">Umum</option>
                  <option value="technical">Masalah Teknis</option>
                  <option value="academic">Akademik</option>
                  <option value="facility">Fasilitas</option>
                  <option value="safety">Keamanan</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div className="cp-form-group">
                <label>Prioritas</label>
                <select
                  value={newComplaint.priority}
                  onChange={(e) => setNewComplaint({...newComplaint, priority: e.target.value})}
                  className="cp-select"
                  disabled={submitting}
                >
                  <option value="low">Rendah</option>
                  <option value="medium">Sedang</option>
                  <option value="high">Tinggi</option>
                </select>
              </div>

              <div className="cp-form-group cp-full-width">
                <label>Deskripsi *</label>
                <textarea
                  placeholder="Jelaskan secara detail tentang keluhan Anda..."
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                  className="cp-textarea"
                  rows="4"
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="cp-form-group cp-full-width">
                <label>Gambar (Opsional)</label>
                <div className="cp-upload-area">
                  <input
                    type="file"
                    id="cp-image-upload"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cp-upload-input"
                    disabled={submitting || uploading}
                  />
                  {uploading ? (
                    <div className="cp-upload-label">
                      <div className="cp-upload-content">
                        <Upload size={24} />
                        <Loader className="cp-spin" size={20} />
                      </div>
                      <span>
                        Mengunggah {imageFile ? imageFile.name : 'gambar...'}
                      </span>
                      <small>Harap tunggu...</small>
                    </div>
                  ) : (
                    <label htmlFor="cp-image-upload" className="cp-upload-label">
                      <div className="cp-upload-content">
                        <Upload size={24} />
                      </div>
                      <span>
                        {imageFile ? imageFile.name : 'Klik atau seret gambar ke sini'}
                      </span>
                      <small>Maks. 5MB • JPG, PNG, GIF</small>
                    </label>
                  )}
                  
                  {imagePreview && (
                    <div className="cp-preview">
                      <img src={imagePreview} alt="Pratinjau" className="cp-preview-img" />
                      <button
                        type="button"
                        className="cp-preview-remove"
                        onClick={removeImage}
                        disabled={submitting}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="cp-form-actions">
              {!submitting ? (
                <button 
                  type="submit" 
                  className="cp-submit-btn"
                  disabled={submitting || uploading}
                >
                  <div className="cp-button-content">
                    <Send size={18} />
                    {'Kirim Pengaduan'}
                  </div>
                </button>
              ) : (
                <button 
                  type="button"
                  className="cp-submit-btn cp-submitting"
                  disabled
                >
                  <div className="cp-button-content">
                    <Loader className="cp-spin" size={18} />
                    {'Mengirim...'}
                  </div>
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      
      {/* Success Message */}
      {showSuccess && (
        <div className="cp-form-container cp-success-container">
          <div className="cp-success-content">
            <CheckCircle size={60} className="cp-success-icon" />
            <h3>Pengaduan Terkirim! 🎉</h3>
            <p>Kami akan segera meninjau pengaduan Anda</p>
            <button 
              className="cp-success-btn"
              onClick={() => {
                if (mountedRef.current) {
                  setShowSuccess(false);
                  setShowCreateForm(false);
                  // Reset form after showing success
                  setNewComplaint({ title: '', description: '', category: 'general', priority: 'medium' });
                  setImageFile(null);
                  setImagePreview(null);
                }
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      
      {/* Complaints List */}
      <div className="cp-list-section">
        <div className="cp-section-header">
          <div className="cp-section-title">
            <User size={20} />
            <h2>Pengaduan Saya</h2>
          </div>
          <div className="cp-section-badge">
            <Clock size={14} />
            <span>Aktivitas Terbaru</span>
          </div>
        </div>
        
        <UserComplaintsList key={`user-complaints-${userComplaintsListKey}`} userId={user.id} />
      </div>
    </div>
  );
}

export default ComplaintPage;