'use client'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Package, PanelBottom, Home, ShoppingBag, User, Settings, LogOut, Search, Bell, X, MenuIcon, Inbox } from "lucide-react"
import Link from "next/link"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Dialog } from '@/components/ui/dialog'

export function SideBar() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const searchRef = useRef(null)
    const searchButtonRef = useRef(null)
    const searchTimeoutRef = useRef(null)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded)
    }

    // Fechar busca ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (isSearchOpen &&
                searchRef.current &&
                !searchRef.current.contains(event.target) &&
                searchButtonRef.current &&
                !searchButtonRef.current.contains(event.target)) {
                setIsSearchOpen(false)
                setSearchQuery('')
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [isSearchOpen])

    // Atualizar busca com debounce manual
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            if (searchQuery) {
                const params = new URLSearchParams(searchParams.toString())
                params.set('q', searchQuery)
                router.push(`${pathname}?${params.toString()}`)
            } else if (searchParams.get('q')) {
                const params = new URLSearchParams(searchParams.toString())
                params.delete('q')
                router.push(`${pathname}?${params.toString()}`)
            }
        }, 500)

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [searchQuery, pathname, router, searchParams])

    // Atualizar o estado inicial com os parâmetros da URL
    useEffect(() => {
        const query = searchParams.get('q') || ''
        setSearchQuery(query)
        if (query) setIsSearchOpen(true)
    }, [searchParams])

    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen)
        if (!isSearchOpen) {
            // Foca no input quando a busca é aberta
            setTimeout(() => {
                searchRef.current?.querySelector('input')?.focus()
            }, 0)
        } else {
            setSearchQuery('')
        }
    }

    const handleClearSearch = () => {
        setSearchQuery('')
        setIsSearchOpen(false)
    }

    return (
        <>
            <style>
                {`
                    .sidebar-text {
                        opacity: 0;
                        transform: translateX(-10px);
                        transition: opacity 300ms ease, transform 300ms ease;
                        white-space: nowrap;
                    }
                    .sidebar-expanded .sidebar-text {
                        opacity: 1;
                        transform: translateX(0);
                    }
                `}
            </style>
            <div className="flex w-full flex-col bg-muted/40">
                <aside className={`fixed inset-y-0 left-0 z-10 hidden border-r bg-background sm:flex flex-col transition-all duration-300 ${isExpanded ? 'w-48 sidebar-expanded' : 'w-14'}`}>
                    <nav className="flex flex-col items-center gap-4 px-2 py-5">
                        <TooltipProvider>
                            <button onClick={toggleSidebar} className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-full mb-2">
                                <Package className="w-4 h-4" />
                                <span className="sr-only">Toggle Sidebar</span>
                            </button>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="#" className={`flex h-9 ${isExpanded ? 'w-full justify-start pl-4' : 'w-9 justify-center'} shrink-0 items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground`}>
                                        <Home className="w-5 h-5" />
                                        {isExpanded && <span className="ml-2 sidebar-text">Inicio</span>}
                                        {!isExpanded && <span className="sr-only">Home</span>}
                                    </Link>
                                </TooltipTrigger>
                                {!isExpanded && <TooltipContent side="left" className="bg-white text-black p-2 rounded-lg shadow-lg">Inicio</TooltipContent>}
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="#" className={`flex h-9 ${isExpanded ? 'w-full justify-start pl-4' : 'w-9 justify-center'} shrink-0 items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground`}>
                                        <ShoppingBag className="w-5 h-5" />
                                        {isExpanded && <span className="ml-2 sidebar-text">Pedidos</span>}
                                        {!isExpanded && <span className="sr-only">Pedidos</span>}
                                    </Link>
                                </TooltipTrigger>
                                {!isExpanded && <TooltipContent side="left" className="bg-white text-black p-2 rounded-lg shadow-lg">Pedidos</TooltipContent>}
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="#" className={`flex h-9 ${isExpanded ? 'w-full justify-start pl-4' : 'w-9 justify-center'} shrink-0 items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground`}>
                                        <Package className="w-5 h-5" />
                                        {isExpanded && <span className="ml-2 sidebar-text">Produtos</span>}
                                        {!isExpanded && <span className="sr-only">Produtos</span>}
                                    </Link>
                                </TooltipTrigger>
                                {!isExpanded && <TooltipContent side="left" className="bg-white text-black p-2 rounded-lg shadow-lg">Produtos</TooltipContent>}
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="#" className={`flex h-9 ${isExpanded ? 'w-full justify-start pl-4' : 'w-9 justify-center'} shrink-0 items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground`}>
                                        <User className="w-5 h-5" />
                                        {isExpanded && <span className="ml-2 sidebar-text">Clientes</span>}
                                        {!isExpanded && <span className="sr-only">Clientes</span>}
                                    </Link>
                                </TooltipTrigger>
                                {!isExpanded && <TooltipContent side="left" className="bg-white text-black p-2 rounded-lg shadow-lg">Clientes</TooltipContent>}
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="#" className={`flex h-9 ${isExpanded ? 'w-full justify-start pl-4' : 'w-9 justify-center'} shrink-0 items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground`}>
                                        <Settings className="w-5 h-5" />
                                        {isExpanded && <span className="ml-2 sidebar-text">Configurações</span>}
                                        {!isExpanded && <span className="sr-only">Configurações</span>}
                                    </Link>
                                </TooltipTrigger>
                                {!isExpanded && <TooltipContent side="left" className="bg-white text-black p-2 rounded-lg shadow-md">Configurações</TooltipContent>}
                            </Tooltip>
                        </TooltipProvider>
                    </nav>
                    <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="#" className={`flex h-9 ${isExpanded ? 'w-full justify-start pl-4' : 'w-9 justify-center'} shrink-0 items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground`}>
                                        <LogOut className="w-5 h-5 text-red-500" />
                                        {isExpanded && <span className="ml-2 sidebar-text">Sair</span>}
                                        {!isExpanded && <span className="sr-only">Sair</span>}
                                    </Link>
                                </TooltipTrigger>
                                {!isExpanded && <TooltipContent side="left" className="bg-white text-black p-2 rounded-lg shadow-md">Sair</TooltipContent>}
                            </Tooltip>
                        </TooltipProvider>
                    </nav>
                </aside>

                {/* Barra Mobile */}
                <div className="flex flex-col sm:py-4 sm:gap-4 sm:pl-14 sm:hidden">
                    <header className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 border-b bg-background gap-2 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 relative">
                        {/* Barra de pesquisa (sobrepõe o header quando aberta) */}
                        {isSearchOpen && (
                            <div className="absolute inset-0 bg-background z-10 flex items-center px-4">
                                <div className="relative w-full" ref={searchRef}>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="search"
                                        placeholder="Pesquisar..."
                                        className="pl-10 pr-10 w-full text-lg"
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

                        {/* Conteúdo normal do header (escondido durante a pesquisa) */}
                        <div className={`flex items-center ${isSearchOpen ? 'invisible' : ''}`}>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button className="sm:hidden rounded-full" variant="outline" size="icon">
                                        <MenuIcon className="w-5 h-5" />
                                        <span className="sr-only">
                                            Abrir/fechar
                                        </span>
                                    </Button>
                                </SheetTrigger>
                                <SheetTitle></SheetTitle>
                                <SheetContent className="sm:max-w-xs" side="left">
                                    <nav className="grid gap-6 text-lg font-medium">
                                        <Link href="/" className="flex items-center justify-center gap-4 w-10 h-10 bg-primary rounded-full text-lg text-primary-foreground md:text-base mt-2 ml-2" prefetch={false}>
                                            <Package className="h-5 w-5 transition-all" />
                                            <span className="sr-only">LOGO</span>
                                        </Link>
                                        <Link href="/" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                            <Home className="h-5 w-5 transition-all" />
                                            Inicio
                                        </Link>
                                        <Link href="/pedidos" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                            <ShoppingBag className="h-5 w-5 transition-all" />
                                            Pedidos
                                        </Link>
                                        <Link href="/produtos" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                            <Package className="h-5 w-5 transition-all" />
                                            Produtos
                                        </Link>
                                        <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                            <User className="h-5 w-5 transition-all" />
                                            Clientes
                                        </Link>
                                        <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                            <Settings className="h-5 w-5 transition-all" />
                                            Configurações
                                        </Link>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <div className={`flex items-center space-x-4 ${isSearchOpen ? 'invisible' : ''}`}>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSearchToggle}
                                ref={searchButtonRef}
                            >
                                <Search className="h-6 w-6" />
                            </Button>

                            <Button variant="ghost" size="icon">
                                <Bell className="h-6 w-6" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Inbox className="h-6 w-6" />
                            </Button>

                        </div>
                        <div className={`${isSearchOpen ? 'invisible' : 'flex items-center justify-center gap-2'}`}>
                            <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                                <img src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png" alt="User" className="w-full h-full object-cover" />
                            </div>
                            <LogOut className="w-4 h-4 text-red-500" />
                        </div>
                    </header>
                </div>
            </div>
        </>
    )
}