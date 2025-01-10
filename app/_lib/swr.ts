import { useSWRConfig } from "swr";

export function useMutateAll() {
  const { mutate } = useSWRConfig();

  return () => {
    mutate("/api/twitts");
    mutate("/api/twitts/comments");
    mutate("/api/user/twitts");
    mutate("/api/user/info");
  }
}

export const refreshInterval = 10000;