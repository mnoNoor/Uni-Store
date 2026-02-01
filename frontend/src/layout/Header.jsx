export default function Header() {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-500 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
            U
          </div>
          <div>
            <h1 className="text-xl font-bold">Uni Shop</h1>
            <p className="text-xs opacity-90">University books marketplace</p>
          </div>
        </div>
      </div>
    </header>
  );
}
