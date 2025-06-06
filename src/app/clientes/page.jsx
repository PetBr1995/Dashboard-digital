'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        if (!Array.isArray(data)) throw new Error('Data is not an array')
        setClients(data)
      } catch (err) {
        setError(`Erro ao carregar os clientes: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [])

  if (loading) {
    return <div className="min-h-screen ml-14 bg-white p-4 md:p-6">Carregando...</div>
  }

  if (error) {
    return (
      <div className="min-h-screen ml-14 bg-white p-4 md:p-6 text-red-500">{error}</div>
    )
  }

  return (
    <div className="min-h-screen ml-14 bg-white p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="mt-2 text-muted-foreground">
            Lista de clientes e suas informações de contato.
          </p>
        </header>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Nossos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.company ?? 'N/A'}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          client.status === 'Ativo'
                            ? 'bg-green-100 text-green-800'
                            : client.status === 'Inativo'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        )}
                      >
                        {client.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/clientes/${client.id}`}>
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
