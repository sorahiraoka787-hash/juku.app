import { supabase } from "./supabase";

export const login = async (email: string, password: string) => {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) throw error;

  return data.user;
};

export const getUserRole = async (email: string) => {
  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("email", email)
    .single();

  return data?.role;
};