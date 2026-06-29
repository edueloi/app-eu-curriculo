// --- FUNÇÕES AUXILIARES ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

const formatPeriodo = (inicio, fim, atual) => {
  const dataInicio = formatDate(inicio);
  const dataFim = atual ? 'Presente' : formatDate(fim);
  if (!dataInicio) return '';
  return `${dataInicio} – ${dataFim}`;
};

// CSS base compartilhado: sem mm, totalmente fluido
const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  a { color: inherit; text-decoration: none; }
  p { margin: 0; }
`;

// ==================================================
// 1. TEMPLATE CLÁSSICO (ID: 'classic')
// ==================================================
export const templateClassic = (curriculo, corPrimaria = '#1A237E', t) => `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
${BASE_CSS}
@page { margin: 15mm; }
body { padding: 48px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; font-size: 10.5pt; background: #fff; line-height: 1.5; }
@media print { body { padding: 0 !important; } }
.header { text-align: center; border-bottom: 2px solid ${corPrimaria}; padding-bottom: 16px; margin-bottom: 16px; }
.photo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 12px; border: 2px solid ${corPrimaria}; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
h1 { font-size: 24pt; color: ${corPrimaria}; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.5px; }
.contato { font-size: 9pt; color: #666; line-height: 1.6; margin-top: 8px; }
.contato span { white-space: nowrap; }
.section-title { font-size: 13pt; font-weight: 700; color: ${corPrimaria}; margin-top: 20px; margin-bottom: 12px; border-bottom: 1px solid ${corPrimaria}40; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; }
.summary { font-size: 10.5pt; line-height: 1.6; color: #444; margin-bottom: 16px; text-align: justify; }
.job { margin-bottom: 16px; page-break-inside: avoid; }
.job-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
.job-title { font-weight: 700; font-size: 11pt; color: #222; }
.job-period { color: #777; font-size: 9.5pt; font-style: italic; }
.job-company { font-size: 10.5pt; color: #555; margin-bottom: 4px; font-weight: 500; }
.job-desc { font-size: 10pt; color: #444; line-height: 1.5; }
.edu { margin-bottom: 12px; page-break-inside: avoid; }
.edu-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
.edu-course { font-weight: 700; font-size: 11pt; color: #222; }
.edu-inst { font-size: 10pt; color: #555; }
.cert { font-size: 10pt; margin-bottom: 6px; line-height: 1.5; page-break-inside: avoid; }
.skills-text { font-size: 10.5pt; color: #333; line-height: 1.6; }
.lang-item { font-size: 10.5pt; margin-bottom: 6px; display: flex; justify-content: space-between; max-width: 350px; border-bottom: 1px dashed #eee; padding-bottom: 4px; page-break-inside: avoid; }
.lang-level { color: #777; font-style: italic; }
</style></head><body>

<div class="header">
  ${curriculo.fotoBase64 ? `<img src="${curriculo.fotoBase64}" class="photo">` : ''}
  <h1>${curriculo.dadosPessoais?.nome || 'Seu Nome Completo'}</h1>
  <div class="contato">
    ${[curriculo.dadosPessoais?.email, curriculo.dadosPessoais?.telefone,
       (curriculo.dadosPessoais?.cidade ? curriculo.dadosPessoais.cidade + (curriculo.dadosPessoais?.estado ? '/' + curriculo.dadosPessoais.estado : '') : null),
       curriculo.dadosPessoais?.linkedin, curriculo.dadosPessoais?.site]
      .filter(Boolean).map(c => `<span>${c}</span>`).join(' &nbsp;•&nbsp; ')}
  </div>
</div>

${curriculo.resumoProfissional ? `<div class="section-title">Resumo Profissional</div><p class="summary">${curriculo.resumoProfissional}</p>` : ''}
${curriculo.objetivoProfissional ? `<div class="section-title">Objetivo</div><p class="summary">${curriculo.objetivoProfissional}</p>` : ''}

${(curriculo.experiencias?.length) ? `
<div class="section-title">Experiência Profissional</div>
${curriculo.experiencias.map(exp => `
<div class="job">
  <div class="job-header">
    <div class="job-title">${exp.cargo || ''}</div>
    <div class="job-period">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</div>
  </div>
  <div class="job-company">${exp.empresa || ''}</div>
  ${exp.atividades ? `<div class="job-desc">${exp.atividades}</div>` : ''}
</div>`).join('')}` : ''}

${(curriculo.formacao?.length) ? `
<div class="section-title">Formação Acadêmica</div>
${curriculo.formacao.map(f => `
<div class="edu">
  <div class="edu-header">
    <div class="edu-course">${f.curso || ''} ${f.nivel ? `(${f.nivel})` : ''}</div>
    ${f.anoConclusao ? `<div class="job-period">${formatDate(f.anoConclusao)}</div>` : ''}
  </div>
  <div class="edu-inst">${f.instituicao || ''}</div>
</div>`).join('')}` : ''}

${(curriculo.certificacoes?.length) ? `
<div class="section-title">Cursos e Certificações</div>
${curriculo.certificacoes.map(c => `
<div class="cert"><b>${c.nome || ''}</b> — ${c.instituicao || ''}${c.anoConclusao ? ` (${formatDate(c.anoConclusao)})` : ''}</div>`).join('')}` : ''}

${(curriculo.hardSkills?.length || curriculo.softSkills?.length) ? `
<div class="section-title">Habilidades</div>
<div class="skills-text">
  ${[...(curriculo.hardSkills || []), ...(curriculo.softSkills || [])].map(h => `<b>${h.habilidade}</b>`).join(' &nbsp;•&nbsp; ')}
</div>` : ''}

${(curriculo.idiomas?.length) ? `
<div class="section-title">Idiomas</div>
${curriculo.idiomas.map(i => `<div class="lang-item"><b>${i.idioma}</b> <span class="lang-level">${t ? t('languageLevels.' + i.nivel) || i.nivel : i.nivel}</span></div>`).join('')}` : ''}

</body></html>`;


// ==================================================
// 2. TEMPLATE CRIATIVO (ID: 'creative')
// ==================================================
export const templateCreative = (curriculo, corPrimaria = '#0F172A', t) => {
  const partesNome = (curriculo.dadosPessoais?.nome || 'Seu Nome').trim().split(/\s+/);
  const nomeExibicao = partesNome.length > 1 ? partesNome[0] + ' ' + partesNome[partesNome.length - 1] : partesNome[0];
  
  return `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
${BASE_CSS}
@page { margin: 0; }
body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937; font-size: 10.5pt; background: #fff; display: flex; flex-direction: row; min-height: 100vh; margin: 0; }
.sidebar { width: 33%; background: ${corPrimaria}; padding: 40px 25px; display: flex; flex-direction: column; align-items: flex-start; color: #fff; }
.photo-wrap { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; background: rgba(255,255,255,0.1); border: 3px solid rgba(255,255,255,0.8); margin: 0 auto 35px auto; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.2); align-self: center; }
.photo-wrap img { width: 100%; height: 100%; object-fit: cover; }
.photo-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 32px; color: rgba(255,255,255,0.5); }
.sidebar-name { color: #fff; font-size: 18pt; font-weight: 800; text-align: left; margin-bottom: 6px; letter-spacing: 0.5px; align-self: stretch; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2); margin-top: -15px; }
.sidebar-role { color: rgba(255,255,255,0.85); font-size: 10pt; text-align: justify; margin-bottom: 30px; font-weight: 400; line-height: 1.6; }
.s-section { width: 100%; margin-bottom: 25px; }
.s-section h3 { color: #fff; font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 6px; margin-bottom: 12px; }
.contact-item { display: flex; align-items: center; margin-bottom: 10px; font-size: 9.5pt; color: rgba(255,255,255,0.85); line-height: 1.4; }
.contact-item p { margin: 0; padding: 0; margin-left: 8px; }
.s-section ul { list-style: none; padding: 0; }
.s-section li { font-size: 9.5pt; color: rgba(255,255,255,0.85); margin-bottom: 6px; padding-left: 12px; position: relative; }
.s-section li::before { content: "•"; color: rgba(255,255,255,0.5); position: absolute; left: 0; }
.content { flex: 1; background: #f8fafc; padding: 45px 40px; }
.section-title { font-size: 13pt; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid ${corPrimaria}; padding-bottom: 4px; margin-top: 25px; margin-bottom: 16px; display: inline-block; }
.section-title:first-child { margin-top: 0; }
.summary-text { font-size: 10.5pt; color: #475569; line-height: 1.7; text-align: justify; margin-bottom: 10px; }
.item { margin-bottom: 18px; page-break-inside: avoid; }
.item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.item-title { font-size: 12pt; font-weight: 700; color: #0f172a; }
.item-period { font-size: 9.5pt; color: #64748b; font-weight: 500; }
.item-sub { font-size: 10.5pt; color: #334155; font-weight: 600; margin-bottom: 6px; }
.item-desc { font-size: 10pt; color: #475569; line-height: 1.6; }
</style></head><body>
<aside class="sidebar">
  ${curriculo.fotoBase64 ? `<div class="photo-wrap"><img src="${curriculo.fotoBase64}" alt="foto"></div>` : ''}
  
  <div class="sidebar-name">${nomeExibicao}</div>
  ${curriculo.resumoProfissional ? `<div class="sidebar-role">${curriculo.resumoProfissional}</div>` : ''}

  <div class="s-section">
    <h3>Contato</h3>
    ${curriculo.dadosPessoais?.email ? `<div class="contact-item"><p>${curriculo.dadosPessoais.email}</p></div>` : ''}
    ${curriculo.dadosPessoais?.telefone ? `<div class="contact-item"><p>${curriculo.dadosPessoais.telefone}</p></div>` : ''}
    ${curriculo.dadosPessoais?.cidade ? `<div class="contact-item"><p>${curriculo.dadosPessoais.cidade}</p></div>` : ''}
    ${curriculo.dadosPessoais?.linkedin ? `<div class="contact-item"><p>${curriculo.dadosPessoais.linkedin}</p></div>` : ''}
  </div>

  ${curriculo.hardSkills?.length ? `
  <div class="s-section"><h3>Hard Skills</h3><ul>
    ${curriculo.hardSkills.map(h => `<li>${h.habilidade}</li>`).join('')}
  </ul></div>` : ''}

  ${curriculo.softSkills?.length ? `
  <div class="s-section"><h3>Soft Skills</h3><ul>
    ${curriculo.softSkills.map(s => `<li>${s.habilidade}</li>`).join('')}
  </ul></div>` : ''}

  ${curriculo.idiomas?.length ? `
  <div class="s-section"><h3>Idiomas</h3><ul>
    ${curriculo.idiomas.map(i => `<li><b>${i.idioma}</b> — ${t ? t('languageLevels.' + i.nivel) || i.nivel : i.nivel}</li>`).join('')}
  </ul></div>` : ''}
</aside>

<main class="content">
  ${curriculo.objetivoProfissional ? `
  <div class="section-title">Objetivo</div>
  <p class="summary-text">${curriculo.objetivoProfissional}</p>` : ''}

  ${curriculo.experiencias?.length ? `
  <div class="section-title">Experiência</div>
  ${curriculo.experiencias.map(exp => `
  <div class="item">
    <div class="item-header">
      <div class="item-title">${exp.cargo || ''}</div>
      <div class="item-period">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</div>
    </div>
    <div class="item-sub">${exp.empresa || ''}</div>
    ${exp.atividades ? `<div class="item-desc">${exp.atividades}</div>` : ''}
  </div>`).join('')}` : ''}

  ${curriculo.formacao?.length ? `
  <div class="section-title">Formação Acadêmica</div>
  ${curriculo.formacao.map(f => `
  <div class="item">
    <div class="item-header">
      <div class="item-title">${f.curso || ''} ${f.nivel ? `(${f.nivel})` : ''}</div>
      ${f.anoConclusao ? `<div class="item-period">${formatDate(f.anoConclusao)}</div>` : ''}
    </div>
    <div class="item-sub">${f.instituicao || ''}</div>
  </div>`).join('')}` : ''}

  ${curriculo.certificacoes?.length ? `
  <div class="section-title">Certificações</div>
  ${curriculo.certificacoes.map(c => `
  <div class="item">
    <div class="item-header">
      <div class="item-title">${c.nome || ''}</div>
      ${c.anoConclusao ? `<div class="item-period">${formatDate(c.anoConclusao)}</div>` : ''}
    </div>
    <div class="item-sub">${c.instituicao || ''}</div>
  </div>`).join('')}` : ''}
</main>
</body></html>`;
};


export const templateCorporate = (curriculo, corPrimaria = '#1E3A8A', t) => `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
${BASE_CSS}
@page { margin: 0; }
body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #334155; font-size: 11pt; background: #fff; line-height: 1.5; margin: 0; }
.header { background-color: ${corPrimaria}; color: #fff; padding: 40px 45px; display: flex; align-items: center; justify-content: space-between; }
.header-left { display: flex; align-items: center; max-width: 65%; }
.photo-wrap { width: 110px; height: 110px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.9); overflow: hidden; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.15); margin-right: 24px; }
.photo-wrap img { width: 100%; height: 100%; object-fit: cover; }
.name-area h1 { font-size: 26pt; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.5px; color: #fff; }
.name-area .role { font-size: 11.5pt; color: rgba(255,255,255,0.85); font-weight: 500; }
.header-right { max-width: 35%; display: flex; flex-direction: column; text-align: right; }
.contact-line { font-size: 10pt; color: rgba(255,255,255,0.9); margin-bottom: 6px; }
.contact-line:last-child { margin-bottom: 0; }
.main-wrap { display: flex; flex-direction: row; min-height: calc(100vh - 190px); }
.sidebar { width: 33%; background: #f8fafc; padding: 35px 30px; border-right: 1px solid #e2e8f0; }
.content { width: 67%; padding: 40px 45px; background: #fff; }
.section-title { font-size: 12.5pt; font-weight: 800; color: ${corPrimaria}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 16px; margin-top: 25px; }
.section-title:first-child { margin-top: 0; }
.sidebar-title { font-size: 11pt; font-weight: 800; color: ${corPrimaria}; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 14px; margin-top: 25px; }
.sidebar-title:first-child { margin-top: 0; }
.skills-list { list-style: none; padding: 0; }
.skills-list li { font-size: 10pt; color: #475569; margin-bottom: 8px; font-weight: 500; display: flex; align-items: baseline; }
.skills-list li::before { content: "■"; color: ${corPrimaria}; font-size: 8pt; margin-right: 8px; }
.job { margin-bottom: 22px; page-break-inside: avoid; }
.job-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.job-title { font-size: 12pt; font-weight: 700; color: #0f172a; }
.job-period { font-size: 10pt; color: ${corPrimaria}; font-weight: 600; }
.job-company { font-size: 11pt; color: #475569; font-weight: 600; margin-bottom: 6px; }
.job-desc { font-size: 10pt; color: #475569; line-height: 1.6; text-align: justify; }
.edu { margin-bottom: 16px; page-break-inside: avoid; }
.edu-title { font-size: 11pt; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
.edu-meta { font-size: 10pt; color: #64748b; }
.summary-text { font-size: 10.5pt; color: #334155; line-height: 1.6; text-align: justify; margin-bottom: 10px; }
</style></head><body>

<div class="header">
  <div class="header-left">
    ${curriculo.fotoBase64 ? `<div class="photo-wrap"><img src="${curriculo.fotoBase64}" alt="foto"></div>` : ''}
    <div class="name-area">
      <h1>${curriculo.dadosPessoais?.nome || 'Seu Nome'}</h1>
      ${curriculo.resumoProfissional ? `<div class="role">${curriculo.resumoProfissional}</div>` : ''}
    </div>
  </div>
  <div class="header-right">
    ${curriculo.dadosPessoais?.email ? `<div class="contact-line">${curriculo.dadosPessoais.email}</div>` : ''}
    ${curriculo.dadosPessoais?.telefone ? `<div class="contact-line">${curriculo.dadosPessoais.telefone}</div>` : ''}
    ${curriculo.dadosPessoais?.linkedin ? `<div class="contact-line">${curriculo.dadosPessoais.linkedin}</div>` : ''}
    ${curriculo.dadosPessoais?.cidade ? `<div class="contact-line">${curriculo.dadosPessoais.cidade}</div>` : ''}
  </div>
</div>

<div class="main-wrap">
  <aside class="sidebar">
    ${curriculo.hardSkills?.length ? `
    <div class="sidebar-title">Hard Skills</div>
    <ul class="skills-list">
      ${curriculo.hardSkills.map(h => `<li>${h.habilidade}</li>`).join('')}
    </ul>` : ''}

    ${curriculo.softSkills?.length ? `
    <div class="sidebar-title">Soft Skills</div>
    <ul class="skills-list">
      ${curriculo.softSkills.map(s => `<li>${s.habilidade}</li>`).join('')}
    </ul>` : ''}

    ${curriculo.idiomas?.length ? `
    <div class="sidebar-title">Idiomas</div>
    <ul class="skills-list">
      ${curriculo.idiomas.map(i => `<li><b>${i.idioma}</b> &nbsp;|&nbsp; ${t ? t('languageLevels.' + i.nivel) || i.nivel : i.nivel}</li>`).join('')}
    </ul>` : ''}
  </aside>

  <main class="content">
    ${curriculo.objetivoProfissional ? `
    <div class="section-title">Objetivo</div>
    <p class="summary-text">${curriculo.objetivoProfissional}</p>` : ''}

    ${curriculo.experiencias?.length ? `
    <div class="section-title">Experiência Profissional</div>
    ${curriculo.experiencias.map(exp => `
    <div class="job">
      <div class="job-header">
        <div class="job-title">${exp.cargo || ''}</div>
        <div class="job-period">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</div>
      </div>
      <div class="job-company">${exp.empresa || ''}</div>
      ${exp.atividades ? `<div class="job-desc">${exp.atividades}</div>` : ''}
    </div>`).join('')}` : ''}

    ${curriculo.formacao?.length ? `
    <div class="section-title">Formação Acadêmica</div>
    ${curriculo.formacao.map(f => `
    <div class="edu">
      <div class="edu-title">${f.curso || ''} ${f.nivel ? `(${f.nivel})` : ''}</div>
      <div class="edu-meta">${f.instituicao || ''}${f.anoConclusao ? ` &nbsp;•&nbsp; ${formatDate(f.anoConclusao)}` : ''}</div>
    </div>`).join('')}` : ''}

    ${curriculo.certificacoes?.length ? `
    <div class="section-title">Certificações</div>
    ${curriculo.certificacoes.map(c => `
    <div class="edu">
      <div class="edu-title">${c.nome || ''}</div>
      <div class="edu-meta">${c.instituicao || ''}${c.anoConclusao ? ` &nbsp;•&nbsp; ${formatDate(c.anoConclusao)}` : ''}</div>
    </div>`).join('')}` : ''}
  </main>
</div>
</body></html>`;


// ==================================================
// 4. TEMPLATE ELEGANTE (ID: 'elegant')
// ==================================================
export const templateElegant = (curriculo, corPrimaria = '#831843', t) => `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
${BASE_CSS}
@page { margin: 12mm 15mm; }
body { font-family: 'Georgia', 'Times New Roman', serif; color: #333; font-size: 11pt; background: #fff; line-height: 1.6; padding: 20px 25px; margin: 0; }
@media print { body { padding: 0 !important; } }
.header { text-align: center; margin-bottom: 25px; }
.photo-wrap { width: 90px; height: 90px; border-radius: 50%; border: 2px solid ${corPrimaria}; margin: 0 auto 15px auto; padding: 2px; }
.photo-wrap img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.name { font-size: 24pt; color: ${corPrimaria}; font-weight: normal; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px; }
.headline { font-size: 11pt; color: #555; font-style: italic; margin-bottom: 12px; }
.contact-row { text-align: center; font-size: 9.5pt; color: #666; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; }
.contact-row span { display: inline-block; white-space: nowrap; margin-bottom: 4px; }
.contact-row span:not(:last-child)::after { content: " | "; color: ${corPrimaria}; margin: 0 10px; font-weight: bold; }
.section-title { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11.5pt; font-weight: bold; color: ${corPrimaria}; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 15px; margin-top: 25px; border-bottom: 1px solid ${corPrimaria}; padding-bottom: 4px; text-align: left; }
.item { margin-bottom: 20px; page-break-inside: avoid; }
.item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.item-title { font-size: 11.5pt; font-weight: bold; color: #222; }
.item-period { font-size: 9.5pt; color: ${corPrimaria}; font-weight: normal; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
.item-sub { font-size: 10.5pt; color: #555; font-style: italic; margin-bottom: 4px; }
.item-desc { font-size: 10.5pt; color: #444; line-height: 1.6; text-align: justify; }
.summary-text { font-size: 10.5pt; color: #444; line-height: 1.6; text-align: justify; }
.skills-container { text-align: left; margin-bottom: 10px; }
.skill-pill { display: inline-block; border: 1px solid ${corPrimaria}; color: ${corPrimaria}; padding: 3px 12px; border-radius: 20px; font-size: 9.5pt; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 4px 6px 4px 0; }
</style></head><body>

<div class="header">
  ${curriculo.fotoBase64 ? `<div class="photo-wrap"><img src="${curriculo.fotoBase64}" alt="foto"></div>` : ''}
  <div class="name">${curriculo.dadosPessoais?.nome || 'Seu Nome'}</div>
  ${curriculo.resumoProfissional ? `<div class="headline">${curriculo.resumoProfissional}</div>` : ''}
  
  <div class="contact-row">
    ${curriculo.dadosPessoais?.email ? `<span>${curriculo.dadosPessoais.email}</span>` : ''}
    ${curriculo.dadosPessoais?.telefone ? `<span>${curriculo.dadosPessoais.telefone}</span>` : ''}
    ${curriculo.dadosPessoais?.linkedin ? `<span>${curriculo.dadosPessoais.linkedin}</span>` : ''}
    ${curriculo.dadosPessoais?.cidade ? `<span>${curriculo.dadosPessoais.cidade}</span>` : ''}
  </div>
</div>

${curriculo.objetivoProfissional ? `
<div class="section-title">Objetivo</div>
<p class="summary-text">${curriculo.objetivoProfissional}</p>` : ''}

${curriculo.experiencias?.length ? `
<div class="section-title">Experiência Profissional</div>
${curriculo.experiencias.map(exp => `
<div class="item">
  <div class="item-header">
    <div class="item-title">${exp.cargo || ''}</div>
    <div class="item-period">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</div>
  </div>
  <div class="item-sub">${exp.empresa || ''}</div>
  ${exp.atividades ? `<div class="item-desc">${exp.atividades}</div>` : ''}
</div>`).join('')}` : ''}

${curriculo.formacao?.length ? `
<div class="section-title">Formação Acadêmica</div>
${curriculo.formacao.map(f => `
<div class="item">
  <div class="item-header">
    <div class="item-title">${f.curso || ''} ${f.nivel ? `(${f.nivel})` : ''}</div>
    <div class="item-period">${f.anoConclusao ? formatDate(f.anoConclusao) : ''}</div>
  </div>
  <div class="item-sub">${f.instituicao || ''}</div>
</div>`).join('')}` : ''}

${curriculo.certificacoes?.length ? `
<div class="section-title">Certificações</div>
${curriculo.certificacoes.map(c => `
<div class="item">
  <div class="item-header">
    <div class="item-title">${c.nome || ''}</div>
    <div class="item-period">${c.anoConclusao ? formatDate(c.anoConclusao) : ''}</div>
  </div>
  <div class="item-sub">${c.instituicao || ''}</div>
</div>`).join('')}` : ''}

${(curriculo.hardSkills?.length || curriculo.softSkills?.length) ? `
<div class="section-title">Habilidades</div>
<div class="skills-container">
  ${[...(curriculo.hardSkills || []), ...(curriculo.softSkills || [])].map(h => `<span class="skill-pill">${h.habilidade}</span>`).join('')}
</div>` : ''}

${curriculo.idiomas?.length ? `
<div class="section-title">Idiomas</div>
<div class="skills-container">
  ${curriculo.idiomas.map(i => `<span class="skill-pill"><b>${i.idioma}</b> — ${t ? t('languageLevels.' + i.nivel) || i.nivel : i.nivel}</span>`).join('')}
</div>` : ''}

</body></html>`;


// ==================================================
// 5. TEMPLATE MINIMALISTA (ID: 'minimalist')
// ==================================================
export const templateMinimalist = (curriculo, corPrimaria = '#111827', t) => {
  const getContatos = (d) => {
    if (!d) return '';
    return [d.email, d.telefone, (d.cidade && d.estado ? d.cidade + '/' + d.estado : d.cidade), d.linkedin, d.site]
      .filter(Boolean).join(' • ');
  };
  return `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
${BASE_CSS}
@page { margin: 15mm; }
body { padding: 48px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #374151; font-size: 12px; background: #fff; line-height: 1.55; }
@media print { body { padding: 0 !important; } }
h1 { font-size: 26px; font-weight: 700; color: ${corPrimaria}; text-align: center; margin-bottom: 4px; }
.subtitle { font-size: 13px; font-weight: 600; color: #4b5563; text-align: center; margin-bottom: 6px; }
.contato { font-size: 10px; color: #6b7280; text-align: center; margin-bottom: 22px; }
.section-title { font-size: 11px; font-weight: 700; color: ${corPrimaria}; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1.5px solid ${corPrimaria}; padding-bottom: 3px; margin-top: 18px; margin-bottom: 10px; }
.item { margin-bottom: 11px; }
.item-header { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.item-title { font-size: 12px; font-weight: 700; color: #111; }
.item-period { font-size: 10px; color: #9ca3af; font-style: italic; white-space: nowrap; }
.item-sub { font-size: 11px; color: #4b5563; margin: 2px 0 3px; }
.item-desc { font-size: 11px; color: #444; line-height: 1.6; }
.skills-row { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 4px; }
.skill-chip { background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; font-size: 10px; padding: 2px 9px; border-radius: 10px; font-weight: 600; }
.lang-row { display: flex; justify-content: space-between; font-size: 11px; padding: 3px 0; border-bottom: 1px dotted #e5e7eb; }
.lang-row:last-child { border-bottom: none; }
</style></head><body>
<h1>${curriculo.dadosPessoais?.nome || 'Seu Nome'}</h1>
${curriculo.resumoProfissional ? `<p class="subtitle">${curriculo.resumoProfissional}</p>` : ''}
<p class="contato">${getContatos(curriculo.dadosPessoais)}</p>

${curriculo.objetivoProfissional ? `
<div class="section-title">Objetivo</div>
<p style="font-size:11px;line-height:1.7;color:#444">${curriculo.objetivoProfissional}</p>` : ''}

${curriculo.experiencias?.length ? `
<div class="section-title">Experiência</div>
${curriculo.experiencias.map(exp => `
<div class="item">
  <div class="item-header">
    <span class="item-title">${exp.cargo || ''}</span>
    <span class="item-period">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</span>
  </div>
  <div class="item-sub">${exp.empresa || ''}</div>
  <div class="item-desc">${exp.atividades || ''}</div>
</div>`).join('')}` : ''}

${curriculo.formacao?.length ? `
<div class="section-title">Formação</div>
${curriculo.formacao.map(f => `
<div class="item">
  <div class="item-header">
    <span class="item-title">${f.curso || ''}</span>
    ${f.anoConclusao ? `<span class="item-period">${formatDate(f.anoConclusao)}</span>` : ''}
  </div>
  <div class="item-sub">${f.instituicao || ''}${f.nivel ? ` — ${f.nivel}` : ''}</div>
</div>`).join('')}` : ''}

${curriculo.certificacoes?.length ? `
<div class="section-title">Certificações</div>
${curriculo.certificacoes.map(c => `
<div class="item">
  <div class="item-header">
    <span class="item-title">${c.nome || ''}</span>
    ${c.anoConclusao ? `<span class="item-period">${formatDate(c.anoConclusao)}</span>` : ''}
  </div>
  <div class="item-sub">${c.instituicao || ''}</div>
</div>`).join('')}` : ''}

${(curriculo.hardSkills?.length || curriculo.softSkills?.length) ? `
<div class="section-title">Habilidades</div>
<div class="skills-row">
  ${[...(curriculo.hardSkills || []), ...(curriculo.softSkills || [])].map(h => `<span class="skill-chip">${h.habilidade}</span>`).join('')}
</div>` : ''}

${curriculo.idiomas?.length ? `
<div class="section-title">Idiomas</div>
${curriculo.idiomas.map(i => `
<div class="lang-row">
  <b>${i.idioma}</b>
  <span style="color:#6b7280">${t ? t('languageLevels.' + i.nivel) || i.nivel : i.nivel}</span>
</div>`).join('')}` : ''}

</body></html>`;
};


// ==================================================
// 6. TEMPLATE COLUNA INVERTIDA (ID: 'inverted')
// ==================================================
export const templateInverted = (curriculo, corPrimaria = '#0277BD', t) => `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
${BASE_CSS}
body { font-family: 'Palatino Linotype', Palatino, Georgia, serif; color: #1a1a1a; font-size: 12px; background: #fff; display: flex; flex-direction: row-reverse; min-height: 100vh; }
.sidebar { width: 32%; background: #e8f4fd; padding: 24px 18px; border-left: 2px solid #bfdbfe; }
.photo-wrap { width: 80px; height: 80px; border-radius: 12px; overflow: hidden; border: 3px solid ${corPrimaria}; margin: 0 0 14px; }
.photo-wrap img { width: 100%; height: 100%; object-fit: cover; }
.s-section { margin-bottom: 16px; }
.s-section h3 { font-size: 10px; font-weight: 700; color: ${corPrimaria}; text-transform: uppercase; letter-spacing: 0.7px; border-bottom: 1.5px solid ${corPrimaria}44; padding-bottom: 4px; margin-bottom: 8px; }
.s-section p, .s-section li { font-size: 11px; color: #374151; line-height: 1.7; margin-bottom: 3px; }
.s-section ul { list-style: none; padding: 0; }
.s-section li::before { content: "· "; color: ${corPrimaria}; font-size: 14px; }
.content { flex: 1; padding: 28px 24px; }
.content h1 { font-size: 26px; color: ${corPrimaria}; margin-bottom: 4px; }
.content .tagline { font-size: 12px; color: #666; font-style: italic; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid #e5e7eb; }
.section-title { font-size: 14px; font-weight: 700; color: ${corPrimaria}; border-bottom: 2px solid ${corPrimaria}; padding-bottom: 4px; margin-top: 18px; margin-bottom: 10px; }
.item { margin-bottom: 12px; }
.item-title { font-size: 12px; font-weight: 700; }
.item-sub { font-size: 11px; color: #555; font-style: italic; margin-bottom: 2px; }
.item-period { font-size: 10px; color: #888; margin-bottom: 3px; }
.item-desc { font-size: 11px; color: #444; line-height: 1.6; }
</style></head><body>
<aside class="sidebar">
  ${curriculo.fotoBase64 ? `<div class="photo-wrap"><img src="${curriculo.fotoBase64}" alt="foto"></div>` : ''}

  <div class="s-section">
    <h3>Contato</h3>
    ${curriculo.dadosPessoais?.email ? `<p>${curriculo.dadosPessoais.email}</p>` : ''}
    ${curriculo.dadosPessoais?.telefone ? `<p>${curriculo.dadosPessoais.telefone}</p>` : ''}
    ${curriculo.dadosPessoais?.cidade ? `<p>${curriculo.dadosPessoais.cidade}</p>` : ''}
    ${curriculo.dadosPessoais?.linkedin ? `<p>${curriculo.dadosPessoais.linkedin}</p>` : ''}
  </div>

  ${(curriculo.hardSkills?.length || curriculo.softSkills?.length) ? `
  <div class="s-section">
    <h3>Habilidades</h3>
    <ul>${[...(curriculo.hardSkills || []), ...(curriculo.softSkills || [])].map(h => `<li>${h.habilidade}</li>`).join('')}</ul>
  </div>` : ''}

  ${curriculo.formacao?.length ? `
  <div class="s-section">
    <h3>Formação</h3>
    ${curriculo.formacao.map(f => `<p><b>${f.curso || ''}</b><br>${f.instituicao || ''}</p>`).join('')}
  </div>` : ''}

  ${curriculo.idiomas?.length ? `
  <div class="s-section">
    <h3>Idiomas</h3>
    ${curriculo.idiomas.map(i => `<p><b>${i.idioma}</b> — ${t ? t('languageLevels.' + i.nivel) || i.nivel : i.nivel}</p>`).join('')}
  </div>` : ''}
</aside>

<main class="content">
  <h1>${curriculo.dadosPessoais?.nome || 'Seu Nome'}</h1>
  ${curriculo.resumoProfissional ? `<p class="tagline">${curriculo.resumoProfissional}</p>` : ''}

  ${curriculo.objetivoProfissional ? `
  <div class="section-title">Objetivo</div>
  <p style="font-size:11px;line-height:1.7;color:#333;margin-bottom:8px">${curriculo.objetivoProfissional}</p>` : ''}

  ${curriculo.experiencias?.length ? `
  <div class="section-title">Experiência</div>
  ${curriculo.experiencias.map(exp => `
  <div class="item">
    <div class="item-title">${exp.cargo || ''}</div>
    <div class="item-sub">${exp.empresa || ''}</div>
    <div class="item-period">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</div>
    <div class="item-desc">${exp.atividades || ''}</div>
  </div>`).join('')}` : ''}

  ${curriculo.certificacoes?.length ? `
  <div class="section-title">Certificações</div>
  ${curriculo.certificacoes.map(c => `
  <div class="item">
    <div class="item-title">${c.nome || ''}</div>
    <div class="item-sub">${c.instituicao || ''}${c.anoConclusao ? ` (${formatDate(c.anoConclusao)})` : ''}</div>
  </div>`).join('')}` : ''}
</main>
</body></html>`;


// ==================================================
// 7. TEMPLATE SPLIT (ID: 'split')
// ==================================================
export const templateSplit = (curriculo, corPrimaria = '#4527A0', t) => `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
${BASE_CSS}
body { font-family: 'Trebuchet MS', Arial, sans-serif; color: #1f2937; font-size: 12px; background: #fff; min-height: 100vh; }
.header { display: flex; flex-direction: row; min-height: 130px; }
.header-left { flex: 1.2; background: ${corPrimaria}; padding: 24px; display: flex; flex-direction: column; justify-content: center; }
.header-left h1 { color: #fff; font-size: 22px; font-weight: 800; margin-bottom: 6px; }
.header-left .contacts { color: rgba(255,255,255,0.85); font-size: 10px; line-height: 1.9; }
.header-right { flex: 0.8; background: #ede9fe; padding: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 6px; }
.photo-wrap { width: 76px; height: 76px; border-radius: 50%; overflow: hidden; border: 3px solid ${corPrimaria}; }
.photo-wrap img { width: 100%; height: 100%; object-fit: cover; }
.header-role { font-size: 10px; color: ${corPrimaria}; font-weight: 700; text-align: center; }
.body { display: flex; flex-direction: row; }
.main { flex: 1.5; padding: 20px 22px; }
.aside { flex: 1; padding: 20px 16px; background: #faf5ff; border-left: 2px solid #ede9fe; }
.section-title { font-size: 11px; font-weight: 800; color: ${corPrimaria}; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 2px solid ${corPrimaria}; padding-bottom: 3px; margin-top: 16px; margin-bottom: 9px; }
.section-title:first-child { margin-top: 0; }
.item { margin-bottom: 11px; padding-bottom: 9px; border-bottom: 1px solid #f3f4f6; }
.item:last-child { border-bottom: none; }
.item-title { font-weight: 700; font-size: 12px; color: #111; }
.item-sub { font-size: 11px; color: #6b7280; font-style: italic; }
.item-period { font-size: 10px; color: #9ca3af; margin-bottom: 3px; }
.item-desc { font-size: 11px; color: #374151; line-height: 1.5; }
.s-section h3 { font-size: 10px; font-weight: 700; color: ${corPrimaria}; text-transform: uppercase; margin-bottom: 7px; }
.s-section p, .s-section li { font-size: 11px; color: #374151; line-height: 1.7; margin-bottom: 3px; }
.s-section ul { list-style: none; padding: 0; margin-bottom: 14px; }
.s-section li::before { content: "▸ "; color: ${corPrimaria}; }
</style></head><body>
<div class="header">
  <div class="header-left">
    <h1>${curriculo.dadosPessoais?.nome || 'Seu Nome'}</h1>
    <div class="contacts">
      ${[curriculo.dadosPessoais?.email, curriculo.dadosPessoais?.telefone, curriculo.dadosPessoais?.cidade, curriculo.dadosPessoais?.linkedin].filter(Boolean).map(c => `<div>${c}</div>`).join('')}
    </div>
  </div>
  <div class="header-right">
    ${curriculo.fotoBase64 ? `<div class="photo-wrap"><img src="${curriculo.fotoBase64}" alt="foto"></div>` : ''}
    ${curriculo.resumoProfissional ? `<div class="header-role">${curriculo.resumoProfissional.substring(0, 45)}</div>` : ''}
  </div>
</div>

<div class="body">
  <main class="main">
    ${curriculo.objetivoProfissional ? `
    <div class="section-title">Objetivo</div>
    <p style="font-size:11px;line-height:1.7;color:#374151;margin-bottom:12px">${curriculo.objetivoProfissional}</p>` : ''}

    ${curriculo.experiencias?.length ? `
    <div class="section-title">Experiência</div>
    ${curriculo.experiencias.map(exp => `
    <div class="item">
      <div class="item-title">${exp.cargo || ''}</div>
      <div class="item-sub">${exp.empresa || ''}</div>
      <div class="item-period">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</div>
      <div class="item-desc">${exp.atividades || ''}</div>
    </div>`).join('')}` : ''}

    ${curriculo.formacao?.length ? `
    <div class="section-title">Formação</div>
    ${curriculo.formacao.map(f => `
    <div class="item">
      <div class="item-title">${f.curso || ''}</div>
      <div class="item-sub">${f.instituicao || ''}${f.anoConclusao ? ` — ${formatDate(f.anoConclusao)}` : ''}</div>
    </div>`).join('')}` : ''}
  </main>

  <aside class="aside">
    ${curriculo.resumoProfissional ? `
    <div class="s-section" style="margin-bottom:14px">
      <h3>Perfil</h3>
      <p>${curriculo.resumoProfissional}</p>
    </div>` : ''}

    ${curriculo.hardSkills?.length ? `
    <div class="s-section">
      <h3>Hard Skills</h3>
      <ul>${curriculo.hardSkills.map(h => `<li>${h.habilidade}</li>`).join('')}</ul>
    </div>` : ''}

    ${curriculo.softSkills?.length ? `
    <div class="s-section">
      <h3>Soft Skills</h3>
      <ul>${curriculo.softSkills.map(s => `<li>${s.habilidade}</li>`).join('')}</ul>
    </div>` : ''}

    ${curriculo.certificacoes?.length ? `
    <div class="s-section">
      <h3>Certificações</h3>
      <ul>${curriculo.certificacoes.map(c => `<li>${c.nome || ''}</li>`).join('')}</ul>
    </div>` : ''}

    ${curriculo.idiomas?.length ? `
    <div class="s-section">
      <h3>Idiomas</h3>
      ${curriculo.idiomas.map(i => `<p><b>${i.idioma}</b> — ${t ? t('languageLevels.' + i.nivel) || i.nivel : i.nivel}</p>`).join('')}
    </div>` : ''}
  </aside>
</div>
</body></html>`;


// ==================================================
// 8. TEMPLATE DARK (ID: 'dark')
// ==================================================
export const templateDark = (curriculo, corPrimaria = '#34d399', t) => `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
${BASE_CSS}
@page { margin: 12mm 15mm; }
body { padding: 25px 35px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E2E8F0; font-size: 10.5pt; background: #0F172A; line-height: 1.5; margin: 0; }
@media print { body { padding: 0 !important; } }
.header { border-bottom: 1px solid #334155; padding-bottom: 20px; margin-bottom: 20px; }
.photo-wrap { width: 85px; height: 85px; border-radius: 12px; overflow: hidden; border: 2px solid ${corPrimaria}; float: right; margin-left: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
.photo-wrap img { width: 100%; height: 100%; object-fit: cover; }
h1 { font-size: 24pt; color: #FFFFFF; font-weight: 800; margin-bottom: 6px; letter-spacing: -1px; text-transform: uppercase; }
.headline { font-size: 11pt; color: ${corPrimaria}; font-weight: 600; margin-bottom: 10px; }
.contacts { font-size: 9.5pt; color: #E2E8F0; line-height: 1.5; }
.contacts span { display: inline-block; white-space: nowrap; margin-bottom: 4px; }
.contacts span:not(:last-child)::after { content: " • "; color: #64748B; margin: 0 8px; }
.section-title { font-size: 11pt; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 22px; margin-bottom: 12px; display: flex; align-items: center; }
.section-title::after { content: ""; flex: 1; height: 1px; background: #334155; margin-left: 15px; }
.item { margin-bottom: 16px; page-break-inside: avoid; }
.item-title { font-weight: 700; color: #FFFFFF; font-size: 11.5pt; }
.item-sub { font-size: 10.5pt; color: #E2E8F0; margin-bottom: 2px; margin-top: 2px; }
.item-period { font-size: 9.5pt; color: ${corPrimaria}; font-weight: 600; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
.item-desc { font-size: 10pt; color: #CBD5E1; line-height: 1.6; text-align: justify; }
.summary-text { font-size: 10pt; color: #CBD5E1; line-height: 1.6; text-align: justify; }
.skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-tag { background: #1E293B; border: 1px solid #334155; color: #F1F5F9; font-size: 9.5pt; padding: 4px 10px; border-radius: 6px; }
.lang-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dashed #334155; font-size: 10.5pt; }
.lang-row:last-child { border-bottom: none; }
</style></head><body>

<div class="header">
  ${curriculo.fotoBase64 ? `<div class="photo-wrap"><img src="${curriculo.fotoBase64}" alt="foto"></div>` : ''}
  <h1>${curriculo.dadosPessoais?.nome || 'SEU NOME'}</h1>
  ${curriculo.resumoProfissional ? `<div class="headline">${curriculo.resumoProfissional}</div>` : ''}
  <div class="contacts">
    ${curriculo.dadosPessoais?.email ? `<span>${curriculo.dadosPessoais.email}</span>` : ''}
    ${curriculo.dadosPessoais?.telefone ? `<span>${curriculo.dadosPessoais.telefone}</span>` : ''}
    ${curriculo.dadosPessoais?.linkedin ? `<span>${curriculo.dadosPessoais.linkedin}</span>` : ''}
    ${curriculo.dadosPessoais?.cidade ? `<span>${curriculo.dadosPessoais.cidade}</span>` : ''}
  </div>
  <div style="clear: both;"></div>
</div>

${curriculo.objetivoProfissional ? `
<div class="section-title">Objetivo</div>
<p class="summary-text">${curriculo.objetivoProfissional}</p>` : ''}

${curriculo.experiencias?.length ? `
<div class="section-title">Experiência</div>
${curriculo.experiencias.map(exp => `
<div class="item">
  <div class="item-title">${exp.cargo || ''}</div>
  <div class="item-sub">${exp.empresa || ''}</div>
  <div class="item-period">${formatPeriodo(exp.dataInicio, exp.dataFim, exp.atual)}</div>
  <div class="item-desc">${exp.atividades || ''}</div>
</div>`).join('')}` : ''}

${curriculo.formacao?.length ? `
<div class="section-title">Formação</div>
${curriculo.formacao.map(f => `
<div class="item">
  <div class="item-title">${f.curso || ''} ${f.nivel ? `(${f.nivel})` : ''}</div>
  <div class="item-sub">${f.instituicao || ''}</div>
  <div class="item-period">${f.anoConclusao ? formatDate(f.anoConclusao) : ''}</div>
</div>`).join('')}` : ''}

${curriculo.certificacoes?.length ? `
<div class="section-title">Certificações</div>
${curriculo.certificacoes.map(c => `
<div class="item">
  <div class="item-title">${c.nome || ''}</div>
  <div class="item-sub">${c.instituicao || ''}</div>
  <div class="item-period">${c.anoConclusao ? formatDate(c.anoConclusao) : ''}</div>
</div>`).join('')}` : ''}

${(curriculo.hardSkills?.length || curriculo.softSkills?.length) ? `
<div class="section-title">Habilidades</div>
<div class="skills-wrap">
  ${[...(curriculo.hardSkills || []), ...(curriculo.softSkills || [])].map(h => `<span class="skill-tag">${h.habilidade}</span>`).join('')}
</div>` : ''}

${curriculo.idiomas?.length ? `
<div class="section-title">Idiomas</div>
${curriculo.idiomas.map(i => `
<div class="lang-row">
  <b style="color:#F8FAFC">${i.idioma}</b>
  <span style="color:${corPrimaria}">${t ? t('languageLevels.' + i.nivel) || i.nivel : i.nivel}</span>
</div>`).join('')}` : ''}

</body></html>`;
