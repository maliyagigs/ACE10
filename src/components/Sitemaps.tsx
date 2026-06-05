import React from 'react';
import { Link } from 'react-router-dom';

export default function Sitemaps() {
  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Authentication', path: '/auth' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Sitemap</h1>
      <ul>
        {routes.map((route) => (
          <li key={route.path}>
            <Link to={route.path}>{route.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
