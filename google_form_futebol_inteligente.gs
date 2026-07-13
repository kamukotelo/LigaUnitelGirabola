/**
 * Cria um Google Form inteligente para registo de jogadores e estatisticas.
 *
 * Como usar:
 * 1. Abra https://script.google.com
 * 2. Crie um novo projeto.
 * 3. Cole todo este ficheiro no editor.
 * 4. Execute a funcao criarFormularioFutebolInteligente().
 * 5. Autorize o acesso quando o Google pedir.
 */

const CONFIG_FORMULARIO_FUTEBOL = {
  nomeFormulario: 'Registo Inteligente de Jogadores e Estatisticas',
  nomePlanilha: 'Base Inteligente Futebol - Respostas',
  posicoes: [
    'Guarda-Redes',
    'Defesa Direito',
    'Defesa Central',
    'Defesa Esquerdo',
    'Medio Defensivo',
    'Medio Centro',
    'Medio Ofensivo',
    'Extremo Direito',
    'Extremo Esquerdo',
    'Segundo Avancado',
    'Avancado'
  ],
  pes: ['Direito', 'Esquerdo', 'Ambidestro'],
  nacionalidades: [
    'Portugal',
    'Brasil',
    'Espanha',
    'Franca',
    'Argentina',
    'Inglaterra',
    'Alemanha',
    'Italia',
    'Paises Baixos',
    'Belgica',
    'Croacia',
    'Uruguai',
    'Colombia',
    'Cabo Verde',
    'Angola',
    'Guine-Bissau',
    'Nigeria',
    'Gana',
    'Costa do Marfim',
    'Senegal',
    'Camaroes',
    'Marrocos',
    'Argelia',
    'Egito',
    'EUA',
    'Mexico',
    'Chile',
    'Peru',
    'Equador',
    'Paraguai',
    'Venezuela',
    'Servia',
    'Polonia',
    'Suica',
    'Austria',
    'Dinamarca',
    'Suecia',
    'Noruega',
    'Ucrania',
    'Turquia',
    'Grecia',
    'Escocia',
    'Pais de Gales',
    'Irlanda',
    'Japao',
    'Coreia do Sul',
    'Australia',
    'Outra'
  ],
  epocas: [
    '2020/2021',
    '2021/2022',
    '2022/2023',
    '2023/2024',
    '2024/2025',
    '2025/2026',
    '2026/2027'
  ],
  competicoes: [
    'Liga Portugal',
    'Taca de Portugal',
    'Taca da Liga',
    'Supertaca',
    'UEFA Champions League',
    'UEFA Europa League',
    'UEFA Conference League',
    'Amigavel',
    'Outra'
  ]
};

function criarFormularioFutebolInteligente() {
  const cfg = CONFIG_FORMULARIO_FUTEBOL;
  const ss = SpreadsheetApp.create(cfg.nomePlanilha);
  prepararPlanilha_(ss);

  const form = FormApp.create(cfg.nomeFormulario)
    .setDescription('Formulario para registar dados pessoais de jogadores e estatisticas por epoca/competicao.')
    .setCollectEmail(true)
    .setConfirmationMessage('Resposta recebida. Os dados foram enviados para a base inteligente.')
    .setAllowResponseEdits(false)
    .setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  const tipoRegisto = form.addMultipleChoiceItem()
    .setTitle('Tipo de registo')
    .setRequired(true)
    .setHelpText('Escolha o fluxo correto. O formulario mostra apenas os campos necessarios.');

  const secDados = form.addPageBreakItem().setTitle('Dados pessoais do jogador');
  const secEstatisticas = form.addPageBreakItem().setTitle('Estatisticas por epoca');

  tipoRegisto.setChoices([
      form.createChoice('Novo jogador', secDados),
      form.createChoice('Estatisticas de jogador', secEstatisticas)
    ]);

  secDados.setGoToPage(FormApp.PageNavigationType.SUBMIT);
  adicionarCamposDadosPessoais_(form, cfg);

  secEstatisticas.setGoToPage(FormApp.PageNavigationType.SUBMIT);
  adicionarCamposEstatisticas_(form, cfg);

  PropertiesService.getScriptProperties().setProperties({
    FORM_ID: form.getId(),
    SPREADSHEET_ID: ss.getId()
  });

  ScriptApp.newTrigger('processarRespostaFutebol')
    .forForm(form)
    .onFormSubmit()
    .create();

  Logger.log('Formulario publicado: ' + form.getPublishedUrl());
  Logger.log('Editar formulario: ' + form.getEditUrl());
  Logger.log('Planilha de respostas: ' + ss.getUrl());
}

function adicionarCamposDadosPessoais_(form, cfg) {
  form.addTextItem()
    .setTitle('ID_Jogador')
    .setRequired(true)
    .setHelpText('Exemplo: TA001. Use um codigo unico para ligar dados pessoais e estatisticas.')
    .setValidation(FormApp.createTextValidation().requireTextMatchesPattern('^[A-Z]{2}[0-9]{3,}$').build());

  form.addTextItem().setTitle('Nome').setRequired(true);
  form.addTextItem().setTitle('Apelido').setRequired(false);
  form.addDateItem().setTitle('Data_Nascimento').setRequired(true);

  form.addListItem()
    .setTitle('Nacionalidade')
    .setRequired(true)
    .setChoiceValues(cfg.nacionalidades);

  form.addListItem()
    .setTitle('Posicao')
    .setRequired(true)
    .setChoiceValues(cfg.posicoes);

  form.addTextItem()
    .setTitle('Numero da camisola')
    .setRequired(false)
    .setValidation(FormApp.createTextValidation().requireNumberBetween(1, 99).build());

  form.addTextItem()
    .setTitle('Altura_cm')
    .setRequired(false)
    .setValidation(FormApp.createTextValidation().requireNumberBetween(120, 230).build());

  form.addTextItem()
    .setTitle('Peso_kg')
    .setRequired(false)
    .setValidation(FormApp.createTextValidation().requireNumberBetween(35, 150).build());

  form.addListItem()
    .setTitle('Pe_Preferido')
    .setRequired(false)
    .setChoiceValues(cfg.pes);

  form.addTextItem()
    .setTitle('Contrato_Ate')
    .setRequired(false)
    .setHelpText('Ano de termino do contrato. Exemplo: 2028.')
    .setValidation(FormApp.createTextValidation().requireNumberBetween(2020, 2045).build());

  form.addTextItem()
    .setTitle('Valor_Mercado_MEUR')
    .setRequired(false)
    .setHelpText('Valor em milhoes de euros. Exemplo: 32.')
    .setValidation(FormApp.createTextValidation().requireNumberGreaterThanOrEqualTo(0).build());

  form.addTextItem().setTitle('Agente').setRequired(false);
}

function adicionarCamposEstatisticas_(form, cfg) {
  form.addTextItem()
    .setTitle('ID_Jogador')
    .setRequired(true)
    .setHelpText('Use o mesmo ID_Jogador registado nos dados pessoais.')
    .setValidation(FormApp.createTextValidation().requireTextMatchesPattern('^[A-Z]{2}[0-9]{3,}$').build());

  form.addListItem()
    .setTitle('Epoca')
    .setRequired(true)
    .setChoiceValues(cfg.epocas);

  form.addListItem()
    .setTitle('Competicao')
    .setRequired(true)
    .setChoiceValues(cfg.competicoes);

  form.addTextItem()
    .setTitle('Jogos')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation().requireNumberGreaterThanOrEqualTo(0).build());

  form.addTextItem()
    .setTitle('Minutos')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation().requireNumberGreaterThanOrEqualTo(0).build());

  form.addTextItem()
    .setTitle('Golos')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation().requireNumberGreaterThanOrEqualTo(0).build());

  form.addTextItem()
    .setTitle('Assists')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation().requireNumberGreaterThanOrEqualTo(0).build());

  form.addTextItem()
    .setTitle('Cartoes_Amarelos')
    .setRequired(false)
    .setValidation(FormApp.createTextValidation().requireNumberGreaterThanOrEqualTo(0).build());

  form.addTextItem()
    .setTitle('Cartoes_Vermelhos')
    .setRequired(false)
    .setValidation(FormApp.createTextValidation().requireNumberGreaterThanOrEqualTo(0).build());

  form.addTextItem()
    .setTitle('Rating_Medio')
    .setRequired(false)
    .setHelpText('Escala sugerida: 0 a 10.')
    .setValidation(FormApp.createTextValidation().requireNumberBetween(0, 10).build());
}

function prepararPlanilha_(ss) {
  const dados = ss.getSheets()[0].setName('Dados_Pessoais');
  dados.clear();
  dados.appendRow([
    'Timestamp',
    'Email',
    'ID_Jogador',
    'Nome',
    'Apelido',
    'Data_Nascimento',
    'Nacionalidade',
    'Posicao',
    'Numero da camisola',
    'Altura_cm',
    'Peso_kg',
    'Pe_Preferido',
    'Contrato_Ate',
    'Valor_Mercado_MEUR',
    'Agente'
  ]);

  const estat = ss.insertSheet('Estatisticas');
  estat.appendRow([
    'Timestamp',
    'Email',
    'ID_Jogador',
    'Epoca',
    'Competicao',
    'Jogos',
    'Minutos',
    'Golos',
    'Assists',
    'Cartoes_Amarelos',
    'Cartoes_Vermelhos',
    'Rating_Medio',
    'Golos_por_90',
    'Contribuicoes_G_A'
  ]);

  const listas = ss.insertSheet('Listas');
  listas.getRange(1, 1, 1, 5).setValues([[
    'Posicoes',
    'Pes',
    'Nacionalidades',
    'Epocas',
    'Competicoes'
  ]]);

  escreverLista_(listas, 1, CONFIG_FORMULARIO_FUTEBOL.posicoes);
  escreverLista_(listas, 2, CONFIG_FORMULARIO_FUTEBOL.pes);
  escreverLista_(listas, 3, CONFIG_FORMULARIO_FUTEBOL.nacionalidades);
  escreverLista_(listas, 4, CONFIG_FORMULARIO_FUTEBOL.epocas);
  escreverLista_(listas, 5, CONFIG_FORMULARIO_FUTEBOL.competicoes);

  [dados, estat, listas].forEach(sheet => {
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, sheet.getLastColumn());
    sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
  });
}

function escreverLista_(sheet, col, valores) {
  const linhas = valores.map(valor => [valor]);
  sheet.getRange(2, col, linhas.length, 1).setValues(linhas);
}

function processarRespostaFutebol(e) {
  const ssId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  const ss = SpreadsheetApp.openById(ssId);
  const respostas = e.namedValues;
  const email = valor_(respostas, 'Email Address') || valor_(respostas, 'Endereco de email') || '';
  const tipo = valor_(respostas, 'Tipo de registo');

  if (tipo === 'Novo jogador') {
    ss.getSheetByName('Dados_Pessoais').appendRow([
      new Date(),
      email,
      valor_(respostas, 'ID_Jogador'),
      valor_(respostas, 'Nome'),
      valor_(respostas, 'Apelido'),
      valor_(respostas, 'Data_Nascimento'),
      valor_(respostas, 'Nacionalidade'),
      valor_(respostas, 'Posicao'),
      numero_(respostas, 'Numero da camisola'),
      numero_(respostas, 'Altura_cm'),
      numero_(respostas, 'Peso_kg'),
      valor_(respostas, 'Pe_Preferido'),
      numero_(respostas, 'Contrato_Ate'),
      numero_(respostas, 'Valor_Mercado_MEUR'),
      valor_(respostas, 'Agente')
    ]);
    return;
  }

  if (tipo === 'Estatisticas de jogador') {
    const minutos = numero_(respostas, 'Minutos');
    const golos = numero_(respostas, 'Golos');
    const assists = numero_(respostas, 'Assists');
    const golosPor90 = minutos > 0 ? (golos * 90) / minutos : 0;

    ss.getSheetByName('Estatisticas').appendRow([
      new Date(),
      email,
      valor_(respostas, 'ID_Jogador'),
      valor_(respostas, 'Epoca'),
      valor_(respostas, 'Competicao'),
      numero_(respostas, 'Jogos'),
      minutos,
      golos,
      assists,
      numero_(respostas, 'Cartoes_Amarelos'),
      numero_(respostas, 'Cartoes_Vermelhos'),
      numero_(respostas, 'Rating_Medio'),
      golosPor90,
      golos + assists
    ]);
  }
}

function valor_(respostas, titulo) {
  const valor = respostas[titulo];
  return Array.isArray(valor) ? valor[0] : valor || '';
}

function numero_(respostas, titulo) {
  const valor = String(valor_(respostas, titulo)).replace(',', '.').trim();
  return valor === '' ? '' : Number(valor);
}
