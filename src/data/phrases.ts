import { Phrase } from '../types';
import { PHRASES_101_200 } from './phrases_101_200';
import { PHRASES_201_300 } from './phrases_201_300';
import { PHRASES_301_400 } from './phrases_301_400';
import { PHRASES_401_500 } from './phrases_401_500';

const BASE_PHRASES: Phrase[] = [
  {
    id: 1,
    english: "Good morning!",
    translation: "Bom dia!",
    meaning: "Saudação usada pela manhã.",
    example: "Good morning, everyone!",
    exampleTranslation: "Bom dia, pessoal!",
    context: "Saudações diárias ao acordar ou no trabalho.",
    category: "Essenciais & Saudações"
  },
  {
    id: 2,
    english: "Good night!",
    translation: "Boa noite!",
    meaning: "Despedida usada antes de ir dormir ou ao fim da noite.",
    example: "Good night, see you tomorrow.",
    exampleTranslation: "Boa noite, até amanhã.",
    context: "Despedida no fim do dia.",
    category: "Essenciais & Saudações"
  },
  {
    id: 3,
    english: "Thank you.",
    translation: "Obrigado.",
    meaning: "Expressão padrão de gratidão.",
    example: "Thank you for your help.",
    exampleTranslation: "Obrigado pela sua ajuda.",
    context: "Interações de cortesia diária.",
    category: "Essenciais & Saudações"
  },
  {
    id: 4,
    english: "You’re welcome.",
    translation: "De nada.",
    meaning: "Resposta educada a um agradecimento.",
    example: "Thanks for the gift. You’re welcome.",
    exampleTranslation: "Obrigado pelo presente. De nada.",
    context: "Resposta após receber gratidão.",
    category: "Essenciais & Saudações"
  },
  {
    id: 5,
    english: "Excuse me.",
    translation: "Com licença.",
    meaning: "Pedir permissão de passagem ou chamar a atenção.",
    example: "Excuse me, where is the restroom?",
    exampleTranslation: "Com licença, onde fica o banheiro?",
    context: "Chamar atenção polidamente.",
    category: "Essenciais & Saudações"
  },
  {
    id: 6,
    english: "I’m sorry.",
    translation: "Desculpe.",
    meaning: "Expressão de lamento ou desculpa.",
    example: "I’m sorry for being late.",
    exampleTranslation: "Desculpe por me atrasar.",
    context: "Desculpas por pequenos erros.",
    category: "Essenciais & Saudações"
  },
  {
    id: 7,
    english: "Please.",
    translation: "Por favor.",
    meaning: "Expressão para tornar solicitações educadas.",
    example: "Please pass the salt.",
    exampleTranslation: "Por favor, passe o sal.",
    context: "Pedir favores polidamente.",
    category: "Essenciais & Saudações"
  },
  {
    id: 8,
    english: "Yes.",
    translation: "Sim.",
    meaning: "Afirmação positiva padrão.",
    example: "Do you want coffee? Yes, please.",
    exampleTranslation: "Você quer café? Sim, por favor.",
    context: "Respostas diretas.",
    category: "Essenciais & Saudações"
  },
  {
    id: 9,
    english: "No.",
    translation: "Não.",
    meaning: "Negação padrão.",
    example: "No, thank you.",
    exampleTranslation: "Não, obrigado.",
    context: "Respostas diretas e recusas educadas.",
    category: "Essenciais & Saudações"
  },
  {
    id: 10,
    english: "How are you?",
    translation: "Como você está?",
    meaning: "Perguntar sobre o bem-estar de alguém.",
    example: "Hi, John! How are you?",
    exampleTranslation: "Oi, John! Como você está?",
    context: "Início de conversação.",
    category: "Essenciais & Saudações"
  },
  {
    id: 11,
    english: "I’m fine, thank you.",
    translation: "Estou bem, obrigado.",
    meaning: "Responder sobre bem-estar de forma positiva.",
    example: "How are you doing? I’m fine, thank you.",
    exampleTranslation: "Como você vai? Estou bem, obrigado.",
    context: "Resposta rápida de cortesia.",
    category: "Essenciais & Saudações"
  },
  {
    id: 12,
    english: "What’s your name?",
    translation: "Qual é o seu nome?",
    meaning: "Pedir a identidade de alguém.",
    example: "What’s your name, please?",
    exampleTranslation: "Qual é o seu nome, por favor?",
    context: "Ao conhecer alguém novo.",
    category: "Essenciais & Saudações"
  },
  {
    id: 13,
    english: "My name is Anna.",
    translation: "Meu nome é Anna.",
    meaning: "Expressar próprio nome.",
    example: "Hello! My name is Anna.",
    exampleTranslation: "Olá! Meu nome é Anna.",
    context: "Apresentação pessoal.",
    category: "Essenciais & Saudações"
  },
  {
    id: 14,
    english: "Nice to meet you.",
    translation: "Prazer em conhecê-lo.",
    meaning: "Expressar alegria por conhecer alguém.",
    example: "Nice to meet you, David.",
    exampleTranslation: "Prazer em conhecê-lo, David.",
    context: "Ao fim de apresentações.",
    category: "Essenciais & Saudações"
  },
  {
    id: 15,
    english: "How old are you?",
    translation: "Quantos anos você tem?",
    meaning: "Perguntar idade.",
    example: "How old are you, if you don’t mind?",
    exampleTranslation: "Quantos anos você tem, se não se importa?",
    context: "Conversações gerais.",
    category: "Essenciais & Saudações"
  },
  {
    id: 16,
    english: "I’m 25 years old.",
    translation: "Eu tenho 25 anos.",
    meaning: "Expressar a idade.",
    example: "I’m 25 years old and I live in São Paulo.",
    exampleTranslation: "Eu tenho 25 anos e moro em São Paulo.",
    context: "Apresentações pessoais.",
    category: "Essenciais & Saudações"
  },
  {
    id: 17,
    english: "Where are you from?",
    translation: "De onde você é?",
    meaning: "Perguntar origem ou nacionalidade.",
    example: "Where are you from originally?",
    exampleTranslation: "De onde você é originalmente?",
    context: "Ao conhecer turistas ou parceiros internacionais.",
    category: "Essenciais & Saudações"
  },
  {
    id: 18,
    english: "I’m from Brazil.",
    translation: "Eu sou do Brasil.",
    meaning: "Informar origem nacional.",
    example: "Where are you from? I’m from Brazil.",
    exampleTranslation: "De onde você é? Eu sou do Brasil.",
    context: "Apresentações no exterior.",
    category: "Essenciais & Saudações"
  },
  {
    id: 19,
    english: "Good afternoon!",
    translation: "Boa tarde!",
    meaning: "Saudação para o período da tarde.",
    example: "Good afternoon, ladies and gentlemen.",
    exampleTranslation: "Boa tarde, senhoras e senhores.",
    context: "Saudações após o meio-dia.",
    category: "Essenciais & Saudações"
  },
  {
    id: 20,
    english: "Goodbye!",
    translation: "Adeus! / Tchau!",
    meaning: "Despedida definitiva ou formal.",
    example: "Goodbye, have a great weekend!",
    exampleTranslation: "Tchau, tenha um ótimo fim de semana!",
    context: "Despedir-se de alguém.",
    category: "Essenciais & Saudações"
  },
  {
    id: 21,
    english: "Can you help me?",
    translation: "Você pode me ajudar?",
    meaning: "Solicitar apoio de alguém.",
    example: "Can you help me with this task?",
    exampleTranslation: "Você pode me ajudar com esta tarefa?",
    context: "Situações cotidianas de necessidade.",
    category: "Essenciais & Saudações"
  },
  {
    id: 22,
    english: "I don’t understand.",
    translation: "Eu não entendo.",
    meaning: "Expressar falta de compreensão intelectual ou de idioma.",
    example: "I’m sorry, I don’t understand your question.",
    exampleTranslation: "Desculpe, eu não entendi sua pergunta.",
    context: "Problema de comunicação.",
    category: "Essenciais & Saudações"
  },
  {
    id: 23,
    english: "Could you repeat that?",
    translation: "Você pode repetir isso?",
    meaning: "Pedir que repitam o que falaram.",
    example: "Could you repeat that more slowly?",
    exampleTranslation: "Você pode repetir isso mais devagar?",
    context: "Dificuldade de audição ou entendimento.",
    category: "Essenciais & Saudações"
  },
  {
    id: 24,
    english: "Please speak slowly.",
    translation: "Por favor, fale devagar.",
    meaning: "Pedir menor velocidade de fala.",
    example: "Please speak slowly, I’m learning English.",
    exampleTranslation: "Por favor, fale devagar, estou aprendendo inglês.",
    context: "Diálogos com estrangeiros.",
    category: "Essenciais & Saudações"
  },
  {
    id: 25,
    english: "What does this mean?",
    translation: "O que isso significa?",
    meaning: "Pedir definição de termo ou assunto.",
    example: "What does this word mean?",
    exampleTranslation: "O que essa palavra significa?",
    context: "Aprimoramento de vocabulário.",
    category: "Essenciais & Saudações"
  },
  {
    id: 26,
    english: "See you tomorrow.",
    translation: "Até amanhã.",
    meaning: "Despedir-se de quem encontrará no dia seguinte.",
    example: "Have a good night, see you tomorrow.",
    exampleTranslation: "Tenha uma boa noite, até amanhã.",
    context: "Fim do expediente de trabalho ou aulas.",
    category: "Essenciais & Saudações"
  },
  {
    id: 27,
    english: "How do you say...?",
    translation: "Como se diz...?",
    meaning: "Perguntar tradução ou vocabulário específico.",
    example: "How do you say 'obrigado' in English?",
    exampleTranslation: "Como se diz 'obrigado' em inglês?",
    context: "Aprendizado de línguas.",
    category: "Essenciais & Saudações"
  },
  {
    id: 28,
    english: "I’m hungry.",
    translation: "Estou com fome.",
    meaning: "Dizer que precisa de comida.",
    example: "I’m hungry. Let’s clean up and eat.",
    exampleTranslation: "Estou com fome. Vamos limpar tudo e comer.",
    context: "Diálogos caseiros ou antes de ir ao restaurante.",
    category: "Essenciais & Saudações"
  },
  {
    id: 29,
    english: "I’m thirsty.",
    translation: "Estou com sede.",
    meaning: "Dizer que precisa de água ou líquidos.",
    example: "I’m thirsty, I need water immediately.",
    exampleTranslation: "Estou com sede, preciso de água agora mesmo.",
    context: "Dias quentes ou pós-atividades.",
    category: "Essenciais & Saudações"
  },
  {
    id: 30,
    english: "Let’s go!",
    translation: "Vamos!",
    meaning: "Incitar partida ou ação imediata.",
    example: "The taxi is outside, let’s go!",
    exampleTranslation: "O táxi está lá fora, vamos!",
    context: "Mobilidade ou início de tarefas.",
    category: "Essenciais & Saudações"
  },
  {
    id: 31,
    english: "What is this?",
    translation: "O que é isto?",
    meaning: "Pedir identificação de um objeto próximo.",
    example: "What is this on the table?",
    exampleTranslation: "O que é isto em cima da mesa?",
    context: "Interrogar sobre coisas desconhecidas.",
    category: "Essenciais & Saudações"
  },
  {
    id: 32,
    english: "What time is it?",
    translation: "Que horas são?",
    meaning: "Pedir indicação de horário.",
    example: "Excuse me, what time is it?",
    exampleTranslation: "Com licença, que horas são?",
    context: "Coordenação de tempo diária.",
    category: "Essenciais & Saudações"
  },
  {
    id: 33,
    english: "Where is the bathroom?",
    translation: "Onde fica o banheiro?",
    meaning: "Pedir localização do toalete.",
    example: "Excuse me, where is the bathroom, please?",
    exampleTranslation: "Com licença, onde fica o banheiro, por favor?",
    context: "Necessidade fundamental em estabelecimentos.",
    category: "Essenciais & Saudações"
  },
  {
    id: 34,
    english: "I like this.",
    translation: "Eu gosto disto.",
    meaning: "Expressar apreciação ou aprovação.",
    example: "I like this music, turn it up.",
    exampleTranslation: "Eu gosto desta música, aumente o som.",
    context: "Opiniões diárias.",
    category: "Essenciais & Saudações"
  },
  {
    id: 35,
    english: "I don’t like this.",
    translation: "Eu não gosto disto.",
    meaning: "Desaprovação ou desgosto.",
    example: "I don’t like this dry climate.",
    exampleTranslation: "Eu não gosto deste clima seco.",
    context: "Opiniões diárias de rejeição.",
    category: "Essenciais & Saudações"
  },
  {
    id: 36,
    english: "How much is this?",
    translation: "Quanto custa isto?",
    meaning: "Pedir preço de mercadoria ou tarifa.",
    example: "Excuse me, how much is this souvenir?",
    exampleTranslation: "Com licença, quanto custa esta lembrancinha?",
    context: "Compras em geral.",
    category: "Restaurantes & Compras"
  },
  {
    id: 37,
    english: "It’s beautiful.",
    translation: "É lindo/linda.",
    meaning: "Elogiar estética de algo ou alguém.",
    example: "This view of the sunset is beautiful.",
    exampleTranslation: "Esta vista do pôr do sol é linda.",
    context: "Turismo e apreciação visual.",
    category: "Essenciais & Saudações"
  },
  {
    id: 38,
    english: "Have a nice day!",
    translation: "Tenha um bom dia!",
    meaning: "Desejo positivo de despedida.",
    example: "Thank you for the coffee. Have a nice day!",
    exampleTranslation: "Obrigado pelo café. Tenha um bom dia!",
    context: "Finalização de atendimentos ou diálogos diurnos.",
    category: "Essenciais & Saudações"
  },
  {
    id: 39,
    english: "Do you speak English?",
    translation: "Você fala inglês?",
    meaning: "Perguntar sobre fluência do idioma.",
    example: "Do you speak English? I need directions.",
    exampleTranslation: "Você fala inglês? Preciso de orientações.",
    context: "Interações no exterior.",
    category: "Essenciais & Saudações"
  },
  {
    id: 40,
    english: "I only speak a little English.",
    translation: "Falo apenas um pouco de inglês.",
    meaning: "Limitação de proficiência em língua estrangeira.",
    example: "I understand well, but I only speak a little English.",
    exampleTranslation: "Entendo bem, mas falo apenas um pouco de inglês.",
    context: "Gerenciar expectativas em conversas.",
    category: "Essenciais & Saudações"
  },
  {
    id: 41,
    english: "Never mind.",
    translation: "Deixa para lá. / Não tem importância.",
    meaning: "Pedir para desconsiderar algo dito.",
    example: "Did you find it? No, but never mind.",
    exampleTranslation: "Você achou? Não, mas deixa para lá.",
    context: "Resolver mal-entendidos ou dispensar preocupações.",
    category: "Essenciais & Saudações"
  },
  {
    id: 42,
    english: "Congratulations!",
    translation: "Parabéns!",
    meaning: "Felicitações por conquistas.",
    example: "Congratulations on your new job!",
    exampleTranslation: "Parabéns pelo seu novo emprego!",
    context: "Eventos festivos ou marcos de vida.",
    category: "Essenciais & Saudações"
  },
  {
    id: 43,
    english: "Happy birthday!",
    translation: "Feliz aniversário!",
    meaning: "Desejos de feliz natalício.",
    example: "Happy birthday, my good friend!",
    exampleTranslation: "Feliz aniversário, meu bom amigo!",
    context: "Celebração anual de nascimento.",
    category: "Essenciais & Saudações"
  },
  {
    id: 44,
    english: "What do you do?",
    translation: "O que você faz? (Profissão)",
    meaning: "Interrogar ocupação profissional.",
    example: "What do you do for a living?",
    exampleTranslation: "O que você faz da vida?",
    context: "Networking ou conexões informais.",
    category: "Trabalho & Negócios"
  },
  {
    id: 45,
    english: "I am a student.",
    translation: "Eu sou estudante.",
    meaning: "Profissão: estudante.",
    example: "I am a student at the local university.",
    exampleTranslation: "Eu sou estudante na universidade local.",
    context: "Apresentações educacionais.",
    category: "Trabalho & Negócios"
  },
  {
    id: 46,
    english: "I work here.",
    translation: "Eu trabalho aqui.",
    meaning: "Indicar local de trabalho físico.",
    example: "I work here as a system designer.",
    exampleTranslation: "Eu trabalho aqui como designer de sistemas.",
    context: "Conversações de trabalho.",
    category: "Trabalho & Negócios"
  },
  {
    id: 47,
    english: "Where do you live?",
    translation: "Onde você mora?",
    meaning: "Perguntar local de habitação.",
    example: "Where do you live currently?",
    exampleTranslation: "Onde você mora atualmente?",
    context: "Bate-papos amigáveis.",
    category: "Essenciais & Saudações"
  },
  {
    id: 48,
    english: "I don’t know.",
    translation: "Eu não sei.",
    meaning: "Declarar falta de conhecimento de fato.",
    example: "What is the answer? I don’t know.",
    exampleTranslation: "Qual é a resposta? Eu não sei.",
    context: "Fatos desconhecidos.",
    category: "Essenciais & Saudações"
  },
  {
    id: 49,
    english: "I think so.",
    translation: "Eu acho que sim.",
    meaning: "Indicação de convicção moderada.",
    example: "Is the post office open? I think so.",
    exampleTranslation: "O correio está aberto? Eu acho que sim.",
    context: "Certezas médias.",
    category: "Essenciais & Saudações"
  },
  {
    id: 50,
    english: "I don’t think so.",
    translation: "Eu acho que não.",
    meaning: "Expressar objeção ou discordância leve.",
    example: "Is it going to rain? I don’t think so.",
    exampleTranslation: "Vai chover? Eu acho que não.",
    context: "Certezas opostas e palpites.",
    category: "Essenciais & Saudações"
  },
  {
    id: 51,
    english: "I’m tired.",
    translation: "Estou cansado.",
    meaning: "Declarar esgotamento de energia.",
    example: "I’m tired, I need to sleep now.",
    exampleTranslation: "Estou cansado, preciso dormir agora.",
    context: "Fim de dia ou pós-tarefa exaustiva.",
    category: "Essenciais & Saudações"
  },
  {
    id: 52,
    english: "Me too.",
    translation: "Eu também.",
    meaning: "Concordância absoluta com afirmação declarada.",
    example: "I want chocolate. Me too!",
    exampleTranslation: "Eu quero chocolate. Eu também!",
    context: "Criação de afinidades.",
    category: "Essenciais & Saudações"
  },
  {
    id: 53,
    english: "Good luck!",
    translation: "Boa sorte!",
    meaning: "Desejar boa fortuna a outrem.",
    example: "Good luck on your performance!",
    exampleTranslation: "Boa sorte na sua apresentação!",
    context: "Antes de exames, provas ou entrevistas.",
    category: "Essenciais & Saudações"
  },
  {
    id: 54,
    english: "See you later.",
    translation: "Até mais tarde.",
    meaning: "Despedida rápida por tempo indefinido.",
    example: "I’m going now, see you later.",
    exampleTranslation: "Estou indo agora, até mais tarde.",
    context: "Despedidas informais rápidas.",
    category: "Essenciais & Saudações"
  },
  {
    id: 55,
    english: "Take care.",
    translation: "Se cuida.",
    meaning: "Expressar votos afetuosos de segurança física e saúde.",
    example: "Bye, take care on the road.",
    exampleTranslation: "Tchau, se cuida na estrada.",
    context: "Avisos zelosos de despedida.",
    category: "Essenciais & Saudações"
  },
  {
    id: 56,
    english: "Keep it up!",
    translation: "Continue assim!",
    meaning: "Dar incentivos morais para alguém seguir num bom caminho.",
    example: "Your scores are great, keep it up!",
    exampleTranslation: "Suas notas estão excelentes, continue assim!",
    context: "Incentivos de mentores ou amigos.",
    category: "Essenciais & Saudações"
  },
  {
    id: 57,
    english: "Have fun!",
    translation: "Divirta-se!",
    meaning: "Desejar divertimento a outrem.",
    example: "Going to the party? Have fun!",
    exampleTranslation: "Inco para a festa? Divirta-se!",
    context: "Atividades de lazer.",
    category: "Essenciais & Saudações"
  },
  {
    id: 58,
    english: "I’m lost.",
    translation: "Estou perdido.",
    meaning: "Desorientado em localização.",
    example: "Help me, I’m lost without internet.",
    exampleTranslation: "Ajude-me, estou perdido sem internet.",
    context: "Emergências básicas turísticas.",
    category: "Viagens & Transporte"
  },
  {
    id: 59,
    english: "Wait a minute, please.",
    translation: "Espere um minuto, por favor.",
    meaning: "Pedir pausa breve temporária.",
    example: "Let me check the computer. Wait a minute, please.",
    exampleTranslation: "Deixa-me conferir o computador. Espere um minuto, por favor.",
    context: "Segurar chamadas ou pedidos.",
    category: "Essenciais & Saudações"
  },
  {
    id: 60,
    english: "No problem.",
    translation: "Sem problemas.",
    meaning: "Responder que tudo está regularizado.",
    example: "Sorry for the delay. No problem.",
    exampleTranslation: "Desculpe pelo atraso. Sem problemas.",
    context: "Descartar pequenas ofensas ou agradecimentos.",
    category: "Essenciais & Saudações"
  },
  {
    id: 61,
    english: "Of course.",
    translation: "Claro. / Com certeza.",
    meaning: "Dar conformidade absoluta.",
    example: "Can I use your pen? Of course.",
    exampleTranslation: "Posso usar sua caneta? Claro.",
    context: "Autorizações amigáveis.",
    category: "Essenciais & Saudações"
  },
  {
    id: 62,
    english: "That’s right.",
    translation: "Está certo. / Exatamente.",
    meaning: "Validar asserção alheia.",
    example: "The answer is forty-two. That’s right.",
    exampleTranslation: "A resposta é quarenta e dois. Exatamente.",
    context: "Correções e confirmações.",
    category: "Essenciais & Saudações"
  },
  {
    id: 63,
    english: "Really?",
    translation: "Sério? / Verdade?",
    meaning: "Perplexidade leve ou confirmação.",
    example: "She passed the exam. Really?",
    exampleTranslation: "Ela passou na prova. Sério?",
    context: "reações a novidades surpresas.",
    category: "Essenciais & Saudações"
  },
  {
    id: 64,
    english: "What a pity!",
    translation: "Que pena!",
    meaning: "Lamento por evento infortunoso.",
    example: "The concert was cancelled. What a pity!",
    exampleTranslation: "O show foi cancelado. Que pena!",
    context: "Expressar empatia triste.",
    category: "Essenciais & Saudações"
  },
  {
    id: 65,
    english: "Are you sure?",
    translation: "Você tem certeza?",
    meaning: "Interrogar firmeza de crença.",
    example: "The road is blocked. Are you sure?",
    exampleTranslation: "A estrada está bloqueada. Você tem certeza?",
    context: "Investigar fatos antes de decidir.",
    category: "Essenciais & Saudações"
  },
  {
    id: 66,
    english: "I have no idea.",
    translation: "Não faço a menor ideia.",
    meaning: "Desconhecimento completo.",
    example: "Where did he go? I have no idea.",
    exampleTranslation: "Para onde ele foi? Não faço a menor ideia.",
    context: "Resposta a enigmas ou perguntas sem pista.",
    category: "Essenciais & Saudações"
  },
  {
    id: 67,
    english: "I’m busy today.",
    translation: "Estou ocupado hoje.",
    meaning: "Sem disponibilidade de agenda imediata.",
    example: "Can we talk now? Sorry, I’m busy today.",
    exampleTranslation: "Podemos falar agora? Desculpe, estou ocupado hoje.",
    context: "Falta de tempo comercial ou amigável.",
    category: "Trabalho & Negócios"
  },
  {
    id: 68,
    english: "Where are we?",
    translation: "Onde nós estamos?",
    meaning: "Pedir localização autônoma num ponto do espaço.",
    example: "My maps is offline. Where are we?",
    exampleTranslation: "Meu mapa está sem rede. Onde nós estamos?",
    context: "Viagens e descaminho.",
    category: "Viagens & Transporte"
  },
  {
    id: 69,
    english: "What’s going on?",
    translation: "O que está acontecendo?",
    meaning: "Pedir diagnóstico de situação corrente.",
    example: "There is too much noise downstairs. What’s going on?",
    exampleTranslation: "Tem barulho demais cá embaixo. O que está acontecendo?",
    context: "Chegar a locais tumultuados.",
    category: "Essenciais & Saudações"
  },
  {
    id: 70,
    english: "I need a doctor.",
    translation: "Eu preciso de um médico.",
    meaning: "Solicitar ajuda profissional médica emergencial.",
    example: "Help! I need a doctor.",
    exampleTranslation: "Socorro! Preciso de um médico.",
    context: "Situações graves de saúde e acidentes.",
    category: "Emergências & Saúde"
  },
  {
    id: 71,
    english: "Call the police!",
    translation: "Chame a polícia!",
    meaning: "Solicitar intervenção policial em perigo imediato.",
    example: "Call the police! Someone is stealing my bag.",
    exampleTranslation: "Chame a polícia! Alguém está roubando minha bolsa.",
    context: "Assaltos ou ocorrência de crimes.",
    category: "Emergências & Saúde"
  },
  {
    id: 72,
    english: "Fire! Help!",
    translation: "Fogo! Socorro!",
    meaning: "Grito de socorro diante de chamas de fogo perigosas.",
    example: "Fire! Help! Get out the building!",
    exampleTranslation: "Fogo! Socorro! Saiam do edifício!",
    context: "Emergências de incêndios graves.",
    category: "Emergências & Saúde"
  },
  {
    id: 73,
    english: "Look out!",
    translation: "Cuidado! / Olhe lá!",
    meaning: "Exclamação protetora sobre perigos imediatos em rota.",
    example: "Look out! The car is speeding up.",
    exampleTranslation: "Cuidado! O carro está acelerando.",
    context: "Prevenir desastres rodoviários ou físicos rápidos.",
    category: "Emergências & Saúde"
  },
  {
    id: 74,
    english: "Stop here, please.",
    translation: "Pare aqui, por favor.",
    meaning: "Pedir que um veículo estacione imediatamente.",
    example: "This corner is fine. Stop here, please.",
    exampleTranslation: "Esta esquina está ótima. Pare aqui, por favor.",
    context: "Táxis ou ônibus.",
    category: "Viagens & Transporte"
  },
  {
    id: 75,
    english: "How far is it?",
    translation: "Qual é a distância? / Quão longe fica?",
    meaning: "Medir distância geográfica de um trajeto.",
    example: "How far is it from the subway staton?",
    exampleTranslation: "Quão longe fica da estação de metrô?",
    context: "Planejar caminhadas.",
    category: "Viagens & Transporte"
  },
  {
    id: 76,
    english: "It’s near here.",
    translation: "Fica perto daqui.",
    meaning: "Indicar proximidade no espaço.",
    example: "Where is the bakery? It’s near here, just walk more 10 meters.",
    exampleTranslation: "Onde fica a padaria? É perto daqui, apenas ande mais 10 metros.",
    context: "Instruções locais curtas.",
    category: "Viagens & Transporte"
  },
  {
    id: 77,
    english: "It’s far from here.",
    translation: "Fica longe daqui.",
    meaning: "Indicar alta distância.",
    example: "Do you want to walk? No, it’s far from here, we need a car.",
    exampleTranslation: "Você quer caminhar? Não, fica longe daqui, precisamos de carro.",
    context: "Definir modais de tráfego.",
    category: "Viagens & Transporte"
  },
  {
    id: 78,
    english: "Go straight head.",
    translation: "Vá em frente. / Siga reto.",
    meaning: "Pedir que sigam sem virar nas transversais.",
    example: "How to reach the square? Go straight head for two blocks.",
    exampleTranslation: "Como alcançar a praça? Siga reto por duas quadras.",
    context: "Pontos de referência.",
    category: "Viagens & Transporte"
  },
  {
    id: 79,
    english: "Turn right.",
    translation: "Vire à direita.",
    meaning: "Pedir conversão no plano horizontal direito.",
    example: "Turn right in downtown avenue.",
    exampleTranslation: "Vire à direita na avenida do centro.",
    context: "Direções em cruzamentos.",
    category: "Viagens & Transporte"
  },
  {
    id: 80,
    english: "Turn left.",
    translation: "Vire à esquerda.",
    meaning: "Pedir conversão no lado esquerdo.",
    example: "Go past the gas station, and then turn left.",
    exampleTranslation: "Passe o posto de combustível, e então vire à esquerda.",
    context: "Direções.",
    category: "Viagens & Transporte"
  },
  {
    id: 81,
    english: "Take this street.",
    translation: "Pegue esta rua.",
    meaning: "Indicar via exata para tráfego.",
    example: "Avoid the avenue, take this street instead.",
    exampleTranslation: "Evite a avenida, pegue esta rua em vez disso.",
    context: "Instruções viárias.",
    category: "Viagens & Transporte"
  },
  {
    id: 82,
    english: "I am tourist.",
    translation: "Eu sou turista.",
    meaning: "Declarar perfil no território estrangeiro.",
    example: "Can you help me? I am tourist.",
    exampleTranslation: "Você pode me guiar? Eu sou turista.",
    context: "Pedir tolerância em caminhos errados.",
    category: "Viagens & Transporte"
  },
  {
    id: 83,
    english: "Where can I buy water?",
    translation: "Onde posso comprar água?",
    meaning: "Perguntar onde vende água.",
    example: "It's too hot today. Where can I buy water?",
    exampleTranslation: "Está quente demais hoje. Onde posso comprar água?",
    context: "Ruas e quiosques.",
    category: "Restaurantes & Compras"
  },
  {
    id: 84,
    english: "Do you have a map?",
    translation: "Você tem um mapa?",
    meaning: "Perguntar por mapa geográfico impresso ou app.",
    example: "I am checking destinations. Do you have a map?",
    exampleTranslation: "Estou examinando os destinos. Você tem um mapa?",
    context: "Turismo.",
    category: "Viagens & Transporte"
  },
  {
    id: 85,
    english: "Where is the beach?",
    translation: "Onde fica a praia?",
    meaning: "Perguntar localização da orla marítima.",
    example: "I'm looking for waves—where is the beach?",
    exampleTranslation: "Estou procurando ondas—onde fica a praia?",
    context: "Turismo litorâneo.",
    category: "Viagens & Transporte"
  },
  {
    id: 86,
    english: "I love this city.",
    translation: "Eu amo esta cidade.",
    meaning: "Demonstrar afeição pela cidade visitada.",
    example: "The architecture is amazing, I love this city.",
    exampleTranslation: "A arquitetura é magnífica, eu amo esta cidade.",
    context: "Conversações amigáveis com habitantes locais.",
    category: "Essenciais & Saudações"
  },
  {
    id: 87,
    english: "What’s the exchange rate?",
    translation: "Qual é o valor do câmbio?",
    meaning: "Perguntar taxa de conversão cambial.",
    example: "Excuse me, what’s the exchange rate for Reais today?",
    exampleTranslation: "Com licença, qual é o valor do câmbio para Reais hoje?",
    context: "Casas de câmbio.",
    category: "Restaurantes & Compras"
  },
  {
    id: 88,
    english: "Where can I exchange money?",
    translation: "Onde posso trocar dinheiro?",
    meaning: "Buscar postos de câmbio financeiro.",
    example: "Where can I exchange money safely inside the mall?",
    exampleTranslation: "Onde posso trocar de dinheiro com segurança dentro do shopping?",
    context: "Turistas recém-chegados.",
    category: "Restaurantes & Compras"
  },
  {
    id: 89,
    english: "Do you accept card?",
    translation: "Você aceita cartão?",
    meaning: "Verificar meio eletrônico de pagamento.",
    example: "I don't have paper bill. Do you accept card?",
    exampleTranslation: "Não tenho cédulas em papel. Você aceita cartão?",
    context: "Guichês mercantis variados.",
    category: "Restaurantes & Compras"
  },
  {
    id: 90,
    english: "I have a credit card.",
    translation: "Eu tenho um cartão de crédito.",
    meaning: "Oferecer crédito eletrônico.",
    example: "I have a credit card, is that okay?",
    exampleTranslation: "Eu tenho um cartão de crédito, tudo bem?",
    context: "Pagamento.",
    category: "Restaurantes & Compras"
  },
  {
    id: 91,
    english: "I’m learning English.",
    translation: "Eu estou aprendendo inglês.",
    meaning: "Declarar ser aprendiz do idioma inglês.",
    example: "I’m learning English online using this great app.",
    exampleTranslation: "Estou aprendendo inglês online usando este ótimo app.",
    context: "Explicar fala pausada ou erros gramaticais.",
    category: "Essenciais & Saudações"
  },
  {
    id: 92,
    english: "What’s the weather like?",
    translation: "Como está o tempo hoje?",
    meaning: "Perguntar sobre as condições atmosféricas.",
    example: "What’s the weather like today? Should I bring a coat?",
    exampleTranslation: "Como está o tempo hoje? Devo levar um casaco?",
    context: "Small talks e planejamentos externos.",
    category: "Essenciais & Saudações"
  },
  {
    id: 93,
    english: "It is very hot.",
    translation: "Está muito quente.",
    meaning: "Sinalizar sensação meteorológica de calor.",
    example: "Drink water regularly, it is very hot.",
    exampleTranslation: "Beba água regularmente, está muito quente.",
    context: "Tempo ensolarado.",
    category: "Essenciais & Saudações"
  },
  {
    id: 94,
    english: "It is cold.",
    translation: "Está frio.",
    meaning: "Dizer que a temperatura está fria.",
    example: "It is cold inside the hotel with the cooler on.",
    exampleTranslation: "Está frio dentro do hotel com o climatizador ligado.",
    context: "Metereologia.",
    category: "Essenciais & Saudações"
  },
  {
    id: 95,
    english: "Is it going to rain?",
    translation: "Vai chover?",
    meaning: "Perguntar se há probabilidade de tormenta pluvial.",
    example: "The sky is dense. Is it going to rain?",
    exampleTranslation: "O céu está nublado. Vai chover?",
    context: "Decidir usar guarda-chuva.",
    category: "Essenciais & Saudações"
  },
  {
    id: 96,
    english: "I love this song.",
    translation: "Eu amo esta canção.",
    meaning: "Amar faixa musical.",
    example: "Turn on the system, I love this song.",
    exampleTranslation: "Ligue o aparelho de som, eu amo esta canção.",
    context: "Momentos de celebração ou lazer.",
    category: "Essenciais & Saudações"
  },
  {
    id: 97,
    english: "Let’s work.",
    translation: "Vamos trabalhar.",
    meaning: "Iniciar o período de labor profissional.",
    example: "Ok, break limit is over. Let’s work.",
    exampleTranslation: "Ok, o limite da pausa acabou. Vamos trabalhar.",
    context: "Produtividade corporativa.",
    category: "Trabalho & Negócios"
  },
  {
    id: 98,
    english: "Good job!",
    translation: "Bom trabalho!",
    meaning: "Elogiar o desempenho profissional de alguém.",
    example: "Congratulations on the sales, good job!",
    exampleTranslation: "Parabéns pelas vendas, bom trabalho!",
    context: "Gerência e colegas em feedback de estímulo.",
    category: "Trabalho & Negócios"
  },
  {
    id: 99,
    english: "What are you doing?",
    translation: "O que você está fazendo?",
    meaning: "Interrogar atividade presente de outrem.",
    example: "Hi! What are you doing right now?",
    exampleTranslation: "Oi! O que você está fazendo exatamente agora?",
    context: "Contatos imediatos diários.",
    category: "Essenciais & Saudações"
  },
  {
    id: 100,
    english: "See you next time.",
    translation: "Até a próxima.",
    meaning: "Despedida com reencontro futuro assegurado.",
    example: "Thank you for the class, see you next time.",
    exampleTranslation: "Obrigado pela aula, até a próxima.",
    context: "Aulas ou encontros recorrentes.",
    category: "Essenciais & Saudações"
  }
];

export const PHRASES: Phrase[] = [
  ...BASE_PHRASES,
  ...PHRASES_101_200,
  ...PHRASES_201_300,
  ...PHRASES_301_400,
  ...PHRASES_401_500
];

// Helper categories list
export const CATEGORIES = [
  "Todos",
  "Essenciais & Saudações",
  "Viagens & Transporte",
  "Hospedagem & Hotel",
  "Restaurantes & Compras",
  "Trabalho & Negócios",
  "Emergências & Saúde"
];
