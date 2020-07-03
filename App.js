import * as React from 'react';

import { MainStack } from 'routes';
import { AuthProvider, SettingsProvider } from 'modules';


function App() {
  return (
    
    <AuthProvider>
      
      <SettingsProvider>

        <MainStack />

      </SettingsProvider>

    </AuthProvider>
  );
}

export default App;
