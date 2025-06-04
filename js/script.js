/*******************************************************
 * OYUNUN TEMEL VERİ YAPISI:
 *  - 6 gezegen, her birinde 5 bulmaca (toplam 30 puzzle).
 *  - name, info, image, puzzles (fonksiyon listesi)
 *******************************************************/
const planetData = [
  {
    name: "Algoritma Ormanı",
    info: "Algoritmalar, belirli bir problemi çözmek için izlenen adımlar dizisidir. Burada adımları doğru sıralamayı ve basit mantıksal düşünmeyi öğreneceksin.",
    image: "images/planet1.png",
    puzzles: [
      setupPlanet1Puzzle1,
      setupPlanet1Puzzle2,
      setupPlanet1Puzzle3,
      setupPlanet1Puzzle4,
      setupPlanet1Puzzle5
    ]
  },
  {
    name: "Veri Yükleme Noktası",
    info: "Yapay zekâ, veriye dayanır. Doğru verileri toplayarak modele öğretmek çok önemlidir. Bakalım veri toplama becerilerini kanıtlayabilecek misin!",
    image: "images/planet2.png",
    puzzles: [
      setupPlanet2Puzzle1,
      setupPlanet2Puzzle2,
      setupPlanet2Puzzle3,
      setupPlanet2Puzzle4,
      setupPlanet2Puzzle5
    ]
  },
  {
    name: "Makine Öğrenimi Laboratuvarı",
    info: "Makine öğrenimi, örüntüleri tanıyarak tahmin yapar. Bu gezegende kedi-köpek sınıflandırma gibi eğlenceli örneklerle tanışacaksın.",
    image: "images/planet3.png",
    puzzles: [
      setupPlanet3Puzzle1,
      setupPlanet3Puzzle2,
      setupPlanet3Puzzle3,
      setupPlanet3Puzzle4,
      setupPlanet3Puzzle5
    ]
  },
  {
    name: "Doğal Dil Buluşma Noktası",
    info: "Yapay zekâ, insan dilini de anlayabilir! Kelime sıralama, eş anlam bulma gibi dil bulmacaları seni bekliyor.",
    image: "images/planet4.png",
    puzzles: [
      setupPlanet4Puzzle1,
      setupPlanet4Puzzle2,
      setupPlanet4Puzzle3,
      setupPlanet4Puzzle4,
      setupPlanet4Puzzle5
    ]
  },
  {
    name: "Robotik Atölyesi",
    info: "Robotlar, sensörler ve yapay zekâ yardımıyla dünyayı algılar. Bu gezegende robotik bulmacalar, sürükle-bırak mini oyunlar yapacağız.",
    image: "images/planet5.png",
    puzzles: [
      setupPlanet5Puzzle1,
      setupPlanet5Puzzle2,
      setupPlanet5Puzzle3,
      setupPlanet5Puzzle4,
      setupPlanet5Puzzle5
    ]
  },
  {
    name: "Etik Yapay Zeka Zirvesi",
    info: "Yapay zekâ geliştirirken veri gizliliği, adalet ve sorumluluk gibi etik konuları unutmamak gerekir. Son gezegende bunları keşfedeceksin.",
    image: "images/planet6.png",
    puzzles: [
      setupPlanet6Puzzle1,
      setupPlanet6Puzzle2,
      setupPlanet6Puzzle3,
      setupPlanet6Puzzle4,
      setupPlanet6Puzzle5
    ]
  }
];

/*******************************************************
 * EKRAN SEÇİCİLER 
 *******************************************************/
const mainMenu = document.getElementById("mainMenu");
const storyScreen = document.getElementById("storyScreen");
const planetSelectionScreen = document.getElementById("planetSelectionScreen");
const planetInfoScreen = document.getElementById("planetInfoScreen");
const planetPuzzleScreen = document.getElementById("planetPuzzleScreen");
const endingScreen = document.getElementById("endingScreen");

/*******************************************************
 * GEZEGEN BİLGİ EKRANI ELEMANLARI
 *******************************************************/
const planetInfoTitle = document.getElementById("planetInfoTitle");
const planetInfoImage = document.getElementById("planetInfoImage");
const planetInfoText = document.getElementById("planetInfoText");
const startPuzzlesBtn = document.getElementById("startPuzzlesBtn");

/*******************************************************
 * PUZZLE EKRANI ELEMANLARI
 *******************************************************/
const planetPuzzleTitle = document.getElementById("planetPuzzleTitle");
const puzzleHintText = document.getElementById("puzzleHintText");
const puzzleArea = document.getElementById("puzzleArea");
const notificationArea = document.getElementById("notificationArea");

/*******************************************************
 * SES ELEMANLARI
 *******************************************************/
const bgMusic = document.getElementById("bgMusic");
const victorySound = document.getElementById("victorySound");
const volumeSlider = document.getElementById("volumeSlider");
const planetVolumeSlider = document.getElementById("planetVolumeSlider");

/*******************************************************
 * SES FONKSİYONLARI
 *******************************************************/
function playClickSound() {
  const clickSound = new Audio("audio/click.wav");
  clickSound.play();
}
function playCorrectSound() {
  const correctSound = new Audio("audio/correct.mp3");
  correctSound.play();
}
function playWrongSound() {
  const wrongSound = new Audio("audio/wrong.mp3");
  wrongSound.play();
}

// Ses kontrolü ayarı
function initAudioControl() {
  // Başlangıç ses seviyesini ayarla
  const savedVolume = localStorage.getItem('musicVolume') || 50;
  
  if (volumeSlider) {
    volumeSlider.value = savedVolume;
    bgMusic.volume = savedVolume / 100;
    
    // Ses seviyesi değiştiğinde müziği güncelle
    volumeSlider.addEventListener('input', function() {
      const newVolume = this.value;
      bgMusic.volume = newVolume / 100;
      
      // Diğer slider'ı da güncelle
      if (planetVolumeSlider) {
        planetVolumeSlider.value = newVolume;
      }
      
      // Kullanıcı tercihini localStorage'a kaydet
      localStorage.setItem('musicVolume', newVolume);
    });
  }
  
  if (planetVolumeSlider) {
    planetVolumeSlider.value = savedVolume;
    
    // Ses seviyesi değiştiğinde müziği güncelle
    planetVolumeSlider.addEventListener('input', function() {
      const newVolume = this.value;
      bgMusic.volume = newVolume / 100;
      
      // Diğer slider'ı da güncelle
      if (volumeSlider) {
        volumeSlider.value = newVolume;
      }
      
      // Kullanıcı tercihini localStorage'a kaydet
      localStorage.setItem('musicVolume', newVolume);
    });
  }
}

/*******************************************************
 * OYUN DURUM DEĞİŞKENLERİ
 *******************************************************/
let currentPlanetIndex = 0;
let currentPuzzleIndex = 0;
let planetCompleted = [false, false, false, false, false, false];
const totalPlanets = planetData.length;

/*******************************************************
 * OYUN BAŞLANGIÇ AKIŞI
 *******************************************************/
document.addEventListener('DOMContentLoaded', function() {
  // Ses kontrolü başlat
  initAudioControl();

  createFullscreenButton();
});

// Tam ekran modu için JavaScript fonksiyonu
// Tam ekran modu için JavaScript kodu
// Tam ekran modu için JavaScript kodu
// Tam ekran modu için JavaScript kodu
function toggleFullScreen() {
  if (!document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    document.getElementById('fullscreenBtn').innerHTML = '🔍 Küçült';
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    document.getElementById('fullscreenBtn').innerHTML = '🔍 Tam Ekran';
  }
}

// Tam ekran butonunu oluşturan fonksiyon 
function createFullscreenButton() {
  // CSS stilini ekle
  const style = document.createElement('style');
  style.textContent = `
    .fullscreen-control {
      margin-top: 5px;
      margin-bottom: 15px;
      padding: 8px 15px;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 20px;
      width: fit-content;
      margin-left: auto;
      margin-right: auto;
    }
    
    #fullscreenBtn {
      background: linear-gradient(135deg, #2196F3, #03A9F4);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 8px 20px;
      font-size: 0.9em;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(33, 150, 243, 0.5);
      transition: all 0.3s ease;
    }
    
    #fullscreenBtn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(33, 150, 243, 0.7);
    }
  `;
  document.head.appendChild(style);

  // Gezegen seçim ekranındaki ses kontrolünden sonra tam ekran butonu ekle
  const planetVolumeControl = document.querySelector('.planet-volume-control');
  if (planetVolumeControl) {
    // Tam ekran kontrolü container oluştur
    const fullscreenControl = document.createElement('div');
    fullscreenControl.className = 'fullscreen-control';
    
    // Tam ekran butonu oluştur
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.id = 'fullscreenBtn';
    fullscreenBtn.innerHTML = '🔍 Tam Ekran';
    fullscreenBtn.addEventListener('click', toggleFullScreen);
    
    // Butonu container'a ekle
    fullscreenControl.appendChild(fullscreenBtn);
    
    // Ses kontrolünden sonra ekle
    planetVolumeControl.parentNode.insertBefore(fullscreenControl, planetVolumeControl.nextSibling);
  }
}

// Tam ekran butonlarını oluştur
function createFullscreenButtons() {
  // CSS stil ekle
  const style = document.createElement('style');
  style.textContent = `
    .fullscreen-btn {
      background: linear-gradient(135deg, #2196F3, #03A9F4);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 10px 20px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
      margin-top: 20px;
      display: block;
      margin-left: auto;
      margin-right: auto;
      z-index: 100;
    }
    .fullscreen-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
    }
  `;
  document.head.appendChild(style);

  // Ana menüye buton ekle
  const mainMenuBtn = document.createElement('button');
  mainMenuBtn.className = 'fullscreen-btn';
  mainMenuBtn.innerHTML = '🔍 Tam Ekran';
  mainMenuBtn.addEventListener('click', toggleFullScreen);
  document.querySelector('#mainMenu .menu-content').appendChild(mainMenuBtn);
  
  // Gezegen seçim ekranına buton ekle
  const planetSelectionBtn = document.createElement('button');
  planetSelectionBtn.className = 'fullscreen-btn';
  planetSelectionBtn.innerHTML = '🔍 Tam Ekran';
  planetSelectionBtn.addEventListener('click', toggleFullScreen);
  
  // Subtext'ten sonra ekle
  const planetSelectionSubtext = document.querySelector('#planetSelectionScreen .subtext');
  if (planetSelectionSubtext) {
    planetSelectionSubtext.parentNode.insertBefore(planetSelectionBtn, planetSelectionSubtext.nextSibling);
  } else {
    document.querySelector('#planetSelectionScreen').appendChild(planetSelectionBtn);
  }
}

// Tam ekran butonunu oluştur
function createFullscreenButton() {
  // CSS stil ekle
  const style = document.createElement('style');
  style.textContent = `
    .fullscreen-btn-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
    }
    .fullscreen-btn {
      background: linear-gradient(135deg, #2196F3, #03A9F4);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 10px 20px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }
    .fullscreen-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
    }
  `;
  document.head.appendChild(style);

  // Buton konteyneri oluştur
  const container = document.createElement('div');
  container.className = 'fullscreen-btn-container';
  
  // Tam ekran butonu oluştur
  const fullscreenBtn = document.createElement('button');
  fullscreenBtn.id = 'fullscreenBtn';
  fullscreenBtn.className = 'fullscreen-btn';
  fullscreenBtn.innerHTML = '🔍 Tam Ekran';
  fullscreenBtn.addEventListener('click', toggleFullScreen);
  
  // Butonu sayfaya ekle
  container.appendChild(fullscreenBtn);
  document.body.appendChild(container);
}

// HTML'de eklenecek tam ekran butonu (menü ekranında macera başlasın butonunun altına ekle)
const fullscreenButton = document.createElement('button');
fullscreenButton.id = 'fullscreenBtn';
fullscreenButton.className = 'btn fullscreen-btn';
fullscreenButton.innerHTML = '🔍 Tam Ekran';
fullscreenButton.addEventListener('click', toggleFullScreen);

// Butonun menüye eklenmesi (bu kısmı kendi koduna göre uyarla)
document.querySelector('#mainMenu .menu-content').appendChild(fullscreenButton);

// CSS stilini head kısmına ekle
const style = document.createElement('style');
style.textContent = `
  .fullscreen-btn {
    margin-top: 15px;
    background: linear-gradient(135deg, #2196F3, #03A9F4) !important;
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.5) !important;
  }
  
  .fullscreen-btn:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.7) !important;
  }
  
  /* Tam ekran modunda scrollbar ve overflow ayarları */
  :fullscreen, 
  :-webkit-full-screen, 
  :-moz-full-screen, 
  :-ms-fullscreen {
    overflow-y: auto !important;
    height: 100vh;
  }
`;
document.head.appendChild(style);

document.getElementById("startBtn").addEventListener("click", () => {
  playClickSound();
  showScreen(storyScreen);
  bgMusic.play(); // Arka plan müziğini başlat
});

document.getElementById("goToPlanetsBtn").addEventListener("click", () => {
  playClickSound();
  showScreen(planetSelectionScreen);
  updatePlanetSelectionState();
});

/*******************************************************
 * GEZEGEN SEÇİM EKRANI
 *******************************************************/
const planetElements = document.querySelectorAll(".planet");
planetElements.forEach((planetEl, idx) => {
  planetEl.addEventListener("click", () => {
    playClickSound();
    if (planetCompleted[idx]) {
      alert("Bu gezegenin tüm bulmacalarını zaten tamamladın!");
      return;
    }
    currentPlanetIndex = idx;
    loadPlanetInfo(idx);
  });
});

function updatePlanetSelectionState() {
  planetElements.forEach((planetEl, idx) => {
    if (planetCompleted[idx]) {
      planetEl.classList.add("completed");
    } else {
      planetEl.classList.remove("completed");
    }
  });
}

/*******************************************************
 * GEZEGEN BİLGİ EKRANI
 *******************************************************/
function loadPlanetInfo(planetIndex) {
  const p = planetData[planetIndex];
  planetInfoTitle.innerText = p.name;
  planetInfoImage.src = p.image;
  planetInfoText.innerText = p.info;
  showScreen(planetInfoScreen);
}

/*******************************************************
 * "Bulmacalara Başla" Butonu
 *******************************************************/
startPuzzlesBtn.addEventListener("click", () => {
  playClickSound();
  currentPuzzleIndex = 0;
  loadPuzzle();
});

/*******************************************************
 * PUZZLE YÜKLEME
 *******************************************************/
function loadPuzzle() {
  showScreen(planetPuzzleScreen);
  clearPuzzleArea();

  const p = planetData[currentPlanetIndex];
  const puzzleFunctions = p.puzzles;

  if (currentPuzzleIndex < puzzleFunctions.length) {
    planetPuzzleTitle.innerText = `${p.name} - Bulmaca ${currentPuzzleIndex + 1}`;
    puzzleFunctions[currentPuzzleIndex](); // ilgili puzzle fonksiyonunu çağır
  } else {
    // Tüm puzzle'lar tamam
    planetCompleted[currentPlanetIndex] = true;
    updatePlanetSelectionState();
    checkAllPlanetsCompleted();
  }
}

/*******************************************************
 * TÜM GEZEGENLER TAMAMLANDI MI?
 *******************************************************/
function checkAllPlanetsCompleted() {
  if (planetCompleted.every(v => v === true)) {
    showScreen(endingScreen);
    victorySound.play();
  } else {
    showScreen(planetSelectionScreen);
  }
}

/*******************************************************
 * TEKRAR BAŞLAT (ENDING SCREEN)
 *******************************************************/
document.getElementById("restartBtn").addEventListener("click", () => {
  playClickSound();
  planetCompleted = [false, false, false, false, false, false];
  updatePlanetSelectionState();
  showScreen(mainMenu);
});

/*******************************************************
 * EKRAN GÖSTERME
 *******************************************************/
function showScreen(screenElement) {
  [
    mainMenu,
    storyScreen,
    planetSelectionScreen,
    planetInfoScreen,
    planetPuzzleScreen,
    endingScreen
  ].forEach((scr) => scr.classList.remove("active"));

  screenElement.classList.add("active");
}

/*******************************************************
 * MESAJ GÖSTERME / TEMİZLEME
 *******************************************************/
function showMessage(text, type) {
  notificationArea.innerHTML = "";
  const msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.innerText = text;
  notificationArea.appendChild(msg);
  
  // Automatically clear message after 2 seconds
  setTimeout(clearMessage, 2000);
}
function clearMessage() {
  notificationArea.innerHTML = "";
}

/*******************************************************
 * PUZZLE ALANINI TEMİZLE
 *******************************************************/
function clearPuzzleArea() {
  puzzleHintText.innerText = "";
  puzzleArea.innerHTML = "";
  clearMessage();
}

/*******************************************************
 * BİR PUZZLE BİTİNCE SONRAKİNE GEÇ
 *******************************************************/
function goNextPuzzle() {
  currentPuzzleIndex++;
  loadPuzzle();
}

/*******************************************************
 * DİZİ KARIŞTIRMA FONKSİYONU
 *******************************************************/
function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

/****************************************************************
 ***************** 1) ALGORTIMA ORMANI (5 Puzzle) ***************
 ****************************************************************/
function setupPlanet1Puzzle1() {
  puzzleHintText.innerText = "IPUCU: Sabah rutinini doğru sırayla tıkla!";

  // Sabah rutini açıklaması
  let info = document.createElement("p");
  info.innerText = "Sabah uyanıp okula gitme adımlarını doğru sırayla tıkla.";
  puzzleArea.appendChild(info);

  // Sabah rutini adımları
  let correctOrder = [
    "Alarmı kapat",
    "Yatağımdan kalk",
    "Dişlerimi fırçala",
    "Yüzümü yıka",
    "Kıyafetlerimi giy",
    "Kahvaltı yap",
    "Çantamı hazırla",
    "Okula git"
  ];
  let randomOrder = shuffleArray([...correctOrder]);
  let currentIndex = 0;

  // Butonları tutacak container
  let buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.flexWrap = "wrap";
  buttonContainer.style.justifyContent = "center";
  buttonContainer.style.gap = "10px";
  buttonContainer.style.margin = "20px 0";
  puzzleArea.appendChild(buttonContainer);

  randomOrder.forEach(step => {
    let btn = document.createElement("button");
    btn.innerText = step;
    btn.style.margin = "5px";
    btn.style.padding = "10px 15px";
    btn.style.fontSize = "1.1em";
    btn.style.backgroundColor = "#4a90e2";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    btn.style.transition = "all 0.3s ease";
    btn.style.opacity = "1"; // Başlangıç opaklığı

    btn.addEventListener("mouseover", () => {
      if (!btn.disabled) {
        btn.style.transform = "scale(1.05)";
        btn.style.backgroundColor = "#357abd";
      }
    });

    btn.addEventListener("mouseout", () => {
      if (!btn.disabled) {
        btn.style.transform = "scale(1)";
        btn.style.backgroundColor = "#4a90e2";
      }
    });

    btn.addEventListener("click", () => {
      if(step === correctOrder[currentIndex]) {
        playCorrectSound();
        btn.disabled = true;
        
        // Fade-out animasyonu
        btn.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        btn.style.opacity = "0";
        btn.style.transform = "scale(0.8)";
        
        // Animasyon bittikten sonra butonu kaldır
        setTimeout(() => {
          btn.style.display = "none";
        }, 500);

        currentIndex++;
        
        // İlerleme göstergesi
        let progress = document.createElement("p");
        progress.innerText = `İlerleme: ${currentIndex}/8`;
        progress.style.color = "#4caf50";
        progress.style.fontWeight = "bold";
        progress.style.margin = "10px 0";
        
        // Eğer zaten bir ilerleme göstergesi varsa güncelle
        let existingProgress = puzzleArea.querySelector("p:last-child");
        if (existingProgress && existingProgress.innerText.startsWith("İlerleme")) {
          existingProgress.remove();
        }
        puzzleArea.appendChild(progress);

        if(currentIndex === correctOrder.length) {
          showMessage("Harika! Sabah rutinini doğru sırayla tamamladın!", "success");
          setTimeout(goNextPuzzle, 2000);
        }
      } else {
        playWrongSound();
        showMessage("Yanlış sıralama! Tekrar dene.", "error");
        setTimeout(clearMessage, 1500);
      }
    });
    buttonContainer.appendChild(btn);
  });
}

function setupPlanet1Puzzle2() {
  puzzleHintText.innerText = "IPUCU: Çocuk dostu hafıza kartlarıyla pratik yap.";

  // Açıklama metni
  let text = document.createElement("p");
  text.innerText = "İki kartı aç, aynı resmi bulmaya çalış!";
  text.style.fontSize = "1.2em";
  text.style.marginBottom = "20px";
  puzzleArea.appendChild(text);

  // Kartları tutacak container
  let cardsContainer = document.createElement("div");
  cardsContainer.style.display = "flex";
  cardsContainer.style.flexDirection = "column";
  cardsContainer.style.alignItems = "center";
  cardsContainer.style.gap = "20px";
  cardsContainer.style.margin = "20px auto";
  cardsContainer.style.maxWidth = "800px";

  // Üst ve alt satır için container'lar
  let topRow = document.createElement("div");
  let bottomRow = document.createElement("div");
  [topRow, bottomRow].forEach(row => {
    row.style.display = "flex";
    row.style.justifyContent = "center";
    row.style.gap = "20px";
  });

  let cards = [
    { id:1, img:"memory-card-a.png" },
    { id:2, img:"memory-card-b.png" },
    { id:3, img:"memory-card-c.png" },
    { id:4, img:"memory-card-d.png" },
    { id:5, img:"memory-card-a.png" },
    { id:6, img:"memory-card-b.png" },
    { id:7, img:"memory-card-c.png" },
    { id:8, img:"memory-card-d.png" }
  ];
  cards = shuffleArray(cards);

  let revealed = [];
  let matchedCount = 0;
  let canFlip = true; // Kart çevirme kontrolü

  // Kartları oluştur ve yerleştir
  cards.forEach((card, index) => {
    let cardElem = document.createElement("div");
    cardElem.classList.add("memory-card");
    cardElem.style.width = "120px";
    cardElem.style.height = "120px";
    cardElem.style.backgroundImage = 'url("images/card-back.png")';
    cardElem.style.backgroundSize = "cover";
    cardElem.style.borderRadius = "10px";
    cardElem.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    cardElem.style.cursor = "pointer";
    cardElem.style.transition = "transform 0.6s, box-shadow 0.3s";
    cardElem.dataset.img = card.img;
    cardElem.dataset.matched = "false";

    // Hover efekti
    cardElem.addEventListener("mouseover", () => {
      if (!cardElem.dataset.matched && canFlip) {
        cardElem.style.transform = "scale(1.05)";
        cardElem.style.boxShadow = "0 6px 12px rgba(0,0,0,0.3)";
      }
    });

    cardElem.addEventListener("mouseout", () => {
      if (!cardElem.dataset.matched && canFlip) {
        cardElem.style.transform = "scale(1)";
        cardElem.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
      }
    });

    cardElem.addEventListener("click", () => {
      if (!canFlip || cardElem.dataset.matched === "true" || revealed.includes(cardElem)) return;

      // Kartı çevir
      cardElem.style.backgroundImage = `url("images/${card.img}")`;
      revealed.push(cardElem);

      if (revealed.length === 2) {
        canFlip = false; // İki kart açıkken yeni kart çevirmeyi engelle
        let [c1, c2] = revealed;
        
        if (c1.dataset.img === c2.dataset.img) {
          // Eşleşme durumu
          playCorrectSound();
          matchedCount++;
          
          // Eşleşen kartları işaretle
          c1.dataset.matched = "true";
          c2.dataset.matched = "true";
          
          // Eşleşen kartlara efekt
          [c1, c2].forEach(card => {
            card.style.transform = "scale(1.1)";
            card.style.boxShadow = "0 0 15px #4caf50";
            setTimeout(() => {
              card.style.transform = "scale(1)";
              card.style.opacity = "0.7";
            }, 500);
          });

          revealed = [];
          canFlip = true;

          if (matchedCount === 4) {
            showMessage("Tüm eşleşmeleri buldun, bravo!", "success");
            setTimeout(goNextPuzzle, 2000);
          }
        } else {
          // Eşleşmeme durumu
          playWrongSound();
          setTimeout(() => {
            c1.style.backgroundImage = 'url("images/card-back.png")';
            c2.style.backgroundImage = 'url("images/card-back.png")';
            revealed = [];
            canFlip = true;
          }, 1000);
        }
      }
    });

    // Kartları üst ve alt satıra dağıt
    if (index < 4) {
      topRow.appendChild(cardElem);
    } else {
      bottomRow.appendChild(cardElem);
    }
  });

  cardsContainer.appendChild(topRow);
  cardsContainer.appendChild(bottomRow);
  puzzleArea.appendChild(cardsContainer);

  // Eşleşme sayacı
  let matchCounter = document.createElement("div");
  matchCounter.style.marginTop = "20px";
  matchCounter.style.fontSize = "1.1em";
  matchCounter.style.color = "#4caf50";
  matchCounter.innerText = `Eşleşen Çiftler: ${matchedCount}/4`;
  puzzleArea.appendChild(matchCounter);

  // Eşleşme sayacını güncelle
  const updateMatchCounter = () => {
    matchCounter.innerText = `Eşleşen Çiftler: ${matchedCount}/4`;
  };
}

function setupPlanet1Puzzle3() {
  puzzleHintText.innerText = "IPUCU: Labirentte doğru yolu bul ve karakteri çıkışa ulaştır!";

  // Açıklama metni
  let info = document.createElement("p");
  info.innerText = "Karakteri yön tuşlarıyla hareket ettirerek labirentin çıkışına ulaştır.";
  info.style.fontSize = "1.2em";
  info.style.marginBottom = "20px";
  puzzleArea.appendChild(info);

  // Labirent container
  let mazeContainer = document.createElement("div");
  mazeContainer.style.position = "relative";
  mazeContainer.style.width = "400px";
  mazeContainer.style.height = "400px";
  mazeContainer.style.margin = "0 auto";
  mazeContainer.style.border = "2px solid #333";
  mazeContainer.style.backgroundColor = "#f0f0f0";

  // Labirent haritası (0: duvar, 1: yol, 2: başlangıç, 3: bitiş)
  const mazeMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  // Labirenti oluştur
  for (let y = 0; y < mazeMap.length; y++) {
    for (let x = 0; x < mazeMap[y].length; x++) {
      let cell = document.createElement("div");
      cell.style.position = "absolute";
      cell.style.width = "40px";
      cell.style.height = "40px";
      cell.style.left = (x * 40) + "px";
      cell.style.top = (y * 40) + "px";

      switch (mazeMap[y][x]) {
        case 0: // Duvar
          cell.style.backgroundColor = "#333";
          break;
        case 1: // Yol
          cell.style.backgroundColor = "#f0f0f0";
          break;
        case 2: // Başlangıç
          cell.style.backgroundColor = "#4caf50";
          break;
        case 3: // Bitiş
          cell.style.backgroundColor = "#ff9800";
          break;
      }
      mazeContainer.appendChild(cell);
    }
  }

  // Karakter
  let character = document.createElement("div");
  character.style.position = "absolute";
  character.style.width = "30px";
  character.style.height = "30px";
  character.style.backgroundColor = "#2196f3";
  character.style.borderRadius = "50%";
  character.style.left = "5px";
  character.style.top = "5px";
  character.style.transition = "all 0.2s ease";
  mazeContainer.appendChild(character);

  // Yön tuşları
  let controls = document.createElement("div");
  controls.style.display = "flex";
  controls.style.justifyContent = "center";
  controls.style.gap = "10px";
  controls.style.marginTop = "20px";

  const directions = [
    { key: "ArrowUp", style: "↑" },
    { key: "ArrowLeft", style: "←" },
    { key: "ArrowRight", style: "→" },
    { key: "ArrowDown", style: "↓" }
  ];

  directions.forEach(dir => {
    let btn = document.createElement("button");
    btn.innerText = dir.style;
    btn.style.width = "50px";
    btn.style.height = "50px";
    btn.style.fontSize = "24px";
    btn.style.cursor = "pointer";
    btn.style.backgroundColor = "#4a90e2";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.transition = "all 0.2s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
      btn.style.backgroundColor = "#357abd";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      btn.style.backgroundColor = "#4a90e2";
    });

    btn.addEventListener("click", () => moveCharacter(dir.key));
    controls.appendChild(btn);
  });

  // Karakter pozisyonu
  let charX = 0;
  let charY = 0;

  // Karakteri hareket ettir
  function moveCharacter(direction) {
    let newX = charX;
    let newY = charY;

    switch (direction) {
      case "ArrowUp":
        newY--;
        break;
      case "ArrowDown":
        newY++;
        break;
      case "ArrowLeft":
        newX--;
        break;
      case "ArrowRight":
        newX++;
        break;
    }

    // Sınırları ve duvarları kontrol et
    if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10 && mazeMap[newY][newX] !== 0) {
      charX = newX;
      charY = newY;
      character.style.left = (charX * 40 + 5) + "px";
      character.style.top = (charY * 40 + 5) + "px";

      // Bitiş noktasına ulaşıldı mı?
      if (mazeMap[charY][charX] === 3) {
        playCorrectSound();
        showMessage("Tebrikler! Labirenti başarıyla tamamladın!", "success");
        setTimeout(goNextPuzzle, 2000);
      }
    } else {
      playWrongSound();
      showMessage("Bu yöne gidemezsin!", "error");
      setTimeout(clearMessage, 1000);
    }
  }

  // Klavye kontrollerini ekle
  document.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      moveCharacter(e.key);
    }
  });

  puzzleArea.appendChild(mazeContainer);
  puzzleArea.appendChild(controls);
}

function setupPlanet1Puzzle4() {
  puzzleHintText.innerText = "IPUCU: Meyve salatası yapmak için adımları doğru sırada sürükle.";

  let info = document.createElement("p");
  info.innerText = "Meyve salatası yapmak için adımları doğru sırala:";
  info.style.fontSize = "1.2em";
  info.style.marginBottom = "20px";
  puzzleArea.appendChild(info);

  // İpucu gösterge alanı oluştur
  let hintDisplay = document.createElement("div");
  hintDisplay.id = "recipeHintDisplay";
  hintDisplay.style.backgroundColor = "rgba(255, 152, 0, 0.9)";
  hintDisplay.style.color = "white";
  hintDisplay.style.padding = "15px";
  hintDisplay.style.borderRadius = "8px";
  hintDisplay.style.fontSize = "1.1em";
  hintDisplay.style.fontWeight = "bold";
  hintDisplay.style.maxWidth = "80%";
  hintDisplay.style.margin = "0 auto 20px auto";
  hintDisplay.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  hintDisplay.style.display = "none"; // Başlangıçta gizli
  puzzleArea.appendChild(hintDisplay);

  /* 
    Drag & drop: 4 resim: Meyveleri yıka, kes, tabağa koy, sos ekle
    Doğru sıra: 1) Yıka, 2) Kes, 3) Tabağa koy, 4) Sos ekle
  */
  let steps = [
    { step:1, img:"recipe-wash.png", label:"Meyveleri Yıka" },
    { step:2, img:"recipe-cut.png", label:"Meyveleri Kes" },
    { step:3, img:"recipe-bowl.png", label:"Tabağa Koy" },
    { step:4, img:"recipe-sauce.png", label:"Sos Ekle" },
  ];
  steps = shuffleArray(steps);

  // Ana konteyner
  const gameContainer = document.createElement("div");
  gameContainer.style.display = "flex";
  gameContainer.style.flexDirection = "column";
  gameContainer.style.alignItems = "center";
  gameContainer.style.gap = "30px";
  gameContainer.style.width = "100%";
  gameContainer.style.maxWidth = "100%"; // Taşmayı engelle
  
  // Kartlar için alan - tek sırada üstte
  const cardsContainer = document.createElement("div");
  cardsContainer.style.display = "flex";
  cardsContainer.style.flexWrap = "nowrap"; // Tek sırada
  cardsContainer.style.justifyContent = "center";
  cardsContainer.style.gap = "20px";
  cardsContainer.style.width = "100%";
  cardsContainer.style.maxWidth = "550px";
  cardsContainer.style.marginBottom = "60px"; // Altındaki hedef alanına mesafe
  cardsContainer.style.overflowX = "auto"; // Ekrana sığmayan kartlar için kaydırma
  cardsContainer.style.paddingBottom = "15px"; // Kaydırma çubuğu için alan
  
  // Hedef alanlar için konteyner - tek sırada altta
  const targetsContainer = document.createElement("div");
  targetsContainer.style.display = "flex";
  targetsContainer.style.flexWrap = "nowrap"; // Tek sırada
  targetsContainer.style.justifyContent = "center";
  targetsContainer.style.gap = "20px";
  targetsContainer.style.width = "100%";
  targetsContainer.style.maxWidth = "550px";
  targetsContainer.style.overflowX = "auto"; // Ekrana sığmayan hedefler için kaydırma
  targetsContainer.style.paddingBottom = "15px"; // Kaydırma çubuğu için alan
  
  // Kartları oluştur
  steps.forEach(step => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.dataset.step = step.step;
    card.dataset.placed = "false";
    card.style.width = "100px";
    card.style.height = "100px";
    card.style.backgroundImage = `url("images/${step.img}")`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
    card.style.borderRadius = "10px";
    card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    card.style.cursor = "pointer";
    card.style.position = "relative";
    card.style.userSelect = "none";
    card.style.touchAction = "none";
    card.style.marginBottom = "30px"; // Alt etiket için yer aç
    card.style.flexShrink = "0"; // Boyutu sabit tut
    
    // Metin etiketi
    const label = document.createElement("div");
    label.innerText = step.label;
    label.style.position = "absolute";
    label.style.bottom = "-30px"; // Daha aşağıda
    label.style.left = "0";
    label.style.right = "0";
    label.style.textAlign = "center";
    label.style.fontSize = "14px";
    label.style.fontWeight = "bold";
    label.style.color = "#333";
    label.style.width = "100%"; // Tam genişlik
    label.style.marginTop = "5px"; // Üst boşluk
    card.appendChild(label);
    
    // Dokunma ve sürükle olayları
    let isDragging = false;
    let startX, startY, initialX, initialY;
    let currentTarget = null;
    
    // Fare ve dokunmatik olayları için ortak fonksiyonlar
    function startDrag(clientX, clientY) {
      if (card.dataset.placed === "true") return;
      
      isDragging = true;
      startX = clientX;
      startY = clientY;
      
      const rect = card.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      
      card.style.position = "fixed";
      card.style.left = `${initialX}px`;
      card.style.top = `${initialY}px`;
      card.style.zIndex = "1000";
      card.style.opacity = "0.8";
      card.style.transform = "scale(1.05)";
      
      // Titreşim geri bildirimi
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }
    
    function moveDrag(clientX, clientY) {
      if (!isDragging) return;
      
      const dx = clientX - startX;
      const dy = clientY - startY;
      
      card.style.left = `${initialX + dx}px`;
      card.style.top = `${initialY + dy}px`;
      
      // Kart hangi hedefin üzerinde?
      checkTargetCollision(clientX, clientY);
    }
    
    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      
      if (currentTarget) {
        const targetStep = parseInt(currentTarget.dataset.expectedStep);
        const cardStep = parseInt(card.dataset.step);
        
        if (targetStep === cardStep) {
          // Doğru hedef
        playCorrectSound();
        
          card.style.position = "static";
          card.style.opacity = "1";
          card.style.transform = "none";
          card.style.pointerEvents = "none";
          card.dataset.placed = "true";
          
          currentTarget.appendChild(card);
          currentTarget.dataset.filled = "true";
          currentTarget.style.border = "2px solid #4caf50";
          currentTarget.style.backgroundColor = "rgba(76, 175, 80, 0.2)";
          
          // Tüm hedefler dolu mu kontrol et
          checkAllTargets();
      } else {
          // Yanlış hedef
          resetCardPosition();
        playWrongSound();
        showMessage("Yanlış sıra! Bu adım buraya ait değil.", "error");
        setTimeout(clearMessage, 1500);
      }
      } else {
        // Hedef yok, kartı orijinal konumuna döndür
        resetCardPosition();
      }
      
      currentTarget = null;
    }
    
    function resetCardPosition() {
      card.style.position = "static";
      card.style.left = "auto";
      card.style.top = "auto";
      card.style.zIndex = "auto";
      card.style.opacity = "1";
      card.style.transform = "none";
    }
    
    function checkTargetCollision(clientX, clientY) {
      // Önceki hedefi temizle
      if (currentTarget) {
        currentTarget.style.backgroundColor = "rgba(245, 245, 245, 0.8)";
      }
      currentTarget = null;
      
      // Tüm hedefleri kontrol et
      const targets = targetsContainer.querySelectorAll('.recipe-target');
      targets.forEach(target => {
        if (target.dataset.filled === "true") return;
        
        const rect = target.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          currentTarget = target;
          target.style.backgroundColor = "rgba(255, 152, 0, 0.2)";
        }
      });
    }
    
    // Fare olayları
    card.addEventListener('mousedown', (e) => {
      startDrag(e.clientX, e.clientY);
    });
    
    document.addEventListener('mousemove', (e) => {
      moveDrag(e.clientX, e.clientY);
    });
    
    document.addEventListener('mouseup', () => {
      endDrag();
    });
    
    // Dokunmatik olaylar
    card.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
      e.preventDefault(); // Sayfanın kaydırılmasını engelle
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      moveDrag(touch.clientX, touch.clientY);
      e.preventDefault(); // Sayfanın kaydırılmasını engelle
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
      endDrag();
    });
    
    cardsContainer.appendChild(card);
  });
  
      // Hedef alanları oluştur
  for (let i = 0; i < 4; i++) {
    const target = document.createElement("div");
    target.className = "recipe-target";
    target.dataset.expectedStep = i + 1;
    target.dataset.filled = "false";
    target.style.width = "100px";
    target.style.height = "100px";
    target.style.border = "2px dashed #666";
    target.style.borderRadius = "10px";
    target.style.backgroundColor = "rgba(245, 245, 245, 0.8)";
    target.style.display = "flex";
    target.style.alignItems = "center";
    target.style.justifyContent = "center";
    target.style.position = "relative";
    target.style.marginTop = "30px"; // Üst etikete yer açmak için
    
    // Adım numarası
    const stepNumber = document.createElement("div");
    stepNumber.innerText = `Adım ${i + 1}`;
    stepNumber.style.position = "absolute";
    stepNumber.style.top = "-30px"; // Daha yukarıda
    stepNumber.style.left = "0";
    stepNumber.style.right = "0";
    stepNumber.style.textAlign = "center";
    stepNumber.style.fontSize = "14px";
    stepNumber.style.fontWeight = "bold";
    stepNumber.style.color = "#333";
    stepNumber.style.width = "100%"; // Tam genişlik
    stepNumber.style.marginBottom = "5px"; // Alt boşluk
    
    target.appendChild(stepNumber);
    targetsContainer.appendChild(target);
  }

  // İpucu butonu ekle
  const hintButton = document.createElement("button");
  hintButton.innerText = "İpucu Göster";
  hintButton.style.marginTop = "20px";
  hintButton.style.padding = "10px 20px";
  hintButton.style.backgroundColor = "#ff9800";
  hintButton.style.color = "white";
  hintButton.style.border = "none";
  hintButton.style.borderRadius = "5px";
  hintButton.style.cursor = "pointer";
  hintButton.style.fontWeight = "bold";
  
  hintButton.addEventListener("click", () => {
    const hintText = "Doğru sıra: 1) Meyveleri Yıka, 2) Meyveleri Kes, 3) Tabağa Koy, 4) Sos Ekle";
    
    const hintDiv = document.getElementById("recipeHintDisplay");
    if (hintDiv) {
      hintDiv.style.display = "block";
      hintDiv.innerText = hintText;
      
      setTimeout(() => {
        hintDiv.style.display = "none";
      }, 5000);
    } else {
      showMessage(hintText, "success");
      setTimeout(clearMessage, 4000);
    }
  });
  
  // Kontrol fonksiyonu
  function checkAllTargets() {
    const targets = targetsContainer.querySelectorAll('.recipe-target');
    let filledCount = 0;
    
    targets.forEach(target => {
      if (target.dataset.filled === "true") {
        filledCount++;
      }
    });
    
    if (filledCount === 4) {
      showMessage("Harika! Meyve salatası tarifini doğru sıraladın!", "success");
      setTimeout(goNextPuzzle, 2000);
    }
  }
  
  // Her şeyi ana alana ekle
  gameContainer.appendChild(cardsContainer);
  gameContainer.appendChild(targetsContainer);
  gameContainer.appendChild(hintButton);
  puzzleArea.appendChild(gameContainer);
}

function setupPlanet1Puzzle5() {
  puzzleHintText.innerText = "IPUCU: Noktaları doğru sırayla birleştirerek gizli yapay zeka robotunu ortaya çıkar!";

  // Açıklama metni
  let info = document.createElement("p");
  info.innerText = "Noktaları 1'den 12'ye kadar sırayla tıklayarak bir yapay zeka robotu ortaya çıkar!";
  info.style.fontSize = "1.2em";
  info.style.marginBottom = "20px";
  puzzleArea.appendChild(info);

  // İlerleme göstergesi
  let progressIndicator = document.createElement("div");
  progressIndicator.style.fontSize = "1.1em";
  progressIndicator.style.fontWeight = "bold";
  progressIndicator.style.color = "#4a90e2";
  progressIndicator.style.margin = "10px 0";
  progressIndicator.innerText = "İlerleme: 0/12";
  puzzleArea.appendChild(progressIndicator);

  // Canvas container oluştur
  let canvasContainer = document.createElement("div");
  canvasContainer.style.position = "relative";
  canvasContainer.style.width = "600px";
  canvasContainer.style.height = "400px";
  canvasContainer.style.margin = "0 auto";
  canvasContainer.style.border = "3px solid #333";
  canvasContainer.style.borderRadius = "10px";
  canvasContainer.style.backgroundColor = "#f8f8f8";
  canvasContainer.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  puzzleArea.appendChild(canvasContainer);

  // Canvas oluştur - çizgileri çizmek için
  let canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  canvas.style.position = "absolute";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.pointerEvents = "none"; // Canvas üzerindeki tıklamalar noktalardan geçsin
  canvasContainer.appendChild(canvas);
  
  const ctx = canvas.getContext("2d");

  // Robot şeklini oluşturacak noktalar (x, y koordinatları)
  const points = [
    { id: 1, x: 300, y: 60, label: "Baş" },      // Baş üstü
    { id: 2, x: 370, y: 100, label: "Sağ anten" }, // Sağ anten
    { id: 3, x: 230, y: 100, label: "Sol anten" }, // Sol anten
    { id: 4, x: 230, y: 180, label: "Sol göz" },  // Sol göz
    { id: 5, x: 370, y: 180, label: "Sağ göz" },  // Sağ göz
    { id: 6, x: 300, y: 220, label: "Ağız" },   // Ağız
    { id: 7, x: 300, y: 260, label: "Boyun" },   // Boyun
    { id: 8, x: 200, y: 300, label: "Sol omuz" }, // Sol omuz
    { id: 9, x: 400, y: 300, label: "Sağ omuz" }, // Sağ omuz
    { id: 10, x: 150, y: 350, label: "Sol el" },  // Sol el
    { id: 11, x: 450, y: 350, label: "Sağ el" },  // Sağ el
    { id: 12, x: 300, y: 380, label: "Gövde" }    // Gövde alt
  ];

  // Noktalar arası bağlantıları tanımla - hangi noktalar birbirine bağlanacak
  const connections = [
    [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], // Baş kısmı
    [6, 7], // Boyun
    [7, 8], [7, 9], // Omuzlar
    [8, 10], [9, 11], // Kollar
    [7, 12], // Gövde
  ];

  // Çizim durumunu takip etmek için
  let currentPoint = 1;
  let completedPoints = [];
  let lastClickedPoint = null;

  // Noktaları oluştur
  points.forEach(point => {
    let dot = document.createElement("div");
    dot.className = "dot";
    dot.dataset.id = point.id;
    dot.style.position = "absolute";
    dot.style.width = "30px";
    dot.style.height = "30px";
    dot.style.borderRadius = "50%";
    dot.style.backgroundColor = "#4a90e2";
    dot.style.color = "white";
    dot.style.display = "flex";
    dot.style.justifyContent = "center";
    dot.style.alignItems = "center";
    dot.style.fontWeight = "bold";
    dot.style.fontSize = "14px";
    dot.style.cursor = "pointer";
    dot.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
    dot.style.transition = "transform 0.2s, background-color 0.2s";
    dot.style.left = `${point.x - 15}px`;
    dot.style.top = `${point.y - 15}px`;
    dot.innerText = point.id;
    
    // Nokta hover efekti
    dot.addEventListener("mouseover", () => {
      if (parseInt(dot.dataset.id) === currentPoint) {
        dot.style.transform = "scale(1.2)";
        dot.style.backgroundColor = "#2ecc71";
      }
    });
    
    dot.addEventListener("mouseout", () => {
      if (parseInt(dot.dataset.id) === currentPoint) {
        dot.style.transform = "scale(1)";
        dot.style.backgroundColor = "#4a90e2";
      }
    });

    // Nokta tıklama olayı
    dot.addEventListener("click", () => {
      const pointId = parseInt(dot.dataset.id);
      
      if (pointId === currentPoint) {
        playCorrectSound();
        
        // Tıklanan noktayı işaretle
        dot.style.backgroundColor = "#2ecc71"; // Yeşil
        dot.style.transform = "scale(1.1)";
        
        // Çizgi çizme
        if (lastClickedPoint !== null) {
          drawLineBetweenPoints(lastClickedPoint, point);
        }
        
        // Noktayı tamamlandı olarak işaretle
        completedPoints.push(pointId);
        lastClickedPoint = point;
        
        // Sonraki noktaya geç
        currentPoint++;
        
        // İlerlemeyi güncelle
        progressIndicator.innerText = `İlerleme: ${completedPoints.length}/12`;
        
        // Tüm noktalar tamamlandı mı kontrol et
        if (completedPoints.length === points.length) {
          // Son bağlantıları tamamla
          completeRobotDrawing();
          
          setTimeout(() => {
            // Konfeti efekti ekle
            addConfetti(canvasContainer);
            
            showMessage("Tebrikler! Yapay Zeka Robotunu Tamamladın!", "success");
            setTimeout(goNextPuzzle, 3000);
          }, 1000);
        }
      } else {
        playWrongSound();
        showMessage(`Yanlış nokta! ${currentPoint} numaralı noktayı bul.`, "error");
        setTimeout(clearMessage, 1500);
        
        // Yanlış noktayı sallandır
        dot.style.animation = "shake 0.5s";
        setTimeout(() => {
          dot.style.animation = "";
        }, 500);
      }
    });
    
    canvasContainer.appendChild(dot);
  });

  // İki nokta arasında çizgi çiz
  function drawLineBetweenPoints(p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = "#2ecc71";
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  
  // Robot çizimini tamamla - tüm bağlantıları çiz
  function completeRobotDrawing() {
    // Önceki çizimleri temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Tüm tanımlanan bağlantıları çiz
    connections.forEach(conn => {
      const p1 = points.find(p => p.id === conn[0]);
      const p2 = points.find(p => p.id === conn[1]);
      drawLineBetweenPoints(p1, p2);
    });
    
    // Robot yüzünü çiz
    drawRobotFace();
  }
  
  // Robot yüzü detaylarını ekle
  function drawRobotFace() {
    // Gözler
    const leftEye = points.find(p => p.id === 4);
    const rightEye = points.find(p => p.id === 5);
    
    // Sol göz
    ctx.beginPath();
    ctx.arc(leftEye.x, leftEye.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#3498db";
    ctx.fill();
    
    // Sağ göz
    ctx.beginPath();
    ctx.arc(rightEye.x, rightEye.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#3498db";
    ctx.fill();
    
    // Ağız
    const mouth = points.find(p => p.id === 6);
    ctx.beginPath();
    ctx.arc(mouth.x, mouth.y, 15, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  
  // Konfeti efekti ekle
  function addConfetti(container) {
    for (let i = 0; i < 100; i++) {
      let confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.position = "absolute";
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = Math.random() * 10 + 5 + "px";
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = -20 + "px";
      confetti.style.opacity = Math.random() + 0.5;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.zIndex = "10";
      
      // Animasyon
      confetti.animate(
        [
          { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
          { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 200 + 400}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ],
        {
          duration: Math.random() * 2000 + 2000,
          easing: 'cubic-bezier(0.1, 0.5, 0.1, 1)'
        }
      );
      
      container.appendChild(confetti);
      
      // Animasyon bittikten sonra elementi kaldır
      setTimeout(() => {
        confetti.remove();
      }, 4000);
    }
  }
  
  // Sallama animasyonu için stil ekle
  let style = document.createElement("style");
  style.innerHTML = `
    @keyframes shake {
      0% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(-5px, 0) rotate(-5deg); }
      50% { transform: translate(5px, 0) rotate(5deg); }
      75% { transform: translate(-3px, 0) rotate(-3deg); }
      100% { transform: translate(0, 0) rotate(0deg); }
    }
  `;
  document.head.appendChild(style);
}

/****************************************************************
 ***************** 2) VERİ YÜKLEME NOKTASI (5 Puzzle) ************
 ****************************************************************/
// Planet2Puzzle1: meyveleri sürükle-bırak
function setupPlanet2Puzzle1() {
  puzzleHintText.innerText = "IPUCU: Meyveleri 'Meyve Kutusu'na sürüklemelisin.";

  // Açıklama metni
  let info = document.createElement("p");
  info.innerText = "Resimlerin arasından meyveleri bulup 'Meyve Kutusu'na sürükle!";
  info.style.fontSize = "1.2em";
  info.style.marginBottom = "20px";
  puzzleArea.appendChild(info);

  // İlerleme göstergesi
  let progressIndicator = document.createElement("div");
  progressIndicator.style.fontSize = "1.1em";
  progressIndicator.style.fontWeight = "bold";
  progressIndicator.style.color = "#4a90e2";
  progressIndicator.style.margin = "10px 0 20px 0";
  progressIndicator.innerText = "İlerleme: 0/3 meyve bulundu";
  puzzleArea.appendChild(progressIndicator);

  // Örnek resimler: fruit-apple.png, fruit-banana.png, fruit-orange.png
  // Yanlış: vehicle-car.png, dog1.png vb.
  let items = [
    {id: 1, img: "fruit-apple.png", type: "fruit", name: "Elma"},
    {id: 2, img: "fruit-banana.png", type: "fruit", name: "Muz"},
    {id: 3, img: "dog1.png", type: "notFruit", name: "Köpek"},
    {id: 4, img: "fruit-orange.png", type: "fruit", name: "Portakal"},
    {id: 5, img: "vehicle-car.png", type: "notFruit", name: "Araba"},
  ];
  items = shuffleArray(items);

  // Ana konteyner
  let container = document.createElement("div");
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.style.gap = "40px";
  container.style.margin = "0 auto";
  container.style.maxWidth = "800px";
  container.style.flexWrap = "wrap"; // Ekran küçüldüğünde alt alta geçmesi için

  // Sol taraf - sürüklenecek öğeler
  let leftDiv = document.createElement("div");
  leftDiv.style.display = "flex";
  leftDiv.style.flexWrap = "wrap";
  leftDiv.style.gap = "15px";
  leftDiv.style.justifyContent = "center";
  leftDiv.style.padding = "15px";
  leftDiv.style.backgroundColor = "rgba(240, 240, 240, 0.5)";
  leftDiv.style.borderRadius = "10px";
  leftDiv.style.border = "2px dashed #ccc";
  leftDiv.style.minWidth = "280px";
  leftDiv.style.maxWidth = "400px";
  leftDiv.style.margin = "10px";

  // Sağ taraf - meyve kutusu
  let rightDiv = document.createElement("div");
  rightDiv.style.display = "flex";
  rightDiv.style.flexDirection = "column";
  rightDiv.style.alignItems = "center";
  rightDiv.style.gap = "10px";
  rightDiv.style.margin = "10px";

  // Meyve kutusu
  let fruitBox = document.createElement("div");
  fruitBox.classList.add("dropzone");
  fruitBox.style.width = "220px";
  fruitBox.style.height = "220px";
  fruitBox.style.backgroundColor = "#f8f8f8";
  fruitBox.style.border = "3px dashed #ff9800";
  fruitBox.style.borderRadius = "15px";
  fruitBox.style.display = "flex";
  fruitBox.style.flexDirection = "column";
  fruitBox.style.justifyContent = "center";
  fruitBox.style.alignItems = "center";
  fruitBox.style.padding = "15px";
  fruitBox.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  fruitBox.style.transition = "all 0.3s ease";

  // Meyve kutusu etiketi
  let boxTitle = document.createElement("div");
  boxTitle.innerText = "Meyve Kutusu";
  boxTitle.style.fontSize = "1.3em";
  boxTitle.style.fontWeight = "bold";
  boxTitle.style.color = "#ff9800";
  boxTitle.style.marginBottom = "10px";
  fruitBox.appendChild(boxTitle);

  // Meyve bilgileri için konteyner
  let fruitItems = document.createElement("div");
  fruitItems.style.display = "flex";
  fruitItems.style.flexDirection = "column";
  fruitItems.style.gap = "8px";
  fruitItems.style.width = "100%";
  fruitBox.appendChild(fruitItems);

  rightDiv.appendChild(fruitBox);

  // İpucu butonu
  let hintButton = document.createElement("button");
  hintButton.innerText = "İpucu Göster";
  hintButton.style.marginTop = "15px";
  hintButton.style.padding = "8px 15px";
  hintButton.style.backgroundColor = "#ff9800";
  hintButton.style.color = "white";
  hintButton.style.border = "none";
  hintButton.style.borderRadius = "5px";
  hintButton.style.cursor = "pointer";
  hintButton.style.fontWeight = "bold";
  
  hintButton.addEventListener("click", () => {
    showMessage("İpucu: Elma, muz ve portakal birer meyvedir.", "success");
    setTimeout(clearMessage, 3000);
  });
  
  rightDiv.appendChild(hintButton);

  // Öğeleri oluştur
  items.forEach(item => {
    let itemContainer = document.createElement("div");
    itemContainer.classList.add("item-container");
    itemContainer.dataset.id = item.id;
    itemContainer.dataset.type = item.type;
    itemContainer.style.display = "flex";
    itemContainer.style.flexDirection = "column";
    itemContainer.style.alignItems = "center";
    itemContainer.style.gap = "5px";
    itemContainer.style.transition = "all 0.3s ease";
    itemContainer.style.position = "relative"; // Dokunmatik sürükleme için gerekli

    let draggable = document.createElement("div");
    draggable.classList.add("draggable");
    draggable.dataset.id = item.id;
    draggable.dataset.type = item.type;
    draggable.dataset.name = item.name;
    draggable.dataset.img = item.img;
    draggable.style.width = "100px";
    draggable.style.height = "100px";
    draggable.style.backgroundImage = `url("images/${item.img}")`;
    draggable.style.backgroundSize = "cover";
    draggable.style.backgroundPosition = "center";
    draggable.style.borderRadius = "10px";
    draggable.style.boxShadow = "0 3px 6px rgba(0,0,0,0.2)";
    draggable.style.cursor = "grab";
    draggable.style.transition = "transform 0.2s, box-shadow 0.2s";
    draggable.style.touchAction = "none"; // Dokunmatik için gerekli

    // İsim etiketi
    let label = document.createElement("div");
    label.innerText = item.name;
    label.style.fontSize = "0.9em";
    label.style.fontWeight = "bold";
    label.style.color = "#333";
    label.style.textAlign = "center";
    label.style.width = "100%";
    label.style.pointerEvents = "none"; // Dokunma olaylarını engelle

    // Standart sürükleme olayları
    draggable.setAttribute("draggable", "true");

    draggable.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", item.type);
      e.dataTransfer.setData("application/json", JSON.stringify(item));
      draggable.style.opacity = "0.6";
    });

    draggable.addEventListener("dragend", () => {
      draggable.style.opacity = "1";
    });

    // Dokunmatik ekran için sürükleme işlemi
    let isDragging = false;
    let startX, startY;
    let clone = null;
    
    function startDrag(clientX, clientY) {
      isDragging = true;
      startX = clientX;
      startY = clientY;
      
      // Orijinal elemanı seçili göster
      draggable.style.opacity = "0.6";
      
      // Klon oluştur
      clone = draggable.cloneNode(true);
      clone.style.position = "fixed";
      clone.style.zIndex = "1000";
      clone.style.pointerEvents = "none";
      clone.style.opacity = "0.8";
      clone.style.width = draggable.offsetWidth + "px";
      clone.style.height = draggable.offsetHeight + "px";
      
      // Klonu konumlandır
      updatePosition(clientX, clientY);
      document.body.appendChild(clone);
    }
    
    function updatePosition(clientX, clientY) {
      if (!isDragging || !clone) return;
      
      // Klonu parmak/fare pozisyonuna göre taşı
      let offsetX = draggable.offsetWidth / 2;
      let offsetY = draggable.offsetHeight / 2;
      clone.style.left = (clientX - offsetX) + "px";
      clone.style.top = (clientY - offsetY) + "px";
    }
    
    function endDrag(clientX, clientY) {
      if (!isDragging) return;
      isDragging = false;
      
      // Orijinal elemanı normal göster
      draggable.style.opacity = "1";
      
      // Eğer klon bırakma alanı üzerindeyse
      if (clone && isColliding(clone, fruitBox)) {
        processItemDrop(item);
      }
      
      // Klonu temizle
      if (clone) {
        document.body.removeChild(clone);
        clone = null;
      }
    }
    
    // Çarpışma tespiti
    function isColliding(element1, element2) {
      const rect1 = element1.getBoundingClientRect();
      const rect2 = element2.getBoundingClientRect();
      
      return !(
        rect1.right < rect2.left || 
        rect1.left > rect2.right || 
        rect1.bottom < rect2.top || 
        rect1.top > rect2.bottom
      );
    }
    
    // Fare olayları
    draggable.addEventListener("mousedown", (e) => {
      startDrag(e.clientX, e.clientY);
    });
    
    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        updatePosition(e.clientX, e.clientY);
      }
    });
    
    document.addEventListener("mouseup", (e) => {
      if (isDragging) {
        endDrag(e.clientX, e.clientY);
      }
    });
    
    // Dokunmatik olaylar
    draggable.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
      e.preventDefault(); // Sayfanın kaydırılmasını engelle
    });
    
    document.addEventListener("touchmove", (e) => {
      if (isDragging) {
        const touch = e.touches[0];
        updatePosition(touch.clientX, touch.clientY);
        e.preventDefault();
      }
    });
    
    document.addEventListener("touchend", (e) => {
      if (isDragging) {
        if (e.changedTouches.length > 0) {
          const touch = e.changedTouches[0];
          endDrag(touch.clientX, touch.clientY);
        } else {
          endDrag(0, 0); // Pozisyon bilgisi yoksa
        }
      }
    });

    // Sürükleme efektleri
    draggable.addEventListener("mouseover", () => {
      if (!isDragging) {
        draggable.style.transform = "scale(1.05)";
        draggable.style.boxShadow = "0 5px 10px rgba(0,0,0,0.3)";
      }
    });

    draggable.addEventListener("mouseout", () => {
      if (!isDragging) {
        draggable.style.transform = "scale(1)";
        draggable.style.boxShadow = "0 3px 6px rgba(0,0,0,0.2)";
      }
    });

    itemContainer.appendChild(draggable);
    itemContainer.appendChild(label);
    leftDiv.appendChild(itemContainer);
  });

  // Standart Drag-Drop olayları için fruitBox
  fruitBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    fruitBox.style.backgroundColor = "#fff8e1";
    fruitBox.style.borderColor = "#ffa726";
    fruitBox.style.transform = "scale(1.03)";
  });

  fruitBox.addEventListener("dragleave", () => {
    fruitBox.style.backgroundColor = "#f8f8f8";
    fruitBox.style.borderColor = "#ff9800";
    fruitBox.style.transform = "scale(1)";
  });

  fruitBox.addEventListener("drop", (e) => {
    e.preventDefault();
    fruitBox.style.backgroundColor = "#f8f8f8";
    fruitBox.style.borderColor = "#ff9800";
    fruitBox.style.transform = "scale(1)";

    let itemType = e.dataTransfer.getData("text/plain");
    let itemData = JSON.parse(e.dataTransfer.getData("application/json"));

    processItemDrop(itemData);
  });

  // Öğe bırakma işlemi
  function processItemDrop(itemData) {
    if (itemData.type === "fruit") {
      playCorrectSound();
      
      // Meyve kutusu içine yerleştir
      let boxItem = document.createElement("div");
      boxItem.style.backgroundColor = "#4caf50";
      boxItem.style.color = "white";
      boxItem.style.padding = "8px 12px";
      boxItem.style.borderRadius = "5px";
      boxItem.style.fontWeight = "bold";
      boxItem.style.display = "flex";
      boxItem.style.justifyContent = "space-between";
      boxItem.style.alignItems = "center";
      boxItem.style.width = "90%";
      boxItem.innerText = itemData.name;
      
      // Tik işareti ekle
      let checkmark = document.createElement("span");
      checkmark.innerHTML = "✓";
      checkmark.style.fontSize = "1.2em";
      boxItem.appendChild(checkmark);
      
      // Animasyon ile ekle
      boxItem.style.opacity = "0";
      boxItem.style.transform = "translateX(-20px)";
      fruitItems.appendChild(boxItem);
      
      setTimeout(() => {
        boxItem.style.transition = "all 0.3s ease";
        boxItem.style.opacity = "1";
        boxItem.style.transform = "translateX(0)";
      }, 50);
      
      // Orijinal öğeyi gizle
      let originalItem = leftDiv.querySelector(`.item-container[data-id="${itemData.id}"]`);
      if (originalItem) {
        originalItem.style.transition = "all 0.5s ease";
        originalItem.style.opacity = "0";
        originalItem.style.transform = "scale(0.8)";
        
        setTimeout(() => {
          originalItem.style.display = "none";
        }, 500);
      }
      
      // İlerlemeyi güncelle
      updateProgress();
    } else {
      playWrongSound();
      
      // Hata animasyonu
      fruitBox.style.animation = "shake 0.5s";
      setTimeout(() => {
        fruitBox.style.animation = "";
      }, 500);
      
      showMessage(`"${itemData.name}" bir meyve değil!`, "error");
      setTimeout(clearMessage, 1500);
    }
  }

  container.appendChild(leftDiv);
  container.appendChild(rightDiv);
  puzzleArea.appendChild(container);

  // Sallama animasyonu için stil ekle
  let style = document.createElement("style");
  style.innerHTML = `
    @keyframes shake {
      0% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(-5px, 0) rotate(-2deg); }
      50% { transform: translate(5px, 0) rotate(2deg); }
      75% { transform: translate(-3px, 0) rotate(-1deg); }
      100% { transform: translate(0, 0) rotate(0deg); }
    }
  `;
  document.head.appendChild(style);

  // İlerlemeyi güncelleme fonksiyonu
  function updateProgress() {
    let collectedItems = fruitItems.querySelectorAll("div");
    let fruitCount = items.filter(item => item.type === "fruit").length;
    progressIndicator.innerText = `İlerleme: ${collectedItems.length}/${fruitCount} meyve bulundu`;
    
    // Tüm meyveler toplandı mı kontrol et
    if (collectedItems.length === fruitCount) {
      // Kutlama efekti
      fruitBox.style.backgroundColor = "#e8f5e9";
      fruitBox.style.borderColor = "#4caf50";
      fruitBox.style.boxShadow = "0 0 15px rgba(76, 175, 80, 0.5)";
      
      // Başarı mesajı
      showMessage("Tebrikler! Tüm meyveleri doğru bir şekilde topladın!", "success");
      setTimeout(goNextPuzzle, 2000);
    }
  }
}

function setupPlanet2Puzzle2() {
  puzzleHintText.innerText = "IPUCU: Yapay zeka eğitimi için sadece doğru veri dosyalarını Veri Merkezine yüklemelisin!";

  // Ana açıklama 
  let info = document.createElement("p");
  info.innerHTML = "Yapay zeka için <strong>meyve verilerini</strong> doğru veri merkezine yüklemelisin! <br>Aşağıdaki dosyalardan <strong>sadece meyve verileri</strong> içeren dosyaları bulup sürükle.";
  info.style.fontSize = "1.2em";
  info.style.margin = "0 auto 15px auto";
  info.style.maxWidth = "80%";
  puzzleArea.appendChild(info);

  // İlerleme göstergesi
  let progressContainer = document.createElement("div");
  progressContainer.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  progressContainer.style.borderRadius = "10px";
  progressContainer.style.padding = "8px";
  progressContainer.style.margin = "10px auto";
  progressContainer.style.width = "80%";
  progressContainer.style.maxWidth = "500px";
  progressContainer.style.textAlign = "center";
  
  let progressText = document.createElement("p");
  progressText.innerHTML = "<strong>Görev:</strong> 3 doğru veri dosyasını yükle";
  progressText.style.margin = "0";
  progressText.style.color = "#4a90e2";
  progressText.style.fontWeight = "bold";
  
  progressContainer.appendChild(progressText);
  puzzleArea.appendChild(progressContainer);

  // Oyun alanı container
  let gameContainer = document.createElement("div");
  gameContainer.style.display = "flex";
  gameContainer.style.flexDirection = "column";
  gameContainer.style.alignItems = "center";
  gameContainer.style.justifyContent = "center";
  gameContainer.style.gap = "20px";
  gameContainer.style.margin = "10px auto";
  puzzleArea.appendChild(gameContainer);
  
  // Veri merkezi (drop zone) - KONUM DEĞİŞTİ, ÖNCE VERİ MERKEZİ
  let dataCenter = document.createElement("div");
  dataCenter.classList.add("data-center");
  dataCenter.style.width = "90%";
  dataCenter.style.maxWidth = "500px";
  dataCenter.style.height = "150px";
  dataCenter.style.display = "flex";
  dataCenter.style.flexDirection = "column";
  dataCenter.style.alignItems = "center";
  dataCenter.style.justifyContent = "space-between";
  dataCenter.style.backgroundColor = "rgba(25, 118, 210, 0.1)";
  dataCenter.style.border = "3px dashed #1976d2";
  dataCenter.style.borderRadius = "15px";
  dataCenter.style.padding = "15px";
  dataCenter.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  dataCenter.style.transition = "all 0.3s ease";
  dataCenter.style.marginBottom = "15px"; // Alttan boşluk ekledim
  
  // Veri merkezi başlık
  let dataCenterTitle = document.createElement("div");
  dataCenterTitle.innerHTML = "🖥️ <strong>MEYVE VERİ MERKEZİ</strong> 🖥️";
  dataCenterTitle.style.fontSize = "1.3em";
  dataCenterTitle.style.color = "#1976d2";
  dataCenterTitle.style.fontWeight = "bold";
  dataCenterTitle.style.marginBottom = "10px";
  dataCenter.appendChild(dataCenterTitle);
  
  // Alt metin
  let dataCenterSubtitle = document.createElement("div");
  dataCenterSubtitle.innerText = "Meyve verilerini buraya sürükle";
  dataCenterSubtitle.style.fontSize = "1em";
  dataCenterSubtitle.style.color = "#1976d2";
  dataCenterSubtitle.style.marginBottom = "10px";
  dataCenter.appendChild(dataCenterSubtitle);
  
  // Yüklenen dosyalar alanı
  let uploadedFilesContainer = document.createElement("div");
  uploadedFilesContainer.style.display = "flex";
  uploadedFilesContainer.style.flexWrap = "wrap";
  uploadedFilesContainer.style.justifyContent = "center";
  uploadedFilesContainer.style.gap = "10px";
  uploadedFilesContainer.style.width = "100%";
  dataCenter.appendChild(uploadedFilesContainer);
  
  // Önce veri merkezini ekle - SIRA DEĞİŞTİ
  gameContainer.appendChild(dataCenter);

  // Dosya simgeleri için container
  let filesContainer = document.createElement("div");
  filesContainer.style.display = "flex";
  filesContainer.style.flexWrap = "wrap";
  filesContainer.style.justifyContent = "center";
  filesContainer.style.gap = "15px";
  filesContainer.style.padding = "15px";
  filesContainer.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  filesContainer.style.borderRadius = "15px";
  filesContainer.style.width = "90%";
  filesContainer.style.maxWidth = "600px";
  filesContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  
  // Dosya verileri - doğru ve yanlış dosyalar
  const fileData = [
    { name: "meyve_veri.csv", type: "csv", correct: true, desc: "Elma, muz, çilek veritabanı" },
    { name: "hayvan_veri.json", type: "json", correct: false, desc: "Kedi, köpek veritabanı" },
    { name: "meyveler_bilgi.xlsx", type: "excel", correct: true, desc: "Meyve vitamin değerleri" },
    { name: "oyunlar_liste.txt", type: "text", correct: false, desc: "Bilgisayar oyunları listesi" },
    { name: "meyve_ağaçları.csv", type: "csv", correct: true, desc: "Meyve ağaçları bilgileri" },
    { name: "araçlar_fiyat.xml", type: "xml", correct: false, desc: "Araba ve bisiklet fiyatları" }
  ];
  
  // Dosyaları karıştır
  const shuffledFiles = shuffleArray([...fileData]);

  // Dosya ikonları ve dosya türü renkleri
  const fileIcons = {
    csv: "📊", 
    excel: "📗",
    json: "📘",
    text: "📝",
    xml: "📙"
  };
  
  const fileColors = {
    csv: "#4caf50",  // yeşil
    excel: "#2e7d32", // koyu yeşil
    json: "#2196f3",  // mavi
    text: "#9e9e9e",  // gri
    xml: "#ff9800"    // turuncu
  };
  
  // Doğru yüklenen dosya sayısı
  let correctFilesUploaded = 0;
  const totalCorrectFiles = fileData.filter(file => file.correct).length;
  
  // Dosya elemanlarını oluştur
  shuffledFiles.forEach(file => {
    let fileElement = document.createElement("div");
    fileElement.classList.add("file-item");
    fileElement.draggable = true;
    fileElement.dataset.name = file.name;
    fileElement.dataset.type = file.type;
    fileElement.dataset.correct = file.correct;
    
    fileElement.style.backgroundColor = fileColors[file.type] || "#333";
    fileElement.style.width = "130px";
    fileElement.style.borderRadius = "10px";
    fileElement.style.padding = "10px";
    fileElement.style.cursor = "grab";
    fileElement.style.boxShadow = "0 3px 5px rgba(0, 0, 0, 0.2)";
    fileElement.style.transition = "all 0.2s ease";
    fileElement.style.display = "flex";
    fileElement.style.flexDirection = "column";
    fileElement.style.alignItems = "center";
    fileElement.style.textAlign = "center";
    
    // Dosya ikonu
    let fileIcon = document.createElement("div");
    fileIcon.innerHTML = fileIcons[file.type] || "📄";
    fileIcon.style.fontSize = "2.5em";
    fileIcon.style.marginBottom = "5px";
    
    // Dosya adı
    let fileName = document.createElement("div");
    fileName.innerText = file.name;
    fileName.style.fontWeight = "bold";
    fileName.style.fontSize = "0.9em";
    fileName.style.marginBottom = "5px";
    fileName.style.color = "white";
    
    // Dosya açıklaması
    let fileDesc = document.createElement("div");
    fileDesc.innerText = file.desc;
    fileDesc.style.fontSize = "0.8em";
    fileDesc.style.color = "rgba(255, 255, 255, 0.8)";
    
    fileElement.appendChild(fileIcon);
    fileElement.appendChild(fileName);
    fileElement.appendChild(fileDesc);
    
    // Hover efekti
    fileElement.addEventListener("mouseover", () => {
      fileElement.style.transform = "translateY(-5px)";
      fileElement.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
    });
    
    fileElement.addEventListener("mouseout", () => {
      fileElement.style.transform = "translateY(0)";
      fileElement.style.boxShadow = "0 3px 5px rgba(0, 0, 0, 0.2)";
    });
    
    // Drag olayları
    fileElement.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", file.name);
      e.dataTransfer.setData("application/json", JSON.stringify(file));
      fileElement.style.opacity = "0.6";
    });
    
    fileElement.addEventListener("dragend", () => {
      fileElement.style.opacity = "1";
    });
    
    filesContainer.appendChild(fileElement);
  });
  
  gameContainer.appendChild(filesContainer);
  
  // Drop olayları
  dataCenter.addEventListener("dragover", (e) => {
    e.preventDefault();
    dataCenter.style.backgroundColor = "rgba(25, 118, 210, 0.2)";
    dataCenter.style.borderColor = "#2196f3";
    dataCenter.style.transform = "scale(1.02)";
  });
  
  dataCenter.addEventListener("dragleave", () => {
    dataCenter.style.backgroundColor = "rgba(25, 118, 210, 0.1)";
    dataCenter.style.borderColor = "#1976d2";
    dataCenter.style.transform = "scale(1)";
  });
  
  dataCenter.addEventListener("drop", (e) => {
    e.preventDefault();
    dataCenter.style.backgroundColor = "rgba(25, 118, 210, 0.1)";
    dataCenter.style.borderColor = "#1976d2";
    dataCenter.style.transform = "scale(1)";
    
    try {
      const fileData = JSON.parse(e.dataTransfer.getData("application/json"));
      const fileName = e.dataTransfer.getData("text/plain");
      
      // Dosyayı zaten yükledik mi kontrolü
      const isAlreadyUploaded = [...uploadedFilesContainer.children].some(
        child => child.dataset.name === fileName
      );
      
      if (isAlreadyUploaded) {
        showMessage("Bu dosyayı zaten yükledin!", "error");
        return;
      }
      
      if (fileData.correct) {
        // Doğru dosya
        playCorrectSound();
        
        // Doğru dosya simgesi oluştur
        let uploadedFile = document.createElement("div");
        uploadedFile.dataset.name = fileName;
        uploadedFile.style.backgroundColor = fileColors[fileData.type];
        uploadedFile.style.color = "white";
        uploadedFile.style.padding = "8px";
        uploadedFile.style.borderRadius = "8px";
        uploadedFile.style.display = "flex";
        uploadedFile.style.alignItems = "center";
        uploadedFile.style.fontSize = "0.9em";
        uploadedFile.style.fontWeight = "bold";
        uploadedFile.innerHTML = `${fileIcons[fileData.type]} ${fileName} ✓`;
        
        // Animasyon efekti ile ekle
        uploadedFile.style.transform = "scale(0)";
        uploadedFilesContainer.appendChild(uploadedFile);
        
        setTimeout(() => {
          uploadedFile.style.transition = "transform 0.3s ease";
          uploadedFile.style.transform = "scale(1)";
        }, 50);
        
        // Orijinal dosya elementini bul ve TAMAMEN KALDIR
        let originalFile = filesContainer.querySelector(`[data-name="${fileName}"]`);
        if (originalFile) {
          // Önce güzel bir kaybolma animasyonu
          originalFile.style.transition = "all 0.5s ease";
          originalFile.style.transform = "scale(0.5)";
          originalFile.style.opacity = "0";
          
          // Animasyon bittikten sonra elementi tamamen kaldır
          setTimeout(() => {
            originalFile.remove();
          }, 500);
        }
        
        // Sayaç güncelleme
        correctFilesUploaded++;
        
        // İlerleme göstergesini güncelle
        progressText.innerHTML = `<strong>Görev:</strong> ${correctFilesUploaded}/${totalCorrectFiles} doğru veri dosyası yüklendi`;
        
        // Tüm doğru dosyalar yüklendi mi kontrolü
        if (correctFilesUploaded === totalCorrectFiles) {
          showMessage("Harika! Tüm meyve veri dosyalarını doğru şekilde yükledin!", "success");
          
          // Başarı animasyonu
          dataCenter.style.backgroundColor = "rgba(76, 175, 80, 0.2)";
          dataCenter.style.borderColor = "#4caf50";
          dataCenter.style.boxShadow = "0 0 20px rgba(76, 175, 80, 0.5)";
          
          setTimeout(goNextPuzzle, 2500);
        } else {
          showMessage(`Doğru! Bu bir meyve veri dosyası. ${totalCorrectFiles - correctFilesUploaded} tane daha bul!`, "success");
          setTimeout(clearMessage, 2000);
        }
      } else {
        // Yanlış dosya
        playWrongSound();
        
        // Veri merkezini sallandır (shake animasyonu)
        dataCenter.style.animation = "shake 0.5s";
        
        setTimeout(() => {
          dataCenter.style.animation = "";
        }, 500);
        
        showMessage(`"${fileData.name}" bir meyve veri dosyası değil!`, "error");
        setTimeout(clearMessage, 2000);
      }
    } catch (error) {
      console.error("Error processing dropped file:", error);
    }
  });
  
  // İpucu butonu
  let hintButton = document.createElement("button");
  hintButton.innerText = "İpucu Göster";
  hintButton.style.marginTop = "20px";
  hintButton.style.padding = "10px 15px";
  hintButton.style.backgroundColor = "#ff9800";
  hintButton.style.color = "white";
  hintButton.style.border = "none";
  hintButton.style.borderRadius = "5px";
  hintButton.style.cursor = "pointer";
  hintButton.style.fontWeight = "bold";
  
  hintButton.addEventListener("click", () => {
    showMessage("İpucu: Dosya adında 'meyve' geçen veya açıklamasında meyve içeriği belirtilen dosyaları ara!", "success");
    setTimeout(clearMessage, 4000);
  });
  
  gameContainer.appendChild(hintButton);
  
  // Shake animasyonu için stil ekle (eğer yoksa)
  if (!document.querySelector('style[data-shake-animation]')) {
    let style = document.createElement("style");
    style.setAttribute('data-shake-animation', 'true');
    style.innerHTML = `
      @keyframes shake {
        0% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(-5px, 0) rotate(-1deg); }
        50% { transform: translate(5px, 0) rotate(1deg); }
        75% { transform: translate(-3px, 0) rotate(-0.5deg); }
        100% { transform: translate(0, 0) rotate(0deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

function setupPlanet2Puzzle3() {
  puzzleHintText.innerText = "IPUCU: Yapay zekâ, doğru etiketlenmiş verilerle eğitilir. Her görseli doğru veri kategorisine ayır!";

  // Ana açıklama
  let info = document.createElement("p");
  info.innerHTML = "Yapay zekâ modelimizi eğitmek için görselleri <strong>doğru etiketlemeliyiz</strong>. Her resmin hangi kategoriye ait olduğunu seç!";
  info.style.fontSize = "1.2em";
  info.style.margin = "0 auto 10px auto";
  info.style.maxWidth = "80%";
  puzzleArea.appendChild(info);

  // İlerleme göstergesi
  let progressContainer = document.createElement("div");
  progressContainer.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  progressContainer.style.borderRadius = "10px";
  progressContainer.style.padding = "8px";
  progressContainer.style.margin = "5px auto";
  progressContainer.style.width = "80%";
  progressContainer.style.maxWidth = "500px";
  progressContainer.style.textAlign = "center";
  
  let progressText = document.createElement("p");
  progressText.innerHTML = "<strong>Görev:</strong> Tüm görselleri doğru kategorilere ayır (0/6)";
  progressText.style.margin = "0";
  progressText.style.color = "#4a90e2";
  progressText.style.fontWeight = "bold";
  
  progressContainer.appendChild(progressText);
  puzzleArea.appendChild(progressContainer);

  // Ana oyun container
  let gameContainer = document.createElement("div");
  gameContainer.style.display = "flex";
  gameContainer.style.flexDirection = "column";
  gameContainer.style.alignItems = "center";
  gameContainer.style.gap = "10px";
  gameContainer.style.width = "95%";
  gameContainer.style.maxWidth = "800px";
  gameContainer.style.margin = "0 auto";
  puzzleArea.appendChild(gameContainer);

  // Kategori renklerini tanımla
  const categoryColors = {
    "Meyve": "#4caf50",  // Yeşil
    "Araç": "#2196f3",   // Mavi
    "Hayvan": "#ff9800"  // Turuncu
  };

  // Kategori ikonlarını tanımla
  const categoryIcons = {
    "Meyve": "🍎",
    "Araç": "🚗",
    "Hayvan": "🐶"
  };

  // Görsel verileri (doğru kategorileriyle)
  const imageData = [
    {id: 1, img: "fruit-apple.png", correctCategory: "Meyve", name: "Elma", selected: null},
    {id: 2, img: "fruit-banana.png", correctCategory: "Meyve", name: "Muz", selected: null},
    {id: 3, img: "dog1.png", correctCategory: "Hayvan", name: "Köpek 1", selected: null},
    {id: 4, img: "vehicle-car.png", correctCategory: "Araç", name: "Araba", selected: null},
    {id: 5, img: "vehicle-bus.png", correctCategory: "Araç", name: "Otobüs", selected: null},
    {id: 6, img: "dog2.png", correctCategory: "Hayvan", name: "Köpek 2", selected: null}
  ];

  // Görselleri karıştır
  const shuffledImages = shuffleArray([...imageData]);
  
  // Kategoriler - başlıklar
  const categoriesContainer = document.createElement("div");
  categoriesContainer.style.display = "flex";
  categoriesContainer.style.justifyContent = "space-around";
  categoriesContainer.style.width = "100%";
  categoriesContainer.style.gap = "10px";
  categoriesContainer.style.marginBottom = "10px";
  
  // Üç kategori oluştur
  Object.keys(categoryColors).forEach(category => {
    const categoryBox = document.createElement("div");
    categoryBox.style.backgroundColor = categoryColors[category];
    categoryBox.style.color = "white";
    categoryBox.style.fontWeight = "bold";
    categoryBox.style.padding = "8px";
    categoryBox.style.borderRadius = "8px";
    categoryBox.style.textAlign = "center";
    categoryBox.style.flex = "1";
    categoryBox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    categoryBox.innerHTML = `${categoryIcons[category]} ${category}`;
    categoriesContainer.appendChild(categoryBox);
  });
  
  gameContainer.appendChild(categoriesContainer);

  // İmajlar için grid container - GRID LAYOUT KULLANIYORUZ
  const imagesContainer = document.createElement("div");
  imagesContainer.style.display = "grid";
  imagesContainer.style.gridTemplateColumns = "repeat(3, 1fr)"; // 3 sütun
  imagesContainer.style.gridGap = "10px";
  imagesContainer.style.width = "100%";
  imagesContainer.style.marginBottom = "10px"; // Alt boşluk ekleme
  gameContainer.appendChild(imagesContainer);

  // Kaç tane doğru seçim yapıldı
  let correctSelections = 0;
  
  // Görsel elementleri oluştur
  shuffledImages.forEach(image => {
    // Görsel container
    const imageCard = document.createElement("div");
    imageCard.classList.add("image-card");
    imageCard.dataset.id = image.id;
    imageCard.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    imageCard.style.borderRadius = "10px";
    imageCard.style.padding = "10px";
    // Width kaldırıldı - grid otomatik sığdıracak
    imageCard.style.display = "flex";
    imageCard.style.flexDirection = "column";
    imageCard.style.alignItems = "center";
    imageCard.style.gap = "5px";
    imageCard.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    imageCard.style.transition = "all 0.3s ease";
    
    // Görseli ekle
    const imgElement = document.createElement("img");
    imgElement.src = `images/${image.img}`;
    imgElement.alt = image.name;
    imgElement.style.width = "80px"; // Daha küçük görsel
    imgElement.style.height = "80px";
    imgElement.style.objectFit = "cover";
    imgElement.style.borderRadius = "8px";
    imgElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    imageCard.appendChild(imgElement);
    
    // Resim adı
    const imageName = document.createElement("div");
    imageName.innerText = image.name;
    imageName.style.fontWeight = "bold";
    imageName.style.fontSize = "0.9em";
    imageCard.appendChild(imageName);
    
    // Kategori seçim grubu - daha kompakt hale getirme
    const categorySelector = document.createElement("div");
    categorySelector.style.display = "flex";
    categorySelector.style.flexDirection = "column";
    categorySelector.style.gap = "3px";
    categorySelector.style.width = "100%";
    
    // Kategori seçenekleri
    Object.keys(categoryColors).forEach(category => {
      const radioContainer = document.createElement("div");
      radioContainer.style.display = "flex";
      radioContainer.style.alignItems = "center";
      radioContainer.style.padding = "4px";
      radioContainer.style.borderRadius = "5px";
      radioContainer.style.cursor = "pointer";
      radioContainer.style.transition = "background-color 0.2s";
      
      // Hover efekti
      radioContainer.addEventListener("mouseover", () => {
        radioContainer.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      });
      
      radioContainer.addEventListener("mouseout", () => {
        radioContainer.style.backgroundColor = "transparent";
      });
      
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `category-${image.id}`;
      radio.value = category;
      radio.style.marginRight = "3px";
      radio.style.cursor = "pointer";
      
      const label = document.createElement("label");
      label.innerText = `${categoryIcons[category]} ${category}`;
      label.style.fontSize = "0.8em"; // Daha küçük metin
      label.style.cursor = "pointer";
      
      radioContainer.appendChild(radio);
      radioContainer.appendChild(label);
      
      // Tüm radio container'a tıklama olayı
      radioContainer.addEventListener("click", () => {
        radio.checked = true;
        checkSelection(image, category);
      });
      
      // Radio'ya direkt tıklama olayı
      radio.addEventListener("change", () => {
        if (radio.checked) {
          checkSelection(image, category);
        }
      });
      
      categorySelector.appendChild(radioContainer);
    });
    
    imageCard.appendChild(categorySelector);
    imagesContainer.appendChild(imageCard);
  });
  
  // Seçim kontrolü fonksiyonu
  function checkSelection(image, selectedCategory) {
    // Önceden seçim yapıldıysa ve doğruysa, sayacı azalt
    if (image.selected === image.correctCategory) {
      correctSelections--;
    }
    
    // Yeni seçimi kaydet
    image.selected = selectedCategory;
    
    // Doğru kategoriyse
    if (selectedCategory === image.correctCategory) {
      playCorrectSound();
      correctSelections++;
      
      // Görsel kartını güncelle
      const imageCard = imagesContainer.querySelector(`.image-card[data-id="${image.id}"]`);
      if (imageCard) {
        imageCard.style.backgroundColor = `${categoryColors[selectedCategory]}30`; // %30 opaklık
        imageCard.style.borderLeft = `4px solid ${categoryColors[selectedCategory]}`;
        
        // Hafif bir başarı animasyonu
        imageCard.style.transform = "scale(1.03)";
        setTimeout(() => {
          imageCard.style.transform = "scale(1)";
        }, 300);
      }
      
      showMessage(`Doğru! ${image.name} bir ${selectedCategory.toLowerCase()}dir!`, "success");
      setTimeout(clearMessage, 1500);
    } else {
      // Yanlış kategori
      playWrongSound();
      
      const imageCard = imagesContainer.querySelector(`.image-card[data-id="${image.id}"]`);
      if (imageCard) {
        imageCard.style.backgroundColor = "rgba(244, 67, 54, 0.1)"; // Hafif kırmızı
        imageCard.style.borderLeft = "4px solid #f44336"; // Kırmızı kenarlık
        
        // Sallama animasyonu
        imageCard.style.animation = "shake 0.5s";
        setTimeout(() => {
          imageCard.style.animation = "";
          imageCard.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          imageCard.style.borderLeft = "none";
        }, 500);
      }
      
      showMessage(`Yanlış kategori! ${image.name} bir ${selectedCategory.toLowerCase()} değil.`, "error");
      setTimeout(clearMessage, 1500);
    }
    
    // İlerleme göstergesini güncelle
    progressText.innerHTML = `<strong>Görev:</strong> Tüm görselleri doğru kategorilere ayır (${correctSelections}/${imageData.length})`;
    
    // Tümü doğru mu kontrol et
    if (correctSelections === imageData.length) {
      showMessage("Tebrikler! Tüm görselleri doğru kategorilerine ayırdın!", "success");
      
      // Konfeti efekti ekle
      addConfetti();
      
      setTimeout(goNextPuzzle, 3000);
    }
  }
  
  // Konfeti efekti
  function addConfetti() {
    for (let i = 0; i < 100; i++) {
      let confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.width = (Math.random() * 10 + 5) + "px";
      confetti.style.height = (Math.random() * 10 + 5) + "px";
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.top = "-20px";
      confetti.style.borderRadius = "50%";
      confetti.style.zIndex = "1000";
      
      // Animasyon
      confetti.animate([
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${Math.random() * 100 - 50}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'cubic-bezier(0, .9, .57, 1)'
      });
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }
  
  // İpucu butonu
  let hintButton = document.createElement("button");
  hintButton.innerText = "İpucu Göster";
  hintButton.style.marginTop = "10px";
  hintButton.style.marginBottom = "15px"; // Alt boşluk ekle
  hintButton.style.padding = "8px 15px";
  hintButton.style.backgroundColor = "#ff9800";
  hintButton.style.color = "white";
  hintButton.style.border = "none";
  hintButton.style.borderRadius = "5px";
  hintButton.style.cursor = "pointer";
  hintButton.style.fontWeight = "bold";
  
  hintButton.addEventListener("click", () => {
    showMessage("İpucu: Elma ve muz meyve kategorisine, köpekler hayvan kategorisine, araba ve otobüs araç kategorisine aittir!", "success");
    setTimeout(clearMessage, 5000);
  });
  
  gameContainer.appendChild(hintButton);
  
  // Shake animasyonu için stil ekle (eğer yoksa)
  if (!document.querySelector('style[data-shake-animation]')) {
    let style = document.createElement("style");
    style.setAttribute('data-shake-animation', 'true');
    style.innerHTML = `
      @keyframes shake {
        0% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(-5px, 0) rotate(-1deg); }
        50% { transform: translate(5px, 0) rotate(1deg); }
        75% { transform: translate(-3px, 0) rotate(-0.5deg); }
        100% { transform: translate(0, 0) rotate(0deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

function setupPlanet2Puzzle4() {
  puzzleHintText.innerText = "IPUCU: Yapay zeka robotları için veri oluştur ve doğru veri girişi yapmayı öğren!";

  // Ana açıklama
  let info = document.createElement("p");
  info.innerHTML = "Yapay zeka <strong>ROBOT VERİ MERKEZİ</strong>'ne hoş geldin! Yeni robotlar oluşturup veri tabanına eklemen gerekiyor. Doğru veriler gir!";
  info.style.fontSize = "1.1em";
  info.style.margin = "0 auto 5px auto";
  info.style.maxWidth = "80%";
  puzzleArea.appendChild(info);

  // İlerleme göstergesi
  let progressContainer = document.createElement("div");
  progressContainer.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  progressContainer.style.borderRadius = "5px";
  progressContainer.style.padding = "5px";
  progressContainer.style.margin = "5px auto";
  progressContainer.style.width = "80%";
  progressContainer.style.maxWidth = "500px";
  progressContainer.style.textAlign = "center";
  
  let progressText = document.createElement("p");
  progressText.innerHTML = "<strong>Görev:</strong> En az 3 robot ekle (0/3)";
  progressText.style.margin = "0";
  progressText.style.color = "#4a90e2";
  progressText.style.fontWeight = "bold";
  progressText.style.fontSize = "0.9em";
  
  progressContainer.appendChild(progressText);
  puzzleArea.appendChild(progressContainer);

  // Ana oyun container - YAN YANA GÖRÜNÜM (flex-row) OLARAK DEĞİŞTİRİLDİ
  let gameContainer = document.createElement("div");
  gameContainer.style.display = "flex";
  gameContainer.style.flexDirection = "row"; // Column yerine row
  gameContainer.style.alignItems = "flex-start";
  gameContainer.style.justifyContent = "center";
  gameContainer.style.gap = "15px";
  gameContainer.style.width = "95%";
  gameContainer.style.maxWidth = "900px";
  gameContainer.style.margin = "5px auto";
  gameContainer.style.flexWrap = "wrap"; // Küçük ekranlarda alt alta düşsün
  puzzleArea.appendChild(gameContainer);

  // SOL PANEL - Robot oluşturma formu
  let formPanel = document.createElement("div");
  formPanel.style.flex = "1";
  formPanel.style.minWidth = "280px";
  formPanel.style.maxWidth = "400px";
  formPanel.style.backgroundColor = "rgba(25, 118, 210, 0.1)";
  formPanel.style.borderRadius = "10px";
  formPanel.style.padding = "10px";
  formPanel.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  
  // Form başlık
  let formTitle = document.createElement("div");
  formTitle.innerHTML = "🤖 <strong>YENİ ROBOT OLUŞTUR</strong>";
  formTitle.style.fontSize = "1.1em";
  formTitle.style.color = "#1976d2";
  formTitle.style.textAlign = "center";
  formTitle.style.marginBottom = "8px";
  formPanel.appendChild(formTitle);
  
  // Form alanları containerı
  let formFields = document.createElement("div");
  formFields.style.display = "flex";
  formFields.style.flexDirection = "column";
  formFields.style.gap = "8px";
  formPanel.appendChild(formFields);
  
  // Form alanları
  const fieldData = [
    {
      id: "robotName",
      label: "Robot Adı:",
      placeholder: "Robot adı gir (ör: R2D2)",
      type: "text",
      validation: (value) => value.trim().length >= 3,
      errorMsg: "Robot adı en az 3 karakter olmalı!",
      icon: "🔤"
    },
    {
      id: "robotType",
      label: "Robot Türü:",
      placeholder: "Robot türü seç",
      type: "select",
      options: ["Yardımcı Robot", "Keşif Robotu", "Öğretmen Robot", "Temizlik Robotu", "Uzay Robotu"],
      validation: (value) => value !== "Seçiniz...",
      errorMsg: "Bir robot türü seçmelisin!",
      icon: "🔍"
    },
    {
      id: "robotPower",
      label: "Güç Seviyesi (1-10):",
      placeholder: "1-10 arası sayı",
      type: "number",
      validation: (value) => {
        const num = parseInt(value);
        return !isNaN(num) && num >= 1 && num <= 10;
      },
      errorMsg: "Güç 1-10 arası sayı olmalı!",
      icon: "⚡"
    },
    {
      id: "robotTask",
      label: "Robot Görevi:",
      placeholder: "Robotun görevini yaz",
      type: "text",
      validation: (value) => value.trim().length >= 5,
      errorMsg: "Görev en az 5 karakter olmalı!",
      icon: "📝"
    },
    {
      id: "robotColor",
      label: "Robot Rengi:",
      placeholder: "Robot rengini seç",
      type: "select",
      options: ["Mavi", "Kırmızı", "Yeşil", "Sarı", "Mor", "Turuncu", "Gri"],
      validation: (value) => value !== "Seçiniz...",
      errorMsg: "Bir renk seçmelisin!",
      icon: "🎨"
    }
  ];
  
  // Form elemanlarını oluştur
  const formElements = {};
  
  fieldData.forEach(field => {
    // Her alan için container
    const fieldContainer = document.createElement("div");
    fieldContainer.style.display = "flex";
    fieldContainer.style.flexDirection = "column";
    fieldContainer.style.gap = "3px";
    
    // Etiket
    const label = document.createElement("label");
    label.innerHTML = `${field.icon} ${field.label}`;
    label.style.fontWeight = "bold";
    label.style.fontSize = "0.85em";
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.gap = "5px";
    fieldContainer.appendChild(label);
    
    // Input alanı (metin, sayı veya select)
    let inputElement;
    
    if (field.type === "select") {
      inputElement = document.createElement("select");
      
      // Default option
      const defaultOption = document.createElement("option");
      defaultOption.value = "Seçiniz...";
      defaultOption.innerText = "Seçiniz...";
      inputElement.appendChild(defaultOption);
      
      // Diğer seçenekler
      field.options.forEach(optionText => {
        const option = document.createElement("option");
        option.value = optionText;
        option.innerText = optionText;
        inputElement.appendChild(option);
      });
    } else {
      inputElement = document.createElement("input");
      inputElement.type = field.type;
      inputElement.placeholder = field.placeholder;
    }
    
    // Ortak stiller
    inputElement.id = field.id;
    inputElement.style.padding = "6px 8px";
    inputElement.style.borderRadius = "5px";
    inputElement.style.border = "1px solid #ccc";
    inputElement.style.fontSize = "0.9em";
    
    // Validation için event listener
    inputElement.addEventListener("change", () => {
      validateField(field.id, field.validation, field.errorMsg);
    });
    
    // Blur olayı (odaktan çıkınca doğrulama)
    inputElement.addEventListener("blur", () => {
      validateField(field.id, field.validation, field.errorMsg);
    });
    
    fieldContainer.appendChild(inputElement);
    
    // Hata mesajı alanı
    const errorMsg = document.createElement("div");
    errorMsg.id = `${field.id}Error`;
    errorMsg.style.color = "#f44336";
    errorMsg.style.fontSize = "0.75em";
    errorMsg.style.height = "12px"; // Sabit yükseklik ki layout değişmesin
    fieldContainer.appendChild(errorMsg);
    
    formFields.appendChild(fieldContainer);
    
    // Referansı sakla
    formElements[field.id] = {
      element: inputElement,
      errorElement: errorMsg,
      validation: field.validation,
      errorMsg: field.errorMsg
    };
  });
  
  // Kaydet butonu
  let saveButton = document.createElement("button");
  saveButton.innerText = "Robotu Veri Tabanına Ekle";
  saveButton.style.marginTop = "10px";
  saveButton.style.padding = "8px 12px";
  saveButton.style.backgroundColor = "#4caf50";
  saveButton.style.color = "white";
  saveButton.style.border = "none";
  saveButton.style.borderRadius = "5px";
  saveButton.style.cursor = "pointer";
  saveButton.style.fontWeight = "bold";
  saveButton.style.width = "100%";
  saveButton.style.fontSize = "0.9em";
  formPanel.appendChild(saveButton);
  
  // Validation fonksiyonu
  function validateField(fieldId, validationFn, errorMessage) {
    const field = formElements[fieldId];
    const value = field.element.value;
    const isValid = validationFn(value);
    
    if (!isValid) {
      field.errorElement.innerText = errorMessage;
      field.element.style.borderColor = "#f44336";
      return false;
    } else {
      field.errorElement.innerText = "";
      field.element.style.borderColor = "#4caf50";
      return true;
    }
  }
  
  // Tüm form validasyonu
  function validateForm() {
    let isValid = true;
    
    Object.keys(formElements).forEach(fieldId => {
      const field = formElements[fieldId];
      if (!validateField(fieldId, field.validation, field.errorMsg)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  gameContainer.appendChild(formPanel);
  
  // SAĞ PANEL - Robot veri tabanı
  let databasePanel = document.createElement("div");
  databasePanel.style.flex = "1";
  databasePanel.style.minWidth = "280px";
  databasePanel.style.maxWidth = "450px";
  databasePanel.style.backgroundColor = "rgba(33, 150, 243, 0.1)";
  databasePanel.style.borderRadius = "10px";
  databasePanel.style.padding = "10px";
  databasePanel.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  databasePanel.style.display = "flex";
  databasePanel.style.flexDirection = "column";
  
  // Veri tabanı başlık
  let dbTitle = document.createElement("div");
  dbTitle.innerHTML = "💾 <strong>ROBOT VERİ TABANI</strong>";
  dbTitle.style.fontSize = "1.1em";
  dbTitle.style.color = "#1976d2";
  dbTitle.style.textAlign = "center";
  dbTitle.style.marginBottom = "8px";
  databasePanel.appendChild(dbTitle);
  
  // Veri tablosu container
  let tableContainer = document.createElement("div");
  tableContainer.style.overflowX = "auto";
  tableContainer.style.maxHeight = "200px"; // Maksimum yükseklik
  tableContainer.style.overflowY = "auto"; // Dikey scroll
  tableContainer.style.flex = "1";
  databasePanel.appendChild(tableContainer);
  
  // Veri tablosu
  let dataTable = document.createElement("table");
  dataTable.style.width = "100%";
  dataTable.style.borderCollapse = "collapse";
  dataTable.style.marginBottom = "5px";
  dataTable.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  tableContainer.appendChild(dataTable);
  
  // Tablo başlıkları
  let tableHead = document.createElement("thead");
  let headerRow = document.createElement("tr");
  
  // Başlık sütunları
  const tableHeaders = ["Robot Adı", "Türü", "Güç", "Görev", "Renk"];
  tableHeaders.forEach(headerText => {
    let th = document.createElement("th");
    th.innerText = headerText;
    th.style.padding = "6px";
    th.style.fontSize = "0.85em";
    th.style.borderBottom = "2px solid #1976d2";
    th.style.textAlign = "left";
    headerRow.appendChild(th);
  });
  
  tableHead.appendChild(headerRow);
  dataTable.appendChild(tableHead);
  
  // Tablo gövdesi
  let tableBody = document.createElement("tbody");
  tableBody.id = "robotTableBody";
  dataTable.appendChild(tableBody);
  
  gameContainer.appendChild(databasePanel);
  
  // İpucu butonu
  let hintButton = document.createElement("button");
  hintButton.innerText = "İpucu Göster";
  hintButton.style.marginTop = "10px";
  hintButton.style.marginBottom = "5px";
  hintButton.style.padding = "6px 12px";
  hintButton.style.backgroundColor = "#ff9800";
  hintButton.style.color = "white";
  hintButton.style.border = "none";
  hintButton.style.borderRadius = "5px";
  hintButton.style.cursor = "pointer";
  hintButton.style.fontWeight = "bold";
  hintButton.style.fontSize = "0.9em";
  
  hintButton.addEventListener("click", () => {
    showMessage("İpucu: Tüm alanları doğru şekilde doldur. Robot adı 3+ karakterli, güç 1-10 arası, görev 5+ karakterli olmalı ve açılır menülerden seçim yapmalısın!", "success");
    setTimeout(clearMessage, 5000);
  });
  
  puzzleArea.appendChild(hintButton);
  
  // Robot sayacı
  let robotCount = 0;
  const requiredRobots = 3;
  
  // Kaydetme işlemi
  saveButton.addEventListener("click", () => {
    if (validateForm()) {
      playCorrectSound();
      
      // Robot verisini tabloya ekle
      addRobotToTable({
        name: formElements.robotName.element.value,
        type: formElements.robotType.element.value,
        power: formElements.robotPower.element.value,
        task: formElements.robotTask.element.value,
        color: formElements.robotColor.element.value
      });
      
      // Formu temizle
      clearForm();
      
      showMessage("Robot başarıyla veri tabanına eklendi!", "success");
      setTimeout(clearMessage, 2000);
      
    } else {
      playWrongSound();
      showMessage("Lütfen form hatalarını düzelt!", "error");
      setTimeout(clearMessage, 2000);
    }
  });
  
  // Robotu tabloya ekle
  function addRobotToTable(robot) {
    // Renk CSS karşılıkları
    const colorMap = {
      "Mavi": "#2196f3",
      "Kırmızı": "#f44336",
      "Yeşil": "#4caf50",
      "Sarı": "#ffeb3b",
      "Mor": "#9c27b0",
      "Turuncu": "#ff9800",
      "Gri": "#9e9e9e"
    };
    
    // Yeni satır oluştur
    let newRow = document.createElement("tr");
    newRow.style.animation = "fadeIn 0.5s";
    
    // Hücreleri ekle
    for (const key of ["name", "type", "power", "task", "color"]) {
      let cell = document.createElement("td");
      cell.innerText = robot[key];
      cell.style.padding = "5px";
      cell.style.fontSize = "0.85em";
      cell.style.borderBottom = "1px solid #ddd";
      
      // Görev metni çok uzunsa kısalt
      if (key === "task" && robot[key].length > 15) {
        cell.innerText = robot[key].substring(0, 15) + "...";
        cell.title = robot[key]; // Tam metni tooltip olarak göster
      }
      
      // Renk hücresi ise arkaplan renklendir
      if (key === "color") {
        cell.style.backgroundColor = colorMap[robot[key]];
        cell.style.color = ["Sarı", "Yeşil"].includes(robot[key]) ? "#000" : "#fff";
        cell.style.fontWeight = "bold";
      }
      
      newRow.appendChild(cell);
    }
    
    // Tablet'a satırı ekle
    tableBody.appendChild(newRow);
    
    // Sayacı artır
    robotCount++;
    progressText.innerHTML = `<strong>Görev:</strong> En az 3 robot ekle (${robotCount}/${requiredRobots})`;
    
    // Yeterli robot eklendi mi kontrol et
    if (robotCount >= requiredRobots) {
      // CSS animasyonu ile tablonun etrafını parıldat
      dataTable.style.boxShadow = "0 0 20px rgba(76, 175, 80, 0.7)";
      dataTable.style.transition = "box-shadow 0.5s";
      
      setTimeout(() => {
        showMessage("Tebrikler! Robot veri tabanını başarıyla doldurdun!", "success");
        addConfetti();
        setTimeout(goNextPuzzle, 3000);
      }, 1000);
    }
  }
  
  // Form temizleme
  function clearForm() {
    Object.keys(formElements).forEach(fieldId => {
      const field = formElements[fieldId];
      field.element.value = field.element.type === "select-one" ? "Seçiniz..." : "";
      field.element.style.borderColor = "#ccc";
      field.errorElement.innerText = "";
    });
  }
  
  // Konfeti efekti
  function addConfetti() {
    for (let i = 0; i < 100; i++) {
      let confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.width = (Math.random() * 10 + 5) + "px";
      confetti.style.height = (Math.random() * 10 + 5) + "px";
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.top = "-20px";
      confetti.style.borderRadius = "50%";
      confetti.style.zIndex = "1000";
      
      // Animasyon
      confetti.animate([
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${Math.random() * 100 - 50}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'cubic-bezier(0, .9, .57, 1)'
      });
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }
  
  // CSS animasyonu için stil ekle
  if (!document.querySelector('style[data-fade-animation]')) {
    let style = document.createElement("style");
    style.setAttribute('data-fade-animation', 'true');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}

function setupPlanet2Puzzle5() {
  puzzleHintText.innerText = "IPUCU: Veri Dedektifi olarak, hatalı veri değerlerini bulmalısın!";

  // Ana açıklama
  let info = document.createElement("p");
  info.innerHTML = "Yapay zeka modelimizi beslemek için <strong>Veri Dedektifi</strong> olarak görevlendirildin! Aşağıdaki veri tablosunda <strong>mantıksız değerleri</strong> tespit et ve düzelt. Hatalı verileri bul!";
  info.style.fontSize = "1.1em"; // Biraz daha küçük font
  info.style.margin = "0 auto 5px auto"; // Üst marjını azalt
  info.style.maxWidth = "90%";
  puzzleArea.appendChild(info);

  // İlerleme göstergesi
  let progressContainer = document.createElement("div");
  progressContainer.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  progressContainer.style.borderRadius = "10px";
  progressContainer.style.padding = "5px"; // Padding azaltıldı
  progressContainer.style.margin = "2px auto"; // Marj azaltıldı
  progressContainer.style.width = "80%";
  progressContainer.style.maxWidth = "500px";
  progressContainer.style.textAlign = "center";
  
  let progressText = document.createElement("p");
  progressText.innerHTML = "<strong>Görev:</strong> 4 hatalı veri değerini bul (0/4)";
  progressText.style.margin = "0";
  progressText.style.color = "#4a90e2";
  progressText.style.fontWeight = "bold";
  progressText.style.fontSize = "0.85em"; // Font boyutu azaltıldı
  
  progressContainer.appendChild(progressText);
  puzzleArea.appendChild(progressContainer);

  // Ana oyun container
  let gameContainer = document.createElement("div");
  gameContainer.style.display = "flex";
  gameContainer.style.flexDirection = "column";
  gameContainer.style.alignItems = "center";
  gameContainer.style.gap = "5px"; // Gap azaltıldı
  gameContainer.style.width = "95%";
  gameContainer.style.maxWidth = "800px";
  gameContainer.style.margin = "0 auto";
  puzzleArea.appendChild(gameContainer);

  // Hikaye bağlamı - daha kompakt hale getir
  let storyContext = document.createElement("div");
  storyContext.style.backgroundColor = "rgba(33, 150, 243, 0.1)";
  storyContext.style.borderRadius = "10px";
  storyContext.style.padding = "8px"; // Padding azaltıldı
  storyContext.style.marginBottom = "5px"; // Alt marj azaltıldı
  storyContext.style.textAlign = "left";
  storyContext.style.fontSize = "0.85em"; // Font boyutu küçültüldü
  storyContext.style.lineHeight = "1.3"; // Satır yüksekliği azaltıldı
  storyContext.innerHTML = `
    <p><strong>📋 VERİ DEDEKTİFİ RAPORU:</strong> Okul kütüphanesindeki kitapların verilerini topluyoruz, 
    ama bazı veriler <em>yanlış girilmiş</em>. Yapay zekâ bu hatalı verilerle eğitilirse yanlış sonuçlar üretebilir. 
    Hatalı verileri bulup işaretlemelisin!</p>
  `;
  gameContainer.appendChild(storyContext);

  // Veri tablosu container - yükseklik sınırla ve kaydırma ekle
  let tableContainer = document.createElement("div");
  tableContainer.style.width = "100%";
  tableContainer.style.maxHeight = "260px"; // Maksimum yükseklik ekle
  tableContainer.style.overflowY = "auto"; // Dikey kaydırma ekle
  tableContainer.style.overflowX = "auto"; // Yatay kaydırma korun
  tableContainer.style.marginBottom = "8px"; // Alt marj azaltıldı
  tableContainer.style.border = "1px solid rgba(0,0,0,0.1)"; // Sınır ekle
  tableContainer.style.borderRadius = "5px";
  gameContainer.appendChild(tableContainer);

  // Veri tablosu
  let dataTable = document.createElement("table");
  dataTable.style.width = "100%";
  dataTable.style.borderCollapse = "collapse";
  dataTable.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  dataTable.style.color = "#333";
  dataTable.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"; // Gölgeyi azalt
  dataTable.style.fontSize = "0.85em"; // Font boyutu küçültüldü
  tableContainer.appendChild(dataTable);

  // Tablo başlığı
  let tableHead = document.createElement("thead");
  let headerRow = document.createElement("tr");
  headerRow.style.backgroundColor = "#4a90e2";
  headerRow.style.color = "white";
  headerRow.style.position = "sticky"; // Başlık satırını sabit yap
  headerRow.style.top = "0"; // Üstte sabit kal
  headerRow.style.zIndex = "10"; // Başlık satırını diğer elementlerin üzerinde tut

  // Başlık sütunları
  const headers = ["Kitap No", "Kitap Adı", "Sayfa", "Yaş Grubu", "Kategori", "İlgi (1-5)"]; // Başlıkları kısalt
  headers.forEach(header => {
    let th = document.createElement("th");
    th.innerText = header;
    th.style.padding = "6px 8px"; // Padding azaltıldı
    th.style.textAlign = "left";
    th.style.whiteSpace = "nowrap"; // Başlığı tek satırda tut
    headerRow.appendChild(th);
  });
  tableHead.appendChild(headerRow);
  dataTable.appendChild(tableHead);

  // Tablo gövdesi
  let tableBody = document.createElement("tbody");
  dataTable.appendChild(tableBody);

  // Kitap verileri - bazıları hatalı (mantıksız) değerler içeriyor
  // Hatalı olanlar: 
  // 1. Harry Potter - 9999 sayfa (çok fazla)
  // 2. Bilim Ansiklopedisi - yaş grubu 1-2 yaş (çok küçük)
  // 3. Minik Serçe - İlgi seviyesi 10 (1-5 arası olmalı)
  // 4. İlk Sözcüklerim - 400 sayfa (çok fazla)
  const bookData = [
    {id: "K001", name: "Harry Potter", pages: 9999, ageGroup: "9-12 yaş", category: "Fantastik", interest: 4, hasError: "pages"},
    {id: "K002", name: "Küçük Prens", pages: 96, ageGroup: "7-9 yaş", category: "Klasik", interest: 5, hasError: null},
    {id: "K003", name: "Beyaz Diş", pages: 320, ageGroup: "10-14 yaş", category: "Macera", interest: 3, hasError: null},
    {id: "K004", name: "Bilim Ansiklopedisi", pages: 250, ageGroup: "1-2 yaş", category: "Bilim", interest: 4, hasError: "ageGroup"},
    {id: "K005", name: "Minik Serçe", pages: 24, ageGroup: "4-6 yaş", category: "Hikaye", interest: 10, hasError: "interest"},
    {id: "K006", name: "Matematik Dünyası", pages: 180, ageGroup: "8-10 yaş", category: "Eğitim", interest: 3, hasError: null},
    {id: "K007", name: "Uzay Macerası", pages: 150, ageGroup: "7-9 yaş", category: "Bilim Kurgu", interest: 5, hasError: null},
    {id: "K008", name: "İlk Sözcüklerim", pages: 400, ageGroup: "2-4 yaş", category: "Eğitim", interest: 2, hasError: "pages"},
    {id: "K009", name: "Meraklı Çocuklar İçin", pages: 120, ageGroup: "5-7 yaş", category: "Aktivite", interest: 4, hasError: null},
    {id: "K010", name: "Orman Dostları", pages: 48, ageGroup: "3-5 yaş", category: "Hayvanlar", interest: 3, hasError: null}
  ];

  // Doğru cevap sayısı
  let correctAnswersCount = 0;
  const totalErrors = bookData.filter(book => book.hasError).length;

  // Veri satırlarını oluştur
  bookData.forEach(book => {
    let row = document.createElement("tr");
    row.style.borderBottom = "1px solid #ddd";
    row.dataset.hasError = book.hasError ? "true" : "false";
    row.dataset.errorType = book.hasError || "";
    
    // Kitap numarası
    let idCell = document.createElement("td");
    idCell.innerText = book.id;
    idCell.style.padding = "6px 8px"; // Padding azaltıldı
    idCell.style.fontWeight = "bold";
    row.appendChild(idCell);
    
    // Kitap adı
    let nameCell = document.createElement("td");
    nameCell.innerText = book.name;
    nameCell.style.padding = "6px 8px"; // Padding azaltıldı
    row.appendChild(nameCell);
    
    // Sayfa sayısı - tıklanabilir hata olabilir
    let pagesCell = document.createElement("td");
    pagesCell.innerText = book.pages;
    pagesCell.style.padding = "6px 8px"; // Padding azaltıldı
    if (book.hasError === "pages") {
      pagesCell.style.cursor = "pointer";
      pagesCell.style.position = "relative";
      pagesCell.style.textDecoration = "underline dotted"; // Hatalı değerlere altı noktalı çizgi ekle
      pagesCell.style.color = "#d32f2f"; // Hatalı değerlere kırmızı renk ver
      
      pagesCell.addEventListener("click", () => handleErrorClick(row, pagesCell, "pages"));
    }
    row.appendChild(pagesCell);
    
    // Yaş grubu - tıklanabilir hata olabilir
    let ageCell = document.createElement("td");
    ageCell.innerText = book.ageGroup;
    ageCell.style.padding = "6px 8px"; // Padding azaltıldı
    if (book.hasError === "ageGroup") {
      ageCell.style.cursor = "pointer";
      ageCell.style.position = "relative";
      ageCell.style.textDecoration = "underline dotted"; // Hatalı değerlere altı noktalı çizgi ekle
      ageCell.style.color = "#d32f2f"; // Hatalı değerlere kırmızı renk ver
      
      ageCell.addEventListener("click", () => handleErrorClick(row, ageCell, "ageGroup"));
    }
    row.appendChild(ageCell);
    
    // Kategori
    let categoryCell = document.createElement("td");
    categoryCell.innerText = book.category;
    categoryCell.style.padding = "6px 8px"; // Padding azaltıldı
    row.appendChild(categoryCell);
    
    // İlgi seviyesi - tıklanabilir hata olabilir
    let interestCell = document.createElement("td");
    interestCell.innerText = book.interest;
    interestCell.style.padding = "6px 8px"; // Padding azaltıldı
    if (book.hasError === "interest") {
      interestCell.style.cursor = "pointer";
      interestCell.style.position = "relative";
      interestCell.style.textDecoration = "underline dotted"; // Hatalı değerlere altı noktalı çizgi ekle
      interestCell.style.color = "#d32f2f"; // Hatalı değerlere kırmızı renk ver
      
      interestCell.addEventListener("click", () => handleErrorClick(row, interestCell, "interest"));
    }
    row.appendChild(interestCell);
    
    tableBody.appendChild(row);
  });

  // Hata tıklama işleyicisi
  function handleErrorClick(row, cell, errorType) {
    // Zaten doğrulanmış hatayı tekrar işleme
    if (cell.dataset.verified === "true") return;
    
    playCorrectSound();
    
    // Hücreyi vurgula
    cell.style.backgroundColor = "#4caf50";
    cell.style.color = "white";
    cell.style.fontWeight = "bold";
    cell.style.textDecoration = "none"; // Altı çizgiyi kaldır
    
    // İşaretleme ikonu ekle
    let checkmark = document.createElement("span");
    checkmark.innerHTML = " ✓";
    checkmark.style.color = "white";
    checkmark.style.fontWeight = "bold";
    cell.appendChild(checkmark);
    
    // Doğrulandı olarak işaretle
    cell.dataset.verified = "true";
    
    // Doğru değeri göster (düzeltme önerisi)
    let suggestion;
    switch(errorType) {
      case "pages":
        const bookName = row.children[1].innerText;
        suggestion = bookName === "Harry Potter" ? "~350" : "~30";
        break;
      case "ageGroup":
        suggestion = "10-14 yaş";
        break;
      case "interest":
        suggestion = "5";
        break;
      default:
        suggestion = "Düzeltilmeli";
    }
    
    // Tooltip ile düzeltme önerisi göster
    let tooltip = document.createElement("div");
    tooltip.innerText = `Hatalı değer! Doğrusu: ${suggestion} olmalı`;
    tooltip.style.position = "absolute";
    tooltip.style.top = "100%";
    tooltip.style.left = "0";
    tooltip.style.backgroundColor = "#4caf50";
    tooltip.style.color = "white";
    tooltip.style.padding = "4px";
    tooltip.style.borderRadius = "3px";
    tooltip.style.zIndex = "100";
    tooltip.style.whiteSpace = "nowrap";
    tooltip.style.fontSize = "0.8em";
    tooltip.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    
    cell.appendChild(tooltip);
    
    // 2 saniye sonra tooltip'i kaldır
    setTimeout(() => {
      if (tooltip && tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    }, 2000);
    
    // İlerleme güncelle
    correctAnswersCount++;
    progressText.innerHTML = `<strong>Görev:</strong> 4 hatalı veri değerini bul (${correctAnswersCount}/${totalErrors})`;
    
    // Tümü bulundu mu?
    if (correctAnswersCount === totalErrors) {
      showMessage("Tebrikler! Tüm hatalı verileri tespit ettin!", "success");
      // 2 saniye sonra mesajı temizle
      setTimeout(clearMessage, 2000);
      
      // Başarı animasyonu
      dataTable.style.boxShadow = "0 0 20px rgba(76, 175, 80, 0.7)";
      dataTable.style.transition = "box-shadow 0.5s";
      
      // Konfeti efekti
      setTimeout(() => {
        addConfetti();
        setTimeout(goNextPuzzle, 3000);
      }, 1000);
    } else {
      showMessage(`Doğru! Bir hatalı veri buldun. ${totalErrors - correctAnswersCount} tane daha var!`, "success");
      // 2 saniye sonra mesajı temizle
      setTimeout(clearMessage, 2000);
    }
  }

  // İpucu butonu
  let hintButton = document.createElement("button");
  hintButton.innerText = "İpucu Göster";
  hintButton.style.padding = "6px 12px"; // Padding azaltıldı
  hintButton.style.backgroundColor = "#ff9800";
  hintButton.style.color = "white";
  hintButton.style.border = "none";
  hintButton.style.borderRadius = "5px";
  hintButton.style.cursor = "pointer";
  hintButton.style.fontWeight = "bold";
  hintButton.style.fontSize = "0.9em";
  hintButton.style.marginTop = "5px"; // Üst marj ekle
  
  hintButton.addEventListener("click", () => {
    showMessage("İpucu: Dikkat et! Sayfa sayıları mantıklı mı? Yaş grupları doğru mu? İlgi seviyesi 1-5 arası olmalı!", "success");
    // 2 saniye sonra mesajı temizle
    setTimeout(clearMessage, 2000);
  });
  
  gameContainer.appendChild(hintButton);
  
  // Konfeti efekti
  function addConfetti() {
    for (let i = 0; i < 100; i++) {
      let confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.width = (Math.random() * 10 + 5) + "px";
      confetti.style.height = (Math.random() * 10 + 5) + "px";
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.top = "-20px";
      confetti.style.borderRadius = "50%";
      confetti.style.zIndex = "1000";
      
      // Animasyon
      confetti.animate([
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${Math.random() * 100 - 50}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'cubic-bezier(0, .9, .57, 1)'
      });
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }
}

/****************************************************************
 ************* 3) MAKİNE ÖĞRENİMİ LAB (5 Puzzle) ****************
 ****************************************************************/
function setupPlanet3Puzzle1() {
  puzzleHintText.innerText = "IPUCU: Kedi ve köpek resimlerini doğru kutulara sürükleyerek yapay zekaya öğret!";

  // Makine öğrenimi açıklama kutusu
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(103, 58, 183, 0.1)"; // Mor tonda arka plan
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "12px";
  infoBox.style.marginBottom = "10px"; // Marjı azalttım
  infoBox.style.border = "2px solid rgba(103, 58, 183, 0.3)";
  infoBox.style.maxWidth = "90%";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";

  // Açıklama başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "🧠 Makine Öğrenmesi Nedir?";
  infoTitle.style.margin = "0 0 8px 0";
  infoTitle.style.color = "#673AB7"; // Mor renk
  infoTitle.style.fontSize = "1.1em";
  infoBox.appendChild(infoTitle);

  // Açıklama metni
  let infoText = document.createElement("p");
  infoText.innerHTML = "Makine öğrenmesi, bilgisayarların <strong>örneklerden öğrenmesini</strong> sağlar. Bir çocuğa kedi ve köpek resimlerini gösterip farklarını öğrettiğimiz gibi, yapay zekaya da birçok kedi ve köpek resmi göstererek hangisinin hangisi olduğunu öğretebiliriz. Ne kadar çok doğru örnek gösterirsek, yapay zeka o kadar iyi öğrenir! Haydi şimdi sen de yapay zekaya kedi ve köpekleri tanımayı öğret!";
  infoText.style.margin = "0";
  infoText.style.fontSize = "0.95em";
  infoText.style.lineHeight = "1.4";
  infoBox.appendChild(infoText);

  puzzleArea.appendChild(infoBox);

  // İlerleme göstergesi
  let progressContainer = document.createElement("div");
  progressContainer.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  progressContainer.style.borderRadius = "10px";
  progressContainer.style.padding = "5px";
  progressContainer.style.margin = "5px auto 10px auto"; // Alt marjı azalttım
  progressContainer.style.width = "80%";
  progressContainer.style.maxWidth = "500px";
  progressContainer.style.textAlign = "center";
  
  let progressText = document.createElement("p");
  progressText.innerHTML = "<strong>Eğitim İlerlemesi:</strong> 0/6 görsel sınıflandırıldı";
  progressText.style.margin = "0";
  progressText.style.color = "#4a90e2";
  progressText.style.fontWeight = "bold";
  progressText.style.fontSize = "0.9em";
  
  progressContainer.appendChild(progressText);
  puzzleArea.appendChild(progressContainer);

  // Ana oyun container
  let gameContainer = document.createElement("div");
  gameContainer.style.display = "flex";
  gameContainer.style.justifyContent = "space-around";
  gameContainer.style.alignItems = "flex-start";
  gameContainer.style.flexWrap = "wrap";
  gameContainer.style.gap = "20px";
  gameContainer.style.width = "90%";
  gameContainer.style.maxWidth = "800px";
  gameContainer.style.margin = "0 auto";
  puzzleArea.appendChild(gameContainer);

  let items = [
    {img: "cat1.png", type: "cat", label: "Kedi 1"},
    {img: "cat2.png", type: "cat", label: "Kedi 2"},
    {img: "cat3.png", type: "cat", label: "Kedi 3"},
    {img: "dog1.png", type: "dog", label: "Köpek 1"},
    {img: "dog2.png", type: "dog", label: "Köpek 2"},
    {img: "dog3.png", type: "dog", label: "Köpek 3"},
  ];
  items = shuffleArray(items);

  // Görsel galerisi (sol bölüm)
  let gallerySection = document.createElement("div");
  gallerySection.style.flex = "1";
  gallerySection.style.minWidth = "280px";
  gallerySection.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
  gallerySection.style.borderRadius = "10px";
  gallerySection.style.padding = "15px";
  gallerySection.style.display = "flex";
  gallerySection.style.flexWrap = "wrap";
  gallerySection.style.justifyContent = "center";
  gallerySection.style.gap = "15px";
  gallerySection.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  gallerySection.style.maxHeight = "280px"; // Maksimum yükseklik ekledim
  gallerySection.style.overflowY = "auto"; // İçerik taşarsa kaydırma çubuğu

  // Başlık
  let galleryTitle = document.createElement("div");
  galleryTitle.innerText = "📸 Hayvan Görselleri";
  galleryTitle.style.width = "100%";
  galleryTitle.style.textAlign = "center";
  galleryTitle.style.fontWeight = "bold";
  galleryTitle.style.fontSize = "1em";
  galleryTitle.style.marginBottom = "10px";
  galleryTitle.style.color = "#333";
  gallerySection.appendChild(galleryTitle);

  // Sürükleme değişkenleri
  let draggingItem = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let dragClone = null;
  let currentDropzone = null;
  
  // Genel sürükleme olayları
  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('touchmove', handleDragMove, { passive: false });
  document.addEventListener('mouseup', handleDragEnd);
  document.addEventListener('touchend', handleDragEnd);

  // Hayvan görselleri
  items.forEach(item => {
    let imgContainer = document.createElement("div");
    imgContainer.classList.add("animal-image-container");
    imgContainer.dataset.type = item.type;
    imgContainer.dataset.index = items.indexOf(item);
    imgContainer.style.width = "80px";
    imgContainer.style.height = "80px";
    imgContainer.style.position = "relative";
    imgContainer.style.transition = "all 0.3s ease";
    
    let img = document.createElement("div");
    img.classList.add("draggable");
    img.dataset.type = item.type;
    img.dataset.index = items.indexOf(item);
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.backgroundImage = `url("images/${item.img}")`;
    img.style.backgroundSize = "cover";
    img.style.backgroundPosition = "center";
    img.style.borderRadius = "10px";
    img.style.boxShadow = "0 3px 6px rgba(0,0,0,0.2)";
    img.style.cursor = "grab";
    img.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
    img.style.touchAction = "none"; // Dokunmatik gezinmeyi engellemek için

    // Hover efektleri
    img.addEventListener("mouseover", () => {
      if (!draggingItem) {
      img.style.transform = "scale(1.05)";
      img.style.boxShadow = "0 5px 10px rgba(0,0,0,0.3)";
      }
    });

    img.addEventListener("mouseout", () => {
      if (!draggingItem) {
      img.style.transform = "scale(1)";
      img.style.boxShadow = "0 3px 6px rgba(0,0,0,0.2)";
      }
    });

    // Sürükleme başlatma
    img.addEventListener('mousedown', function(e) {
      startDrag(e, item, img, imgContainer);
    });
    
    img.addEventListener('touchstart', function(e) {
      startDrag(e, item, img, imgContainer);
    }, { passive: false });

    imgContainer.appendChild(img);
    
    // Etiket
    let label = document.createElement("div");
    label.innerText = item.label;
    label.style.position = "absolute";
    label.style.bottom = "-20px";
    label.style.left = "0";
    label.style.width = "100%";
    label.style.textAlign = "center";
    label.style.fontSize = "0.8em";
    label.style.color = "#555";
    imgContainer.appendChild(label);

    gallerySection.appendChild(imgContainer);
  });

  // Sınıflandırma Kutuları (sağ bölüm) - Düzenlendi
  let boxesSection = document.createElement("div");
  boxesSection.style.flex = "1";
  boxesSection.style.minWidth = "280px";
  boxesSection.style.display = "flex";
  boxesSection.style.flexDirection = "column";
  boxesSection.style.gap = "10px"; // Kutuları birbirine yaklaştırdım
  boxesSection.style.alignItems = "center";
  boxesSection.style.justifyContent = "flex-start"; // Kutuları yukarıya hizala

  // Başlık - Daha kompakt hale getirdim
  let boxesTitle = document.createElement("div");
  boxesTitle.innerText = "🤖 Yapay Zeka Eğitim Kutuları";
  boxesTitle.style.width = "100%";
  boxesTitle.style.textAlign = "center";
  boxesTitle.style.fontWeight = "bold";
  boxesTitle.style.fontSize = "1em";
  boxesTitle.style.marginBottom = "0"; // Marjı kaldırdım
  boxesTitle.style.color = "#333";
  boxesSection.appendChild(boxesTitle);

  // Kedi Kutusu - Boyutları küçülttüm
  let catBox = document.createElement("div");
  catBox.classList.add("dropzone");
  catBox.dataset.type = "cat";
  catBox.style.width = "200px";
  catBox.style.minHeight = "120px"; // Yüksekliği azalttım
  catBox.style.padding = "8px"; // Padding azalttım
  catBox.style.backgroundColor = "rgba(233, 30, 99, 0.1)"; // Pembe tonda
  catBox.style.border = "2px dashed #E91E63"; // Pembe kenarlık
  catBox.style.borderRadius = "10px";
  catBox.style.display = "flex";
  catBox.style.flexDirection = "column";
  catBox.style.alignItems = "center";
  catBox.style.justifyContent = "flex-start";
  catBox.style.gap = "5px"; // İç boşluğu azalttım
  catBox.style.transition = "all 0.3s ease";
  catBox.style.boxShadow = "0 3px 6px rgba(0,0,0,0.1)";
  catBox.style.marginTop = "5px"; // Üstten marj ekledim

  let catBoxTitle = document.createElement("div");
  catBoxTitle.innerHTML = "😺 <strong>KEDİ</strong> Kategorisi";
  catBoxTitle.style.color = "#E91E63";
  catBoxTitle.style.textAlign = "center";
  catBoxTitle.style.fontSize = "0.95em"; // Font boyutunu küçülttüm
  catBoxTitle.style.marginBottom = "2px"; // Marjı azalttım
  catBox.appendChild(catBoxTitle);

  // Köpek Kutusu - Boyutları küçülttüm
  let dogBox = document.createElement("div");
  dogBox.classList.add("dropzone");
  dogBox.dataset.type = "dog";
  dogBox.style.width = "200px";
  dogBox.style.minHeight = "120px"; // Yüksekliği azalttım
  dogBox.style.padding = "8px"; // Padding azalttım
  dogBox.style.backgroundColor = "rgba(33, 150, 243, 0.1)"; // Mavi tonda
  dogBox.style.border = "2px dashed #2196F3"; // Mavi kenarlık
  dogBox.style.borderRadius = "10px";
  dogBox.style.display = "flex";
  dogBox.style.flexDirection = "column";
  dogBox.style.alignItems = "center";
  dogBox.style.justifyContent = "flex-start";
  dogBox.style.gap = "5px"; // İç boşluğu azalttım
  dogBox.style.transition = "all 0.3s ease";
  dogBox.style.boxShadow = "0 3px 6px rgba(0,0,0,0.1)";

  let dogBoxTitle = document.createElement("div");
  dogBoxTitle.innerHTML = "🐶 <strong>KÖPEK</strong> Kategorisi";
  dogBoxTitle.style.color = "#2196F3";
  dogBoxTitle.style.textAlign = "center";
  dogBoxTitle.style.fontSize = "0.95em"; // Font boyutunu küçülttüm
  dogBoxTitle.style.marginBottom = "2px"; // Marjı azalttım
  dogBox.appendChild(dogBoxTitle);

  boxesSection.appendChild(catBox);
  boxesSection.appendChild(dogBox);

  // Dropzone'ları bir diziye ekleyelim
  const dropzones = [catBox, dogBox];

  // Toplam sınıflandırılmış görsel sayısı
  let classifiedCount = 0;

  // Sürükleme işlemini başlatma fonksiyonu
  function startDrag(e, item, imgElement, imgContainer) {
      e.preventDefault();
    
    // Eğer bir sürükleme zaten aktifse, işlemi iptal et
    if (draggingItem) return;
    
    // Mouse veya dokunmatik konum bilgisini al
    let clientX, clientY;
    if (e.type === 'touchstart') {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Sürüklenen öğenin detaylarını kaydet
    const rect = imgElement.getBoundingClientRect();
    dragOffsetX = clientX - rect.left;
    dragOffsetY = clientY - rect.top;
    
    draggingItem = {
      element: imgElement,
      container: imgContainer,
      data: {
        type: item.type,
        index: items.indexOf(item),
        label: item.label
      }
    };
    
    // Klon oluştur (sürükleme göstergesi)
    dragClone = imgElement.cloneNode(true);
    dragClone.id = "dragClone";
    dragClone.style.position = "fixed";
    dragClone.style.left = rect.left + "px";
    dragClone.style.top = rect.top + "px";
    dragClone.style.width = rect.width + "px";
    dragClone.style.height = rect.height + "px";
    dragClone.style.opacity = "0.8";
    dragClone.style.zIndex = "1000";
    dragClone.style.pointerEvents = "none";
    document.body.appendChild(dragClone);
    
    // Orijinal öğeyi yarı saydam yap
    imgElement.style.opacity = "0.4";
  }

  // Sürükleme hareketi fonksiyonu
  function handleDragMove(e) {
    if (!draggingItem || !dragClone) return;
    
      e.preventDefault();
    
    // Mouse veya dokunmatik konum bilgisini al
    let clientX, clientY;
    if (e.type === 'touchmove') {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Klonu hareket ettir
    dragClone.style.left = (clientX - dragOffsetX) + "px";
    dragClone.style.top = (clientY - dragOffsetY) + "px";
    
    // Hangi dropzone üzerinde olduğunu kontrol et
    let newDropzone = null;
    for (const zone of dropzones) {
      const rect = zone.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right && 
          clientY >= rect.top && clientY <= rect.bottom) {
        newDropzone = zone;
        break;
      }
    }
    
    // Dropzone değiştiyse, görsel geri bildirim güncelle
    if (newDropzone !== currentDropzone) {
      // Önceki dropzone'u normal haline getir
      if (currentDropzone) {
        currentDropzone.style.backgroundColor = currentDropzone.dataset.type === "cat" ? 
        "rgba(233, 30, 99, 0.1)" : "rgba(33, 150, 243, 0.1)";
        currentDropzone.style.transform = "scale(1)";
      }
      
      // Yeni dropzone'u vurgula
      if (newDropzone) {
        newDropzone.style.backgroundColor = newDropzone.dataset.type === "cat" ? 
          "rgba(233, 30, 99, 0.2)" : "rgba(33, 150, 243, 0.2)";
        newDropzone.style.transform = "scale(1.03)";
      }
      
      currentDropzone = newDropzone;
    }
  }

  // Sürükleme bitişi fonksiyonu
  function handleDragEnd(e) {
    if (!draggingItem) return;
    
    // Klonu temizle
    if (dragClone) {
      dragClone.remove();
      dragClone = null;
    }
    
    // Eğer bir dropzone üzerinde bırakıldıysa
    if (currentDropzone) {
      // Öğeyi bırakma işlemini gerçekleştir
      handleDrop(currentDropzone, draggingItem.data);
      
      // Dropzone'u normal haline getir
      currentDropzone.style.backgroundColor = currentDropzone.dataset.type === "cat" ? 
        "rgba(233, 30, 99, 0.1)" : "rgba(33, 150, 243, 0.1)";
      currentDropzone.style.transform = "scale(1)";
    } else {
      // Başarısız bırakma, öğeyi normal haline getir
      draggingItem.element.style.opacity = "1";
    }
    
    // Temizle
    draggingItem = null;
    currentDropzone = null;
  }

  // Bırakma işlemini ele alan fonksiyon
  function handleDrop(dropzone, animalData) {
        // Doğru kutuya bırakıldı mı kontrolü
    if (dropzone.dataset.type === animalData.type) {
          playCorrectSound();
          
          // Animasyonlu sınıflandırma göstergesi
          let classifiedItem = document.createElement("div");
          classifiedItem.style.display = "flex";
          classifiedItem.style.alignItems = "center";
          classifiedItem.style.justifyContent = "center";
          classifiedItem.style.gap = "5px";
          classifiedItem.style.width = "90%";
          classifiedItem.style.padding = "4px"; // Padding azalttım
      classifiedItem.style.backgroundColor = dropzone === catBox ? "#E91E63" : "#2196F3";
          classifiedItem.style.color = "white";
          classifiedItem.style.borderRadius = "5px";
          classifiedItem.style.fontSize = "0.8em"; // Font boyutunu küçülttüm
          classifiedItem.style.fontWeight = "bold";
          classifiedItem.style.animation = "fadeIn 0.5s ease";
          classifiedItem.style.marginBottom = "3px"; // Marjı azalttım
          
          // Emoji + etiket
      const emoji = dropzone === catBox ? "😺" : "🐶";
          classifiedItem.innerText = `${emoji} ${animalData.label}`;
          
          // Doğru işareti
          const checkmark = document.createElement("span");
          checkmark.innerText = "✓";
          checkmark.style.marginLeft = "auto";
          classifiedItem.appendChild(checkmark);
          
      dropzone.appendChild(classifiedItem);
          
          // Orijinal görseli gizle - kaybolma animasyonu ekle
          const draggedImageContainer = document.querySelector(`.animal-image-container[data-index="${animalData.index}"]`);
          if (draggedImageContainer) {
            draggedImageContainer.style.transition = "all 0.5s ease";
            draggedImageContainer.style.transform = "scale(0)";
            draggedImageContainer.style.opacity = "0";
            
            // Animasyon bittikten sonra DOM'dan kaldır
            setTimeout(() => {
              draggedImageContainer.style.display = "none";
            }, 500);
          }
          
          // İlerleme güncelle
          classifiedCount++;
          progressText.innerHTML = `<strong>Eğitim İlerlemesi:</strong> ${classifiedCount}/6 görsel sınıflandırıldı`;
          
          // Tüm görseller sınıflandırıldı mı?
          if (classifiedCount === items.length) {
            showMessage("Tebrikler! Tüm hayvanları doğru şekilde sınıflandırdın!", "success");
            setTimeout(clearMessage, 2000);
            
            // Kutlama animasyonu
            setTimeout(() => {
              // Yapay zekanın öğrendiğini gösteren animasyon
              let aiLearningMsg = document.createElement("div");
              aiLearningMsg.style.position = "absolute";
              aiLearningMsg.style.top = "50%";
              aiLearningMsg.style.left = "50%";
              aiLearningMsg.style.transform = "translate(-50%, -50%)";
              aiLearningMsg.style.backgroundColor = "rgba(76, 175, 80, 0.9)";
              aiLearningMsg.style.color = "white";
              aiLearningMsg.style.padding = "20px";
              aiLearningMsg.style.borderRadius = "10px";
              aiLearningMsg.style.fontSize = "1.2em";
              aiLearningMsg.style.fontWeight = "bold";
              aiLearningMsg.style.textAlign = "center";
              aiLearningMsg.style.zIndex = "1000";
              aiLearningMsg.style.animation = "pulse 1.5s infinite";
              aiLearningMsg.innerHTML = `🎉 <br> Yapay Zeka Başarıyla Eğitildi! <br> Artık kedileri ve köpekleri tanıyabiliyor!`;
              
              puzzleArea.appendChild(aiLearningMsg);
              
              // Konfeti efekti
              addConfetti();
              
              // Bir süre sonra bir sonraki puzzle'a geç
              setTimeout(goNextPuzzle, 3000);
            }, 1000);
          } else {
        showMessage(`Doğru! Bu bir ${dropzone === catBox ? "kedi" : "köpek"}. ${items.length - classifiedCount} görsel kaldı.`, "success");
            setTimeout(clearMessage, 2000);
          }
        } else {
          // Yanlış kutuya bırakıldı
          playWrongSound();
          
          // Kutuyu salla
      dropzone.style.animation = "shake 0.5s";
          setTimeout(() => {
        dropzone.style.animation = "";
          }, 500);
          
      showMessage(`Hata! Bu bir ${animalData.type === "cat" ? "kedi" : "köpek"}, ${dropzone.dataset.type === "cat" ? "kedi" : "köpek"} kutusuna bırakmalısın.`, "error");
          setTimeout(clearMessage, 2000);
      
      // Sürüklenen öğeyi normale döndür
      const draggedImageContainer = document.querySelector(`.animal-image-container[data-index="${animalData.index}"]`);
      if (draggedImageContainer) {
        const draggedItem = draggedImageContainer.querySelector('.draggable');
        if (draggedItem) {
          draggedItem.style.opacity = "1";
        }
      }
    }
  }

  gameContainer.appendChild(gallerySection);
  gameContainer.appendChild(boxesSection);

  // Animasyonlar için CSS ekle
  let styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      50% { transform: translateX(10px); }
      75% { transform: translateX(-5px); }
      100% { transform: translateX(0); }
    }
    @keyframes pulse {
      0% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.1); }
      100% { transform: translate(-50%, -50%) scale(1); }
    }
  `;
  document.head.appendChild(styleSheet);

  // Konfeti efekti
  function addConfetti() {
    for (let i = 0; i < 100; i++) {
      let confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.width = (Math.random() * 10 + 5) + "px";
      confetti.style.height = (Math.random() * 10 + 5) + "px";
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.top = "-20px";
      confetti.style.borderRadius = "50%";
      confetti.style.zIndex = "1000";
      
      // Animasyon
      confetti.animate([
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${Math.random() * 100 - 50}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'cubic-bezier(0, .9, .57, 1)'
      });
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }
}

function setupPlanet3Puzzle2() {
  puzzleHintText.innerText = "IPUCU: Makine öğrenmesi için hangi verilerin kullanılacağını düşün!";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "15px";
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme kutusu
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(0, 150, 136, 0.1)"; // Turkuaz tonda arka plan
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "15px";
  infoBox.style.marginBottom = "10px";
  infoBox.style.border = "2px solid rgba(0, 150, 136, 0.3)";
  infoBox.style.width = "90%";
  infoBox.style.maxWidth = "700px";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";

  // Bilgilendirme başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "🤖 Yapay Zeka ve Görüntü Tanıma";
  infoTitle.style.margin = "0 0 10px 0";
  infoTitle.style.color = "#00897B"; // Turkuaz renk
  infoTitle.style.fontSize = "1.1em";
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni
  let infoText = document.createElement("p");
  infoText.innerHTML = "Yapay zeka sistemleri, <strong>görüntüleri tanıma</strong> konusunda çok başarılıdır. Fotoğraflardaki nesneleri, yüzleri ve hayvanları tanıyabilirler. Bu sistemler <strong>doğru etiketlenmiş verilerle</strong> eğitilir. Örneğin, bir sisteme binlerce kedi ve köpek fotoğrafı gösterip etiketlediğimizde, yeni bir fotoğrafta kedi mi köpek mi olduğunu ayırt edebilir. Bu teknoloji sayesinde telefonlardaki yüz tanıma, otomatik fotoğraf etiketleme ve güvenlik kameraları gibi sistemler çalışır!";
  infoText.style.margin = "0";
  infoText.style.fontSize = "0.95em";
  infoText.style.lineHeight = "1.4";
  infoBox.appendChild(infoText);

  mainContainer.appendChild(infoBox);

  // İlerleme göstergesi
  let progressContainer = document.createElement("div");
  progressContainer.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  progressContainer.style.borderRadius = "20px";
  progressContainer.style.height = "10px";
  progressContainer.style.width = "80%";
  progressContainer.style.maxWidth = "400px";
  progressContainer.style.margin = "5px auto";
  progressContainer.style.position = "relative";
  progressContainer.style.overflow = "hidden";
  
  let progressBar = document.createElement("div");
  progressBar.style.position = "absolute";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.height = "100%";
  progressBar.style.width = "0%";
  progressBar.style.backgroundColor = "#00897B";
  progressBar.style.borderRadius = "20px";
  progressBar.style.transition = "width 0.5s ease";
  
  progressContainer.appendChild(progressBar);
  mainContainer.appendChild(progressContainer);
  
  // Soru konteyner
  let questionContainer = document.createElement("div");
  questionContainer.style.width = "90%";
  questionContainer.style.maxWidth = "600px";
  questionContainer.style.backgroundColor = "white";
  questionContainer.style.borderRadius = "10px";
  questionContainer.style.padding = "20px";
  questionContainer.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
  questionContainer.style.position = "relative";
  mainContainer.appendChild(questionContainer);

  // Soru numarası göstergesi
  let questionBadge = document.createElement("div");
  questionBadge.style.position = "absolute";
  questionBadge.style.top = "-12px";
  questionBadge.style.left = "50%";
  questionBadge.style.transform = "translateX(-50%)";
  questionBadge.style.backgroundColor = "#00897B";
  questionBadge.style.color = "white";
  questionBadge.style.borderRadius = "20px";
  questionBadge.style.padding = "5px 15px";
  questionBadge.style.fontWeight = "bold";
  questionBadge.style.fontSize = "0.9em";
  questionBadge.innerText = "Soru 1 / 3";
  questionContainer.appendChild(questionBadge);

  // Sorular listesi
  const questions = [
    {
      scenario: "Elif, yapay zeka sistemine kedileri tanıtmak istiyor. Sistemi eğitmek için hangi yöntemi kullanmalıdır?",
      options: [
        { text: "Kedi fotoğraflarını 'kedi' etiketi ile işaretlemek", correct: true },
        { text: "Kedilerin miyavlama seslerini kaydetmek", correct: false },
        { text: "Kedi fotoğraflarına rastgele isimler vermek", correct: false }
      ],
      explanation: "Görüntü tanıma sistemleri, doğru etiketlenmiş fotoğraflarla eğitilir. Her kedi fotoğrafı 'kedi' olarak işaretlenmelidir!"
    },
    {
      scenario: "Ali'nin telefonu yüzünü tanıyarak kilidi açılıyor. Bu özellik nasıl çalışır?",
      options: [
        { text: "Telefonun kamerası ve mikrofonu birlikte ses analizi yapar", correct: false },
        { text: "Yüzleri tanımak için telefonun hafızasındaki binlerce yüzle karşılaştırır", correct: false },
        { text: "Yüzündeki belirli noktaları tespit edip kayıtlı yüzünle eşleştirir", correct: true }
      ],
      explanation: "Yüz tanıma sistemleri, yüzdeki belirli noktaları (göz, burun, ağız kenarları vb.) tespit ederek benzersiz bir harita oluşturur ve bunu kayıtlı yüzle karşılaştırır!"
    },
    {
      scenario: "Mert, fotoğraflardaki kedileri otomatik tanıyan bir uygulama geliştiriyor. Uygulama bir fotoğrafta kedi göremezse ne yapmalıdır?",
      options: [
        { text: "Fotoğrafı silmeli", correct: false },
        { text: "Kedinin olmadığını belirtmeli", correct: true },
        { text: "Rastgele bir yeri kedi olarak işaretlemeli", correct: false }
      ],
      explanation: "İyi bir yapay zeka sistemi, aradığı nesne yoksa bunu dürüstçe belirtmelidir. Hata yapmaktansa bilmediğini söylemek daha iyidir!"
    }
  ];

  let currentQuestionIndex = 0;
  
  // Soru gösterme fonksiyonu
  function showQuestion(index) {
    // Soru konteynerini temizle
    questionContainer.innerHTML = "";
    
    // Soru numarası rozeti
    let badge = document.createElement("div");
    badge.style.position = "absolute";
    badge.style.top = "-12px";
    badge.style.left = "50%";
    badge.style.transform = "translateX(-50%)";
    badge.style.backgroundColor = "#00897B";
    badge.style.color = "white";
    badge.style.borderRadius = "20px";
    badge.style.padding = "5px 15px";
    badge.style.fontWeight = "bold";
    badge.style.fontSize = "0.9em";
    badge.innerText = `Soru ${index + 1} / ${questions.length}`;
    questionContainer.appendChild(badge);
    
    // İlerleme çubuğunu güncelle
    progressBar.style.width = `${((index) / questions.length) * 100}%`;
    
    // Şu anki soru
    const question = questions[index];
    
    // Senaryo metni
    let scenarioBox = document.createElement("div");
    scenarioBox.style.backgroundColor = "rgba(0, 150, 136, 0.1)";
    scenarioBox.style.borderRadius = "8px";
    scenarioBox.style.padding = "15px";
    scenarioBox.style.marginTop = "15px";
    scenarioBox.style.marginBottom = "20px";
    scenarioBox.style.position = "relative";
    
    // Senaryo ikonu
    let scenarioIcon = document.createElement("div");
    scenarioIcon.innerHTML = "📝";
    scenarioIcon.style.position = "absolute";
    scenarioIcon.style.top = "-12px";
    scenarioIcon.style.left = "10px";
    scenarioIcon.style.backgroundColor = "white";
    scenarioIcon.style.borderRadius = "50%";
    scenarioIcon.style.width = "30px";
    scenarioIcon.style.height = "30px";
    scenarioIcon.style.display = "flex";
    scenarioIcon.style.alignItems = "center";
    scenarioIcon.style.justifyContent = "center";
    scenarioIcon.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
    scenarioBox.appendChild(scenarioIcon);
    
    let scenarioText = document.createElement("p");
    scenarioText.innerText = question.scenario;
    scenarioText.style.margin = "0";
    scenarioText.style.fontWeight = "bold";
    scenarioText.style.color = "#00695C";
    scenarioBox.appendChild(scenarioText);
    
    questionContainer.appendChild(scenarioBox);
    
    // Seçenekler
    let optionsContainer = document.createElement("div");
    optionsContainer.style.display = "flex";
    optionsContainer.style.flexDirection = "column";
    optionsContainer.style.gap = "10px";
    
    question.options.forEach((option, optionIndex) => {
      let optionButton = document.createElement("button");
      optionButton.innerText = option.text;
      optionButton.style.padding = "12px 15px";
      optionButton.style.backgroundColor = "white";
      optionButton.style.border = "2px solid #E0E0E0";
      optionButton.style.borderRadius = "8px";
      optionButton.style.fontSize = "0.95em";
      optionButton.style.fontWeight = "normal";
      optionButton.style.cursor = "pointer";
      optionButton.style.textAlign = "left";
      optionButton.style.transition = "all 0.2s ease";
      
      // Option hover effect
      optionButton.addEventListener("mouseover", () => {
        if (!optionButton.disabled) {
          optionButton.style.backgroundColor = "#F5F5F5";
          optionButton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
        }
      });
      
      optionButton.addEventListener("mouseout", () => {
        if (!optionButton.disabled) {
          optionButton.style.backgroundColor = "white";
          optionButton.style.boxShadow = "none";
        }
      });
      
      // Option button click
      optionButton.addEventListener("click", () => {
        // Disable all buttons
        optionsContainer.querySelectorAll("button").forEach(btn => {
          btn.disabled = true;
          btn.style.cursor = "default";
        });
        
        if (option.correct) {
          // Correct answer
          playCorrectSound();
          optionButton.style.backgroundColor = "#4CAF50";
          optionButton.style.borderColor = "#4CAF50";
          optionButton.style.color = "white";
          
          // Create explanation box for correct answer
          let explanationBox = document.createElement("div");
          explanationBox.style.backgroundColor = "#E8F5E9";
          explanationBox.style.padding = "10px 15px";
          explanationBox.style.borderRadius = "8px";
          explanationBox.style.marginTop = "15px";
          explanationBox.style.border = "2px solid #A5D6A7";
          
          let explanationText = document.createElement("p");
          explanationText.innerHTML = `<strong>Doğru!</strong> ${question.explanation}`;
          explanationText.style.margin = "0";
          explanationText.style.color = "#2E7D32";
          explanationBox.appendChild(explanationText);
          
          questionContainer.appendChild(explanationBox);
          
          // Show next question or finish quiz after delay
          setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
              currentQuestionIndex++;
              showQuestion(currentQuestionIndex);
            } else {
              finishQuiz();
            }
          }, 2500);
          
        } else {
          // Wrong answer
          playWrongSound();
          optionButton.style.backgroundColor = "#F44336";
          optionButton.style.borderColor = "#F44336";
          optionButton.style.color = "white";
          
          // Highlight correct answer
          optionsContainer.querySelectorAll("button").forEach((btn, idx) => {
            if (question.options[idx].correct) {
              btn.style.backgroundColor = "#4CAF50";
              btn.style.borderColor = "#4CAF50";
              btn.style.color = "white";
            }
          });
          
          // Create explanation box for wrong answer
          let explanationBox = document.createElement("div");
          explanationBox.style.backgroundColor = "#FFEBEE";
          explanationBox.style.padding = "10px 15px";
          explanationBox.style.borderRadius = "8px";
          explanationBox.style.marginTop = "15px";
          explanationBox.style.border = "2px solid #FFCDD2";
          
          let explanationText = document.createElement("p");
          explanationText.innerHTML = `<strong>Yanlış.</strong> ${question.explanation}`;
          explanationText.style.margin = "0";
          explanationText.style.color = "#C62828";
          explanationBox.appendChild(explanationText);
          
          questionContainer.appendChild(explanationBox);
          
          // Show next question or finish quiz after delay
          setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
              currentQuestionIndex++;
              showQuestion(currentQuestionIndex);
            } else {
              finishQuiz();
            }
          }, 2500);
        }
      });
      
      optionsContainer.appendChild(optionButton);
    });
    
    questionContainer.appendChild(optionsContainer);
  }
  
  // Quiz bitirme fonksiyonu
  function finishQuiz() {
    // Clear question container
    questionContainer.innerHTML = "";
    
    // Create completion message
    let completionBox = document.createElement("div");
    completionBox.style.backgroundColor = "#E8F5E9";
    completionBox.style.padding = "20px";
    completionBox.style.borderRadius = "10px";
    completionBox.style.textAlign = "center";
    completionBox.style.border = "2px solid #A5D6A7";
    
    let completionIcon = document.createElement("div");
    completionIcon.innerHTML = "🎉";
    completionIcon.style.fontSize = "3em";
    completionIcon.style.marginBottom = "10px";
    completionBox.appendChild(completionIcon);
    
    let completionTitle = document.createElement("h3");
    completionTitle.innerText = "Tebrikler! Tüm soruları yanıtladınız!";
    completionTitle.style.color = "#2E7D32";
    completionTitle.style.margin = "5px 0 10px 0";
    completionBox.appendChild(completionTitle);
    
    let completionText = document.createElement("p");
    completionText.innerText = "Yapay zeka görüntü tanıma sistemleri hakkında bilgilerinizi pekiştirdiniz. Bu teknoloji günümüzde telefonlardan güvenlik sistemlerine, sağlıktan eğitime kadar birçok alanda kullanılıyor!";
    completionText.style.margin = "0 0 15px 0";
completionText.style.color = "#2E7D32"; // Yeşil renk ekledim
    completionBox.appendChild(completionText);
    
    // Continue button
    let continueButton = document.createElement("button");
    continueButton.innerText = "Devam Et";
    continueButton.style.padding = "10px 20px";
    continueButton.style.backgroundColor = "#00897B";
    continueButton.style.color = "white";
    continueButton.style.border = "none";
    continueButton.style.borderRadius = "5px";
    continueButton.style.cursor = "pointer";
    continueButton.style.fontSize = "1em";
    continueButton.style.fontWeight = "bold";
    continueButton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    
    continueButton.addEventListener("mouseover", () => {
      continueButton.style.backgroundColor = "#00796B";
    });
    
    continueButton.addEventListener("mouseout", () => {
      continueButton.style.backgroundColor = "#00897B";
    });
    
    continueButton.addEventListener("click", () => {
      playClickSound();
      addConfetti();
      setTimeout(goNextPuzzle, 2000);
    });
    
    completionBox.appendChild(continueButton);
    questionContainer.appendChild(completionBox);
    
    // Update progress to 100%
    progressBar.style.width = "100%";
  }
  
  // Konfeti efekti
  function addConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'absolute';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
    
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.position = 'absolute';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 6 + 5 + 'px';
      confetti.style.backgroundColor = color;
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = -20 + 'px';
      confetti.style.borderRadius = '50%';
      confetti.style.opacity = Math.random() + 0.5;
      
      confettiContainer.appendChild(confetti);
      
      const animationDuration = Math.random() * 3 + 2;
      const xDistance = (Math.random() - 0.5) * 40;
      
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
        { transform: `translate(${xDistance}vw, 100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });
    }
    
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  }
  
  // Quiz'i başlat
  showQuestion(currentQuestionIndex);
}

function setupPlanet3Puzzle3() {
  puzzleHintText.innerText = "IPUCU: Yapay zeka modellerinin nasıl öğrendiğini düşün!";

  // Ana konteyner - daha az boşluk bırak
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "8px"; // Daha az boşluk
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme ve öğrenme türleri yan yana
  let topSection = document.createElement("div");
  topSection.style.display = "flex";
  topSection.style.width = "100%";
  topSection.style.justifyContent = "space-between";
  topSection.style.gap = "10px";
  topSection.style.marginBottom = "5px";
  mainContainer.appendChild(topSection);

  // Bilgilendirme kutusu - daha kompakt
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(75, 0, 130, 0.1)"; // Mor tonda arka plan
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "10px"; // Daha az padding
  infoBox.style.flex = "1";
  infoBox.style.border = "2px solid rgba(75, 0, 130, 0.3)";
  infoBox.style.maxWidth = "48%";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  topSection.appendChild(infoBox);

  // Bilgilendirme başlığı - daha küçük
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "🧠 Makine Öğrenmesi Nasıl Çalışır?";
  infoTitle.style.margin = "0 0 5px 0"; // Daha az margin
  infoTitle.style.color = "#6A0DAD"; // Mor renk
  infoTitle.style.fontSize = "1em"; // Daha küçük font
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni - daha kısa ve kompakt
  let infoText = document.createElement("p");
  infoText.innerHTML = "Makine öğrenmesi modelleri <strong>deneyimlerinden öğrenir</strong>. İnsan beyni gibi, tekrarlanan örneklerden <strong>desenleri tespit eder</strong>. Önce örneklerle eğitilir, sonra yeni durumlarla karşılaşınca öğrendiklerini uygular.";
  infoText.style.margin = "0";
  infoText.style.fontSize = "0.85em"; // Daha küçük font
  infoText.style.lineHeight = "1.3"; // Daha sıkı satır aralığı
  infoBox.appendChild(infoText);

  // Öğrenme türleri ekranı - yan tarafa yerleştir
  let learningBox = document.createElement("div");
  learningBox.style.backgroundColor = "rgba(75, 0, 130, 0.05)";
  learningBox.style.borderRadius = "12px";
  learningBox.style.padding = "10px"; // Daha az padding
  learningBox.style.flex = "1";
  learningBox.style.maxWidth = "48%";
  learningBox.style.border = "1px solid rgba(75, 0, 130, 0.2)";
  learningBox.style.display = "flex";
  learningBox.style.flexDirection = "column";
  learningBox.style.gap = "5px"; // Daha az boşluk
  topSection.appendChild(learningBox);

  let learningTitle = document.createElement("h4");
  learningTitle.innerHTML = "Makine Öğrenmesi Türleri";
  learningTitle.style.margin = "0 0 3px 0"; // Daha az margin
  learningTitle.style.color = "#6A0DAD";
  learningTitle.style.fontSize = "0.9em"; // Daha küçük font
  learningBox.appendChild(learningTitle);

  // Öğrenme türleri - daha kompakt
  const learningTypes = [
    {
      title: "👨‍🏫 Gözetimli Öğrenme",
      text: "Etiketli verilerle öğrenir (örnek: 'Bu bir kedidir')"
    },
    {
      title: "🧩 Gözetimsiz Öğrenme",
      text: "Etiketsiz verilerden desenler bulur"
    },
    {
      title: "🏆 Pekiştirmeli Öğrenme",
      text: "Deneme yanılmayla ve ödüllerle öğrenir"
    }
  ];

  learningTypes.forEach(type => {
    let typeBox = document.createElement("div");
    typeBox.style.padding = "5px"; // Daha az padding
    typeBox.style.borderRadius = "6px";
    typeBox.style.backgroundColor = "white";
    typeBox.style.border = "1px solid rgba(75, 0, 130, 0.2)";

    let typeTitle = document.createElement("div");
    typeTitle.innerHTML = type.title;
    typeTitle.style.fontWeight = "bold";
    typeTitle.style.color = "#6A0DAD";
    typeTitle.style.marginBottom = "2px"; // Daha az margin
    typeTitle.style.fontSize = "0.8em"; // Daha küçük font
    typeBox.appendChild(typeTitle);

    let typeText = document.createElement("div");
    typeText.innerHTML = type.text;
    typeText.style.fontSize = "0.75em"; // Daha küçük font
    typeBox.appendChild(typeText);

    learningBox.appendChild(typeBox);
  });

  // İlerleme göstergesi - daha küçük
  let progressContainer = document.createElement("div");
  progressContainer.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  progressContainer.style.borderRadius = "10px";
  progressContainer.style.height = "6px"; // Daha ince
  progressContainer.style.width = "80%";
  progressContainer.style.maxWidth = "400px";
  progressContainer.style.margin = "3px auto"; // Daha az margin
  progressContainer.style.position = "relative";
  progressContainer.style.overflow = "hidden";
  
  let progressBar = document.createElement("div");
  progressBar.style.position = "absolute";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.height = "100%";
  progressBar.style.width = "0%";
  progressBar.style.backgroundColor = "#6A0DAD";
  progressBar.style.borderRadius = "10px";
  progressBar.style.transition = "width 0.5s ease";
  
  progressContainer.appendChild(progressBar);
  mainContainer.appendChild(progressContainer);
  
  // Soru konteyner - daha fazla alan ver
  let questionContainer = document.createElement("div");
  questionContainer.style.width = "90%";
  questionContainer.style.maxWidth = "600px";
  questionContainer.style.backgroundColor = "white";
  questionContainer.style.borderRadius = "10px";
  questionContainer.style.padding = "15px"; // Daha az padding
  questionContainer.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
  questionContainer.style.position = "relative";
  questionContainer.style.marginTop = "5px"; // Yukarıya yaklaştır
  mainContainer.appendChild(questionContainer);

  // Soru numarası göstergesi - daha küçük
  let questionBadge = document.createElement("div");
  questionBadge.style.position = "absolute";
  questionBadge.style.top = "-10px"; // Daha yukarıda
  questionBadge.style.left = "50%";
  questionBadge.style.transform = "translateX(-50%)";
  questionBadge.style.backgroundColor = "#6A0DAD";
  questionBadge.style.color = "white";
  questionBadge.style.borderRadius = "15px";
  questionBadge.style.padding = "3px 10px"; // Daha az padding
  questionBadge.style.fontWeight = "bold";
  questionBadge.style.fontSize = "0.8em"; // Daha küçük font
  questionBadge.innerText = "Soru 1 / 3";
  questionContainer.appendChild(questionBadge);

  // Sorular listesi
  const questions = [
    {
      scenario: "Deniz, satranç oynamayı öğrenen bir yapay zeka sistemi geliştiriyor. Robot her oyunda daha iyi hale geliyor ve hatalarından öğreniyor. Bu hangi öğrenme türüne örnektir?",
      options: [
        { text: "Pekiştirmeli Öğrenme", correct: true },
        { text: "Gözetimli Öğrenme", correct: false },
        { text: "Gözetimsiz Öğrenme", correct: false }
      ],
      explanation: "Pekiştirmeli öğrenmede, sistem deneme-yanılma yoluyla ve aldığı ödüllerle (kazanma) veya cezalarla (kaybetme) zamanla daha iyi stratejiler geliştirir."
    },
    {
      scenario: "Aslı, akıllı telefonu için yeni bir özellik keşfetti: Fotoğraf uygulaması otomatik olarak benzer fotoğrafları bir araya getiriyor. Örneğin, tüm plaj fotoğrafları bir grupta, aile fotoğrafları başka bir grupta toplanıyor. Bu hangi öğrenme türünü kullanır?",
      options: [
        { text: "Pekiştirmeli Öğrenme", correct: false },
        { text: "Gözetimsiz Öğrenme", correct: true },
        { text: "Ezbere Öğrenme", correct: false }
      ],
      explanation: "Gözetimsiz öğrenmede, sistem etiketlenmemiş verilerdeki desenleri kendi kendine keşfeder ve benzer öğeleri gruplar (kümeleme)."
    },
    {
      scenario: "Mehmet bir e-posta filtreleme sistemi geliştiriyor. Sisteme binlerce 'spam' ve 'spam olmayan' e-posta örnekleri veriyor. Sistem bu örneklerden öğrenerek yeni gelen e-postaları sınıflandırıyor. Bu hangi öğrenme türüdür?",
      options: [
        { text: "Pekiştirmeli Öğrenme", correct: false },
        { text: "Gözetimsiz Öğrenme", correct: false },
        { text: "Gözetimli Öğrenme", correct: true }
      ],
      explanation: "Gözetimli öğrenmede, sisteme doğru etiketlerle (spam/spam değil) birlikte örnekler verilir ve sistem bu etiketleri kullanarak sınıflandırmayı öğrenir."
    }
  ];

  let currentQuestionIndex = 0;
  
  // Soru gösterme fonksiyonu
  function showQuestion(index) {
    // Soru konteynerini temizle
    questionContainer.innerHTML = "";
    
    // Soru numarası rozeti
    let badge = document.createElement("div");
    badge.style.position = "absolute";
    badge.style.top = "-10px"; // Daha yukarı
    badge.style.left = "50%";
    badge.style.transform = "translateX(-50%)";
    badge.style.backgroundColor = "#6A0DAD";
    badge.style.color = "white";
    badge.style.borderRadius = "15px";
    badge.style.padding = "3px 10px"; // Daha az padding
    badge.style.fontWeight = "bold";
    badge.style.fontSize = "0.8em"; // Daha küçük font
    badge.innerText = `Soru ${index + 1} / ${questions.length}`;
    questionContainer.appendChild(badge);
    
    // İlerleme çubuğunu güncelle
    progressBar.style.width = `${((index) / questions.length) * 100}%`;
    
    // Şu anki soru
    const question = questions[index];
    
    // Senaryo metni - daha kompakt
    let scenarioBox = document.createElement("div");
    scenarioBox.style.backgroundColor = "rgba(75, 0, 130, 0.05)";
    scenarioBox.style.borderRadius = "8px";
    scenarioBox.style.padding = "12px 15px 12px 15px"; // Üstten daha az padding
    scenarioBox.style.marginTop = "10px"; // Yukarıdan daha az margin
    scenarioBox.style.marginBottom = "12px"; // Alttan daha az margin
    
    // Senaryo metni direkt olarak ekle, ikonu kaldır
    let scenarioText = document.createElement("p");
    scenarioText.innerText = question.scenario;
    scenarioText.style.margin = "0";
    scenarioText.style.fontWeight = "bold";
    scenarioText.style.color = "#4B0082";
    scenarioText.style.fontSize = "0.9em"; // Daha küçük font
    scenarioBox.appendChild(scenarioText);
    
    questionContainer.appendChild(scenarioBox);
    
    // Seçenekler - daha kompakt
    let optionsContainer = document.createElement("div");
    optionsContainer.style.display = "flex";
    optionsContainer.style.flexDirection = "column";
    optionsContainer.style.gap = "8px"; // Daha az boşluk
    
    question.options.forEach((option, optionIndex) => {
      let optionButton = document.createElement("button");
      optionButton.innerText = option.text;
      optionButton.style.padding = "8px 12px"; // Daha az padding
      optionButton.style.backgroundColor = "white";
      optionButton.style.border = "2px solid #E0E0E0";
      optionButton.style.borderRadius = "8px";
      optionButton.style.fontSize = "0.9em"; // Daha küçük font
      optionButton.style.fontWeight = "normal";
      optionButton.style.cursor = "pointer";
      optionButton.style.textAlign = "left";
      optionButton.style.transition = "all 0.2s ease";
      
      // Option hover effect
      optionButton.addEventListener("mouseover", () => {
        if (!optionButton.disabled) {
          optionButton.style.backgroundColor = "#F5F5F5";
          optionButton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
        }
      });
      
      optionButton.addEventListener("mouseout", () => {
        if (!optionButton.disabled) {
          optionButton.style.backgroundColor = "white";
          optionButton.style.boxShadow = "none";
        }
      });
      
      // Option button click
      optionButton.addEventListener("click", () => {
        // Disable all buttons
        optionsContainer.querySelectorAll("button").forEach(btn => {
          btn.disabled = true;
          btn.style.cursor = "default";
        });
        
        if (option.correct) {
          // Correct answer
          playCorrectSound();
          optionButton.style.backgroundColor = "#4CAF50";
          optionButton.style.borderColor = "#4CAF50";
          optionButton.style.color = "white";
          
          // Create explanation box for correct answer - daha kompakt
          let explanationBox = document.createElement("div");
          explanationBox.style.backgroundColor = "#E8F5E9";
          explanationBox.style.padding = "8px 12px"; // Daha az padding
          explanationBox.style.borderRadius = "8px";
          explanationBox.style.marginTop = "10px"; // Daha az margin
          explanationBox.style.border = "2px solid #A5D6A7";
          
          let explanationText = document.createElement("p");
          explanationText.innerHTML = `<strong>Doğru!</strong> ${question.explanation}`;
          explanationText.style.margin = "0";
          explanationText.style.color = "#2E7D32";
          explanationText.style.fontSize = "0.85em"; // Daha küçük font
          explanationBox.appendChild(explanationText);
          
          questionContainer.appendChild(explanationBox);
          
          // Show next question or finish quiz after delay
          setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
              currentQuestionIndex++;
              showQuestion(currentQuestionIndex);
            } else {
              finishQuiz();
            }
          }, 2000); // Daha kısa süre
          
        } else {
          // Wrong answer
          playWrongSound();
          optionButton.style.backgroundColor = "#F44336";
          optionButton.style.borderColor = "#F44336";
          optionButton.style.color = "white";
          
          // Highlight correct answer
          optionsContainer.querySelectorAll("button").forEach((btn, idx) => {
            if (question.options[idx].correct) {
              btn.style.backgroundColor = "#4CAF50";
              btn.style.borderColor = "#4CAF50";
              btn.style.color = "white";
            }
          });
          
          // Create explanation box for wrong answer - daha kompakt
          let explanationBox = document.createElement("div");
          explanationBox.style.backgroundColor = "#FFEBEE";
          explanationBox.style.padding = "8px 12px"; // Daha az padding
          explanationBox.style.borderRadius = "8px";
          explanationBox.style.marginTop = "10px"; // Daha az margin
          explanationBox.style.border = "2px solid #FFCDD2";
          
          let explanationText = document.createElement("p");
          explanationText.innerHTML = `<strong>Yanlış.</strong> ${question.explanation}`;
          explanationText.style.margin = "0";
          explanationText.style.color = "#C62828";
          explanationText.style.fontSize = "0.85em"; // Daha küçük font
          explanationBox.appendChild(explanationText);
          
          questionContainer.appendChild(explanationBox);
          
          // Show next question or finish quiz after delay
          setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
              currentQuestionIndex++;
              showQuestion(currentQuestionIndex);
            } else {
              finishQuiz();
            }
          }, 2000); // Daha kısa süre
        }
      });
      
      optionsContainer.appendChild(optionButton);
    });
    
    questionContainer.appendChild(optionsContainer);
  }
  
  // Quiz bitirme fonksiyonu - daha kompakt
  function finishQuiz() {
    // Clear question container
    questionContainer.innerHTML = "";
    
    // Create completion message - daha kompakt
    let completionBox = document.createElement("div");
    completionBox.style.backgroundColor = "#F3E5F5";
    completionBox.style.padding = "15px"; // Daha az padding
    completionBox.style.borderRadius = "10px";
    completionBox.style.textAlign = "center";
    completionBox.style.border = "2px solid #CE93D8";
    
    let completionIcon = document.createElement("div");
    completionIcon.innerHTML = "🎓";
    completionIcon.style.fontSize = "2.5em"; // Daha küçük
    completionIcon.style.marginBottom = "5px"; // Daha az margin
    completionBox.appendChild(completionIcon);
    
    let completionTitle = document.createElement("h3");
    completionTitle.innerText = "Tebrikler! Makine Öğrenmesi Uzmanı Oldun!";
    completionTitle.style.color = "#4A148C";
    completionTitle.style.margin = "5px 0"; // Daha az margin
    completionTitle.style.fontSize = "1.1em"; // Daha küçük font
    completionBox.appendChild(completionTitle);
    
    let completionText = document.createElement("p");
    completionText.innerText = "Artık makine öğrenmesinin temel türlerini ve nasıl çalıştığını biliyorsun!";
    completionText.style.margin = "0 0 10px 0"; // Daha az margin
    completionText.style.fontSize = "0.9em"; // Daha küçük font
completionText.style.color = "#4A148C"; // Başlık ile aynı renk
    completionBox.appendChild(completionText);
    
    // Continue button
    let continueButton = document.createElement("button");
    continueButton.innerText = "Devam Et";
    continueButton.style.padding = "8px 15px"; // Daha az padding
    continueButton.style.backgroundColor = "#6A0DAD";
    continueButton.style.color = "white";
    continueButton.style.border = "none";
    continueButton.style.borderRadius = "5px";
    continueButton.style.cursor = "pointer";
    continueButton.style.fontSize = "0.95em"; // Daha küçük font
    continueButton.style.fontWeight = "bold";
    continueButton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    
    continueButton.addEventListener("mouseover", () => {
      continueButton.style.backgroundColor = "#4A148C";
    });
    
    continueButton.addEventListener("mouseout", () => {
      continueButton.style.backgroundColor = "#6A0DAD";
    });
    
    continueButton.addEventListener("click", () => {
      playClickSound();
      addConfetti();
      setTimeout(goNextPuzzle, 2000);
    });
    
    completionBox.appendChild(continueButton);
    questionContainer.appendChild(completionBox);
    
    // Update progress to 100%
    progressBar.style.width = "100%";
  }
  
  // Konfeti efekti
  function addConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'absolute';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#4CAF50', '#FF9800'];
    
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.position = 'absolute';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 6 + 5 + 'px';
      confetti.style.backgroundColor = color;
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = -20 + 'px';
      confetti.style.borderRadius = '50%';
      confetti.style.opacity = Math.random() + 0.5;
      
      confettiContainer.appendChild(confetti);
      
      const animationDuration = Math.random() * 3 + 2;
      const xDistance = (Math.random() - 0.5) * 40;
      
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
        { transform: `translate(${xDistance}vw, 100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });
    }
    
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  }
  
  // Quiz'i başlat
  showQuestion(currentQuestionIndex);
}

function setupPlanet3Puzzle4() {
  puzzleHintText.innerText = "IPUCU: Verinin doğru kategorilere ayrılması, yapay zeka modelinin öğrenebilmesi için çok önemlidir.";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "15px";
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme kutusu
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(156, 39, 176, 0.1)"; // More purple theme
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "12px";
  infoBox.style.border = "2px solid rgba(156, 39, 176, 0.3)"; // Purple border
  infoBox.style.width = "90%";
  infoBox.style.maxWidth = "700px";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  mainContainer.appendChild(infoBox);

  // Bilgilendirme başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "🧠 Makina Öğrenmesi ve Veri Sınıflandırma";
  infoTitle.style.margin = "0 0 8px 0";
  infoTitle.style.color = "#9C27B0"; // Purple color
  infoTitle.style.fontSize = "1.1em";
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni
  let infoText = document.createElement("p");
  infoText.innerHTML = "Yapay zeka sistemleri, verileri <strong>doğru kategorilere ayırmayı</strong> öğrenerek çalışır. Bu bulmacada, bir bilgisayara canlıların nerede yaşadığını öğretiyorsun! Her canlıyı doğru veri kutusuna taşıyarak modeli eğitiyorsun. Yapay zeka, bu etiketlenmiş verilerden öğrenerek, daha sonra hiç görmediği canlıların nerede yaşadığını tahmin edebilir.";
  infoText.style.margin = "0";
  infoText.style.fontSize = "0.95em";
  infoText.style.lineHeight = "1.4";
  infoBox.appendChild(infoText);

  // İlerleme göstergesi
  let progressContainer = document.createElement("div");
  progressContainer.style.width = "90%";
  progressContainer.style.maxWidth = "600px";
  progressContainer.style.textAlign = "center";
  progressContainer.style.marginTop = "5px";
  mainContainer.appendChild(progressContainer);

  let progressText = document.createElement("p");
  progressText.innerHTML = "<strong>Makine Öğrenimi İlerlemesi:</strong> 0/12 canlı sınıflandırıldı";
  progressText.style.margin = "0";
  progressText.style.fontWeight = "500";
  progressText.style.color = "#9C27B0"; // Purple color
  progressContainer.appendChild(progressText);

  let progressBarContainer = document.createElement("div");
  progressBarContainer.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  progressBarContainer.style.borderRadius = "20px";
  progressBarContainer.style.height = "10px";
  progressBarContainer.style.width = "100%";
  progressBarContainer.style.marginTop = "5px";
  progressBarContainer.style.position = "relative";
  progressBarContainer.style.overflow = "hidden";
  progressContainer.appendChild(progressBarContainer);

  let progressBar = document.createElement("div");
  progressBar.style.position = "absolute";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.height = "100%";
  progressBar.style.width = "0%";
  progressBar.style.backgroundColor = "#9C27B0"; // Purple color
  progressBar.style.borderRadius = "20px";
  progressBar.style.transition = "width 0.5s ease";
  progressBarContainer.appendChild(progressBar);

  // Başlangıç talimatları - MOVED UP HERE
  let instructionsContainer = document.createElement("div");
  instructionsContainer.id = "instructions-container";
  instructionsContainer.style.backgroundColor = "rgba(255, 152, 0, 0.1)";
  instructionsContainer.style.border = "2px solid rgba(255, 152, 0, 0.3)";
  instructionsContainer.style.borderRadius = "8px";
  instructionsContainer.style.padding = "10px 15px";
  instructionsContainer.style.margin = "10px auto";
  instructionsContainer.style.textAlign = "center";
  instructionsContainer.style.color = "#E65100";
  instructionsContainer.style.fontWeight = "bold";
  instructionsContainer.style.width = "90%";
  instructionsContainer.style.maxWidth = "600px";
  instructionsContainer.innerHTML = "👇 Aşağıdaki hayvanı sürükleyip doğru yaşam alanına bırak";
  mainContainer.appendChild(instructionsContainer);

  // Canlı kartları için konteyner - MOVED UP HERE
  let cardContainer = document.createElement("div");
  cardContainer.id = "animal-card-container";
  cardContainer.style.display = "flex";
  cardContainer.style.justifyContent = "center";
  cardContainer.style.alignItems = "center";
  cardContainer.style.width = "100%";
  cardContainer.style.marginTop = "5px";
  cardContainer.style.marginBottom = "20px"; // Added space below the cards
  mainContainer.appendChild(cardContainer);

  // Canlıları tutacak ana konteyner - MOVED AFTER CARDS
  let animalsGameContainer = document.createElement("div");
  animalsGameContainer.style.display = "flex";
  animalsGameContainer.style.flexDirection = "column";
  animalsGameContainer.style.alignItems = "center";
  animalsGameContainer.style.width = "100%";
  animalsGameContainer.style.gap = "15px";
  mainContainer.appendChild(animalsGameContainer);

  // Kutular için konteyner - yan yana olması için
  let boxesContainer = document.createElement("div");
  boxesContainer.style.display = "flex";
  boxesContainer.style.justifyContent = "center";
  boxesContainer.style.gap = "20px";
  boxesContainer.style.width = "90%";
  boxesContainer.style.maxWidth = "700px";
  animalsGameContainer.appendChild(boxesContainer);

  // Deniz Canlıları Kutusu
  let seaBox = document.createElement("div");
  seaBox.className = "dropzone";
  seaBox.dataset.type = "sea";
  seaBox.style.flex = "1";
  seaBox.style.minHeight = "200px";
  seaBox.style.backgroundColor = "rgba(3, 169, 244, 0.1)";
  seaBox.style.border = "2px dashed #03A9F4";
  seaBox.style.borderRadius = "10px";
  seaBox.style.padding = "10px";
  seaBox.style.display = "flex";
  seaBox.style.flexDirection = "column";
  seaBox.style.alignItems = "center";
  seaBox.style.transition = "all 0.3s ease";
  seaBox.style.maxWidth = "300px";
  seaBox.style.position = "relative";
  boxesContainer.appendChild(seaBox);

  // Deniz başlığı
  let seaTitle = document.createElement("div");
  seaTitle.innerHTML = "🌊 Deniz Canlıları Veri Kutusu";
  seaTitle.style.fontWeight = "bold";
  seaTitle.style.marginBottom = "10px";
  seaTitle.style.color = "#0277BD";
  seaTitle.style.textAlign = "center";
  seaBox.appendChild(seaTitle);

  // Deniz ikon arkaplanı
  let seaIcon = document.createElement("div");
  seaIcon.innerHTML = "🐟";
  seaIcon.style.fontSize = "3em";
  seaIcon.style.opacity = "0.2";
  seaIcon.style.position = "absolute";
  seaIcon.style.top = "50%";
  seaIcon.style.left = "50%";
  seaIcon.style.transform = "translate(-50%, -50%)";
  seaIcon.style.zIndex = "0";
  seaBox.appendChild(seaIcon);

  // Kara Canlıları Kutusu
  let landBox = document.createElement("div");
  landBox.className = "dropzone";
  landBox.dataset.type = "land";
  landBox.style.flex = "1";
  landBox.style.minHeight = "200px";
  landBox.style.backgroundColor = "rgba(139, 195, 74, 0.1)";
  landBox.style.border = "2px dashed #8BC34A";
  landBox.style.borderRadius = "10px";
  landBox.style.padding = "10px";
  landBox.style.display = "flex";
  landBox.style.flexDirection = "column";
  landBox.style.alignItems = "center";
  landBox.style.transition = "all 0.3s ease";
  landBox.style.maxWidth = "300px";
  landBox.style.position = "relative";
  boxesContainer.appendChild(landBox);

  // Kara başlığı
  let landTitle = document.createElement("div");
  landTitle.innerHTML = "🌳 Kara Canlıları Veri Kutusu";
  landTitle.style.fontWeight = "bold";
  landTitle.style.marginBottom = "10px";
  landTitle.style.color = "#558B2F";
  landTitle.style.textAlign = "center";
  landBox.appendChild(landTitle);

  // Kara ikon arkaplanı
  let landIcon = document.createElement("div");
  landIcon.innerHTML = "🦁";
  landIcon.style.fontSize = "3em";
  landIcon.style.opacity = "0.2";
  landIcon.style.position = "absolute";
  landIcon.style.top = "50%";
  landIcon.style.left = "50%";
  landIcon.style.transform = "translate(-50%, -50%)";
  landIcon.style.zIndex = "0";
  landBox.appendChild(landIcon);

  // Drop alanları için event listeners
  [seaBox, landBox].forEach(box => {
    box.addEventListener("dragover", e => {
      e.preventDefault();
      box.style.backgroundColor = box.dataset.type === "sea" ? 
        "rgba(3, 169, 244, 0.2)" : "rgba(139, 195, 74, 0.2)";
      box.style.transform = "scale(1.02)";
    });

    box.addEventListener("dragleave", e => {
      e.preventDefault();
      box.style.backgroundColor = box.dataset.type === "sea" ? 
        "rgba(3, 169, 244, 0.1)" : "rgba(139, 195, 74, 0.1)";
      box.style.transform = "scale(1)";
    });

    box.addEventListener("drop", e => {
      e.preventDefault();
      box.style.backgroundColor = box.dataset.type === "sea" ? 
        "rgba(3, 169, 244, 0.1)" : "rgba(139, 195, 74, 0.1)";
      box.style.transform = "scale(1)";

      try {
        const animalType = e.dataTransfer.getData("text/plain");
        const animalData = JSON.parse(e.dataTransfer.getData("application/json"));
        
        // Doğru kutuya bırakıldı mı kontrolü
        if (box.dataset.type === animalData.habitat) {
          playCorrectSound();
          
          // Animasyonlu sınıflandırma göstergesi
          let classifiedItem = document.createElement("div");
          classifiedItem.style.display = "flex";
          classifiedItem.style.alignItems = "center";
          classifiedItem.style.justifyContent = "center";
          classifiedItem.style.gap = "5px";
          classifiedItem.style.width = "90%";
          classifiedItem.style.padding = "6px";
          classifiedItem.style.backgroundColor = box.dataset.type === "sea" ? "#03A9F4" : "#8BC34A";
          classifiedItem.style.color = "white";
          classifiedItem.style.borderRadius = "5px";
          classifiedItem.style.fontSize = "0.9em";
          classifiedItem.style.fontWeight = "bold";
          classifiedItem.style.animation = "fadeIn 0.5s ease";
          classifiedItem.style.marginBottom = "5px";
          classifiedItem.style.zIndex = "2";
          classifiedItem.style.position = "relative";
          
          // Emoji + etiket
          const emoji = animalData.emoji;
          classifiedItem.innerText = `${emoji} ${animalData.name}`;
          
          // Doğru işareti
          const checkmark = document.createElement("span");
          checkmark.innerText = "✓";
          checkmark.style.marginLeft = "auto";
          classifiedItem.appendChild(checkmark);
          
          box.appendChild(classifiedItem);
          
          // Orijinal kartı gizle - kaybolma animasyonu ekle
          const draggedElement = document.querySelector(`.animal-card[data-index="${animalData.index}"]`);
          if (draggedElement) {
            draggedElement.style.transition = "all 0.5s ease";
            draggedElement.style.transform = "scale(0)";
            draggedElement.style.opacity = "0";
            
            // Animasyon bittikten sonra kartı gizle
            setTimeout(() => {
              draggedElement.style.display = "none";

              // Yeni hayvan çıkar
              showNextAnimal();
            }, 500);
          }
          
          // İlerleme güncelle
          classifiedCount++;
          progressText.innerHTML = `<strong>Makine Öğrenimi İlerlemesi:</strong> ${classifiedCount}/12 canlı sınıflandırıldı`;
          progressBar.style.width = `${(classifiedCount / totalAnimals) * 100}%`;
          
          // Tüm canlılar sınıflandırıldı mı?
          if (classifiedCount === totalAnimals) {
            showMessage("Tebrikler! Tüm canlıları doğru şekilde sınıflandırdın!", "success");
            
            // Kutlama animasyonu
            setTimeout(() => {
              // Yapay zekanın öğrendiğini gösteren animasyon
              let aiLearningMsg = document.createElement("div");
              aiLearningMsg.style.position = "absolute";
              aiLearningMsg.style.top = "50%";
              aiLearningMsg.style.left = "50%";
              aiLearningMsg.style.transform = "translate(-50%, -50%)";
              aiLearningMsg.style.backgroundColor = "rgba(76, 175, 80, 0.9)";
              aiLearningMsg.style.color = "white";
              aiLearningMsg.style.padding = "20px";
              aiLearningMsg.style.borderRadius = "10px";
              aiLearningMsg.style.fontSize = "1.2em";
              aiLearningMsg.style.fontWeight = "bold";
              aiLearningMsg.style.textAlign = "center";
              aiLearningMsg.style.zIndex = "1000";
              aiLearningMsg.style.animation = "pulse 1.5s infinite";
              aiLearningMsg.innerHTML = `🎉 <br> Yapay Zeka Başarıyla Eğitildi! <br> Artık canlıların yaşam alanlarını tanıyabiliyor!`;
              
              animalsGameContainer.appendChild(aiLearningMsg);
              
              // Konfeti efekti ekle
              addConfetti();
              
              // Bir süre sonra bir sonraki puzzle'a geç
              setTimeout(goNextPuzzle, 3500);
            }, 1000);
          } else {
            showMessage(`Doğru! ${animalData.name} bir ${box.dataset.type === "sea" ? "deniz" : "kara"} canlısı.`, "success");
          }
        } else {
          // Yanlış kutuya bırakıldı
          playWrongSound();
          
          // Kutuyu salla
          box.style.animation = "shake 0.5s";
          setTimeout(() => {
            box.style.animation = "";
          }, 500);
          
          showMessage(`Hata! ${animalData.name} bir ${animalData.habitat === "sea" ? "deniz" : "kara"} canlısıdır!`, "error");
        }
      } catch (error) {
        console.error("Canlı verisi işlenirken hata oluştu:", error);
      }
    });
  });

  // Canlı listesi - deniz ve kara canlıları
  const animalsList = [
    { name: "Balina", habitat: "sea", emoji: "🐋" },
    { name: "Yunus", habitat: "sea", emoji: "🐬" },
    { name: "Köpekbalığı", habitat: "sea", emoji: "🦈" },
    { name: "Ahtapot", habitat: "sea", emoji: "🐙" },
    { name: "Karides", habitat: "sea", emoji: "🦐" },
    { name: "Balık", habitat: "sea", emoji: "🐠" },
    { name: "Aslan", habitat: "land", emoji: "🦁" },
    { name: "Fil", habitat: "land", emoji: "🐘" },
    { name: "Zürafa", habitat: "land", emoji: "🦒" },
    { name: "Kurbağa", habitat: "land", emoji: "🐸" },
    { name: "Kelebek", habitat: "land", emoji: "🦋" },
    { name: "Karınca", habitat: "land", emoji: "🐜" }
  ];

  // Canlı listesini karıştır
  const shuffledAnimals = shuffleArray([...animalsList]);
  
  // Toplam canlı sayısı ve sınıflandırılan canlı sayısı
  const totalAnimals = shuffledAnimals.length;
  let classifiedCount = 0;
  let currentAnimalIndex = 0;

  // Animasyonda sallanma efekti
  let styleElement = document.createElement("style");
  styleElement.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      50% { transform: translateX(5px); }
      75% { transform: translateX(-5px); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.05); }
      100% { transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `;
  document.head.appendChild(styleElement);

  // Konfeti efekti fonksiyonu
  function addConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'absolute';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#03A9F4', '#8BC34A', '#FFC107', '#FF5722', '#9C27B0', '#3F51B5'];
    
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.position = 'absolute';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 6 + 5 + 'px';
      confetti.style.backgroundColor = color;
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = -20 + 'px';
      confetti.style.borderRadius = '50%';
      confetti.style.opacity = Math.random() + 0.5;
      
      confettiContainer.appendChild(confetti);
      
      const animationDuration = Math.random() * 3 + 2;
      const xDistance = (Math.random() - 0.5) * 40;
      
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
        { transform: `translate(${xDistance}vw, 100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });
    }
    
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  }

  // Bir sonraki canlıyı göster
  function showNextAnimal() {
    if (currentAnimalIndex < totalAnimals) {
      const animal = shuffledAnimals[currentAnimalIndex];
      createAnimalCard(animal, currentAnimalIndex);
      currentAnimalIndex++;
    }
  }

  // Hayvan kartı oluşturma fonksiyonu
  function createAnimalCard(animal, index) {
    // Varsa mevcut kartı temizle
    const existingCard = document.querySelector("#animal-card-container > div");
    if (existingCard) {
      existingCard.remove();
    }
    
    // Yeni kart oluştur
    let card = document.createElement("div");
    card.className = "animal-card";
    card.dataset.index = index;
    card.dataset.name = animal.name;
    card.draggable = true;

    card.style.width = "180px";
    card.style.height = "120px";
    card.style.backgroundColor = animal.habitat === "sea" ? "rgba(3, 169, 244, 0.8)" : "rgba(139, 195, 74, 0.8)";
    card.style.color = "white";
    card.style.borderRadius = "8px";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.alignItems = "center";
    card.style.justifyContent = "center";
    card.style.textAlign = "center";
    card.style.cursor = "grab";
    card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    card.style.animation = "float 2s infinite ease-in-out";
    card.style.userSelect = "none";
    card.style.transition = "transform 0.2s";

    // Emoji
    let emoji = document.createElement("div");
    emoji.innerText = animal.emoji;
    emoji.style.fontSize = "3em";
    emoji.style.marginBottom = "5px";
    card.appendChild(emoji);

    // Hayvan adı
    let animalName = document.createElement("div");
    animalName.innerText = animal.name;
    animalName.style.fontSize = "1.2em";
    animalName.style.fontWeight = "bold";
    card.appendChild(animalName);

    // Kart için drag&drop olayları
    card.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", animal.name);
      e.dataTransfer.setData("application/json", JSON.stringify({
        name: animal.name,
        habitat: animal.habitat,
        emoji: animal.emoji,
        index: index
      }));
      card.style.opacity = "0.6";
    });

    card.addEventListener("dragend", () => {
      card.style.opacity = "1";
    });

    card.addEventListener("mouseover", () => {
      card.style.transform = "scale(1.05)";
    });

    card.addEventListener("mouseout", () => {
      card.style.transform = "scale(1)";
    });

    // Kartı konteyner'a ekle
    document.getElementById("animal-card-container").appendChild(card);
  }

  // İlk canlıyı göster
  showNextAnimal();
}

function setupPlanet3Puzzle5() {
  puzzleHintText.innerText = "IPUCU: Bitkinin ne kadar büyüyeceğini tahmin et!";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "15px";
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme kutusu
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(76, 175, 80, 0.1)"; // Yeşil tema
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "15px";
  infoBox.style.border = "2px solid rgba(76, 175, 80, 0.3)";
  infoBox.style.width = "90%";
  infoBox.style.maxWidth = "700px";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  mainContainer.appendChild(infoBox);

  // Bilgilendirme başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "🌱 Büyüyen Bitki Tahmini";
  infoTitle.style.margin = "0 0 8px 0";
  infoTitle.style.color = "#388E3C";
  infoTitle.style.fontSize = "1.2em";
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni
  let infoText = document.createElement("p");
  infoText.innerHTML = "Yapay zeka, <strong>tahmin</strong> yapmayı çok sever! Tıpkı senin bir bitkiye verdiğin suyun miktarına göre bitkinin ne kadar büyüyeceğini tahmin ettiğin gibi. İşte bu öğrenmeye <strong>Regresyon</strong> denir. Haydi bitkimizi büyütelim!";
  infoText.style.margin = "0 0 10px 0";
  infoText.style.fontSize = "1em";
  infoText.style.lineHeight = "1.4";
  infoBox.appendChild(infoText);

  // Bitki ve su görselleri
  let plantGameBox = document.createElement("div");
  plantGameBox.style.display = "flex";
  plantGameBox.style.justifyContent = "space-around";
  plantGameBox.style.alignItems = "center";
  plantGameBox.style.width = "90%";
  plantGameBox.style.margin = "20px 0";
  plantGameBox.style.padding = "15px";
  plantGameBox.style.backgroundColor = "rgba(76, 175, 80, 0.05)";
  plantGameBox.style.borderRadius = "15px";
  plantGameBox.style.border = "2px dashed #4CAF50";
  mainContainer.appendChild(plantGameBox);

  // Bitki görseli ve büyüme animasyonu
  let plantSide = document.createElement("div");
  plantSide.style.position = "relative";
  plantSide.style.width = "45%";
  plantSide.style.height = "200px";
  plantSide.style.textAlign = "center";
  plantGameBox.appendChild(plantSide);

  // Saksı görseli
  let pot = document.createElement("div");
  pot.style.position = "absolute";
  pot.style.bottom = "0";
  pot.style.left = "50%";
  pot.style.transform = "translateX(-50%)";
  pot.style.width = "60px";
  pot.style.height = "50px";
  pot.style.backgroundColor = "#CD853F";
  pot.style.borderRadius = "0 0 30px 30px";
  pot.style.zIndex = "1";
  plantSide.appendChild(pot);

  // Bitki gövdesi
  let stem = document.createElement("div");
  stem.id = "plant-stem";
  stem.style.position = "absolute";
  stem.style.bottom = "50px";
  stem.style.left = "50%";
  stem.style.transform = "translateX(-50%)";
  stem.style.width = "10px";
  stem.style.height = "30px";
  stem.style.backgroundColor = "#4CAF50";
  stem.style.borderRadius = "5px";
  stem.style.transition = "height 1s ease-in-out";
  stem.style.zIndex = "2";
  plantSide.appendChild(stem);

  // Bitki yaprakları
  let leaf1 = document.createElement("div");
  leaf1.id = "leaf1";
  leaf1.style.position = "absolute";
  leaf1.style.bottom = "65px";
  leaf1.style.left = "calc(50% - 20px)";
  leaf1.style.width = "20px";
  leaf1.style.height = "15px";
  leaf1.style.backgroundColor = "#81C784";
  leaf1.style.borderRadius = "50% 0 50% 0";
  leaf1.style.transform = "rotate(-45deg)";
  leaf1.style.transformOrigin = "right bottom";
  leaf1.style.zIndex = "1";
  leaf1.style.transition = "all 1s ease-in-out";
  plantSide.appendChild(leaf1);

  let leaf2 = document.createElement("div");
  leaf2.id = "leaf2";
  leaf2.style.position = "absolute";
  leaf2.style.bottom = "65px";
  leaf2.style.right = "calc(50% - 20px)";
  leaf2.style.width = "20px";
  leaf2.style.height = "15px";
  leaf2.style.backgroundColor = "#66BB6A";
  leaf2.style.borderRadius = "0 50% 0 50%";
  leaf2.style.transform = "rotate(45deg)";
  leaf2.style.transformOrigin = "left bottom";
  leaf2.style.zIndex = "1";
  leaf2.style.transition = "all 1s ease-in-out";
  plantSide.appendChild(leaf2); // Düzeltildi: plantGameBox yerine plantSide'a ekleniyor

  // Su damlası emojisi gösterimi
  let waterLabel = document.createElement("div");
  waterLabel.style.fontSize = "1.5em";
  waterLabel.innerHTML = "Su miktarı: <span id='water-amount'>0</span> 💧";
  waterLabel.style.marginBottom = "15px";
  waterLabel.style.color = "#2196F3";
  waterLabel.style.fontWeight = "bold";
  
  // Slider kontrol
  let sliderSide = document.createElement("div");
  sliderSide.style.width = "45%";
  sliderSide.style.display = "flex";
  sliderSide.style.flexDirection = "column";
  sliderSide.style.alignItems = "center";
  sliderSide.style.justifyContent = "center";
  plantGameBox.appendChild(sliderSide);
  
  sliderSide.appendChild(waterLabel);
  
  let waterControl = document.createElement("input");
  waterControl.type = "range";
  waterControl.min = "0";
  waterControl.max = "5";
  waterControl.value = "0";
  waterControl.step = "1";
  waterControl.style.width = "100%";
  waterControl.style.height = "30px";
  waterControl.style.accentColor = "#2196F3";
  sliderSide.appendChild(waterControl);

  // Bitki boyu göstergesi
  let heightDisplay = document.createElement("div");
  heightDisplay.style.marginTop = "20px";
  heightDisplay.style.fontSize = "1.2em";
  heightDisplay.innerHTML = "Bitki Boyu: <span id='plant-height'>30</span> cm";
  heightDisplay.style.color = "#388E3C";
  heightDisplay.style.fontWeight = "bold";
  sliderSide.appendChild(heightDisplay);

  // Büyütme butonu
  let growButton = document.createElement("button");
  growButton.innerText = "Büyüt 🌿";
  growButton.style.marginTop = "20px";
  growButton.style.padding = "10px 20px";
  growButton.style.fontSize = "1.1em";
  growButton.style.backgroundColor = "#4CAF50";
  growButton.style.color = "white";
  growButton.style.border = "none";
  growButton.style.borderRadius = "30px";
  growButton.style.cursor = "pointer";
  growButton.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  growButton.style.transition = "all 0.3s";
  sliderSide.appendChild(growButton);

  // Tahmin kutusu
  let predictionBox = document.createElement("div");
  predictionBox.style.width = "90%";
  predictionBox.style.margin = "20px 0";
  predictionBox.style.padding = "15px";
  predictionBox.style.backgroundColor = "rgba(33, 150, 243, 0.1)";
  predictionBox.style.borderRadius = "15px";
  predictionBox.style.border = "2px dashed #2196F3";
  predictionBox.style.display = "flex";
  predictionBox.style.flexDirection = "column";
  predictionBox.style.alignItems = "center";
  mainContainer.appendChild(predictionBox);

  let predictionTitle = document.createElement("h3");
  predictionTitle.innerText = "🔮 Tahmin Zamanı!";
  predictionTitle.style.color = "#1976D2";
  predictionTitle.style.margin = "0 0 15px 0";
  predictionBox.appendChild(predictionTitle);

  let predictionQuestion = document.createElement("p");
  predictionQuestion.innerHTML = "Eğer bitkiye <strong>7 damla</strong> su verirsek ne kadar büyür?";
  predictionQuestion.style.fontSize = "1.1em";
  predictionQuestion.style.marginBottom = "15px";
  predictionBox.appendChild(predictionQuestion);

  // Tahmin seçenekleri
  let options = [
    { value: "70", text: "70 cm", correct: true },
    { value: "40", text: "40 cm", correct: false },
    { value: "100", text: "100 cm", correct: false }
  ];

  let optionsContainer = document.createElement("div");
  optionsContainer.style.display = "flex";
  optionsContainer.style.gap = "15px";
  optionsContainer.style.marginBottom = "15px";
  predictionBox.appendChild(optionsContainer);

  options.forEach(option => {
    let optionButton = document.createElement("button");
    optionButton.innerText = option.text;
    optionButton.style.padding = "10px 20px";
    optionButton.style.fontSize = "1em";
    optionButton.style.backgroundColor = "white";
    optionButton.style.color = "#1976D2";
    optionButton.style.border = "2px solid #2196F3";
    optionButton.style.borderRadius = "30px";
    optionButton.style.cursor = "pointer";
    optionButton.style.fontWeight = "bold";
    optionButton.style.transition = "all 0.3s";

    optionButton.addEventListener("mouseover", () => {
      optionButton.style.backgroundColor = "rgba(33, 150, 243, 0.1)";
    });

    optionButton.addEventListener("mouseout", () => {
      optionButton.style.backgroundColor = "white";
    });

    optionButton.addEventListener("click", () => {
      // Tüm butonları devre dışı bırak
      optionsContainer.querySelectorAll("button").forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = "default";
        btn.style.opacity = "0.7";
      });

      if (option.correct) {
        playCorrectSound();
        optionButton.style.backgroundColor = "#4CAF50";
        optionButton.style.borderColor = "#4CAF50";
        optionButton.style.color = "white";
        optionButton.style.opacity = "1";
        
        // Doğru açıklama - Tebrikler mesajı ile aynı renk yapıldı
        let feedback = document.createElement("div");
        feedback.style.backgroundColor = "#E8F5E9";
        feedback.style.padding = "10px 15px";
        feedback.style.borderRadius = "8px";
        feedback.style.marginTop = "10px";
        feedback.style.border = "2px solid #A5D6A7";
        
        feedback.innerHTML = "<span style='font-weight:bold; color:#388E3C'>✅ Harika! Doğru tahmin!</span><br><span style='color:#388E3C'>Her 1 damla su bitkinin 10 cm büyümesini sağlar. 7 damla = 70 cm!</span>";
        predictionBox.appendChild(feedback);
        
        // Konfeti ekle
        setTimeout(() => {
          addConfetti();
          setTimeout(goNextPuzzle, 3000);
        }, 1000);
        
      } else {
        playWrongSound();
        optionButton.style.backgroundColor = "#F44336";
        optionButton.style.borderColor = "#F44336";
        optionButton.style.color = "white";
        optionButton.style.opacity = "1";
        
        // Doğru seçeneği göster
        options.forEach((opt, idx) => {
          if (opt.correct) {
            optionsContainer.querySelectorAll("button")[idx].style.backgroundColor = "#4CAF50";
            optionsContainer.querySelectorAll("button")[idx].style.borderColor = "#4CAF50";
            optionsContainer.querySelectorAll("button")[idx].style.color = "white";
            optionsContainer.querySelectorAll("button")[idx].style.opacity = "1";
          }
        });
        
        // Yanlış açıklama
        let feedback = document.createElement("div");
        feedback.style.backgroundColor = "#FFEBEE";
        feedback.style.padding = "10px 15px";
        feedback.style.borderRadius = "8px";
        feedback.style.marginTop = "10px";
        feedback.style.border = "2px solid #FFCDD2";
        
        feedback.innerHTML = "<span style='font-weight:bold; color:#D32F2F'>❌ Tekrar dene!</span><br>Her 1 damla su bitkinin 10 cm büyümesini sağlar. 7 damla = 70 cm olmalı!";
        predictionBox.appendChild(feedback);
        
        // 3 saniye sonra yeniden dene
        setTimeout(() => {
          optionsContainer.querySelectorAll("button").forEach(btn => {
            btn.disabled = false;
            btn.style.cursor = "pointer";
            btn.style.opacity = "1";
            btn.style.backgroundColor = "white";
            btn.style.borderColor = "#2196F3";
            btn.style.color = "#1976D2";
          });
          
          if (feedback && feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
          }
        }, 3000);
      }
    });
    
    optionsContainer.appendChild(optionButton);
  });

  // Su miktarına göre bitkiyi büyütme işlevi
  waterControl.addEventListener("input", function() {
    document.getElementById("water-amount").innerText = this.value;
  });
  
  growButton.addEventListener("click", function() {
    const waterValue = parseInt(waterControl.value);
    const newHeight = 30 + (waterValue * 10); // Her damla 10 cm büyütür
    
    document.getElementById("plant-height").innerText = newHeight;
    
    // Bitki gövdesini uzat
    const stem = document.getElementById("plant-stem");
    stem.style.height = Math.min(150, newHeight) + "px"; // Maksimum 150px yüksekliğe kadar
    
    // Yaprakları güncelle
    const leaf1 = document.getElementById("leaf1");
    const leaf2 = document.getElementById("leaf2");
    
    leaf1.style.bottom = (65 + (newHeight - 30)) + "px";
    leaf2.style.bottom = (65 + (newHeight - 30)) + "px";
    
    // Yaprak boyutunu büyüt (orantılı olarak)
    const leafSizeIncrease = 1 + (waterValue * 0.15);
    leaf1.style.width = (20 * leafSizeIncrease) + "px";
    leaf1.style.height = (15 * leafSizeIncrease) + "px";
    leaf2.style.width = (20 * leafSizeIncrease) + "px";
    leaf2.style.height = (15 * leafSizeIncrease) + "px";
  });

  // Konfeti efekti fonksiyonu
  function addConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'absolute';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#4CAF50', '#66BB6A', '#81C784', '#2196F3', '#FFC107', '#FF9800'];
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.position = 'absolute';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 6 + 5 + 'px';
      confetti.style.backgroundColor = color;
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = -20 + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '5px';
      confetti.style.opacity = Math.random() + 0.5;
      
      confettiContainer.appendChild(confetti);
      
      const animationDuration = Math.random() * 3 + 2;
      const xDistance = (Math.random() - 0.5) * 40;
      
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
        { transform: `translate(${xDistance}vw, 100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });
    }
    
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  }
}

/****************************************************************
 *********** 4) DOĞAL DİL BULUŞMA NOKTASI (5 Puzzle) ************
 ****************************************************************/
function setupPlanet4Puzzle1() {
  puzzleHintText.innerText = "IPUCU: Kelimeleri doğru sıraya koyarak anlamlı cümleler oluştur!";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "15px";
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme kutusu
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(33, 150, 243, 0.1)"; // Mavi tema
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "15px";
  infoBox.style.border = "2px solid rgba(33, 150, 243, 0.3)";
  infoBox.style.width = "90%";
  infoBox.style.maxWidth = "700px";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  mainContainer.appendChild(infoBox);

  // Bilgilendirme başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "🔤 Doğal Dil İşleme Nedir?";
  infoTitle.style.margin = "0 0 10px 0";
  infoTitle.style.color = "#1976D2";
  infoTitle.style.fontSize = "1.2em";
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni
  let infoText = document.createElement("p");
  infoText.innerHTML = "Yapay zeka, insanların konuştuğu ve yazdığı <strong>doğal dili</strong> anlayabilir. Bunun için <strong>doğal dil işleme</strong> denilen bir teknoloji kullanır. Bu teknoloji sayesinde yapay zeka metinlerdeki kelimelerin anlamlarını, cümlelerin yapısını ve dilbilgisi kurallarını öğrenir. ChatGPT, Siri ve Alexa gibi asistanlar bu sayede bizimle konuşabilir. Haydi şimdi kelimelerden anlamlı cümleler kuralım!";
  infoText.style.margin = "0 0 10px 0";
  infoText.style.fontSize = "1em";
  infoText.style.lineHeight = "1.4";
  infoBox.appendChild(infoText);

  // İlerleme göstergesi
  let progressContainer = document.createElement("div");
  progressContainer.style.width = "90%";
  progressContainer.style.maxWidth = "700px";
  progressContainer.style.margin = "15px 0";
  progressContainer.style.display = "flex";
  progressContainer.style.justifyContent = "space-between";
  progressContainer.style.alignItems = "center";
  mainContainer.appendChild(progressContainer);

  // İlerleme metni
  let progressText = document.createElement("div");
  progressText.id = "progress-text";
  progressText.innerText = "Cümle: 1/3";
  progressText.style.fontSize = "1.1em";
  progressText.style.fontWeight = "bold";
  progressText.style.color = "#1976D2";
  progressContainer.appendChild(progressText);

  // İlerleme çubuğu
  let progressBarContainer = document.createElement("div");
  progressBarContainer.style.width = "70%";
  progressBarContainer.style.height = "12px";
  progressBarContainer.style.backgroundColor = "rgba(33, 150, 243, 0.2)";
  progressBarContainer.style.borderRadius = "6px";
  progressBarContainer.style.overflow = "hidden";
  progressContainer.appendChild(progressBarContainer);

  let progressBar = document.createElement("div");
  progressBar.id = "progress-bar";
  progressBar.style.width = "33.3%"; // İlk cümle için 1/3
  progressBar.style.height = "100%";
  progressBar.style.backgroundColor = "#2196F3";
  progressBar.style.transition = "width 0.5s ease";
  progressBarContainer.appendChild(progressBar);

  // Cümle kutu alanı
  let sentenceBox = document.createElement("div");
  sentenceBox.style.width = "90%";
  sentenceBox.style.maxWidth = "700px";
  sentenceBox.style.padding = "15px";
  sentenceBox.style.marginTop = "10px";
  sentenceBox.style.backgroundColor = "rgba(33, 150, 243, 0.05)";
  sentenceBox.style.borderRadius = "12px";
  sentenceBox.style.border = "2px dashed #2196F3";
  sentenceBox.style.display = "flex";
  sentenceBox.style.flexDirection = "column";
  sentenceBox.style.alignItems = "center";
  sentenceBox.style.gap = "15px";
  mainContainer.appendChild(sentenceBox);

  // Cümleyi gösterecek alan
  let sentenceDisplay = document.createElement("div");
  sentenceDisplay.id = "sentence-display";
  sentenceDisplay.style.width = "90%";
  sentenceDisplay.style.minHeight = "60px";
  sentenceDisplay.style.padding = "10px";
  sentenceDisplay.style.textAlign = "center";
  sentenceDisplay.style.fontSize = "1.2em";
  sentenceDisplay.style.fontWeight = "bold";
  sentenceDisplay.style.color = "#1976D2";
  sentenceDisplay.style.backgroundColor = "white";
  sentenceDisplay.style.borderRadius = "8px";
  sentenceDisplay.style.border = "2px solid #BBDEFB";
  sentenceDisplay.style.display = "flex";
  sentenceDisplay.style.flexWrap = "wrap";
  sentenceDisplay.style.justifyContent = "center";
  sentenceDisplay.style.alignItems = "center";
  sentenceDisplay.style.gap = "5px";
  sentenceBox.appendChild(sentenceDisplay);

  // Kelime butonları için konteyner
  let wordsContainer = document.createElement("div");
  wordsContainer.id = "words-container";
  wordsContainer.style.display = "flex";
  wordsContainer.style.flexWrap = "wrap";
  wordsContainer.style.justifyContent = "center";
  wordsContainer.style.gap = "10px";
  wordsContainer.style.marginTop = "15px";
  sentenceBox.appendChild(wordsContainer);

  // Doğal dil işlemeyle ilgili 3 farklı cümle
  const sentences = [
    ["Yapay", "zeka", "metinleri", "anlayıp", "cevap", "verebilir"],
    ["Bilgisayarlar", "artık", "insan", "dilini", "öğrenebiliyor"],
    ["Doğal", "dil", "işleme", "sayesinde", "robotlarla", "konuşabiliriz"]
  ];

  let currentSentenceIndex = 0;
  let currentWordIndex = 0;
  let selectedWords = [];

  // Cümleyi göster fonksiyonu
  function displaySelectedWords() {
    sentenceDisplay.innerHTML = "";
    selectedWords.forEach(word => {
      let wordSpan = document.createElement("span");
      wordSpan.innerText = word;
      wordSpan.style.padding = "5px 10px";
      wordSpan.style.margin = "3px";
      wordSpan.style.backgroundColor = "#BBDEFB";
      wordSpan.style.color = "#1976D2";
      wordSpan.style.borderRadius = "15px";
      wordSpan.style.boxShadow = "0 2px 3px rgba(0,0,0,0.1)";
      sentenceDisplay.appendChild(wordSpan);
    });
  }

  // Kelimeleri göster fonksiyonu
  function showWords() {
    // Konteynerı temizle
    wordsContainer.innerHTML = "";
    selectedWords = [];
    currentWordIndex = 0;
    
    // İlerleme metnini güncelle
    document.getElementById("progress-text").innerText = `Cümle: ${currentSentenceIndex + 1}/3`;
    
    // İlerleme çubuğunu güncelle
    document.getElementById("progress-bar").style.width = `${(currentSentenceIndex + 1) * 33.3}%`;
    
    // Kelimeleri karıştır
    let shuffledWords = shuffleArray([...sentences[currentSentenceIndex]]);
    
    // Her kelime için buton oluştur
    shuffledWords.forEach(word => {
      let wordButton = document.createElement("button");
      wordButton.innerText = word;
      wordButton.dataset.word = word;
      wordButton.style.padding = "10px 15px";
      wordButton.style.fontSize = "1em";
      wordButton.style.backgroundColor = "white";
      wordButton.style.color = "#1976D2";
      wordButton.style.border = "2px solid #2196F3";
      wordButton.style.borderRadius = "20px";
      wordButton.style.cursor = "pointer";
      wordButton.style.transition = "all 0.2s";
      
      // Hover efekti
      wordButton.addEventListener("mouseover", () => {
        if (!wordButton.disabled) {
          wordButton.style.backgroundColor = "rgba(33, 150, 243, 0.1)";
          wordButton.style.transform = "translateY(-2px)";
        }
      });
      
      wordButton.addEventListener("mouseout", () => {
        if (!wordButton.disabled) {
          wordButton.style.backgroundColor = "white";
          wordButton.style.transform = "translateY(0)";
        }
      });
      
      // Tıklama olayı
      wordButton.addEventListener("click", () => {
        if (word === sentences[currentSentenceIndex][currentWordIndex]) {
          // Doğru kelime seçildi
        playCorrectSound();
          
          // Butonu devre dışı bırak ve rengini değiştir
          wordButton.disabled = true;
          wordButton.style.backgroundColor = "#4CAF50";
          wordButton.style.borderColor = "#4CAF50";
          wordButton.style.color = "white";
          wordButton.style.cursor = "default";
          wordButton.style.opacity = "0.7";
          
          // Seçilen kelimeyi ekle
          selectedWords.push(word);
          displaySelectedWords();
          
          // Sonraki kelimeye geç
          currentWordIndex++;
          
          // Cümle tamamlandı mı?
          if (currentWordIndex === sentences[currentSentenceIndex].length) {
            // Konfeti efekti
            addMiniConfetti();
            
            // Tamamlandı mesajı
            showMessage(`Mükemmel! "${sentences[currentSentenceIndex].join(' ')}" cümlesini doğru kurdun!`, "success");
            
            // Sonraki cümleye geç veya bitir
            setTimeout(() => {
              currentSentenceIndex++;
              
              if (currentSentenceIndex < sentences.length) {
                // Sonraki cümleye geç
                showWords();
              } else {
                // Tüm cümleler tamamlandı, kutlama ve sonraki bulmacaya geç
                addFullConfetti();
                setTimeout(goNextPuzzle, 2500);
              }
            }, 1500);
        }
      } else {
          // Yanlış kelime seçildi
        playWrongSound();
          
          // Butonu sallandır
          wordButton.style.animation = "shake 0.5s";
          setTimeout(() => {
            wordButton.style.animation = "";
          }, 500);
          
          showMessage("Yanlış kelime! Doğru sırada gitmelisin.", "error");
        setTimeout(clearMessage, 1500);
      }
    });
      
      wordsContainer.appendChild(wordButton);
    });
    
    // Cümle gösterme alanını temizle
    displaySelectedWords();
  }

  // Mini konfeti efekti (cümle tamamlandığında)
  function addMiniConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'absolute';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#2196F3', '#03A9F4', '#00BCD4', '#4CAF50', '#FFC107', '#FF9800'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.position = 'absolute';
      confetti.style.width = Math.random() * 8 + 5 + 'px';
      confetti.style.height = Math.random() * 5 + 5 + 'px';
      confetti.style.backgroundColor = color;
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = -20 + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '5px';
      confetti.style.opacity = Math.random() + 0.5;
      
      confettiContainer.appendChild(confetti);
      
      const animationDuration = Math.random() * 2 + 1;
      const xDistance = (Math.random() - 0.5) * 30;
      
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
        { transform: `translate(${xDistance}vw, 100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });
    }
    
    setTimeout(() => {
      confettiContainer.remove();
    }, 3000);
  }

  // Tam konfeti efekti (tüm cümleler tamamlandığında)
  function addFullConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'absolute';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#2196F3', '#03A9F4', '#00BCD4', '#4CAF50', '#FFC107', '#FF9800'];
    
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.position = 'absolute';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 6 + 5 + 'px';
      confetti.style.backgroundColor = color;
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = -20 + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '5px';
      confetti.style.opacity = Math.random() + 0.5;
      
      confettiContainer.appendChild(confetti);
      
      const animationDuration = Math.random() * 3 + 2;
      const xDistance = (Math.random() - 0.5) * 40;
      
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
        { transform: `translate(${xDistance}vw, 100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });
    }
    
    // Başarı mesajı göster
    let successMessage = document.createElement("div");
    successMessage.style.position = "absolute";
    successMessage.style.top = "50%";
    successMessage.style.left = "50%";
    successMessage.style.transform = "translate(-50%, -50%)";
    successMessage.style.padding = "20px 30px";
    successMessage.style.backgroundColor = "rgba(255,255,255,0.9)";
    successMessage.style.borderRadius = "15px";
    successMessage.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
    successMessage.style.zIndex = "1001";
    successMessage.style.textAlign = "center";
    
    let successTitle = document.createElement("h3");
    successTitle.innerText = "🎉 Tebrikler! 🎉";
    successTitle.style.color = "#1976D2";
    successTitle.style.margin = "0 0 10px 0";
    successMessage.appendChild(successTitle);
    
    let successText = document.createElement("p");
    successText.innerText = "Tüm cümleleri doğru bir şekilde tamamladın! Artık Doğal Dil İşleme'yi daha iyi anlıyorsun!";
    successText.style.margin = "0";
    successText.style.color = "#1976D2"; // Başlık ile aynı renk olması için eklendi
    successMessage.appendChild(successText);
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      confettiContainer.remove();
      successMessage.remove();
    }, 3000);
  }

  // CSS animasyon için style ekleme
  let styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(styleSheet);

  // İlk cümleyi göster
  showWords();
}

function setupPlanet4Puzzle2() {
  puzzleHintText.innerText = "IPUCU: Kelimelerin anlamları arasındaki bağlantıları bul!";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "15px";
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme kutusu
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(156, 39, 176, 0.1)"; // Mor tema
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "15px";
  infoBox.style.border = "2px solid rgba(156, 39, 176, 0.3)";
  infoBox.style.width = "90%";
  infoBox.style.maxWidth = "700px";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  mainContainer.appendChild(infoBox);

  // Bilgilendirme başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "🔤 Kelimeler Arasındaki Bağlantılar";
  infoTitle.style.margin = "0 0 10px 0";
  infoTitle.style.color = "#7B1FA2";
  infoTitle.style.fontSize = "1.2em";
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni
  let infoText = document.createElement("p");
  infoText.innerHTML = "Yapay zeka, dildeki kelimeler arasındaki ilişkileri öğrenir. <strong>Eş anlamlı</strong> kelimeler benzer şeyleri ifade eder (büyük-kocaman gibi). <strong>Zıt anlamlı</strong> kelimeler ise birbirinin tersi anlamlara sahiptir (büyük-küçük gibi). Yapay zeka bu bağlantıları tanıyarak dili daha iyi anlar. Haydi şimdi bu bağlantıları bulalım!";
  infoText.style.margin = "0 0 10px 0";
  infoText.style.fontSize = "1em";
  infoText.style.lineHeight = "1.4";
  infoBox.appendChild(infoText);

  // Aşama göstergesi
  let phaseIndicator = document.createElement("div");
  phaseIndicator.style.display = "flex";
  phaseIndicator.style.justifyContent = "space-between";
  phaseIndicator.style.width = "90%";
  phaseIndicator.style.maxWidth = "700px";
  phaseIndicator.style.margin = "10px 0";
  mainContainer.appendChild(phaseIndicator);

  // Aşama 1 göstergesi
  let phase1 = document.createElement("div");
  phase1.id = "phase1-indicator";
  phase1.innerHTML = "Aşama 1: Eş Anlamlılar";
  phase1.style.padding = "8px 15px";
  phase1.style.backgroundColor = "#9C27B0";
  phase1.style.color = "white";
  phase1.style.borderRadius = "20px";
  phase1.style.fontWeight = "bold";
  phase1.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
  phaseIndicator.appendChild(phase1);

  // Aşama 2 göstergesi
  let phase2 = document.createElement("div");
  phase2.id = "phase2-indicator";
  phase2.innerHTML = "Aşama 2: Zıt Anlamlılar";
  phase2.style.padding = "8px 15px";
  phase2.style.backgroundColor = "rgba(156, 39, 176, 0.3)";
  phase2.style.color = "#7B1FA2";
  phase2.style.borderRadius = "20px";
  phase2.style.fontWeight = "bold";
  phaseIndicator.appendChild(phase2);

  // İlerleme çubuğu konteyner
  let progressContainer = document.createElement("div");
  progressContainer.style.width = "90%";
  progressContainer.style.maxWidth = "700px";
  progressContainer.style.height = "12px";
  progressContainer.style.backgroundColor = "rgba(156, 39, 176, 0.2)";
  progressContainer.style.borderRadius = "6px";
  progressContainer.style.overflow = "hidden";
  progressContainer.style.margin = "5px 0 15px 0";
  mainContainer.appendChild(progressContainer);

  // İlerleme çubuğu
  let progressBar = document.createElement("div");
  progressBar.id = "puzzle-progress";
  progressBar.style.width = "0%";
  progressBar.style.height = "100%";
  progressBar.style.backgroundColor = "#9C27B0";
  progressBar.style.transition = "width 0.5s ease";
  progressContainer.appendChild(progressBar);

  // Bulmaca konteyner
  let puzzleContainer = document.createElement("div");
  puzzleContainer.style.width = "90%";
  puzzleContainer.style.maxWidth = "700px";
  puzzleContainer.style.padding = "20px";
  puzzleContainer.style.backgroundColor = "rgba(156, 39, 176, 0.05)";
  puzzleContainer.style.borderRadius = "12px";
  puzzleContainer.style.border = "2px dashed #9C27B0";
  mainContainer.appendChild(puzzleContainer);

  // Bulmaca başlık
  let puzzleTitle = document.createElement("h3");
  puzzleTitle.id = "puzzle-title";
  puzzleTitle.innerHTML = "Eş Anlamlı Kelimeleri Eşleştir";
  puzzleTitle.style.color = "#7B1FA2";
  puzzleTitle.style.textAlign = "center";
  puzzleTitle.style.margin = "0 0 15px 0";
  puzzleContainer.appendChild(puzzleTitle);

  // Bulmaca açıklama
  let puzzleDescription = document.createElement("p");
  puzzleDescription.id = "puzzle-description";
  puzzleDescription.innerHTML = "Aşağıdaki kelimelerden aynı anlama gelen ikilileri eşleştir. İlk kelimeye tıkla, sonra eşini bul!";
  puzzleDescription.style.textAlign = "center";
  puzzleDescription.style.margin = "0 0 20px 0";
  puzzleContainer.appendChild(puzzleDescription);

  // Kelime havuzu konteyner
  let wordPoolContainer = document.createElement("div");
  wordPoolContainer.id = "word-pool";
  wordPoolContainer.style.display = "flex";
  wordPoolContainer.style.flexWrap = "wrap";
  wordPoolContainer.style.justifyContent = "center";
  wordPoolContainer.style.gap = "10px";
  wordPoolContainer.style.margin = "0 auto";
  puzzleContainer.appendChild(wordPoolContainer);

  // Eşleşme sayacı
  let matchCounter = document.createElement("div");
  matchCounter.id = "match-counter";
  matchCounter.innerHTML = "Eşleşmeler: 0/5";
  matchCounter.style.textAlign = "center";
  matchCounter.style.margin = "20px 0 0 0";
  matchCounter.style.fontWeight = "bold";
  matchCounter.style.color = "#7B1FA2";
  puzzleContainer.appendChild(matchCounter);

  // Kelime havuzları
  const synonymsPairs = [
    ["hızlı", "çabuk"],
    ["mutlu", "neşeli"],
    ["güzel", "hoş"],
    ["zeki", "akıllı"],
    ["büyük", "kocaman"]
  ];

  const antonymsPairs = [
    ["hızlı", "yavaş"],
    ["mutlu", "üzgün"],
    ["açık", "kapalı"],
    ["sıcak", "soğuk"],
    ["büyük", "küçük"]
  ];

  let currentPhase = 1;
  let currentPairs = synonymsPairs;
  let selectedWord = null;
  let matchedCount = 0;
  let selectedElement = null;

  // Kelimeleri havuza dağıt
  function setupWordPool() {
    // Havuzu temizle
    wordPoolContainer.innerHTML = "";
    
    // İlerleyiş numarasını sıfırla
    matchedCount = 0;
    document.getElementById("match-counter").innerHTML = `Eşleşmeler: 0/5`;
    document.getElementById("puzzle-progress").style.width = currentPhase === 1 ? "0%" : "50%";
    
    // Aşama göstergelerini güncelle
    if (currentPhase === 1) {
      document.getElementById("phase1-indicator").style.backgroundColor = "#9C27B0";
      document.getElementById("phase1-indicator").style.color = "white";
      document.getElementById("phase2-indicator").style.backgroundColor = "rgba(156, 39, 176, 0.3)";
      document.getElementById("phase2-indicator").style.color = "#7B1FA2";
      document.getElementById("puzzle-title").innerHTML = "Eş Anlamlı Kelimeleri Eşleştir";
      document.getElementById("puzzle-description").innerHTML = "Aşağıdaki kelimelerden aynı anlama gelen ikilileri eşleştir. İlk kelimeye tıkla, sonra eşini bul!";
    } else {
      document.getElementById("phase1-indicator").style.backgroundColor = "rgba(156, 39, 176, 0.3)";
      document.getElementById("phase1-indicator").style.color = "#7B1FA2";
      document.getElementById("phase2-indicator").style.backgroundColor = "#9C27B0";
      document.getElementById("phase2-indicator").style.color = "white";
      document.getElementById("puzzle-title").innerHTML = "Zıt Anlamlı Kelimeleri Eşleştir";
      document.getElementById("puzzle-description").innerHTML = "Aşağıdaki kelimelerden zıt anlama gelen ikilileri eşleştir. İlk kelimeye tıkla, sonra eşini bul!";
    }
    
    // Tüm kelimeleri bir diziye koy ve karıştır
    let allWords = [];
    currentPairs.forEach(pair => {
      allWords.push(pair[0]);
      allWords.push(pair[1]);
    });
    allWords = shuffleArray(allWords);
    
    // Karıştırılmış kelimeleri havuza ekle
    allWords.forEach(word => {
      let wordButton = document.createElement("div");
      wordButton.className = "word-button";
      wordButton.innerHTML = word;
      wordButton.dataset.word = word;
      wordButton.style.padding = "10px 15px";
      wordButton.style.backgroundColor = "white";
      wordButton.style.color = "#7B1FA2";
      wordButton.style.border = "2px solid #9C27B0";
      wordButton.style.borderRadius = "20px";
      wordButton.style.cursor = "pointer";
      wordButton.style.transition = "all 0.3s";
      wordButton.style.fontWeight = "500";
      wordButton.style.minWidth = "80px";
      wordButton.style.textAlign = "center";
      
      // Hover efekti
      wordButton.addEventListener("mouseover", () => {
        if (!wordButton.dataset.matched) {
          wordButton.style.transform = "translateY(-3px)";
          wordButton.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
        }
      });
      
      wordButton.addEventListener("mouseout", () => {
        if (!wordButton.dataset.matched) {
          wordButton.style.transform = "translateY(0)";
          wordButton.style.boxShadow = "none";
        }
      });
      
      // Tıklama olayı
      wordButton.addEventListener("click", () => {
        // Eğer kelime zaten eşleştirilmişse, işlem yapma
        if (wordButton.dataset.matched) return;
        
        // Daha önce bir kelime seçilmemişse
        if (!selectedWord) {
          // Bu kelimeyi seç
          selectedWord = word;
          selectedElement = wordButton;
          
          // Seçili kelimeyi vurgula
          wordButton.style.backgroundColor = "#CE93D8";
          wordButton.style.color = "white";
          wordButton.style.transform = "scale(1.05)";
        } 
        // Daha önce bir kelime seçilmişse ve farklı bir kelime tıklandıysa
        else if (wordButton !== selectedElement) {
          // Seçili kelimenin eşini bulduk mu kontrol et
          let isPair = false;
          
          currentPairs.forEach(pair => {
            if ((pair[0] === selectedWord && pair[1] === word) || 
                (pair[1] === selectedWord && pair[0] === word)) {
              isPair = true;
            }
          });
          
          if (isPair) {
            // Doğru eşleşme
        playCorrectSound();
            
            // İki kelimeyi de eşleşmiş olarak işaretle
            selectedElement.style.backgroundColor = "#4CAF50";
            selectedElement.style.borderColor = "#4CAF50";
            selectedElement.style.color = "white";
            selectedElement.style.transform = "scale(1)";
            selectedElement.style.pointerEvents = "none";
            selectedElement.dataset.matched = "true";
            
            wordButton.style.backgroundColor = "#4CAF50";
            wordButton.style.borderColor = "#4CAF50";
            wordButton.style.color = "white";
            wordButton.style.transform = "scale(1)";
            wordButton.style.pointerEvents = "none";
            wordButton.dataset.matched = "true";
            
            // Eşleşme sayacını artır
            matchedCount++;
            document.getElementById("match-counter").innerHTML = `Eşleşmeler: ${matchedCount}/5`;
            
            // İlerleme çubuğunu güncelle
            const progress = currentPhase === 1 ? 
              (matchedCount * 10) : // Aşama 1'de %0-%50 arası
              (50 + matchedCount * 10); // Aşama 2'de %50-%100 arası
            document.getElementById("puzzle-progress").style.width = `${progress}%`;
            
            // Seçimi sıfırla - BU SATIR EKSİKTİ
            selectedWord = null;
            selectedElement = null;
            
            // Tüm eşleşmeler tamamlandı mı?
            if (matchedCount === 5) {
              // Mini konfeti efekti
              addMiniConfetti();
              
              if (currentPhase === 1) {
                // Aşama 1 tamamlandı, 2 saniye sonra Aşama 2'ye geç
                setTimeout(() => {
                  currentPhase = 2;
                  currentPairs = antonymsPairs;
                  setupWordPool();
                  showMessage("Harika! Şimdi zıt anlamlı kelimeleri bulma zamanı!", "success");
                }, 2000);
              } else {
                // Aşama 2 de tamamlandı, kutlama ve sonraki bulmacaya geç
                addFullConfetti();
                setTimeout(() => {
                  showMessage("Tebrikler! Tüm eşleştirmeleri tamamladın!", "success");
        setTimeout(goNextPuzzle, 2000);
                }, 1500);
              }
            }
      } else {
            // Yanlış eşleşme
        playWrongSound();
            
            // İki kelimeyi de sallandır
            wordButton.style.animation = "shake 0.5s";
            selectedElement.style.animation = "shake 0.5s";
            
            setTimeout(() => {
              // Seçili kelimeyi normal hale getir
              selectedElement.style.backgroundColor = "white";
              selectedElement.style.color = "#7B1FA2";
              selectedElement.style.transform = "scale(1)";
              
              // Animasyonu sıfırla
              wordButton.style.animation = "";
              selectedElement.style.animation = "";
              
              // Seçimi temizle
              selectedWord = null;
              selectedElement = null;
            }, 500);
          }
        } else {
          // Aynı kelimeye tekrar tıklandı, seçimi iptal et
          wordButton.style.backgroundColor = "white";
          wordButton.style.color = "#7B1FA2";
          wordButton.style.transform = "scale(1)";
          selectedWord = null;
          selectedElement = null;
        }
      });
      
      wordPoolContainer.appendChild(wordButton);
    });
  }

  // Mini konfeti efekti (aşama tamamlandığında)
  function addMiniConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'absolute';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#9C27B0', '#BA68C8', '#E1BEE7', '#4CAF50', '#FFC107', '#FF9800'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.position = 'absolute';
      confetti.style.width = Math.random() * 8 + 5 + 'px';
      confetti.style.height = Math.random() * 5 + 5 + 'px';
      confetti.style.backgroundColor = color;
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = -20 + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '5px';
      confetti.style.opacity = Math.random() + 0.5;
      
      confettiContainer.appendChild(confetti);
      
      const animationDuration = Math.random() * 2 + 1;
      const xDistance = (Math.random() - 0.5) * 30;
      
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
        { transform: `translate(${xDistance}vw, 100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });
    }
    
    setTimeout(() => {
      confettiContainer.remove();
    }, 3000);
  }

  // Tam konfeti efekti (tüm bulmaca tamamlandığında)
  function addFullConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'absolute';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#9C27B0', '#BA68C8', '#E1BEE7', '#4CAF50', '#FFC107', '#FF9800'];
    
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.position = 'absolute';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 6 + 5 + 'px';
      confetti.style.backgroundColor = color;
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = -20 + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '5px';
      confetti.style.opacity = Math.random() + 0.5;
      
      confettiContainer.appendChild(confetti);
      
      const animationDuration = Math.random() * 3 + 2;
      const xDistance = (Math.random() - 0.5) * 40;
      
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
        { transform: `translate(${xDistance}vw, 100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });
    }
    
    // Başarı mesajı göster
    let successMessage = document.createElement("div");
    successMessage.style.position = "absolute";
    successMessage.style.top = "50%";
    successMessage.style.left = "50%";
    successMessage.style.transform = "translate(-50%, -50%)";
    successMessage.style.padding = "20px 30px";
    successMessage.style.backgroundColor = "rgba(255,255,255,0.9)";
    successMessage.style.borderRadius = "15px";
    successMessage.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
    successMessage.style.zIndex = "1001";
    successMessage.style.textAlign = "center";
    
    let successTitle = document.createElement("h3");
    successTitle.innerText = "🎉 Tebrikler! 🎉";
    successTitle.style.color = "#7B1FA2";
    successTitle.style.margin = "0 0 10px 0";
    successMessage.appendChild(successTitle);
    
    let successText = document.createElement("p");
    successText.innerText = "Hem eş anlamlı hem de zıt anlamlı kelimeleri başarıyla eşleştirdin!";
    successText.style.margin = "0";
successText.style.color = "#7B1FA2"; // Başlık ile aynı renk eklendi
    successMessage.appendChild(successText);
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      confettiContainer.remove();
      successMessage.remove();
    }, 3000);
  }

  // CSS animasyon için style ekleme
  let styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(styleSheet);

  // Kelime havuzunu başlat
  setupWordPool();
}

function setupPlanet4Puzzle3() {
  puzzleHintText.innerText = "IPUCU: Cümlelerin hangi duyguyu ifade ettiğini bul!";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "8px"; // Azaltılmış boşluk
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme kutusu - daha kompakt
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(255, 193, 7, 0.1)"; // Sarı tema
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "10px"; // Azaltılmış padding
  infoBox.style.border = "2px solid rgba(255, 193, 7, 0.3)";
  infoBox.style.width = "90%";
  infoBox.style.maxWidth = "700px";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  mainContainer.appendChild(infoBox);

  // Bilgilendirme başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "😀 Duygu Dedektifi 😢";
  infoTitle.style.margin = "0 0 8px 0";
  infoTitle.style.color = "#FF8F00";
  infoTitle.style.fontSize = "1.2em";
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni
  let infoText = document.createElement("p");
  infoText.innerHTML = "Yapay zeka, yazılı metinlerdeki <strong>duyguları</strong> anlayabilir! Buna <strong>duygu analizi</strong> denir. Sosyal medya yorumları, müşteri geri bildirimleri ve mesajların duygusunu otomatik olarak anlamak için kullanılır. Mesela 'Çok mutluyum!' cümlesinden bir insanın mutlu olduğunu anlayabilir. Haydi şimdi sen de bir duygu dedektifi ol ve cümlelerdeki duyguları bul!";
  infoText.style.margin = "0 0 5px 0";
  infoText.style.fontSize = "1em";
  infoText.style.lineHeight = "1.4";
  infoBox.appendChild(infoText);

  // İlerleme çubuğu konteyner
  let progressContainer = document.createElement("div");
  progressContainer.style.width = "90%";
  progressContainer.style.maxWidth = "700px";
  progressContainer.style.height = "12px";
  progressContainer.style.backgroundColor = "rgba(255, 193, 7, 0.2)";
  progressContainer.style.borderRadius = "6px";
  progressContainer.style.overflow = "hidden";
  progressContainer.style.margin = "5px 0"; // Azaltılmış margin
  mainContainer.appendChild(progressContainer);

  // İlerleme çubuğu
  let progressBar = document.createElement("div");
  progressBar.id = "emotion-progress";
  progressBar.style.width = "20%"; // İlk soru için %20
  progressBar.style.height = "100%";
  progressBar.style.backgroundColor = "#FFC107";
  progressBar.style.transition = "width 0.5s ease";
  progressContainer.appendChild(progressBar);

  // İlerleme metni
  let progressText = document.createElement("div");
  progressText.id = "progress-text";
  progressText.innerText = "Soru: 1/5";
  progressText.style.textAlign = "center";
  progressText.style.margin = "2px 0 8px 0"; // Azaltılmış margin
  progressText.style.fontWeight = "bold";
  progressText.style.color = "#FF8F00";
  mainContainer.appendChild(progressText);

  // Duygu dedektifi kartı - yukarı taşındı
  let emotionCard = document.createElement("div");
  emotionCard.style.width = "90%";
  emotionCard.style.maxWidth = "700px";
  emotionCard.style.padding = "20px";
  emotionCard.style.backgroundColor = "white";
  emotionCard.style.borderRadius = "12px";
  emotionCard.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
  emotionCard.style.display = "flex";
  emotionCard.style.flexDirection = "column";
  emotionCard.style.alignItems = "center";
  emotionCard.style.gap = "15px";
  emotionCard.style.position = "relative";
  emotionCard.style.overflow = "hidden";
  emotionCard.style.marginTop = "-10px"; // Negatif margin ile yukarı taşıma
  mainContainer.appendChild(emotionCard);

  // Kart üst kısmı
  let cardHeader = document.createElement("div");
  cardHeader.style.width = "100%";
  cardHeader.style.display = "flex";
  cardHeader.style.justifyContent = "center";
  cardHeader.style.padding = "10px 0";
  emotionCard.appendChild(cardHeader);

  // Duygu dedektifi karakter resmi
  let characterImg = document.createElement("div");
  characterImg.style.width = "120px";
  characterImg.style.height = "120px";
  characterImg.style.borderRadius = "50%";
  characterImg.style.backgroundColor = "#FFF9C4";
  characterImg.style.display = "flex";
  characterImg.style.justifyContent = "center";
  characterImg.style.alignItems = "center";
  characterImg.style.fontSize = "3.5em";
  characterImg.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  characterImg.innerHTML = "🕵️";
  cardHeader.appendChild(characterImg);

  // Cümle konteyneri
  let sentenceContainer = document.createElement("div");
  sentenceContainer.style.width = "90%";
  sentenceContainer.style.padding = "15px";
  sentenceContainer.style.backgroundColor = "#FFF8E1";
  sentenceContainer.style.borderRadius = "10px";
  sentenceContainer.style.border = "2px dashed #FFCC80";
  emotionCard.appendChild(sentenceContainer);

  // Cümle metni
  let sentenceText = document.createElement("p");
  sentenceText.id = "sentence-text";
  sentenceText.style.fontSize = "1.2em";
  sentenceText.style.fontWeight = "500";
  sentenceText.style.textAlign = "center";
  sentenceText.style.margin = "0";
  sentenceText.style.color = "#333";
  sentenceContainer.appendChild(sentenceText);

  // Soru metni
  let questionText = document.createElement("p");
  questionText.innerText = "Bu cümlede hangi duygu ifade ediliyor?";
  questionText.style.textAlign = "center";
  questionText.style.margin = "10px 0";
  questionText.style.fontSize = "1.1em";
  questionText.style.fontWeight = "bold";
  questionText.style.color = "#FF8F00";
  emotionCard.appendChild(questionText);

  // Duygu seçenekleri konteyner
  let emotionsContainer = document.createElement("div");
  emotionsContainer.style.display = "flex";
  emotionsContainer.style.flexWrap = "wrap";
  emotionsContainer.style.justifyContent = "center";
  emotionsContainer.style.gap = "15px";
  emotionsContainer.style.marginTop = "10px";
  emotionCard.appendChild(emotionsContainer);

  // Cümle ve duygu verileri
  const emotionQuestions = [
    {
      sentence: "Ali'nin doğum günü partisinde bütün arkadaşları ona sürpriz yaptı!",
      emotion: "mutlu",
      emoji: "😀"
    },
    {
      sentence: "Minik kuş, kanadı incindiği için uçamıyordu.",
      emotion: "üzgün",
      emoji: "😢"
    },
    {
      sentence: "Boya kalemleri kırıldığında Ayşe yumruklarını sıktı ve kaşlarını çattı.",
      emotion: "kızgın",
      emoji: "😠"
    },
    {
      sentence: "Aniden Ahmet'in karşısında kocaman bir dinozor beliriverince gözleri fal taşı gibi açıldı!",
      emotion: "şaşkın",
      emoji: "😲"
    },
    {
      sentence: "Yarın ilk kez lunaparka gideceği için Zeynep bütün gece uyuyamadı.",
      emotion: "heyecanlı",
      emoji: "🤩"
    }
  ];

  // Soruları karıştır
  const shuffledQuestions = shuffleArray([...emotionQuestions]);

  // Duygu seçenekleri - sırası sabit kalacak
  const emotions = [
    { text: "Mutlu", emoji: "😀", value: "mutlu" },
    { text: "Üzgün", emoji: "😢", value: "üzgün" },
    { text: "Kızgın", emoji: "😠", value: "kızgın" },
    { text: "Şaşkın", emoji: "😲", value: "şaşkın" },
    { text: "Heyecanlı", emoji: "🤩", value: "heyecanlı" }
  ];

  // Değişkenler
  let currentQuestionIndex = 0;
  let correctAnswers = 0;

  // Duygu seçeneklerini oluştur
  function createEmotionOptions() {
    // Konteynerı temizle
    emotionsContainer.innerHTML = "";
    
    // Her duygu için bir buton oluştur
    emotions.forEach(emotion => {
      let emotionButton = document.createElement("button");
      emotionButton.className = "emotion-option";
      emotionButton.dataset.emotion = emotion.value;
      
      emotionButton.style.display = "flex";
      emotionButton.style.flexDirection = "column";
      emotionButton.style.alignItems = "center";
      emotionButton.style.padding = "10px 15px";
      emotionButton.style.backgroundColor = "white";
      emotionButton.style.border = "2px solid #FFCC80";
      emotionButton.style.borderRadius = "10px";
      emotionButton.style.cursor = "pointer";
      emotionButton.style.transition = "all 0.3s";
      emotionButton.style.minWidth = "80px";
      
      // Emoji
      let emojiSpan = document.createElement("span");
      emojiSpan.style.fontSize = "2em";
      emojiSpan.style.marginBottom = "5px";
      emojiSpan.innerText = emotion.emoji;
      emotionButton.appendChild(emojiSpan);
      
      // Duygu metni
      let textSpan = document.createElement("span");
      textSpan.innerText = emotion.text;
      textSpan.style.fontWeight = "bold";
      emotionButton.appendChild(textSpan);
      
      // Hover efekti
      emotionButton.addEventListener("mouseover", () => {
        emotionButton.style.transform = "translateY(-5px)";
        emotionButton.style.boxShadow = "0 5px 15px rgba(255, 193, 7, 0.3)";
      });
      
      emotionButton.addEventListener("mouseout", () => {
        emotionButton.style.transform = "translateY(0)";
        emotionButton.style.boxShadow = "none";
      });
      
      // Tıklama olayı
      emotionButton.addEventListener("click", () => {
        // Tüm butonları devre dışı bırak
        document.querySelectorAll(".emotion-option").forEach(btn => {
          btn.disabled = true;
          btn.style.cursor = "default";
          btn.style.opacity = "0.7";
        });
        
        // Doğru cevabı kontrol et
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const isCorrect = emotion.value === currentQuestion.emotion;
        
        if (isCorrect) {
          // Doğru cevap
      playCorrectSound();
          correctAnswers++;
          
          // Butonun stilini güncelle
          emotionButton.style.backgroundColor = "#4CAF50";
          emotionButton.style.borderColor = "#4CAF50";
          emotionButton.style.color = "white";
          emotionButton.style.opacity = "1";
          
          // Geri bildirim
          let feedbackContainer = document.createElement("div");
          feedbackContainer.style.position = "absolute";
          feedbackContainer.style.bottom = "0";
          feedbackContainer.style.left = "0";
          feedbackContainer.style.width = "100%";
          feedbackContainer.style.padding = "15px";
          feedbackContainer.style.backgroundColor = "rgba(76, 175, 80, 0.9)";
          feedbackContainer.style.color = "white";
          feedbackContainer.style.textAlign = "center";
          feedbackContainer.style.transform = "translateY(100%)";
          feedbackContainer.style.animation = "slideUp 0.5s forwards";
          feedbackContainer.innerHTML = `<strong>Doğru!</strong> Bu cümlede ${emotion.text.toLowerCase()} duygusu var.`;
          emotionCard.appendChild(feedbackContainer);
          
          // Mini konfeti
          addSmallConfetti();
          
          // Sonraki soruya geç
          setTimeout(() => {
            feedbackContainer.remove();
            goToNextQuestion();
          }, 2000);
    } else {
          // Yanlış cevap
      playWrongSound();
          
          // Butonun stilini güncelle
          emotionButton.style.backgroundColor = "#F44336";
          emotionButton.style.borderColor = "#F44336";
          emotionButton.style.color = "white";
          emotionButton.style.opacity = "1";
          
          // Doğru cevabı göster
          const correctButton = document.querySelector(`.emotion-option[data-emotion="${currentQuestion.emotion}"]`);
          correctButton.style.backgroundColor = "#4CAF50";
          correctButton.style.borderColor = "#4CAF50";
          correctButton.style.color = "white";
          correctButton.style.opacity = "1";
          
          // Geri bildirim
          let feedbackContainer = document.createElement("div");
          feedbackContainer.style.position = "absolute";
          feedbackContainer.style.bottom = "0";
          feedbackContainer.style.left = "0";
          feedbackContainer.style.width = "100%";
          feedbackContainer.style.padding = "15px";
          feedbackContainer.style.backgroundColor = "rgba(244, 67, 54, 0.9)";
          feedbackContainer.style.color = "white";
          feedbackContainer.style.textAlign = "center";
          feedbackContainer.style.transform = "translateY(100%)";
          feedbackContainer.style.animation = "slideUp 0.5s forwards";
          
          // Doğru duyguyu bul
          const correctEmotion = emotions.find(e => e.value === currentQuestion.emotion);
          feedbackContainer.innerHTML = `<strong>Yanlış.</strong> Bu cümlede ${correctEmotion.text.toLowerCase()} duygusu var.`;
          emotionCard.appendChild(feedbackContainer);
          
          // Sonraki soruya geç
          setTimeout(() => {
            feedbackContainer.remove();
            goToNextQuestion();
          }, 3000);
        }
      });
      
      emotionsContainer.appendChild(emotionButton);
    });
  }

  // Soru yükleme fonksiyonu
  function loadQuestion() {
    // İlerleme bilgisini güncelle
    document.getElementById("emotion-progress").style.width = `${(currentQuestionIndex + 1) * 20}%`; 
    document.getElementById("progress-text").innerText = `Soru: ${currentQuestionIndex + 1}/5`;
    
    // Cümleyi yükle
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    document.getElementById("sentence-text").innerText = `"${currentQuestion.sentence}"`;
    
    // Dedektif emojisi sabit kalsın
    characterImg.innerHTML = "🕵️";
    
    // Duygu seçeneklerini oluştur
    createEmotionOptions();
  }

  // Sonraki soruya geçme fonksiyonu
  function goToNextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < shuffledQuestions.length) {
      // Sonraki soruyu yükle
      loadQuestion();
    } else {
      // Tüm sorular tamamlandı
      showFinalResults();
    }
  }

  // Final sonuçlarını gösterme
  function showFinalResults() {
    // Kart içeriğini temizle
    emotionCard.innerHTML = "";
    
    // Sonuç görseli
    let resultImage = document.createElement("div");
    resultImage.style.fontSize = "4em";
    resultImage.style.margin = "20px 0";
    resultImage.innerHTML = correctAnswers >= 4 ? "🏆" : "🎓";
    emotionCard.appendChild(resultImage);
    
    // Başlık
    let resultTitle = document.createElement("h3");
    resultTitle.innerText = correctAnswers >= 4 
      ? "Harika İş, Duygu Dedektifi!" 
      : "İyi İş, Çırak Dedektif!";
    resultTitle.style.color = "#FF8F00";
    resultTitle.style.margin = "10px 0";
    emotionCard.appendChild(resultTitle);
    
    // Sonuç metni
    let resultText = document.createElement("p");
    resultText.innerHTML = `5 sorudan <strong>${correctAnswers}</strong> tanesini doğru cevapladın!`;
    resultText.style.textAlign = "center";
    resultText.style.margin = "10px 0";
    resultText.style.color = "#FF8F00"; // Başlık ile aynı renk
    emotionCard.appendChild(resultText);
    
    // Açıklama
    let explanation = document.createElement("p");
    explanation.innerHTML = correctAnswers >= 4 
      ? "Sen bir duygu uzmanısın! Yapay zeka gibi metinlerdeki duyguları harika anlıyorsun." 
      : "İyi iş çıkardın! Biraz daha pratikle metinlerdeki duyguları anlama konusunda daha da iyi olacaksın.";
    explanation.style.textAlign = "center";
    explanation.style.fontSize = "0.9em";
    explanation.style.margin = "10px 0 20px 0";
    explanation.style.color = "#FF8F00"; // Başlık ile aynı renk
    emotionCard.appendChild(explanation);
    
    // İlerleme butonu
    let nextButton = document.createElement("button");
    nextButton.innerText = "Bir Sonraki Bulmaca";
    nextButton.style.padding = "10px 20px";
    nextButton.style.backgroundColor = "#FFC107";
    nextButton.style.color = "#333";
    nextButton.style.border = "none";
    nextButton.style.borderRadius = "30px";
    nextButton.style.fontWeight = "bold";
    nextButton.style.cursor = "pointer";
    nextButton.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    nextButton.style.margin = "10px 0";
    
    nextButton.addEventListener("click", () => {
      // Tam boy konfeti efekti ve sonraki bulmacaya geç
      addFullConfetti();
      setTimeout(goNextPuzzle, 2000);
    });
    
    emotionCard.appendChild(nextButton);
    
    // Mini konfeti efekti
    addSmallConfetti();
  }

  // Küçük konfeti efekti
  function addSmallConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'absolute';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#FFC107', '#FFEB3B', '#FF9800', '#4CAF50', '#2196F3'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.position = 'absolute';
      confetti.style.width = Math.random() * 8 + 5 + 'px';
      confetti.style.height = Math.random() * 5 + 5 + 'px';
      confetti.style.backgroundColor = color;
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = -20 + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '5px';
      confetti.style.opacity = Math.random() + 0.5;
      
      confettiContainer.appendChild(confetti);
      
      const animationDuration = Math.random() * 2 + 1;
      const xDistance = (Math.random() - 0.5) * 30;
      
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
        { transform: `translate(${xDistance}vw, 100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });
    }
    
    setTimeout(() => {
      confettiContainer.remove();
    }, 3000);
  }

  // Tam boy konfeti efekti
  function addFullConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'absolute';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#FFC107', '#FFEB3B', '#FF9800', '#4CAF50', '#2196F3'];
    
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.position = 'absolute';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 6 + 5 + 'px';
      confetti.style.backgroundColor = color;
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = -20 + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '5px';
      confetti.style.opacity = Math.random() + 0.5;
      
      confettiContainer.appendChild(confetti);
      
      const animationDuration = Math.random() * 3 + 2;
      const xDistance = (Math.random() - 0.5) * 40;
      
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
        { transform: `translate(${xDistance}vw, 100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });
    }
    
    setTimeout(() => {
      confettiContainer.remove();
    }, 3000);
  }

  // Animasyon için CSS ekle
  let styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleSheet);

  // İlk soruyu yükle
  loadQuestion();
}

function setupPlanet4Puzzle4() {
  puzzleHintText.innerText = "IPUCU: Hikayeyi en mantıklı şekilde tamamla!";

  // Ana konteyner - gap azaltıldı
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "8px"; // 15px'ten azaltıldı
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme kutusu - padding azaltıldı
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(75, 192, 192, 0.1)"; // Turkuaz tema
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "10px"; // 15px'ten azaltıldı
  infoBox.style.border = "2px solid rgba(75, 192, 192, 0.3)";
  infoBox.style.width = "90%";
  infoBox.style.maxWidth = "700px";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  mainContainer.appendChild(infoBox);

  // Bilgilendirme başlığı - margin azaltıldı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "📚 Hikaye Tamamlayıcı 🤖";
  infoTitle.style.margin = "0 0 5px 0"; // 10px'ten azaltıldı
  infoTitle.style.color = "#2A9D8F";
  infoTitle.style.fontSize = "1.2em";
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni - margin azaltıldı
  let infoText = document.createElement("p");
  infoText.innerHTML = "Yapay zeka, <strong>yarım kalmış hikayeleri tamamlayabilir</strong>! Buna <strong>metin tamamlama</strong> denir. Yapay zeka önceki cümlelerden sonra ne gelebileceğini tahmin eder. Yazarlar, öğrenciler ve oyun geliştiriciler bu teknolojiyi kullanır. Şimdi sen de bir AI gibi en mantıklı hikaye devamını seç ve hikayeyi tamamla!";
  infoText.style.margin = "0 0 5px 0"; // 10px'ten azaltıldı
  infoText.style.fontSize = "1em";
  infoText.style.lineHeight = "1.4";
  infoBox.appendChild(infoText);

  // İlerleme çubuğu konteyner - margin azaltıldı
  let progressContainer = document.createElement("div");
  progressContainer.style.width = "90%";
  progressContainer.style.maxWidth = "700px";
  progressContainer.style.height = "12px";
  progressContainer.style.backgroundColor = "rgba(75, 192, 192, 0.2)";
  progressContainer.style.borderRadius = "6px";
  progressContainer.style.overflow = "hidden";
  progressContainer.style.margin = "5px 0"; // 10px'ten azaltıldı
  mainContainer.appendChild(progressContainer);

  // İlerleme çubuğu
  let progressBar = document.createElement("div");
  progressBar.id = "story-progress";
  progressBar.style.width = "0%"; 
  progressBar.style.height = "100%";
  progressBar.style.backgroundColor = "#2A9D8F";
  progressBar.style.transition = "width 0.5s ease";
  progressContainer.appendChild(progressBar);

  // İlerleme metni - margin azaltıldı
  let progressText = document.createElement("div");
  progressText.id = "progress-text";
  progressText.innerText = "Hikaye Bölümü: 1/4";
  progressText.style.textAlign = "center";
  progressText.style.margin = "2px 0 8px 0"; // 5px 0 15px 0'dan azaltıldı
  progressText.style.fontWeight = "bold";
  progressText.style.color = "#2A9D8F";
  mainContainer.appendChild(progressText);

  // Hikaye kartı - yukarı taşındı
  let storyCard = document.createElement("div");
  storyCard.style.width = "90%";
  storyCard.style.maxWidth = "700px";
  storyCard.style.padding = "20px";
  storyCard.style.backgroundColor = "white";
  storyCard.style.borderRadius = "12px";
  storyCard.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
  storyCard.style.display = "flex";
  storyCard.style.flexDirection = "column";
  storyCard.style.alignItems = "center";
  storyCard.style.gap = "20px";
  storyCard.style.position = "relative";
  storyCard.style.marginTop = "-10px"; // Negatif margin ile yukarı taşıma
  mainContainer.appendChild(storyCard);

  // Hikaye resmi konteyner - height azaltıldı
  let imageContainer = document.createElement("div");
  imageContainer.style.width = "100%";
  imageContainer.style.height = "180px"; // 200px'ten azaltıldı
  imageContainer.style.borderRadius = "8px";
  imageContainer.style.overflow = "hidden";
  imageContainer.style.backgroundColor = "#E9F5F5";
  imageContainer.style.display = "flex";
  imageContainer.style.justifyContent = "center";
  imageContainer.style.alignItems = "center";
  storyCard.appendChild(imageContainer);

  // Hikaye resmi
  let storyImage = document.createElement("div");
  storyImage.id = "story-image";
  storyImage.style.width = "150px";
  storyImage.style.height = "150px";
  storyImage.style.display = "flex";
  storyImage.style.justifyContent = "center";
  storyImage.style.alignItems = "center";
  storyImage.style.fontSize = "5em";
  storyImage.style.transition = "transform 0.3s ease";
  storyImage.innerHTML = "🤖"; // Başlangıç emojisi
  imageContainer.appendChild(storyImage);

  // Hikaye metni konteyner
  let storyTextContainer = document.createElement("div");
  storyTextContainer.style.width = "100%";
  storyTextContainer.style.padding = "15px";
  storyTextContainer.style.backgroundColor = "#F0FFF0";
  storyTextContainer.style.borderRadius = "10px";
  storyTextContainer.style.border = "2px dashed #2A9D8F";
  storyCard.appendChild(storyTextContainer);

  // Hikaye metni
  let storyText = document.createElement("p");
  storyText.id = "story-text";
  storyText.style.fontSize = "1.2em";
  storyText.style.fontWeight = "500";
  storyText.style.margin = "0";
  storyText.style.lineHeight = "1.5";
  storyText.style.color = "#333";
  storyTextContainer.appendChild(storyText);

  // Seçenekler konteyner
  let optionsContainer = document.createElement("div");
  optionsContainer.style.width = "100%";
  optionsContainer.style.display = "flex";
  optionsContainer.style.flexDirection = "column";
  optionsContainer.style.gap = "10px";
  optionsContainer.style.marginTop = "10px";
  storyCard.appendChild(optionsContainer);

  // Hikaye bölümleri ve seçenekleri
  const storyParts = [
    {
      text: "Bir gün Mini Robot adında küçük bir robot, kendini bir macera parkında buldu. Mini Robot etrafına bakındı ve...",
      options: [
        {
          text: "Korktu ve hemen saklanmaya çalıştı.",
          correct: false,
          feedback: "Mini Robot korkmadı çünkü robotlar korkmaz! Tekrar dene."
        },
        {
          text: "Hemen eve dönmek için yolu aramaya başladı.",
          correct: false,
          feedback: "Mini Robot henüz eve dönmek istemedi, macera yaşamak istiyordu! Tekrar dene."
        },
        {
          text: "Çok heyecanlandı ve bütün oyuncakları denemek istedi.",
          correct: true,
          nextEmoji: "🎢"
        }
      ]
    },
    {
      text: "Mini Robot çok heyecanlandı ve bütün oyuncakları denemek istedi. İlk önce bir dönme dolaba bindi. Yükseğe çıktığında etrafı izlerken...",
      options: [
        {
          text: "Parkın diğer ucunda parlayan ilginç bir ışık gördü.",
          correct: true,
          nextEmoji: "✨"
        },
        {
          text: "Gözlerini kapattı çünkü yükseklikten korkuyordu.",
          correct: false,
          feedback: "Mini Robot yükseklikten korkmuyordu, çünkü o bir robot! Tekrar dene."
        },
        {
          text: "Sıkıldı ve hemen inmek istedi.",
          correct: false,
          feedback: "Mini Robot macerayı çok seviyordu, sıkılmadı. Tekrar dene."
        }
      ]
    },
    {
      text: "Mini Robot parkın diğer ucunda parlayan ilginç bir ışık gördü. Dönme dolaptan inince hemen o ışığa doğru koşmaya başladı. Işığa yaklaştığında...",
      options: [
        {
          text: "Bunun bir tuzak olduğunu anladı ve kaçtı.",
          correct: false,
          feedback: "Mini Robot o kadar da korkak değildi! Tekrar dene."
        },
        {
          text: "Işığın aslında konuşan bir robot köpek olduğunu gördü.",
          correct: true,
          nextEmoji: "🐶"
        },
        {
          text: "Işığın sadece bir sokak lambası olduğunu fark etti.",
          correct: false,
          feedback: "Bu seçenek sıkıcı olurdu, hikaye daha heyecanlı! Tekrar dene."
        }
      ]
    },
    {
      text: "Mini Robot ışığın aslında konuşan bir robot köpek olduğunu gördü. Köpek parlak gözleriyle ona bakıp 'Merhaba, benim adım Flaş! Arkadaş olmak ister misin?' dedi. Mini Robot...",
      options: [
        {
          text: "Korkup kaçmaya başladı.",
          correct: false,
          feedback: "Mini Robot arkadaşlıktan kaçmazdı! Tekrar dene."
        },
        {
          text: "Köpek ile arkadaş olmayı reddetti.",
          correct: false,
          feedback: "Mini Robot arkadaşlığa her zaman açıktı! Tekrar dene."
        },
        {
          text: "Çok mutlu oldu ve 'Evet, en iyi arkadaşlar olalım!' dedi.",
          correct: true,
          nextEmoji: "❤️"
        }
      ]
    }
  ];

  // Sonuç mesajı
  const finalStoryText = "Mini Robot ve Flaş, parkta tüm gün birlikte oynadılar. Kaydıraklardan kaydılar, salıncaklarda sallandılar ve birbirlerine maceralarını anlattılar. Güneş batarken, Mini Robot yeni arkadaşı Flaş ile birlikte evlerine doğru yürüdüler. Bu, onların harika dostluklarının sadece başlangıcıydı. Ve o günden sonra, her hafta sonu buluşup yeni maceralar yaşamaya devam ettiler.";

  // Hikaye durumu
  let currentStoryPart = 0;

  // İlk hikaye bölümünü yükle
  loadStoryPart(currentStoryPart);

  // Hikaye bölümünü yükle
  function loadStoryPart(index) {
    // İlerleme çubuğunu güncelle
    progressBar.style.width = `${(index / 4) * 100}%`;
    progressText.innerText = `Hikaye Bölümü: ${index + 1}/4`;
    
    // Hikaye metnini güncelle
    storyText.innerText = storyParts[index].text;
    
    // Seçenekleri temizle
    optionsContainer.innerHTML = "";
    
    // Yeni seçenekleri oluştur
    storyParts[index].options.forEach((option, i) => {
      let optionButton = document.createElement("button");
      optionButton.className = "story-option";
      optionButton.innerText = option.text;
      optionButton.style.padding = "12px 15px";
      optionButton.style.backgroundColor = "#E9F5F5";
      optionButton.style.border = "2px solid #2A9D8F";
      optionButton.style.borderRadius = "8px";
      optionButton.style.fontSize = "1em";
      optionButton.style.cursor = "pointer";
      optionButton.style.transition = "transform 0.2s ease, background-color 0.2s ease";
      
      // Hover efekti
      optionButton.onmouseover = function() {
        this.style.backgroundColor = "#D0E8E8";
        this.style.transform = "translateY(-2px)";
      };
      
      optionButton.onmouseout = function() {
        this.style.backgroundColor = "#E9F5F5";
        this.style.transform = "translateY(0)";
      };
      
      optionButton.onclick = function() {
        if (option.correct) {
          // Doğru seçenek
          playCorrectSound();
          optionButton.style.backgroundColor = "#A7E9AF";
          optionButton.style.borderColor = "#2A9D8F";
          
          // Emoji güncelleme
          storyImage.innerHTML = option.nextEmoji;
          storyImage.style.transform = "scale(1.2)";
          setTimeout(() => {
            storyImage.style.transform = "scale(1)";
          }, 300);
          
          // Sonraki bölüm veya sonuç
          setTimeout(() => {
            currentStoryPart++;
            if (currentStoryPart < storyParts.length) {
              loadStoryPart(currentStoryPart);
            } else {
              // Hikaye tamamlandı
              showFinalStory();
            }
          }, 1000);
        } else {
          // Yanlış seçenek
      playWrongSound();
          optionButton.style.backgroundColor = "#FFB3B3";
          optionButton.style.borderColor = "#FF6B6B";
          
          // Geri bildirim göster
          showMessage(option.feedback, "error");
          setTimeout(clearMessage, 2000);
          
          // Butonu salla
          optionButton.style.transform = "translateX(5px)";
      setTimeout(() => {
            optionButton.style.transform = "translateX(-5px)";
            setTimeout(() => {
              optionButton.style.transform = "translateX(0)";
            }, 100);
          }, 100);
        }
      };
      
      optionsContainer.appendChild(optionButton);
    });
  }

  // Final hikayesini göster
  function showFinalStory() {
    // İlerleme çubuğunu tam yap
    progressBar.style.width = "100%";
    progressText.innerText = "Hikaye Tamamlandı!";
    
    // Seçenekleri kaldır
    optionsContainer.innerHTML = "";
    
    // Final hikayesini göster
    storyText.innerText = finalStoryText;
    
    // Konfeti efekti
    addConfetti();
    
    // Bitiş butonunu ekle
    let finishButton = document.createElement("button");
    finishButton.innerText = "Harika! Sonraki Bulmacaya Geç";
    finishButton.style.padding = "15px 25px";
    finishButton.style.marginTop = "20px";
    finishButton.style.fontSize = "1.1em";
    finishButton.style.backgroundColor = "#2A9D8F";
    finishButton.style.color = "white";
    finishButton.style.border = "none";
    finishButton.style.borderRadius = "8px";
    finishButton.style.cursor = "pointer";
    finishButton.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    finishButton.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
    
    finishButton.onmouseover = function() {
      this.style.transform = "translateY(-3px)";
      this.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
    };
    
    finishButton.onmouseout = function() {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    };
    
    finishButton.onclick = function() {
      goNextPuzzle();
    };
    
    optionsContainer.appendChild(finishButton);
  }

  // Konfeti efekti
  function addConfetti() {
    for (let i = 0; i < 100; i++) {
      let confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.position = "absolute";
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = Math.random() * 10 + 5 + "px";
      confetti.style.backgroundColor = [
        "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51", "#A8DADC"
      ][Math.floor(Math.random() * 5)];
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = -20 + "px";
      confetti.style.opacity = Math.random() + 0.5;
      confetti.style.zIndex = "10";
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.transition = `top ${Math.random() * 3 + 2}s ease, left ${Math.random() * 3 + 2}s ease, opacity ${Math.random() * 3 + 2}s ease`;
      storyCard.appendChild(confetti);

      setTimeout(() => {
        confetti.style.top = "120%";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.opacity = "0";
      }, 100);

      setTimeout(() => {
        storyCard.removeChild(confetti);
      }, 5000);
    }
  }
}

function setupPlanet4Puzzle5() {
  puzzleHintText.innerText = "IPUCU: Emoji dizilerinin mesajlarını çöz!";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "15px";
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme kutusu
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(147, 112, 219, 0.1)"; // Mor tema
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "15px";
  infoBox.style.border = "2px solid rgba(147, 112, 219, 0.3)";
  infoBox.style.width = "90%";
  infoBox.style.maxWidth = "700px";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  mainContainer.appendChild(infoBox);

  // Bilgilendirme başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "🔎 Mesaj Çözücü 💬";
  infoTitle.style.margin = "0 0 10px 0";
  infoTitle.style.color = "#7B68EE";
  infoTitle.style.fontSize = "1.2em";
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni
  let infoText = document.createElement("p");
  infoText.innerHTML = "Yapay zeka <strong>semboller ve emojiler</strong> arasındaki ilişkileri anlayabilir! İnsanların duygularını ve mesajlarını ifade etmek için kullandıkları emojilerin anlamlarını öğrenerek <strong>sembolik dili</strong> çözebilir. Bu yetenek, dijital iletişimde çok önemlidir. Şimdi sen de bir yapay zeka gibi emoji dizilerinin gizli mesajlarını çözmeye çalış!";
  infoText.style.margin = "0 0 10px 0";
  infoText.style.fontSize = "1em";
  infoText.style.lineHeight = "1.4";
  infoBox.appendChild(infoText);

  // İlerleme çubuğu konteyner
  let progressContainer = document.createElement("div");
  progressContainer.style.width = "90%";
  progressContainer.style.maxWidth = "700px";
  progressContainer.style.height = "12px";
  progressContainer.style.backgroundColor = "rgba(147, 112, 219, 0.2)";
  progressContainer.style.borderRadius = "6px";
  progressContainer.style.overflow = "hidden";
  progressContainer.style.margin = "10px 0";
  mainContainer.appendChild(progressContainer);

  // İlerleme çubuğu
  let progressBar = document.createElement("div");
  progressBar.id = "emoji-progress";
  progressBar.style.width = "0%"; 
  progressBar.style.height = "100%";
  progressBar.style.backgroundColor = "#9370DB";
  progressBar.style.transition = "width 0.5s ease";
  progressContainer.appendChild(progressBar);

  // İlerleme metni
  let progressText = document.createElement("div");
  progressText.id = "progress-text";
  progressText.innerText = "Mesaj: 1/5";
  progressText.style.textAlign = "center";
  progressText.style.margin = "5px 0 15px 0";
  progressText.style.fontWeight = "bold";
  progressText.style.color = "#7B68EE";
  mainContainer.appendChild(progressText);

  // Mesaj kartı - daha yukarı taşındı
  let messageCard = document.createElement("div");
  messageCard.style.width = "90%";
  messageCard.style.maxWidth = "700px";
  messageCard.style.padding = "20px";
  messageCard.style.backgroundColor = "white";
  messageCard.style.borderRadius = "12px";
  messageCard.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
  messageCard.style.display = "flex";
  messageCard.style.flexDirection = "column";
  messageCard.style.alignItems = "center";
  messageCard.style.gap = "20px";
  messageCard.style.position = "relative";
  messageCard.style.marginTop = "-50px"; // Daha yukarı taşındı (-20px'ten -50px'e)
  mainContainer.appendChild(messageCard);

  // Emoji mesaj konteyner
  let emojiContainer = document.createElement("div");
  emojiContainer.style.width = "90%";
  emojiContainer.style.padding = "15px";
  emojiContainer.style.backgroundColor = "#F8F0FF";
  emojiContainer.style.borderRadius = "10px";
  emojiContainer.style.border = "2px dashed #B19CD9";
  emojiContainer.style.display = "flex";
  emojiContainer.style.justifyContent = "center";
  emojiContainer.style.alignItems = "center";
  emojiContainer.style.marginTop = "10px"; // Robot yerine eklenen margin
  messageCard.appendChild(emojiContainer);

  // Emoji mesaj metni
  let emojiText = document.createElement("p");
  emojiText.id = "emoji-text";
  emojiText.style.fontSize = "2em";
  emojiText.style.fontWeight = "500";
  emojiText.style.textAlign = "center";
  emojiText.style.margin = "0";
  emojiText.style.color = "#333";
  emojiText.style.letterSpacing = "5px";
  emojiContainer.appendChild(emojiText);

  // Soru metni
  let questionText = document.createElement("p");
  questionText.innerText = "Bu emoji dizisi hangi mesajı ifade ediyor?";
  questionText.style.textAlign = "center";
  questionText.style.margin = "10px 0";
  questionText.style.fontSize = "1.1em";
  questionText.style.fontWeight = "bold";
  questionText.style.color = "#7B68EE";
  messageCard.appendChild(questionText);

  // Cevap konteyner
  let answerContainer = document.createElement("div");
  answerContainer.style.width = "100%";
  answerContainer.style.display = "flex";
  answerContainer.style.flexDirection = "column";
  answerContainer.style.gap = "10px";
  messageCard.appendChild(answerContainer);

  // Cevap seçenekleri konteyner
  let optionsContainer = document.createElement("div");
  optionsContainer.style.width = "100%";
  optionsContainer.style.display = "flex";
  optionsContainer.style.flexDirection = "column";
  optionsContainer.style.gap = "10px";
  answerContainer.appendChild(optionsContainer);

  // Emoji mesajları ve cevapları
  const emojiMessages = [
    {
      emojis: "🌞👋🌱",
      options: [
        "Çiçekleri suladım",
        "Güneşli bir gün başlıyor",
        "Bahçede çalışıyorum",
        "Günaydın dünya"
      ],
      correctIndex: 3,
      hint: "Sabah selamlaşması"
    },
    {
      emojis: "🏫📚🧒",
      options: [
        "Kitap okuyorum",
        "Okula gidiyorum",
        "Öğretmenimle konuştum",
        "Kütüphaneye gittim"
      ],
      correctIndex: 1,
      hint: "Eğitim zamanı"
    },
    {
      emojis: "🍕🍦🎂🎈",
      options: [
        "Doğum günü partisi",
        "Pikniğe gidiyorum",
        "Markette alışveriş yaptım",
        "Akşam yemeğini hazırladım"
      ],
      correctIndex: 0,
      hint: "Özel bir kutlama"
    },
    {
      emojis: "🌙⭐😴",
      options: [
        "Gökyüzünü izliyorum",
        "Kamp yapıyorum",
        "İyi geceler",
        "Uzayı keşfediyorum"
      ],
      correctIndex: 2,
      hint: "Uyku vakti geldi"
    },
    {
      emojis: "🎮🏆👍",
      options: [
        "Oyun turnuvası başladı",
        "Arkadaşlarımla buluştum",
        "Bilgisayarımı tamir ettim",
        "Oyunda kazandım"
      ],
      correctIndex: 3,
      hint: "Başarılı bir oyun deneyimi"
    }
  ];

  // İpucu buton
  let hintButton = document.createElement("button");
  hintButton.innerText = "İpucu Al";
  hintButton.style.padding = "8px 15px";
  hintButton.style.backgroundColor = "#F3E5FF";
  hintButton.style.border = "2px solid #9370DB";
  hintButton.style.borderRadius = "8px";
  hintButton.style.fontSize = "0.9em";
  hintButton.style.cursor = "pointer";
  hintButton.style.alignSelf = "center";
  hintButton.style.marginTop = "10px";
  hintButton.style.transition = "transform 0.2s ease, background-color 0.2s ease";
  answerContainer.appendChild(hintButton);

  // Değişkenler
  let currentMessageIndex = 0;
  let correctAnswers = 0;
  let hintUsed = false;

  // İlk mesajı yükle
  loadEmojiMessage(currentMessageIndex);

  // Mesajı yükle
  function loadEmojiMessage(index) {
    // İlerleme çubuğunu güncelle
    progressBar.style.width = `${(index / 5) * 100}%`;
    progressText.innerText = `Mesaj: ${index + 1}/5`;
    
    // Emoji metnini güncelle
    emojiText.innerText = emojiMessages[index].emojis;
    
    // Seçenekleri temizle
    optionsContainer.innerHTML = "";
    
    // İpucu durumunu sıfırla
    hintUsed = false;
    hintButton.innerText = "İpucu Al";
    hintButton.disabled = false;
    hintButton.style.opacity = "1";
    
    // İpucu butonu olayı - koyu mavi ipucu mesajı için düzenlendi
    hintButton.onclick = function() {
      if (!hintUsed) {
        // Özel ipucu mesajı oluştur
        let customMessage = document.createElement("div");
        customMessage.id = "hint-message";
        customMessage.innerText = emojiMessages[index].hint;
        customMessage.style.position = "fixed";
        customMessage.style.top = "50%";
        customMessage.style.left = "50%";
        customMessage.style.transform = "translate(-50%, -50%)";
        customMessage.style.backgroundColor = "#0D47A1"; // Koyu mavi arka plan
        customMessage.style.color = "white"; // Beyaz metin
        customMessage.style.padding = "15px 20px";
        customMessage.style.borderRadius = "8px";
        customMessage.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        customMessage.style.zIndex = "1000";
        customMessage.style.fontSize = "1.1em";
        customMessage.style.fontWeight = "bold";
        customMessage.style.textAlign = "center";
        customMessage.style.minWidth = "200px";
        customMessage.style.maxWidth = "80%";
        document.body.appendChild(customMessage);
        
        // 2 saniye sonra kaldır
        setTimeout(() => {
          document.body.removeChild(customMessage);
        }, 2000);
        
        hintUsed = true;
        hintButton.innerText = "İpucu Kullanıldı";
        hintButton.disabled = true;
        hintButton.style.opacity = "0.6";
      }
    };
    
    // Yeni seçenekleri oluştur
    emojiMessages[index].options.forEach((option, i) => {
      let optionButton = document.createElement("button");
      optionButton.className = "emoji-option";
      optionButton.innerText = option;
      optionButton.style.padding = "12px 15px";
      optionButton.style.backgroundColor = "#F8F0FF";
      optionButton.style.border = "2px solid #9370DB";
      optionButton.style.borderRadius = "8px";
      optionButton.style.fontSize = "1em";
      optionButton.style.cursor = "pointer";
      optionButton.style.transition = "transform 0.2s ease, background-color 0.2s ease";
      
      // Hover efekti
      optionButton.onmouseover = function() {
        this.style.backgroundColor = "#EBE0FF";
        this.style.transform = "translateY(-2px)";
      };
      
      optionButton.onmouseout = function() {
        this.style.backgroundColor = "#F8F0FF";
        this.style.transform = "translateY(0)";
      };
      
      optionButton.onclick = function() {
        if (i === emojiMessages[index].correctIndex) {
          // Doğru cevap
        playCorrectSound();
          optionButton.style.backgroundColor = "#D6FFD6";
          optionButton.style.borderColor = "#4CAF50";
          
          correctAnswers++;
          
          // Sonraki mesaj veya sonuç
          setTimeout(() => {
            currentMessageIndex++;
            if (currentMessageIndex < emojiMessages.length) {
              loadEmojiMessage(currentMessageIndex);
      } else {
              // Tüm mesajlar tamamlandı
              showFinalResults();
            }
          }, 1500);
        } else {
          // Yanlış cevap
        playWrongSound();
          optionButton.style.backgroundColor = "#FFCCCC";
          optionButton.style.borderColor = "#FF6B6B";
          
          // Geri bildirim göster - koyu kırmızı hata mesajı
          let errorMessage = document.createElement("div");
          errorMessage.innerText = "Yanlış cevap! Tekrar dene.";
          errorMessage.style.position = "fixed";
          errorMessage.style.top = "50%";
          errorMessage.style.left = "50%";
          errorMessage.style.transform = "translate(-50%, -50%)";
          errorMessage.style.backgroundColor = "#B71C1C"; // Koyu kırmızı arka plan
          errorMessage.style.color = "white"; // Beyaz metin
          errorMessage.style.padding = "15px 20px";
          errorMessage.style.borderRadius = "8px";
          errorMessage.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
          errorMessage.style.zIndex = "1000";
          errorMessage.style.fontSize = "1.1em";
          errorMessage.style.fontWeight = "bold";
          errorMessage.style.textAlign = "center";
          document.body.appendChild(errorMessage);
          
          // 2 saniye sonra kaldır
          setTimeout(() => {
            document.body.removeChild(errorMessage);
          }, 2000);
          
          // Butonu salla
          optionButton.style.transform = "translateX(5px)";
          setTimeout(() => {
            optionButton.style.transform = "translateX(-5px)";
            setTimeout(() => {
              optionButton.style.transform = "translateX(0)";
            }, 100);
          }, 100);
        }
      };
      
      optionsContainer.appendChild(optionButton);
    });
  }

  // Sonuçları göster
  function showFinalResults() {
    // İlerleme çubuğunu tam yap
    progressBar.style.width = "100%";
    progressText.innerText = "Tamamlandı!";
    
    // Kartı temizle
    messageCard.innerHTML = "";
    
    // Sonuç ekranı başlığı
    let resultTitle = document.createElement("h3");
    resultTitle.innerText = "Tebrikler! Tüm mesajları çözdün!";
    resultTitle.style.color = "#7B68EE";
    resultTitle.style.textAlign = "center";
    resultTitle.style.margin = "20px 0";
    messageCard.appendChild(resultTitle);
    
    // Sonuç emojisi
    let resultEmoji = document.createElement("div");
    resultEmoji.style.fontSize = "5em";
    resultEmoji.innerHTML = "🎉";
    resultEmoji.style.margin = "10px 0";
    messageCard.appendChild(resultEmoji);
    
    // Skor metni
    let scoreText = document.createElement("p");
    scoreText.innerText = `Skorun: ${correctAnswers}/5`;
    scoreText.style.fontSize = "1.5em";
    scoreText.style.fontWeight = "bold";
    scoreText.style.color = "#7B68EE";
    scoreText.style.textAlign = "center";
    scoreText.style.margin = "10px 0";
    messageCard.appendChild(scoreText);
    
    // Mesaj metni
    let message = document.createElement("p");
    if (correctAnswers === 5) {
      message.innerText = "Mükemmel! Bir yapay zeka kadar iyisin!";
    } else if (correctAnswers >= 3) {
      message.innerText = "Çok iyi! Emoji dilini neredeyse tamamen çözdün!";
    } else {
      message.innerText = "İyi iş! Emoji dilini öğrenmeye başladın!";
    }
    message.style.textAlign = "center";
    message.style.margin = "10px 0 20px 0";
    messageCard.appendChild(message);
    
    // Açıklama
    let explanation = document.createElement("p");
    explanation.innerHTML = "Tıpkı senin gibi, <strong>yapay zeka</strong> da sembolleri ve emojileri analiz ederek <strong>anlamlarını çıkarabilir</strong>. Bu yetenek, yapay zekanın dijital iletişimde duyguları ve mesajları anlamasına yardımcı olur.";
    explanation.style.textAlign = "center";
    explanation.style.fontSize = "0.9em";
    explanation.style.padding = "10px";
    explanation.style.backgroundColor = "#F8F0FF";
    explanation.style.borderRadius = "8px";
    explanation.style.margin = "10px 0 20px 0";
    messageCard.appendChild(explanation);
    
    // Gezegen tamamlama mesajı
    let completionMessage = document.createElement("p");
    completionMessage.innerHTML = "<strong>4. Gezegeni Tamamladın, Tebrik Ederim!</strong>";
    completionMessage.style.color = "#6A0DAD";
    completionMessage.style.fontSize = "1.3em";
    completionMessage.style.textAlign = "center";
    completionMessage.style.margin = "20px 0";
    completionMessage.style.padding = "15px";
    completionMessage.style.backgroundColor = "#F0E6FF";
    completionMessage.style.borderRadius = "10px";
    completionMessage.style.border = "2px dashed #9370DB";
    messageCard.appendChild(completionMessage);
    
    // Konfeti efekti
    addConfetti();
    
    // 5 saniye sonra otomatik olarak sonraki bulmacaya geç
    setTimeout(() => {
      goNextPuzzle();
    }, 5000);
  }

  // Konfeti efekti
  function addConfetti() {
    for (let i = 0; i < 100; i++) {
      let confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.position = "absolute";
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = Math.random() * 10 + 5 + "px";
      confetti.style.backgroundColor = [
        "#9370DB", "#8A2BE2", "#BA55D3", "#E6E6FA", "#D8BFD8"
      ][Math.floor(Math.random() * 5)];
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = -20 + "px";
      confetti.style.opacity = Math.random() + 0.5;
      confetti.style.zIndex = "10";
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.transition = `top ${Math.random() * 3 + 2}s ease, left ${Math.random() * 3 + 2}s ease, opacity ${Math.random() * 3 + 2}s ease`;
      messageCard.appendChild(confetti);

      setTimeout(() => {
        confetti.style.top = "120%";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.opacity = "0";
      }, 100);

      setTimeout(() => {
        messageCard.removeChild(confetti);
      }, 5000);
    }
  }
}

/****************************************************************
 ************ 5) ROBOTİK ATÖLYESİ (5 Puzzle) ********************
 ****************************************************************/
function setupPlanet5Puzzle1() {
  puzzleHintText.innerText = "IPUCU: Robotu hedefe ulaştırmak için doğru komutları sırala.";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "15px";
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme kutusu
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(52, 152, 219, 0.1)"; // Mavi tema
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "15px";
  infoBox.style.border = "2px solid rgba(52, 152, 219, 0.3)";
  infoBox.style.width = "90%";
  infoBox.style.maxWidth = "700px";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  mainContainer.appendChild(infoBox);

  // Bilgilendirme başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "🤖 Robot Programlama Görevi 🤖";
  infoTitle.style.margin = "0 0 10px 0";
  infoTitle.style.color = "#2980b9";
  infoTitle.style.fontSize = "1.2em";
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni
  let infoText = document.createElement("p");
  infoText.innerHTML = "Robotlar <strong>komut dizileri</strong> ile programlanır. Robotların hareketlerini kontrol etmek için <strong>algoritmalar</strong> kullanılır. Şimdi sen de robotu hedefe ulaştırmak için doğru komut dizisini oluştur. Robotu engellere çarpmadan hedefe ulaştırabilecek misin?";
  infoText.style.margin = "0";
  infoText.style.fontSize = "1em";
  infoText.style.lineHeight = "1.4";
  infoBox.appendChild(infoText);

  // Oyun alanı ve komut paneli konteyneri (yan yana düzen için)
  let gameContainer = document.createElement("div");
  gameContainer.style.display = "flex";
  gameContainer.style.flexDirection = "row";
  gameContainer.style.flexWrap = "wrap";
  gameContainer.style.justifyContent = "center";
  gameContainer.style.gap = "20px";
  gameContainer.style.width = "100%";
  gameContainer.style.maxWidth = "700px";
  gameContainer.style.margin = "10px 0";
  mainContainer.appendChild(gameContainer);

  // Izgara oyun alanı konteyneri
  let gridContainer = document.createElement("div");
  gridContainer.style.width = "300px"; // 5x5 grid için uygun genişlik (her kare 60px)
  gridContainer.style.height = "300px";
  gridContainer.style.display = "grid";
  gridContainer.style.gridTemplateColumns = "repeat(5, 1fr)";
  gridContainer.style.gridTemplateRows = "repeat(5, 1fr)";
  gridContainer.style.gap = "0px";
  gridContainer.style.backgroundColor = "#e6f7ff";
  gridContainer.style.border = "2px solid #3498db";
  gridContainer.style.borderRadius = "5px";
  gridContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  gridContainer.style.position = "relative"; // Robot pozisyonu için gerekli
  gameContainer.appendChild(gridContainer);

  // Komut paneli konteyneri
  let commandPanelContainer = document.createElement("div");
  commandPanelContainer.style.width = "300px";
  commandPanelContainer.style.display = "flex";
  commandPanelContainer.style.flexDirection = "column";
  commandPanelContainer.style.gap = "15px";
  gameContainer.appendChild(commandPanelContainer);

  // Komut butonları konteyneri
  let commandButtonsContainer = document.createElement("div");
  commandButtonsContainer.style.display = "flex";
  commandButtonsContainer.style.flexDirection = "row";
  commandButtonsContainer.style.flexWrap = "wrap";
  commandButtonsContainer.style.gap = "10px";
  commandButtonsContainer.style.justifyContent = "center";
  commandButtonsContainer.style.backgroundColor = "#f1f9ff";
  commandButtonsContainer.style.padding = "10px";
  commandButtonsContainer.style.borderRadius = "8px";
  commandButtonsContainer.style.border = "2px dashed #3498db";
  commandPanelContainer.appendChild(commandButtonsContainer);

  // Komut butonları
  const commands = [
    { name: "Yukarı Git", icon: "⬆️", action: "up" },
    { name: "Sağa Git", icon: "➡️", action: "right" },
    { name: "Aşağı Git", icon: "⬇️", action: "down" },
    { name: "Sola Git", icon: "⬅️", action: "left" }
  ];

  commands.forEach(cmd => {
    let button = document.createElement("button");
    button.innerText = `${cmd.icon} ${cmd.name}`;
    button.style.padding = "8px 12px";
    button.style.backgroundColor = "#3498db";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.fontSize = "0.9em";
    button.style.fontWeight = "bold";
    button.style.transition = "transform 0.2s, background-color 0.2s";
    
    button.onmouseover = function() {
      this.style.backgroundColor = "#2980b9";
      this.style.transform = "translateY(-2px)";
    };
    
    button.onmouseout = function() {
      this.style.backgroundColor = "#3498db";
      this.style.transform = "translateY(0)";
    };
    
    button.onclick = function() {
      addCommand(cmd.action, cmd.icon);
    };
    
    commandButtonsContainer.appendChild(button);
  });

  // Komut listesi konteyneri
  let commandListContainer = document.createElement("div");
  commandListContainer.style.height = "180px";
  commandListContainer.style.overflowY = "auto";
  commandListContainer.style.backgroundColor = "white";
  commandListContainer.style.padding = "10px";
  commandListContainer.style.borderRadius = "8px";
  commandListContainer.style.border = "2px solid #3498db";
  commandListContainer.style.display = "flex";
  commandListContainer.style.flexDirection = "column";
  commandListContainer.style.gap = "5px";
  commandPanelContainer.appendChild(commandListContainer);

  // Komut listesi başlık
  let commandListTitle = document.createElement("div");
  commandListTitle.innerText = "Komut Listesi:";
  commandListTitle.style.fontWeight = "bold";
  commandListTitle.style.color = "#2980b9";
  commandListTitle.style.marginBottom = "5px";
  commandListContainer.appendChild(commandListTitle);

  // Komut listesi (boş başlangıç)
  let commandList = document.createElement("div");
  commandList.id = "command-list";
  commandListContainer.appendChild(commandList);

  // Kontrol butonları konteyneri
  let controlButtonsContainer = document.createElement("div");
  controlButtonsContainer.style.display = "flex";
  controlButtonsContainer.style.justifyContent = "space-between";
  controlButtonsContainer.style.gap = "10px";
  commandPanelContainer.appendChild(controlButtonsContainer);

  // Çalıştır butonu
  let runButton = document.createElement("button");
  runButton.innerText = "▶️ Çalıştır";
  runButton.style.padding = "10px 15px";
  runButton.style.backgroundColor = "#2ecc71";
  runButton.style.color = "white";
  runButton.style.border = "none";
  runButton.style.borderRadius = "5px";
  runButton.style.cursor = "pointer";
  runButton.style.fontSize = "1em";
  runButton.style.fontWeight = "bold";
  runButton.style.flex = "1";
  runButton.style.transition = "transform 0.2s, background-color 0.2s";
  
  runButton.onmouseover = function() {
    this.style.backgroundColor = "#27ae60";
    this.style.transform = "translateY(-2px)";
  };
  
  runButton.onmouseout = function() {
    this.style.backgroundColor = "#2ecc71";
    this.style.transform = "translateY(0)";
  };
  
  runButton.onclick = function() {
    runCommands();
  };
  
  controlButtonsContainer.appendChild(runButton);

  // Sıfırla butonu
  let resetButton = document.createElement("button");
  resetButton.innerText = "🔄 Sıfırla";
  resetButton.style.padding = "10px 15px";
  resetButton.style.backgroundColor = "#e74c3c";
  resetButton.style.color = "white";
  resetButton.style.border = "none";
  resetButton.style.borderRadius = "5px";
  resetButton.style.cursor = "pointer";
  resetButton.style.fontSize = "1em";
  resetButton.style.fontWeight = "bold";
  resetButton.style.flex = "1";
  resetButton.style.transition = "transform 0.2s, background-color 0.2s";
  
  resetButton.onmouseover = function() {
    this.style.backgroundColor = "#c0392b";
    this.style.transform = "translateY(-2px)";
  };
  
  resetButton.onmouseout = function() {
    this.style.backgroundColor = "#e74c3c";
    this.style.transform = "translateY(0)";
  };
  
  resetButton.onclick = function() {
    resetGame();
  };
  
  controlButtonsContainer.appendChild(resetButton);

  // Izgara haritası (0: boş, 1: engel, 2: başlangıç, 3: hedef)
  // 5x5 harita, robot altta, hedef üstte
  const gridMap = [
    [0, 0, 3, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 2, 0, 0]  // Başlangıç noktası (2) burada
  ];

  // Robot pozisyonu (başlangıçta en alt orta hücrede)
  let robotPosition = { row: 4, col: 2 }; // Başlangıç pozisyonu (2 değerine sahip hücre)
  let robotElement = null;

  // Komut listesi
  let commands_list = [];

  // Izgarayı oluştur
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      let cell = document.createElement("div");
      cell.style.width = "100%";
      cell.style.height = "100%";
      cell.style.border = "1px solid #bde0fe";
      cell.style.boxSizing = "border-box";
      cell.style.display = "flex";
      cell.style.justifyContent = "center";
      cell.style.alignItems = "center";
      cell.style.fontSize = "1.5em";
      cell.dataset.row = i;
      cell.dataset.col = j;

      // Hücre içeriğini ayarla
      if (gridMap[i][j] === 1) { // Engel
        cell.style.backgroundColor = "#95a5a6";
        cell.innerHTML = "🚧";
      } else if (gridMap[i][j] === 2) { // Başlangıç
        cell.style.backgroundColor = "#d0f0fd";
        // Robot başlangıçta buraya yerleştirilecek
      } else if (gridMap[i][j] === 3) { // Hedef
        cell.style.backgroundColor = "#d0fdd2";
        cell.innerHTML = "🏁";
      }

      gridContainer.appendChild(cell);
    }
  }

  // Robotu yerleştir
  function placeRobot() {
    // Önceki robotu kaldır
    if (robotElement) {
      robotElement.remove();
    }
    
    // Robotu oluştur
    robotElement = document.createElement("div");
    robotElement.id = "robot";
    robotElement.style.width = "40px";
    robotElement.style.height = "40px";
    robotElement.style.backgroundColor = "#3498db";
    robotElement.style.borderRadius = "50%";
    robotElement.style.position = "absolute";
    robotElement.style.display = "flex";
    robotElement.style.justifyContent = "center";
    robotElement.style.alignItems = "center";
    robotElement.style.transition = "left 0.5s, top 0.5s";
    
    // Robot yüzü
    let robotFace = document.createElement("div");
    robotFace.innerHTML = "🤖";
    robotFace.style.fontSize = "25px";
    robotElement.appendChild(robotFace);
    
    // Robotu haritanın içinde başlangıç noktasına yerleştir
    let targetCell = gridContainer.querySelector(`[data-row="${robotPosition.row}"][data-col="${robotPosition.col}"]`);
    robotElement.style.left = (targetCell.offsetLeft + 10) + "px";
    robotElement.style.top = (targetCell.offsetTop + 10) + "px";
    
    gridContainer.appendChild(robotElement);
  }

  // Oyunu başlat
  placeRobot();

  // Komut ekle
  function addCommand(action, icon) {
    commands_list.push(action);
    
    let commandItem = document.createElement("div");
    commandItem.className = "command-item";
    commandItem.style.backgroundColor = "#f1f9ff";
    commandItem.style.padding = "5px 10px";
    commandItem.style.borderRadius = "5px";
    commandItem.style.border = "1px solid #3498db";
    commandItem.style.display = "flex";
    commandItem.style.alignItems = "center";
    commandItem.style.gap = "5px";
    
    let commandIcon = document.createElement("span");
    commandIcon.innerText = icon;
    commandItem.appendChild(commandIcon);
    
    let commandText = document.createElement("span");
    commandText.innerText = action === "up" ? "Yukarı Git" : 
                           action === "right" ? "Sağa Git" : 
                           action === "down" ? "Aşağı Git" : "Sola Git";
    commandItem.appendChild(commandText);
    
    let removeButton = document.createElement("button");
    removeButton.innerText = "❌";
    removeButton.style.marginLeft = "auto";
    removeButton.style.background = "none";
    removeButton.style.border = "none";
    removeButton.style.cursor = "pointer";
    removeButton.style.fontSize = "0.8em";
    removeButton.style.padding = "2px";
    removeButton.style.color = "#e74c3c";
    
    removeButton.onclick = function(e) {
      e.stopPropagation();
      const index = Array.from(commandList.children).indexOf(commandItem);
      commands_list.splice(index, 1);
      commandItem.remove();
    };
    
    commandItem.appendChild(removeButton);
    commandList.appendChild(commandItem);
    
    // Otomatik scroll
    commandListContainer.scrollTop = commandListContainer.scrollHeight;
  }

  // Komutları çalıştır
  function runCommands() {
    if (commands_list.length === 0) {
      showMessage("Lütfen önce komut ekleyin!", "error");
      return;
    }

    // Butonları devre dışı bırak
    runButton.disabled = true;
    resetButton.disabled = true;
    runButton.style.opacity = "0.6";
    resetButton.style.opacity = "0.6";
    
    let commandIndex = 0;
    
    function executeNextCommand() {
      if (commandIndex >= commands_list.length) {
        // Komutlar bitti, hedefte miyiz kontrol et
        setTimeout(checkGoal, 500);
        return;
      }
      
      // Aktif komutu vurgula
      const commandItems = commandList.querySelectorAll('.command-item');
      commandItems.forEach((item, i) => {
        if (i === commandIndex) {
          item.style.backgroundColor = "#d0f0fd";
          item.style.borderColor = "#2980b9";
          item.style.transform = "scale(1.05)";
        } else {
          item.style.backgroundColor = "#f1f9ff";
          item.style.borderColor = "#3498db";
          item.style.transform = "scale(1)";
        }
      });
      
      const command = commands_list[commandIndex];
      let newPosition = {...robotPosition};
      
      // Komutu uygula
      if (command === "up") {
        newPosition.row--;
      } else if (command === "right") {
        newPosition.col++;
      } else if (command === "down") {
        newPosition.row++;
      } else if (command === "left") {
        newPosition.col--;
      }
      
      // Izgara dışına çıktı mı kontrol et
      if (newPosition.row < 0 || newPosition.row >= 5 || newPosition.col < 0 || newPosition.col >= 5) {
        playWrongSound();
        showMessage("Robot ızgara dışına çıkamaz!", "error");
        resetGame();
        return;
      }
      
      // Engele çarptı mı kontrol et
      if (gridMap[newPosition.row][newPosition.col] === 1) {
        playWrongSound();
        showMessage("Robot engele çarptı!", "error");
        resetGame();
        return;
      }
      
      // Robotu güncelle
      robotPosition = newPosition;
      
      // Robotu yeniden yerleştir (animasyonlu)
      let targetCell = gridContainer.querySelector(`[data-row="${robotPosition.row}"][data-col="${robotPosition.col}"]`);
      robotElement.style.left = (targetCell.offsetLeft + 10) + "px";
      robotElement.style.top = (targetCell.offsetTop + 10) + "px";
      
      // Sonraki komutu çalıştır
      commandIndex++;
      setTimeout(executeNextCommand, 800);
    }
    
    // İlk komutu çalıştır
    executeNextCommand();
  }

  // Hedefe ulaşıldı mı kontrol et
  function checkGoal() {
    if (gridMap[robotPosition.row][robotPosition.col] === 3) {
      // Hedef başarıyla tamamlandı
        playCorrectSound();
      showMessage("Tebrikler! Robot hedefe ulaştı!", "success");
      
      // Konfeti efekti
      addConfetti();
      
      // 3 saniye sonra bir sonraki bulmacaya geç
      setTimeout(() => {
        goNextPuzzle();
      }, 3000);
      } else {
      // Hedef tamamlanamadı
        playWrongSound();
      showMessage("Robot hedefe ulaşamadı. Tekrar dene!", "error");
      
      // Butonları tekrar etkinleştir
      setTimeout(() => {
        runButton.disabled = false;
        resetButton.disabled = false;
        runButton.style.opacity = "1";
        resetButton.style.opacity = "1";
      }, 1500);
    }
  }

  // Oyunu sıfırla
  function resetGame() {
    // Robot pozisyonunu sıfırla
    robotPosition = { row: 4, col: 2 }; // Başlangıç pozisyonuna geri dön
    placeRobot();
    
    // Komut listesini temizle
    commands_list = [];
    commandList.innerHTML = "";
    
    // Butonları tekrar etkinleştir
    runButton.disabled = false;
    resetButton.disabled = false;
    runButton.style.opacity = "1";
    resetButton.style.opacity = "1";
  }

  // Konfeti efekti
  function addConfetti() {
    for (let i = 0; i < 100; i++) {
      let confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.position = "absolute";
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = Math.random() * 10 + 5 + "px";
      confetti.style.backgroundColor = [
        "#3498db", "#2980b9", "#2ecc71", "#e74c3c", "#f1c40f"
      ][Math.floor(Math.random() * 5)];
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = -20 + "px";
      confetti.style.opacity = Math.random() + 0.5;
      confetti.style.zIndex = "10";
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.transition = `top ${Math.random() * 3 + 2}s ease, left ${Math.random() * 3 + 2}s ease, opacity ${Math.random() * 3 + 2}s ease`;
      gridContainer.appendChild(confetti);

      setTimeout(() => {
        confetti.style.top = "120%";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.opacity = "0";
      }, 100);

      setTimeout(() => {
        gridContainer.removeChild(confetti);
      }, 5000);
    }
  }
}

function setupPlanet5Puzzle2() {
  puzzleHintText.innerText = "IPUCU: Sensörleri doğru senaryolarla eşleştir.";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "15px";
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme kutusu
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(243, 156, 18, 0.1)"; // Turuncu tema
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "15px";
  infoBox.style.border = "2px solid rgba(243, 156, 18, 0.3)";
  infoBox.style.width = "90%";
  infoBox.style.maxWidth = "700px";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  mainContainer.appendChild(infoBox);

  // Bilgilendirme başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "🤖 Robot Sensörleri 🔍";
  infoTitle.style.margin = "0 0 10px 0";
  infoTitle.style.color = "#e67e22";
  infoTitle.style.fontSize = "1.2em";
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni
  let infoText = document.createElement("p");
  infoText.innerHTML = "Robotlar, dünyayı <strong>sensörler</strong> yardımıyla algılar. Sensörler, robotların görmesine, duymasına ve hissetmesine yardımcı olur. Tıpkı insanların duyu organları gibi! Her sensör farklı bir görevi yerine getirir. Şimdi sensörleri doğru senaryolarla eşleştirelim.";
  infoText.style.margin = "0";
  infoText.style.fontSize = "1em";
  infoText.style.lineHeight = "1.4";
  infoBox.appendChild(infoText);

  // İlerleme metni
  let progressText = document.createElement("div");
  progressText.id = "progress-text";
  progressText.innerText = "Eşleşen Sensörler: 0/5";
  progressText.style.textAlign = "center";
  progressText.style.margin = "10px 0";
  progressText.style.fontWeight = "bold";
  progressText.style.color = "#e67e22";
  mainContainer.appendChild(progressText);

  // Oyun alanı - Yan yana konumlandırma
  let gameArea = document.createElement("div");
  gameArea.style.display = "flex";
  gameArea.style.flexDirection = "row";
  gameArea.style.justifyContent = "center";
  gameArea.style.gap = "30px"; // Aralarında 30px boşluk
  gameArea.style.width = "100%";
  gameArea.style.maxWidth = "700px";
  gameArea.style.margin = "10px 0";
  mainContainer.appendChild(gameArea);

  // Sensörler konteyneri (sol taraf)
  let sensorsContainer = document.createElement("div");
  sensorsContainer.style.width = "45%";
  sensorsContainer.style.maxWidth = "300px";
  sensorsContainer.style.padding = "15px";
  sensorsContainer.style.backgroundColor = "#FEF5E7";
  sensorsContainer.style.borderRadius = "10px";
  sensorsContainer.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  sensorsContainer.style.display = "flex";
  sensorsContainer.style.flexDirection = "column";
  sensorsContainer.style.gap = "15px";
  gameArea.appendChild(sensorsContainer);

  // Sensörler başlık
  let sensorsTitle = document.createElement("h4");
  sensorsTitle.innerText = "Robot Sensörleri";
  sensorsTitle.style.textAlign = "center";
  sensorsTitle.style.margin = "0";
  sensorsTitle.style.color = "#e67e22";
  sensorsContainer.appendChild(sensorsTitle);

  // Görevler konteyneri (sağ taraf)
  let tasksContainer = document.createElement("div");
  tasksContainer.style.width = "45%";
  tasksContainer.style.maxWidth = "300px";
  tasksContainer.style.padding = "15px";
  tasksContainer.style.backgroundColor = "#FEF5E7";
  tasksContainer.style.borderRadius = "10px";
  tasksContainer.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  tasksContainer.style.display = "flex";
  tasksContainer.style.flexDirection = "column";
  tasksContainer.style.gap = "15px";
  gameArea.appendChild(tasksContainer);

  // Görevler başlık
  let tasksTitle = document.createElement("h4");
  tasksTitle.innerText = "Sensör Senaryoları";
  tasksTitle.style.textAlign = "center";
  tasksTitle.style.margin = "0";
  tasksTitle.style.color = "#e67e22";
  tasksContainer.appendChild(tasksTitle);

  // Sensör ve görev verileri
  const sensors = [
    {
      id: "sensor1",
      name: "Göz Sensörü (Kamera)",
      icon: "👁️",
      description: "Robotun çevresini görmesini sağlar."
    },
    {
      id: "sensor2",
      name: "Kulak Sensörü (Mikrofon)",
      icon: "👂",
      description: "Robotun sesleri duymasını sağlar."
    },
    {
      id: "sensor3",
      name: "Dokunma Sensörü",
      icon: "👆",
      description: "Robotun dokunduğu şeyleri hissetmesini sağlar."
    },
    {
      id: "sensor4",
      name: "Mesafe Sensörü",
      icon: "📏",
      description: "Robotun önündeki engelleri uzaktan görmesini sağlar."
    },
    {
      id: "sensor5",
      name: "Işık Sensörü",
      icon: "💡",
      description: "Robotun etrafındaki ışığı algılamasını sağlar."
    }
  ];

  // Somut görev senaryoları
  const tasks = [
    {
      id: "task1",
      text: "Robot bir arkadaşının yüzünü tanımalı",
      correctSensor: "sensor1" // Göz Sensörü (Kamera)
    },
    {
      id: "task2",
      text: "Robot, çocuk 'Hey robot!' dediğinde tepki vermeli",
      correctSensor: "sensor2" // Kulak Sensörü (Mikrofon)
    },
    {
      id: "task3",
      text: "Robot bir nesneye çarpınca durmalı",
      correctSensor: "sensor3" // Dokunma Sensörü
    },
    {
      id: "task4",
      text: "Robot duvara çarpmadan durabilmeli",
      correctSensor: "sensor4" // Mesafe Sensörü
    },
    {
      id: "task5",
      text: "Robot karanlıkta ışığını yakabilmeli",
      correctSensor: "sensor5" // Işık Sensörü
    }
  ];

  // Görevleri karıştır
  let shuffledTasks = [...tasks].sort(() => Math.random() - 0.5);

  // Sensör kartlarını oluştur
  sensors.forEach(sensor => {
    let sensorCard = document.createElement("div");
    sensorCard.id = sensor.id;
    sensorCard.className = "sensor-card";
    sensorCard.draggable = true;
    sensorCard.style.backgroundColor = "white";
    sensorCard.style.padding = "10px";
    sensorCard.style.borderRadius = "8px";
    sensorCard.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
    sensorCard.style.display = "flex";
    sensorCard.style.alignItems = "center";
    sensorCard.style.gap = "10px";
    sensorCard.style.cursor = "grab";
    sensorCard.style.transition = "transform 0.2s, box-shadow 0.2s";
    sensorCard.style.marginBottom = "10px"; // Kartlar arası boşluk

    // Emoji ve sensör adı yan yana
    sensorCard.innerHTML = `
      <div style="font-size: 1.5em; display: flex; justify-content: center; align-items: center;">${sensor.icon}</div>
      <div style="flex: 1; margin-left: 5px;">
        <div style="font-weight: bold; font-size: 0.85em; color: #333;">${sensor.name}</div>
      </div>
    `;

    // Sürükle-bırak olayları
    sensorCard.addEventListener("dragstart", function(e) {
      e.dataTransfer.setData("text/plain", sensor.id);
      e.dataTransfer.setData("application/sensor-name", sensor.name);
      e.dataTransfer.setData("application/sensor-icon", sensor.icon);
      this.style.opacity = "0.4";
    });
    
    sensorCard.addEventListener("dragend", function() {
      this.style.opacity = "1";
    });
    
    sensorsContainer.appendChild(sensorCard);
  });

  // Görev kartlarını oluştur
  shuffledTasks.forEach(task => {
    let taskCard = document.createElement("div");
    taskCard.id = task.id;
    taskCard.className = "task-card";
    taskCard.style.backgroundColor = "white";
    taskCard.style.padding = "8px"; // Dikey padding'i azalttım
    taskCard.style.borderRadius = "8px";
    taskCard.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
    taskCard.style.minHeight = "40px"; // Yüksekliği azalttım (eskisi: 60px)
    taskCard.style.maxHeight = "50px"; // Maksimum yükseklik ekledim
    taskCard.style.display = "flex";
    taskCard.style.flexDirection = "column";
    taskCard.style.position = "relative";
    taskCard.style.marginBottom = "10px"; // Kartlar arası boşluğu azalttım (eskisi: 15px)
    
    // Görev kartı tamamen bırakma alanı olarak işlev görecek
    taskCard.dataset.taskId = task.id;
    taskCard.dataset.correctSensor = task.correctSensor;
    
    // Görev senaryosu
    let scenarioDiv = document.createElement("div");
    scenarioDiv.style.fontSize = "0.85em"; // Daha küçük yazı boyutu
    scenarioDiv.style.padding = "4px"; // Padding'i azalttım
    scenarioDiv.style.textAlign = "center";
    scenarioDiv.style.color = "#000000"; // Yazı rengini siyah yaptım
    scenarioDiv.innerText = task.text;
    scenarioDiv.style.height = "100%";
    scenarioDiv.style.display = "flex";
    scenarioDiv.style.alignItems = "center";
    scenarioDiv.style.justifyContent = "center";
    
    // Bırakma alanı için görsel ipucu
    taskCard.style.border = "2px dashed #e67e22";
    
    taskCard.appendChild(scenarioDiv);
    
    // Bırakma alanı olayları
    taskCard.addEventListener("dragover", function(e) {
    e.preventDefault();
      this.style.backgroundColor = "#fad7a0";
      this.style.border = "2px solid #e67e22";
    });
    
    taskCard.addEventListener("dragleave", function() {
      this.style.backgroundColor = "white";
      this.style.border = "2px dashed #e67e22";
    });
    
    taskCard.addEventListener("drop", function(e) {
      e.preventDefault();
      let sensorId = e.dataTransfer.getData("text/plain");
      let sensorName = e.dataTransfer.getData("application/sensor-name");
      let sensorIcon = e.dataTransfer.getData("application/sensor-icon");
      let sensorCard = document.getElementById(sensorId);
      let correctSensorId = this.dataset.correctSensor;
      
      // Doğru eşleşme kontrolü
      if (sensorId === correctSensorId) {
        // Doğru eşleşme
      playCorrectSound();
        
        // Orijinal sensör kartını tamamen kaldır
        sensorCard.remove();
        
        // Görev kartını doğru olarak işaretle
        this.style.borderLeft = "5px solid #2ecc71";
        this.style.border = "2px solid #2ecc71";
        this.style.backgroundColor = "#d5f5e3";
        this.style.minHeight = "40px";
        this.style.maxHeight = "none";
        
        // Kart içeriğini güncelle - Doğru cevabın gösterimi
        this.innerHTML = "";
        
        let answerDiv = document.createElement("div");
        answerDiv.style.display = "flex";
        answerDiv.style.alignItems = "center";
        answerDiv.style.padding = "6px";
        answerDiv.style.width = "100%";
        
        // Sensör senaryosu
        let scenarioSpan = document.createElement("div");
        scenarioSpan.style.fontSize = "0.85em";
        scenarioSpan.style.marginBottom = "3px";
        scenarioSpan.style.color = "#000000"; // Yazı rengini siyah yaptım
        scenarioSpan.innerText = task.text;
        answerDiv.appendChild(scenarioSpan);
        
        // Sensör bilgisi
        let sensorInfoDiv = document.createElement("div");
        sensorInfoDiv.style.display = "flex";
        sensorInfoDiv.style.alignItems = "center";
        sensorInfoDiv.style.gap = "5px";
        sensorInfoDiv.style.marginTop = "3px";
        
        // Sensör ikonu
        let iconSpan = document.createElement("span");
        iconSpan.style.fontSize = "1.2em";
        iconSpan.innerHTML = sensorIcon;
        sensorInfoDiv.appendChild(iconSpan);
        
        // Sensör adı
        let nameSpan = document.createElement("span");
        nameSpan.style.fontWeight = "bold";
        nameSpan.style.fontSize = "0.75em";
        nameSpan.style.color = "#2ecc71";
        nameSpan.innerText = sensorName;
        sensorInfoDiv.appendChild(nameSpan);
        
        // Sıralı div oluştur
        let containerDiv = document.createElement("div");
        containerDiv.style.display = "flex";
        containerDiv.style.flexDirection = "column";
        containerDiv.appendChild(scenarioSpan);
        containerDiv.appendChild(sensorInfoDiv);
        
        this.appendChild(containerDiv);
        
        // Eşleşme sayısını güncelle
        updateMatchCount();
    } else {
        // Yanlış eşleşme
      playWrongSound();
        this.style.backgroundColor = "#fadbd8";
        this.style.border = "2px solid #e74c3c";
        setTimeout(() => {
          this.style.backgroundColor = "white";
          this.style.border = "2px dashed #e67e22";
        }, 800);
      }
    });
    
    tasksContainer.appendChild(taskCard);
  });

  // Eşleşme sayısını güncelle
  let matchCount = 0;
  
  function updateMatchCount() {
    matchCount++;
    progressText.innerText = `Eşleşen Sensörler: ${matchCount}/5`;
    
    // Tüm sensörler eşleşti mi?
    if (matchCount >= 5) {
      // Bulmaca tamamlandı
      setTimeout(() => {
        showCompletionMessage();
      }, 1000);
    }
  }

  // Tamamlama mesajını göster
  function showCompletionMessage() {
    // Oyun alanını temizle
    gameArea.innerHTML = "";
    
    // Tamamlama kartı
    let completionCard = document.createElement("div");
    completionCard.style.width = "90%";
    completionCard.style.maxWidth = "600px";
    completionCard.style.backgroundColor = "white";
    completionCard.style.borderRadius = "12px";
    completionCard.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
    completionCard.style.padding = "25px";
    completionCard.style.display = "flex";
    completionCard.style.flexDirection = "column";
    completionCard.style.alignItems = "center";
    completionCard.style.gap = "20px";
    completionCard.style.position = "relative";
    completionCard.style.overflow = "hidden";
    gameArea.appendChild(completionCard);
    
    // Tebrik başlığı
    let congratsTitle = document.createElement("h3");
    congratsTitle.innerText = "Harika İş! 🎉";
    congratsTitle.style.color = "#e67e22";
    congratsTitle.style.margin = "0";
    congratsTitle.style.fontSize = "1.5em";
    completionCard.appendChild(congratsTitle);
    
    // Tebrik mesajı
    let congratsMessage = document.createElement("p");
    congratsMessage.innerHTML = `Tüm robot sensörlerini doğru görevlerle eşleştirdin! <br><br> Robot sensörleri, yapay zeka sistemlerinin dünyayı algılamasını ve veri toplamasını sağlayan önemli parçalardır. Sensörler, insanlara benzer şekilde robotların görmesine, duymasına, dokunmasına, ölçüm yapmasına ve daha birçok şeyi algılamasına yardımcı olur.`;
    congratsMessage.style.textAlign = "center";
    congratsMessage.style.lineHeight = "1.5";
    congratsMessage.style.margin = "0";
    completionCard.appendChild(congratsMessage);
    
    // Sonraki bulmaca butonu
    let nextButton = document.createElement("button");
    nextButton.innerText = "Sonraki Bulmaca";
    nextButton.style.backgroundColor = "#e67e22";
    nextButton.style.color = "white";
    nextButton.style.border = "none";
    nextButton.style.padding = "12px 24px";
    nextButton.style.borderRadius = "30px";
    nextButton.style.fontSize = "1em";
    nextButton.style.fontWeight = "bold";
    nextButton.style.cursor = "pointer";
    nextButton.style.transition = "background-color 0.3s";
    nextButton.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
    nextButton.style.margin = "10px 0";
    
    nextButton.addEventListener("mouseover", function() {
      this.style.backgroundColor = "#d35400";
    });
    
    nextButton.addEventListener("mouseout", function() {
      this.style.backgroundColor = "#e67e22";
    });
    
    nextButton.addEventListener("click", function() {
      playClickSound();
      goNextPuzzle();
    });
    
    completionCard.appendChild(nextButton);
    
    // Konfeti efekti ekle
    addConfetti();
  }
  
  // Konfeti efekti
  function addConfetti() {
    // Konfeti konteyneri
    let confettiContainer = document.createElement("div");
    confettiContainer.style.position = "absolute";
    confettiContainer.style.top = "0";
    confettiContainer.style.left = "0";
    confettiContainer.style.width = "100%";
    confettiContainer.style.height = "100%";
    confettiContainer.style.pointerEvents = "none";
    confettiContainer.style.zIndex = "5";
    confettiContainer.style.overflow = "hidden";
    mainContainer.appendChild(confettiContainer);
    
    // Konfeti parçacıklarını oluştur
    const colors = ["#e67e22", "#3498db", "#2ecc71", "#9b59b6", "#f1c40f"];
    
    for (let i = 0; i < 100; i++) {
      let confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = (Math.random() * 10 + 5) + "px";
      confetti.style.height = (Math.random() * 10 + 5) + "px";
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      confetti.style.top = "-20px";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.transform = "rotate(" + (Math.random() * 360) + "deg)";
      confetti.style.opacity = Math.random() + 0.4;
      confettiContainer.appendChild(confetti);
      
      // Animasyon
      const animationDuration = Math.random() * 3 + 2;
      const animationDelay = Math.random() * 2;
      
      confetti.animate(
        [
          { top: "-20px", transform: "rotate(0deg)" },
          { top: confettiContainer.offsetHeight + "px", transform: "rotate(720deg)" }
        ],
        {
          duration: animationDuration * 1000,
          delay: animationDelay * 1000,
          easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
          iterations: 1,
          fill: "forwards"
        }
      );
      
      // Konfeti temizleme
      setTimeout(() => {
        confetti.remove();
      }, (animationDuration + animationDelay) * 1000);
    }
    
    // Konfeti konteyneri temizleme
    setTimeout(() => {
      confettiContainer.remove();
    }, 7000);
  }
    
  // Bulmaca tamamlandı olarak işaretle
  updatePlanetSelectionState();
}

function setupPlanet5Puzzle3() {
  puzzleHintText.innerText = "IPUCU: Sınırlı enerjiyle görevleri tamamlamak için en verimli yolu seç.";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "15px";
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme kutusu
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(41, 128, 185, 0.1)"; // Mavi tema
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "15px";
  infoBox.style.border = "2px solid rgba(41, 128, 185, 0.3)";
  infoBox.style.width = "90%";
  infoBox.style.maxWidth = "700px";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  mainContainer.appendChild(infoBox);

  // Bilgilendirme başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "🤖 Robot Enerji Yönetimi 🔋";
  infoTitle.style.margin = "0 0 10px 0";
  infoTitle.style.color = "#000000"; // Siyah renk
  infoTitle.style.fontSize = "1.2em";
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni
  let infoText = document.createElement("p");
  infoText.innerHTML = "Robotunuzun <strong>100 birim enerjisi</strong> var ve bu enerjiyle fabrikadaki görevleri tamamlamalısın. Her hareket ve eylem farklı miktarda enerji harcar. En yüksek puanı almak için enerjiyi akıllıca kullan!";
  infoText.style.margin = "0";
  infoText.style.fontSize = "1em";
  infoText.style.lineHeight = "1.4";
  infoText.style.color = "#000000"; // Siyah renk
  infoBox.appendChild(infoText);

  // Oyun alanı (sol harita, sağ kontrol paneli)
  let gameArea = document.createElement("div");
  gameArea.style.display = "flex";
  gameArea.style.width = "100%";
  gameArea.style.maxWidth = "700px";
  gameArea.style.marginTop = "15px";
  gameArea.style.gap = "20px";
  mainContainer.appendChild(gameArea);

  // SOL PANEL - Fabrika Haritası
  let mapPanel = document.createElement("div");
  mapPanel.style.flex = "6";
  mapPanel.style.backgroundColor = "#ecf0f1";
  mapPanel.style.borderRadius = "12px";
  mapPanel.style.padding = "15px";
  mapPanel.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  mapPanel.style.position = "relative";
  mapPanel.style.height = "400px";
  gameArea.appendChild(mapPanel);

  // Harita başlığı
  let mapTitle = document.createElement("h4");
  mapTitle.innerText = "Fabrika Haritası";
  mapTitle.style.textAlign = "center";
  mapTitle.style.margin = "0 0 10px 0";
  mapTitle.style.color = "#000000"; // Siyah renk
  mapPanel.appendChild(mapTitle);

  // Harita oluştur (5x5 grid)
  let mapGrid = document.createElement("div");
  mapGrid.style.display = "grid";
  mapGrid.style.gridTemplateColumns = "repeat(5, 1fr)";
  mapGrid.style.gridTemplateRows = "repeat(5, 1fr)";
  mapGrid.style.gap = "5px";
  mapGrid.style.height = "calc(100% - 30px)";
  mapGrid.style.width = "100%";
  mapPanel.appendChild(mapGrid);

  // Robot elementi (hareketli robot için)
  let robotElement = document.createElement("div");
  robotElement.id = "robot-element";
  robotElement.style.position = "absolute";
  robotElement.style.width = "30px";
  robotElement.style.height = "30px";
  robotElement.style.display = "flex";
  robotElement.style.justifyContent = "center";
  robotElement.style.alignItems = "center";
  robotElement.style.fontSize = "1.5em";
  robotElement.style.zIndex = "5";
  robotElement.style.transition = "all 0.5s ease"; // Hareket animasyonu
  robotElement.innerHTML = "🤖";
  mapPanel.appendChild(robotElement);

  // Harita hücreleri ve görev noktaları
  const mapData = [
    { x: 0, y: 0, type: "start", icon: "🏠", description: "Başlangıç Noktası" },
    { x: 1, y: 1, type: "task", taskType: "analyze", icon: "🔍", points: 10, description: "Analiz Yap", energyCost: 10 },
    { x: 3, y: 0, type: "task", taskType: "lift", icon: "📦", points: 15, description: "Kargo Kaldır", energyCost: 15 },
    { x: 2, y: 2, type: "task", taskType: "communicate", icon: "📡", points: 12, description: "İletişim Kur", energyCost: 8 },
    { x: 4, y: 1, type: "task", taskType: "obstacle", icon: "🚧", points: 20, description: "Engel Aş", energyCost: 20 },
    { x: 0, y: 4, type: "task", taskType: "lift", icon: "🔧", points: 15, description: "Tamir Et", energyCost: 15 },
    { x: 3, y: 3, type: "charger", icon: "⚡", description: "Şarj İstasyonu", energyBoost: 30 },
    { x: 4, y: 4, type: "task", taskType: "analyze", icon: "📊", points: 25, description: "Veri Analizi", energyCost: 10 }
  ];

  // Robot ve mevcut konum değişkenleri
  let robotPosition = { x: 0, y: 0 };
  let robotCell = null;
  let energy = 100;
  let score = 0;
  let completedTasks = [];
  const movementEnergyCost = 5;
  
  // Hücre boyutlarını hesapla
  let cellWidth = 0;
  let cellHeight = 0;
  let gridRect = null;

  // Harita hücrelerini oluştur
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      let cell = document.createElement("div");
      cell.className = "map-cell";
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.style.backgroundColor = "#fff";
      cell.style.border = "1px solid #bdc3c7";
      cell.style.borderRadius = "5px";
      cell.style.display = "flex";
      cell.style.justifyContent = "center";
      cell.style.alignItems = "center";
      cell.style.flexDirection = "column";
      cell.style.cursor = "pointer";
      cell.style.position = "relative";
      cell.style.transition = "all 0.2s";
      
      // Hücre içerik ve bilgileri
      const cellData = mapData.find(item => item.x === x && item.y === y);
      if (cellData) {
        cell.dataset.type = cellData.type;
        if (cellData.taskType) cell.dataset.taskType = cellData.taskType;
        if (cellData.points) cell.dataset.points = cellData.points;
        if (cellData.energyCost) cell.dataset.energyCost = cellData.energyCost;
        if (cellData.energyBoost) cell.dataset.energyBoost = cellData.energyBoost;
        
        // İkon gösterimi
        let icon = document.createElement("span");
        icon.style.fontSize = "1.5em";
        icon.innerText = cellData.icon;
        cell.appendChild(icon);
        
        // Hücre bilgi etiketi (hover olunca görünür)
        let tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.innerText = cellData.description;
        tooltip.style.position = "absolute";
        tooltip.style.bottom = "-30px";
        tooltip.style.left = "50%";
        tooltip.style.transform = "translateX(-50%)";
        tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        tooltip.style.color = "white";
        tooltip.style.padding = "3px 8px";
        tooltip.style.borderRadius = "4px";
        tooltip.style.fontSize = "0.7em";
        tooltip.style.whiteSpace = "nowrap";
        tooltip.style.zIndex = "10";
        tooltip.style.opacity = "0";
        tooltip.style.transition = "opacity 0.2s";
        cell.appendChild(tooltip);
        
        cell.addEventListener("mouseenter", () => {
          tooltip.style.opacity = "1";
        });
        
        cell.addEventListener("mouseleave", () => {
          tooltip.style.opacity = "0";
        });
        
        // Başlangıç hücresiyse işaretle
        if (cellData.type === "start") {
          cell.style.backgroundColor = "#d6eaf8";
          robotCell = cell;
        }
      }

      // Tıklama olayı
      cell.addEventListener("click", () => {
        const cellX = parseInt(cell.dataset.x);
        const cellY = parseInt(cell.dataset.y);
        
        if (isAdjacentCell(cellX, cellY, robotPosition.x, robotPosition.y)) {
          moveRobot(cellX, cellY);
        } else {
          playWrongSound();
          showMessage("Robot sadece yanındaki bir hücreye hareket edebilir!", "error");
        }
      });
      
      mapGrid.appendChild(cell);
    }
  }

  // Grid boyutlarını hesapla ve robotu başlangıç konumuna yerleştir
  setTimeout(() => {
    gridRect = mapGrid.getBoundingClientRect();
    const cells = document.querySelectorAll(".map-cell");
    if (cells.length > 0) {
      const cellRect = cells[0].getBoundingClientRect();
      cellWidth = cellRect.width;
      cellHeight = cellRect.height;
      
      // Robot pozisyonunu başlangıçta ayarla
      positionRobot(0, 0);
    }
  }, 100);

  // SAĞ PANEL - Kontrol Paneli
  let controlPanel = document.createElement("div");
  controlPanel.style.flex = "4";
  controlPanel.style.backgroundColor = "#ecf0f1";
  controlPanel.style.borderRadius = "12px";
  controlPanel.style.padding = "15px";
  controlPanel.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  controlPanel.style.display = "flex";
  controlPanel.style.flexDirection = "column";
  controlPanel.style.gap = "15px";
  gameArea.appendChild(controlPanel);

  // Kontrol paneli başlığı
  let controlTitle = document.createElement("h4");
  controlTitle.innerText = "Robot Kontrol Paneli";
  controlTitle.style.textAlign = "center";
  controlTitle.style.margin = "0";
  controlTitle.style.color = "#000000"; // Siyah renk
  controlPanel.appendChild(controlTitle);

  // Enerji Göstergesi
  let energyContainer = document.createElement("div");
  energyContainer.style.marginTop = "10px";
  controlPanel.appendChild(energyContainer);

  let energyLabel = document.createElement("div");
  energyLabel.innerText = "Enerji Seviyesi:";
  energyLabel.style.fontSize = "0.9em";
  energyLabel.style.fontWeight = "bold";
  energyLabel.style.marginBottom = "5px";
  energyLabel.style.color = "#000000"; // Siyah renk
  energyContainer.appendChild(energyLabel);

  let energyBarOuter = document.createElement("div");
  energyBarOuter.style.width = "100%";
  energyBarOuter.style.height = "20px";
  energyBarOuter.style.backgroundColor = "#ecf0f1";
  energyBarOuter.style.borderRadius = "10px";
  energyBarOuter.style.overflow = "hidden";
  energyBarOuter.style.border = "1px solid #bdc3c7";
  energyContainer.appendChild(energyBarOuter);

  let energyBarInner = document.createElement("div");
  energyBarInner.style.width = "100%";
  energyBarInner.style.height = "100%";
  energyBarInner.style.backgroundColor = "#2ecc71";
  energyBarInner.style.borderRadius = "8px";
  energyBarInner.style.transition = "all 0.3s";
  energyBarOuter.appendChild(energyBarInner);

  let energyText = document.createElement("div");
  energyText.innerText = `${energy} / 100`;
  energyText.style.textAlign = "center";
  energyText.style.fontSize = "0.8em";
  energyText.style.color = "#000000"; // Siyah renk
  energyText.style.marginTop = "5px";
  energyContainer.appendChild(energyText);

  // Puan Göstergesi
  let scoreContainer = document.createElement("div");
  scoreContainer.style.marginTop = "5px";
  controlPanel.appendChild(scoreContainer);

  let scoreLabel = document.createElement("div");
  scoreLabel.innerText = "Puan:";
  scoreLabel.style.fontSize = "0.9em";
  scoreLabel.style.fontWeight = "bold";
  scoreLabel.style.marginBottom = "5px";
  scoreLabel.style.color = "#000000"; // Siyah renk
  scoreContainer.appendChild(scoreLabel);

  let scoreText = document.createElement("div");
  scoreText.innerText = `${score}`;
  scoreText.style.fontSize = "1.5em";
  scoreText.style.fontWeight = "bold";
  scoreText.style.color = "#2980b9";
  scoreText.style.textAlign = "center";
  scoreContainer.appendChild(scoreText);

  // Bilgi Paneli - Son Eylemler
  let actionsContainer = document.createElement("div");
  actionsContainer.style.marginTop = "10px";
  actionsContainer.style.flex = "1";
  actionsContainer.style.overflowY = "auto";
  controlPanel.appendChild(actionsContainer);

  let actionsLabel = document.createElement("div");
  actionsLabel.innerText = "Son Eylemler:";
  actionsLabel.style.fontSize = "0.9em";
  actionsLabel.style.fontWeight = "bold";
  actionsLabel.style.marginBottom = "5px";
  actionsLabel.style.color = "#000000"; // Siyah renk
  actionsContainer.appendChild(actionsLabel);

  let actionsList = document.createElement("div");
  actionsList.style.fontSize = "0.8em";
  actionsList.style.backgroundColor = "#fff";
  actionsList.style.borderRadius = "5px";
  actionsList.style.padding = "8px";
  actionsList.style.height = "120px";
  actionsList.style.overflowY = "auto";
  actionsList.style.border = "1px solid #bdc3c7";
  actionsList.style.color = "#000000"; // Siyah renk
  actionsContainer.appendChild(actionsList);

  // İlk eylem kaydı
  addActionLog("Robot aktif! Görevleri tamamlamak için haritadaki noktaları tıkla.");

  // Alt bilgi paneli
  let infoPanel = document.createElement("div");
  infoPanel.style.marginTop = "10px";
  controlPanel.appendChild(infoPanel);

  let infoPanelContent = document.createElement("div");
  infoPanelContent.style.color = "#000000"; // Siyah renk
  infoPanelContent.innerHTML = `
    <div style="font-size: 0.8em; margin-bottom: 5px;"><strong>Enerji Maliyetleri:</strong></div>
    <div style="font-size: 0.7em; display: grid; grid-template-columns: auto auto; gap: 5px; margin-left: 5px; color: #000000;">
      <div>• Hareket Etme:</div><div>5 enerji</div>
      <div>• Analiz/Tarama:</div><div>10 enerji</div>
      <div>• Nesne Kaldırma:</div><div>15 enerji</div>
      <div>• Engel Aşma:</div><div>20 enerji</div>
      <div>• İletişim Kurma:</div><div>8 enerji</div>
      <div>• Şarj İstasyonu:</div><div>+30 enerji</div>
    </div>
  `;
  infoPanel.appendChild(infoPanelContent);

    // Yardımcı Fonksiyonlar
    function positionRobot(x, y) {
      // Grid içindeki konuma göre robot pozisyonunu hesapla
      if (gridRect && cellWidth && cellHeight) {
        const offsetX = (cellWidth * x) + (cellWidth / 2) - 15; // Ortalama için -15
        const offsetY = (cellHeight * y) + (cellHeight / 2) - 15;
        
        robotElement.style.left = `${offsetX}px`;
        robotElement.style.top = `${offsetY}px`;
      }
    }
  
    function isAdjacentCell(x1, y1, x2, y2) {
      // Yatay, dikey veya çapraz komşu mu kontrol et
      const dx = Math.abs(x1 - x2);
      const dy = Math.abs(y1 - y2);
      return (dx <= 1 && dy <= 1) && !(dx === 0 && dy === 0);
    }
  
    function updateEnergyDisplay() {
      // Enerji çubuğu rengi ve genişliğini güncelle
      const percentage = Math.max(0, Math.min(100, energy));
      energyBarInner.style.width = `${percentage}%`;
      
      // Enerji seviyesine göre renk değiştir
      if (percentage > 60) {
        energyBarInner.style.backgroundColor = "#2ecc71"; // Yeşil
      } else if (percentage > 30) {
        energyBarInner.style.backgroundColor = "#f39c12"; // Turuncu
      } else {
        energyBarInner.style.backgroundColor = "#e74c3c"; // Kırmızı
      }
      
      energyText.innerText = `${energy} / 100`;
    }
  
    function updateScoreDisplay() {
      scoreText.innerText = `${score}`;
    }
  
    function addActionLog(message) {
      let logItem = document.createElement("div");
      logItem.innerText = `• ${message}`;
      logItem.style.marginBottom = "3px";
      logItem.style.borderBottom = "1px solid #ecf0f1";
      logItem.style.paddingBottom = "3px";
      logItem.style.color = "#000000"; // Siyah renk
      actionsList.prepend(logItem);
      
      // Scroll liste başına
      actionsList.scrollTop = 0;
    }
  
    function moveRobot(x, y) {
      // Enerji kontrolü
      if (energy < movementEnergyCost) {
        playWrongSound();
        showMessage("Yeterli enerji yok! En az 5 enerji gerekiyor.", "error");
        // Enerji yetersiz olduğunda başarısız olduğunu göster ve bölümü yeniden başlat
        showFailMessage("Hareket için yeterli enerji yok! En az 5 enerji gerekiyor.");
        return;
      }
      
      // Enerjiyi düşür
      energy -= movementEnergyCost;
      updateEnergyDisplay();
      
      // Robotun eski konumundan arka plan rengini kaldır
      if (robotCell) {
        const isStartCell = robotCell.dataset.type === "start";
        robotCell.style.backgroundColor = isStartCell ? "#d6eaf8" : "#fff";
      }
      
      // Yeni konum
      robotPosition = { x, y };
      
      // Robot animasyonu
      positionRobot(x, y);
      
      // Tıklanan hücreyi bul
      const cells = document.querySelectorAll(".map-cell");
      cells.forEach(cell => {
        if (parseInt(cell.dataset.x) === x && parseInt(cell.dataset.y) === y) {
          robotCell = cell;
          cell.style.backgroundColor = "#d6eaf8"; // Robotun bulunduğu hücre
        }
      });
      
      // Loglama
      addActionLog(`Robot (${x},${y}) konumuna hareket etti. (-5 enerji)`);
      
      // Hücre türüne göre işlem yap (biraz gecikme ekleyerek daha iyi kullanıcı deneyimi)
      setTimeout(() => {
        checkCellAction(robotCell);
      }, 400);
    }
  
    function checkCellAction(cell) {
      const type = cell.dataset.type;
      
      // Görev hücresi ise
      if (type === "task") {
        const taskType = cell.dataset.taskType;
        const points = parseInt(cell.dataset.points);
        const energyCost = parseInt(cell.dataset.energyCost);
        const taskId = `${cell.dataset.x}-${cell.dataset.y}`;
        
        // Bu görev daha önce tamamlanmış mı kontrol et
        if (completedTasks.includes(taskId)) {
          addActionLog("Bu görev zaten tamamlandı.");
          return;
        }
        
        // Yeterli enerji var mı?
        if (energy < energyCost) {
          playWrongSound();
          showMessage(`Bu görev için yeterli enerji yok! ${energyCost} enerji gerekiyor.`, "error");
          // Görev için enerji yetersiz olduğunda başarısız olduğunu göster ve bölümü yeniden başlat
          showFailMessage(`Bu görev için yeterli enerji yok! ${energyCost} enerji gerekiyor. Başka bir strateji dene.`);
          return;
        }
        
        // Görev türüne göre işlem
        let taskName = "";
        switch (taskType) {
          case "analyze":
            taskName = "Analiz";
            break;
          case "lift":
            taskName = "Kaldırma";
            break;
          case "communicate":
            taskName = "İletişim";
            break;
          case "obstacle":
            taskName = "Engel Aşma";
            break;
        }
        
        // Enerjiyi düşür, puanı artır
        energy -= energyCost;
        score += points;
        updateEnergyDisplay();
        updateScoreDisplay();
        
        // Görev tamamlandı olarak işaretle
        completedTasks.push(taskId);
        cell.style.border = "2px solid #27ae60";
        
        // Loglama
        addActionLog(`${taskName} görevi tamamlandı! +${points} puan, -${energyCost} enerji`);
        playCorrectSound();
        
        // Görev tamamlandığında hafif görsel efekt
        cell.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.1)" },
            { transform: "scale(1)" }
          ],
          {
            duration: 500,
            iterations: 1
          }
        );
        
        // Robot'un da bir animasyonu olsun
        robotElement.animate(
          [
            { transform: "rotate(0deg)" },
            { transform: "rotate(20deg)" },
            { transform: "rotate(-20deg)" },
            { transform: "rotate(0deg)" }
          ],
          {
            duration: 600,
            iterations: 1
          }
        );
        
        // Tüm görevler tamamlandı mı kontrol et
        const totalTasks = mapData.filter(item => item.type === "task").length;
        if (completedTasks.length >= totalTasks || completedTasks.length >= 5) {
          // Bulmaca tamamlandı
          setTimeout(showCompletionMessage, 800);
        }
        
        // Enerji yetersiz duruma düştü mü kontrol et (minimum hareket enerjisi için)
        if (energy < movementEnergyCost) {
          // Hareket edecek enerji kalmadı, başarısız olduğunu göster ve bölümü yeniden başlat
          setTimeout(() => {
            showFailMessage("Hareket edecek yeterli enerji kalmadı! Başka bir strateji dene.");
          }, 600);
        }
      }
      // Şarj istasyonu ise
      else if (type === "charger") {
        const energyBoost = parseInt(cell.dataset.energyBoost);
        
        // Enerjiyi artır (maksimum 100)
        energy = Math.min(100, energy + energyBoost);
        updateEnergyDisplay();
        
        // Loglama
        addActionLog(`Robot şarj oldu! +${energyBoost} enerji`);
        
        // Şarj efekti
        cell.animate(
          [
            { backgroundColor: "#fff" },
            { backgroundColor: "#f1c40f" },
            { backgroundColor: "#fff" }
          ],
          {
            duration: 1000,
            iterations: 1
          }
        );
        
        // Robot şarj animasyonu
        robotElement.animate(
          [
            { filter: "brightness(1)" },
            { filter: "brightness(1.5)" },
            { filter: "brightness(1)" }
          ],
          {
            duration: 1000,
            iterations: 1
          }
        );
      }
    }
  
    // Başarısız olma durumunda mesaj göster ve bölümü yeniden başlat
    function showFailMessage(failMessage) {
      // Oyun alanını devre dışı bırak
      mapGrid.style.pointerEvents = "none";
      
      // Başarısız olma efekti
      robotElement.animate(
        [
          { filter: "brightness(1)" },
          { filter: "brightness(0.5)" },
          { filter: "brightness(0.2)" }
        ],
        {
          duration: 800,
          iterations: 1,
          fill: "forwards"
        }
      );
      
      // Başarısız olma mesajı
      playWrongSound();
      
      // Hemen başarısız mesaj kartını göster
      // Mevcut oyun alanını temizle
      mainContainer.innerHTML = "";
      
      // Başarısız mesaj kartı
      let failCard = document.createElement("div");
      failCard.style.width = "90%";
      failCard.style.maxWidth = "600px";
      failCard.style.backgroundColor = "white";
      failCard.style.borderRadius = "12px";
      failCard.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
      failCard.style.padding = "25px";
      failCard.style.display = "flex";
      failCard.style.flexDirection = "column";
      failCard.style.alignItems = "center";
      failCard.style.gap = "20px";
      mainContainer.appendChild(failCard);
      
      // Başarısız başlık
      let failTitle = document.createElement("h3");
      failTitle.innerText = "Enerji Yetersiz! 🔋";
      failTitle.style.margin = "0";
      failTitle.style.fontSize = "1.5em";
      failTitle.style.color = "#e74c3c";
      failCard.appendChild(failTitle);
      
      // Başarısız mesaj
      let failMessageElement = document.createElement("p");
      failMessageElement.innerHTML = failMessage || "Robotun enerjisi yetersiz kaldı. Daha verimli bir strateji denemelisin!";
      failMessageElement.style.textAlign = "center";
      failMessageElement.style.lineHeight = "1.5";
      failMessageElement.style.margin = "10px 0";
      failMessageElement.style.color = "#000000";
      failCard.appendChild(failMessageElement);
      
      // İpucu mesajı
      let hintMessage = document.createElement("p");
      hintMessage.innerHTML = "<strong>İpucu:</strong> Önce şarj istasyonunu bulmayı dene ve enerji maliyeti düşük görevleri önceliklendir. Her hareketi dikkatli planla!";
      hintMessage.style.fontSize = "0.9em";
      hintMessage.style.color = "#000000";
      hintMessage.style.textAlign = "center";
      hintMessage.style.padding = "10px";
      hintMessage.style.backgroundColor = "#f9f9f9";
      hintMessage.style.borderRadius = "5px";
      failCard.appendChild(hintMessage);
      
      // Yeniden başlat butonu
      let retryButton = document.createElement("button");
      retryButton.innerText = "Tekrar Dene";
      retryButton.style.backgroundColor = "#e74c3c";
      retryButton.style.color = "white";
      retryButton.style.border = "none";
      retryButton.style.padding = "12px 24px";
      retryButton.style.borderRadius = "30px";
      retryButton.style.fontSize = "1em";
      retryButton.style.fontWeight = "bold";
      retryButton.style.cursor = "pointer";
      retryButton.style.transition = "background-color 0.3s";
      retryButton.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
      retryButton.style.margin = "10px 0";
      
      retryButton.addEventListener("mouseover", function() {
        this.style.backgroundColor = "#c0392b";
      });
      
      retryButton.addEventListener("mouseout", function() {
        this.style.backgroundColor = "#e74c3c";
      });
      
      retryButton.addEventListener("click", function() {
        playClickSound();
        restartPuzzle();
      });
      
      failCard.appendChild(retryButton);
    }
  
    // Bulmacayı yeniden başlat
    function restartPuzzle() {
      // Mevcut bulmacayı temizle ve yeniden başlat
      puzzleArea.innerHTML = "";
      setupPlanet5Puzzle3();
    }
  
    // Tamamlama mesajını göster
    function showCompletionMessage() {
      // Mevcut oyun alanını temizle
      mainContainer.innerHTML = "";
      
      // Sonuç kartı
      let completionCard = document.createElement("div");
      completionCard.style.width = "90%";
      completionCard.style.maxWidth = "600px";
      completionCard.style.backgroundColor = "white";
      completionCard.style.borderRadius = "12px";
      completionCard.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
      completionCard.style.padding = "25px";
      completionCard.style.display = "flex";
      completionCard.style.flexDirection = "column";
      completionCard.style.alignItems = "center";
      completionCard.style.gap = "20px";
      completionCard.style.position = "relative";
      completionCard.style.overflow = "hidden";
      mainContainer.appendChild(completionCard);
      
      // Başarı durumuna göre tebrik mesajı
      let congratsTitle = document.createElement("h3");
      
      if (completedTasks.length >= 5) {
        congratsTitle.innerText = "Harika İş! 🎉";
        congratsTitle.style.color = "#27ae60";
      } else if (completedTasks.length >= 3) {
        congratsTitle.innerText = "İyi İş! 👍";
        congratsTitle.style.color = "#f39c12";
      } else {
        congratsTitle.innerText = "Daha Verimli Olabilirsin 🤔";
        congratsTitle.style.color = "#3498db";
      }
      
      congratsTitle.style.margin = "0";
      congratsTitle.style.fontSize = "1.5em";
      completionCard.appendChild(congratsTitle);
      
      // Sonuç bilgileri
      let resultsContainer = document.createElement("div");
      resultsContainer.style.width = "80%";
      resultsContainer.style.display = "flex";
      resultsContainer.style.justifyContent = "space-between";
      resultsContainer.style.margin = "10px 0";
      completionCard.appendChild(resultsContainer);
      
      // Toplam puan
      let scoreResult = document.createElement("div");
      scoreResult.style.textAlign = "center";
      scoreResult.style.color = "#000000"; // Siyah renk
      scoreResult.innerHTML = `<div style="font-size: 1.2em; font-weight: bold; color: #2980b9;">${score}</div><div style="font-size: 0.9em;">Toplam Puan</div>`;
      resultsContainer.appendChild(scoreResult);
      
      // Kalan enerji
      let energyResult = document.createElement("div");
      energyResult.style.textAlign = "center";
      energyResult.style.color = "#000000"; // Siyah renk
      energyResult.innerHTML = `<div style="font-size: 1.2em; font-weight: bold; color: #27ae60;">${energy}</div><div style="font-size: 0.9em;">Kalan Enerji</div>`;
      resultsContainer.appendChild(energyResult);
      
      // Tamamlanan görevler
      let tasksResult = document.createElement("div");
      tasksResult.style.textAlign = "center";
      tasksResult.style.color = "#000000"; // Siyah renk
      tasksResult.innerHTML = `<div style="font-size: 1.2em; font-weight: bold; color: #e74c3c;">${completedTasks.length}</div><div style="font-size: 0.9em;">Tamamlanan Görevler</div>`;
      resultsContainer.appendChild(tasksResult);
      
      // Tebrik mesajı
      let congratsMessage = document.createElement("p");
      congratsMessage.innerHTML = `Robot enerji yönetimi, yapay zeka sistemlerinin verimli çalışması için çok önemlidir. Gerçek robotlarda da enerji sınırlıdır ve kaynakların akıllıca kullanılması gerekir. Bu deneyim, robotik sistemlerde kaynak yönetiminin ne kadar kritik olduğunu gösterdi!`;
      congratsMessage.style.textAlign = "center";
      congratsMessage.style.lineHeight = "1.5";
      congratsMessage.style.margin = "10px 0";
      congratsMessage.style.color = "#000000"; // Siyah renk
      completionCard.appendChild(congratsMessage);
      
      // İpucu mesajı
      if (completedTasks.length < 5) {
        let hintMessage = document.createElement("p");
        hintMessage.innerHTML = `<strong>İpucu:</strong> Daha fazla görev tamamlamak için önce şarj istasyonunu kullanabilir veya düşük enerji gerektiren görevleri önceliklendirebilirsin.`;
        hintMessage.style.fontSize = "0.9em";
        hintMessage.style.color = "#000000"; // Siyah renk
        hintMessage.style.textAlign = "center";
        hintMessage.style.padding = "10px";
        hintMessage.style.backgroundColor = "#f9f9f9";
        hintMessage.style.borderRadius = "5px";
        completionCard.appendChild(hintMessage);
      }
      
      // Sonraki bulmaca butonu
      let nextButton = document.createElement("button");
      nextButton.innerText = "Sonraki Bulmaca";
      nextButton.style.backgroundColor = "#2980b9";
      nextButton.style.color = "white";
      nextButton.style.border = "none";
      nextButton.style.padding = "12px 24px";
      nextButton.style.borderRadius = "30px";
      nextButton.style.fontSize = "1em";
      nextButton.style.fontWeight = "bold";
      nextButton.style.cursor = "pointer";
      nextButton.style.transition = "background-color 0.3s";
      nextButton.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
      nextButton.style.margin = "10px 0";
      
      nextButton.addEventListener("mouseover", function() {
        this.style.backgroundColor = "#3498db";
      });
      
      nextButton.addEventListener("mouseout", function() {
        this.style.backgroundColor = "#2980b9";
      });
      
      nextButton.addEventListener("click", function() {
        playClickSound();
        goNextPuzzle();
      });
      
      completionCard.appendChild(nextButton);
      
      // Konfeti efekti
      if (completedTasks.length >= 3) {
        addConfetti();
      }
    }
  
    // Konfeti efekti
    function addConfetti() {
      // Konfeti konteyneri
      let confettiContainer = document.createElement("div");
      confettiContainer.style.position = "absolute";
      confettiContainer.style.top = "0";
      confettiContainer.style.left = "0";
      confettiContainer.style.width = "100%";
      confettiContainer.style.height = "100%";
      confettiContainer.style.pointerEvents = "none";
      confettiContainer.style.zIndex = "5";
      confettiContainer.style.overflow = "hidden";
      mainContainer.appendChild(confettiContainer);
      
      // Konfeti parçacıklarını oluştur
      const colors = ["#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#e74c3c"];
      
      for (let i = 0; i < 80; i++) {
        let confetti = document.createElement("div");
        confetti.style.position = "absolute";
        confetti.style.width = (Math.random() * 10 + 5) + "px";
        confetti.style.height = (Math.random() * 10 + 5) + "px";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
        confetti.style.top = "-20px";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.transform = "rotate(" + (Math.random() * 360) + "deg)";
        confetti.style.opacity = Math.random() + 0.4;
        confettiContainer.appendChild(confetti);
        
        // Animasyon
        const animationDuration = Math.random() * 3 + 2;
        const animationDelay = Math.random() * 2;
        
        confetti.animate(
          [
            { top: "-20px", transform: "rotate(0deg)" },
            { top: confettiContainer.offsetHeight + "px", transform: "rotate(720deg)" }
          ],
          {
            duration: animationDuration * 1000,
            delay: animationDelay * 1000,
            easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
            iterations: 1,
            fill: "forwards"
          }
        );
        
        // Konfeti temizleme
        setTimeout(() => {
          confetti.remove();
        }, (animationDuration + animationDelay) * 1000);
      }
      
      // Konfeti konteyneri temizleme
      setTimeout(() => {
        confettiContainer.remove();
      }, 7000);
    }
  }

function setupPlanet5Puzzle4() {
  puzzleHintText.innerText = "IPUCU: Robottaki arızaları bulmak için parçalarını incele ve sorunları çöz.";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "10px"; // Daha sıkı yerleşim
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme kutusu
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(231, 76, 60, 0.1)"; // Kırmızı tema
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "10px"; // Daha küçük padding
  infoBox.style.border = "2px solid rgba(231, 76, 60, 0.3)";
  infoBox.style.width = "90%";
  infoBox.style.maxWidth = "700px";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  mainContainer.appendChild(infoBox);

  // Bilgilendirme başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "🤖 Robot Tamir Atölyesi 🔧";
  infoTitle.style.margin = "0 0 5px 0"; // Margin azaltıldı
  infoTitle.style.color = "#000000";
  infoTitle.style.fontSize = "1.2em";
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni
  let infoText = document.createElement("p");
  infoText.innerHTML = "Yardımcı robotumuz <strong>Bilge</strong> birden fazla sorunla karşılaştı ve çalışmıyor! Robot teknisyeni olarak, sorunları bulup çözmen gerekiyor. Robotun parçalarını inceleyerek arızalı bölümleri tespit et ve doğru tamir yöntemlerini seç.";
  infoText.style.margin = "0";
  infoText.style.fontSize = "0.9em"; // Daha küçük font
  infoText.style.lineHeight = "1.3";
  infoText.style.color = "#000000";
  infoBox.appendChild(infoText);

  // Oyun alanı
  let gameArea = document.createElement("div");
  gameArea.style.display = "flex";
  gameArea.style.width = "100%";
  gameArea.style.maxWidth = "700px";
  gameArea.style.marginTop = "5px"; // Margin azaltıldı
  gameArea.style.gap = "15px"; // Gap azaltıldı
  gameArea.style.flexDirection = "column";
  mainContainer.appendChild(gameArea);

  // Robot ve teşhis paneli
  let interactiveArea = document.createElement("div");
  interactiveArea.style.display = "flex";
  interactiveArea.style.width = "100%";
  interactiveArea.style.gap = "15px"; // Gap azaltıldı
  interactiveArea.style.justifyContent = "center";
  interactiveArea.style.alignItems = "stretch";
  gameArea.appendChild(interactiveArea);

  // Robot görünümü (sol panel)
  let robotPanel = document.createElement("div");
  robotPanel.style.flex = "1";
  robotPanel.style.backgroundColor = "#f5f5f5";
  robotPanel.style.borderRadius = "12px";
  robotPanel.style.padding = "10px"; // Padding azaltıldı
  robotPanel.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  robotPanel.style.position = "relative";
  robotPanel.style.display = "flex";
  robotPanel.style.flexDirection = "column";
  robotPanel.style.alignItems = "center";
  robotPanel.style.justifyContent = "space-between";
  robotPanel.style.minHeight = "320px"; // Daha kısa
  interactiveArea.appendChild(robotPanel);

  // Robot başlığı
  let robotTitle = document.createElement("h4");
  robotTitle.innerText = "Robot Bilge";
  robotTitle.style.textAlign = "center";
  robotTitle.style.margin = "0 0 5px 0"; // Margin azaltıldı
  robotTitle.style.color = "#000000";
  robotPanel.appendChild(robotTitle);

  // Robot görsel alanı
  let robotImageContainer = document.createElement("div");
  robotImageContainer.style.position = "relative";
  robotImageContainer.style.width = "180px"; // Daha küçük
  robotImageContainer.style.height = "260px"; // Daha kısa
  robotImageContainer.style.margin = "0 auto";
  robotPanel.appendChild(robotImageContainer);

  // Robot resmi (ana gövde)
  let robotBody = document.createElement("div");
  robotBody.style.position = "absolute";
  robotBody.style.width = "100%";
  robotBody.style.height = "100%";
  robotBody.style.display = "flex";
  robotBody.style.flexDirection = "column";
  robotBody.style.alignItems = "center";
  robotBody.style.justifyContent = "center";
  robotImageContainer.appendChild(robotBody);

  // Robot kafa
  let robotHead = document.createElement("div");
  robotHead.id = "robot-head";
  robotHead.className = "robot-part";
  robotHead.dataset.part = "head";
  robotHead.style.width = "90px"; // Daha küçük
  robotHead.style.height = "70px"; // Daha küçük
  robotHead.style.backgroundColor = "#bdc3c7";
  robotHead.style.borderRadius = "15px 15px 5px 5px";
  robotHead.style.position = "relative";
  robotHead.style.marginBottom = "5px";
  robotHead.style.cursor = "pointer";
  robotHead.style.border = "2px solid #95a5a6";
  robotHead.style.transition = "all 0.2s";
  robotHead.style.display = "flex";
  robotHead.style.justifyContent = "center";
  robotHead.style.alignItems = "center";

  // Robot gözler
  let robotEyes = document.createElement("div");
  robotEyes.style.display = "flex";
  robotEyes.style.gap = "15px";
  robotHead.appendChild(robotEyes);

  // Sol göz
  let leftEye = document.createElement("div");
  leftEye.style.width = "20px";
  leftEye.style.height = "20px";
  leftEye.style.borderRadius = "50%";
  leftEye.style.backgroundColor = "#e74c3c"; // Arızalı göz
  leftEye.style.transition = "background-color 0.5s";
  robotEyes.appendChild(leftEye);

  // Sağ göz
  let rightEye = document.createElement("div");
  rightEye.style.width = "20px";
  rightEye.style.height = "20px";
  rightEye.style.borderRadius = "50%";
  rightEye.style.backgroundColor = "#e74c3c"; // Arızalı göz
  rightEye.style.transition = "background-color 0.5s";
  robotEyes.appendChild(rightEye);

  robotBody.appendChild(robotHead);

  // Robot gövde
  let robotTorso = document.createElement("div");
  robotTorso.id = "robot-torso";
  robotTorso.className = "robot-part";
  robotTorso.dataset.part = "torso";
  robotTorso.style.width = "110px"; // Daha küçük
  robotTorso.style.height = "110px"; // Daha küçük
  robotTorso.style.backgroundColor = "#bdc3c7";
  robotTorso.style.borderRadius = "10px";
  robotTorso.style.position = "relative";
  robotTorso.style.cursor = "pointer";
  robotTorso.style.border = "2px solid #95a5a6";
  robotTorso.style.transition = "all 0.2s";
  robotTorso.style.display = "flex";
  robotTorso.style.flexDirection = "column";
  robotTorso.style.justifyContent = "center";
  robotTorso.style.alignItems = "center";
  
  // Kontrol paneli
  let controlPanel = document.createElement("div");
  controlPanel.style.width = "65px"; // Daha küçük
  controlPanel.style.height = "35px"; // Daha küçük
  controlPanel.style.backgroundColor = "#7f8c8d";
  controlPanel.style.borderRadius = "5px";
  controlPanel.style.display = "flex";
  controlPanel.style.alignItems = "center";
  controlPanel.style.justifyContent = "center";
  
  // Güç ışığı
  let powerLight = document.createElement("div");
  powerLight.style.width = "15px";
  powerLight.style.height = "15px";
  powerLight.style.borderRadius = "50%";
  powerLight.style.backgroundColor = "#e74c3c"; // Kırmızı - arızalı
  powerLight.id = "power-light";
  powerLight.style.transition = "background-color 0.5s";
  powerLight.style.boxShadow = "0 0 5px #e74c3c";
  controlPanel.appendChild(powerLight);
  
  robotTorso.appendChild(controlPanel);
  robotBody.appendChild(robotTorso);

  // Robot kolları
  let robotArms = document.createElement("div");
  robotArms.style.display = "flex";
  robotArms.style.justifyContent = "space-between";
  robotArms.style.width = "160px"; // Daha küçük
  robotArms.style.position = "absolute";
  robotArms.style.top = "125px"; // Konum ayarlandı
  
  // Sol kol
  let leftArm = document.createElement("div");
  leftArm.id = "robot-left-arm";
  leftArm.className = "robot-part";
  leftArm.dataset.part = "leftArm";
  leftArm.style.width = "22px"; // Daha küçük
  leftArm.style.height = "70px"; // Daha küçük
  leftArm.style.backgroundColor = "#bdc3c7";
  leftArm.style.borderRadius = "5px";
  leftArm.style.cursor = "pointer";
  leftArm.style.border = "2px solid #95a5a6";
  robotArms.appendChild(leftArm);
  
  // Sağ kol
  let rightArm = document.createElement("div");
  rightArm.id = "robot-right-arm";
  rightArm.className = "robot-part";
  rightArm.dataset.part = "rightArm";
  rightArm.style.width = "22px"; // Daha küçük
  rightArm.style.height = "70px"; // Daha küçük
  rightArm.style.backgroundColor = "#bdc3c7";
  rightArm.style.borderRadius = "5px";
  rightArm.style.cursor = "pointer";
  rightArm.style.border = "2px solid #95a5a6";
  robotArms.appendChild(rightArm);
  
  robotBody.appendChild(robotArms);

  // Robot bacakları
  let robotLegs = document.createElement("div");
  robotLegs.style.display = "flex";
  robotLegs.style.justifyContent = "space-between";
  robotLegs.style.width = "70px"; // Daha küçük
  robotLegs.style.position = "absolute";
  robotLegs.style.bottom = "0";
  
  // Sol bacak
  let leftLeg = document.createElement("div");
  leftLeg.id = "robot-left-leg";
  leftLeg.className = "robot-part";
  leftLeg.dataset.part = "leftLeg";
  leftLeg.style.width = "22px"; // Daha küçük
  leftLeg.style.height = "60px"; // Daha küçük
  leftLeg.style.backgroundColor = "#bdc3c7";
  leftLeg.style.borderRadius = "5px";
  leftLeg.style.cursor = "pointer";
  leftLeg.style.border = "2px solid #95a5a6";
  robotLegs.appendChild(leftLeg);
  
  // Sağ bacak
  let rightLeg = document.createElement("div");
  rightLeg.id = "robot-right-leg";
  rightLeg.className = "robot-part";
  rightLeg.dataset.part = "rightLeg";
  rightLeg.style.width = "22px"; // Daha küçük
  rightLeg.style.height = "60px"; // Daha küçük
  rightLeg.style.backgroundColor = "#bdc3c7";
  rightLeg.style.borderRadius = "5px";
  rightLeg.style.cursor = "pointer";
  rightLeg.style.border = "2px solid #95a5a6";
  robotLegs.appendChild(rightLeg);
  
  robotBody.appendChild(robotLegs);

  // Teşhis paneli (sağ panel)
  let diagnosisPanel = document.createElement("div");
  diagnosisPanel.style.flex = "1";
  diagnosisPanel.style.backgroundColor = "#f5f5f5";
  diagnosisPanel.style.borderRadius = "12px";
  diagnosisPanel.style.padding = "10px"; // Padding azaltıldı
  diagnosisPanel.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  diagnosisPanel.style.display = "flex";
  diagnosisPanel.style.flexDirection = "column";
  interactiveArea.appendChild(diagnosisPanel);

  // Teşhis paneli başlığı
  let diagnosisTitle = document.createElement("h4");
  diagnosisTitle.innerText = "Arıza Teşhis Paneli";
  diagnosisTitle.style.textAlign = "center";
  diagnosisTitle.style.margin = "0 0 5px 0"; // Margin azaltıldı
  diagnosisTitle.style.color = "#000000";
  diagnosisPanel.appendChild(diagnosisTitle);

  // Teşhis sonuçları alanı
  let diagnosisResults = document.createElement("div");
  diagnosisResults.id = "diagnosis-results";
  diagnosisResults.style.flex = "1";
  diagnosisResults.style.backgroundColor = "white";
  diagnosisResults.style.border = "1px solid #bdc3c7";
  diagnosisResults.style.borderRadius = "5px";
  diagnosisResults.style.padding = "10px";
  diagnosisResults.style.fontSize = "0.9em";
  diagnosisResults.style.marginBottom = "10px";
  diagnosisResults.style.overflowY = "auto";
  diagnosisResults.style.color = "#000000";
  diagnosisResults.style.minHeight = "150px"; // Minimum yükseklik
  diagnosisResults.style.maxHeight = "150px"; // Maksimum yükseklik
  diagnosisResults.innerHTML = "<p style='text-align: center; color: #000000;'>Robotu incelemek için parçalarına tıkla.</p>";
  diagnosisPanel.appendChild(diagnosisResults);

  // Arıza teşhis butonları
  let diagnosisActionArea = document.createElement("div");
  diagnosisActionArea.style.display = "flex";
  diagnosisActionArea.style.flexDirection = "column";
  diagnosisActionArea.style.gap = "10px";
  diagnosisPanel.appendChild(diagnosisActionArea);

  // Arıza tipleri ve çözümleri
  const faultTypes = [
    {
      id: "power",
      name: "Güç Sistemi Arızası",
      description: "Robot güç alamıyor ve açılmıyor.",
      location: "torso",
      hint: "Robot gövdesinde bulunan güç sistemi çalışmıyor gibi görünüyor. Pil değiştirilmeli mi?",
      solutions: [
        { text: "Pili değiştir", correct: true },
        { text: "Yazılımı yeniden yükle", correct: false },
        { text: "Kabloları değiştir", correct: false }
      ]
    },
    {
      id: "sensor",
      name: "Sensör Arızası",
      description: "Robot çevresini algılayamıyor.",
      location: "head",
      hint: "Robotun kafasındaki sensörler tepki vermiyor. Sensörlerin temizlenmesi gerekiyor olabilir mi?",
      solutions: [
        { text: "Sensörleri temizle", correct: true },
        { text: "Sensörleri kalibre et", correct: false },
        { text: "Sensörleri değiştir", correct: false }
      ]
    },
    {
      id: "motor",
      name: "Motor Arızası",
      description: "Robot hareket edemiyor.",
      location: "leftLeg",
      hint: "Robotun sol bacağındaki motor düzgün çalışmıyor gibi görünüyor. Yağlama yapmak işe yarar mı?",
      solutions: [
        { text: "Motoru yağla", correct: true },
        { text: "Motoru değiştir", correct: false },
        { text: "Motora reset at", correct: false }
      ]
    }
  ];

  // Rastgele 2 arıza seç (farklı olacak şekilde)
  let selectedFaults = [];
  while (selectedFaults.length < 2) {
    const randomFault = faultTypes[Math.floor(Math.random() * faultTypes.length)];
    // Eğer bu arıza daha önce seçilmediyse ekle
    if (!selectedFaults.find(fault => fault.id === randomFault.id)) {
      selectedFaults.push(randomFault);
    }
  }
  
  // Arıza durumu takibi
  let faultsFound = 0;
  let faultsFixed = 0;
  let examinedParts = new Set(); // İncelenen parçaları takip etmek için

  // Robot parçalarını tıklanabilir yap
  const robotParts = document.querySelectorAll(".robot-part");
  robotParts.forEach(part => {
    // Hover efekti
    part.addEventListener("mouseenter", function() {
      this.style.backgroundColor = "#a1aab0";
    });
    
    part.addEventListener("mouseleave", function() {
      if (!examinedParts.has(this.dataset.part)) {
        this.style.backgroundColor = "#bdc3c7";
      }
    });
    
    // Tıklama olayı
    part.addEventListener("click", function() {
      if (faultsFixed >= 2) return; // İki arıza da çözüldüyse tıklamaları engelle
      
      const partType = this.dataset.part;
      playClickSound();
      
      // Bu parça daha önce incelendi mi?
      if (examinedParts.has(partType)) {
        showMessage("Bu parçayı zaten inceledin.", "info");
        return;
      }
      
      // Parçayı incelenmiş olarak işaretle
      examinedParts.add(partType);
      this.style.backgroundColor = "#a1aab0";
      
      // İnceleme sonuçlarını ekle
      const resultElement = document.createElement("p");
      resultElement.style.borderBottom = "1px solid #ecf0f1";
      resultElement.style.paddingBottom = "5px";
      resultElement.style.color = "#000000"; // Siyah yazı rengi
      
      // Bu parça arızalı mı kontrol et
      const matchingFault = selectedFaults.find(fault => fault.location === partType);
      
      if (matchingFault) {
        resultElement.style.color = "#e74c3c";
        resultElement.innerHTML = `<strong>${capitalizeFirstLetter(partType)} bölgesinde:</strong> ${matchingFault.hint}`;
        faultsFound++;
        showMessage("Bir sorun buldun! Çözüm için tamir butonlarını kullan.", "success");
        
        // Çözüm butonlarını göster
        showRepairOptions(matchingFault);
      } else {
        resultElement.style.color = "#2ecc71";
        resultElement.innerHTML = `<strong>${capitalizeFirstLetter(partType)} bölgesinde:</strong> Her şey normal görünüyor.`;
        
        // 2 saniye sonra normal mesajı kaldır
        setTimeout(() => {
          if (resultElement.parentNode) {
            resultElement.remove();
          }
        }, 2000);
      }
      
      diagnosisResults.appendChild(resultElement);
    });
  });

  // Arıza çözüm butonlarını göster
  function showRepairOptions(fault) {
    // Başlık ekle
    let repairTitle = document.createElement("h5");
    repairTitle.innerText = `Arıza Tespit Edildi: ${fault.name}`;
    repairTitle.style.margin = "0 0 5px 0";
    repairTitle.style.color = "#000000";
    repairTitle.style.fontSize = "0.9em";
    diagnosisActionArea.appendChild(repairTitle);
    
    // Tamir seçenekleri konteyner
    let optionsContainer = document.createElement("div");
    optionsContainer.style.display = "flex";
    optionsContainer.style.flexDirection = "column";
    optionsContainer.style.gap = "5px";
    optionsContainer.dataset.faultId = fault.id;
    diagnosisActionArea.appendChild(optionsContainer);
    
    // Her çözüm için buton oluştur
    fault.solutions.forEach(solution => {
      let solutionButton = document.createElement("button");
      solutionButton.innerText = solution.text;
      solutionButton.style.padding = "8px 12px";
      solutionButton.style.backgroundColor = "#3498db";
      solutionButton.style.color = "white";
      solutionButton.style.border = "none";
      solutionButton.style.borderRadius = "5px";
      solutionButton.style.cursor = "pointer";
      solutionButton.style.fontSize = "0.85em";
      solutionButton.style.transition = "background-color 0.3s";
      
      solutionButton.addEventListener("mouseover", function() {
        this.style.backgroundColor = "#2980b9";
      });
      
      solutionButton.addEventListener("mouseout", function() {
        this.style.backgroundColor = "#3498db";
      });
      
      solutionButton.addEventListener("click", function() {
        if (solution.correct) {
        playCorrectSound();
          fixPart(fault);
          // Butonları devre dışı bırak
          const buttons = optionsContainer.querySelectorAll("button");
          buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.backgroundColor = "#7f8c8d";
            btn.style.cursor = "not-allowed";
          });
          
          // Başarı mesajı
          let successMsg = document.createElement("p");
          successMsg.innerHTML = `✅ <strong>${fault.name}</strong> başarıyla tamir edildi!`;
          successMsg.style.color = "#27ae60";
          successMsg.style.margin = "5px 0";
          successMsg.style.fontSize = "0.85em";
          optionsContainer.appendChild(successMsg);
          
          showMessage(`${fault.name} başarıyla tamir edildi!`, "success");
      } else {
        playWrongSound();
          showMessage("Bu çözüm işe yaramadı. Tekrar dene.", "error");
        }
      });
      
      optionsContainer.appendChild(solutionButton);
    });
  }

  // Bir parçayı tamir et
  function fixPart(fault) {
    faultsFixed++;
    
    // Eğer tüm arızalar (2 arıza) çözüldüyse robotu tamamen onar
    if (faultsFixed >= 2) {
      fixRobot();
    }
  }

  // Robot tamamen tamir edildiğinde
  function fixRobot() {
    // Robot gözlerini mavi yap
    document.querySelectorAll("#robot-head div div").forEach(eye => {
      eye.style.backgroundColor = "#3498db";
    });
    
    // Güç ışığını yeşil yap
    document.getElementById("power-light").style.backgroundColor = "#2ecc71";
    document.getElementById("power-light").style.boxShadow = "0 0 5px #2ecc71";
    
    // Tamir sonucu mesajı
    let resultMessage = document.createElement("div");
    resultMessage.style.backgroundColor = "#d5f5e3";
    resultMessage.style.color = "#000000";
    resultMessage.style.padding = "10px";
    resultMessage.style.borderRadius = "5px";
    resultMessage.style.textAlign = "center";
    resultMessage.style.marginTop = "10px";
    resultMessage.innerHTML = `
      <h4 style="margin-top: 0; color: #000000;">Robot Bilge Tamamen Tamir Edildi! 🎉</h4>
      <p>Tüm arızalar başarıyla giderildi.</p>
    `;
    diagnosisActionArea.appendChild(resultMessage);
    
    // Robot tamir animasyonu
    robotBody.animate(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(-10px)" },
        { transform: "translateY(0)" }
      ],
      {
        duration: 500,
        iterations: 3
      }
    );
    
    // Konfeti efekti
    addConfetti();
    
    // 3 saniye sonra sonraki bulmacaya geç
    setTimeout(() => {
      goNextPuzzle();
    }, 3000);
  }

  // Konfeti efekti
  function addConfetti() {
    // Konfeti konteyneri
    let confettiContainer = document.createElement("div");
    confettiContainer.style.position = "absolute";
    confettiContainer.style.top = "0";
    confettiContainer.style.left = "0";
    confettiContainer.style.width = "100%";
    confettiContainer.style.height = "100%";
    confettiContainer.style.pointerEvents = "none";
    confettiContainer.style.zIndex = "5";
    confettiContainer.style.overflow = "hidden";
    mainContainer.appendChild(confettiContainer);
    
    // Konfeti parçacıklarını oluştur
    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"];
    
    for (let i = 0; i < 80; i++) {
      let confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = (Math.random() * 10 + 5) + "px";
      confetti.style.height = (Math.random() * 10 + 5) + "px";
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      confetti.style.top = "-20px";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.transform = "rotate(" + (Math.random() * 360) + "deg)";
      confetti.style.opacity = Math.random() + 0.4;
      confettiContainer.appendChild(confetti);
      
      // Animasyon
      const animationDuration = Math.random() * 3 + 2;
      const animationDelay = Math.random() * 2;
      
      confetti.animate(
        [
          { top: "-20px", transform: "rotate(0deg)" },
          { top: confettiContainer.offsetHeight + "px", transform: "rotate(720deg)" }
        ],
        {
          duration: animationDuration * 1000,
          delay: animationDelay * 1000,
          easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
          iterations: 1,
          fill: "forwards"
        }
      );
      
      // Konfeti temizleme
      setTimeout(() => {
        confetti.remove();
      }, (animationDuration + animationDelay) * 1000);
    }
    
    // Konfeti konteyneri temizleme
    setTimeout(() => {
      confettiContainer.remove();
    }, 3000);
  }

  // Yardımcı fonksiyonlar
  function capitalizeFirstLetter(string) {
    // Türkçe karakter desteği için özel işlev
    const partNames = {
      'head': 'Kafa',
      'torso': 'Gövde',
      'leftArm': 'Sol kol',
      'rightArm': 'Sağ kol',
      'leftLeg': 'Sol bacak',
      'rightLeg': 'Sağ bacak'
    };
    return partNames[string] || string.charAt(0).toUpperCase() + string.slice(1);
  }
}

function setupPlanet5Puzzle5() {
  puzzleHintText.innerText = "IPUCU: Göreve uygun robot tasarlamak için doğru parçaları seç.";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "10px";
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme kutusu
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(46, 204, 113, 0.1)"; // Yeşil tema
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "12px";
  infoBox.style.border = "2px solid rgba(46, 204, 113, 0.3)";
  infoBox.style.width = "90%";
  infoBox.style.maxWidth = "700px";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  mainContainer.appendChild(infoBox);

  // Bilgilendirme başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "🤖 Robot Tasarım Laboratuvarı 🔩";
  infoTitle.style.margin = "0 0 8px 0";
  infoTitle.style.color = "#000000";
  infoTitle.style.fontSize = "1.2em";
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni
  let infoText = document.createElement("p");
  infoText.innerHTML = "Robot mühendisi olarak görevin farklı ortamlara uygun robotlar tasarlamak. Her görev için en uygun robot parçalarını seç ve robotu oluştur. Doğru parçaları seçerek tüm görevleri tamamla!";
  infoText.style.margin = "0";
  infoText.style.fontSize = "0.9em";
  infoText.style.lineHeight = "1.3";
  infoText.style.color = "#000000";
  infoBox.appendChild(infoText);

  // Oyun alanı
  let gameArea = document.createElement("div");
  gameArea.style.display = "flex";
  gameArea.style.width = "100%";
  gameArea.style.maxWidth = "700px";
  gameArea.style.marginTop = "5px";
  gameArea.style.gap = "15px";
  gameArea.style.flexDirection = "row";
  mainContainer.appendChild(gameArea);

  // SOL PANEL - Görev ve Ortam
  let missionPanel = document.createElement("div");
  missionPanel.style.flex = "1";
  missionPanel.style.backgroundColor = "#f9f9f9";
  missionPanel.style.borderRadius = "12px";
  missionPanel.style.padding = "12px";
  missionPanel.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  missionPanel.style.display = "flex";
  missionPanel.style.flexDirection = "column";
  missionPanel.style.alignItems = "center";
  missionPanel.style.minHeight = "360px";
  gameArea.appendChild(missionPanel);

  // Görev başlığı
  let missionTitle = document.createElement("h4");
  missionTitle.id = "mission-title";
  missionTitle.style.textAlign = "center";
  missionTitle.style.margin = "0 0 10px 0";
  missionTitle.style.color = "#000000";
  missionPanel.appendChild(missionTitle);

  // Görev açıklaması
  let missionDesc = document.createElement("p");
  missionDesc.id = "mission-desc";
  missionDesc.style.fontSize = "0.85em";
  missionDesc.style.textAlign = "center";
  missionDesc.style.marginBottom = "10px";
  missionDesc.style.color = "#000000";
  missionPanel.appendChild(missionDesc);

  // Görev ortamı görseli
  let missionImage = document.createElement("div");
  missionImage.id = "mission-image";
  missionImage.style.width = "90%";
  missionImage.style.height = "180px";
  missionImage.style.backgroundColor = "#f1f1f1";
  missionImage.style.borderRadius = "8px";
  missionImage.style.display = "flex";
  missionImage.style.justifyContent = "center";
  missionImage.style.alignItems = "center";
  missionImage.style.fontSize = "3em";
  missionImage.style.marginBottom = "10px";
  missionPanel.appendChild(missionImage);

  // Görev gereksinimleri
  let requirementsTitle = document.createElement("h5");
  requirementsTitle.innerText = "Gerekli Özellikler:";
  requirementsTitle.style.width = "100%";
  requirementsTitle.style.margin = "0 0 5px 0";
  requirementsTitle.style.color = "#000000";
  requirementsTitle.style.fontSize = "0.9em";
  missionPanel.appendChild(requirementsTitle);

  // Gereksinimler listesi
  let requirementsList = document.createElement("ul");
  requirementsList.id = "requirements-list";
  requirementsList.style.width = "90%";
  requirementsList.style.margin = "0";
  requirementsList.style.paddingLeft = "20px";
  requirementsList.style.fontSize = "0.8em";
  requirementsList.style.color = "#000000";
  missionPanel.appendChild(requirementsList);

  // SAĞ PANEL - Robot Tasarım Alanı
  let designPanel = document.createElement("div");
  designPanel.style.flex = "1";
  designPanel.style.backgroundColor = "#f9f9f9";
  designPanel.style.borderRadius = "12px";
  designPanel.style.padding = "12px";
  designPanel.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  designPanel.style.display = "flex";
  designPanel.style.flexDirection = "column";
  designPanel.style.minHeight = "360px";
  gameArea.appendChild(designPanel);

  // Tasarım başlığı
  let designTitle = document.createElement("h4");
  designTitle.innerText = "Robot Tasarım Paneli";
  designTitle.style.textAlign = "center";
  designTitle.style.margin = "0 0 10px 0";
  designTitle.style.color = "#000000";
  designPanel.appendChild(designTitle);

  // Robot görsel alanı
  let robotPreview = document.createElement("div");
  robotPreview.id = "robot-preview";
  robotPreview.style.width = "100%";
  robotPreview.style.height = "120px";
  robotPreview.style.backgroundColor = "#f1f1f1";
  robotPreview.style.borderRadius = "8px";
  robotPreview.style.display = "flex";
  robotPreview.style.justifyContent = "center";
  robotPreview.style.alignItems = "center";
  robotPreview.style.marginBottom = "10px";
  robotPreview.style.position = "relative";
  robotPreview.style.backgroundColor = "#e8f4fc";
  robotPreview.innerHTML = `<div style="color: #7f8c8d; font-size: 0.9em;">Parça seçerek robot tasarla</div>`;
  designPanel.appendChild(robotPreview);

  // Parça kategorileri - Sekmeli arayüz
  let categoriesContainer = document.createElement("div");
  categoriesContainer.style.display = "flex";
  categoriesContainer.style.borderBottom = "1px solid #ddd";
  categoriesContainer.style.marginBottom = "10px";
  designPanel.appendChild(categoriesContainer);

  // Parça listesi
  let partsContainer = document.createElement("div");
  partsContainer.id = "parts-container";
  partsContainer.style.flex = "1";
  partsContainer.style.overflowY = "auto";
  partsContainer.style.padding = "5px";
  partsContainer.style.minHeight = "120px";
  partsContainer.style.maxHeight = "120px";
  designPanel.appendChild(partsContainer);

  // Seçilen parçalar
  let selectedPartsTitle = document.createElement("h5");
  selectedPartsTitle.innerText = "Seçilen Parçalar:";
  selectedPartsTitle.style.margin = "10px 0 5px 0";
  selectedPartsTitle.style.fontSize = "0.9em";
  selectedPartsTitle.style.color = "#000000";
  designPanel.appendChild(selectedPartsTitle);

  let selectedPartsContainer = document.createElement("div");
  selectedPartsContainer.id = "selected-parts";
  selectedPartsContainer.style.display = "flex";
  selectedPartsContainer.style.flexWrap = "wrap";
  selectedPartsContainer.style.gap = "5px";
  selectedPartsContainer.style.minHeight = "40px";
  selectedPartsContainer.style.padding = "5px";
  selectedPartsContainer.style.borderRadius = "5px";
  selectedPartsContainer.style.backgroundColor = "#f1f1f1";
  designPanel.appendChild(selectedPartsContainer);

  // Kontrol butonları
  let buttonsContainer = document.createElement("div");
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.justifyContent = "space-between";
  buttonsContainer.style.marginTop = "10px";
  buttonsContainer.style.gap = "10px";
  designPanel.appendChild(buttonsContainer);

  // Temizle butonu
  let clearButton = document.createElement("button");
  clearButton.innerText = "Temizle";
  clearButton.style.padding = "8px 12px";
  clearButton.style.backgroundColor = "#e74c3c";
  clearButton.style.color = "white";
  clearButton.style.border = "none";
  clearButton.style.borderRadius = "5px";
  clearButton.style.cursor = "pointer";
  clearButton.style.flex = "1";
  buttonsContainer.appendChild(clearButton);

  // Test Et butonu
  let testButton = document.createElement("button");
  testButton.innerText = "Test Et";
  testButton.style.padding = "8px 12px";
  testButton.style.backgroundColor = "#2ecc71";
  testButton.style.color = "white";
  testButton.style.border = "none";
  testButton.style.borderRadius = "5px";
  testButton.style.cursor = "pointer";
  testButton.style.flex = "1";
  buttonsContainer.appendChild(testButton);

  // İlerleme göstergesi
  let progressContainer = document.createElement("div");
  progressContainer.style.width = "100%";
  progressContainer.style.marginTop = "10px";
  progressContainer.style.textAlign = "center";
  mainContainer.appendChild(progressContainer);

  let progressText = document.createElement("div");
  progressText.id = "progress-text";
  progressText.style.fontSize = "0.9em";
  progressText.style.color = "#000000";
  progressText.innerText = "Görev: 1/3";
  progressContainer.appendChild(progressText);

  // Görev verileri
  const missions = [
    {
      id: "rescue",
      title: "Kurtarma Robotu",
      description: "Enkaz altında kalmış bir oyuncak ayıyı kurtarman gerekiyor. Zorlu arazide ilerleyebilen ve hassas görevleri yapabilen bir robot tasarla.",
      image: "🏚️",
      requirements: [
        "Enkazı görebilmek için görüntüleme sistemi",
        "Enkazı kaldırabilecek güçlü kollar",
        "Engebeli arazide hareket edebilme",
        "Hassas nesneleri tutabilme"
      ],
      validParts: ["camera", "arms", "tracks", "gripper", "battery"]
    },
    {
      id: "gardener",
      title: "Bahçıvan Robot",
      description: "Kurak bir bahçeyi sulamak ve bitkilerin bakımını yapmak için bir robot tasarla.",
      image: "🌱",
      requirements: [
        "Bitkileri sulama sistemi",
        "Toprağın nemini ölçme yeteneği",
        "Düz arazide hareket edebilme",
        "Uzun süre çalışabilme"
      ],
      validParts: ["sprayer", "moisture_sensor", "wheels", "solar_panel", "gripper"]
    },
    {
      id: "explorer",
      title: "Keşif Robotu",
      description: "Karanlık bir mağarayı keşfetmek ve haritalandırmak için bir robot tasarla.",
      image: "🕳️",
      requirements: [
        "Karanlıkta görebilme",
        "Arazinin haritasını çıkarabilme",
        "Zorlu arazide ilerleyebilme",
        "Uzun süre çalışabilme"
      ],
      validParts: ["light", "camera", "tracks", "distance_sensor", "battery"]
    }
  ];

  // Parça kategorileri ve parçalar
  const partCategories = [
    {
      id: "sensors",
      name: "Sensörler",
      parts: [
        { id: "camera", name: "Kamera", icon: "📷", description: "Robotun görmesini sağlar" },
        { id: "distance_sensor", name: "Mesafe Sensörü", icon: "📏", description: "Engelleri algılar" },
        { id: "moisture_sensor", name: "Nem Sensörü", icon: "💧", description: "Toprağın nemini ölçer" },
        { id: "light_sensor", name: "Işık Sensörü", icon: "☀️", description: "Işık seviyesini ölçer" }
      ]
    },
    {
      id: "movement",
      name: "Hareket",
      parts: [
        { id: "wheels", name: "Tekerlekler", icon: "🛞", description: "Düz yüzeylerde hızlı hareket" },
        { id: "tracks", name: "Paletler", icon: "🔄", description: "Engebeli arazide güvenli hareket" },
        { id: "legs", name: "Bacaklar", icon: "🦵", description: "Zorlu arazide ilerleme" }
      ]
    },
    {
      id: "tools",
      name: "Araçlar",
      parts: [
        { id: "arms", name: "Robotik Kollar", icon: "💪", description: "Ağır nesneleri kaldırabilir" },
        { id: "gripper", name: "Hassas Tutucu", icon: "✋", description: "Küçük nesneleri tutabilir" },
        { id: "drill", name: "Matkap", icon: "🔩", description: "Sert yüzeyleri delebilir" },
        { id: "sprayer", name: "Su Püskürtücü", icon: "💦", description: "Sıvı püskürtebilir" },
        { id: "light", name: "Işık Kaynağı", icon: "🔦", description: "Karanlık alanları aydınlatır" }
      ]
    },
    {
      id: "power",
      name: "Güç",
      parts: [
        { id: "battery", name: "Yüksek Kapasiteli Pil", icon: "🔋", description: "Uzun süre çalışma" },
        { id: "solar_panel", name: "Güneş Paneli", icon: "☀️", description: "Sürekli enerji üretimi" }
      ]
    }
  ];

  // Kategori sekmeleri oluştur
  partCategories.forEach(category => {
    let categoryTab = document.createElement("div");
    categoryTab.className = "category-tab";
    categoryTab.dataset.category = category.id;
    categoryTab.innerText = category.name;
    categoryTab.style.padding = "8px 12px";
    categoryTab.style.cursor = "pointer";
    categoryTab.style.borderBottom = "2px solid transparent";
    categoryTab.style.color = "#000000";
    categoryTab.style.fontSize = "0.85em";

    categoryTab.addEventListener("mouseenter", function() {
      if (!this.classList.contains("active")) {
        this.style.backgroundColor = "#f1f1f1";
      }
    });

    categoryTab.addEventListener("mouseleave", function() {
      if (!this.classList.contains("active")) {
        this.style.backgroundColor = "transparent";
      }
    });

    categoryTab.addEventListener("click", function() {
      document.querySelectorAll(".category-tab").forEach(tab => {
        tab.classList.remove("active");
        tab.style.borderBottom = "2px solid transparent";
        tab.style.backgroundColor = "transparent";
      });
      this.classList.add("active");
      this.style.borderBottom = "2px solid #2ecc71";
      this.style.backgroundColor = "#f1f1f1";
      showPartsForCategory(category.id);
    });

    categoriesContainer.appendChild(categoryTab);
  });

  // İlk kategoriyi varsayılan olarak seç
  document.querySelector(".category-tab").classList.add("active");
  document.querySelector(".category-tab").style.borderBottom = "2px solid #2ecc71";
  document.querySelector(".category-tab").style.backgroundColor = "#f1f1f1";

  // Seçilen parçaları ve mevcut görevi takip et
  let selectedParts = [];
  let currentMissionIndex = 0;
  let completedMissions = 0;

  // İlk görevi yükle
  loadMission(currentMissionIndex);

  // Bir kategori için parçaları göster
  function showPartsForCategory(categoryId) {
    partsContainer.innerHTML = "";
    const category = partCategories.find(c => c.id === categoryId);
    
    if (category) {
      category.parts.forEach(part => {
        let partElement = document.createElement("div");
        partElement.className = "part-item";
        partElement.dataset.partId = part.id;
        partElement.style.display = "flex";
        partElement.style.alignItems = "center";
        partElement.style.padding = "5px";
        partElement.style.marginBottom = "5px";
        partElement.style.backgroundColor = "white";
        partElement.style.borderRadius = "5px";
        partElement.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
        partElement.style.cursor = "pointer";

        // Parça zaten seçilmişse devre dışı bırak
        if (selectedParts.some(p => p.id === part.id)) {
          partElement.style.opacity = "0.5";
          partElement.style.cursor = "not-allowed";
        }

        // İkon ve isim
        partElement.innerHTML = `
          <div style="font-size: 1.5em; margin-right: 8px;">${part.icon}</div>
          <div style="flex: 1;">
            <div style="font-weight: bold; font-size: 0.85em; color: #000000;">${part.name}</div>
            <div style="font-size: 0.75em; color: #7f8c8d;">${part.description}</div>
          </div>
        `;

        // Parça seçme olayı
        partElement.addEventListener("click", function() {
          // Eğer parça zaten seçilmişse işlem yapma
          if (selectedParts.some(p => p.id === part.id)) return;
          
          // Maksimum 5 parça sınırı
          if (selectedParts.length >= 5) {
            showMessage("En fazla 5 parça seçebilirsin!", "error");
            return;
          }

          // Parçayı seçili listeye ekle
          selectedParts.push(part);
          updateSelectedParts();
          
          // Parçayı devre dışı bırak
          this.style.opacity = "0.5";
          this.style.cursor = "not-allowed";
          
          // Robot önizleme güncelle
          updateRobotPreview();
        });

        partsContainer.appendChild(partElement);
      });
    }
  }

  // İlk kategorinin parçalarını göster
  showPartsForCategory(partCategories[0].id);

  // Görev bilgilerini yükle
  function loadMission(index) {
    const mission = missions[index];
    
    // Görev başlığı ve açıklaması
    missionTitle.innerText = mission.title;
    missionDesc.innerText = mission.description;
    
    // Görev görseli
    missionImage.innerHTML = `<span style="font-size: 5rem;">${mission.image}</span>`;
    
    // Gereksinimler listesi
    requirementsList.innerHTML = "";
    mission.requirements.forEach(req => {
      let li = document.createElement("li");
      li.innerText = req;
      li.style.marginBottom = "3px";
      li.style.color = "#000000";
      requirementsList.appendChild(li);
    });

    // İlerleme göstergesi
    progressText.innerText = `Görev: ${index + 1}/${missions.length}`;

    // Robot önizlemesini temizle
    robotPreview.innerHTML = `<div style="color: #7f8c8d; font-size: 0.9em;">Parça seçerek robot tasarla</div>`;
    
    // Seçilen parçaları temizle
    selectedParts = [];
    updateSelectedParts();
    
    // Parça listesini güncelle
    const activeTab = document.querySelector(".category-tab.active");
    if (activeTab) {
      showPartsForCategory(activeTab.dataset.category);
    }
  }

  // Seçilen parçaları göster
  function updateSelectedParts() {
    selectedPartsContainer.innerHTML = "";
    
    if (selectedParts.length === 0) {
      let emptyText = document.createElement("div");
      emptyText.innerText = "Henüz parça seçilmedi";
      emptyText.style.width = "100%";
      emptyText.style.textAlign = "center";
      emptyText.style.fontSize = "0.8em";
      emptyText.style.color = "#7f8c8d";
      emptyText.style.padding = "10px 0";
      selectedPartsContainer.appendChild(emptyText);
      return;
    }
    
    selectedParts.forEach((part, index) => {
      let partBadge = document.createElement("div");
      partBadge.className = "part-badge";
      partBadge.style.backgroundColor = "white";
      partBadge.style.padding = "5px 8px";
      partBadge.style.borderRadius = "15px";
      partBadge.style.display = "flex";
      partBadge.style.alignItems = "center";
      partBadge.style.gap = "5px";
      partBadge.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
      
      // İkon ve isim
      partBadge.innerHTML = `
        <span>${part.icon}</span>
        <span style="font-size: 0.8em; color: #000000;">${part.name}</span>
        <span class="remove-part" style="cursor: pointer; margin-left: 3px; color: #e74c3c;">✕</span>
      `;
      
      // Parçayı kaldırma olayı
      partBadge.querySelector(".remove-part").addEventListener("click", function() {
        selectedParts.splice(index, 1);
        updateSelectedParts();
        updateRobotPreview();
        
        // Parça listesini güncelle
        const activeTab = document.querySelector(".category-tab.active");
        if (activeTab) {
          showPartsForCategory(activeTab.dataset.category);
        }
      });
      
      selectedPartsContainer.appendChild(partBadge);
    });
  }

  // Robot önizlemesini güncelle
  function updateRobotPreview() {
    if (selectedParts.length === 0) {
      robotPreview.innerHTML = `<div style="color: #7f8c8d; font-size: 0.9em;">Parça seçerek robot tasarla</div>`;
      return;
    }
    
    // Robot gövdesi
    robotPreview.innerHTML = `
      <div id="robot-body" style="position: relative; width: 120px; height: 80px; background-color: #bdc3c7; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="font-size: 1.2em;">🤖</div>
      </div>
    `;
    
    let robotBody = document.getElementById("robot-body");
    
    // Seçilen parçaları robot gövdesine ekle
    selectedParts.forEach(part => {
      let partVisual = document.createElement("div");
      partVisual.style.position = "absolute";
      partVisual.style.fontSize = "1.2em";
      
      // Parçanın konumunu ayarla
      switch(part.id) {
        case "camera":
        case "distance_sensor":
        case "light_sensor":
          partVisual.style.top = "-15px";
          partVisual.style.fontSize = "1em";
          break;
        case "moisture_sensor":
          partVisual.style.bottom = "-15px";
          partVisual.style.fontSize = "1em";
          break;
        case "wheels":
          partVisual.style.bottom = "-15px";
          partVisual.style.left = "20px";
          break;
        case "tracks":
          partVisual.style.bottom = "-15px";
          partVisual.style.left = "20px";
          break;
        case "legs":
          partVisual.style.bottom = "-20px";
          break;
        case "arms":
          partVisual.style.left = "-20px";
          break;
        case "gripper":
          partVisual.style.right = "-20px";
          break;
        case "drill":
          partVisual.style.right = "-20px";
          break;
        case "sprayer":
          partVisual.style.right = "-20px";
          break;
        case "light":
          partVisual.style.top = "-15px";
          partVisual.style.right = "10px";
          break;
        case "battery":
          partVisual.style.bottom = "10px";
          partVisual.style.right = "10px";
          partVisual.style.fontSize = "0.8em";
          break;
        case "solar_panel":
          partVisual.style.top = "-15px";
          partVisual.style.fontSize = "0.8em";
          break;
      }
      
      partVisual.innerHTML = part.icon;
      robotBody.appendChild(partVisual);
    });
  }

  // Temizle butonu olayı
  clearButton.addEventListener("click", function() {
    selectedParts = [];
    updateSelectedParts();
    updateRobotPreview();
    
    // Parça listesini güncelle
    const activeTab = document.querySelector(".category-tab.active");
    if (activeTab) {
      showPartsForCategory(activeTab.dataset.category);
    }
    playClickSound();
  });

  // Test butonu olayı
  testButton.addEventListener("click", function() {
    playClickSound();
    
    if (selectedParts.length === 0) {
      showMessage("Test etmek için en az bir parça seçmelisin!", "error");
      return;
    }
    
    testRobot();
  });

  // Robot tasarımını test et
  function testRobot() {
    const currentMission = missions[currentMissionIndex];
    const partIds = selectedParts.map(part => part.id);
    
    // Gerekli parçalar var mı kontrol et
    let requiredPartsCount = 0;
    currentMission.validParts.forEach(requiredPart => {
      if (partIds.includes(requiredPart)) {
        requiredPartsCount++;
      }
    });
    
    // Başarı oranı
    const successRate = requiredPartsCount / currentMission.validParts.length;
    
    // Test sonucunu göster
    const testResultContainer = document.createElement("div");
    testResultContainer.style.position = "absolute";
    testResultContainer.style.top = "0";
    testResultContainer.style.left = "0";
    testResultContainer.style.width = "100%";
    testResultContainer.style.height = "100%";
    testResultContainer.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    testResultContainer.style.display = "flex";
    testResultContainer.style.flexDirection = "column";
    testResultContainer.style.alignItems = "center";
    testResultContainer.style.justifyContent = "center";
    testResultContainer.style.borderRadius = "8px";
    testResultContainer.style.padding = "10px";
    testResultContainer.style.zIndex = "10";
    
    if (successRate >= 0.6) { // Başarılı (en az %60 doğru parça)
      testResultContainer.innerHTML = `
        <div style="font-size: 2em; margin-bottom: 10px;">✅</div>
        <div style="font-weight: bold; margin-bottom: 5px; color: #27ae60;">Test Başarılı!</div>
        <div style="font-size: 0.85em; text-align: center; color: #000000; margin-bottom: 15px;">
          Robotun görevi ${Math.round(successRate * 100)}% başarı ile tamamladı.
        </div>
      `;
      playCorrectSound();
      
      // Sonraki görev butonu
      const nextButton = document.createElement("button");
      nextButton.innerText = "Sonraki Görev";
      nextButton.style.padding = "8px 16px";
      nextButton.style.backgroundColor = "#2ecc71";
      nextButton.style.color = "white";
      nextButton.style.border = "none";
      nextButton.style.borderRadius = "5px";
      nextButton.style.cursor = "pointer";
      
      nextButton.addEventListener("click", function() {
        testResultContainer.remove();
        completedMissions++;
        
        // Görevleri tamamladıysa bitir, yoksa sonraki göreve geç
        if (currentMissionIndex >= missions.length - 1) {
          showCompletionScreen();
        } else {
          currentMissionIndex++;
          loadMission(currentMissionIndex);
        }
        playClickSound();
      });
      
      testResultContainer.appendChild(nextButton);
    } else { // Başarısız
      testResultContainer.innerHTML = `
        <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
        <div style="font-weight: bold; margin-bottom: 5px; color: #e74c3c;">Test Başarısız</div>
        <div style="font-size: 0.85em; text-align: center; color: #000000; margin-bottom: 15px;">
          Robotun görevi tamamlayamadı. Farklı parçalar denemelisin.
        </div>
      `;
      playWrongSound();
      
      // Tekrar dene butonu
      const retryButton = document.createElement("button");
      retryButton.innerText = "Tekrar Dene";
      retryButton.style.padding = "8px 16px";
      retryButton.style.backgroundColor = "#e74c3c";
      retryButton.style.color = "white";
      retryButton.style.border = "none";
      retryButton.style.borderRadius = "5px";
      retryButton.style.cursor = "pointer";
      
      retryButton.addEventListener("click", function() {
        testResultContainer.remove();
        playClickSound();
      });
      
      testResultContainer.appendChild(retryButton);
    }
    
    robotPreview.appendChild(testResultContainer);
  }

    // Tamamlama ekranını göster
    function showCompletionScreen() {
      // Mevcut alanı temizle
      mainContainer.innerHTML = "";
      
      // Tamamlama kartı
      let completionCard = document.createElement("div");
      completionCard.style.width = "90%";
      completionCard.style.maxWidth = "600px";
      completionCard.style.backgroundColor = "white";
      completionCard.style.borderRadius = "12px";
      completionCard.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
      completionCard.style.padding = "25px";
      completionCard.style.display = "flex";
      completionCard.style.flexDirection = "column";
      completionCard.style.alignItems = "center";
      completionCard.style.gap = "20px";
      completionCard.style.position = "relative";
      completionCard.style.overflow = "hidden";
      mainContainer.appendChild(completionCard);
      
      // Sertifika görünümü
      let certificate = document.createElement("div");
      certificate.style.width = "100%";
      certificate.style.padding = "20px";
      certificate.style.border = "2px solid #2ecc71";
      certificate.style.borderRadius = "10px";
      certificate.style.backgroundColor = "#f9f9f9";
      certificate.style.textAlign = "center";
      certificate.style.marginBottom = "20px";
      
      // Sertifika içeriği
      certificate.innerHTML = `
        <h3 style="color: #000000; margin-bottom: 10px;">🏆 Robot Tasarım Sertifikası 🏆</h3>
        <p style="color: #000000; margin-bottom: 15px;">Bu sertifika, Robot Tasarım Laboratuvarı'ndaki tüm görevleri başarıyla tamamladığınızı onaylar.</p>
        <div style="font-size: 5em; margin: 20px 0;">🤖</div>
        <p style="color: #000000; font-weight: bold;">Tebrikler, Robot Mühendisi!</p>
      `;
      
      completionCard.appendChild(certificate);
      
      // Tebrik mesajı
      let congratsMessage = document.createElement("p");
      congratsMessage.innerHTML = `Robot tasarımı, farklı görevlere uygun robotlar oluşturmak için doğru parçaları seçmeyi gerektirir. Artık bir robot mühendisi olarak, hangi görevler için hangi robot parçalarının gerekli olduğunu öğrendin. Bu becerilerini gelecekte daha karmaşık robotlar tasarlamak için kullanabilirsin!`;
      congratsMessage.style.textAlign = "center";
      congratsMessage.style.lineHeight = "1.5";
      congratsMessage.style.margin = "10px 0";
      congratsMessage.style.color = "#000000";
      completionCard.appendChild(congratsMessage);
      
      // Konfeti efekti
      addConfetti();
      
      // Sonraki bulmaca için 5 saniye bekle
      setTimeout(() => {
        goNextPuzzle();
      }, 5000);
    }
  
    // Konfeti efekti
    function addConfetti() {
      // Konfeti konteyneri
      let confettiContainer = document.createElement("div");
      confettiContainer.style.position = "absolute";
      confettiContainer.style.top = "0";
      confettiContainer.style.left = "0";
      confettiContainer.style.width = "100%";
      confettiContainer.style.height = "100%";
      confettiContainer.style.pointerEvents = "none";
      confettiContainer.style.zIndex = "5";
      confettiContainer.style.overflow = "hidden";
      mainContainer.appendChild(confettiContainer);
      
      // Konfeti parçacıklarını oluştur
      const colors = ["#2ecc71", "#3498db", "#f1c40f", "#9b59b6", "#e74c3c"];
      
      for (let i = 0; i < 100; i++) {
        let confetti = document.createElement("div");
        confetti.style.position = "absolute";
        confetti.style.width = (Math.random() * 10 + 5) + "px";
        confetti.style.height = (Math.random() * 10 + 5) + "px";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
        confetti.style.top = "-20px";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.transform = "rotate(" + (Math.random() * 360) + "deg)";
        confetti.style.opacity = Math.random() + 0.4;
        confettiContainer.appendChild(confetti);
        
        // Animasyon
        const animationDuration = Math.random() * 3 + 2;
        const animationDelay = Math.random() * 2;
        
        confetti.animate(
          [
            { top: "-20px", transform: "rotate(0deg)" },
            { top: confettiContainer.offsetHeight + "px", transform: "rotate(720deg)" }
          ],
          {
            duration: animationDuration * 1000,
            delay: animationDelay * 1000,
            easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
            iterations: 1,
            fill: "forwards"
          }
        );
        
        // Konfeti temizleme
        setTimeout(() => {
          confetti.remove();
        }, (animationDuration + animationDelay) * 1000);
      }
      
      // Konfeti konteyneri temizleme
      setTimeout(() => {
        confettiContainer.remove();
      }, 7000);
    }
  }

/****************************************************************
 *********** 6) ETİK YAPAY ZEKÂ ZİRVESİ (5 Puzzle) **************
 ****************************************************************/
 function setupPlanet6Puzzle1() {
  puzzleHintText.innerText = "IPUCU: Kişisel verilerin gizliliği önemlidir. Hangi verileri paylaşabileceğine dikkatli karar ver!";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "10px";
  puzzleArea.appendChild(mainContainer);

  // Bilgilendirme kutusu
  let infoBox = document.createElement("div");
  infoBox.style.backgroundColor = "rgba(155, 89, 182, 0.1)"; // Mor tema
  infoBox.style.borderRadius = "12px";
  infoBox.style.padding = "12px";
  infoBox.style.border = "2px solid rgba(155, 89, 182, 0.3)";
  infoBox.style.width = "90%";
  infoBox.style.maxWidth = "700px";
  infoBox.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
  mainContainer.appendChild(infoBox);

  // Bilgilendirme başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "🔒 Veri Gizliliği Labirenti 🛡️";
  infoTitle.style.margin = "0 0 8px 0";
  infoTitle.style.color = "#000000";
  infoTitle.style.fontSize = "1.2em";
  infoBox.appendChild(infoTitle);

  // Bilgilendirme metni
  let infoText = document.createElement("p");
  infoText.innerHTML = "Veri Koruma Görevlisi olarak görevin, kişisel verilerin güvenliğini sağlamak! Labirentte ilerlerken, hangi bilgilerin paylaşılabileceğine ve hangilerinin gizli kalması gerektiğine dair doğru kararlar vermelisin.";
  infoText.style.margin = "0";
  infoText.style.fontSize = "0.9em";
  infoText.style.lineHeight = "1.3";
  infoText.style.color = "#000000";
  infoBox.appendChild(infoText);

  // Oyun alanı
  let gameArea = document.createElement("div");
  gameArea.style.width = "100%";
  gameArea.style.maxWidth = "700px";
  gameArea.style.marginTop = "10px";
  gameArea.style.display = "flex";
  gameArea.style.flexDirection = "column";
  gameArea.style.alignItems = "center";
  mainContainer.appendChild(gameArea);

  // Puan göstergesi
  let scoreContainer = document.createElement("div");
  scoreContainer.style.display = "flex";
  scoreContainer.style.width = "100%";
  scoreContainer.style.justifyContent = "space-between";
  scoreContainer.style.padding = "5px 10px";
  scoreContainer.style.backgroundColor = "#f8f9fa";
  scoreContainer.style.borderRadius = "8px";
  scoreContainer.style.marginBottom = "15px";
  gameArea.appendChild(scoreContainer);

  // Doğru kararlar
  let correctDecisions = document.createElement("div");
  correctDecisions.id = "correct-decisions";
  correctDecisions.innerHTML = "Doğru Kararlar: 0";
  correctDecisions.style.color = "#000000";
  correctDecisions.style.fontWeight = "bold";
  scoreContainer.appendChild(correctDecisions);

  // İlerleme
  let progress = document.createElement("div");
  progress.id = "progress";
  progress.innerHTML = "İlerleme: 0/5";
  progress.style.color = "#000000";
  progress.style.fontWeight = "bold";
  scoreContainer.appendChild(progress);

  // Yönlendirme mesajı
  let instructionMessage = document.createElement("div");
  instructionMessage.id = "instruction-message";
  instructionMessage.style.backgroundColor = "rgba(52, 152, 219, 0.1)";
  instructionMessage.style.color = "#000000";
  instructionMessage.style.padding = "8px 12px";
  instructionMessage.style.borderRadius = "8px";
  instructionMessage.style.marginBottom = "10px";
  instructionMessage.style.width = "100%";
  instructionMessage.style.textAlign = "center";
  instructionMessage.style.fontWeight = "500";
  instructionMessage.style.fontSize = "0.9em";
  instructionMessage.style.border = "1px solid rgba(52, 152, 219, 0.3)";
  instructionMessage.innerText = "Başlamak için yeşil BAŞLA noktasına tıkla!";
  gameArea.appendChild(instructionMessage);

  // Labirent konteyner
  let labyrinthContainer = document.createElement("div");
  labyrinthContainer.style.width = "100%";
  labyrinthContainer.style.aspectRatio = "1 / 1";
  labyrinthContainer.style.backgroundColor = "#e8f4fc";
  labyrinthContainer.style.borderRadius = "12px";
  labyrinthContainer.style.position = "relative";
  labyrinthContainer.style.overflow = "hidden";
  labyrinthContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  gameArea.appendChild(labyrinthContainer);

  // Labirent arka plan deseni
  let backgroundPattern = document.createElement("div");
  backgroundPattern.style.position = "absolute";
  backgroundPattern.style.width = "100%";
  backgroundPattern.style.height = "100%";
  backgroundPattern.style.backgroundImage = "radial-gradient(circle, #f0f8ff 2px, transparent 2px)";
  backgroundPattern.style.backgroundSize = "20px 20px";
  backgroundPattern.style.opacity = "0.5";
  backgroundPattern.style.zIndex = "1";
  labyrinthContainer.appendChild(backgroundPattern);

  // Oyun durumu
  const gameState = {
    currentPosition: 0,
    currentLocationId: 0, // 0: başlangıç, 1-5: soru noktaları, 6: bitiş
    correctAnswers: 0,
    solvedDecisions: [],
    availablePoints: [0], // Başlangıçta sadece başlangıç noktası erişilebilir
    animatingMove: false, // Hareket animasyonu devam ediyor mu?
    
    // Karakteri hareket ettir
    moveCharacter: function(position, locationId, callback) {
      if (this.animatingMove) return; // Hareket devam ediyorsa bir şey yapma
      
      this.animatingMove = true;
      moveCharacterAlongPath(position, locationId, () => {
        this.currentPosition = position;
        this.currentLocationId = locationId;
        this.animatingMove = false;
        
        // İlerleme metnini güncelle
        if (locationId >= 0 && locationId <= 5) {
          progress.innerHTML = `İlerleme: ${locationId}/5`;
        }
        
        if (callback) callback();
      });
    },
    
    // Karar noktasını çöz
    solveDecisionPoint: function(id) {
      this.solvedDecisions.push(id);
      
      // Sonraki karar noktasını aç
      if (id < 5) {
        this.availablePoints.push(id + 1);
        
        // Sonraki noktanın kullanılabilir olduğunu göster
        updateDecisionPointsAppearance();
        
        // Kullanıcıya yönlendirme mesajı
        instructionMessage.innerText = `${id+1}. soruya geç!`;
      } else {
        // Tüm sorular çözüldüyse bitiş noktasını aç
        this.availablePoints.push(6); // 6, bitiş noktası ID'si
        
        // Kullanıcıya yönlendirme mesajı
        instructionMessage.innerText = "Tüm soruları yanıtladın! Bitişe git.";
        instructionMessage.style.backgroundColor = "rgba(46, 204, 113, 0.1)";
        instructionMessage.style.border = "1px solid rgba(46, 204, 113, 0.3)";
        instructionMessage.style.fontWeight = "bold";
      }
    },
    
    // Noktaya erişilebilir mi?
    isPointAvailable: function(id) {
      return this.availablePoints.includes(id);
    }
  };

  // ---- LABIRENT YAPISI IYILEŞTIRMESI ----
  
  // Düzeltilmiş labirent yolları
  const paths = [
    // Labirent yolları: başlangıç, bitiş, genişlik (yatay için) veya yükseklik (dikey için), yatay mı?
    {start: {x: 10, y: 15}, length: 80, isHorizontal: true}, // Üst yatay ana yol
    {start: {x: 10, y: 15}, length: 70, isHorizontal: false}, // Sol dikey ana yol
    {start: {x: 10, y: 35}, length: 20, isHorizontal: true}, // 1. noktadan sağa
    {start: {x: 30, y: 35}, length: 20, isHorizontal: false}, // 2. noktaya giden dikey
    {start: {x: 30, y: 55}, length: 20, isHorizontal: true}, // 2. noktadan 3. noktaya
    {start: {x: 50, y: 35}, length: 40, isHorizontal: true}, // 3. üst yatay bağlantı
    {start: {x: 50, y: 35}, length: 50, isHorizontal: false}, // 3. dikey bağlantı
    {start: {x: 70, y: 55}, length: 20, isHorizontal: false}, // 4. noktaya dikey
    {start: {x: 50, y: 55}, length: 20, isHorizontal: true}, // 3. noktadan sağa
    {start: {x: 70, y: 75}, length: 20, isHorizontal: true}, // 4. noktadan bitiş noktasına
    {start: {x: 90, y: 15}, length: 60, isHorizontal: false}, // Sağ dikey ana yol
    {start: {x: 10, y: 85}, length: 40, isHorizontal: true}  // Alt yatay ana yol
  ];

  // Düğüm noktaları (Decision Points)
  const nodes = [
    {id: 0, x: 10, y: 15, type: "start", accessible: true},  // Başlangıç
    {id: 1, x: 10, y: 35, type: "decision"},                // Karar 1
    {id: 2, x: 30, y: 55, type: "decision"},                // Karar 2
    {id: 3, x: 50, y: 55, type: "decision"},                // Karar 3
    {id: 4, x: 70, y: 75, type: "decision"},                // Karar 4
    {id: 5, x: 50, y: 85, type: "decision"},                // Karar 5
    {id: 6, x: 90, y: 75, type: "end"}                      // Bitiş
  ];
  
  // Labirent yollarını çiz - daha düzgün kenarlar için
  function drawLabyrinthPaths() {
    paths.forEach(path => {
      let pathElement = document.createElement("div");
      pathElement.className = "labyrinth-path";
      pathElement.style.position = "absolute";
      
      if (path.isHorizontal) {
        // Yatay yol
        pathElement.style.width = `${path.length}%`;
        pathElement.style.height = "6%";
        pathElement.style.left = `${path.start.x}%`;
        pathElement.style.top = `${path.start.y - 3}%`;
      } else {
        // Dikey yol
        pathElement.style.width = "6%";
        pathElement.style.height = `${path.length}%`;
        pathElement.style.left = `${path.start.x - 3}%`;
        pathElement.style.top = `${path.start.y}%`;
      }
      
      pathElement.style.backgroundColor = "#d9edf7";
      pathElement.style.borderRadius = "3px";
      pathElement.style.border = "1px solid #9b59b6";
      pathElement.style.zIndex = "2";
      labyrinthContainer.appendChild(pathElement);
    });
  }
  
  // Köşe noktalarını oluştur (yolların birleşim noktaları için)
  function createCornerPoints() {
    // Köşe noktaları için düzgün yuvarlak kaplamalar ekle
    const cornerPoints = [
      {x: 10, y: 35}, {x: 10, y: 85}, 
      {x: 30, y: 35}, {x: 30, y: 55}, 
      {x: 50, y: 35}, {x: 50, y: 55}, {x: 50, y: 85},
      {x: 70, y: 55}, {x: 70, y: 75},
      {x: 90, y: 15}, {x: 90, y: 75}
    ];
    
    cornerPoints.forEach(point => {
      let corner = document.createElement("div");
      corner.className = "corner-point";
      corner.style.position = "absolute";
      corner.style.width = "8%";
      corner.style.height = "8%";
      corner.style.left = `${point.x - 4}%`;
      corner.style.top = `${point.y - 4}%`;
      corner.style.backgroundColor = "#d9edf7";
      corner.style.borderRadius = "50%";
      corner.style.border = "1px solid #9b59b6";
      corner.style.zIndex = "2";
      labyrinthContainer.appendChild(corner);
    });
  }
  
  // Karar noktalarını oluştur
  function createDecisionPoints() {
    nodes.forEach(node => {
      let nodeElement = document.createElement("div");
      nodeElement.className = node.type === "decision" ? "decision-point" : node.type === "start" ? "start-point" : "end-point";
      nodeElement.dataset.id = node.id;
      nodeElement.style.position = "absolute";
      nodeElement.style.width = node.type === "decision" ? "10%" : "12%";
      nodeElement.style.height = node.type === "decision" ? "10%" : "12%";
      nodeElement.style.left = `${node.x - (node.type === "decision" ? 5 : 6)}%`;
      nodeElement.style.top = `${node.y - (node.type === "decision" ? 5 : 6)}%`;
      
      // Başlangıç, bitiş ve karar noktaları için farklı renkler
      if (node.type === "start") {
        nodeElement.style.backgroundColor = "#2ecc71"; // Yeşil
        nodeElement.innerHTML = "BAŞLA";
      } else if (node.type === "end") {
        nodeElement.style.backgroundColor = "#e74c3c"; // Kırmızı
        nodeElement.innerHTML = "BİTİŞ";
        nodeElement.style.opacity = "0.5"; // Başlangıçta soluk (ulaşılamaz)
      } else {
        nodeElement.style.backgroundColor = "#9b59b6"; // Mor
        nodeElement.innerHTML = node.id;
        
        // Başlangıçta sadece ilk karar noktası erişilebilir
        if (node.id !== 1) {
          nodeElement.style.opacity = "0.5"; // Henüz ulaşılamaz nokta
        }
      }
      
      nodeElement.style.borderRadius = "50%";
      nodeElement.style.display = "flex";
      nodeElement.style.justifyContent = "center";
      nodeElement.style.alignItems = "center";
      nodeElement.style.color = "white";
      nodeElement.style.fontWeight = "bold";
      nodeElement.style.fontSize = node.type === "decision" ? "1.2em" : "0.9em";
      nodeElement.style.cursor = "pointer";
      nodeElement.style.zIndex = "3";
      nodeElement.style.boxShadow = "0 0 0 3px white";
      
      // Tıklama olayı
      nodeElement.addEventListener("click", function() {
        const nodeId = parseInt(this.dataset.id);
        
        // Erişilebilir nokta değilse, işlemi engelle
        if (!gameState.isPointAvailable(nodeId)) {
          playWrongSound();
          instructionMessage.innerText = nodeId < gameState.currentLocationId ? 
            "Bu soruyu zaten cevapladın!" : 
            "Önce önceki soruları cevaplamalısın!";
          instructionMessage.style.backgroundColor = "rgba(231, 76, 60, 0.1)";
          instructionMessage.style.border = "1px solid rgba(231, 76, 60, 0.3)";
          
          setTimeout(() => {
            instructionMessage.style.backgroundColor = "rgba(52, 152, 219, 0.1)";
            instructionMessage.style.border = "1px solid rgba(52, 152, 219, 0.3)";
            
            // Geçerli duruma göre mesajı güncelle
            if (gameState.solvedDecisions.length === 5) {
              instructionMessage.innerText = "Tüm soruları yanıtladın! Bitişe git.";
              instructionMessage.style.backgroundColor = "rgba(46, 204, 113, 0.1)";
              instructionMessage.style.border = "1px solid rgba(46, 204, 113, 0.3)";
            } else if (gameState.solvedDecisions.length === 0) {
              instructionMessage.innerText = "Başlamak için 1. soruya git!";
            } else {
              instructionMessage.innerText = `${gameState.solvedDecisions.length + 1}. soruya geç!`;
            }
          }, 2000);
          
          return;
        }
        
        // Başlangıç noktasına tıklanırsa
        if (nodeId === 0) {
          // Eğer hala başlangıçtaysak ve 1. karar noktası açıksa, yönlendirme mesajı
          if (gameState.currentLocationId === 0) {
            instructionMessage.innerText = "1. soruya gitmek için 1 numaralı noktaya tıkla!";
            return;
          }
        }
        
        // Bitiş noktasına tıklanırsa
        if (nodeId === 6) {
          if (gameState.solvedDecisions.length === 5) {
            // Tüm kararlar çözüldüyse bitiş noktasına hareket et
            gameState.moveCharacter({x: 90, y: 75}, 6, () => {
              setTimeout(showCompletionScreen, 1000);
            });
          }
          return;
        }
        
        // Karar noktasına tıklanırsa
        if (nodeId >= 1 && nodeId <= 5) {
          const targetPosition = {x: nodes[nodeId].x, y: nodes[nodeId].y};
          
          // Önce karakteri bu noktaya hareket ettir
          gameState.moveCharacter(targetPosition, nodeId, () => {
            // Sonra senaryoyu göster
            setTimeout(() => {
              showScenario(nodeId);
            }, 200);
          });
        }
      });
      
      labyrinthContainer.appendChild(nodeElement);
    });
  }
  
  // Karar noktalarının görünümünü güncelle
  function updateDecisionPointsAppearance() {
    document.querySelectorAll(".decision-point, .end-point").forEach(point => {
      const pointId = parseInt(point.dataset.id);
      
      // Çözülen karar noktaları
      if (gameState.solvedDecisions.includes(pointId)) {
        point.style.backgroundColor = "#2ecc71"; // Yeşil (tamamlandı)
        point.style.opacity = "1";
      } 
      // Erişilebilir karar noktaları
      else if (gameState.availablePoints.includes(pointId)) {
        point.style.opacity = "1"; // Tam görünür
      } 
      // Henüz erişilemeyen noktalar
      else {
        point.style.opacity = "0.5"; // Soluk
      }
    });
  }

    // Oyuncu karakteri
    let character = document.createElement("div");
    character.style.position = "absolute";
    character.style.width = "8%";
    character.style.height = "8%";
    character.style.left = "6%";
    character.style.top = "11%";
    character.style.borderRadius = "50%";
    character.style.backgroundColor = "#3498db";
    character.style.zIndex = "5"; // Labirent yollarının üzerinde
    character.style.display = "flex";
    character.style.justifyContent = "center";
    character.style.alignItems = "center";
    character.style.transition = "all 0.3s ease"; // Daha hızlı ve yumuşak geçiş
    character.style.boxShadow = "0 0 0 2px white, 0 0 10px rgba(0, 0, 0, 0.3)";
    character.innerHTML = "🧒";
    character.style.fontSize = "1.2em";
    labyrinthContainer.appendChild(character);
    
    // Labirenti çiz
    drawLabyrinthPaths();
    createCornerPoints();
    createDecisionPoints();
  
    // Senaryolar ve seçenekler
    const scenarios = [
      {
        id: 1,
        question: "Bir oyun sitesine üye olurken hangi bilgiyi vermelisin?",
        options: [
          { text: "Gerçek adını ve okul adını", correct: false },
          { text: "Sadece kullanıcı adı (nickname)", correct: true },
          { text: "Adını, yaşını ve ev adresini", correct: false }
        ]
      },
      {
        id: 2,
        question: "Arkadaşının fotoğrafını sosyal medyada paylaşmak istiyorsun. Ne yapmalısın?",
        options: [
          { text: "İzin almadan paylaş", correct: false },
          { text: "Arkadaşından izin alıp öyle paylaş", correct: true },
          { text: "Fotoğrafı kesip sadece kendini paylaş", correct: false }
        ]
      },
      {
        id: 3,
        question: "İnternette tanıştığın biri doğum gününü soruyor. Ne yapmalısın?",
        options: [
          { text: "Hiçbir bilgi verme", correct: true },
          { text: "Doğum gününü ve yaşını söyle", correct: false },
          { text: "Doğum günü hediyesi için adresini ver", correct: false }
        ]
      },
      {
        id: 4,
        question: "Bir anket sitesi bazı sorular soruyor. Hangisini yanıtlayabilirsin?",
        options: [
          { text: "Aile üyelerinin isimlerini", correct: false },
          { text: "Evcil hayvanınızın olup olmadığını", correct: true },
          { text: "Anne-babanın mesleğini", correct: false }
        ]
      },
      {
        id: 5,
        question: "Ödevini yapmak için internet araştırması yapıyorsun. Bir site senden bilgi istiyor. Ne yapmalısın?",
        options: [
          { text: "İstediği tüm bilgileri ver", correct: false },
          { text: "Başka bir kaynağa bak", correct: true },
          { text: "E-posta adresini ve telefon numaranı paylaş", correct: false }
        ]
      }
    ];
    
    // Labirent yolunu takip ederek karakteri hareket ettir
    function moveCharacterAlongPath(targetPosition, targetId, callback) {
      // Başlangıç ve bitiş konumları
      const startLocationId = gameState.currentLocationId;
      const startNode = nodes[startLocationId];
      const endNode = nodes[targetId];
      
      const startPosition = {x: startNode.x, y: startNode.y};
      
      // Hareket yolu - düğümler arası geçiş noktalarını içerir
      let movePath = [];
      
      // Yol haritası - labirentte hangi noktalardan geçmeli
      // Bu basit bir labirent olduğu için manuel olarak yol haritasını tanımlıyoruz
      // Daha karmaşık labirentler için otomatik yol bulma algoritması kullanılabilir
      const pathMap = {
        "0-1": [{x: 10, y: 15}, {x: 10, y: 35}], // Başlangıçtan 1. noktaya
        "1-2": [{x: 10, y: 35}, {x: 30, y: 35}, {x: 30, y: 55}], // 1'den 2'ye
        "2-3": [{x: 30, y: 55}, {x: 50, y: 55}], // 2'den 3'e
        "3-4": [{x: 50, y: 55}, {x: 70, y: 55}, {x: 70, y: 75}], // 3'ten 4'e
        "4-5": [{x: 70, y: 75}, {x: 50, y: 75}, {x: 50, y: 85}], // 4'ten 5'e
        "5-6": [{x: 50, y: 85}, {x: 90, y: 85}, {x: 90, y: 75}], // 5'ten bitişe
        "0-2": [{x: 10, y: 15}, {x: 10, y: 35}, {x: 30, y: 35}, {x: 30, y: 55}], // Başlangıçtan 2'ye
        "0-3": [{x: 10, y: 15}, {x: 10, y: 35}, {x: 30, y: 35}, {x: 30, y: 55}, {x: 50, y: 55}], // Başlangıçtan 3'e
        "0-4": [{x: 10, y: 15}, {x: 10, y: 35}, {x: 30, y: 35}, {x: 30, y: 55}, {x: 50, y: 55}, {x: 70, y: 55}, {x: 70, y: 75}], // Başlangıçtan 4'e
        "0-5": [{x: 10, y: 15}, {x: 10, y: 35}, {x: 10, y: 85}, {x: 50, y: 85}], // Başlangıçtan 5'e
        "0-6": [{x: 10, y: 15}, {x: 90, y: 15}, {x: 90, y: 75}], // Başlangıçtan bitişe
        "1-3": [{x: 10, y: 35}, {x: 30, y: 35}, {x: 30, y: 55}, {x: 50, y: 55}], // 1'den 3'e
        "1-4": [{x: 10, y: 35}, {x: 30, y: 35}, {x: 30, y: 55}, {x: 50, y: 55}, {x: 70, y: 55}, {x: 70, y: 75}], // 1'den 4'e
        "1-5": [{x: 10, y: 35}, {x: 10, y: 85}, {x: 50, y: 85}], // 1'den 5'e
        "1-6": [{x: 10, y: 35}, {x: 10, y: 85}, {x: 50, y: 85}, {x: 90, y: 85}, {x: 90, y: 75}], // 1'den bitişe
        "2-4": [{x: 30, y: 55}, {x: 50, y: 55}, {x: 70, y: 55}, {x: 70, y: 75}], // 2'den 4'e
        "2-5": [{x: 30, y: 55}, {x: 30, y: 75}, {x: 50, y: 75}, {x: 50, y: 85}], // 2'den 5'e
        "2-6": [{x: 30, y: 55}, {x: 50, y: 55}, {x: 70, y: 55}, {x: 70, y: 75}, {x: 90, y: 75}], // 2'den bitişe
        "3-5": [{x: 50, y: 55}, {x: 50, y: 85}], // 3'ten 5'e
        "3-6": [{x: 50, y: 55}, {x: 70, y: 55}, {x: 70, y: 75}, {x: 90, y: 75}], // 3'ten bitişe
        "4-6": [{x: 70, y: 75}, {x: 90, y: 75}] // 4'ten bitişe
      };
      
      // Yol haritasından uygun yolu seç
      const pathKey = `${startLocationId}-${targetId}`;
      if (pathMap[pathKey]) {
        movePath = pathMap[pathKey];
      } else {
        // Direkt gidiş yok, varsayılan olarak doğrudan hedef noktaya git
        movePath = [targetPosition];
      }
      
      // Her bir adım için animasyon süresi (ms)
      const stepDuration = 300;
      
      // Yoldaki her bir noktaya sırayla hareket et
      function moveToNextPoint(index) {
        if (index < movePath.length) {
          const nextPoint = movePath[index];
          
          // Karakteri hareket ettir
          character.style.left = `${nextPoint.x - 4}%`; // Merkezi hizalama için offset
          character.style.top = `${nextPoint.y - 4}%`;  // Merkezi hizalama için offset
          
          // Bir sonraki noktaya geç
          setTimeout(() => {
            moveToNextPoint(index + 1);
          }, stepDuration);
        } else {
          // Tüm noktalar tamamlandı, callback'i çağır
          if (callback) callback();
        }
      }
      
      // Hareketi başlat
      moveToNextPoint(0);
    }
  
    // Senaryo göster
    function showScenario(id) {
      // Eğer bu karar noktası zaten çözüldüyse, tekrar çözülmesine gerek yok
      if (gameState.solvedDecisions.includes(id)) {
        instructionMessage.innerText = "Bu soruyu zaten yanıtladın!";
        return;
      }
      
      const scenario = scenarios.find(s => s.id === id);
      if (!scenario) return;
      
      // Mevcut başlık
      let currentScenarioId = id;
      
      // Senaryo modal
      let scenarioModal = document.createElement("div");
      scenarioModal.style.position = "absolute";
      scenarioModal.style.width = "90%";
      scenarioModal.style.maxWidth = "400px";
      scenarioModal.style.backgroundColor = "white";
      scenarioModal.style.borderRadius = "12px";
      scenarioModal.style.padding = "20px";
      scenarioModal.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
      scenarioModal.style.zIndex = "10";
      scenarioModal.style.top = "50%";
      scenarioModal.style.left = "50%";
      scenarioModal.style.transform = "translate(-50%, -50%)";
      scenarioModal.style.display = "flex";
      scenarioModal.style.flexDirection = "column";
      scenarioModal.style.gap = "15px";
      
      // Arka plan kapatıcı
      let modalOverlay = document.createElement("div");
      modalOverlay.style.position = "fixed";
      modalOverlay.style.top = "0";
      modalOverlay.style.left = "0";
      modalOverlay.style.width = "100%";
      modalOverlay.style.height = "100%";
      modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      modalOverlay.style.zIndex = "5";
      
      // Soru metni
      let questionText = document.createElement("div");
      questionText.style.fontSize = "1.1em";
      questionText.style.fontWeight = "bold";
      questionText.style.color = "#000000";
      questionText.style.textAlign = "center";
      questionText.style.marginBottom = "10px";
      questionText.innerText = scenario.question;
      scenarioModal.appendChild(questionText);
      
      // Seçenekler
      scenario.options.forEach((option, index) => {
        let optionButton = document.createElement("button");
        optionButton.style.padding = "10px 15px";
        optionButton.style.backgroundColor = "#f8f9fa";
        optionButton.style.border = "1px solid #ced4da";
        optionButton.style.borderRadius = "8px";
        optionButton.style.fontSize = "0.9em";
        optionButton.style.textAlign = "left";
        optionButton.style.cursor = "pointer";
        optionButton.style.transition = "all 0.2s";
        optionButton.style.color = "#000000"; // Yazı rengi siyah
        optionButton.innerText = option.text;
        
        optionButton.addEventListener("mouseenter", function() {
          this.style.backgroundColor = "#e9ecef";
        });
        
        optionButton.addEventListener("mouseleave", function() {
          this.style.backgroundColor = "#f8f9fa";
        });
        
        optionButton.addEventListener("click", function() {
          // Tüm butonları devre dışı bırak
          scenarioModal.querySelectorAll("button").forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = "default";
          });
          
          // Seçeneği doğru/yanlış olarak işaretle
          if (option.correct) {
            optionButton.style.backgroundColor = "#d4edda";
            optionButton.style.borderColor = "#c3e6cb";
            optionButton.style.color = "#155724";
            
            // Doğru cevap sayısını artır
            gameState.correctAnswers++;
            correctDecisions.innerHTML = `Doğru Kararlar: ${gameState.correctAnswers}`;
            
            // Doğru cevap açıklaması
            let feedbackText = document.createElement("div");
            feedbackText.style.marginTop = "15px";
            feedbackText.style.padding = "10px";
            feedbackText.style.backgroundColor = "#d4edda";
            feedbackText.style.borderRadius = "5px";
            feedbackText.style.color = "#000000"; // Yazı rengi siyah
            feedbackText.style.fontSize = "0.9em";
            feedbackText.innerHTML = `<strong>Doğru karar!</strong> Kişisel verilerin güvenliğini sağlayarak doğru bir seçim yaptın.`;
            scenarioModal.appendChild(feedbackText);
            
            // Karakter biraz sevinç göstersin
            character.style.transform = "translateY(-10px)";
            setTimeout(() => {
              character.style.transform = "translateY(0)";
            }, 300);
            
            playCorrectSound();
            
            // Kararı çözüldü olarak işaretle
            gameState.solveDecisionPoint(currentScenarioId);
            
            // Modalı 2 saniye sonra kapat
            setTimeout(() => {
              modalOverlay.remove();
              scenarioModal.remove();
            }, 2000);
            
          } else {
            optionButton.style.backgroundColor = "#f8d7da";
            optionButton.style.borderColor = "#f5c6cb";
            optionButton.style.color = "#721c24";
            
            // Yanlış cevap açıklaması
            let feedbackText = document.createElement("div");
            feedbackText.style.marginTop = "15px";
            feedbackText.style.padding = "10px";
            feedbackText.style.backgroundColor = "#f8d7da";
            feedbackText.style.borderRadius = "5px";
            feedbackText.style.color = "#000000"; // Yazı rengi siyah
            feedbackText.style.fontSize = "0.9em";
            feedbackText.innerHTML = `<strong>Dikkat!</strong> Bu yanıt kişisel verileri riske atabilir. Tekrar düşünmelisin.`;
            scenarioModal.appendChild(feedbackText);
            
            // Tekrar dene butonu
            let retryButton = document.createElement("button");
            retryButton.style.marginTop = "10px";
            retryButton.style.padding = "8px 15px";
            retryButton.style.backgroundColor = "#6c757d";
            retryButton.style.color = "white";
            retryButton.style.border = "none";
            retryButton.style.borderRadius = "5px";
            retryButton.style.cursor = "pointer";
            retryButton.innerText = "Tekrar Dene";
            
            retryButton.addEventListener("mouseenter", function() {
              this.style.backgroundColor = "#5a6268";
            });
            
            retryButton.addEventListener("mouseleave", function() {
              this.style.backgroundColor = "#6c757d";
            });
            
            retryButton.addEventListener("click", function() {
              modalOverlay.remove();
              scenarioModal.remove();
              showScenario(currentScenarioId);
            });
            
            scenarioModal.appendChild(retryButton);
            
            playWrongSound();
          }
        });
        
        scenarioModal.appendChild(optionButton);
      });
      
      // Modal ve overlay'ı ekle
      mainContainer.appendChild(modalOverlay);
      mainContainer.appendChild(scenarioModal);
    }
  
    // Tamamlama ekranı
    function showCompletionScreen() {
      // Mevcut içeriği temizle
      mainContainer.innerHTML = "";
      
      // Tamamlama kartı
      let completionCard = document.createElement("div");
      completionCard.style.width = "90%";
      completionCard.style.maxWidth = "600px";
      completionCard.style.backgroundColor = "white";
      completionCard.style.borderRadius = "12px";
      completionCard.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
      completionCard.style.padding = "25px";
      completionCard.style.display = "flex";
      completionCard.style.flexDirection = "column";
      completionCard.style.alignItems = "center";
      completionCard.style.gap = "20px";
      completionCard.style.position = "relative";
      completionCard.style.overflow = "hidden";
      mainContainer.appendChild(completionCard);
      
      // Sertifika görünümü
      let certificate = document.createElement("div");
      certificate.style.width = "100%";
      certificate.style.padding = "20px";
      certificate.style.border = "2px solid #9b59b6";
      certificate.style.borderRadius = "10px";
      certificate.style.backgroundColor = "#f9f9f9";
      certificate.style.textAlign = "center";
      certificate.style.marginBottom = "20px";
      
      // Sertifika içeriği
      certificate.innerHTML = `
        <h3 style="color: #000000; margin-bottom: 10px;">🏆 Veri Koruma Sertifikası 🏆</h3>
        <p style="color: #000000; margin-bottom: 15px;">Veri Gizliliği Labirentini başarıyla tamamladın!</p>
        <p style="color: #000000; margin-bottom: 5px;"><strong>Doğru Karar Sayısı:</strong> ${gameState.correctAnswers}/5</p>
      `;
      completionCard.appendChild(certificate);
      
      // Tebrikler mesajı
      let congratsMessage = document.createElement("div");
      congratsMessage.style.textAlign = "center";
      congratsMessage.style.marginBottom = "20px";
      congratsMessage.style.color = "#000000";
      
      // Kazanılan beceriler
      congratsMessage.innerHTML = `
        <h3>Tebrikler! 🎉</h3>
        <p>Veri gizliliği konusunda önemli beceriler kazandın:</p>
        <ul style="text-align: left; padding-left: 20px;">
          <li>Kişisel verilerin korunmasının önemini öğrendin</li>
          <li>Hangi bilgilerin paylaşılabilir olduğunu anladın</li>
          <li>Çevrimiçi güvenliğin temel prensiplerini kavradın</li>
        </ul>
      `;
      completionCard.appendChild(congratsMessage);
      
      // Sonraki bulmacaya geçiş butonu
      let nextButton = document.createElement("button");
      nextButton.innerText = "Sonraki Bulmaca";
      nextButton.style.backgroundColor = "#9b59b6";
      nextButton.style.color = "white";
      nextButton.style.border = "none";
      nextButton.style.padding = "12px 24px";
      nextButton.style.borderRadius = "30px";
      nextButton.style.fontSize = "1em";
      nextButton.style.fontWeight = "bold";
      nextButton.style.cursor = "pointer";
      nextButton.style.transition = "background-color 0.3s";
      nextButton.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
      nextButton.style.margin = "10px 0";
      
      nextButton.addEventListener("mouseover", function() {
        this.style.backgroundColor = "#8e44ad";
      });
      
      nextButton.addEventListener("mouseout", function() {
        this.style.backgroundColor = "#9b59b6";
      });
      
      nextButton.addEventListener("click", function() {
        playClickSound();
        goNextPuzzle();
      });
      
      completionCard.appendChild(nextButton);
      
      // Konfeti efekti
      addConfetti();
    }
    
    // Konfeti efekti
    function addConfetti() {
      for (let i = 0; i < 100; i++) {
        let confetti = document.createElement("div");
        confetti.style.position = "absolute";
        confetti.style.width = Math.random() * 10 + 5 + "px";
        confetti.style.height = Math.random() * 5 + 10 + "px";
        confetti.style.backgroundColor = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c"][Math.floor(Math.random() * 6)];
        confetti.style.borderRadius = "2px";
        confetti.style.top = "-10px";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.transform = "rotate(" + Math.random() * 360 + "deg)";
        confetti.style.opacity = Math.random() * 0.5 + 0.5;
        confetti.style.animation = "confetti-fall 3s linear forwards";
        mainContainer.appendChild(confetti);
      }
      
      // Konfeti animasyonu stil
      let style = document.createElement("style");
      style.innerHTML = `
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10px) rotate(0deg) scale(1);
          }
          100% {
            transform: translateY(500px) rotate(360deg) scale(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Başlangıçta yönlendirme mesajı
    instructionMessage.innerText = "Labirente başlamak için yeşil BAŞLA noktasına tıkla!";
    
    // Başlangıçta başlangıç noktasını kullanılabilir yap
    gameState.availablePoints = [0, 1]; // Başlangıç ve 1. soru erişilebilir
    
    // Başlangıçta düğüm görünümlerini güncelle
    updateDecisionPointsAppearance();
  }

function setupPlanet6Puzzle2() {
  puzzleHintText.innerText = "IPUCU: Yapay zekanın etik kullanımı konusunda düşün ve doğru seçenekleri bul.";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "20px";
  mainContainer.style.padding = "20px 10px";
  puzzleArea.appendChild(mainContainer);

  // Başlık
  let title = document.createElement("h2");
  title.innerHTML = "🤖 Yapay Zeka Etiği: Dürüst Robot Arkadaşlar";
  title.style.color = "#000000";
  title.style.textAlign = "center";
  title.style.margin = "0";
  title.style.fontSize = "1.5em";
  mainContainer.appendChild(title);

  // Bilgilendirme kartı
  let infoCard = document.createElement("div");
  infoCard.style.width = "100%";
  infoCard.style.backgroundColor = "rgba(155, 89, 182, 0.1)";
  infoCard.style.borderRadius = "12px";
  infoCard.style.padding = "20px";
  infoCard.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  infoCard.style.border = "2px solid rgba(155, 89, 182, 0.3)";
  
  // Bilgilendirme metni başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "Yapay Zeka Hakkında Bilmen Gerekenler";
  infoTitle.style.color = "#000000";
  infoTitle.style.margin = "0 0 15px 0";
  infoCard.appendChild(infoTitle);
  
  // Bilgilendirme metni
  let infoText = document.createElement("div");
  infoText.style.color = "#000000";
  infoText.style.fontSize = "1em";
  infoText.style.lineHeight = "1.4";
  infoText.innerHTML = `
    <p>Yapay zeka, bilgisayarları ve robotları daha akıllı yapan bir teknolojidir. Bu akıllı robotlar bize yardımcı olmak için tasarlanır. Ancak bu robotların doğru ve dürüst davranması, insanlara zarar vermemesi ve adil olması çok önemlidir.</p>
    
    <p><strong>Yapay zekanın etik kuralları şunlardır:</strong></p>
    <ol>
      <li>Yapay zeka sistemleri insanlara zarar vermemelidir</li>
      <li>Yapay zeka kararları adil ve eşit olmalıdır</li>
      <li>İnsanların özel bilgileri izinsiz kullanılmamalıdır</li>
      <li>Robotlar her zaman dürüst olmalı ve yalan söylememelidir</li>
    </ol>
  `;
  infoCard.appendChild(infoText);
  mainContainer.appendChild(infoCard);

  // Soru container
  let quizContainer = document.createElement("div");
  quizContainer.style.width = "100%";
  quizContainer.style.display = "flex";
  quizContainer.style.flexDirection = "column";
  quizContainer.style.gap = "30px";
  quizContainer.style.marginTop = "20px";
  mainContainer.appendChild(quizContainer);

  // Skor takibi
  let score = 0;
  let currentQuestion = 0;

  // Sorular ve cevapları
  const questions = [
    {
      question: "Okulda ödevlere yardımcı olan bir yapay zeka robotu düşün. Bu robot aşağıdakilerden hangisini yapmamalıdır?",
      options: [
        { text: "Senin yerine tüm ödevi yapmak", correct: true },
        { text: "Zor konuları basitçe açıklamak", correct: false },
        { text: "Yanlış yaptığın yerleri göstermek", correct: false }
      ]
    },
    {
      question: "Bir yapay zeka oyunu arkadaşlarından birine daha kolay sorular soruyor. Bu durumda ne yapmalısın?",
      options: [
        { text: "Oyunu hiç oynamamak", correct: false },
        { text: "Oyunun adil olmadığını söylemek ve düzeltilmesini istemek", correct: true },
        { text: "Hiçbir şey yapmamak, önemli değil", correct: false }
      ]
    }
  ];

  // İlk soruyu göster
  showQuestion(currentQuestion);

  // Soru gösterme fonksiyonu
  function showQuestion(index) {
    // Soru container'ı temizle
    quizContainer.innerHTML = "";
    
    // Mevcut soru
    const q = questions[index];
    
    // Soru kartı
    let questionCard = document.createElement("div");
    questionCard.className = "question-card";
    questionCard.style.backgroundColor = "white";
    questionCard.style.borderRadius = "12px";
    questionCard.style.padding = "20px";
    questionCard.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    questionCard.style.width = "100%";
    
    // Soru numarası ve metni
    let questionText = document.createElement("div");
    questionText.style.fontSize = "1.1em";
    questionText.style.fontWeight = "bold";
    questionText.style.marginBottom = "15px";
    questionText.style.color = "#000000";
    questionText.innerHTML = `<span style="color: #9b59b6">Soru ${index + 1}:</span> ${q.question}`;
    questionCard.appendChild(questionText);
    
    // Seçenekler
    let optionsContainer = document.createElement("div");
    optionsContainer.style.display = "flex";
    optionsContainer.style.flexDirection = "column";
    optionsContainer.style.gap = "10px";
    
    // Her seçenek için buton oluştur
    q.options.forEach((option, optionIndex) => {
      let optionButton = document.createElement("button");
      optionButton.innerText = option.text;
      optionButton.style.padding = "12px 15px";
      optionButton.style.fontSize = "1em";
      optionButton.style.borderRadius = "8px";
      optionButton.style.backgroundColor = "#f8f9fa";
      optionButton.style.border = "1px solid #ced4da";
      optionButton.style.cursor = "pointer";
      optionButton.style.textAlign = "left";
      optionButton.style.transition = "all 0.2s";
      optionButton.style.color = "#000000";
      
      // Buton hover efekti
      optionButton.addEventListener("mouseenter", function() {
        this.style.backgroundColor = "#e9ecef";
      });
      
      optionButton.addEventListener("mouseleave", function() {
        if (!this.disabled) {
          this.style.backgroundColor = "#f8f9fa";
        }
      });
      
      // Buton tıklama olayı
      optionButton.addEventListener("click", function() {
        // Tüm seçenekleri devre dışı bırak
        optionsContainer.querySelectorAll("button").forEach(btn => {
          btn.disabled = true;
          btn.style.cursor = "default";
        });
        
        // Feedback alanı 
        let feedback = document.createElement("div");
        feedback.style.marginTop = "15px";
        feedback.style.padding = "10px";
        feedback.style.borderRadius = "8px";
        feedback.style.fontSize = "0.9em";
        
        if (option.correct) {
          // Doğru cevap
          this.style.backgroundColor = "#d4edda";
          this.style.borderColor = "#c3e6cb";
          this.style.color = "#155724";
          
          feedback.style.backgroundColor = "#d4edda";
          feedback.style.color = "#000000";
          feedback.innerHTML = "<strong>Harika! 🎉</strong> Çok doğru düşündün!";
          
          score++;
          playCorrectSound();
          
          // Bir sonraki soruyu göster veya tamamlama ekranını getir
          setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < questions.length) {
              showQuestion(currentQuestion);
            } else {
              showCompletionScreen();
            }
          }, 1500);
          
        } else {
          // Yanlış cevap
          this.style.backgroundColor = "#f8d7da";
          this.style.borderColor = "#f5c6cb";
          this.style.color = "#721c24";
          
          feedback.style.backgroundColor = "#f8d7da";
          feedback.style.color = "#000000";
          feedback.innerHTML = "<strong>Tekrar düşün!</strong> Bu seçenek etik kurallara pek uygun değil.";
          
          // Doğru cevabı göster
          q.options.forEach((o, i) => {
            if (o.correct) {
              optionsContainer.querySelectorAll("button")[i].style.backgroundColor = "#d4edda";
              optionsContainer.querySelectorAll("button")[i].style.borderColor = "#c3e6cb";
              optionsContainer.querySelectorAll("button")[i].style.color = "#155724";
            }
          });
          
          playWrongSound();
          
          // Tekrar butonu ekle
          let retryButton = document.createElement("button");
          retryButton.innerText = "Tekrar Dene";
          retryButton.style.marginTop = "15px";
          retryButton.style.padding = "10px 15px";
          retryButton.style.backgroundColor = "#6c757d";
          retryButton.style.color = "white";
          retryButton.style.border = "none";
          retryButton.style.borderRadius = "5px";
          retryButton.style.cursor = "pointer";
          
          retryButton.addEventListener("click", function() {
            showQuestion(currentQuestion);
          });
          
          questionCard.appendChild(retryButton);
        }
        
        questionCard.appendChild(feedback);
      });
      
      optionsContainer.appendChild(optionButton);
    });
    
    questionCard.appendChild(optionsContainer);
    quizContainer.appendChild(questionCard);
  }

  // Tamamlama ekranı
  function showCompletionScreen() {
    // Mevcut içeriği temizle
    mainContainer.innerHTML = "";
    
    // Tamamlama kartı
    let completionCard = document.createElement("div");
    completionCard.style.width = "90%";
    completionCard.style.maxWidth = "600px";
    completionCard.style.backgroundColor = "white";
    completionCard.style.borderRadius = "12px";
    completionCard.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
    completionCard.style.padding = "25px";
    completionCard.style.display = "flex";
    completionCard.style.flexDirection = "column";
    completionCard.style.alignItems = "center";
    completionCard.style.gap = "20px";
    completionCard.style.position = "relative";
    completionCard.style.overflow = "hidden";
    mainContainer.appendChild(completionCard);
    
    // Sertifika görünümü
    let certificate = document.createElement("div");
    certificate.style.width = "100%";
    certificate.style.padding = "20px";
    certificate.style.border = "2px solid #9b59b6";
    certificate.style.borderRadius = "10px";
    certificate.style.backgroundColor = "#f9f9f9";
    certificate.style.textAlign = "center";
    certificate.style.marginBottom = "20px";
    
    // Sertifika içeriği
    certificate.innerHTML = `
      <h3 style="color: #000000; margin-bottom: 10px;">🏆 Etik Yapay Zeka Uzmanı 🏆</h3>
      <p style="color: #000000; margin-bottom: 15px;">Tebrikler! Yapay zeka etiği konusunda önemli bilgiler öğrendin!</p>
      <p style="color: #000000; margin-bottom: 5px;"><strong>Skorun:</strong> ${score}/${questions.length}</p>
    `;
    completionCard.appendChild(certificate);
    
    // Tebrikler mesajı
    let congratsMessage = document.createElement("div");
    congratsMessage.style.textAlign = "center";
    congratsMessage.style.marginBottom = "20px";
    congratsMessage.style.color = "#000000";
    
    // Kazanılan beceriler
    congratsMessage.innerHTML = `
      <h3>Tebrikler! 🎉</h3>
      <p>Artık yapay zekanın etik kurallarını biliyorsun!</p>
      <ul style="text-align: left; padding-left: 20px;">
        <li>Yapay zekanın insanlara zarar vermemesi gerektiğini öğrendin</li>
        <li>Adil ve eşit yapay zeka sistemlerinin önemini kavradın</li>
        <li>Yapay zeka kullanımında dürüstlüğün değerini anladın</li>
      </ul>
    `;
    completionCard.appendChild(congratsMessage);
    
    // Konfeti efekti
    addConfetti();
    
    // Sonraki bulmacaya otomatik geçiş
    setTimeout(() => {
      goNextPuzzle();
    }, 5000);
  }
  
  // Konfeti efekti
  function addConfetti() {
    for (let i = 0; i < 100; i++) {
      let confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = Math.random() * 5 + 10 + "px";
      confetti.style.backgroundColor = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c"][Math.floor(Math.random() * 6)];
      confetti.style.borderRadius = "2px";
      confetti.style.top = "-10px";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      confetti.style.opacity = Math.random() * 0.5 + 0.5;
      confetti.style.animation = "confetti-fall 3s linear forwards";
      mainContainer.appendChild(confetti);
    }
    
    // Konfeti animasyonu stil
    let style = document.createElement("style");
    style.innerHTML = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(-10px) rotate(0deg) scale(1);
        }
        100% {
          transform: translateY(500px) rotate(360deg) scale(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

function setupPlanet6Puzzle3() {
  puzzleHintText.innerText = "IPUCU: Yapay zeka ile ilgili doğru ve yanlış ifadeleri ayırt etmeye çalış.";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "20px";
  mainContainer.style.padding = "20px 10px";
  puzzleArea.appendChild(mainContainer);

  // Başlık
  let title = document.createElement("h2");
  title.innerHTML = "🧠 Etik Yapay Zeka: Doğru mu, Yanlış mı?";
  title.style.color = "#000000";
  title.style.textAlign = "center";
  title.style.margin = "0";
  title.style.fontSize = "1.5em";
  mainContainer.appendChild(title);

  // Bilgilendirme kartı
  let infoCard = document.createElement("div");
  infoCard.style.width = "100%";
  infoCard.style.backgroundColor = "rgba(155, 89, 182, 0.1)";
  infoCard.style.borderRadius = "12px";
  infoCard.style.padding = "20px";
  infoCard.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  infoCard.style.border = "2px solid rgba(155, 89, 182, 0.3)";
  
  // Bilgilendirme metni başlığı
  let infoTitle = document.createElement("h3");
  infoTitle.innerHTML = "Yapay Zeka Sistemlerinin Etik Kullanımı";
  infoTitle.style.color = "#000000";
  infoTitle.style.margin = "0 0 15px 0";
  infoCard.appendChild(infoTitle);
  
  // Bilgilendirme metni
  let infoText = document.createElement("div");
  infoText.style.color = "#000000";
  infoText.style.fontSize = "1em";
  infoText.style.lineHeight = "1.4";
  infoText.innerHTML = `
    <p>Etik değerler, yapay zeka sistemlerinin insan hayatını iyileştirmesini sağlayan kurallardır. İyi tasarlanmış yapay zeka sistemleri insanlara fayda sağlar, güvenlidir ve adil çalışır.</p>
    
    <p><strong>Etik yapay zeka sistemlerinin temel özellikleri:</strong></p>
    <ul>
      <li><strong>Şeffaflık:</strong> Yapay zeka sistemleri nasıl çalıştığını açıklayabilmelidir</li>
      <li><strong>Adalet:</strong> Herkesin eşit ve adil şekilde değerlendirilmesi gerekir</li>
      <li><strong>Mahremiyet:</strong> Kişisel bilgiler korunmalıdır</li>
      <li><strong>Güvenlik:</strong> Sistemler güvenli ve kontrol edilebilir olmalıdır</li>
      <li><strong>İnsan kontrolü:</strong> İnsanlar her zaman yapay zeka üzerinde son sözü söylemelidir</li>
    </ul>
    
    <p>Şimdi bu bilgilere göre aşağıdaki ifadelerin doğru mu yoksa yanlış mı olduğunu değerlendirelim.</p>
  `;
  infoCard.appendChild(infoText);
  mainContainer.appendChild(infoCard);

  // Soru container
  let quizContainer = document.createElement("div");
  quizContainer.style.width = "100%";
  quizContainer.style.display = "flex";
  quizContainer.style.flexDirection = "column";
  quizContainer.style.gap = "30px";
  quizContainer.style.marginTop = "20px";
  mainContainer.appendChild(quizContainer);

  // İlerleme göstergesi
  let progressBar = document.createElement("div");
  progressBar.style.width = "100%";
  progressBar.style.height = "10px";
  progressBar.style.backgroundColor = "#f1f1f1";
  progressBar.style.borderRadius = "5px";
  progressBar.style.marginBottom = "20px";
  progressBar.style.position = "relative";
  mainContainer.appendChild(progressBar);
  
  let progressFill = document.createElement("div");
  progressFill.style.width = "0%";
  progressFill.style.height = "100%";
  progressFill.style.backgroundColor = "#9b59b6";
  progressFill.style.borderRadius = "5px";
  progressFill.style.transition = "width 0.3s";
  progressBar.appendChild(progressFill);
  
  let progressText = document.createElement("div");
  progressText.style.textAlign = "center";
  progressText.style.marginTop = "5px";
  progressText.style.fontSize = "0.9em";
  progressText.style.color = "#000000";
  progressText.innerHTML = "1/5 Soru";
  progressBar.appendChild(progressText);

  // Skor takibi
  let score = 0;
  let currentQuestion = 0;

  // Sorular ve cevapları
  const questions = [
    {
      statement: "Yapay zeka sistemleri her zaman doğru kararlar verir ve hiç hata yapmaz.",
      answer: false,
      explanation: "Yapay zeka sistemleri de hata yapabilir. İnsanlar gibi onlar da yanlış karar verebilir veya önyargılı olabilir."
    },
    {
      statement: "Bir yapay zeka sisteminin nasıl karar verdiğini bilmek önemlidir.",
      answer: true,
      explanation: "Bu şeffaflık prensibidir. Yapay zekanın nasıl çalıştığını ve nasıl karar verdiğini bilmek çok önemlidir."
    },
    {
      statement: "Yapay zeka sistemleri her zaman insanlardan daha zekidir.",
      answer: false,
      explanation: "Yapay zeka sistemleri sadece belirli görevlerde iyi performans gösterir. İnsanların sahip olduğu genel zeka ve duygusal zekaya sahip değildir."
    },
    {
      statement: "Yapay zeka sistemlerinin kişisel bilgilerimizi koruma sorumluluğu vardır.",
      answer: true,
      explanation: "Mahremiyet, etik yapay zekanın temel bir prensibidir. Kişisel bilgilerin korunması çok önemlidir."
    },
    {
      statement: "Yapay zeka sistemleri üzerinde son kontrol her zaman insanlarda olmalıdır.",
      answer: true,
      explanation: "İnsan kontrolü önemlidir. İnsanlar her zaman yapay zeka sistemlerini denetlemeli ve gerektiğinde müdahale edebilmelidir."
    }
  ];

  // İlk soruyu göster
  showQuestion(currentQuestion);

  // Soru gösterme fonksiyonu
  function showQuestion(index) {
    // Soru container'ı temizle
    quizContainer.innerHTML = "";
    
    // Mevcut soru
    const q = questions[index];
    
    // İlerlemeyi güncelle
    progressFill.style.width = `${(index / questions.length) * 100}%`;
    progressText.innerHTML = `${index + 1}/5 Soru`;
    
    // Soru kartı
    let questionCard = document.createElement("div");
    questionCard.className = "question-card";
    questionCard.style.backgroundColor = "white";
    questionCard.style.borderRadius = "12px";
    questionCard.style.padding = "20px";
    questionCard.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    questionCard.style.width = "100%";
    
    // Soru numarası ve ifade
    let questionText = document.createElement("div");
    questionText.style.fontSize = "1.1em";
    questionText.style.fontWeight = "bold";
    questionText.style.marginBottom = "20px";
    questionText.style.color = "#000000";
    questionText.innerHTML = `<span style="color: #9b59b6">İfade ${index + 1}:</span> ${q.statement}`;
    questionCard.appendChild(questionText);
    
    // Soru bildirimi
    let questionPrompt = document.createElement("div");
    questionPrompt.style.fontSize = "1em";
    questionPrompt.style.marginBottom = "15px";
    questionPrompt.style.color = "#000000";
    questionPrompt.innerHTML = "Bu ifade doğru mu, yoksa yanlış mı?";
    questionCard.appendChild(questionPrompt);
    
    // Butonlar container
    let buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.justifyContent = "center";
    buttonsContainer.style.gap = "20px";
    buttonsContainer.style.marginTop = "10px";
    
    // Doğru butonu
    let trueButton = document.createElement("button");
    trueButton.innerText = "Doğru";
    trueButton.style.padding = "12px 30px";
    trueButton.style.fontSize = "1em";
    trueButton.style.borderRadius = "8px";
    trueButton.style.backgroundColor = "#f8f9fa";
    trueButton.style.border = "1px solid #28a745";
    trueButton.style.cursor = "pointer";
    trueButton.style.transition = "all 0.2s";
    trueButton.style.color = "#000000";
    trueButton.style.fontWeight = "bold";
    
    // Yanlış butonu
    let falseButton = document.createElement("button");
    falseButton.innerText = "Yanlış";
    falseButton.style.padding = "12px 30px";
    falseButton.style.fontSize = "1em";
    falseButton.style.borderRadius = "8px";
    falseButton.style.backgroundColor = "#f8f9fa";
    falseButton.style.border = "1px solid #dc3545";
    falseButton.style.cursor = "pointer";
    falseButton.style.transition = "all 0.2s";
    falseButton.style.color = "#000000";
    falseButton.style.fontWeight = "bold";
    
    // Hover efektleri
    trueButton.addEventListener("mouseenter", function() {
      this.style.backgroundColor = "#e9ecef";
    });
    
    trueButton.addEventListener("mouseleave", function() {
      if (!this.disabled) {
        this.style.backgroundColor = "#f8f9fa";
      }
    });
    
    falseButton.addEventListener("mouseenter", function() {
      this.style.backgroundColor = "#e9ecef";
    });
    
    falseButton.addEventListener("mouseleave", function() {
      if (!this.disabled) {
        this.style.backgroundColor = "#f8f9fa";
      }
    });
    
    // Doğru butonuna tıklama
    trueButton.addEventListener("click", function() {
      handleAnswer(true);
    });
    
    // Yanlış butonuna tıklama
    falseButton.addEventListener("click", function() {
      handleAnswer(false);
    });
    
    buttonsContainer.appendChild(trueButton);
    buttonsContainer.appendChild(falseButton);
    questionCard.appendChild(buttonsContainer);
    
    quizContainer.appendChild(questionCard);
    
    // Cevap kontrol fonksiyonu
    function handleAnswer(userAnswer) {
      // Butonları devre dışı bırak
      trueButton.disabled = true;
      falseButton.disabled = true;
      trueButton.style.cursor = "default";
      falseButton.style.cursor = "default";
      
      // Feedback alanı
      let feedback = document.createElement("div");
      feedback.style.marginTop = "20px";
      feedback.style.padding = "15px";
      feedback.style.borderRadius = "8px";
      feedback.style.fontSize = "0.9em";
      
      // Kullanıcının cevabı doğruysa
      if (userAnswer === q.answer) {
        // Hangi butona tıklandıysa onu vurgula
        if (userAnswer) {
          trueButton.style.backgroundColor = "#d4edda";
          trueButton.style.borderColor = "#c3e6cb";
          trueButton.style.color = "#155724";
        } else {
          falseButton.style.backgroundColor = "#d4edda";
          falseButton.style.borderColor = "#c3e6cb";
          falseButton.style.color = "#155724";
        }
        
        feedback.style.backgroundColor = "#d4edda";
        feedback.style.color = "#000000";
        feedback.innerHTML = `<strong>Doğru cevap! 🎉</strong><br>${q.explanation}`;
        
        score++;
        playCorrectSound();
      } else {
        // Kullanıcının yanlış cevap verdiği butonu vurgula
        if (userAnswer) {
          trueButton.style.backgroundColor = "#f8d7da";
          trueButton.style.borderColor = "#f5c6cb";
          trueButton.style.color = "#721c24";
        } else {
          falseButton.style.backgroundColor = "#f8d7da";
          falseButton.style.borderColor = "#f5c6cb";
          falseButton.style.color = "#721c24";
        }
        
        // Doğru cevabı yeşille vurgula
        if (q.answer) {
          trueButton.style.backgroundColor = "#d4edda";
          trueButton.style.borderColor = "#c3e6cb";
          trueButton.style.color = "#155724";
        } else {
          falseButton.style.backgroundColor = "#d4edda";
          falseButton.style.borderColor = "#c3e6cb";
          falseButton.style.color = "#155724";
        }
        
        feedback.style.backgroundColor = "#f8d7da";
        feedback.style.color = "#000000";
        feedback.innerHTML = `<strong>Yanlış cevap!</strong><br>${q.explanation}`;
        
        playWrongSound();
      }
      
      questionCard.appendChild(feedback);
      
      // Bir sonraki soruya geç
      setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
          showQuestion(currentQuestion);
        } else {
          // Son soru da bitti, ilerleme çubuğunu tamamla
          progressFill.style.width = "100%";
          
          // Tamamlama ekranını göster
          setTimeout(() => {
            showCompletionScreen();
          }, 500);
        }
      }, 2000);
    }
  }

  // Tamamlama ekranı
  function showCompletionScreen() {
    // Mevcut içeriği temizle
    mainContainer.innerHTML = "";
    
    // Tamamlama kartı
    let completionCard = document.createElement("div");
    completionCard.style.width = "90%";
    completionCard.style.maxWidth = "600px";
    completionCard.style.backgroundColor = "white";
    completionCard.style.borderRadius = "12px";
    completionCard.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
    completionCard.style.padding = "25px";
    completionCard.style.display = "flex";
    completionCard.style.flexDirection = "column";
    completionCard.style.alignItems = "center";
    completionCard.style.gap = "20px";
    completionCard.style.position = "relative";
    completionCard.style.overflow = "hidden";
    mainContainer.appendChild(completionCard);
    
    // Sertifika görünümü
    let certificate = document.createElement("div");
    certificate.style.width = "100%";
    certificate.style.padding = "20px";
    certificate.style.border = "2px solid #9b59b6";
    certificate.style.borderRadius = "10px";
    certificate.style.backgroundColor = "#f9f9f9";
    certificate.style.textAlign = "center";
    certificate.style.marginBottom = "20px";
    
    // Sertifika içeriği
    certificate.innerHTML = `
      <h3 style="color: #000000; margin-bottom: 10px;">🏆 Etik Yapay Zeka Bilgi Uzmanı 🏆</h3>
      <p style="color: #000000; margin-bottom: 15px;">Tebrikler! Yapay zeka etiği hakkındaki bilgi testini tamamladın!</p>
      <p style="color: #000000; margin-bottom: 5px;"><strong>Skorun:</strong> ${score}/${questions.length}</p>
    `;
    completionCard.appendChild(certificate);
    
    // Tebrikler mesajı
    let congratsMessage = document.createElement("div");
    congratsMessage.style.textAlign = "center";
    congratsMessage.style.marginBottom = "20px";
    congratsMessage.style.color = "#000000";
    
    // Kazanılan beceriler
    congratsMessage.innerHTML = `
      <h3>Tebrikler! 🎉</h3>
      <p>Artık etik yapay zeka sistemlerini daha iyi tanıyorsun!</p>
      <ul style="text-align: left; padding-left: 20px;">
        <li>Yapay zeka sistemlerinin sınırlarını anladın</li>
        <li>Şeffaflık ve adalet gibi etik değerlerin önemini kavradın</li>
        <li>Yapay zeka kullanımında insan kontrolünün değerini öğrendin</li>
      </ul>
    `;
    completionCard.appendChild(congratsMessage);
    
    // Konfeti efekti
    addConfetti();
    
    // Sonraki bulmacaya otomatik geçiş
    setTimeout(() => {
      goNextPuzzle();
    }, 5000);
  }
  
  // Konfeti efekti
  function addConfetti() {
    for (let i = 0; i < 100; i++) {
      let confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = Math.random() * 5 + 10 + "px";
      confetti.style.backgroundColor = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c"][Math.floor(Math.random() * 6)];
      confetti.style.borderRadius = "2px";
      confetti.style.top = "-10px";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      confetti.style.opacity = Math.random() * 0.5 + 0.5;
      confetti.style.animation = "confetti-fall 3s linear forwards";
      mainContainer.appendChild(confetti);
    }
    
    // Konfeti animasyonu stil
    let style = document.createElement("style");
    style.innerHTML = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(-10px) rotate(0deg) scale(1);
        }
        100% {
          transform: translateY(500px) rotate(360deg) scale(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

function setupPlanet6Puzzle4() {
  puzzleHintText.innerText = "IPUCU: Farklı yapay zeka kullanım senaryolarını etik veya etik değil kategorilerine doğru şekilde yerleştir.";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "20px";
  mainContainer.style.padding = "20px 10px";
  puzzleArea.appendChild(mainContainer);

  // Başlık
  let title = document.createElement("h2");
  title.innerHTML = "🤖 Etik Yapay Zeka Senaryoları";
  title.style.color = "#000000";
  title.style.textAlign = "center";
  title.style.margin = "0";
  title.style.fontSize = "1.5em";
  mainContainer.appendChild(title);

  // Bilgilendirme kartı
  let infoCard = document.createElement("div");
  infoCard.style.width = "100%";
  infoCard.style.backgroundColor = "rgba(155, 89, 182, 0.1)";
  infoCard.style.borderRadius = "12px";
  infoCard.style.padding = "15px";
  infoCard.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  infoCard.style.border = "2px solid rgba(155, 89, 182, 0.3)";
  infoCard.style.marginBottom = "10px";
  
  // Bilgilendirme metni
  let infoText = document.createElement("div");
  infoText.style.color = "#000000";
  infoText.style.fontSize = "0.95em";
  infoText.style.lineHeight = "1.4";
  infoText.innerHTML = `
    <p>Yapay zeka sistemleri hayatımızın birçok alanında kullanılıyor. Ancak bu sistemlerin etik kurallara uygun şekilde tasarlanması ve kullanılması çok önemlidir.</p>
    <p>Aşağıdaki senaryoları <strong>Etik ✅</strong> veya <strong>Etik Değil ❌</strong> kategorilerine sürükleyerek doğru şekilde sınıflandır.</p>
  `;
  infoCard.appendChild(infoText);
  mainContainer.appendChild(infoCard);

  // Oyun alanı
  let gameArea = document.createElement("div");
  gameArea.style.display = "flex";
  gameArea.style.width = "100%";
  gameArea.style.gap = "20px";
  gameArea.style.flexDirection = "column";
  mainContainer.appendChild(gameArea);

  // İlerleme göstergesi
  let progressContainer = document.createElement("div");
  progressContainer.style.width = "100%";
  progressContainer.style.display = "flex";
  progressContainer.style.justifyContent = "space-between";
  progressContainer.style.alignItems = "center";
  progressContainer.style.marginBottom = "15px";
  
  let progressText = document.createElement("div");
  progressText.style.color = "#000000";
  progressText.style.fontWeight = "bold";
  progressText.style.fontSize = "0.9em";
  progressText.innerText = "Eşleştirilen: 0/8";
  
  let scoreText = document.createElement("div");
  scoreText.style.color = "#000000";
  scoreText.style.fontWeight = "bold";
  scoreText.style.fontSize = "0.9em";
  scoreText.innerText = "Puan: 0";
  
  progressContainer.appendChild(progressText);
  progressContainer.appendChild(scoreText);
  gameArea.appendChild(progressContainer);

  // Üst alan - Senaryolar bölümü
  let scenariosContainer = document.createElement("div");
  scenariosContainer.style.display = "flex";
  scenariosContainer.style.flexWrap = "wrap";
  scenariosContainer.style.gap = "10px";
  scenariosContainer.style.justifyContent = "center";
  scenariosContainer.style.marginBottom = "20px";
  gameArea.appendChild(scenariosContainer);

  // Alt alan - Etik ve Etik Değil bölümleri
  let categoriesContainer = document.createElement("div");
  categoriesContainer.style.display = "flex";
  categoriesContainer.style.width = "100%";
  categoriesContainer.style.gap = "15px";
  categoriesContainer.style.justifyContent = "space-between";
  gameArea.appendChild(categoriesContainer);

  // Etik alanı
  let ethicalContainer = document.createElement("div");
  ethicalContainer.style.width = "48%";
  ethicalContainer.style.minHeight = "200px";
  ethicalContainer.style.backgroundColor = "rgba(46, 204, 113, 0.1)";
  ethicalContainer.style.border = "2px dashed #2ecc71";
  ethicalContainer.style.borderRadius = "10px";
  ethicalContainer.style.padding = "10px";
  ethicalContainer.style.display = "flex";
  ethicalContainer.style.flexDirection = "column";
  ethicalContainer.style.alignItems = "center";
  ethicalContainer.style.gap = "10px";
  ethicalContainer.className = "drop-zone";
  ethicalContainer.dataset.type = "ethical";
  
  let ethicalTitle = document.createElement("div");
  ethicalTitle.innerText = "Etik ✅";
  ethicalTitle.style.fontWeight = "bold";
  ethicalTitle.style.fontSize = "1.1em";
  ethicalTitle.style.color = "#000000";
  ethicalTitle.style.marginBottom = "5px";
  ethicalContainer.appendChild(ethicalTitle);
  
  categoriesContainer.appendChild(ethicalContainer);

  // Etik Değil alanı
  let unethicalContainer = document.createElement("div");
  unethicalContainer.style.width = "48%";
  unethicalContainer.style.minHeight = "200px";
  unethicalContainer.style.backgroundColor = "rgba(231, 76, 60, 0.1)";
  unethicalContainer.style.border = "2px dashed #e74c3c";
  unethicalContainer.style.borderRadius = "10px";
  unethicalContainer.style.padding = "10px";
  unethicalContainer.style.display = "flex";
  unethicalContainer.style.flexDirection = "column";
  unethicalContainer.style.alignItems = "center";
  unethicalContainer.style.gap = "10px";
  unethicalContainer.className = "drop-zone";
  unethicalContainer.dataset.type = "unethical";
  
  let unethicalTitle = document.createElement("div");
  unethicalTitle.innerText = "Etik Değil ❌";
  unethicalTitle.style.fontWeight = "bold";
  unethicalTitle.style.fontSize = "1.1em";
  unethicalTitle.style.color = "#000000";
  unethicalTitle.style.marginBottom = "5px";
  unethicalContainer.appendChild(unethicalTitle);
  
  categoriesContainer.appendChild(unethicalContainer);

  // Senaryolar
  const scenarios = [
    {
      id: "scenario1",
      text: "Yaşlı insanlara ev işlerinde yardım eden robot",
      type: "ethical"
    },
    {
      id: "scenario2",
      text: "İzin almadan insanların özel bilgilerini toplayan uygulama",
      type: "unethical"
    },
    {
      id: "scenario3",
      text: "Öğrencilere matematik öğreten eğitim uygulaması",
      type: "ethical"
    },
    {
      id: "scenario4",
      text: "Biri için gizlice mesaj okuyan yapay zeka",
      type: "unethical"
    },
    {
      id: "scenario5",
      text: "Doktorlara teşhiste yardımcı olan sağlık robotu",
      type: "ethical"
    },
    {
      id: "scenario6",
      text: "Sadece zengin insanlara hizmet veren yapay zeka",
      type: "unethical"
    },
    {
      id: "scenario7",
      text: "Çiftçilere ürünlerin bakımı için öneri veren sistem",
      type: "ethical"
    },
    {
      id: "scenario8",
      text: "Yalan haber üreten ve yayan sosyal medya botu",
      type: "unethical"
    }
  ];

  // Senaryoları karıştır
  const shuffledScenarios = shuffleArray([...scenarios]);

  // Senaryoları ekle
  shuffledScenarios.forEach(scenario => {
    const scenarioCard = createScenarioCard(scenario);
    scenariosContainer.appendChild(scenarioCard);
  });

  // Oyun istatistikleri
  let gameStats = {
    matchedCount: 0,
    score: 0,
    totalScenarios: scenarios.length
  };

  // Senaryo kartı oluşturma fonksiyonu
  function createScenarioCard(scenario) {
    let card = document.createElement("div");
    card.id = scenario.id;
    card.className = "scenario-card";
    card.draggable = true;
    card.dataset.type = scenario.type;
    card.style.width = "180px";
    card.style.backgroundColor = "white";
    card.style.padding = "12px";
    card.style.borderRadius = "8px";
    card.style.boxShadow = "0 3px 6px rgba(0,0,0,0.1)";
    card.style.cursor = "grab";
    card.style.marginBottom = "10px";
    card.style.transition = "transform 0.2s, box-shadow 0.2s";
    card.style.color = "#000000";
    card.style.fontSize = "0.9em";
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.justifyContent = "center";
    card.style.textAlign = "center";
    card.style.minHeight = "80px";
    card.innerText = scenario.text;
    
    // Sürükleme olayları
    card.addEventListener("dragstart", function(e) {
      e.dataTransfer.setData("text/plain", scenario.id);
      setTimeout(() => {
        card.style.opacity = "0.4";
      }, 0);
    });
    
    card.addEventListener("dragend", function() {
      card.style.opacity = "1";
    });
    
    card.addEventListener("mouseenter", function() {
      card.style.transform = "translateY(-3px)";
      card.style.boxShadow = "0 5px 10px rgba(0,0,0,0.15)";
    });
    
    card.addEventListener("mouseleave", function() {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 3px 6px rgba(0,0,0,0.1)";
    });
    
    return card;
  }

  // Drop zone olayları
  document.querySelectorAll(".drop-zone").forEach(zone => {
    zone.addEventListener("dragover", function(e) {
      e.preventDefault();
      zone.style.backgroundColor = zone.dataset.type === "ethical" 
        ? "rgba(46, 204, 113, 0.2)" 
        : "rgba(231, 76, 60, 0.2)";
    });
    
    zone.addEventListener("dragleave", function() {
      zone.style.backgroundColor = zone.dataset.type === "ethical" 
        ? "rgba(46, 204, 113, 0.1)" 
        : "rgba(231, 76, 60, 0.1)";
    });
    
    zone.addEventListener("drop", function(e) {
      e.preventDefault();
      zone.style.backgroundColor = zone.dataset.type === "ethical" 
        ? "rgba(46, 204, 113, 0.1)" 
        : "rgba(231, 76, 60, 0.1)";
      
      // Sürüklenen kartın ID'sini al
      const scenarioId = e.dataTransfer.getData("text/plain");
      const card = document.getElementById(scenarioId);
      
      if (card && card.parentNode !== zone) {
        // Kartın tip bilgisi
        const cardType = card.dataset.type;
        const zoneType = zone.dataset.type;
        
        // Kartı bırakma alanına ekle
        zone.appendChild(card);
        
        // Doğru eşleşme mi kontrol et
        if (cardType === zoneType) {
          // Doğru eşleşme
          card.style.border = "2px solid #2ecc71";
          card.style.backgroundColor = "rgba(46, 204, 113, 0.1)";
          card.draggable = false;
          card.style.cursor = "default";
          
          playCorrectSound();
          
          // Mini konfeti efekti
          addMiniConfetti(card);
          
          // Skoru güncelle
          gameStats.score += 10;
          gameStats.matchedCount++;
        } else {
          // Yanlış eşleşme
          card.style.border = "2px solid #e74c3c";
          card.style.backgroundColor = "rgba(231, 76, 60, 0.1)";
          
          playWrongSound();
          
          // 1 saniye sonra yanlış eşleşmeyi geri al
          setTimeout(() => {
            scenariosContainer.appendChild(card);
            card.style.border = "none";
            card.style.backgroundColor = "white";
          }, 1000);
          
          // Skoru azalt (minimum 0)
          gameStats.score = Math.max(0, gameStats.score - 5);
        }
        
        // Skorları güncelle
        updateStats();
        
        // Bütün senaryolar eşleşti mi kontrol et
        if (gameStats.matchedCount === gameStats.totalScenarios) {
          setTimeout(() => {
            showCompletionScreen();
          }, 1000);
        }
      }
    });
  });

  // Skorları güncelleme fonksiyonu
  function updateStats() {
    progressText.innerText = `Eşleştirilen: ${gameStats.matchedCount}/${gameStats.totalScenarios}`;
    scoreText.innerText = `Puan: ${gameStats.score}`;
  }

  // Mini konfeti efekti
  function addMiniConfetti(element) {
    for (let i = 0; i < 20; i++) {
      let confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = Math.random() * 8 + 4 + "px";
      confetti.style.height = Math.random() * 3 + 5 + "px";
      confetti.style.backgroundColor = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c"][Math.floor(Math.random() * 6)];
      confetti.style.borderRadius = "2px";
      
      const rect = element.getBoundingClientRect();
      const gameRect = gameArea.getBoundingClientRect();
      
      confetti.style.left = (rect.left - gameRect.left + rect.width / 2 + (Math.random() * 40 - 20)) + "px";
      confetti.style.top = (rect.top - gameRect.top + rect.height / 2 + (Math.random() * 40 - 20)) + "px";
      
      confetti.style.transform = "rotate(" + Math.random() * 360 + "deg) scale(1)";
      confetti.style.opacity = Math.random() * 0.5 + 0.5;
      confetti.style.zIndex = "1000";
      confetti.style.animation = "mini-confetti-fall 1s ease forwards";
      gameArea.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 1000);
    }
    
    // Mini konfeti animasyonu stil
    if (!document.getElementById("mini-confetti-style")) {
      let style = document.createElement("style");
      style.id = "mini-confetti-style";
      style.innerHTML = `
        @keyframes mini-confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(40px) rotate(360deg) scale(0);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Büyük konfeti efekti
  function addFullConfetti() {
    for (let i = 0; i < 100; i++) {
      let confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = Math.random() * 5 + 10 + "px";
      confetti.style.backgroundColor = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c"][Math.floor(Math.random() * 6)];
      confetti.style.borderRadius = "2px";
      confetti.style.top = "-10px";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      confetti.style.opacity = Math.random() * 0.5 + 0.5;
      confetti.style.animation = "confetti-fall 3s linear forwards";
      mainContainer.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
    
    // Konfeti animasyonu stil
    if (!document.getElementById("full-confetti-style")) {
      let style = document.createElement("style");
      style.id = "full-confetti-style";
      style.innerHTML = `
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10px) rotate(0deg) scale(1);
          }
          100% {
            transform: translateY(500px) rotate(360deg) scale(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Tamamlama ekranı
  function showCompletionScreen() {
    // Mevcut içeriği temizle
    mainContainer.innerHTML = "";
    
    // Tamamlama kartı
    let completionCard = document.createElement("div");
    completionCard.style.width = "90%";
    completionCard.style.maxWidth = "600px";
    completionCard.style.backgroundColor = "white";
    completionCard.style.borderRadius = "12px";
    completionCard.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
    completionCard.style.padding = "25px";
    completionCard.style.display = "flex";
    completionCard.style.flexDirection = "column";
    completionCard.style.alignItems = "center";
    completionCard.style.gap = "20px";
    completionCard.style.position = "relative";
    completionCard.style.overflow = "hidden";
    mainContainer.appendChild(completionCard);
    
    // Sertifika görünümü
    let certificate = document.createElement("div");
    certificate.style.width = "100%";
    certificate.style.padding = "20px";
    certificate.style.border = "2px solid #9b59b6";
    certificate.style.borderRadius = "10px";
    certificate.style.backgroundColor = "#f9f9f9";
    certificate.style.textAlign = "center";
    certificate.style.marginBottom = "20px";
    
    // Sertifika içeriği
    certificate.innerHTML = `
      <h3 style="color: #000000; margin-bottom: 10px;">🏆 Etik Yapay Zeka Uzmanı 🏆</h3>
      <p style="color: #000000; margin-bottom: 15px;">Tebrikler! Tüm senaryoları doğru kategorilere yerleştirdin!</p>
      <p style="color: #000000; margin-bottom: 5px;"><strong>Toplam Puan:</strong> ${gameStats.score}</p>
    `;
    completionCard.appendChild(certificate);
    
    // Tebrikler mesajı
    let congratsMessage = document.createElement("div");
    congratsMessage.style.textAlign = "center";
    congratsMessage.style.marginBottom = "20px";
    congratsMessage.style.color = "#000000";
    
    // Kazanılan beceriler
    congratsMessage.innerHTML = `
      <h3>Harika iş! 🎉</h3>
      <p>Artık yapay zeka senaryolarını etik açıdan değerlendirebiliyorsun!</p>
      <ul style="text-align: left; padding-left: 20px;">
        <li>Etik ve etik olmayan yapay zeka uygulamalarını ayırt etmeyi öğrendin</li>
        <li>Yapay zekanın farklı kullanım alanlarını tanıdın</li>
        <li>Teknolojinin etik kullanımının önemini kavradın</li>
      </ul>
    `;
    completionCard.appendChild(congratsMessage);
    
    // Konfeti efekti
    addFullConfetti();
    
    // Sonraki bulmacaya otomatik geçiş
    setTimeout(() => {
      goNextPuzzle();
    }, 5000);
  }
}

function setupPlanet6Puzzle5() {
  puzzleHintText.innerText = "IPUCU: Gelecekteki robot ve yapay zeka senaryolarını uygun kategorilere sınıflandır.";

  // Ana konteyner
  let mainContainer = document.createElement("div");
  mainContainer.style.width = "100%";
  mainContainer.style.maxWidth = "800px";
  mainContainer.style.margin = "0 auto";
  mainContainer.style.display = "flex";
  mainContainer.style.flexDirection = "column";
  mainContainer.style.alignItems = "center";
  mainContainer.style.gap = "20px";
  mainContainer.style.padding = "20px 10px";
  puzzleArea.appendChild(mainContainer);

  // Başlık
  let title = document.createElement("h2");
  title.innerHTML = "🤖 Gelecek Robotlar Sınıflandırma Oyunu";
  title.style.color = "#000000";
  title.style.textAlign = "center";
  title.style.margin = "0";
  title.style.fontSize = "1.4em";
  mainContainer.appendChild(title);

  // Bilgilendirme kartı
  let infoCard = document.createElement("div");
  infoCard.style.width = "100%";
  infoCard.style.backgroundColor = "rgba(155, 89, 182, 0.1)";
  infoCard.style.borderRadius = "12px";
  infoCard.style.padding = "15px";
  infoCard.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  infoCard.style.border = "2px solid rgba(155, 89, 182, 0.3)";
  infoCard.style.marginBottom = "10px";
  
  // Bilgilendirme metni
  let infoText = document.createElement("div");
  infoText.style.color = "#000000";
  infoText.style.fontSize = "0.95em";
  infoText.style.lineHeight = "1.4";
  infoText.innerHTML = `
    <p>Gelecekte, yapay zeka ve robotlar hayatımızın her alanında olacak. Bazı kullanımlar çok faydalı ve güvenli olacak, bazıları ise dikkatli olmamız gereken durumlar yaratabilir.</p>
    <p>Aşağıdaki senaryoları <strong>üç farklı kategoriye</strong> sınıflandırarak, gelecekteki teknolojileri değerlendirmeyi öğrenelim!</p>
  `;
  infoCard.appendChild(infoText);
  mainContainer.appendChild(infoCard);

  // Kategori renk ve simgeler tanımı (sadece iç kullanım için)
  const categoryStyles = {
    "safe": {
      color: "#2ecc71",
      icon: "✅",
      bg: "rgba(46, 204, 113, 0.1)",
      border: "2px solid #2ecc71"
    },
    "caution": {
      color: "#f39c12",
      icon: "⚠️",
      bg: "rgba(243, 156, 18, 0.1)",
      border: "2px solid #f39c12"
    },
    "warning": {
      color: "#e74c3c",
      icon: "❗",
      bg: "rgba(231, 76, 60, 0.1)",
      border: "2px solid #e74c3c"
    }
  };

  // Oyun alanı - ortadaki kategori kutucukları olmadan direkt olarak oluşturulacak
  let gameArea = document.createElement("div");
  gameArea.style.width = "100%";
  gameArea.style.display = "flex";
  gameArea.style.flexDirection = "column";
  gameArea.style.alignItems = "center";
  gameArea.style.gap = "15px";
  mainContainer.appendChild(gameArea);
  
  // İlerleme göstergesi
  let progressContainer = document.createElement("div");
  progressContainer.style.width = "100%";
  progressContainer.style.marginBottom = "10px";
  
  let progressBar = document.createElement("div");
  progressBar.style.width = "100%";
  progressBar.style.height = "10px";
  progressBar.style.backgroundColor = "#f1f1f1";
  progressBar.style.borderRadius = "5px";
  progressBar.style.position = "relative";
  
  let progressFill = document.createElement("div");
  progressFill.style.width = "0%";
  progressFill.style.height = "100%";
  progressFill.style.backgroundColor = "#9b59b6";
  progressFill.style.borderRadius = "5px";
  progressFill.style.transition = "width 0.3s";
  
  let progressText = document.createElement("div");
  progressText.style.marginTop = "5px";
  progressText.style.fontSize = "0.9em";
  progressText.style.color = "#000000";
  progressText.style.textAlign = "center";
  progressText.innerText = "Senaryo: 0/8";
  
  progressBar.appendChild(progressFill);
  progressContainer.appendChild(progressBar);
  progressContainer.appendChild(progressText);
  gameArea.appendChild(progressContainer);

    // Senaryo kartı
    let scenarioCard = document.createElement("div");
    scenarioCard.style.width = "100%";
    scenarioCard.style.backgroundColor = "white";
    scenarioCard.style.borderRadius = "10px";
    scenarioCard.style.padding = "20px";
    scenarioCard.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    scenarioCard.style.marginBottom = "15px";
    scenarioCard.style.position = "relative";
    
    let scenarioTitle = document.createElement("div");
    scenarioTitle.style.fontSize = "1.1em";
    scenarioTitle.style.fontWeight = "bold";
    scenarioTitle.style.marginBottom = "15px";
    scenarioTitle.style.color = "#000000";
    scenarioTitle.style.textAlign = "center";
    scenarioTitle.innerText = "Gelecek Senaryosu";
    
    let scenarioText = document.createElement("div");
    scenarioText.style.fontSize = "1em";
    scenarioText.style.color = "#000000";
    scenarioText.style.textAlign = "center";
    scenarioText.style.padding = "10px";
    scenarioText.style.minHeight = "60px";
    
    let scenarioImage = document.createElement("div");
    scenarioImage.style.fontSize = "3em";
    scenarioImage.style.textAlign = "center";
    scenarioImage.style.marginBottom = "10px";
    
    scenarioCard.appendChild(scenarioImage);
    scenarioCard.appendChild(scenarioTitle);
    scenarioCard.appendChild(scenarioText);
    gameArea.appendChild(scenarioCard);
  
    // Buton container
    let buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "space-between";
    buttonContainer.style.width = "100%";
    buttonContainer.style.gap = "10px";
    gameArea.appendChild(buttonContainer);
    
    // Kategori butonları
    const categories = [
      { id: "safe", text: "Faydalı ve Güvenli" },
      { id: "caution", text: "Faydalı ama Dikkat Edilmeli" },
      { id: "warning", text: "Dikkatli Olunmalı" }
    ];
    
    categories.forEach(category => {
      let button = document.createElement("button");
      button.id = `btn-${category.id}`;
      button.style.flex = "1";
      button.style.padding = "12px 10px";
      button.style.backgroundColor = categoryStyles[category.id].bg;
      button.style.border = categoryStyles[category.id].border;
      button.style.borderRadius = "8px";
      button.style.cursor = "pointer";
      button.style.fontSize = "0.9em";
      button.style.fontWeight = "bold";
      button.style.color = "#000000";
      button.style.display = "flex";
      button.style.flexDirection = "column";
      button.style.alignItems = "center";
      button.style.justifyContent = "center";
      button.style.textAlign = "center";
      button.style.minHeight = "70px";
      
      let buttonIcon = document.createElement("div");
      buttonIcon.style.fontSize = "1.5em";
      buttonIcon.style.marginBottom = "5px";
      buttonIcon.innerHTML = categoryStyles[category.id].icon;
      
      let buttonText = document.createElement("div");
      buttonText.innerText = category.text;
      
      button.appendChild(buttonIcon);
      button.appendChild(buttonText);
      
      button.addEventListener("mouseenter", function() {
        this.style.transform = "translateY(-3px)";
        this.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
      });
      
      button.addEventListener("mouseleave", function() {
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "none";
      });
      
      buttonContainer.appendChild(button);
    });
    
    // Geri bildirim alanı
    let feedbackArea = document.createElement("div");
    feedbackArea.style.width = "100%";
    feedbackArea.style.minHeight = "80px";
    feedbackArea.style.padding = "15px";
    feedbackArea.style.borderRadius = "8px";
    feedbackArea.style.marginTop = "10px";
    feedbackArea.style.display = "none";
    gameArea.appendChild(feedbackArea);
  
    // Senaryolar
    const scenarios = [
      {
        id: 1,
        text: "Yaşlı insanlara yemek yapmalarında ve ev temizliğinde yardım eden bir robot",
        category: "safe",
        emoji: "👵",
        feedback: "Bu robot yaşlı insanların daha bağımsız yaşamasına yardımcı olur. Kimseye zarar vermez ve faydalıdır."
      },
      {
        id: 2,
        text: "Evdeki tüm konuşmaları dinleyen ve kaydeden bir yapay zeka asistanı",
        category: "warning",
        emoji: "🎤",
        feedback: "Bu durum mahremiyet sorunları yaratır. İnsanların izni olmadan konuşmalarını kaydetmek etik değildir."
      },
      {
        id: 3,
        text: "Trafikte sürücülere yardımcı olan ama her zaman insan kontrolü gerektiren araç",
        category: "caution",
        emoji: "🚗",
        feedback: "Araç sürücüye yardımcı oluyor ama tamamen güvenilir değil. İnsan kontrolü gerektirmesi önemli bir güvenlik önlemidir."
      },
      {
        id: 4,
        text: "Öğrencilere matematik ve fen konularında yardımcı olan eğitim robotu",
        category: "safe",
        emoji: "🧮",
        feedback: "Eğitim robotları öğrencilere destek olarak faydalı bir amaca hizmet eder ve güvenlidir."
      },
      {
        id: 5,
        text: "İnsanların sosyal medya alışkanlıklarına göre onlar hakkında kararlar veren yapay zeka",
        category: "warning",
        emoji: "📱",
        feedback: "İnsanlar hakkında sosyal medya verilerine dayanarak karar vermek yanlış yargılara ve ayrımcılığa yol açabilir."
      },
      {
        id: 6,
        text: "Hastalara ilaç vermeden önce doktordan onay isteyen hastane robotu",
        category: "caution",
        emoji: "💊",
        feedback: "Robot faydalı bir iş yapıyor ama hayati önem taşıyan sağlık konularında son kararı insana bırakması önemlidir."
      },
      {
        id: 7,
        text: "İnsanların yüzünü tanıyan ve izinsiz fotoğraflarını çeken güvenlik kameraları",
        category: "warning",
        emoji: "📷",
        feedback: "İzinsiz fotoğraf çekmek insanların mahremiyetini ihlal eder ve etik değildir."
      },
      {
        id: 8,
        text: "Çiftçilere hava durumunu ve bitki sağlığını analiz etmekte yardımcı olan uygulama",
        category: "safe",
        emoji: "🌱",
        feedback: "Bu uygulama çiftçilere tarımsal faaliyetlerinde yardımcı olur ve daha verimli ürün yetiştirmelerini sağlar."
      }
    ];
  
    // Oyun durumu
    let gameState = {
      currentScenario: 0,
      correctAnswers: 0,
      totalScenarios: scenarios.length
    };
  
    // Senaryo gösterme fonksiyonu
    function showScenario(index) {
      if (index >= scenarios.length) {
        showCompletionScreen();
        return;
      }
      
      const scenario = scenarios[index];
      
      // İlerleme güncelleme
      progressFill.style.width = `${(index / scenarios.length) * 100}%`;
      progressText.innerText = `Senaryo: ${index + 1}/${scenarios.length}`;
      
      // Senaryo içeriği
      scenarioImage.innerText = scenario.emoji;
      scenarioTitle.innerText = `Gelecek Senaryosu #${index + 1}`;
      scenarioText.innerText = scenario.text;
      
      // Geri bildirim alanını gizle
      feedbackArea.style.display = "none";
      
      // Butonları aktif et
      document.querySelectorAll("#btn-safe, #btn-caution, #btn-warning").forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
      });
    }
  
    // Butonlara tıklama olayları
    document.querySelectorAll("#btn-safe, #btn-caution, #btn-warning").forEach(btn => {
      btn.addEventListener("click", function() {
        const selectedCategory = this.id.replace("btn-", "");
        const currentScenario = scenarios[gameState.currentScenario];
        
        // Tüm butonları devre dışı bırak
        document.querySelectorAll("#btn-safe, #btn-caution, #btn-warning").forEach(b => {
          b.disabled = true;
          b.style.opacity = "0.7";
          b.style.cursor = "default";
        });
        
        // Geri bildirim göster
        feedbackArea.style.display = "block";
        feedbackArea.innerHTML = "";
        
        let feedbackIcon = document.createElement("div");
        feedbackIcon.style.fontSize = "1.5em";
        feedbackIcon.style.marginBottom = "5px";
        feedbackIcon.style.textAlign = "center";
        
        let feedbackText = document.createElement("div");
        feedbackText.style.color = "#000000";
        
        // Doğru/yanlış kontrolü
        if (selectedCategory === currentScenario.category) {
          // Doğru cevap
          feedbackArea.style.backgroundColor = "rgba(46, 204, 113, 0.1)";
          feedbackArea.style.border = "2px solid #2ecc71";
          
          feedbackIcon.innerHTML = "✅";
          feedbackText.innerHTML = `<strong>Doğru!</strong> ${currentScenario.feedback}`;
          
          gameState.correctAnswers++;
          playCorrectSound();
        } else {
          // Yanlış cevap
          feedbackArea.style.backgroundColor = "rgba(231, 76, 60, 0.1)";
          feedbackArea.style.border = "2px solid #e74c3c";
          
          feedbackIcon.innerHTML = "❌";
          
          // Doğru kategorinin adını göster
          let correctCategory = "";
          if (currentScenario.category === "safe") {
            correctCategory = "Faydalı ve Güvenli";
          } else if (currentScenario.category === "caution") {
            correctCategory = "Faydalı ama Dikkat Edilmeli";
          } else {
            correctCategory = "Dikkatli Olunmalı";
          }
          
          feedbackText.innerHTML = `<strong>Tekrar düşün!</strong> Bu senaryo "${correctCategory}" kategorisine daha uygun. ${currentScenario.feedback}`;
          
          playWrongSound();
        }
        
        feedbackArea.appendChild(feedbackIcon);
        feedbackArea.appendChild(feedbackText);
        
        // 2 saniye sonra bir sonraki senaryoya geç
        setTimeout(() => {
          gameState.currentScenario++;
          showScenario(gameState.currentScenario);
        }, 3000);
      });
    });
  
    // İlk senaryoyu göster
    showScenario(gameState.currentScenario);
  
    // Tamamlama ekranı
    function showCompletionScreen() {
      // Mevcut içeriği temizle
      mainContainer.innerHTML = "";
      
      // Tamamlama kartı
      let completionCard = document.createElement("div");
      completionCard.style.width = "90%";
      completionCard.style.maxWidth = "600px";
      completionCard.style.backgroundColor = "white";
      completionCard.style.borderRadius = "12px";
      completionCard.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
      completionCard.style.padding = "25px";
      completionCard.style.display = "flex";
      completionCard.style.flexDirection = "column";
      completionCard.style.alignItems = "center";
      completionCard.style.gap = "20px";
      completionCard.style.position = "relative";
      completionCard.style.overflow = "hidden";
      mainContainer.appendChild(completionCard);
      
      // Sertifika görünümü
      let certificate = document.createElement("div");
      certificate.style.width = "100%";
      certificate.style.padding = "20px";
      certificate.style.border = "2px solid #9b59b6";
      certificate.style.borderRadius = "10px";
      certificate.style.backgroundColor = "#f9f9f9";
      certificate.style.textAlign = "center";
      certificate.style.marginBottom = "20px";
      
      // Sertifika içeriği
      certificate.innerHTML = `
        <h3 style="color: #000000; margin-bottom: 10px;">🏆 Gelecek Teknolojileri Değerlendirme Uzmanı 🏆</h3>
        <p style="color: #000000; margin-bottom: 15px;">Tebrikler! Tüm senaryoları değerlendirdin!</p>
        <p style="color: #000000; margin-bottom: 5px;"><strong>Doğru Cevaplar:</strong> ${gameState.correctAnswers}/${gameState.totalScenarios}</p>
      `;
      completionCard.appendChild(certificate);
      
      // Tebrikler mesajı
      let congratsMessage = document.createElement("div");
      congratsMessage.style.textAlign = "center";
      congratsMessage.style.marginBottom = "20px";
      congratsMessage.style.color = "#000000";
      
      // Kazanılan beceriler
      congratsMessage.innerHTML = `
        <h3>Harika iş! 🎉</h3>
        <p>Artık gelecekteki teknolojileri etik açıdan değerlendirebiliyorsun!</p>
        <ul style="text-align: left; padding-left: 20px;">
          <li>Faydalı ve güvenli teknolojileri tanımayı öğrendin</li>
          <li>Dikkatli olunması gereken durumları fark edebiliyorsun</li>
          <li>Teknolojinin etik kullanımının önemini kavradın</li>
        </ul>
        <p style="margin-top: 15px;">Bu bilgiler, gelecekteki teknolojileri daha bilinçli değerlendirmene yardımcı olacak!</p>
      `;
      completionCard.appendChild(congratsMessage);
      
      // Konfeti efekti
      addConfetti();
      
      // Sonraki bulmacaya otomatik geçiş
      setTimeout(() => {
        goNextPuzzle();
      }, 5000);
    }
    
    // Konfeti efekti
    function addConfetti() {
      for (let i = 0; i < 100; i++) {
        let confetti = document.createElement("div");
        confetti.style.position = "absolute";
        confetti.style.width = Math.random() * 10 + 5 + "px";
        confetti.style.height = Math.random() * 5 + 10 + "px";
        confetti.style.backgroundColor = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c"][Math.floor(Math.random() * 6)];
        confetti.style.borderRadius = "2px";
        confetti.style.top = "-10px";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.transform = "rotate(" + Math.random() * 360 + "deg)";
        confetti.style.opacity = Math.random() * 0.5 + 0.5;
        confetti.style.animation = "confetti-fall 3s linear forwards";
        mainContainer.appendChild(confetti);
      }
      
      // Konfeti animasyonu stil
      let style = document.createElement("style");
      style.innerHTML = `
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10px) rotate(0deg) scale(1);
          }
          100% {
            transform: translateY(500px) rotate(360deg) scale(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }