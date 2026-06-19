import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hadaraEvents, setHadaraEvents] = useState([]);
  const [coskasEvents, setCoskasEvents] = useState([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);
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
    if (isOpen && !eventsLoaded) {
      fetchEvents();
    }
  }, [isOpen]);

  const fetchEvents = async () => {
    try {
      const [hadaraSnap, tariqaSnap] = await Promise.all([
        getDocs(query(collection(db, 'hadara_djouma_events'), orderBy('date', 'asc'))),
        getDocs(query(collection(db, 'tariqa_events'), orderBy('date', 'asc')))
      ]);

      const now = new Date();

      const hadara = hadaraSnap.docs.map(d => ({ ...d.data(), id: d.id }));
      const upcomingHadara = hadara.filter(e => new Date(e.date) >= now);
      const pastHadara = hadara.filter(e => new Date(e.date) < now).slice(-8);
      setHadaraEvents([...pastHadara, ...upcomingHadara]);

      const coskas = tariqaSnap.docs
        .map(d => ({ ...d.data(), id: d.id }))
        .filter(e => e.category === 'COSKAS');
      const upcomingCoskas = coskas.filter(e => new Date(e.date) >= now);
      const pastCoskas = coskas.filter(e => new Date(e.date) < now).slice(-8);
      setCoskasEvents([...pastCoskas, ...upcomingCoskas]);

      setEventsLoaded(true);
    } catch (err) {
      console.error('Chatbot: erreur chargement événements', err);
      setEventsLoaded(true);
    }
  };

  const formatEventList = (events) =>
    events.map(e => {
      const d = new Date(e.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const loc = e.location ? ` — ${e.location}` : '';
      const desc = e.description ? ` (${e.description})` : '';
      return `• ${e.title} : ${d}${loc}${desc}`;
    }).join('\n');

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
      const hadaraSection = hadaraEvents.length > 0
        ? `\n\n## PROGRAMME ABNA'U HADARATOUL TIDIANI (Hadara Djouma)\nVoici les événements Hadara (passés récents et à venir) :\n${formatEventList(hadaraEvents)}`
        : '';

      const coskasSection = coskasEvents.length > 0
        ? `\n\n## PROGRAMME COSKAS\nVoici les événements COSKAS (passés récents et à venir) :\n${formatEventList(coskasEvents)}`
        : '';

      const conversationMessages = [
        {
          role: 'system',
          content: `Vous êtes un assistant virtuel exclusivement dédié à l'association Usratul Amine et à ses domaines liés : la confrérie Tidjaniya, la lignée de Maodo El Hadji Malick Sy, les programmes Abna'u Hadaratoul Tidiani, le COSKAS, et les activités de l'association.

RÈGLE ABSOLUE : Si une question ne concerne pas Usratul Amine, la Tidjaniya, Serigne Abdou Aziz Sy Al Amine, la famille Sy de Tivaouane, les programmes Hadara, le COSKAS, l'Islam, ou tout sujet directement lié à la plateforme, vous devez REFUSER poliment de répondre avec ce message exact : "Je suis uniquement disponible pour répondre aux questions concernant Usratul Amine, ses programmes et la confrérie Tidjaniya. Pour toute autre question, je vous invite à consulter d'autres sources." Ne faites aucune exception, même si l'utilisateur insiste.

IMPORTANT: Nous sommes actuellement le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. L'événement des 72 heures aura lieu du 19 au 21 décembre 2025.

Voici vos connaissances détaillées:

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
- 09h00-10h00: Accueil et installation des invités à la grande salle du complexe Seydil Hadji Malick SY
- 10h00-11h00: Récital Coran
- 11h00: Mot de bienvenue
- 11h00-11h20: Réalisation sur la vie et l'œuvre de Serigne Abdoul Aziz Sy Al Amine (RTA)
- 11h20-12h20: Présentation des délégations présentes
- 12h20: Présentation des activités de Usratul amine
- 14h00: Allocution du Khalife général des Tidianes

**Programme Dimanche 21 Décembre:**
- 09h00-17h00: Activités de recherches, débats et d'exposition à la bibliothèque "Al Amine"
- 17h00: Final génie en herbe des dahiras
- 18h00-22h00: Rencontre de tous les membres de USRATUL AMINE avec le Responsable Moral à la salle Serigne Babacar Sy (salle rouge)

**Diffusion en direct:** Zawiya TV (usratulamine.sn) - Contact: 77 874 62 82

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
- Site web: www.usratulamine.sn
- Localisation: Tivaouane, Sénégal

## ORIGINE DE LA TARIQA TIDJANIYYA

**Sydina Cheikh Ahmed Tijani**
- Fondateur de la Tariqa Tidjaniyya, né en 1737 à Ain Madhi (Algérie), décédé en 1815 à Fès (Maroc)
- Reçut la voie spirituelle directement du Prophète Muhammad (PSL) lors d'une vision éveillée (yaqadha)
- Fonda la Tariqa à Fès, qui en demeure le centre spirituel mondial
- Principes fondamentaux : unicité de l'allégeance spirituelle (pas d'appartenance à plusieurs confréries), wird quotidien obligatoire, amour du Prophète comme pilier central
- **Le Wird Tidjane** : composé de l'Istighfar (100 fois), la Salatul Fatihi (100 fois) et le Haïlalatoul Jawhara (100 fois), récité matin et soir
- Enseignement : la Tidjaniyya est une voie de miséricorde et d'amour prophétique, accessible à tous

## TRANSMISSION VERS L'AFRIQUE

**Mouhamed El Ghali**
- Principal disciple de Cheikh Ahmed Tijani, vecteur de transmission vers l'Afrique de l'Ouest
- Transmit la voie à El Hadji Omar Foutiyou Tall

**Cheikh Omar Foutiyou Tall (El Hadji Omar Tall)**
- Grand érudit et guide spirituel du 19ème siècle, né vers 1797 au Fouta Toro (actuel Sénégal)
- Reçut le wird tidjane lors de son pèlerinage à La Mecque et à Fès
- Pionnier de l'expansion de la Tariqa Tidjaniyya en Afrique de l'Ouest
- Auteur du "Rimah", ouvrage de référence sur la Tidjaniyya
- Contribua à islamiser de vastes territoires en Guinée, au Mali et au Sénégal

**Expansion en Afrique de l'Ouest**
- La Tidjaniyya est aujourd'hui la confrérie la plus répandue en Afrique de l'Ouest
- Des millions de fidèles au Sénégal, Guinée, Mali, Niger, Nigeria et au-delà

## IMPLANTATION AU SÉNÉGAL — SEYDI EL HADJI MALICK SY (MAODO)

**Biographie de Maodo**
- Né en 1855 à Gaé (Podor), décédé en 1922 à Tivaouane
- Reçut le wird tidjane et devint le plus grand propagateur de la Tidjaniyya au Sénégal
- **Fondation de Tivaouane** comme capitale spirituelle de la Tidjaniyya sénégalaise
- Titre honorifique : "Maodo" (le Grand Guide)

**Enseignement**
- Allia Islam et modernité : prôna l'instruction coranique ET l'école française
- Défenseur de la paix sociale et du dialogue interreligieux
- Forma des milliers d'érudits et de guides spirituels

**Le Gamou de Tivaouane**
- Célébration annuelle de la naissance du Prophète Muhammad (PSL) — Mawlid
- Un des plus grands rassemblements religieux d'Afrique, attirant des millions de fidèles
- Organisé à Tivaouane chaque année, symbole de l'unité de la communauté tidiane

**Œuvres écrites**
Seydi El Hadji Malick Sy a laissé une œuvre littéraire, théologique et poétique monumentale, principalement rédigée en arabe, traitant de jurisprudence islamique, de soufisme, de la vie du Prophète et d'éducation spirituelle.

*Ouvrages théologiques et de jurisprudence :*
- **Khilâçuz-Zahab (L'or décanté)** : Son œuvre majeure — biographie poétique et historique complète sur la vie et l'œuvre du Prophète Mouhammad
- **Fâkihatut-Tullâb (Le fruit des chercheurs)** : Guide fondamental en vers expliquant la doctrine, les règles et les pratiques spirituelles de la Tijaniyya
- **Kifâyatour-Râghibîne (Ce qu'il faut aux désireux)** : Traité de jurisprudence islamique et de théologie abordant droit et morale
- **Ifhâm al-Munkir al-Jânî (La réduction au silence du dénégateur)** : Ouvrage de défense théologique répondant aux critiques contre le soufisme et la Tijaniyya
- **Khutbatul Nikah** : Recueil de sermons et de directives concernant le mariage en Islam

*Poèmes et chants religieux (Khassaïdes) :*
- **Tayssîr (Wassîlatul Munâ)** : Célèbre poème d'imploration divine et de prière sur le Prophète, récité pour solliciter les bienfaits de Dieu
- **Abada Buruq** : Qasîda mystique très rythmée et populaire lors des célébrations religieuses
- **Ya Kaachifa Dahi** : Chant de dévotion et d'invocation pour surmonter les difficultés et épreuves de la vie
- **Falaboudda** : Poème d'exhortation spirituelle rappelant les devoirs incontournables du croyant envers son Créateur

Ces ouvrages sont analysés dans de nombreuses thèses universitaires, notamment par le Professeur El Hadji Ravane Mbaye dans sa collection « Le grand savant El Hadji Malick Sy : Pensée et action ». Ils sont enseignés dans les daara et instituts islamiques du Sénégal et au-delà.

*Où consulter et télécharger les œuvres de Maodo :*
- **Sopnaby France** : https://sopnabyfrance.com/bibliotheque-seydil-hadji-malick-sy/ — téléchargement direct de Khilâçuz-Zahab, Fâkihatut-Tullâb, Kifâyatour-Râghibîne, Abada Buruq et autres
- **Internet Archive** : https://archive.org/details/sidi-el-hadj-malick-sy-rta — lecture en ligne ou téléchargement gratuit de manuscrits numérisés
- **Application mobile Android** : https://play.google.com/store/apps/details?id=mcnstudio.khilass&hl=fr — application Khilâssou Zahab pour lecture quotidienne
- **Tayssîr (PDF complet)** : https://fr.scribd.com/document/509446667/TAI-SSIR-Seydi-El-Hadji-Malick-Sy
- **Fâkihatut-Tullâb (PDF)** : https://fr.scribd.com/document/454602310/Fakihatou-Toulab
- **Khilâçuz-Zahab Chapitre 1** : https://fr.scribd.com/document/832319484/khilassou-Zahab-Chapitre-1

## KHILÂSS ZAHAB (« L'OR DÉCANTÉ ») — DÉTAIL DE L'ŒUVRE

**Présentation** : Le Khilâss Zahab (Khilâçuz-Zahab) est l'œuvre majeure de Seydi El Hadji Malick Sy (Maodo) : un poème biographique en 30 chapitres (en vers arabes, mètre « basît ») retraçant toute la vie du Prophète Mouhammad (PSL), depuis la lumière prophétique transmise de génération en génération jusqu'à sa mort à Médine. C'est un texte de référence étudié dans les daara et instituts islamiques.

**Résumé détaillé chapitre par chapitre** (utilise ces détails précis — noms, anecdotes, chiffres — pour répondre en profondeur à une question sur un chapitre donné, pas seulement le thème général) :

- **Chapitre 1** : La lumière prophétique, créée avant toute chose, est transmise de génération en génération (Adam, Seth, Hénoch, Noé, Abraham...) jusqu'au Prophète, comparé à la pleine lune (« Badr »). Hawa (Ève) n'eut qu'un seul enfant non jumeau, Seth, en l'honneur de cette lumière unique.
- **Chapitre 2** : Généalogie complète : Muhammad fils d'Abdallah, fils de Shayba (Abd al-Muttalib), fils de Hâshim, Abd Manâf, Qusayy, Kilâb, Murra, Ka'b, Luwayy, Ghâlib, Fihr, Mâlik, Nadr, jusqu'à Nizâr, Ma'ad et Adnân. Récit du transfert forcé de Ma'ad en Syrie sous Nabuchodonosor puis son retour. Hadith cité : « Les Arabes sont les meilleurs des hommes, Quraych la meilleure tribu, et le Prophète le meilleur de Quraych. »
- **Chapitre 3** : Amina bint Wahb, mère du Prophète, descend de Zuhra via Kilâb — point de jonction généalogique commun avec la branche paternelle. Sa propre mère est Barra, dont la mère est Umm Habîb.
- **Chapitre 4** : Abraha, gouverneur chrétien du Yémen, marche sur la Mecque avec une armée d'éléphants (dont Mahmûd) pour détruire la Ka'ba. Abd al-Muttalib réclame seulement ses chameaux et déclare que DIEU protégera Sa Maison. Des oiseaux (Ababil) bombardent l'armée de pierres d'argile (sourate Al-Fîl) ; Abraha, vaincu, fait un rêve annonçant la naissance d'un enfant qui sera suivi par toutes les créatures.
- **Chapitre 5** : Après la tribu de Jourhoum, les Khuza'a gardent la Ka'ba jusqu'à ce que Qusayy, ayant épousé Hubba (fille du chef Khuza'a Hulayl), la reprenne pour les Quraych. Le puits de Zamzam, comblé par jalousie, est redécouvert par Abd al-Muttalib suite à un rêve (on y trouve aussi de l'or et des armures). Ayant fait le vœu de sacrifier un fils s'il en avait dix, le tirage au sort désigne Abdallah (père du Prophète) ; sa vie est rachetée par cent chameaux après plusieurs tirages.
- **Chapitre 6** : Abd al-Muttalib épouse Fatima bint Amr, qui lui donne Abdallah à 18 ans. Abdallah épouse Amina ; la conception du Prophète est accompagnée de signes prodigieux. La naissance survient un lundi du mois de Rabi al-Awwal : ouverture des portes du ciel, gémissement de Satan, visite des prophètes (Adam, Seth, Idris, Noé, Houd, Abraham) pour le féliciter. Allaité d'abord par Thuwayba puis par Halima bint Abi Dhuayb, dont le bétail stérile devient miraculeusement prodigue en lait.
- **Chapitre 7** : Amina meurt à Abwa quand le Prophète a 4 ou 6 ans ; il est recueilli par son grand-père Abd al-Muttalib (qui meurt à son tour quand l'enfant a 8 ans) puis par son oncle Abu Tâlib. À 12 ans, voyage en Syrie où le moine Bahîra reconnaît les signes de la prophétie sur son corps. Épisode du « Jour de Fijar » et du Pacte des Vertueux (Hilf al-Fudûl) pour défendre les opprimés.
- **Chapitre 8** : Mariage avec Khadija bint Khuwaylid (lui 25 ans, elle 40), dot de vingt chameaux. À 35 ans, il participe à la reconstruction de la Ka'ba endommagée par une crue, et pose lui-même la Pierre Noire après avoir résolu un différend entre les clans grâce à un tissu sur lequel chacun tenait un coin.
- **Chapitre 9** : À presque 40 ans, vision d'une lumière blanche à l'aube. La première Révélation a lieu un lundi de Ramadan dans la grotte de Hira : l'Ange Gabriel (Rûh al-Qudus) lui ordonne « Lis ! » (Iqra). Effrayé, il rentre chez Khadija qui le rassure ; son cousin Waraqa ibn Nawfal confirme qu'il s'agit du même mystère reçu par Moïse. Premiers convertis : Khadija, Ali, Abu Bakr, Zayd, Uthman. Prédication secrète pendant 3 ans dans la maison d'Al-Arqam (39 compagnons).
- **Chapitre 10** : Les pires ennemis sont nommés (Abu Lahab, Aswad, Walid, Hârith...). Les faibles et esclaves convertis sont persécutés — Bilâl, Ammâr, Suhayb, et la famille de Yâsir dont Sumayya, première martyre de l'islam. Première émigration vers l'Abyssinie (12 hommes, 4 femmes) en l'an 5, accueillis par le Négus qui refuse de les extrader malgré l'émissaire Amr ibn al-As ; deuxième émigration plus nombreuse ensuite.
- **Chapitre 11** : Les Quraych boycottent les Banu Hâshim ; le document du boycott, rongé par les termites (seul le nom de DIEU est épargné), pousse à lever le boycott après 2 à 3 ans. « Année de la tristesse » : mort d'Abu Tâlib (à 87 ans) puis de Khadija trois jours après (après 25 ans de mariage). Voyage à Taïf pour chercher du soutien : rejeté et lapidé jusqu'au sang, il prie pour la patience ; rencontre des djinns à Nakhla (sourate Al-Jinn) ; protégé à son retour à la Mecque par Mut'im ibn Adiy.
- **Chapitre 12** : Le Voyage Nocturne (Isra) sur Al-Burâq puis l'Ascension (Mi'raj) à travers les cieux où il rencontre Adam, Jésus, Joseph, Hénoch, Aaron, Moïse et Abraham ; négociation des cinq prières quotidiennes (valant cinquante) sur l'insistance de Moïse. L'Hégire vers Médine suit : complot de Dar an-Nadwa, Ali dort à sa place, fuite avec Abu Bakr vers la grotte de Thawr (protégée par une toile d'araignée, un pigeon et un arbre), poursuite de Suraqa. À Médine, sa chamelle Qaswâ choisit elle-même l'emplacement de la future mosquée ; construction de la mosquée du Prophète (toit en palmes) avec la « Suffa » pour les pauvres.
- **Chapitre 13** : Liste des bannières de guerre confiées à Hamza, Ubayda puis Sa'd. Entre 26 et 29 expéditions militaires sont dénombrées (Abwa, Buwât, Badr, Uhud, la Tranchée/Khandaq, Hudaybiyya, Khaybar, Tabûk...). Quatre pèlerinages avant l'Hégire puis le grand Pèlerinage d'Adieu en l'an 10.
- **Chapitre 14** : Enfants du Prophète et de Khadija : Al-Qâsim et Abdallah (morts en bas âge), Zaynab, Ruqayya, Umm Kulthûm, Fâtima ; et Ibrâhîm, né à Médine de Maria la Copte, mort jeune. Zaynab épouse Abu al-As ibn Rabî' (capturé à Badr, libéré contre rançon). Ruqayya puis Umm Kulthûm épousent Uthman (surnommé « l'homme aux deux lumières »). Fâtima, dite « Al-Batûl », épouse Ali et donne Hasan, Husayn, Zaynab et Umm Kulthûm.
- **Chapitre 15** : Les onze épouses, « mères des croyants » : Khadija (1ère, morte 3 ans avant l'Hégire à 65 ans), Sawda bint Zama'a, Aïcha bint Abu Bakr (mariée à 6 ans, union consommée à 9 ans, savante ayant transmis plus de 2000 hadiths), Hafsa bint Umar, Zaynab bint Khuzayma (« Umm al-Masâkîn », morte peu après le mariage), Umm Salama (Hind), Zaynab bint Jahsh, Juwayriya bint al-Hârith, Safiya bint Huyayy (d'origine juive, descendante d'Aaron), Maymûna bint al-Hârith (dernière épousée), et Rayhâna (statut discuté).
- **Chapitre 16** : Détail généalogique des « Fatima » dans l'ascendance du Prophète et des neuf tantes paternelles surnommées Al-Awâtik.
- **Chapitre 17** : Les oncles paternels — Hamza et Abbas se sont convertis à l'islam ; Abu Tâlib, Abu Lahab, Hârith, Zubayr, Muqawwim, Dirâr, Abd al-Ka'ba, Hajl et Ghaydâq ne se sont pas convertis.
- **Chapitre 18** : Suite généalogique : les mères des oncles et tantes paternelles, dont Hâla bint Wuhayb.
- **Chapitre 19** : Serviteurs principaux : Anas ibn Mâlik (le plus connu), Rabî'a, Ayman, Abdallah dhul-Hurum ; Bilâl gérait les dépenses ; Abu Râfi le Copte portait les charges lourdes ; Hudhayfa ibn al-Yamân détenait ses secrets.
- **Chapitre 20** : Suite des serviteurs et affranchis (au total une quarantaine d'hommes affranchis sont cités) ainsi que les femmes à son service comme Salma, Khawla, Barra, Maymûna, Umm Ayyâsh.
- **Chapitre 21** : Gardes du corps (Sa'd ibn Mu'âdh, Khâlid, Abu Bakr...), ceux qui chantaient des poèmes pendant les voyages (Anjasha, Barâ), son négociateur Thâbit, ses conseillers religieux/muftis (Salmân, Ibn Mas'ûd, Abu Dardâ), ses muezzins (Bilâl, Ziyâd, Sa'd, le non-voyant Abdallah ibn Umm Maktûm). La garde personnelle cesse après la révélation d'un verset de protection divine.
- **Chapitre 22** : Chaque prophète a sept « ministres » mais le Prophète en a eu le double (quatorze), incluant ses petits-fils Hasan et Husayn, Ali, Ja'far, Umar, Hamza, Abu Bakr. Les dix Compagnons promis au Paradis sont cités. Liste des ambassadeurs envoyés aux rois : Dihya auprès d'Héraclius, Abdallah auprès de Chosroès (qui déchira la lettre — son empire fut détruit plus tard), Amr ibn al-As auprès du Négus (converti), Hâtib auprès du Muqawqis d'Égypte (offrit des cadeaux dont Maria la Copte, sans se convertir), et l'épisode de Musaylima le faux prophète.
- **Chapitre 23** : Chevaux nommés Sakb (premier cheval de guerre, robe alezane, étoile blanche au front), Sabha, Dhârib, Sijl, Tirf, Lizâz, Dhul Uqâb. Mulets Fidda et Duldul (offert par le Muqawqis). Sa chamelle Qaswâ (qui choisit l'emplacement de la mosquée de Médine), Adbâ et Jad'â. Quarante-cinq chamelles laitières, dont vingt à traire chaque nuit pour les nécessiteux ; un troupeau constant de cent moutons ; un coq blanc qui chantait toute la nuit pour le réveiller à la prière.
- **Chapitre 24** : Ses sabres dont le célèbre Dhu'l-Fiqâr (capturé à Badr, garni d'argent), ainsi que Ma'thûr, Mikhdham, Battâr. Cinq arcs, plusieurs boucliers et lances, sept cottes de mailles, des casques (Mighfar en fer), des bannières (noire « Uqâb », blanche, jaune), une bague à inscription « Muhammad, Messager de DIEU » (perdue plus tard dans le puits d'Arîs), sa canne de marche (Mamshûq/Urjûn) et sa tente nommée Kinn.
- **Chapitre 25** : L'« Année des Délégations » (an 9 de l'Hégire) voit converger des dizaines de tribus pour se convertir : Muzayna, Banu Sa'd, Judhâm, Daws, Sulaym, Hamdân, Khawlân, Kinda, Ghâmid, Ghassân, les chrétiens de Najrân (autorisés à garder leur foi contre une redevance), Taghlib (mixte musulmans/chrétiens), Banu Hanîfa, et bien d'autres listées nommément. Le Coran confirme même la venue d'une délégation de djinns (sourate Al-Jinn).
- **Chapitre 26** : Portrait physique détaillé : visage rayonnant comme la lune, grand front, sourcils joints et épais, grands yeux noirs comme teints au khôl, nez fin, joues lisses où la sueur perlait comme de l'or, parfum surpassant le musc, taille moyenne, large poitrine, le Sceau de la Prophétie entre les épaules (grain de beauté), cheveux longs et fins, démarche rapide et légère, large bouche avec un espacement entre les dents de devant, barbe fournie teinte au henné, moins de vingt cheveux blancs à sa mort, pudeur extrême.
- **Chapitre 27** : Les devoirs envers le Prophète : lui obéir, l'aimer en actes (suivre sa Sunna) et non seulement en parole, désirer ardemment le rencontrer, multiplier les invocations et prières sur lui, soutenir sa religion, imiter son caractère. Le Coran est présenté comme la « balance » qui mesure cet amour.
- **Chapitre 28** : Environ 3000 miracles lui sont attribués, dont 70 mentionnés dans le Coran. Exemples cités nommément : guérisons, multiplication d'une poignée de dattes pour nourrir une famille longtemps (Abu Hurayra), eau jaillissant de ses doigts pour abreuver des milliers d'hommes, témoignage d'une chamelle innocentant son maître devant le Prophète, un lézard et un loup témoignant de sa mission, une viande empoisonnée qui le prévient du poison, un tronc de palmier qui gémit comme une mère affligée, une tige de palmier devenue sabre (« Awn ») entre les mains d'Ukâsha.
- **Chapitre 29** : Ses noms et titres honorifiques : Muhammad, Ahmad, Al-Mâhî (celui qui efface la mécréance), Al-Hâshir (le premier ressuscité), Nabi ar-Rahma (Prophète de la Miséricorde), Nabi at-Tawba (du repentir), Al-Muqaffî et Al-Âqib (le dernier des prophètes), et d'autres encore listés par ordre alphabétique par Al-Mawâhib.
- **Chapitre 30** : Sa maladie et sa mort durant le mois de Safar de l'an 11 de l'Hégire, à 63 ans, après avoir choisi la compagnie de son Seigneur plutôt que les biens de ce monde. Ses dernières recommandations portent sur la prière et le sort de ses serviteurs. Confusion des compagnons à l'annonce (Uthman muet, Umar comme hébété, Ali paralysé de douleur) jusqu'au discours apaisant d'Abu Bakr. L'enterrement est retardé par les débats de succession ; la toilette funèbre est faite par Ali, Abbas et ses fils, Aws et Shuqrân ; il est enseveli dans trois linceuls blancs du Yémen sans turban, dans la chambre d'Aïcha, la tombe calée de neuf pierres ; les fidèles ont prié sur lui individuellement, sans imam unique. Le chapitre se termine par la prière finale de Maodo demandant le pardon et l'intercession du Prophète.

Si un visiteur pose une question précise sur un personnage, un événement ou un chapitre du Khilâss, utilise ces détails pour répondre de façon complète et nommée. Si la question dépasse ces résumés (citation exacte d'un verset, traduction littérale), invite-le à consulter l'œuvre complète via les liens de téléchargement ci-dessus.

## LES FILS DE MAODO

1. **Seydi Ahmed Sy** : Fils aîné, érudit reconnu
2. **Serigne Babacar Sy** (1885-1957) : 1er Khalife de Maodo (1922-1957), structura la Tidjaniyya au Sénégal
3. **Serigne Mouhamadou Mansour Sy (1er du nom)** : Érudit et figure spirituelle
4. **Serigne Abdou Aziz Sy Dabakh** (?-1997) : 3ème Khalife (1957-1997), figure centrale de la confrérie

## LES GRANDS HÉRITIERS DE SERIGNE BABACAR SY

**Serigne Mansour Sy Borom Daara Ji (1932-2012)**
- Connu pour sa finesse d'esprit, sa culture encyclopédique et sa maîtrise des sciences islamiques
- 4ème Khalife Général des Tidianes (1997-2012)
- "Borom Daara Yi" : figure de l'enseignement coranique au Sénégal

**Cheikh Ahmed Tidiane Sy Al Makhtoum (1925-2011)**
- Fils de Serigne Babacar Sy, figure vénérée
- 5ème Khalife Général des Tidianes (2012-2017)
- Symbole de piété et de spiritualité profonde

**Serigne Abdou Aziz Sy Al Amine (1928-2017)**
- 6ème Khalife Général des Tidianes (mars-septembre 2017)
- Longtemps porte-parole de la confrérie, médiateur et unificateur national
- Fondateur de la Hadaratoul Jumaa Populaire et du COSKAS
- (voir biographie détaillée ci-dessus)

## DIRECTION ACTUELLE — SERIGNE BABACAR SY MANSOUR

**Parcours**
- Né en 1932, fils de Serigne Mouhamadou Mansour Sy (1er du nom)
- 7ème et actuel Khalife Général des Tidianes depuis septembre 2017
- Grand érudit, connu pour sa sagesse et son autorité spirituelle

**Enseignements**
- Continuité de la voie de Maodo : paix, tolérance, amour du Prophète
- Encourage la jeunesse à allier formation islamique et réussite citoyenne
- Porte une attention particulière à l'unité de la famille de Tivaouane

**Grands projets réalisés à Tivaouane**
- **Modernisation de la Grande Mosquée de Tivaouane** : extension et rénovation de la mosquée principale, symbole architectural et spirituel de la cité sainte
- Développement des infrastructures religieuses et éducatives de Tivaouane
- Rayonnement international de la cité sainte

## ARBRE SPIRITUEL DE TRANSMISSION

Sydina Cheikh Ahmed Tijani
↓
Sidi Mouhamed El Ghali
↓
El Hadji Omar Foutiyou Tall
↓
Seydi El Hadji Malick Sy (Maodo)
↓
Serigne Babacar Sy
↓
Serigne Mansour Sy Borom Daara Ji
↓
Serigne Babacar Sy Mansour (Khalife actuel)

## ARBRE DES KHALIFES DE TIVAOUANE

1. Serigne Babacar Sy (1922–1957)
2. Serigne Mouhamadou Mansour Sy — quelques jours en 1957
3. Serigne Abdou Aziz Sy Dabakh (1957–1997)
4. Serigne Mansour Sy Borom Daara Ji (1997–2012)
5. Cheikh Ahmed Tidiane Sy Al Makhtoum (2012–2017)
6. Serigne Abdou Aziz Sy Al Amine (mars–septembre 2017)
7. Serigne Babacar Sy Mansour (depuis septembre 2017)

Répondez toujours avec respect, précision et bienveillance. Utilisez ces informations pour aider les visiteurs à mieux comprendre l'héritage de Serigne Abdou Aziz Sy Al Amine et la mission de l'association.${hadaraSection}${coskasSection}`
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
                    {message.role === 'assistant' ? (
                      <div className="text-sm prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-gray-900">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
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
