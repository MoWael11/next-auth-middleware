import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
export default async function Home() {
  await getServerSession(authOptions);
  return <main></main>;
}
