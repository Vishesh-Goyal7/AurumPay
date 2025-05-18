import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import HomePage from './pages/HomePage';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import UserDashboard from './pages/UserDashboard';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import TransferPage from './pages/TransferPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        }/>

        <Route path="/deposit" element={
          <PrivateRoute>
            <DepositPage />
          </PrivateRoute>
        }/>

        <Route path="/withdraw" element={
          <PrivateRoute>
            <WithdrawPage />
          </PrivateRoute>
        }/>

        <Route path="/transfer" element={
          <PrivateRoute>
            <TransferPage />
          </PrivateRoute>
        }/>

        <Route path="/history" element={
          <PrivateRoute>
            <TransactionHistoryPage />
          </PrivateRoute>
        }/>
      </Routes>
    </Router>
  );
}

export default App;
