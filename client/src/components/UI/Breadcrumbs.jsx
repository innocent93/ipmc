import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames = {
  '': 'Home',
  'about': 'About IPMC',
  'services': 'Capabilities',
  'blog': 'Research & Insights',
  'team': 'Our Team',
  'contact': 'Contact Us',
  'esg': 'ESG Solutions',
  'proposal': 'Proposal Request',
  'careers': 'Careers',
  'events': 'Events',
  'search': 'Search Results',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav className="bg-gray-50 border-b border-gray-100 py-3">
      <div className="container-custom">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors">
              <Home size={14} />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </li>
          {paths.map((path, index) => {
            const isLast = index === paths.length - 1;
            const to = '/' + paths.slice(0, index + 1).join('/');

            return (
              <li key={path} className="flex items-center gap-2">
                <ChevronRight size={14} className="text-gray-300" />
                {isLast ? (
                  <span className="text-primary-600 font-medium capitalize">
                    {routeNames[path] || path.replace(/-/g, ' ')}
                  </span>
                ) : (
                  <Link to={to} className="text-gray-500 hover:text-primary-600 transition-colors capitalize">
                    {routeNames[path] || path.replace(/-/g, ' ')}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
