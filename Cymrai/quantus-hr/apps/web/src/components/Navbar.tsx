import { useState } from 'react';
import Link from 'next/link';

/**
 * QHR-14 Navbar Component
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          Quantus HR
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;