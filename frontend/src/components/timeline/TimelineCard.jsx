import { HiOutlineBuildingOffice2, HiOutlineUser } from "react-icons/hi2";

function TimelineCard({ event, isLast }) {
  const { date, event: title, hospital, doctor, description } = event;

  return (
    <div className="relative flex gap-5">
      <div className="flex flex-col items-center">
        <span className="z-10 flex h-3.5 w-3.5 shrink-0 rounded-full border-2 border-teal-500 bg-white" />
        {!isLast && <span className="w-px flex-1 bg-mist-300" />}
      </div>

      <div className="card card-hover mb-8 w-full p-5">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-teal-600">
          {date}
        </p>
        <h3 className="mt-1.5 font-display text-base font-semibold text-ink-800">{title}</h3>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink-500">
          <span className="flex items-center gap-1.5">
            <HiOutlineBuildingOffice2 className="h-3.5 w-3.5 text-ink-400" />
            {hospital}
          </span>
          <span className="flex items-center gap-1.5">
            <HiOutlineUser className="h-3.5 w-3.5 text-ink-400" />
            {doctor}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink-600">{description}</p>
      </div>
    </div>
  );
}

export default TimelineCard;
