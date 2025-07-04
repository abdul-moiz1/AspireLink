import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // For now, simulate unauthenticated state since API routes have issues
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error
  };
}