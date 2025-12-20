//components/registro.tsx

'use client';
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Registro() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nick: "",
    gremio: "",
    telefono: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nick: form.nick,
          gremio: form.gremio,
          telefono: form.telefono,
        },
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/login");
  };

  return (
    <form onSubmit={submit}>
      {/* inputs email, password, nick, etc */}
    </form>
  );
}
