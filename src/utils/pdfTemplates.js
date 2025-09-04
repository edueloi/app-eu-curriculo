// ==========================
// 1. Template Black & White (Melhorado)
// ==========================
export const templateBlackWhite = (curriculo) => `
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: A4; margin: 1.5cm; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; }
    .header { display: flex; align-items: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
    .profile-pic { width: 80px; height: 80px; border-radius: 50%; margin-right: 20px; object-fit: cover; }
    .header-info { flex: 1; }
    .header-info h1 { margin: 0; font-size: 28px; font-weight: bold; }
    .header-info p { margin: 2px 0; font-size: 12px; color: #555; }
    .section-title { font-size: 18px; font-weight: bold; margin-top: 25px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
    .content p { font-size: 14px; margin: 5px 0; line-height: 1.5; }
    .job { margin-bottom: 15px; }
    .job-title { font-weight: bold; font-size: 15px; }
  </style>
</head>
<body>
  <div class="header">
    ${curriculo.fotoBase64 ? `<img src="${curriculo.fotoBase64}" alt="Foto de Perfil" class="profile-pic">` : ''}
    <div class="header-info">
      <h1>${curriculo.dadosPessoais?.nome || "Nome Completo"}</h1>
      <p>${curriculo.dadosPessoais?.endereco || ""}</p>
      <p>${curriculo.dadosPessoais?.email || "-"} | ${curriculo.dadosPessoais?.telefone || "-"} | ${curriculo.dadosPessoais?.linkedin || ""}</p>
      <p>${curriculo.dadosPessoais?.site || ""}</p>
    </div>
  </div>

  <div class="content">
    <div class="section-title">Objetivo Profissional</div>
    <p>${curriculo.objetivoProfissional || "-"}</p>

    <div class="section-title">Resumo Profissional</div>
    <p>${curriculo.resumoProfissional || "-"}</p>

    <div class="section-title">Experiência</div>
    ${(curriculo.experiencias || []).map(exp => `
      <div class="job">
        <p class="job-title">${exp.cargo} - ${exp.empresa}</p>
        <p style="color:#777; font-size:12px;">${exp.periodo}</p>
        <p>${exp.atividades}</p>
      </div>
    `).join("")}

    <div class="section-title">Formação</div>
    ${(curriculo.formacao || []).map(f => `
      <p><b>${f.curso}</b> (${f.nivel}) - ${f.instituicao} (${f.anoConclusao})</p>
    `).join("")}
  </div>
</body>
</html>
`;

// ==========================
// 2. Template Marketing (Melhorado)
// ==========================
export const templateMarketing = (curriculo) => `
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 0; }
    body { font-family: 'Poppins', sans-serif; background:#f3f4f6; color:#1f2937; }
    .header { background: #1e40af; color: #fff; padding: 30px; text-align: center; }
    .profile-pic { width: 100px; height: 100px; border-radius: 50%; border: 3px solid #fff; margin-bottom: 10px; object-fit: cover; }
    .header h1 { margin: 0; font-size: 26px; }
    .header p { margin: 4px 0; font-size: 13px; opacity: 0.9; }
    .content { padding: 25px; }
    .card { background: #fff; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .section-title { color: #1e40af; font-size: 18px; font-weight: 600; border-bottom: 2px solid #60a5fa; padding-bottom: 5px; margin-bottom: 15px; }
    .job { margin-bottom: 15px; }
    .job b { font-size: 15px; color: #111827; }
  </style>
</head>
<body>
  <div class="header">
    ${curriculo.fotoBase64 ? `<img src="${curriculo.fotoBase64}" alt="Foto" class="profile-pic">` : ''}
    <h1>${curriculo.dadosPessoais?.nome || "Nome"}</h1>
    <p>${curriculo.dadosPessoais?.endereco || ""}</p>
    <p>${curriculo.dadosPessoais?.email || ""} | ${curriculo.dadosPessoais?.telefone || ""}</p>
    <p><a href="${curriculo.dadosPessoais?.linkedin}" style="color: #fff;">LinkedIn</a> | <a href="${curriculo.dadosPessoais?.site}" style="color: #fff;">Portfólio</a></p>
  </div>

  <div class="content">
    <div class="card">
      <div class="section-title">Objetivo</div>
      <p>${curriculo.objetivoProfissional || "-"}</p>
    </div>
    <div class="card">
      <div class="section-title">Resumo</div>
      <p>${curriculo.resumoProfissional || "-"}</p>
    </div>
    <div class="card">
      <div class="section-title">Experiência</div>
      ${(curriculo.experiencias || []).map(exp => `
        <div class="job">
          <p><b>${exp.cargo}</b> - ${exp.empresa} (${exp.periodo})</p>
          <p style="font-size: 13px;">${exp.atividades}</p>
        </div>
      `).join("")}
    </div>
    <div class="card">
      <div class="section-title">Formação</div>
      ${(curriculo.formacao || []).map(f => `
        <p><b>${f.curso}</b> - ${f.instituicao} (${f.anoConclusao})</p>
      `).join("")}
    </div>
  </div>
</body>
</html>
`;

// ==========================
// 3. Template Blue Professional (Melhorado)
// ==========================
export const templateBlueProfessional = (curriculo) => `
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 0; }
    body { font-family: 'Roboto', sans-serif; display: flex; min-height: 29.7cm; }
    .sidebar { width: 7cm; background: #eef2ff; padding: 25px; color: #1e3a8a; }
    .profile-pic { width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 15px; display: block; object-fit: cover; border: 4px solid #fff; }
    .sidebar h1 { font-size: 24px; text-align: center; margin-bottom: 5px; color: #1d4ed8; }
    .sidebar-title { font-size: 14px; font-weight: bold; margin-top: 20px; border-bottom: 2px solid #60a5fa; padding-bottom: 3px; }
    .sidebar p, .sidebar li { font-size: 12px; margin: 5px 0; word-wrap: break-word; }
    .sidebar ul { padding-left: 15px; margin: 5px 0; }
    .main { flex: 1; padding: 30px; color: #374151; }
    .main-title { font-size: 20px; color: #1e3a8a; border-bottom: 3px solid #1e3a8a; padding-bottom: 5px; margin-top: 0; }
    .main p { font-size: 13px; line-height: 1.6; }
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
    <p>${curriculo.dadosPessoais?.site || ""}</p>

    <div class="sidebar-title">Habilidades</div>
    <ul>${(curriculo.habilidades || []).map(h => `<li>${h.habilidade} - ${h.nivel}</li>`).join("")}</ul>
    
    <div class="sidebar-title">Idiomas</div>
    <ul>${(curriculo.idiomas || []).map(i => `<li>${i.idioma} - ${i.nivel}</li>`).join("")}</ul>
  </aside>

  <main class="main">
    <h2 class="main-title">Resumo Profissional</h2>
    <p>${curriculo.resumoProfissional || "-"}</p>

    <h2 class="main-title" style="margin-top:25px;">Experiência</h2>
    ${(curriculo.experiencias || []).map(exp => `
      <div class="job">
        <p><b>${exp.cargo}</b> em <b>${exp.empresa}</b></p>
        <p style="color:#6b7280; font-size: 12px;">${exp.periodo}</p>
        <p>${exp.atividades}</p>
      </div>
    `).join("")}

    <h2 class="main-title" style="margin-top:25px;">Formação</h2>
    ${(curriculo.formacao || []).map(f => `
      <p><b>${f.curso}</b> - ${f.instituicao} (${f.anoConclusao})</p>
    `).join("")}
  </main>
</body>
</html>
`;

// ==========================
// 4. Template Pink (Melhorado)
// ==========================
export const templatePink = (curriculo) => `
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=Poppins:wght@400&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 0; }
    body { font-family: 'Poppins', sans-serif; display: flex; min-height: 29.7cm; }
    .sidebar { width: 7.5cm; background: #fff0f6; padding: 25px; text-align: center; }
    .profile-pic { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 4px solid #f8bbd0; margin-bottom: 15px; }
    .sidebar h1 { font-family: 'Lora', serif; font-size: 24px; color: #c2185b; margin: 0; }
    .sidebar p { font-size: 12px; margin: 4px 0; color: #ad1457; }
    .sidebar-title { font-family: 'Lora', serif; font-size: 15px; font-weight: 600; color: #c2185b; text-align: left; margin-top: 25px; margin-bottom: 8px; }
    .sidebar ul { list-style-type: none; padding: 0; text-align: left; }
    .sidebar li { font-size: 12px; margin-bottom: 5px; }
    .main { flex: 1; padding: 30px; background: #fff; }
    .main-title { font-family: 'Lora', serif; font-size: 20px; color: #c2185b; border-bottom: 2px solid #f8bbd0; padding-bottom: 6px; margin-top: 0; margin-bottom: 15px; }
    .job { margin-bottom: 18px; }
    .main p { font-size: 13px; line-height: 1.6; }
  </style>
</head>
<body>
  <aside class="sidebar">
    ${curriculo.fotoBase64 ? `<img src="${curriculo.fotoBase64}" alt="Foto" class="profile-pic">` : ''}
    <h1>${curriculo.dadosPessoais?.nome || "Nome"}</h1>
    
    <hr style="border:0; border-top:1px solid #f8bbd0; margin: 20px 0;">
    
    <div class="sidebar-title">Contato</div>
    <p>${curriculo.dadosPessoais?.email || "-"}</p>
    <p>${curriculo.dadosPessoais?.telefone || "-"}</p>
    <p>${curriculo.dadosPessoais?.linkedin || ""}</p>
    <p>${curriculo.dadosPessoais?.site || ""}</p>

    <div class="sidebar-title">Habilidades</div>
    <ul>${(curriculo.habilidades || []).map(h => `<li>${h.habilidade}</li>`).join("")}</ul>

    <div class="sidebar-title">Idiomas</div>
    <ul>${(curriculo.idiomas || []).map(i => `<li>${i.idioma} - ${i.nivel}</li>`).join("")}</ul>
  </aside>

  <main class="main">
    <h2 class="main-title">Resumo Profissional</h2>
    <p>${curriculo.resumoProfissional || "-"}</p>

    <h2 class="main-title" style="margin-top:25px;">Experiência Profissional</h2>
    ${(curriculo.experiencias || []).map(exp => `
      <div class="job">
        <p><b>${exp.cargo}</b> - ${exp.empresa} (${exp.periodo})</p>
        <p>${exp.atividades}</p>
      </div>
    `).join("")}

    <h2 class="main-title" style="margin-top:25px;">Formação Acadêmica</h2>
    ${(curriculo.formacao || []).map(f => `
      <p><b>${f.curso}</b> - ${f.instituicao} (${f.anoConclusao})</p>
    `).join("")}
  </main>
</body>
</html>
`;