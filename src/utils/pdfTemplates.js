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
export const templateCreative = (curriculo, corPrimaria = '#1e40af') => `
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Poppins', sans-serif; background:#f3f4f6; color:#1f2937; font-size: 10pt; }
    .header { background: ${corPrimaria}; color: #fff; padding: 30px; text-align: center; }
    .profile-pic { width: 100px; height: 100px; border-radius: 50%; border: 4px solid rgba(255,255,255,0.5); margin-bottom: 10px; object-fit: cover; }
    h1 { margin: 0; font-size: 24pt; }
    .header p { margin: 4px 0; opacity: 0.9; }
    .content { padding: 25px; }
    .card { background: #fff; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .section-title { color: ${corPrimaria}; font-size: 16pt; font-weight: 600; border-bottom: 2px solid ${corPrimaria}; padding-bottom: 5px; margin-bottom: 15px; }
    .job { margin-bottom: 15px; }
    .job b { font-size: 12pt; color: #111827; }
    p { line-height: 1.6; }
  </style>
</head>
<body>
  <div class="header">
    ${curriculo.fotoBase64 ? `<img src="${curriculo.fotoBase64}" alt="Foto" class="profile-pic">` : ''}
    <h1>${curriculo.dadosPessoais?.nome || "Seu Nome"}</h1>
    <p>${curriculo.dadosPessoais?.email || ""} | ${curriculo.dadosPessoais?.telefone || ""}</p>
    <p>${curriculo.dadosPessoais?.linkedin || ""} ${curriculo.dadosPessoais?.site ? `| ${curriculo.dadosPessoais.site}` : ""}</p>
  </div>
  <div class="content">
    ${curriculo.resumoProfissional ? `<div class="card"><div class="section-title">Resumo</div><p>${curriculo.resumoProfissional}</p></div>` : ''}
    <div class="card">
      <div class="section-title">Experiência</div>
      ${(curriculo.experiencias || []).map(exp => `
        <div class="job">
          <p><b>${exp.cargo}</b> - ${exp.empresa} (${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)})</p>
          <p style="font-size: 10pt;">${exp.atividades}</p>
        </div>
      `).join("")}
    </div>
    <div class="card">
      <div class="section-title">Formação</div>
      ${(curriculo.formacao || []).map(f => `<p><b>${f.curso}</b> - ${f.instituicao}, ${formatDate(f.anoConclusao)}</p>`).join("")}
    </div>
  </div>
</body>
</html>`;

// ==================================================
// 3. TEMPLATE CORPORATIVO (ID: 'corporate')
// ==================================================
export const templateCorporate = (curriculo, corPrimaria = '#1e3a8a') => `
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Roboto', sans-serif; display: flex; font-size: 10pt; }
    .sidebar { width: 35%; background: #eef2ff; padding: 25px; color: #1e3a8a; }
    .profile-pic { width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 15px; display: block; object-fit: cover; border: 4px solid ${corPrimaria}; }
    .sidebar h1 { font-size: 20pt; text-align: center; margin-bottom: 5px; color: ${corPrimaria}; }
    .sidebar-title { font-size: 12pt; font-weight: bold; margin-top: 20px; border-bottom: 2px solid ${corPrimaria}; padding-bottom: 3px; }
    .sidebar p, .sidebar li { font-size: 9pt; margin: 5px 0; word-wrap: break-word; }
    .sidebar ul { padding-left: 15px; margin: 5px 0; }
    .main { flex: 1; padding: 30px; color: #374151; }
    .main-title { font-size: 16pt; color: ${corPrimaria}; border-bottom: 2px solid ${corPrimaria}; padding-bottom: 5px; margin-bottom: 15px; }
    .main p { font-size: 10pt; line-height: 1.6; }
    .job { margin-bottom: 18px; }
  </style>
</head>
<body>
  <aside class="sidebar">
    ${curriculo.fotoBase64 ? `<img src="${curriculo.fotoBase64}" alt="Foto" class="profile-pic">` : ''}
    <h1>${curriculo.dadosPessoais?.nome || "Nome Completo"}</h1>
    <div class="sidebar-title">Contato</div>
    <p>${curriculo.dadosPessoais?.email || "-"}</p>
    <p>${curriculo.dadosPessoais?.telefone || "-"}</p>
    <p>${curriculo.dadosPessoais?.endereco || ""}</p>
    <p>${curriculo.dadosPessoais?.linkedin || ""}</p>
    <div class="sidebar-title">Habilidades</div>
    ${gerarListaHTML(curriculo.habilidades, h => `<li>${h.habilidade} - ${h.nivel}</li>`)}
  </aside>
  <main class="main">
    <h2 class="main-title">Resumo Profissional</h2>
    <p>${curriculo.resumoProfissional || "Nenhum resumo fornecido."}</p>
    <h2 class="main-title" style="margin-top:25px;">Experiência</h2>
    ${(curriculo.experiencias || []).map(exp => `
      <div class="job">
        <p><b>${exp.cargo}</b> em <b>${exp.empresa}</b></p>
        <p style="color:#6b7280; font-size: 9pt;">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</p>
        <p>${exp.atividades}</p>
      </div>
    `).join("")}
    <h2 class="main-title" style="margin-top:25px;">Formação</h2>
    ${(curriculo.formacao || []).map(f => `<p><b>${f.curso}</b> - ${f.instituicao}, ${formatDate(f.anoConclusao)}</p>`).join("")}
  </main>
</body>
</html>`;

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
export const templateMinimalist = (curriculo, corPrimaria = '#111827') => `
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; color: #374151; font-size: 10pt; background: #fff; }
    h1 { font-size: 32pt; font-weight: 700; text-align: center; margin-bottom: 5px; color: ${corPrimaria}; }
    .contato { text-align: center; font-size: 9pt; margin-bottom: 30px; color: #6b7280; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 13pt; font-weight: 600; color: ${corPrimaria}; padding-bottom: 5px; border-bottom: 2px solid ${corPrimaria}; margin-bottom: 10px; }
    .job-title { font-size: 11pt; font-weight: 600; }
    .job-details { display: flex; justify-content: space-between; font-size: 9pt; color: #6b7280; margin: 2px 0 5px 0; }
    p { line-height: 1.5; margin: 0; }
    ul { padding-left: 20px; margin-top: 5px; } li { margin-bottom: 4px; }
  </style>
</head>
<body>
  <h1>${curriculo.dadosPessoais?.nome || "Seu Nome"}</h1>
  <p class="contato">${curriculo.dadosPessoais?.email || ""} ${curriculo.dadosPessoais?.telefone ? `• ${curriculo.dadosPessoais.telefone}` : ""} ${curriculo.dadosPessoais?.linkedin ? `• LinkedIn` : ""}</p>
  
  <div class="section">
    <div class="section-title">Resumo</div>
    <p>${curriculo.resumoProfissional || "-"}</p>
  </div>

  <div class="section">
    <div class="section-title">Experiência</div>
    ${(curriculo.experiencias || []).map(exp => `
      <div>
        <p class="job-title">${exp.cargo || ""}</p>
        <div class="job-details">
          <span>${exp.empresa || ""}</span>
          <span>${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</span>
        </div>
        <p>${exp.atividades || ""}</p>
      </div>
    `).join("<br>")}
  </div>
  
  <div class="section">
    <div class="section-title">Formação</div>
    ${(curriculo.formacao || []).map(f => `<p><b>${f.curso || ""}</b>, ${f.instituicao || ""}, ${formatDate(f.anoConclusao)}</p>`).join("")}
  </div>

  <div class="section">
    <div class="section-title">Habilidades</div>
    ${gerarListaHTML(curriculo.habilidades, h => `<li>${h.habilidade}</li>`)}
  </div>
</body>
</html>`;

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