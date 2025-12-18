import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const conversationMessages = [
        {
          role: 'system',
          content: `Vous êtes un assistant virtuel expert pour l'association Usratul Amine. Voici vos connaissances détaillées:

## LIGNÉE DES KHALIFES DE MAODO
1. **Serigne Babacar Sy** (1885-1957) : Premier khalife, fils de Maodo (El Hadji Malick Sy), qui a structuré la tidjaniya au Sénégal. Khalife du 27 Juin 1922 au 25 Mars 1957.

2. **Seydi Mouhamadou Mansour Sy** (1925-2012) : Surnommé "Balkhawmi", il ne fut Khalife que quatre jours du 25 Mars au 29 Mars 1957.

3. **Seydi Abdoul Aziz Sy Dabbakh** (?-1997) : Successeur de Mansour Sy, figure centrale. Khalife du 25 Mars 1957 au 14 Septembre 1997.

4. **Serigne Mouhamadou Mansour Sy** (1932-2012) : "Borom Daara Yi", connu pour sa finesse d'esprit et sa culture. Khalife du 14 Septembre 1997 au 09 Décembre 2012.

5. **Seydi Cheikh Ahmed Tidjan SY Al Makhtom** (1925-2011) : Fils de Babacar Sy. Khalife du 09 Décembre 2012 au 15 Mars 2017.

6. **Serigne Abdoul Aziz Sy Al Amine** (1928-2017) : Porte-parole des Tidianes avant de devenir khalife. Khalife du 15 Mars 2017 au 22 Septembre 2017.

7. **Serigne Babacar Sy Mansour** (né en 1932) : Actuel Khalife Général des Tidianes depuis septembre 2017.

## SERIGNE ABDOU AZIZ SY AL AMINE - BIOGRAPHIE DÉTAILLÉE

**Origines et Formation:**
- **Né en 1928 à Tivaouane**, ville sainte, décédé le 22 septembre 2017
- **6ème Khalife Général des Tidianes** (mars à septembre 2017, soit 6 mois)
- Fils de **Serigne Babacar Sy** (1er Khalife de Maodo) et **Sokhna Astou Kane**
- Formé par Serigne Alioune Gueye avec ses frères Serigne Mansour et Serigne Cheikh
- Dès l'âge de 16 ans, il devint le secrétaire et bras droit de son père
- Son père disait: "Serigne Abdou est un cadeau divin pour moi, Dieu me l'a donné pour qu'il m'assiste à réussir ma mission"

**Accession au Khalifat:**
- Succéda à son frère Serigne Cheikh Ahmed Tidiane Al Makhtom le 15 mars 2017
- Fut longtemps porte-parole de la confrérie Tidiane, de Mame Dabbakh à Al Makhtom
- Après la disparition de Serigne Mansour Sy en 2012, malgré l'incertitude, il manifesta un désintéressement total à la chaise du khalife par loyauté
- Il déclara: "Pour respecter notre tradition, Serigne Cheikh est le khalife car il est le plus âgé, même s'il ne viendrait pas. Son absence ne nous empêchera pas de continuer la mission de Maodo"

**Personnalité Multidimensionnelle:**
- **Guide religieux et citoyen modèle** : Sa mission outrepassait les frontières d'un simple guide spirituel
- **Médiateur, modérateur, conciliateur et unificateur** de la famille de Maodo, de la communauté musulmane et de la Nation
- **Champion en régulation sociale, diplomatie, agriculture, géopolitique, économie, éducation et communication**
- Esprit d'ouverture et sens aigu des relations humaines
- **Patriote convaincu**: "Khutbul watane, minal imaan" (aimer et croire en son pays est un acte de foi)
- Modeste, sobre, austère et frugal
- **Mystique illuminé** avec un charisme profond et une "œillade incopiable"
- **Intelligence situationnelle** ou "Conscience solutionniste" selon Bathie Diouf
- Hérité de Khalifa Ababacar Sy la clairvoyance et l'altruisme
- Hérité de Seydi Abdoul Aziz Sy Dabbakh la générosité et le sens des relations humaines

**Événements Historiques Majeurs:**

*L'incident de Juin 2012 (Zawiya de Dakar):*
- Des policiers poursuivant des manifestants ont lancé des grenades lacrymogènes dans la Zawiya El Hadji Malick Sy de Dakar
- Le ministre de l'intérieur Ousmane Ngom se rendit à Tivaouane pour présenter ses excuses
- Al Amine assura avec fermeté la défense du ministre contre la colère des disciples
- Il déclara: "C'est moi qui ai demandé aux policiers d'intervenir car Ousmane Ngom est une autorité sous ma responsabilité. Je me devais de le protéger"
- Il empêcha ainsi un lynchage et préserva l'honneur de la famille Sy
- Son attitude fut celle d'un homme serein et calme quand tous étaient furieux, stable mentalement quand tous étaient dominés par l'émotion

**Réalisations Majeures:**

1. **COSKAS (1968)** : Créateur du Comité d'Organisation Khalifa Ababacar Sy - structure de disciples vêtus en vert, couleur de l'Islam, lors des Gamou et Ziarra

2. **Zawiya El Hadji Malick Sy de New York** : Édifice précieux de l'Islam aux USA, symbolisant l'Islam pacifique, tolérant et universitaire prôné par Maodo. Fierté pour la communauté africaine et sénégalaise.

3. **Hadaratoul Jumma Populaire** : Réalisation phare devenue un événement religieux de grande envergure, se tenant périodiquement à l'intérieur et à l'extérieur du pays, sous la supervision d'Abna'u Hadaratoul Tidianiyya

4. **Formation des Jeunes** : Méthode de responsabilisation et formation de jeunes capables de représenter dignement la Khadara Malikia
   - Ambassadeurs formés: Mouhamadou Fatta Sarr (coordonnateur national Abna'u), Pape Samba Diop (Mbao), Mansour Diop (Saly), Malick Mbaye Bolle (Keur Massar), Omar Ndoye (Malika), Hady Mbaye (Thiès), et bien d'autres

5. **Structures dédiées à Al Amine** : Nombreuses entreprises créées en son honneur:
   - Al Amine des Bijoux, Pharmacie Al Amine, Restaurant Al Amine, Fast Food Al Amine, Al Amine Optique, Alimentation Al Amine, Al Amine Service, Al Amine Vision, Al Amine Social

**Principes et Enseignements:**
- "Nous sommes vos guides mais il faut vous refuser ce que nous refusons et accepter ce que nous acceptons"
- Il n'a jamais défendu l'indéfendable ni utilisé la confiance des disciples pour en tirer profit
- Il n'a jamais couru derrière les opportunités de l'État
- Il invitait les disciples à préserver leur dignité face à toute situation
- Synthèse vivante de Mame Khalifa et de Mame Dabakh
- Visionnaire hors classe avec une perception prospective

## L'ASSOCIATION USRATUL AMINE
**Mission:** Préserver et honorer l'héritage exceptionnel de Serigne Abdou Aziz Sy Al Amine

**5 Axes majeurs (les "72 heures"):**
1. **Formation de la jeunesse** - Formation morale et spirituelle
2. **Transmission du savoir** - Préservation et partage des connaissances
3. **Consolidation du vivre-ensemble** - Unité et harmonie
4. **Promotion de la bonne gouvernance sociale**
5. **Engagement citoyen** au service de la Nation

**Responsable Moral:** Serigne Sidy Ahmed Sy Al Amine

## ÉVÉNEMENT 2025 - LES 72 HEURES
**Dates:** 19-20-21 Décembre 2025 à Tivaouane, Sénégal

**Programme Vendredi 19 Décembre:**
- 09h-13h30: Récital du Coran au mausolée
- 14h15: Prière du vendredi à la mosquée de Serigne Babacar Sy
- 15h00: Mise en place au stade Elhadji Moustapha Niang
- Hadaratul Jumaa (COF, ABNA'U, MUQTAFINA, FEDKAS)

**Programme Samedi 20 Décembre:**
- 09h00: Accueil invités au complexe Seydil Hadji
- 09h30: Allocution du Khalife général des Tidianes
- 10h00: Présentation activités Usratul Amine
- 11h30: Adh Sy Al Amine (DFAA)
- 12h00: Récitation sur la vie et l'œuvre de Serigne Abdou Aziz Sy

**Programme Dimanche 21 Décembre:**
- 09h00: Recommandations et prières
- 14h00: Recommandations et Clôture
- 18h00: Activités bibliothèque "Al Amine"
- 18h00: Final Gamou
- 21h00: Rencontre des membres USRATUL

**Diffusion en direct:** Zawiya TV (www.zawiya.sn) - Contact: 77 874 62 82

## BIBLIOTHÈQUE AL AMINE
Collection d'ouvrages islamiques organisée en 6 rayons:
1. Tafsir du Saint Coran et ses sciences
2. Récits Prophétiques (Hadith) et ses sciences
3. Fiqh (jurisprudence islamique) et ses principes
4. Soufisme et ses écoles
5. Langue et littératures arabes
6. Revues et périodiques

## PIN'S USRATUL AMINE
- Slogan: "Mon pin's, mon engagement"
- Prix: 3 000 FCFA
- Commander au: 77 108 26 26

## CONTACT
- Téléphone: +221 77 108 26 26
- Site web: www.usratul-amine.com
- Localisation: Tivaouane, Sénégal

Répondez toujours avec respect, précision et bienveillance. Utilisez ces informations pour aider les visiteurs à mieux comprendre l'héritage de Serigne Abdou Aziz Sy Al Amine et la mission de l'association.`
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: inputMessage
        }
      ];

      const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
      const apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
      const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT;
      const apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;

      const url = `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          messages: conversationMessages,
          max_tokens: 800,
          temperature: 0.7,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        throw new Error('Azure OpenAI API error');
      }

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Assistant Usratul Amine</h3>
                  <p className="text-emerald-100 text-xs">En ligne</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="text-gray-800 font-semibold mb-2">Bienvenue!</h4>
                  <p className="text-gray-600 text-sm px-4">
                    Comment puis-je vous aider à en savoir plus sur Usratul Amine?
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                      <span className="text-sm text-gray-600">En train d'écrire...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all z-50 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default Chatbot;
