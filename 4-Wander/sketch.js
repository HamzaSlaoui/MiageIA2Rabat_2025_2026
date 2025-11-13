let vehicles = [];
let imageFusee;
let debugCheckbox;
let nbVehicles = 1;

function preload() {
  // on charge une image de fusée pour le vaisseau
  imageFusee = loadImage("./assets/vehicule.png");
}

function setup() {
  createCanvas(1920, 800);

  // On cree des sliders pour régler les paramètres
  creerSlidersPourProprietesVehicules();

  //TODO : creerSliderPourNombreDeVehicules(nbVehicles);
  creerSliderPourNombreDeVehicules(nbVehicles);

  //TODO : creerSliderPourLongueurCheminDerriereVehicules(20);
}

function creerSliderPourNombreDeVehicules(nbInitial) {
  // Slider pour le nombre de véhicules (en dessous des autres)
  let sliderNbVehicles = createSlider(1, 100, nbInitial, 1);
  let labelNb = createP("Nombre de véhicules");
  labelNb.position(10, 220);
  labelNb.style("color", "white");
  labelNb.style("margin", "0");

  sliderNbVehicles.position(10 + 150, 220);

  let valueSpanNb = createSpan(sliderNbVehicles.value());
  valueSpanNb.position(300, 220);
  valueSpanNb.style("color", "white");

  sliderNbVehicles.input(() => {
    let newVal = sliderNbVehicles.value();
    valueSpanNb.html(newVal);

    while (vehicles.length < newVal) {
      let x = random(width);
      let y = random(height);
      let vehicle = new Vehicle(x, y, imageFusee);
      vehicle.r = random(20, 50);
      vehicle.maxSpeed = random(2, 6);
      vehicle.maxForce = random(0.1, 0.3);
      vehicles.push(vehicle);
    }

    // Supprimer des véhicules si nécessaire
    while (vehicles.length > newVal) {
      vehicles.pop();
    }
  });
}

function creerSlidersPourProprietesVehicules() {
  // paramètres de la fonction custom de création de sliders :
  // label, min, max, val, step, posX, posY, propriete des véhicules
  creerUnSlider("Rayon du cercle", 10, 200, 50, 1, 10, 20, "wanderRadius");
  // TODO : ajouter des sliders pour les autres propriétés
  // slider pour la distance du cercle
  creerUnSlider(
    "Distance du cercle",
    50,
    300,
    150,
    1,
    10,
    50,
    "distanceCercle"
  );

  // slider pour l'angle theta
  creerUnSlider("Angle theta", 0.5, 5, 1, 0.5, 10, 80, "wanderTheta");
  //slider pour la vitesse max
  creerUnSlider("Vitesse max", 1, 15, 1, 1, 10, 110, "maxSpeed");
  //slider pour la force max
  creerUnSlider("Force max", 0.5, 5, 1, 0.5, 10, 140, "maxForce");

  // slider pour la longueur de la traînée (nombre de points)
  creerUnSlider("Longueur traînée", 1, 150, 3, 1, 10, 170, "pathLength");

  // checkbox pour debug on / off
  debugCheckbox = createCheckbox("Debug ", false);
  debugCheckbox.position(10, 250);
  debugCheckbox.style("color", "white");

  debugCheckbox.changed(() => {
    Vehicle.debug = !Vehicle.debug;
  });
}

function creerUnSlider(label, min, max, val, step, posX, posY, propriete) {
  let slider = createSlider(min, max, val, step);

  let labelP = createP(label);
  labelP.position(posX, posY);
  labelP.style("color", "white");

  slider.position(posX + 150, posY + 17);

  let valueSpan = createSpan(slider.value());
  valueSpan.position(posX + 300, posY + 17);
  valueSpan.style("color", "white");
  valueSpan.html(slider.value());

  slider.input(() => {
    valueSpan.html(slider.value());
    vehicles.forEach((vehicle) => {
      vehicle[propriete] = slider.value();
    });
  });
}

// appelée 60 fois par seconde
function draw() {
  background(0);
  //background(0, 0, 0, 20);

  vehicles.forEach((vehicle) => {
    vehicle.wander();

    vehicle.update();
    vehicle.show();
    vehicle.edges();
  });
}

function keyPressed() {
  if (key === "d") {
    Vehicle.debug = !Vehicle.debug;
    // changer la checkbox, elle doit être checkée si debug est true
    debugCheckbox.checked(Vehicle.debug);
  }
}
