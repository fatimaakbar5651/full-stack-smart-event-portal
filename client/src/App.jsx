import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/EventDetails";
import MyBookings from "./pages/MyBookings";
import Agenda from "./pages/Agenda";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import AddSession from "./pages/AddSession";

function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/events/:id"
          element={<EventDetails />}
        />


        {/* PROTECTED ROUTES */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/bookings"
            element={<MyBookings />}
          />

          <Route
            path="/agenda"
            element={<Agenda />}
          />

          <Route
            path="/organizer-dashboard"
            element={<OrganizerDashboard />}
          />

          <Route
            path="/create-event"
            element={<CreateEvent />}
          />
<Route
  path="/events/:eventId/add-session"
  element={<AddSession />}
/>
        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;