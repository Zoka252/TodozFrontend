import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [ime, setIme] = useState('');
    const [sifra, setSifra] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!ime.trim() || !sifra.trim()) {
            setError('Unesite ime i šifru.');
            return;
        }

        try {
            // 1. Proveravamo da li korisnik postoji
            const res = await fetch(`http://localhost:3001/korisnici?ime=${ime}&sifra=${sifra}`);
            const data = await res.json();

            if (data.length > 0) {
                // Postoji korisnik
                localStorage.setItem('vukan', data[0].id);
                navigate('/');
            } else {
                // 2. Ne postoji – pravimo novog korisnika
                const postRes = await fetch('http://localhost:3001/korisnici', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ime, sifra })
                });

                if (!postRes.ok) throw new Error('Greška prilikom kreiranja korisnika');

                const newUser = await postRes.json();
                localStorage.setItem('vukan', newUser.id);
                navigate('/');
            }

        } catch (err) {
            console.error(err);
            setError('Greška pri loginu.');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Ime"
                    value={ime}
                    onChange={(e) => setIme(e.target.value)}
                /><br />
                <input
                    type="password"
                    placeholder="Šifra"
                    value={sifra}
                    onChange={(e) => setSifra(e.target.value)}
                /><br />
                <button type="submit">Prijavi se</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
