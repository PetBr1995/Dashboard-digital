import { DesktopHeader } from '@/components/header';
import {SideBar} from '../components/sidebar/index'
import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <SideBar/>
        <DesktopHeader/>
        {children}
      </body>
    </html>
  );
}
