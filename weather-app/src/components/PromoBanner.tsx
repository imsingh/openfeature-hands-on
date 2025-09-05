import { useState } from "react";
import { X } from "lucide-react";

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div className="bg-gray-50 border border-gray-200 rounded-lg">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                🚀 Enterprise plan is now available! Get advanced weather
                analytics and priority support.
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {/* TODO: Need to implement a plans page - for now just dismiss the banner */}
              <button 
                onClick={() => setIsVisible(false)} 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Upgrade Plan
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
