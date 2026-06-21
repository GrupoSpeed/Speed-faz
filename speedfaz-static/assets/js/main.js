/* ============================================================
   Speedfaz — lógica partilhada (vanilla JS)
   Cabeçalho, rodapé, menu, carrinho, modais e i18n — tudo num só sítio.
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     ███  ÁREA EDITÁVEL  ███
     Altera aqui os dados do site. Não é preciso mexer no HTML.
     ============================================================ */

  var SITE = {
    whatsapp: '351923322717',
    phones: [
      { label: '923 322 717', tel: '+351923322717' },
      { label: '963 688 086', tel: '+351963688086' }
    ],
    email: 'geral@speedfaz.com',
    instagram: 'speed.faz',
    addressHtml: 'Rua dos Pinheirinhos, 15, loja j<br>2910-121 Setúbal',
    website: 'www.speedfaz.com',
    baseUrl: 'https://www.speedfaz.com',
    zona: 'Margem Sul'
  };

  /* Catálogo de serviços — preços ajustados ao mercado da Margem Sul 2026 */
  var CATALOG = [
    { id: 'lampadas', name: 'Lâmpadas e tomadas', priceLabel: 'Desde 25 €', priceValue: 25, cat: 'eletrica',
      img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=700',
      descLong: 'Resolvemos pontos de luz que não funcionam, tomadas queimadas e interruptores avariados. Substituímos, instalamos e testamos tudo com segurança.',
      included: ['Diagnóstico do ponto elétrico', 'Substituição de lâmpadas e casquilhos', 'Instalação ou troca de tomadas e interruptores', 'Teste de funcionamento e segurança'] },
    { id: 'torneiras', name: 'Torneiras e canalização', priceLabel: 'Desde 55 €', priceValue: 55, cat: 'canalizacao',
      img: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=700',
      descLong: 'Da torneira a pingar ao cano entupido — instalamos e reparamos torneiras, sifões e canalização, e verificamos fugas e pressão.',
      included: ['Avaliação da canalização', 'Instalação ou reparação de torneira', 'Substituição de vedantes e sifões', 'Teste de fugas e pressão'] },
    { id: 'moveis', name: 'Montagem de móveis', priceLabel: 'Desde 35 €', priceValue: 35, cat: 'moveis',
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700',
      descLong: 'Montamos qualquer móvel, de qualquer marca, com as nossas ferramentas. Fixamos à parede quando necessário e deixamos tudo limpo.',
      included: ['Montagem completa do móvel', 'Ferramentas incluídas', 'Fixação à parede (se aplicável)', 'Limpeza e remoção de embalagens'] },
    { id: 'eletro', name: 'Instalação de eletrodomésticos', priceLabel: 'Desde 50 €', priceValue: 50, cat: 'eletrodomesticos',
      img: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=700',
      descLong: 'Instalamos máquinas de lavar, frigoríficos, fogões e outros eletrodomésticos, com ligação e teste de funcionamento incluídos.',
      included: ['Posicionamento e nivelamento', 'Ligação elétrica e/ou de água', 'Teste de funcionamento', 'Conselhos de utilização'] },
    { id: 'portas', name: 'Portas e janelas', priceLabel: 'Desde 40 €', priceValue: 40, cat: 'portas',
      img: 'assets/img/portas.jpg',
      descLong: 'Ajustamos portas e janelas que não fecham bem, reparamos fechaduras e dobradiças e substituímos vedantes para mais conforto.',
      included: ['Ajuste de portas e janelas', 'Reparação de fechaduras e dobradiças', 'Substituição de vedantes', 'Lubrificação e teste'] },
    { id: 'serralharia', name: 'Serralharia', priceLabel: 'Desde 65 €', priceValue: 65, cat: 'serralharia',
      img: 'https://images.unsplash.com/photo-1608126841512-ed53266c1d62?w=700',
      descLong: 'Reparações e instalações de estruturas metálicas residenciais — portões, gradeamentos e reforços, com acabamento cuidado.',
      included: ['Avaliação da estrutura', 'Reparação ou reforço metálico', 'Soldadura ou fixação conforme necessário', 'Acabamento e teste'] },
    { id: 'manutencao', name: 'Manutenção preventiva', priceLabel: 'Orçamento personalizado', priceValue: null, cat: 'geral',
      img: 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=700',
      descLong: 'Uma visita de manutenção geral para detetar e resolver pequenos problemas antes que se tornem caros. Orçamento conforme o que a tua casa precisa.',
      included: ['Inspeção geral da casa', 'Verificação elétrica e de canalização', 'Pequenos ajustes incluídos', 'Relatório de recomendações'] }
  ];

  /* Produtos relacionados no carrinho — imagens ajustadas por categoria */
  var PRODUCTS = [
    { name: 'Lâmpada LED E27 9W', price: '6,90 €', cat: 'eletrica',
      img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400' },
    { name: 'Tomada Schuko branca', price: '7,90 €', cat: 'eletrica',
      img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400' },
    { name: 'Interruptor duplo', price: '9,90 €', cat: 'eletrica',
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { name: 'Torneira monocomando', price: '45,00 €', cat: 'canalizacao',
      img: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400' },
    { name: 'Sifão universal', price: '8,50 €', cat: 'canalizacao',
      img: 'https://images.unsplash.com/photo-1526898943670-92bfa9f94c12?w=400' },
    { name: 'Fita vedante (teflon)', price: '3,50 €', cat: 'canalizacao',
      img: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400' },
    { name: 'Kit parafusos e buchas', price: '6,90 €', cat: 'moveis',
      img: 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=400' },
    { name: 'Suporte TV de parede', price: '22,00 €', cat: 'moveis',
      img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400' },
    { name: 'Pés ajustáveis (x4)', price: '11,00 €', cat: 'moveis',
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
    { name: 'Mangueira máquina de lavar', price: '9,50 €', cat: 'eletrodomesticos',
      img: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=400' },
    { name: 'Filtro universal', price: '14,00 €', cat: 'eletrodomesticos',
      img: 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=400' },
    { name: 'Fechadura de segurança', price: '35,00 €', cat: 'portas',
      img: 'https://images.unsplash.com/photo-1583691028182-e8f01e74bfa2?w=400' },
    { name: 'Dobradiças (par)', price: '7,50 €', cat: 'portas',
      img: 'https://images.unsplash.com/photo-1608126841512-ed53266c1d62?w=400' },
    { name: 'Vedante de porta', price: '5,50 €', cat: 'portas',
      img: 'https://images.unsplash.com/photo-1583691028182-e8f01e74bfa2?w=400' },
    { name: 'Cantoneira reforçada', price: '13,00 €', cat: 'serralharia',
      img: 'https://images.unsplash.com/photo-1608126841512-ed53266c1d62?w=400' },
    { name: 'Fecho de portão', price: '28,00 €', cat: 'serralharia',
      img: 'https://images.unsplash.com/photo-1608126841512-ed53266c1d62?w=400' }
  ];

  var TESTIMONIALS = [
    { name: 'Ana Sofia', service: 'Torneiras e canalização', stars: 5, text: 'Vieram no próprio dia arranjar uma torneira que não parava de pingar. Rápidos, simpáticos e o preço foi mesmo o combinado.' },
    { name: 'Miguel Costa', service: 'Montagem de móveis', stars: 5, text: 'Montaram-me um roupeiro grande num instante e fixaram tudo à parede. Ficou impecável e deixaram tudo limpo.' },
    { name: 'Carla Ferreira', service: 'Lâmpadas e tomadas', stars: 5, text: 'Tinha várias tomadas sem funcionar. Diagnosticaram o problema e resolveram tudo com segurança. Recomendo!' },
    { name: 'João Almeida', service: 'Eletrodomésticos', stars: 5, text: 'Instalaram a máquina de lavar nova e testaram tudo antes de saírem. Profissionais e pontuais.' },
    { name: 'Rita Marques', service: 'Portas e janelas', stars: 5, text: 'A porta de entrada não fechava bem. Ajustaram a fechadura e as dobradiças no momento. Excelente serviço.' }
  ];

  var SERVICE_BLOG = {
    lampadas: 'trocar-lampada',
    torneiras: 'torneira-vazamento',
    moveis: 'montagem-moveis',
    eletro: 'reparacoes-eletricas',
    portas: 'portas-janelas',
    serralharia: 'serralharia-residencial',
    manutencao: 'manutencao-preventiva'
  };

  /* Estilos HTML reutilizados nos artigos */
  var _H = 'style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px"';
  var _U = 'style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"';
  var _O = 'style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"';
  var _L = 'style="margin-bottom:10px"';
  var _B = 'style="color:#1c1b17"';
  var _P = 'style="font-size:17px;color:#3d3c39;margin:32px 0 18px"';
  var _O2 = 'style="color:#f08143"';

  var BLOG = {
    'torneira-vazamento': {
      img: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200',
      pt: { title: 'Como detetar uma torneira a pingar', subtitle: 'O guia prático para evitar desperdícios', tag: 'Canalização', date: '12 Mar 2025',
        body: ['Uma torneira a pingar parece, à primeira vista, apenas um incómodo menor. No entanto, este pequeno problema pode desperdiçar milhares de litros de água por ano, resultando num aumento significativo na fatura da água e, a longo prazo, em danos estruturais na sua bancada ou armários.','Detetar e resolver o problema precocemente é a melhor forma de poupar dinheiro e evitar reparações dispendiosas no futuro.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">4 sinais de alerta de uma torneira com fuga</h2>','Antes de tentar qualquer reparação, identifique se o problema é realmente uma fuga. Fique atento a estes sinais:','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Gotejamento constante:</strong> a torneira continua a pingar mesmo após ser fechada com firmeza.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Humidade ou calcário:</strong> manchas de água, humidade persistente ou acumulação de calcário na base da torneira ou no interior do armário.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Ruídos estranhos:</strong> sons de água a correr dentro dos canos ou das paredes.</li><li><strong style="color:#1c1b17">Aumento inexplicável na fatura:</strong> se o consumo mensal de água subiu sem uma razão aparente, pode haver uma fuga lenta.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">O teste infalível: como verificar o contador de água</h2>','Quer ter a certeza de que a fuga está na sua canalização? Siga este passo a passo simples:','<ol style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Feche todas as saídas de água:</strong> certifique-se de que todas as torneiras, máquinas de lavar e descargas estão fechadas.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Observe o contador de água:</strong> vá até ao contador e verifique se o ponteiro ou os números continuam a rodar/mudar.</li><li><strong style="color:#1c1b17">Analise o resultado:</strong> se o contador continuar a marcar consumo com tudo fechado, existe uma fuga de água algures na canalização da sua habitação.</li></ol>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Quando deve chamar um profissional da Speedfaz?</h2>','Embora algumas fugas possam ser resolvidas substituindo um vedante ou o sistema interno (cartucho) da torneira, nem sempre a solução é simples. Muitas vezes, a tentativa de reparação "faça você mesmo" sem as ferramentas adequadas pode danificar ainda mais a canalização ou causar roturas maiores.','Se o problema persistir, se notar que a torneira está presa ou se suspeitar de fugas dentro da parede, não arrisque.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Precisa de ajuda profissional para reparar uma torneira ou fuga de água?</strong> Na Speedfaz, temos técnicos especializados prontos para avaliar, reparar e testar todo o sistema de canalização no local, com rapidez e garantia de serviço.</p>'] },
      en: { title: 'How to detect a dripping tap', subtitle: 'The practical guide to avoiding waste', tag: 'Plumbing', date: '12 Mar 2025',
        body: ['A dripping tap may seem, at first glance, like a minor inconvenience. However, this small problem can waste thousands of litres of water per year, leading to a significant increase in your water bill and, over time, structural damage to your worktop or cupboards.','Detecting and solving the problem early is the best way to save money and avoid costly repairs.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">4 warning signs of a leaking tap</h2>','Before attempting any repair, check whether the problem is actually a leak. Watch out for these signs:','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Constant dripping:</strong> the tap keeps dripping even after being firmly closed.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Moisture or limescale:</strong> persistent damp stains or limescale build-up at the base of the tap or inside the cupboard.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Strange noises:</strong> sounds of water running inside pipes or walls.</li><li><strong style="color:#1c1b17">Unexplained bill increase:</strong> if monthly water consumption has risen without an obvious reason, there may be a slow leak.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">The foolproof test: how to check the water meter</h2>','Want to be sure the leak is in your plumbing? Follow these simple steps:','<ol style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Turn off all water outlets:</strong> make sure all taps, washing machines and toilets are closed.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Watch the water meter:</strong> go to the meter and check if the pointer or numbers keep moving.</li><li><strong style="color:#1c1b17">Analyse the result:</strong> if the meter keeps registering consumption with everything closed, there is a water leak somewhere in your home\'s plumbing.</li></ol>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">When should you call a Speedfaz professional?</h2>','Although some leaks can be fixed by replacing a seal or the internal cartridge of the tap, the solution is not always straightforward. A DIY repair attempt without the right tools can further damage the plumbing or cause bigger breaks.','If the problem persists, if the tap is seized, or if you suspect leaks inside the wall, don\'t risk it.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Need professional help to fix a tap or water leak?</strong> At Speedfaz, our specialist technicians are ready to assess, repair and test the entire plumbing system on site, quickly and with a service guarantee.</p>'] },
      fr: { title: 'Comment détecter un robinet qui fuit', subtitle: 'Le guide pratique pour éviter le gaspillage', tag: 'Plomberie', date: '12 Mar 2025',
        body: ['Un robinet qui fuit peut sembler, à première vue, une simple gêne mineure. Pourtant, ce petit problème peut gaspiller des milliers de litres d\'eau par an, entraînant une augmentation significative de la facture d\'eau et, à long terme, des dommages structurels sur votre plan de travail ou vos armoires.','Détecter et résoudre le problème tôt est la meilleure façon d\'économiser de l\'argent et d\'éviter des réparations coûteuses.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">4 signes d\'alerte d\'un robinet qui fuit</h2>','Avant de tenter toute réparation, vérifiez si le problème est bien une fuite. Soyez attentif à ces signes :','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Gouttement continu :</strong> le robinet continue à goutter même après avoir été fermé fermement.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Humidité ou calcaire :</strong> taches persistantes ou dépôts de calcaire à la base du robinet ou à l\'intérieur du placard.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Bruits étranges :</strong> sons d\'eau qui coule dans les tuyaux ou les murs.</li><li><strong style="color:#1c1b17">Facture en hausse inexpliquée :</strong> si la consommation mensuelle d\'eau a augmenté sans raison apparente, il peut y avoir une fuite lente.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Le test infaillible : comment vérifier le compteur d\'eau</h2>','Vous voulez vous assurer que la fuite est dans votre plomberie ? Suivez ces étapes simples :','<ol style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Fermez toutes les sorties d\'eau :</strong> assurez-vous que tous les robinets, machines à laver et chasses d\'eau sont fermés.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Observez le compteur d\'eau :</strong> allez au compteur et vérifiez si l\'aiguille ou les chiffres continuent de bouger.</li><li><strong style="color:#1c1b17">Analysez le résultat :</strong> si le compteur continue d\'enregistrer une consommation avec tout fermé, il y a une fuite d\'eau quelque part dans la plomberie de votre logement.</li></ol>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Quand appeler un professionnel Speedfaz ?</h2>','Bien que certaines fuites puissent être réparées en remplaçant un joint ou la cartouche interne du robinet, la solution n\'est pas toujours simple. Une tentative de réparation DIY sans les bons outils peut endommager davantage la plomberie ou provoquer des ruptures plus importantes.','Si le problème persiste, si le robinet est bloqué ou si vous suspectez des fuites dans le mur, ne risquez rien.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Besoin d\'aide professionnelle pour réparer un robinet ou une fuite d\'eau ?</strong> Chez Speedfaz, nos techniciens spécialisés sont prêts à évaluer, réparer et tester l\'ensemble de la plomberie sur place, rapidement et avec garantie de service.</p>'] }
    },
    'desentupimento': {
      img: 'https://images.unsplash.com/photo-1526898943670-92bfa9f94c12?w=1200',
      pt: { title: 'Desentupimento de canalização', subtitle: 'Quando resolve sozinho e quando deve chamar um profissional', tag: 'Canalização', date: '04 Abr 2025',
        body: ['Um cano entupido é dos problemas domésticos mais comuns — e raramente escolhe a melhor altura para acontecer. A boa notícia é que muitos casos ligeiros resolvem-se em casa; os mais graves, esses, pedem ajuda profissional para não piorar.','Saber distinguir uns dos outros evita estragos, maus cheiros e despesas desnecessárias.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Soluções caseiras para entupimentos ligeiros</h2>','Se a água ainda escoa, mas devagar, experimente primeiro estas abordagens simples e seguras:','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Água quente:</strong> deite água bem quente (não a ferver, em canos de PVC) para dissolver gorduras e restos de sabão.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Desentupidor de borracha (ventosa):</strong> tape o ladrão, crie vácuo e faça pressão firme várias vezes seguidas.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Bicarbonato e vinagre:</strong> deixe atuar 15 a 20 minutos e termine com água quente.</li><li><strong style="color:#1c1b17">Limpe o sifão:</strong> muitas vezes a obstrução está ali — basta desenroscar e esvaziar.</li></ul>','Evite o uso excessivo de produtos químicos agressivos: a longo prazo corroem e danificam a canalização.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Sinais de que deve chamar um profissional</h2>','Procure ajuda especializada quando notar um destes sinais — indicam uma obstrução mais profunda:','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px">O entupimento volta sempre, mesmo depois de limpar.</li><li style="margin-bottom:10px">Mau cheiro persistente a sair dos ralos.</li><li style="margin-bottom:10px">Vários pontos da casa entopem ao mesmo tempo.</li><li>A água sobe noutro sítio (por exemplo, na banheira quando puxa o autoclismo).</li></ul>','Nestes casos, temos o equipamento adequado para localizar e remover a obstrução sem partir paredes — e identificamos a causa para que o problema não regresse.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Tem um cano entupido que não desaparece?</strong> Na Speedfaz desentupimos de forma rápida e limpa, com diagnóstico no local e garantia de serviço.</p>'] },
      en: { title: 'Drain unblocking', subtitle: 'When to fix it yourself and when to call a professional', tag: 'Plumbing', date: '04 Apr 2025',
        body: ['A blocked drain is one of the most common household problems — and it rarely happens at a convenient time. The good news is that many minor cases can be solved at home; more serious blockages need professional help to avoid making things worse.','Knowing how to tell the difference saves you from damage, bad smells and unnecessary expense.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Home solutions for minor blockages</h2>','If the water still drains but slowly, try these simple, safe approaches first:','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Hot water:</strong> pour very hot water (not boiling for PVC pipes) to dissolve grease and soap residue.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Rubber plunger:</strong> cover the overflow, create a vacuum and push firmly several times.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Bicarbonate and vinegar:</strong> leave for 15–20 minutes then flush with hot water.</li><li><strong style="color:#1c1b17">Clean the trap:</strong> the blockage is often there — just unscrew and empty it.</li></ul>','Avoid overusing harsh chemical products: over time they corrode and damage the pipes.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Signs you should call a professional</h2>','Seek specialist help when you notice any of these signs — they indicate a deeper blockage:','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px">The blockage keeps coming back even after cleaning.</li><li style="margin-bottom:10px">Persistent bad smell coming from the drains.</li><li style="margin-bottom:10px">Several points in the house block at the same time.</li><li>Water rises somewhere else (e.g. in the bath when you flush the toilet).</li></ul>','In these cases, we have the right equipment to locate and remove the blockage without breaking walls — and we identify the cause so the problem doesn\'t come back.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Got a blocked drain that won\'t clear?</strong> At Speedfaz we unblock quickly and cleanly, with an on-site diagnosis and service guarantee.</p>'] },
      fr: { title: 'Débouchage des canalisations', subtitle: 'Quand le faire soi-même et quand appeler un professionnel', tag: 'Plomberie', date: '04 Avr 2025',
        body: ['Une canalisation bouchée est l\'un des problèmes domestiques les plus fréquents — et il survient rarement au bon moment. La bonne nouvelle, c\'est que beaucoup de cas légers se règlent à la maison ; les plus graves nécessitent l\'aide d\'un professionnel pour ne pas aggraver les choses.','Savoir faire la différence évite les dégâts, les mauvaises odeurs et les dépenses inutiles.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Solutions maison pour les bouchons légers</h2>','Si l\'eau s\'écoule encore mais lentement, essayez d\'abord ces approches simples et sûres :','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Eau chaude :</strong> versez de l\'eau très chaude (pas bouillante pour les tuyaux en PVC) pour dissoudre les graisses et résidus de savon.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Ventouse en caoutchouc :</strong> couvrez le trop-plein, créez une dépression et appuyez fermement plusieurs fois.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Bicarbonate et vinaigre :</strong> laissez agir 15 à 20 minutes puis rincez à l\'eau chaude.</li><li><strong style="color:#1c1b17">Nettoyez le siphon :</strong> le bouchon est souvent là — il suffit de dévisser et de vider.</li></ul>','Évitez l\'utilisation excessive de produits chimiques agressifs : à long terme, ils corrodent et endommagent les canalisations.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Signes qu\'il faut appeler un professionnel</h2>','Cherchez l\'aide d\'un spécialiste lorsque vous constatez l\'un de ces signes — ils indiquent un bouchon plus profond :','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px">Le bouchon revient toujours, même après nettoyage.</li><li style="margin-bottom:10px">Mauvaise odeur persistante qui sort des évacuations.</li><li style="margin-bottom:10px">Plusieurs points de la maison se bouchent en même temps.</li><li>L\'eau remonte ailleurs (par exemple dans la baignoire quand vous tirez la chasse).</li></ul>','Dans ces cas, nous disposons de l\'équipement adéquat pour localiser et supprimer le bouchon sans casser les murs — et nous identifions la cause pour que le problème ne revienne pas.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Vous avez une canalisation bouchée qui ne se dégage pas ?</strong> Chez Speedfaz nous débouchons rapidement et proprement, avec diagnostic sur place et garantie de service.</p>'] }
    },
    'trocar-lampada': {
      img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1200',
      pt: { title: 'Trocar uma lâmpada em segurança', subtitle: 'O passo a passo e os erros a evitar', tag: 'Elétrica', date: '21 Abr 2025',
        body: ['Trocar uma lâmpada parece a tarefa mais simples do mundo — e na maioria das vezes é. Mas há cuidados de segurança e pormenores de escolha que fazem toda a diferença, sobretudo se a lâmpada antiga se partiu ou se o ponto de luz dá problemas.','Este guia rápido ajuda a fazê-lo bem e em segurança.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Passo a passo seguro</h2>','<ol style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Corte a energia:</strong> desligue o interruptor e, idealmente, o disjuntor correspondente no quadro elétrico.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Deixe arrefecer:</strong> as lâmpadas halogéneas e incandescentes ficam muito quentes — espere alguns minutos.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Retire com cuidado:</strong> segure pela base, nunca pelo vidro, e rode no sentido contrário aos ponteiros do relógio.</li><li><strong style="color:#1c1b17">Coloque a nova:</strong> enrosque sem forçar até sentir firmeza e volte a ligar a energia.</li></ol>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Como escolher a lâmpada certa</h2>','Antes de comprar, confirme três coisas para não se enganar:','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Casquilho:</strong> E27 (grande), E14 (pequeno), GU10… veja o encaixe do candeeiro.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Potência e luz:</strong> prefira LED — gasta muito menos e dura anos. Repare nos lúmens (brilho) e nos kelvin (luz quente ou fria).</li><li><strong style="color:#1c1b17">Potência máxima:</strong> respeite o limite indicado no candeeiro para não o danificar.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Quando não é só a lâmpada</h2>','Se a lâmpada nova não acende, pisca, ou o ponto de luz falha de forma intermitente, o problema pode estar no casquilho, no interruptor ou na própria instalação — e aí já não é seguro insistir.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">O ponto de luz continua a falhar?</strong> Na Speedfaz diagnosticamos e reparamos o ponto elétrico com segurança, com teste de funcionamento no fim.</p>'] },
      en: { title: 'How to change a bulb safely', subtitle: 'Step by step and mistakes to avoid', tag: 'Electrical', date: '21 Apr 2025',
        body: ['Changing a bulb seems like the simplest task in the world — and most of the time it is. But there are safety precautions and selection details that make all the difference, especially if the old bulb broke or the light point has problems.','This quick guide helps you do it safely and correctly.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Safe step by step</h2>','<ol style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Cut the power:</strong> turn off the switch and, ideally, the corresponding circuit breaker in the fuse box.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Let it cool:</strong> halogen and incandescent bulbs get very hot — wait a few minutes.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Remove carefully:</strong> hold by the base, never the glass, and turn anti-clockwise.</li><li><strong style="color:#1c1b17">Install the new one:</strong> screw in without forcing until firm, then restore power.</li></ol>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">How to choose the right bulb</h2>','Before buying, check three things to avoid mistakes:','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Cap type:</strong> E27 (large), E14 (small), GU10… check the fitting of the light.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Wattage and light:</strong> choose LED — uses far less energy and lasts years. Check lumens (brightness) and kelvins (warm or cool light).</li><li><strong style="color:#1c1b17">Maximum wattage:</strong> respect the limit shown on the fitting to avoid damage.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">When it\'s not just the bulb</h2>','If the new bulb doesn\'t light, flickers, or the light point fails intermittently, the problem may be in the fitting, the switch or the installation itself — and at that point it\'s not safe to keep trying.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">The light point keeps failing?</strong> At Speedfaz we diagnose and repair electrical points safely, with a function test at the end.</p>'] },
      fr: { title: 'Changer une ampoule en toute sécurité', subtitle: 'Le pas à pas et les erreurs à éviter', tag: 'Électrique', date: '21 Avr 2025',
        body: ['Changer une ampoule semble la tâche la plus simple du monde — et la plupart du temps, c\'est vrai. Mais il y a des précautions de sécurité et des détails de choix qui font toute la différence, surtout si l\'ancienne ampoule s\'est cassée ou si le point lumineux pose problème.','Ce guide rapide vous aide à le faire correctement et en toute sécurité.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Pas à pas en sécurité</h2>','<ol style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Coupez l\'électricité :</strong> éteignez l\'interrupteur et, idéalement, le disjoncteur correspondant dans le tableau électrique.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Laissez refroidir :</strong> les ampoules halogènes et à incandescence deviennent très chaudes — attendez quelques minutes.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Retirez avec précaution :</strong> tenez par la base, jamais par le verre, et tournez dans le sens antihoraire.</li><li><strong style="color:#1c1b17">Installez la nouvelle :</strong> vissez sans forcer jusqu\'à sentir la résistance, puis rétablissez le courant.</li></ol>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Comment choisir la bonne ampoule</h2>','Avant d\'acheter, vérifiez trois choses pour éviter les erreurs :','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Type de culot :</strong> E27 (grand), E14 (petit), GU10… vérifiez le raccord du luminaire.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Puissance et lumière :</strong> choisissez LED — consomme bien moins et dure des années. Regardez les lumens (luminosité) et les kelvins (lumière chaude ou froide).</li><li><strong style="color:#1c1b17">Puissance maximale :</strong> respectez la limite indiquée sur le luminaire pour ne pas l\'endommager.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Quand ce n\'est pas seulement l\'ampoule</h2>','Si la nouvelle ampoule ne s\'allume pas, clignote, ou si le point lumineux tombe en panne de façon intermittente, le problème peut venir du culot, de l\'interrupteur ou de l\'installation elle-même — et il n\'est plus sûr d\'insister.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Le point lumineux continue à tomber en panne ?</strong> Chez Speedfaz nous diagnostiquons et réparons les points électriques en toute sécurité, avec un test de fonctionnement à la fin.</p>'] }
    },
    'montagem-moveis': {
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
      pt: { title: 'Montagem de móveis', subtitle: 'Tudo o que precisa de saber antes de começar', tag: 'Móveis', date: '09 Mai 2025',
        body: ['Montar um móvel parece simples até abrirmos a caixa e encontrarmos dezenas de peças, parafusos de todos os tamanhos e um manual de instruções confuso. Com um pouco de método, evita erros, riscos e horas perdidas.','Reunimos os passos e cuidados que fazem a diferença entre um móvel bem montado e um que abana.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Prepare-se antes de montar</h2>','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Liberte o espaço:</strong> trabalhe numa área ampla e protegida, para não riscar o chão nem as peças.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Separe as ferragens:</strong> confira se vieram todos os parafusos e cavilhas antes de começar.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Leia o manual até ao fim:</strong> perceba a ordem das fases antes de apertar o primeiro parafuso.</li><li><strong style="color:#1c1b17">Tenha as ferramentas certas:</strong> uma aparafusadora poupa imenso tempo face à chave que vem na caixa.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Segurança: a fixação à parede</h2>','É o passo mais ignorado e o mais importante. Armários altos, estantes e cómodas devem ser fixados à parede para evitar quedas — um cuidado essencial sobretudo em casas com crianças. A maioria dos acidentes domésticos com móveis acontece por falta desta fixação simples.','Atenção também ao tipo de parede: gesso cartonado, tijolo e betão exigem buchas diferentes para a fixação aguentar.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Não quer chatices com a montagem?</strong> Na Speedfaz montamos qualquer móvel, de qualquer marca, com as nossas ferramentas, e fixamos à parede sempre que necessário — deixando tudo direito, seguro e limpo.</p>'] },
      en: { title: 'Furniture assembly', subtitle: 'Everything you need to know before you start', tag: 'Furniture', date: '09 May 2025',
        body: ['Assembling furniture seems simple until you open the box and find dozens of parts, screws of all sizes and a confusing instruction manual. With a bit of method, you avoid mistakes, risk and wasted hours.','We\'ve put together the steps and precautions that make the difference between a solid piece of furniture and one that wobbles.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Prepare before you build</h2>','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Clear the space:</strong> work in a large, protected area so you don\'t scratch the floor or the pieces.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Sort the hardware:</strong> check that all screws and dowels are present before you start.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Read the manual to the end:</strong> understand the sequence of steps before tightening the first screw.</li><li><strong style="color:#1c1b17">Use the right tools:</strong> a power screwdriver saves huge amounts of time compared to the key in the box.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Safety: fixing to the wall</h2>','This is the most overlooked and most important step. Tall wardrobes, shelves and chests of drawers must be wall-anchored to prevent tipping — an essential precaution, especially in homes with children. Most domestic accidents involving furniture happen due to lack of this simple fixing.','Also pay attention to the wall type: plasterboard, brick and concrete require different plugs for the fixing to hold.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Don\'t want the hassle of assembly?</strong> At Speedfaz we assemble any furniture, any brand, with our own tools, and anchor to the wall when needed — leaving everything straight, safe and clean.</p>'] },
      fr: { title: 'Montage de meubles', subtitle: 'Tout ce que vous devez savoir avant de commencer', tag: 'Meubles', date: '09 Mai 2025',
        body: ['Monter un meuble semble simple jusqu\'à ce qu\'on ouvre la boîte et qu\'on découvre des dizaines de pièces, des vis de toutes tailles et une notice d\'instructions confuse. Avec un peu de méthode, on évite les erreurs, les risques et les heures perdues.','Nous avons réuni les étapes et précautions qui font la différence entre un meuble bien assemblé et un qui branlera.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Préparez-vous avant de monter</h2>','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Libérez l\'espace :</strong> travaillez dans une zone large et protégée, pour ne pas rayer le sol ni les pièces.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Triez la quincaillerie :</strong> vérifiez que toutes les vis et chevilles sont présentes avant de commencer.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Lisez la notice jusqu\'au bout :</strong> comprenez l\'ordre des étapes avant de serrer la première vis.</li><li><strong style="color:#1c1b17">Ayez les bons outils :</strong> une visseuse électrique fait gagner un temps considérable par rapport à la clé fournie dans la boîte.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Sécurité : la fixation au mur</h2>','C\'est l\'étape la plus négligée et la plus importante. Les grandes armoires, étagères et commodes doivent être fixées au mur pour éviter les chutes — une précaution essentielle surtout dans les maisons avec des enfants. La plupart des accidents domestiques impliquant des meubles surviennent par manque de cette fixation simple.','Faites également attention au type de mur : placo, brique et béton nécessitent des chevilles différentes pour que la fixation tienne.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Vous ne voulez pas vous embêter avec le montage ?</strong> Chez Speedfaz nous assemblons tout meuble, de toute marque, avec nos propres outils, et fixons au mur si nécessaire — en laissant tout droit, sécurisé et propre.</p>'] }
    },
    'reparacoes-eletricas': {
      img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200',
      pt: { title: 'Reparações elétricas em casa', subtitle: 'Pequenos problemas, grandes riscos — saiba o que fazer', tag: 'Elétrica', date: '27 Mai 2025',
        body: ['Uma tomada que deixou de funcionar, um disjuntor que dispara de vez em quando, um interruptor solto. São problemas pequenos no dia a dia, mas que, mal resolvidos, podem tornar-se perigosos. Saber reconhecer os sinais e o que evitar é meio caminho andado.','Este guia ajuda-o a perceber quando é seguro esperar e quando deve agir já.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Sinais de alarme que não deve ignorar</h2>','Se notar qualquer um destes sinais, desligue a energia do circuito afetado no quadro e não use essa tomada ou ponto:','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Cheiro a queimado</strong> junto a tomadas, interruptores ou ao quadro elétrico.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Tomadas mornas</strong> ou descoloradas ao toque.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Faíscas</strong> ao ligar ou desligar um aparelho.</li><li><strong style="color:#1c1b17">Disjuntores que disparam</strong> repetidamente sem razão aparente.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Porque não vale a pena improvisar</h2>','Eletricidade não é área para tentativa e erro. Uma ligação mal feita pode causar um curto-circuito, danificar os seus aparelhos ou até provocar um incêndio. A regra de ouro é simples: na dúvida, corte a energia e chame quem percebe.','Trabalhos elétricos devem ficar sempre testados e em conformidade — é isso que garante a sua segurança e a da sua família.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Tem um problema elétrico em casa?</strong> Na Speedfaz fazemos o diagnóstico, substituímos tomadas e interruptores e reparamos pontos de luz, sempre com teste de segurança no final.</p>'] },
      en: { title: 'Electrical repairs at home', subtitle: 'Small problems, big risks — know what to do', tag: 'Electrical', date: '27 May 2025',
        body: ['A socket that stopped working, a circuit breaker that trips occasionally, a loose switch. These are small day-to-day problems but, badly handled, they can become dangerous. Knowing how to recognise the signs and what to avoid is half the battle.','This guide helps you understand when it\'s safe to wait and when you need to act now.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Warning signs you should not ignore</h2>','If you notice any of these signs, turn off power to the affected circuit at the fuse box and don\'t use that socket or point:','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Burning smell</strong> near sockets, switches or the fuse box.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Warm sockets</strong> or discolouration to the touch.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Sparks</strong> when plugging or unplugging an appliance.</li><li><strong style="color:#1c1b17">Circuit breakers that trip</strong> repeatedly for no apparent reason.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Why improvising is never worth it</h2>','Electricity is no place for trial and error. A bad connection can cause a short circuit, damage your appliances or even start a fire. The golden rule is simple: when in doubt, cut the power and call someone who knows.','Electrical work must always be tested and compliant — that\'s what keeps you and your family safe.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Got an electrical problem at home?</strong> At Speedfaz we diagnose, replace sockets and switches, and repair light points — always with a safety test at the end.</p>'] },
      fr: { title: 'Réparations électriques à la maison', subtitle: 'Petits problèmes, grands risques — sachez quoi faire', tag: 'Électrique', date: '27 Mai 2025',
        body: ['Une prise qui ne fonctionne plus, un disjoncteur qui saute de temps en temps, un interrupteur desserré. Ce sont de petits problèmes du quotidien, mais mal résolus, ils peuvent devenir dangereux. Savoir reconnaître les signes et ce qu\'il faut éviter est déjà la moitié du chemin.','Ce guide vous aide à comprendre quand il est sûr d\'attendre et quand vous devez agir immédiatement.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Signaux d\'alarme à ne pas ignorer</h2>','Si vous constatez l\'un de ces signes, coupez l\'alimentation du circuit concerné au tableau et n\'utilisez pas cette prise ou ce point :','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Odeur de brûlé</strong> près des prises, interrupteurs ou du tableau électrique.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Prises chaudes</strong> ou décolorées au toucher.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Étincelles</strong> lors du branchement ou débranchement d\'un appareil.</li><li><strong style="color:#1c1b17">Disjoncteurs qui sautent</strong> répétitivement sans raison apparente.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Pourquoi improviser ne vaut jamais la peine</h2>','L\'électricité ne souffre pas les essais et les erreurs. Une mauvaise connexion peut provoquer un court-circuit, endommager vos appareils ou même déclencher un incendie. La règle d\'or est simple : en cas de doute, coupez le courant et appelez quelqu\'un qui s\'y connaît.','Les travaux électriques doivent toujours être testés et conformes — c\'est ce qui garantit votre sécurité et celle de votre famille.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Vous avez un problème électrique à la maison ?</strong> Chez Speedfaz nous diagnostiquons, remplaçons prises et interrupteurs, et réparons les points lumineux — toujours avec un test de sécurité à la fin.</p>'] }
    },
    'manutencao-preventiva': {
      img: 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=1200',
      pt: { title: 'Manutenção preventiva', subtitle: 'Pequenos cuidados que poupam muito dinheiro', tag: 'Dicas', date: '14 Jun 2025',
        body: ['A reparação mais barata é a que nunca chega a acontecer. A manutenção preventiva consiste em detetar e resolver pequenos problemas antes de se tornarem caros — e poupa muito mais do que custa.','Não precisa de ser técnico: alguns hábitos simples bastam para evitar a maioria das surpresas desagradáveis em casa.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">A ronda que deve fazer a cada poucos meses</h2>','Reserve dez minutos e verifique:','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Debaixo dos lava-loiças:</strong> procure humidade ou pingos — sinais de fugas a começar.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Sifões e ralos:</strong> limpe para evitar maus cheiros e entupimentos.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Quadro elétrico:</strong> teste os disjuntores e veja se algum aquece.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Portas e janelas:</strong> lubrifique dobradiças e confirme os vedantes.</li><li><strong style="color:#1c1b17">Eletrodomésticos:</strong> limpe filtros e borrachas das máquinas.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Atenda aos primeiros avisos</h2>','Uma mancha de humidade na parede, uma porta que começa a ranger, uma torneira mais dura ou um disjuntor que dispara de vez em quando são avisos. Atendê-los cedo custa uma fração do que custa resolver o estrago depois de instalado.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Quer prevenir em vez de remediar?</strong> A Speedfaz faz visitas de manutenção geral, com inspeção, pequenos ajustes incluídos e um relatório do que convém vigiar.</p>'] },
      en: { title: 'Preventive maintenance', subtitle: 'Small habits that save a lot of money', tag: 'Tips', date: '14 Jun 2025',
        body: ['The cheapest repair is the one that never happens. Preventive maintenance means detecting and fixing small problems before they become costly — and saves far more than it costs.','You don\'t need to be a technician: a few simple habits are enough to avoid most unpleasant surprises at home.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">The check you should do every few months</h2>','Set aside ten minutes and inspect:','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Under the sinks:</strong> look for moisture or drips — signs of a leak starting.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Traps and drains:</strong> clean them to prevent bad smells and blockages.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Fuse box:</strong> test the circuit breakers and check if any feel warm.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Doors and windows:</strong> lubricate hinges and check the seals.</li><li><strong style="color:#1c1b17">Appliances:</strong> clean filters and door seals on washing machines.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Act on early warnings</h2>','A damp patch on the wall, a door that starts creaking, a stiff tap or a circuit breaker that trips occasionally are all warnings. Dealing with them early costs a fraction of what it costs to fix the damage once it\'s established.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Want to prevent rather than repair?</strong> Speedfaz does general maintenance visits, with an inspection, minor adjustments included and a report on what to keep an eye on.</p>'] },
      fr: { title: 'Maintenance préventive', subtitle: 'De petites habitudes qui font économiser beaucoup', tag: 'Conseils', date: '14 Juin 2025',
        body: ['La réparation la moins chère est celle qui n\'arrive jamais. La maintenance préventive consiste à détecter et résoudre les petits problèmes avant qu\'ils ne deviennent coûteux — et elle fait économiser bien plus qu\'elle ne coûte.','Vous n\'avez pas besoin d\'être technicien : quelques habitudes simples suffisent pour éviter la plupart des mauvaises surprises à la maison.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">La ronde à faire tous les quelques mois</h2>','Réservez dix minutes et vérifiez :','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Sous les éviers :</strong> cherchez de l\'humidité ou des gouttes — signes d\'une fuite qui commence.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Siphons et évacuations :</strong> nettoyez-les pour éviter les mauvaises odeurs et les bouchons.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Tableau électrique :</strong> testez les disjoncteurs et vérifiez si l\'un d\'eux chauffe.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Portes et fenêtres :</strong> lubrifiez les charnières et vérifiez les joints.</li><li><strong style="color:#1c1b17">Électroménagers :</strong> nettoyez les filtres et les joints de hublot des machines à laver.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Réagissez aux premiers avertissements</h2>','Une tache d\'humidité sur le mur, une porte qui commence à grincer, un robinet plus dur ou un disjoncteur qui saute de temps en temps sont des avertissements. Les traiter tôt coûte une fraction de ce que coûte la réparation des dégâts une fois installés.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Vous voulez prévenir plutôt que guérir ?</strong> Speedfaz effectue des visites de maintenance générale, avec inspection, petits ajustements inclus et un rapport sur ce qu\'il convient de surveiller.</p>'] }
    },
    'portas-janelas': {
      img: 'assets/img/portas.jpg',
      pt: { title: 'Portas e janelas com problemas?', subtitle: 'Soluções rápidas que devolvem conforto e poupam energia', tag: 'Reparações', date: '02 Jul 2025',
        body: ['Uma porta que não fecha bem, uma janela por onde entra ar, uma fechadura emperrada. São incómodos do dia a dia que tiram conforto e, muitas vezes, fazem subir a conta da energia sem darmos por isso.','A boa notícia: a maioria resolve-se com um ajuste simples e barato, desde que feito a tempo.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Problemas comuns e a sua causa</h2>','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">A porta não fecha ou arrasta:</strong> normalmente são dobradiças desalinhadas ou parafusos soltos.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Entra ar ou ruído:</strong> os vedantes estão gastos e deixaram de isolar.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Fechadura dura ou emperrada:</strong> falta de lubrificação ou um canhão a precisar de substituição.</li><li><strong style="color:#1c1b17">Janela que não veda:</strong> borrachas ressequidas ou ferragem desregulada.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Porque vale a pena resolver cedo</h2>','Um vedante em mau estado deixa entrar frio no inverno e calor no verão — e isso nota-se na fatura. Uma porta que arrasta acaba por danificar as dobradiças e o aro. Atuar cedo é sempre mais barato do que substituir a peça inteira mais tarde.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">As suas portas ou janelas precisam de atenção?</strong> A Speedfaz ajusta portas e janelas, repara fechaduras e dobradiças e troca vedantes — com lubrificação e teste final, para tudo abrir e fechar como deve ser.</p>'] },
      en: { title: 'Problems with doors and windows?', subtitle: 'Quick fixes that restore comfort and save energy', tag: 'Repairs', date: '02 Jul 2025',
        body: ['A door that doesn\'t close properly, a window letting in a draught, a stiff lock. These are everyday nuisances that reduce comfort and, more often than people realise, push up the energy bill.','The good news: most of these can be sorted with a simple, inexpensive adjustment — as long as it\'s done in time.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Common problems and their causes</h2>','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Door that won\'t close or drags:</strong> usually misaligned hinges or loose screws.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Draughts or noise:</strong> worn seals that no longer insulate.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Stiff or jammed lock:</strong> lack of lubrication or a cylinder that needs replacing.</li><li><strong style="color:#1c1b17">Window that doesn\'t seal:</strong> dried-out rubbers or misadjusted hardware.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Why it pays to fix early</h2>','A worn seal lets cold in during winter and heat in during summer — and that shows up on the energy bill. A dragging door will eventually damage the hinges and frame. Acting early is always cheaper than replacing the whole part later.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Do your doors or windows need attention?</strong> Speedfaz adjusts doors and windows, repairs locks and hinges and replaces seals — with lubrication and a final test, so everything opens and closes as it should.</p>'] },
      fr: { title: 'Problèmes de portes et fenêtres ?', subtitle: 'Solutions rapides qui restaurent le confort et économisent de l\'énergie', tag: 'Réparations', date: '02 Juil 2025',
        body: ['Une porte qui ne ferme pas bien, une fenêtre par laquelle l\'air s\'infiltre, une serrure qui bloque. Ce sont des désagréments du quotidien qui réduisent le confort et, souvent, font grimper la facture d\'énergie sans qu\'on s\'en rende compte.','La bonne nouvelle : la plupart se résolvent avec un simple ajustement peu coûteux — à condition d\'agir à temps.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Problèmes courants et leurs causes</h2>','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">La porte ne ferme pas ou racle :</strong> généralement des charnières mal alignées ou des vis desserrées.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Courants d\'air ou bruit :</strong> les joints sont usés et n\'isolent plus.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Serrure dure ou bloquée :</strong> manque de lubrification ou un cylindre à remplacer.</li><li><strong style="color:#1c1b17">Fenêtre qui ne ferme pas hermétiquement :</strong> caoutchoucs desséchés ou ferrure désréglée.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Pourquoi il vaut la peine d\'agir tôt</h2>','Un joint usé laisse entrer le froid en hiver et la chaleur en été — et ça se voit sur la facture d\'énergie. Une porte qui racle finira par endommager les charnières et le cadre. Agir tôt est toujours moins cher que de remplacer la pièce entière plus tard.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Vos portes ou fenêtres ont besoin d\'attention ?</strong> Speedfaz ajuste portes et fenêtres, répare serrures et charnières, et remplace les joints — avec lubrification et test final, pour que tout ouvre et ferme comme il se doit.</p>'] }
    },
    'serralharia-residencial': {
      img: 'https://images.unsplash.com/photo-1608126841512-ed53266c1d62?w=1200',
      pt: { title: 'Serralharia residencial', subtitle: 'Quando e porquê chamar um especialista', tag: 'Serralharia', date: '18 Jul 2025',
        body: ['Portões, gradeamentos, varandas, escadas e outras estruturas metálicas dão segurança e valor à casa — mas precisam de cuidados específicos e de quem saiba trabalhar o metal em condições. Ao contrário de outras reparações, aqui o improviso sai caro e perigoso.','Saber reconhecer os sinais de alerta ajuda a intervir antes de o problema agravar.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Sinais de que a estrutura precisa de intervenção</h2>','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Ferrugem:</strong> a corrosão enfraquece o metal e alastra se não for tratada.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Soldas partidas ou fissuras:</strong> comprometem a resistência de toda a estrutura.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Portões que arrastam ou descaíram:</strong> sinal de dobradiças ou apoios desgastados.</li><li><strong style="color:#1c1b17">Fechos que já não trancam:</strong> uma falha de segurança a resolver depressa.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Porque é trabalho para um especialista</h2>','Soldadura, reforço e fixação de estruturas metálicas exigem ferramenta própria, técnica e experiência. Um trabalho mal feito não só dura pouco como pode pôr em causa a segurança — pense num portão pesado ou num gradeamento de uma varanda.','Um bom acabamento (lixar, tratar e pintar) é o que protege o metal da ferrugem e prolonga a vida da peça.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Tem uma estrutura metálica a precisar de reparação?</strong> A Speedfaz avalia, repara ou reforça o metal e dá o acabamento — para ficar resistente, seguro e com bom aspeto.</p>'] },
      en: { title: 'Residential metalwork', subtitle: 'When and why to call a specialist', tag: 'Metalwork', date: '18 Jul 2025',
        body: ['Gates, railings, balconies, stairs and other metal structures add safety and value to the home — but they need specific care and someone who knows how to work metal properly. Unlike other repairs, improvising here is expensive and dangerous.','Knowing how to spot the warning signs helps you intervene before the problem gets worse.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Signs the structure needs attention</h2>','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Rust:</strong> corrosion weakens the metal and spreads if left untreated.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Broken welds or cracks:</strong> these compromise the strength of the entire structure.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Gates that drag or have dropped:</strong> a sign of worn hinges or supports.</li><li><strong style="color:#1c1b17">Latches that no longer lock:</strong> a security failure that needs to be resolved quickly.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Why this is a job for a specialist</h2>','Welding, reinforcing and fixing metal structures require specialist tools, technique and experience. A poorly done job not only fails quickly but can compromise safety — think of a heavy gate or balcony railing.','A good finish (sanding, treating and painting) is what protects the metal from rust and extends the life of the piece.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Got a metal structure that needs repair?</strong> Speedfaz assesses, repairs or reinforces the metal and applies the finish — so it stays strong, safe and looking good.</p>'] },
      fr: { title: 'Serrurerie résidentielle', subtitle: 'Quand et pourquoi faire appel à un spécialiste', tag: 'Serrurerie', date: '18 Juil 2025',
        body: ['Portails, grilles, balcons, escaliers et autres structures métalliques apportent sécurité et valeur à la maison — mais ils nécessitent des soins spécifiques et quelqu\'un qui sait travailler le métal correctement. Contrairement à d\'autres réparations, improviser ici est coûteux et dangereux.','Savoir reconnaître les signes d\'alerte aide à intervenir avant que le problème ne s\'aggrave.','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Signes que la structure nécessite une intervention</h2>','<ul style="font-size:17px;color:#3d3c39;line-height:1.6;margin:0 0 18px;padding-left:22px"><li style="margin-bottom:10px"><strong style="color:#1c1b17">Rouille :</strong> la corrosion affaiblit le métal et se propage si elle n\'est pas traitée.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Soudures rompues ou fissures :</strong> elles compromettent la résistance de toute la structure.</li><li style="margin-bottom:10px"><strong style="color:#1c1b17">Portails qui raclent ou ont décroché :</strong> signe de charnières ou supports usés.</li><li><strong style="color:#1c1b17">Loquets qui ne ferment plus :</strong> une faille de sécurité à résoudre rapidement.</li></ul>','<h2 style="font-weight:800;font-size:clamp(21px,3vw,28px);letter-spacing:-.3px;margin:34px 0 12px">Pourquoi c\'est un travail pour un spécialiste</h2>','La soudure, le renforcement et la fixation de structures métalliques nécessitent des outils spécialisés, de la technique et de l\'expérience. Un travail mal fait ne dure pas seulement peu, mais peut compromettre la sécurité — pensez à un portail lourd ou à la grille d\'un balcon.','Une bonne finition (ponçage, traitement et peinture) est ce qui protège le métal de la rouille et prolonge la durée de vie de la pièce.','<p style="font-size:17px;color:#3d3c39;margin:32px 0 18px"><strong style="color:#f08143">Vous avez une structure métallique qui nécessite une réparation ?</strong> Speedfaz évalue, répare ou renforce le métal et applique la finition — pour qu\'elle reste résistante, sûre et esthétique.</p>'] }
    }
  };

  /* ============================================================
     ███  FIM DA ÁREA EDITÁVEL  ███
     ============================================================ */

  /* ---------- Língua / i18n ---------- */
  var LANG = 'pt';
  try { LANG = localStorage.getItem('sf_lang') || 'pt'; } catch(e) {}
  if (['pt','en','fr'].indexOf(LANG) === -1) LANG = 'pt';

  var T = {
    en: {
      nav_inicio:'Home', nav_servicos:'Services', nav_sobre:'About', nav_blog:'Blog', nav_contacto:'Contact',
      nav_como:'How it works', nav_os_servicos:'Our services', nav_porque:'Why Speedfaz', nav_depoimentos:'Testimonials',
      nav_missao:'Mission', nav_visao:'Vision', nav_valores:'Values', nav_porque_escolher:'Why choose us',
      nav_telefones:'Phone numbers', nav_morada:'Address', nav_email:'Email', nav_mapa:'Map',
      btn_orcamento:'Request quote',
      badge:'South Bank — quick response',
      hero_h1:'Fast & personal<br>repairs',
      hero_p:'Talk directly to whoever solves your problem at home. No apps. No middlemen.',
      btn_wa:'Get a WhatsApp quote',
      ver_servicos:'View services →',
      feat_1:'✓ Fixed quote', feat_2:'✓ No surprises', feat_3:'✓ Any brand',
      agende_title:'Schedule your visit now',
      agende_desc:'Includes travel and diagnosis. See how it works and the conditions →',
      como_eyebrow:'How it works',
      como_h2:'Three steps. Zero hassle.',
      passo1_h:'Send a WhatsApp message', passo1_p:'Tell us the problem — a photo helps. We reply fast.',
      passo2_h:'Get a fixed, transparent quote', passo2_p:'You know the price before we start. No surprises, no fine print.',
      passo3_h:'The technician fixes your problem', passo3_p:'We schedule, show up on time, and leave everything working.',
      svc_eyebrow:'Services',
      svc_h2:'What we fix for you',
      ver_todos:'View all services →',
      porque_eyebrow:'Why Speedfaz',
      porque_h2:'No apps. No fine print.',
      porque_1_h:'Direct personal service', porque_1_p:'No apps, no call centres. You always talk to whoever will solve your problem.',
      porque_2_h:'Fixed & transparent prices', porque_2_p:'Clear quote before we start. What we agree is what you pay.',
      porque_3_h:'Any brand or product', porque_3_p:"We're not tied to a store. We work with whatever you already have.",
      dep_eyebrow:'Testimonials',
      dep_h2:'What our clients say',
      dep_p:'Stories from those who trusted us. Swipe to see more.',
      cta_h2:'Have a problem at home? Fix it now.',
      cta_p:'Send us a message. We reply fast and give you the price straight away.',
      btn_wa_falar:'Chat on WhatsApp',
      svc_page_h1:'Residential and commercial repairs',
      svc_page_p:'Choose a service to see details, what\'s included and the price — and add to cart.',
      footer_desc:'Fast and trusted residential and commercial repairs in the South Bank.',
      footer_contacto:'Contact', footer_nav:'Navigation', footer_onde:'Where we are',
      footer_direitos:'All rights reserved.',
      cart_h1:'Your cart',
      cart_p:'Review the chosen services and request everything at once on WhatsApp.',
      cart_relacionados:'Related products',
      cart_total:'Estimated total value',
      ver_detalhe:'see detail',
      pedir_wa:'Order on WhatsApp',
      cart_nota:'Estimated value — final price may vary after on-site assessment.',
      cart_vazio_h:'Your cart is empty',
      cart_vazio_p:'Choose the services you need and add them here.',
      ver_servicos_btn:'View services',
      cart_toca:'Tap for details',
      modal_nota:'Visit fee — travel and diagnosis, deducted from the total if the service is performed on the spot.',
      modal_incluido:'What is included',
      modal_add:'+ Add to cart', modal_rem:'Remove from cart',
      sobre_service_btn:'About this service →',
      total_h:'Estimated value',
      total_nota:'The final price may vary after on-site assessment.',
      iva_label:'VAT included (23%)',
      total_label:'Estimated total',
      deixe_dep:'Leave your testimonial',
      dep_form_p:'Share your experience. On submit, opens WhatsApp with the message ready.',
      dep_nome:'Your name', dep_class:'Rating', dep_texto:'Your testimonial',
      dep_send:'Send on WhatsApp',
      dep_placeholder_nome:'E.g.: Ana Sofia',
      dep_placeholder_texto:'Tell us how the service went…',
      dep_tua_opiniao:'"Your opinion could be next. After the service, share your experience."',
      dep_btn_deixa:'Leave your testimonial',
      blog_voltar:'← Back to blog',
      precisa_ajuda:'Need help with this?',
      precisa_ajuda_p:'Talk to us and we\'ll sort it fast, without complications.',
      btn_orcamento_lg:'Get a quote',
      art_nao_h:'Article not found',
      art_nao_p:'The article you\'re looking for doesn\'t exist or has been moved.',
      art_voltar_btn:'← Back to blog',
      sobre_p:'We are a residential repair company focused on speed, trust and direct personal service. At Speedfaz, you don\'t talk to machines or apps — you talk to real people who understand your problem and solve it on the spot.',
      porque_escolher_p:'We\'re not an app where you talk to machines. We\'re not tied to a specific brand — we work with any product you have. Negotiate the price, meet whoever does the work. Fast, honest repairs, no surprises.',
      svc_lampadas:'Light bulbs & sockets', svc_torneiras:'Taps & plumbing', svc_moveis:'Furniture assembly',
      svc_eletro:'Appliance installation', svc_portas:'Doors & windows', svc_serralharia:'Metalwork', svc_manutencao:'Preventive maintenance',
      svc_lampadas_p:'Replacement, installation and repair of light points and electrical sockets.',
      svc_torneiras_p:'Installation and repair of taps, drain unblocking and general plumbing.',
      svc_moveis_p:'Assembly of any furniture, any brand. We bring all the tools.',
      svc_eletro_p:'Installation of washing machines, fridges, cookers and more.',
      svc_portas_p:'Repair of locks, hinges, seals and adjustment of doors and windows.',
      svc_serralharia_p:'Repairs and installation of residential metal structures.',
      svc_manutencao_p:'General maintenance visit to prevent future problems.',
      ver_detalhes:'See details →',
      svc_eyebrow_svc:'Services', agende_svc_title:'Schedule your visit', agende_svc_desc:'Includes travel and diagnosis. See how it works →'
    },
    fr: {
      nav_inicio:'Accueil', nav_servicos:'Services', nav_sobre:'À propos', nav_blog:'Blog', nav_contacto:'Contact',
      nav_como:'Comment ça marche', nav_os_servicos:'Nos services', nav_porque:'Pourquoi Speedfaz', nav_depoimentos:'Témoignages',
      nav_missao:'Mission', nav_visao:'Vision', nav_valores:'Valeurs', nav_porque_escolher:'Pourquoi nous choisir',
      nav_telefones:'Téléphones', nav_morada:'Adresse', nav_email:'Email', nav_mapa:'Carte',
      btn_orcamento:'Demander un devis',
      badge:'Rive Sud — réponse rapide',
      hero_h1:'Réparations rapides<br>et personnalisées',
      hero_p:'Parlez directement à celui qui résout votre problème. Sans applis. Sans intermédiaires.',
      btn_wa:'Obtenir un devis sur WhatsApp',
      ver_servicos:'Voir les services →',
      feat_1:'✓ Devis fixe', feat_2:'✓ Sans surprises', feat_3:'✓ Toutes marques',
      agende_title:'Planifiez votre visite',
      agende_desc:'Inclut le déplacement et le diagnostic. Voir comment ça marche →',
      como_eyebrow:'Comment ça marche',
      como_h2:'Trois étapes. Zéro complication.',
      passo1_h:'Envoyez un message WhatsApp', passo1_p:'Décrivez le problème — une photo aide. Nous répondons vite.',
      passo2_h:'Recevez un devis fixe et transparent', passo2_p:'Vous connaissez le prix avant de commencer. Sans surprises, sans petits caractères.',
      passo3_h:'Le technicien résout votre problème', passo3_p:"Nous planifions, arrivons à l'heure et laissons tout fonctionner.",
      svc_eyebrow:'Services',
      svc_h2:'Ce que nous réparons pour vous',
      ver_todos:'Voir tous les services →',
      porque_eyebrow:'Pourquoi Speedfaz',
      porque_h2:'Sans applis. Sans petits caractères.',
      porque_1_h:'Service personnel direct', porque_1_p:"Sans applis, sans centres d'appel. Vous parlez toujours à celui qui va résoudre.",
      porque_2_h:'Prix fixes et transparents', porque_2_p:'Devis clair avant de commencer. Ce que nous convenons, c\'est ce que vous payez.',
      porque_3_h:'Toutes marques ou produits', porque_3_p:'Nous ne sommes pas liés à un magasin. Nous travaillons avec ce que vous avez déjà.',
      dep_eyebrow:'Témoignages',
      dep_h2:'Ce que disent nos clients',
      dep_p:'Histoires de ceux qui nous ont fait confiance. Faites glisser pour en voir plus.',
      cta_h2:'Un problème chez vous ? Résolvez-le maintenant.',
      cta_p:'Envoyez-nous un message. Nous répondons vite et vous donnons le prix tout de suite.',
      btn_wa_falar:'Parler sur WhatsApp',
      svc_page_h1:'Réparations résidentielles et commerciales',
      svc_page_p:"Choisissez un service pour voir les détails, ce qui est inclus et le prix — et ajoutez au panier.",
      footer_desc:'Réparations résidentielles et commerciales, rapides et fiables sur la Rive Sud.',
      footer_contacto:'Contact', footer_nav:'Navigation', footer_onde:'Où nous sommes',
      footer_direitos:'Tous droits réservés.',
      cart_h1:'Votre panier',
      cart_p:'Vérifiez les services choisis et commandez tout à la fois sur WhatsApp.',
      cart_relacionados:'Produits associés',
      cart_total:'Valeur totale estimée',
      ver_detalhe:'voir le détail',
      pedir_wa:'Commander sur WhatsApp',
      cart_nota:'Valeur estimée — le prix final peut varier après évaluation sur place.',
      cart_vazio_h:'Votre panier est vide',
      cart_vazio_p:"Choisissez les services dont vous avez besoin et ajoutez-les ici.",
      ver_servicos_btn:'Voir les services',
      cart_toca:'Touchez pour les détails',
      modal_nota:"Frais de visite — déplacement et diagnostic, déduit du total si le service est effectué sur place.",
      modal_incluido:'Ce qui est inclus',
      modal_add:'+ Ajouter au panier', modal_rem:'Retirer du panier',
      sobre_service_btn:'À propos de ce service →',
      total_h:'Valeur estimée',
      total_nota:'Le prix final peut varier après évaluation sur place.',
      iva_label:'TVA incluse (23%)',
      total_label:'Total estimé',
      deixe_dep:'Laisser votre témoignage',
      dep_form_p:'Partagez votre expérience. En envoyant, ouvre WhatsApp avec le message prêt.',
      dep_nome:'Votre nom', dep_class:'Note', dep_texto:'Votre témoignage',
      dep_send:'Envoyer sur WhatsApp',
      dep_placeholder_nome:'Ex. : Ana Sofia',
      dep_placeholder_texto:'Dites comment s\'est passé le service…',
      dep_tua_opiniao:'"Votre avis pourrait être le prochain. Après le service, partagez votre expérience."',
      dep_btn_deixa:'Laisser votre témoignage',
      blog_voltar:'← Retour au blog',
      precisa_ajuda:"Besoin d'aide avec ça ?",
      precisa_ajuda_p:'Parlez-nous et nous réglons ça vite, sans complications.',
      btn_orcamento_lg:'Obtenir un devis',
      art_nao_h:'Article introuvable',
      art_nao_p:"L'article que vous cherchez n'existe pas ou a été déplacé.",
      art_voltar_btn:'← Retour au blog',
      sobre_p:"Nous sommes une entreprise de réparations résidentielles axée sur la rapidité, la confiance et le service personnel direct. Chez Speedfaz, vous ne parlez pas à des machines ou des applis — vous parlez à de vraies personnes qui comprennent votre problème et le résolvent sur place.",
      porque_escolher_p:"Nous ne sommes pas une appli où vous parlez à des machines. Nous ne sommes pas liés à une marque spécifique — nous travaillons avec n'importe quel produit que vous avez. Négociez le prix, rencontrez celui qui fait le travail. Réparations rapides, honnêtes, sans surprises.",
      svc_lampadas:'Ampoules et prises', svc_torneiras:'Robinets et plomberie', svc_moveis:'Montage de meubles',
      svc_eletro:"Installation d'électroménagers", svc_portas:'Portes et fenêtres', svc_serralharia:'Serrurerie', svc_manutencao:'Maintenance préventive',
      svc_lampadas_p:'Remplacement, installation et réparation de points lumineux et prises électriques.',
      svc_torneiras_p:'Installation et réparation de robinets, débouchage et plomberie générale.',
      svc_moveis_p:'Montage de tout meuble, de toute marque. Nous apportons les outils.',
      svc_eletro_p:"Installation de machines à laver, réfrigérateurs, cuisinières et plus.",
      svc_portas_p:'Réparation de serrures, charnières, joints et ajustement des portes et fenêtres.',
      svc_serralharia_p:'Réparations et installation de structures métalliques résidentielles.',
      svc_manutencao_p:'Visite de maintenance générale pour éviter les problèmes futurs.',
      ver_detalhes:'Voir les détails →',
      svc_eyebrow_svc:'Services', agende_svc_title:'Planifiez votre visite', agende_svc_desc:'Inclut le déplacement et le diagnostic. Voir comment ça marche →'
    }
  };

  function t(key, ptDefault) {
    if (LANG === 'pt') return ptDefault;
    var trans = T[LANG];
    return (trans && trans[key] !== undefined) ? trans[key] : ptDefault;
  }

  function setLang(lang) {
    if (['pt','en','fr'].indexOf(lang) === -1) return;
    LANG = lang;
    try { localStorage.setItem('sf_lang', lang); } catch(e) {}
    injectChrome();
    updateBadges();
    translatePage();
    renderTestimonials();
    renderCartPage();
    renderArticle();
  }

  function translatePage() {
    var trans = LANG === 'pt' ? null : T[LANG];
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (!el.hasAttribute('data-pt')) el.setAttribute('data-pt', el.textContent);
      el.textContent = (trans && trans[key] !== undefined) ? trans[key] : (el.getAttribute('data-pt') || '');
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-html');
      if (!el.hasAttribute('data-pt-html')) el.setAttribute('data-pt-html', el.innerHTML);
      el.innerHTML = (trans && trans[key] !== undefined) ? trans[key] : (el.getAttribute('data-pt-html') || '');
    });
  }

  /* ---------- Navegação (traduzida) ---------- */
  function getNav() {
    return [
      { label: t('nav_inicio','Início'), href: 'index.html', key: 'home', menu: [
        { l: t('nav_como','Como funciona'), h: 'index.html#como-funciona' },
        { l: t('nav_os_servicos','Os nossos serviços'), h: 'index.html#servicos' },
        { l: t('nav_porque','Porquê a Speedfaz'), h: 'index.html#porque' },
        { l: t('nav_depoimentos','Depoimentos'), h: 'index.html#depoimentos' }
      ] },
      { label: t('nav_servicos','Serviços'), href: 'servicos.html', key: 'servicos',
        menu: CATALOG.map(function(s) { return { l: t('svc_'+s.id, s.name), h: 'servicos.html#svc-'+s.id }; }) },
      { label: t('nav_sobre','Sobre'), href: 'sobre.html', key: 'sobre', menu: [
        { l: t('nav_missao','Missão'), h: 'sobre.html#missao' },
        { l: t('nav_visao','Visão'), h: 'sobre.html#visao' },
        { l: t('nav_valores','Valores'), h: 'sobre.html#valores' },
        { l: t('nav_porque_escolher','Porquê escolher'), h: 'sobre.html#porque-escolher' }
      ] },
      { label: t('nav_blog','Blog'), href: 'blog.html', key: 'blog', menu: null },
      { label: t('nav_contacto','Contacto'), href: 'contacto.html', key: 'contacto', menu: [
        { l: t('nav_telefones','Telefones'), h: 'contacto.html#telefones' },
        { l: t('nav_morada','Morada'), h: 'contacto.html#morada' },
        { l: t('nav_email','Email'), h: 'contacto.html#email' },
        { l: t('nav_mapa','Mapa'), h: 'contacto.html#mapa' }
      ] }
    ];
  }

  var CART_KEY = 'speedfaz_cart';
  var BASE = '';
  var WA = 'https://wa.me/' + SITE.whatsapp;
  function waText(tx) { return WA + '?text=' + encodeURIComponent(tx); }
  var WA_ORC = waText('Olá! Gostava de pedir um orçamento.');
  function fmt(n) { return Number(n).toLocaleString('pt-PT', { minimumFractionDigits:2, maximumFractionDigits:2 }) + ' €'; }
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function find(id) { for (var i=0;i<CATALOG.length;i++) if (CATALOG[i].id===id) return CATALOG[i]; return null; }

  var WA_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.13c-.24.68-1.42 1.32-1.95 1.36-.5.05-1.13.07-1.83-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.39-.15-.2-1.19-1.58-1.19-3.01s.75-2.13 1.02-2.43c.27-.29.59-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.59.82 2.02.89 2.17.07.15.12.32.02.51-.09.2-.14.32-.27.49-.14.17-.29.38-.41.51-.14.15-.28.31-.12.59.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.27.15.43.12.59-.07.16-.2.68-.79.86-1.06.18-.27.36-.22.59-.13.24.09 1.52.72 1.78.85.27.13.44.2.51.31.07.12.07.68-.17 1.34Z"></path></svg>';
  var CART_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c1b17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4"></circle><circle cx="18" cy="20" r="1.4"></circle><path d="M2.5 3h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6"></path></svg>';

  /* ---------- Cabeçalho ---------- */
  function buildHeader(active) {
    var nav = getNav().map(function(item) {
      var activeCls = item.key === active ? ' is-active' : '';
      if (item.menu && item.menu.length) {
        var drop = item.menu.map(function(m) { return '<a href="' + BASE + esc(m.h) + '">' + esc(m.l) + '</a>'; }).join('');
        return '<div class="sf-nav-item">' +
          '<a class="sf-navlink' + activeCls + '" href="' + BASE + esc(item.href) + '">' + esc(item.label) + ' <span class="sf-caret">▾</span></a>' +
          '<div class="sf-dropdown">' + drop + '</div></div>';
      }
      return '<a class="sf-navlink' + activeCls + '" href="' + BASE + esc(item.href) + '">' + esc(item.label) + '</a>';
    }).join('');

    var langBtns = ['pt','en','fr'].map(function(l) {
      return '<button data-lang="' + l + '" class="sf-lang-btn' + (LANG===l?' active':'') + '">' + l.toUpperCase() + '</button>';
    }).join('');

    return '<header class="sf-header"><div class="sf-header-inner">' +
      '<a class="sf-logo" href="' + BASE + 'index.html" aria-label="Speedfaz — página inicial"><img src="' + BASE + 'assets/img/logo.png" alt="Speedfaz — reparações residenciais"></a>' +
      '<nav class="sf-nav">' + nav +
        '<div class="sf-lang">' + langBtns + '</div>' +
        '<a class="sf-cart-btn" href="' + BASE + 'cart.html" title="' + t('nav_contacto','Carrinho') + '" aria-label="Carrinho">' + CART_ICON +
          '<span class="sf-cart-count" data-cart-count hidden>0</span></a>' +
        '<button class="sf-btn sf-btn-primary sm" data-action="quote">' + t('btn_orcamento','Pedir orçamento') + '</button>' +
      '</nav></div></header>';
  }

  /* ---------- Rodapé ---------- */
  function buildFooter() {
    var phonesInline = SITE.phones.map(function(p) { return '<a href="tel:' + esc(p.tel) + '">' + esc(p.label) + '</a>'; }).join('<span class="sep">/</span>');
    var navLinks = getNav().map(function(i) { return '<a href="' + BASE + esc(i.href) + '">' + esc(i.label) + '</a>'; }).join('');
    return '<footer class="sf-footer"><div class="sf-footer-grid">' +
      '<div>' +
        '<div class="sf-footer-logo"><img src="' + BASE + 'assets/img/logo.png" alt="Speedfaz"></div>' +
        '<p style="font-size:14px;color:#8f8c86;margin:14px 0 0;max-width:260px">' + t('footer_desc','Reparações residenciais e comerciais, rápidas e de confiança na Margem Sul.') + '</p>' +
      '</div>' +
      '<div><h4>' + t('footer_contacto','Contacto') + '</h4>' +
        '<div class="sf-footer-links">' +
          '<div class="sf-footer-phones">' + phonesInline + '</div>' +
          '<a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + '</a>' +
          '<a href="https://instagram.com/' + esc(SITE.instagram) + '" target="_blank" rel="noopener">@' + esc(SITE.instagram) + '</a>' +
        '</div>' +
      '</div>' +
      '<div><h4>' + t('footer_nav','Navegação') + '</h4><div class="sf-footer-nav">' + navLinks + '</div></div>' +
      '<div><h4>' + t('footer_onde','Onde estamos') + '</h4><p style="font-size:14px;color:#8f8c86;margin:0">' + SITE.addressHtml + '<br>' + esc(SITE.website) + '</p></div>' +
    '</div>' +
    '<div class="sf-footer-bottom"><div>© 2025 Speedfaz. ' + t('footer_direitos','Todos os direitos reservados.') + '</div></div></footer>';
  }

  /* ---------- WhatsApp flutuante ---------- */
  function buildFloat() {
    return '<a href="' + esc(WA) + '" target="_blank" rel="noopener" aria-label="Falar no WhatsApp" class="sf-wa-float">' +
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.13c-.24.68-1.42 1.32-1.95 1.36-.5.05-1.13.07-1.83-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.39-.15-.2-1.19-1.58-1.19-3.01s.75-2.13 1.02-2.43c.27-.29.59-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.59.82 2.02.89 2.17.07.15.12.32.02.51-.09.2-.14.32-.27.49-.14.17-.29.38-.41.51-.14.15-.28.31-.12.59.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.27.15.43.12.59-.07.16-.2.68-.79.86-1.06.18-.27.36-.22.59-.13.24.09 1.52.72 1.78.85.27.13.44.2.51.31.07.12.07.68-.17 1.34Z"></path></svg></a>';
  }

  function injectChrome() {
    BASE = document.body.getAttribute('data-base') || '';
    var active = document.body.getAttribute('data-page') || '';

    var existingHeader = document.querySelector('.sf-header');
    var hPlaceholder = document.getElementById('sf-header');
    if (hPlaceholder) { hPlaceholder.outerHTML = buildHeader(active); }
    else if (existingHeader) { existingHeader.outerHTML = buildHeader(active); }

    var existingFooter = document.querySelector('.sf-footer');
    var fPlaceholder = document.getElementById('sf-footer');
    if (fPlaceholder) { fPlaceholder.outerHTML = buildFooter(); }
    else if (existingFooter) { existingFooter.outerHTML = buildFooter(); }

    var existingFloat = document.querySelector('.sf-wa-float');
    if (existingFloat) existingFloat.remove();
    document.body.insertAdjacentHTML('beforeend', buildFloat());

    attachLangListeners();
  }

  function attachLangListeners() {
    document.querySelectorAll('[data-lang]').forEach(function(btn) {
      btn.addEventListener('click', function() { setLang(this.getAttribute('data-lang')); });
    });
    document.querySelectorAll('[data-action="quote"]').forEach(function(btn) {
      btn.addEventListener('click', requestQuote);
    });
  }

  /* ---------- Estado do carrinho (localStorage) ---------- */
  function getCart() { try { var v=JSON.parse(localStorage.getItem(CART_KEY)); return Array.isArray(v)?v:[]; } catch(e) { return []; } }
  function setCart(arr) { try { localStorage.setItem(CART_KEY,JSON.stringify(arr)); } catch(e) {} updateBadges(); renderCartPage(); }
  function addToCart(id) { var c=getCart(); if(c.indexOf(id)===-1){ c.push(id); setCart(c); } }
  function removeFromCart(id) { setCart(getCart().filter(function(x){ return x!==id; })); }
  function inCart(id) { return getCart().indexOf(id)!==-1; }

  function updateBadges() {
    var n=getCart().length;
    document.querySelectorAll('[data-cart-count]').forEach(function(b){ b.textContent=n; b.hidden=n===0; });
  }

  function el(tag,attrs,html) {
    var n=document.createElement(tag);
    if(attrs) for(var k in attrs){ if(k==='class') n.className=attrs[k]; else if(k==='style') n.style.cssText=attrs[k]; else n.setAttribute(k,attrs[k]); }
    if(html!=null) n.innerHTML=html;
    return n;
  }

  /* ---------- Modal: detalhe de serviço ---------- */
  function openServiceModal(id) {
    var s=find(id); if(!s) return;
    var artHref=SERVICE_BLOG[id] ? BASE+'blog/'+SERVICE_BLOG[id]+'.html' : BASE+'blog.html';
    var overlay=el('div',{class:'sf-modal-overlay'});
    function close(){ if(overlay.parentNode) document.body.removeChild(overlay); }
    var incHtml=s.included.map(function(i){
      return '<div class="sf-included"><span class="tick">✓</span><span style="color:#3d3c39;font-size:15px">'+esc(i)+'</span></div>';
    }).join('');
    var modal=el('div',{class:'sf-modal'});
    modal.innerHTML=
      '<div style="position:relative;height:200px;overflow:hidden;border-radius:20px 20px 0 0">'+
        '<img src="'+esc(s.img)+'" alt="'+esc(s.name)+'" style="width:100%;height:100%;object-fit:cover">'+
        '<div class="sf-modal-close" data-close style="position:absolute;top:12px;right:12px">✕</div>'+
      '</div>'+
      '<div style="padding:26px 28px 28px">'+
        '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px">'+
          '<h3 style="font-weight:800;font-size:23px;margin:0">'+esc(t('svc_'+id,s.name))+'</h3>'+
          '<span class="sf-price-pill" style="font-size:14px;padding:7px 13px">'+esc(s.priceLabel)+'</span>'+
        '</div>'+
        '<p style="color:#5c5b58;font-size:15px;margin:0 0 20px">'+esc(s.descLong)+'</p>'+
        '<div style="display:flex;align-items:center;gap:10px;background:#fdeee4;border:1px solid #f7cdaf;border-radius:12px;padding:11px 14px;margin-bottom:20px">'+
          '<span style="color:#8a5a3c;font-size:13px">'+t('modal_nota','Taxa de visita — deslocação e diagnóstico, descontada no total se o serviço for feito no momento.')+'</span>'+
        '</div>'+
        '<div style="font-weight:800;font-size:15px;margin-bottom:10px">'+t('modal_incluido','O que está incluído')+'</div>'+
        '<div style="display:flex;flex-direction:column;gap:9px;margin-bottom:24px">'+incHtml+'</div>'+
        '<div style="display:flex;gap:12px;flex-wrap:wrap">'+
          '<button data-toggle-cart class="sf-btn '+(inCart(id)?'sf-btn-dark':'sf-btn-primary lg')+'" style="flex:1;min-width:200px;padding:14px 18px;font-size:15px">'+
            (inCart(id)?t('modal_rem','Remover do carrinho'):t('modal_add','+ Adicionar ao carrinho'))+'</button>'+
          '<a href="'+esc(artHref)+'" class="sf-link-underline" style="display:inline-flex;align-items:center">'+t('sobre_service_btn','Sobre este serviço →')+'</a>'+
        '</div>'+
      '</div>';
    overlay.appendChild(modal);
    overlay.addEventListener('click',function(e){ if(e.target===overlay) close(); });
    modal.querySelector('[data-close]').addEventListener('click',close);
    modal.querySelector('[data-toggle-cart]').addEventListener('click',function(){
      if(inCart(id)) removeFromCart(id); else addToCart(id);
      close();
    });
    document.body.appendChild(overlay);
  }

  /* ---------- Modal: total estimado ---------- */
  function openTotalModal() {
    var cart=getCart();
    var total=cart.reduce(function(sum,id){ var s=find(id); return sum+(s&&s.priceValue!=null?s.priceValue:0); },0);
    var iva=total-total/1.23;
    var rows=cart.map(function(id){
      var s=find(id); var price=s.priceValue!=null?fmt(s.priceValue):'Sob avaliação';
      return '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px"><span style="color:#3d3c39;font-size:15px">'+esc(t('svc_'+id,s.name))+'</span><span style="font-weight:700;font-size:15px;white-space:nowrap">'+price+'</span></div>';
    }).join('');
    var overlay=el('div',{class:'sf-modal-overlay'});
    function close(){ if(overlay.parentNode) document.body.removeChild(overlay); }
    var modal=el('div',{class:'sf-modal narrow'});
    modal.innerHTML=
      '<div style="padding:26px 28px 28px">'+
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:6px">'+
          '<h3 style="font-weight:800;font-size:22px;margin:0">'+t('total_h','Valor estimado')+'</h3>'+
          '<div class="sf-modal-close" data-close style="background:#f5f4f2;width:34px;height:34px;font-size:17px">✕</div></div>'+
        '<p style="color:#9a9893;font-size:14px;margin:0 0 22px">'+t('total_nota','O preço final pode variar após avaliação no local.')+'</p>'+
        '<div style="display:flex;flex-direction:column;gap:12px;border-top:1px solid #ecebe8;padding-top:18px">'+rows+'</div>'+
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;border-top:1px solid #ecebe8;margin-top:16px;padding-top:14px;color:#727271;font-size:14px"><span>'+t('iva_label','IVA incluído (23%)')+'</span><span style="font-weight:600">'+fmt(iva)+'</span></div>'+
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;border-top:2px solid #1c1b17;margin-top:12px;padding-top:14px"><span style="font-weight:800;font-size:17px">'+t('total_label','Total estimado')+'</span><span style="font-weight:800;font-size:24px;color:#f08143">'+fmt(total)+'</span></div>'+
        '<button id="sf-total-wa-btn" class="sf-btn sf-btn-green" style="display:flex;width:100%;padding:15px 18px;font-size:16px;margin-top:22px">'+WA_SVG+' '+t('pedir_wa','Pedir no WhatsApp')+'</button>'+
      '</div>';
    overlay.appendChild(modal);
    overlay.addEventListener('click',function(e){ if(e.target===overlay) close(); });
    modal.querySelector('[data-close]').addEventListener('click',close);
    modal.querySelector('#sf-total-wa-btn').addEventListener('click',function(){ close(); openNameModal('cart'); });
    document.body.appendChild(overlay);
  }

  /* ---------- Fluxo "Pedir orçamento" ---------- */

  function requestQuote() {
    var cart = getCart();
    if (cart.length === 0) {
      var currentPage = document.body.getAttribute('data-page') || '';
      if (currentPage === 'servicos') {
        openEmptyCartModal();
      } else {
        window.location.href = BASE + 'servicos.html';
      }
    } else {
      openNameModal('cart');
    }
  }

  function openEmptyCartModal() {
    var overlay = el('div', { class: 'sf-modal-overlay' });
    function close() { if (overlay.parentNode) document.body.removeChild(overlay); }
    var modal = el('div', { class: 'sf-modal narrow' });
    modal.innerHTML =
      '<div style="padding:26px 28px 30px">' +
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px">' +
          '<div style="width:48px;height:48px;border-radius:14px;background:#fdeee4;display:flex;align-items:center;justify-content:center;font-size:24px;flex:none">🛒</div>' +
          '<div class="sf-modal-close" data-close style="background:#f5f4f2;width:34px;height:34px;font-size:17px">✕</div>' +
        '</div>' +
        '<h3 style="font-weight:800;font-size:21px;margin:14px 0 8px">Ainda não escolheste nenhum serviço</h3>' +
        '<p style="color:#5c5b58;font-size:15px;margin:0 0 24px">Para pedires orçamento, adiciona pelo menos um serviço à lista — ou pede-nos informação geral sem compromisso.</p>' +
        '<div style="display:flex;flex-direction:column;gap:12px">' +
          '<button id="sf-eq-info" class="sf-btn sf-btn-green" style="display:flex;padding:14px 18px;font-size:15px">' + WA_SVG + ' Pedir informação geral</button>' +
          '<button id="sf-eq-choose" class="sf-btn sf-btn-dark" style="padding:14px 18px;font-size:15px">Escolher serviço</button>' +
        '</div>' +
      '</div>';
    overlay.appendChild(modal);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });
    modal.querySelector('[data-close]').addEventListener('click', close);
    modal.querySelector('#sf-eq-info').addEventListener('click', function() { close(); openNameModal('info'); });
    modal.querySelector('#sf-eq-choose').addEventListener('click', close);
    document.body.appendChild(overlay);
  }

  function openNameModal(mode) {
    var overlay = el('div', { class: 'sf-modal-overlay' });
    function close() { if (overlay.parentNode) document.body.removeChild(overlay); }
    var isInfo = mode === 'info';
    var modal = el('div', { class: 'sf-modal narrow' });
    modal.innerHTML =
      '<div style="padding:26px 28px 28px">' +
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:6px">' +
          '<h3 style="font-weight:800;font-size:21px;margin:0">' + (isInfo ? 'Pedir informação geral' : 'Quase pronto!') + '</h3>' +
          '<div class="sf-modal-close" data-close style="background:#f5f4f2;width:34px;height:34px;font-size:17px">✕</div>' +
        '</div>' +
        '<p style="color:#9a9893;font-size:14px;margin:0 0 20px">' + (isInfo ? 'A tua mensagem será enviada via WhatsApp.' : 'Introduz o teu nome para personalizarmos a mensagem no WhatsApp.') + '</p>' +
        '<label style="display:block;font-weight:700;font-size:14px;margin-bottom:6px">O teu nome <span style="color:#9a9893;font-weight:400">(opcional)</span></label>' +
        '<input id="sf-nm-name" type="text" placeholder="Ex.: Maycon Soares" autocomplete="given-name" style="width:100%;padding:12px 14px;border:1px solid #ecebe8;border-radius:10px;font:inherit;font-size:15px;margin-bottom:20px">' +
        '<button id="sf-nm-send" class="sf-btn sf-btn-green" style="display:flex;width:100%;padding:15px 18px;font-size:16px">' + WA_SVG + ' Enviar no WhatsApp</button>' +
        '<p style="text-align:center;color:#9a9893;font-size:13px;margin:12px 0 0">A mensagem será sempre enviada em português.</p>' +
      '</div>';
    overlay.appendChild(modal);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });
    modal.querySelector('[data-close]').addEventListener('click', close);
    modal.querySelector('#sf-nm-send').addEventListener('click', function() {
      var name = (modal.querySelector('#sf-nm-name').value || '').trim();
      var saudacao = name ? 'Olá, o meu nome é ' + name + '.' : 'Olá!';
      var msg;
      if (isInfo) {
        msg = saudacao + ' Estava a ver o site da SPEED-FAZ e gostaria de obter informação geral sobre os vossos serviços. Podem entrar em contacto o mais breve possível? Obrigado!';
      } else {
        var cart = getCart();
        var names = cart.map(function(id) { var s = find(id); return s ? s.name : ''; }).filter(Boolean).join(', ');
        var total = cart.reduce(function(sum, id) { var s = find(id); return sum + (s && s.priceValue != null ? s.priceValue : 0); }, 0);
        msg = saudacao + ' Estava a ver o site da SPEED-FAZ e gostaria de marcar uma visita.' +
          (names ? ' Serviços de interesse: ' + names + '.' : '') +
          (total > 0 ? ' Valor estimado: ' + fmt(total) + '.' : '') +
          ' Podem ver a disponibilidade dos serviços e também o valor da visita, por favor? Entrem em contacto o mais breve possível. Obrigado!';
      }
      window.open(waText(msg), '_blank', 'noopener');
      close();
    });
    document.body.appendChild(overlay);
  }

  function buildCartLink() {
    var cart=getCart();
    var total=cart.reduce(function(sum,id){ var s=find(id); return sum+(s&&s.priceValue!=null?s.priceValue:0); },0);
    var names=cart.map(function(id){ var s=find(id); return s?s.name:''; }).filter(Boolean).join(', ');
    return waText('Olá Speedfaz! Tenho interesse nos seguintes serviços: '+names+'. Valor estimado: '+fmt(total)+'. Podem confirmar disponibilidade?');
  }

  /* ---------- Página do carrinho ---------- */
  function renderCartPage() {
    var root=document.getElementById('sf-cart-root'); if(!root) return;
    var cart=getCart();
    var listEl=document.getElementById('sf-cart-list');
    var emptyEl=document.getElementById('sf-cart-empty');
    var filledEl=document.getElementById('sf-cart-filled');

    /* Atualiza textos estáticos da página carrinho */
    var h1=root.querySelector('h1'); if(h1) h1.textContent=t('cart_h1','O teu carrinho');
    var desc=root.querySelector('p'); if(desc) desc.textContent=t('cart_p','Revê os serviços escolhidos e pede tudo de uma vez no WhatsApp.');

    if(cart.length===0){
      if(emptyEl){
        var eh2=emptyEl.querySelector('h2'); if(eh2) eh2.textContent=t('cart_vazio_h','O teu carrinho está vazio');
        var ep=emptyEl.querySelector('p'); if(ep) ep.textContent=t('cart_vazio_p','Escolhe os serviços de que precisas e adiciona-os aqui.');
        var ea=emptyEl.querySelector('a'); if(ea) ea.textContent=t('ver_servicos_btn','Ver serviços');
        emptyEl.hidden=false;
      }
      if(filledEl) filledEl.hidden=true;
      return;
    }
    if(emptyEl) emptyEl.hidden=true; if(filledEl) filledEl.hidden=false;

    /* Texto do total e botão WA */
    var totalLabelSpan=document.querySelector('#sf-cart-filled .sf-footer-phones, #sf-cart-filled [style*="color:#b7b4ad"]');
    var relH2=document.getElementById('sf-related-wrap') && document.getElementById('sf-related-wrap').querySelector('h2');
    if(relH2) relH2.textContent=t('cart_relacionados','Produtos relacionados');

    listEl.innerHTML='';
    cart.forEach(function(id){
      var s=find(id); if(!s) return;
      var item=el('div',{class:'sf-cart-item'});
      item.innerHTML=
        '<img src="'+esc(s.img)+'" alt="'+esc(t('svc_'+id,s.name))+'" style="flex:none;width:72px;height:72px;object-fit:cover;border-radius:12px">'+
        '<div style="flex:1;min-width:0"><h3 style="font-weight:700;font-size:17px;margin:0 0 3px">'+esc(t('svc_'+id,s.name))+'</h3>'+
        '<div style="color:#e06f30;font-weight:700;font-size:14px">'+esc(s.priceLabel)+'</div>'+
        '<div style="color:#9a9893;font-size:13px;margin-top:2px">'+t('cart_toca','Toca para ver detalhes')+'</div></div>'+
        '<div class="sf-cart-remove" title="Remover">✕</div>';
      item.addEventListener('click',function(){ openServiceModal(id); });
      item.querySelector('.sf-cart-remove').addEventListener('click',function(e){ e.stopPropagation(); removeFromCart(id); });
      listEl.appendChild(item);
    });

    var relWrap=document.getElementById('sf-related-wrap');
    var relTrack=document.getElementById('sf-related-track');
    var cats=[]; cart.forEach(function(id){ var s=find(id); if(s&&cats.indexOf(s.cat)===-1) cats.push(s.cat); });
    var related=PRODUCTS.filter(function(p){ return cats.indexOf(p.cat)!==-1; });
    if(related.length>0){
      relWrap.hidden=false;
      relTrack.innerHTML=related.map(function(p){
        return '<div style="flex:0 0 calc((100% - 32px) / 3);min-width:150px;scroll-snap-align:start;background:#fff;border:1px solid #ecebe8;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(28,27,23,.04)">'+
          '<div style="height:118px;overflow:hidden"><img src="'+esc(p.img)+'" alt="'+esc(p.name)+'" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>'+
          '<div style="padding:12px 14px"><h4 style="font-weight:700;font-size:14px;margin:0 0 4px;line-height:1.25">'+esc(p.name)+'</h4><div style="color:#e06f30;font-weight:700;font-size:14px">'+esc(p.price)+'</div></div></div>';
      }).join('');
    } else { relWrap.hidden=true; }

    var total=cart.reduce(function(sum,id){ var s=find(id); return sum+(s&&s.priceValue!=null?s.priceValue:0); },0);
    document.getElementById('sf-total-label').textContent=fmt(total);
    var cartWaEl=document.getElementById('sf-cart-wa');
    if(cartWaEl){
      cartWaEl.onclick=function(e){ e.preventDefault(); openNameModal('cart'); };
    }

    var notaEl=document.querySelector('[style*="Valor estimado"]');
    var cartNota=root.querySelector('.sf-cart-item ~ p, #sf-cart-filled > p');

    var totalToggleDiv=document.getElementById('sf-total-toggle');
    if(totalToggleDiv){
      var tLabel=totalToggleDiv.querySelector('[style*="color:#b7b4ad"]');
      if(tLabel) tLabel.textContent=t('cart_total','Valor total estimado');
      var tDetalhe=totalToggleDiv.querySelector('[style*="f08143"]');
      if(tDetalhe) tDetalhe.textContent=t('ver_detalhe','ver detalhe');
    }
  }

  /* ---------- Página de artigo (blog) ---------- */
  function renderArticle() {
    var root=document.getElementById('sf-article-root'); if(!root) return;
    var slug='';
    try {
      slug=new URLSearchParams(location.search).get('post')||'';
      if(!slug){ var _m=location.pathname.match(/\/blog\/([^/]+)\.html/); if(_m) slug=_m[1]; }
    } catch(e) {}
    var post=BLOG[slug];
    var pd=post&&(post[LANG]||post.pt);
    if(!pd){
      root.innerHTML='<section style="max-width:760px;margin:0 auto;padding:clamp(48px,7vw,90px) 24px;text-align:center">'+
        '<h1 style="font-weight:800;font-size:clamp(28px,4vw,40px);margin:0 0 12px">'+t('art_nao_h','Artigo não encontrado')+'</h1>'+
        '<p style="color:#727271;font-size:17px;margin:0 0 24px">'+t('art_nao_p','O artigo que procuras não existe ou foi movido.')+'</p>'+
        '<a href="'+BASE+'blog.html" class="sf-btn sf-btn-primary lg">'+t('art_voltar_btn','← Voltar ao blog')+'</a></section>';
      return;
    }
    document.title=pd.title+' | Speedfaz';
    var bodyHtml=pd.body.map(function(p){ return /^\s*</.test(p)?p:'<p style="font-size:17px;color:#3d3c39;margin:0 0 18px">'+p+'</p>'; }).join('');
    root.innerHTML=
      '<article style="max-width:820px;margin:0 auto;padding:clamp(28px,4vw,44px) 24px clamp(48px,6vw,80px)">'+
        '<a href="'+BASE+'blog.html" style="cursor:pointer;display:inline-flex;align-items:center;gap:7px;color:#727271;font-weight:600;font-size:15px;margin-bottom:22px;text-decoration:none">'+t('blog_voltar','← Voltar ao blog')+'</a>'+
        '<div class="sf-eyebrow" style="margin-bottom:12px">'+esc(pd.tag)+' · '+esc(pd.date)+'</div>'+
        '<h1 style="font-weight:800;font-size:clamp(30px,4.5vw,46px);line-height:1.1;letter-spacing:-.5px;margin:0 0 12px">'+esc(pd.title)+'</h1>'+
        (pd.subtitle?'<p style="font-size:clamp(17px,2.2vw,22px);color:#727271;font-weight:600;line-height:1.3;margin:0 0 24px">'+esc(pd.subtitle)+'</p>':'')+
        '<img src="'+esc(post.img)+'" alt="'+esc(pd.title)+'" style="width:100%;height:clamp(220px,34vw,400px);object-fit:cover;border-radius:18px;box-shadow:0 18px 40px rgba(28,27,23,.14);margin-bottom:30px">'+
        '<div>'+bodyHtml+'</div>'+
        '<div style="margin-top:34px;display:flex;flex-wrap:wrap;gap:14px;align-items:center;background:#f5f4f2;border:1px solid #ecebe8;border-radius:18px;padding:24px 26px">'+
          '<div style="flex:1;min-width:220px"><div style="font-weight:800;font-size:18px;margin-bottom:4px">'+t('precisa_ajuda','Precisas de ajuda com isto?')+'</div><p style="margin:0;color:#5c5b58;font-size:15px">'+t('precisa_ajuda_p','Fala connosco e resolvemos rápido, sem complicações.')+'</p></div>'+
          '<a href="'+esc(WA_ORC)+'" target="_blank" rel="noopener" class="sf-btn sf-btn-primary lg">'+WA_SVG+' '+t('btn_orcamento_lg','Pedir orçamento')+'</a>'+
        '</div>'+
      '</article>';
  }

  /* ---------- Depoimentos (carrossel) ---------- */
  function starsHtml(n) {
    return '<span style="color:#f0b343">'+Array(n+1).join('★')+'</span>'+
           '<span style="color:#ddd9d2">'+Array(5-n+1).join('★')+'</span>';
  }

  function renderTestimonials() {
    var track=document.getElementById('sf-testi-track'); if(!track) return;
    var cards=TESTIMONIALS.map(function(tt){
      var initial=(tt.name||'?').trim().charAt(0).toUpperCase();
      return '<div style="flex:0 0 340px;max-width:86vw;scroll-snap-align:start;background:#f5f4f2;border:1px solid #ecebe8;border-radius:18px;padding:30px 28px;display:flex;flex-direction:column">'+
          '<div style="font-size:20px;letter-spacing:3px;margin-bottom:16px">'+starsHtml(tt.stars)+'</div>'+
          '<p style="color:#3d3c39;font-size:15px;font-style:italic;margin:0 0 22px;flex:1">"'+esc(tt.text)+'"</p>'+
          '<div style="display:flex;align-items:center;gap:12px">'+
            '<div style="flex:none;width:42px;height:42px;border-radius:50%;background:#f08143;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px">'+esc(initial)+'</div>'+
            '<div><div style="font-weight:700;font-size:15px">'+esc(tt.name)+'</div><div style="color:#9a9893;font-size:13px">'+esc(tt.service)+'</div></div>'+
          '</div>'+
        '</div>';
    });
    cards.push('<div style="flex:0 0 340px;max-width:86vw;scroll-snap-align:start;background:#fff;border:2px dashed #d8d6d1;border-radius:18px;padding:30px 28px;display:flex;flex-direction:column;justify-content:center;gap:16px">'+
        '<div style="font-size:20px;letter-spacing:3px;color:#f0b343">★★★★★</div>'+
        '<p style="color:#9a9893;font-size:15px;font-style:italic;margin:0">'+t('dep_tua_opiniao','"A tua opinião pode ser a próxima. Após o serviço, partilha a tua experiência."')+'</p>'+
        '<button id="sf-testi-add" class="sf-btn sf-btn-primary" style="align-self:flex-start;padding:12px 18px;font-size:15px">'+t('dep_btn_deixa','Deixe o seu depoimento')+'</button>'+
      '</div>');
    track.innerHTML=cards.join('');

    var addBtn=document.getElementById('sf-testi-add');
    if(addBtn) addBtn.addEventListener('click',openTestimonialForm);
    var l=document.getElementById('sf-testi-left'), r=document.getElementById('sf-testi-right');
    if(l) l.addEventListener('click',function(){ track.scrollBy({left:-track.clientWidth,behavior:'smooth'}); });
    if(r) r.addEventListener('click',function(){ track.scrollBy({left:track.clientWidth,behavior:'smooth'}); });
  }

  function openTestimonialForm() {
    var overlay=el('div',{class:'sf-modal-overlay'});
    function close(){ if(overlay.parentNode) document.body.removeChild(overlay); }
    var modal=el('div',{class:'sf-modal narrow'});
    modal.innerHTML=
      '<div style="padding:26px 28px 28px">'+
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:6px">'+
          '<h3 style="font-weight:800;font-size:22px;margin:0">'+t('deixe_dep','Deixe o seu depoimento')+'</h3>'+
          '<div class="sf-modal-close" data-close style="background:#f5f4f2;width:34px;height:34px;font-size:17px">✕</div></div>'+
        '<p style="color:#9a9893;font-size:14px;margin:0 0 20px">'+t('dep_form_p','Partilha a tua experiência. Ao enviar, abre o WhatsApp com a mensagem pronta.')+'</p>'+
        '<label style="display:block;font-weight:700;font-size:14px;margin-bottom:6px">'+t('dep_nome','O teu nome')+'</label>'+
        '<input id="sf-t-name" type="text" placeholder="'+t('dep_placeholder_nome','Ex.: Ana Sofia')+'" style="width:100%;padding:12px 14px;border:1px solid #ecebe8;border-radius:10px;font:inherit;font-size:15px;margin-bottom:16px">'+
        '<label style="display:block;font-weight:700;font-size:14px;margin-bottom:6px">'+t('dep_class','Classificação')+'</label>'+
        '<div id="sf-t-stars" style="font-size:30px;letter-spacing:5px;cursor:pointer;margin-bottom:16px;user-select:none">'+
          [1,2,3,4,5].map(function(v){ return '<span data-v="'+v+'">★</span>'; }).join('')+'</div>'+
        '<label style="display:block;font-weight:700;font-size:14px;margin-bottom:6px">'+t('dep_texto','O teu depoimento')+'</label>'+
        '<textarea id="sf-t-text" rows="4" placeholder="'+t('dep_placeholder_texto','Conta como correu o serviço…')+'" style="width:100%;padding:12px 14px;border:1px solid #ecebe8;border-radius:10px;font:inherit;font-size:15px;resize:vertical;margin-bottom:20px"></textarea>'+
        '<button id="sf-t-send" class="sf-btn sf-btn-green" style="display:flex;width:100%;padding:14px 18px;font-size:16px">'+WA_SVG+' '+t('dep_send','Enviar no WhatsApp')+'</button>'+
      '</div>';
    overlay.appendChild(modal);
    overlay.addEventListener('click',function(e){ if(e.target===overlay) close(); });
    modal.querySelector('[data-close]').addEventListener('click',close);

    var rating=5;
    var starSpans=modal.querySelectorAll('#sf-t-stars span');
    function paint(){ starSpans.forEach(function(s,i){ s.style.color=i<rating?'#f0b343':'#ddd9d2'; }); }
    starSpans.forEach(function(s){ s.addEventListener('click',function(){ rating=parseInt(this.getAttribute('data-v'),10); paint(); }); });
    paint();

    modal.querySelector('#sf-t-send').addEventListener('click',function(){
      var name=(modal.querySelector('#sf-t-name').value||'').trim();
      var text=(modal.querySelector('#sf-t-text').value||'').trim();
      var textEl=modal.querySelector('#sf-t-text');
      if(!text){ textEl.style.borderColor='#e0594a'; textEl.focus(); return; }
      var msg='Olá! Quero deixar um depoimento para a Speedfaz:\n\n'+
        'Nome: '+(name||'(não indicado)')+'\n'+
        'Classificação: '+rating+'/5\n'+
        'Depoimento: "'+text+'"';
      window.open(waText(msg),'_blank','noopener');
      close();
    });

    document.body.appendChild(overlay);
  }

  /* ---------- Arranque ---------- */
  function init() {
    injectChrome();
    updateBadges();
    translatePage();
    renderArticle();
    renderTestimonials();

    document.querySelectorAll('[data-service]').forEach(function(c){
      c.addEventListener('click',function(){ openServiceModal(c.getAttribute('data-service')); });
    });

    renderCartPage();
    var totalToggle=document.getElementById('sf-total-toggle');
    if(totalToggle) totalToggle.addEventListener('click',openTotalModal);
    var relL=document.getElementById('sf-rel-left'), relR=document.getElementById('sf-rel-right'), relT=document.getElementById('sf-related-track');
    if(relL&&relT) relL.addEventListener('click',function(){ relT.scrollBy({left:-relT.clientWidth,behavior:'smooth'}); });
    if(relR&&relT) relR.addEventListener('click',function(){ relT.scrollBy({left:relT.clientWidth,behavior:'smooth'}); });
  }

  window.SpeedfazCart = { add:addToCart, remove:removeFromCart, open:openServiceModal };
  window.SpeedfazLang = { set:setLang };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
