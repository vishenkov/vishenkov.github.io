(function() {
  function DOMReady () {
  function ready() {
    var mouseParallax = (function (){
      var parallax = document.querySelector('.parallax');
      var
          layers =  [],
          computedStyle = null,
          width =0,
          height = 0,
          parallaxPercent = 5,
          maxOffsetX = 0,
          maxOffsetY = 0;

      var mouseMove = (e) => {

        for (var i = 0; i < layers.length; i++) {
          var
            layer = layers[i],
            depth = layer.dataset.depth,
            translateX = -(e.clientX-width/2)/(width/2)*maxOffsetX*depth,
            translateY = -(e.clientY-height/2)/(height/2)*maxOffsetY*depth;

          var transform = "translate3d("+translateX + "px,"+translateY+"px,"+ "0)";
          layer.style.transform = transform;
          layer.style.webkitTransform = transform;
        }
      }


      return {
        init: () => {
          if (parallax != null) {
            layers =  parallax.getElementsByClassName('layer');
            computedStyle = getComputedStyle(parallax);
            width = parseInt(computedStyle.width, 10);
            height = parseInt(computedStyle.height, 10);
            maxOffsetX = parallaxPercent*width/100;
            maxOffsetY = parallaxPercent*height/100;
            window.addEventListener('mousemove', mouseMove);
          }
        }
      }
    })();

    var scrollParallax = (function (){
      var bg = document.querySelectorAll('.parallax-scroll');
      
      var scrollFunction = (e) => {
        if (bg.length>0) {
          for (var i = 0; i < bg.length; i++) {
            bg[i].style.transform = "translate3d(0,"+(window.scrollY/((i+1)*1.5))+"px,"+ "0)";
          }
        }
      }

      return {
        init: () => {
          if (bg != null) {
            window.addEventListener('scroll', scrollFunction);
          }
        }
      }
    })();

    var blur = (function () {
      var blur = document.querySelector('.blur'),
          contactme = document.querySelector('.contactme'),
          modal = document.querySelector('.modal_contactme');

      return {
        set: function() {
          if (blur!=null) {
            var
              posLeft = -contactme.offsetLeft,
              offsetTop = -(contactme.offsetTop-parseInt(getComputedStyle(modal).backgroundPositionY, 10));

            //TODO: get img dementions from bg url
            var imgWidth = 2000,
                imgHeight = 1699,
                modalWidth = modal.clientWidth,
                modalHeight = modal.clientHeight,
                imgRatio = (imgHeight / imgWidth),
                modalRatio = (modalHeight / modalWidth),
                bgCoverWidth = 0,
                bgCoverHeight = 0;
            
            if (modalRatio > imgRatio) {
                bgCoverHeight = modalHeight;
                bgCoverWidth = (modalHeight / imgRatio);
            } 
            else {
                bgCoverWidth = modalWidth;
                bgCoverHeight = (modalWidth * imgRatio);
            }
            
            blur.style.backgroundSize = bgCoverWidth + 'px ' + bgCoverHeight + 'px';
            blur.style.backgroundPositionX = posLeft + 'px';
            blur.style.backgroundPositionY = offsetTop + 'px';
          }
        }
      }
    }());


    var gallery = (function () {
      var
        titles = document.querySelectorAll('.works__title-item'),
        techs = document.querySelectorAll('.works__tech-item'),
        hrefs = document.querySelectorAll('.works__href-item'),
        mainImages = document.querySelectorAll('.works__mainimage-item'),
        controlsUp = document.querySelectorAll('.works__control_up'),
        controlsDown = document.querySelectorAll('.works__control_down');

      var setRoundArray = (query) => {

        let roundArray = (function() {
          var 
            current = 0,
            limit = 0,
            prevIndex = 0,
            nextIndex = 0,
            query = [];
          return {
            inc: () => {
              prevIndex = current;
              current++;
              if (current > limit) {
                current = 0;
              }
              nextIndex = (current + 1) > limit ? 0 : current + 1;
              return query[current];
            },
            dec: () => {
              prevIndex = current;
              current--;
              if (current < 0) {
                current = limit;
              }
              nextIndex = (current + 1) > limit ? 0 : current + 1;
              return query[current];
            },
            get: () => {
              return query[current];
            },
            prev: () => {
              let ndx = (current - 1) < 0 ? limit : current - 1;
              return query[ndx];
            },
            next: () => {
              return query[nextIndex];
            },
            last: () => {
              return query[limit];
            },
            getIndex: () => {
              return current;
            },
            getAtIndex: (index) => {
              if ( (index >= 0) && (index <= limit)) return query[index];
              return -1;
            },
            length: () => {
              return limit;
            },
            init: (qArray) => {
              query = qArray;
              limit = query.length - 1;
              current = 0;
              nextIndex = (current + 1) > limit ? 0 : current + 1;
              prevIndex = (current - 1) < 0 ? limit : current - 1;
            }
          }
        })();
        roundArray.init(query);
        return roundArray;

      }

      var galleryInit = () => {

        techs.forEach(item => {
          item.innerHTML = prepareText(item);
        });
        titles.forEach(item => {
          item.firstElementChild.firstElementChild.firstElementChild.innerHTML = prepareText(item.firstElementChild.firstElementChild.firstElementChild);
        });
        titles = setRoundArray(titles);
        techs = setRoundArray(techs);
        hrefs = setRoundArray(hrefs);
        mainImages = setRoundArray(mainImages);
        controlsUp = setRoundArray(controlsUp);
        controlsDown = setRoundArray(controlsDown);

        controlsUp.inc();
        controlsDown.dec();

        updateView();
        controlsUp.get().classList.toggle('works_animation-slideupbottom');
        controlsDown.get().classList.toggle('works_animation-slidedowntop');
      }

      var updateView = () => {
        hrefs.get().classList.toggle('works__current');

        titles.get().classList.toggle('works__current');
        titles.get().firstElementChild.firstElementChild.firstElementChild.classList.toggle('works__text_animate');

        techs.get().classList.toggle('works__current');
        techs.get().classList.toggle('works__text_animate');

        mainImages.get().classList.toggle('works__current');
        mainImages.get().classList.toggle('works__mainimage_animate');

      }
      var cleanAnimations = () => {
        for (var i=0; i<=controlsDown.length(); i++) {
            controlsDown.getAtIndex(i).classList.remove('works_animation-slideupbottom');
            controlsDown.getAtIndex(i).classList.remove('works_animation-slidedowntop');
            controlsDown.getAtIndex(i).classList.remove('works_animation-slideup');
            controlsDown.getAtIndex(i).classList.remove('works_animation-slidedown');
            controlsUp.getAtIndex(i).classList.remove('works_animation-slideupbottom');
            controlsUp.getAtIndex(i).classList.remove('works_animation-slidedowntop');
            controlsUp.getAtIndex(i).classList.remove('works_animation-slideup');
            controlsUp.getAtIndex(i).classList.remove('works_animation-slidedown');
          }
      }

      var galleryFlip = (diretion) => {
        updateView();
        if (diretion === 'up') {
          titles.inc();
          techs.inc();
          hrefs.inc();
          mainImages.inc();

          updateView();
          cleanAnimations();

          controlsUp.get().classList.add('works_animation-slideup');
          controlsUp.next().classList.add('works_animation-slideupbottom');

          controlsDown.get().classList.add('works_animation-slidedown');
          controlsDown.next().classList.add('works_animation-slidedowntop');

          controlsUp.inc();
          controlsDown.inc();
        } else {
          titles.dec();
          techs.dec();
          hrefs.dec();
          mainImages.dec();

          updateView();
          cleanAnimations();

          controlsDown.get().classList.add('works_animation-slideup');
          controlsDown.prev().classList.add('works_animation-slideupbottom');

          controlsUp.get().classList.add('works_animation-slidedown');
          controlsUp.prev().classList.toggle('works_animation-slidedowntop');

          controlsUp.dec();
          controlsDown.dec();
        }
      }

      var prepareText = (text) => {
        let words = text.innerText.trim().split(' ');
        let _words = [];

        words.forEach(word => {
          let splitWord = word.split('').map((char, index) => {
            return `<i>${char}</i>`;
          }).join('');
          _words.push(splitWord);
        });
        let formattedWords = _words.map((word, index) => {
          return `<span>${word}</span>`;
        }).join(' ');
        return formattedWords;
      }

      return {

        init: () => {
          if (document.querySelector('.works') != null) {
            galleryInit();
            document.querySelector('.works__arrow_down').onclick = function(e) {
              e.preventDefault();
              galleryFlip('down');
            };

            document.querySelector('.works__arrow_up').onclick = function(e) {
              e.preventDefault();
              galleryFlip('up');
            };
          }
        }
      }
    })();
    
    var blogToC = (function () {
      var 
        toc = null,
        links = null,
        offsetContent = 0,
        articlesHeights = [],
        offsetArticles = [],
        offsetMargin = 60;

        var tocScroll = (e) => {
          if (window.scrollY > offsetContent) {
            // toc.classList.add('blog__menu_sticky');
            toc.style.top = "0";
            offsetArticles.forEach((offset, index) => {
              if ((window.scrollY > offset- offsetMargin) && ((offset + articlesHeights[index]-offsetMargin) > window.scrollY)) {
                links[index].classList.add('blog-menu__link_selected');
              } else {
                links[index].classList.remove('blog-menu__link_selected');
              }
            });

            let footerHeight = document.querySelector('.footer').clientHeight;
            if (toc.clientHeight > (window.innerHeight-footerHeight)) {
              let menuoffset = (toc.clientHeight - (window.innerHeight - footerHeight - 20)) * (window.scrollY / document.body.clientHeight);
              toc.style.top = -menuoffset + 'px';
            } else {
              toc.style.top = 0;
            }

          } else {
            toc.style.top = offsetContent- window.scrollY + 'px';
          }
        }

      return {
        init: () => {
          toc = document.querySelector('.blog__menu');
          if (toc == null) return;
          toc.style.top = offsetContent- window.scrollY + 'px';
          links = toc.querySelectorAll('.blog-menu__link');
          links[0].classList.add('blog-menu__link_selected');
          offsetContent = document.querySelector('.content').offsetTop;
          offsetArticles = [];
          articlesHeights = [];

          document.querySelectorAll('.article__content').forEach((article, index) => {
            offsetArticles.push(article.offsetTop);
            articlesHeights.push(article.offsetHeight);
          });
          console.log("offsetContent: "+offsetContent + "\n offsetArticles: " +offsetArticles+" \n articlesHeights: "+ articlesHeights);
          window.addEventListener('scroll', tocScroll);
          tocScroll();
        }
      }
    })();

    var blogSwipeMenu = (function (){
      var btn = null;
      var menu = null;
      var offsetContent = 0;

      var btnclick = () => {
        menu.classList.toggle('columns__left_blog-swiped');
        let btnstyle = getComputedStyle(btn);
        let menustyle = getComputedStyle(menu);

        if (btn.offsetLeft > 0) {
          btn.style.left = (-1*parseInt(btnstyle.width, 10) / 2) + 'px';
        } else {
          btn.style.left = ((parseInt(menustyle.width, 10)) - parseInt(btnstyle.width, 10) / 2) + 'px';
        }
          
      }
      var calcBtnOffsetLeft = () => {
        
      }
      var btnscroll = () => {
        if (window.scrollY > offsetContent) {
          btn.style.top = "50%";
        } else {
          btn.style.top = Math.max(window.innerHeight/2, offsetContent- window.scrollY) + 'px';
        }

      }

      return {
        init: () => {
          btn = document.querySelector('.blog__swipe');
          if (btn == null) return;
          offsetContent = document.querySelector('.content').offsetTop;
          btn.style.top = Math.max(window.innerHeight/2, offsetContent- window.scrollY) + 'px';
          if (btn.offsetLeft > 0) {
            btn.click();
          }
          //TODO: somthing to do with this Oo
          btn.click();
          btn.click();
          menu = document.querySelector('.columns__left_blog');
          btn.addEventListener('click', btnclick);
          window.addEventListener('scroll', btnscroll);
          btnscroll();
        }
      }
    })();

    var formsValidation = (function (){
      var formLogin = null,
          formContactme = null;

      var showError = (container, msg) => {
        let error = document.createElement('div');
        error.className = 'form__error';
        error.innerText=msg;
        container.appendChild(error);
        container.classList.add('form__section_row-inputerror');
      }

      var resetMsg = (container) => {
        if (container.lastChild.className == "form__error" ) {
          container.removeChild(container.lastChild);
          container.classList.remove('form__section_row-inputerror');
        }
        container.classList.remove('form__section_row-inputsuccess');
      }

      var successMsg= (container, msg) => {
        let success = document.createElement('div');
        success.className = 'form__success';
        success.innerText=msg;
        container.appendChild(success);
        setTimeout(()=>{
          container.removeChild(success);
        },2000);
      }

      var validateLogin = (e) => {
        let elements = formLogin.elements;
        let errors = 0;
        
        resetMsg(elements.login.parentNode);
        if (!elements.login.value) {
          errors++;
          showError(elements.login.parentNode, "Вы не ввели логин");
          elements.login.addEventListener('click', (e)=>{
            resetMsg(elements.login.parentNode);
          });
        } else {
          elements.login.parentNode.classList.add('form__section_row-inputsuccess');
        }

        resetMsg(elements.password.parentNode);
        if (!elements.password.value) {
          errors++;
          showError(elements.password.parentNode, "Вы не ввели пароль");
          elements.password.addEventListener('click', (e)=>{
            resetMsg(elements.password.parentNode);
          });
        } else {
          elements.password.parentNode.classList.add('form__section_row-inputsuccess');
        }

        resetMsg(elements.human.parentNode);
        if (!elements.human.checked) {
          errors++;
          showError(elements.human.parentNode, "Вы не человек?");
          elements.human.parentNode.addEventListener('click', (e)=>{
            resetMsg(elements.human.parentNode);
          });
        } else {
          elements.human.parentNode.classList.add('form__section_row-inputsuccess');
        }

        resetMsg(elements.capthca[0].parentNode);
        if (!elements.capthca[0].checked) {
          errors++;
          showError(elements.capthca[0].parentNode, "Вы не не робот?");
          elements.capthca[0].parentNode.addEventListener('click', (e)=>{
            resetMsg(elements.capthca[0].parentNode);
          });
        } else {
          elements.capthca[0].parentNode.classList.add('form__section_row-inputsuccess');
        }

        if (!errors) {
          successMsg(formLogin.parentNode, "Добро пожаловать!");
        }

      }

      var validateContactme = (e) => {
        let elements = formContactme.elements;
        let errors = 0;

        resetMsg(elements.name.parentNode);
        if (!elements.name.value) {
          errors++;
          showError(elements.name.parentNode, "Вы не ввели имя");
          elements.name.addEventListener('click', (e)=>{
            resetMsg(elements.name.parentNode);
          });
        } else {
          elements.name.parentNode.classList.add('form__section_row-inputsuccess');
        }

        resetMsg(elements.email.parentNode);
        if (!elements.email.value) {
          errors++;
          showError(elements.email.parentNode, "Вы не ввели email");
          elements.email.addEventListener('click', (e)=>{
            resetMsg(elements.email.parentNode);
          });
        } else {
            if (!validateEmail(elements.email.value)) {
              errors++;
              showError(elements.email.parentNode, "Некорректный email");
              elements.email.addEventListener('click', (e)=>{
                resetMsg(elements.email.parentNode);
              });
            } else {
              elements.email.parentNode.classList.add('form__section_row-inputsuccess');
            }
        }

        resetMsg(elements.message.parentNode);
        if (!elements.message.value) {
          errors++;
          showError(elements.message.parentNode, "Вы не ввели сообщение?");
          elements.message.parentNode.addEventListener('click', (e)=>{
            resetMsg(elements.message.parentNode);
          });
        } else {
          elements.message.parentNode.classList.add('form__section_row-inputsuccess');
        }

        if (!errors) {
          successMsg(formContactme.parentNode.parentNode, "Спасибо!\nВаше сообщение отправлено.");
        }
      }

      var resetForm = () => {
        let elements = formContactme.elements;
        for (var i = 0; i < elements.length; i++) {
          resetMsg(elements[i].parentNode);
          elements[i].value = '';
        }
      }

      function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }

      return {
        initLogin: () => {
          var btn = document.querySelector('.form__button_submit');
          if (btn == null) return;
          formLogin = document.querySelector('.form_login');
          if (formLogin == null) return;
          btn.addEventListener('click', validateLogin);
        },
        initContactme: () => {
          var btn = document.querySelector('.form__button_submit');
          if (btn == null) return;
          formContactme = document.querySelector('.form_contactme');
          if (formContactme == null) return;
          btn.addEventListener('click', validateContactme);
          document.querySelector('.form__button_reset').addEventListener('click', resetForm);
        }
      }
    })();

    initMap();
    mouseParallax.init();
    scrollParallax.init();
    gallery.init();
    flip.init();
 
    blur.set();
    blogToC.init();
    blogSwipeMenu.init();
    formsValidation.initLogin();
    formsValidation.initContactme();

    window.addEventListener('resize', (e) =>{
      blur.set();
      flip.init();
      blogToC.init();
      blogSwipeMenu.init();
    });
  }
    var preloader = (function() {
      var preloads = document.querySelectorAll('.preload');
      var preloader = null;
      var percentText = null;
      var totalLoaded = 0;
      var total = 0;

      var incLoaded = () => {
        totalLoaded++;
     
        if (totalLoaded === (total)) {
          destroyPreloader();
        }
        if (percentText != null) {
          percentText.innerHTML = Math.round(100*totalLoaded/total)+"%";
        // console.log(Math.round(100*totalLoaded/total)+"%")
        }
      }

      var createPreloader = () => {
        preloader = document.createElement('div');
        preloader.className = 'preloader';

        let spinner = document.createElement('div');
        spinner.className = 'preloader__spinner';
        preloader.appendChild(spinner);

        let anim = document.createElement('div');
        anim.className = 'preloader__animation';
        spinner.appendChild(anim);

        percentText = document.createElement('div');
        percentText.className = 'preloader__percents';
        spinner.appendChild(percentText);

        document.body.appendChild(preloader);
      }

      var destroyPreloader = () => {
        let allPreloaders = document.querySelectorAll('.preloader');
        if (allPreloaders == null) return;
        allPreloaders.forEach((item) => {
          item.parentNode.removeChild(item);
        });
      }

      return {
        init : () => {
          if (preloads.length === 0) return;
          //console.log(preloads);
          total = preloads.length;
          createPreloader();
          percentText.innerHTML = "0%";
          totalLoaded = 0;

          for (var i = 0; i < total; i++) {
            var img = new Image();
            
            img.onload = function() {
              incLoaded();
              console.log("loaded");
            }
            img.onerror = function() {
              incLoaded();
              console.log("load error");
            }

            var 
              style = preloads[i].currentStyle || window.getComputedStyle(preloads[i], false),
              src = style.backgroundImage.slice(4, -1);
            
            src = src.replace(/('|")/g,'');
            img.src = src;
          }
        }
      }

    }());

    var arrowLinksInit = (function (){
      var scrollWindowDown = (e) => {
        e.preventDefault();
        let offsetHeight = document.body.clientHeight - window.innerHeight;
        if (offsetHeight > 0) {
          scrollTo(document.body, offsetHeight, 500);
        }
      }
      var scrollWindowUp = (e) => {
        e.preventDefault();
        scrollTo(document.body, 0, 500);
      }
      return {
        init:() => {
          let arrowUp = document.querySelector('.arrow__up');
          let arrowDown = document.querySelector('.arrow__down');
          if (arrowUp != null) {
            arrowUp.addEventListener('click', scrollWindowUp);
          }
          if (arrowDown != null) {
            arrowDown.addEventListener('click', scrollWindowDown);
          }
        }
      }
    })();

     var flip = (function () {
      var flipper = document.querySelector('.flipper');

      var setFlipperDimentions = () => {
        var 
          front = getComputedStyle(flipper.querySelector('.flipper__side').firstElementChild),
          back = getComputedStyle(flipper.querySelector('.flipper__side').lastElementChild);

          flipper.style.width = Math.max(parseInt(front.width, 10), parseInt(back.width, 10)) + 'px';
          console.log( Math.max(parseInt(front.width, 10), parseInt(back.width, 10)) + " "+ Math.max(parseInt(front.height, 10), parseInt(back.height, 10)));
          flipper.style.height = Math.max(parseInt(front.height, 10), parseInt(back.height, 10))+ 'px';
      };
      var doFlip = () => {
        flipper.classList.toggle('flipper_flip');
      }
      
      return {
        init: () => {
          if (flipper != null) {
            setFlipperDimentions();
            document.querySelector('.button__link_flipper').onclick = function(e) {
              doFlip();
              this.classList.toggle('button__link_active');
            };
            document.querySelector('.form__button_flip').onclick = function(e) {
              doFlip();
              document.querySelector('.button__link_flipper').classList.toggle('button__link_active');
            };
          }
        }
      }
    })();

    preloader.init();
    arrowLinksInit.init();
    flip.init();
    window.addEventListener("load", ready);
  }

  window.addEventListener("DOMContentLoaded", DOMReady);  
})();

function scrollTo (element, to, duration) {
  if (duration <= 0) return;
  let diff = to - element.scrollTop;
  let tick = diff / duration * 10;

  setTimeout(()=>{
    element.scrollTop = element.scrollTop + tick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}

function initMap() {
        var belgorod = {lat: 50.59460565204478, lng: 36.599270610589656};
        var marker = {lat: 50.6, lng: 36.5992};
        var mapOptions = 
  [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#373e42"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "landscape",
      "stylers": [
        {
          "color": "#eff0ea"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#efeee9"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#efeee9"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#373e42"
        }
      ]
    },
    {
      "featureType": "poi.attraction",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.government",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.medical",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#479686"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "poi.place_of_worship",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.school",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.sports_complex",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#455a64"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#d6d6d6"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#009688"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#009688"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#d5d6d7"
        },
        {
          "lightness": 5
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#373e42"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#00bfa5"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    }
  ]
  if ((google!= null) && (document.querySelector('.googlemap')!=null)) {
    var map = new google.maps.Map(document.querySelector('.googlemap'), {
      center: belgorod,
      zoom: 15,
      styles: mapOptions,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      gestureHandling: 'auto',
      zoomControl: true,
      scrollwheel: false,
      draggable : true,
      clickableIcons: false,
    });
    var image = '/assets/img/map-marker.png';
    var marker = new google.maps.Marker({
      position: marker,
      map: map,
      icon: image
    });
    }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIERPTVJlYWR5ICgpIHtcbiAgZnVuY3Rpb24gcmVhZHkoKSB7XG4gICAgdmFyIG1vdXNlUGFyYWxsYXggPSAoZnVuY3Rpb24gKCl7XG4gICAgICB2YXIgcGFyYWxsYXggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFyYWxsYXgnKTtcbiAgICAgIHZhclxuICAgICAgICAgIGxheWVycyA9ICBbXSxcbiAgICAgICAgICBjb21wdXRlZFN0eWxlID0gbnVsbCxcbiAgICAgICAgICB3aWR0aCA9MCxcbiAgICAgICAgICBoZWlnaHQgPSAwLFxuICAgICAgICAgIHBhcmFsbGF4UGVyY2VudCA9IDUsXG4gICAgICAgICAgbWF4T2Zmc2V0WCA9IDAsXG4gICAgICAgICAgbWF4T2Zmc2V0WSA9IDA7XG5cbiAgICAgIHZhciBtb3VzZU1vdmUgPSAoZSkgPT4ge1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyXG4gICAgICAgICAgICBsYXllciA9IGxheWVyc1tpXSxcbiAgICAgICAgICAgIGRlcHRoID0gbGF5ZXIuZGF0YXNldC5kZXB0aCxcbiAgICAgICAgICAgIHRyYW5zbGF0ZVggPSAtKGUuY2xpZW50WC13aWR0aC8yKS8od2lkdGgvMikqbWF4T2Zmc2V0WCpkZXB0aCxcbiAgICAgICAgICAgIHRyYW5zbGF0ZVkgPSAtKGUuY2xpZW50WS1oZWlnaHQvMikvKGhlaWdodC8yKSptYXhPZmZzZXRZKmRlcHRoO1xuXG4gICAgICAgICAgdmFyIHRyYW5zZm9ybSA9IFwidHJhbnNsYXRlM2QoXCIrdHJhbnNsYXRlWCArIFwicHgsXCIrdHJhbnNsYXRlWStcInB4LFwiKyBcIjApXCI7XG4gICAgICAgICAgbGF5ZXIuc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuICAgICAgICAgIGxheWVyLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcbiAgICAgICAgfVxuICAgICAgfVxuXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGluaXQ6ICgpID0+IHtcbiAgICAgICAgICBpZiAocGFyYWxsYXggIT0gbnVsbCkge1xuICAgICAgICAgICAgbGF5ZXJzID0gIHBhcmFsbGF4LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2xheWVyJyk7XG4gICAgICAgICAgICBjb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShwYXJhbGxheCk7XG4gICAgICAgICAgICB3aWR0aCA9IHBhcnNlSW50KGNvbXB1dGVkU3R5bGUud2lkdGgsIDEwKTtcbiAgICAgICAgICAgIGhlaWdodCA9IHBhcnNlSW50KGNvbXB1dGVkU3R5bGUuaGVpZ2h0LCAxMCk7XG4gICAgICAgICAgICBtYXhPZmZzZXRYID0gcGFyYWxsYXhQZXJjZW50KndpZHRoLzEwMDtcbiAgICAgICAgICAgIG1heE9mZnNldFkgPSBwYXJhbGxheFBlcmNlbnQqaGVpZ2h0LzEwMDtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZU1vdmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pKCk7XG5cbiAgICB2YXIgc2Nyb2xsUGFyYWxsYXggPSAoZnVuY3Rpb24gKCl7XG4gICAgICB2YXIgYmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFyYWxsYXgtc2Nyb2xsJyk7XG4gICAgICBcbiAgICAgIHZhciBzY3JvbGxGdW5jdGlvbiA9IChlKSA9PiB7XG4gICAgICAgIGlmIChiZy5sZW5ndGg+MCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJnW2ldLnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlM2QoMCxcIisod2luZG93LnNjcm9sbFkvKChpKzEpKjEuNSkpK1wicHgsXCIrIFwiMClcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdDogKCkgPT4ge1xuICAgICAgICAgIGlmIChiZyAhPSBudWxsKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc2Nyb2xsRnVuY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pKCk7XG5cbiAgICB2YXIgYmx1ciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYmx1ciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ibHVyJyksXG4gICAgICAgICAgY29udGFjdG1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhY3RtZScpLFxuICAgICAgICAgIG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsX2NvbnRhY3RtZScpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChibHVyIT1udWxsKSB7XG4gICAgICAgICAgICB2YXJcbiAgICAgICAgICAgICAgcG9zTGVmdCA9IC1jb250YWN0bWUub2Zmc2V0TGVmdCxcbiAgICAgICAgICAgICAgb2Zmc2V0VG9wID0gLShjb250YWN0bWUub2Zmc2V0VG9wLXBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobW9kYWwpLmJhY2tncm91bmRQb3NpdGlvblksIDEwKSk7XG5cbiAgICAgICAgICAgIC8vVE9ETzogZ2V0IGltZyBkZW1lbnRpb25zIGZyb20gYmcgdXJsXG4gICAgICAgICAgICB2YXIgaW1nV2lkdGggPSAyMDAwLFxuICAgICAgICAgICAgICAgIGltZ0hlaWdodCA9IDE2OTksXG4gICAgICAgICAgICAgICAgbW9kYWxXaWR0aCA9IG1vZGFsLmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgICAgIG1vZGFsSGVpZ2h0ID0gbW9kYWwuY2xpZW50SGVpZ2h0LFxuICAgICAgICAgICAgICAgIGltZ1JhdGlvID0gKGltZ0hlaWdodCAvIGltZ1dpZHRoKSxcbiAgICAgICAgICAgICAgICBtb2RhbFJhdGlvID0gKG1vZGFsSGVpZ2h0IC8gbW9kYWxXaWR0aCksXG4gICAgICAgICAgICAgICAgYmdDb3ZlcldpZHRoID0gMCxcbiAgICAgICAgICAgICAgICBiZ0NvdmVySGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKG1vZGFsUmF0aW8gPiBpbWdSYXRpbykge1xuICAgICAgICAgICAgICAgIGJnQ292ZXJIZWlnaHQgPSBtb2RhbEhlaWdodDtcbiAgICAgICAgICAgICAgICBiZ0NvdmVyV2lkdGggPSAobW9kYWxIZWlnaHQgLyBpbWdSYXRpbyk7XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYmdDb3ZlcldpZHRoID0gbW9kYWxXaWR0aDtcbiAgICAgICAgICAgICAgICBiZ0NvdmVySGVpZ2h0ID0gKG1vZGFsV2lkdGggKiBpbWdSYXRpbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGJsdXIuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBiZ0NvdmVyV2lkdGggKyAncHggJyArIGJnQ292ZXJIZWlnaHQgKyAncHgnO1xuICAgICAgICAgICAgYmx1ci5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb25YID0gcG9zTGVmdCArICdweCc7XG4gICAgICAgICAgICBibHVyLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvblkgPSBvZmZzZXRUb3AgKyAncHgnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0oKSk7XG5cblxuICAgIHZhciBnYWxsZXJ5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhclxuICAgICAgICB0aXRsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud29ya3NfX3RpdGxlLWl0ZW0nKSxcbiAgICAgICAgdGVjaHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud29ya3NfX3RlY2gtaXRlbScpLFxuICAgICAgICBocmVmcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53b3Jrc19faHJlZi1pdGVtJyksXG4gICAgICAgIG1haW5JbWFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud29ya3NfX21haW5pbWFnZS1pdGVtJyksXG4gICAgICAgIGNvbnRyb2xzVXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud29ya3NfX2NvbnRyb2xfdXAnKSxcbiAgICAgICAgY29udHJvbHNEb3duID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndvcmtzX19jb250cm9sX2Rvd24nKTtcblxuICAgICAgdmFyIHNldFJvdW5kQXJyYXkgPSAocXVlcnkpID0+IHtcblxuICAgICAgICBsZXQgcm91bmRBcnJheSA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgXG4gICAgICAgICAgICBjdXJyZW50ID0gMCxcbiAgICAgICAgICAgIGxpbWl0ID0gMCxcbiAgICAgICAgICAgIHByZXZJbmRleCA9IDAsXG4gICAgICAgICAgICBuZXh0SW5kZXggPSAwLFxuICAgICAgICAgICAgcXVlcnkgPSBbXTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5jOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHByZXZJbmRleCA9IGN1cnJlbnQ7XG4gICAgICAgICAgICAgIGN1cnJlbnQrKztcbiAgICAgICAgICAgICAgaWYgKGN1cnJlbnQgPiBsaW1pdCkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG5leHRJbmRleCA9IChjdXJyZW50ICsgMSkgPiBsaW1pdCA/IDAgOiBjdXJyZW50ICsgMTtcbiAgICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5W2N1cnJlbnRdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlYzogKCkgPT4ge1xuICAgICAgICAgICAgICBwcmV2SW5kZXggPSBjdXJyZW50O1xuICAgICAgICAgICAgICBjdXJyZW50LS07XG4gICAgICAgICAgICAgIGlmIChjdXJyZW50IDwgMCkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBsaW1pdDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBuZXh0SW5kZXggPSAoY3VycmVudCArIDEpID4gbGltaXQgPyAwIDogY3VycmVudCArIDE7XG4gICAgICAgICAgICAgIHJldHVybiBxdWVyeVtjdXJyZW50XTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5W2N1cnJlbnRdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByZXY6ICgpID0+IHtcbiAgICAgICAgICAgICAgbGV0IG5keCA9IChjdXJyZW50IC0gMSkgPCAwID8gbGltaXQgOiBjdXJyZW50IC0gMTtcbiAgICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5W25keF07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmV4dDogKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gcXVlcnlbbmV4dEluZGV4XTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsYXN0OiAoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBxdWVyeVtsaW1pdF07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0SW5kZXg6ICgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QXRJbmRleDogKGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIGlmICggKGluZGV4ID49IDApICYmIChpbmRleCA8PSBsaW1pdCkpIHJldHVybiBxdWVyeVtpbmRleF07XG4gICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsZW5ndGg6ICgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGxpbWl0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluaXQ6IChxQXJyYXkpID0+IHtcbiAgICAgICAgICAgICAgcXVlcnkgPSBxQXJyYXk7XG4gICAgICAgICAgICAgIGxpbWl0ID0gcXVlcnkubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgY3VycmVudCA9IDA7XG4gICAgICAgICAgICAgIG5leHRJbmRleCA9IChjdXJyZW50ICsgMSkgPiBsaW1pdCA/IDAgOiBjdXJyZW50ICsgMTtcbiAgICAgICAgICAgICAgcHJldkluZGV4ID0gKGN1cnJlbnQgLSAxKSA8IDAgPyBsaW1pdCA6IGN1cnJlbnQgLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkoKTtcbiAgICAgICAgcm91bmRBcnJheS5pbml0KHF1ZXJ5KTtcbiAgICAgICAgcmV0dXJuIHJvdW5kQXJyYXk7XG5cbiAgICAgIH1cblxuICAgICAgdmFyIGdhbGxlcnlJbml0ID0gKCkgPT4ge1xuXG4gICAgICAgIHRlY2hzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgaXRlbS5pbm5lckhUTUwgPSBwcmVwYXJlVGV4dChpdGVtKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRpdGxlcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgIGl0ZW0uZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gcHJlcGFyZVRleHQoaXRlbS5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aXRsZXMgPSBzZXRSb3VuZEFycmF5KHRpdGxlcyk7XG4gICAgICAgIHRlY2hzID0gc2V0Um91bmRBcnJheSh0ZWNocyk7XG4gICAgICAgIGhyZWZzID0gc2V0Um91bmRBcnJheShocmVmcyk7XG4gICAgICAgIG1haW5JbWFnZXMgPSBzZXRSb3VuZEFycmF5KG1haW5JbWFnZXMpO1xuICAgICAgICBjb250cm9sc1VwID0gc2V0Um91bmRBcnJheShjb250cm9sc1VwKTtcbiAgICAgICAgY29udHJvbHNEb3duID0gc2V0Um91bmRBcnJheShjb250cm9sc0Rvd24pO1xuXG4gICAgICAgIGNvbnRyb2xzVXAuaW5jKCk7XG4gICAgICAgIGNvbnRyb2xzRG93bi5kZWMoKTtcblxuICAgICAgICB1cGRhdGVWaWV3KCk7XG4gICAgICAgIGNvbnRyb2xzVXAuZ2V0KCkuY2xhc3NMaXN0LnRvZ2dsZSgnd29ya3NfYW5pbWF0aW9uLXNsaWRldXBib3R0b20nKTtcbiAgICAgICAgY29udHJvbHNEb3duLmdldCgpLmNsYXNzTGlzdC50b2dnbGUoJ3dvcmtzX2FuaW1hdGlvbi1zbGlkZWRvd250b3AnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHVwZGF0ZVZpZXcgPSAoKSA9PiB7XG4gICAgICAgIGhyZWZzLmdldCgpLmNsYXNzTGlzdC50b2dnbGUoJ3dvcmtzX19jdXJyZW50Jyk7XG5cbiAgICAgICAgdGl0bGVzLmdldCgpLmNsYXNzTGlzdC50b2dnbGUoJ3dvcmtzX19jdXJyZW50Jyk7XG4gICAgICAgIHRpdGxlcy5nZXQoKS5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZC5jbGFzc0xpc3QudG9nZ2xlKCd3b3Jrc19fdGV4dF9hbmltYXRlJyk7XG5cbiAgICAgICAgdGVjaHMuZ2V0KCkuY2xhc3NMaXN0LnRvZ2dsZSgnd29ya3NfX2N1cnJlbnQnKTtcbiAgICAgICAgdGVjaHMuZ2V0KCkuY2xhc3NMaXN0LnRvZ2dsZSgnd29ya3NfX3RleHRfYW5pbWF0ZScpO1xuXG4gICAgICAgIG1haW5JbWFnZXMuZ2V0KCkuY2xhc3NMaXN0LnRvZ2dsZSgnd29ya3NfX2N1cnJlbnQnKTtcbiAgICAgICAgbWFpbkltYWdlcy5nZXQoKS5jbGFzc0xpc3QudG9nZ2xlKCd3b3Jrc19fbWFpbmltYWdlX2FuaW1hdGUnKTtcblxuICAgICAgfVxuICAgICAgdmFyIGNsZWFuQW5pbWF0aW9ucyA9ICgpID0+IHtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPD1jb250cm9sc0Rvd24ubGVuZ3RoKCk7IGkrKykge1xuICAgICAgICAgICAgY29udHJvbHNEb3duLmdldEF0SW5kZXgoaSkuY2xhc3NMaXN0LnJlbW92ZSgnd29ya3NfYW5pbWF0aW9uLXNsaWRldXBib3R0b20nKTtcbiAgICAgICAgICAgIGNvbnRyb2xzRG93bi5nZXRBdEluZGV4KGkpLmNsYXNzTGlzdC5yZW1vdmUoJ3dvcmtzX2FuaW1hdGlvbi1zbGlkZWRvd250b3AnKTtcbiAgICAgICAgICAgIGNvbnRyb2xzRG93bi5nZXRBdEluZGV4KGkpLmNsYXNzTGlzdC5yZW1vdmUoJ3dvcmtzX2FuaW1hdGlvbi1zbGlkZXVwJyk7XG4gICAgICAgICAgICBjb250cm9sc0Rvd24uZ2V0QXRJbmRleChpKS5jbGFzc0xpc3QucmVtb3ZlKCd3b3Jrc19hbmltYXRpb24tc2xpZGVkb3duJyk7XG4gICAgICAgICAgICBjb250cm9sc1VwLmdldEF0SW5kZXgoaSkuY2xhc3NMaXN0LnJlbW92ZSgnd29ya3NfYW5pbWF0aW9uLXNsaWRldXBib3R0b20nKTtcbiAgICAgICAgICAgIGNvbnRyb2xzVXAuZ2V0QXRJbmRleChpKS5jbGFzc0xpc3QucmVtb3ZlKCd3b3Jrc19hbmltYXRpb24tc2xpZGVkb3dudG9wJyk7XG4gICAgICAgICAgICBjb250cm9sc1VwLmdldEF0SW5kZXgoaSkuY2xhc3NMaXN0LnJlbW92ZSgnd29ya3NfYW5pbWF0aW9uLXNsaWRldXAnKTtcbiAgICAgICAgICAgIGNvbnRyb2xzVXAuZ2V0QXRJbmRleChpKS5jbGFzc0xpc3QucmVtb3ZlKCd3b3Jrc19hbmltYXRpb24tc2xpZGVkb3duJyk7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgZ2FsbGVyeUZsaXAgPSAoZGlyZXRpb24pID0+IHtcbiAgICAgICAgdXBkYXRlVmlldygpO1xuICAgICAgICBpZiAoZGlyZXRpb24gPT09ICd1cCcpIHtcbiAgICAgICAgICB0aXRsZXMuaW5jKCk7XG4gICAgICAgICAgdGVjaHMuaW5jKCk7XG4gICAgICAgICAgaHJlZnMuaW5jKCk7XG4gICAgICAgICAgbWFpbkltYWdlcy5pbmMoKTtcblxuICAgICAgICAgIHVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICBjbGVhbkFuaW1hdGlvbnMoKTtcblxuICAgICAgICAgIGNvbnRyb2xzVXAuZ2V0KCkuY2xhc3NMaXN0LmFkZCgnd29ya3NfYW5pbWF0aW9uLXNsaWRldXAnKTtcbiAgICAgICAgICBjb250cm9sc1VwLm5leHQoKS5jbGFzc0xpc3QuYWRkKCd3b3Jrc19hbmltYXRpb24tc2xpZGV1cGJvdHRvbScpO1xuXG4gICAgICAgICAgY29udHJvbHNEb3duLmdldCgpLmNsYXNzTGlzdC5hZGQoJ3dvcmtzX2FuaW1hdGlvbi1zbGlkZWRvd24nKTtcbiAgICAgICAgICBjb250cm9sc0Rvd24ubmV4dCgpLmNsYXNzTGlzdC5hZGQoJ3dvcmtzX2FuaW1hdGlvbi1zbGlkZWRvd250b3AnKTtcblxuICAgICAgICAgIGNvbnRyb2xzVXAuaW5jKCk7XG4gICAgICAgICAgY29udHJvbHNEb3duLmluYygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRpdGxlcy5kZWMoKTtcbiAgICAgICAgICB0ZWNocy5kZWMoKTtcbiAgICAgICAgICBocmVmcy5kZWMoKTtcbiAgICAgICAgICBtYWluSW1hZ2VzLmRlYygpO1xuXG4gICAgICAgICAgdXBkYXRlVmlldygpO1xuICAgICAgICAgIGNsZWFuQW5pbWF0aW9ucygpO1xuXG4gICAgICAgICAgY29udHJvbHNEb3duLmdldCgpLmNsYXNzTGlzdC5hZGQoJ3dvcmtzX2FuaW1hdGlvbi1zbGlkZXVwJyk7XG4gICAgICAgICAgY29udHJvbHNEb3duLnByZXYoKS5jbGFzc0xpc3QuYWRkKCd3b3Jrc19hbmltYXRpb24tc2xpZGV1cGJvdHRvbScpO1xuXG4gICAgICAgICAgY29udHJvbHNVcC5nZXQoKS5jbGFzc0xpc3QuYWRkKCd3b3Jrc19hbmltYXRpb24tc2xpZGVkb3duJyk7XG4gICAgICAgICAgY29udHJvbHNVcC5wcmV2KCkuY2xhc3NMaXN0LnRvZ2dsZSgnd29ya3NfYW5pbWF0aW9uLXNsaWRlZG93bnRvcCcpO1xuXG4gICAgICAgICAgY29udHJvbHNVcC5kZWMoKTtcbiAgICAgICAgICBjb250cm9sc0Rvd24uZGVjKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHByZXBhcmVUZXh0ID0gKHRleHQpID0+IHtcbiAgICAgICAgbGV0IHdvcmRzID0gdGV4dC5pbm5lclRleHQudHJpbSgpLnNwbGl0KCcgJyk7XG4gICAgICAgIGxldCBfd29yZHMgPSBbXTtcblxuICAgICAgICB3b3Jkcy5mb3JFYWNoKHdvcmQgPT4ge1xuICAgICAgICAgIGxldCBzcGxpdFdvcmQgPSB3b3JkLnNwbGl0KCcnKS5tYXAoKGNoYXIsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYDxpPiR7Y2hhcn08L2k+YDtcbiAgICAgICAgICB9KS5qb2luKCcnKTtcbiAgICAgICAgICBfd29yZHMucHVzaChzcGxpdFdvcmQpO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGZvcm1hdHRlZFdvcmRzID0gX3dvcmRzLm1hcCgod29yZCwgaW5kZXgpID0+IHtcbiAgICAgICAgICByZXR1cm4gYDxzcGFuPiR7d29yZH08L3NwYW4+YDtcbiAgICAgICAgfSkuam9pbignICcpO1xuICAgICAgICByZXR1cm4gZm9ybWF0dGVkV29yZHM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG5cbiAgICAgICAgaW5pdDogKCkgPT4ge1xuICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud29ya3MnKSAhPSBudWxsKSB7XG4gICAgICAgICAgICBnYWxsZXJ5SW5pdCgpO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndvcmtzX19hcnJvd19kb3duJykub25jbGljayA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICBnYWxsZXJ5RmxpcCgnZG93bicpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndvcmtzX19hcnJvd191cCcpLm9uY2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgZ2FsbGVyeUZsaXAoJ3VwJyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pKCk7XG4gICAgXG4gICAgdmFyIGJsb2dUb0MgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIFxuICAgICAgICB0b2MgPSBudWxsLFxuICAgICAgICBsaW5rcyA9IG51bGwsXG4gICAgICAgIG9mZnNldENvbnRlbnQgPSAwLFxuICAgICAgICBhcnRpY2xlc0hlaWdodHMgPSBbXSxcbiAgICAgICAgb2Zmc2V0QXJ0aWNsZXMgPSBbXSxcbiAgICAgICAgb2Zmc2V0TWFyZ2luID0gNjA7XG5cbiAgICAgICAgdmFyIHRvY1Njcm9sbCA9IChlKSA9PiB7XG4gICAgICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZID4gb2Zmc2V0Q29udGVudCkge1xuICAgICAgICAgICAgLy8gdG9jLmNsYXNzTGlzdC5hZGQoJ2Jsb2dfX21lbnVfc3RpY2t5Jyk7XG4gICAgICAgICAgICB0b2Muc3R5bGUudG9wID0gXCIwXCI7XG4gICAgICAgICAgICBvZmZzZXRBcnRpY2xlcy5mb3JFYWNoKChvZmZzZXQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIGlmICgod2luZG93LnNjcm9sbFkgPiBvZmZzZXQtIG9mZnNldE1hcmdpbikgJiYgKChvZmZzZXQgKyBhcnRpY2xlc0hlaWdodHNbaW5kZXhdLW9mZnNldE1hcmdpbikgPiB3aW5kb3cuc2Nyb2xsWSkpIHtcbiAgICAgICAgICAgICAgICBsaW5rc1tpbmRleF0uY2xhc3NMaXN0LmFkZCgnYmxvZy1tZW51X19saW5rX3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGlua3NbaW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUoJ2Jsb2ctbWVudV9fbGlua19zZWxlY3RlZCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IGZvb3RlckhlaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXInKS5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICBpZiAodG9jLmNsaWVudEhlaWdodCA+ICh3aW5kb3cuaW5uZXJIZWlnaHQtZm9vdGVySGVpZ2h0KSkge1xuICAgICAgICAgICAgICBsZXQgbWVudW9mZnNldCA9ICh0b2MuY2xpZW50SGVpZ2h0IC0gKHdpbmRvdy5pbm5lckhlaWdodCAtIGZvb3RlckhlaWdodCAtIDIwKSkgKiAod2luZG93LnNjcm9sbFkgLyBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCk7XG4gICAgICAgICAgICAgIHRvYy5zdHlsZS50b3AgPSAtbWVudW9mZnNldCArICdweCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0b2Muc3R5bGUudG9wID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b2Muc3R5bGUudG9wID0gb2Zmc2V0Q29udGVudC0gd2luZG93LnNjcm9sbFkgKyAncHgnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbml0OiAoKSA9PiB7XG4gICAgICAgICAgdG9jID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJsb2dfX21lbnUnKTtcbiAgICAgICAgICBpZiAodG9jID09IG51bGwpIHJldHVybjtcbiAgICAgICAgICB0b2Muc3R5bGUudG9wID0gb2Zmc2V0Q29udGVudC0gd2luZG93LnNjcm9sbFkgKyAncHgnO1xuICAgICAgICAgIGxpbmtzID0gdG9jLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ibG9nLW1lbnVfX2xpbmsnKTtcbiAgICAgICAgICBsaW5rc1swXS5jbGFzc0xpc3QuYWRkKCdibG9nLW1lbnVfX2xpbmtfc2VsZWN0ZWQnKTtcbiAgICAgICAgICBvZmZzZXRDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnQnKS5vZmZzZXRUb3A7XG4gICAgICAgICAgb2Zmc2V0QXJ0aWNsZXMgPSBbXTtcbiAgICAgICAgICBhcnRpY2xlc0hlaWdodHMgPSBbXTtcblxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hcnRpY2xlX19jb250ZW50JykuZm9yRWFjaCgoYXJ0aWNsZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIG9mZnNldEFydGljbGVzLnB1c2goYXJ0aWNsZS5vZmZzZXRUb3ApO1xuICAgICAgICAgICAgYXJ0aWNsZXNIZWlnaHRzLnB1c2goYXJ0aWNsZS5vZmZzZXRIZWlnaHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwib2Zmc2V0Q29udGVudDogXCIrb2Zmc2V0Q29udGVudCArIFwiXFxuIG9mZnNldEFydGljbGVzOiBcIiArb2Zmc2V0QXJ0aWNsZXMrXCIgXFxuIGFydGljbGVzSGVpZ2h0czogXCIrIGFydGljbGVzSGVpZ2h0cyk7XG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRvY1Njcm9sbCk7XG4gICAgICAgICAgdG9jU2Nyb2xsKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KSgpO1xuXG4gICAgdmFyIGJsb2dTd2lwZU1lbnUgPSAoZnVuY3Rpb24gKCl7XG4gICAgICB2YXIgYnRuID0gbnVsbDtcbiAgICAgIHZhciBtZW51ID0gbnVsbDtcbiAgICAgIHZhciBvZmZzZXRDb250ZW50ID0gMDtcblxuICAgICAgdmFyIGJ0bmNsaWNrID0gKCkgPT4ge1xuICAgICAgICBtZW51LmNsYXNzTGlzdC50b2dnbGUoJ2NvbHVtbnNfX2xlZnRfYmxvZy1zd2lwZWQnKTtcbiAgICAgICAgbGV0IGJ0bnN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShidG4pO1xuICAgICAgICBsZXQgbWVudXN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShtZW51KTtcblxuICAgICAgICBpZiAoYnRuLm9mZnNldExlZnQgPiAwKSB7XG4gICAgICAgICAgYnRuLnN0eWxlLmxlZnQgPSAoLTEqcGFyc2VJbnQoYnRuc3R5bGUud2lkdGgsIDEwKSAvIDIpICsgJ3B4JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidG4uc3R5bGUubGVmdCA9ICgocGFyc2VJbnQobWVudXN0eWxlLndpZHRoLCAxMCkpIC0gcGFyc2VJbnQoYnRuc3R5bGUud2lkdGgsIDEwKSAvIDIpICsgJ3B4JztcbiAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgfVxuICAgICAgdmFyIGNhbGNCdG5PZmZzZXRMZWZ0ID0gKCkgPT4ge1xuICAgICAgICBcbiAgICAgIH1cbiAgICAgIHZhciBidG5zY3JvbGwgPSAoKSA9PiB7XG4gICAgICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA+IG9mZnNldENvbnRlbnQpIHtcbiAgICAgICAgICBidG4uc3R5bGUudG9wID0gXCI1MCVcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidG4uc3R5bGUudG9wID0gTWF0aC5tYXgod2luZG93LmlubmVySGVpZ2h0LzIsIG9mZnNldENvbnRlbnQtIHdpbmRvdy5zY3JvbGxZKSArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbml0OiAoKSA9PiB7XG4gICAgICAgICAgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJsb2dfX3N3aXBlJyk7XG4gICAgICAgICAgaWYgKGJ0biA9PSBudWxsKSByZXR1cm47XG4gICAgICAgICAgb2Zmc2V0Q29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50Jykub2Zmc2V0VG9wO1xuICAgICAgICAgIGJ0bi5zdHlsZS50b3AgPSBNYXRoLm1heCh3aW5kb3cuaW5uZXJIZWlnaHQvMiwgb2Zmc2V0Q29udGVudC0gd2luZG93LnNjcm9sbFkpICsgJ3B4JztcbiAgICAgICAgICBpZiAoYnRuLm9mZnNldExlZnQgPiAwKSB7XG4gICAgICAgICAgICBidG4uY2xpY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy9UT0RPOiBzb210aGluZyB0byBkbyB3aXRoIHRoaXMgT29cbiAgICAgICAgICBidG4uY2xpY2soKTtcbiAgICAgICAgICBidG4uY2xpY2soKTtcbiAgICAgICAgICBtZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbHVtbnNfX2xlZnRfYmxvZycpO1xuICAgICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJ0bmNsaWNrKTtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgYnRuc2Nyb2xsKTtcbiAgICAgICAgICBidG5zY3JvbGwoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pKCk7XG5cbiAgICB2YXIgZm9ybXNWYWxpZGF0aW9uID0gKGZ1bmN0aW9uICgpe1xuICAgICAgdmFyIGZvcm1Mb2dpbiA9IG51bGwsXG4gICAgICAgICAgZm9ybUNvbnRhY3RtZSA9IG51bGw7XG5cbiAgICAgIHZhciBzaG93RXJyb3IgPSAoY29udGFpbmVyLCBtc2cpID0+IHtcbiAgICAgICAgbGV0IGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVycm9yLmNsYXNzTmFtZSA9ICdmb3JtX19lcnJvcic7XG4gICAgICAgIGVycm9yLmlubmVyVGV4dD1tc2c7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlcnJvcik7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdmb3JtX19zZWN0aW9uX3Jvdy1pbnB1dGVycm9yJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZXNldE1zZyA9IChjb250YWluZXIpID0+IHtcbiAgICAgICAgaWYgKGNvbnRhaW5lci5sYXN0Q2hpbGQuY2xhc3NOYW1lID09IFwiZm9ybV9fZXJyb3JcIiApIHtcbiAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoY29udGFpbmVyLmxhc3RDaGlsZCk7XG4gICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2Zvcm1fX3NlY3Rpb25fcm93LWlucHV0ZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnZm9ybV9fc2VjdGlvbl9yb3ctaW5wdXRzdWNjZXNzJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzdWNjZXNzTXNnPSAoY29udGFpbmVyLCBtc2cpID0+IHtcbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc3VjY2Vzcy5jbGFzc05hbWUgPSAnZm9ybV9fc3VjY2Vzcyc7XG4gICAgICAgIHN1Y2Nlc3MuaW5uZXJUZXh0PW1zZztcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHN1Y2Nlc3MpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKHN1Y2Nlc3MpO1xuICAgICAgICB9LDIwMDApO1xuICAgICAgfVxuXG4gICAgICB2YXIgdmFsaWRhdGVMb2dpbiA9IChlKSA9PiB7XG4gICAgICAgIGxldCBlbGVtZW50cyA9IGZvcm1Mb2dpbi5lbGVtZW50cztcbiAgICAgICAgbGV0IGVycm9ycyA9IDA7XG4gICAgICAgIFxuICAgICAgICByZXNldE1zZyhlbGVtZW50cy5sb2dpbi5wYXJlbnROb2RlKTtcbiAgICAgICAgaWYgKCFlbGVtZW50cy5sb2dpbi52YWx1ZSkge1xuICAgICAgICAgIGVycm9ycysrO1xuICAgICAgICAgIHNob3dFcnJvcihlbGVtZW50cy5sb2dpbi5wYXJlbnROb2RlLCBcItCS0Ysg0L3QtSDQstCy0LXQu9C4INC70L7Qs9C40L1cIik7XG4gICAgICAgICAgZWxlbWVudHMubG9naW4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSk9PntcbiAgICAgICAgICAgIHJlc2V0TXNnKGVsZW1lbnRzLmxvZ2luLnBhcmVudE5vZGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW1lbnRzLmxvZ2luLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgnZm9ybV9fc2VjdGlvbl9yb3ctaW5wdXRzdWNjZXNzJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXNldE1zZyhlbGVtZW50cy5wYXNzd29yZC5wYXJlbnROb2RlKTtcbiAgICAgICAgaWYgKCFlbGVtZW50cy5wYXNzd29yZC52YWx1ZSkge1xuICAgICAgICAgIGVycm9ycysrO1xuICAgICAgICAgIHNob3dFcnJvcihlbGVtZW50cy5wYXNzd29yZC5wYXJlbnROb2RlLCBcItCS0Ysg0L3QtSDQstCy0LXQu9C4INC/0LDRgNC+0LvRjFwiKTtcbiAgICAgICAgICBlbGVtZW50cy5wYXNzd29yZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKT0+e1xuICAgICAgICAgICAgcmVzZXRNc2coZWxlbWVudHMucGFzc3dvcmQucGFyZW50Tm9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbWVudHMucGFzc3dvcmQucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdmb3JtX19zZWN0aW9uX3Jvdy1pbnB1dHN1Y2Nlc3MnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0TXNnKGVsZW1lbnRzLmh1bWFuLnBhcmVudE5vZGUpO1xuICAgICAgICBpZiAoIWVsZW1lbnRzLmh1bWFuLmNoZWNrZWQpIHtcbiAgICAgICAgICBlcnJvcnMrKztcbiAgICAgICAgICBzaG93RXJyb3IoZWxlbWVudHMuaHVtYW4ucGFyZW50Tm9kZSwgXCLQktGLINC90LUg0YfQtdC70L7QstC10Lo/XCIpO1xuICAgICAgICAgIGVsZW1lbnRzLmh1bWFuLnBhcmVudE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSk9PntcbiAgICAgICAgICAgIHJlc2V0TXNnKGVsZW1lbnRzLmh1bWFuLnBhcmVudE5vZGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW1lbnRzLmh1bWFuLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgnZm9ybV9fc2VjdGlvbl9yb3ctaW5wdXRzdWNjZXNzJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXNldE1zZyhlbGVtZW50cy5jYXB0aGNhWzBdLnBhcmVudE5vZGUpO1xuICAgICAgICBpZiAoIWVsZW1lbnRzLmNhcHRoY2FbMF0uY2hlY2tlZCkge1xuICAgICAgICAgIGVycm9ycysrO1xuICAgICAgICAgIHNob3dFcnJvcihlbGVtZW50cy5jYXB0aGNhWzBdLnBhcmVudE5vZGUsIFwi0JLRiyDQvdC1INC90LUg0YDQvtCx0L7Rgj9cIik7XG4gICAgICAgICAgZWxlbWVudHMuY2FwdGhjYVswXS5wYXJlbnROb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpPT57XG4gICAgICAgICAgICByZXNldE1zZyhlbGVtZW50cy5jYXB0aGNhWzBdLnBhcmVudE5vZGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW1lbnRzLmNhcHRoY2FbMF0ucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdmb3JtX19zZWN0aW9uX3Jvdy1pbnB1dHN1Y2Nlc3MnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZXJyb3JzKSB7XG4gICAgICAgICAgc3VjY2Vzc01zZyhmb3JtTG9naW4ucGFyZW50Tm9kZSwgXCLQlNC+0LHRgNC+INC/0L7QttCw0LvQvtCy0LDRgtGMIVwiKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICAgIHZhciB2YWxpZGF0ZUNvbnRhY3RtZSA9IChlKSA9PiB7XG4gICAgICAgIGxldCBlbGVtZW50cyA9IGZvcm1Db250YWN0bWUuZWxlbWVudHM7XG4gICAgICAgIGxldCBlcnJvcnMgPSAwO1xuXG4gICAgICAgIHJlc2V0TXNnKGVsZW1lbnRzLm5hbWUucGFyZW50Tm9kZSk7XG4gICAgICAgIGlmICghZWxlbWVudHMubmFtZS52YWx1ZSkge1xuICAgICAgICAgIGVycm9ycysrO1xuICAgICAgICAgIHNob3dFcnJvcihlbGVtZW50cy5uYW1lLnBhcmVudE5vZGUsIFwi0JLRiyDQvdC1INCy0LLQtdC70Lgg0LjQvNGPXCIpO1xuICAgICAgICAgIGVsZW1lbnRzLm5hbWUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSk9PntcbiAgICAgICAgICAgIHJlc2V0TXNnKGVsZW1lbnRzLm5hbWUucGFyZW50Tm9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbWVudHMubmFtZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ2Zvcm1fX3NlY3Rpb25fcm93LWlucHV0c3VjY2VzcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzZXRNc2coZWxlbWVudHMuZW1haWwucGFyZW50Tm9kZSk7XG4gICAgICAgIGlmICghZWxlbWVudHMuZW1haWwudmFsdWUpIHtcbiAgICAgICAgICBlcnJvcnMrKztcbiAgICAgICAgICBzaG93RXJyb3IoZWxlbWVudHMuZW1haWwucGFyZW50Tm9kZSwgXCLQktGLINC90LUg0LLQstC10LvQuCBlbWFpbFwiKTtcbiAgICAgICAgICBlbGVtZW50cy5lbWFpbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKT0+e1xuICAgICAgICAgICAgcmVzZXRNc2coZWxlbWVudHMuZW1haWwucGFyZW50Tm9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXZhbGlkYXRlRW1haWwoZWxlbWVudHMuZW1haWwudmFsdWUpKSB7XG4gICAgICAgICAgICAgIGVycm9ycysrO1xuICAgICAgICAgICAgICBzaG93RXJyb3IoZWxlbWVudHMuZW1haWwucGFyZW50Tm9kZSwgXCLQndC10LrQvtGA0YDQtdC60YLQvdGL0LkgZW1haWxcIik7XG4gICAgICAgICAgICAgIGVsZW1lbnRzLmVtYWlsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpPT57XG4gICAgICAgICAgICAgICAgcmVzZXRNc2coZWxlbWVudHMuZW1haWwucGFyZW50Tm9kZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZWxlbWVudHMuZW1haWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdmb3JtX19zZWN0aW9uX3Jvdy1pbnB1dHN1Y2Nlc3MnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0TXNnKGVsZW1lbnRzLm1lc3NhZ2UucGFyZW50Tm9kZSk7XG4gICAgICAgIGlmICghZWxlbWVudHMubWVzc2FnZS52YWx1ZSkge1xuICAgICAgICAgIGVycm9ycysrO1xuICAgICAgICAgIHNob3dFcnJvcihlbGVtZW50cy5tZXNzYWdlLnBhcmVudE5vZGUsIFwi0JLRiyDQvdC1INCy0LLQtdC70Lgg0YHQvtC+0LHRidC10L3QuNC1P1wiKTtcbiAgICAgICAgICBlbGVtZW50cy5tZXNzYWdlLnBhcmVudE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSk9PntcbiAgICAgICAgICAgIHJlc2V0TXNnKGVsZW1lbnRzLm1lc3NhZ2UucGFyZW50Tm9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbWVudHMubWVzc2FnZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ2Zvcm1fX3NlY3Rpb25fcm93LWlucHV0c3VjY2VzcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFlcnJvcnMpIHtcbiAgICAgICAgICBzdWNjZXNzTXNnKGZvcm1Db250YWN0bWUucGFyZW50Tm9kZS5wYXJlbnROb2RlLCBcItCh0L/QsNGB0LjQsdC+IVxcbtCS0LDRiNC1INGB0L7QvtCx0YnQtdC90LjQtSDQvtGC0L/RgNCw0LLQu9C10L3Qvi5cIik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHJlc2V0Rm9ybSA9ICgpID0+IHtcbiAgICAgICAgbGV0IGVsZW1lbnRzID0gZm9ybUNvbnRhY3RtZS5lbGVtZW50cztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHJlc2V0TXNnKGVsZW1lbnRzW2ldLnBhcmVudE5vZGUpO1xuICAgICAgICAgIGVsZW1lbnRzW2ldLnZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbChlbWFpbCkge1xuICAgICAgICB2YXIgcmUgPSAvXigoW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKyhcXC5bXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKSopfChcIi4rXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31dKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkLztcbiAgICAgICAgcmV0dXJuIHJlLnRlc3QoZW1haWwpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbml0TG9naW46ICgpID0+IHtcbiAgICAgICAgICB2YXIgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX2J1dHRvbl9zdWJtaXQnKTtcbiAgICAgICAgICBpZiAoYnRuID09IG51bGwpIHJldHVybjtcbiAgICAgICAgICBmb3JtTG9naW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9sb2dpbicpO1xuICAgICAgICAgIGlmIChmb3JtTG9naW4gPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHZhbGlkYXRlTG9naW4pO1xuICAgICAgICB9LFxuICAgICAgICBpbml0Q29udGFjdG1lOiAoKSA9PiB7XG4gICAgICAgICAgdmFyIGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19idXR0b25fc3VibWl0Jyk7XG4gICAgICAgICAgaWYgKGJ0biA9PSBudWxsKSByZXR1cm47XG4gICAgICAgICAgZm9ybUNvbnRhY3RtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX2NvbnRhY3RtZScpO1xuICAgICAgICAgIGlmIChmb3JtQ29udGFjdG1lID09IG51bGwpIHJldHVybjtcbiAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB2YWxpZGF0ZUNvbnRhY3RtZSk7XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX2J1dHRvbl9yZXNldCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVzZXRGb3JtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pKCk7XG5cbiAgICBpbml0TWFwKCk7XG4gICAgbW91c2VQYXJhbGxheC5pbml0KCk7XG4gICAgc2Nyb2xsUGFyYWxsYXguaW5pdCgpO1xuICAgIGdhbGxlcnkuaW5pdCgpO1xuICAgIGZsaXAuaW5pdCgpO1xuIFxuICAgIGJsdXIuc2V0KCk7XG4gICAgYmxvZ1RvQy5pbml0KCk7XG4gICAgYmxvZ1N3aXBlTWVudS5pbml0KCk7XG4gICAgZm9ybXNWYWxpZGF0aW9uLmluaXRMb2dpbigpO1xuICAgIGZvcm1zVmFsaWRhdGlvbi5pbml0Q29udGFjdG1lKCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKGUpID0+e1xuICAgICAgYmx1ci5zZXQoKTtcbiAgICAgIGZsaXAuaW5pdCgpO1xuICAgICAgYmxvZ1RvQy5pbml0KCk7XG4gICAgICBibG9nU3dpcGVNZW51LmluaXQoKTtcbiAgICB9KTtcbiAgfVxuICAgIHZhciBwcmVsb2FkZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcHJlbG9hZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucHJlbG9hZCcpO1xuICAgICAgdmFyIHByZWxvYWRlciA9IG51bGw7XG4gICAgICB2YXIgcGVyY2VudFRleHQgPSBudWxsO1xuICAgICAgdmFyIHRvdGFsTG9hZGVkID0gMDtcbiAgICAgIHZhciB0b3RhbCA9IDA7XG5cbiAgICAgIHZhciBpbmNMb2FkZWQgPSAoKSA9PiB7XG4gICAgICAgIHRvdGFsTG9hZGVkKys7XG4gICAgIFxuICAgICAgICBpZiAodG90YWxMb2FkZWQgPT09ICh0b3RhbCkpIHtcbiAgICAgICAgICBkZXN0cm95UHJlbG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBlcmNlbnRUZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICBwZXJjZW50VGV4dC5pbm5lckhUTUwgPSBNYXRoLnJvdW5kKDEwMCp0b3RhbExvYWRlZC90b3RhbCkrXCIlXCI7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKE1hdGgucm91bmQoMTAwKnRvdGFsTG9hZGVkL3RvdGFsKStcIiVcIilcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgY3JlYXRlUHJlbG9hZGVyID0gKCkgPT4ge1xuICAgICAgICBwcmVsb2FkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgcHJlbG9hZGVyLmNsYXNzTmFtZSA9ICdwcmVsb2FkZXInO1xuXG4gICAgICAgIGxldCBzcGlubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNwaW5uZXIuY2xhc3NOYW1lID0gJ3ByZWxvYWRlcl9fc3Bpbm5lcic7XG4gICAgICAgIHByZWxvYWRlci5hcHBlbmRDaGlsZChzcGlubmVyKTtcblxuICAgICAgICBsZXQgYW5pbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBhbmltLmNsYXNzTmFtZSA9ICdwcmVsb2FkZXJfX2FuaW1hdGlvbic7XG4gICAgICAgIHNwaW5uZXIuYXBwZW5kQ2hpbGQoYW5pbSk7XG5cbiAgICAgICAgcGVyY2VudFRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgcGVyY2VudFRleHQuY2xhc3NOYW1lID0gJ3ByZWxvYWRlcl9fcGVyY2VudHMnO1xuICAgICAgICBzcGlubmVyLmFwcGVuZENoaWxkKHBlcmNlbnRUZXh0KTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHByZWxvYWRlcik7XG4gICAgICB9XG5cbiAgICAgIHZhciBkZXN0cm95UHJlbG9hZGVyID0gKCkgPT4ge1xuICAgICAgICBsZXQgYWxsUHJlbG9hZGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcmVsb2FkZXInKTtcbiAgICAgICAgaWYgKGFsbFByZWxvYWRlcnMgPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBhbGxQcmVsb2FkZXJzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBpdGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaXRlbSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbml0IDogKCkgPT4ge1xuICAgICAgICAgIGlmIChwcmVsb2Fkcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKHByZWxvYWRzKTtcbiAgICAgICAgICB0b3RhbCA9IHByZWxvYWRzLmxlbmd0aDtcbiAgICAgICAgICBjcmVhdGVQcmVsb2FkZXIoKTtcbiAgICAgICAgICBwZXJjZW50VGV4dC5pbm5lckhUTUwgPSBcIjAlXCI7XG4gICAgICAgICAgdG90YWxMb2FkZWQgPSAwO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3RhbDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgaW5jTG9hZGVkKCk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW1nLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgaW5jTG9hZGVkKCk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZCBlcnJvclwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIFxuICAgICAgICAgICAgICBzdHlsZSA9IHByZWxvYWRzW2ldLmN1cnJlbnRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShwcmVsb2Fkc1tpXSwgZmFsc2UpLFxuICAgICAgICAgICAgICBzcmMgPSBzdHlsZS5iYWNrZ3JvdW5kSW1hZ2Uuc2xpY2UoNCwgLTEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzcmMgPSBzcmMucmVwbGFjZSgvKCd8XCIpL2csJycpO1xuICAgICAgICAgICAgaW1nLnNyYyA9IHNyYztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0oKSk7XG5cbiAgICB2YXIgYXJyb3dMaW5rc0luaXQgPSAoZnVuY3Rpb24gKCl7XG4gICAgICB2YXIgc2Nyb2xsV2luZG93RG93biA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGV0IG9mZnNldEhlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0IC0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICBpZiAob2Zmc2V0SGVpZ2h0ID4gMCkge1xuICAgICAgICAgIHNjcm9sbFRvKGRvY3VtZW50LmJvZHksIG9mZnNldEhlaWdodCwgNTAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHNjcm9sbFdpbmRvd1VwID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzY3JvbGxUbyhkb2N1bWVudC5ib2R5LCAwLCA1MDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdDooKSA9PiB7XG4gICAgICAgICAgbGV0IGFycm93VXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXJyb3dfX3VwJyk7XG4gICAgICAgICAgbGV0IGFycm93RG93biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hcnJvd19fZG93bicpO1xuICAgICAgICAgIGlmIChhcnJvd1VwICE9IG51bGwpIHtcbiAgICAgICAgICAgIGFycm93VXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzY3JvbGxXaW5kb3dVcCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhcnJvd0Rvd24gIT0gbnVsbCkge1xuICAgICAgICAgICAgYXJyb3dEb3duLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2Nyb2xsV2luZG93RG93bik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkoKTtcblxuICAgICB2YXIgZmxpcCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZmxpcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mbGlwcGVyJyk7XG5cbiAgICAgIHZhciBzZXRGbGlwcGVyRGltZW50aW9ucyA9ICgpID0+IHtcbiAgICAgICAgdmFyIFxuICAgICAgICAgIGZyb250ID0gZ2V0Q29tcHV0ZWRTdHlsZShmbGlwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5mbGlwcGVyX19zaWRlJykuZmlyc3RFbGVtZW50Q2hpbGQpLFxuICAgICAgICAgIGJhY2sgPSBnZXRDb21wdXRlZFN0eWxlKGZsaXBwZXIucXVlcnlTZWxlY3RvcignLmZsaXBwZXJfX3NpZGUnKS5sYXN0RWxlbWVudENoaWxkKTtcblxuICAgICAgICAgIGZsaXBwZXIuc3R5bGUud2lkdGggPSBNYXRoLm1heChwYXJzZUludChmcm9udC53aWR0aCwgMTApLCBwYXJzZUludChiYWNrLndpZHRoLCAxMCkpICsgJ3B4JztcbiAgICAgICAgICBjb25zb2xlLmxvZyggTWF0aC5tYXgocGFyc2VJbnQoZnJvbnQud2lkdGgsIDEwKSwgcGFyc2VJbnQoYmFjay53aWR0aCwgMTApKSArIFwiIFwiKyBNYXRoLm1heChwYXJzZUludChmcm9udC5oZWlnaHQsIDEwKSwgcGFyc2VJbnQoYmFjay5oZWlnaHQsIDEwKSkpO1xuICAgICAgICAgIGZsaXBwZXIuc3R5bGUuaGVpZ2h0ID0gTWF0aC5tYXgocGFyc2VJbnQoZnJvbnQuaGVpZ2h0LCAxMCksIHBhcnNlSW50KGJhY2suaGVpZ2h0LCAxMCkpKyAncHgnO1xuICAgICAgfTtcbiAgICAgIHZhciBkb0ZsaXAgPSAoKSA9PiB7XG4gICAgICAgIGZsaXBwZXIuY2xhc3NMaXN0LnRvZ2dsZSgnZmxpcHBlcl9mbGlwJyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGluaXQ6ICgpID0+IHtcbiAgICAgICAgICBpZiAoZmxpcHBlciAhPSBudWxsKSB7XG4gICAgICAgICAgICBzZXRGbGlwcGVyRGltZW50aW9ucygpO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ1dHRvbl9fbGlua19mbGlwcGVyJykub25jbGljayA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgZG9GbGlwKCk7XG4gICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnYnV0dG9uX19saW5rX2FjdGl2ZScpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19idXR0b25fZmxpcCcpLm9uY2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIGRvRmxpcCgpO1xuICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnV0dG9uX19saW5rX2ZsaXBwZXInKS5jbGFzc0xpc3QudG9nZ2xlKCdidXR0b25fX2xpbmtfYWN0aXZlJyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pKCk7XG5cbiAgICBwcmVsb2FkZXIuaW5pdCgpO1xuICAgIGFycm93TGlua3NJbml0LmluaXQoKTtcbiAgICBmbGlwLmluaXQoKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgcmVhZHkpO1xuICB9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIERPTVJlYWR5KTsgIFxufSkoKTtcblxuZnVuY3Rpb24gc2Nyb2xsVG8gKGVsZW1lbnQsIHRvLCBkdXJhdGlvbikge1xuICBpZiAoZHVyYXRpb24gPD0gMCkgcmV0dXJuO1xuICBsZXQgZGlmZiA9IHRvIC0gZWxlbWVudC5zY3JvbGxUb3A7XG4gIGxldCB0aWNrID0gZGlmZiAvIGR1cmF0aW9uICogMTA7XG5cbiAgc2V0VGltZW91dCgoKT0+e1xuICAgIGVsZW1lbnQuc2Nyb2xsVG9wID0gZWxlbWVudC5zY3JvbGxUb3AgKyB0aWNrO1xuICAgIGlmIChlbGVtZW50LnNjcm9sbFRvcCA9PT0gdG8pIHJldHVybjtcbiAgICBzY3JvbGxUbyhlbGVtZW50LCB0bywgZHVyYXRpb24gLSAxMCk7XG4gIH0sIDEwKTtcbn1cblxuZnVuY3Rpb24gaW5pdE1hcCgpIHtcbiAgICAgICAgdmFyIGJlbGdvcm9kID0ge2xhdDogNTAuNTk0NjA1NjUyMDQ0NzgsIGxuZzogMzYuNTk5MjcwNjEwNTg5NjU2fTtcbiAgICAgICAgdmFyIG1hcmtlciA9IHtsYXQ6IDUwLjYsIGxuZzogMzYuNTk5Mn07XG4gICAgICAgIHZhciBtYXBPcHRpb25zID0gXG4gIFtcbiAgICB7XG4gICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImNvbG9yXCI6IFwiI2ViZTNjZFwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJjb2xvclwiOiBcIiMzNzNlNDJcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuc3Ryb2tlXCIsXG4gICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJjb2xvclwiOiBcIiNmNWYxZTZcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIixcbiAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeS5zdHJva2VcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImNvbG9yXCI6IFwiI2M5YjJhNlwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZS5sYW5kX3BhcmNlbFwiLFxuICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5LnN0cm9rZVwiLFxuICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiY29sb3JcIjogXCIjZGNkMmJlXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlLmxhbmRfcGFyY2VsXCIsXG4gICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiY29sb3JcIjogXCIjYWU5ZTkwXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImxhbmRzY2FwZVwiLFxuICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiY29sb3JcIjogXCIjZWZmMGVhXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImxhbmRzY2FwZS5tYW5fbWFkZVwiLFxuICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5LmZpbGxcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImNvbG9yXCI6IFwiI2VmZWVlOVwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJsYW5kc2NhcGUubmF0dXJhbFwiLFxuICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJjb2xvclwiOiBcIiNkZmQyYWVcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwibGFuZHNjYXBlLm5hdHVyYWxcIixcbiAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeS5maWxsXCIsXG4gICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJjb2xvclwiOiBcIiNlZmVlZTlcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pXCIsXG4gICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2lcIixcbiAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiY29sb3JcIjogXCIjZGZkMmFlXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaVwiLFxuICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImNvbG9yXCI6IFwiIzM3M2U0MlwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2kuYXR0cmFjdGlvblwiLFxuICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2kuYnVzaW5lc3NcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLmdvdmVybm1lbnRcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLm1lZGljYWxcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLnBhcmtcIixcbiAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeS5maWxsXCIsXG4gICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJjb2xvclwiOiBcIiM0Nzk2ODZcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLnBhcmtcIixcbiAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJjb2xvclwiOiBcIiM0NDc1MzBcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLnBsYWNlX29mX3dvcnNoaXBcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLnNjaG9vbFwiLFxuICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2kuc3BvcnRzX2NvbXBsZXhcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZFwiLFxuICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJjb2xvclwiOiBcIiM0NTVhNjRcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5hcnRlcmlhbFwiLFxuICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJjb2xvclwiOiBcIiNmZGZjZjhcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5hcnRlcmlhbFwiLFxuICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5LmZpbGxcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImNvbG9yXCI6IFwiI2Q2ZDZkNlwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmhpZ2h3YXlcIixcbiAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiY29sb3JcIjogXCIjZjhjOTY3XCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheVwiLFxuICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5LmZpbGxcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImNvbG9yXCI6IFwiIzAwOTY4OFwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmhpZ2h3YXlcIixcbiAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeS5zdHJva2VcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImNvbG9yXCI6IFwiI2U5YmM2MlwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmhpZ2h3YXkuY29udHJvbGxlZF9hY2Nlc3NcIixcbiAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiY29sb3JcIjogXCIjZTk4ZDU4XCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheS5jb250cm9sbGVkX2FjY2Vzc1wiLFxuICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5LmZpbGxcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImNvbG9yXCI6IFwiIzAwOTY4OFwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmhpZ2h3YXkuY29udHJvbGxlZF9hY2Nlc3NcIixcbiAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeS5zdHJva2VcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImNvbG9yXCI6IFwiI2RiODU1NVwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmxvY2FsXCIsXG4gICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnkuZmlsbFwiLFxuICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiY29sb3JcIjogXCIjZDVkNmQ3XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibGlnaHRuZXNzXCI6IDVcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQubG9jYWxcIixcbiAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJjb2xvclwiOiBcIiMzNzNlNDJcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwidHJhbnNpdC5saW5lXCIsXG4gICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImNvbG9yXCI6IFwiI2RmZDJhZVwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ0cmFuc2l0LmxpbmVcIixcbiAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJjb2xvclwiOiBcIiM4ZjdkNzdcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwidHJhbnNpdC5saW5lXCIsXG4gICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuc3Ryb2tlXCIsXG4gICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJjb2xvclwiOiBcIiNlYmUzY2RcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImZlYXR1cmVUeXBlXCI6IFwidHJhbnNpdC5zdGF0aW9uXCIsXG4gICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImNvbG9yXCI6IFwiI2RmZDJhZVwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ3YXRlclwiLFxuICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5LmZpbGxcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImNvbG9yXCI6IFwiIzAwYmZhNVwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ3YXRlclwiLFxuICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImNvbG9yXCI6IFwiI2ZmZmZmZlwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cbiAgaWYgKChnb29nbGUhPSBudWxsKSAmJiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdvb2dsZW1hcCcpIT1udWxsKSkge1xuICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nb29nbGVtYXAnKSwge1xuICAgICAgY2VudGVyOiBiZWxnb3JvZCxcbiAgICAgIHpvb206IDE1LFxuICAgICAgc3R5bGVzOiBtYXBPcHRpb25zLFxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgc2NhbGVDb250cm9sOiBmYWxzZSxcbiAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZSxcbiAgICAgIHJvdGF0ZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgZnVsbHNjcmVlbkNvbnRyb2w6IGZhbHNlLFxuICAgICAgZ2VzdHVyZUhhbmRsaW5nOiAnYXV0bycsXG4gICAgICB6b29tQ29udHJvbDogdHJ1ZSxcbiAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICAgIGRyYWdnYWJsZSA6IHRydWUsXG4gICAgICBjbGlja2FibGVJY29uczogZmFsc2UsXG4gICAgfSk7XG4gICAgdmFyIGltYWdlID0gJy9hc3NldHMvaW1nL21hcC1tYXJrZXIucG5nJztcbiAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICBwb3NpdGlvbjogbWFya2VyLFxuICAgICAgbWFwOiBtYXAsXG4gICAgICBpY29uOiBpbWFnZVxuICAgIH0pO1xuICAgIH1cbn0iXX0=
