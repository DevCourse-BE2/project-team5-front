document.addEventListener("DOMContentLoaded", function () {
    const API_SERVER_DOMAIN = "http://localhost:8080/api";

    document.getElementById("signup_btn").addEventListener("click", function (event) {
        event.preventDefault(); // 기본 폼 제출 방지

        const signupForm = document.getElementById("signup_form");
        const formData = new FormData(signupForm);

        const signupData = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            address: formData.get("address"),
            zipcode: formData.get("zipcode"),
        };

        fetch("http://localhost:8080/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signupData),
        })
            .then((response) => {
                if (!response.ok) {
                    console.error("Error during signup:", error);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.statusCode === 200 && data.data === "회원가입 완료") {
                    alert("회원가입이 완료되었습니다.");
                    window.location.replace("/login.html");
                } else {
                    throw new Error("Unexpected response format: " + JSON.stringify(data));
                }
            })
            .catch((error) => {
                console.error("Error during signup:", error);
                alert("회원가입에 실패했습니다. 다시 시도해주세요.");
            });
    });
});
