import { Redirect } from 'expo-router';
import React from 'react';

const MainPage = () => {
  return <Redirect href="/(auth)/sign-in" />;
};

export default MainPage;
