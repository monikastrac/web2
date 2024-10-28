import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { useAuth0 } from '@auth0/auth0-react';
import { QRCodeCanvas } from 'qrcode.react';

const TicketGenerator = () => {
  const { isAuthenticated, loginWithRedirect} = useAuth0();
  const [vatin, setVatin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const ticketsRef = collection(db, 'tickets');

  const isValidOIB = (oib) => {
    return /^\d{11}$/.test(oib); // sadrzi li oib tocno 11 znamenki
  };

  const handleGenerateTicket = async () => {
    setErrorMessage('');

    if (!vatin || !firstName || !lastName) {
      setErrorMessage('Molimo popunite sva polja');
      return;
    }

    if (!isValidOIB(vatin)) {
      setErrorMessage('OIB mora imati točno 11 znamenki.');
      return;
    }

    try {
      // provjera broja izdanih ulaznica po oibu - max 3
      const q = query(ticketsRef, where('vatin', '==', vatin));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size >= 3) {
        setErrorMessage('Za ovaj OIB je već izdano 3 ulaznica.');
        return;
      }

      // UUID se postavljaju od 1 do n po redu
      const maxUUIDQuery = query(ticketsRef, orderBy('UUID', 'desc'), limit(1));
      const maxUUIDSnapshot = await getDocs(maxUUIDQuery);
      const maxUUID = maxUUIDSnapshot.docs.length > 0 ? maxUUIDSnapshot.docs[0].data().UUID : 0;
      const newUUID = maxUUID + 1;

      const newTicketData = {
        UUID: newUUID,
        firstName,
        lastName,
        vatin,
        generatedAt: Timestamp.now(),
      };

      await addDoc(ticketsRef, newTicketData);
      setQrCodeUrl(`${window.location.origin}/ticket/${newUUID}`);
      alert('Ulaznica uspješno generirana');

    } catch (error) {
      setErrorMessage('Greška');
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <p>Prijavite se prije nastavka.</p>
        <button onClick={loginWithRedirect}>Prijavi se</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Generiraj</h2>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <input
        type="text"
        placeholder="OIB"
        value={vatin}
        onChange={(e) => setVatin(e.target.value)}
      />
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <button onClick={handleGenerateTicket}>Generiraj</button>

      {qrCodeUrl && (
        <div>
          <h3>Your Ticket QR Code:</h3>
          <QRCodeCanvas value={qrCodeUrl} />
          <p>URL: {qrCodeUrl}</p>
        </div>
      )}
    </div>
  );
};

export default TicketGenerator;
