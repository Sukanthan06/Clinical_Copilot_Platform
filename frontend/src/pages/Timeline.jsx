import { useEffect, useState } from "react";
import TimelineCard from "../components/timeline/TimelineCard.jsx";
import { getTimelineEvents } from "../services/timelineService.js";

function Timeline() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getTimelineEvents().then((res) => setEvents(res.events));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-7">
        <p className="label-eyebrow">Step 4 of 6</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink-800">Medical Timeline</h2>
        <p className="mt-1.5 text-sm text-ink-500">
          A chronological view of your visits, diagnoses, and treatments.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="card p-10 text-center">
          <h3 className="font-display text-lg font-semibold text-ink-800">
            No Timeline Events Yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
            Upload medical reports in the <strong>Upload Reports</strong> tab and process them to compile your chronological medical timeline.
          </p>
        </div>
      ) : (
        <div>
          {events.map((event, idx) => (
            <TimelineCard key={event.id} event={event} isLast={idx === events.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Timeline;
