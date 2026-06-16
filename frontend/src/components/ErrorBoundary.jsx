import { Component } from 'react'
import Button from './common/Button.jsx'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info)
  }

  handleReset = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('agent')
    window.location.href = '/login'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-xl font-bold text-gray-900">Something went wrong</h1>
            <p className="text-sm text-gray-500">
              The app hit an unexpected error. Try clearing your session and signing in again.
            </p>
            <Button onClick={this.handleReset}>Go to Login</Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
