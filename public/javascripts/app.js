const scrape = document.getElementById('scrape');
const app = {};

const createArticle = props =>{
return `<article class="uk-article">
    <h1 class="uk-article-title">${props.title}</h1>
    <p class="uk-article-meta">${props.summary}</p>
    <span class="save uk-icon-button uk-button-secondary" uk-icon="heart" data-title="${props.title}" data-summary="${props.summary}" data-link="${props.link}"></span>
</article>`
}

const appendArticle = el =>{
    const articlesDiv = document.querySelector('#articlesContainer');
    articlesDiv.innerHTML += el;
}


const saveArticle = article =>{
    let url = '/articles';
    fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(article),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => UIkit.notification(response.msg));
}

if(scrape){
    scrape.addEventListener('click', (event)=>{
        let url = '/scraper';
        
        fetch(url, {
        method: 'GET', // or 'PUT'
        headers: new Headers({
            'Content-Type': 'application/json'
        })
        }).then(res => res.json())
        .then(articles => {
            articles
                .map(createArticle)
                .map(appendArticle)
            app.saveLinks = document.querySelectorAll('.save');
            Array.from(app.saveLinks).forEach(link => {
                link.addEventListener('click', function(event) {
                    const article = {};
                    article.title = this.getAttribute('data-title');
                    article.summary = this.getAttribute('data-summary');
                    article.link = this.getAttribute('data-link');
                    saveArticle(article);
                });
            });
        })
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
    });
}

const deleteArticle = id =>{
    console.log(id);
    let url = '/articles';
    fetch(url, {
        method: 'DELETE', // or 'PUT'
        body: JSON.stringify({id: id}),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => UIkit.notification(response.msg));
}

app.deleteLinks = document.querySelectorAll('.delete');
Array.from(app.deleteLinks).forEach(link => {
    link.addEventListener('click', function(event) {
        const id = this.getAttribute('data-id');
        deleteArticle(id);
    });
});


const saveNote = me =>{ 
    const id = me.getAttribute('data-id');
    const note = document.getElementById('note').value;
    let url = `articles/${id}`;
    fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify({body: note}),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then(res => res.json())
      .then(results => {
        console.log(results);
        return results;
      })
      .catch(error => console.error('Error:', error))
}

const deleteNote = me =>{ 
    const id = me.getAttribute('data-id');
    let url = `articles/${id}`;
    fetch(url, {
        method: 'DELETE', // or 'PUT'
        body: JSON.stringify({body: note}),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then(res => res.json())
      .then(results => {
        const myModal = document.getElementById("my-modal");
        myModal.parentNode.removeChild(myModal);

      })
      .catch(error => console.error('Error:', error))
}

const createModal = props => {
    return `<div id="my-modal" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <h2 class="uk-modal-title">${props.title}</h2>
        <h3>Notes</h3>
        <ul class="uk-list uk-list-striped">
        ${props.notes ? props.notes.map(note => `<li>${note.body} <button data-id="${note._id}" class="delete-note" uk-icon="close" onClick="deleteNote(this)"></button></li>`).join(' ') : "Note Note Saved"}
        </ul>
        <textarea id="note" class="uk-textarea" style='margin-bottom: 20px'></textarea>
        <button id="save-note" data-id="${props._id}" class="uk-modal-close uk-button uk-button-secondary" type="button" onClick="saveNote(this)">Save</button>
    </div>
</div>`;
}

const appendModal = el =>{
    const modalContainer = document.querySelector('#modalContainer');
    console.log(modalContainer);
    console.log(el);
    modalContainer.innerHTML = el;
}

const getArticle = id =>{
    console.log(id);
    const myModal = document.getElementById('my-modal');
    if(myModal){
        myModal.parentNode.removeChild(myModal);
    }
    let url = `/articles/${id}`;
    fetch(url, {
        method: 'GET', // or 'PUT'
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then(res => res.json())
      .then(results => {
        console.log(results);
        return results;
      })
      .catch(error => console.error('Error:', error))
      .then(createModal)
      .then(appendModal)
      .then(() => {
             UIkit.modal('#my-modal').show();
      });
}

app.commentLinks = document.querySelectorAll('.comment');
Array.from(app.commentLinks).forEach(link => {
    link.addEventListener('click', function(event) {
        console.log(this);
        const id = this.getAttribute('data-id');
        getArticle(id);
        // const element = document.getElementById('my-id');
        // UIkit.modal(element).show();
        // commentArticle(id);
    });
});