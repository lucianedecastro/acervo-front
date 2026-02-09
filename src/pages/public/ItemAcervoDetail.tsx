import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { itemAcervoService } from "@/services/itemAcervoService"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"
import { ArrowLeft, ShieldCheck, Download } from "lucide-react"

export default function ItemAcervoDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<ItemAcervoResponseDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarItem() {
      if (!id) return
      try {
        const data = await itemAcervoService.obterPorId(id)
        setItem(data)
      } catch (error) {
        console.error("Erro ao carregar item:", error)
      } finally {
        setLoading(false)
      }
    }
    carregarItem()
  }, [id])

  if (loading) return <div className="p-10 text-center font-black uppercase">Carregando Detalhes...</div>
  if (!item) return <div className="p-10 text-center font-black uppercase">Item não encontrado.</div>

  const fotoObj = item.fotos?.find(f => f.ehDestaque) || item.fotos?.[0]
  const cloudName = "dcet9fpu0"
  const publicId = fotoObj?.publicId

  // Sintaxe de overlay corrigida para o detalhe (w_1200)
  const urlComProtecao = publicId
    ? `https://res.cloudinary.com/${cloudName}/image/upload/c_scale,w_1200/l_watermark_acervo/c_scale,w_0.8,fl_relative/o_30/v1/${publicId}`
    : null

  const fotoPrincipal = urlComProtecao || fotoObj?.url

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 font-black uppercase hover:underline"
      >
        <ArrowLeft size={20} /> Voltar para o acervo
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative border-8 border-black bg-gray-200 aspect-square overflow-hidden group">
            <div 
              className="absolute inset-0 z-10" 
              onContextMenu={(e) => e.preventDefault()}
            />
            
            {fotoPrincipal ? (
              <img 
                src={fotoPrincipal} 
                alt={item.titulo}
                className="w-full h-full object-contain pointer-events-none"
                onError={(e) => {
                  if (fotoObj?.url && e.currentTarget.src !== fotoObj.url) {
                    e.currentTarget.src = fotoObj.url;
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full font-black text-gray-400">
                Imagem em Processamento
              </div>
            )}

            <div className="absolute bottom-4 right-4 bg-black text-white px-3 py-1 text-xs font-black uppercase z-20">
              Visualização Protegida
            </div>
          </div>
          <p className="text-xs font-bold text-gray-500 text-center uppercase">
            A imagem acima contém marca d'água e resolução reduzida para proteção de direitos.
          </p>
        </div>

        <div className="space-y-6">
          <header className="space-y-2">
            <span className="inline-block border-4 border-black px-4 py-1 font-black uppercase text-sm">
              {item.modalidadeId ? "Futebol" : "Geral"}
            </span>
            <h1 className="text-4xl font-black uppercase leading-none">
              {item.titulo}
            </h1>
          </header>

          <div className="border-l-8 border-black pl-6 py-2">
            <p className="text-lg font-bold leading-relaxed text-gray-800">
              {item.descricao || "Sem descrição informada."}
            </p>
          </div>

          <div className="bg-yellow-50 border-4 border-black p-6 space-y-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="shrink-0" size={24} />
              <div>
                <h4 className="font-black uppercase text-sm">Informações de Licenciamento</h4>
                <p className="text-sm font-medium">
                  Este item {item.disponivelParaLicenciamento ? 'está disponível' : 'requer análise'} para uso comercial.
                </p>
              </div>
            </div>

            <button className="w-full bg-black text-white font-black uppercase p-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
              <Download size={20} />
              Solicitar Alta Resolução
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-black uppercase">
            <div className="border-2 border-black p-3">
              <span className="block text-gray-500">Procedência</span>
              {item.procedencia || "Acervo Pessoal da Atleta"}
            </div>
            <div className="border-2 border-black p-3">
              <span className="block text-gray-500">Status</span>
              {item.status === "MEMORIAL" ? "Pesquisa Histórica" : "Acervo Ativo"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}