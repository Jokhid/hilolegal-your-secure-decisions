import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/administracion-fincas")({
  component: () => <Outlet />,
});
