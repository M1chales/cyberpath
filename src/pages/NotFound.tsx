import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-3xl text-emerald-400">404</p>
      <h1 className="mt-4 text-xl font-bold text-white">Nothing here</h1>
      <p className="mt-2 text-sm text-slate-400">That page doesn't exist, or the link's out of date.</p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-300"
      >
        Back to homepage
      </Link>
    </div>
  )
}
