import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { Atleta, CategoriaAtleta, StatusAtleta, StatusVerificacao } from "@/types/atleta"
import { Plus, Edit, Trash2, Filter, X } from "lucide-react"

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
        <div className="w-16 h-16 bg-[#D4A244] border-6 border-black rounded-xl mx-auto mb-4 animate-pulse"></div>
        <p className="text-sm sm:text-lg font-black uppercase tracking-wide">Sincronizando acervo...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-2 text-black">
            Gestão do Acervo
          </h1>
          <p className="text-gray-600 font-bold text-sm sm:text-base mb-3">
            Administração técnica de perfis esportivos
          </p>
          <div className="w-24 sm:w-32 h-2 bg-[#D4A244] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
        </div>

        <button
          onClick={() => navigate("/admin/atletas/nova")}
          className="w-full sm:w-auto px-6 py-3 bg-black text-white font-black uppercase text-xs sm:text-sm border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} strokeWidth={3} />
          Nova Atleta
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} strokeWidth={3} />
          <h3 className="text-base font-black uppercase">Filtros</h3>
        </div>

        <div className="space-y-3">
          {/* Linha 1: Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Categoria</label>
              <select
                value={filtroCategoria}
                onChange={e => setFiltroCategoria(e.target.value as any)}
                className="w-full px-3 py-2 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              >
                <option value="ALL">Todas as Categorias</option>
                <option value="ATIVA">ATIVA</option>
                <option value="HISTORICA">HISTÓRICA</option>
                <option value="ESPOLIO">ESPÓLIO</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Verificação</label>
              <select
                value={filtroVerificacao}
                onChange={e => setFiltroVerificacao(e.target.value as any)}
                className="w-full px-3 py-2 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              >
                <option value="ALL">Status de Verificação</option>
                <option value="PENDENTE">PENDENTE</option>
                <option value="VERIFICADO">VERIFICADO</option>
              </select>
            </div>
          </div>

          {/* Linha 2: Botão Limpar */}
          <div className="flex justify-end">
            <button
              onClick={limparFiltros}
              className="px-4 py-2 bg-gray-200 text-black font-black uppercase text-xs border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2"
            >
              <X size={16} strokeWidth={3} />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela Desktop / Cards Mobile */}
      <div className="bg-white border-4 sm:border-6 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">

        {/* TABELA - DESKTOP (≥768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black text-white border-b-4 border-black">
                <th className="text-left p-4 font-black uppercase text-xs tracking-wider">Nome</th>
                <th className="text-center p-4 font-black uppercase text-xs tracking-wider">Categoria</th>
                <th className="text-center p-4 font-black uppercase text-xs tracking-wider">Verificação</th>
                <th className="text-center p-4 font-black uppercase text-xs tracking-wider">Status</th>
                <th className="text-center p-4 font-black uppercase text-xs tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {atletasFiltradas.map((a, index) => (
                <tr
                  key={a.id}
                  className={`border-b-4 border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="p-4">
                    <strong className="text-base font-black">{a.nome}</strong>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block px-3 py-1 bg-[#D4A244] border-2 border-black rounded-md font-black text-xs uppercase">
                      {a.categoria}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-3 py-1 border-2 border-black rounded-md font-black text-xs uppercase ${a.statusVerificacao === 'VERIFICADO' ? 'bg-green-400' : 'bg-yellow-300'
                      }`}>
                      {a.statusVerificacao === 'VERIFICADO' ? 'VERIFICADO' : 'MEMORIAL PÚBLICO'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block px-3 py-1 bg-white border-2 border-black rounded-md font-black text-xs uppercase">
                      {a.statusAtleta === 'ATIVO' ? 'ATIVO' : 'MEMORIAL'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/atletas/editar/${a.id}`)}
                        className="px-3 py-2 bg-white text-black font-black uppercase text-xs border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-1"
                      >
                        <Edit size={14} strokeWidth={3} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleRemover(a.id, a.nome)}
                        className="px-3 py-2 bg-red-500 text-white font-black uppercase text-xs border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-1"
                      >
                        <Trash2 size={14} strokeWidth={3} />
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CARDS - MOBILE (<768px) */}
        <div className="md:hidden divide-y-4 divide-gray-200">
          {atletasFiltradas.map((a) => (
            <div key={a.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-base font-black flex-1">{a.nome}</h3>
                <span className="px-2 py-1 bg-[#D4A244] border-2 border-black rounded-md font-black text-[10px] uppercase whitespace-nowrap">
                  {a.categoria}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 border-2 border-black rounded-md font-black text-[10px] uppercase ${a.statusVerificacao === 'VERIFICADO' ? 'bg-green-400' : 'bg-yellow-300'
                  }`}>
                  {a.statusVerificacao === 'VERIFICADO' ? 'VERIFICADO' : 'MEMORIAL PÚBLICO'}
                </span>
                <span className="px-2 py-1 bg-white border-2 border-black rounded-md font-black text-[10px] uppercase">
                  {a.statusAtleta === 'ATIVO' ? 'ATIVO' : 'MEMORIAL'}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => navigate(`/admin/atletas/editar/${a.id}`)}
                  className="flex-1 px-3 py-2 bg-white text-black font-black uppercase text-[10px] border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-1"
                >
                  <Edit size={14} strokeWidth={3} />
                  Editar
                </button>
                <button
                  onClick={() => handleRemover(a.id, a.nome)}
                  className="flex-1 px-3 py-2 bg-red-500 text-white font-black uppercase text-[10px] border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} strokeWidth={3} />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
