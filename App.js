import * as React from 'react';

import { MainStack } from 'routes';
import { AuthProvider, SettingsProvider, ChatProvider } from 'modules';


function App() {
  return (
    
    <AuthProvider>
      
      <SettingsProvider>

        <ChatProvider>

          <MainStack />

        </ChatProvider>
      
      </SettingsProvider>

    </AuthProvider>
  );
}

export default App;
