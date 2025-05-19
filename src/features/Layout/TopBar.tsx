import { Bell, LucideCircleUser, MessageSquare } from 'lucide-react';

export function TopBar() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background shadow-sm">
      {/* Left: Text logo */}
      <div className="flex items-center gap-3">
        <span
          className="ml-17 font-pacifico text-primaryBlue text-3xl select-none"
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          Rootly
        </span>
      </div>

      {/* Center: Search bar */}
      <div className="flex-1 max-w-lg mx-6">
        <input
          type="search"
          placeholder="Type to search ..."
          className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 caret-gray-700"
        />
      </div>

      {/* Right: User icon + buttons */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Messages"
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primaryBlue relative"
        >
          <MessageSquare className="w-5 h-5 text-gray-700" />

          <span className="absolute top-0 left-5 flex h-4 w-4 items-center justify-center rounded-full bg-primaryBlue text-white text-xs font-semibold">
            1
          </span>
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primaryBlue relative"
        >
          <Bell className="w-5 h-5 text-gray-700" />

          <span className="absolute top-0 left-5 flex h-4 w-4 items-center justify-center rounded-full bg-primaryBlue text-white text-xs font-semibold">
            9
          </span>
        </button>

        <button
          type="button"
          aria-label="User Account"
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primaryBlue"
        >
          <LucideCircleUser className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </header>
  );
}
