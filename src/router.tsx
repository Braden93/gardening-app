import { Navigate, Route, Routes } from 'react-router'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AppLayout } from '@/components/layout/layout'
import LoginPage from '@/pages/login'
import GardenHomePage from '@/pages/garden/index'
import GardenProfilePage from '@/pages/garden/profile'
import SoilPage from '@/pages/garden/soil'
import PlantsPage from '@/pages/garden/plants'
import LayoutPage from '@/pages/garden/layout'
import RotationPage from '@/pages/garden/rotation'
import CalendarPage from '@/pages/garden/calendar'
import SeasonsPage from '@/pages/garden/seasons'
import CompostingPage from '@/pages/garden/composting'
import WaterPage from '@/pages/garden/water'
import SeedsPage from '@/pages/garden/seeds'
import PreservationPage from '@/pages/garden/preservation'
import PestsPage from '@/pages/garden/pests'
import HomesteadPage from '@/pages/garden/homestead'
import RoadmapPage from '@/pages/garden/roadmap'
import ResourcesPage from '@/pages/garden/resources'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/garden/home" replace />} />
          <Route path="/garden" element={<Navigate to="/garden/home" replace />} />
          <Route path="/garden/home" element={<GardenHomePage />} />
          <Route path="/garden/profile" element={<GardenProfilePage />} />
          <Route path="/garden/soil" element={<SoilPage />} />
          <Route path="/garden/plants" element={<PlantsPage />} />
          <Route path="/garden/layout" element={<LayoutPage />} />
          <Route path="/garden/rotation" element={<RotationPage />} />
          <Route path="/garden/calendar" element={<CalendarPage />} />
          <Route path="/garden/seasons" element={<SeasonsPage />} />
          <Route path="/garden/composting" element={<CompostingPage />} />
          <Route path="/garden/water" element={<WaterPage />} />
          <Route path="/garden/seeds" element={<SeedsPage />} />
          <Route path="/garden/preservation" element={<PreservationPage />} />
          <Route path="/garden/pests" element={<PestsPage />} />
          <Route path="/garden/homestead" element={<HomesteadPage />} />
          <Route path="/garden/roadmap" element={<RoadmapPage />} />
          <Route path="/garden/resources" element={<ResourcesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
