import { redirectToLogin } from "@/lib/redirect";

export default function Home() {
  redirectToLogin();
  return null;
}