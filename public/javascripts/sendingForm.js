const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function validateEmail(email) {
    return emailRegex.test(String(email).toLowerCase());
}

$(document).ready(function () {

    const nameElement = document.getElementById('name');
    const emailElement = document.getElementById('email');
    const commentElement = document.getElementById('comment');
    const buttonElement = document.getElementById('create_request_button');
    changeBtnStatus(buttonElement, false);
    nameElement.addEventListener('change', validateForm);
    emailElement.addEventListener('change', validateForm);
    buttonElement.addEventListener('click', validateForm);

    function validateForm() {
        const formValues = {
            name: nameElement.value,
            email: emailElement.value,
            comment: commentElement.value,
        };

        if (formValues.name.length < 1) {
            // alert('Name and surname cannot be empty !');
            nameElement.style.borderColor = 'red';
            changeBtnStatus(buttonElement, false);
            return;
        } else {
            nameElement.style.borderColor = '';
        }
        if (!validateEmail(formValues.email)) {
            // alert('Email has invalid structure !');
            emailElement.style.borderColor = 'red';
            changeBtnStatus(buttonElement, false);
            return;
        } else {
            emailElement.style.borderColor = '';
        }
        changeBtnStatus(buttonElement, true);
    }


    function changeBtnStatus(btn, status) {
        if (status)
            btn.removeAttribute("disabled");
        else
            btn.setAttribute("disabled", !status + "");
    }
});