import { useState, useRef } from 'react';
import './RichTextEditor.css'; // Vou criar o CSS também

function RichTextEditor({ value, onChange, placeholder = "Escreva seu conteúdo aqui..." }) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Funções para formatação
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className={`rich-text-editor ${isFocused ? 'focused' : ''}`}>
      {/* BARRA DE FERRAMENTAS */}
      <div className="toolbar">
        {/* TÍTULOS */}
        <select 
          onChange={(e) => execCommand('formatBlock', e.target.value)}
          className="toolbar-select"
        >
          <option value="<p>">Parágrafo</option>
          <option value="<h1>">Título 1</option>
          <option value="<h2>">Título 2</option>
          <option value="<h3>">Título 3</option>
          <option value="<h4>">Título 4</option>
          <option value="<blockquote>">Citação</option>
        </select>

        {/* FORMATAÇÃO DE TEXTO */}
        <button 
          type="button" 
          onClick={() => execCommand('bold')}
          className="toolbar-btn"
          title="Negrito"
        >
          <strong>B</strong>
        </button>
        
        <button 
          type="button" 
          onClick={() => execCommand('italic')}
          className="toolbar-btn"
          title="Itálico"
        >
          <em>I</em>
        </button>
        
        <button 
          type="button" 
          onClick={() => execCommand('underline')}
          className="toolbar-btn"
          title="Sublinhado"
        >
          <u>U</u>
        </button>

        {/* LISTAS */}
        <button 
          type="button" 
          onClick={() => execCommand('insertUnorderedList')}
          className="toolbar-btn"
          title="Lista não ordenada"
        >
          • Lista
        </button>
        
        <button 
          type="button" 
          onClick={() => execCommand('insertOrderedList')}
          className="toolbar-btn"
          title="Lista ordenada"
        >
          1. Lista
        </button>

        {/* LINKS */}
        <button 
          type="button" 
          onClick={() => {
            const url = prompt('Digite a URL:');
            if (url) execCommand('createLink', url);
          }}
          className="toolbar-btn"
          title="Inserir link"
        >
          🔗
        </button>

        {/* ALINHAMENTO */}
        <button 
          type="button" 
          onClick={() => execCommand('justifyLeft')}
          className="toolbar-btn"
          title="Alinhar à esquerda"
        >
          ⬅️
        </button>
        
        <button 
          type="button" 
          onClick={() => execCommand('justifyCenter')}
          className="toolbar-btn"
          title="Centralizar"
        >
          ↔️
        </button>
        
        <button 
          type="button" 
          onClick={() => execCommand('justifyRight')}
          className="toolbar-btn"
          title="Alinhar à direita"
        >
          ➡️
        </button>
      </div>

      {/* ÁREA DE EDIÇÃO */}
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={updateContent}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        style={{ 
          minHeight: '200px',
          border: 'none',
          outline: 'none'
        }}
      />
      
      {/* CONTADOR DE CARACTERES (OPCIONAL) */}
      <div className="editor-footer">
        <span className="char-count">
          {value.replace(/<[^>]*>/g, '').length} caracteres
        </span>
      </div>
    </div>
  );
}

export default RichTextEditor;