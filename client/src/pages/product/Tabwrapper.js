import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import styling from "./Tabwrapper.module.css";
import { Trans } from "react-i18next";

const TabWrapper = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className={styling.wrapper}>
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList>
          <Tab><Trans>Description</Trans></Tab>
          <Tab><Trans>Additional information</Trans></Tab>
          <Tab><Trans>Reviews</Trans></Tab>
        </TabList>

        <TabPanel>
          <h2><Trans>Content 1</Trans></h2>
        </TabPanel>
        <TabPanel>
          <h2><Trans>Content 2</Trans></h2>
        </TabPanel>
        <TabPanel>
          <h2><Trans>Content 3</Trans></h2>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TabWrapper;
