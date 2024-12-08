let API_SERVER_DOMAIN = "http://localhost:8080/api"

document.addEventListener("DOMContentLoaded", function() {

    //아이템 조회

    const url = new URL(window.location.href);
    const productId = url.searchParams.get("productId");

    console.log(productId); 

    fetch(`${API_SERVER_DOMAIN}/products/${productId}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);

        const imgElement = document.querySelector('img[alt="상품 이미지"]');
        imgElement.src = `./img/${data.data.image}`;

        const productNameElement = document.querySelector('.product-name');
        productNameElement.textContent = `상품명: ${data.data.name}`;

        const productInfoElement = document.querySelector('.product-description');
        productInfoElement.textContent = `상품 설명: ${data.data.description}`;

        const productPrice = document.querySelector('.product-price');
        productPrice.textContent = `가격: ${data.data.price}`;

        const productReviews = document.querySelector('.product-reviews');
        productReviews.textContent = `리뷰: (${data.data.reviews.length})개의 리뷰`;

        //리뷰 추가
        const reviewList = document.querySelector(".product-reviews");
        for(let i = 0; i<data.data.reviews.length; i++){
            const row = document.createElement("div");
            row.classList.add("product-reviews-detail");

            row.innerHTML = `
            <div class="review_detail">${data.data.reviews[i].content}</div>
            `;

            reviewList.appendChild(row);
        }


        

    })
    .catch((error) => {
        console.error("Error fetching user data:", error);
    });




});