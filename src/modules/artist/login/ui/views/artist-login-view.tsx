import React from "react";
import { ArtistLoginFormSection, ArtistImageSection } from "../sections";
import LoginLayout from "../layouts/artist-login-layout";
const ArtistLoginView = () => {
  return (
    <LoginLayout>
      <ArtistLoginFormSection />
      <ArtistImageSection />
    </LoginLayout>
  );
};

export default ArtistLoginView;
