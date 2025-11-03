import { X, AlertCircle, CheckCircle2, Lightbulb, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface FeedbackModalProps {
  activity: any;
  onClose: () => void;
  onAddToPlan: () => void;
}

export default function FeedbackModal({
  activity,
  onClose,
  onAddToPlan,
}: FeedbackModalProps) {
  const handleAddToPlan = () => {
    onAddToPlan();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-black mb-1">Detailed Feedback</h3>
            <p className="text-gray-600 text-sm">{activity?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          {/* Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
            <h4 className="text-black mb-3">Summary</h4>
            <p className="text-gray-700">
              You scored <span className="text-black">{activity?.score}%</span> on{' '}
              {activity?.name}. Great progress! However, there are some areas that need
              attention, particularly in VLAN setup and configuration.
            </p>
          </div>

          {/* Issues Detected */}
          <div className="mb-6">
            <h4 className="text-black mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-black" />
              Issues Detected
            </h4>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-sm">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-black text-sm mb-1">Incomplete VLAN configuration</p>
                  <p className="text-gray-600 text-sm">
                    VLAN 20 was created but not assigned to the appropriate switch ports
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-sm">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-black text-sm mb-1">Subnet mask mismatch</p>
                  <p className="text-gray-600 text-sm">
                    Router interface has incorrect subnet mask for the network design
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-sm">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-black text-sm mb-1">Missing default gateway</p>
                  <p className="text-gray-600 text-sm">
                    End devices are missing proper gateway configuration
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fix Steps */}
          <div className="mb-6">
            <h4 className="text-black mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-black" />
              How to Fix
            </h4>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm">
                    Configure switch ports with{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded text-black border border-gray-200">
                      switchport access vlan 20
                    </code>
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm">
                    Update router interface with correct subnet mask /24 (255.255.255.0)
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm">
                    Add{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded text-black border border-gray-200">
                      ip default-gateway
                    </code>{' '}
                    command on all end devices
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Lessons */}
          <div className="mb-6">
            <h4 className="text-black mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-black" />
              Recommended Lessons
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm text-gray-600">Lesson</th>
                    <th className="text-left py-3 px-2 text-sm text-gray-600">Duration</th>
                    <th className="text-left py-3 px-2 text-sm text-gray-600">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-2 text-sm text-black">VLAN Configuration Best Practices</td>
                    <td className="py-3 px-2 text-sm text-gray-600">45 min</td>
                    <td className="py-3 px-2">
                      <Badge className="bg-gray-100 text-black border border-gray-300">
                        High
                      </Badge>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-2 text-sm text-black">Subnetting and IP Addressing</td>
                    <td className="py-3 px-2 text-sm text-gray-600">60 min</td>
                    <td className="py-3 px-2">
                      <Badge className="bg-gray-100 text-black border border-gray-300">
                        Medium
                      </Badge>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-2 text-sm text-black">Default Gateway Configuration</td>
                    <td className="py-3 px-2 text-sm text-gray-600">30 min</td>
                    <td className="py-3 px-2">
                      <Badge className="bg-gray-100 text-black border border-gray-300">
                        Medium
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Practice Tasks */}
          <div className="mb-6">
            <h4 className="text-black mb-4">Practice Tasks</h4>
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <Play className="w-5 h-5 text-black" />
                <div className="flex-1">
                  <p className="text-black text-sm">VLAN Configuration Practice Lab</p>
                  <p className="text-gray-600 text-xs">Interactive PT activity</p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <Play className="w-5 h-5 text-black" />
                <div className="flex-1">
                  <p className="text-black text-sm">Subnetting Challenge</p>
                  <p className="text-gray-600 text-xs">Quiz with 15 questions</p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <Play className="w-5 h-5 text-black" />
                <div className="flex-1">
                  <p className="text-black text-sm">Router Interface Configuration</p>
                  <p className="text-gray-600 text-xs">Step-by-step tutorial</p>
                </div>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleAddToPlan}
              className="flex-1 bg-black hover:bg-gray-800 text-white"
            >
              Add to Plan
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
