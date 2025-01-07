
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function SearchBar() {
  return (
    <div className="flex-1 flex items-center justify-end px-2 lg:ml-6">
    <div className="max-w-lg w-full lg:max-w-xs">
      <label htmlFor="search" className="sr-only">Search</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <Input
          id="search"
          name="search"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search"
          type="search"
        />
      </div>
    </div>
  </div>
  )
}
