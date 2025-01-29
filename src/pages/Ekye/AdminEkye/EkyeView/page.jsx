import React from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardBody } from "@nextui-org/react";

import EkyeEducationDetails from "../../../../components/Ekye/View/Education";
import EkyeDocumentDetail from "../../../../components/Ekye/View/Document";

import EkyeAdreess from "../../../../components/Ekye/View/Address";
import ViewPage from "../../../../components/Ekye/View/ViewPage";

const Page = () => {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options" variant="light">
        <Tab key="PersonalDetail" title="Personal Detail">
          <Card className="bg-gray-100  shadow-none">
            <CardBody>
              <ViewPage />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="AddressDetail" title="Address Detail">
          <Card className="bg-gray-100  shadow-none">
            <CardBody>
              <EkyeAdreess />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="DocumentDetail" title="Document Detail">
          <Card className="bg-gray-100  shadow-none">
            <CardBody>
              <EkyeDocumentDetail />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="EducationDetail" title="Education Detail">
          <Card className="bg-gray-100  shadow-none">
            <CardBody>
              <EkyeEducationDetails />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Page;
