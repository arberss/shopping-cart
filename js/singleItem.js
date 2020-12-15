let singleProduct = document.querySelector('.single-products .container .row');
let cartBtn = document.querySelector('.cart-btn');
let sumCart = document.querySelector('#c-list');

// using constructor

class UI {
  constructor(singlePrd, cart) {
    this.singlePrd = singlePrd;
    this.cart = cart;
  }

  showSingleProduct() {
    let result = '';
    result = `
          <div class="col-lg-5 col-md-5 mr-5 mb-5">
          <div class="single-image mt-3">
              <img src="${this.singlePrd.image}" alt="">
          </div>
          
      </div>
      <div class="col-lg-5 col-md-5">
          <div class="single-info">
              <h1 class="info-title">${this.singlePrd.title}</h4>
              <hr>
              <span class="single-price font-weight-bold h4 ">$${this.singlePrd.price}</span>
              <hr>
              <div class="info-desc font-italic">${this.singlePrd.description}</div>

              <a href="#" class="btn btn-success add-btn mt-4 w-45" data-id=${this.singlePrd.id}>Add to Cart</a>
              <a href="#" class="btn btn-info home-btn mt-4 w-45">Back to Home</a>
          </div>
      </div>
          `;
    singleProduct.innerHTML = result;
  }

  addToCart() {
    let addBtn = document.querySelector('.add-btn');

    let findItem = this.cart.find(
      (item) => item.id === Storage.getSingleItem().id
    );
    if (findItem) {
      addBtn.textContent = 'In Cart';
      addBtn.setAttribute(
        'class',
        'btn btn-success add-btn mt-4 w-45 disabled'
      );
    } else {
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let id = e.target.dataset.id;

        addBtn.textContent = 'In Cart';
        addBtn.setAttribute(
          'class',
          'btn btn-success add-btn mt-4 w-45 disabled'
        );

        let cartItem = {
          ...Storage.getProduct(id),
          amount: 1,
        };
        this.cart = [...this.cart, cartItem];

        Storage.saveCart(this.cart);
        this.cartAmount();
      });
    }
  }

  cartAmount() {
    let countAmount = this.cart.reduce((x, y) => {
      return (x += y.amount);
    }, 0);
    sumCart.textContent = countAmount;
  }
}

class Storage {
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find((product) => product.id === +id);
  }

  static getCart() {
    return localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
  }

  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  static getSingleItem() {
    return localStorage.getItem('singleProduct')
      ? JSON.parse(localStorage.getItem('singleProduct'))
      : [];
  }
}

document.addEventListener('DOMContentLoaded', function (e) {
  this.singlePrd = Storage.getSingleItem();
  this.cart = Storage.getCart();

  let ui = new UI(this.singlePrd, this.cart);

  ui.showSingleProduct(ui.singlePrd);
  ui.addToCart();
  ui.cartAmount();

  let homeBtn = document.querySelector('.home-btn');
  homeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'index.html';
  });

  cartBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = 'cart.html';
  });
});
