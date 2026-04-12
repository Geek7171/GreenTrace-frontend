import { Redirect } from 'expo-router';

export default function Index() {
  // The RootLayout _layout.jsx already handles the auth state check
  // and redirecting to the correct auth/tabs screen once mounted.
  // This index file simply ensures the "/" route is matched to avoid 
  // the "Unmatched Route" warning on initial app launch.
  return null;
}
