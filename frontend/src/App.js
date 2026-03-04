import { useEffect,useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "./features/auth/auth.slice";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { keepBackendAlive } from "./features/journal/utils/keepBackendAlive";
function App() {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    keepBackendAlive();
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(setToken(token));
    }

    setReady(true);
  }, [dispatch]);

  if (!ready) return null; // or loader

  return (
    <>
      <Toaster position="top-center" />
      <AppRoutes />
    </>
  );
}

export default App;