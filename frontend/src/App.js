import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CallManagement from "./CallManagement"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CallManagement />} />
            </Routes>
        </Router>
    );
}

export default App;

