import Home from '../pages/Home/Home.tsx'
import { createBrowserRouter} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <div>login</div>
    },
    {
        path: "/Home",
        element: <Home />
    }
])

export default router;