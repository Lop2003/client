import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import DashboardPage from "../pages/dashboard";
import CustomersPage from "../pages/customers";
import FollowUpPage from "../pages/follow-up";
import AddFeedbackPage from "../pages/add-feedback";
import { PATHS } from "./paths";

export default function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path={PATHS.DASHBOARD} element={<DashboardPage />} />
        <Route path={PATHS.CUSTOMERS} element={<CustomersPage />} />
        <Route path={PATHS.FOLLOW_UP} element={<FollowUpPage />} />
        <Route path={PATHS.ADD_FEEDBACK} element={<AddFeedbackPage />} />
        <Route path="*" element={<Navigate to={PATHS.DASHBOARD} replace />} />
      </Routes>
    </MainLayout>
  );
}
