'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Settings, Trophy, BookOpen, Home } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="header glass-panel" style={{ borderRadius: '0 0 16px 16px', margin: '0 10px', marginTop: '10px' }}>
      <Link href="/">
        <h1 style={{ cursor: 'pointer' }}>CubeMaster</h1>
      </Link>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/">
          <button className={`glass-button ${pathname === '/' ? 'active' : ''}`} title="Home"><Home size={20} /></button>
        </Link>
        <Link href="/scanner">
          <button className={`glass-button ${pathname === '/scanner' ? 'active' : ''}`} title="Scanner"><Camera size={20} /></button>
        </Link>
        <Link href="/learn">
          <button className={`glass-button ${pathname === '/learn' ? 'active' : ''}`} title="Learn"><BookOpen size={20} /></button>
        </Link>
        <Link href="/timer">
          <button className={`glass-button ${pathname === '/timer' ? 'active' : ''}`} title="Timer / Stats"><Trophy size={20} /></button>
        </Link>
        <Link href="/forums">
          <button className={`glass-button ${pathname === '/forums' ? 'active' : ''}`} title="Forums">Forums</button>
        </Link>
        <Link href="/admin">
          <button className={`glass-button ${pathname === '/admin' ? 'active' : ''}`} title="Admin">Admin</button>
        </Link>
        <button className="glass-button" title="Settings"><Settings size={20} /></button>
      </div>
    </header>
  );
}
