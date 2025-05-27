import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';

interface LoginProps {
    onLoginSuccess: (userId: string, username: string) => void;
}

function Login({ onLoginSuccess }: LoginProps) {
    const [username, setUsername] = useState('');
    const [sifra, setSifra] = useState('');
    const [error, setError] = useState('');
    const [showRegisterOption, setShowRegisterOption] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setShowRegisterOption(false);

        try {
            const res = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, sifra }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Greška pri logovanju');
                if (data.error?.includes('ne postoji')) {
                    setShowRegisterOption(true);
                }
                return;
            }

            onLoginSuccess(data.id, username);
            navigate('/');
        } catch {
            setError('Greška pri povezivanju sa serverom');
        }
    };

    const handleRegister = async () => {
        try {
            const res = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, sifra }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Greška pri kreiranju naloga');
                return;
            }

            onLoginSuccess(data.id, username);
            navigate('/');
        } catch {
            setError('Greška pri povezivanju sa serverom');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Korisničko ime"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Šifra"
                    value={sifra}
                    onChange={e => setSifra(e.target.value)}
                    required
                />
                <button type="submit">Prijavi se</button>
                {error && <p className={styles.error}>{error}</p>}
                {showRegisterOption && (
                    <div className={styles.registerPrompt}>
                        <p>Korisnik ne postoji. Želite da napravite novi nalog?</p>
                        <button type="button" onClick={handleRegister}>
                            Kreiraj nalog
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default Login;
