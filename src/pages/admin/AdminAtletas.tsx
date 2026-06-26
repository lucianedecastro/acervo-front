import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { Atleta, CategoriaAtleta, StatusAtleta, StatusVerificacao } from "@/types/atleta"
import { Plus, Edit, Trash2, Filter, X, Image } from "lucide-react"

const categoriaLabel: Record<string, string> = {
  ATIVA: "Ativa",
  HISTORICA: "Histórica",
  ESPOLIO: "Espólio",
}

const verificacaoLabel: Record<string, string> = {
  PENDENTE: "Pendente",
  VERIFICADO: "Verificado",
  REJEITADO: "Rejeitado",
  MEMORIAL_PUBLICO: "Memorial público",
}

const statusAtletaLabel: Record<string, string> = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
  SUSPENSO: "Suspenso",
}

export default function AdminAtletas() {
  const navigate = useNavigate()
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaAtleta | "ALL">("ALL")
  const [filtroStatus, setFiltroStatus] = useState<StatusAtleta | "ALL">("ALL")
  const [filtroVerificacao, setFiltroVerificacao] = useState<StatusVerificacao | "ALL">("ALL")

  async function carregar() {
    try {
      setLoading(true)
      setError(null)
      const data = await atletaService.listarTodasAdmin()
      setAtletas(data)
    } catch (err) {
      setError("Erro ao sincronizar com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  async function handleRemover(id: string, nome: string) {
    if (!window.confirm(`Tem certeza que deseja remover ${nome} do acervo permanentemente?`)) return
    try {
      await atletaService.remover(id)
      carregar()
    } catch {
      alert("Erro ao remover atleta.")
    }
  }

  const atletasFiltradas = useMemo(() => {
    return atletas.filter((a) => {
      if (filtroCategoria !== "ALL" && a.categoria !== filtroCategoria) return false
      if (filtroStatus !== "ALL" && a.statusAtleta !== filtroStatus) return false
      if (filtroVerificacao !== "ALL" && a.statusVerificacao !== filtroVerificacao) return false
      return true
    })
  }, [atletas, filtroCategoria, filtroStatus, filtroVerificacao])

  const limparFiltros = () => {
    setFiltroCategoria("ALL")
    setFiltroStatus("ALL")
    setFiltroVerificacao("ALL")
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-10 h-10 bg-acl-gold rounded-sm mx-auto mb-4 animate-fade-pulse" />
        <p className="text-sm text-acl-muted">Sincronizando acervo...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-acl-ink mb-1">
            Gestão do acervo
          </h1>
          <p className="text-acl-muted text-sm">
            Administração técnica de perfis esportivos
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/atletas/nova")}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Nova atleta
        </button>
      </div>

      {error && (
        <div className="bg-acl-wine/10 border border-acl-wine rounded-sm p-3">
          <p className="text-acl-wine text-sm">{error}</p>
        </div>
      )}

      {/* Barra de Filtros */}
      <div className="card-editorial p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-acl-ink-soft" />
          <h3 className="text-sm text-acl-ink-soft">Filtros</h3>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-acl-muted mb-2">Categoria</label>
              <select
                value={filtroCategoria}
                onChange={e => setFiltroCategoria(e.target.value as any)}
                className="w-full px-3 py-2 border border-acl-line rounded-sm text-sm bg-white focus:outline-none focus:border-acl-gold-deep"
              >
                <option value="ALL">Todas as categorias</option>
                <option value="ATIVA">Ativa</option>
                <option value="HISTORICA">Histórica</option>
                <option value="ESPOLIO">Espólio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-acl-muted mb-2">Status</label>
              <select
                value={filtroStatus}
                onChange={e => setFiltroStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-acl-line rounded-sm text-sm bg-white focus:outline-none focus:border-acl-gold-deep"
              >
                <option value="ALL">Todos os status</option>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="SUSPENSO">Suspenso</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-acl-muted mb-2">Verificação</label>
              <select
                value={filtroVerificacao}
                onChange={e => setFiltroVerificacao(e.target.value as any)}
                className="w-full px-3 py-2 border border-acl-line rounded-sm text-sm bg-white focus:outline-none focus:border-acl-gold-deep"
              >
                <option value="ALL">Status de verificação</option>
                <option value="PENDENTE">Pendente</option>
                <option value="VERIFICADO">Verificado</option>
                <option value="REJEITADO">Rejeitado</option>
                <option value="MEMORIAL_PUBLICO">Memorial público</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={limparFiltros}
              className="px-4 py-2 text-xs text-acl-ink-soft hover:text-acl-gold-deep transition-colors flex items-center gap-2"
            >
              <X size={14} />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela Desktop */}
      <div className="card-editorial overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-acl-line">
                <th className="text-left p-4 text-xs text-acl-muted">Nome</th>
                <th className="text-center p-4 text-xs text-acl-muted">Categoria</th>
                <th className="text-center p-4 text-xs text-acl-muted">Verificação</th>
                <th className="text-center p-4 text-xs text-acl-muted">Status</th>
                <th className="text-center p-4 text-xs text-acl-muted">Ações</th>
              </tr>
            </thead>
            <tbody>
              {atletasFiltradas.map((a) => (
                <tr key={a.id} className="border-b border-acl-line">
                  <td className="p-4">
                    <span className="text-sm text-acl-ink">{a.nome}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-xs text-acl-gold-deep">
                      {categoriaLabel[a.categoria] ?? a.categoria}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs ${
                      a.statusVerificacao === 'VERIFICADO' ? 'text-green-700' :
                      a.statusVerificacao === 'REJEITADO' ? 'text-acl-wine' :
                      'text-acl-muted'
                    }`}>
                      {verificacaoLabel[a.statusVerificacao] ?? a.statusVerificacao}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-xs text-acl-ink-soft">
                      {statusAtletaLabel[a.statusAtleta] ?? a.statusAtleta}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => navigate(`/admin/atletas/editar/${a.id}`)} className="p-2 border border-acl-line rounded-sm hover:border-acl-gold-deep transition-colors" title="Editar">
                        <Edit size={14} className="text-acl-ink-soft" />
                      </button>
                      <button onClick={() => navigate(`/admin/atletas/${a.id}/acervo`)} className="p-2 border border-acl-line rounded-sm hover:border-acl-gold-deep transition-colors" title="Acervo">
                        <Image size={14} className="text-acl-ink-soft" />
                      </button>
                      <button onClick={() => handleRemover(a.id, a.nome)} className="p-2 border border-acl-line rounded-sm hover:border-acl-wine transition-colors" title="Excluir">
                        <Trash2 size={14} className="text-acl-wine" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-acl-line">
          {atletasFiltradas.map((a) => (
            <div key={a.id} className="p-4 space-y-3">
              <div>
                <h3 className="text-sm text-acl-ink mb-1">{a.nome}</h3>
                <div className="flex items-center gap-3 text-xs text-acl-muted">
                  <span className="text-acl-gold-deep">{categoriaLabel[a.categoria] ?? a.categoria}</span>
                  <span>{statusAtletaLabel[a.statusAtleta] ?? a.statusAtleta}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => navigate(`/admin/atletas/editar/${a.id}`)} className="flex-1 px-3 py-2 border border-acl-line rounded-sm text-xs text-acl-ink-soft flex items-center justify-center gap-1.5">
                  <Edit size={13} /> Editar
                </button>
                <button onClick={() => navigate(`/admin/atletas/${a.id}/acervo`)} className="flex-1 px-3 py-2 border border-acl-line rounded-sm text-xs text-acl-ink-soft flex items-center justify-center gap-1.5">
                  <Image size={13} /> Acervo
                </button>
                <button onClick={() => handleRemover(a.id, a.nome)} className="flex-1 px-3 py-2 border border-acl-line rounded-sm text-xs text-acl-wine flex items-center justify-center gap-1.5">
                  <Trash2 size={13} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}