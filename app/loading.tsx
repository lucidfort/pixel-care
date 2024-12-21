import { Loader } from "lucide-react";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="w-full h-screen flex-center">
      <p className="header flex items-center gap-3">
        <Loader className="animate-spin" /> Loading...
      </p>
    </div>
  );
}
