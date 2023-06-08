import React from "react";
import styling from "./Footer.module.css";
import { Trans } from "react-i18next";

export default function Footer({currentLanguage, setCurrentLanguage}) {
  
  const handleLanguageChange = (event) => {
    localStorage.setItem("i18nextLng", event.target.value);
    setCurrentLanguage(event.target.value);
  };

  return (
    <footer className={`${styling.footerDiv}`}>
      <div className={styling.footerContainer}>
        <div className={styling.leftSection}>
          <h2 className={`${styling.footerFontLogo}`}>Gioachino</h2>
        </div>
        <div className={styling.centerSection}>
          <div className={styling.footerColumn}>
            <h4><Trans>Connect</Trans></h4>
            <ul>
              <li>Link 1</li>
              <li>Link 2</li>
              <li>Link 3</li>
            </ul>
          </div>
          <div className={styling.footerColumn}>
            <h4><Trans>Resources</Trans></h4>
            <ul>
              <li>Link 1</li>
              <li>Link 2</li>
              <li>Link 3</li>
            </ul>
          </div>
          <div className={styling.footerColumn}>
            <h4><Trans>About</Trans></h4>
            <ul>
              <li>Link 1</li>
              <li>Link 2</li>
              <li>Link 3</li>
            </ul>
          </div>
        </div>
        <div className={styling.rightSection}>
          <div className={styling.dropdown}>
            <label htmlFor="language"><Trans>Language</Trans>:</label>
            <select id="language" value={currentLanguage} onChange={handleLanguageChange}>
              <option value="en"><Trans>English</Trans></option>
              <option value="it"><Trans>Italian</Trans></option>
            </select>
          </div>
        </div>
      </div>
      <div className={styling.footerParagraph}>
        {/* <p>Designed by L.P</p> */}
      </div>
    </footer>
  );
}
