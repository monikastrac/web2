import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import TicketGenerator from './TicketGenerator';
import TicketDetails from './TicketDetails';
import LogoutButton from './LogoutButton';

const App = () => {
  const { isAuthenticated, user } = useAuth0();
  const [ticketCount, setTicketCount] = useState(0);

  // Dohvati broj ulaznica iz Firestore baze
  useEffect(() => {
    const fetchTicketCount = async () => {
      const ticketsRef = collection(db, 'tickets');
      const snapshot = await getDocs(ticketsRef);
      setTicketCount(snapshot.size); // Postavlja broj ulaznica
    };
    fetchTicketCount();
  }, []);

  return (
    <Router>
      <div className="App">
        <header>
          {isAuthenticated && <p>Pozdrav, {user.name || user.email}!</p>}
          <LogoutButton />
        </header>
        <h2>Ukupan broj generiranih ulaznica: {ticketCount}</h2>
        <Routes>
          <Route path="/" element={<TicketGenerator />} />
          <Route
            path="/ticket/:id"
            element={
              <TicketDetails />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
