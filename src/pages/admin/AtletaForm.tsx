import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { atletaService } from "@/services/atletaService";
import { modalidadeService } from "@/services/modalidadeService";
import { mediaService } from "@/services/mediaService"; // Novo serviço
import { AtletaFormDTO, Foto } from "@/types/atleta";
import { Modalidade } from "@/types/modalidade";

export default function AtletaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Estados
  const [nome, setNome] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [biografia, setBiografia] = useState("");
  const [competicao, setCompeticao] = useState("");
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [fotoDestaqueId, setFotoDestaqueId] = useState("");
  const [fotosRemovidas, setFotosRemovidas] = useState<string[]>([]);
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  
  // UX States
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    modalidadeService.listar()
      .then(setModalidades)
      .catch(err => console.error("Erro ao carregar modalidades:", err));

    if (isEditing && id) {
      atletaService.buscarPorId(id).then((data) => {
        setNome(data.nome);
        setModalidade(data.modalidade);
        setBiografia(data.biografia);
        setCompeticao(data.competicao);
        setFotos(data.fotos);
        const destaque = data.fotos.find(f => f.isDestaque);
        if (destaque) setFotoDestaqueId(destaque.id);
      }).catch(err => console.error("Erro ao buscar atleta:", err));
    }
  }, [id, isEditing]);

  // Lógica de Upload para Cloudinary (via Backend)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const novaFoto = await mediaService.upload(file);
      setFotos(prev => [...prev, novaFoto]);
      
      // Se for a primeira foto, define como destaque automaticamente
      if (fotos.length === 0) setFotoDestaqueId(novaFoto.id);
      
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Falha ao enviar imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const dto: AtletaFormDTO = {
      nome,
      modalidade,
      biografia,
      competicao,
      fotos,
      fotoDestaqueId,
      fotosRemovidas,
    };

    try {
      if (isEditing && id) {
        await atletaService.atualizar(id, dto);
      } else {
        await atletaService.criar(dto);
      }
      navigate("/admin/atletas"); 
    } catch (error) {
      console.error("Erro ao salvar atleta:", error);
      alert("Erro ao salvar os dados da atleta.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoverFoto = (fotoId: string) => {
    setFotos(prev => prev.filter(f => f.id !== fotoId));
    setFotosRemovidas(prev => [...prev, fotoId]);
    if (fotoDestaqueId === fotoId) setFotoDestaqueId("");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{isEditing ? "Editar Atleta" : "Nova Atleta"}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Nome da Atleta:</label>
          <input 
            style={{ width: "100%", padding: "0.5rem" }}
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Modalidade:</label>
          <select 
            style={{ width: "100%", padding: "0.5rem" }}
            value={modalidade} 
            onChange={(e) => setModalidade(e.target.value)} 
            required
          >
            <option value="">Selecione uma modalidade...</option>
            {modalidades.map((m) => (
              <option key={m.id} value={m.nome}>{m.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Biografia:</label>
          <textarea 
            style={{ width: "100%", padding: "0.5rem" }}
            value={biografia} 
            onChange={(e) => setBiografia(e.target.value)} 
            rows={5} 
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Contexto Histórico / Competições:</label>
          <input 
            style={{ width: "100%", padding: "0.5rem" }}
            value={competicao} 
            onChange={(e) => setCompeticao(e.target.value)} 
          />
        </div>

        <div style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "4px" }}>
          <h3>Fotos e Acervo</h3>
          
          {/* Botão de Upload */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Adicionar Nova Foto:
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              disabled={isUploading}
            />
            {isUploading && <span style={{ marginLeft: "10px", color: "blue" }}>Enviando para Cloudinary...</span>}
          </div>

          <p style={{ fontSize: "0.8rem", color: "#666" }}>Selecione a foto de destaque para o perfil.</p>
          
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginTop: "1rem" }}>
            {fotos.map((foto) => (
              <div key={foto.id} style={{ textAlign: "center", border: "1px solid #eee", padding: "10px" }}>
                <img src={foto.url} alt="Acervo" style={{ width: "120px", height: "120px", objectFit: "cover" }} />
                <div style={{ marginTop: "10px" }}>
                  <label style={{ fontSize: "0.8rem", cursor: "pointer" }}>
                    <input 
                      type="radio" 
                      name="destaque"
                      checked={fotoDestaqueId === foto.id} 
                      onChange={() => setFotoDestaqueId(foto.id)} 
                    /> Destaque
                  </label>
                  <br />
                  <button 
                    type="button" 
                    onClick={() => handleRemoverFoto(foto.id)}
                    style={{ marginTop: "5px", color: "red", border: "none", background: "none", cursor: "pointer" }}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button 
            type="submit" 
            disabled={isSaving || isUploading}
            style={{ 
              flex: 1, 
              padding: "1rem", 
              background: isSaving ? "#ccc" : "#111", 
              color: "#fff", 
              border: "none", 
              cursor: isSaving ? "not-allowed" : "pointer" 
            }}
          >
            {isSaving ? "Salvando..." : (isEditing ? "Salvar Alterações" : "Cadastrar Atleta")}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            style={{ padding: "1rem", background: "#ccc", border: "none", cursor: "pointer" }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}