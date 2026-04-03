import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import SupplyChain from './components/SupplyChain/SupplyChain';
import IRACreditTracker from './components/IRACreditTracker/IRACreditTracker';
import ShouldCost from './components/ShouldCost/ShouldCost';
import CostDown from './components/CostDown/CostDown';
import Capex from './components/Capex/Capex';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-peak-dark">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<SupplyChain />} />
            <Route path="/ira" element={<IRACreditTracker />} />
            <Route path="/should-cost" element={<ShouldCost />} />
            <Route path="/cost-down" element={<CostDown />} />
            <Route path="/capex" element={<Capex />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
