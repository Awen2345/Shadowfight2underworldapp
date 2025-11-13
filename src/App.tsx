import { useState, useEffect } from "react";
import { Taskbar } from "./components/Taskbar";
import { MapView } from "./components/MapView";
import { SeasonRewards } from "./components/SeasonRewards";
import { TopPlayersRanking } from "./components/TopPlayersRanking";
import { MyPlayerStats } from "./components/MyPlayerStats";
import { ClansView } from "./components/ClansView";
import { GemsView } from "./components/GemsView";
import { ShopView } from "./components/ShopView";
import { ChatPanel } from "./components/ChatPanel";
import {
  PromocodePopup,
  PromoReward,
} from "./components/PromocodePopup";
import { EquipmentManager } from "./components/EquipmentManager";
import {
  getInventoryItem,
  addInventoryItem,
} from "./lib/inventoryData";
import { Key, Gift } from "lucide-react";

export type Page =
  | "map"
  | "rewards"
  | "ranking"
  | "mystats"
  | "clans"
  | "gems"
  | "shop"
  | "equipment";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("map");
  const [showPromocodePopup, setShowPromocodePopup] =
    useState(false);
  const [keysCount, setKeysCount] = useState(
    getInventoryItem("steel-keys"),
  );
  const [gemsCount, setGemsCount] = useState(
    getInventoryItem("verified-gems"),
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Periodic inventory update
  useEffect(() => {
    const interval = setInterval(() => {
      setKeysCount(getInventoryItem("steel-keys"));
      setGemsCount(getInventoryItem("verified-gems"));
    }, 500); // Update every 500ms

    return () => clearInterval(interval);
  }, []);

  const handlePromoRedeemSuccess = (rewards: PromoReward) => {
    // Add rewards to inventory
    if (rewards.gems) {
      addInventoryItem("verified-gems", rewards.gems);
      setGemsCount(getInventoryItem("verified-gems"));
    }
    if (rewards.keys) {
      addInventoryItem("steel-keys", rewards.keys);
      setKeysCount(getInventoryItem("steel-keys"));
    }
    if (rewards.minorCharge) {
      addInventoryItem("minor-charge", rewards.minorCharge);
    }
    if (rewards.mediumCharge) {
      addInventoryItem("medium-charge", rewards.mediumCharge);
    }
    if (rewards.largeCharge) {
      addInventoryItem("large-charge", rewards.largeCharge);
    }
    if (rewards.elixirs) {
      rewards.elixirs.forEach((elixir) => {
        addInventoryItem(elixir.id, elixir.quantity);
      });
    }

    // Trigger refresh
    setRefreshTrigger((prev) => prev + 1);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "map":
        return <MapView key={refreshTrigger} />;
      case "rewards":
        return <SeasonRewards />;
      case "ranking":
        return <TopPlayersRanking />;
      case "mystats":
        return <MyPlayerStats />;
      case "clans":
        return <ClansView />;
      case "shop":
        return <ShopView key={refreshTrigger} />;
      case "gems":
        return <GemsView />;
      case "equipment":
        return (
          <EquipmentManager
            key={refreshTrigger}
            onClose={() => setCurrentPage("map")}
          />
        );
      default:
        return <MapView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Taskbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      <div className="container mx-auto px-4 py-6">
        {renderPage()}
      </div>

      {/* Chat Panel */}
      <ChatPanel />

      {/* Bottom Left Icons */}
      <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-20">
        {/* Keys Counter */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-900/80 to-amber-800/80 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 shadow-lg pointer-events-none">
          <Key className="size-5 text-amber-400" />
          <span className="text-amber-100 min-w-[2rem] text-center">
            {keysCount}
          </span>
        </div>

        {/* Promo Code Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPromocodePopup(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-900/80 to-purple-800/80 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 shadow-lg hover:from-purple-800/90 hover:to-purple-700/90 transition-all hover:scale-105"
        >
          <Gift className="size-5 text-purple-400" />
          <span className="text-purple-100 text-sm">Promo</span>
        </button>
      </div>

      {/* Promocode Popup */}
      {showPromocodePopup && (
        <PromocodePopup
          onClose={() => setShowPromocodePopup(false)}
          onRedeemSuccess={handlePromoRedeemSuccess}
        />
      )}
    </div>
  );
}