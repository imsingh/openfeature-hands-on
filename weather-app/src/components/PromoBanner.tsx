import { useState } from "react";
import { X } from "lucide-react";
import { useFlag } from "@openfeature/react-sdk";
import { analytics } from "../lib/fauxAnalytics";

interface BannerProps {
  onDismiss: () => void;
  onUpgrade: () => void;
}

function SubtleBanner({ onDismiss, onUpgrade }: BannerProps) {
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
              <button
                onClick={onUpgrade}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Upgrade Plan
              </button>
              <button
                onClick={onDismiss}
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

function ObnoxiousBanner({ onDismiss, onUpgrade }: BannerProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div className="bg-orange-100 border-2 border-orange-400 rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-orange-800">
                ⚡ UPGRADE TO ENTERPRISE ⚡
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onUpgrade}
                className="text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded"
              >
                UPGRADE NOW
              </button>
              <button
                onClick={onDismiss}
                className="text-orange-600 hover:text-orange-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-1">
            <span className="text-sm text-orange-700">
              Get premium weather insights and priority support today!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const { value: showObnoxiousBanner, isAuthoritative } = useFlag(
    "obnoxious-promo-banner",
    false
  );

  if (!isAuthoritative) {
    // We're not confident what the final flag value will be, so don't show anything yet.
    return null;
  }

  if (!isVisible) {
    return null;
  }

  const handleDismiss = () => {
    analytics.track("Promo Banner - Dismissed");
    setIsVisible(false);
  };

  const handleUpgrade = () => {
    analytics.track("Promo Banner - Upgrade Clicked");
    // TODO: actually show the upgrade page. For now we'll just dismiss the banner.
    setIsVisible(false);
  };

  if (showObnoxiousBanner) {
    return (
      <ObnoxiousBanner onDismiss={handleDismiss} onUpgrade={handleUpgrade} />
    );
  } else {
    return <SubtleBanner onDismiss={handleDismiss} onUpgrade={handleUpgrade} />;
  }
}
