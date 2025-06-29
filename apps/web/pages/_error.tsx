import { NextPageContext } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'

interface ErrorProps {
  statusCode?: number
  hasGetInitialPropsRun?: boolean
  err?: Error
}

function ErrorPage({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) {
  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-red-500/10 rounded-full">
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>
          </div>

          {/* Error Text */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-200">
              {statusCode ? `Error ${statusCode}` : 'Application Error'}
            </h1>
            <p className="text-gray-400">
              {statusCode === 404
                ? 'The page you\'re looking for doesn\'t exist.'
                : 'An unexpected error occurred. Please try again.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 rounded-xl px-6 h-12 font-medium shadow-lg shadow-pink-500/25 transition-all duration-300">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10 hover:border-pink-500/50 rounded-xl px-6 h-12 font-medium transition-all duration-300"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && err && (
            <div className="mt-8 p-4 bg-gray-800/50 rounded-lg text-left">
              <h3 className="text-sm font-semibold text-red-400 mb-2">Debug Info:</h3>
              <pre className="text-xs text-gray-300 whitespace-pre-wrap overflow-auto">
                {err.message}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default ErrorPage