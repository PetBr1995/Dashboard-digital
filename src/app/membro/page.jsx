'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function Membro() {
   // Get the dynamic id from the URL
  const searchParams = useSearchParams();
  const id = searchParams.get('id')
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if id is valid before fetching
    if (!id) {
      setError('ID do membro não fornecido.')
      setLoading(false)
      return
    }

    const fetchMember = async () => {
      try {
        console.log(`Attempting to fetch members from /api/members to find member with id=${id}...`)
        const response = await fetch('/api/members', { cache: 'no-store' })
        console.log('Fetch response status:', response.status)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        console.log('Raw data from backend:', data)
        if (!Array.isArray(data)) {
          throw new Error('Data is not an array')
        }
        const foundMember = data.find((m) => m.id === parseInt(id))
        if (!foundMember) {
          throw new Error(`Member with id=${id} not found`)
        }
        setMember(foundMember)
        setLoading(false)
      } catch (error) {
        console.error('Fetch error details:', error)
        setError(`Erro ao carregar o membro: ${error.message}. Verifique o console para mais detalhes.`)
        setLoading(false)
      }
    }
    fetchMember()
  }, [id])

  if (loading) {
    return <div className="min-h-screen md:ml-14 ml-14 p-4 md:p-6">Carregando...</div>
  }

  if (error || !member) {
    return (
      <div className="min-h-screen md:ml-14 ml-14 p-4 md:p-6 text-red-500">
        {error || 'Membro não encontrado.'}
      </div>
    )
  }

  return (
    <div className="min-h-screen md:ml-14 ml-14 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-6 m-auto text-center">
          <h1 className="text-3xl font-bold">Perfil do Membro</h1>
          <p className="mt-2 text-muted-foreground">
            Detalhes do membro da equipe.
          </p>
        </header>

        {/* Member Details */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
              <User className="h-8 w-8 text-gray-500" />
            </div>
            <div>
              <CardTitle className="text-2xl">{member.name}</CardTitle>
              <p className="text-md text-muted-foreground">{member.role}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-md text-gray-900">{member.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  member.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                )}
              >
                {member.status}
              </span>
            </div>
            {/* Placeholder for additional details */}
            <div>
              <p className="text-sm font-medium text-gray-500">Descrição</p>
              <p className="text-md text-gray-900">
                {member.description || 'Nenhuma descrição disponível.'}
              </p>
            </div>
          </CardContent>
          <div className="p-4">
            <Link href="/membros">
              <Button variant="outline" size="sm" className="w-full">
                Voltar
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}