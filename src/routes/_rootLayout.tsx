import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_rootLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Pathless layout</h1>
      <Outlet />
    </div>
  )
}
