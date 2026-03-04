import { useEffect,useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "./features/auth/auth.slice";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);

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
      <Analytics />
    </>
  );
}

export default App;