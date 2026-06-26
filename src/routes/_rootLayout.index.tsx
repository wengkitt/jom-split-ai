import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_rootLayout/')({ component: HomePage })

function HomePage() {
  return <h1>Welcome to Jom Split</h1>
}
