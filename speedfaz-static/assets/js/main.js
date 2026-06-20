/* ============================================================
   Speedfaz — lógica partilhada (vanilla JS)
   Cabeçalho, rodapé, menu, carrinho e modais — tudo num só sítio.
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     ███  ÁREA EDITÁVEL  ███
     Altera aqui os dados do site. Não é preciso mexer no HTML.
     ============================================================ */

  var SITE = {
    whatsapp: '351923322717',                         // número WhatsApp (só dígitos, com indicativo 351)
    phones: [                                          // telefones mostrados no site
      { label: '923 322 717', tel: '+351923322717' },
      { label: '963 688 086', tel: '+351963688086' }
    ],
    email: 'geral@speedfaz.com',
    instagram: 'speed.faz',
    addressHtml: 'Rua dos Pinheirinhos, 15, loja j<br>2910-121 Setúbal',
    website: 'www.speedfaz.com',
    baseUrl: 'https://www.speedfaz.com',               // domínio (para canonical/SEO)
    zona: 'margem sul'                                 // zona de atuação
  };

  /* Catálogo de serviços (nome, preços, categoria, imagem, descrição, incluídos) */
  var CATALOG = [
    { id: 'lampadas', name: 'Lâmpadas e tomadas', priceLabel: 'Desde 20€', priceValue: 20, cat: 'eletrica', img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=700',
      descLong: 'Resolvemos pontos de luz que não funcionam, tomadas queimadas e interruptores avariados. Substituímos, instalamos e testamos tudo com segurança.',
      included: ['Diagnóstico do ponto elétrico', 'Substituição de lâmpadas e casquilhos', 'Instalação ou troca de tomadas e interruptores', 'Teste de funcionamento e segurança'] },
    { id: 'torneiras', name: 'Torneiras e canalização', priceLabel: 'Desde 45€', priceValue: 45, cat: 'canalizacao', img: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=700',
      descLong: 'Da torneira a pingar ao cano entupido — instalamos e reparamos torneiras, sifões e canalização, e verificamos fugas e pressão.',
      included: ['Avaliação da canalização', 'Instalação ou reparação de torneira', 'Substituição de vedantes e sifões', 'Teste de fugas e pressão'] },
    { id: 'moveis', name: 'Montagem de móveis', priceLabel: 'Desde 30€', priceValue: 30, cat: 'moveis', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700',
      descLong: 'Montamos qualquer móvel, de qualquer marca, com as nossas ferramentas. Fixamos à parede quando necessário e deixamos tudo limpo.',
      included: ['Montagem completa do móvel', 'Ferramentas incluídas', 'Fixação à parede (se aplicável)', 'Limpeza e remoção de embalagens'] },
    { id: 'eletro', name: 'Instalação de eletrodomésticos', priceLabel: 'Desde 40€', priceValue: 40, cat: 'eletrodomesticos', img: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=700',
      descLong: 'Instalamos máquinas de lavar, frigoríficos, fogões e outros eletrodomésticos, com ligação e teste de funcionamento incluídos.',
      included: ['Posicionamento e nivelamento', 'Ligação elétrica e/ou de água', 'Teste de funcionamento', 'Conselhos de utilização'] },
    { id: 'portas', name: 'Portas e janelas', priceLabel: 'Desde 35€', priceValue: 35, cat: 'portas', img: 'assets/img/portas.jpg',
      descLong: 'Ajustamos portas e janelas que não fecham bem, reparamos fechaduras e dobradiças e substituímos vedantes para mais conforto.',
      included: ['Ajuste de portas e janelas', 'Reparação de fechaduras e dobradiças', 'Substituição de vedantes', 'Lubrificação e teste'] },
    { id: 'serralharia', name: 'Serralharia', priceLabel: 'Desde 50€', priceValue: 50, cat: 'serralharia', img: 'https://images.unsplash.com/photo-1608126841512-ed53266c1d62?w=700',
      descLong: 'Reparações e instalações de estruturas metálicas residenciais — portões, gradeamentos e reforços, com acabamento cuidado.',
      included: ['Avaliação da estrutura', 'Reparação ou reforço metálico', 'Soldadura ou fixação conforme necessário', 'Acabamento e teste'] },
    { id: 'manutencao', name: 'Manutenção preventiva', priceLabel: 'Orçamento personalizado', priceValue: null, cat: 'geral', img: 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=700',
      descLong: 'Uma visita de manutenção geral para detetar e resolver pequenos problemas antes que se tornem caros. Orçamento conforme o que a tua casa precisa.',
      included: ['Inspeção geral da casa', 'Verificação elétrica e de canalização', 'Pequenos ajustes incluídos', 'Relatório de recomendações'] }
  ];

  var PRODUCTS = [
    { name: 'Lâmpada LED E27 9W', price: '4,90 €', cat: 'eletrica', img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400' },
    { name: 'Tomada Schuko branca', price: '6,50 €', cat: 'eletrica', img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400' },
    { name: 'Interruptor duplo', price: '8,90 €', cat: 'eletrica', img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400' },
    { name: 'Torneira monocomando', price: '39,00 €', cat: 'canalizacao', img: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400' },
    { name: 'Sifão universal', price: '7,50 €', cat: 'canalizacao', img: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400' },
    { name: 'Fita vedante (teflon)', price: '2,90 €', cat: 'canalizacao', img: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400' },
    { name: 'Kit parafusos e buchas', price: '5,90 €', cat: 'moveis', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
    { name: 'Suporte TV de parede', price: '19,00 €', cat: 'moveis', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
    { name: 'Pés ajustáveis (x4)', price: '9,00 €', cat: 'moveis', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
    { name: 'Mangueira máquina de lavar', price: '8,00 €', cat: 'eletrodomesticos', img: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=400' },
    { name: 'Filtro universal', price: '12,00 €', cat: 'eletrodomesticos', img: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=400' },
    { name: 'Fechadura de segurança', price: '29,00 €', cat: 'portas', img: 'https://images.unsplash.com/photo-1583691028182-e8f01e74bfa2?w=400' },
    { name: 'Dobradiças (par)', price: '6,00 €', cat: 'portas', img: 'https://images.unsplash.com/photo-1583691028182-e8f01e74bfa2?w=400' },
    { name: 'Vedante de porta', price: '4,50 €', cat: 'portas', img: 'https://images.unsplash.com/photo-1583691028182-e8f01e74bfa2?w=400' },
    { name: 'Cantoneira reforçada', price: '11,00 €', cat: 'serralharia', img: 'https://images.unsplash.com/photo-1608126841512-ed53266c1d62?w=400' },
    { name: 'Fecho de portão', price: '24,00 €', cat: 'serralharia', img: 'https://images.unsplash.com/photo-1608126841512-ed53266c1d62?w=400' }
  ];

  /* Depoimentos de clientes (carrossel na página inicial). Substitui por opiniões reais. */
  var TESTIMONIALS = [
    { name: 'Ana Sofia', service: 'Torneiras e canalização', stars: 5, text: 'Vieram no próprio dia arranjar uma torneira que não parava de pingar. Rápidos, simpáticos e o preço foi mesmo o combinado.' },
    { name: 'Miguel Costa', service: 'Montagem de móveis', stars: 5, text: 'Montaram-me um roupeiro grande num instante e fixaram tudo à parede. Ficou impecável e deixaram tudo limpo.' },
    { name: 'Carla Ferreira', service: 'Lâmpadas e tomadas', stars: 5, text: 'Tinha várias tomadas sem funcionar. Diagnosticaram o problema e resolveram tudo com segurança. Recomendo!' },
    { name: 'João Almeida', service: 'Eletrodomésticos', stars: 5, text: 'Instalaram a máquina de lavar nova e testaram tudo antes de saírem. Profissionais e pontuais.' },
    { name: 'Rita Marques', service: 'Portas e janelas', stars: 5, text: 'A porta de entrada não fechava bem. Ajustaram a fechadura e as dobradiças no momento. Excelente serviço.' }
  ];

  /* Liga cada serviço ao artigo do blog correspondente (botão "Sobre este serviço"). */
  var SERVICE_BLOG = {
    lampadas: 'trocar-lampada',
    torneiras: 'torneira-vazamento',
    moveis: 'montagem-moveis',
    eletro: 'reparacoes-eletricas',
    portas: 'portas-janelas',
    serralharia: 'serralharia-residencial',
    manutencao: 'manutencao-preventiva'
  };

  /* Artigos do blog. Edita aqui o texto (cada item de "body" é um parágrafo). */
  var BLOG = {
    'torneira-vazamento': {
      title: 'Como detetar uma torneira a pingar', subtitle: 'O guia prático para evitar desperdícios', tag: 'Canalização', date: '12 Mar 2025',
      img: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200',
      body: [
        'Uma torneira a pingar parece, à primeira vista, apenas um incómodo menor. No entanto, este pequeno problema pode desperdiçar milhares de litros de água por ano, resultando num aumento significativo na fatura da água e, a longo prazo, em danos estruturais na sua bancada ou armários.',
        'Detetar e resolver o problema precocemente é a melhor forma de poupar dinheiro e evitar reparações dispendiosas no futuro.',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">4 sinais de alerta de uma torneira com fuga</h2>',
        'Antes de tentar qualquer reparação, identifique se o problema é realmente uma fuga. Fique atento a estes sinais:',
        '<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Gotejamento constante:</strong> a torneira continua a pingar mesmo após ser fechada com firmeza.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Humidade ou calcário:</strong> manchas de água, humidade persistente ou acumulação de calcário na base da torneira ou no interior do armário.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Ruídos estranhos:</strong> sons de água a correr dentro dos canos ou das paredes.</li><li><strong style="color:#1c1b17">Aumento inexplicável na fatura:</strong> se o consumo mensal de água subiu sem uma razão aparente, pode haver uma fuga lenta.</li></ul>',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">O teste infalível: como verificar o contador de água</h2>',
        'Quer ter a certeza de que a fuga está na sua canalização? Siga este passo a passo simples:',
        '<ol style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Feche todas as saídas de água:</strong> certifique-se de que todas as torneiras, máquinas de lavar e descargas estão fechadas.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Observe o contador de água:</strong> vá até ao contador e verifique se o ponteiro ou os números continuam a rodar/mudar.</li><li><strong style="color:#1c1b17">Analise o resultado:</strong> se o contador continuar a marcar consumo com tudo fechado, existe uma fuga de água algures na canalização da sua habitação.</li></ol>',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Quando deve chamar um profissional da Speedfaz?</h2>',
        'Embora algumas fugas possam ser resolvidas substituindo um vedante ou o sistema interno (cartucho) da torneira, nem sempre a solução é simples. Muitas vezes, a tentativa de reparação "faça você mesmo" sem as ferramentas adequadas pode danificar ainda mais a canalização ou causar roturas maiores.',
        'Se o problema persistir, se notar que a torneira está presa ou se suspeitar de fugas dentro da parede, não arrisque.',
        '<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Precisa de ajuda profissional para reparar uma torneira ou fuga de água?</strong> Na Speedfaz, temos técnicos especializados prontos para avaliar, reparar e testar todo o sistema de canalização no local, com rapidez e garantia de serviço.</p>'
      ]
    },
    'desentupimento': {
      title: 'Desentupimento de canalização', subtitle: 'Quando resolve sozinho e quando deve chamar um profissional', tag: 'Canalização', date: '04 Abr 2025',
      img: 'https://images.unsplash.com/photo-1526898943670-92bfa9f94c12?w=1200',
      body: [
        'Um cano entupido é dos problemas domésticos mais comuns — e raramente escolhe a melhor altura para acontecer. A boa notícia é que muitos casos ligeiros resolvem-se em casa; os mais graves, esses, pedem ajuda profissional para não piorar.',
        'Saber distinguir uns dos outros evita estragos, maus cheiros e despesas desnecessárias.',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Soluções caseiras para entupimentos ligeiros</h2>',
        'Se a água ainda escoa, mas devagar, experimente primeiro estas abordagens simples e seguras:',
        '<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Água quente:</strong> deite água bem quente (não a ferver, em canos de PVC) para dissolver gorduras e restos de sabão.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Desentupidor de borracha (ventosa):</strong> tape o ladrão, crie vácuo e faça pressão firme várias vezes seguidas.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Bicarbonato e vinagre:</strong> deixe atuar 15 a 20 minutos e termine com água quente.</li><li><strong style="color:#1c1b17">Limpe o sifão:</strong> muitas vezes a obstrução está ali — basta desenroscar e esvaziar.</li></ul>',
        'Evite o uso excessivo de produtos químicos agressivos: a longo prazo corroem e danificam a canalização.',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Sinais de que deve chamar um profissional</h2>',
        'Procure ajuda especializada quando notar um destes sinais — indicam uma obstrução mais profunda:',
        '<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px">O entupimento volta sempre, mesmo depois de limpar.</li><li style="margin-bottom:10px">Mau cheiro persistente a sair dos ralos.</li><li style="margin-bottom:10px">Vários pontos da casa entopem ao mesmo tempo.</li><li>A água sobe noutro sítio (por exemplo, na banheira quando puxa o autoclismo).</li></ul>',
        'Nestes casos, temos o equipamento adequado para localizar e remover a obstrução sem partir paredes — e identificamos a causa para que o problema não regresse.',
        '<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Tem um cano entupido que não desaparece?</strong> Na Speedfaz desentupimos de forma rápida e limpa, com diagnóstico no local e garantia de serviço.</p>'
      ]
    },
    'trocar-lampada': {
      title: 'Trocar uma lâmpada em segurança', subtitle: 'O passo a passo e os erros a evitar', tag: 'Elétrica', date: '21 Abr 2025',
      img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1200',
      body: [
        'Trocar uma lâmpada parece a tarefa mais simples do mundo — e na maioria das vezes é. Mas há cuidados de segurança e pormenores de escolha que fazem toda a diferença, sobretudo se a lâmpada antiga se partiu ou se o ponto de luz dá problemas.',
        'Este guia rápido ajuda a fazê-lo bem e em segurança.',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Passo a passo seguro</h2>',
        '<ol style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Corte a energia:</strong> desligue o interruptor e, idealmente, o disjuntor correspondente no quadro elétrico.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Deixe arrefecer:</strong> as lâmpadas halogéneas e incandescentes ficam muito quentes — espere alguns minutos.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Retire com cuidado:</strong> segure pela base, nunca pelo vidro, e rode no sentido contrário aos ponteiros do relógio.</li><li><strong style="color:#1c1b17">Coloque a nova:</strong> enrosque sem forçar até sentir firmeza e volte a ligar a energia.</li></ol>',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Como escolher a lâmpada certa</h2>',
        'Antes de comprar, confirme três coisas para não se enganar:',
        '<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Casquilho:</strong> E27 (grande), E14 (pequeno), GU10… veja o encaixe do candeeiro.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Potência e luz:</strong> prefira LED — gasta muito menos e dura anos. Repare nos lúmens (brilho) e nos kelvin (luz quente ou fria).</li><li><strong style="color:#1c1b17">Potência máxima:</strong> respeite o limite indicado no candeeiro para não o danificar.</li></ul>',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Quando não é só a lâmpada</h2>',
        'Se a lâmpada nova não acende, pisca, ou o ponto de luz falha de forma intermitente, o problema pode estar no casquilho, no interruptor ou na própria instalação — e aí já não é seguro insistir.',
        '<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">O ponto de luz continua a falhar?</strong> Na Speedfaz diagnosticamos e reparamos o ponto elétrico com segurança, com teste de funcionamento no fim.</p>'
      ]
    },
    'montagem-moveis': {
      title: 'Montagem de móveis', subtitle: 'Tudo o que precisa de saber antes de começar', tag: 'Móveis', date: '09 Mai 2025',
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
      body: [
        'Montar um móvel parece simples até abrirmos a caixa e encontrarmos dezenas de peças, parafusos de todos os tamanhos e um manual de instruções confuso. Com um pouco de método, evita erros, riscos e horas perdidas.',
        'Reunimos os passos e cuidados que fazem a diferença entre um móvel bem montado e um que abana.',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Prepare-se antes de montar</h2>',
        '<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Liberte o espaço:</strong> trabalhe numa área ampla e protegida, para não riscar o chão nem as peças.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Separe as ferragens:</strong> confira se vieram todos os parafusos e cavilhas antes de começar.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Leia o manual até ao fim:</strong> perceba a ordem das fases antes de apertar o primeiro parafuso.</li><li><strong style="color:#1c1b17">Tenha as ferramentas certas:</strong> uma aparafusadora poupa imenso tempo face à chave que vem na caixa.</li></ul>',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Segurança: a fixação à parede</h2>',
        'É o passo mais ignorado e o mais importante. Armários altos, estantes e cómodas devem ser fixados à parede para evitar quedas — um cuidado essencial sobretudo em casas com crianças. A maioria dos acidentes domésticos com móveis acontece por falta desta fixação simples.',
        'Atenção também ao tipo de parede: gesso cartonado, tijolo e betão exigem buchas diferentes para a fixação aguentar.',
        '<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Não quer chatices com a montagem?</strong> Na Speedfaz montamos qualquer móvel, de qualquer marca, com as nossas ferramentas, e fixamos à parede sempre que necessário — deixando tudo direito, seguro e limpo.</p>'
      ]
    },
    'reparacoes-eletricas': {
      title: 'Reparações elétricas em casa', subtitle: 'Pequenos problemas, grandes riscos — saiba o que fazer', tag: 'Elétrica', date: '27 Mai 2025',
      img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200',
      body: [
        'Uma tomada que deixou de funcionar, um disjuntor que dispara de vez em quando, um interruptor solto. São problemas pequenos no dia a dia, mas que, mal resolvidos, podem tornar-se perigosos. Saber reconhecer os sinais e o que evitar é meio caminho andado.',
        'Este guia ajuda-o a perceber quando é seguro esperar e quando deve agir já.',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Sinais de alarme que não deve ignorar</h2>',
        'Se notar qualquer um destes sinais, desligue a energia do circuito afetado no quadro e não use essa tomada ou ponto:',
        '<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Cheiro a queimado</strong> junto a tomadas, interruptores ou ao quadro elétrico.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Tomadas mornas</strong> ou descoloradas ao toque.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Faíscas</strong> ao ligar ou desligar um aparelho.</li><li><strong style="color:#1c1b17">Disjuntores que disparam</strong> repetidamente sem razão aparente.</li></ul>',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Porque não vale a pena improvisar</h2>',
        'Eletricidade não é área para tentativa e erro. Uma ligação mal feita pode causar um curto-circuito, danificar os seus aparelhos ou até provocar um incêndio. A regra de ouro é simples: na dúvida, corte a energia e chame quem percebe.',
        'Trabalhos elétricos devem ficar sempre testados e em conformidade — é isso que garante a sua segurança e a da sua família.',
        '<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Tem um problema elétrico em casa?</strong> Na Speedfaz fazemos o diagnóstico, substituímos tomadas e interruptores e reparamos pontos de luz, sempre com teste de segurança no final.</p>'
      ]
    },
    'manutencao-preventiva': {
      title: 'Manutenção preventiva', subtitle: 'Pequenos cuidados que poupam muito dinheiro', tag: 'Dicas', date: '14 Jun 2025',
      img: 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=1200',
      body: [
        'A reparação mais barata é a que nunca chega a acontecer. A manutenção preventiva consiste em detetar e resolver pequenos problemas antes de se tornarem caros — e poupa muito mais do que custa.',
        'Não precisa de ser técnico: alguns hábitos simples bastam para evitar a maioria das surpresas desagradáveis em casa.',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">A ronda que deve fazer a cada poucos meses</h2>',
        'Reserve dez minutos e verifique:',
        '<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Debaixo dos lava-loiças:</strong> procure humidade ou pingos — sinais de fugas a começar.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Sifões e ralos:</strong> limpe para evitar maus cheiros e entupimentos.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Quadro elétrico:</strong> teste os disjuntores e veja se algum aquece.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Portas e janelas:</strong> lubrifique dobradiças e confirme os vedantes.</li><li><strong style="color:#1c1b17">Eletrodomésticos:</strong> limpe filtros e borrachas das máquinas.</li></ul>',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Atenda aos primeiros avisos</h2>',
        'Uma mancha de humidade na parede, uma porta que começa a ranger, uma torneira mais dura ou um disjuntor que dispara de vez em quando são avisos. Atendê-los cedo custa uma fração do que custa resolver o estrago depois de instalado.',
        '<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Quer prevenir em vez de remediar?</strong> A Speedfaz faz visitas de manutenção geral, com inspeção, pequenos ajustes incluídos e um relatório do que convém vigiar.</p>'
      ]
    },
    'portas-janelas': {
      title: 'Portas e janelas com problemas?', subtitle: 'Soluções rápidas que devolvem conforto e poupam energia', tag: 'Reparações', date: '02 Jul 2025',
      img: 'assets/img/portas.jpg',
      body: [
        'Uma porta que não fecha bem, uma janela por onde entra ar, uma fechadura emperrada. São incómodos do dia a dia que tiram conforto e, muitas vezes, fazem subir a conta da energia sem darmos por isso.',
        'A boa notícia: a maioria resolve-se com um ajuste simples e barato, desde que feito a tempo.',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Problemas comuns e a sua causa</h2>',
        '<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">A porta não fecha ou arrasta:</strong> normalmente são dobradiças desalinhadas ou parafusos soltos.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Entra ar ou ruído:</strong> os vedantes estão gastos e deixaram de isolar.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Fechadura dura ou emperrada:</strong> falta de lubrificação ou um canhão a precisar de substituição.</li><li><strong style="color:#1c1b17">Janela que não veda:</strong> borrachas ressequidas ou ferragem desregulada.</li></ul>',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Porque vale a pena resolver cedo</h2>',
        'Um vedante em mau estado deixa entrar frio no inverno e calor no verão — e isso nota-se na fatura. Uma porta que arrasta acaba por danificar as dobradiças e o aro. Atuar cedo é sempre mais barato do que substituir a peça inteira mais tarde.',
        '<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">As suas portas ou janelas precisam de atenção?</strong> A Speedfaz ajusta portas e janelas, repara fechaduras e dobradiças e troca vedantes — com lubrificação e teste final, para tudo abrir e fechar como deve ser.</p>'
      ]
    },
    'serralharia-residencial': {
      title: 'Serralharia residencial', subtitle: 'Quando e porquê chamar um especialista', tag: 'Serralharia', date: '18 Jul 2025',
      body: [
        'Portões, gradeamentos, varandas, escadas e outras estruturas metálicas dão segurança e valor à casa — mas precisam de cuidados específicos e de quem saiba trabalhar o metal em condições. Ao contrário de outras reparações, aqui o improviso sai caro e perigoso.',
        'Saber reconhecer os sinais de alerta ajuda a intervir antes de o problema agravar.',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Sinais de que a estrutura precisa de intervenção</h2>',
        '<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Ferrugem:</strong> a corrosão enfraquece o metal e alastra se não for tratada.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Soldas partidas ou fissuras:</strong> comprometem a resistência de toda a estrutura.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Portões que arrastam ou descaíram:</strong> sinal de dobradiças ou apoios desgastados.</li><li><strong style="color:#1c1b17">Fechos que já não trancam:</strong> uma falha de segurança a resolver depressa.</li></ul>',
        '<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Porque é trabalho para um especialista</h2>',
        'Soldadura, reforço e fixação de estruturas metálicas exigem ferramenta própria, técnica e experiência. Um trabalho mal feito não só dura pouco como pode pôr em causa a segurança — pense num portão pesado ou num gradeamento de uma varanda.',
        'Um bom acabamento (lixar, tratar e pintar) é o que protege o metal da ferrugem e prolonga a vida da peça.',
        '<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Tem uma estrutura metálica a precisar de reparação?</strong> A Speedfaz avalia, repara ou reforça o metal e dá o acabamento — para ficar resistente, seguro e com bom aspeto.</p>'
      ],
      img: 'https://images.unsplash.com/photo-1608126841512-ed53266c1d62?w=1200'
    }
  };

  /* Menu de navegação. "menu" = itens do dropdown (deixa null para não ter dropdown). */
  var NAV = [
    { label: 'Início', href: 'index.html', key: 'home', menu: [
      { l: 'Como funciona', h: 'index.html#como-funciona' },
      { l: 'Os nossos serviços', h: 'index.html#servicos' },
      { l: 'Porquê a Speedfaz', h: 'index.html#porque' },
      { l: 'Depoimentos', h: 'index.html#depoimentos' }
    ] },
    { label: 'Serviços', href: 'servicos.html', key: 'servicos', menu: CATALOG.map(function (s) { return { l: s.name, h: 'servicos.html#svc-' + s.id }; }) },
    { label: 'Sobre', href: 'sobre.html', key: 'sobre', menu: [
      { l: 'Missão', h: 'sobre.html#missao' },
      { l: 'Visão', h: 'sobre.html#visao' },
      { l: 'Valores', h: 'sobre.html#valores' },
      { l: 'Porquê escolher', h: 'sobre.html#porque-escolher' }
    ] },
    { label: 'Blog', href: 'blog.html', key: 'blog', menu: null },
    { label: 'Contacto', href: 'contacto.html', key: 'contacto', menu: [
      { l: 'Telefones', h: 'contacto.html#telefones' },
      { l: 'Morada', h: 'contacto.html#morada' },
      { l: 'Email', h: 'contacto.html#email' },
      { l: 'Mapa', h: 'contacto.html#mapa' }
    ] }
  ];

  /* ============================================================
     ███  FIM DA ÁREA EDITÁVEL  ███
     ============================================================ */

  var CART_KEY = 'speedfaz_cart';
  var BASE = '';  // prefixo de caminho (ex.: "../" nas páginas dentro de /blog/)
  var WA = 'https://wa.me/' + SITE.whatsapp;
  function waText(t) { return WA + '?text=' + encodeURIComponent(t); }
  var WA_ORC = waText('Olá! Gostava de pedir um orçamento.');
  function fmt(n) { return Number(n).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function find(id) { for (var i = 0; i < CATALOG.length; i++) if (CATALOG[i].id === id) return CATALOG[i]; return null; }

  var WA_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.13c-.24.68-1.42 1.32-1.95 1.36-.5.05-1.13.07-1.83-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.39-.15-.2-1.19-1.58-1.19-3.01s.75-2.13 1.02-2.43c.27-.29.59-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.59.82 2.02.89 2.17.07.15.12.32.02.51-.09.2-.14.32-.27.49-.14.17-.29.38-.41.51-.14.15-.28.31-.12.59.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.27.15.43.12.59-.07.16-.2.68-.79.86-1.06.18-.27.36-.22.59-.13.24.09 1.52.72 1.78.85.27.13.44.2.51.31.07.12.07.68-.17 1.34Z"></path></svg>';
  var CART_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c1b17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4"></circle><circle cx="18" cy="20" r="1.4"></circle><path d="M2.5 3h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6"></path></svg>';
  var LOGO_MARK = '<svg width="38" height="38" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M9 33 A15 15 0 0 1 39 33" stroke="#727271" stroke-width="3.4" stroke-linecap="round" fill="none"></path><line x1="24" y1="33" x2="32.5" y2="20.5" stroke="#f08143" stroke-width="3.6" stroke-linecap="round"></line><rect x="30.5" y="15.5" width="10" height="5.4" rx="1.6" transform="rotate(34 35.5 18.2)" fill="#f08143"></rect><circle cx="24" cy="33" r="3.6" fill="#fff"></circle></svg>';

  /* ---------- Cabeçalho ---------- */
  function buildHeader(active) {
    var nav = NAV.map(function (item) {
      var activeCls = item.key === active ? ' is-active' : '';
      if (item.menu && item.menu.length) {
        var drop = item.menu.map(function (m) { return '<a href="' + BASE + esc(m.h) + '">' + esc(m.l) + '</a>'; }).join('');
        return '<div class="sf-nav-item">' +
          '<a class="sf-navlink' + activeCls + '" href="' + BASE + esc(item.href) + '">' + esc(item.label) + ' <span class="sf-caret">▾</span></a>' +
          '<div class="sf-dropdown">' + drop + '</div>' +
        '</div>';
      }
      return '<a class="sf-navlink' + activeCls + '" href="' + BASE + esc(item.href) + '">' + esc(item.label) + '</a>';
    }).join('');

    return '<header class="sf-header"><div class="sf-header-inner">' +
      '<a class="sf-logo" href="' + BASE + 'index.html" aria-label="Speedfaz — página inicial"><img src="' + BASE + 'assets/img/logo.png" alt="Speedfaz — reparações residenciais"></a>' +
      '<nav class="sf-nav">' + nav +
        '<a class="sf-cart-btn" href="' + BASE + 'cart.html" title="Carrinho" aria-label="Carrinho">' + CART_ICON +
          '<span class="sf-cart-count" data-cart-count hidden>0</span></a>' +
        '<a class="sf-btn sf-btn-primary sm" href="' + esc(WA_ORC) + '" target="_blank" rel="noopener">Pedir orçamento</a>' +
      '</nav></div></header>';
  }

  /* ---------- Rodapé ---------- */
  function buildFooter() {
    var phonesInline = SITE.phones.map(function (p) { return '<a href="tel:' + esc(p.tel) + '">' + esc(p.label) + '</a>'; }).join('<span class="sep">/</span>');
    var navLinks = NAV.map(function (i) { return '<a href="' + BASE + esc(i.href) + '">' + esc(i.label) + '</a>'; }).join('');

    return '<footer class="sf-footer"><div class="sf-footer-grid">' +
      '<div>' +
        '<div class="sf-footer-logo"><img src="' + BASE + 'assets/img/logo.png" alt="Speedfaz"></div>' +
        '<p style="font-size:14px;color:#8f8c86;margin:14px 0 0;max-width:260px">Reparações residenciais e comerciais, rápidas e de confiança na margem sul.</p>' +
      '</div>' +
      '<div><h4>Contacto</h4>' +
        '<div class="sf-footer-links">' +
          '<div class="sf-footer-phones">' + phonesInline + '</div>' +
          '<a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + '</a>' +
          '<a href="https://instagram.com/' + esc(SITE.instagram) + '" target="_blank" rel="noopener">@' + esc(SITE.instagram) + '</a>' +
        '</div>' +
      '</div>' +
      '<div><h4>Navegação</h4><div class="sf-footer-nav">' + navLinks + '</div></div>' +
      '<div><h4>Onde estamos</h4><p style="font-size:14px;color:#8f8c86;margin:0">' + SITE.addressHtml + '<br>' + esc(SITE.website) + '</p></div>' +
    '</div>' +
    '<div class="sf-footer-bottom"><div>© 2025 Speedfaz. Todos os direitos reservados.</div></div></footer>';
  }

  /* ---------- WhatsApp flutuante ---------- */
  function buildFloat() {
    return '<a href="' + esc(WA) + '" target="_blank" rel="noopener" aria-label="Falar no WhatsApp" class="sf-wa-float">' +
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.13c-.24.68-1.42 1.32-1.95 1.36-.5.05-1.13.07-1.83-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.39-.15-.2-1.19-1.58-1.19-3.01s.75-2.13 1.02-2.43c.27-.29.59-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.59.82 2.02.89 2.17.07.15.12.32.02.51-.09.2-.14.32-.27.49-.14.17-.29.38-.41.51-.14.15-.28.31-.12.59.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.27.15.43.12.59-.07.16-.2.68-.79.86-1.06.18-.27.36-.22.59-.13.24.09 1.52.72 1.78.85.27.13.44.2.51.31.07.12.07.68-.17 1.34Z"></path></svg></a>';
  }

  function injectChrome() {
    BASE = document.body.getAttribute('data-base') || '';
    var active = document.body.getAttribute('data-page') || '';
    var h = document.getElementById('sf-header'); if (h) h.outerHTML = buildHeader(active);
    var f = document.getElementById('sf-footer'); if (f) f.outerHTML = buildFooter();
    document.body.insertAdjacentHTML('beforeend', buildFloat());
  }

  /* ---------- Estado do carrinho (localStorage) ---------- */
  function getCart() { try { var v = JSON.parse(localStorage.getItem(CART_KEY)); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  function setCart(arr) { try { localStorage.setItem(CART_KEY, JSON.stringify(arr)); } catch (e) {} updateBadges(); renderCartPage(); }
  function addToCart(id) { var c = getCart(); if (c.indexOf(id) === -1) { c.push(id); setCart(c); } }
  function removeFromCart(id) { setCart(getCart().filter(function (x) { return x !== id; })); }
  function inCart(id) { return getCart().indexOf(id) !== -1; }

  function updateBadges() {
    var n = getCart().length;
    var badges = document.querySelectorAll('[data-cart-count]');
    for (var i = 0; i < badges.length; i++) { badges[i].textContent = n; badges[i].hidden = n === 0; }
  }

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === 'class') n.className = attrs[k]; else if (k === 'style') n.style.cssText = attrs[k]; else n.setAttribute(k, attrs[k]); }
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ---------- Modal: detalhe de serviço ---------- */
  function openServiceModal(id) {
    var s = find(id); if (!s) return;
    var artHref = SERVICE_BLOG[id] ? BASE + 'blog/' + SERVICE_BLOG[id] + '.html' : BASE + 'blog.html';
    var overlay = el('div', { class: 'sf-modal-overlay' });
    function close() { if (overlay.parentNode) document.body.removeChild(overlay); }
    var incHtml = s.included.map(function (i) {
      return '<div class="sf-included"><span class="tick">✓</span><span style="color:#3d3c39;font-size:15px">' + esc(i) + '</span></div>';
    }).join('');
    var modal = el('div', { class: 'sf-modal' });
    modal.innerHTML =
      '<div style="position:relative;height:200px;overflow:hidden;border-radius:20px 20px 0 0">' +
        '<img src="' + esc(s.img) + '" alt="' + esc(s.name) + '" style="width:100%;height:100%;object-fit:cover">' +
        '<div class="sf-modal-close" data-close style="position:absolute;top:12px;right:12px">✕</div>' +
      '</div>' +
      '<div style="padding:26px 28px 28px">' +
        '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px">' +
          '<h3 style="font-weight:800;font-size:23px;margin:0">' + esc(s.name) + '</h3>' +
          '<span class="sf-price-pill" style="font-size:14px;padding:7px 13px">' + esc(s.priceLabel) + '</span>' +
        '</div>' +
        '<p style="color:#5c5b58;font-size:15px;margin:0 0 20px">' + esc(s.descLong) + '</p>' +
        '<div style="display:flex;align-items:center;gap:10px;background:#fdeee4;border:1px solid #f7cdaf;border-radius:12px;padding:11px 14px;margin-bottom:20px">' +
          '<span style="color:#8a5a3c;font-size:13px">Taxa de visita — deslocação e diagnóstico, descontada no total se o serviço for feito no momento.</span>' +
        '</div>' +
        '<div style="font-weight:800;font-size:15px;margin-bottom:10px">O que está incluído</div>' +
        '<div style="display:flex;flex-direction:column;gap:9px;margin-bottom:24px">' + incHtml + '</div>' +
        '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
          '<button data-toggle-cart class="sf-btn ' + (inCart(id) ? 'sf-btn-dark' : 'sf-btn-primary lg') + '" style="flex:1;min-width:200px;padding:14px 18px;font-size:15px">' +
            (inCart(id) ? 'Remover do carrinho' : '+ Adicionar ao carrinho') + '</button>' +
          '<a href="' + esc(artHref) + '" class="sf-link-underline" style="display:inline-flex;align-items:center">Sobre este serviço →</a>' +
        '</div>' +
      '</div>';
    overlay.appendChild(modal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    modal.querySelector('[data-close]').addEventListener('click', close);
    modal.querySelector('[data-toggle-cart]').addEventListener('click', function () {
      if (inCart(id)) removeFromCart(id); else addToCart(id);
      close(); /* fecha e volta à página de serviços */
    });
    document.body.appendChild(overlay);
  }

  /* ---------- Modal: total estimado ---------- */
  function openTotalModal() {
    var cart = getCart();
    var total = cart.reduce(function (sum, id) { var s = find(id); return sum + (s && s.priceValue != null ? s.priceValue : 0); }, 0);
    var iva = total - total / 1.23;
    var rows = cart.map(function (id) {
      var s = find(id); var price = s.priceValue != null ? fmt(s.priceValue) : 'Sob avaliação';
      return '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px"><span style="color:#3d3c39;font-size:15px">' + esc(s.name) + '</span><span style="font-weight:700;font-size:15px;white-space:nowrap">' + price + '</span></div>';
    }).join('');
    var overlay = el('div', { class: 'sf-modal-overlay' });
    function close() { if (overlay.parentNode) document.body.removeChild(overlay); }
    var modal = el('div', { class: 'sf-modal narrow' });
    modal.innerHTML =
      '<div style="padding:26px 28px 28px">' +
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:6px">' +
          '<h3 style="font-weight:800;font-size:22px;margin:0">Valor estimado</h3>' +
          '<div class="sf-modal-close" data-close style="background:#f5f4f2;width:34px;height:34px;font-size:17px">✕</div></div>' +
        '<p style="color:#9a9893;font-size:14px;margin:0 0 22px">O preço final pode variar após avaliação no local.</p>' +
        '<div style="display:flex;flex-direction:column;gap:12px;border-top:1px solid #ecebe8;padding-top:18px">' + rows + '</div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;border-top:1px solid #ecebe8;margin-top:16px;padding-top:14px;color:#727271;font-size:14px"><span>IVA incluído (23%)</span><span style="font-weight:600">' + fmt(iva) + '</span></div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;border-top:2px solid #1c1b17;margin-top:12px;padding-top:14px"><span style="font-weight:800;font-size:17px">Total estimado</span><span style="font-weight:800;font-size:24px;color:#f08143">' + fmt(total) + '</span></div>' +
        '<a href="' + esc(buildCartLink()) + '" target="_blank" rel="noopener" class="sf-btn sf-btn-green" style="display:flex;width:100%;padding:15px 18px;font-size:16px;margin-top:22px">' + WA_SVG + ' Pedir no WhatsApp</a>' +
      '</div>';
    overlay.appendChild(modal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    modal.querySelector('[data-close]').addEventListener('click', close);
    document.body.appendChild(overlay);
  }

  function buildCartLink() {
    var cart = getCart();
    var total = cart.reduce(function (sum, id) { var s = find(id); return sum + (s && s.priceValue != null ? s.priceValue : 0); }, 0);
    var names = cart.map(function (id) { var s = find(id); return s ? s.name : ''; }).filter(Boolean).join(', ');
    return waText('Olá Speedfaz! Tenho interesse nos seguintes serviços: ' + names + '. Valor estimado: ' + fmt(total) + '. Podem confirmar disponibilidade?');
  }

  /* ---------- Página do carrinho ---------- */
  function renderCartPage() {
    var root = document.getElementById('sf-cart-root'); if (!root) return;
    var cart = getCart();
    var listEl = document.getElementById('sf-cart-list');
    var emptyEl = document.getElementById('sf-cart-empty');
    var filledEl = document.getElementById('sf-cart-filled');

    if (cart.length === 0) { if (emptyEl) emptyEl.hidden = false; if (filledEl) filledEl.hidden = true; return; }
    if (emptyEl) emptyEl.hidden = true; if (filledEl) filledEl.hidden = false;

    listEl.innerHTML = '';
    cart.forEach(function (id) {
      var s = find(id); if (!s) return;
      var item = el('div', { class: 'sf-cart-item' });
      item.innerHTML =
        '<img src="' + esc(s.img) + '" alt="' + esc(s.name) + '" style="flex:none;width:72px;height:72px;object-fit:cover;border-radius:12px">' +
        '<div style="flex:1;min-width:0"><h3 style="font-weight:700;font-size:17px;margin:0 0 3px">' + esc(s.name) + '</h3>' +
        '<div style="color:#e06f30;font-weight:700;font-size:14px">' + esc(s.priceLabel) + '</div>' +
        '<div style="color:#9a9893;font-size:13px;margin-top:2px">Toca para ver detalhes</div></div>' +
        '<div class="sf-cart-remove" title="Remover">✕</div>';
      item.addEventListener('click', function () { openServiceModal(id); });
      item.querySelector('.sf-cart-remove').addEventListener('click', function (e) { e.stopPropagation(); removeFromCart(id); });
      listEl.appendChild(item);
    });

    var relWrap = document.getElementById('sf-related-wrap');
    var relTrack = document.getElementById('sf-related-track');
    var cats = []; cart.forEach(function (id) { var s = find(id); if (s && cats.indexOf(s.cat) === -1) cats.push(s.cat); });
    var related = PRODUCTS.filter(function (p) { return cats.indexOf(p.cat) !== -1; });
    if (related.length > 0) {
      relWrap.hidden = false;
      relTrack.innerHTML = related.map(function (p) {
        return '<div style="flex:0 0 calc((100% - 32px) / 3);min-width:150px;scroll-snap-align:start;background:#fff;border:1px solid #ecebe8;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(28,27,23,.04)">' +
          '<div style="height:118px;overflow:hidden"><img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>' +
          '<div style="padding:12px 14px"><h4 style="font-weight:700;font-size:14px;margin:0 0 4px;line-height:1.25">' + esc(p.name) + '</h4><div style="color:#e06f30;font-weight:700;font-size:14px">' + esc(p.price) + '</div></div></div>';
      }).join('');
    } else { relWrap.hidden = true; }

    var total = cart.reduce(function (sum, id) { var s = find(id); return sum + (s && s.priceValue != null ? s.priceValue : 0); }, 0);
    document.getElementById('sf-total-label').textContent = fmt(total);
    document.getElementById('sf-cart-wa').href = buildCartLink();
  }

  /* ---------- Página de artigo (blog) ---------- */
  function renderArticle() {
    var root = document.getElementById('sf-article-root'); if (!root) return;
    var slug = '';
    try { slug = new URLSearchParams(location.search).get('post') || ''; } catch (e) {}
    var post = BLOG[slug];
    if (!post) {
      root.innerHTML = '<section style="max-width:760px;margin:0 auto;padding:clamp(48px,7vw,90px) 24px;text-align:center">' +
        '<h1 style="font-weight:800;font-size:clamp(28px,4vw,40px);margin:0 0 12px">Artigo não encontrado</h1>' +
        '<p style="color:#727271;font-size:17px;margin:0 0 24px">O artigo que procuras não existe ou foi movido.</p>' +
        '<a href="blog.html" class="sf-btn sf-btn-primary lg">← Voltar ao blog</a></section>';
      return;
    }
    document.title = post.title + ' | Speedfaz';
    var bodyHtml = post.body.map(function (p) { return /^\s*</.test(p) ? p : '<p style="font-size:17px;color:#3d3c39;margin:0 0 18px">' + p + '</p>'; }).join('');
    root.innerHTML =
      '<article style="max-width:820px;margin:0 auto;padding:clamp(28px,4vw,44px) 24px clamp(48px,6vw,80px)">' +
        '<a href="blog.html" style="cursor:pointer;display:inline-flex;align-items:center;gap:7px;color:#727271;font-weight:600;font-size:15px;margin-bottom:22px;text-decoration:none">← Voltar ao blog</a>' +
        '<div class="sf-eyebrow" style="margin-bottom:12px">' + esc(post.tag) + ' · ' + esc(post.date) + '</div>' +
        '<h1 style="font-weight:800;font-size:clamp(30px,4.5vw,46px);line-height:1.1;letter-spacing:-.5px;margin:0 0 12px">' + esc(post.title) + '</h1>' +
        (post.subtitle ? '<p style="font-size:clamp(17px,2.2vw,22px);color:#727271;font-weight:600;line-height:1.3;margin:0 0 24px">' + esc(post.subtitle) + '</p>' : '') +
        '<img src="' + esc(post.img) + '" alt="' + esc(post.title) + '" style="width:100%;height:clamp(220px,34vw,400px);object-fit:cover;border-radius:18px;box-shadow:0 18px 40px rgba(28,27,23,.14);margin-bottom:30px">' +
        '<div>' + bodyHtml + '</div>' +
        '<div style="margin-top:34px;display:flex;flex-wrap:wrap;gap:14px;align-items:center;background:#f5f4f2;border:1px solid #ecebe8;border-radius:18px;padding:24px 26px">' +
          '<div style="flex:1;min-width:220px"><div style="font-weight:800;font-size:18px;margin-bottom:4px">Precisas de ajuda com isto?</div><p style="margin:0;color:#5c5b58;font-size:15px">Fala connosco e resolvemos rápido, sem complicações.</p></div>' +
          '<a href="' + esc(WA_ORC) + '" target="_blank" rel="noopener" class="sf-btn sf-btn-primary lg">' + WA_SVG + ' Pedir orçamento</a>' +
        '</div>' +
      '</article>';
  }

  /* ---------- Depoimentos (carrossel + formulário) ---------- */
  function starsHtml(n) {
    return '<span style="color:#f0b343">' + Array(n + 1).join('★') + '</span>' +
           '<span style="color:#ddd9d2">' + Array(5 - n + 1).join('★') + '</span>';
  }

  function renderTestimonials() {
    var track = document.getElementById('sf-testi-track'); if (!track) return;
    var cards = TESTIMONIALS.map(function (t) {
      var initial = (t.name || '?').trim().charAt(0).toUpperCase();
      return '<div style="flex:0 0 340px;max-width:86vw;scroll-snap-align:start;background:#f5f4f2;border:1px solid #ecebe8;border-radius:18px;padding:30px 28px;display:flex;flex-direction:column">' +
          '<div style="font-size:20px;letter-spacing:3px;margin-bottom:16px">' + starsHtml(t.stars) + '</div>' +
          '<p style="color:#3d3c39;font-size:15px;font-style:italic;margin:0 0 22px;flex:1">"' + esc(t.text) + '"</p>' +
          '<div style="display:flex;align-items:center;gap:12px">' +
            '<div style="flex:none;width:42px;height:42px;border-radius:50%;background:#f08143;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px">' + esc(initial) + '</div>' +
            '<div><div style="font-weight:700;font-size:15px">' + esc(t.name) + '</div><div style="color:#9a9893;font-size:13px">' + esc(t.service) + '</div></div>' +
          '</div>' +
        '</div>';
    });
    /* Card final: "deixe o seu depoimento" (mantido como placeholder) */
    cards.push('<div style="flex:0 0 340px;max-width:86vw;scroll-snap-align:start;background:#fff;border:2px dashed #d8d6d1;border-radius:18px;padding:30px 28px;display:flex;flex-direction:column;justify-content:center;gap:16px">' +
        '<div style="font-size:20px;letter-spacing:3px;color:#f0b343">★★★★★</div>' +
        '<p style="color:#9a9893;font-size:15px;font-style:italic;margin:0">"A tua opinião pode ser a próxima. Após o serviço, partilha a tua experiência."</p>' +
        '<button id="sf-testi-add" class="sf-btn sf-btn-primary" style="align-self:flex-start;padding:12px 18px;font-size:15px">Deixe o seu depoimento</button>' +
      '</div>');
    track.innerHTML = cards.join('');

    var addBtn = document.getElementById('sf-testi-add');
    if (addBtn) addBtn.addEventListener('click', openTestimonialForm);
    var l = document.getElementById('sf-testi-left'), r = document.getElementById('sf-testi-right');
    if (l) l.addEventListener('click', function () { track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' }); });
    if (r) r.addEventListener('click', function () { track.scrollBy({ left: track.clientWidth, behavior: 'smooth' }); });
  }

  function openTestimonialForm() {
    var overlay = el('div', { class: 'sf-modal-overlay' });
    function close() { if (overlay.parentNode) document.body.removeChild(overlay); }
    var modal = el('div', { class: 'sf-modal narrow' });
    modal.innerHTML =
      '<div style="padding:26px 28px 28px">' +
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:6px">' +
          '<h3 style="font-weight:800;font-size:22px;margin:0">Deixe o seu depoimento</h3>' +
          '<div class="sf-modal-close" data-close style="background:#f5f4f2;width:34px;height:34px;font-size:17px">✕</div></div>' +
        '<p style="color:#9a9893;font-size:14px;margin:0 0 20px">Partilha a tua experiência. Ao enviar, abre o WhatsApp com a mensagem pronta.</p>' +
        '<label style="display:block;font-weight:700;font-size:14px;margin-bottom:6px">O teu nome</label>' +
        '<input id="sf-t-name" type="text" placeholder="Ex.: Ana Sofia" style="width:100%;padding:12px 14px;border:1px solid #ecebe8;border-radius:10px;font:inherit;font-size:15px;margin-bottom:16px">' +
        '<label style="display:block;font-weight:700;font-size:14px;margin-bottom:6px">Classificação</label>' +
        '<div id="sf-t-stars" style="font-size:30px;letter-spacing:5px;cursor:pointer;margin-bottom:16px;user-select:none">' +
          [1, 2, 3, 4, 5].map(function (v) { return '<span data-v="' + v + '">★</span>'; }).join('') + '</div>' +
        '<label style="display:block;font-weight:700;font-size:14px;margin-bottom:6px">O teu depoimento</label>' +
        '<textarea id="sf-t-text" rows="4" placeholder="Conta como correu o serviço…" style="width:100%;padding:12px 14px;border:1px solid #ecebe8;border-radius:10px;font:inherit;font-size:15px;resize:vertical;margin-bottom:20px"></textarea>' +
        '<button id="sf-t-send" class="sf-btn sf-btn-green" style="display:flex;width:100%;padding:14px 18px;font-size:16px">' + WA_SVG + ' Enviar no WhatsApp</button>' +
      '</div>';
    overlay.appendChild(modal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    modal.querySelector('[data-close]').addEventListener('click', close);

    var rating = 5;
    var starSpans = modal.querySelectorAll('#sf-t-stars span');
    function paint() { for (var i = 0; i < starSpans.length; i++) starSpans[i].style.color = i < rating ? '#f0b343' : '#ddd9d2'; }
    for (var i = 0; i < starSpans.length; i++) {
      (function (s) { s.addEventListener('click', function () { rating = parseInt(s.getAttribute('data-v'), 10); paint(); }); })(starSpans[i]);
    }
    paint();

    modal.querySelector('#sf-t-send').addEventListener('click', function () {
      var name = (modal.querySelector('#sf-t-name').value || '').trim();
      var text = (modal.querySelector('#sf-t-text').value || '').trim();
      var textEl = modal.querySelector('#sf-t-text');
      if (!text) { textEl.style.borderColor = '#e0594a'; textEl.focus(); return; }
      var msg = 'Olá! Quero deixar um depoimento para a Speedfaz:\n\n' +
        'Nome: ' + (name || '(não indicado)') + '\n' +
        'Classificação: ' + rating + '/5\n' +
        'Depoimento: "' + text + '"';
      window.open(waText(msg), '_blank', 'noopener');
      close();
    });

    document.body.appendChild(overlay);
  }

  /* ---------- Arranque ---------- */
  function init() {
    injectChrome();
    updateBadges();
    renderArticle();
    renderTestimonials();

    var cards = document.querySelectorAll('[data-service]');
    for (var i = 0; i < cards.length; i++) {
      (function (c) { c.addEventListener('click', function () { openServiceModal(c.getAttribute('data-service')); }); })(cards[i]);
    }

    renderCartPage();
    var totalToggle = document.getElementById('sf-total-toggle');
    if (totalToggle) totalToggle.addEventListener('click', openTotalModal);
    var relL = document.getElementById('sf-rel-left'), relR = document.getElementById('sf-rel-right'), relT = document.getElementById('sf-related-track');
    if (relL && relT) relL.addEventListener('click', function () { relT.scrollBy({ left: -relT.clientWidth, behavior: 'smooth' }); });
    if (relR && relT) relR.addEventListener('click', function () { relT.scrollBy({ left: relT.clientWidth, behavior: 'smooth' }); });
  }

  window.SpeedfazCart = { add: addToCart, remove: removeFromCart, open: openServiceModal };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
