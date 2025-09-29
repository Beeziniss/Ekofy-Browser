import React from "react";
import TrackStatSection from "../sections/tracks/track-stat-section";
import TrackTableSection from "../sections/tracks/track-table-section";

const TrackView = () => {
  return (
    <div className="w-full p-4 pt-8">
      <TrackStatSection />
      <TrackTableSection />
    </div>
  );
};

export default TrackView;
