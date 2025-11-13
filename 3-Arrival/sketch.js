// Remarque : ce fichier utilise p5.js et suppose qu'il existe une classe Vehicle
// dans un autre fichier avec les méthodes attendues : arrive(target, [slowing]),
// applyForce(force), update(), show() et une propriété statique Vehicle.debug.

// Variables globales (déclarées en haut pour visibilité)
let nbVehicules; // nombre total de véhicules (déterminé par le nombre de points du texte)
let target; // vecteur cible principal (ici suit la souris)
let vehicles = []; // tableau contenant toutes les instances Vehicle
let font; // police chargée dans preload()
let points = []; // tableau des points générés à partir du texte
let pointsMode = false; // si true, chaque véhicule vise son point correspondant au texte

/*
 * preload()
 * Appelé automatiquement par p5.js avant setup().
 * Sert à charger les ressources (images, polices, sons, ...).
 * Paramètres : aucun
 * Retour : aucun
 */
function preload() {
  // Charger une police (chemin relatif au sketch)
  font = loadFont("./assets/inconsolata.otf");
}

/*
 * setup()
 * Appelé automatiquement par p5.js une fois au démarrage.
 * Sert à initialiser le canvas et l'état initial de l'application.
 * Paramètres : aucun
 * Retour : aucun
 *
 * Comportement principal :
 * - crée la zone de dessin (createCanvas)
 * - calcule les points correspondant au texte ("Rabat")
 * - crée autant de véhicules que de points (un par point)
 * - initialise la cible principale (target)
 */
function setup() {
  // Créer un canevas carré 800x800
  createCanvas(800, 800);

  // Transformer le texte "Rabat" en une liste de points
  // font.textToPoints(texte, x, y, taillePolice, options)
  // Ici x=6 et y=250 positionnent le texte, sampleFactor ~ densité des points
  points = font.textToPoints("Rabat", 6, 250, 320, { sampleFactor: 0.04 });

  // Nombre de véhicules = nombre de points calculés
  nbVehicules = points.length;

  // Créer les véhicules à des positions aléatoires sur le canevas
  for (let i = 0; i < nbVehicules; i++) {
    // new Vehicle(x, y) : constructeur attendu de la classe Vehicle
    vehicles.push(new Vehicle(random(width), random(height)));
  }

  // Initialiser la cible principale à une position aléatoire
  target = createVector(random(width), random(height));
}

/*
 * draw()
 * Appelé automatiquement par p5.js en boucle (60 fps par défaut).
 * Sert à dessiner et mettre à jour l'état à chaque frame.
 * Paramètres : aucun
 * Retour : aucun
 *
 * Comportement :
 * - nettoie l'arrière-plan
 * - dessine (optionnel) les points du texte
 * - met à jour la cible principale pour qu'elle suive la souris
 * - pour chaque véhicule : calcule une force de steering (arrive),
 *   l'applique, met à jour le véhicule et l'affiche.
 */
function draw() {
  // Effacer le fond (noir)
  background(0);

  // Dessiner les points représentant le texte (simple repère visuel)
  for (let p of points) {
    push();
    noFill();
    stroke("white");
    // dessiner un petit cercle à chaque point
    circle(p.x, p.y, 8);
    pop();
  }

  // Faire suivre la cible principale par la souris
  // target est un p5.Vector déjà créé dans setup()
  target.x = mouseX;
  target.y = mouseY;

  // Dessiner la cible principale (cercle rouge)
  push();
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);
  pop();

  // Parcourir tous les véhicules et définir leur comportement
  // vehicles.forEach(callback) => callback(vehicle, index)
  vehicles.forEach((vehicle, index) => {
    // steeringForce : p5.Vector retourné par vehicle.arrive(...)
    // représente la force de steering à appliquer au véhicule
    let steeringForce;

    if (pointsMode) {
      // Mode "points" : chaque véhicule vise son point correspondant au texte.
      // On assigne la cible individuelle si elle n'est pas encore définie.
      // vehicle.target est un p5.Vector pointant vers coordinates du texte.
      if (!vehicle.target) {
        vehicle.target = createVector(points[index].x, points[index].y);
      }
      // vehicle.arrive(targetVector)
      // - Paramètre : targetVector (p5.Vector)
      // - Retour : p5.Vector représentant la force de steering pour arriver
      steeringForce = vehicle.arrive(vehicle.target);
    } else {
      // Mode "suivi" normal :
      // - le premier véhicule (index 0) suit la souris (target principal)
      // - les autres suivent la position du véhicule précédent
      if (index === 0) {
        // Le tout premier véhicule arrive vers la target principale
        // arrive(targetVector)
        steeringForce = vehicle.arrive(target);
      } else {
        // Pour les suivants, cibler la position du véhicule précédent
        let vehiculePrecedent = vehicles[index - 1];

        // arrive(targetPos, slowingRadiusOpt)
        // - Param 1 : targetPos (p5.Vector ou objet avec x,y)
        // - Param 2 : slowingRadius (optionnel) : rayon où le véhicule ralentit
        // Ici on passe 20 comme rayon de ralentissement pour un suivi doux
        steeringForce = vehicle.arrive(vehiculePrecedent.pos, 20);

        // Ligne esthétique entre véhicules : trace une belle bande large
        push();
        noFill();
        // couleur aléatoire pour la composante rouge, puis blanc, alpha 60
        stroke(random(255), 255, 255, 60);
        strokeWeight(20);
        line(
          vehicle.pos.x,
          vehicle.pos.y,
          vehiculePrecedent.pos.x,
          vehiculePrecedent.pos.y
        );
        pop();
      }
    }

    // Appliquer la force de steering calculée au véhicule
    // vehicle.applyForce(forceVector)
    vehicle.applyForce(steeringForce);

    // Mettre à jour la physique/position du véhicule
    // vehicle.update() : devrait intégrer la vélocité, limiter la vitesse, etc.
    vehicle.update();

    // Afficher le véhicule à l'écran
    // vehicle.show() : méthode de rendu, doit dessiner la forme du véhicule
    vehicle.show();
  });
}

/*
 * keyPressed()
 * Appelé automatiquement par p5.js quand une touche est pressée.
 * Paramètres : aucun (p5.js expose la variable globale 'key' et 'keyCode')
 * Retour : aucun
 *
 * Raccourcis :
 * - 'd' : bascule l'affichage du debug sur la classe Vehicle (Vehicle.debug)
 * - 'p' : bascule le mode points (pointsMode) ; si activé on assigne les targets
 *         individuelles à chaque véhicule, sinon on les supprime pour revenir
 *         au comportement de suivi normal.
 */
function keyPressed() {
  if (key === "d") {
    // bascule un mode debug statique ; dépend de l'implémentation de Vehicle
    Vehicle.debug = !Vehicle.debug;
  } else if (key === "p") {
    // bascule le mode points (chaque véhicule va à son point du texte)
    pointsMode = !pointsMode;
    if (pointsMode) {
      // assigner explicitement la target de chaque véhicule au point correspondant
      vehicles.forEach((v, i) => {
        // createVector(x, y) crée un p5.Vector
        v.target = createVector(points[i].x, points[i].y);
      });
    } else {
      // retirer les targets assignées pour revenir au comportement normal
      vehicles.forEach((v) => delete v.target);
    }
  }
}
