/**
 * Helper to construct edge function URLs using environment variables.
 * Avoids hardcoding production Supabase URLs across the codebase.
 */
export function getEdgeFunctionUrl(functionName: string): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL environment variable is not set');
  }
  return `${supabaseUrl}/functions/v1/${functionName}`;
}
