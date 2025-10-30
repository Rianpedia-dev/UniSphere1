// src/hooks/useComplaints.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { useImageUpload } from './useImageUpload';

export const useComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { uploadImage } = useImageUpload();

  // Load complaints for current user
  const loadComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading complaints:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all complaints (for admin)
  const loadAllComplaints = useCallback(async () => {
    setLoading(true);
    try {
      // Ambil semua komentar terlebih dahulu
      const { data: complaintsData, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ambil informasi profil untuk setiap komentar
      const complaintsWithProfiles = await Promise.all(
        complaintsData.map(async (complaint) => {
          if (complaint.user_id) {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('username, avatar_url, full_name')
                .eq('id', complaint.user_id)
                .single();

              if (profileError) {
                console.error('Error fetching profile for complaint:', profileError);
                return { ...complaint, user: null };
              }
              
              return { ...complaint, user: profileData };
            } catch (profileError) {
              console.error('Error in profile fetch for complaint:', profileError);
              return { ...complaint, user: null };
            }
          } else {
            return { ...complaint, user: null };
          }
        })
      );

      setComplaints(complaintsWithProfiles);
    } catch (err) {
      setError(err.message);
      console.error('Error loading all complaints:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new complaint
  const addComplaint = useCallback(async (complaintData) => {
    setLoading(true);
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (complaintData.imageFile) {
        try {
          // Upload to 'complaints-evidence' bucket with user ID as first folder and 'complaint-images' as subfolder
          imageUrl = await uploadImage(
            complaintData.imageFile,   // file
            `complaint-images`,        // folderPath
            complaintData.user_id,     // userId 
            'complaints-evidence'      // bucketName
          );
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          // Jika upload gagal karena bucket tidak ditemukan, kita tetap lanjutkan tanpa gambar
          // atau kita bisa throw error untuk memberitahu pengguna
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
      }

      const { data, error } = await supabase
        .from('complaints')
        .insert([{
          user_id: complaintData.user_id,
          title: complaintData.title,
          description: complaintData.description,
          image_url: imageUrl,
          category: complaintData.category || 'general',
          priority: complaintData.priority || 'medium'
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Add to local state
      setComplaints(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error adding complaint:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [uploadImage]);

  // Update complaint (for admin)
  const updateComplaint = useCallback(async (complaintId, updateData) => {
    try {
      const { data: updatedComplaint, error } = await supabase
        .from('complaints')
        .update(updateData)
        .eq('id', complaintId)
        .select('*')
        .single();

      if (error) throw error;

      // Ambil informasi profil untuk komentar yang diperbarui
      let complaintWithProfile = { ...updatedComplaint, user: null };
      
      if (updatedComplaint.user_id) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, avatar_url, full_name')
            .eq('id', updatedComplaint.user_id)
            .single();

          if (profileError) {
            console.error('Error fetching profile for updated complaint:', profileError);
          } else {
            complaintWithProfile = { ...updatedComplaint, user: profileData };
          }
        } catch (profileError) {
          console.error('Error in profile fetch for updated complaint:', profileError);
        }
      }

      // Update local state
      setComplaints(prev => 
        prev.map(complaint => 
          complaint.id === complaintId ? complaintWithProfile : complaint
        )
      );

      return complaintWithProfile;
    } catch (err) {
      setError(err.message);
      console.error('Error updating complaint:', err);
      throw err;
    }
  }, []);

  // Delete complaint
  const deleteComplaint = useCallback(async (complaintId) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', complaintId);

      if (error) throw error;

      // Remove from local state
      setComplaints(prev => prev.filter(complaint => complaint.id !== complaintId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting complaint:', err);
      throw err;
    }
  }, []);

  return {
    complaints,
    loading,
    error,
    loadComplaints,
    loadAllComplaints,
    addComplaint,
    updateComplaint,
    deleteComplaint
  };
};