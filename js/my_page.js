let API_SERVER_DOMAIN = "http://localhost:8080/api"

document.getElementById("edit_profile_btn").addEventListener("click", function () {
    window.location.href = "./my_page_profile.html"; // 이동하려는 페이지 URL
});

document.getElementById("get_order_btn").addEventListener("click", function () {
    window.location.href = "./my_page_order.html"; // 이동하려는 페이지 URL
});




document.addEventListener("DOMContentLoaded", function() {

    // 쿠키에서 accessToken을 가져오는 함수
    function getCookie(name) {
       let value = `; ${document.cookie}`;
       let parts = value.split(`; ${name}=`);
       if (parts.length === 2) return parts.pop().split(";").shift();
   }

   // accessToken 가져오기
   const accessToken = getCookie("accessToken");

   //로그아웃
   document.getElementById("logout_btn").addEventListener("click", function () {
        fetch(`${API_SERVER_DOMAIN}/auth/logout`, {
            method: 'PUT',
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
            alert("로그아웃 완료");
            window.location.href = "./login.html";

        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
    });

   // 사용자 정보 가져오기
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

       document.getElementById("name1").value = data.data.name;
       document.getElementById("address1").value = data.data.address;
       document.getElementById("zipcode1").value = data.data.zipcode;
   })
   .catch((error) => {
       console.error("Error fetching user data:", error);
   });


   //주문조회
   console.log("주문조회");
   fetch(`${API_SERVER_DOMAIN}/orders/members`, {
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

       //주문조회 데이터 추가
       const orderList = document.getElementById("orderList");
       for(let i = 0; i<data.data.length; i++){
           const li = document.createElement("li");
           li.classList.add("list-group-item", "d-flex", "mt-3");

           if (!data.data[i].cancelled) {
                li.innerHTML = `
                <div>[${i + 1}] 주소: ${data.data[i].address}  |  우편번호: ${data.data[i].zipcode}<br>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;총 주문 수량: ${data.data[i].totalQuantity}</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;총 주문 가격: ${data.data[i].totalPrice}
                <button class=cancel_btn id=cancle_btn_${data.data[i].orderId}>주문취소</button>
                </div>
            `;
           } else {
                li.innerHTML = `
                    <div>[${i + 1}] 주소: ${data.data[i].address}  |  우편번호: ${data.data[i].zipcode}<br>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;총 주문 수량: ${data.data[i].totalQuantity}</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;총 주문 가격: ${data.data[i].totalPrice}
                    <button class=cancel_btn id=cancle_btn_${data.data[i].orderId}>주문취소 완료</button>
                    </div>
                `;
           }



           orderList.appendChild(li);

           document
            .getElementById(`cancle_btn_${data.data[i].orderId}`)
            .addEventListener("click", function (event) {
                event.preventDefault(); // 기본 동작 방지
                // alert(` ${data.data[i].orderId} 삭제 요청`);
                fetch(`${API_SERVER_DOMAIN}/orders/${data.data[i].orderId}`, {
                    method: 'PUT',
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    if(data.statusCode === 200) {
                        alert("주문 취소가 완료되었습니다.");
                    }
                    if(data.statusCode === 400) {
                        alert(data.message);
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




   //수정 버튼 누를 때 프로필 수정
   document.getElementById("modify_btn").addEventListener("click", function () {
        const profileForm = document.getElementById("profile_form");
        const formData = new FormData(profileForm);

        const profileData = {
            name: formData.get("name1"),
            address: formData.get("address1"),
            zipcode: formData.get("zipcode1"),
        };

        fetch(`${API_SERVER_DOMAIN}/auth`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify(profileData),
        })
            .then((response) => {
                if (!response.ok) {
                    console.error("Error during signup:", error);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error("Error during signup:", error);
            });
    });


    
});
