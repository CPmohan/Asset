import { useNavigate } from "react-router-dom";
import Logo from "../assets/img/logo.png";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import IconButton from "../compounds/iconButton"; // Assuming you have this custom button

function AppSidebar(props) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div
      className={`h-screen bg-secondary text-white ${
        isOpen ? "w-30" : "w-20"
      } transition-all duration-300 p-4`}
    >
      {/* Sidebar Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="mb-4">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img width={40} src={Logo} alt="logo"/>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="space-y-3">
          <li>
            <IconButton
              onClick={() => {
                navigate("/");
                props.onHomeClick && props.onHomeClick(); // ← Trigger reset from Home icon
              }}
              icon="bx-home"
              label={isOpen ? "Home" : ""}
            />
          </li>
          <li>
            <IconButton
              onClick={() => navigate("/settings")}
              icon="bx-cog"
              label={isOpen ? "Settings" : ""}
            />
          </li>
          <li>
            <IconButton
              onClick={() => navigate("/profile")}
              icon="bx-user"
              label={isOpen ? "Profile" : ""}
            />
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AppSidebar;
