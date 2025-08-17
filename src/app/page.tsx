import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Welcome to Our Store
          </h1>
          <p className="text-xl text-secondary-600 mb-8">
            Discover amazing products both digital and physical
          </p>
          
          <div className="bg-primary-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-primary-900 mb-4">
              🎉 Authentication System Ready!
            </h2>
            <p className="text-primary-700">
              You can now register, login, and manage user accounts.
              Next, we'll add the product catalog and shopping cart.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}