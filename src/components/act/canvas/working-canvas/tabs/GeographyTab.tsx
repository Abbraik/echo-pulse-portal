
import React from 'react';
import { MapPin } from 'lucide-react';
import { Bundle } from '../../../types/act-types';

interface GeographyTabProps {
  bundle: Bundle;
}

const GeographyTab: React.FC<GeographyTabProps> = ({ bundle }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-teal-300">Geographic Coverage</h3>
      {bundle.geography && bundle.geography.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {bundle.geography.map((location, index) => (
            <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10 text-center">
              <MapPin className="h-5 w-5 text-teal-400 mx-auto mb-2" />
              <span className="text-gray-300 text-sm">{location}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No geographic areas specified</p>
        </div>
      )}
    </div>
  );
};

export default GeographyTab;
