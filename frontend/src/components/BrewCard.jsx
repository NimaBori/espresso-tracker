import "./BrewCard.scss";

function StarRating({ rating }) {
  return (
    <span className="star-rating">
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function Ratio({ dose, yield: yieldGrams }) {
  if (!dose || !yieldGrams) return null;
  const ratio = (yieldGrams / dose).toFixed(1);
  return <span className="ratio">{ratio}:1</span>;
}

export default function BrewCard({ brew }) {
  return (
    <div className="brew-card">
      <div className="brew-card__header">
        <span className="brew-card__emoji">☕</span>
        <StarRating rating={brew.rating} />
      </div>
      <div className="brew-card__body">
        <h3 className="brew-card__bean">{brew.beanName || "Unknown Bean"}</h3>
        <div className="brew-card__stats">
          <div className="brew-card__stat">
            <span className="brew-card__stat-label">Dose</span>
            <span className="brew-card__stat-value">{brew.doseGrams}g</span>
          </div>
          <div className="brew-card__stat">
            <span className="brew-card__stat-label">Yield</span>
            <span className="brew-card__stat-value">{brew.yieldGrams}g</span>
          </div>
          <div className="brew-card__stat">
            <span className="brew-card__stat-label">Ratio</span>
            <span className="brew-card__stat-value">
              <Ratio dose={brew.doseGrams} yield={brew.yieldGrams} />
            </span>
          </div>
          <div className="brew-card__stat">
            <span className="brew-card__stat-label">Time</span>
            <span className="brew-card__stat-value">
              {formatTime(brew.extractionTimeSeconds)}
            </span>
          </div>
        </div>
        {brew.notes && (
          <p className="brew-card__notes">{brew.notes}</p>
        )}
      </div>
    </div>
  );
}