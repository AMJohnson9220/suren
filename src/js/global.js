class ToggleEvent {
  constructor() {
    this.toggle = document.querySelectorAll('.toggle');
    this.init();
  }

  init() {
    this.toggle.forEach(t => {
      t.addEventListener('click', () => {
        const dataToggle = t.getAttribute('data-toggle');
        const targetElement = document.querySelector(`.${dataToggle}`);
        
        this.toggle.forEach(element => {
          if (element !== t) {
            element.classList.remove('active');
            const otherDataToggle = element.getAttribute('data-toggle');
            const otherTargetElement = document.querySelector(`.${otherDataToggle}`);
            otherTargetElement && (otherTargetElement.style.maxHeight = null);
          }
        });
        
        t.classList.toggle('active');
        targetElement && (targetElement.style.maxHeight = t.classList.contains('active') ? targetElement.scrollHeight + 'px' : null);
      });
    });
  }
}

const toggle = new ToggleEvent();

class ProductFilter {
  constructor() {
    this.filterBtn = document.querySelectorAll(".filterbtn")

    if (this.filterBtn) {
      this.filterBtn.forEach((item) => {
        item.addEventListener("click", (event) => {
          return this.toggleFilter(event)
        })
      })
    }
  }

  toggleFilter(event) {
    event.target.classList.toggle("active")
    event.target.nextElementSibling.classList.toggle("open")

    return this.scrollToggle()
  }

  scrollToggle() {
    let filterActive = document.querySelectorAll(".filterbtn.active")

    if (filterActive) {
      let scrollCount = 0

      function scrollListener() {
        console.log(scrollCount)
        scrollCount++
        if (scrollCount > 10) {
          window.removeEventListener("scroll", scrollListener)
          document.querySelector(".filterbtn").classList.remove("active")
          document.querySelector(".filtercontents").classList.remove("open")
        }
      }

      window.addEventListener("scroll", scrollListener)
    }
  }
}

new ProductFilter()

// login switcher
class LoginToggle {
  constructor() {
    this.loginToggle = document.querySelectorAll("[data-account]");

    this.loginToggle.forEach(item => {
      item.addEventListener('click', event => {
        return this.toggle(event);
      });
    });
  }

  toggle(event) {
    Object.values(this.loginToggle).forEach(item => {
      item.classList.remove('active');
      document.getElementById(item.dataset.account).classList.remove('active');
    });

    event.target.classList.add('active');
    document.getElementById(event.target.dataset.account).classList.add('active');
  }
}

new LoginToggle();

class ToggleSwitchEvent {
  constructor() {
    this.toggle = document.querySelectorAll('.toggle--switch');
    this.init();
  }

  init() {
    this.toggle.forEach(t => {
      t.addEventListener('click', () => {
        const dataToggle = t.getAttribute('data-toggleSwitch');
        const targetElement = document.querySelector(`.${dataToggle}`);

        t.classList.toggle('active');

        if (!t.classList.contains('active') && targetElement) {
          targetElement.style.maxHeight = '0';
        } else if (targetElement) {
          targetElement.style.maxHeight = t.classList.contains('active') ? targetElement.scrollHeight + 'px' : null;
        }
      });
    });
  }
}

const toggleSwitch = new ToggleSwitchEvent();

// General Toggle
class GlobalToggle {
  constructor() {
    this.toggle = document.querySelectorAll('.toggler');
    this.init();
  }

  init() {
    this.toggle.forEach(t => {
      t.addEventListener('click', () => {
        const dataToggle = t.getAttribute('data-toggle');
        const targetElement = document.querySelector(`.${dataToggle}`);
        
        this.toggle.forEach(element => {
          if (element !== t) {
            element.classList.remove('active');
            const otherDataToggle = element.getAttribute('data-toggle');
            const otherTargetElement = document.querySelector(`.${otherDataToggle}`);
            otherTargetElement && (otherTargetElement.style.maxHeight = null);
          }
        });
        
        t.classList.toggle('active');
        targetElement && (targetElement.style.maxHeight = t.classList.contains('active') ? targetElement.scrollHeight + 'px' : null);
      });
    });
  }
}

const globalToggle = new GlobalToggle();