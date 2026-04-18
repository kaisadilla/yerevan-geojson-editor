import { createTheme, MantineProvider, Popover, Text, Tooltip } from '@mantine/core';
import { StrictMode } from 'react';
// @ts-ignore TODO: Check why importing from react-dom/client is marked as error.
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router';

import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { ActiveElementProvider } from 'context/useActiveElement.tsx';
import { KeyboardProvider } from 'context/useKeyboard.tsx';
import 'i18n';
import ImportDocumentModal from 'pages/map-editor/modals/ImportDocument.tsx';
import App from './App.tsx';
import { store } from './state/store.ts';

const mantineTheme = createTheme({
  colors: {
    blue: [
      "var(--color-primary-l3)",
      "var(--color-primary-l3)",
      "var(--color-primary-l3)",
      "var(--color-primary-l3)",
      "var(--color-primary-l2)",
      "var(--color-primary-l1)",
      "var(--color-primary)",
      "var(--color-primary-d1)",
      "var(--color-primary-d2)",
      "var(--color-primary-d2)",
    ]
  },
  defaultRadius: 0,
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
    }),
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider
      theme={mantineTheme}
    >
    <BrowserRouter>
        
      <Provider store={store}>

        <KeyboardProvider>
        <ActiveElementProvider>

          <ModalsProvider
            modalProps={{
              transitionProps: {
                transition: 'fade',
                duration: 50,
              },
              centered: true
            }}
            modals={{
              importDocument: ImportDocumentModal,
            }}
          >

            <Notifications />

            <App />

          </ModalsProvider>
        
        </ActiveElementProvider>
        </KeyboardProvider>

      </Provider>

    </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
)
