// src/components/Complaint/UserComplaintsList.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Clock, CheckCircle, AlertCircle, Loader, AlertTriangle } from 'lucide-react';
import './UserComplaintsList.css';

function UserComplaintsList({ userId }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // Ref to track component mounting state
  const mountedRef = React.useRef(true);

  // Update mountedRef when component mounts/unmounts
  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadUserComplaints = async () => {
    try {
      if (mountedRef.current) {
        setLoading(true);
        setError(null);
      }
      
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (mountedRef.current) {
        setComplaints(data || []);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
        console.error('Error loading complaints:', err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      loadUserComplaints();
    }
    
    // Cleanup function to handle unmounting
    return () => {
      mountedRef.current = false;
    };
  }, [userId]);

  const getStatusConfig = (status) => {
    const configs = {
      resolved: { icon: CheckCircle, color: '#00ff88', label: 'Resolved' },
      rejected: { icon: null, color: '#ff4466', label: 'Rejected' },
      reviewed: { icon: AlertCircle, color: '#ffaa00', label: 'Reviewed' },
      pending: { icon: Clock, color: '#00d4ff', label: 'Pending' }
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      high: { emoji: '🔥', color: '#ff4466' },
      low: { emoji: '🌿', color: '#00ff88' },
      medium: { emoji: '⚡', color: '#ffaa00' }
    };
    return configs[priority] || configs.medium;
  };

  const handleDeleteComplaint = async (complaintId) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', complaintId)
        .eq('user_id', userId);

      if (error) throw error;
      
      if (mountedRef.current) {
        setComplaints(prev => prev.filter(c => c.id !== complaintId));
        setShowDeleteConfirm(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
        console.error('Error deleting complaint:', err);
      }
    }
  };

  const confirmDelete = (complaintId) => {
    setShowDeleteConfirm(complaintId);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="ucl-loading-container">
        <div className="ucl-loader-wrapper">
          <Loader size={48} />
        </div>
        <p>Loading complaints...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ucl-error-container">
        <AlertTriangle size={48} />
        <h3>Error Loading Complaints</h3>
        <p>{error}</p>
        <button onClick={() => {
          if (mountedRef.current) {
            loadUserComplaints();
          }
        }}>Try Again</button>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="ucl-empty-container">
        <div>📭</div>
        <h3>No Complaints Yet</h3>
        <p>You haven't submitted any complaints yet.</p>
      </div>
    );
  }

  return (
    <div className="ucl-container">
      {/* Header Stats */}
      <div className="ucl-header">
        <div className="ucl-stats">
          <div className="ucl-stat">Total: {complaints.length}</div>
          <div className="ucl-stat">Pending: {complaints.filter(c => c.status === 'pending').length}</div>
          <div className="ucl-stat">Resolved: {complaints.filter(c => c.status === 'resolved').length}</div>
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="ucl-grid">
        {complaints.map((complaint) => {
          const statusConfig = getStatusConfig(complaint.status);
          const priorityConfig = getPriorityConfig(complaint.priority);
          const StatusIcon = statusConfig.icon;
          const isExpanded = selectedComplaint === complaint.id;
          const hasLongDesc = complaint.description && complaint.description.length > 120;

          return (
            <div 
              key={complaint.id}
              className="ucl-card"
            >
              {/* Priority and Status Badges */}
              <div className="ucl-badges">
                <div className="ucl-priority-badge" style={{ background: priorityConfig.color }}>
                  <span>{priorityConfig.emoji}</span>
                  <span>{complaint.priority}</span>
                </div>
                <div className="ucl-status-badge">
                  {StatusIcon && <StatusIcon size={14} />}
                  {!StatusIcon && <span>&times;</span>}
                  <span>{statusConfig.label}</span>
                </div>
              </div>

              {/* Content */}
              <div className="ucl-content">
                <h3 className="ucl-title">{complaint.title}</h3>
                
                <div className="ucl-meta">
                  <span className="ucl-category">{complaint.category}</span>
                  <div className="ucl-date">
                    <Clock size={12} />
                    <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div 
                  className="ucl-desc-wrapper"
                  onClick={() => hasLongDesc && setSelectedComplaint(isExpanded ? null : complaint.id)}
                >
                  <p className={`ucl-desc ${isExpanded ? 'expanded' : 'collapsed'}`}>
                    {hasLongDesc && !isExpanded
                      ? complaint.description.substring(0, 120) + '...'
                      : complaint.description}
                  </p>
                </div>

                {complaint.image_url && (
                  <div className="ucl-image-container">
                    <img 
                      src={complaint.image_url} 
                      alt="Evidence" 
                      className="ucl-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = 'block';
                        }
                      }}
                      onLoad={(e) => {
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = 'none';
                        }
                      }}
                    />
                    <div className="ucl-image-fallback" style={{display: 'none'}}>
                      <div>Gambar tidak tersedia</div>
                    </div>
                  </div>
                )}

                {/* Expand/Collapse indicator */}
                {hasLongDesc && (
                  <button 
                    className="ucl-expand-btn" 
                    onClick={() => setSelectedComplaint(isExpanded ? null : complaint.id)}
                  >
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </button>
                )}

                {/* Actions */}
                <div className="ucl-actions">
                  {complaint.status !== 'resolved' && complaint.status !== 'rejected' ? (
                    <>
                      <button 
                        className="ucl-edit-btn"
                        onClick={() => console.log('Edit complaint:', complaint)}
                      >
                        Edit
                      </button>
                      
                      <button 
                        className="ucl-delete-btn"
                        onClick={() => confirmDelete(complaint.id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="ucl-action-disabled" disabled>
                        Edit
                      </button>
                      
                      <button className="ucl-action-disabled" disabled>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="ucl-modal-overlay" onClick={cancelDelete}>
          <div className="ucl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ucl-modal-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this complaint? This action cannot be undone.</p>
              <div className="ucl-modal-actions">
                <button className="ucl-btn-cancel" onClick={cancelDelete}>
                  Cancel
                </button>
                <button 
                  className="ucl-btn-delete" 
                  onClick={() => handleDeleteComplaint(showDeleteConfirm)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserComplaintsList;