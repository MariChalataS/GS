// ჩართული ფორმის ელემენტები
const form = document.querySelector("form");
const nameInput = document.querySelector("input[name='name']");
const emailInput = document.querySelector("input[name='email']");
const messageInput = document.querySelector("textarea[name='message']");

// ფუნქცია ვალიდაციისთვის
form.addEventListener("submit", function(e){
    e.preventDefault(); // ფორმის სტანდარტული გაგზავნის შეჩერება

    let hasError = false;

    // სახელის ვალიდაცია
    if(nameInput.value.trim() === "") {
        setError(nameInput);
        hasError = true;
    } else {
        clearError(nameInput);
    }

    // იმეილის ვალიდაცია (უბრალოდ ცარიელის შემოწმება, თუ გინდა regex უფრო წინწადი)
    if(emailInput.value.trim() === "") {
        setError(emailInput);
        hasError = true;
    } else {
        clearError(emailInput);
    }

    // შეტყობინების ვალიდაცია
    if(messageInput.value.trim() === "") {
        setError(messageInput);
        hasError = true;
    } else {
        clearError(messageInput);
    }

    // თუ არ არის შეცდომა, ასუფთავებს და გამოჩნდება alert
    if(!hasError){
        alert("თქვენი შეტყობინება წარმატებით გაიგზავნა!");
        form.reset();
    }
});

// ფუნქცია ერორის დასამატებლად
function setError(element){
    element.parentElement.classList.add("error");
}

// ფუნქცია ერორის გასაშლელად
function clearError(element){
    element.parentElement.classList.remove("error");
}
