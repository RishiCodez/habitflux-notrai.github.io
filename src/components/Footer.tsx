
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Selflo</h3>
              <p className="text-muted-foreground max-w-md">
                Elevating digital design through simplicity, functionality, and beauty. Create stunning interfaces that your users will love.
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "Documentation", "Releases"].map((item) => (
                <li key={item}>
                  <a 
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <a 
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Selflo. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <a 
                key={item}
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
