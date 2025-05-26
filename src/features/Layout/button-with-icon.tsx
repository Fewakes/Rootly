import { Button } from '@/components/ui/button';

interface ButtonWithIconProps {
  children: React.ReactNode;

  onClick?: () => void;
}

export function ButtonWithIcon({ children, onClick }: ButtonWithIconProps) {
  return (
    <Button
      onClick={onClick}
      className="bg-primaryBlue hover:bg-primaryBlue/90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryBlue transition-all rounded-md h-10 px-5 text-white flex items-center justify-center gap-2 mt-5 mx-auto text-sm font-medium"
    >
      <span>{children}</span>
    </Button>
  );
}
