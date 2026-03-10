import db from "@/utils/db";
import AuthScreen from "../screens/auth-screen";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  return (
    <>
      <db.SignedIn>{children}</db.SignedIn>
      <db.SignedOut>
        <AuthScreen />
      </db.SignedOut>
    </>
  );
}
