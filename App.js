import * as React from 'react';
import { ChatProvider, AuthProvider, SettingsProvider } from 'container'
import { MainStack } from 'routes'
export default App = ()=> {
  
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
