import { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { RegisterTalkDialog } from "@/components/talks/register-talk-dialog";

export function DashboardLayout() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const navigate = useNavigate();

  const openRegister = useCallback(() => setRegisterOpen(true), []);

  const handleCreated = useCallback(() => {
    navigate("/painel");
  }, [navigate]);

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      <div className="hidden md:flex">
        <Sidebar onNewTalk={openRegister} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onNewTalk={openRegister} />
        <main className="flex-1 overflow-y-auto scrollbar-thin pb-24 md:pb-0">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
            <Outlet context={{ openRegister }} />
          </div>
        </main>
      </div>

      <BottomNav onNewTalk={openRegister} />

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
