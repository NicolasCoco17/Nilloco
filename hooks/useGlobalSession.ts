// hooks/useGlobalSession.ts

'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function useGlobalSession() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
  const [userNick, setUserNick] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const loadSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsLoggedIn(false);
        setUserNick(null);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);

      const { data: profile, error } = await supabase
        .from("usuarios")
        .select("nick")
        .eq("id", user.id)
        .single();

      if (!error && profile) {
        setUserNick(profile.nick);
      } else {
        setUserNick(null);
      }

      setLoading(false);
    };

    loadSession();

    // 🔁 escucha cambios de sesión (login / logout)
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadSession();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async (redirectPath: string = "/") => {
    await supabase.auth.signOut();

    setIsLoggedIn(false);
    setUserNick(null);

    router.replace(redirectPath);
  };

  return {
    isLoggedIn,
    userNick,
    loading,
    logout,
  };
}
