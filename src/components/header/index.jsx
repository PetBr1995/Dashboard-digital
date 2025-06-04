'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rss, Users, Book, Compass, FileText, Library, FileCode, MoreHorizontal, Search, Bell, X, Inbox } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function DesktopHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const searchRef = useRef(null);
  const searchButtonRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Fechar menus ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      // Fechar menu principal
      if (isMenuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          menuButtonRef.current &&
          !menuButtonRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      
      // Fechar busca
      if (isSearchOpen && 
          searchRef.current && 
          !searchRef.current.contains(event.target) &&
          searchButtonRef.current &&
          !searchButtonRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [isMenuOpen, isSearchOpen]);

  // Atualizar busca com debounce manual
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchQuery) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('q', searchQuery);
        router.push(`${pathname}?${params.toString()}`);
      } else if (searchParams.get('q')) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('q');
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, pathname, router, searchParams]);

  // Atualizar o estado inicial com os parâmetros da URL
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
    if (query) setIsSearchOpen(true);
  }, [searchParams]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchRef.current?.querySelector('input')?.focus();
      }, 0);
    } else {
      setSearchQuery('');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="sm:ml-14 p-6 hidden sm:flex items-center justify-between px-6 py-4 border-b gap-10 relative">
      {/* Barra de pesquisa */}
      {isSearchOpen && (
        <div className="absolute inset-0 bg-background z-10 flex items-center px-6">
          <div className="relative w-full max-w-3xl mx-auto" ref={searchRef}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="pl-10 pr-10 w-full text-lg py-6"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={handleClearSearch}
            >
              <X className="h-5 w-5 text-gray-400" />
            </Button>
          </div>
        </div>
      )}

      {/* Menu principal */}
      <div className={`flex items-center space-x-6 ${isSearchOpen ? 'invisible' : ''}`}>
        <nav className="flex space-x-6">
          <Link href="#" className="flex items-center space-x-2 text-sm font-medium hover:text-gray-900 border-1 py-1 px-3 rounded-2xl shrink-0">
            <Rss className="h-8 w-8 bg-black rounded-full text-white p-1.5 items-center justify-center" />
            <span>Feed</span>
          </Link>
          <Link href="#" className="flex items-center space-x-2 text-sm font-medium hover:text-gray-900 border-1 py-1 px-3 rounded-2xl shrink-0 md:inline-flex hidden">
            <Users className="h-8 w-8 bg-black rounded-full text-white p-1.5 justify-center items-center" />
            <span>Membros</span>
          </Link>
          <Link href="#" className="flex items-center space-x-2 text-sm font-medium hover:text-gray-900 border-1 py-1 px-3 rounded-2xl shrink-0 lg:inline-flex hidden">
            <Book className="h-8 w-8 bg-black rounded-full text-white p-1.5 justify-center items-center" />
            <span>Cursos</span>
          </Link>
          <Link href="#" className="flex items-center space-x-2 text-sm font-medium hover:text-gray-900 border-1 py-1 px-3 rounded-2xl shrink-0 xl:inline-flex hidden">
            <Compass className="h-8 w-8 bg-black text-white rounded-full p-1.5 justify-center items-center" />
            <span>Guias</span>
          </Link>
          <Link href="#" className="flex items-center space-x-2 text-sm font-medium hover:text-gray-900 border-1 py-1 px-3 rounded-2xl shrink-0 2xl:inline-flex hidden">
            <FileText className="h-8 w-8 bg-black text-white rounded-full p-1.5 justify-center items-center" />
            <span>Processos</span>
          </Link>
          <Link href="#" className="flex items-center space-x-2 text-sm font-medium hover:text-gray-900 border-1 py-1 px-3 rounded-2xl shrink-0 2xl:inline-flex hidden">
            <Library className="h-8 w-8 bg-black text-white rounded-full p-1.5 justify-center items-center" />
            <span>Biblioteca</span>
          </Link>
          <Link href="#" className="flex items-center space-x-2 text-sm font-medium hover:text-gray-900 border-1 py-1 px-3 rounded-2xl shrink-0 2xl:inline-flex hidden">
            <FileCode className="h-8 w-8 bg-black text-white rounded-full p-1.5 justify-center items-center" />
            <span>Código de Cultura</span>
          </Link>
          <div className="relative" ref={menuRef}>
            <Link
              href="#"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 text-sm font-medium hover:text-gray-900 py-1 px-3 rounded-2xl shrink-0 2xl:hidden"
              ref={menuButtonRef}
            >
              <MoreHorizontal className="h-8 w-8 bg-white text-black p-1.5 justify-center items-center" />
            </Link>
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-md min-w-[250px] z-50">
                <div className="pb-2">
                  <Link href="#" className="flex gap-2 items-center px-4 py-2 text-sm hover:bg-gray-100 2xl:hidden" onClick={() => setIsMenuOpen(false)}>
                    <FileCode className="w-4 h-4" />
                    Código de Cultura
                  </Link>
                  <Link href="#" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 2xl:hidden" onClick={() => setIsMenuOpen(false)}>
                    <Library className="w-4 h-4" />
                    Biblioteca
                  </Link>
                  <Link href="#" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 xl:hidden" onClick={() => setIsMenuOpen(false)}>
                    <FileText className="w-4 h-4" />
                    Processos
                  </Link>
                  <Link href="#" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 lg:hidden" onClick={() => setIsMenuOpen(false)}>
                    <Compass className="w-4 h-4" />
                    Guias
                  </Link>
                  <Link href="#" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 md:hidden" onClick={() => setIsMenuOpen(false)}>
                    <Users className="w-4 h-4" />
                    Membros
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Ícones do lado direito */}
      <div className={`flex items-center space-x-4 ${isSearchOpen ? 'invisible' : ''}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSearchToggle}
          ref={searchButtonRef}
        >
          <Search className="h-6 w-6" />
        </Button>

        {/* Notificações com Dialog e Tooltip */}
        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                <DialogTrigger asChild>
                  <div>
                    <Bell className="h-4 w-4" />
                  </div>
                </DialogTrigger>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Notificações
            </TooltipContent>
          </Tooltip>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notificações</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Você não tem novas notificações
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Mensagens com Tooltip */}
        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                <DialogTrigger asChild>
                  <div>
                    <Inbox className="h-4 w-4" />
                  </div>
                </DialogTrigger>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Notificações
            </TooltipContent>
          </Tooltip>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mensagens</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Você não tem novas mensagens
              </p>
            </div>
          </DialogContent>
        </Dialog>
        <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
          <img 
            src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png" 
            alt="User" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
    </header>
  );
}