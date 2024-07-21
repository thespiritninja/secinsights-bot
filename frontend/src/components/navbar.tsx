import React from "react";

interface INavbarProps {
  setfilePath: (path: string) => void;
}

const Navbar: React.FC<INavbarProps> = ({ setfilePath }) => {
  return (
    <div className="relative h-screen z-10">
      <nav className="absolute top-0 left-0 h-screen p-4 bg-gray-800 transition-width duration-300 ease-in-out w-0 hover:w-72">
        <div className="mt-4 overflow-hidden">
          <a
            href="#"
            className="block text-white py-2"
            onClick={() => setfilePath("/3M_10K_File.pdf")}
          >
            3M_2022_10k.pdf
          </a>
          <a
            href="#"
            className="block text-white py-2"
            onClick={() => setfilePath("/AW_10K_File.pdf")}
          >
            American_Waterworks_2022.pdf
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
