import { Routes, Route } from 'react-router-dom'
import SettingsManagement from './pages/SettingsManagement'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SettingsManagement />} />
    </Routes>
  )
}
