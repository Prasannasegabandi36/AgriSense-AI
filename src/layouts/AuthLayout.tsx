import { Link, Outlet } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { APP_CONFIG, ROUTES } from '@/constants';

export function AuthLayout() {
  return (
    <main className="farm-auth">
      <aside className="farm-auth-cover">
        <Link to={ROUTES.home} className="farm-return focus-ring">
          <MdArrowBack aria-hidden="true" /> Back to home
        </Link>
        <div className="farm-auth-wordmark">
          <Link to={ROUTES.home} className="focus-ring">{APP_CONFIG.name}</Link>
          <p>Farm records &amp; reports</p>
        </div>
      </aside>
      <section className="farm-auth-content" aria-label="Account">
        <div className="farm-auth-form">
          <Outlet />
          <p className="farm-credit">Made by <strong>{APP_CONFIG.creator}</strong></p>
        </div>
      </section>
    </main>
  );
}
