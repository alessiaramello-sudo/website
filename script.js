console.log("cart", JSON.parse(localStorage['cart'] || '[]'))

function addCartItems(carrello){
  let cartItems = document.querySelectorAll(".cart-items")[0];
  if(cartItems){
    console.log("cart", cartItems)
    carrello.forEach((item)=>{
      const cartItem = document.createTextNode(item.nome)
      cartItems.appendChild(cartItem)
      cartItems.appendChild(document.createElement('br'))
    })
  }
}
function updateCartBadge(items) {
  let badge = document.querySelectorAll(".cart-badge")[0]
  console.log("carrello", items,badge)
  badge.innerHTML = items || 0 
}
function addProductItem(){
fetch('data.json')
  .then(res => res.json())
  .then(prodotti => {
    const container = document.querySelectorAll('.product-grid')[0];
    console.log(container)
    prodotti.forEach(prodotto => {
      const item = document.createElement('div');
      item.classList.add("product-card");
      item.innerHTML = `
        <img src="${prodotto.image}" alt="${prodotto.name}">
        <h3>${prodotto.title}</h3>
        <p class="desc">${prodotto.desc}</p>
        <p class="price">€${prodotto.price}</p>
        <button class="add-to-cart" data-name="${prodotto.name}" data-price="${prodotto.price}"
            onClick="handleAddToCart()">Aggiungi al Carrello</button>
`;
      container.appendChild(item);
    });
  });
}
function handleAddToCart(element) {
      console.log(element)
      let nome = bottone.getAttribute("data-name");
      let prezzo = parseFloat(bottone.getAttribute("data-price"));

      carrello.push({ nome: nome, prezzo: prezzo });
      localStorage['cart'] = JSON.stringify(carrello)
      alert(`${nome} è stato aggiunto al carrello!`);
      updateCartBadge(carrello.length)
    }

// Ascolta i click sui bottoni "Aggiungi al carrello"
document.addEventListener("DOMContentLoaded", () => {
  let carrello = JSON.parse(localStorage['cart'] || '[]');
  addCartItems(carrello);
  updateCartBadge(carrello.length)
  addProductItem()
  let bottoni = document.querySelectorAll(".add-to-cart");
  bottoni.forEach(bottone => {
    bottone.addEventListener("click", );
  });
});

