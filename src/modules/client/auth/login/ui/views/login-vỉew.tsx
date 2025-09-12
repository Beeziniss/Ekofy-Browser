import React from 'react';
import LoginLayout from '../layouts/login-layout';
import { ImageSection, LoginFormSection } from '../sections';

const LoginView = () => {
  return (
    <LoginLayout>
      <LoginFormSection />
      <ImageSection />
    </LoginLayout>
  );
};

export default LoginView;