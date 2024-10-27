import { useAuth0 } from "@auth0/auth0-react";

function Profile() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  if (!isAuthenticated) {
    return <button onClick={loginWithRedirect}>Log in</button>;
  }

  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Log out
      </button>
    </div>
  );
}
