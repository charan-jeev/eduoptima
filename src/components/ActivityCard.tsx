import { Clock, Star, Award, ExternalLink } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Activity } from '../lib/firebase';

interface ActivityCardProps {
  activity: Activity;
  onSelect?: (activity: Activity) => void;
  showNetAcadLink?: boolean;
  status?: 'assigned' | 'in-progress' | 'completed' | null;
  score?: number;
}

export default function ActivityCard({
  activity,
  onSelect,
  showNetAcadLink = true,
  status = null,
  score
}: ActivityCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'netacad':
        return 'bg-blue-100 text-blue-800';
      case 'pka':
        return 'bg-purple-100 text-purple-800';
      case 'quiz':
        return 'bg-pink-100 text-pink-800';
      case 'lab':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-black transition-all hover:shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge className={getDifficultyColor(activity.difficulty)}>
              {activity.difficulty}
            </Badge>
            <Badge className={getTypeColor(activity.type)}>
              {activity.type.toUpperCase()}
            </Badge>
            {status && (
              <Badge className={getStatusColor(status)}>
                {status.replace('-', ' ').toUpperCase()}
              </Badge>
            )}
          </div>
          <h3 className="text-black mb-2">{activity.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {activity.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{activity.estimatedTime} min</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          <span>{activity.points} pts</span>
        </div>
        {score !== undefined && (
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>{score}%</span>
          </div>
        )}
      </div>

      {activity.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activity.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
          {activity.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{activity.tags.length - 3} more</span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {onSelect && (
          <Button
            onClick={() => onSelect(activity)}
            className="flex-1 bg-black text-white hover:bg-gray-800"
          >
            View Details
          </Button>
        )}
        {showNetAcadLink && activity.netacadUrl && (
          <Button
            onClick={() => window.open(activity.netacadUrl, '_blank')}
            variant="outline"
            className="border-black text-black hover:bg-gray-100"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
