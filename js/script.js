let myCard = document.querySelector('.my-card .container .row');
let sumCart = document.querySelector('#c-list');
let cartBtn = document.querySelector('.cart-btn');
let searchInput = document.querySelector('#search-input');

let content = document.querySelector('.content');
let roller = document.querySelector('.lds-roller');

let cart = [];
let loading = false;

class Products {
  async getData() {
    let res = await fetch('https://fakestoreapi.com/products');
    let store = await res.json();
    loading = true;
    return store;
  }
}

class UI {
  showData(data) {
    let result = '';

    if (loading) {
      roller.style.display = 'flex';
    } else {
      roller.style.display = 'none';
      content.style.display = 'block';
      data.map((dt) => {
        result += `
      <div class="my-singlecard col-lg-3 col-md-4 col-sm-6 d-flex align-items-stretch justify-content-center">
        <div class="card mt-4" style="width: 18rem;">
          <img src="${dt.image}" class="card-img-top p-4" alt="...">
          <div class="card-body">
            <a href='#' class="card-title" data-id=${dt.id}>${
          dt.title.split('').slice(0, 30).join('') + '...'
        }</a>
            <div class="price mb-3">
              $${dt.price}
            </div>
            <p class="card-text">${
              dt.description.split('').slice(0, 60).join('') + '...'
            }</p>
            <a href="#" class="btn btn-success add-btn" data-id=${
              dt.id
            }>Add to Cart</a>
          </div>
        </div>
      </div>
      `;
      });
    }
    myCard.innerHTML = result;
  }

  addToCart() {
    let buttons = [...document.querySelectorAll('.add-btn')];

    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === +id);
      if (inCart) {
        button.textContent = 'In Cart';
        button.setAttribute('class', 'btn btn-success add-btn disabled');
      } else {
        button.addEventListener('click', (e) => {
          e.preventDefault();

          e.target.textContent = 'In Cart';
          e.target.setAttribute('class', 'btn btn-success add-btn disabled');

          let cartItem = {
            ...Storage.getProduct(id),
            amount: 1,
          };
          cart = [...cart, cartItem];

          Storage.saveCart(cart);
          this.cartAmount();
        });
      }
    });
  }

  singleProduct() {
    let cardTitleBtn = [...document.querySelectorAll('.card-title')];
    cardTitleBtn.forEach((titleBtn) => {
      let id = titleBtn.dataset.id;
      titleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        let cartItem = { ...Storage.getProduct(id) };
        Storage.singleItem(cartItem);
        window.location.href = 'singleProduct.html';
      });
    });
  }

  cartAmount() {
    let countAmount = cart.reduce((x, y) => {
      return (x += y.amount);
    }, 0);
    sumCart.textContent = countAmount;
  }

  setupAPP() {
    cart = Storage.getCart();
    this.cartAmount();
  }

  searchItem() {
    searchInput.addEventListener('keyup', function (e) {
      let textValue = e.target.value.toLowerCase();

      let cardBody = document.querySelectorAll('.my-singlecard');

      cardBody.forEach((item) => {
        let cardTitle = item
          .querySelector('.card-title')
          .textContent.toLowerCase();

        cardTitle.includes(textValue)
          ? (item.style.cssText = 'display:flex !important')
          : (item.style.cssText = 'display:none !important');
      });
    });
  }
}

class Storage {
  static saveProduct(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find((product) => product.id === +id);
  }

  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
  }

  static singleItem(cartItem) {
    localStorage.setItem('singleProduct', JSON.stringify(cartItem));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let products = new Products();
  let ui = new UI();

  cartBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = 'cart.html';
  });

  ui.setupAPP();

  products
    .getData()
    .then((data) => {
      loading = false;
      ui.showData(data);
      Storage.saveProduct(data);
    })
    .then(() => {
      ui.addToCart();
      ui.singleProduct();
      ui.searchItem();
    });
});
