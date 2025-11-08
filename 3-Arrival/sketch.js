const nbVehicles = 10;
let target;
let vehicle;

// Appelée avant de démarrer l'animation
function preload() {
  // en général on charge des images, des fontes de caractères etc.
  //font = loadFont('./assets/inconsolata.otf');
}

function setup() {
  createCanvas(800, 800);

  // On crée un véhicule à la position (100, 100)
  vehicle = new Vehicle(100, 100);

  target = createVector(random(width), random(height));

}

// appelée 60 fois par seconde
function draw() {
  // couleur pour effacer l'écran
  background(0);
  // pour effet psychedelique
  //background(0, 0, 0, 10);

  // Cible qui suit la souris, cercle rouge de rayon 32
  target.x = mouseX;
  target.y = mouseY;

  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

  // Calcul de la force de steering avec la méthode arrivee
  let steeringForce = vehicle.arrive(target);
  vehicle.applyForce(steeringForce);
  
  // On met à jour la position et on dessine le véhicule
  vehicle.update();
  vehicle.show();
}


function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
}