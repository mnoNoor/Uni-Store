export default function SearchBar({ query, setQuery, sortBy, setSortBy }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="w-full max-w-lg">
        <label htmlFor="search" className="sr-only">
          Search books
        </label>

        <div className="relative">
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, author or description..."
            className="w-full pl-4 pr-10 py-2 rounded-md border focus:outline-none focus:ring focus:border-green-300"
          />
        </div>
      </div>

      <div className="ml-4 flex items-center space-x-2">
        <label htmlFor="sort" className="text-sm text-gray-600">
          Sort
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="py-2 px-3 border rounded-md bg-white"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>
    </div>
  );
}
