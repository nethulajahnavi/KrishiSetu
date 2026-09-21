import {
  Bell,
  Globe,
  LogOut,
  Moon,
  Save,
  Volume2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    const savedSettings =
      localStorage.getItem("krishisetu_settings");

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);

        setNotifications(
          settings.notifications ?? true
        );

        setSound(
          settings.sound ?? true
        );

        setLanguage(
          settings.language ?? "English"
        );
      } catch (error) {
        console.error(
          "Unable to read settings:",
          error
        );
      }
    }
  }, []);

  function handleSave() {
    const settings = {
      notifications,
      sound,
      language,
    };

    localStorage.setItem(
      "krishisetu_settings",
      JSON.stringify(settings)
    );

    alert("Settings saved successfully.");
  }

  function handleLogout() {
    localStorage.removeItem("krishisetu_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <div className="settings-page">

      <div className="settings-header">

        <div>
          <span className="settings-eyebrow">
            ACCOUNT
          </span>

          <h1>Settings</h1>

          <p>
            Manage your KrishiSetu preferences.
          </p>
        </div>

      </div>


      <div className="settings-grid">

        {/* NOTIFICATIONS */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              <Bell size={21} />
            </div>

            <div>
              <h2>Notifications</h2>

              <p>
                Receive updates about offers,
                prices and transactions.
              </p>
            </div>

          </div>


          <label className="settings-toggle">

            <input
              type="checkbox"
              checked={notifications}
              onChange={(event) =>
                setNotifications(
                  event.target.checked
                )
              }
            />

            <span className="toggle-slider" />

            <strong>
              {notifications
                ? "Enabled"
                : "Disabled"}
            </strong>

          </label>

        </section>


        {/* SOUND */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              <Volume2 size={21} />
            </div>

            <div>
              <h2>Sound</h2>

              <p>
                Enable sounds for important
                application notifications.
              </p>
            </div>

          </div>


          <label className="settings-toggle">

            <input
              type="checkbox"
              checked={sound}
              onChange={(event) =>
                setSound(
                  event.target.checked
                )
              }
            />

            <span className="toggle-slider" />

            <strong>
              {sound
                ? "Enabled"
                : "Disabled"}
            </strong>

          </label>

        </section>


        {/* LANGUAGE */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              <Globe size={21} />
            </div>

            <div>
              <h2>Language</h2>

              <p>
                Choose your preferred interface
                language.
              </p>
            </div>

          </div>


          <select
            value={language}
            onChange={(event) =>
              setLanguage(
                event.target.value
              )
            }
            className="settings-select"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>

        </section>


        {/* APPEARANCE */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              <Moon size={21} />
            </div>

            <div>
              <h2>Appearance</h2>

              <p>
                Theme preferences can be added
                as the application grows.
              </p>
            </div>

          </div>

          <div className="settings-info">
            Light theme is currently active.
          </div>

        </section>

      </div>


      {/* ACTIONS */}

      <section className="settings-actions">

        <button
          className="settings-save"
          onClick={handleSave}
        >
          <Save size={18} />
          Save Settings
        </button>


        <button
          className="settings-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>

      </section>

    </div>
  );
}

export default Settings;