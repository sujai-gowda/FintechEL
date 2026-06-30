import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Clock, DollarSign } from 'lucide-react';

const JobsMarketplace = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/jobs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Show only open jobs for marketplace
          setJobs(data.filter(j => j.status === 'OPEN'));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Briefcase className="text-blue-500" />
            Jobs Marketplace
          </h1>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-slate-800 p-12 rounded-lg border border-slate-700 text-center text-slate-400">
            No open jobs available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <div key={job.jobId} className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors shadow-lg group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{job.title}</h3>
                  <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded font-medium">OPEN</span>
                </div>
                <p className="text-slate-400 text-sm mb-6 line-clamp-3">{job.description}</p>
                
                <div className="flex items-center justify-between border-t border-slate-700 pt-4 mt-auto">
                  <div className="flex items-center text-green-400 font-bold">
                    <DollarSign size={16} />
                    {job.budget.toLocaleString()} {job.currency}
                  </div>
                  <div className="flex items-center text-slate-400 text-xs gap-1">
                    <Clock size={14} />
                    {new Date(job.deadline).toLocaleDateString()}
                  </div>
                </div>
                
                <button className="w-full mt-6 bg-slate-700 hover:bg-blue-600 py-2 rounded text-sm font-medium transition-colors">
                  View & Accept
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsMarketplace;
