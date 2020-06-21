import * as React from 'react';

import { MainStack } from 'routes';
import { AuthProvider } from './src/modules';


function App() {
  return (
    <AuthProvider>

      <MainStack />

    </AuthProvider>
  );
}

export default App;
