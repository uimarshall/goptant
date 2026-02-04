import WikiEditor from "@/components/BlogEditor";
import { stackServerApp } from "@/stack/server";

export default async function NewArticlePage() {
  // Ensure the user is logged in before allowing them to create a new article.Else, redirect to the login page.
  await stackServerApp.getUser({ or: "redirect" });
  return <WikiEditor isEditing={false} />;
}
