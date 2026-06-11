import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Error en renderizado:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-white max-w-2xl text-center">
            <h1 className="text-3xl font-black text-slate-900 mb-4">Error al cargar el panel</h1>
            <p className="text-slate-500 font-bold mb-6">
              Ocurrió un problema inesperado. Recarga la página o revisa la consola del navegador.
            </p>
            <pre className="text-left text-xs text-rose-600 bg-rose-50 p-4 rounded-2xl overflow-x-auto">
              {this.state.error?.message}
            </pre>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
