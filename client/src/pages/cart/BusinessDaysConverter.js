import { Trans, useTranslation } from "react-i18next";
import styling from "./BusinessDaysConverter.module.css";

function BusinessDaysConverter() {
  const currentDate = new Date();
  const { t } = useTranslation();
  const translateDate = t("languagePlaceholder");
  // 5-8 business days
  const numberOfDaysStart = 5; // Number of business days
  const numberOfDaysEnd = 8; // Number of business days

  const addBusinessDays = (date, days) => {
    const copyDate = new Date(date.getTime());

    while (days > 0) {
      copyDate.setDate(copyDate.getDate() + 1);

      if (copyDate.getDay() !== 0 && copyDate.getDay() !== 6) {
        // Exclude weekends
        days--;
      }
    }

    return copyDate;
  };

  const startDate = addBusinessDays(currentDate, numberOfDaysStart);
  const endDate = addBusinessDays(currentDate, numberOfDaysEnd);

  const formatDay = (date) => {
    return <span>{`${date.getDate()} ${date.toLocaleString(`${translateDate}`, {
      month: "long",
    })}`}</span>
  };

  return (
    <div className={styling.dateDiv}>
      <p>
        <Trans>Expected delivery</Trans>: {formatDay(startDate)} -{" "}
        {formatDay(endDate)}
      </p>
    </div>
  );
}

export default BusinessDaysConverter;
