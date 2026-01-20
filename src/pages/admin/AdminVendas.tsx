/* =====================================================
   PÁGINA: LISTAGEM GLOBAL DE VENDAS (ADMIN)
   Caminho: src/pages/admin/AdminVendas.tsx
   ===================================================== */

import { useEffect, useState } from "react";
import { licenciamentoService, LicenciamentoDTO } from "@/services/licenciamentoService";

export default function AdminVendas() {
  const [vendas, setVendas] = useState<LicenciamentoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    licenciamentoService.listarTodos()
      .then(setVendas)
      .catch((err) => {
        console.error("Erro ao carregar vendas globais:", err);
        setError("Erro ao carregar base de licenciamentos. Verifique a conexão com a API.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={msgStyle}>Carregando base de licenciamentos...</div>;
  if (error) return <div style={{ ...msgStyle, color: "#e53e3e" }}>{error}</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", color: "#1a1a1a" }}>Vendas Globais</h1>
        <p style={{ color: "#718096" }}>Relatório consolidado de todos os licenciamentos da plataforma</p>
      </header>

      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={theadStyle}>
              <th style={thStyle}>Data</th>
              <th style={thStyle}>Atleta</th>
              <th style={thStyle}>Item</th>
              <th style={thStyle}>Valor Bruto</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {vendas.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#a0aec0" }}>
                  Nenhuma transação encontrada na base de dados.
                </td>
              </tr>
            ) : (
              vendas.map((venda) => (
                <tr key={venda.id} style={trStyle}>
                  <td style={tdStyle}>{new Date(venda.data).toLocaleDateString("pt-BR")}</td>
                  <td style={tdStyle}><strong>{venda.atletaNome}</strong></td>
                  <td style={tdStyle}>{venda.itemTitulo}</td>
                  <td style={tdStyle}>
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(venda.valorBruto)}
                  </td>
                  <td style={tdStyle}>
                    <span style={badgeStyle(venda.status)}>{venda.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Estilos constantes */
const msgStyle: React.CSSProperties = { padding: "4rem", textAlign: "center" };
const tableWrapperStyle: React.CSSProperties = { backgroundColor: "white", borderRadius: "10px", border: "1px solid #edf2f7", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse" };
const theadStyle: React.CSSProperties = { backgroundColor: "#f7fafc", borderBottom: "1px solid #edf2f7" };
const thStyle: React.CSSProperties = { padding: "1rem", textAlign: "left", fontSize: "0.75rem", color: "#718096", textTransform: "uppercase", fontWeight: "bold" };
const tdStyle: React.CSSProperties = { padding: "1rem", borderBottom: "1px solid #f7fafc", fontSize: "0.9rem", color: "#2d3748" };
const trStyle: React.CSSProperties = { transition: "background 0.2s" };

const badgeStyle = (status: string): React.CSSProperties => ({
  padding: "4px 10px",
  borderRadius: "99px",
  fontSize: "0.7rem",
  fontWeight: "bold",
  backgroundColor: status === "CONCLUIDO" || status === "PAGO" ? "#c6f6d5" : "#feebc8",
  color: status === "CONCLUIDO" || status === "PAGO" ? "#22543d" : "#744210",
  textTransform: "uppercase"
});