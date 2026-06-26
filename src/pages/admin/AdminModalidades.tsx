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
        <div className="w-10 h-10 bg-acl-gold rounded-sm mx-auto mb-4 animate-fade-pulse" />
        <p className="text-sm text-acl-muted">Sincronizando modalidades...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <p className="text-acl-wine text-sm mb-5">{error}</p>
        <button
          onClick={carregarModalidades}
          className="btn-secondary-light"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <h1 className="font-serif text-2xl sm:text-3xl text-acl-ink">
          Gerenciar modalidades
        </h1>

        <button
          onClick={() => navigate("/admin/modalidades/nova")}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Nova modalidade
        </button>
      </div>

      {/* Conteúdo */}
      {modalidades.length === 0 ? (
        <div className="card-editorial p-12 text-center">
          <p className="text-sm text-acl-muted">Nenhuma modalidade cadastrada.</p>
        </div>
      ) : (
        <div className="card-editorial overflow-hidden">

          {/* TABELA - DESKTOP (≥768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-acl-line">
                  <th className="text-left p-4 text-xs text-acl-muted">Ícone</th>
                  <th className="text-left p-4 text-xs text-acl-muted">Modalidade</th>
                  <th className="text-center p-4 text-xs text-acl-muted">Pública?</th>
                  <th className="text-center p-4 text-xs text-acl-muted">Gestão</th>
                </tr>
              </thead>
              <tbody>
                {modalidades.map((modalidade) => (
                  <tr key={modalidade.id} className="border-b border-acl-line">
                    {/* Ícone */}
                    <td className="p-4">
                      {modalidade.pictogramaUrl ? (
                        <div className="w-11 h-11 bg-white border border-acl-line rounded-sm flex items-center justify-center p-2">
                          <img src={modalidade.pictogramaUrl} alt={modalidade.nome} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-11 h-11 bg-acl-line/30 rounded-sm flex items-center justify-center">
                          <span className="text-[10px] text-acl-muted">N/A</span>
                        </div>
                      )}
                    </td>

                    {/* Nome */}
                    <td className="p-4">
                      <span className="text-sm text-acl-ink block mb-0.5">{modalidade.nome}</span>
                      <code className="text-xs text-acl-muted">/{modalidade.slug}</code>
                    </td>

                    {/* Status Pública */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleAtiva(modalidade)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs transition-colors ${
                          modalidade.ativa
                            ? 'bg-acl-gold/15 text-acl-gold-deep'
                            : 'bg-acl-line/30 text-acl-muted'
                        }`}
                      >
                        {modalidade.ativa ? (
                          <CheckCircle size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}
                        <span>{modalidade.ativa ? 'Sim' : 'Não'}</span>
                      </button>
                    </td>

                    {/* Ações */}
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/modalidades/editar/${modalidade.id}`)}
                          className="p-2 border border-acl-line rounded-sm hover:border-acl-gold-deep transition-colors"
                          title="Editar"
                        >
                          <Edit size={14} className="text-acl-ink-soft" />
                        </button>
                        <button
                          onClick={() => handleRemover(modalidade.id)}
                          className="p-2 border border-acl-line rounded-sm hover:border-acl-wine transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={14} className="text-acl-wine" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARDS - MOBILE (<768px) */}
          <div className="md:hidden divide-y divide-acl-line">
            {modalidades.map((modalidade) => (
              <div key={modalidade.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  {modalidade.pictogramaUrl ? (
                    <div className="w-12 h-12 bg-white border border-acl-line rounded-sm flex items-center justify-center p-2 flex-shrink-0">
                      <img src={modalidade.pictogramaUrl} alt={modalidade.nome} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-acl-line/30 rounded-sm flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-acl-muted">N/A</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm text-acl-ink mb-1 break-words">{modalidade.nome}</h3>
                    <code className="text-xs text-acl-muted break-all">/{modalidade.slug}</code>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-acl-cream rounded-sm">
                  <span className="text-xs text-acl-muted">Pública</span>
                  <button
                    onClick={() => handleToggleAtiva(modalidade)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs transition-colors ${
                      modalidade.ativa ? 'bg-acl-gold/15 text-acl-gold-deep' : 'bg-acl-line/30 text-acl-muted'
                    }`}
                  >
                    {modalidade.ativa ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    <span>{modalidade.ativa ? 'Sim' : 'Não'}</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/modalidades/editar/${modalidade.id}`)}
                    className="flex-1 px-3 py-2 border border-acl-line rounded-sm text-xs text-acl-ink-soft flex items-center justify-center gap-1.5"
                  >
                    <Edit size={13} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleRemover(modalidade.id)}
                    className="flex-1 px-3 py-2 border border-acl-line rounded-sm text-xs text-acl-wine flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={13} />
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