import { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { RegisterTalkDialog } from "@/components/talks/register-talk-dialog";

export function DashboardLayout() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const navigate = useNavigate();

  const openRegister = useCallback(() => setRegisterOpen(true), []);

  const handleCreated = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className="hidden md:flex">
        <Sidebar onNewTalk={openRegister} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onNewTalk={openRegister} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet context={{ openRegister }} />
          </div>
        </main>
      </div>

      <RegisterTalkDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onCreated={handleCreated}
      />
    </div>
  );
}

export type DashboardOutletContext = {
  openRegister: () => void;
};
