import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProfileId from "./pages/ProfileId";
import Profiles from "./pages/Profiles";
import CreateBiodata from "./pages/CreateBiodata";
import UpdateBiodata from "./pages/UpdateBiodata";

import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<ProfileId />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/profiles/:id" element={<ProfileId />} />
            <Route path="/create-biodata" element={<CreateBiodata />} />
            <Route path="/update-biodata/:id" element={<UpdateBiodata />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
