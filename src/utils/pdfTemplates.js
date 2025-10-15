// --- FUNÇÕES AUXILIARES ---
// Funções para formatar datas e listas, evitando repetição de código.

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  // Formata para "Setembro de 2025"
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

const formatPeriodo = (inicio, fim, atual) => {
  const dataInicio = formatDate(inicio);
  const dataFim = atual ? 'Presente' : formatDate(fim);
  if (!dataInicio) return '';
  return `${dataInicio} – ${dataFim}`;
};

const gerarListaHTML = (items, template) => {
  if (!items || items.length === 0) return '';
  return `<ul class="skills-list">${items.map(item => template(item)).join("")}</ul>`;
};


// ==================================================
// 1. TEMPLATE CLÁSSICO (ID: 'classic')
// ==================================================
export const templateClassic = (curriculo, corPrimaria = "#2d3748") => `
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Lato', sans-serif; color: #333; font-size: 11pt; margin: 30px; }
    .header { text-align: center; border-bottom: 2px solid ${corPrimaria}; padding-bottom: 10px; margin-bottom: 25px; }
    h1 { margin: 0; font-size: 22pt; color: ${corPrimaria}; font-weight: 700; }
    .contato { font-size: 10pt; color: #555; margin-top: 5px; }
    .section-title { font-size: 13pt; font-weight: 700; color: ${corPrimaria}; margin-top: 25px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
    .job { margin-bottom: 15px; }
    .job-title { font-weight: 700; font-size: 11pt; }
    .job-period { color: #666; font-size: 9pt; font-style: italic; margin-bottom: 5px; }
    p { margin: 4px 0; line-height: 1.4; }
    ul { padding-left: 18px; } li { margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="header">
    ${curriculo.fotoBase64 ? `<img src="${curriculo.fotoBase64}" width="90" style="border-radius:50%; margin-bottom:10px;" />` : ""}
    <h1>${curriculo.dadosPessoais?.nome || "Seu Nome Completo"}</h1>
    <p class="contato">
      ${curriculo.dadosPessoais?.email || ""}
      ${curriculo.dadosPessoais?.telefone ? ` • ${curriculo.dadosPessoais.telefone}` : ""}
      ${curriculo.dadosPessoais?.cidade ? ` • ${curriculo.dadosPessoais.cidade}/${curriculo.dadosPessoais.estado}` : ""}
      ${curriculo.dadosPessoais?.linkedin ? ` • ${curriculo.dadosPessoais.linkedin}` : ""}
      ${curriculo.dadosPessoais?.site ? ` • ${curriculo.dadosPessoais.site}` : ""}
    </p>
  </div>

  ${curriculo.resumoProfissional ? `
  <div class="section-title">Resumo Profissional</div>
  <p>${curriculo.resumoProfissional}</p>` : ''}

  ${curriculo.objetivoProfissional ? `
  <div class="section-title">Objetivo</div>
  <p>${curriculo.objetivoProfissional}</p>` : ''}

  ${(curriculo.experiencias && curriculo.experiencias.length > 0) ? `
  <div class="section-title">Experiência Profissional</div>
  ${curriculo.experiencias.map(exp => `
    <div class="job">
      <p class="job-title">${exp.cargo || ""} – ${exp.empresa || ""}</p>
      <p class="job-period">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</p>
      ${exp.atividades ? `<p>${exp.atividades}</p>` : ""}
    </div>
  `).join("")}` : ""}

  ${(curriculo.formacao && curriculo.formacao.length > 0) ? `
  <div class="section-title">Formação Acadêmica</div>
  ${curriculo.formacao.map(f => `
    <p><b>${f.curso || ""}</b> (${f.nivel || ""}) – ${f.instituicao || ""} ${f.anoConclusao ? `, Concluído em ${formatDate(f.anoConclusao)}` : ""}</p>
  `).join("")}` : ""}

  ${(curriculo.certificacoes && curriculo.certificacoes.length > 0) ? `
  <div class="section-title">Cursos e Certificações</div>
  ${curriculo.certificacoes.map(c => `
    <p>${c.nome || ""} – ${c.instituicao || ""} ${c.anoConclusao ? `(${formatDate(c.anoConclusao)})` : ""}</p>
  `).join("")}` : ""}

  ${(curriculo.hardSkills && curriculo.hardSkills.length > 0) ? `
  <div class="section-title">Hard Skills</div>
  <ul>${curriculo.hardSkills.map(h => `<li>${h.habilidade}</li>`).join("")}</ul>` : ""}

  ${(curriculo.softSkills && curriculo.softSkills.length > 0) ? `
  <div class="section-title">Soft Skills</div>
  <ul>${curriculo.softSkills.map(s => `<li>${s.habilidade}</li>`).join("")}</ul>` : ""}

  ${(curriculo.idiomas && curriculo.idiomas.length > 0) ? `
  <div class="section-title">Idiomas</div>
  ${curriculo.idiomas.map(i => `<p>${i.idioma} – ${i.nivel}</p>`).join("")}` : ""}
</body>
</html>
`;

// ==================================================
// 2. TEMPLATE CRIATIVO (ID: 'creative')
// ==================================================
export const templateCreative = (curriculo, corPrimaria = '#1f1f1f') => `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: A4; margin: 0; }
    body {
      margin: 0;
      padding: 0;
      width: 210mm;
      height: 297mm;
      font-family: 'Poppins', sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
      display: flex;
    }
    .sidebar {
      width: 30%;
      background: ${corPrimaria};
      padding: 30px 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .photo-container {
      height: 120px;
      width: 120px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 15px;
      background: #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .photo-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .sidebar-section {
      width: 100%;
      margin-top: 25px;
      text-align: left;
    }
    .sidebar-section h3 {
      margin: 0 0 10px;
      font-size: 14pt;
      color: #fff;
      border-bottom: 2px solid rgba(255,255,255,0.5);
      padding-bottom: 4px;
      text-transform: uppercase;
    }
    .sidebar-section p,
    .sidebar-section li {
      font-size: 11pt;
      color: #f0f0f0;
      line-height: 1.4;
    }
    .sidebar-section ul {
      list-style: none;
      padding-left: 0;
      margin: 0;
    }
    .content {
      width: 70%;
      background: #fff;
      padding: 30px;
      box-sizing: border-box;
      overflow-y: auto;
    }
    .card {
      margin-bottom: 20px;
      padding: 20px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .section-title {
      font-size: 16pt;
      color: ${corPrimaria};
      margin-bottom: 10px;
      border-bottom: 2px solid ${corPrimaria};
      padding-bottom: 4px;
      text-transform: uppercase;
    }
    h1 {
      margin: 0;
      font-size: 24pt;
      color: #333;
    }
    h2 {
      margin: 4px 0 20px;
      font-size: 14pt;
      color: #555;
    }
    .item {
      margin-bottom: 10px;
    }
    .item .title {
      font-size: 12pt;
      font-weight: bold;
      color: #333;
    }
    .item .period {
      font-size: 10pt;
      font-style: italic;
      color: #666;
      margin-bottom: 6px;
    }
    .item .desc {
      font-size: 11pt;
      color: #444;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <aside class="sidebar">
    <div class="photo-container">
      ${curriculo.fotoBase64 ? `<img src="${curriculo.fotoBase64}" alt="Foto do candidato">` : ''}
    </div>

    <div class="sidebar-section">
      <h3>Perfil</h3>
      <p>${curriculo.resumoProfissional || ''}</p>
    </div>

    ${curriculo.hardSkills?.length ? `
      <div class="sidebar-section">
        <h3>Hard Skills</h3>
        <ul>
          ${curriculo.hardSkills.map(h => `<li>${h.habilidade}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    ${curriculo.softSkills?.length ? `
      <div class="sidebar-section">
        <h3>Soft Skills</h3>
        <ul>
          ${curriculo.softSkills.map(s => `<li>${s.habilidade}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    ${curriculo.idiomas?.length ? `
      <div class="sidebar-section">
        <h3>Idiomas</h3>
        <ul>
          ${curriculo.idiomas.map(i => `<li>${i.idioma}: ${i.nivel}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
  </aside>

  <main class="content">
    <h1>${curriculo.dadosPessoais?.nome}</h1>
    <h2>${curriculo.dadosPessoais?.email || ''}${curriculo.dadosPessoais?.telefone ? ' • ' + curriculo.dadosPessoais.telefone : ''}</h2>

    ${curriculo.experiencias?.length ? `
      <div class="card">
        <div class="section-title">Experiência</div>
        ${curriculo.experiencias.map(exp => `
          <div class="item">
            <div class="title">${exp.cargo} – ${exp.empresa}</div>
            <div class="period">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</div>
            <div class="desc">${exp.atividades}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${curriculo.formacao?.length ? `
      <div class="card">
        <div class="section-title">Formação</div>
        ${curriculo.formacao.map(f => `
          <div class="item">
            <div class="title">${f.curso}</div>
            <div class="desc">${f.instituicao} — ${f.anoConclusao ? formatDate(f.anoConclusao) : ''}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${curriculo.certificacoes?.length ? `
      <div class="card">
        <div class="section-title">Cursos & Certificações</div>
        ${curriculo.certificacoes.map(c => `
          <div class="item">
            <div class="title">${c.nome}</div>
            <div class="desc">${c.instituicao} ${c.anoConclusao ? `(${formatDate(c.anoConclusao)})` : ''}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}
  </main>

</body>
</html>
`;


// ==================================================
// 3. TEMPLATE CORPORATIVO (ID: 'corporate')
// ==================================================
// Dentro de src/utils/pdfTemplates.js

// ... (mantenha as outras funções de template e as funções auxiliares no início do arquivo)

// ==================================================
// 3. TEMPLATE CORPORATIVO (ID: 'corporate') - VERSÃO ATUALIZADA POR VOCÊ
// ==================================================
export const templateCorporate = (curriculo, corPrimaria = '#00bcd4') => `
<html>
<head>
  <meta charset="UTF-8">
  <title>Currículo - ${curriculo.dadosPessoais?.nome}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <style>
    @page { size: A4; margin: 0; }
    body {
      font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0;
      background: #fff; -webkit-print-color-adjust: exact;
    }
    .container {
      display: grid; grid-template-columns: 30% 70%;
      width: 210mm; height: 297mm; margin: auto;
    }
    .sidebar {
      background: #000; color: #fff; padding: 25px 20px;
    }
      .photo {
      margin-bottom: 25px;
      }
    .photo img {
      width: 160px; height: 160px; border-radius: 50%;
      object-fit: cover; border: 4px solid ${corPrimaria};
    }
    .sidebar-section { text-align: left; margin-bottom: 25px; }
    .sidebar-section h3 {
      background: ${corPrimaria}; color: #fff; font-size: 13px;
      font-weight: bold; padding: 8px 26px; margin: 0 0 15px -20px;
      border-radius: 0 21px 0 0; text-transform: uppercase;
    }
    .sidebar-section p, .sidebar-section li {
      font-size: 12px; margin: 8px 0; color: #e5e5e5;
    }
    .sidebar-section ul { list-style: none; padding-left: 0; margin: 0; }
    .sidebar-section li { display: flex; align-items: center; margin-bottom: 10px; }
    .sidebar-section li i { margin-right: 10px; color: ${corPrimaria}; font-size: 14px; width: 15px; text-align: center; }
    .content { padding: 35px 40px; background: #fff; }
    .content .header { margin-bottom: 20px; }
    .content h1 {
      font-size: 30px; margin: 0; color: #fff; text-transform: uppercase;
      font-weight: bold;
    }
    .subtitle {
      font-size: 13px; color: #fff; margin: 5px 0 0 0; text-transform: uppercase;
      font-weight: bold;
    }
    .content h2 {
      font-size: 14px; margin-top: 22px; margin-bottom: 10px;
      border-bottom: 1px solid #ccc; padding-bottom: 4px;
      color: #111; text-transform: uppercase;
    }
    .job { margin-bottom: 15px; }
    .job h4 {
      font-weight: bold; font-size: 13px; margin: 0 0 5px 0;
    }
    .job .date {
      font-size: 11px; color: #555; font-style: italic; margin-bottom: 5px;
    }
    .content p { font-size: 12px; margin: 4px 0; line-height: 1.5; text-align: justify; }
    .content ul { margin: 5px 0 10px 18px; padding: 0; font-size: 12px; }
    .skills-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 8px; margin-top: 10px;
    }
    .skill {
      background: #f0f0f0; border: 1px solid #ddd; font-size: 11px;
      text-align: center; padding: 6px; border-radius: 4px;
      font-weight: bold; color: #333;
    }
    .container-background {
      width: 100%; 
      margin-left: -40px; 
      padding:27px;
      background-color: ${corPrimaria}; 
      margin-top: 35px; 
      margin-bottom: 35px;
    }
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      <div class="photo">
        <img src="${curriculo.fotoBase64 || './assets/icon.png'}" alt="Foto do candidato">
      </div>
      <div class="sidebar-section">
        <h3>Formação</h3>
        ${(curriculo.formacao || []).map(f => `
          <p><strong>${f.curso || ""}</strong><br>
          ${f.instituicao || ""}<br>
          <em>${f.anoConclusao ? `Concluído em ${formatDate(f.anoConclusao)}` : ""}</em></p>
        `).join("")}
      </div>
      <div class="sidebar-section">
        <h3>Contato</h3>
        <ul>
          ${curriculo.dadosPessoais?.email ? `<li><i class="fas fa-envelope"></i> ${curriculo.dadosPessoais.email}</li>` : ""}
          ${curriculo.dadosPessoais?.telefone ? `<li><i class="fas fa-phone"></i> ${curriculo.dadosPessoais.telefone}</li>` : ""}
          ${curriculo.dadosPessoais?.linkedin ? `<li><i class="fab fa-linkedin"></i> ${curriculo.dadosPessoais.linkedin}</li>` : ""}
          ${curriculo.dadosPessoais?.site ? `<li><i class="fas fa-globe"></i> ${curriculo.dadosPessoais.site}</li>` : ""}
        </ul>
      </div>
      <div class="sidebar-section">
        <h3>Idiomas</h3>
        ${(curriculo.idiomas || []).map(i => `<p><strong>${i.idioma}:</strong> ${i.nivel}</p>`).join("")}
      </div>
    </aside>
    <main class="content">
      <div class="container-background">
        <h1>${curriculo.dadosPessoais?.nome || "Seu Nome Completo"}</h1>
        <p class="subtitle">${curriculo.resumoProfissional || "Sua Profissão ou Área de Interesse"}</p>
      </div>
      
      ${curriculo.objetivoProfissional ? `
      <h2>Sobre Mim</h2>
      <p>${curriculo.objetivoProfissional}</p>` : ""}
      
      <h2>Experiência Profissional</h2>
      ${(curriculo.experiencias || []).map(exp => `
        <div class="job">
          <h4>${exp.cargo} – ${exp.empresa}</h4>
          <p class="date">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</p>
          <p>${exp.atividades || ""}</p>
        </div>
      `).join("")}
      
      ${(curriculo.certificacoes && curriculo.certificacoes.length > 0) ? `
      <h2>Cursos e Certificações</h2>
      ${curriculo.certificacoes.map(c => `<p><strong>${c.nome}</strong> - ${c.instituicao} (${c.anoConclusao ? formatDate(c.anoConclusao) : ''})</p>`).join("")}` : ""}
      
      ${(curriculo.hardSkills && curriculo.hardSkills.length > 0) ? `
      <h2>Hard Skills</h2>
      <div class="skills-grid">
        ${curriculo.hardSkills.map(h => `<div class="skill">${h.habilidade}</div>`).join("")}
      </div>` : ""}

      ${(curriculo.softSkills && curriculo.softSkills.length > 0) ? `
      <h2>Soft Skills</h2>
      <div class="skills-grid">
        ${curriculo.softSkills.map(s => `<div class="skill">${s.habilidade}</div>`).join("")}
      </div>` : ""}
    </main>
  </div>
</body>
</html>
`;


// ==================================================
// 4. TEMPLATE ELEGANTE (ID: 'elegant')
// ==================================================
export const templateElegant = (curriculo, corPrimaria = '#c2185b') => `
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=Poppins:wght@400&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Poppins', sans-serif; display: flex; font-size: 10pt; }
    .sidebar { width: 35%; background: #fff0f6; padding: 25px; text-align: center; }
    .profile-pic { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 4px solid ${corPrimaria}; margin-bottom: 15px; }
    h1 { font-family: 'Lora', serif; font-size: 22pt; color: ${corPrimaria}; margin: 0; }
    .sidebar p { font-size: 9pt; margin: 4px 0; color: #ad1457; }
    .sidebar-title { font-family: 'Lora', serif; font-size: 13pt; font-weight: 600; color: ${corPrimaria}; text-align: left; margin-top: 25px; margin-bottom: 8px; }
    .sidebar ul { list-style-type: '— '; padding-left: 10px; text-align: left; }
    .sidebar li { font-size: 9pt; margin-bottom: 5px; }
    .main { flex: 1; padding: 30px; background: #fff; }
    .main-title { font-family: 'Lora', serif; font-size: 18pt; color: ${corPrimaria}; border-bottom: 2px solid #f8bbd0; padding-bottom: 6px; margin-bottom: 15px; }
    .job { margin-bottom: 18px; }
    .main p { font-size: 10pt; line-height: 1.6; }
  </style>
</head>
<body>
  <aside class="sidebar">
    ${curriculo.fotoBase64 ? `<img src="${curriculo.fotoBase64}" alt="Foto" class="profile-pic">` : ''}
    <h1>${curriculo.dadosPessoais?.nome || "Seu Nome"}</h1>
    <hr style="border:0; border-top:1px solid #f8bbd0; margin: 20px 0;">
    <div class="sidebar-title">Contato</div>
    <p>${curriculo.dadosPessoais?.email || "-"}</p>
    <p>${curriculo.dadosPessoais?.telefone || "-"}</p>
    <div class="sidebar-title">Habilidades</div>
    ${gerarListaHTML(curriculo.habilidades, h => `<li>${h.habilidade}</li>`)}
  </aside>
  <main class="main">
    <h2 class="main-title">Resumo Profissional</h2>
    <p>${curriculo.resumoProfissional || "-"}</p>
    <h2 class="main-title" style="margin-top:25px;">Experiência</h2>
    ${(curriculo.experiencias || []).map(exp => `
      <div class="job">
        <p><b>${exp.cargo}</b> - ${exp.empresa} (${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)})</p>
        <p>${exp.atividades}</p>
      </div>
    `).join("")}
    <h2 class="main-title" style="margin-top:25px;">Formação</h2>
    ${(curriculo.formacao || []).map(f => `<p><b>${f.curso}</b> - ${f.instituicao}, ${formatDate(f.anoConclusao)}</p>`).join("")}
  </main>
</body>
</html>`;

// ==================================================
// 5. TEMPLATE MINIMALISTA (ID: 'minimalist')
// ==================================================
export const templateMinimalist = (curriculo, corPrimaria = '#111827') => {
  // Helper para renderizar uma seção apenas se ela tiver conteúdo.
  const renderSection = (title, content) => {
    if (!content || content.trim() === '') return '';
    return `
      <div class="section">
        <div class="section-title">${title}</div>
        ${content}
      </div>
    `;
  };
  
  // Helper para gerar a lista de contatos de forma limpa.
  const getContatoLinks = (dados) => {
    if (!dados) return '';
    
    const hasLinkedin = dados.linkedin && dados.linkedin.trim() !== '';
    const hasSite = dados.site && dados.site.trim() !== '';

    const contatos = [
      dados.email ? `<a href="mailto:${dados.email}">${dados.email}</a>` : null,
      dados.telefone ? `<a href="tel:${dados.telefone.replace(/\D/g, '')}">${dados.telefone}</a>` : null,
      (dados.cidade && dados.estado) ? `<span>${dados.cidade}, ${dados.estado}</span>` : null,
      // AJUSTE: O texto do link agora é a própria URL, em vez da palavra "LinkedIn" ou "Site".
      hasLinkedin ? `<a href="https://www.${dados.linkedin.replace(/^(https?:\/\/)?(www\.)?/, '')}" target="_blank">${dados.linkedin}</a>` : null,
      hasSite ? `<a href="https://${dados.site.replace(/^(https?:\/\/)?/, '')}" target="_blank">${dados.site}</a>` : null
    ];
    return contatos.filter(Boolean).join(' • ');
  };

  // Funções para formatar as datas
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC', month: 'long', year: 'numeric' });
  };

  const formatPeriodo = (inicio, fim, atual) => {
      const dataInicio = formatDate(inicio);
      const dataFim = atual ? 'Presente' : formatDate(fim);
      if (!dataInicio) return '';
      return `${dataInicio} – ${dataFim}`;
  };

  return `
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; color: #374151; font-size: 9.5pt; background: #fff; line-height: 1.45; }
    a { color: inherit; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .container { max-width: 210mm; margin: auto; padding: 20mm 18mm; box-sizing: border-box; }
    h1 { font-size: 24pt; font-weight: 700; text-align: center; margin: 0; padding: 0; color: ${corPrimaria}; }
    .subtitle { font-size: 11pt; font-weight: 600; text-align: center; margin-top: 2px; margin-bottom: 8px; color: #374151; }
    .contato { text-align: center; font-size: 9pt; margin-bottom: 20px; color: #4b5563; }
    
    .section { 
      margin-bottom: 16px; 
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .section-title { font-size: 12pt; font-weight: 600; color: ${corPrimaria}; padding-bottom: 4px; border-bottom: 1.5px solid ${corPrimaria}; margin-bottom: 10px; }
    
    .item { 
      margin-bottom: 12px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .item-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 5px; }
    .item-title { font-size: 10.5pt; font-weight: 600; }
    .item-subtitle { font-size: 10pt; color: #4b5563; margin-bottom: 4px; }
    .item-period { font-size: 9pt; color: #6b7280; font-style: italic; white-space: nowrap; }
    p { margin: 0; }
    ul { padding-left: 18px; margin: 4px 0 0 0; }
    li { margin-bottom: 2px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${curriculo.dadosPessoais?.nome || "Seu Nome"}</h1>
    ${curriculo.resumoProfissional ? `<p class="subtitle">${curriculo.resumoProfissional}</p>` : ""}
    <p class="contato">${getContatoLinks(curriculo.dadosPessoais)}</p>
    
    ${renderSection('Objetivo', curriculo.objetivoProfissional ? `<p>${curriculo.objetivoProfissional}</p>` : '')}

    ${renderSection('Experiência', (curriculo.experiencias || []).map(exp => `
      <div class="item">
        <div class="item-header">
          <span class="item-title">${exp.cargo || ""}</span>
          <span class="item-period">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</span>
        </div>
        <p class="item-subtitle">${exp.empresa || ""}</p>
        ${(Array.isArray(exp.atividades) && exp.atividades.length > 0)
          ? `<ul>${exp.atividades.map(a => `<li>${a}</li>`).join('')}</ul>`
          : `<p>${exp.atividades || ""}</p>`
        }
      </div>
    `).join(""))}
    
    ${renderSection('Formação', (curriculo.formacao || []).map(f => `
      <div class="item">
        <p class="item-title">${f.curso || ""}</p>
        <p>${f.instituicao || ""}${f.anoConclusao ? `, ${formatDate(f.anoConclusao)}` : ""}</p>
      </div>
    `).join(""))}

    ${renderSection('Cursos e Certificações', (curriculo.certificacoes || []).map(c => `
      <div class="item">
        <p><b>${c.nome || ""}</b> – ${c.instituicao || ""}${c.anoConclusao ? ` (${formatDate(c.anoConclusao)})` : ""}</p>
      </div>
    `).join(""))}

    ${renderSection('Hard Skills', (curriculo.hardSkills && curriculo.hardSkills.length > 0) ? `
      <ul>
        ${curriculo.hardSkills.map(h => `<li>${h.habilidade}</li>`).join("")}
      </ul>
    ` : '')}

    ${renderSection('Soft Skills', (curriculo.softSkills && curriculo.softSkills.length > 0) ? `
      <ul>
        ${curriculo.softSkills.map(s => `<li>${s.habilidade}</li>`).join("")}
      </ul>
    ` : '')}

    ${renderSection('Idiomas', (curriculo.idiomas || []).map(i => `
      <p><b>${i.idioma}:</b> ${i.nivel}</p>
    `).join(""))}

  </div>
</body>
</html>`;
};

// ==================================================
// 6. TEMPLATE COLUNA INVERTIDA (ID: 'inverted')
// ==================================================
export const templateInverted = (curriculo, corPrimaria = '#064e3b') => `
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Open Sans', sans-serif; display: flex; flex-direction: row-reverse; font-size: 10pt; }
    .sidebar { width: 35%; background: #f0fdf4; padding: 25px; color: #065f46; text-align: right; }
    .sidebar h2 { font-family: 'Merriweather', serif; font-size: 14pt; color: ${corPrimaria}; border-bottom: 2px solid ${corPrimaria}; padding-bottom: 5px; }
    .sidebar p { font-size: 9pt; }
    .main { flex: 1; padding: 25px; }
    .header { text-align: left; margin-bottom: 20px; }
    h1 { font-family: 'Merriweather', serif; font-size: 28pt; color: ${corPrimaria}; margin: 0; }
    .main-title { font-family: 'Merriweather', serif; font-size: 16pt; color: ${corPrimaria}; border-bottom: 2px solid ${corPrimaria}; padding-bottom: 5px; margin-bottom: 10px; }
    .job { margin-bottom: 15px; }
    .job b { font-weight: 600; }
  </style>
</head>
<body>
  <aside class="sidebar">
    ${curriculo.fotoBase64 ? `<img src="${curriculo.fotoBase64}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; margin-bottom: 10px;">` : ''}
    <h2>Contato</h2>
    <p>${curriculo.dadosPessoais?.email || ""}</p>
    <p>${curriculo.dadosPessoais?.telefone || ""}</p>
    <p>${curriculo.dadosPessoais?.linkedin || ""}</p>
    <h2>Habilidades</h2>
    ${(curriculo.habilidades || []).map(h => `<p>${h.habilidade}</p>`).join("")}
  </aside>
  <main class="main">
    <div class="header">
      <h1>${curriculo.dadosPessoais?.nome || "Seu Nome"}</h1>
    </div>
    <div class="main-title">Resumo</div>
    <p>${curriculo.resumoProfissional || "-"}</p>
    <div class="main-title" style="margin-top:20px">Experiência</div>
    ${(curriculo.experiencias || []).map(exp => `
      <div class="job">
        <p><b>${exp.cargo}</b>, ${exp.empresa}</p>
        <p style="font-size:9pt; color:#555">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</p>
        <p>${exp.atividades}</p>
      </div>
    `).join("")}
     <div class="main-title" style="margin-top:20px">Formação</div>
     ${(curriculo.formacao || []).map(f => `<p><b>${f.curso}</b> - ${f.instituicao}, ${formatDate(f.anoConclusao)}</p>`).join("")}
  </main>
</body>
</html>`;

// ==================================================
// 7. TEMPLATE TOPO DIVIDIDO (ID: 'split')
// ==================================================
export const templateSplit = (curriculo, corPrimaria = '#4f46e5') => `
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Montserrat', sans-serif; font-size: 10pt; }
    .header-container { position: relative; height: 160px; margin-bottom: 60px; }
    .bg-left { position: absolute; left: 0; top: 0; width: 60%; height: 100%; background: ${corPrimaria}; }
    .bg-right { position: absolute; right: 0; top: 0; width: 40%; height: 100%; background: #e0e7ff; }
    .header-content { position: absolute; top: 20px; left: 30px; right: 30px; display: flex; align-items: center; }
    .profile-pic { width: 120px; height: 120px; border-radius: 50%; border: 5px solid white; object-fit: cover; }
    .header-text { margin-left: 20px; }
    h1 { color: white; font-size: 26pt; margin: 0; }
    .header-text p { color: #ddd; margin: 5px 0; font-size: 9pt; }
    .content { padding: 0 30px; }
    .section-title { font-size: 14pt; font-weight: 700; color: ${corPrimaria}; margin-top: 20px; margin-bottom: 10px; }
    .job { margin-bottom: 15px; }
  </style>
</head>
<body>
  <div class="header-container">
    <div class="bg-left"></div>
    <div class="bg-right"></div>
    <div class="header-content">
      ${curriculo.fotoBase64 ? `<img src="${curriculo.fotoBase64}" class="profile-pic">` : ''}
      <div class="header-text">
        <h1>${curriculo.dadosPessoais?.nome || "Seu Nome"}</h1>
        <p>${curriculo.dadosPessoais?.email || ""} | ${curriculo.dadosPessoais?.telefone || ""}</p>
      </div>
    </div>
  </div>
  <div class="content">
    <div class="section-title">Resumo</div>
    <p>${curriculo.resumoProfissional || "-"}</p>
    <div class="section-title">Experiência</div>
    ${(curriculo.experiencias || []).map(exp => `
      <div class="job">
        <p><b>${exp.cargo}</b> em ${exp.empresa}</p>
        <p style="font-size:9pt; color:#555">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</p>
        <p>${exp.atividades}</p>
      </div>
    `).join("")}
  </div>
</body>
</html>`;

// ==================================================
// 8. TEMPLATE MODERNO ESCURO (ID: 'dark')
// ==================================================
export const templateDark = (curriculo, corPrimaria = '#34d399') => `
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body { background: #1f2937; color: #d1d5db; font-family: 'Source Code Pro', monospace; font-size: 10pt; }
    h1 { font-family: 'Space Grotesk', sans-serif; font-size: 28pt; color: ${corPrimaria}; text-align: center; margin-bottom: 5px; }
    .contato { text-align: center; font-size: 9pt; color: #9ca3af; margin-bottom: 30px; }
    .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 15pt; font-weight: 700; color: ${corPrimaria}; margin-top: 20px; margin-bottom: 10px; }
    .job { margin-bottom: 15px; border-left: 2px solid ${corPrimaria}; padding-left: 15px; }
    .job-title { font-weight: 600; color: #f9fafb; }
    .job-period { color: #9ca3af; font-size: 9pt; }
    p { line-height: 1.6; }
    ul { list-style: '>> '; padding-left: 20px; }
  </style>
</head>
<body>
  ${curriculo.fotoBase64 ? `<img src="${curriculo.fotoBase64}" style="width:80px;height:80px;border-radius:50%;display:block;margin:0 auto 15px;">` : ''}
  <h1>${curriculo.dadosPessoais?.nome || "SEU NOME"}</h1>
  <p class="contato">${curriculo.dadosPessoais?.email || ""}</p>
  
  <div class="section-title">// RESUMO</div>
  <p>${curriculo.resumoProfissional || "-"}</p>
  
  <div class="section-title" style="margin-top:25px;">// EXPERIÊNCIA</div>
  ${(curriculo.experiencias || []).map(exp => `
    <div class="job">
      <p class="job-title">${exp.cargo} @ ${exp.empresa}</p>
      <p class="job-period">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</p>
      <p>${exp.atividades}</p>
    </div>
  `).join("")}
  
  <div class="section-title" style="margin-top:25px;">// FORMAÇÃO</div>
  ${(curriculo.formacao || []).map(f => `<p><b>${f.curso}</b> - ${f.instituicao}</p>`).join("")}

  <div class="section-title" style="margin-top:25px;">// HABILIDADES</div>
  ${gerarListaHTML(curriculo.habilidades, h => `<li>${h.habilidade}</li>`)}
</body>
</html>`;