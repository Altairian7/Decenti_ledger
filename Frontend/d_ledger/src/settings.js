import React, { useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";

function Settings() {
  const [theme, setTheme] = useState("light");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [locationAccess, setLocationAccess] = useState(false);
  const [twitterHandle, setTwitterHandle] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const settings = {
      theme,
      emailNotifications,
      smsNotifications,
      locationAccess,
      twitterHandle,
      facebookLink,
      instagramHandle,
    };
    console.log("Settings saved:", settings);
    alert("Settings have been saved!");
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    },
    mainContent: {
      flex: 1,
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    heading: {
      textAlign: "center",
      color: "#3a855d",
      fontSize: "2.5em",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    form: {
      width: "100%",
      maxWidth: "600px",
      padding: "20px",
      backgroundColor: "#f8f8f8",
      border: "1px solid #3a855d",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    sectionTitle: {
      marginTop: "20px",
      color: "#3a855d",
      fontSize: "1.2em",
      fontWeight: "bold",
      borderBottom: "2px solid #3a855d",
      paddingBottom: "8px",
    },
    label: {
      display: "block",
      marginTop: "15px",
      marginBottom: "5px",
      color: "#000",
      fontSize: "1em",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      backgroundColor: "#fff",
      color: "#000",
      fontSize: "1em",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      marginBottom: "15px",
      fontSize: "1em",
    },
    checkbox: {
      marginRight: "10px",
    },
    button: {
      backgroundColor: "#3a855d",
      border: "none",
      padding: "12px 20px",
      borderRadius: "5px",
      color: "#fff",
      fontSize: "1.2em",
      fontWeight: "bold",
      cursor: "pointer",
      width: "100%",
      transition: "all 0.3s ease-in-out",
    },
    buttonHover: {
      backgroundColor: "#2e6a4b",
    },
    contactSection: {
      marginTop: "30px",
      textAlign: "center",
      backgroundColor: "#f8f8f8",
      padding: "15px",
      border: "1px solid #3a855d",
      borderRadius: "8px",
      width: "100%",
      maxWidth: "600px",
    },
    link: {
      color: "#3a855d",
      textDecoration: "none",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1 style={styles.heading}>Website Settings</h1>
        <form style={styles.form} onSubmit={handleSubmit}>
          {/* Appearance Section */}
          <h2 style={styles.sectionTitle}>Appearance</h2>
          <label style={styles.label} htmlFor="theme">
            Choose Theme:
          </label>
          <select
            style={styles.input}
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>

          {/* Notifications Section */}
          <h2 style={styles.sectionTitle}>Notifications</h2>
          <div style={styles.checkboxLabel}>
            <input
              style={styles.checkbox}
              type="checkbox"
              id="email-notifications"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
            />
            <label htmlFor="email-notifications">
              Enable Email Notifications
            </label>
          </div>
          <div style={styles.checkboxLabel}>
            <input
              style={styles.checkbox}
              type="checkbox"
              id="sms-notifications"
              checked={smsNotifications}
              onChange={() => setSmsNotifications(!smsNotifications)}
            />
            <label htmlFor="sms-notifications">
              Enable SMS Notifications
            </label>
          </div>

          {/* Privacy Section */}
          <h2 style={styles.sectionTitle}>Privacy Settings</h2>
          <div style={styles.checkboxLabel}>
            <input
              style={styles.checkbox}
              type="checkbox"
              id="location-access"
              checked={locationAccess}
              onChange={() => setLocationAccess(!locationAccess)}
            />
            <label htmlFor="location-access">Allow Location Access</label>
          </div>

          {/* Social Media Section */}
          <h2 style={styles.sectionTitle}>Social Media</h2>
          <label style={styles.label} htmlFor="twitter-handle">
            Twitter Handle:
          </label>
          <input
            style={styles.input}
            type="text"
            id="twitter-handle"
            value={twitterHandle}
            onChange={(e) => setTwitterHandle(e.target.value)}
            placeholder="@YourTwitter"
          />
          <label style={styles.label} htmlFor="facebook-link">
            Facebook Profile URL:
          </label>
          <input
            style={styles.input}
            type="url"
            id="facebook-link"
            value={facebookLink}
            onChange={(e) => setFacebookLink(e.target.value)}
            placeholder="https://facebook.com/your-profile"
          />
          <label style={styles.label} htmlFor="instagram-handle">
            Instagram Handle:
          </label>
          <input
            style={styles.input}
            type="text"
            id="instagram-handle"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
            placeholder="@YourInstagram"
          />

          <button
            style={styles.button}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor =
                styles.buttonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = styles.button.backgroundColor)
            }
            type="submit"
          >
            Save Settings
          </button>
        </form>

        {/* Contact Section */}
        <div style={styles.contactSection}>
          <h2>Connect with Our Support</h2>
          <p>Join our community for more support:</p>
          <p>
            Discord: <a style={styles.link} href="#">Join our Discord</a>
          </p>
          <p>
            Telegram: <a style={styles.link} href="#">Join our Telegram</a>
          </p>
          <p>Email: admin@hadnt.com</p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Settings;
