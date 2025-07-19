import { ReactNode } from 'react';

interface MenuSectionProps {
  title: string;
  icon?: string;
  children: ReactNode;
}

const MenuSection = ({ title, icon, children }: MenuSectionProps) => (
  <section className="py-6 bg-brown-dark">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-bold font-bungee text-center mb-12">
        {icon && (
          <span className="mr-2 text-3xl inline-block align-middle">
            {icon}
          </span>
        )}
        <span className="text-amber-900">
          {title}
        </span>
      </h2>
      {children}
    </div>
  </section>
);

export default MenuSection;