export default function BlockedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-6 greenTheme">Access Denied</h1>
        <p className="text-lg mb-8">Your country is not allowed to access this site.</p>
        <div className="w-16 h-16 mx-auto mb-8">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <div className="border-t border-gray-600 pt-6">
          <p className="text-sm text-gray-400">If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
}
