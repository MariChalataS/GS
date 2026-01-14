// Firebase კონფიგი – ჩაწერე შენი დეტალები!
const firebaseConfig = {
    apiKey: "AIzaSyBZvDAmJ-sFU_OWQ56LxWR-r3BjxOhPvP0",
    authDomain: "gs-golden.firebaseapp.com",
    projectId: "gs-golden",
    storageBucket: "gs-golden.appspot.com",
    messagingSenderId: "579151450148",
    appId: "1:579151450148:web:d65c2881116cc3df7fc8b1"
};

// Firebase Init
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// ⭐ ვარსკვლავების სისტემა ⭐
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

// ✉ ფორმის გაგზავნა ✉
document.getElementById("reviewForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const comment = document.getElementById("comment").value.trim();

    if (!selectedRating) {
        document.querySelector(".form-msg").textContent = "გთხოვთ შეარჩიოთ ვარსკვლავები ⭐";
        return;
    }

    try {
        // მომხმარებელი იქმნება დროებითი პაროლით
        const tempPass = Math.random().toString(36).slice(-8) + "!Aa";

        const user = await auth.createUserWithEmailAndPassword(email, tempPass);
        await user.user.sendEmailVerification();

        // მონაცემების შენახვა (მალე გამოჩნდება მხოლოდ ვერიფიკაციის შემდეგ)
        await db.collection("reviews").doc(user.user.uid).set({
            name,
            email,
            rating: selectedRating,
            comment,
            verified: false,
            date: new Date().toISOString()
        });

        document.querySelector(".form-msg").textContent = "გაგზავნილია! გთხოვთ შეამოწმოთ ელ-ფოსტა ვერიფიკაციისთვის.";
        document.getElementById("reviewForm").reset();
        stars.forEach(s => s.classList.remove("selected"));
        selectedRating = 0;

    } catch (err) {
        console.error(err);
        document.querySelector(".form-msg").textContent = err.message;
    }
});

// ✔ მხოლოდ ვერიფიცირებული შეფასებების ჩვენება
const reviewsList = document.getElementById("reviewsList");

db.collection("reviews")
    .where("verified", "==", true)
    .orderBy("date", "desc")
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
