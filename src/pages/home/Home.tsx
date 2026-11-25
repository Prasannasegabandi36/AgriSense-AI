import { Link } from 'react-router-dom';
import { MdArrowForward, MdOutlineAgriculture, MdOutlineDescription, MdOutlineEco } from 'react-icons/md';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks';
import paddyFields from '@/assets/images/paddy-fields.webp';

const tools = [
  {
    title: 'Farm profiles',
    description: 'Keep the location, size and water source of each farm together.',
    path: ROUTES.dashboard.farmManagement,
    icon: MdOutlineAgriculture,
  },
  {
    title: 'Field overview',
    description: 'See the acreage and locations you have recorded across your farms.',
    path: ROUTES.dashboard.root,
    icon: MdOutlineEco,
  },
  {
    title: 'Farm reports',
    description: 'Turn your saved field details into a report you can read or download.',
    path: ROUTES.dashboard.reports,
    icon: MdOutlineDescription,
  },
];

export function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <section className="farm-home-hero container-app">
        <div className="farm-home-copy">
          <h1 className="farm-headline">Your farm,<br /><em>in focus.</em></h1>
          <p>Keep field details, water sources and farm reports in one place. Start with the land you know.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to={isAuthenticated ? ROUTES.dashboard.root : ROUTES.auth.register} className="farm-action focus-ring">
              {isAuthenticated ? 'Open dashboard' : 'Create account'} <MdArrowForward aria-hidden="true" />
            </Link>
            <a href="#features" className="farm-text-link focus-ring">Explore farm tools</a>
          </div>
        </div>
        <img className="farm-home-photo" src={paddyFields} alt="Curving rows of rice plants across green paddy fields" fetchPriority="high" />
      </section>

      <section id="features" aria-labelledby="tools-heading" className="farm-tools">
        <div className="container-app">
          <h2 id="tools-heading" className="farm-section-title">Your farm tools</h2>
          <div className="farm-tools-grid">
            {tools.map(({ title, description, path, icon: Icon }) => (
              <Link key={title} to={path} className="farm-tool focus-ring">
                <span className="farm-tool-icon"><Icon aria-hidden="true" /></span>
                <div><h3>{title}</h3><p>{description}</p></div>
                <MdArrowForward className="farm-tool-arrow" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container-app farm-help" aria-labelledby="help-heading">
        <h2 id="help-heading" className="farm-section-title">Getting started</h2>
        <div>
          <details>
            <summary>How do I add my first farm?</summary>
            <p>Create an account, open the verification link in your email and sign in. Open Farm Management, choose Add farm and enter a name and location.</p>
          </details>
          <details>
            <summary>Can I keep records for more than one farm?</summary>
            <p>Yes. Create a separate farm profile for each location. You can generate a report for one farm or for all your saved farms.</p>
          </details>
        </div>
      </section>
    </>
  );
}
