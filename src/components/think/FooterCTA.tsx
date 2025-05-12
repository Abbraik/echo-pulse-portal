
import React from 'react';

const FooterCTA: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-teal-500/20 to-blue-500/20 backdrop-blur-md border-t border-white/10 p-4 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-left mb-4 md:mb-0">
          <h3 className="text-lg font-semibold text-white">Ready to implement your insights?</h3>
          <p className="text-gray-300 text-sm">Move to the Act zone to create actionable plans.</p>
        </div>
        <button className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors shadow-lg">
          Go to Act Zone
        </button>
      </div>
    </div>
  );
};

export default FooterCTA;
