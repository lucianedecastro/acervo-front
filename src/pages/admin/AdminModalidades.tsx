import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { modalidadeService } from "@/services/modalidadeService"
import { Modalidade, ModalidadeDTO } from "@/types/modalidade"
import { CheckCircle, XCircle, Edit, Trash2, Plus } from "lucide-react"

export default function AdminModalidades() {
  const navigate = useNavigate()
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function carregarModalidades() {
    try {
      setLoading(true)
      setError(null)
      const data = await modalidadeService.listarAdmin()
      setModalidades(data)
    } catch (err) {
      console.error("Erro ao carregar modalidades administrativas:", err)
      setError("Não foi possível carregar a lista de modalidades.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarModalidades()
  }, [])

  async function handleToggleAtiva(modalidade: Modalidade) {
    const novoStatusAtivo = !modalidade.ativa;

    const payload: ModalidadeDTO = {
      nome: modalidade.nome,
      historia: modalidade.historia,
      pictogramaUrl: modalidade.pictogramaUrl,
      ativa: novoStatusAtivo,
      fotos: modalidade.fotos || [],
      fotoDestaquePublicId: modalidade.fotoDestaquePublicId || ""
    };

    try {
      setModalidades(prev => prev.map(m =>
        m.id === modalidade.id ? { ...m, ativa: novoStatusAtivo } : m
      ));

      await modalidadeService.atualizar(modalidade.id, payload);

    } catch (err) {
      console.error("Erro ao alterar status da modalidade:", err)
      alert("Não foi possível alterar o status no servidor.")
      carregarModalidades();
    }
  }

  async function handleRemover(id: string) {
    const confirmar = window.confirm(
      "Deseja continuar com a exclusão definitiva? Se houver atletas vinculados, o sistema impedirá a remoção."
    )

    if (!confirmar) return

    try {
      await modalidadeService.remover(id)
      setModalidades(prev => prev.filter(m => m.id !== id))
      alert("Modalidade removida!")
    } catch (err) {
      console.error("Erro ao remover:", err)
      alert("Erro ao remover. Verifique vínculos no acervo.")
      carregarModalidades()
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#D4A244] border-6 border-black rounded-xl mx-auto mb-4 animate-pulse"></div>
        <p className="text-sm sm:text-lg font-black uppercase tracking-wide">Sincronizando modalidades...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <p className="text-lg sm:text-xl font-black text-red-600 mb-4 sm:mb-6 uppercase">{error}</p>
        <button
          onClick={carregarModalidades}
          className="px-6 sm:px-8 py-3 bg-black text-white font-black uppercase text-xs sm:text-sm border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-2 text-black">
            Gerenciar Modalidades
          </h1>
          <div className="w-24 sm:w-32 h-2 bg-[#D4A244] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
        </div>

        <button
          onClick={() => navigate("/admin/modalidades/nova")}
          className="w-full sm:w-auto px-6 py-3 bg-black text-white font-black uppercase text-xs sm:text-sm border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} strokeWidth={3} />
          Nova Modalidade
        </button>
      </div>

      {/* Conteúdo */}
      {modalidades.length === 0 ? (
        <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-8 sm:p-16 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-lg sm:text-xl font-black uppercase text-gray-500">Nenhuma modalidade cadastrada.</p>
        </div>
      ) : (
        <div className="bg-white border-4 sm:border-6 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">

          {/* TABELA - DESKTOP (≥768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white border-b-4 border-black">
                  <th className="text-left p-4 font-black uppercase text-xs tracking-wider">Ícone</th>
                  <th className="text-left p-4 font-black uppercase text-xs tracking-wider">Modalidade</th>
                  <th className="text-center p-4 font-black uppercase text-xs tracking-wider">Pública?</th>
                  <th className="text-center p-4 font-black uppercase text-xs tracking-wider">Gestão</th>
                </tr>
              </thead>
              <tbody>
                {modalidades.map((modalidade, index) => (
                  <tr
                    key={modalidade.id}
                    className={`border-b-4 border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    {/* Ícone */}
                    <td className="p-4">
                      {modalidade.pictogramaUrl ? (
                        <div className="w-12 h-12 bg-gray-100 border-4 border-black rounded-lg flex items-center justify-center p-2">
                          <img src={modalidade.pictogramaUrl} alt={modalidade.nome} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 border-4 border-black rounded-lg flex items-center justify-center">
                          <span className="text-xs font-black text-gray-500">N/A</span>
                        </div>
                      )}
                    </td>

                    {/* Nome */}
                    <td className="p-4">
                      <strong className="text-base font-black block mb-1">{modalidade.nome}</strong>
                      <code className="text-xs text-gray-500 font-bold">/{modalidade.slug}</code>
                    </td>

                    {/* Status Pública */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleAtiva(modalidade)}
                        className={`inline-flex items-center gap-2 px-3 py-2 border-4 border-black rounded-lg font-black text-xs uppercase transition-all ${modalidade.ativa
                            ? 'bg-[#D4A244] hover:bg-[#c59336]'
                            : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                      >
                        {modalidade.ativa ? (
                          <CheckCircle size={18} strokeWidth={3} className="text-black" />
                        ) : (
                          <XCircle size={18} strokeWidth={3} className="text-gray-600" />
                        )}
                        <span>{modalidade.ativa ? 'Sim' : 'Não'}</span>
                      </button>
                    </td>

                    {/* Ações */}
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/modalidades/editar/${modalidade.id}`)}
                          className="px-3 py-2 bg-white text-black font-black uppercase text-xs border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-1"
                        >
                          <Edit size={14} strokeWidth={3} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleRemover(modalidade.id)}
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
            {modalidades.map((modalidade) => (
              <div key={modalidade.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  {/* Ícone */}
                  {modalidade.pictogramaUrl ? (
                    <div className="w-14 h-14 bg-gray-100 border-4 border-black rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                      <img src={modalidade.pictogramaUrl} alt={modalidade.nome} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-gray-200 border-4 border-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-black text-gray-500">N/A</span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black mb-1 break-words">{modalidade.nome}</h3>
                    <code className="text-xs text-gray-500 font-bold break-all">/{modalidade.slug}</code>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <span className="text-xs font-black uppercase text-gray-600">Pública</span>
                  <button
                    onClick={() => handleToggleAtiva(modalidade)}
                    className={`flex items-center gap-2 px-3 py-2 border-4 border-black rounded-lg transition-all ${modalidade.ativa
                        ? 'bg-[#D4A244]'
                        : 'bg-gray-200'
                      }`}
                  >
                    {modalidade.ativa ? (
                      <CheckCircle size={16} strokeWidth={3} className="text-black" />
                    ) : (
                      <XCircle size={16} strokeWidth={3} className="text-gray-600" />
                    )}
                    <span className="font-black text-xs uppercase">
                      {modalidade.ativa ? 'Sim' : 'Não'}
                    </span>
                  </button>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/modalidades/editar/${modalidade.id}`)}
                    className="flex-1 px-3 py-2 bg-white text-black font-black uppercase text-[10px] border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-1"
                  >
                    <Edit size={14} strokeWidth={3} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleRemover(modalidade.id)}
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
      )}
    </div>
  )
}
