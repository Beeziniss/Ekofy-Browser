import { redirect } from "next/navigation";

export default function NotFound() {
  // Redirect to your custom 404 page
  redirect("/404");
}
