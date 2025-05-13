/**
 * MOBİL UYUMLULUK İÇİN YARDIMCI FONKSİYONLAR
 * Bu dosya mobil cihazlarda (özellikle dokunmatik ekranlarda) 
 * oyunun daha iyi çalışması için ek destek sağlar.
 */

// Global değişkenler
let touchDragging = false;
let touchDraggedElement = null;

// Dokunmatik cihaz tespiti
function isTouchDevice() {
  return ('ontouchstart' in window) || 
         (navigator.maxTouchPoints > 0) || 
         (navigator.msMaxTouchPoints > 0);
}

// Dokunmatik ekran desteğini başlat
function initTouchSupport() {
  if (isTouchDevice()) {
    console.log("Dokunmatik cihaz tespit edildi, touch desteği aktif edildi.");
    
    // Puzzle alanına event listener'lar ekle
    const puzzleArea = document.getElementById("puzzleArea");
    if (puzzleArea) {
      puzzleArea.addEventListener('touchstart', handleTouchStart, { passive: false });
      puzzleArea.addEventListener('touchmove', handleTouchMove, { passive: false });
      puzzleArea.addEventListener('touchend', handleTouchEnd);
    }
    
    // MutationObserver ile dinamik eklenen elementleri izle
    observeDynamicElements();
  }
}

// Dokunma başladığında (touchstart event)
function handleTouchStart(e) {
  // Eğer dokunulan eleman draggable sınıfına sahipse
  let target = e.target;
  while (target !== null && !target.classList.contains('draggable')) {
    target = target.parentElement;
  }
  
  if (target && target.classList.contains('draggable')) {
    touchDragging = true;
    touchDraggedElement = target;
    
    // Dokunulan elemanı vurgulama
    target.style.opacity = '0.7';
    target.style.transform = 'scale(1.1)';
    
    // Sayfanın scroll olmasını engelle
    e.preventDefault();
  }
}

// Dokunma hareket ederken (touchmove event)
function handleTouchMove(e) {
  if (touchDragging && touchDraggedElement) {
    // Sayfanın scroll olmasını engelle
    e.preventDefault();
  }
}

// Dokunma bitince (touchend event)
function handleTouchEnd(e) {
  if (touchDragging && touchDraggedElement) {
    // Dokunmatik biten noktadaki HTML elemanını bul
    let touchX = e.changedTouches[0].clientX;
    let touchY = e.changedTouches[0].clientY;
    let dropTarget = document.elementFromPoint(touchX, touchY);
    
    // Dokunmatik hedefin ata elementlerinde dropzone arama
    let currentElement = dropTarget;
    while (currentElement && !currentElement.classList.contains('dropzone')) {
      currentElement = currentElement.parentElement;
    }
    
    // Eğer doğru bir bırakma alanına denk geldiyse
    if (currentElement && currentElement.classList.contains('dropzone')) {
      // DragOver olayını engellenen davranışı taklit et
      const normalEvent = new MouseEvent('dragover');
      const preventDefaultCalled = !currentElement.dispatchEvent(normalEvent);
      
      if (preventDefaultCalled) {
        // Veri aktarımını simule et
        const dataTransfer = {
          getData: function(format) {
            if (format === 'text/plain') {
              return touchDraggedElement.innerText;
            }
            if (format === 'application/x-word') {
              return touchDraggedElement.dataset.word || '';
            }
            return touchDraggedElement.dataset.mood || '';
          }
        };
        
        // Simule edilmiş drop event
        const dropEvent = {
          preventDefault: function() {},
          dataTransfer: dataTransfer
        };
        
        // Drop event listener'ını bul ve çağır
        const originalDropListeners = currentElement._dropListeners || [];
        for (let listener of originalDropListeners) {
          listener.call(currentElement, dropEvent);
        }
        
        // Sürüklenen elemanı gizle (orijinal davranışı taklit et)
        touchDraggedElement.style.display = 'none';
      }
    }
    
    // Sürükleme durumunu sıfırla
    touchDraggedElement.style.opacity = '1';
    touchDraggedElement.style.transform = 'scale(1)';
    touchDragging = false;
    touchDraggedElement = null;
  }
}

// MutationObserver ile dinamik eklenen elementleri izleme
function observeDynamicElements() {
  // Yeni eklenen drop zone elemanlarını izle
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Yeni eklenen dropzone'ları işaretle
            const dropzones = node.querySelectorAll ? node.querySelectorAll('.dropzone') : [];
            Array.from(dropzones).forEach(enhanceDropZone);
            
            // Eğer node'un kendisi bir dropzone ise onu da işaretle
            if (node.classList && node.classList.contains('dropzone')) {
              enhanceDropZone(node);
            }
          }
        });
      }
    });
  });
  
  // Tüm document yapısını izle
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Mevcut dropzone'ları işaretle
  document.querySelectorAll('.dropzone').forEach(enhanceDropZone);
}

// Dropzone elementine event listener kaydetme yeteneği ekle
function enhanceDropZone(dropzone) {
  if (!dropzone._enhanced) {
    dropzone._dropListeners = [];
    
    // Orijinal addEventListener'ı kaydet
    const originalAddEventListener = dropzone.addEventListener;
    dropzone.addEventListener = function(type, listener, options) {
      if (type === 'drop') {
        this._dropListeners = this._dropListeners || [];
        this._dropListeners.push(listener);
      }
      return originalAddEventListener.call(this, type, listener, options);
    };
    
    dropzone._enhanced = true;
  }
}

// Sayfa yüklendiğinde dokunmatik desteği başlat
window.addEventListener('DOMContentLoaded', initTouchSupport);

// Yeniden boyutlandırma için dokunmatik butonu büyütme (mobil cihazlarda)
function resizeForMobile() {
  if (isTouchDevice() && window.innerWidth < 768) {
    document.querySelectorAll('button').forEach(btn => {
      if (!btn.dataset.resized) {
        btn.style.minHeight = "44px";
        btn.style.minWidth = "44px";
        btn.style.padding = "12px 16px";
        btn.dataset.resized = "true";
      }
    });
  }
}

// Pencere yeniden boyutlandırıldığında kontrol et
window.addEventListener('resize', resizeForMobile);

// İlk yüklemede de kontrol et
window.addEventListener('DOMContentLoaded', resizeForMobile); 