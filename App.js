import React,{useRef, useEffect,} from 'react';
import { AppState } from 'react-native';

import { AuthProvider, SettingsProvider } from 'container'
import { MainStack } from 'routes'
import { setOnline } from 'services';

export default App = ()=> {

  return (
    
    <AuthProvider>
      
      <SettingsProvider>

        <MainStack />
      
      </SettingsProvider>

    </AuthProvider>
  );
}
