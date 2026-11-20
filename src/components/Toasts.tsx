import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          <span>{t.text}</span>
          {t.action && <Link to={t.action.to}>{t.action.label}</Link>}
        </div>
      ))}
    </div>
  );
}
