
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FooterCTA: React.FC = () => {
  return (
    <div className="glass-panel py-4 px-6 mt-8 flex items-center justify-between">
      <div className="text-sm text-gray-400">© 2025 Population Dynamics System</div>
      
      <div className="flex space-x-6">
        <button className="text-sm text-gray-400 hover:text-white transition-colors">Help</button>
        <button className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</button>
        <button className="text-sm text-gray-400 hover:text-white transition-colors">Feedback</button>
      </div>
      
      <Link 
        to="/act" 
        className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:shadow-lg hover:shadow-teal-500/20 transform transition-all hover:-translate-y-0.5"
      >
        <span className="mr-2">Go to ACT Zone</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default FooterCTA;
