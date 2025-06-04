/**
 * MOBİL UYUMLULUK İÇİN YARDIMCI FONKSİYONLAR
 * Bu dosya mobil cihazlarda (özellikle dokunmatik ekranlarda) 
 * oyunun daha iyi çalışması için ek destek sağlar.
 */

// Global değişkenler
let touchDragging = false;
let touchDraggedElement = null;
let touchOffsetX = 0;
let touchOffsetY = 0;
let lastTouch = null;

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
      puzzleArea.addEventListener('touchcancel', handleTouchEnd);
    }
    
    // MutationObserver ile dinamik eklenen elementleri izle
    observeDynamicElements();
    
    // Dokunmatik geri bildirim için CSS sınıfları ekle
    addTouchFeedbackStyles();
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
    
    // Dokunma pozisyonunu kaydet
    const touch = e.touches[0];
    const rect = target.getBoundingClientRect();
    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;
    lastTouch = touch;
    
    // Dokunulan elemanı vurgulama
    target.style.opacity = '0.8';
    target.style.transform = 'scale(1.05)';
    target.style.zIndex = '1000';
    target.classList.add('touch-active');
    
    // Sürüklenen elemandan veri al (bulmaca için gerekli)
    if (target.dataset) {
      touchDraggedElement._dragData = {
        order: target.dataset.order,
        img: target.dataset.img,
        label: target.dataset.label,
        step: target.dataset.step || target.parentElement?.dataset?.step
      };
    }
    
    // Hafif titreşim geri bildirimi (varsa)
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    
    // Sayfanın scroll olmasını engelle
    e.preventDefault();
  } else {
    // Tüm tıklanabilir elementlere dokunma geri bildirimi ekle
    if (target && (target.tagName === 'BUTTON' || target.classList.contains('clickable'))) {
      target.classList.add('touch-active');
    }
  }
}

// Dokunma hareket ederken (touchmove event)
function handleTouchMove(e) {
  if (touchDragging && touchDraggedElement) {
    // Sayfanın scroll olmasını engelle
    e.preventDefault();
    
    // Sürüklenen elemanın pozisyonunu güncelle
    const touch = e.touches[0];
    lastTouch = touch;
    
    // Pozisyonu hesapla ve sınırlarda tut
    let newX = touch.clientX - touchOffsetX;
    let newY = touch.clientY - touchOffsetY;
    
    // Ekranın dışına çıkmasını engelle
    const maxX = window.innerWidth - touchDraggedElement.offsetWidth;
    const maxY = window.innerHeight - touchDraggedElement.offsetHeight;
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    // Elemanı hareket ettir
    touchDraggedElement.style.position = 'fixed';
    touchDraggedElement.style.left = newX + 'px';
    touchDraggedElement.style.top = newY + 'px';
    
    // Bırakılabilecek alanları vurgula
    highlightDropZones(touch.clientX, touch.clientY);
  }
}

// Bırakılabilecek alanları vurgulama
function highlightDropZones(x, y) {
  document.querySelectorAll('.dropzone').forEach(zone => {
    const rect = zone.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && 
        y >= rect.top && y <= rect.bottom) {
      zone.classList.add('dropzone-highlight');
    } else {
      zone.classList.remove('dropzone-highlight');
    }
  });
}

// Dokunma bitince (touchend event)
function handleTouchEnd(e) {
  // Tüm highlight'ları temizle
  document.querySelectorAll('.dropzone-highlight').forEach(zone => {
    zone.classList.remove('dropzone-highlight');
  });
  
  // Dokunma geri bildirimini temizle
  document.querySelectorAll('.touch-active').forEach(el => {
    el.classList.remove('touch-active');
  });
  
  if (touchDragging && touchDraggedElement) {
    // Dokunmatik biten noktadaki HTML elemanını bul
    const touchX = lastTouch ? lastTouch.clientX : e.changedTouches[0].clientX;
    const touchY = lastTouch ? lastTouch.clientY : e.changedTouches[0].clientY;
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
        // Veri aktarımını simule et - bulmaca için özel veri desteği
        const dragData = touchDraggedElement._dragData || {};
        const dataTransfer = {
          getData: function(format) {
            if (format === 'text/plain') {
              return dragData.order || dragData.step || touchDraggedElement.innerText;
            }
            if (format === 'img') {
              return dragData.img || '';
            }
            if (format === 'label') {
              return dragData.label || '';
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
        
        // Başarılı bırakma geri bildirimi
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([50, 50, 100]);
        }
        
        // Sürüklenen elemanı gizle (orijinal davranışı taklit et)
        if (dragData.order || dragData.step) {
          // Puzzle için özel durum, visibility:hidden ile değiştirilmeli
          const container = touchDraggedElement.closest('.card-container');
          if (container) {
            container.style.visibility = 'hidden';
            container.style.opacity = '0';
          } else {
            touchDraggedElement.style.display = 'none';
          }
        } else {
          // Genel durum
          touchDraggedElement.style.display = 'none';
        }
      }
    } else {
      // Eleman bırakılabilir bir alana bırakılmadı, eski konumuna geri dönsün
      touchDraggedElement.style.position = '';
      touchDraggedElement.style.left = '';
      touchDraggedElement.style.top = '';
    }
    
    // Sürükleme durumunu sıfırla
    touchDraggedElement.style.opacity = '1';
    touchDraggedElement.style.transform = 'scale(1)';
    touchDraggedElement.style.zIndex = '';
    touchDragging = false;
    touchDraggedElement = null;
    lastTouch = null;
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
            
            // Yeni eklenen draggable'lara dokunmatik desteği ekle
            const draggables = node.querySelectorAll ? node.querySelectorAll('.draggable') : [];
            Array.from(draggables).forEach(enhanceDraggable);
            
            // Eğer node'un kendisi bir draggable ise
            if (node.classList && node.classList.contains('draggable')) {
              enhanceDraggable(node);
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
  
  // Mevcut draggable'ları geliştir
  document.querySelectorAll('.draggable').forEach(enhanceDraggable);
}

// Draggable elementleri geliştir
function enhanceDraggable(element) {
  if (!element._touchEnhanced) {
    element.setAttribute('aria-grabbed', 'false');
    element.setAttribute('tabindex', '0');
    
    // Klavye erişilebilirlik desteği
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        // TO-DO: Gelecekte klavye ile sürükleme desteği eklenebilir
      }
    });
    
    element._touchEnhanced = true;
  }
}

// Dropzone elementine event listener kaydetme yeteneği ekle
function enhanceDropZone(dropzone) {
  if (!dropzone._enhanced) {
    dropzone._dropListeners = [];
    
    // ARIA erişilebilirlik özniteliklerini ekle
    dropzone.setAttribute('aria-dropeffect', 'move');
    
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

// Dokunmatik stil ve geribildirimleri için CSS ekle
function addTouchFeedbackStyles() {
  // Eğer stil zaten eklenmediyse
  if (!document.getElementById('touch-feedback-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'touch-feedback-styles';
    styleSheet.textContent = `
      .touch-active {
        transition: transform 0.1s, box-shadow 0.1s;
      }
      button.touch-active, .clickable.touch-active {
        transform: scale(0.97);
        box-shadow: 0 0 5px rgba(0,0,0,0.2) inset;
      }
      .dropzone-highlight {
        border: 2px dashed #4CAF50 !important;
        background-color: rgba(76, 175, 80, 0.1) !important;
        transition: all 0.2s ease;
      }
      .draggable {
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
      }
      /* Daha büyük dokunma alanları */
      button, .clickable, .draggable, .option {
        min-height: 44px;
        min-width: 44px;
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

// Sayfa yüklendiğinde dokunmatik desteği başlat
window.addEventListener('DOMContentLoaded', initTouchSupport);

// Yeniden boyutlandırma için dokunmatik butonu büyütme (mobil cihazlarda)
function resizeForMobile() {
  if (isTouchDevice() && window.innerWidth < 768) {
    document.querySelectorAll('button, .clickable, .option').forEach(el => {
      if (!el.dataset.resized) {
        el.style.minHeight = "44px";
        el.style.minWidth = "44px";
        el.style.padding = "12px 16px";
        el.dataset.resized = "true";
      }
    });
    
    // Eğer oyun açıklayıcı metinler varsa, font boyutunu büyüt
    document.querySelectorAll('.puzzle-hint, .instructions').forEach(el => {
      el.style.fontSize = "16px";
      el.style.lineHeight = "1.4";
    });
  }
}

// İşaret parmağının algılanması ve kaydırma ile çakışmasını önleme
document.addEventListener('touchmove', function(e) {
  if (e.touches.length === 1 && (
      e.target.classList.contains('draggable') || 
      e.target.closest('.draggable')
  )) {
    if (Math.abs(e.touches[0].clientY - touchOffsetY) < 10) {
      e.preventDefault();
    }
  }
}, { passive: false });

// Çift dokunma ile yakınlaştırmayı engelle
document.addEventListener('touchstart', function(e) {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

// Pencere yeniden boyutlandırıldığında kontrol et
window.addEventListener('resize', resizeForMobile);

// İlk yüklemede de kontrol et
window.addEventListener('DOMContentLoaded', resizeForMobile); 