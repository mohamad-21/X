import { UserWithFollows } from "./definitions";

export async function getUserDetailsFromAPI(id: number | string) {
  const resp = await fetch(`${process.env.AUTH_URL}/api/user/details?id=${id}`);
  const data: UserWithFollows = await resp.json();
  return data;
}