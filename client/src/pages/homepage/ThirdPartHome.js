import styling from "./ThirdPartHome.module.css";
import { Trans } from "react-i18next";

export default function ThirdPartHome() {
  return (
    <div className={`container ${styling.thirdPartBody}`}>
      <h1><Trans>Love and work are to people what water and sunshine are to plants</Trans></h1>
    </div>
  );
}
