import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { MerchantsPage } from "@/pages/MerchantsPage";
import { TransactionsPage } from "@/pages/TransactionsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/transactions" replace />} />
        <Route path="merchants" element={<MerchantsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
