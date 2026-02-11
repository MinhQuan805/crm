import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
  resetKeys?: Array<unknown>
}

type ErrorBoundaryState = {
  hasError: boolean
}

function areResetKeysEqual(prevKeys?: Array<unknown>, nextKeys?: Array<unknown>): boolean {
  if (prevKeys === nextKeys) return true
  if (!prevKeys || !nextKeys) return false
  if (prevKeys.length !== nextKeys.length) return false
  return prevKeys.every((key, index) => Object.is(key, nextKeys[index]))
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.hasError && !areResetKeysEqual(prevProps.resetKeys, this.props.resetKeys)) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Something went wrong. Please try again.
          </div>
        )
      )
    }

    return this.props.children
  }
}
