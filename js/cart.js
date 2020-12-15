let cartTable = document.querySelector('.table');
let tableBody = document.getElementsByTagName('tbody')[0];
let cartBtn = document.querySelector('.cart-btn');
let cartBody = document.querySelector('.cart-body');
let sumCart = document.querySelector('#c-list');

let cart = [];

class UI {
  displayItems(cart) {
    cart.forEach((item) => {
      let tr = document.createElement('tr');
      tr.innerHTML = `
             <td><img src="${item.image}" alt=""></td>

             <td>${item.title}</td>

             <td class="price">$${item.price}</td>

             <td id="amount">
             <i class="fas fa-arrow-up" data-id=${item.id}></i>
            <input class="form-control" type="text" value=${
              item.amount
            } disabled>
             <i class="fas fa-arrow-down" data-id=${item.id}></i>
             </td>

             <td class="price-total">$${
               item.total === undefined ? item.price : item.total
             }</td>

             <td>
             <i class="fas fa-times" data-id=${item.id}></i>
           </td>
            `;
      tableBody.appendChild(tr);
    });
  }

  cartFunc() {
    cartBody.addEventListener('click', (e) => {
      let btnId = e.target.dataset.id;
      let tempItem = cart.find((item) => item.id === +btnId);

      if (e.target.classList.contains('fa-arrow-up')) {
        tempItem.amount += 1;
        e.target.nextElementSibling.value = tempItem.amount;

        let singleTotal = (tempItem.amount * tempItem.price).toFixed(2);
        e.target.parentElement.nextElementSibling.textContent = `$${singleTotal}`;
        tempItem.total = singleTotal;

        Storage.saveCart(cart);
      } else if (e.target.classList.contains('fa-arrow-down')) {
        tempItem.amount -= 1;
        e.target.previousElementSibling.value = tempItem.amount;

        let singleTotal = (tempItem.amount * tempItem.price).toFixed(2);
        e.target.parentElement.nextElementSibling.textContent = `$${singleTotal}`;
        tempItem.total = singleTotal;

        Storage.saveCart(cart);
        if (tempItem.amount < 1) {
          this.removeItem(e.target, btnId);
        }
      } else if (e.target.classList.contains('fa-times')) {
        this.removeItem(e.target, btnId);
      }

      this.cartAmount();
    });
  }

  removeItem(target, btnId) {
    cart = cart.filter((item) => item.id !== +btnId);
    Storage.saveCart(cart);
    target.parentElement.parentElement.remove();
  }

  cartAmount() {
    let countAmount = 0;
    let total = 0;
    cart.map((item) => {
      countAmount += item.amount;
      total += item.price * item.amount;
    });
    sumCart.textContent = countAmount;
    document.querySelector('#total-price').textContent = `$${total.toFixed(2)}`;
  }
}

class Storage {
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
  }
}

document.addEventListener('DOMContentLoaded', function () {
  cart = Storage.getCart();

  let ui = new UI();

  ui.displayItems(cart);
  ui.cartFunc();
  ui.cartAmount();

  cartBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = 'cart.html';
  });
});
