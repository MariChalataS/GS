// Firebase კონფიგი – ჩაანაცვლე შენი დეტალებით
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// ვარსკვლავების სისტემა
let selectedRating = 0;
const stars = document.querySelectorAll(".stars span");

stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = star.dataset.value;
        stars.forEach(s => s.classList.remove("selected"));
        star.classList.add("selected");
        let prev = star.previousElementSibling;
        while(prev) {
            prev.classList.add("selected");
            prev = prev.previousElementSibling;
        }
    });
});

// ფორმის გაგზავნა
document.getElementById("reviewForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const comment = document.getElementById("comment").value.trim();

    if(!selectedRating) {
        document.querySelector(".form-msg").textContent = "გთხოვთ შეარჩიოთ ვარსკვლავები";
        return;
    }

    try {
        const user = await auth.createUserWithEmailAndPassword(email, "temporaryPassword123!");
        await user.user.sendEmailVerification();

        // მონაცემები ფეირბეისში, მხოლოდ ვერიფიკაციის შემდეგ გამოჩნდება
        await db.collection("reviews").doc(user.user.uid).set({
            name,
            email,
            rating: selectedRating,
            comment,
            verified: false
        });

        document.querySelector(".form-msg").textContent = "თქვენ მიიღებთ ვერიფიკაციის ელ-ფოსტას!";
        document.getElementById("reviewForm").reset();
        stars.forEach(s => s.classList.remove("selected"));
        selectedRating = 0;

    } catch(err) {
        console.error(err);
        document.querySelector(".form-msg").textContent = err.message;
    }
});

// აქ შეგიძლია შექმნა ფუნქცია, რომელიც ფეირბეისში არსებული VERIFIED კომენტარებს აჩვენებს
const reviewsList = document.getElementById("reviewsList");
db.collection("reviews").where("verified", "==", true)
    .onSnapshot(snapshot => {
        reviewsList.innerHTML = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            reviewsList.innerHTML += `
                <div class="review-item">
                    <div class="name">${data.name}</div>
                    <div class="stars">${"&#9733;".repeat(data.rating)}</div>
                    <div class="comment">${data.comment}</div>
                </div>
            `;
        });
    });
