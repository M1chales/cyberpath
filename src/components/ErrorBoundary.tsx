import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

// Catches render-time crashes (a corrupted localStorage save, a bug in one page) so the whole
// app doesn't white-screen — the rest of a visitor's progress lives in localStorage and survives
// a reset of just the broken part.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled error in app tree:', error, info.componentStack)
  }

  resetAndReload = () => {
    this.setState({ error: null })
    window.location.href = '/'
  }

  clearDataAndReload = () => {
    try {
      window.localStorage.clear()
    } catch {
      // localStorage unavailable — nothing to clear
    }
    window.location.href = '/'
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
        <p className="font-mono text-3xl text-emerald-400">&gt;_</p>
        <h1 className="mt-4 text-xl font-bold text-white">Something crashed</h1>
        <p className="mt-2 text-sm text-slate-400">
          This page hit an unexpected error. Your saved progress is untouched — going back to the homepage should
          fix it.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={this.resetAndReload}
            className="rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-300"
          >
            Back to homepage
          </button>
          <button
            onClick={this.clearDataAndReload}
            className="rounded-md border border-white/15 px-4 py-2 text-sm text-slate-300 hover:border-white/30"
          >
            Reset saved data
          </button>
        </div>
        <p className="mt-6 max-w-sm font-mono text-xs text-slate-600">{this.state.error.message}</p>
      </div>
    )
  }
}
