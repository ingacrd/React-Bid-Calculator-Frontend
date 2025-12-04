
import { BidCalculatorPage } from './pages/BidCalculatorPage';

function App() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Bid Calculator</h1>
        <p className="text-sm text-slate-600 mb-6">
          Enter a base price and vehicle type to calculate all fees and the final total.
        </p>
        <BidCalculatorPage />
      </div>
    </main>
  );
}

export default App
