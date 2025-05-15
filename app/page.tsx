import { redirect } from "next/navigation"

export default function Home() {
  // In a real app, check if user is authenticated
  // For now, redirect to login page
  redirect("/login")

  return null
}
