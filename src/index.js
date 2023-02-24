const ul = document.getElementById("quote-list");
const form = document.getElementById("new-quote-form");
const submit = document.querySelector(".btn-primary");

document.addEventListener("DOMContentLoaded", () => {
  fetch(`http:localhost:3000/quotes?_embed=likes`)
    .then((resp) => resp.json())
    .then((data) => {
      function loadQuotes() {
        data.forEach((e) => {
          let li = document.createElement("li");
          let likeBtn = document.createElement("button");
          let delBtn = document.createElement("button");
          li.className = "quote-card";
          li.innerHTML = `
          <blockquote class="blockquote">
            <p class="mb-0">${e.quote}</p>
            <footer class="blockquote-footer">${e.author}</footer>
            <br>
          </blockquote>`
          likeBtn.innerHTML = "Likes: <span>0</span>";
          likeBtn.className = "btn-success";
          delBtn.textContent = "Delete";
          delBtn.className = "btn-danger";
          li.getElementsByTagName("blockquote")[0].appendChild(likeBtn)
          li.getElementsByTagName("blockquote")[0].appendChild(delBtn)

          fetch(`http://localhost:3000/likes?quoteId=${e.id}`)
          .then((resp) => resp.json())
          .then((data) => likeBtn.firstElementChild.textContent = data.length)

          likeBtn.addEventListener("click", () => {
            let likeQuote = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: JSON.stringify({
                quoteId: Number(e.id),
                createdAt: Number((Date.now()/1000).toFixed(0))
              })
            }
            fetch(`http://localhost:3000/likes`, likeQuote)
              .then((resp) => resp.json())
              .then(() => {
                fetch(`http://localhost:3000/likes?quoteId=${e.id}`)
                .then((resp) => resp.json())
                .then((data) => likeBtn.firstElementChild.textContent = data.length)
              })

          })
            
          delBtn.addEventListener("click", () => {
            let deleteQuote = {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              }
            }
            fetch(`http://localhost:3000/quotes/${e.id}`, deleteQuote)
              .then((resp) => resp.json())
              .then((dat) => {
                dat;
              })
              li.remove();
          })
          ul.appendChild(li);
        })
      }
      loadQuotes();
      submit.addEventListener("click", (e) => {
        e.preventDefault();
        let quoteInput = document.getElementById("new-quote");
        let authorInput = document.getElementById("author");
        let newQuote = {
          quote: quoteInput.value,
          author: authorInput.value
        }
        let newQuoteObj = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application.json"
          },
          body: JSON.stringify(newQuote)
        }
        fetch(`http://localhost:3000/quotes`, newQuoteObj)
          .then((resp) => resp.json())
          .then((data) => {
            ul.innerHTML = "";
            let li = document.createElement("li");
            let likeBtn = document.createElement("button");
            let delBtn = document.createElement("button");
            li.className = "quote-card";
            li.innerHTML = `
            <blockquote class="blockquote">
              <p class="mb-0">${data.quote}</p>
              <footer class="blockquote-footer">${data.author}</footer>
              <br>
            </blockquote>`
            likeBtn.innerHTML = "Likes: <span>0</span>";
            likeBtn.className = "btn-success";
            delBtn.textContent = "Delete";
            delBtn.className = "btn-danger";
            li.getElementsByTagName("blockquote")[0].appendChild(likeBtn);
            li.getElementsByTagName("blockquote")[0].appendChild(delBtn);
            
            fetch(`http://localhost:3000/likes?quoteId=${data.id}`)
            .then((resp) => resp.json())
            .then((data) => likeBtn.firstElementChild.textContent = data.length)

            likeBtn.addEventListener("click", () => {
              let likeQuote2 = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
                },
                body: JSON.stringify({
                  quoteId: Number(data.id),
                  createdAt: Number((Date.now()/1000).toFixed(0))
                })
              }
              fetch(`http://localhost:3000/likes`, likeQuote2)
                .then((resp) => resp.json())
                .then(() => {
                fetch(`http://localhost:3000/likes?quoteId=${data.id}`)
                .then((resp) => resp.json())
                .then((data) => likeBtn.firstElementChild.textContent = data.length)
                })
            })
            
            delBtn.addEventListener("click", () => {
              ul.innerHTML = "";
              let deleteQuote = {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
                }
              }
              fetch(`http://localhost:3000/quotes/${data.id}`, deleteQuote)
                .then((resp) => resp.json())
                .then((data) => {
                  data;
                })
                li.remove();
                loadQuotes();
            })
            ul.appendChild(li);
            loadQuotes();
            quoteInput.value = "";
            authorInput.value = "";
          })
      })
    })
})