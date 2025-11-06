import React from "react";
import ModeratorLoginLayout from "../layouts/moderator-login-layout";
import { ModeratorLoginFormSection, ImageSection } from "../sections";
const ModeratorLoginView = () => {
  return (
    <ModeratorLoginLayout>
      <ImageSection />
      <ModeratorLoginFormSection />
    </ModeratorLoginLayout>
  );
};

export default ModeratorLoginView;
