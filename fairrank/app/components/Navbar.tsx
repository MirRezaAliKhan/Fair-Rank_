import Link from 'next/link';

interface NavbarProps {
  isLoggedIn?: boolean;
  userRole?: 'student' | 'recruiter';
}

export default function Navbar({ isLoggedIn = false, userRole }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              FR
            </div>
            <span className="font-bold text-lg hidden sm:inline text-gray-900">
              FairRank
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              Features
            </Link>
            <Link
              href="#comparison"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup?role=student"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:shadow-lg transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={
                    userRole === 'student' ? '/dashboard/student' : '/dashboard/recruiter'
                  }
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm"
                >
                  Dashboard
                </Link>
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-300 transition">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
