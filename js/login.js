document.addEventListener("DOMContentLoaded", function () {
    let API_SERVER_DOMAIN = "http://localhost:8080/api";

    document.getElementById("login_form").addEventListener("submit", submitLoginForm);

    function submitLoginForm(event) {
        event.preventDefault();

        var email = document.getElementById("email_input").value;
        var password = document.getElementById("password_input").value;
        var error_msg = document.querySelector(".login_error");

        // 입력 시 에러 메시지 숨기기
        document.getElementById("email_input").addEventListener('input', function () {
            error_msg.style.opacity = '0';
        });
        document.getElementById("password_input").addEventListener('input', function () {
            error_msg.style.opacity = '0';
        });

        fetch(API_SERVER_DOMAIN + "/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Login failed");
            }
            return response.json();
        })
        .then((data) => {
            if (data.statusCode === 200) {
                const token = data.data.token; // JWT 토큰 추출
                const user = data.data.user; // 사용자 정보 추출

                // 토큰을 쿠키에 저장
                setCookie("accessToken", token, 1);

                // 사용자 데이터를 로컬 스토리지에 저장 (선택)
                localStorage.setItem("user", JSON.stringify(user));

                // 로그인 성공 시 리디렉션
                window.location.replace("index.html");
            } else {
                throw new Error(data.message || "Unexpected error");
            }
        })
        .catch((error) => {
            error_msg.style.opacity = "1"; // 에러 메시지 표시
            console.error("Error:", error);
        });
    }

});

function joinFunction() {
    window.location.href = 'join.html';
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}