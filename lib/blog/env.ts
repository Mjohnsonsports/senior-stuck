export function getCMSDatabaseStatus() {
  const value = process.env.SUPABASE_DATABASE_URL?.trim();

  if (!value) {
    return {
      configured: false,
      message: "SUPABASE_DATABASE_URL is missing.",
    };
  }

  if (!value.startsWith("postgres://") && !value.startsWith("postgresql://")) {
    return {
      configured: false,
      message:
        "SUPABASE_DATABASE_URL must be a Supabase Postgres connection string, not the public Supabase project URL.",
    };
  }

  return {
    configured: true,
    message: "",
  };
}
