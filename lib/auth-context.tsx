"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { DbProfile, AccountType } from "@/lib/supabase/types";

export type { AccountType };

export interface Beneficiary {
  name: string;
  age: number;
}

// Perfil combinado: datos de auth.users + tabla profiles
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  accountType: AccountType | null;
  beneficiary?: Beneficiary;
  providerId?: string;   // cargado por las páginas de proveedor según se necesite
}

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function userToProfile(authUser: User, profile: DbProfile | null): UserProfile {
  return {
    id: authUser.id,
    email: authUser.email ?? "",
    displayName:
      profile?.display_name ??
      authUser.user_metadata?.full_name ??
      authUser.user_metadata?.name ??
      authUser.email?.split("@")[0] ??
      "Usuario",
    avatarUrl:
      profile?.avatar_url ??
      authUser.user_metadata?.avatar_url ??
      undefined,
    accountType: profile?.account_type ?? null,
    beneficiary:
      profile?.beneficiary_name && profile?.beneficiary_age
        ? { name: profile.beneficiary_name, age: profile.beneficiary_age }
        : undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (authUser: User) => {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single<DbProfile>();
    setUser(userToProfile(authUser, profile));
  }, []);

  const refreshProfile = useCallback(async () => {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) await loadProfile(authUser);
  }, [loadProfile]);

  useEffect(() => {
    const supabase = createClient();

    // Carga inicial
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      console.log("[AuthContext] getUser() resolved — user:", authUser?.id ?? "null");
      if (authUser) {
        loadProfile(authUser).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Suscripción a cambios de sesión (login / logout / token refresh)
    // IMPORTANTE: el callback NO debe hacer `await` de llamadas a Supabase.
    // onAuthStateChange se ejecuta con un lock interno tomado; consultar la BD
    // (loadProfile → supabase.from(...)) dentro del callback provoca un deadlock
    // y `setIsLoading(false)` nunca se ejecuta. Por eso diferimos con setTimeout.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("[AuthContext] onAuthStateChange event:", event, "has session:", !!session?.user);
        if (session?.user) {
          const authUser = session.user;
          setTimeout(() => {
            loadProfile(authUser)
              .catch((e) =>
                console.error("[AuthContext] loadProfile error:", e)
              )
              .finally(() => setIsLoading(false));
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signInWithGoogle = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    // La página se redirige; el usuario volverá vía /auth/callback
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    // Navegación completa (no router.push) para que el servidor re-renderice
    // sin cookies de sesión y no queden guards redirigiendo a /auth/login
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
