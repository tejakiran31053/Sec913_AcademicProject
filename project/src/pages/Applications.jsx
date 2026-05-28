import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './applications.css';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/applications")
      .then(res => res.json())
      .then(data => {
        setApplications(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setApplications([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="page-spinner" />
        <p className="loading-text">Loading applications…</p>
      </div>
    );
  }

  return (
    <div className="apps-page">
      <div className="apps-header">
        <div className="section-tag">My Applications</div>
        <h1 className="apps-title">Application Tracker</h1>
        <p className="apps-subtitle">
          Track the status of all your submitted applications
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="apps-empty">
          <div className="apps-empty-icon">📋</div>
          <h3>No Applications Yet</h3>
          <p>You haven't applied for any jobs yet.</p>
          <Link to="/jobs" className="btn-primary">
            🔍 Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="apps-list">
          {applications.map((app, index) => (
            <div key={app.id || index} className="app-card">
              <div className="app-card-left">
                <div className="app-company-logo">
                  {app.job?.company
                    ? app.job.company.slice(0, 2).toUpperCase()
                    : 'JP'}
                </div>

                <div className="app-card-info">
                  <div className="app-job-title">
                    {app.job?.title || `Job ID: ${app.job?.id}`}
                  </div>

                  <div className="app-company">
                    {app.job?.company || 'Company'}
                  </div>

                  <div className="app-meta-row">
                    <span className="app-meta-item">
                      📍 {app.job?.location || 'Location'}
                    </span>
                    <span className="app-meta-item">
                      💰 {app.job?.salary || 'Salary'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="app-card-right">
                <span className="badge badge-amber">
                  🔍 {app.status || 'Applied'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;