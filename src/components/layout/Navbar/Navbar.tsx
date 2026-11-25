import { Link, NavLink } from 'react-router-dom';
import { MdEco, MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { APP_CONFIG, PUBLIC_NAV, ROUTES } from '@/constants';
import { useAuth, useTheme } from '@/hooks';
import { cn } from '@/utils';

/** Top navigation for public-facing pages (Home, marketing, etc). */
export function Navbar() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
      <nav className="container-app flex h-16 items-center justify-between" aria-label="Primary">
        <Link to={ROUTES.home} className="farm-brand flex items-center gap-2 focus-ring">
          <MdEco className="h-6 w-6 text-primary-600" aria-hidden="true" />
          {APP_CONFIG.name}
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          {PUBLIC_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium text-foreground-muted transition-colors hover:text-foreground',
                  isActive && 'text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <a href="#features" className="text-sm font-medium text-foreground-muted hover:text-foreground">Farm tools</a>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-lg p-2 text-foreground-muted hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {resolvedTheme === 'dark' ? <MdOutlineLightMode className="h-5 w-5" /> : <MdOutlineDarkMode className="h-5 w-5" />}
          </button>
          <Link
            to={isAuthenticated ? ROUTES.dashboard.root : ROUTES.auth.login}
            className="farm-action farm-nav-action focus-ring"
          >
            {isAuthenticated ? 'Dashboard' : 'Sign in'}
          </Link>
        </div>
      </nav>
    </header>
  );
}
