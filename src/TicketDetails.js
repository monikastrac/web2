import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const TicketDetails = () => {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const { id: ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketsRef = collection(db, 'tickets');
        const q = query(ticketsRef, where("UUID", "==", Number(ticketId)));
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
          const ticketData = querySnapshot.docs[0].data();
          setTicket(ticketData);
          setErrorMessage('');
        } else {
          setErrorMessage('Ulaznica nije pronađena.');
        }
      } catch (error) {
        setErrorMessage('Greška');
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleLoginRedirect = () => {
    loginWithRedirect({
      appState: { returnTo: window.location.href }, // vrati na proslu stranicu nakon logina
    });
  };

  return (
    <div>
      <h2>Detalji ulaznice</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {ticket ? (
        <div>
          {isAuthenticated ? ( // ako je korisnik ulogiran prikaži detalje
            <>
              <p>OIB: {ticket.vatin}</p>
              <p>Ime: {ticket.firstName}</p>
              <p>Prezime: {ticket.lastName}</p>
              <p>Generirano: {ticket.generatedAt.toDate().toLocaleString()}</p>
              <p>Trenutni korisnik: {user.name}</p>
            </>
          ) : (
            <div>
              <p>Nemate pristupa informacijama o ulaznici. Prijavite se.</p>
              <button onClick={handleLoginRedirect}>Prijavi se</button>
            </div>
          )}
        </div>
      ) : (
        <p>Ulaznica nije pronađena.</p>
      )}
    </div>
  );
};

export default TicketDetails;
