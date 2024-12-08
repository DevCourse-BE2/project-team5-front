let API_SERVER_DOMAIN = "http://localhost:8080/api"

document.addEventListener("DOMContentLoaded", function() {

     // 쿠키에서 accessToken을 가져오는 함수
     function getCookie(name) {
        let value = `; ${document.cookie}`;
        let parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    // accessToken 가져오기
    const accessToken = getCookie("accessToken");

    // 사용자 정보 가져오기
    let memberId;
    fetch(`${API_SERVER_DOMAIN}/auth/profile`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        // console.log(data.data.email);
        // console.log(data.data.address);
        // console.log(data.data.zipcode);

        document.getElementById("email").value = data.data.email;
        document.getElementById("address").value = data.data.address;
        document.getElementById("zipcode").value = data.data.zipcode;
        memberId = data.data.id;
    })
    .catch((error) => {
        console.error("Error fetching user data:", error);
    });

    //아이템 조회 및 추가하기
    //아이템 조회
    const coffeeList = document.getElementById("coffeeList");
    fetch(`${API_SERVER_DOMAIN}/products`, {
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
        console.log(data.data.length)

        //아이템 추가

        for(let i = 0; i<data.data.length; i++){
            const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "mt-3");
        //li.setAttribute("id", `product_${data.data[i].productId}`);

        li.innerHTML = `
            <div class="col-2"><img class="img-fluid" src="./img/${data.data[i].image}" alt=""></div>
            <div class="col">
                <div class="row" id=product_${data.data[i].productId}>${data.data[i].name}</div>
                <div class="row text-muted">${data.data[i].description}</div>
            </div>
            <div class="col text-center price">${data.data[i].price}</div>
            <div class="col text-end action">
                <a class="btn btn-small btn-outline-dark" id="addcart_btn_${data.data[i].productId}" href="#">추가</a>
            </div>
        `;

        coffeeList.appendChild(li);

        document
            .getElementById(`product_${data.data[i].productId}`)
            .addEventListener("click", function (event) {
                event.preventDefault(); // 기본 동작 방지
                //alert(`${data.data[i].productId}클릭`)
                window.location.href= `./product.html?productId=${data.data[i].productId}`;
            });

        document
            .getElementById(`addcart_btn_${data.data[i].productId}`)
            .addEventListener("click", function (event) {
                event.preventDefault(); // 기본 동작 방지
                //alert(`Product ${data.data[i].productId}가 장바구니에 추가되었습니다!`);
                const productId = data.data[i].productId;
                //새로 추가
                fetch(`${API_SERVER_DOMAIN}/cart/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken
                    },
                    body: JSON.stringify({
                        productId: parseInt(productId),
                        quantity: 1
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        console.log(response)
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    console.log("장바구니 추가완료");
                    // API 호출이 성공한 후에만 새로고침
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);

                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });

                //장바구니 조회 후 기존 수량 변경
                fetch(`${API_SERVER_DOMAIN}/cart`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    for(let i = 0; i<data.data.cartViewResponseDTOS.length; i++){
                        if (data.data.cartViewResponseDTOS[i].productId == productId) {
                            const quantity = parseInt(data.data.cartViewResponseDTOS[i].quantity, 10);

                            fetch(`${API_SERVER_DOMAIN}/cart`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + accessToken
                                },
                                body: JSON.stringify({
                                    productId: parseInt(productId),
                                    quantity: quantity+1
                                })
                            })
                            .then(response => {
                                if (!response.ok) {
                                    console.log(response)
                                    throw new Error('Network response was not ok');
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log(data);
                                console.log("장바구니 추가완료");
                                // API 호출이 성공한 후에만 새로고침
                                setTimeout(() => {
                                    window.location.reload();
                                }, 100);

                            })
                            .catch((error) => {
                                console.error("Error fetching user data:", error);
                            });

                        }
                    }

                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
            });
        }

    })
    .catch((error) => {
        console.error("Error fetching user data:", error);
    });


    //장바구니 생성
    fetch(`${API_SERVER_DOMAIN}/cart`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch((error) => {
        console.error("Error fetching user data:", error);
    });

    //장바구니 조회
    let cartResponse;
    let totalQuantity;
    let totalPrice;
    fetch(`${API_SERVER_DOMAIN}/cart`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        cartResponse = data.data.cartViewResponseDTOS;
        totalQuantity = data.data.totalQuantity;
        totalPrice = data.data.totalPrice;


        //장바구니 추가
        const coffeeList = document.getElementById("cartList");

        for(let i = 0; i<data.data.cartViewResponseDTOS.length; i++){
            const row = document.createElement("div");
            row.classList.add("row");
            let num = data.data.cartViewResponseDTOS[i].quantity;


            //상품 이름 검색
            fetch(`${API_SERVER_DOMAIN}/products/${data.data.cartViewResponseDTOS[i].productId}`, {
                method: 'GET'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.data.name);

                //<div> 내용 생성
                row.innerHTML = `
                    <h6 class="p-0">${data.data.name} <span class="badge bg-dark">${num}개</span><button class="delete_cart" id="delete_cart_${data.data.productId}">삭제</button></h6>
                `;

                coffeeList.appendChild(row);


                document
                .getElementById(`delete_cart_${data.data.productId}`)
                .addEventListener("click", function (event) {
                    event.preventDefault(); // 기본 동작 방지
                    //alert(` ${data.data.productId} 삭제 요청`);
                    fetch(`${API_SERVER_DOMAIN}/cart?productId=${data.data.productId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);

                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
        
                        
                    })
                    .catch((error) => {
                        console.error("Error fetching user data:", error);
                    });
                });

            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });

            

        }
    })
    .catch((error) => {
        console.error("Error fetching user data:", error);
    });


    //주문하기(=결제)
    // 버튼 요소를 선택
    const orderButton = document.querySelector(".btn.btn-dark.col-12");

    // 클릭 이벤트 리스너 추가
    orderButton.addEventListener("click", function () {
        // 버튼 클릭 시 동작 정의
        alert(`주문이 접수되었습니다.`);
        console.log(cartResponse);

        // 필요한 데이터만 추출하여 bodyData 생성
        const cartItems = cartResponse.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }));


        const orderForm = document.getElementById("order_form");
        const formData = new FormData(orderForm);

        const bodyData = {
            address: formData.get("address"), 
            zipcode: formData.get("zipcode"),
            totalQuantity: totalQuantity,
            totalPrice: totalPrice,
            orderLists: cartItems
        };

        console.log(bodyData);

        fetch(`${API_SERVER_DOMAIN}/orders`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData)
        })
        .then(response => {
            if (!response.ok) {
                console.log(response)
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });

        

    
    });

});

