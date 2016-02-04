var React = require('react-native');
var s = require('../styles/style');

var {
  Component,
  Text,
  View,
  StyleSheet,
  ScrollView
} = React;
var Icon = require('react-native-vector-icons/FontAwesome');

var i18next = require('../libs/i18next');
var Button = require('react-native-button');
var Link = require('../components/Link');

i18next.addResourceBundle('en', 'eutc', {
  'back': 'Back'
});

class EutcView extends Component {
  constructor (props) {
    super(props);
  }

  render () {

    let topBar = (
      <View style={[styles.linkCtn, {marginTop:10, paddingLeft:10}]} >
        <Icon
          name='chevron-left'
          size={14}
          color='#808080'
          style={{marginTop: 2, marginRight: 2}}
        />
        <Link
          onPress={(this.onBack.bind(this))}
          text={i18next.t('forgot:back')}
          linkStyle={[s.link, styles.textGray]}
          type='bold'
        />
      </View>
    );
    if (this.props.fromNavigation) {
      topBar = (
        <View style={[styles.linkCtn, {marginTop:10, marginBottom:10}]} />
      );
    }

    return (
      <View >
        {topBar}
        <ScrollView style={styles.container}>
          <Text style={s.h1}>Conditions Générales d'Utilisation</Text>
          <View style={styles.spacer}/>
          <Text>Les présentes conditions générales d'utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions dans lesquelles la société Donut Systems SAS en cours de formation (ci-après dénommée « DONUT ») met à la disposition des internautes son service de messagerie instantanée (ci-après dénommé « Service ») et la manière dont les utilisateurs doivent utiliser le Service.</Text>
          <View style={styles.spacer}/>
          <Text>L'utilisateur accepte expressément les CGU lors de son inscription au Service.</Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Article I – DEFINTIONS</Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Contenus : <Text style={styles.text}>Textes, photos et/ou vidéos (y compris émoticônes,…) postés sur le Service par un Utilisateur dans leur ensemble et/ou éléments pris individuellement.</Text></Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Modérateur : <Text style={styles.text}>Utilisateur auquel des droits supplémentaires sont accordés au sein d'un Salon de Discussion afin qu'il assure le bon fonctionnement de la discussion conformément aux présentes CGU.</Text></Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Paramètres Modifiables de Salon : <Text style={styles.text}>Photo de profil du Salon, "poster" ou Papier Peint du Salon, Sujet du Salon</Text></Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Salon de discussion (ou donut) : <Text style={styles.text}>Espace de discussion instantanée identifié par un Nom de Salon (précédé de du caractère #) et dans lequel sont regroupés un certain nombre d'Utilisateurs afin qu'ils interagissent entre eux.</Text></Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Service : <Text style={styles.text}>Ensemble des fonctionnalités mises à la disposition de l'Utilisateur.</Text></Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Discussion Un-à-Un : <Text style={styles.text}>Discussion instantanée entre deux Utilisateurs.</Text></Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>URL d'Accès Direct : <Text style={styles.text}>Adresse internet spécifique permettant d'accéder directement au Salon de Discussion si l'Utilisateur est authentifié, ou à la page profil de Salon de Discussion si l'Utilisateur n'est pas authentifié.</Text></Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Utilisateur : <Text style={styles.text}>Visiteur du site DONUT ayant créé un compte pour bénéficier du Service. Le processus d'inscription fait partie de la démarche Utilisateur.</Text></Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Utilisateur Créateur de Salon : <Text style={styles.text}>Utilisateur ayant fait la démarche de créer un Salon de Discussion et qui bénéficie de droits élargis composés des droits de Modérateur auxquels s'ajoutent des droits spécifiques à l'Utilisateur Créateur de Salon.</Text></Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Public : <Text style={styles.text}>Se dit d'une fonctionnalité, d'une Salon de Discussion, ou d'un Contenu, accessible librement à tout Utilisateur ou plus largement à tout internaute.</Text></Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Privé : <Text style={styles.text}>Se dit d'une fonctionnalité, d'une Salon de Discussion, d'une Discussion Un-à-Un, ou d'un Contenu, accessible uniquement aux Utilisateurs autorisés.</Text></Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Article II – DESCRIPTION DU SERVICE</Text>
          <View style={styles.spacer}/>
          <Text>DONUT est un service de discussion instantanée généraliste. Les principales fonctionnalités du Service sont : la discussion en Salon de Discussion, la Discussion Un-à-Un, la publication d'un profil, public d'Utilisateur, la publication d'un profil public de Salon de Discussion, l'administration et la modération de Salon de Discussion.</Text>
          <Text style={styles.h2}>Article III – ACCES AU SERVICE</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur doit disposer d'un ordinateur récent doté d'un navigateur Internet récent à jour pour accéder au Service. L'accès par le navigateur Internet d'autres équipements (téléphones mobiles, tablettes…) peut être également possible, toutefois, DONUT ne peut en garantir l'accès dans des conditions optimales. L'Utilisateur doit également disposer d'une connexion Internet haut débit. L'Utilisateur fait son affaire de ces prérequis techniques.</Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Article IV – INSCRIPTION AU SERVICE ET CONNEXION</Text>
          <View style={styles.spacer}/>
          <Text>Avant sa première connexion au Service l'Utilisateur doit créer un compte via un processus d'inscription disponible sur le site DONUT au cours duquel il renseigne son e-mail, choisit un mot de passe et un Nom d'Utilisateur. Chaque Nom d'Utilisateur est unique sur le Service, aussi, tout Utilisateur ne peut choisir qu'un Nom d'Utilisateur qui n'est pas déjà attribué à un autre Utilisateur. Le Nom d'Utilisateur est définitif et n'est pas modifiable. La création d'un compte entraîne la création d'un profil public personnalisable. L'Utilisateur a la possibilité de modifier son profil (à l'exclusion de son Nom d'Utilisateur) à tout instant à partir de la rubrique « Mon compte ». L'Utilisateur peut à tout instant supprimer son compte DONUT en envoyant une demande par e-mail.</Text>
          <View style={styles.spacer}/>
          <Text>Le Service est réservé aux Utilisateurs majeurs. Lors de son inscription, l'Utilisateur certifie être majeur.</Text>
          <View style={styles.spacer}/>
          <Text>DONUT attire l'attention sur le fait qu'un compte Utilisateur et en particulier un Nom d'Utilisateur restent la propriété de DONUT et ne sont mis à la disposition de l'Utilisateur que dans le cadre des présentes CGU..</Text>
          <View style={styles.spacer}/>
          <Text>Par la suite, l'Utilisateur devra être authentifié pour accéder au Service à l'aide de son e-mail et de son mot de passe. L'authentification à partir de ce même terminal et même navigateur est maintenue active à l'aide d'un cookie pendant une durée maximale de deux ans à l'issue desquels elle expire. L'interruption ou la coupure de l'accès à Internet, de même que la mise hors tension ou le redémarrage du terminal ne coupent pas l'authentification. L'authentification peut être interrompue à tout instant par l'Utilisateur en cliquant sur le bouton « Déconnexion » présent dans la barre dans le menu, ou en supprimant le cookie du navigateur.</Text>
          <View style={styles.spacer}/>
          <Text>Afin de faciliter l'inscription au Service (création de compte) et l'authentification, l'Utilisateur a la possibilité de lier son compte DONUT à son compte Facebook TM, s'il en a un, via le système d'authentification Facebook Connect TM. L'Utilisateur choisit les informations qu'il autorise Facebook TM à transmettre à DONUT. Dans ce cas, l'Utilisateur utilise ses identifiant et mot de passe d'accès à Facebook TM. Pour plus d'explications quant au système Facebook Connect, se référer aux termes et conditions mis à disposition par Facebook TM. L'Utilisateur peut à tout instant supprimer le lien qui existe entre son compte DONUT et son compte Facebook TM, à partir de la rubrique « Mon compte » après sous réserve qu'il ait renseigné un e-mail et un mot de passe qui lui serviront aux futures identifications.</Text>
          <View style={styles.spacer}/>
          <Text>Pour des raisons de sécurité et de bonne marche du Service, DONUT se réserve le droit d'accepter ou de refuser toute tentative de connexion à son Service.</Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Article V – ENGAGEMENTS DE L'UTILISATEUR</Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>1 . Obligations relatives à tout Utilisateur</Text>
          <View style={styles.spacer}/>
          <Text>DONUT est un Service qui vise à permettre des échanges conviviaux au sein de communautés réunies en Salons de Discussion et/ou en Discussions Un-à-Un. L'Utilisateur s'engage à s'inscrire dans cette démarche, et à ce titre s'interdire les comportements perturbateurs de la convivialité tels que :</Text>
          <View style={styles.spacer}/>
          <Text>- Les provocations intentionnelles (parfois appelées « Troll ») ;</Text>
          <View style={styles.spacer}/>
          <Text>- Les publicités et en particulier pour des services de messagerie concurrents ;</Text>
          <View style={styles.spacer}/>
          <Text>- Les entrées et sorties intempestives des Salons de Discussions ;</Text>
          <View style={styles.spacer}/>
          <Text>- Les propos parasites ne s'inscrivant pas dans la conversation en cours ou la thématique du Salon de Discussion.</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur s'engage également ne pas détourner le Service de son objet, et notamment s'interdit :</Text>
          <View style={styles.spacer}/>
          <Text>- La collecte de données Utilisateurs à des fins commerciales ou non, avec ou sans l'approbation des Utilisateurs ;</Text>
          <View style={styles.spacer}/>
          <Text>- Le démarchage commercial ;</Text>
          <View style={styles.spacer}/>
          <Text>- La commercialisation du Service sous quelque forme que ce soit ;</Text>
          <View style={styles.spacer}/>
          <Text>- Le piratage informatique des systèmes de DONUT, ou de systèmes tiers à partir des systèmes de DONUT ;</Text>
          <View style={styles.spacer}/>
          <Text>- Les tentatives ou comportements ayant pour conséquence la saturation des serveurs ;</Text>
          <View style={styles.spacer}/>
          <Text>- La collecte ou le vol de données et en particulier des Contenus ;</Text>
          <View style={styles.spacer}/>
          <Text>- La tentative de vol de compte Utilisateur, et/ou des droits d'un Utilisateur Créateur de Salon et/ou Modérateur d'un Salon de Discussion ;</Text>
          <View style={styles.spacer}/>
          <Text>- L'usurpation d'identité ;</Text>
          <View style={styles.spacer}/>
          <Text>- L'usurpation/falsification d'adresse IP.</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur est responsable des Contenus qu'il dépose sur le Service. Aussi il doit se conformer aux dispositions légales et réglementaires en vigueur, ainsi qu'aux présentes Conditions. En particulier, l'Utilisateur doit veiller à ce que les Contenus qu'il dépose ne portent pas atteinte aux droits ni à l'image de DONUT. L'Utilisateur veillera notamment à ce que les Contenus qu'il dépose :</Text>
          <View style={styles.spacer}/>
          <Text>- Ne contreviennent pas au droit de la propriété intellectuelle (par exemple la reproduction non autorisée de tout ou partie d'œuvre) ;</Text>
          <View style={styles.spacer}/>
          <Text>- Ne contreviennent pas au droit à la vie privée (par exemple la diffusion non autorisée d'informations d'ordre privé de tiers) ;</Text>
          <View style={styles.spacer}/>
          <Text>- Ne contreviennent pas au droit à l'image (par exemple la diffusion non autorisée d'images d'un tiers) ;</Text>
          <View style={styles.spacer}/>
          <Text>- Ne constituent pas une usurpation d'identité d'un tiers ni ne visent à recueillir des informations permettant de commettre une usurpation d'identité ;</Text>
          <View style={styles.spacer}/>
          <Text>- Ne constituent pas une atteinte à la réputation d'un tiers ;</Text>
          <View style={styles.spacer}/>
          <Text>- Ne portent pas atteinte à l'ordre public, au respect de la personne humaine et à sa dignité, à l'égalité entre les sexes à la protection des mineurs ;</Text>
          <View style={styles.spacer}/>
          <Text>- Ne représentent ni ne promeuvent des propos ou images à caractère pornographique ;</Text>
          <View style={styles.spacer}/>
          <Text>- N'encouragent pas la haine, la violence, l'injure, la discrimination, ni des activités illégales telles que les atteintes aux biens et personnes ;</Text>
          <View style={styles.spacer}/>
          <Text>- Ne fassent pas l'apologie, la négation, ni la remise en question de crimes contre l'humanité ou de crimes de guerre ;</Text>
          <View style={styles.spacer}/>
          <Text>- Ne constituent pas une injure, une violence, une haine ni une discrimination à l'égard d'une personne ou d'un groupe de personnes, notamment en raison de leur handicap, origine, leur préférence sexuelle ni de leur appartenance ou non à une ethnie, une nation, une race ou une religion ;</Text>
          <View style={styles.spacer}/>
          <Text>- Ne constituent pas un harcèlement.</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur s'engage à signaler tout Contenu et/ou comportement non conforme aux présentes CGU en postant un message sur le Salon de Discussion #help. Ce Salon de Discussion est mis à la disposition de l'Utilisateur conformément à l'Article 6 alinéa 7 de la Loi pour la Confiance en l'Economie Numérique du 21 juin 2004.</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur s'engage à conserver secrets ses identifiants d'authentification. DONUT précise que jamais un employé de DONUT ne demandera à l'Utilisateur de lui communiquer ses identifiants d'authentification, y compris sur le Salon de Discussion #help ou par e-mail. Par ailleurs, l'Utilisateur s'engage à prévenir DONUT dans les plus brefs délais en cas de perte de ses identifiants d'authentification ou de constatation de l'usurpation de son identité.</Text>
          <View style={styles.spacer}/>
          <Text>Le Service permet à chacun de se présenter sous le nom d'utilisateur de son choix et de personnaliser son profil. Aussi, DONUT attire l'attention de l'utilisateur sur le fait que les profils ne sont pas certifiés par DONUT. L'Utilisateur est appelé à la prudence dans ses échanges avec les autres utilisateurs.</Text>
          <View style={styles.spacer}/>
          <Text>DONUT se réserve le droit, à sa discrétion, de suspendre et/ou de supprimer le compte d'un Utilisateur ne se conformant pas aux dispositions des présentes Conditions. De même, les Noms d'Utilisateurs étant réservés et uniques, DONUT se réserve le droit de supprimer ou renommer tout compte Utilisateur ne respectant pas les présentes CGU, tout compte Utilisateur à l'activité inexistante ou très faible, et en particulier s'il vise à empêcher l'essor du Service par le squattage délibéré de Nom d'Utilisateur.</Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>2 . Obligations relatives à l'Utilisateur Créateur de Salon et au Modérateur</Text>
          <View style={styles.spacer}/>
          <Text>Tout Utilisateur peut créer un salon de discussion est ainsi devenir un Utilisateur Créateur de Salon. Tout Utilisateur Créateur de Salon peut modifier à tout instant les Paramètres Modifiables de Salon de son Salon de Discussion. Tout Utilisateur Créateur de Salon peut à tout instant supprimer son Salon de Discussion. L'Utilisateur peut créer un nombre raisonnable de Salons de Discussions.</Text>
          <View style={styles.spacer}/>
          <Text>Lors de la création d'un salon de discussion, l'Utilisateur Créateur de Salon a l'obligation de d'attribuer un Nom de Salon au salon de discussion. Le Nom de Salon constitue un Contenu et à ce titre doit respecter les présentes CGU et en particulier l'Article V.1. Le Nom de Salon doit répondre à des contraintes techniques imposées (nombre et type de caractères autorisés). Chaque nom de Salon est unique sur le Service, aussi, tout Utilisateur Créateur de Salon ne peut attribuer au Salon de Discussion qu'il crée qu'un Nom de Salon qui n'est pas déjà attribué à un autre Salon de Discussion. Le Nom de Salon est définitif et ne peut être modifié. Le Nom de Salon est réservé à ce Salon de Discussion pour la durée d'existence du Salon de Discussion. A l'expiration du Salon de Discussion, le Nom de Salon redevient libre. Un Salon de Discussion expire dès sa suppression.</Text>
          <View style={styles.spacer}/>
          <Text>DONUT génère pour tout Salon de Discussion une URL d'Accès Direct au Salon de Discussion. Cette URL est susceptible d'être modifiée occasionnellement par DONUT qui en informera alors l'Utilisateur Créateur de Salon dans un délai raisonnable au préalable.</Text>
          <View style={styles.spacer}/>
          <Text>DONUT attire l'attention sur le fait qu'un Salon de Discussion, et en particulier son Nom de Salon et son URL d'Accès Direct restent la propriété de DONUT et ne sont mis à la disposition de l'Utilisateur dit « Utilisateur Créateur de Salon » que dans le cadre des présentes CGU.</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur Créateur de Salon peut également renseigner des paramètres de personnalisation tel que la photo de Profil du Salon, le Papier Peint du Salon (ou "poster"), le Sujet du Salon, ainsi que le caractère permanent ou temporaire du Salon de Discussion. Ces éléments constituent un Contenu et à ce titre doivent respecter les présentes CGU et en particulier l'Article V.1.</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur Créateur de Salon a la responsabilité de la bonne tenue de son Salon de Discussion. Il s'engage à une présence régulière dans le Salon de Discussion afin d'y gérer la discussion de sorte qu'elle soit conforme aux présentes CGU et s'engage à signaler à DONUT tout Utilisateur au comportement non conforme aux présentes CGU. L'Utilisateur Créateur de Salon s'engage à consulter régulièrement sa boîte e-mail renseignée lors de sa création de compte afin que DONUT puisse communiquer régulièrement avec lui.</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur Créateur de Salon peut désigner un nombre raisonnable de Modérateurs afin de l'aider à maintenir la bonne tenue de son Salon de Discussion.</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur Créateur de Salon et le Modérateur d'un Salon de Discussion peuvent au sein du Salon de Discussion :</Text>
          <View style={styles.spacer}/>
          <Text>- Ajouter ou supprimer un Modérateur</Text>
          <View style={styles.spacer}/>
          <Text>- Rendre muet un Utilisateur, c'est à dire l'empêcher de poster du contenu dans le Salon de Discussion, et annuler cette action</Text>
          <View style={styles.spacer}/>
          <Text>- Expulser un Utilisateur</Text>
          <View style={styles.spacer}/>
          <Text>- Bannir un Utilisateur, et annuler cette action</Text>
          <View style={styles.spacer}/>
          <Text>- Signaler à DONUT tout comportement non conforme aux présentes CGU.</Text>
          <View style={styles.spacer}/>
          <Text>- Modifier le Sujet</Text>
          <View style={styles.spacer}/>
          <Text>DONUT se réserve le droit de supprimer ou renommer tout Salon de Discussion s'il enfreint les présente CGU et en particulier s'il contrevient au droit de la propriété intellectuelle d'un tiers. De même, les Noms de Salons étant réservés et uniques, il appartient à l'Utilisateur Créateur de Salons d'animer la discussion et le trafic sur ses Salons de Discussions. DONUT se réserve le droit de supprimer ou renommer tout Salon de Discussion à l'activité inexistante ou très faible, et en particulier s'il vise à empêcher l'essor du Service par le squattage délibéré de Nom de Salon.</Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Article VI – RESPONSABILITE</Text>
          <View style={styles.spacer}/>
          <Text>DONUT propose son service en l'état, ce que l'Utilisateur accepte expressément. En cas de dysfonctionnement, l'Utilisateur peut adresser une notification selon les modalités de contact décrites à l'Article X. L'Utilisateur s'interdit de demander de quelconques dommages et intérêts à DONUT.</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur garantit respecter ses obligations légales et également celles listées à l'Article V des présentes CGU. Dans le cas où la responsabilité civile de DONUT serait judiciairement recherchée à raison d'un manquement par l'Utilisateur aux obligations qui lui incombent en application des dispositions législatives et réglementaires en vigueur ainsi que des présentes CGU, DONUT se réserve le droit d'appeler l'Utilisateur en garantie.</Text>
          <View style={styles.spacer}/>
          <Text>DONUT agit en qualité d'hébergeur en conformité avec la Loi pour la Confiance dans l'Economie Numérique du 21 juin 2004.</Text>
          <View style={styles.spacer}/>
          <Text>Afin d'assurer la pérennité du Service et conformément à l'Article V des présentes CGU, DONUT se réserve le droit de suspendre, supprimer ou renommer, sans dédommagement aucun, tout Contenu, compte Utilisateur, et/ou Salon de Discussion dont les comportements et/ou Contenus sont manifestement illicites et/ou enfreignent les présentes CGU. L'Utilisateur renonce à toute action en justice visant à demander un quelconque dédommagement ou une quelconque indemnité en application de la présente clause. Par ailleurs DONUT se réserve le droit de demander des dommages et intérêts en fonction du préjudice subi.</Text>
          <View style={styles.spacer}/>
          <Text>DONUT rappelle qu'il appartient à l'Utilisateur de maintenir secrets ses identifiants d'authentification. DONUT décline toute responsabilité en cas d'accès frauduleux au compte d'un Utilisateur.</Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Article VII – DUREE, PRIX ET FONCTIONNALITES</Text>
          <View style={styles.spacer}/>
          <Text>DONUT offre le Service gratuitement et à durée indéterminée.</Text>
          <View style={styles.spacer}/>
          <Text>DONUT se réserve le droit d'ajouter ou modifier des fonctionnalités au Service. Dans ce cas DONUT notifiera ses Utilisateurs par e-mail et/ou par modification des présentes CGU. Dans ce cas chaque Utilisateur aura la possibilité de se désinscrire gratuitement conformément à l'Article IV des présentes CGU.</Text>
          <View style={styles.spacer}/>
          <Text>DONUT se réserve également le droit de créer différentes offres de Service, et y compris des offres de Service payantes coexistant avec son (ses) offre(s) de Service gratuite(s). Dans ce cas les Utilisateurs de l'offre de Service gratuite basculeront sur l'offre de Service gratuite la plus proche en fonctionnalités de l'offre à laquelle ils ont souscrit. Dans ce cas DONUT notifiera ses Utilisateurs par e-mail et/ou par modification des présentes CGU avec un préavis de un mois. Dans ce cas chaque Utilisateur aura la possibilité de se désinscrire gratuitement conformément à l'Article IV des présentes CGU. En aucun cas DONUT ne fera jamais basculer un Utilisateur d'une offre de Service gratuite vers une offre de Service payante sans son accord expresse à souscrire une telle offre de Service.</Text>
          <View style={styles.spacer}/>
          <Text>DONUT se réserve le droit de mettre à jour les présentes CGU. Dans ce cas DONUT notifiera ses Utilisateurs par e-mail et/ou notification suite à l'authentification au Service disponible. Dans ce cas chaque Utilisateur aura la possibilité de se désinscrire gratuitement conformément à l'Article III des présentes CGU.</Text>
          <View style={styles.spacer}/>
          <Text>DONUT se réserve le droit de mettre un terme définitif au Service. Dans ce cas, DONUT notifiera ses Utilisateurs avec un préavis de deux mois.</Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Article VIII – VIE PRIVEE</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur déclare que les données personnelles qu'il communique lors de sa création de compte et dans son profil public personnalisé sont exactes. L'Utilisateur dispose d'un droit d'accès, modification et suppression de ses données personnelles directement sur l'espace « Mon compte conformément à la loi n° 78-17 du 6 janvier 1978.</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur accepte que DONUT communique avec lui sur l'adresse e-mail renseignée par l'Utilisateur pour les besoins du service. De manière optionnelle, l'Utilisateur peut recevoir s'il le souhaite des notifications relatives à l'activité des conversations qui le concernent sur DONUT. De manière optionnelle, l'Utlisateur peut recevoir s'il le souhaite des informations quant aux mises à jour et améliorations du Service.</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur a conscience que DONUT est un Service de communication et que de ce fait les Contenus que l'Utilisateur y poste sont publiés et visible par des tiers. Selon le cas, les Contenus qu'il poste peuvent être Publics donc visibles de tout Utilisateur et par extension de tout internaute. Selon le cas, les Contenus qu'il poste peuvent être Privés donc visibles uniquement par les Utilisateurs autorisés. Les Utilisateurs autorisés d'une Discussion Un-à-Un sont les deux interlocuteurs. Les Utilisateurs autorisés d'un Salon de Discussion Privé sont les Utilisateurs remplissant les conditions d'accès définies par l'Utilisateur Créateur de Salon, étant entendu que ce dernier est libre de modifier à tout instant ces conditions et par conséquent les Utilisateur autorisés.</Text>
          <View style={styles.spacer}/>
          <Text>L'historique des Contenus d'un Salon de Discussion Public est accessible à tout Utilisateur et par extension à tout internaute. L'historique des Contenus d'un Salon de Discussion Privé est accessible à tout Utilisateur autorisé de ce Salon de Discussion.</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur accepte expressément que DONUT puisse donner accès à ses données personnelles et ses Contenus à des prestataires dans le cadre de la délivrance et de l'amélioration du Service. Par exemple, lorsque vous publiez une photo sur DONUT, elle transite par le service de gestion d'images Cloudinary, qui la transforme (création d'une miniature), l'héberge...</Text>
          <View style={styles.spacer}/>
          <Text>Dans le cadre d'une réquisition judiciaire, DONUT peut être amené à partager ces données personnelles avec les instances judiciaires.</Text>
          <View style={styles.spacer}/>
          <Text>DONUT peut être amené à commercialiser des statistiques et des Contenus anonymisés.</Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Article IX – PROPRIETE INTELLECTUELLE</Text>
          <View style={styles.spacer}/>
          <Text>Le site dans son ensemble, l'ensemble des éléments composant le site sont la propriété de DONUT ou de leurs auteurs ayant autorisé DONUT à les utiliser.</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur autorise expressément DONUT à publier ses contenus sur DONUT et ses éventuels site partenaires par encapsulage ("embedding", comme la republication de vidéos Youtube ou de tweets sur des sites tiers) ou d'autres procédés techniques.</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur a conscience que DONUT est un outil de communication visant à converser avec d'autres Utilisateurs et permettre aux Utilisateurs autorisés à le faire d'accéder aux historiques de conversation. Aussi, si l'Utilisateur supprime son compte, il accepte que ses Contenus ne soient pas supprimés afin que les autres Utilisateurs autorisés à accéder aux historiques de conversation conservent des historiques de conversation cohérents.</Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Article X – CONTACT</Text>
          <View style={styles.spacer}/>
          <Text>L'Utilisateur peut prendre contact avec DONUT pour toute question ou réclamation via le Salon de Discussion « #help » ou par e-mail.</Text>
          <View style={styles.spacer}/>
          <Text style={styles.h2}>Article XI – DISPOSITIONS GENERALES</Text>
          <View style={styles.spacer}/>
          <Text>Si une ou plusieurs stipulations des présentes Conditions sont nulles ou déclarées comme telles en application d'une loi, d'un règlement ou à la suite d'une décision définitive d'une juridiction compétente, les autres stipulations garderont toute leur force et leur portée. Les stipulations déclarées nulles et non valides seront alors remplacées par des stipulations qui se rapprocheront le plus quant à leur contenu des stipulations initialement arrêtées.</Text>
          <View style={styles.spacer}/>
          <Text>Les parties ne seront pas tenues pour responsables, ou considérées comme ayant failli aux présentes Conditions, pour tout retard ou inexécution, lorsque la cause du retard ou de l'inexécution est liée à un cas de force majeure telle que définie par la jurisprudence des tribunaux français.</Text>
          <View style={styles.spacer}/>
          <Text>Les présentes Conditions représentent l'intégralité de l'accord entre les parties et remplacent tous les accords ou déclarations antérieurs, oraux ou écrits, se rapportant à leur objet.</Text>
          <View style={styles.spacer}/>
          <Text>Les présentes Conditions sont soumises à la loi française. En cas de litige avec un commerçant relatif à l'interprétation, l'exécution ou la validité des présentes Conditions, le Tribunal compétent sera le Tribunal de Commerce de Paris. En cas de litige avec une personne physique, le tribunal compétent sera celui du domicile de la personne physique.</Text>
          <View style={styles.spacer}/>
        </ScrollView>
      </View>
    );
  }

  onBack () {
    this.props.navigator.pop();
  }
}

var styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    flexDirection: 'column'
  },
  h2: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  textGray: {
    fontWeight: 'normal',
    color: '#808080'
  },
  text: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '400',
    color: '#666'
  },
  linkCtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFF'
  },
  spacer: {
    marginVertical: 5
  }
});

module.exports = EutcView;

