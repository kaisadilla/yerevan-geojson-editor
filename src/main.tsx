import { MantineProvider, Popover, Text, Tooltip } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router';

import App from './App.tsx';
import { store } from './state/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider
      theme={{
        components: {
          TooltipFloating: Tooltip.Floating.extend({
            defaultProps: {
              position: 'top',
              zIndex: 100_000_000,
            }
          }),
          Tooltip: Tooltip.extend({
            defaultProps: {
              zIndex: 100_000_000,
            }
          }),
          Popover: Popover.extend({
            defaultProps: {
              zIndex: 100_000_000
            }
          }),
          Text: Text.extend({
            styles: {
              root: {
                wordBreak: 'break-all', // By default, Mantine only breaks at word boundaries.
              }
            }
          })
        }
      }}
    >
    <BrowserRouter>

      <Provider store={store}>
        <App />
      </Provider>

    </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
)
