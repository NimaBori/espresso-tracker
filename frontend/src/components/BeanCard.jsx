import { Link } from "react-router-dom";
import "./BeanCard.scss";

export default function BeanCard({ bean }) {
  return (
    <Link to={`/beans/${bean.id}`} className="bean-card">
      <div className="bean-card__header">
        <span className="bean-card__emoji">🫘</span>
        <span className={`badge badge-${bean.roastLevel?.toLowerCase()}`}>
          {bean.roastLevel}
        </span>
      </div>
      <div className="bean-card__body">
        <h3 className="bean-card__name">{bean.beanName}</h3>
        <p className="bean-card__roaster">{bean.roasterName}</p>
        {bean.origin && (
          <p className="bean-card__origin">{bean.origin}</p>
        )}
        {bean.tastingNotes && (
          <p className="bean-card__notes">{bean.tastingNotes}</p>
        )}
      </div>
    </Link>
  );
}