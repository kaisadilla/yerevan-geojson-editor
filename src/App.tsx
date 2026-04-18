import { Navigate, Route, Routes } from 'react-router';
import MapEditorPage from './pages/map-editor/page';

// eslint-disable-next-line import/order
import 'material-symbols';
// eslint-disable-next-line import/order
import '@mantine/core/styles.css';
// eslint-disable-next-line import/order
import '@mantine/dropzone/styles.css';
// eslint-disable-next-line import/order
import '@mantine/notifications/styles.css';
// eslint-disable-next-line import/order
import './styles/root.scss';

function App () {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/e/" replace />} />
      <Route path="e" element={<MapEditorPage />} />
    </Routes>
  );
}

export default App
