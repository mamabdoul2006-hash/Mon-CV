document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     FONCTIONNALITÉ 1 : MODE SOMBRE / MODE CLAIR
  ============================================================ */

  // Récupérer le bouton dans le HTML
  const btnTheme = document.getElementById('theme-sombre');
  const iconeTheme = btnTheme.querySelector('i'); // l'icône (lune ou soleil)

  /* Fonction qui applique le thème donné (dark ou light) */
  function appliquerTheme(theme) {
    if (theme === 'dark') {
      // Ajouter l'attribut data-theme="dark" sur le body
      // Le CSS change les couleurs grâce à body[data-theme="dark"]
      document.body.setAttribute('data-theme', 'dark');
      // Changer l'icône en soleil (pour indiquer qu'on peut revenir au clair)
      iconeTheme.classList.remove('fa-moon');
      iconeTheme.classList.add('fa-sun');
    } else {
      // Supprimer l'attribut pour revenir au thème clair
      document.body.removeAttribute('data-theme');
      // Remettre l'icône en lune
      iconeTheme.classList.remove('fa-sun');
      iconeTheme.classList.add('fa-moon');
    }
  }

  /* Au chargement de la page, lire le thème sauvegardé dans localStorage */
  const themeSauvegarde = localStorage.getItem('theme');
  if (themeSauvegarde) {
    appliquerTheme(themeSauvegarde);
  }

  /* Au clic sur le bouton, basculer entre les deux thèmes */
  btnTheme.addEventListener('click', function () {
    // Vérifier le thème actuel
    const themeActuel = document.body.getAttribute('data-theme');

    if (themeActuel === 'dark') {
      // Passer au clair
      appliquerTheme('light');
      localStorage.setItem('theme', 'light');
    } else {
      // Passer au sombre
      appliquerTheme('dark');
      localStorage.setItem('theme', 'dark');
    }
  });


  /* ============================================================
     FONCTIONNALITÉ 2 : MENU HAMBURGER (navigation mobile)
  ============================================================ */

  const btnHamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  /* Ouvrir / fermer le menu au clic sur le hamburger */
  btnHamburger.addEventListener('click', function () {
    // Ajouter ou retirer la classe 'open' sur le bouton et sur la liste
    btnHamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  /* Fermer le menu quand on clique sur un lien (après navigation) */
  const tousLesLiens = navLinks.querySelectorAll('a');

  tousLesLiens.forEach(function (lien) {
    lien.addEventListener('click', function () {
      btnHamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  /* ============================================================
     FONCTIONNALITÉ 3 : ANIMATION DES BARRES DE COMPÉTENCES
  ============================================================ */

  // Sélectionner toutes les barres de remplissage
  const barresDeCompetences = document.querySelectorAll('.skill-bar-fill');

  const observateur = new IntersectionObserver(function (entries) {

    entries.forEach(function (entry) {
      // entry.isIntersecting = true si l'élément est visible
      if (entry.isIntersecting) {
        const barre = entry.target;

        // Lire la valeur cible stockée dans data-width (ex: data-width="75")
        const valeurCible = barre.getAttribute('data-width');

        // Appliquer la largeur → la transition CSS fait l'animation
        barre.style.width = valeurCible + '%';

        // Arrêter d'observer cette barre (animation jouée une seule fois)
        observateur.unobserve(barre);
      }
    });

  }, {
    // L'observer se déclenche quand au moins 20% de l'élément est visible
    threshold: 0.2
  });

  /* Enregistrer chaque barre pour être observée */
  barresDeCompetences.forEach(function (barre) {
    observateur.observe(barre);
  });


  /* ============================================================
     FONCTIONNALITÉ 4 : FORMULAIRE DE CONTACT
     - Validation côté client (avant envoi)
     - Vérification que les champs ne sont pas vides
     - Vérification que l'e-mail a un format valide
     - Messages d'erreur affichés sous chaque champ
  ============================================================ */

  const btnEnvoyer = document.getElementById('btn-envoyer');

  /* Fonction qui vérifie si un e-mail a un format valide */
  function estEmailValide(email) {
    // Vérifie la présence de @ et d'un domaine
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /* Fonction qui affiche ou efface un message d'erreur */
  function afficherErreur(idErreur, message) {
    document.getElementById(idErreur).textContent = message;
  }

  /* Au clic sur le bouton Envoyer */
  btnEnvoyer.addEventListener('click', function () {

    // Lire les valeurs des champs
    const nom     = document.getElementById('nom').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Réinitialiser les erreurs précédentes
    afficherErreur('error-nom', '');
    afficherErreur('error-email', '');
    afficherErreur('error-message', '');
    document.getElementById('form-success').style.display = 'none';

    // Variable qui suit si le formulaire est valide
    let formulaireValide = true;

    /* Vérification 1 : le nom ne doit pas être vide */
    if (nom === '') {
      afficherErreur('error-nom', 'Veuillez entrer votre nom.');
      formulaireValide = false;
    }

    /* Vérification 2 : l'e-mail ne doit pas être vide ET doit être valide */
    if (email === '') {
      afficherErreur('error-email', 'Veuillez entrer votre adresse e-mail.');
      formulaireValide = false;
    } else if (!estEmailValide(email)) {
      afficherErreur('error-email', 'Le format de l\'e-mail est invalide.');
      formulaireValide = false;
    }

    /* Vérification 3 : le message ne doit pas être vide */
    if (message === '') {
      afficherErreur('error-message', 'Veuillez écrire un message.');
      formulaireValide = false;
    }

    /* Si tout est valide, afficher le message de succès et vider le formulaire */
    if (formulaireValide) {
      document.getElementById('form-success').style.display = 'flex';

      // Vider les champs après l'envoi
      document.getElementById('nom').value     = '';
      document.getElementById('email').value   = '';
      document.getElementById('message').value = '';
    }
  });


  /* ============================================================
     FONCTIONNALITÉ 5 : BOUTON RETOUR EN HAUT
  ============================================================ */

  const btnRetourHaut = document.getElementById('retour-haut');

  /* Surveiller le défilement de la page */
  window.addEventListener('scroll', function () {
    // Si l'utilisateur a scrollé de plus de 300px vers le bas
    if (window.scrollY > 300) {
      // Afficher le bouton (la classe .visible change l'opacité dans le CSS)
      btnRetourHaut.classList.add('visible');
    } else {
      // Cacher le bouton
      btnRetourHaut.classList.remove('visible');
    }
  });

  /* Au clic, remonter en haut de la page */
  btnRetourHaut.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  /* ============================================================
     BONUS : GESTION DE LA PHOTO DE PROFIL
     - Si la photo ne charge pas, afficher les initiales à la place
  ============================================================ */

  const photoImg = document.querySelector('.photo-img');
  const photoInitiales = document.querySelector('.photo-initiales');

  if (photoImg) {
    photoImg.addEventListener('load', function () {
      // Photo chargée avec succès : cacher les initiales
      photoInitiales.style.display = 'none';
    });

    photoImg.addEventListener('error', function () {
      // Erreur de chargement : afficher les initiales, cacher l'image
      photoImg.style.display = 'none';
      photoInitiales.style.display = 'flex';
    });
  }

}); 
