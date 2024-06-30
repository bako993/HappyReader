//Smooth scrolling
$(document).ready(function() {
    // Smooth scrolling for anchor links
    $(".smooth-scroll").click(function(event) {
        event.preventDefault();
        const target = $(this).attr("href");
        $("html, body").animate({
            scrollTop: $(target).offset().top
        }, 800);
    });
});
//Loader
function loader(){
    document.querySelector('.loader-container').classList.add('active');
}
function fadeOut(){
    setTimeout(loader, 3000);
}
window.onload = () =>{
    fadeOut();
}
// fetch the books and display it inside the (swiper).
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:5000/books');
        if (!response.ok) {
            throw new Error('Failed to fetch books.');
        }
        const data = await response.json();
        populateBooks(data);
    } catch (error) {
        console.error(error);
    }
}
(async () => {
    await fetchBooks();
})();
function populateBooks(data) {
    const booksContainer = document.getElementById('booksContainer');

    // Loop through the data and create swiper slides
    data.forEach(book => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
                    <h3>${book.category}</h3>
                    <p>${book.book_name}</p>
                    <p>${book.author_name}</p>
                    <p>${book.price}$</p>
                `;
        booksContainer.appendChild(slide);
    });

    //Swipe books
    new Swiper(".books-slider", {
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 1500,
            disableOnInteraction: false,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}



