import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header(){
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    function toggleMenu(){
        setMobileMenuOpen(!mobileMenuOpen)
    }
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-[#7e69ab]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-mission-lightPurple"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span className="text-xl font-bold text-[#7e69ab]">Go Movement</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8 items-center">
                    <Link to="/" className="text-gray-700 hover:text-[#7e69ab] font-medium"> Home</Link>
                    <Link to="/articles" className="text-gray-700 hover:text-[#7e69ab] font-medium">Articles</Link>
                    <Link to="/events" className="text-gray-700 hover:text-[#7e69ab] font-medium">Events</Link>
                    <Link to="/gallery" className="text-gray-700 hover:text-[#7e69ab] font-medium">Gallery</Link>
                    <Link to="/join" className="text-gray-700 hover:text-[#7e69ab] font-medium">Join Us</Link>
                </nav>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-gray-700 hover:text-[#7e69ab] focus:outline-none focus:ring-2 focus:ring-[#7e69ab] rounded-md p-2">
                        {mobileMenuOpen ? (
                            <X />
                        ) : (
                            <Menu />
                        )}
                    </button>
                </div>
                { /* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link 
                                to="/" 
                                className="block text-gray-700 hover:text-[#7e69ab] font-medium"
                                onClick={(() => setMobileMenuOpen(false))}    
                            > 
                                Home
                            </Link>
                            <Link 
                                to="/articles" 
                                className="block text-gray-700 hover:text-[#7e69ab] font-medium"
                                onClick={(() => setMobileMenuOpen(false))}
                            >
                                Articles
                            </Link>
                            <Link 
                                to="/events" 
                                className="block text-gray-700 hover:text-[#7e69ab] font-medium"
                                onClick={(() => setMobileMenuOpen(false))}
                            >
                                Events
                            </Link>
                            <Link 
                                to="/gallery" 
                                className="block text-gray-700 hover:text-[#7e69ab] font-medium"
                                onClick={(() => setMobileMenuOpen(false))}
                            >
                                Gallery
                            </Link>
                            <Link 
                                to="/join" 
                                className="block text-gray-700 hover:text-[#7e69ab] font-medium"
                                onClick={(() => setMobileMenuOpen(false))}
                            >
                                    Join Us
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}