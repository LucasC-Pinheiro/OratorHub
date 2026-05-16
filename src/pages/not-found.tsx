import { useNavigate } from "react-router-dom";
import { NotFound } from "@/components/ui/not-found";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <NotFound
      title="404 - Page Not Found"
      description="The page you're looking for doesn't exist or may have been moved."
      action={{
        label: "Go to Dashboard",
        onClick: () => navigate("/dashboard"),
      }}
    />
  );
}
