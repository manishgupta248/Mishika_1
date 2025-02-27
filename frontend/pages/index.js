import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <h1>University App</h1>
      <p>Welcome! Please choose an action:</p>
      <button onClick={() => router.push('/login')}>Login</button>
      <button onClick={() => router.push('/register')}>Register</button>
    </div>
  );
}