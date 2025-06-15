const model = {
    notes: [],
    addNote(title, content, color) {
        const id = Math.random().toString();
        const newNote = {
            id,
            title,
            content,
            color,
            isFavorite: false
        };

        this.notes.push(newNote);
        this.updateNotesView();
        view.showSuccess('Заметка добавлена!');
    },


    toggleFavorite(id) {
        this.notes = this.notes.map(note =>
            note.id === id ? {...note, isFavorite: !note.isFavorite} : note
        );
        this.updateNotesView();
    },

    deleteNote(id) {
        this.notes = this.notes.filter(note => note.id !== id);
        this.updateNotesView();
    },
    isShowOnlyFavorite: false,
    toggleShowOnlyFavorite() {
        this.isShowOnlyFavorite = !this.isShowOnlyFavorite;
        this.updateNotesView();
    },

    updateNotesView() {
        const notesToRender = this.isShowOnlyFavorite
            ? this.notes.filter(note => note.isFavorite)
            : this.notes;

        view.renderNotes(notesToRender);
        view.updateNotesCount(this.notes.length);
    }
};

const view = {
    init() {
        const form = document.querySelector('.form');
        const notesList = document.querySelector('.list');
        const favoriteCheckbox = document.querySelector('.checkbox-label input');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = form.querySelector('.input-name').value;
            const content = form.querySelector('.input-description').value;
            const color = form.querySelector('input[name="color"]:checked').value;



            if (!title.trim() || !content.trim()) {
                this.showWarning('Заполните все поля!');
                return;
            }

            if (title.length >= 50) {
                this.showWarning('Максимальная длина заголовка - 50 символов');
                return;
            }

            if (content.length >= 200) {
                this.showWarning('Максимальная длина описания - 200 символов');
                return;
            }

            controller.addNote(title, content, color);
            form.reset();
        });


        favoriteCheckbox.addEventListener('change', () => {
            controller.toggleShowOnlyFavorite();
        });

        notesList.addEventListener('click', (e) => {
            const noteElement = e.target.closest('.notes');
            if (!noteElement) return;

            const id = noteElement.dataset.id;

            if (e.target.closest('.heart')) {
                controller.toggleFavorite(id);
            } else if (e.target.closest('.trash')) {
                controller.deleteNote(id);
            }
        });

        model.updateNotesView();
    },


    renderNotes(notes) {
        const notesList = document.querySelector('.list');


        if (notes.length === 0) {
            notesList.innerHTML = '<ul class="no-notes" ><li>У вас нет еще ни одной заметки</li>' +
                '<li>Заполните поля выше и создайте свою первую заметку!</li></ul>';
            return;
        }

        notesList.innerHTML = notes.map(note => `
        <li class="notes" data-id="${note.id}" >
        <div class="title" style="background-color:${note.color}">
          <h2>${note.title}</h2>
          <div>
            <img class="heart" src="assets/images/${note.isFavorite ? 'heart-active' : 'heart-inactive'}.png" alt="heart">
            <img class="trash" src="assets/images/trash.png" alt="trash">
          </div>
        </div>
        <p class="content">${note.content}</p>
        </li>`).join('')
    },

    updateNotesCount(count) {
        document.querySelector('.count span').textContent = count;
    },

    showSuccess(message) {
        document.querySelectorAll('.model-window li').forEach(el => {
            el.style.display = 'none';
        });

        const notification = document.querySelector('.model-window .info');
        const messageElement = notification.querySelector('p');

        messageElement.textContent = message;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    },

    showWarning(message) {
        document.querySelectorAll('.model-window li').forEach(el => {
            el.style.display = 'none';
        });

        const notification = document.querySelector('.model-window .info-model');
        const messageElement = notification.querySelector('p');

        messageElement.textContent = message;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

};

const controller = {
    addNote(title, content, color) {
        model.addNote(title, content, color);
    },

    toggleFavorite(id) {
        model.toggleFavorite(id);
    },

    deleteNote(id) {
        model.deleteNote(id);
    },

    toggleShowOnlyFavorite() {
        model.toggleShowOnlyFavorite();
    }
};

function init() {
    view.init()
}

init()