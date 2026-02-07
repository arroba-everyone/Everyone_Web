import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@everyone-web/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@everyone-web/ui/sheet';
import { cn } from '@everyone-web/libs/utils';
import { Link } from '@tanstack/react-router';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Sobre nosotros', href: '/aboutUs' },
  { label: 'Blog', href: '/blog' },
  { label: '@everyone', href: '/' },
  { label: 'Proyectos', href: '/projects' },
  { label: 'Contacto', href: '/contact' },
];

export function Navbar() {
  const [activeItem, setActiveItem] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;

    const currentItem = navItems.find(item => item.href === currentPath);
    setActiveItem(currentItem ? currentItem.label : '@everyone');
  }, []);

  const renderNavItems = () => {
    return navItems.map(item => (
      <Link
        key={item.label}
        to={item.href}
        className={cn(
          'relative px-8 py-3 rounded-4xl lg:rounded-full font-semibold text-base',
          activeItem === item.label ? 'bg-primary text-primary-foreground' : 'text-primary'
        )}
      >
        {item.label}
      </Link>
    ));
  };

  return (
    <nav className="w-11/12 lg:w-fit rounded-4xl lg:rounded-full bg-background fixed top-10 left-0 right-0 z-1 mx-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-1">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center h-15 gap-8">
          {renderNavItems()}
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between h-16">
          <div className="text-primary font-bold text-xl">{activeItem}</div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-background p-4 w-[280px]">
              <div className="flex flex-col gap-4 mt-8">{renderNavItems()}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
