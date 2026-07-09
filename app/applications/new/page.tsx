import {redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import NewApplicationClient from "./NewApplicationClient";

export default async function NewApplicationPage() {
  const user = await getCurrentUser();

  if(!user){
    redirect("/auth");
  }

  return <NewApplicationClient/>;
}