class DrawerController {
  constructor() {
    this.drawers = document.querySelectorAll('.drawer');
    this.popup = document.querySelector('.popup');
    this.body = document.body;

    document.getElementById('overlay').addEventListener('click', this.closeActive.bind(this));
    document.querySelectorAll('.drawer-close').forEach(btn => {
      btn.addEventListener('click', this.closeActive.bind(this));
    });
  }

  toggleDrawer(targetId) {
    const cleanTargetId = targetId.replace('Drawer', '');
    const targetClass = `open-${cleanTargetId}`;

    if (this.body.classList.contains(targetClass)) {
      this.body.classList.remove(targetClass);
    } else {
      this.removeDrawerAndPopupClasses();
      this.body.classList.add(targetClass);

      if (cleanTargetId === 'cart') {
        const cart = new Cart();
        cart.loadDetails();
      }
    }

    this.toggleScroll();
  }

  togglePopup(item) {
    const popup = document.querySelector('#drawerPopup')

    if (this.body.classList.contains('open-popup')) {
      this.body.classList.remove('open-popup');
    } else {
      this.removeDrawerAndPopupClasses();
      this.body.classList.add('open-popup');
    }

    // Check if popup is a video popup
    if (item.target.dataset.video != undefined) {
      popup.innerHTML = (
        this.toggleVideo(item)
      )
    }

    this.toggleScroll();
  }

  toggleVideo(item) {
    let elem = `
      <div class="drawer-popup--video">
        <video width="100%" autoplay="true" poster="${item.target.dataset.poster}">
          <source src="${item.target.dataset.video}" type="video/mp4">
        </video>
      </div>`;
    return elem;
  }

  toggleScroll() {
    if (this.body.classList.contains('no-scroll')) {
      this.body.classList.remove('no-scroll');
    } else {
      this.body.classList.add('no-scroll');
    }
  }

  removeDrawerAndPopupClasses() {
    // Remove classes related to the drawers and the popup
    this.drawers.forEach(drawer => {
      const cleanId = drawer.id.replace('Drawer', '');
      this.body.classList.remove(`open-${cleanId}`);
    });
    this.body.classList.remove('open-popup');
    this.body.classList.remove('no-scroll');
  }

  closeActive() {
    this.removeDrawerAndPopupClasses();
    const popup = document.querySelector('#drawerPopup')
    popup.innerHTML = '';
  }
}

// Example usage:
const controller = new DrawerController();

document.querySelectorAll('.drawer-toggle').forEach(button => {
  button.addEventListener('click', (item) => {
    const targetId = button.dataset.drawerTarget;
    if (targetId !== 'popup') {
      controller.toggleDrawer(targetId);
    } else {
      controller.togglePopup(item);
    }
  });
});

class MobileMenu {
  constructor() {
    this.setEvents()
  }

  setEvents() {
    document.querySelectorAll('#menuDrawer .dropdown').forEach((item) => {
      item.addEventListener('click', (e) => {
        this.openChild(e)
      })
    })

    document.querySelectorAll('#menuDrawer .dropdown-menu-one').forEach((item) => {
      item.addEventListener('click', (e) => {
        this.closeChild(e)
      })
    })
  }

  openChild(item) {
    item.preventDefault()
    const nextSibling = item.target.nextElementSibling;
    if (nextSibling) {
      nextSibling.classList.add('open');
    }
  }

  closeChild(item) {
    item.target.parentElement.classList.remove('open')
  }

  static reset() {
    document.querySelectorAll('.site-nav-dropdown-one .dropdown-menu-one').forEach((item) => {

      item.classList.remove('open')
    })
  }
}

const mobMenu = new MobileMenu()