import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const NeighborhoodStats = ({ stats }) => {
  if (!stats) return null;

  const getScoreColor = (score) => {
    if (score >= 8) return 'success';
    if (score >= 6) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    return 'Fair';
  };

  return (
    <div className="neighborhood-stats bg-gray-50 rounded-lg p-3 border border-gray-200">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Neighborhood Stats</h4>
      <div className="grid grid-cols-3 gap-3">
        {/* Schools Rating */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <ApperIcon name="GraduationCap" className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">{stats.schoolsRating}/10</div>
          <Badge variant={getScoreColor(stats.schoolsRating)} size="sm">
            Schools
          </Badge>
        </div>

        {/* Crime Score */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <ApperIcon name="Shield" className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">{stats.crimeScore}/10</div>
          <Badge variant={getScoreColor(stats.crimeScore)} size="sm">
            Safety
          </Badge>
        </div>

        {/* Walkability Score */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <ApperIcon name="MapPin" className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">{stats.walkabilityScore}/10</div>
          <Badge variant={getScoreColor(stats.walkabilityScore)} size="sm">
            Walk
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodStats;