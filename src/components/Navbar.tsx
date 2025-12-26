import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

function Navbar() {
  const flexContainerClasses = 'flex items-center justify-between';

  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur-sm supports-backdrop-filter:bg-white/60 sticky top-0 z-50">
      <div className={`container mx-auto px-4 h-16 ${flexContainerClasses}`}>
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gray-900 hover:text-gray-600"
        >
          Goptant
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-2">
            <NavigationMenuItem>
              <Button asChild variant={'outline'}>
                <Link href="/signin">Sign In</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}

export default Navbar;
