'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Members() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        console.log('Attempting to fetch members from /api/members...')
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
        setMembers(data)
        setLoading(false)
      } catch (error) {
        console.error('Fetch error details:', error)
        setError(`Erro ao carregar os membros: ${error.message}. Verifique o console para mais detalhes.`)
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  if (loading) {
    return <div className="min-h-screen md:ml-14 ml-14 p-4 md:p-6">Carregando...</div>
  }

  if (error) {
    return <div className="min-h-screen md:ml-14 ml-14 p-4 md:p-6 text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen md:ml-14 ml-14 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Nossa Equipe</h1>
          <p className="mt-2 text-gray-500">
            Conheça os membros talentosos que compõem a nossa equipe.
          </p>
        </header>

        {/* Members Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card key={member.id} className="flex flex-col">
              <CardHeader className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-gray-600">{member.email}</p>
              </CardContent>
              <div className="p-4">
                <Link href={`/membro?id=${member.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => console.log(`Navigating to member with ID: ${member.id}`)}
                  >
                    Ver Perfil
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}