import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { modalidadeService } from "@/services/modalidadeService"
import { mediaService } from "@/services/mediaService"
import { Modalidade } from "@/types/modalidade"
import {
  CategoriaAtleta,
  StatusAtleta,
  StatusVerificacao,
  TipoChavePix,
} from "@/types/atleta"

/* =====================================================
   FORMULÁRIO ADMIN — ATLETA
   - Criação (Histórica / Espólio / Ativa)
   - Edição completa
   - Curadoria e validação
   ===================================================== */

export default function AtletaForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  /* =======================
     IDENTIDADE
     ======================= */
  const [nome, setNome] = useState("")
  const [nomeSocial, setNomeSocial] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")

  /* =======================
     PERFIL ESPORTIVO
     ======================= */
  const [biografia, setBiografia] = useState("")
  const [categoria, setCategoria] = useState<CategoriaAtleta>("HISTORICA")
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState<string[]>([])

  /* =======================
     CURADORIA (ADMIN)
     ======================= */
  const [statusAtleta, setStatusAtleta] = useState<StatusAtleta>("ATIVO")
  const [statusVerificacao, setStatusVerificacao] =
    useState<StatusVerificacao>("PENDENTE")
  const [observacoesAdmin, setObservacoesAdmin] = useState("")

  /* =======================
     REPRESENTAÇÃO (ESPÓLIO)
     ======================= */
  const [nomeRepresentante, setNomeRepresentante] = useState("")
  const [cpfRepresentante, setCpfRepresentante] = useState("")
  const [vinculoRepresentante, setVinculoRepresentante] = useState("")

  /* =======================
     FINANCEIRO
     ======================= */
  const [tipoChavePix, setTipoChavePix] = useState<TipoChavePix>("CPF")
  const [chavePix, setChavePix] = useState("")
  const [banco, setBanco] = useState("")
  const [agencia, setAgencia] = useState("")
  const [conta, setConta] = useState("")
  const [tipoConta, setTipoConta] = useState("")
  const [percentualRepasse, setPercentualRepasse] = useState(0)
  const [comissaoPlataformaDiferenciada, setComissaoPlataformaDiferenciada] =
    useState(0)

  /* =======================
     CONTRATO
     ======================= */
  const [contratoAssinado, setContratoAssinado] = useState(false)
  const [linkContratoDigital, setLinkContratoDigital] = useState("")

  /* =======================
     MÍDIA
     ======================= */
  const [fotoDestaqueUrl, setFotoDestaqueUrl] = useState("")
  const [fotoDestaqueId, setFotoDestaqueId] = useState("")

  /* =======================
     UI
     ======================= */
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  /* =======================
     LOAD INICIAL
     ======================= */
  useEffect(() => {
    modalidadeService.listarAdmin().then(setModalidades)

    // CRIAÇÃO (nova atleta)
    if (!isEditing) {
      setLoading(false)
      return
    }

    // EDIÇÃO
    atletaService.buscarPorId(id!).then((data) => {
      setNome(data.nome)
      setNomeSocial(data.nomeSocial || "")
      setEmail(data.email)
      setCpf(data.cpf)

      setBiografia(data.biografia)
      setCategoria(data.categoria)
      setModalidadesSelecionadas(data.modalidadesIds || [])

      setStatusAtleta(data.statusAtleta)
      setStatusVerificacao(data.statusVerificacao)
      setObservacoesAdmin(data.observacoesAdmin || "")

      setNomeRepresentante(data.nomeRepresentante || "")
      setCpfRepresentante(data.cpfRepresentante || "")
      setVinculoRepresentante(data.vinculoRepresentante || "")

      setTipoChavePix(data.tipoChavePix)
      setChavePix(data.chavePix || "")
      setBanco(data.banco || "")
      setAgencia(data.agencia || "")
      setConta(data.conta || "")
      setTipoConta(data.tipoConta || "")
      setPercentualRepasse((data.percentualRepasse ?? 0) * 100)
      setComissaoPlataformaDiferenciada(
        (data.comissaoPlataformaDiferenciada ?? 0) * 100
      )

      setContratoAssinado(data.contratoAssinado)
      setLinkContratoDigital(data.linkContratoDigital || "")

      setFotoDestaqueUrl(data.fotoDestaqueUrl || "")
      setLoading(false)
    })
  }, [id, isEditing])

  /* =======================
     UPLOAD FOTO
     ======================= */
  async function handleUploadFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const data = await mediaService.upload(file, "/acervo/upload")
      setFotoDestaqueId(data.id)
      setFotoDestaqueUrl(data.url)
    } finally {
      setUploading(false)
    }
  }

  /* =======================
     SUBMIT
     ======================= */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      nome,
      nomeSocial: nomeSocial || undefined,
      cpf,
      email,

      biografia,
      categoria,
      modalidades: modalidadesSelecionadas,

      statusAtleta,
      statusVerificacao,
      observacoesAdmin: observacoesAdmin || undefined,

      nomeRepresentante:
        categoria === "ESPOLIO" ? nomeRepresentante : undefined,
      cpfRepresentante:
        categoria === "ESPOLIO" ? cpfRepresentante : undefined,
      vinculoRepresentante:
        categoria === "ESPOLIO" ? vinculoRepresentante : undefined,

      tipoChavePix,
      chavePix: tipoChavePix === "NENHUM" ? "N/A" : chavePix,
      banco,
      agencia,
      conta,
      tipoConta,

      percentualRepasse: percentualRepasse / 100,
      comissaoPlataformaDiferenciada:
        comissaoPlataformaDiferenciada / 100,

      contratoAssinado,
      linkContratoDigital: linkContratoDigital || undefined,

      fotoDestaqueId: fotoDestaqueId || undefined,
    }

    try {
      if (isEditing) {
        await atletaService.atualizar(id!, payload)
      } else {
        await atletaService.criar(payload)
      }
      navigate("/admin/atletas")
    } catch {
      alert("Erro ao salvar atleta.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div style={{ padding: "2rem" }}>Carregando atleta…</div>
  }

  /* =======================
     UI
     ======================= */
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
      <h1>{isEditing ? `Editar: ${nome}` : "Nova Atleta"}</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* IDENTIFICAÇÃO */}
        <fieldset>
          <legend>Identificação</legend>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome completo" />
          <input value={nomeSocial} onChange={e => setNomeSocial(e.target.value)} placeholder="Nome social" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" disabled={isEditing} />
          <input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="CPF" disabled={isEditing} />
        </fieldset>

        {/* PERFIL */}
        <fieldset>
          <legend>Perfil Esportivo</legend>
          <textarea value={biografia} onChange={e => setBiografia(e.target.value)} placeholder="Biografia" />
          <select value={categoria} onChange={e => setCategoria(e.target.value as CategoriaAtleta)}>
            <option value="ATIVA">ATIVA</option>
            <option value="HISTORICA">HISTÓRICA</option>
            <option value="ESPOLIO">ESPÓLIO</option>
          </select>
        </fieldset>

        {/* CURADORIA */}
        <fieldset style={{ background: "#eef6ff", border: "1px solid #90cdf4" }}>
          <legend>Curadoria Administrativa</legend>

          <select value={statusVerificacao} onChange={e => setStatusVerificacao(e.target.value as StatusVerificacao)}>
            <option value="PENDENTE">PENDENTE</option>
            <option value="VERIFICADO">VERIFICADO</option>
            <option value="REJEITADO">REJEITADO</option>
          </select>

          <select value={statusAtleta} onChange={e => setStatusAtleta(e.target.value as StatusAtleta)}>
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
            <option value="SUSPENSO">SUSPENSO</option>
          </select>

          <textarea
            value={observacoesAdmin}
            onChange={e => setObservacoesAdmin(e.target.value)}
            placeholder="Observações internas"
          />
        </fieldset>

        {/* FINANCEIRO */}
        <fieldset>
          <legend>Financeiro</legend>
          <input type="number" value={percentualRepasse} onChange={e => setPercentualRepasse(Number(e.target.value || 0))} placeholder="Repasse (%)" />
          <input type="number" value={comissaoPlataformaDiferenciada} onChange={e => setComissaoPlataformaDiferenciada(Number(e.target.value || 0))} placeholder="Comissão (%)" />
        </fieldset>

        {/* FOTO */}
        <fieldset>
          <legend>Foto</legend>
          {fotoDestaqueUrl && <img src={fotoDestaqueUrl} alt="Foto atleta" style={{ maxWidth: 200 }} />}
          <input type="file" onChange={handleUploadFoto} disabled={uploading} />
        </fieldset>

        <button type="submit" disabled={saving || uploading}>
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </form>
    </section>
  )
}
