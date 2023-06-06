import React, {useState} from "react";
import styling from "./Footer.module.css";

export default function Footer({currentLanguage, setCurrentLanguage}) {
  
  const handleLanguageChange = (event) => {
    localStorage.setItem("i18nextLng", event.target.value);
    setCurrentLanguage(event.target.value);
  };

  return (
    <footer className="footer">
      <div className={styling.footerContainer}>
        <div className={styling.leftSection}>
          <h2 className={`${styling.footerFontLogo}`}>Gioachino</h2>
        </div>
        <div className={styling.centerSection}>
          <div className={styling.footerColumn}>
            <h4>Connect</h4>
            <ul>
              <li>Link 1</li>
              <li>Link 2</li>
              <li>Link 3</li>
            </ul>
          </div>
          <div className={styling.footerColumn}>
            <h4>Resources</h4>
            <ul>
              <li>Link 1</li>
              <li>Link 2</li>
              <li>Link 3</li>
            </ul>
          </div>
          <div className={styling.footerColumn}>
            <h4>About</h4>
            <ul>
              <li>Link 1</li>
              <li>Link 2</li>
              <li>Link 3</li>
            </ul>
          </div>
        </div>
        <div className={styling.rightSection}>
          <div className={styling.dropdown}>
            <label htmlFor="currency">Currency:</label>
            <select id="currency">
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="gbp">GBP</option>
            </select>
          </div>
          <div className={styling.dropdown}>
            <label htmlFor="language">Language:</label>
            <select id="language" value={currentLanguage} onChange={handleLanguageChange}>
              <option value="en">English</option>
              <option value="it">Italian</option>
            </select>
          </div>
        </div>
      </div>
      <div className={styling.footerParagraph}>
        <p>Designed by L.P</p>
      </div>
    </footer>
  );
}
