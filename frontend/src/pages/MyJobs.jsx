import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Clock, DollarSign, Edit, Trash2 } from 'lucide-react';

const MyJobs = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs/myjobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchMyJobs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Briefcase className="text-blue-500" />
            My Posted Jobs
          </h1>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-slate-800 p-12 rounded-lg border border-slate-700 text-center text-slate-400">
            You haven't posted any jobs yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <div key={job.jobId} className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors shadow-lg flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-100">{job.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    job.status === 'OPEN' ? 'bg-blue-900 text-blue-200' :
                    job.status === 'COMPLETED' ? 'bg-green-900 text-green-200' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-6 flex-grow">{job.description}</p>
                
                <div className="flex items-center justify-between border-t border-slate-700 pt-4 mb-4">
                  <div className="flex items-center text-green-400 font-bold">
                    <DollarSign size={16} />
                    {job.budget.toLocaleString()} {job.currency}
                  </div>
                  <div className="flex items-center text-slate-400 text-xs gap-1">
                    <Clock size={14} />
                    {new Date(job.deadline).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-auto">
                  <button className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded flex items-center justify-center gap-2 transition-colors text-sm font-medium">
                    <Edit size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(job.jobId)}
                    className="flex-1 bg-red-900/50 hover:bg-red-800 text-red-200 py-2 rounded flex items-center justify-center gap-2 transition-colors text-sm font-medium border border-red-900"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
