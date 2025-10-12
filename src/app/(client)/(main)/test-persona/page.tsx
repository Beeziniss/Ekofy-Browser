import React from "react";
import PersonaReact from "persona-react";

const TestPersona = () => {
  return (
    <PersonaReact
      templateId="itmpl_ekN1pVH2FVy8C2PWyd2Pmig8T1Yn"
      environmentId="env_1QiSyURSshSYXakJdHBDEgwi1gVm"
      onLoad={() => {
        console.log("Loaded inline");
      }}
      onComplete={({ inquiryId, status, fields }) => {
        // Inquiry completed. Optionally tell your server about it.

        console.log(`Sending finished inquiry ${inquiryId} to backend`);
      }}
    />
  );
};

export default TestPersona;
