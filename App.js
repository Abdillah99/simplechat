import React from 'react';
import { AuthProvider, SettingsProvider } from 'container'
import { MainStack } from 'routes'

export default App = ()=> {

  return (
    
    <AuthProvider>
      
      <SettingsProvider>

        <MainStack />
      
      </SettingsProvider>

    </AuthProvider>
  );
}
